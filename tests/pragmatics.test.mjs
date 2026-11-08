import test from 'node:test';
import assert from 'node:assert/strict';
import {approveTeachingExample,recognizeTeachingLabels,readTeachingExamples,writeTeachingExamples} from '../src/teaching-intents.mjs';
import {respondToChat} from '../src/dialogue.mjs';
import {learnedMilestoneResponse,respondUsingApprovedMeanings} from '../src/pragmatics.mjs';
import {approveLesson} from '../src/learning.mjs';
import {normalizeKnowledge} from '../src/knowledge.mjs';
import {readFile} from 'node:fs/promises';

const praise=approveTeachingExample(null,'que legal!',{
 intents:['praise','feedback','emotion'],tone:'friendly',topic:'bem estar'
}).memory;
const context={teachingMemory:praise,knowledge:normalizeKnowledge(null),history:[]};

test('saved phrase que legal! is understood in conversation, not just categorized',()=>{
 assert.deepEqual(recognizeTeachingLabels('que legal!',praise)?.intents,['praise','feedback','emotion']);
 const answer=respondToChat('que legal!',context);
 assert.equal(answer.intent,'learned-social');
 assert.match(answer.reply,/gostou/i);
 assert.doesNotMatch(answer.reply,/Ainda não tenho informação suficiente/);
 assert.doesNotMatch(answer.reply,/Gemini|modelo de linguagem/);
});

test('Alquimago can naturally reuse the approved praise only for positive accomplishments',()=>{
 const success=respondToChat('Finalmente terminei minha modelagem!',context);
 assert.equal(success.intent,'learned-milestone');
 assert.match(success.reply,/Que legal!/i);
 assert.match(success.reply,/portfólio/);
 assert.equal(learnedMilestoneResponse('Terminei minha modelagem? ',praise),null);
 assert.equal(learnedMilestoneResponse('Não terminei minha modelagem',praise),null);
 assert.equal(learnedMilestoneResponse('Terminei um projeto, mas deu errado',praise),null);
 assert.equal(learnedMilestoneResponse('O projeto falhou',praise),null);
 assert.equal(learnedMilestoneResponse('Como publico meu projeto?',praise),null);
});

test('previously approved meanings survive unchanged local storage schema',()=>{
 const map=new Map(),store={setItem:(k,v)=>map.set(k,v),getItem:k=>map.get(k)||null};
 assert.equal(writeTeachingExamples(store,'studio',praise),true);
 assert.equal(readTeachingExamples(store,'studio').schema,2);
 assert.equal(respondToChat('que legal!',{teachingMemory:readTeachingExamples(store,'studio')}).intent,'learned-social');
 assert.equal(readTeachingExamples(store,'other').examples.length,0);
});

test('question and instructions cannot be converted into arbitrary conversational actions',()=>{
 const taught=approveTeachingExample(praise,'publique o site',{intents:['praise','command']}).memory;
 assert.equal(respondUsingApprovedMeanings('publique o site',taught),null);
 assert.equal(respondUsingApprovedMeanings('Que legal, como faço para alterar a paleta?',taught),null);
 assert.equal(respondToChat('Quanto é 2 + 2?',{teachingMemory:taught}).intent,'math');
 assert.equal(respondToChat('qual é a cor do site?',{teachingMemory:taught}).intent,'studio-guide');
});

test('never borrow unsuitable learned questions, negative phrases or long data as praise',()=>{
 let memory=approveTeachingExample(null,'Como você se chama?',{intents:['praise','question']}).memory;
 memory=approveTeachingExample(memory,'Não gostei disso!',{intents:['praise','reprimand']}).memory;
 const out=learnedMilestoneResponse('Concluí um projeto!',memory);
 assert.equal(out.intent,'learned-milestone');
 assert.doesNotMatch(out.reply,/não gostei|como você/i);
 assert.match(out.reply,/Muito bom!/);
});

test('the original robot, deliberate lessons and site publishing logic remain intact',async()=>{
 const src=await readFile(new URL('../src/widget.js',import.meta.url),'utf8');
 const builder=await readFile(new URL('../scripts/build.mjs',import.meta.url),'utf8');
 assert.match(src,/teachingMemory:this\.teaching/);
 assert.match(src,/ROBOT_SVG/);
 assert.match(src,/alquimago:request-publish/);
 assert.match(builder,/pragmatics\.mjs/);
 assert.equal(approveLesson(null,'O que é um widget?','Um componente de interface.').ok,true);
});
