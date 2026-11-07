import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_BRAIN, restoreBrain, applyAction, passTime, currentMood, levelFromXp } from '../src/brain.mjs';
test('default creates a fresh state and preserves original', () => {
  const a = restoreBrain(null), b = restoreBrain(null); a.energy = 1;
  assert.equal(b.energy, 75); assert.equal(DEFAULT_BRAIN.energy, 75);
});
test('actions adjust bounded values, gain XP, and remain deterministic', () => {
  const base = restoreBrain(null);
  const played = applyAction(base, 'play', 1000);
  assert.equal(played.energy, 66);
  assert.equal(played.curiosity, 67);
  assert.equal(played.xp, 3);
  assert.equal(base.energy, 75);
  assert.equal(currentMood(played, 1100), 'animado');
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
