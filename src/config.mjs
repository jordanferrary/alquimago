// Declarative, same-origin public configuration. JSON is never executable.
export const DEFAULT_CONFIG = Object.freeze({
  schemaVersion:1,
  identity:{name:'Alquimago',subtitle:'Familiar arcano • memória local',greeting:'Olá! Sou seu familiar arcano.'},
  appearance:{accent:'#b58aff',gold:'#f9d891',position:'bottom-right',skin:{type:'svg'},skins:[{id:'padrao',label:'Alquimago padrão',type:'svg'}],selectedSkin:'padrao'},
  language:{code:'pt-BR',file:''},
  proactive:{projectHover:true,delayMs:1000,cooldownMs:45000},
  behavior:{enabled:true,mode:'equilibrado',minIntervalMs:120000,maxPerDay:4,toy:true},
  commands:{publishPhrase:'vai comprar pão'},
  knowledge:{file:''},
  llm:{provider:'gemini',enabled:false,endpoint:'',consentRequired:true},
  features:{actions:true,pageAudit:true,routes:true,assistants:true,memoryTools:true,dragging:true,projectFiles:true,dialogue:true},
  memory:{namespace:'default',remoteSnapshot:'',mode:'local'},
  project:{files:[]},
  messages:{pet:'Um brilho de amizade arcana! ✧',stroke:'Que carinho agradável! ✧',play:'Prepare-se: poção de diversão!',brew:'Elixir mágico concluído! ⚗',explore:'Rota estudada pelo familiar. ✦',focus:'Concentração ativada. 🜁',rest:'Meditando por alguns instantes.',study:'Analisando a energia da página.'},
  assistant:{projectContext:'',guidelines:[]}
});
const obj = x => x && typeof x==='object' && !Array.isArray(x) ? x : {};
const txt = (x, fallback, limit=160) => typeof x==='string' && x.trim() ? x.trim().slice(0,limit) : fallback;
const hex = (x, fallback) => typeof x==='string' && /^#[\da-fA-F]{6}$/.test(x) ? x : fallback;
export function normalizeConfig(input){
  const data=obj(input), d=DEFAULT_CONFIG;
  const id=obj(data.identity), app=obj(data.appearance), features=obj(data.features);
  const memory=obj(data.memory), project=obj(data.project), messages=obj(data.messages), agent=obj(data.assistant);
  const language=obj(data.language),proactive=obj(data.proactive);
  const behavior=obj(data.behavior),commands=obj(data.commands);
  const knowledge=obj(data.knowledge),llm=obj(data.llm);
  const skins=Array.isArray(app.skins)?app.skins.slice(0,12).filter(entry=>
    entry&&typeof entry==='object'&&!Array.isArray(entry)&&
    typeof entry.id==='string'&&/^[a-zA-Z0-9_-]{1,35}$/.test(entry.id)
  ).map(entry=>({
    id:entry.id,
    label:txt(entry.label,entry.id,60),
    type:['svg','image','model3d'].includes(entry.type)?entry.type:'svg',
    src:typeof entry.src==='string'?entry.src.slice(0,500):'',
    shapeKeys:obj(entry.shapeKeys)
  })):[];
  const validSkins=skins.length?skins:d.appearance.skins;
  const selectedSkin=validSkins.some(x=>x.id===app.selectedSkin)?app.selectedSkin:validSkins[0].id;
  return {
    schemaVersion:1,
    identity:{name:txt(id.name,d.identity.name,40),subtitle:txt(id.subtitle,d.identity.subtitle,95),greeting:txt(id.greeting,d.identity.greeting,170)},
    appearance:{accent:hex(app.accent,d.appearance.accent),gold:hex(app.gold,d.appearance.gold),position:['bottom-right','bottom-left'].includes(app.position)?app.position:d.appearance.position,skin:obj(app.skin),skins:validSkins,selectedSkin},
    language:{code:txt(language.code,'pt-BR',32),file:typeof language.file==='string'?language.file.trim().slice(0,500):''},
    proactive:{projectHover:proactive.projectHover!==false,delayMs:typeof proactive.delayMs==='number'?Math.max(550,Math.min(4000,proactive.delayMs)):1000,cooldownMs:typeof proactive.cooldownMs==='number'?Math.max(20000,Math.min(600000,proactive.cooldownMs)):45000},
    behavior:{
      enabled:behavior.enabled!==false,
      mode:['silencioso','equilibrado','brincalhao'].includes(behavior.mode)?behavior.mode:'equilibrado',
      minIntervalMs:typeof behavior.minIntervalMs==='number'&&Number.isFinite(behavior.minIntervalMs)?Math.max(45000,Math.min(900000,behavior.minIntervalMs)):120000,
      maxPerDay:typeof behavior.maxPerDay==='number'&&Number.isFinite(behavior.maxPerDay)?Math.max(0,Math.min(8,Math.floor(behavior.maxPerDay))):4,
      toy:behavior.toy!==false
    },
    features:Object.fromEntries(Object.entries(d.features).map(([key,defaultValue])=>[key,typeof features[key]==='boolean'?features[key]:defaultValue])),
    memory:{namespace:typeof memory.namespace==='string'&&/^[\w-]{1,48}$/.test(memory.namespace)?memory.namespace:'default',remoteSnapshot:typeof memory.remoteSnapshot==='string'?memory.remoteSnapshot.trim().slice(0,512):'',mode:memory.mode==='publish'?'publish':'local'},
    project:{files:Array.isArray(project.files)?[...new Set(project.files.filter(x=>typeof x==='string'&&x.length<512))].slice(0,12):[]},
    commands:{publishPhrase:txt(commands.publishPhrase,d.commands.publishPhrase,80)},
    knowledge:{file:typeof knowledge.file==='string'?knowledge.file.trim().slice(0,500):''},
    llm:{provider:'gemini',enabled:llm.enabled===true,endpoint:typeof llm.endpoint==='string'?llm.endpoint.trim().slice(0,500):'',consentRequired:true},
    messages:Object.fromEntries(Object.entries(d.messages).map(([key,defaultValue])=>[key,txt(messages[key],defaultValue,170)])),
    assistant:{
      projectContext:typeof agent.projectContext==='string'?agent.projectContext.trim().slice(0,700):'',
      guidelines:Array.isArray(agent.guidelines)?agent.guidelines.filter(x=>typeof x==='string'&&x.trim()).slice(0,12).map(x=>x.trim().slice(0,220)):[]
    }
  };
}
export async function loadConfig(path,{origin,base,fetcher}={}){
  if(!path)return normalizeConfig(null);
  const site=origin||globalThis.location?.origin;
  const target=new URL(path,base||globalThis.location?.href||'https://example.invalid/');
  if(!['https:','http:'].includes(target.protocol)||(site&&target.origin!==site))throw Error('A configuração deve estar na mesma origem do site.');
  const reader=fetcher||globalThis.fetch;
  if(typeof reader!=='function')return normalizeConfig(null);
  const response=await reader(target.href,{credentials:'same-origin',cache:'no-store'});
  if(!response.ok)throw Error('Configuração indisponível.');
  const body=await response.text();
  if(body.length>32768)throw Error('Configuração muito grande.');
  const parsed=JSON.parse(body);
  if(parsed?.schemaVersion!==undefined&&parsed.schemaVersion!==1)throw Error('Versão de configuração incompatível.');
  return normalizeConfig(parsed);
}
