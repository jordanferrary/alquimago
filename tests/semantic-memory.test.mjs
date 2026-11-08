import test from 'node:test';
import assert from 'node:assert/strict';
import {approveLesson} from '../src/learning.mjs';
import {buildSemanticMemory,answerFromSemanticMemory} from '../src/semantic-memory.mjs';
test('extracts only approved declarative relationships',()=>{
 const lib=approveLesson(null,'O que é Blender?','Blender é um software de criação 3D.').library;
 assert.equal(buildSemanticMemory(lib).length,1);
 assert.match(answerFromSemanticMemory('Me explique o Blender',lib)?.reply||'',/software de criação 3D/);
 assert.equal(answerFromSemanticMemory('Para que serve Blender?',lib),null);
});
test('does not invent connections from unrelated knowledge',()=>{
 const lib=approveLesson(null,'O que é Blender?','Blender é um software de criação 3D.').library;
 assert.equal(answerFromSemanticMemory('O que é ZBrush?',lib),null);
});
test('unapproved data cannot enter semantic memory',()=>{
 assert.equal(buildSemanticMemory({lessons:[{question:'O que é X?',answer:'X é Y',approved:false}]}).length,0);
});

test('reverse reasoning finds a uniquely supported tool by purpose',()=>{
 const lib=approveLesson(null,'O que faz ZBrush?','ZBrush serve para escultura digital.').library;
 assert.match(answerFromSemanticMemory('Qual ferramenta serve para escultura digital?',lib)?.reply||'',/ZBrush/);
});
test('reverse reasoning refuses ambiguous facts',()=>{
 const a=approveLesson(null,'O que faz ZBrush?','ZBrush serve para escultura digital.').library;
 const b=approveLesson(a,'O que faz Blender?','Blender serve para escultura digital.').library;
 assert.equal(answerFromSemanticMemory('Qual ferramenta serve para escultura digital?',b),null);
});
