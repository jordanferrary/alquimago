import test from 'node:test';
import assert from 'node:assert/strict';
import {
 approveTeachingExample,recognizeTeachingLabels,normalizeTeachingMemory,
 readTeachingExamples,writeTeachingExamples
} from '../src/teaching-intents.mjs';
test('recognizes independent meaning, subject and emotion with shorthand',()=>{
 const a=approveTeachingExample(null,'Vc errou e eu quero uma explicação', {
  intents:['reprimand','question'],tone:'frustrated',topic:'conversa'
 });
 assert.equal(a.ok,true);
 const next=recognizeTeachingLabels('Você errou e eu quero uma explicação',a.memory);
 assert.deepEqual(next?.intents,['reprimand','question']);
 assert.equal(next?.tone,'frustrated');
 assert.equal(next?.topic,'conversa');
});
test('reviewed multi-label examples survive local persistence and remain namespace isolated',()=>{
 const data=new Map();
 const storage={setItem:(k,v)=>data.set(k,v),getItem:k=>data.get(k)??null};
 const example=approveTeachingExample(null,'Isso foi muito bom', {intents:['praise','feedback']});
 assert.equal(writeTeachingExamples(storage,'studio',example.memory),true);
 assert.equal(readTeachingExamples(storage,'studio').examples.length,1);
 assert.equal(readTeachingExamples(storage,'other').examples.length,0);
});
test('unapproved examples and private material cannot become training',()=>{
 const memory=normalizeTeachingMemory({examples:[{
  text:'Uma fala',intents:['question'],tone:'neutral',approved:false
 }]});
 assert.equal(memory.examples.length,0);
 assert.equal(approveTeachingExample(null,'Minha senha: abc', {intents:['teaching']}).ok,false);
});
test('unrelated message must not trigger trained intent',()=>{
 const memory=approveTeachingExample(null,'Vc errou e eu quero uma explicação', {intents:['reprimand','question']}).memory;
 assert.equal(recognizeTeachingLabels('Gosto de criar modelos tridimensionais',memory),null);
});
