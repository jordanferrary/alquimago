// Stable, origin-scoped memory keys survive deployments. Never persist credentials.
export const LEGACY_KEY='alquimago:v1';
export const MEMORY_VERSION=2;
export const memoryKey=(ns='default')=>'alquimago:memory:v2:'+(/^[\w-]{1,48}$/.test(ns)?ns:'default');
const memoryObject=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
const num=x=>typeof x==='number'&&Number.isFinite(x);
export function cleanMemory(value){
  const data=memoryObject(value),raw=memoryObject(data.brain),p=memoryObject(data.position),brain={};
  for(const k of ['energy','curiosity','focus','affinity','xp','interactions','lastSeen','sleepUntil'])
    if(num(raw[k]))brain[k]=Math.max(0,Math.min(1e12,raw[k]));
  if(typeof raw.lastAction==='string'&&['pet','play','focus','rest','study','summon'].includes(raw.lastAction))brain.lastAction=raw.lastAction;
  return {schema:2,brain,position:num(p.x)&&num(p.y)?{x:Math.max(0,Math.min(10000,p.x)),y:Math.max(0,Math.min(10000,p.y))}:null};
}
export function readMemory(storage,namespace='default'){
  try{
    const prior=storage.getItem(memoryKey(namespace));
    if(prior)return cleanMemory(JSON.parse(prior));
    if(namespace!=='default')return cleanMemory(null);
    const legacy=storage.getItem(LEGACY_KEY);
    if(!legacy)return cleanMemory(null);
    const result=cleanMemory(JSON.parse(legacy));
    writeMemory(storage,result,namespace);
    return result;
  }catch{return cleanMemory(null);}
}
export function writeMemory(storage,value,namespace='default'){
  try{storage.setItem(memoryKey(namespace),JSON.stringify(cleanMemory(value)));return true;}
  catch{return false;}
}
export function parseBackup(text){
  if(typeof text!=='string'||text.length>32768)throw Error('Arquivo de memória inválido.');
  const result=JSON.parse(text);
  if(result?.schema!==1&&result?.schema!==2)throw Error('Versão de memória incompatível.');
  return cleanMemory(result);
}
export const exportBackup=value=>JSON.stringify(cleanMemory(value),null,2);
