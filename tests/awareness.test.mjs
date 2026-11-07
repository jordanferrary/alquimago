import test from 'node:test';
import assert from 'node:assert/strict';
import {readPublicPage,suggestionsFromPage,samePageSignature,routeSignature} from '../src/awareness.mjs';

const fakeDocument={
 title:'Demo',
 querySelector(selector){
  if(selector==='h1')return {textContent:'Hello'};
  return null;
 },
 querySelectorAll(selector){
  if(selector==='[id]')return [{id:'same'},{id:'same'}];
  if(selector==='img')return [{hasAttribute:()=>false,complete:true,naturalWidth:0,currentSrc:'https://site.test/broken.png'}];
  if(selector==='button')return [{getAttribute:()=>null,textContent:''}];
  if(selector==='a[href]')return [{href:'/a'}];
  return [];
 }
};
test('insights detect route and accessible-UI defects without reading forms',()=>{
 const page=readPublicPage(fakeDocument,'https://site.test/#/contato');
 assert.equal(page.route,'contact');
 assert.equal(page.duplicateIds,1);
 assert.equal(page.missingAlt,1);
 assert.equal(page.brokenImages,1);
 assert.ok(suggestionsFromPage(page).some(item=>item.id==='alt'));
 assert.ok(suggestionsFromPage(page).some(item=>item.id==='route'));
 assert.equal(samePageSignature(page,{...page}),true);
 assert.equal(routeSignature('https://site.test/#/portfolio'),'/#/portfolio');
});
