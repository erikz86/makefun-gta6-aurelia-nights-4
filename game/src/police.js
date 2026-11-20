import {distance} from './config.js';
import {moveBody} from './world.js';
export function crime(s,amount=1){s.wanted=Math.min(5,Math.ceil(s.wanted+amount));s.heat=18;}
export function updatePolice(s,dt){
  const observed=s.police.some(p=>distance(p,s.player)<240);
  s.heat-=dt;
  if(observed&&s.wanted>0)s.heat=Math.max(s.heat,8);
  if(s.heat<0&&s.wanted>0){s.wanted--;s.heat=10;}
  s.spawn-=dt;
  if(s.wanted&&s.spawn<0&&s.police.length<s.wanted+1){s.spawn=3;const a=s.time*2;s.police.push({x:s.player.x+Math.cos(a)*420,y:s.player.y+Math.sin(a)*420,a:0});}
  for(const p of s.police){const d=distance(p,s.player);p.a=Math.atan2(s.player.y-p.y,s.player.x-p.x);moveBody(s.world,p,Math.cos(p.a)*(100+s.wanted*15)*dt,Math.sin(p.a)*(100+s.wanted*15)*dt,15);if(d<55&&s.wanted){s.player.hp-=dt*(s.car?5:15);s.heat=18;} }
  if(!s.wanted)s.police=s.police.filter(p=>distance(p,s.player)<650);
}
