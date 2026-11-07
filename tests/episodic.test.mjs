import test from 'node:test';
import assert from 'node:assert/strict';
import {artBucket,blankPreferences,learnTip,rankTips,cleanPreferences} from '../src/episodic.mjs';
test('feedback reshapes advice ordering by category, without storing project names',()=>{
 const state=learnTip(blankPreferences(),'Character Sculpt',1,true);
 assert.equal(artBucket('Character Sculpt'),'character');
 assert.deepEqual(rankTips(['silhueta','materiais'],'Character Sculpt',state).map(x=>x.index),[1,0]);
 assert.equal(learnTip(state,'Environment',4,false).weights.environment[4],-1);
 assert.ok(!JSON.stringify(state).includes('Tubarão'));
});
test('corrupt or unbounded preference values are clamped',()=>{
 assert.equal(cleanPreferences({weights:{character:{0:Infinity,1:999}}}).weights.character[1],8);
});
