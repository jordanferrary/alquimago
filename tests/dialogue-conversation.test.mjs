import test from 'node:test';
import assert from 'node:assert/strict';
import {respondToChat} from '../src/dialogue.mjs';
import {pendingFromReply} from '../src/conversation.mjs';
import {seedNeuralModel,neuralPredict,serializeNeuralModel,restoreNeuralModel,upgradeNeuralSeed} from '../src/neural.mjs';
test('greeting followed by yes gives actual contextual answer',()=>{
 const first=respondToChat('oi',{name:'Alquimago'});
 assert.equal(first.pending.kind,'page-insight');
 const second=respondToChat('sim',{pending:pendingFromReply(first),
  suggestions:[{title:'Texto de capa',description:'Uma capa deve ter uma legenda.'}]});
 assert.equal(second.intent,'followup');
 assert.match(second.reply,/Texto de capa/);
 assert.equal(second.pending,null);
});
test('brincadeira requires confirmation, refusal has no side effects',()=>{
 const first=respondToChat('vamos brincar');
 assert.equal(first.action,undefined);
 const no=respondToChat('nn',{pending:pendingFromReply(first)});
 assert.equal(no.action,undefined);
 assert.equal(no.intent,'decline');
 const yes=respondToChat('ss',{pending:pendingFromReply(first)});
 assert.equal(yes.action,'play');
});
test('unprompted sim or não cannot trigger arbitrary actions or publish',()=>{
 for(const phrase of ['sim','nn','não','claro']){
  const reply=respondToChat(phrase,{});
  assert.equal(reply.action,undefined);
  assert.equal(reply.intent,'clarify');
 }
});
test('simple maths returns correct answers before neural intent fallback',()=>{
 for(const [message,answer] of [['1 + 1','2'],['quanto é dois mais dois?','4'],['2 x 3','6']]){
  const reply=respondToChat(message,{neuralIntent:'greeting'});
  assert.equal(reply.intent,'math');
  assert.match(reply.reply,new RegExp('resultado é '+answer+'\\\\?'));
 }
});
test('private-looking messages are not used as contextual training',()=>{
 const reply=respondToChat('minha senha é x123', {pending:{kind:'play',at:Date.now()}});
 assert.equal(reply.store,false);
 assert.equal(reply.action,undefined);
});
test('PT-BR neural examples work and legacy model retains explicit corrections',()=>{
 const seed=seedNeuralModel();
 for(const [input,intent] of [['oie','greeting'],['me da um feedback da obra','insight'],['vlw','thanks']]){
  const result=neuralPredict(seed,input);
  assert.equal(result.intent,intent);
  assert.ok(result.confidence>.55);
 }
 const legacy=restoreNeuralModel({...serializeNeuralModel(seed),seedVersion:1});
 const improved=upgradeNeuralSeed(legacy);
 assert.equal(improved.seedVersion,2);
 assert.equal(improved.learned,legacy.learned);
});
