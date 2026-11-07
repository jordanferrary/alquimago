import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeKnowledge,answerFromKnowledge,loadKnowledge} from '../src/knowledge.mjs';
const fixture={revision:'test',projects:[
 {id:'abc123',title:'Room of the Palhacito',category:'Environment 3D',year:'2026',tools:['Blender','Krita'],description:'A small world',featured:true},
 {id:'abc456',title:'Bruxa 3D',category:'Personagem',year:'2025',tools:[],description:''},
 {id:'abc789',title:'Frankie',category:'Props',year:'2026',tools:['ZBrush']}
]};
test('answers based on exact public data, not fantasy',()=>{
 const knowledge=normalizeKnowledge(fixture);
 assert.match(answerFromKnowledge('quais projetos você conhece?',{knowledge}).reply,/3 projetos/);
 assert.match(answerFromKnowledge('quais ferramentas usou na Room of the Palhacito?',{knowledge}).reply,/Blender/);
 const miss=answerFromKnowledge('quais ferramentas usou na Bruxa 3D?',{knowledge});
 assert.match(miss.reply,/não foram informadas/);
 assert.equal(answerFromKnowledge('me fala sobre uma escultura inexistente',{knowledge}),null);
});
test('follows project context and gives honest critique',()=>{
 const knowledge=normalizeKnowledge(fixture);
 const first=answerFromKnowledge('me fala da Bruxa 3D',{knowledge});
 const next=answerFromKnowledge('o que acha dela?',{knowledge,lastProjectId:first.projectId});
 assert.equal(next.intent,'project-advice');
 assert.match(next.reply,/não em reconhecer/);
});
test('rejects cross-origin knowledge file and caps data',async()=>{
 await assert.rejects(loadKnowledge('https://evil.example/data.json',{pageUrl:'https://good.example/site/'}));
 const loaded=await loadKnowledge('./knowledge.json',{
  pageUrl:'https://good.example/site/',
  fetcher:async()=>({ok:true,headers:{get:()=>null},text:async()=>JSON.stringify(fixture)})
 });
 assert.equal(loaded.projects.length,3);
});
