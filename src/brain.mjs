// ALQUIMAGO • cérebro simbólico adaptativo, sem conexão de rede.
// Implementação original, NÃO é a rede neural do Pestinha.
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
export const DEFAULT_BRAIN = Object.freeze({
  energy: 75, curiosity: 58, focus: 38, affinity: 45,
  xp: 0, interactions: 0, lastAction: 'summon', lastSeen: 0,
  sleepUntil: 0,
});
const ACTIONS = {
  pet:   { energy:  2, curiosity: 0, focus: -2, affinity: 8, xp: 2 },
  play:  { energy: -9, curiosity: 9, focus: -4, affinity: 3, xp: 3 },
  focus: { energy: -4, curiosity: -2, focus: 13, affinity: 1, xp: 3 },
  rest:  { energy: 17, curiosity: 0, focus: -3, affinity: 0, xp: 1 },
  study: { energy: -2, curiosity: 5, focus: 7, affinity: 0, xp: 2 },
};
export function restoreBrain(value) {
  if (!value || typeof value !== 'object') return { ...DEFAULT_BRAIN };
  const clean = { ...DEFAULT_BRAIN };
  for (const key of ['energy', 'curiosity', 'focus', 'affinity']) {
    if (typeof value[key] === 'number' && Number.isFinite(value[key])) clean[key] = clamp(value[key]);
  }
  for (const key of ['xp', 'interactions', 'lastSeen', 'sleepUntil']) {
    if (typeof value[key] === 'number' && Number.isFinite(value[key])) clean[key] = clamp(value[key], 0, 1e12);
  }
  if (typeof value.lastAction === 'string' && Object.hasOwn(ACTIONS, value.lastAction)) clean.lastAction = value.lastAction;
  return clean;
}
export function applyAction(brain, name, now = Date.now()) {
  if (!Object.hasOwn(ACTIONS, name)) return restoreBrain(brain);
  const result = restoreBrain(brain);
  for (const key of ['energy', 'curiosity', 'focus', 'affinity']) result[key] = clamp(result[key] + ACTIONS[name][key]);
  result.xp = clamp(result.xp + ACTIONS[name].xp, 0, 1e12);
  result.interactions++;
  result.lastAction = name;
  result.lastSeen = now;
  result.sleepUntil = name === 'rest' ? now + 2700 : 0;
  return result;
}
export function passTime(brain, elapsedMs, now = Date.now()) {
  const result = restoreBrain(brain);
  // A passagem do tempo apenas estabiliza os indicadores. Não penaliza o usuário por sair.
  const minutes = clamp(elapsedMs / 60000, 0, 30);
  result.energy = clamp(result.energy + minutes * .65);
  result.curiosity = clamp(result.curiosity + minutes * .22);
  result.focus = clamp(result.focus - minutes * .3);
  result.lastSeen = now;
  return result;
}
export function currentMood(brain, now = Date.now()) {
  const state = restoreBrain(brain);
  if (state.sleepUntil > now) return 'meditando';
  if (state.energy <= 23) return 'sonolento';
  if (state.lastAction === 'pet' && now - state.lastSeen < 3500) return 'feliz';
  if (state.lastAction === 'play' && now - state.lastSeen < 3500) return 'animado';
  if (state.focus >= 65 && state.lastAction === 'focus') return 'concentrado';
  if (state.curiosity >= 65) return 'curioso';
  return 'tranquilo';
}
export function levelFromXp(xp) { return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 8)) + 1); }
