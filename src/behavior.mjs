/**
 * Independent behavioral cortex for Alquimago.
 *
 * 512 leaky integrate-and-fire cells / 16,384 deterministic sparse synapses.
 * 32 opt-in, privacy-preserving sensor channels and 16 action motor neurons.
 * Plasticity: reward-modulated motor value learning, bounded contextual
 * conditioning and synaptic traces for 128 eligible connections.
 *
 * This is a tiny decision network, not an LLM. It does not observe keystrokes,
 * other tabs, private window content or text typed into the host website.
 */
export const CORTEX_CELLS=512;
export const CORTEX_SYNAPSES=16384;
export const CORTEX_SENSORS=32;
export const CORTEX_MOTORS=16;
export const CORTEX_ACTIONS=[
  'quieto','observar','dica','investigar','acenar','brilhar','brincar','meditar',
  'celebrar','curiosidade','pensar','estudar','poção','alongar','descansar','acolher'
];
const bClamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const bObject=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
const bHash=x=>{let h=2166136261;for(const c of String(x))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const B_BUCKETS=['home','gallery','project','contact','about','custom','desktop'];
const bContext=x=>B_BUCKETS.includes(x)?x:'home';
const B_REASON={
 quieto:'Descansando em silêncio.',
 observar:'Observando a organização pública desta página.',
 dica:'Encontrei uma possibilidade de melhoria acessível.',
 investigar:'Há uma seção nova para explorar.',
 acenar:'Uma saudação discreta.',
 brilhar:'Um pequeno efeito arcano.',
 brincar:'Momento para uma brincadeira opcional.',
 meditar:'Recuperando energia.',
 celebrar:'Uma nova etapa do projeto foi concluída.',
 curiosidade:'Há algo interessante na composição.',
 pensar:'Refletindo sobre as alternativas.',
 estudar:'Analisando o contexto público.',
 poção:'Uma pequena animação alquímica.',
 alongar:'Movimento curto e discreto.',
 descansar:'Recuperando energia.',
 acolher:'Um comentário amigável, sem interrupções.'
};
export const DEFAULT_CORTEX=Object.freeze({
  schema:1,seed:77,energy:75,stimulation:42,curiosity:55,trust:45,
  rewardBias:Array(CORTEX_MOTORS).fill(0),
  contextWeights:{},adaptation:{},episodes:[],lastAction:'quieto',
  lastActionAt:0,lastDecisionAt:0,lastCue:'',feedbackCount:0,
  lastRewardAt:0,autonomousCount:0,lastActiveDay:-1,
  synapses:{}
});
export function createCortex(seed=77){
 const s=Number.isSafeInteger(seed)?bClamp(seed,1,2147483647):77;
 return {...DEFAULT_CORTEX,seed:s,rewardBias:Array(CORTEX_MOTORS).fill(0),
  contextWeights:{},adaptation:{},episodes:[],synapses:{}};
}
export function cleanCortex(value){
 const d=bObject(value);
 const state=createCortex(Number.isSafeInteger(d.seed)?d.seed:77);
 for(const key of ['energy','stimulation','curiosity','trust'])
  if(typeof d[key]==='number'&&Number.isFinite(d[key]))state[key]=bClamp(d[key]);
 for(const key of ['lastActionAt','lastDecisionAt','lastRewardAt','autonomousCount','feedbackCount'])
  if(typeof d[key]==='number'&&Number.isFinite(d[key]))state[key]=bClamp(d[key],0,1e13);
 if(Number.isInteger(d.lastActiveDay))state.lastActiveDay=bClamp(d.lastActiveDay,-1,1e9);
 if(CORTEX_ACTIONS.includes(d.lastAction))state.lastAction=d.lastAction;
 if(typeof d.lastCue==='string'&&d.lastCue.length<60)state.lastCue=d.lastCue;
 if(Array.isArray(d.rewardBias))
  state.rewardBias=d.rewardBias.slice(0,CORTEX_MOTORS)
   .map(x=>bClamp(x,-4,4));
 while(state.rewardBias.length<CORTEX_MOTORS)state.rewardBias.push(0);
 const contexts=bObject(d.contextWeights);
 for(const name of B_BUCKETS)if(Array.isArray(contexts[name])){
  state.contextWeights[name]=Array.from({length:CORTEX_MOTORS},(_,i)=>
   bClamp(contexts[name][i]||0,-3,3));
 }
 for(const [name,n] of Object.entries(bObject(d.adaptation)).slice(0,16))
  if(CORTEX_ACTIONS.includes(name)&&Number.isFinite(n))
   state.adaptation[name]=bClamp(n,0,1);
 const events=Array.isArray(d.episodes)?d.episodes.slice(-32):[];
 state.episodes=events.filter(x=>x&&CORTEX_ACTIONS.includes(x.action)&&
  B_BUCKETS.includes(x.context)&&[-1,0,1].includes(x.reward)&&
  Number.isFinite(x.at)).map(x=>({
   action:x.action,context:x.context,reward:x.reward,
   at:bClamp(x.at,0,1e13)
  }));
 for(const [i,v] of Object.entries(bObject(d.synapses)).slice(-128)){
  const key=Number(i);
  if(Number.isInteger(key)&&key>=0&&key<CORTEX_SYNAPSES&&Number.isFinite(v))
   state.synapses[key]=bClamp(v,-.45,.45);
 }
 return state;
}
export function behaviorSense(info={},brain={}){
 const p=bObject(info),b=bObject(brain),v=Array(CORTEX_SENSORS).fill(0);
 const put=(i,x)=>v[i]=bClamp(Number(x)||0,0,1);
 const route=bContext(p.route);
 B_BUCKETS.forEach((x,i)=>put(i,x===route?1:0));
 put(7,bClamp(p.issues||0,0,12)/12);
 put(8,!!p.projectHover);
 put(9,!!p.routeChanged);
 put(10,!!p.publishConfirmed);
 put(11,!!p.userInteracted);
 put(12,bClamp((p.idleSeconds||0)/90,0,1));
 put(13,!!p.editorVisible);
 put(14,!!p.panelOpen);
 put(15,!!p.hidden);
 put(16,!!p.reducedMotion);
 put(17,bClamp((b.energy??75)/100,0,1));
 put(18,bClamp((b.curiosity??55)/100,0,1));
 put(19,bClamp((b.focus??40)/100,0,1));
 put(20,bClamp((b.affinity??45)/100,0,1));
 put(21,bClamp((p.mouseMoves||0)/20,0,1));
 put(22,!!p.visibleProject);
 put(23,!!p.hasBrokenMedia);
 put(24,!!p.hasAccessibilityIssue);
 put(25,!!p.hasNewProject);
 put(26,!!p.playful);
 put(27,!!p.quiet);
 put(28,!!p.working);
 put(29,!!p.nightMode);
 put(30,!!p.tutorial);
 put(31,1);
 return v;
}
/** The fixed topology is regenerable from the seed: no massive JSON file. */
export function createCortexRuntime(state){
 const saved=cleanCortex(state),pre=new Uint16Array(CORTEX_SYNAPSES),
  post=new Uint16Array(CORTEX_SYNAPSES),weights=new Float32Array(CORTEX_SYNAPSES);
 let seed=(saved.seed^0xA53C7D21)>>>0;
 const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
 for(let i=0;i<CORTEX_SYNAPSES;i++){
  pre[i]=i%CORTEX_CELLS;
  post[i]=i%31===0?CORTEX_CELLS-CORTEX_MOTORS+(i%CORTEX_MOTORS):
   Math.floor(random()*CORTEX_CELLS);
  const inhibitory=pre[i]%6===0;
  weights[i]=(inhibitory?-.30:.48)*(0.6+random()*.8);
  if(saved.synapses[i]!==undefined)weights[i]+=saved.synapses[i];
 }
 return {state:saved,pre,post,weights,
  voltage:new Float32Array(CORTEX_CELLS),spikes:new Uint8Array(CORTEX_CELLS),
  recentMotors:new Float32Array(CORTEX_MOTORS),lastContext:'home'};
}
/** Six short LIF iterations: integrates, leaks, fires and records motor spikes. */
export function pulseCortex(engine,senses){
 const signal=Array.isArray(senses)&&senses.length===CORTEX_SENSORS?senses:Array(CORTEX_SENSORS).fill(0);
 const {pre,post,weights,voltage,spikes,recentMotors}=engine;
 recentMotors.fill(0);
 for(let tick=0;tick<6;tick++){
  const incoming=new Float32Array(CORTEX_CELLS);
  for(let i=0;i<CORTEX_SYNAPSES;i++)if(spikes[pre[i]])
   incoming[post[i]]+=weights[i];
  for(let n=0;n<CORTEX_CELLS;n++){
   // Deterministic background fluctuations; sensor evidence receives stronger input.
   const sensor=n<CORTEX_SENSORS?(.30+signal[n]*1.25):0;
   voltage[n]=bClamp(voltage[n]*.78+incoming[n]+sensor,-3,3);
   spikes[n]=voltage[n]>=1?1:0;
   if(spikes[n])voltage[n]=0;
   if(n>=CORTEX_CELLS-CORTEX_MOTORS)
    recentMotors[n-(CORTEX_CELLS-CORTEX_MOTORS)]+=spikes[n];
  }
 }
 for(let m=0;m<CORTEX_MOTORS;m++)recentMotors[m]/=6;
 return Array.from(recentMotors);
}
export function planCortexAlternatives(state,info={},motors=[]){
 const s=cleanCortex(state),context=bContext(info.route),
  issues=Math.max(0,Number(info.issues)||0),
  changes=!!info.routeChanged;
 const scores=CORTEX_ACTIONS.map((name,i)=>{
  let weight=(s.rewardBias[i]||0)+(s.contextWeights[context]?.[i]||0);
  weight+=(motors[i]||0)*.35;
  if(name==='quieto')weight+=.8;
  if(name==='dica')weight+=issues>0?1.8+Math.min(issues,10)*.12:-.8;
  if(name==='investigar')weight+=changes?2:-.65;
  if(name==='observar')weight+=info.visibleProject?1.4:.2;
  if(name==='curiosidade')weight+=s.curiosity>65?1.2:0;
  if(name==='meditar'||name==='descansar')weight+=s.energy<30?2.2:-.45;
  if(name==='celebrar')weight+=info.publishConfirmed?3.5:-2;
  if(name==='brincar'||name==='poção')weight+=info.playful&&s.energy>38?1:-.7;
  if(name==='acenar'||name==='brilhar')weight+=.2;
  if(name==='pensar'||name==='estudar')weight+=info.working?.7:0;
  if(name==='acolher')weight+=s.trust>55?.3:0;
  if(info.quiet&&name!=='quieto')weight-=8;
  if(info.reducedMotion&&['brincar','brilhar','alongar','poção'].includes(name))weight-=4;
  if(info.panelOpen&&name!=='quieto')weight-=3;
  if(info.editorVisible&&['brincar','poção','alongar','acenar','brilhar'].includes(name))weight-=3;
  weight-=((s.adaptation[name]||0)*.8);
  return {action:name,score:weight,reason:B_REASON[name]};
 });
 return scores.sort((a,b)=>b.score-a.score);
}
export function tickCortex(engine,info={},now=Date.now()){
 const state=engine.state,day=Math.floor(now/86400000);
 if(state.lastActiveDay!==day){
  state.autonomousCount=0;state.lastActiveDay=day;
 }
 const sensory=behaviorSense(info,info.brain||state);
 const motorSignals=pulseCortex(engine,sensory);
 state.stimulation=bClamp(state.stimulation+(sensory[8]+sensory[9]+sensory[10]?2:-.25));
 state.curiosity=bClamp(state.curiosity+(sensory[9]?2:-.08));
 state.energy=bClamp(state.energy+(info.working?-.35:.15));
 for(const name of CORTEX_ACTIONS)state.adaptation[name]=
  bClamp((state.adaptation[name]||0)*.92,0,1);
 const alternatives=planCortexAlternatives(state,info,motorSignals);
 const interval=Math.max(45000,Math.min(900000,Number(info.cooldownMs)||120000));
 const maxActions=Math.max(0,Math.min(8,Number.isFinite(info.dailyLimit)?info.dailyLimit:4));
 // Do not interrupt people typing, navigating, using the editor, watching a
 // dialog, or while this tab is hidden. The cortex still observes safe signals.
 const permitted=info.enabled===true&&!info.hidden&&!info.panelOpen&&
  !info.userBusy&&!info.quiet&&
  now-state.lastDecisionAt>=interval&&state.autonomousCount<maxActions;
 const best=alternatives.find(x=>x.action!=='quieto'&&x.score>1.2);
 const chosen=permitted&&best?best:null;
 if(chosen){
  state.lastAction=chosen.action;
  state.lastDecisionAt=now;
  state.autonomousCount++;
  state.adaptation[chosen.action]=1;
  state.lastCue=bContext(info.route);
 }
 engine.lastContext=bContext(info.route);
 return {action:chosen?.action||null,reason:chosen?.reason||null,
  alternatives:alternatives.slice(0,3),state,permitted,sensoryCount:CORTEX_SENSORS,
  motorSignals};
}
/** Reward-modulated conditioning, numeric episodes, no personal content. */
export function rewardCortex(engine,action,context,reward,now=Date.now()){
 if(!CORTEX_ACTIONS.includes(action)||!Number.isFinite(reward))return engine.state;
 const s=engine.state,index=CORTEX_ACTIONS.indexOf(action),
  bucket=bContext(context),r=bClamp(reward,-1,1);
 s.rewardBias[index]=bClamp((s.rewardBias[index]||0)+r*.13,-4,4);
 const table=s.contextWeights[bucket]||Array(CORTEX_MOTORS).fill(0);
 table[index]=bClamp((table[index]||0)+r*.18,-3,3);
 s.contextWeights[bucket]=table;s.feedbackCount++;
 s.lastRewardAt=now;
 s.episodes.push({action,context:bucket,reward:r>0?1:r<0?-1:0,at:now});
 s.episodes=s.episodes.slice(-32);
 s.trust=bClamp(s.trust+r*1.5);
 // Only recently active, eligible synapses are adjusted. Persist a sparse,
 // bounded set instead of leaking the whole 16K connection graph to GitHub.
 if(r!==0){
  let written=0;
  for(let i=0;i<engine.pre.length&&written<128;i++){
   const pre=engine.pre[i],post=engine.post[i];
   if(post!==CORTEX_CELLS-CORTEX_MOTORS+index||!engine.spikes[pre])continue;
   const old=s.synapses[i]||0,delta=bClamp(old+r*.012,-.45,.45);
   s.synapses[i]=delta;engine.weights[i]=bClamp(engine.weights[i]+r*.012,-2,2);
   written++;
  }
  const keys=Object.keys(s.synapses);
  if(keys.length>128){for(const key of keys.slice(0,keys.length-128))delete s.synapses[key];}
 }
 return s;
}
export function cortexSummary(state){
 const s=cleanCortex(state);
 return {neurons:CORTEX_CELLS,synapses:CORTEX_SYNAPSES,sensors:CORTEX_SENSORS,
  motors:CORTEX_MOTORS,learnedEpisodes:s.episodes.length,feedback:s.feedbackCount,
  preferred:CORTEX_ACTIONS[s.rewardBias.indexOf(Math.max(...s.rewardBias))]};
}

export const cortexKey=(namespace='default')=>'alquimago:cortex:v1:'+
 (/^[a-zA-Z0-9_-]{1,48}$/.test(namespace)?namespace:'default');
export function readCortex(storage,namespace='default'){
 try{
  const raw=storage?.getItem(cortexKey(namespace));
  if(!raw||raw.length>45000)return null;
  return cleanCortex(JSON.parse(raw));
 }catch{return null;}
}
export function writeCortex(storage,namespace,state){
 try{
  if(!storage)return false;
  const text=JSON.stringify(cleanCortex(state));
  if(text.length>45000)return false;
  storage.setItem(cortexKey(namespace),text);
  return true;
 }catch{return false;}
}
