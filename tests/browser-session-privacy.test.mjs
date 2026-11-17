import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {createAlquimagoSessionVault,retireAlquimagoBrowserMemory,VAULT_DATABASE} from '../src/vault.mjs'
test('session vault is not persisted between instances',async()=>{
 const a=createAlquimagoSessionVault(),b=createAlquimagoSessionVault()
 a.storage.setItem('alquimago:dialogue:v1:studio','vai comprar pão')
 a.storage.setItem('alquimago:lessons:v1:studio','rascunho')
 assert.equal(a.storage.getItem('alquimago:dialogue:v1:studio'),'vai comprar pão')
 assert.equal(b.storage.getItem('alquimago:dialogue:v1:studio'),null)
 assert.equal(b.storage.getItem('alquimago:lessons:v1:studio'),null)
 a.storage.removeItem('alquimago:dialogue:v1:studio')
 assert.equal(a.storage.getItem('alquimago:dialogue:v1:studio'),null)
 assert.equal(a.status,'session')
 assert.equal(await a.flush(),true)
})
test('cleanup retires only Alquimago storage, not encrypted publisher token',async()=>{
 const keys=new Map([
 ['alquimago:dialogue:v1:studio','chat'],['alquimago:lessons:v1:studio','lesson'],
 ['alquimago:memory:v2:studio','brain'],['alquimago:v1','legacy'],
 ['token:github-publisher','encrypted token to keep']
 ])
 let db=''
 const indexedDBFactory={deleteDatabase:name=>{
  db=name
  const request={}
  queueMicrotask(()=>request.onsuccess?.())
  return request
 }}
 const result=await retireAlquimagoBrowserMemory({
  namespace:'studio',legacyStorage:{removeItem:key=>keys.delete(key)},indexedDBFactory
 })
 assert.equal(result,true)
 assert.equal(db,VAULT_DATABASE)
 assert.equal(keys.get('token:github-publisher'),'encrypted token to keep')
 assert.equal(keys.has('alquimago:dialogue:v1:studio'),false)
 assert.equal(keys.has('alquimago:lessons:v1:studio'),false)
 assert.equal(keys.has('alquimago:v1'),false)
})
test('published familiar bootstrap avoids writing any local memories',async()=>{
 const source=await readFile(new URL('../src/widget.js',import.meta.url),'utf8')
 assert.match(source,/if\(config\.memory\.mode==='publish'\)\{[\s\S]*?createAlquimagoSessionVault\(\)/)
 assert.match(source,/retireAlquimagoBrowserMemory\(/)
 assert.match(source,/\}else\{\s*this\.vault=await createAlquimagoVault\(/)
 assert.match(source,/this\.dialogue=config\.memory\.mode==='publish'\?\[\]/)
 assert.match(source,/this\.config\.memory\.mode!=='publish'\)writeDialogue/)
 assert.match(source,/associação vale somente até recarregar/)
})
