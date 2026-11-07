import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCommand,recognizeStudioCommand} from '../src/commands.mjs';

test('publish phrase is exact, case and accent insensitive',()=>{
 assert.equal(recognizeStudioCommand('VAI COMPRAR PÃO!'),'prepare-publish');
 assert.equal(recognizeStudioCommand('vai comprar pao'),'prepare-publish');
 assert.equal(recognizeStudioCommand('  Vai   comprar PÃO  '),'prepare-publish');
 assert.equal(normalizeCommand(' Vá! '),'va');
});
test('phrase embedded in a document or conversation cannot trigger publication',()=>{
 assert.equal(recognizeStudioCommand('o site tem a frase vai comprar pão'),null);
 assert.equal(recognizeStudioCommand('vai comprar pão e publicar automaticamente'),null);
 assert.equal(recognizeStudioCommand('vai comprar pao', 'outro comando'),null);
});
