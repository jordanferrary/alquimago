/**
 * Alquimago: approved offline knowledge lessons.
 *
 * No remote model calls. The user teaches facts by explicitly reviewing each
 * question-answer pair; the familiar never adds LLM output automatically.
 * Lessons stay in localStorage, isolated by site origin and namespace. This
 * deliberately DOES NOT enter a public GitHub publication or a snapshot.
 */
const lObj=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
export const LESSONS_LIMIT=64;
export const canonicalLesson=x=>String(x||'').normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ')
 .replace(/\s+/g,' ').trim()
 .replace(/\b(?:vc|vcs|voce|voces|cê)\b/g,'voce')
 .replace(/\b(?:oq|oque)\b/g,'o que')
 .replace(/\b(?:pq|porq|porque)\b/g,'por que')
 .replace(/\b(?:pra|pro)\b/g,'para')
 .replace(/\b(?:ta|tá)\b/g,'esta')
 .replace(/\b(?:eh)\b/g,'e')
 .replace(/\s+/g,' ').trim();
const lSensitive=x=>/(?:github_pat_|gh[pousr]_|AIza[a-zA-Z0-9_-]{20,}|\bsk-[A-Za-z0-9_-]{12,}|\b(?:senha|password|secret|token|api[\s_-]*key|chave privada|credential)\b)/i.test(String(x||''));
const lClean=(x,max)=>typeof x==='string'?x.trim().replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,max):'';
export function validateLesson(question,answer,source='manual'){
 const q=lClean(question,160),a=lClean(answer,800),s=lClean(source,120);
 if(q.length<4||a.length<5||lSensitive(q)||lSensitive(a)||lSensitive(s))return null;
 const canonical=canonicalLesson(q);
 if(canonical.length<3)return null;
 return {question:q,answer:a,source:s||'manual',key:canonical};
}
export function normalizeLessons(value){
 const obj=lObj(value),entries=Array.isArray(obj.lessons)?obj.lessons:[];
 const out=[],seen=new Set();
 for(const raw of entries.slice(-LESSONS_LIMIT)){
  const v=lObj(raw);
  if(v.approved!==true)continue;
  const candidate=validateLesson(v.question,v.answer,v.source);
  if(!candidate||seen.has(candidate.key))continue;
  seen.add(candidate.key);out.push({...candidate,approved:true});
 }
 return {schema:1,lessons:out};
}
export function approveLesson(library,question,answer,source='manual'){
 const lesson=validateLesson(question,answer,source);
 if(!lesson)return {ok:false,library:normalizeLessons(library),reason:'Revise a pergunta e a resposta. Não insira senhas, tokens nem dados privados.'};
 const current=normalizeLessons(library);
 const filtered=current.lessons.filter(l=>l.key!==lesson.key);
 return {ok:true,reason:'Conhecimento aprovado e salvo neste dispositivo.',
  library:{schema:1,lessons:[...filtered,{...lesson,approved:true}].slice(-LESSONS_LIMIT)}};
}
export function recallLesson(input,library){
 const query=canonicalLesson(input),items=normalizeLessons(library).lessons;
 if(!query||!items.length)return null;
 const exact=items.find(item=>item.key===query);
 if(exact)return {reply:exact.answer,intent:'approved-lesson',source:exact.source};
 // Conservative fuzzy matching: spelling, abbreviations and small rephrasings.
 // Reject short/ambiguous inputs and ties to avoid confidently wrong answers.
 const stop=new Set(['o','a','os','as','um','uma','de','do','da','dos','das','em','no','na','para','por','que','e','eu','me','meu','minha','voce','pode','poderia','favor','me','dizer']);
 const words=x=>x.split(' ').filter(t=>t.length>2&&!stop.has(t));
 const distance=(a,b)=>{
  if(Math.abs(a.length-b.length)>2)return 3;
  let prev=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){
   const next=[i];
   for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
   prev=next;
  }
  return prev[b.length];
 };
 const similar=(a,b)=>a===b||(a.length>=5&&b.length>=5&&distance(a,b)<=1);
 const queryTerms=words(query);
 if(queryTerms.length<2)return null;
 const ranked=[];
 for(const item of items){
  const terms=words(item.key);
  if(terms.length<2)continue;
  const matched=new Set();
  let count=0;
  for(const term of queryTerms){
   const index=terms.findIndex((other,i)=>!matched.has(i)&&similar(term,other));
   if(index>=0){matched.add(index);count++;}
  }
  const precision=count/queryTerms.length,recall=count/terms.length;
  const score=2*precision*recall/(precision+recall||1);
  if(score>=.83&&precision>=.8&&recall>=.8)ranked.push({item,score});
 }
 ranked.sort((a,b)=>b.score-a.score);
 if(!ranked.length||(ranked[1]&&ranked[0].score-ranked[1].score<.08))return null;
 return {reply:ranked[0].item.answer,intent:'approved-lesson',source:ranked[0].item.source};
}
export const lessonsKey=ns=>'alquimago:lessons:v1:'+(/^[a-zA-Z0-9_-]{1,48}$/.test(ns)?ns:'default');
export function readLessons(storage,namespace='default'){
 try{
  const raw=storage?.getItem(lessonsKey(namespace));
  if(!raw||raw.length>100000)return normalizeLessons(null);
  return normalizeLessons(JSON.parse(raw));
 }catch{return normalizeLessons(null);}
}
export function writeLessons(storage,namespace,library){
 try{
  if(!storage)return false;
  const raw=JSON.stringify(normalizeLessons(library));
  if(raw.length>100000)return false;
  storage.setItem(lessonsKey(namespace),raw);return true;
 }catch{return false;}
}
export function summarizeApprovedFiles(records){
 // This is a source inventory, not claims about semantics or execution.
 const items=Array.isArray(records)?records.slice(0,20):[];
 return items.filter(f=>f?.status==='read'&&typeof f.file==='string').map(f=>{
  const excerpt=typeof f.excerpt==='string'?f.excerpt.slice(0,5000):'';
  const exports=[...excerpt.matchAll(/\bexport\s+(?:default\s+)?(?:async\s+)?(?:function|class|const|let|type|interface)\s+([A-Za-z_$][\w$]*)/g)]
   .map(m=>m[1]).slice(0,16);
  const imports=[...excerpt.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g)]
   .map(m=>m[1]).slice(0,12);
  return {file:lClean(f.file,180),exports,imports,bytes:Number(f.bytes)||0,
   description:'Resumo estrutural (nomes de exports e imports). A finalidade do código deve ser confirmada pelo responsável.'};
 });
}
