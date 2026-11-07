/**
 * Small self-contained physics toy in a bounded Shadow DOM playfield.
 * No interaction with OS windows or user files.
 */
const pClamp=(n,min,max)=>Math.max(min,Math.min(max,Number.isFinite(n)?n:min));
export function createOrb({x=75,y=24,vx=2.3,vy=-1.5,radius=11}={}){
 return {x,y,vx,vy,radius:pClamp(radius,6,24),sleeping:false,contacts:0};
}
export function stepOrb(state,width=165,height=112,elapsed=1){
 const o={...state},r=pClamp(o.radius,6,24);
 const w=Math.max(r*2+2,width),h=Math.max(r*2+2,height);
 const dt=pClamp(elapsed,0,3);
 if(o.sleeping)return o;
 o.vy=pClamp(o.vy+.29*dt,-14,14);
 o.x+=o.vx*dt;
 o.y+=o.vy*dt;
 o.vx*=Math.pow(.995,dt);
 if(o.x<r){o.x=r;o.vx=Math.abs(o.vx)*.78;o.contacts++;}
 if(o.x>w-r){o.x=w-r;o.vx=-Math.abs(o.vx)*.78;o.contacts++;}
 if(o.y<r){o.y=r;o.vy=Math.abs(o.vy)*.74;o.contacts++;}
 if(o.y>h-r){
  o.y=h-r;
  o.vy=-Math.abs(o.vy)*.75;
  o.vx*=.985;
  o.contacts++;
  if(Math.abs(o.vy)<.38&&Math.abs(o.vx)<.14){o.vy=0;o.vx=0;o.sleeping=true;}
 }
 return o;
}
export function tossOrb(state,x=3,y=-7){
 const o={...state};
 o.vx=pClamp(x,-11,11);o.vy=pClamp(y,-13,9);
 o.sleeping=false;
 return o;
}
