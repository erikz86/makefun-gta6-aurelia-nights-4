export function createInput(){
  const keys=new Set(),pressed=new Set();
  addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();const k=e.key.toLowerCase();if(!keys.has(k))pressed.add(k);keys.add(k);});
  addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
  addEventListener('blur',()=>keys.clear());
  return {keys,down:(...k)=>k.some(x=>keys.has(x)),hit:(...k)=>k.some(x=>pressed.has(x)),clear:()=>pressed.clear()};
}
