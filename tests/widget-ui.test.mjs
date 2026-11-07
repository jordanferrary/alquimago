import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const widget=await readFile(new URL('../src/widget.js',import.meta.url),'utf8');
test('floating panel fits viewport, is opaque, and cannot hide its close control',()=>{
 assert.match(widget,/\.shell\{filter:none!important\}/);
 assert.match(widget,/max-height:calc\(100dvh - 20px\)/);
 assert.match(widget,/\.panel\.open\{display:flex!important;flex-direction:column\}/);
 assert.match(widget,/background:#171023!important/);
 assert.match(widget,/id="close-panel"/);
 assert.match(widget,/@media\(max-width:720px\)/);
 assert.match(widget,/overflow-y:auto;overscroll-behavior:contain/);
});
test('Studio has publish-only progression and learning feedback',()=>{
 assert.match(widget,/config\.memory\.mode==='publish'/);
 assert.match(widget,/alquimago:request-publish/);
 assert.match(widget,/alquimago:publish-dialog/);
 assert.match(widget,/data-action='teach-neural'|dataset\.action='teach-neural'/);
 assert.match(widget,/neuralPredict\(this\.neural,user\)/);
 assert.match(widget,/serializeNeuralModel\(this\.neural\)/);
});
