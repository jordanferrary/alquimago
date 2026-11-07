import test from 'node:test';
import assert from 'node:assert/strict';
import {freshStroke,updateHeadStroke} from '../src/gestures.mjs';
test('caress works on alternating unpressed motion over the head',()=>{
 let state=freshStroke(),hits=0;
 for(const [index,x] of [12,70,11,72,13].entries()){
  const result=updateHeadStroke(state,{x,head:true,pressed:false,time:1000+index*100});
  state=result.state;if(result.triggered)hits++;
 }
 assert.equal(hits,1);
});
test('clicking and random tiny movements do not count as caress',()=>{
 let state=freshStroke(),hits=0;
 for(const [index,x] of [18,20,21,19,20,18].entries()){
  const r=updateHeadStroke(state,{x,head:true,pressed:false,time:100+index*100});
  state=r.state;if(r.triggered)hits++;
 }
 assert.equal(hits,0);
 const pressed=updateHeadStroke(state,{x:70,head:true,pressed:true,time:2000});
 assert.equal(pressed.triggered,false);
});
test('cooldown prevents repeated caresses immediately',()=>{
 let state=freshStroke(),hits=0;
 for(let k=0;k<2;k++)for(const [i,x] of [12,72,12,72,12].entries()){
  const r=updateHeadStroke(state,{x,head:true,pressed:false,time:1000+k*800+i*100});
  state=r.state;if(r.triggered)hits++;
 }
 assert.equal(hits,1);
});
