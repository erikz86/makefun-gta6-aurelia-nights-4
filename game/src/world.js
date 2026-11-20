import {SIZE,STEP,clamp} from './config.js';
export function createWorld(rng){
  const buildings=[],trees=[],cars=[],people=[],enemies=[];
  for(let x=0;x<6;x++)for(let y=0;y<6;y++){
    for(let i=0;i<4;i++){
      const bx=x*STEP+125+(i%2)*170,by=y*STEP+125+Math.floor(i/2)*170;
      buildings.push({x:bx,y:by,w:120+rng()*30,h:115+rng()*30,tone:Math.floor(rng()*4),roof:rng()});
    }
    for(let i=0;i<8;i++)trees.push({x:x*STEP+80+rng()*345,y:y*STEP+75+(i%2)*350});
  }
  const palette=['#d8b66f','#7bafb5','#b95657','#dae0cd','#e18b58','#657d98'];
  for(let i=0;i<65;i++){const horizontal=i%2===0,lane=Math.floor(rng()*6)*500+ (i%3?22:-22);cars.push({x:horizontal?rng()*SIZE:lane,y:horizontal?lane:rng()*SIZE,a:horizontal?0:Math.PI/2,speed:65+rng()*55,color:palette[i%palette.length],hp:100});}
  cars.push({x:535,y:575,a:0,speed:0,color:'#f3bc64',hp:100,parked:true});
  for(let i=0;i<100;i++){const horizontal=i%2===0,lane=Math.floor(rng()*6)*500+70;people.push({x:horizontal?rng()*SIZE:lane,y:horizontal?lane:rng()*SIZE,a:horizontal?0:Math.PI/2,color:palette[i%6]});}
  for(let i=0;i<8;i++)enemies.push({x:1960+(i%4)*32,y:2030+Math.floor(i/4)*38,hp:60,cool:0});
  return {buildings,trees,cars,people,enemies};
}
export function blocked(world,x,y,r=12){return x<12||y<12||x>SIZE-12||y>SIZE-12||world.buildings.some(b=>x>b.x-r&&x<b.x+b.w+r&&y>b.y-r&&y<b.y+b.h+r);}
export function moveBody(world,body,dx,dy,r=12){let hit=false;if(!blocked(world,body.x+dx,body.y,r))body.x+=dx;else hit=true;if(!blocked(world,body.x,body.y+dy,r))body.y+=dy;else hit=true;return hit;}
export function updateWorld(s,dt){
  for(const c of s.world.cars){if(c===s.car||c.parked)continue;c.x=(c.x+Math.cos(c.a)*c.speed*dt+SIZE)%SIZE;c.y=(c.y+Math.sin(c.a)*c.speed*dt+SIZE)%SIZE;}
  for(const p of s.world.people){p.x=(p.x+Math.cos(p.a)*23*dt)%SIZE;p.y=(p.y+Math.sin(p.a)*23*dt)%SIZE;}
}
