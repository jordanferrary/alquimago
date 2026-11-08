/**
 * Pragmatic language bridge for the local Alquimago.
 *
 * Teaching meanings is not learning a language model. These safe, conservative
 * social responses and optional phrasings use only user-approved examples,
 * the current explicit message, and bounded conversation context.
 *
 * Never converts learned labels into commands, facts or unreviewed lessons.
 */
import {canonicalTeachingText,normalizeTeachingMemory,recognizeTeachingLabels} from './teaching-intents.mjs';

const norm=x=>canonicalTeachingText(String(x||''));
const questionText=x=>/[?¿]/.test(x)||/\b(?:quem|quando|onde|como|quanto|quantos|qual|quais|por que|porque|explique|me diga|sera que|poderia|voce sabe)\b/.test(norm(x));
const negativeText=x=>/\b(?:nao|nem|nunca|jamais|ninguem|nada|problema|erro|errei|fracassei|perdi|falhou|deu errado|triste|ruim|pessimo|odiei|reprovad[oa])\b/.test(norm(x));
const instructionText=x=>/\b(?:abra|abrir|envie|mandar|delete|apague|remova|edite|publique|publicar|clique|acesse|execute|rode|instale|crie|faça|mude|altere|copie|desative)\b/.test(norm(x));
const safePhrase=x=>typeof x==='string'&&x.trim().length>=3&&x.trim().length<=55&&
 /^[\p{L}\p{M}\s!?.,'-]+$/u.test(x.trim())&&!questionText(x)&&!instructionText(x)&&
 !negativeText(x)&&norm(x).split(' ').length<=7;

export function learnedSocialResponse(message,meaning,context={}){
 const phrase=String(message||'').trim(),label=meaning&&typeof meaning==='object'?meaning:null;
 if(!label||Number(label.confidence)<.93||phrase.length>110||questionText(phrase)||instructionText(phrase))return null;
 const intents=Array.isArray(label.intents)?label.intents:[];
 const has=x=>intents.includes(x);
 // Multi-intent messages with instructions/questions must not become fake
 // affection or a privileged action just because praise is also present.
 if(has('command')||has('instruction')||has('request')||has('question')||
    has('teaching')||has('correction')||has('clarification'))return null;
 if(has('reprimand')||has('disagreement')){
  return {intent:'learned-social',source:'approved-meaning',reply:
   'Entendi que você não concordou ou não gostou da resposta. Qual parte devo corrigir? Quero considerar sua explicação.'};
 }
 if(has('praise')){
  return {intent:'learned-social',source:'approved-meaning',reply:
   'Que bom que você gostou! ✦ O que chamou mais sua atenção?'};
 }
 if(has('thanks')){
  return {intent:'learned-social',source:'approved-meaning',reply:
   'Por nada! Se quiser, podemos continuar trabalhando nessa ideia. ✦'};
 }
 if(has('farewell'))return {intent:'learned-social',source:'approved-meaning',reply:'Até a próxima! ✦'};
 if(has('greeting'))return {intent:'learned-social',source:'approved-meaning',reply:'Olá! O que vamos criar hoje? ✦'};
 if(has('agreement'))return {intent:'learned-social',source:'approved-meaning',reply:
   'Que bom que estamos alinhados. Podemos continuar por esse caminho.'};
 if(has('apology'))return {intent:'learned-social',source:'approved-meaning',reply:
   'Tudo bem. Podemos continuar de onde paramos.'};
 // Labels alone do not prove the factual subject of an emotional utterance.
 return null;
}

/**
 * Reuse a short learned phrase only after an explicit, positive achievement.
 * Never copy questions, instructions, private information, or long comments
 * into the familiar's own speech. No auto-publishing or cross-user sharing.
 */
export function learnedMilestoneResponse(message,memory){
 const raw=String(message||'').trim(),q=norm(raw);
 if(!raw||raw.length>180||questionText(raw)||negativeText(raw)||instructionText(raw))return null;
 const achieved=/\b(?:terminei|finalizei|conclui|completei|publiquei|lancei|entreguei|terminei de|acabei de terminar|consegui finalizar|consegui concluir|terminei meu|finalizei meu)\b/.test(q);
 if(!achieved)return null;
 const examples=normalizeTeachingMemory(memory).examples;
 const candidates=examples.filter(e=>e.approved===true&&e.intents.includes('praise')&&
    !e.intents.some(i=>['reprimand','disagreement','question','command','instruction','correction'].includes(i))&&safePhrase(e.text));
 const learned=candidates.length?candidates[candidates.length-1].text.trim():null;
 // A learned phrase is optional: the milestone response works without it.
 const expression=learned?learned[0].toLocaleUpperCase('pt-BR')+learned.slice(1):'Muito bom!';
 const prefix=/[.!?]$/.test(expression)?expression:expression+'!';
 const context=/\b(?:modelagem|escultura|blender|personagem|textura|rig|animacao|render|arte|obra)\b/.test(q)
  ?'Você concluiu uma etapa criativa. Quer pensar em como apresentá-la no portfólio?'
  :/\b(?:site|portfolio|pagina|projeto|jogo)\b/.test(q)
   ?'Você avançou no seu projeto. Quer revisar o resultado ou organizar o próximo passo?'
   :'Você concluiu algo importante para o seu trabalho. Qual será a próxima etapa?';
 return {intent:'learned-milestone',source:learned?'approved-meaning':'local-context',reply:prefix+' '+context};
}

export function respondUsingApprovedMeanings(input,memory,context={}){
 // Original teaching records are retained, including those saved before this
 // bridge was introduced. No migration or new consent step is necessary.
 const meaning=recognizeTeachingLabels(input,memory);
 return learnedSocialResponse(input,meaning,context)||learnedMilestoneResponse(input,memory);
}
