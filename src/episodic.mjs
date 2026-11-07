// Tiny contextual preference learner, independent of chat and user identity.
// Only numerical feedback per broad art category; never stores project titles.
const BUCKETS=['character','environment','game','stylized','motion','general'];
export function artBucket(category){
 const c=String(category||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(/character|personagem|sculpt|criatura/.test(c))return 'character';
 if(/environment|ambiente|cenario|scene/.test(c))return 'environment';
 if(/game|jogo|interactiv|interativ/.test(c))return 'game';
 if(/stylized|estilizado|asset|prop|handpaint/.test(c))return 'stylized';
 if(/motion|animation|animacao|anim/.test(c))return 'motion';
 return 'general';
}
export function blankPreferences(){return {version:1,weights:{}};}
export function cleanPreferences(value){
 const raw=value&&typeof value==='object'?value.weights:null;
 const weights={};
 if(raw&&typeof raw==='object')for(const [bucket,entries] of Object.entries(raw)){
  if(!BUCKETS.includes(bucket)||!entries||typeof entries!=='object')continue;
  weights[bucket]={};
  for(const [index,value] of Object.entries(entries)){
   if(!/^[0-4]$/.test(index)||typeof value!=='number'||!Number.isFinite(value))continue;
   weights[bucket][index]=Math.max(-8,Math.min(8,value));
  }
 }
 return {version:1,weights};
}
export function rankTips(tips,category,preferences){
 const bucket=artBucket(category),weights=cleanPreferences(preferences).weights[bucket]||{};
 return (Array.isArray(tips)?tips:[]).map((text,index)=>({text,index,score:weights[index]||0}))
  .sort((a,b)=>b.score-a.score||a.index-b.index);
}
export function learnTip(preferences,category,index,useful){
 const next=cleanPreferences(preferences),bucket=artBucket(category);
 if(!Number.isInteger(index)||index<0||index>4)return next;
 const values={...(next.weights[bucket]||{})};
 const old=values[index]||0;
 // Repeated ratings have diminishing effect and never create an endless feed.
 values[index]=Math.max(-8,Math.min(8,old+(useful?1:-1)));
 next.weights[bucket]=values;
 return next;
}
export function readPreferences(storage,namespace='default'){
 try{
  const name=/^[\w-]{1,48}$/.test(namespace)?namespace:'default';
  return cleanPreferences(JSON.parse(storage.getItem('alquimago:prefs:v1:'+name)||'null'));
 }catch{return blankPreferences();}
}
export function writePreferences(storage,namespace,preferences){
 try{
  const name=/^[\w-]{1,48}$/.test(namespace)?namespace:'default';
  storage.setItem('alquimago:prefs:v1:'+name,JSON.stringify(cleanPreferences(preferences)));
  return true;
 }catch{return false;}
}
