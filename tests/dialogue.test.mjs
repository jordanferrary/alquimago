import test from 'node:test';
import assert from 'node:assert/strict';
import {respondToChat,safeChatText,sensitiveChatText} from '../src/dialogue.mjs';
test('dialogue responds to care, XP, site and helps without external AI',()=>{
 assert.equal(respondToChat('como faço carinho?').intent,'pet');
 assert.equal(respondToChat('quanto XP tenho?',{xp:14}).intent,'status');
 assert.equal(respondToChat('tem sugestão pro site?',{page:'galeria'}).intent,'insight');
 assert.equal(respondToChat('oi').intent,'greeting');
 assert.equal(respondToChat('poção').action,'brew');
});
test('private-looking messages are not saved',()=>{
 assert.equal(sensitiveChatText('Meu token: github_pat_example'),true);
 assert.equal(respondToChat('senha abc123').store,false);
 assert.equal(safeChatText('a'.repeat(500)).length,320);
});
