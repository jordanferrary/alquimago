import test from 'node:test';
import assert from 'node:assert/strict';
import {validateReviewImageFile} from '../src/image-insight.mjs';
import {askLanguageModel,prepareModelConversation} from '../src/llm.mjs';
import {normalizeConfig} from '../src/config.mjs';
import {readFile} from 'node:fs/promises';

const encoded='aGVsbG8gd29ybGQ=';
test('image validation blocks unsupported or oversized uploads',()=>{
 assert.equal(validateReviewImageFile({type:'image/png',size:1024}),true);
 assert.throws(()=>validateReviewImageFile({type:'image/svg+xml',size:100}),/PNG/);
 assert.throws(()=>validateReviewImageFile({type:'image/jpeg',size:9*1024*1024}),/8 MB/);
});
test('multimodal request explicitly carries the chosen image',async()=>{
 const image={mimeType:'image/jpeg',data:encoded};
 const body=prepareModelConversation('Avalie minha arte',[],null,[],image);
 assert.equal(body.task,'give_visual_art_feedback');
 assert.deepEqual(body.image,image);
 await askLanguageModel({endpoint:'https://test.example/api/assistant',prompt:'Avalie minha arte',image,
  fetcher:async (url,options)=>{
   assert.equal(url,'https://test.example/api/assistant');
   const json=JSON.parse(options.body);
   assert.equal(json.mode,'image-feedback');
   assert.equal(json.image.data,encoded);
   return {ok:true,json:async()=>({reply:'Melhore a leitura da silhueta.'})};
  }
 });
 assert.throws(()=>prepareModelConversation('oi',[],null,[],{mimeType:'image/svg+xml',data:encoded}),/imagem/);
});
test('project-specific lines come from the host config, not from the core',async()=>{
 const cfg=normalizeConfig({assistant:{spotlights:[{title:'Artwork X',message:'Personal line'}]}});
 assert.equal(cfg.assistant.spotlights[0].title,'Artwork X');
 const widget=await readFile(new URL('../src/widget.js',import.meta.url),'utf8');
 assert.match(widget,/alquimago-image-input/);
 assert.match(widget,/reviewImage\(\)/);
 assert.doesNotMatch(widget,/\/frankie\/i/);
});
