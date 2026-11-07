import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeConfig,loadConfig} from '../src/config.mjs';
import {readMemory,writeMemory,LEGACY_KEY,memoryKey,parseBackup,exportBackup} from '../src/storage.mjs';
const store=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value))}};
test('configuration rejects unsafe colors, namespaces and unknown feature values',()=>{
 const x=normalizeConfig({appearance:{accent:'red;url(javascript:1)'},memory:{namespace:'../../bad'},features:{routes:'false',assistants:false},identity:{name:'<script>x</script>'}});
 assert.equal(x.appearance.accent,'#b58aff');
 assert.equal(x.memory.namespace,'default');
 assert.equal(x.features.routes,true);
 assert.equal(x.features.assistants,false);
 assert.equal(x.identity.name,'<script>x</script>'); // UI inserts as text, never HTML.
});
test('JSON configuration must be from the site origin',async()=>{
 const options={origin:'https://site.test',base:'https://site.test/app/',fetcher:async()=>({ok:true,text:async()=>'{ "schemaVersion":1,"identity":{"name":"Arcanista"}}'})};
 assert.equal((await loadConfig('./config.json',options)).identity.name,'Arcanista');
 await assert.rejects(loadConfig('https://other.test/cfg.json',options),/mesma origem/);
});
test('memory namespaces isolate sites and preserve progress across version changes',()=>{
 const db=store();
 db.setItem(LEGACY_KEY,JSON.stringify({brain:{xp:32},position:{x:10,y:20}}));
 assert.equal(readMemory(db).brain.xp,32);
 assert.equal(readMemory(db,'site-b').brain.xp,undefined);
 assert.equal(writeMemory(db,{brain:{xp:57,interactions:5}},'site-b'),true);
 assert.equal(readMemory(db,'site-b').brain.xp,57);
 assert.equal(readMemory(db).brain.xp,32);
 assert.ok(db.getItem(memoryKey('site-b')));
 assert.equal(parseBackup(exportBackup(readMemory(db,'site-b'))).brain.xp,57);
});
test('corrupt storage and corrupt backups fail safely',()=>{
 const broken={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.deepEqual(readMemory(broken).brain,{});
 assert.equal(writeMemory(broken,{brain:{xp:4}}),false);
 assert.throws(()=>parseBackup('{"schema":99}'));
});
