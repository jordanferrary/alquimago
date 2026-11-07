import test from 'node:test';
import assert from 'node:assert/strict';
import {CORTEX_CELLS,CORTEX_SYNAPSES,CORTEX_SENSORS,CORTEX_MOTORS,
 createCortex,cleanCortex,createCortexRuntime,pulseCortex,behaviorSense,
 tickCortex,rewardCortex,planCortexAlternatives,cortexSummary,
 readCortex,writeCortex} from '../src/behavior.mjs';

const ctx={route:'gallery',issues:4,enabled:true,hidden:false,cooldownMs:90000,dailyLimit:4};
test('cortex runs 512 LIF neurons, 16384 sparse synapses, 32 sensors and 16 motor cells',()=>{
 const engine=createCortexRuntime(createCortex(99));
 assert.equal(engine.voltage.length,CORTEX_CELLS);
 assert.equal(engine.pre.length,CORTEX_SYNAPSES);
 assert.equal(engine.post.length,CORTEX_SYNAPSES);
 const signals=behaviorSense(ctx);
 assert.equal(signals.length,CORTEX_SENSORS);
 assert.equal(pulseCortex(engine,signals).length,CORTEX_MOTORS);
 assert.equal(cortexSummary(engine.state).synapses,16384);
});
test('action selection is autonomous but respects cooldown, window visibility and daily quota',()=>{
 const engine=createCortexRuntime(createCortex(77));
 const first=tickCortex(engine,ctx,90000);
 assert.equal(first.action,'dica');
 assert.equal(tickCortex(engine,ctx,90001).action,null);
 assert.equal(tickCortex(engine,{...ctx,hidden:true},210000).action,null);
 assert.equal(tickCortex(engine,{...ctx,userBusy:true},210000).action,null);
 assert.equal(tickCortex(engine,{...ctx,panelOpen:true},210000).action,null);
 assert.equal(tickCortex(engine,{...ctx,enabled:false},210000).action,null);
 assert.equal(tickCortex(engine,{...ctx,quiet:true},210000).action,null);
 const next=tickCortex(engine,{...ctx,dailyLimit:1},210000);
 assert.equal(next.action,null);
});
test('reward is conditioned by context, safe, learned and survives serialization',()=>{
 const engine=createCortexRuntime(createCortex(21));
 const old=planCortexAlternatives(engine.state,{route:'gallery',issues:4}).find(x=>x.action==='dica').score;
 rewardCortex(engine,'dica','gallery',1,130000);
 const score=planCortexAlternatives(engine.state,{route:'gallery',issues:4}).find(x=>x.action==='dica').score;
 assert.ok(score>old);
 assert.equal(engine.state.episodes.length,1);
 const safe=cleanCortex(JSON.parse(JSON.stringify(engine.state)));
 assert.equal(safe.episodes[0].action,'dica');
 assert.equal(safe.contextWeights.gallery[2],engine.state.contextWeights.gallery[2]);
});
test('privacy: malformed memory never creates new actions or unbounded events',()=>{
 const state=cleanCortex({
  rewardBias:[Infinity,1000],episodes:[{action:'read-secrets',context:'desktop',reward:1,at:1}],
  synapses:{'100000':3,'4':999},contextWeights:{__proto__:[],gallery:Array(16).fill(Infinity)}
 });
 assert.ok(state.rewardBias.every(Number.isFinite));
 assert.deepEqual(state.episodes,[]);
 assert.equal(state.synapses[4],.45);
 assert.equal(state.synapses['100000'],undefined);
});
test('persistent state survives reload with namespace isolation and no raw text',()=>{
 const map=new Map(),db={getItem:key=>map.get(key)||null,setItem:(key,text)=>map.set(key,text)};
 const state=createCortex(8);
 state.rewardBias[2]=2;state.episodes.push({action:'dica',context:'gallery',reward:1,at:90});
 assert.equal(writeCortex(db,'site1',state),true);
 assert.equal(readCortex(db,'site1').rewardBias[2],2);
 assert.equal(readCortex(db,'site2'),null);
 assert.doesNotMatch([...map.values()][0],/nome de projeto|mensagem privada/);
});
