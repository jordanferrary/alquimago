import test from 'node:test';
import assert from 'node:assert/strict';
import {approveLesson,recallLesson,canonicalLesson} from '../src/learning.mjs';
test('approved lesson survives abbreviations and small typos',()=>{
 const lib=approveLesson(null,'Como você funciona no site?','Eu uso meu grimório local e ferramentas autorizadas.').library;
 assert.equal(recallLesson('Como vc funciona no site?',lib)?.intent,'approved-lesson');
 assert.equal(recallLesson('Como voce funcona no site?',lib)?.intent,'approved-lesson');
});
test('unrelated questions do not borrow an approved answer',()=>{
 const lib=approveLesson(null,'Como você funciona no site?','Eu uso meu grimório local e ferramentas autorizadas.').library;
 assert.equal(recallLesson('Como preparar uma poção?',lib),null);
});
test('normalizes chat shorthand',()=>{
 assert.equal(canonicalLesson('VC sabe oq é isso?'),'voce sabe o que e isso');
});
