import test from 'node:test';
import assert from 'node:assert/strict';
import {respondToChat} from '../src/dialogue.mjs';
import {normalizeKnowledge} from '../src/knowledge.mjs';

const knowledge=normalizeKnowledge({projects:[{
 id:'alice',title:'Alice',category:'Props',year:'2026',description:''
}]});
const previous=[{role:'user',text:'O que você acha de Alice?'},{role:'familiar',
 text:'Sobre Alice, eu mostraria o processo e detalhes da obra.'}];
const context={knowledge,lastProjectId:'alice',history:previous,name:'Alquimago'};
test('site-wide improvement request does not hallucinate criticism of Alice',()=>{
 const result=respondToChat('Oie, oque vc acha que eu poderia melhorar aqui no site?',context);
 assert.equal(result.intent,'insight');
 assert.doesNotMatch(result.reply,/Alice/);
});
test('contextual acknowledgement about the previous project stays on subject',()=>{
 const result=respondToChat('Justo, eu realmente deixei ela sem muitas informações',context);
 assert.equal(result.intent,'context-followup');
 assert.match(result.reply,/Alice/);
 assert.match(result.reply,/descrição/);
});
test('why question refers explicitly to the last answer',()=>{
 const result=respondToChat('Por que você acha isso?',context);
 assert.equal(result.intent,'context-followup');
 assert.match(result.reply,/sugestão anterior/);
});
test('unrelated question remains independent of previous context',()=>{
 const result=respondToChat('Quanto é 2 + 2?',context);
 assert.equal(result.intent,'math');
 assert.match(result.reply,/4/);
});
