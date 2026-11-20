export function createAudio(){
  let ctx,engine,engineGain,beat=0;const api={muted:false};
  api.start=()=>{if(ctx){ctx.resume();return;}ctx=new AudioContext();engine=ctx.createOscillator();engineGain=ctx.createGain();engine.type='sawtooth';engineGain.gain.value=0;engine.connect(engineGain).connect(ctx.destination);engine.start();};
  api.tone=(frequency,duration=.15,type='sine',volume=.06)=>{if(!ctx||api.muted)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=frequency;g.gain.setValueAtTime(volume,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+duration);};
  api.update=(s,dt)=>{if(!ctx)return;engine.frequency.value=40+Math.abs(s.car?.velocity||0)*.35;engineGain.gain.value=s.car&&!api.muted?.018:0;beat+=dt;if(beat>.38){beat=0;api.tone([110,164.81,146.83,130.81][Math.floor(s.time*.65)%4],.32,'triangle',.025);if(s.wanted)api.tone(s.time%1>.5?680:460,.3,'sine',.025);}};
  return api;
}
