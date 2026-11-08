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

/**
 * User-reviewed multi-label examples are device-local. They do not publish to
 * GitHub, cannot trigger privileged actions and are not automatically sent to
 * Gemini. Ambiguous matches are intentionally ignored.
 */
export const TEACHING_EXAMPLES_LIMIT = 80;
const teachingKey = ns => 'alquimago:teaching:v2:' + (/^[a-zA-Z0-9_-]{1,48}$/.test(ns) ? ns : 'default');
export function normalizeTeachingMemory(value) {
  const examples = Array.isArray(value?.examples) ? value.examples : [];
  const output = [], seen = new Set();
  for (const item of examples.slice(-TEACHING_EXAMPLES_LIMIT)) {
    if (!item || item.approved !== true) continue;
    const valid = validateTeachingExample(item.text, item);
    const key = valid && canonicalTeachingText(valid.text);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push({...valid, approved: true});
  }
  return {schema: 2, examples: output};
}
export function approveTeachingExample(memory, text, labels) {
  const valid = validateTeachingExample(text, labels);
  if (!valid) return {ok:false, memory:normalizeTeachingMemory(memory), reason:'Selecione um significado e não inclua informações privadas.'};
  const current = normalizeTeachingMemory(memory);
  const key = canonicalTeachingText(valid.text);
  return {
    ok:true,
    memory:{schema:2,examples:[...current.examples.filter(item=>canonicalTeachingText(item.text)!==key),{...valid,approved:true}].slice(-TEACHING_EXAMPLES_LIMIT)}
  };
}
export function readTeachingExamples(storage, namespace='default') {
  try {
    const value = storage?.getItem(teachingKey(namespace));
    return value && value.length<=90000 ? normalizeTeachingMemory(JSON.parse(value)) : normalizeTeachingMemory(null);
  } catch { return normalizeTeachingMemory(null); }
}
export function writeTeachingExamples(storage, namespace, memory) {
  try {
    if (!storage) return false;
    const value = JSON.stringify(normalizeTeachingMemory(memory));
    if (value.length>90000) return false;
    storage.setItem(teachingKey(namespace),value);
    return true;
  } catch {return false;}
}
export function canonicalTeachingText(input) {
  return String(input||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()
    .replace(/\b(?:vc|vcs)\b/g,'voce').replace(/\bnn\b/g,'nao')
    .replace(/\b(?:pq|porq)\b/g,'porque').replace(/\b(?:oq|oque)\b/g,'o que');
}
export function recognizeTeachingLabels(message, memory) {
  const q = canonicalTeachingText(message), examples=normalizeTeachingMemory(memory).examples;
  if (!q || q.length<5) return null;
  const qTokens=q.split(' ').filter(w=>w.length>2);
  if (qTokens.length<2) return null;
  let best=null,score=0,tied=false;
  for (const example of examples) {
    const p=canonicalTeachingText(example.text);
    if (p===q) return {intents:example.intents,tone:example.tone,topic:example.topic,confidence:1};
    const tokens=p.split(' ').filter(w=>w.length>2);
    if (tokens.length<2) continue;
    const seen=new Set();let matched=0;
    for (const a of qTokens) {
      const i=tokens.findIndex((b,i)=>!seen.has(i)&&(a===b||(a.length>=5&&b.length>=5&&a.length===b.length&&[...a].filter((c,j)=>c!==b[j]).length===1)));
      if (i>=0) {seen.add(i);matched++;}
    }
    const precision=matched/qTokens.length,recall=matched/tokens.length;
    const similarity=2*precision*recall/(precision+recall||1);
    if (similarity>.86 && similarity>score+.05) {score=similarity;best=example;tied=false;}
    else if (similarity>.86 && Math.abs(similarity-score)<=.05) tied=true;
  }
  return best&&!tied?{intents:best.intents,tone:best.tone,topic:best.topic,confidence:score}:null;
}
