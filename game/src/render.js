import {SIZE,COLORS,distance} from './config.js';
import {missionTarget} from './missions.js';
const canvas=document.querySelector('#city'),ctx=canvas.getContext('2d');
const map=document.querySelector('#map').getContext('2d');
function rectangle(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h);}
function text(t,x,y,size,color='#d3dfcf'){ctx.fillStyle=color;ctx.font=`${size}px Arial`;ctx.fillText(t,x,y);}
function palm(t){ctx.save();ctx.translate(t.x,t.y);ctx.strokeStyle='#283c34';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(5,10);ctx.lineTo(0,-7);ctx.stroke();for(let j=0;j<7;j++){ctx.rotate(Math.PI*2/7);ctx.fillStyle=j%2?'#3b6a53':'#477f5a';ctx.beginPath();ctx.ellipse(0,-13,5,19,.4,0,7);ctx.fill();}ctx.restore();}
function car(c,police=false){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.a);rectangle(-29,-12,60,31,'#091b2480');rectangle(-26,-14,52,28,police?'#e2e8d9':c.color);rectangle(-10,-12,22,24,police?'#243c4b':'#31505a');rectangle(12,-10,6,20,'#98c3be');rectangle(-17,-10,6,20,'#68918f');rectangle(-21,-17,10,4,'#14242a');rectangle(12,-17,10,4,'#14242a');rectangle(-21,13,10,4,'#14242a');rectangle(12,13,10,4,'#14242a');rectangle(24,-11,3,6,'#ffedbc');rectangle(24,5,3,6,'#ffedbc');rectangle(-27,-11,3,5,'#d96c57');rectangle(-27,6,3,5,'#d96c57');if(police){rectangle(-1,-11,6,10,'#fe635d');rectangle(-1,1,6,10,'#70bafc');}ctx.restore();}
function person(p,enemy=false){ctx.fillStyle='#081e2880';ctx.beginPath();ctx.ellipse(p.x+4,p.y+5,9,6,0,0,7);ctx.fill();ctx.fillStyle=enemy?'#d96d61':p.color||'#e3ce9a';ctx.beginPath();ctx.arc(p.x,p.y,6,0,7);ctx.fill();ctx.fillStyle='#f6d2a2';ctx.beginPath();ctx.arc(p.x,p.y-2,3,0,7);ctx.fill();}
export function render(s){
  const w=innerWidth,h=innerHeight;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  const scale=s.shot==='start'?.86:1;
  const cx=s.shot==='start'?1000:s.player.x,cy=s.shot==='start'?940:s.player.y;
  ctx.setTransform(1,0,0,1,0,0);rectangle(0,0,w,h,COLORS.water);
  ctx.save();ctx.translate(w*.53,h*.53);ctx.scale(scale,scale);ctx.translate(-cx,-cy);
  rectangle(-170,-170,SIZE+340,SIZE+340,'#baae7d');rectangle(-70,-70,SIZE+140,SIZE+140,'#5d7b6a');
  for(let y=-400;y<3400;y+=28){ctx.strokeStyle='#72a4a31c';ctx.beginPath();ctx.moveTo(-1500,y);ctx.lineTo(-190,y+20);ctx.stroke();}
  for(let i=0;i<=6;i++){
    rectangle(i*500-55,0,110,SIZE,COLORS.road);rectangle(0,i*500-55,SIZE,110,COLORS.road);
    rectangle(i*500-63,65,6,SIZE-130,'#a7ad94');rectangle(65,i*500-63,SIZE-130,6,'#a7ad94');
    ctx.strokeStyle='#b6b28a';ctx.lineWidth=2;ctx.setLineDash([22,24]);ctx.beginPath();ctx.moveTo(i*500,0);ctx.lineTo(i*500,SIZE);ctx.moveTo(0,i*500);ctx.lineTo(SIZE,i*500);ctx.stroke();ctx.setLineDash([]);
    for(let j=0;j<=6;j++){for(let k=0;k<6;k++){rectangle(i*500-43+k*15,j*500+58,8,22,'#c0c4a488');rectangle(i*500+58,j*500-43+k*15,22,8,'#c0c4a488');}}
  }
  const tones=['#b29279','#7c9595','#a9ac96','#bfad8b'];
  for(const b of s.world.buildings){
    rectangle(b.x+12,b.y+15,b.w,b.h,'#102b304b');rectangle(b.x-3,b.y-3,b.w+6,b.h+6,'#43575a');rectangle(b.x,b.y,b.w,b.h,tones[b.tone]);rectangle(b.x+8,b.y+8,b.w-16,b.h-16,'#152d3025');
    rectangle(b.x+15,b.y+15,b.w-30,4,'#e3d2af80');rectangle(b.x+b.w-30,b.y+22,16,24,'#586f71');rectangle(b.x+b.w-28,b.y+24,12,4,'#9fafa4');
    for(let i=12;i<b.w-10;i+=22){rectangle(b.x+i,b.y+b.h-7,10,5,s.night?'#ffe4a0':'#49646b');rectangle(b.x-1,b.y+i,4,9,s.night?'#f6c77e':'#41616b');}
    if(b.roof>.6){rectangle(b.x+24,b.y+30,52,40,'#698e91');for(let i=0;i<4;i++)rectangle(b.x+27+i*12,b.y+33,2,34,'#a3c2b2');}
  }
  for(const t of s.world.trees)palm(t);
  ctx.save();ctx.globalAlpha=.45;text('S A L T   Q U A Y',690,820,22);text('G L A S S   M I L E',2150,840,22);text('I R O N   H A R B O R',2110,2240,20);text('B E A C O N   P O I N T',180,2780,20);ctx.restore();
  for(const c of s.world.cars)car(c);
  for(const p of s.world.people)person(p);
  for(const e of s.world.enemies)if(e.hp>0)person(e,true);
  for(const p of s.police)car(p,true);
  if(!s.car){person({...s.player,color:'#f6ca76'});ctx.strokeStyle='#f7dfaa';ctx.beginPath();ctx.arc(s.player.x,s.player.y,13,0,7);ctx.stroke();}
  const m=missionTarget(s);if(s.chapter<4){ctx.strokeStyle='#ffcc77';ctx.lineWidth=3;ctx.beginPath();ctx.arc(m.x,m.y,44+Math.sin(s.time*3)*4,0,7);ctx.stroke();ctx.fillStyle='#ffce7122';ctx.fill();text('◆',m.x-9,m.y+7,24,'#ffda8e');text('OBJECTIVE',m.x-38,m.y-58,12,'#ffdf9b');}
  for(const b of s.bullets){ctx.strokeStyle='#ffe0a0';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-Math.cos(b.a)*18,b.y-Math.sin(b.a)*18);ctx.stroke();}
  if(s.flash>0){ctx.strokeStyle='#ffbb66';ctx.lineWidth=5;ctx.beginPath();ctx.arc(s.player.x,s.player.y,30,0,7);ctx.stroke();}
  if(s.night){rectangle(-100,-100,3200,3200,'#041b3855');ctx.globalCompositeOperation='screen';for(const c of [...s.police,...s.world.cars]){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.a);const g=ctx.createLinearGradient(20,0,160,0);g.addColorStop(0,'#ffe2a144');g.addColorStop(1,'#ffe2a100');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(20,-10);ctx.lineTo(160,-50);ctx.lineTo(160,50);ctx.lineTo(20,10);ctx.fill();ctx.restore();}ctx.globalCompositeOperation='source-over';}
  ctx.restore();
  if(s.rain){rectangle(0,0,w,h,'#062b3c44');ctx.strokeStyle='#c1dbe344';ctx.lineWidth=1;for(let i=0;i<200;i++){const x=(i*137+s.time*220)%w,y=(i*71+s.time*500)%h;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-12,y+26);ctx.stroke();}}
  const vignette=ctx.createRadialGradient(w/2,h/2,h*.2,w/2,h/2,w*.7);vignette.addColorStop(0,'#00132000');vignette.addColorStop(1,'#00132099');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
  drawMap(s);updateHud(s);
}
function drawMap(s){
  map.fillStyle='#183e47';map.fillRect(0,0,180,150);const k=.047;map.fillStyle='#597b6b';map.fillRect(15,5,141,141);map.strokeStyle='#203c43';map.lineWidth=5;for(let i=0;i<=6;i++){map.beginPath();map.moveTo(15+i*500*k,5);map.lineTo(15+i*500*k,146);map.moveTo(15,5+i*500*k);map.lineTo(156,5+i*500*k);map.stroke();}
  const point=(p,color,r)=>{map.fillStyle=color;map.beginPath();map.arc(15+p.x*k,5+p.y*k,r,0,7);map.fill();};point(missionTarget(s),'#ffd17b',4);s.police.forEach(p=>point(p,'#f16b65',2));point(s.player,'#fff6d6',4);
  const beacon=missionTarget(s);map.beginPath();map.arc(15+beacon.x*k,5+beacon.y*k,8,0,Math.PI*2);
  map.strokeStyle='#071b26';map.lineWidth=5;map.stroke();
  map.strokeStyle='#ffe5a6';map.lineWidth=2;map.stroke();
}
function updateHud(s){
  document.querySelector('#stars').textContent='★'.repeat(s.wanted)+'☆'.repeat(5-s.wanted);
  document.querySelector('#vitals').textContent=`$ ${s.money.toLocaleString()}   /   ♥ ${Math.ceil(s.player.hp)}   /   ${s.gun?'PISTOL ∞':'PUGIL'}`;
  document.querySelector('#clock').textContent=`${s.night?'23:48':'06:24'}  /  ${s.rain?'BADAI PESISIR':s.night?'AFTER HOURS':'GOLDEN COAST'}`;
  const m=missionTarget(s);document.querySelector('#mission').innerHTML=s.chapter>=4?'<small>EPILOG / AURELIA BEBAS</small><h3>Suara kota, kembali.</h3><p>Bukti sudah disiarkan. Jelajahi Aurelia sesukamu.</p>':`<small>${m.district}</small><h3>${m.name}</h3><p>${m.goal}</p><p style="margin-top:10px;color:#f2d6aa">${m.text}</p>`;
  const toast=document.querySelector('#toast');
  const meters=Math.round(distance(s.player,m));
  const nearby=s.world.cars.some(c=>distance(c,s.player)<85);
  toast.textContent=s.noticeTime>0?s.notice:s.car?`◆ ${meters} m / DI DALAM MOBIL / E keluar`:nearby?`◆ ${meters} m / E ambil kendaraan`:`◆ ${meters} m / RIN KESTREL`;
}
