// Recognition of gentle horizontal strokes, without requiring a mouse click.
// Pure and deterministic so browser gestures can be tested without the DOM.
export function freshStroke(){return {lastX:null,legX:null,direction:0,reversals:0,distance:0,lastAt:0,lastTriggeredAt:-Infinity};}
export function updateHeadStroke(previous,point){
 const state={...previous},time=Number(point?.time)||0;
 if(point?.pressed||point?.head!==true||!Number.isFinite(point?.x)){
   return {state:{...freshStroke(),lastTriggeredAt:state.lastTriggeredAt},triggered:false};
 }
 if(time-state.lastAt>1200 || time<state.lastAt){
   state.lastX=null;state.legX=null;state.direction=0;state.reversals=0;state.distance=0;
 }
 const x=point.x;
 if(state.lastX===null){state.lastX=x;state.legX=x;state.lastAt=time;return {state,triggered:false};}
 const dx=x-state.lastX;
 state.lastAt=time;state.lastX=x;
 if(Math.abs(dx)<3)return {state,triggered:false};
 const dir=Math.sign(dx);
 if(state.direction&&dir!==state.direction&&Math.abs(x-state.legX)>=16){
   state.reversals++;
   state.legX=x;
 }else if(!state.direction){state.legX=x;}
 state.distance=Math.min(1000,state.distance+Math.abs(dx));
 state.direction=dir;
 if(state.reversals>=2&&state.distance>=75&&time-state.lastTriggeredAt>=4500){
   state.reversals=0;state.distance=0;state.lastTriggeredAt=time;state.legX=x;
   return {state,triggered:true};
 }
 return {state,triggered:false};
}
