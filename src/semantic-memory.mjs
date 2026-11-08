/**
 * Verified semantic memory built ONLY from user-approved lessons.
 * Conservative extraction: no unsupported multi-hop claims or model output.
 */
import {canonicalLesson,normalizeLessons} from './learning.mjs';
const clean=x=>String(x||'').trim().replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,180);
const subjects=x=>canonicalLesson(x).replace(/^(?:o que e|quem e|explique|me explique|qual e|pra que serve|para que serve|como funciona)\s+/,'').replace(/\s+(?:e|serve para|funciona).*$/,'').trim();
export function buildSemanticMemory(library){
 const nodes=[],seen=new Set();
 for(const lesson of normalizeLessons(library).lessons){
  const answer=clean(lesson.answer);
  const match=answer.match(/^(.{3,65}?)\s+(é|serve para|permite|ajuda a)\s+(.{4,160}?)[.!?]?$/i);
  if(!match)continue;
  const subject=subjects(match[1]);
  const relation=match[2].toLowerCase();
  const object=clean(match[3]).replace(/[.!?]+$/,'');
  if(!subject||subject.split(' ').length>6||object.length<4)continue;
  const key=subject+'|'+relation+'|'+canonicalLesson(object);
  if(seen.has(key))continue;
  seen.add(key);nodes.push({subject,relation,object,source:lesson.source,approved:true});
 }
 return nodes.slice(-64);
}
export function answerFromSemanticMemory(question,library){
 const q=canonicalLesson(question);
 if(!q||q.length<8)return null;
 const relation=/\b(?:serve para|pra que|para que|utilidade|funcao)\b/.test(q)?'purpose':
  /\b(?:o que|oque|quem|defina|definicao|explique)\b/.test(q)?'definition':null;
 if(!relation)return null;
 const nodes=buildSemanticMemory(library).filter(n=>
  (relation==='purpose'?n.relation==='serve para':n.relation==='é')&&
  q.includes(n.subject)&&n.subject.length>=4
 );
 if(nodes.length!==1)return null;
 const n=nodes[0];
 return {reply:n.subject+' '+n.relation+' '+n.object+'.',intent:'semantic-memory',source:n.source};
}
