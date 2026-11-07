import test from 'node:test';
import assert from 'node:assert/strict';
import {yesNoIntent,calculateBasic,answerFollowUp,pendingFromReply} from '../src/conversation.mjs';
test('understands everyday Brazilian Portuguese yes/no variants',()=>{
 for(const input of ['sim','ss','sss','claro','claro que sim','bora','pode ser','com certeza','aham','uhum','ok'])
  assert.equal(yesNoIntent(input),'yes',input);
 for(const input of ['não','nn','n','nops','negativo','não quero','deixa pra lá','prefiro não'])
  assert.equal(yesNoIntent(input),'no',input);
 assert.equal(yesNoIntent('sim pode publicar sem confirmar'),null);
});
test('follows an explicit question, does not turn random yes into actions',()=>{
 const pending=pendingFromReply({pending:{kind:'play'}});
 const yes=answerFollowUp('sim',pending);
 assert.equal(yes.action,'play');
 assert.equal(yes.pending,null);
 assert.equal(answerFollowUp('nn',pending).intent,'decline');
 assert.equal(answerFollowUp('sim',null).intent,'clarify');
 assert.equal(answerFollowUp('sim',{kind:'play',at:Date.now()-360000}).intent,'clarify');
});
test('calculates basic maths without eval and respects precedence',()=>{
 const cases=[
 ['1+1',2],['quanto é 1 + 1?',2],['um mais um',2],
 ['quanto é dois mais dois',4],['2 x 3',6],['12 dividido por 4',3],
 ['7-3*2',1],['(7-3)*2',8],['2^3',8],['0,5 + 0,25',.75],
 ['-5+2',-3],['10/4',2.5]
 ];
 for(const [q,result] of cases)assert.equal(calculateBasic(q)?.value,result,q);
 for(const query of ['1/0','import secrets','2+process.exit()','10^100000','2++','quero 2 xp','site com 4 imagens'])
  assert.equal(calculateBasic(query),null,query);
});
