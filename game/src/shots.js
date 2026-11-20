export function stageShot(s,name){
  if(!name)return;s.shot=name;s.time=20;s.started=name!=='start';
  const scenes={start:[900,850,0,0],heist:[1500,1020,3,1],empire:[2000,2000,1,2],storm:[1000,2500,5,3]};
  const [x,y,wanted,chapter]=scenes[name]||scenes.start;
  Object.assign(s.player,{x,y});s.wanted=wanted;s.chapter=chapter;s.money=name==='empire'?12750:2450;
  s.night=name==='empire'||name==='storm';s.rain=name==='storm';
  if(name!=='start'){s.car=s.world.cars[0];Object.assign(s.car,{x,y,a:-.35,color:'#f5bb63',velocity:170});for(let i=0;i<wanted;i++)s.police.push({x:x-120-i*70,y:y+60+(i%2)*90,a:-.3});}
}
