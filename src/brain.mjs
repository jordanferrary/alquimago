// Alquimago 0.3 — symbolic familiar brain, not a language model.
// XP rewards exploration/meaningful discovery rather than repetitive clicking.
const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
export const DEFAULT_BRAIN=Object.freeze({
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
 explore:{energy:-1,curiosity:4,focus:1,affinity:1,xp:4}
};
export function restoreBrain(raw){
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
  if(/^[-\w/#.]{1,120}$/.test(key)&&typeof value==='number'&&Number.isFinite(value))
   result.rewardedPages[key]=clamp(value,0,1e12);
 }
 return result;
}
export function applyAction(brain,name,now=Date.now(),detail=''){
 if(!Object.hasOwn(ACTIONS,name))return restoreBrain(brain);
 const next=restoreBrain(brain),action=ACTIONS[name];
 for(const key of ['energy','curiosity','focus','affinity'])next[key]=clamp(next[key]+action[key]);
 next.interactions=clamp(next.interactions+1,0,1e12);
 next.lastAction=name;next.lastSeen=now;
 next.sleepUntil=name==='rest'?now+3000:0;
 // No XP for petting, rest or passive UI changes. Other actions have cooldown.
 let earned=0;
 if(name==='explore'){
  const safe=typeof detail==='string'&&/^[-\w/#.]{1,120}$/.test(detail)?detail:'';
  // First deliberate exploration of each route per day.
  const day=Math.floor(now/86400000);
  if(safe&&next.rewardedPages[safe]!==day){earned=action.xp;next.rewardedPages[safe]=day;}
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
export function passTime(brain,elapsedMs,now=Date.now()){
 const next=restoreBrain(brain),minutes=clamp(elapsedMs/60000,0,30);
 next.energy=clamp(next.energy+minutes*.55);
 next.curiosity=clamp(next.curiosity+minutes*.15);
 next.focus=clamp(next.focus-minutes*.22);
 next.lastSeen=now;
 return next;
}
export function currentMood(brain,now=Date.now()){
 const b=restoreBrain(brain);
 if(b.sleepUntil>now)return 'meditando';
 if(b.energy<=23)return 'sonolento';
 if(['pet','stroke'].includes(b.lastAction)&&now-b.lastSeen<4500)return 'feliz';
 if(['play','brew'].includes(b.lastAction)&&now-b.lastSeen<4500)return 'animado';
 if(b.focus>=65&&b.lastAction==='focus')return 'concentrado';
 if(b.curiosity>=68)return 'curioso';
 return 'tranquilo';
}
export function levelFromXp(xp){return Math.max(1,Math.floor(Math.sqrt(Math.max(0,xp)/8))+1);}
