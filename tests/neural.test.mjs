import test from 'node:test';
import assert from 'node:assert/strict';
import {seedNeuralModel,neuralPredict,trainNeural,serializeNeuralModel,restoreNeuralModel} from '../src/neural.mjs';
import {respondToChat} from '../src/dialogue.mjs';
import {normalizeConfig} from '../src/config.mjs';
import {readPublicSnapshot} from '../src/project.mjs';

test('real trainable neural neurons recognize OIE and common greetings',()=>{
 const model=seedNeuralModel();
 for(const sample of ['OIE','oi','oiii','eai','hello']){
  const inference=neuralPredict(model,sample);
  assert.equal(inference.intent,'greeting');
  assert.ok(inference.confidence>.55);
  assert.equal(respondToChat(sample,{neuralIntent:inference.intent}).intent,'greeting');
 }
});

test('unrelated phrases are not trusted merely because softmax is confident',()=>{
 const model=seedNeuralModel();
 assert.ok(neuralPredict(model,'uma frase totalmente aleatoria').confidence<.55);
});

test('user correction trains synapses and supports numerical backup',()=>{
 const model=seedNeuralModel();
 const phrase='mágica de abacaxi';
 for(let i=0;i<40;i++)trainNeural(model,phrase,'brew',.07);
 const restored=restoreNeuralModel(serializeNeuralModel(model));
 assert.ok(restored);
 assert.ok(restored.learned>=40);
 assert.equal(neuralPredict(restored,phrase).intent,'brew');
 assert.equal(restoreNeuralModel({version:1,inputHidden:[1]}),null);
});

test('publish-only policy discards uncommitted browser state and uses public snapshot',async()=>{
 const settings=normalizeConfig({memory:{namespace:'project',mode:'publish',remoteSnapshot:'./alquimago/project-memory.json'}});
 assert.equal(settings.memory.mode,'publish');
 assert.equal(normalizeConfig(null).memory.mode,'local');
 const publicState={schema:2,brain:{xp:123},neural:null};
 const bytes=new TextEncoder().encode(JSON.stringify(publicState));
 const snapshot=await readPublicSnapshot(settings.memory.remoteSnapshot,{
  pageUrl:'https://site.test/portfolio/',
  fetcher:async()=>({ok:true,headers:{get:()=>String(bytes.length)},arrayBuffer:async()=>bytes.buffer})
 });
 assert.equal(snapshot.brain.xp,123);
});
