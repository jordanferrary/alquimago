import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareModelConversation,askLanguageModel} from '../src/llm.mjs';
test('unknown questions are offered to a mentor without exposing source code',()=>{
 const input=prepareModelConversation('Como funciona o bake?', [], {title:'Exemplo'}, [{
  file:'src/app.mjs',imports:['./lib.mjs'],exports:['render'],description:'módulo público',
  bytes:250,excerpt:'NÃO ENVIAR CÓDIGO'
 }]);
 assert.equal(input.mode,'mentor');
 assert.equal(input.task,'explain_unknown_question_for_local_familiar');
 assert.equal(JSON.stringify(input).includes('NÃO ENVIAR CÓDIGO'),false);
});
test('structured mentor explanation is preferred over legacy reply',async()=>{
 const result=await askLanguageModel({
  endpoint:'https://example.test/api/assistant',prompt:'O que é um blend shape?',
  fetcher:async()=>({ok:true,json:async()=>({
   lesson:{explanation:'É uma técnica de deformação de malha.'},reply:'Resposta direta antiga'
  })})
 });
 assert.match(result.reply,/deformação/);
 assert.equal(result.engine,'mentor');
});
