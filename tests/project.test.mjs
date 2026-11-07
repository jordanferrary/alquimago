import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveProjectFile,inspectProjectFiles} from '../src/project.mjs';
test('project reading stays same-origin and blocks private-looking paths',()=>{
 const root='https://host.test/website/';
 for(const url of ['https://other.test/secret.json','/.env','/.git/config','/private/info.json','/credentials.json','javascript:alert(1)','/image.png'])
  assert.equal(resolveProjectFile(url,root),null);
 assert.equal(resolveProjectFile('./alquimago/guide.json',root),'https://host.test/website/alquimago/guide.json');
});
test('reads only configured, bounded text files on explicit call',async()=>{
 const records=await inspectProjectFiles(['./guide.json','./not-found.md'],{
  pageUrl:'https://host.test/website/',
  fetcher:async url=>url.endsWith('guide.json')?{ok:true,headers:{get:()=>null},arrayBuffer:async()=>new TextEncoder().encode('{"label":"Hello"}').buffer}:{ok:false}
 });
 assert.equal(records[0].status,'read');
 assert.match(records[0].excerpt,/Hello/);
 assert.equal(records[1].status,'unavailable');
});
