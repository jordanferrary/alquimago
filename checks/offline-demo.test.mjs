import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderOfflineDemo} from '../scripts/offline-demo.mjs';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const version=JSON.parse(await read('package.json')).version;
const bundle=await read('dist/alquimago.js');
const root=await read('Alquimago_Demo_Offline.html');
const hosted=await read('dist/Alquimago_Demo_Offline.html');

test('single-file offline demo has exactly the current release bundle',()=>{
 assert.equal(root,hosted,'The offline file must be identical in the root and dist directories');
 assert.equal(root,renderOfflineDemo(bundle,version),'Rebuild the demo; it must embed the full current JS');
 assert.ok(bundle.startsWith('/* ALQUIMAGO v'+version+' • MIT */'));
 assert.ok(root.includes('<meta name="alquimago-version" content="'+version+'">'));
 assert.match(bundle,/window\.Alquimago\s*=/);
 assert.match(bundle,/ROBOT_SVG/);
 assert.match(bundle,/alquimago-orb/);
 assert.match(bundle,/createAlquimagoVault/);
 assert.match(bundle,/alquimago:publish-auth-status/);
 assert.doesNotMatch(root,/Demonstração offline histórica \(v0\.1\)/i);
});
test('standalone page needs no local dependencies, network or user credentials',()=>{
 assert.equal(root.match(/<\/script>/gi)?.length,1);
 assert.match(root,/<script id="alquimago-offline-bundle">/);
 const markup=root.split('<script id="alquimago-offline-bundle">')[0];
 assert.doesNotMatch(markup,/<script[^>]+src=/i);
 assert.doesNotMatch(markup,/<link[^>]+href=/i);
 assert.doesNotMatch(markup,/https?:\/\//i);
 assert.doesNotMatch(markup,/data-config=/i);
 assert.match(markup,/sem internet/i);
 assert.match(markup,/file:\/\//i);
});
test('offline demo builder rejects invalid versions and malformed bundles',()=>{
 assert.throws(()=>renderOfflineDemo('old robot','0.11.5'),/Distribuição/);
 assert.throws(()=>renderOfflineDemo(bundle,'test'),/Versão/);
 assert.equal(renderOfflineDemo('window.Alquimago={}; </script>','0.11.5').match(/<\/script>/gi)?.length,1);
});
