import {clamp,distance} from './config.js';
import {seededRandom} from './random.js';
import {createInput} from './input.js';
import {createWorld,moveBody,updateWorld} from './world.js';
import {createAudio} from './audio.js';
import {updateMissions} from './missions.js';
import {crime,updatePolice} from './police.js';
import {render} from './render.js';
import {stageShot} from './shots.js';
const params=new URLSearchParams(location.search),input=createInput();
const s={world:createWorld(seededRandom(Number(params.get('seed'))||71)),player:{x:500,y:580,a:0,hp:100},car:null,police:[],bullets:[],wanted:0,heat:0,spawn:0,money:150,chapter:0,kills:0,time:0,cool:0,flash:0,notice:'',noticeTime:0,night:false,rain:false,gun:false,started:false,paused:false,audio:createAudio()};
const overlay=document.querySelector('#overlay');
s.save=()=>{try{localStorage.setItem('aurelia-nights-iv',JSON.stringify({player:s.player,money:s.money,chapter:s.chapter,kills:s.kills,gun:s.gun}));s.notice='Tersimpan / Aurelia mengingatmu';s.noticeTime=3;}catch{s.notice='Penyimpanan browser tidak tersedia';s.noticeTime=3;}};
function begin(load=false){if(load){try{const data=JSON.parse(localStorage.getItem('aurelia-nights-iv'));if(data)Object.assign(s,data);}catch{}}s.started=true;s.paused=false;overlay.classList.add('hidden');s.audio.start();}
document.querySelector('#start').onclick=()=>begin();document.querySelector('#load').onclick=()=>begin(true);
stageShot(s,params.get('shot'));if(s.started)overlay.classList.add('hidden');
function action(){
  if(input.hit('e')){
    if(s.car){const c=s.car;s.car=null;s.player.x=c.x-Math.sin(c.a)*45;s.player.y=c.y+Math.cos(c.a)*45;c.parked=true;c.velocity=0;}
    else {const c=s.world.cars.find(c=>distance(c,s.player)<85);if(c){s.car=c;c.velocity=0;c.parked=true;crime(s);s.notice='Kendaraan diambil / polisi menerima laporan';s.noticeTime=3;s.audio.tone(230,.2,'square');}}
  }
  if(input.hit('q'))s.gun=!s.gun;
  if(input.down('f',' ')&&s.cool<=0){s.cool=s.gun?.24:.45;s.flash=.12;s.audio.tone(s.gun?90:170,.12,'sawtooth');if(s.gun){s.bullets.push({x:s.player.x,y:s.player.y,a:s.player.a,life:.85});crime(s,.25);}else{for(const e of s.world.enemies)if(e.hp>0&&distance(e,s.player)<65)damageEnemy(e,35);}}
}
function damageEnemy(e,n){e.hp-=n;if(e.hp<=0){s.kills++;s.money+=80;s.audio.tone(880,.12);}}
function update(dt){
  s.time+=dt;s.cool-=dt;s.flash-=dt;s.noticeTime-=dt;
  const p=s.player;
  if(s.car){const c=s.car;const accel=(input.down('w','arrowup')?1:0)-(input.down('s','arrowdown')?1:0);c.velocity=clamp((c.velocity||0)+accel*230*dt,-130,390);c.velocity*=Math.pow(input.down(' ')? .09:.65,dt);const steer=(input.down('d','arrowright')?1:0)-(input.down('a','arrowleft')?1:0);c.a+=steer*dt*2.3*clamp(c.velocity/100,-1,1);if(moveBody(s.world,c,Math.cos(c.a)*c.velocity*dt,Math.sin(c.a)*c.velocity*dt,22)){p.hp-=Math.abs(c.velocity)*.025;c.velocity*=-.3;s.audio.tone(60,.16,'square');}for(const o of s.world.cars)if(o!==c&&distance(c,o)<43&&Math.abs(c.velocity)>100){c.velocity*=-.4;p.hp-=5;crime(s,.3);}p.x=c.x;p.y=c.y;p.a=c.a;
  }else{let x=(input.down('d','arrowright')?1:0)-(input.down('a','arrowleft')?1:0),y=(input.down('s','arrowdown')?1:0)-(input.down('w','arrowup')?1:0);if(x||y){p.a=Math.atan2(y,x);const d=Math.hypot(x,y);moveBody(s.world,p,x/d*155*dt,y/d*155*dt);}}
  updateMissions(s,input,dt);action();updateWorld(s,dt);updatePolice(s,dt);
  for(const e of s.world.enemies){if(e.hp<=0)continue;e.cool-=dt;const d=distance(e,p);if(d<300){const a=Math.atan2(p.y-e.y,p.x-e.x);if(d>30)moveBody(s.world,e,Math.cos(a)*65*dt,Math.sin(a)*65*dt);if(d<42&&e.cool<0){p.hp-=8;e.cool=.7;}}if(s.car&&d<40&&Math.abs(s.car.velocity)>90)damageEnemy(e,100);}
  for(const b of s.bullets){b.x+=Math.cos(b.a)*700*dt;b.y+=Math.sin(b.a)*700*dt;b.life-=dt;for(const e of s.world.enemies)if(e.hp>0&&distance(e,b)<20){damageEnemy(e,35);b.life=0;}}
  s.bullets=s.bullets.filter(b=>b.life>0);s.wanted=Math.round(clamp(s.wanted,0,5));
  if(p.hp<=0){Object.assign(p,{x:500,y:580,hp:100});s.car=null;s.wanted=0;s.police=[];s.money=Math.max(0,s.money-150);s.notice='DITANGKAP / Klinik Salt Quay • biaya $150';s.noticeTime=6;}
  if(s.wanted===0)p.hp=Math.min(100,p.hp+dt*1.5);
  s.night=s.time%240>120;s.rain=s.time%300>230;s.audio.update(s,dt);
}
let last=performance.now();
function frame(now){const dt=Math.min(.033,(now-last)/1000);last=now;if(input.hit('escape')&&s.started&&!s.shot){s.paused=!s.paused;overlay.classList.toggle('hidden',!s.paused);document.querySelector('#start').textContent='LANJUTKAN ↗';}if(input.hit('m'))s.audio.muted=!s.audio.muted;if(input.hit('k'))s.save();if(s.started&&!s.paused&&!s.shot)update(dt);render(s);input.clear();requestAnimationFrame(frame);}
requestAnimationFrame(frame);
window.aurelia={state:s,begin};
