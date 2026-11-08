/** Multi-label teaching vocabulary for Alquimago 2.0.
 * Intent, topic and tone are separate axes; multiple intents are valid.
 * This module is additive and does not change legacy neural weights.
 */
export const TEACHING_INTENTS = Object.freeze({
  question: 'Pergunta',
  answer: 'Resposta',
  correction: 'Correção',
  reprimand: 'Bronca / desaprovação',
  praise: 'Elogio / aprovação',
  instruction: 'Instrução',
  request: 'Pedido',
  explanation: 'Explicação',
  teaching: 'Ensino de conhecimento',
  feedback: 'Feedback',
  disagreement: 'Discordância',
  agreement: 'Concordância',
  greeting: 'Saudação',
  farewell: 'Despedida',
  thanks: 'Agradecimento',
  apology: 'Pedido de desculpas',
  joke: 'Brincadeira / humor',
  emotion: 'Expressão emocional',
  command: 'Comando',
  clarification: 'Pedido de esclarecimento',
  observation: 'Observação',
  other: 'Outro / não listado'
});
export const TEACHING_TONES = Object.freeze({
  neutral: 'Neutro', friendly: 'Amigável', serious: 'Sério',
  frustrated: 'Frustrado', curious: 'Curioso', playful: 'Brincalhão'
});
export const LEGACY_INTENT_MAP = Object.freeze({
  greeting: ['greeting'], identity: ['question'], status: ['question'],
  pet: ['request'], play: ['request', 'joke'], brew: ['command'],
  rest: ['command'], navigate: ['command'], insight: ['request', 'feedback'],
  help: ['request'], mood: ['question'], thanks: ['thanks']
});
const safe = (value, max = 100) => typeof value === 'string'
  ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';
export function normalizeTeachingLabels(value) {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const intents = [...new Set(Array.isArray(input.intents) ? input.intents : [])]
    .filter(key => Object.hasOwn(TEACHING_INTENTS, key)).slice(0, 6);
  const tone = Object.hasOwn(TEACHING_TONES, input.tone) ? input.tone : 'neutral';
  const topic = safe(input.topic, 80);
  return { schema: 2, intents, tone, topic };
}
export function teachingLabelsFromLegacy(intent) {
  return normalizeTeachingLabels({ intents: LEGACY_INTENT_MAP[intent] || ['other'] });
}
export function validateTeachingExample(text, labels) {
  const phrase = safe(text, 320);
  const normalized = normalizeTeachingLabels(labels);
  if (!phrase || !normalized.intents.length) return null;
  // Never persist obvious credentials or private access material in training examples.
  if (/(?:github_pat_|gh[pousr]_|\bsk-[a-z0-9_-]{12,}|\bAIza[a-z0-9_-]{20,}|\b(?:password|senha|token|api[ _-]*key|chave privada)\b)/i.test(phrase)) return null;
  return { text: phrase, ...normalized };
}
