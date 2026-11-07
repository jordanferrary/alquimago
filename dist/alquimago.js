/* ALQUIMAGO v0.2 • MIT */
(() => {
"use strict";
// ALQUIMAGO • cérebro simbólico adaptativo, sem conexão de rede.
// Implementação original, NÃO é a rede neural do Pestinha.
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const DEFAULT_BRAIN = Object.freeze({
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
function restoreBrain(value) {
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
function applyAction(brain, name, now = Date.now()) {
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
function passTime(brain, elapsedMs, now = Date.now()) {
  const result = restoreBrain(brain);
  // A passagem do tempo apenas estabiliza os indicadores. Não penaliza o usuário por sair.
  const minutes = clamp(elapsedMs / 60000, 0, 30);
  result.energy = clamp(result.energy + minutes * .65);
  result.curiosity = clamp(result.curiosity + minutes * .22);
  result.focus = clamp(result.focus - minutes * .3);
  result.lastSeen = now;
  return result;
}
function currentMood(brain, now = Date.now()) {
  const state = restoreBrain(brain);
  if (state.sleepUntil > now) return 'meditando';
  if (state.energy <= 23) return 'sonolento';
  if (state.lastAction === 'pet' && now - state.lastSeen < 3500) return 'feliz';
  if (state.lastAction === 'play' && now - state.lastSeen < 3500) return 'animado';
  if (state.focus >= 65 && state.lastAction === 'focus') return 'concentrado';
  if (state.curiosity >= 65) return 'curioso';
  return 'tranquilo';
}
function levelFromXp(xp) { return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 8)) + 1); }

// Declarative, same-origin public configuration. JSON is never executable.
const DEFAULT_CONFIG = Object.freeze({
  schemaVersion:1,
  identity:{name:'Alquimago',subtitle:'Familiar arcano • memória local',greeting:'Olá! Sou seu familiar arcano.'},
  appearance:{accent:'#b58aff',gold:'#f9d891',position:'bottom-right'},
  features:{actions:true,pageAudit:true,routes:true,assistants:true,memoryTools:true,dragging:true},
  memory:{namespace:'default'},
  project:{files:[]},
  messages:{pet:'Um brilho de amizade arcana! ✧',play:'Prepare-se: poção de diversão!',focus:'Concentração ativada. 🜁',rest:'Meditando por alguns instantes.',study:'Analisando a energia da página.'},
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
    memory:{namespace:typeof memory.namespace==='string'&&/^[\w-]{1,48}$/.test(memory.namespace)?memory.namespace:'default'},
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
  for(const k of ['energy','curiosity','focus','affinity','xp','interactions','lastSeen','sleepUntil'])
    if(num(raw[k]))brain[k]=Math.max(0,Math.min(1e12,raw[k]));
  if(typeof raw.lastAction==='string'&&['pet','play','focus','rest','study','summon'].includes(raw.lastAction))brain.lastAction=raw.lastAction;
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





const TAG = 'alquimago-familiar';
const STYLE = `
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
@media(prefers-reduced-motion:reduce){.character,.character .eyes,.rune{animation:none!important}}
`;
const SVG = `<svg viewBox="0 0 116 143" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
<defs><radialGradient id="glow"><stop stop-color="#cc9aff" stop-opacity=".57"/><stop offset="1" stop-color="#793bdf" stop-opacity="0"/></radialGradient><linearGradient id="cloak" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7650a2"/><stop offset="1" stop-color="#2e2049"/></linearGradient></defs>
<ellipse cx="58" cy="92" rx="57" ry="53" fill="url(#glow)"/>
<g class="rune" opacity=".56" stroke="#ffdba2" fill="none" stroke-width="1.5"><circle cx="58" cy="91" r="39" stroke-dasharray="7 6"/><path d="M58 45v7m0 80v-7M12 91h7m78 0h7"/></g>
<path d="M23 115Q26 84 38 79Q58 65 79 80Q90 93 94 122Q60 143 22 121Z" fill="url(#cloak)" stroke="#bd9be2" stroke-width="2.2"/>
<path d="M48 84Q58 102 69 84L61 123L54 131Z" fill="#ad79c4" opacity=".65"/>
<path d="M24 55Q38 40 58 13Q74 50 84 55L98 64Q55 82 14 62Z" fill="#483161" stroke="#d5adff" stroke-width="2.7"/>
<path d="M52 19l7-12 6 15M25 54q30-6 60 1" stroke="#dfb572" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M31 58Q32 41 57 41Q82 39 84 61V86Q81 106 58 108Q35 107 31 84Z" fill="#edc0ac" stroke="#694467" stroke-width="2"/>
<path d="M30 63Q45 50 59 54Q70 59 85 60" fill="none" stroke="#66507e" stroke-width="4"/>
<g class="eyes"><ellipse cx="46" cy="76" rx="5" ry="7" fill="#21172e"/><ellipse cx="69" cy="76" rx="5" ry="7" fill="#21172e"/><circle cx="47" cy="74" r="1.7" fill="#fff"/><circle cx="70" cy="74" r="1.7" fill="#fff"/></g>
<path d="M54 90q5 5 10 0" stroke="#995d75" stroke-width="2.3" fill="none" stroke-linecap="round"/>
<path d="M33 109l-13 15M81 108l15 13" stroke="#d6b7ef" stroke-width="7" stroke-linecap="round"/>
<circle cx="58" cy="116" r="8.5" fill="#4e2364" stroke="#ecd090" stroke-width="2"/><path d="M58 110v12M52 116h12" stroke="#eacc85" stroke-width="1.5"/>
<path d="M78 24l2 6 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#f5d78f"/>
</svg>`;
const TABS = ['ações', 'página', 'rotas', 'arquivos', 'assistentes'];
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
  }
  get desktop() { return this.getAttribute('data-mode') === 'desktop'; }
  connectedCallback() {
    const saved=readMemory(storage());
    this.state.brain = passTime(restoreBrain(saved.brain), Math.max(0, Date.now() - (saved.brain?.lastSeen || Date.now())));
    if (saved.position && Number.isFinite(saved.position.x) && Number.isFinite(saved.position.y)) this.state.position = saved.position;
    this.state.open = this.desktop;
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><section class="shell"><div class="panel" id="panel"><header class="panel-header"><div class="row"><b id="wizard-title">✦ Grimório</b><span class="badge" id="level">Nível 1</span></div><div class="subtitle" id="wizard-subtitle">Familiar local • sem coleta de dados</div></header><nav class="tabs" id="tabs" aria-label="Seções"></nav><div class="content" id="content"></div><div class="feedback" id="feedback" role="status"></div></div><button type="button" class="character" id="character" aria-label="Interagir com Alquimago" title="Clique para afagar; arraste para mover">${SVG}</button><button type="button" class="familiar-title" id="toggle"><strong id="wizard-label">✦ Alquimago</strong><small id="mood">tranquilo</small><span aria-hidden="true">⌃</span></button></section>`;
    this.$panel = this.shadowRoot.getElementById('panel');
    this.$character = this.shadowRoot.getElementById('character');
    this.$content = this.shadowRoot.getElementById('content');
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
    if(CONFIG_URL)void loadConfig(CONFIG_URL,{origin:location.origin}).then(config=>{
      this.config=config;
      this.message=config.identity.greeting;
      const saved=readMemory(storage(),config.memory.namespace);
      this.state.brain=passTime(restoreBrain(saved.brain),Math.max(0,Date.now()-(saved.brain?.lastSeen||Date.now())));
      if(saved.position)this.state.position=saved.position;
      this.render();
    }).catch(()=>{this.message='Configuração não disponível; usando padrão seguro.';this.renderHeader();});
    this.timer = setInterval(() => { this.state.brain = passTime(this.state.brain, 10000); this.save(); this.renderHeader(); }, 10000);
  }
  disconnectedCallback() { if (this.timer) clearInterval(this.timer); this.timer = null; }
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
    this.pointerStart = { x: e.clientX, y: e.clientY, left: this.offsetLeft, top: this.offsetTop, moved: false };
    if (this.desktop) {
      try { void window.__TAURI__?.window?.getCurrentWindow()?.startDragging(); } catch { /* optional desktop feature */ }
    }
    this.$character.setPointerCapture(e.pointerId);
  }
  onPointerMove(e) {
    if (!this.pointerStart) return;
    const dx = e.clientX - this.pointerStart.x, dy = e.clientY - this.pointerStart.y;
    if (Math.abs(dx) + Math.abs(dy) > 7) this.pointerStart.moved = true;
    if (this.pointerStart.moved && !this.desktop) this.moveTo(this.pointerStart.left + dx, this.pointerStart.top + dy);
  }
  onPointerUp(e) {
    const data = this.pointerStart; this.pointerStart = null;
    if (!data) return;
    if (data.moved) { if (!this.desktop) this.save(); }
    else this.action('pet');
    if (this.$character.hasPointerCapture(e.pointerId)) this.$character.releasePointerCapture(e.pointerId);
  }
  action(name) {
    this.state.brain = applyAction(this.state.brain, name);
    this.message=this.config.messages[name]||'Runas reorganizadas.';
    this.save(); this.render();
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
  }
  render() {
    this.$panel.classList.toggle('open', this.state.open);
    this.renderHeader();
    this.$tabs.innerHTML = TABS.map((tab, index) => `<button type="button" class="tab ${index === this.state.tab ? 'selected' : ''}" data-tab="${index}" aria-pressed="${index === this.state.tab}">${tab}</button>`).join('');
    this.$content.replaceChildren();
    const add = (html) => { const node = document.createElement('div'); node.innerHTML = html; this.$content.appendChild(node); return node; };
    if (this.state.tab === 0) {
      const b = this.state.brain;
      add(`<div class="line"><span>Energia mágica</span><small>${Math.round(b.energy)}%</small></div><div class="stat"><div class="bar" style="width:${b.energy}%"></div></div><div class="line"><span>Curiosidade</span><small>${Math.round(b.curiosity)}%</small></div><div class="stat"><div class="bar" style="width:${b.curiosity}%"></div></div><div class="line"><span>Foco</span><small>${Math.round(b.focus)}%</small></div><div class="stat"><div class="bar" style="width:${b.focus}%"></div></div><div class="muted">${b.interactions} interações • ${b.xp} XP</div><div class="actions"><button class="action" data-action="pet">✦ Afagar</button><button class="action" data-action="play">✧ Brincar</button><button class="action" data-action="focus">◈ Concentrar</button><button class="action" data-action="rest">☾ Meditar</button></div><div class="actions"><button class="action" data-action="export-memory">Exportar memória</button><button class="action" data-action="import-memory">Restaurar</button></div>`);
    } else if (this.state.tab === 1) {
      if (this.desktop) add('<p class="muted">No desktop, o familiar não lê outras janelas. A leitura de projetos será um módulo futuro com permissão explícita.</p>');
      else {
        if (!this.audit) this.audit = auditPage();
        const a = this.audit;
        const wrapper = add(`<div class="line"><b>Diagnóstico superficial</b></div><div class="muted" id="page-title"></div><div class="line"><span>Elementos de navegação</span><b>${a.links}</b></div><div class="line"><span>Botões</span><b>${a.buttons}</b></div><div class="line"><span>Imagens sem atributo alt</span><b>${a.missingAlt}</b></div><div class="line"><span>IDs duplicados</span><b>${a.duplicateIds}</b></div><div class="line"><span>Imagens com falha</span><b>${a.brokenImages}</b></div><div class="actions"><button class="action" data-action="audit">↻ Atualizar</button><button class="action primary" data-action="copy-audit">Copiar relatório</button></div>`);
        wrapper.querySelector('#page-title').textContent = a.title;
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
  }
  createPrompt() {
    const a = this.desktop ? null : auditPage();
    return ['Sou o Alquimago, um familiar digital local. Preciso de assistência para o projeto do usuário.',
      'Contexto: ' + (a ? `${a.title} (${location.origin}${a.path})` : 'Aplicativo desktop Alquimago'),
      a ? `Diagnóstico básico: ${a.links} links, ${a.buttons} botões, ${a.images} imagens, ${a.missingAlt} imagens sem alt, ${a.duplicateIds} IDs repetidos.` : '',
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
      if (link && new URL(link.href).origin === location.origin) location.assign(link.href);
      return;
    }
    const action = button.dataset.action;
    if (!action) return;
    if (['pet','play','focus','rest'].includes(action)) return this.action(action);
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
    version: '0.2.0',
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
