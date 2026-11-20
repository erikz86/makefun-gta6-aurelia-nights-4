export const SIZE=3000, STEP=500, ROAD=110;
export const COLORS={water:'#143b49',land:'#59776b',road:'#263940',stripe:'#718080',gold:'#ffd18c'};
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
