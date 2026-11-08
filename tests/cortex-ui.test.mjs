import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../src/widget.js',import.meta.url),'utf8');
const builder=await readFile(new URL('../scripts/build.mjs',import.meta.url),'utf8');

test('behavior cortex is connected to real widget and explicit consent controls',()=>{
 assert.match(source,/createCortexRuntime\(/);
 assert.match(source,/tickCortex\(this\.cortex,info,now\)/);
 assert.match(source,/rewardCortex\(this\.cortex/);
 assert.match(source,/Cérebro e autonomia/);
 assert.match(source,/toggle-cortex/);
 assert.match(source,/cortex-mode/);
 assert.match(source,/Gostei/);
 assert.match(source,/Menos disso/);
 assert.match(source,/this\.behaviorAllowed&&now-this\.cortexStart>45000/);
});
test('toy is optional and its physics never alter page components',()=>{
 assert.match(source,/this\.config\.behavior\.toy/);
 assert.match(source,/className='arcane-orb-field'/);
 assert.match(source,/stepOrb\(this\.orbState,165,112/);
 assert.match(source,/this\.closeOrb\(\)/);
 assert.match(source,/orb-close/);
});
test('published backup contains bounded cortex and build imports both modules',()=>{
 assert.match(source,/behavior:cleanCortex\(this\.cortex\.state\)/);
 assert.match(source,/writeCortex\(storage\(\),this\.config\.memory\.namespace/);
 assert.match(source,/if\(this\.config\.memory\.mode==='publish'\)return;/);
 assert.match(builder,/behavior\.mjs/);
 assert.match(builder,/physics\.mjs/);
 assert.match(builder,/behavior,physics,commands,conversation,knowledge,llm,learning,teaching,semantic,widget/);
});
