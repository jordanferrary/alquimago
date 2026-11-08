import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createAlquimagoVault,vaultKeys} from '../src/vault.mjs';

function device(){
 const memory=new Map();
 const persistent=new Map();
 return {
  memory,persistent,
  localStorage:{
   getItem:k=>memory.has(k)?memory.get(k):null,
   setItem:(k,v)=>memory.set(k,v),
   removeItem:k=>memory.delete(k)
  },
  persistence:{
   get:async k=>persistent.get(k),
   put:async (k,v)=>{persistent.set(k,v);}
  }
 };
}
test('migrates plaintext only after verified AES-GCM encrypted persistence',async()=>{
 const d=device(),ns='studio';
 const key='alquimago:lessons:v1:'+ns;
 d.localStorage.setItem(key,'{"lessons":[{"question":"Olá","answer":"Segredo visual"}]}');
 const vault=await createAlquimagoVault({
  namespace:ns,legacyStorage:d.localStorage,persistence:d.persistence,cryptoProvider:webcrypto
 });
 assert.equal(vault.status,'protected');
 assert.equal(d.memory.has(key),false,'plaintext removed only after seal');
 assert.equal(vault.storage.getItem(key).includes('Segredo visual'),true);
 const encrypted=d.persistent.get('data:'+ns);
 assert.equal(encrypted.format,'ALQ-V1');
 assert.equal(encrypted.payload.includes('Segredo visual'),false);
 assert.equal(d.persistent.get('key:'+ns).extractable,false);
 await assert.rejects(webcrypto.subtle.exportKey('raw',d.persistent.get('key:'+ns)));
});
test('restores encrypted conversation and prevents cross-namespace access',async()=>{
 const d=device(),key='alquimago:dialogue:v1:studio';
 const init=await createAlquimagoVault({
  namespace:'studio',legacyStorage:d.localStorage,persistence:d.persistence,cryptoProvider:webcrypto
 });
 init.storage.setItem(key,'[{"role":"familiar","text":"Teste confidencial"}]');
 assert.equal(await init.flush(),true);
 const reread=await createAlquimagoVault({
  namespace:'studio',legacyStorage:d.localStorage,persistence:d.persistence,cryptoProvider:webcrypto
 });
 assert.match(reread.storage.getItem(key),/confidencial/);
 const outsider=await createAlquimagoVault({
  namespace:'outsider',legacyStorage:d.localStorage,persistence:d.persistence,cryptoProvider:webcrypto
 });
 assert.equal(outsider.storage.getItem(key),null);
 assert.equal(outsider.storage.getItem('alquimago:dialogue:v1:outsider'),null);
});
test('locked/tampered ciphertext fails closed and preserves stored data',async()=>{
 const d=device(),name='alquimago:teaching:v2:studio';
 const v=await createAlquimagoVault({
  namespace:'studio',legacyStorage:d.localStorage,persistence:d.persistence,cryptoProvider:webcrypto
 });
 v.storage.setItem(name,'{"examples":["ok"]}');
 await v.flush();
 const record=d.persistent.get('data:studio');
 d.persistent.set('data:studio',{...record,payload:'AAAA'});
 d.localStorage.setItem(name,'legacy copy');
 const corrupt=await createAlquimagoVault({
  namespace:'studio',legacyStorage:d.localStorage,persistence:d.persistence,cryptoProvider:webcrypto
 });
 assert.equal(corrupt.status,'unavailable');
 assert.equal(d.localStorage.getItem(name),'legacy copy','no destructive migration on failure');
 assert.throws(()=>corrupt.storage.setItem(name,'leak'),/Cofre/);
 assert.deepEqual(d.persistent.get('data:studio').payload,'AAAA');
});
test('does not degrade to unencrypted localStorage when WebCrypto is unavailable',async()=>{
 const d=device();
 const vault=await createAlquimagoVault({
  namespace:'default',legacyStorage:d.localStorage,persistence:d.persistence,cryptoProvider:null
 });
 assert.equal(vault.status,'unavailable');
 assert.throws(()=>vault.storage.setItem(vaultKeys()[0],'plaintext'),/Cofre/);
 assert.equal(d.memory.size,0);
});
test('a broken vault write does not erase the old plaintext',async()=>{
 const d=device(),name='alquimago:lessons:v1:studio';
 d.localStorage.setItem(name,'old lesson');
 const v=await createAlquimagoVault({
  namespace:'studio',legacyStorage:d.localStorage,cryptoProvider:webcrypto,
  persistence:{get:async()=>null,put:async()=>{throw Error('Quota blocked')}}
 });
 assert.equal(v.status,'unavailable');
 assert.equal(d.localStorage.getItem(name),'old lesson');
});
