import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_BRAIN, restoreBrain, applyAction, passTime, currentMood, levelFromXp } from '../src/brain.mjs';
test('default creates a fresh state and preserves original', () => {
  const a = restoreBrain(null), b = restoreBrain(null); a.energy = 1;
  assert.equal(b.energy, 75); assert.equal(DEFAULT_BRAIN.energy, 75);
});
test('actions adjust bounded values, gain XP, and remain deterministic', () => {
  const base = restoreBrain(null);
  const played = applyAction(base, 'play', 100000);
  assert.equal(played.energy, 67);
  assert.equal(played.curiosity, 65);
  assert.equal(played.xp, 2);
  assert.equal(base.energy, 75);
  assert.equal(currentMood(played, 100100), 'animado');
});
test('malformed storage cannot inject invalid state', () => {
  const b = restoreBrain({ energy: Infinity, focus: -100, affinity: 300, lastAction: '__proto__', xp: NaN });
  assert.equal(b.energy, 75);
  assert.equal(b.focus, 0);
  assert.equal(b.affinity, 100);
  assert.equal(b.lastAction, 'summon');
  assert.equal(b.xp, 0);
});
test('long absence does not produce guilt or punishments', () => {
  const b = passTime(restoreBrain(null), 24 * 60 * 60 * 1000, 100);
  assert.ok(b.energy >= 75);
  assert.equal(levelFromXp(0), 1);
});
test('unknown action has no effect', () => {
  assert.deepEqual(applyAction(restoreBrain(null), 'destroy'), restoreBrain(null));
});

test('petting and meditation do not farm XP; abilities have reward cooldowns',()=>{
 const base=restoreBrain(null);
 const pet=applyAction(base,'pet',100000);
 const petAgain=applyAction(pet,'stroke',100001);
 assert.equal(petAgain.xp,0);
 const potion=applyAction(petAgain,'brew',120000);
 assert.equal(potion.xp,3);
 const repeated=applyAction(potion,'brew',120001);
 assert.equal(repeated.xp,3);
 const later=applyAction(repeated,'brew',181000);
 assert.equal(later.xp,6);
});
test('each public route rewards exploration once per day',()=>{
 const base=restoreBrain(null),route='portfolio%2Fgallery';
 const first=applyAction(base,'explore',86400000,route);
 const again=applyAction(first,'explore',86400005,route);
 const tomorrow=applyAction(again,'explore',2*86400000,route);
 assert.equal(first.xp,4);
 assert.equal(again.xp,4);
 assert.equal(tomorrow.xp,8);
});
