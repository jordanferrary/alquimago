import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ROBOT_SVG,ROBOT_STYLES,ORB_EXPRESSIONS} from '../src/orb-skin.mjs';
import {createAffect,affectSignal,affectTick,setAffectMusic} from '../src/affect.mjs';
import {normalizeConfig} from '../src/config.mjs';

const source=await readFile(new URL('../src/widget.js',import.meta.url),'utf8');
const builder=await readFile(new URL('../scripts/build.mjs',import.meta.url),'utf8');

test('original headset robot is the only embedded SVG skin, not the old wizard',()=>{
 assert.match(ROBOT_SVG,/class="alquimago-orb"/);
 assert.match(ROBOT_SVG,/class="orb-robot"/);
 assert.match(ROBOT_SVG,/class="orb-headset-left"/);
 assert.match(ROBOT_SVG,/class="orb-headset-right"/);
 assert.match(ROBOT_SVG,/class="orb-face-display"/);
 assert.doesNotMatch(ROBOT_SVG,/arc-hat|arc-cloak|<!-- hat|robe and sleeves/);
 assert.doesNotMatch(source,/const SVG = `<svg viewBox=/);
 assert.match(source,/this\.\$character\.innerHTML=ROBOT_SVG/);
 assert.match(source,/this\.skinAdapter=\{/);
});

test('robot retains original animated facial states and motion accessibility',()=>{
 for(const expression of ['idle','breath','serene','blink','happy','excited',
   'laugh','curious','focused','thinking','surprised','confused','sad','worried',
   'angry','tired','yawn','sleep','pet','love','shy','proud','talk',
   'lookleft','lookright','lookup','lookdown']){
  assert.ok(ORB_EXPRESSIONS[expression],expression);
  assert.ok(ROBOT_SVG.includes('orb-expression-'+expression),expression);
 }
 assert.match(ROBOT_STYLES,/@keyframes orb-breath/);
 assert.match(ROBOT_STYLES,/@keyframes orb-auto-blink/);
 assert.match(ROBOT_STYLES,/@keyframes orb-talk/);
 assert.match(ROBOT_STYLES,/prefers-reduced-motion:reduce/);
 assert.match(ROBOT_STYLES,/data-music="playing"/);
 assert.match(builder,/orb-skin\.mjs/);
 assert.match(builder,/affect\.mjs/);
});

test('previous wizard skin config migrates to robot without deleting custom 3D',()=>{
 const legacy=normalizeConfig({appearance:{
  skins:[{id:'wizard',label:'Old maguinho',type:'svg'},
   {id:'padrao',label:'Old wizard profile',type:'svg'},
   {id:'custom-3d',label:'GLB',type:'model3d',src:'./alquimago/skins/custom.glb'}],
  selectedSkin:'wizard'
 }});
 assert.equal(legacy.appearance.selectedSkin,'padrao');
 assert.equal(legacy.appearance.skins[0].label,'Alquimago Orb 2D — animado');
 assert.equal(legacy.appearance.skins.some(x=>x.id==='wizard'),false);
 assert.equal(legacy.appearance.skins[1].id,'custom-3d');
 assert.equal(normalizeConfig(null).appearance.selectedSkin,'padrao');
});

test('music gently changes mood without inspecting audio and is reversible',()=>{
 const start=createAffect(42,10000);
 const playing=setAffectMusic(start,true,11000);
 assert.equal(playing.music,true);
 assert.ok(playing.calm>start.calm);
 const ticked=affectTick(playing,18000);
 assert.equal(ticked.music,true);
 assert.ok(['idle','breath','serene','happy','curious','focused','thinking','pet',
   'love','angry','worried','surprised','sad','tired','sleep'].includes(ticked.expression));
 const paused=setAffectMusic(ticked,false,19000);
 assert.equal(paused.music,false);
 const happy=affectSignal(paused,'pet',20000);
 assert.ok(happy.warmth>paused.warmth);
 assert.match(source,/alquimago:music-state/);
 assert.match(source,/affectTick\(this\.affect,Date\.now\(\)\)/);
});
