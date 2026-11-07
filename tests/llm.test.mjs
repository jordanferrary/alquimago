import test from 'node:test';
import assert from 'node:assert/strict';
import {validateModelEndpoint,prepareModelConversation,askLanguageModel} from '../src/llm.mjs';
test('blocks insecure and arbitrary inference endpoints',()=>{
 assert.equal(validateModelEndpoint('http://evil.test/api/assistant'),null);
 assert.equal(validateModelEndpoint('https://site.test/api/other'),null);
 assert.equal(validateModelEndpoint('https://site.test/api/assistant?token=abc'),null);
 assert.equal(validateModelEndpoint('/api/assistant',{pageUrl:'https://site.test/app/'}),'https://site.test/api/assistant');
});
test('sends explicit bounded context with credentials only to configured server',async()=>{
 let called=false;
 const output=await askLanguageModel({
  endpoint:'https://auth.site.test/api/assistant',prompt:'Explique a modelagem',
  history:[{role:'user',text:'oi'},{role:'familiar',text:'Olá'}],
  project:{title:'Projeto Teste',tools:['Blender']},
  fetcher:async (url,options)=>{
   called=true;
   assert.equal(url,'https://auth.site.test/api/assistant');
   assert.equal(options.credentials,'include');
   const body=JSON.parse(options.body);
   assert.equal(body.locale,'pt-BR');
   assert.equal(body.project.title,'Projeto Teste');
   assert.equal(body.history[1].role,'assistant');
   return {ok:true,json:async()=>({reply:'A malha deve ter uma boa silhueta.',model:'LLM'})};
  }
 });
 assert.equal(called,true);
 assert.match(output.reply,/silhueta/);
});
test('fails clearly without server or authorization',async()=>{
 await assert.rejects(askLanguageModel({endpoint:'',prompt:'oi'}));
 await assert.rejects(askLanguageModel({endpoint:'https://site.test/api/assistant',prompt:'oi',fetcher:async()=>({ok:false,status:401})}),/conectar/);
});
