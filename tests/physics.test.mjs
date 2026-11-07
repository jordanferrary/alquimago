import test from 'node:test';
import assert from 'node:assert/strict';
import {createOrb,stepOrb,tossOrb} from '../src/physics.mjs';
test('orb bounces but never escapes bounded play area',()=>{
 let b=createOrb({x:75,y:30,vx:9,vy:-9});
 for(let i=0;i<800;i++){
  b=stepOrb(b,160,105);
  assert.ok(b.x>=b.radius&&b.x<=160-b.radius);
  assert.ok(b.y>=b.radius&&b.y<=105-b.radius);
 }
 assert.ok(b.contacts>0);
});
test('tossing resumes sleeping orb without unbounded speeds',()=>{
 const o=tossOrb({...createOrb(),sleeping:true},1000,-1000);
 assert.equal(o.vx,11);assert.equal(o.vy,-13);assert.equal(o.sleeping,false);
});
