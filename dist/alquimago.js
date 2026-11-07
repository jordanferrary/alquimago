/* ALQUIMAGO v0.3 • MIT */
(() => {
"use strict";
// Alquimago 0.3 — symbolic familiar brain, not a language model.
// XP rewards exploration/meaningful discovery rather than repetitive clicking.
const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
const DEFAULT_BRAIN=Object.freeze({
  energy:75,curiosity:58,focus:38,affinity:45,
  xp:0,interactions:0,lastAction:'summon',lastSeen:0,sleepUntil:0,
  lastRewardAt:0,lastRewardAction:'',rewardedPages:{}
});
const ACTIONS={
 pet:{energy:1,curiosity:0,focus:-1,affinity:3,xp:0},
 stroke:{energy:2,curiosity:1,focus:-2,affinity:5,xp:0},
 play:{energy:-8,curiosity:7,focus:-4,affinity:2,xp:2},
 focus:{energy:-3,curiosity:-1,focus:11,affinity:1,xp:2},
 rest:{energy:16,curiosity:0,focus:-2,affinity:0,xp:0},
 study:{energy:-2,curiosity:4,focus:5,affinity:0,xp:2},
 brew:{energy:-6,curiosity:5,focus:7,affinity:2,xp:3},
 explore:{energy:-1,curiosity:4,focus:1,affinity:1,xp:4},
 publish:{energy:-2,curiosity:3,focus:4,affinity:2,xp:10}
};
function restoreBrain(raw){
 const data=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const result={...DEFAULT_BRAIN,rewardedPages:{}};
 for(const key of ['energy','curiosity','focus','affinity'])
  if(typeof data[key]==='number'&&Number.isFinite(data[key]))result[key]=clamp(data[key]);
 for(const key of ['xp','interactions','lastSeen','sleepUntil','lastRewardAt'])
  if(typeof data[key]==='number'&&Number.isFinite(data[key]))result[key]=clamp(data[key],0,1e12);
 if(typeof data.lastAction==='string'&&Object.hasOwn(ACTIONS,data.lastAction))result.lastAction=data.lastAction;
 if(typeof data.lastRewardAction==='string')result.lastRewardAction=data.lastRewardAction.slice(0,40);
 const pages=data.rewardedPages&&typeof data.rewardedPages==='object'?data.rewardedPages:{};
 for(const [key,value] of Object.entries(pages).slice(-80)){
  if(/^[A-Za-z0-9_.#%-]{1,120}$/.test(key)&&typeof value==='number'&&Number.isFinite(value))
   result.rewardedPages[key]=clamp(value,0,1e12);
 }
 return result;
}
function applyAction(brain,name,now=Date.now(),detail=''){
 if(!Object.hasOwn(ACTIONS,name))return restoreBrain(brain);
 const next=restoreBrain(brain),action=ACTIONS[name];
 for(const key of ['energy','curiosity','focus','affinity'])next[key]=clamp(next[key]+action[key]);
 next.interactions=clamp(next.interactions+1,0,1e12);
 next.lastAction=name;next.lastSeen=now;
 next.sleepUntil=name==='rest'?now+3000:0;
 // No XP for petting, rest or passive UI changes. Other actions have cooldown.
 let earned=0;
 if(name==='explore'||name==='publish'){
  const safe=typeof detail==='string'&&/^[A-Za-z0-9_.#%-]{1,120}$/.test(detail)?detail:'';
  // Route XP once per day; each confirmed publication revision rewards once.
  const day=Math.floor(now/86400000);
  if(safe&&(name==='publish'?!Object.hasOwn(next.rewardedPages,safe):next.rewardedPages[safe]!==day)){
    earned=action.xp;next.rewardedPages[safe]=day;
  }
 }else if(action.xp>0){
  // 60s between rewards of the same action; 20s global spacing.
  const gap=now-next.lastRewardAt;
  if(gap>=20000&&(name!==next.lastRewardAction||gap>=60000))earned=action.xp;
 }
 if(earned){
  next.xp=clamp(next.xp+earned,0,1e12);
  next.lastRewardAt=now;next.lastRewardAction=name;
 }
 return next;
}
function passTime(brain,elapsedMs,now=Date.now()){
 const next=restoreBrain(brain),minutes=clamp(elapsedMs/60000,0,30);
 next.energy=clamp(next.energy+minutes*.55);
 next.curiosity=clamp(next.curiosity+minutes*.15);
 next.focus=clamp(next.focus-minutes*.22);
 next.lastSeen=now;
 return next;
}
function currentMood(brain,now=Date.now()){
 const b=restoreBrain(brain);
 if(b.sleepUntil>now)return 'meditando';
 if(b.energy<=23)return 'sonolento';
 if(['pet','stroke'].includes(b.lastAction)&&now-b.lastSeen<4500)return 'feliz';
 if(['play','brew'].includes(b.lastAction)&&now-b.lastSeen<4500)return 'animado';
 if(b.focus>=65&&b.lastAction==='focus')return 'concentrado';
 if(b.curiosity>=68)return 'curioso';
 return 'tranquilo';
}
function levelFromXp(xp){return Math.max(1,Math.floor(Math.sqrt(Math.max(0,xp)/8))+1);}

// Declarative, same-origin public configuration. JSON is never executable.
const DEFAULT_CONFIG = Object.freeze({
  schemaVersion:1,
  identity:{name:'Alquimago',subtitle:'Familiar arcano • memória local',greeting:'Olá! Sou seu familiar arcano.'},
  appearance:{accent:'#b58aff',gold:'#f9d891',position:'bottom-right'},
  features:{actions:true,pageAudit:true,routes:true,assistants:true,memoryTools:true,dragging:true,projectFiles:true},
  memory:{namespace:'default',remoteSnapshot:''},
  project:{files:[]},
  messages:{pet:'Um brilho de amizade arcana! ✧',stroke:'Que carinho agradável! ✧',play:'Prepare-se: poção de diversão!',brew:'Elixir mágico concluído! ⚗',explore:'Rota estudada pelo familiar. ✦',focus:'Concentração ativada. 🜁',rest:'Meditando por alguns instantes.',study:'Analisando a energia da página.'},
  assistant:{projectContext:'',guidelines:[]}
});
const obj = x => x && typeof x==='object' && !Array.isArray(x) ? x : {};
const txt = (x, fallback, limit=160) => typeof x==='string' && x.trim() ? x.trim().slice(0,limit) : fallback;
const hex = (x, fallback) => typeof x==='string' && /^#[\da-fA-F]{6}$/.test(x) ? x : fallback;
function normalizeConfig(input){
  const data=obj(input), d=DEFAULT_CONFIG;
  const id=obj(data.identity), app=obj(data.appearance), features=obj(data.features);
  const memory=obj(data.memory), project=obj(data.project), messages=obj(data.messages), agent=obj(data.assistant);
  return {
    schemaVersion:1,
    identity:{name:txt(id.name,d.identity.name,40),subtitle:txt(id.subtitle,d.identity.subtitle,95),greeting:txt(id.greeting,d.identity.greeting,170)},
    appearance:{accent:hex(app.accent,d.appearance.accent),gold:hex(app.gold,d.appearance.gold),position:['bottom-right','bottom-left'].includes(app.position)?app.position:d.appearance.position},
    features:Object.fromEntries(Object.entries(d.features).map(([key,defaultValue])=>[key,typeof features[key]==='boolean'?features[key]:defaultValue])),
    memory:{namespace:typeof memory.namespace==='string'&&/^[\w-]{1,48}$/.test(memory.namespace)?memory.namespace:'default',remoteSnapshot:typeof memory.remoteSnapshot==='string'?memory.remoteSnapshot.trim().slice(0,512):''},
    project:{files:Array.isArray(project.files)?[...new Set(project.files.filter(x=>typeof x==='string'&&x.length<512))].slice(0,12):[]},
    messages:Object.fromEntries(Object.entries(d.messages).map(([key,defaultValue])=>[key,txt(messages[key],defaultValue,170)])),
    assistant:{
      projectContext:typeof agent.projectContext==='string'?agent.projectContext.trim().slice(0,700):'',
      guidelines:Array.isArray(agent.guidelines)?agent.guidelines.filter(x=>typeof x==='string'&&x.trim()).slice(0,12).map(x=>x.trim().slice(0,220)):[]
    }
  };
}
async function loadConfig(path,{origin,base,fetcher}={}){
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

// Stable, origin-scoped memory keys survive deployments. Never persist credentials.
const LEGACY_KEY='alquimago:v1';
const MEMORY_VERSION=2;
const memoryKey=(ns='default')=>'alquimago:memory:v2:'+(/^[\w-]{1,48}$/.test(ns)?ns:'default');
const memoryObject=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
const num=x=>typeof x==='number'&&Number.isFinite(x);
function cleanMemory(value){
  const data=memoryObject(value),raw=memoryObject(data.brain),p=memoryObject(data.position),brain={};
  for(const k of ['energy','curiosity','focus','affinity','xp','interactions','lastSeen','sleepUntil','lastRewardAt'])
    if(num(raw[k]))brain[k]=Math.max(0,Math.min(1e12,raw[k]));
  if(typeof raw.lastAction==='string'&&['pet','stroke','play','focus','rest','study','brew','explore','summon'].includes(raw.lastAction))brain.lastAction=raw.lastAction;
  if(typeof raw.lastRewardAction==='string'&&raw.lastRewardAction.length<40)brain.lastRewardAction=raw.lastRewardAction;
  if(raw.rewardedPages&&typeof raw.rewardedPages==='object'){
    brain.rewardedPages=Object.fromEntries(Object.entries(raw.rewardedPages).filter(([key,value])=>/^[A-Za-z0-9_.#%-]{1,120}$/.test(key)&&typeof value==='number'&&Number.isFinite(value)).slice(-80));
  }
  return {schema:2,brain,position:num(p.x)&&num(p.y)?{x:Math.max(0,Math.min(10000,p.x)),y:Math.max(0,Math.min(10000,p.y))}:null};
}
function readMemory(storage,namespace='default'){
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
function writeMemory(storage,value,namespace='default'){
  try{storage.setItem(memoryKey(namespace),JSON.stringify(cleanMemory(value)));return true;}
  catch{return false;}
}
function parseBackup(text){
  if(typeof text!=='string'||text.length>32768)throw Error('Arquivo de memória inválido.');
  const result=JSON.parse(text);
  if(result?.schema!==1&&result?.schema!==2)throw Error('Versão de memória incompatível.');
  return cleanMemory(result);
}
const exportBackup=value=>JSON.stringify(cleanMemory(value),null,2);

// Read-only inspection of explicit public file URLs. Not a filesystem scanner.
const EXT=/\.(?:txt|md|json|csv|html|css|js|mjs|ts|tsx)$/i;
const FORBIDDEN=/(?:^|\/)(?:\.git|\.env(?:\.|$)|secrets?|private|credentials?)(?:\/|\.|$)/i;
function resolveProjectFile(value,pageUrl){
  if(typeof value!=='string'||!value.trim()||value.length>512)return null;
  try{
    const u=new URL(value,pageUrl),host=new URL(pageUrl);
    if(!/^https?:$/.test(u.protocol)||u.origin!==host.origin||!EXT.test(u.pathname)||FORBIDDEN.test(u.pathname)||u.username||u.password)return null;
    return u.href;
  }catch{return null;}
}
async function inspectProjectFiles(list,{pageUrl,fetcher,maxBytes=64000}={}){
  const reader=fetcher||globalThis.fetch,base=pageUrl||globalThis.location?.href;
  if(!base||typeof reader!=='function')return [];
  const files=[...new Set((Array.isArray(list)?list:[]).filter(x=>typeof x==='string'&&x.trim()))].slice(0,12);
  const results=[];
  for(const file of files){
    const url=resolveProjectFile(file,base);
    if(!url){results.push({file,status:'blocked'});continue;}
    try{
      const response=await reader(url,{credentials:'same-origin',redirect:'error',cache:'no-store'});
      if(!response.ok){results.push({file,status:'unavailable'});continue;}
      const size=Number(response.headers?.get?.('content-length'));
      if(Number.isFinite(size)&&size>maxBytes){results.push({file,status:'oversized'});continue;}
      const buffer=await response.arrayBuffer();
      if(buffer.byteLength>maxBytes){results.push({file,status:'oversized'});continue;}
      results.push({file,status:'read',bytes:buffer.byteLength,excerpt:new TextDecoder().decode(buffer).slice(0,2000)});
    }catch{results.push({file,status:'unavailable'});}
  }
  return results;
}

// Privacy-preserving UI awareness: DOM metadata and public routes only.
// Never inspect input values, textarea contents, credentials or chats.
function routeSignature(url){
 try{const u=new URL(url);return (u.pathname+u.hash).slice(0,120);}catch{return '/';}
}
function readPublicPage(doc,locationUrl){
 const u=new URL(locationUrl),ids=[...doc.querySelectorAll('[id]')].map(x=>x.id);
 const imgs=[...doc.querySelectorAll('img')];
 const hash=(u.hash||'').toLowerCase();
 const route=hash.includes('contato')||hash.includes('contact')?'contact':
  hash.includes('portfolio')||hash.includes('gallery')?'gallery':
  hash.includes('sobre')||hash.includes('about')?'about':
  hash.includes('project/')?'project':
  hash.includes('page/')?'custom':'home';
 const editorial=!!doc.querySelector('.studio-dock,.studio-dock-root,[data-studio],.editor-overlay,.editor-panel');
 const heading=doc.querySelector('h1');
 const labels=[...doc.querySelectorAll('button')].filter(x=>!x.getAttribute('aria-label')&&!x.textContent.trim()).length;
 const metadata={
  route,signature:routeSignature(locationUrl),title:String(doc.title||'').slice(0,100),
  heading:!!heading,images:imgs.length,missingAlt:imgs.filter(i=>!i.hasAttribute('alt')).length,
  brokenImages:imgs.filter(i=>i.complete&&i.naturalWidth===0&&i.currentSrc).length,
  duplicateIds:ids.length-new Set(ids).size,unlabeledButtons:labels,
  links:doc.querySelectorAll('a[href]').length,editorial
 };
 return metadata;
}
function suggestionsFromPage(page){
 if(!page)return [];
 const suggestions=[];
 const push=(id,title,description)=>suggestions.push({id,title,description});
 if(page.missingAlt)push('alt','Imagens sem descrição',page.missingAlt+' imagem(ns) sem atributo alt. Revise a acessibilidade.');
 if(page.brokenImages)push('broken','Imagens com erro',page.brokenImages+' mídia(s) não carregaram corretamente nesta página.');
 if(page.duplicateIds)push('ids','IDs repetidos',page.duplicateIds+' identificador(es) duplicados podem atrapalhar links e acessibilidade.');
 if(!page.heading)push('heading','Hierarquia da página','A página atual não possui título principal (h1).');
 if(page.unlabeledButtons)push('buttons','Botões sem nome',page.unlabeledButtons+' botão(ões) sem rótulo acessível.');
 const labels={
  home:['Destaques da página','Confira se a chamada principal conduz à obra certa.'],
  gallery:['Galeria de projetos','Revise o enquadramento das capas em telas menores.'],
  project:['Apresentação do projeto','Verifique o ritmo entre imagens, descrição e detalhes da obra.'],
  contact:['Página de contato','Confira links de redes sociais e o espaço ocupado na tela.'],
  about:['Página sobre','Reforce o que torna a trajetória e as habilidades relevantes.'],
  custom:['Página personalizada','Revise se os blocos estão claros e têm bons pontos de ação.']
 };
 const [title,description]=labels[page.route]||labels.home;
 push('route',title,description);
 if(page.editorial)push('editor','Modo de edição','Há controles do editor na página. Revise a prévia antes de publicar.');
 return suggestions.slice(0,6);
}
function samePageSignature(a,b){
 return !!a&&!!b&&a.signature===b.signature&&a.images===b.images&&
 a.missingAlt===b.missingAlt&&a.brokenImages===b.brokenImages&&
 a.duplicateIds===b.duplicateIds&&a.unlabeledButtons===b.unlabeledButtons&&
 a.editorial===b.editorial;
}






const TAG = 'alquimago-familiar';
const STYLE = `
:host([data-position="bottom-left"]){right:auto;left:22px}
.tabs{overflow-x:auto}.tab{min-width:46px;padding:7px 4px}
:host{all:initial;position:fixed;z-index:2147483000;right:22px;bottom:20px;color:#f5eaff;font:13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;--violet:#b58aff;--ink:#17101f;--gold:#f9d891;user-select:none;box-sizing:border-box}
:host([data-mode="desktop"]){position:relative;right:auto;bottom:auto;display:block;width:100%;height:100%}
*{box-sizing:border-box}
.shell{position:relative;display:flex;align-items:flex-end;flex-direction:column;gap:6px;filter:drop-shadow(0 8px 21px #13082258)}
:host([data-mode="desktop"]) .shell{width:100%;align-items:center;padding-top:26px}
.character{appearance:none;border:0;background:transparent;width:116px;height:143px;padding:0;cursor:grab;position:relative;touch-action:none;transform-origin:bottom center;animation:levitate 3.4s ease-in-out infinite}
.character:focus-visible,.action:focus-visible,.menu:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.character:active{cursor:grabbing}
.character svg{width:116px;height:143px;overflow:visible}
.character .eyes{animation:blink 6.3s infinite;transform-origin:center}
.character[data-mood="meditando"] .eyes,.character[data-mood="sonolento"] .eyes{transform:scaleY(.18);animation:none}
.character[data-mood="animado"]{animation:levitate 1.5s ease-in-out infinite}
.character[data-mood="concentrado"] .rune{animation:spin 4s linear infinite;transform-origin:58px 91px}
.familiar-title{display:flex;gap:7px;align-items:center;border:1px solid #a67fdd69;background:linear-gradient(110deg,#24162fea,#3e275be9);color:#f5e8ff;border-radius:999px;box-shadow:0 8px 25px #1e0e2b72;padding:6px 10px;cursor:pointer}
.familiar-title strong{font-size:12px;letter-spacing:.1px}.familiar-title small{color:#c9adeb;font-size:10px}
.panel{width:min(308px,calc(100vw - 24px));border:1px solid #9567c6b8;border-radius:17px;background:linear-gradient(165deg,#291b38f5,#141020f7);color:#f6eeff;box-shadow:0 12px 42px #13072291;backdrop-filter:blur(17px);overflow:hidden;display:none}
.panel.open{display:block}
:host([data-mode="desktop"]) .panel{display:block;width:285px;max-height:calc(100vh - 220px);overflow:auto}
.panel-header{padding:14px 15px 12px;border-bottom:1px solid #72508b57;background:#ffffff08}
.panel-header .row{display:flex;align-items:center;justify-content:space-between;gap:8px}.subtitle{font-size:11px;color:#c4abd7;margin-top:5px}
.tabs{display:flex;gap:4px;padding:8px;border-bottom:1px solid #ffffff16}
.tab{border:0;flex:1;border-radius:9px;padding:7px 3px;color:#e8d9f4;background:transparent;font:inherit;font-size:11px;cursor:pointer}
.tab.selected{background:#8151a842;color:#ffebbf}
.content{padding:12px 13px;min-height:130px;max-height:235px;overflow-y:auto}
.line{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 0;font-size:12px}
.line small,.muted{color:#c4a6d5;font-size:11px}
.actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}
.action,.menu{font:inherit;font-size:11px;color:#f5e8ff;border:1px solid #a88ac066;background:#57376f8f;border-radius:9px;padding:8px 10px;cursor:pointer}
.action:hover,.menu:hover{background:#7c4a9c}.action:disabled{opacity:.5;cursor:default}
.action.primary{background:#7a4c9c;border-color:#b98adb}
.badge{display:inline-block;color:#fff0c9;background:#8d642b50;border:1px solid #dfb36b6b;padding:2px 7px;border-radius:999px;font-size:10px}
.stat{height:5px;background:#ffffff20;border-radius:6px;overflow:hidden;margin:2px 0 8px}.bar{height:100%;border-radius:6px;background:linear-gradient(90deg,#a76bea,#e5a8ff)}
.list-item{display:block;width:100%;text-align:left;color:#eee1ff;background:#ffffff0a;border:1px solid #ffffff15;border-radius:7px;padding:7px;margin:5px 0;font:inherit;font-size:11px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.feedback{border-top:1px solid #ffffff20;font-size:11px;padding:9px 13px;color:#dec4f1;min-height:34px}
.hidden{display:none!important}
@keyframes levitate{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-8px) rotate(1deg)}}
@keyframes blink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.07)}}
@keyframes spin{to{transform:rotate(360deg)}}

/* Arcane familiar • refined panel & meaningful gestures */
:host{--violet:#b58aff;--ink:#110c21}
.shell{gap:9px}
.character{width:124px;height:155px;filter:drop-shadow(0 8px 12px #08051b99)}
.character svg{width:124px;height:155px}
.character:hover{filter:drop-shadow(0 0 13px #a768f681) drop-shadow(0 10px 10px #0b0525a6)}
.character .arc-sigils{animation:spin 36s linear infinite;transform-origin:58px 93px}
.character .potion-spark{animation:twinkle 2.2s ease-in-out infinite}
.character .potion-bubble{animation:twinkle 1.6s ease-in-out infinite}
.character[data-mood="feliz"] .arc-mouth{stroke-width:3}
.character[data-mood="animado"]{animation:levitate 1.25s ease-in-out infinite}
.familiar-title{border-color:color-mix(in srgb,var(--violet),#251438 40%);background:linear-gradient(115deg,#231335ed,#130e25ef)}
.panel{width:min(338px,calc(100vw - 18px));border:1px solid #ad78de91;background:linear-gradient(150deg,#251637f7,#110d20fa 75%);box-shadow:0 20px 60px #060113b0}
.panel-header{background:radial-gradient(ellipse at 80% 0%,#8a5cf21e,transparent),#ffffff06}
.panel-header b{font-size:14px;letter-spacing:.02em}
.tab{font-size:11px;white-space:nowrap}
.tab.selected{background:color-mix(in srgb,var(--violet) 32%,#21132f);color:#fff1d4}
.content{max-height:min(335px,45vh)}
.action{min-height:35px}
.action.primary{background:linear-gradient(125deg,#7043b3,#47277e)}
.action:hover,.list-item:hover{border-color:var(--violet)}
.insight{padding:11px;margin:8px 0;border:1px solid #9276af5a;border-radius:12px;background:#ad81f711;line-height:1.55}
.insight b{display:block;color:#f4e6ff;margin-bottom:3px}
.insight span{color:#cab7df;font-size:11px}
.thought{max-width:205px;border:1px solid #b991f37a;border-radius:12px 12px 3px 12px;background:#251635f2;padding:7px 11px;line-height:1.3;font-size:10px;color:#f1e3ff;box-shadow:0 5px 19px #06020d77;align-self:flex-end}
.thought:empty,.thought[hidden]{display:none!important}
:host([data-position="bottom-left"]) .thought{align-self:flex-start;border-radius:12px 12px 12px 3px}
:host([data-position="bottom-left"]) .shell{align-items:flex-start}
@keyframes twinkle{0%,100%{opacity:.45;transform:scale(.92)}50%{opacity:1;transform:scale(1.12)}}
@media(max-width:460px){:host{right:8px;bottom:9px}.panel{width:min(315px,calc(100vw - 16px))}.character{width:100px;height:128px}.character svg{width:100px;height:128px}}

@media(prefers-reduced-motion:reduce){.character,.character .eyes,.rune{animation:none!important}}
`;
const SVG = `<svg viewBox="0 0 116 150" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
<defs>
 <radialGradient id="arc-halo"><stop stop-color="#bd84ff" stop-opacity=".42"/><stop offset="1" stop-color="#8445d9" stop-opacity="0"/></radialGradient>
 <linearGradient id="arc-hat" x1=".1" y1="0" x2=".8" y2="1"><stop stop-color="#7651bd"/><stop offset=".52" stop-color="#3f246d"/><stop offset="1" stop-color="#23173c"/></linearGradient>
 <linearGradient id="arc-cloak" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6f43aa"/><stop offset=".65" stop-color="#342052"/><stop offset="1" stop-color="#170f2b"/></linearGradient>
 <linearGradient id="arc-flask" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d4ffed" stop-opacity=".8"/><stop offset=".55" stop-color="#47f5d6" stop-opacity=".7"/><stop offset="1" stop-color="#36a5ec" stop-opacity=".85"/></linearGradient>
 <filter id="arc-glow"><feGaussianBlur stdDeviation="2.1"/></filter>
</defs>
<ellipse cx="58" cy="87" rx="55" ry="60" fill="url(#arc-halo)"/>
<g class="arc-sigils" fill="none" stroke="#d5a7ff" stroke-width=".9" opacity=".68"><circle cx="58" cy="93" r="45" stroke-dasharray="3 5"/><path d="M58 40v8M58 139v-7M4 93h8M104 93h8"/><circle cx="58" cy="93" r="35" stroke-dasharray="1 10"/></g>
<ellipse cx="58" cy="143" rx="37" ry="4" fill="#0e0925" opacity=".3"/>
<!-- robe and sleeves -->
<path d="M37 93Q20 99 22 133Q38 144 58 144Q81 144 96 133Q96 101 78 94L70 89H47Z" fill="url(#arc-cloak)" stroke="#b893df" stroke-width="1.7"/>
<path d="M50 94L58 111L67 94L63 132L58 138L53 132Z" fill="#261838" stroke="#9e71c2" stroke-width="1.2"/>
<path d="M58 107l5 9-5 9-5-9Z" fill="#d7b572" stroke="#fff2bd" stroke-width=".7"/>
<path d="M36 100q-13 5-16 22" fill="none" stroke="#7952b2" stroke-width="13" stroke-linecap="round"/>
<path d="M81 102q12 3 17 18" fill="none" stroke="#7952b2" stroke-width="12" stroke-linecap="round"/>
<!-- flowing hair -->
<path d="M33 69Q23 93 36 108L44 99Q48 113 52 102L69 100Q75 111 83 107Q89 89 82 69Z" fill="#ece4f5" stroke="#b9a8d1" stroke-width="1.8"/>
<!-- face -->
<path d="M32 68Q30 47 57 48Q83 46 85 68L81 88Q75 100 59 102Q39 101 34 88Z" fill="#e9c1ad" stroke="#ba8b9a" stroke-width="1.4"/>
<ellipse cx="42" cy="85" rx="6" ry="3.3" fill="#efa5ac" opacity=".6"/><ellipse cx="74" cy="85" rx="6" ry="3.3" fill="#efa5ac" opacity=".6"/>
<!-- expressive hair fringe and eyes -->
<path d="M31 69Q37 50 51 54Q56 44 69 54Q79 52 85 69Q75 64 69 64Q64 73 58 72Q50 63 42 69Q36 67 31 71Z" fill="#f4ebff" stroke="#c9b8de" stroke-width="1.3"/>
<g class="eyes"><path d="M43 77q4-3 9 0" fill="none" stroke="#39243b" stroke-width="2" stroke-linecap="round"/><path d="M65 77q4-3 9 0" fill="none" stroke="#39243b" stroke-width="2" stroke-linecap="round"/><ellipse cx="47.5" cy="81" rx="3" ry="5" fill="#251936"/><ellipse cx="69" cy="81" rx="3" ry="5" fill="#251936"/><circle cx="48" cy="79.4" r="1.3" fill="#fff"/><circle cx="69.5" cy="79.4" r="1.3" fill="#fff"/></g>
<path class="arc-mouth" d="M54 91q4 4 8 0" fill="none" stroke="#9b6374" stroke-width="1.6" stroke-linecap="round"/>
<!-- hat with gold circlet and small arcane star -->
<path d="M18 64Q29 55 35 40Q52 13 59 5Q73 28 79 46Q88 56 97 61Q92 72 57 73Q29 72 18 64Z" fill="url(#arc-hat)" stroke="#c9a6ff" stroke-width="2.1"/>
<path d="M38 39Q55 29 76 44L80 53Q58 48 31 55Z" fill="#9a6abd" opacity=".35"/>
<path d="M22 62Q57 70 94 61" fill="none" stroke="#e3c077" stroke-width="4.5" stroke-linecap="round"/>
<path d="M56 13l3 6 7 1-5 5 2 7-7-4-6 4 1-7-5-5 7-1Z" fill="#fce1a4" stroke="#fff2c8" stroke-width="1"/>
<circle cx="59" cy="23" r="2" fill="#fff9d6"/>
<!-- alchemist vial in right hand -->
<path d="M94 111l3-7 7 2-1 7 5 10q3 12-9 15-12-2-9-14Z" fill="url(#arc-flask)" stroke="#cffdf1" stroke-width="1.5"/>
<path d="M95 110l9 3" stroke="#e8fff4" stroke-width="2"/><path d="M92 126q6 5 14 0" fill="none" stroke="#1ee4ba" stroke-width="2"/>
<circle class="potion-bubble" cx="99" cy="121" r="2.4" fill="#ecfffe"/><circle class="potion-bubble" cx="103" cy="117" r="1.2" fill="#fff"/>
<path d="M88 118q5-6 7-2" fill="none" stroke="#e7c7b9" stroke-width="5" stroke-linecap="round"/>
<!-- tiny feet and sparkles -->
<ellipse cx="44" cy="143" rx="12" ry="4" fill="#251333" stroke="#9e77bc" stroke-width="1.5"/><ellipse cx="71" cy="143" rx="12" ry="4" fill="#251333" stroke="#9e77bc" stroke-width="1.5"/>
<path class="potion-spark" d="M101 76l2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#9ff5e8"/>
<path class="potion-spark" d="M17 88l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#ffdf9a"/>
<circle cx="93" cy="53" r="2" fill="#e7d4ff"/>
</svg>`;
const TABS = ['cuidado', 'insights', 'rotas', 'arquivos', 'IA'];
const MOODS = { feliz: 'Sua magia está em alta!', animado:'Pronto para uma aventura.', meditando:'Recarregando as runas...', sonolento:'Hora de descansar.', concentrado:'Estudando feitiços...', curioso:'Explorando ideias.', tranquilo:'Seu familiar está por aqui.' };
const CONFIG_URL = typeof document==='undefined'?'':(document.currentScript?.dataset?.config||window.ALQUIMAGO_CONFIG_URL||'');
const storage=()=>{try{return window.localStorage;}catch{return null;}};
function findSameOriginLinks() {
  if (typeof document === 'undefined') return [];
  const unique = new Map();
  document.querySelectorAll('a[href]').forEach(a => {
    try {
      const url = new URL(a.getAttribute('href'), location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      if (url.pathname === location.pathname && url.search === location.search && !url.hash) return;
      const key = url.pathname + url.search + url.hash;
      if (!unique.has(key)) unique.set(key, { label: (a.textContent || a.getAttribute('aria-label') || key).trim().slice(0, 68) || key, href: url.href });
    } catch { /* malformed href */ }
  });
  return [...unique.values()].slice(0, 15);
}
function auditPage() {
  const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
  return {
    title: document.title || 'Página sem título',
    path: location.pathname,
    headings: document.querySelectorAll('h1,h2,h3').length,
    buttons: document.querySelectorAll('button').length,
    links: document.querySelectorAll('a[href]').length,
    images: document.querySelectorAll('img').length,
    missingAlt: document.querySelectorAll('img:not([alt])').length,
    duplicateIds: ids.length - new Set(ids).size,
    brokenImages: [...document.images].filter(e => e.complete && e.naturalWidth === 0).length,
  };
}
class AlquimagoFamiliar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = { brain: restoreBrain(null), tab: 0, open: false, position: null };
    this.config=normalizeConfig(null);
    this.message=this.config.identity.greeting;
    this.projectFiles=[];
    this.links = [];
    this.audit = null;
    this.timer = null;
    this.pointerStart = null;
    this.activePage=null;this.suggestions=[];this.observeTimer=null;this.observer=null;this.routeHandler=null;this.studioHandler=null;this.activityHandler=null;this.studioInfo=null;
  }
  get desktop() { return this.getAttribute('data-mode') === 'desktop'; }
  connectedCallback() {
    const saved=readMemory(storage());
    this.state.brain = passTime(restoreBrain(saved.brain), Math.max(0, Date.now() - (saved.brain?.lastSeen || Date.now())));
    if (saved.position && Number.isFinite(saved.position.x) && Number.isFinite(saved.position.y)) this.state.position = saved.position;
    this.state.open = this.desktop;
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><section class="shell"><div class="panel" id="panel"><header class="panel-header"><div class="row"><b id="wizard-title">✦ Grimório</b><span class="badge" id="level">Nível 1</span></div><div class="subtitle" id="wizard-subtitle">Familiar local • sem coleta de dados</div></header><nav class="tabs" id="tabs" aria-label="Seções"></nav><div class="content" id="content"></div><div class="feedback" id="feedback" role="status"></div></div><div class="thought" id="thought" aria-hidden="true"></div><button type="button" class="character" id="character" aria-label="Interagir com Alquimago" title="Toque para carinho, deslize para acariciar ou arraste para mover">${SVG}</button><button type="button" class="familiar-title" id="toggle"><strong id="wizard-label">✦ Alquimago</strong><small id="mood">tranquilo</small><span aria-hidden="true">⌃</span></button></section>`;
    this.$panel = this.shadowRoot.getElementById('panel');
    this.$character = this.shadowRoot.getElementById('character');
    this.$content = this.shadowRoot.getElementById('content');
    this.$thought=this.shadowRoot.getElementById('thought');
    this.$tabs = this.shadowRoot.getElementById('tabs');
    this.$feedback = this.shadowRoot.getElementById('feedback');
    this.shadowRoot.getElementById('toggle').addEventListener('click', () => this.toggle());
    this.$character.addEventListener('pointerdown', e => this.onPointerDown(e));
    this.$character.addEventListener('pointermove', e => this.onPointerMove(e));
    this.$character.addEventListener('pointerup', e => this.onPointerUp(e));
    this.$character.addEventListener('pointercancel', () => { this.pointerStart = null; });
    this.$tabs.addEventListener('click', e => {
      const button = e.target.closest('button[data-tab]');
      if (button) { this.state.tab = Number(button.dataset.tab); this.render(); }
    });
    this.$content.addEventListener('click', e => this.onContentClick(e));
    if (!this.desktop && this.state.position) this.moveTo(this.state.position.x, this.state.position.y);
    this.render();
    this.startObservation();
    this.studioHandler=event=>{
      const d=event?.detail;
      if(!d||typeof d.section!=='string')return;
      this.studioInfo={
        section:d.section.slice(0,35),
        projects:Number.isFinite(d.projects)?Math.max(0,Math.min(9999,d.projects)):0,
        pages:Number.isFinite(d.pages)?Math.max(0,Math.min(9999,d.pages)):0,
        editing:d.editing===true
      };
      this.inspectPage(true);
    };
    window.addEventListener('alquimago:studio-context',this.studioHandler);
    this.activityHandler=event=>{
      const data=event?.detail;
      if(data?.type==='published'&&typeof data.revision==='string'){
        this.action('publish','pub-'+encodeURIComponent(data.revision).slice(0,100));
      }
    };
    window.addEventListener('alquimago:activity',this.activityHandler);
    window.dispatchEvent(new Event('alquimago:request-context'));
    if(CONFIG_URL)void loadConfig(CONFIG_URL,{origin:location.origin}).then(async config=>{
      this.config=config;
      this.message=config.identity.greeting;
      let saved=readMemory(storage(),config.memory.namespace);
      // A public, site-owned baseline is used only if the device has no progress.
      // It never overwrites existing progress and never accesses a private URL.
      if(!Object.keys(saved.brain).length && config.memory.remoteSnapshot){
        const result=await inspectProjectFiles([config.memory.remoteSnapshot],{pageUrl:location.href});
        if(result[0]?.status==='read'){
          try{
            const published=JSON.parse(result[0].excerpt);
            if(published?.schema===2 && published.brain && typeof published.brain==='object'){
              saved={...saved,brain:published.brain};
              writeMemory(storage(),saved,config.memory.namespace);
            }
          }catch{/* Invalid public snapshot does not discard local progress. */}
        }
      }
      if(!this.isConnected)return;
      this.state.brain=passTime(restoreBrain(saved.brain),Math.max(0,Date.now()-(saved.brain?.lastSeen||Date.now())));
      if(saved.position){this.state.position=saved.position;if(!this.desktop)this.moveTo(saved.position.x,saved.position.y);}
      this.render();
    }).catch(()=>{this.message='Configuração não disponível; usando padrão seguro.';if(this.isConnected)this.renderHeader();});
    this.timer = setInterval(() => { this.state.brain = passTime(this.state.brain, 10000); this.save(); this.renderHeader(); }, 10000);
  }
  disconnectedCallback(){
    if(this.timer)clearInterval(this.timer);
    if(this.observeTimer)clearTimeout(this.observeTimer);
    if(this.observer)this.observer.disconnect();
    if(this.routeHandler){window.removeEventListener('hashchange',this.routeHandler);window.removeEventListener('popstate',this.routeHandler);}
    if(this.studioHandler)window.removeEventListener('alquimago:studio-context',this.studioHandler);
    if(this.activityHandler)window.removeEventListener('alquimago:activity',this.activityHandler);
    this.timer=null;this.observer=null;this.observeTimer=null;
  }
  startObservation(){
    if(this.desktop||!this.isConnected)return;
    this.routeHandler=()=>this.inspectPage(true);
    window.addEventListener('hashchange',this.routeHandler);
    window.addEventListener('popstate',this.routeHandler);
    if(typeof MutationObserver!=='undefined'){
      this.observer=new MutationObserver(()=>{
        if(this.observeTimer)return;
        this.observeTimer=setTimeout(()=>{this.observeTimer=null;this.inspectPage(false);},1400);
      });
      this.observer.observe(document.body,{childList:true,subtree:true});
    }
    this.inspectPage(true);
  }
  inspectPage(navigated=false){
    if(this.desktop||!this.isConnected)return;
    const next=readPublicPage(document,location.href);
    if(!navigated&&samePageSignature(next,this.activePage))return;
    const routeChanged=this.activePage?.signature!==next.signature;
    this.activePage=next;
    this.audit=auditPage();
    this.suggestions=suggestionsFromPage(next);
    if(this.studioInfo?.editing){
      this.suggestions.unshift({
        id:'studio',title:'Studio • '+this.studioInfo.section,
        description:'Projeto em edição com '+this.studioInfo.projects+' projetos e '+this.studioInfo.pages+' páginas personalizadas. Revise a prévia antes da publicação.'
      });
      this.suggestions=this.suggestions.slice(0,6);
    }
    if(routeChanged){
      this.message='Reconheci a página: '+next.route+'. Tenho '+this.suggestions.length+' sugestão(ões).';
    }
    this.updateThought();
    if(this.state.open&&this.state.tab===1)this.render();
    else this.renderHeader();
  }
  updateThought(){
    if(!this.$thought)return;
    const issue=this.suggestions.find(x=>x.id!=='route'&&x.id!=='editor');
    this.$thought.textContent=issue?'✦ '+issue.title:'';
    this.$thought.hidden=!!this.state.open||!issue;
  }
  save(){writeMemory(storage(),{brain:this.state.brain,position:this.state.position},this.config.memory.namespace);}
  snapshot(){return JSON.parse(exportBackup({brain:this.state.brain,position:this.state.position}));}
  moveTo(x, y) {
    const maxX = Math.max(0, innerWidth - 125), maxY = Math.max(0, innerHeight - 166);
    const left = Math.max(0, Math.min(maxX, x)), top = Math.max(0, Math.min(maxY, y));
    this.style.left = left + 'px'; this.style.top = top + 'px'; this.style.right = 'auto'; this.style.bottom = 'auto';
    this.state.position = { x: left, y: top };
  }
  onPointerDown(e) {
    if (e.button !== 0) return;
    const box=this.getBoundingClientRect();
    this.pointerStart={x:e.clientX,y:e.clientY,left:box.left,top:box.top,dx:0,dy:0,moved:false};
    if(this.desktop&&e.altKey){
      try{void window.__TAURI__?.window?.getCurrentWindow()?.startDragging();}catch{/* platform optional */}
    }
    this.$character.setPointerCapture(e.pointerId);
  }
  onPointerMove(e) {
    if(!this.pointerStart)return;
    const dx=e.clientX-this.pointerStart.x,dy=e.clientY-this.pointerStart.y;
    this.pointerStart.dx=dx;this.pointerStart.dy=dy;
    // Short strokes are caresses. Intentional longer drags relocate the mascot.
    if(this.config.features.dragging&&Math.hypot(dx,dy)>72)this.pointerStart.moved=true;
    if(this.pointerStart.moved&&!this.desktop)this.moveTo(this.pointerStart.left+dx,this.pointerStart.top+dy);
  }
  onPointerUp(e) {
    const data = this.pointerStart; this.pointerStart = null;
    if (!data) return;
    if(data.moved){if(!this.desktop)this.save();}
    else if(Math.abs(data.dx)>13&&Math.abs(data.dx)<72&&Math.abs(data.dy)<58)this.action('stroke');
    else this.action('pet');
    if (this.$character.hasPointerCapture(e.pointerId)) this.$character.releasePointerCapture(e.pointerId);
  }
  action(name,detail=''){
    const before=this.state.brain.xp;
    const pageKey=name==='explore'?encodeURIComponent(routeSignature(location.href)).slice(0,120):name==='publish'?detail:'';
    this.state.brain=applyAction(this.state.brain,name,Date.now(),pageKey);
    const earned=this.state.brain.xp-before;
    const messages={stroke:'Hmm… mais um carinho no chapéu! ✧',brew:'Elixir alquímico preparado! ✨',explore:'Nova rota estudada. ✦',publish:'Projeto publicado! Magia de verdade. ✦'};
    this.message=(this.config.messages[name]||messages[name]||'Runas reorganizadas.')+(earned?' +'+earned+' XP':'');
    this.save();this.render();
  }
  toggle() { if (this.desktop) return; this.state.open = !this.state.open; this.render(); }
  renderHeader() {
    const mood=currentMood(this.state.brain);
    this.shadowRoot.getElementById('wizard-title').textContent='✦ Grimório de '+this.config.identity.name;
    this.shadowRoot.getElementById('wizard-label').textContent='✦ '+this.config.identity.name;
    this.shadowRoot.getElementById('wizard-subtitle').textContent=this.config.identity.subtitle;
    this.style.setProperty('--violet',this.config.appearance.accent);
    this.style.setProperty('--gold',this.config.appearance.gold);
    this.shadowRoot.getElementById('mood').textContent = mood;
    this.shadowRoot.getElementById('level').textContent = `Nível ${levelFromXp(this.state.brain.xp)}`;
    this.$character.dataset.mood = mood;
    this.$feedback.textContent = this.message || MOODS[mood];
    this.updateThought();
  }
  render() {
    const flags=this.config.features;
    const allowed=[flags.actions,flags.pageAudit,flags.routes,flags.projectFiles,flags.assistants];
    if(!allowed[this.state.tab])this.state.tab=Math.max(0,allowed.indexOf(true));
    this.setAttribute('data-position',this.config.appearance.position);
    this.$panel.classList.toggle('open', this.state.open);
    this.renderHeader();
    this.$tabs.innerHTML=TABS.map((tab,index)=>allowed[index]?'<button type="button" class="tab '+(index===this.state.tab?'selected':'')+'" data-tab="'+index+'" aria-pressed="'+(index===this.state.tab)+'">'+tab+'</button>':'').join('');
    this.$content.replaceChildren();
    const add = (html) => { const node = document.createElement('div'); node.innerHTML = html; this.$content.appendChild(node); return node; };
    if (this.state.tab === 0) {
      const b = this.state.brain;
      add(`<div class="line"><span>Energia mágica</span><small>${Math.round(b.energy)}%</small></div><div class="stat"><div class="bar" style="width:${b.energy}%"></div></div><div class="line"><span>Curiosidade</span><small>${Math.round(b.curiosity)}%</small></div><div class="stat"><div class="bar" style="width:${b.curiosity}%"></div></div><div class="line"><span>Foco</span><small>${Math.round(b.focus)}%</small></div><div class="stat"><div class="bar" style="width:${b.focus}%"></div></div><div class="muted">${b.interactions} interações • ${b.xp} XP</div><p class="muted">Arraste o dedo suavemente sobre o personagem para fazer carinho; arraste mais longe para movê-lo. Carinhos não geram XP infinito.</p><div class="actions"><button class="action" data-action="pet">♡ Carinho</button><button class="action" data-action="play">✧ Brincar</button><button class="action" data-action="brew">⚗ Poção</button><button class="action" data-action="focus">◈ Foco</button><button class="action" data-action="rest">☾ Meditar</button></div><div class="actions"><button class="action" data-action="export-memory">Exportar memória</button><button class="action" data-action="import-memory">Restaurar</button></div>`);
    } else if (this.state.tab === 1) {
      if (this.desktop) add('<p class="muted">No desktop, o familiar não lê outras janelas. A leitura de projetos será um módulo futuro com permissão explícita.</p>');
      else {
        this.audit=auditPage();
        const a = this.audit;
        const wrapper = add(`<div class="line"><b>Diagnóstico superficial</b></div><div class="muted" id="page-title"></div><div class="line"><span>Elementos de navegação</span><b>${a.links}</b></div><div class="line"><span>Botões</span><b>${a.buttons}</b></div><div class="line"><span>Imagens sem atributo alt</span><b>${a.missingAlt}</b></div><div class="line"><span>IDs duplicados</span><b>${a.duplicateIds}</b></div><div class="line"><span>Imagens com falha</span><b>${a.brokenImages}</b></div><div class="actions"><button class="action" data-action="audit">↻ Atualizar</button><button class="action primary" data-action="copy-audit">Copiar relatório</button></div>`);
        wrapper.querySelector('#page-title').textContent=a.title;
        const intro=document.createElement('p');intro.className='muted';intro.textContent='Análise contextual: somente estrutura da página e rota atual, nunca valores digitados ou mensagens.';this.$content.appendChild(intro);
        const title=document.createElement('div');title.className='line';title.innerHTML='<b>Sugestões do familiar</b>';this.$content.appendChild(title);
        for(const [i,tip] of this.suggestions.entries()){
          const box=document.createElement('div');box.className='insight';
          const heading=document.createElement('b');heading.textContent='✦ '+tip.title;
          const detail=document.createElement('span');detail.textContent=tip.description;
          const copy=document.createElement('button');copy.type='button';copy.className='action';copy.dataset.insight=String(i);copy.textContent='Pedir ajuda à IA ↗';copy.style.marginTop='7px';
          box.append(heading,detail,document.createElement('br'),copy);this.$content.appendChild(box);
        }
        const explore=document.createElement('button');explore.type='button';explore.className='action primary';explore.dataset.action='explore';explore.textContent='✧ Explorar esta rota';this.$content.appendChild(explore);
      }
    } else if (this.state.tab === 2) {
      if (this.desktop) add('<p class="muted">Abra a versão web do Alquimago no seu projeto React para navegar pelas páginas desse site.</p>');
      else {
        this.links = findSameOriginLinks();
        add(`<p class="muted">Rotas do site atual. A navegação será feita somente quando você escolher.</p>`);
        if (!this.links.length) add('<p>Nenhuma outra rota encontrada.</p>');
        this.links.forEach((link, i) => {
          const button = document.createElement('button'); button.type = 'button'; button.className = 'list-item'; button.dataset.navigate = String(i);
          button.textContent = link.label || link.href;
          button.title = link.href;
          this.$content.appendChild(button);
        });
      }
    } else if(this.state.tab===3){
      if(this.desktop)add('<p class="muted">Escolha uma pasta para analisar textos autorizados. Nenhuma pasta é lida automaticamente.</p><div class="actions"><button class="action primary" data-action="choose-folder">Escolher pasta</button></div>');
      else add('<p class="muted">Só os arquivos públicos listados na configuração do projeto são acessados.</p><div class="actions"><button class="action primary" data-action="read-files">Ler arquivos</button></div>');
      if(!this.projectFiles.length)add('<p class="muted">Nenhum arquivo examinado ainda.</p>');
      for(const entry of this.projectFiles){
        const item=document.createElement('div');item.className='line';
        const label=document.createElement('span');label.textContent=entry.file.slice(0,75);
        const result=document.createElement('small');result.textContent=entry.status==='read'?String(entry.bytes)+' bytes':entry.status;
        item.append(label,result);this.$content.appendChild(item);
      }
    } else {
      add('<p class="muted">Um resumo de tarefa pode ser copiado para continuar no ChatGPT ou no Gemini. Não há automação de login, coleta de conversas nem acesso a tokens.</p><div class="actions"><button class="action primary" data-action="chatgpt">ChatGPT ↗</button><button class="action" data-action="gemini">Gemini ↗</button></div>');
    }
    if(!flags.memoryTools)this.$content.querySelectorAll('[data-action="export-memory"],[data-action="import-memory"]').forEach(button=>button.remove());
  }
  createPrompt() {
    const a = this.desktop ? null : auditPage();
    return ['Sou o Alquimago, um familiar digital local. Preciso de assistência para o projeto do usuário.',
      'Contexto: ' + (a ? `${a.title} (${location.origin}${a.path})` : 'Aplicativo desktop Alquimago'),
      a ? `Diagnóstico básico: ${a.links} links, ${a.buttons} botões, ${a.images} imagens, ${a.missingAlt} imagens sem alt, ${a.duplicateIds} IDs repetidos.` : '',
      ...this.suggestions.slice(0,4).map(tip=>'Sugestão de melhoria: '+tip.title+' — '+tip.description),
      this.studioInfo?.editing?'Editor integrado: '+this.studioInfo.section+'; '+this.studioInfo.projects+' projetos; '+this.studioInfo.pages+' páginas.':'',
      this.config.assistant.projectContext?'Contexto: '+this.config.assistant.projectContext:'',
      ...this.config.assistant.guidelines.map(rule=>'Orientação: '+rule),
      ...this.projectFiles.filter(file=>file.status==='read').slice(0,4).map(file=>'Arquivo público '+file.file+': '+file.excerpt.slice(0,700)),
      'Objetivo: primeiro pergunte qual mudança o usuário deseja realizar. Preserve o visual atual até receber instruções.',
      'Não suponha acesso ao repositório nem a arquivos privados. Solicite permissão antes de publicar alterações.'].filter(Boolean).join('\n');
  }
  async copy(text) {
    try { await navigator.clipboard.writeText(text); this.message = 'Resumo copiado! Cole na conversa escolhida.'; }
    catch { this.message = 'Sem acesso à área de transferência. Use o botão em HTTPS ou copie manualmente.'; }
    this.renderHeader();
  }
  onContentClick(e) {
    const button = e.target.closest('button'); if (!button) return;
    if (button.dataset.navigate !== undefined) {
      const link = this.links[Number(button.dataset.navigate)];
      if(link && new URL(link.href).origin===location.origin){location.assign(link.href);this.message='Abrindo '+link.label+'…';this.renderHeader();}
      return;
    }
    if(button.dataset.insight!==undefined){
      const tip=this.suggestions[Number(button.dataset.insight)];
      if(tip)void this.copy(this.createPrompt()+'\n\nMelhoria solicitada: '+tip.title+' — '+tip.description);
      return;
    }
    const action = button.dataset.action;
    if (!action) return;
    if (['pet','stroke','play','brew','focus','rest','explore'].includes(action)) return this.action(action);
    if(action==='export-memory'){
      const blob=new Blob([exportBackup(this.snapshot())],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='alquimago-memory.json';a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      this.message='Backup da memória exportado.';this.renderHeader();return;
    }
    if(action==='import-memory'){
      const picker=document.createElement('input');picker.type='file';picker.accept='.json,application/json';
      picker.onchange=async()=>{try{
        const file=picker.files?.[0];if(!file||file.size>32768)return;
        const state=parseBackup(await file.text());
        this.state.brain=restoreBrain(state.brain);this.state.position=state.position;
        this.save();this.message='Memória restaurada neste dispositivo.';this.render();
      }catch{this.message='Arquivo de memória inválido.';this.renderHeader();}};
      picker.click();return;
    }
    if(action==='read-files'){
      this.message='Lendo recursos autorizados...';this.renderHeader();
      void inspectProjectFiles(this.config.project.files,{pageUrl:location.href}).then(files=>{
        this.projectFiles=files;this.message=files.filter(f=>f.status==='read').length+' arquivo(s) lido(s).';this.render();
      });return;
    }
    if(action==='choose-folder'){
      const picker=document.createElement('input');picker.type='file';picker.multiple=true;picker.setAttribute('webkitdirectory','');
      picker.onchange=async()=>{
        const selection=Array.from(picker.files||[]).filter(f=>/\.(json|md|txt|ts|tsx|js|mjs|html|css|csv)$/i.test(f.name)).slice(0,20);
        const records=[];
        for(const file of selection){
          const name=file.webkitRelativePath||file.name;
          if(file.size>64000){records.push({file:name,status:'oversized'});continue;}
          try{const body=await file.text();records.push({file:name,status:'read',bytes:file.size,excerpt:body.slice(0,2000)});}
          catch{records.push({file:name,status:'unavailable'});}
        }
        this.projectFiles=records;this.message=records.filter(f=>f.status==='read').length+' arquivo(s) lido(s).';this.render();
      };
      picker.click();return;
    }
    if (action === 'audit') { this.audit = auditPage(); this.action('study'); return; }
    if (action === 'copy-audit') return this.copy(this.createPrompt());
    if (action === 'chatgpt' || action === 'gemini') {
      const destination = action === 'chatgpt' ? 'https://chatgpt.com/' : 'https://gemini.google.com/';
      // Abertura explicitamente solicitada, sem automatizar páginas de terceiros.
      window.open(destination, '_blank', 'noopener,noreferrer');
      void this.copy(this.createPrompt());
    }
  }
}
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (!customElements.get(TAG)) customElements.define(TAG, AlquimagoFamiliar);
  window.Alquimago = {
    version: '0.3.0',
    mount(target = document.body, mode = 'web') {
      const el = document.createElement(TAG);
      if (mode === 'desktop') el.setAttribute('data-mode', 'desktop');
      target.appendChild(el);
      return el;
    },
    destroy(){document.querySelectorAll(TAG).forEach(el=>el.remove());},
    exportState(){const el=document.querySelector(TAG);return el?.snapshot?.()||null;}
  };
  const autoMount = () => {
    if (window.ALQUIMAGO_AUTO_MOUNT === false || document.querySelector(TAG)) return;
    const slot = document.getElementById('alquimago-desktop');
    if (slot) window.Alquimago.mount(slot, 'desktop');
    else window.Alquimago.mount(document.body, 'web');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount, { once: true });
  else autoMount();
}

})();
