import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeConfig} from '../src/config.mjs';
import {normalizeLanguage,loadLanguage} from '../src/i18n.mjs';
import {normalizeSkin,safeSkinUrl,skinExpression} from '../src/skin.mjs';
import {seedNeuralModel,teachNeural,neuralPredict,serializeNeuralModel,restoreNeuralModel} from '../src/neural.mjs';

test('user correction takes effect immediately and survives numeric publish',()=>{
 const brain=seedNeuralModel();
 const phrase='poeirinha de estrelas';
 assert.equal(teachNeural(brain,phrase,'brew'),true);
 assert.equal(brain.learned,1);
 assert.equal(neuralPredict(brain,phrase).intent,'brew');
 const saved=restoreNeuralModel(serializeNeuralModel(brain));
 assert.equal(saved.learned,1);
 assert.equal(neuralPredict(saved,phrase).intent,'brew');
});
test('portuguese is built-in; foreign text requires a public JSON pack',async()=>{
 const pt=normalizeLanguage(null);
 assert.equal(pt.code,'pt-BR');assert.equal(pt.tabs.chat,'Conversar');
 const pack={code:'en',tabs:{chat:'Chat'},intentSamples:{greeting:['hello']},responses:{greeting:'Hello, {name}!'}};
 const loaded=await loadLanguage('./locales/en.json',{
  pageUrl:'https://site.test/app/',
  fetcher:async()=>({ok:true,text:async()=>JSON.stringify(pack)})
 });
 assert.equal(loaded.tabs.chat,'Chat');
 assert.deepEqual(loaded.intentSamples.greeting,['hello']);
 await assert.rejects(loadLanguage('https://another.test/file.json',{pageUrl:'https://site.test/app/'}));
});
test('skin profiles do not run arbitrary URLs and define morph-target names',()=>{
 const site='https://site.test/portfolio/';
 const cfg=normalizeConfig({appearance:{skins:[
  {id:'padrao',label:'Padrão',type:'svg'},
  {id:'meu3d',label:'Meu 3D',type:'model3d',src:'./alquimago/skins/mago.glb',shapeKeys:{talk:'Speech'}}
 ],selectedSkin:'meu3d'}});
 assert.equal(cfg.appearance.selectedSkin,'meu3d');
 const skin=normalizeSkin(cfg.appearance.skins[1]);
 assert.equal(skin.shapeKeys.talk,'Speech');
 assert.equal(safeSkinUrl(skin,site),'https://site.test/portfolio/alquimago/skins/mago.glb');
 assert.equal(safeSkinUrl(normalizeSkin({type:'model3d',src:'javascript:alert(1)'}),site),null);
 assert.equal(skinExpression('feliz'),'happy');
});
