import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeTeachingLabels, teachingLabelsFromLegacy, validateTeachingExample} from '../src/teaching-intents.mjs';
test('multiple meanings survive validation', () => {
 const result = validateTeachingExample('Você errou. Por quê?', {intents:['reprimand','question','question'],tone:'frustrated',topic:'conversa'});
 assert.deepEqual(result.intents,['reprimand','question']);
 assert.equal(result.tone,'frustrated');
});
test('legacy potion maps to command without losing old classifier', () => {
 assert.deepEqual(teachingLabelsFromLegacy('brew').intents,['command']);
});
test('unknown labels are discarded and secrets rejected', () => {
 assert.deepEqual(normalizeTeachingLabels({intents:['bogus','answer']}).intents,['answer']);
 assert.equal(validateTeachingExample('senha: teste', {intents:['teaching']}),null);
});
