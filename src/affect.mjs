// Alquimago's local, expressive affect model — not consciousness or LLM training.
// Events modify internal tendencies; the final face depends on accumulated
// state, background music, inertia and gentle seeded variability.
// No personal data, audio analysis, or Gemini/API calls.
const clampAffect=x=>Math.max(0,Math.min(1,Number.isFinite(x)?x:0));
const AFFECT_IMPULSES=Object.freeze({
 pet:{warmth:.36,calm:.11,tension:-.13,energy:.06},
 happy:{warmth:.26,curiosity:.07,calm:.04,tension:-.12},
 sad:{warmth:-.44,energy:-.11,curiosity:-.07},
 angry:{tension:.55,calm:-.26,warmth:-.11,curiosity:.12},
 surprised:{tension:.39,energy:.25,calm:-.21,curiosity:.2},
 curious:{curiosity:.24,energy:.05},
 focused:{curiosity:.25,calm:.03,energy:-.025},
 tired:{energy:-.26,curiosity:-.1,calm:.05},
 talk:{warmth:.08,curiosity:.08},
 project:{curiosity:.17,energy:.05},
 return:{warmth:.2,curiosity:.1},
 away:{warmth:-.4,energy:-.1},
 music:{calm:.19,tension:-.12,energy:-.04}
});
export function createAffect(seed=123456789,now=0){
 const initial=(Number(seed)>>>0)||123456789;
 return {
  calm:.56,curiosity:.45,warmth:.50,tension:.12,energy:.57,
  music:false,expression:'idle',changedAt:now,lastAt:now,
  seed:initial
 };
}
export function affectSignal(state,signal,now=state.lastAt){
 const next={...state,lastAt:Math.max(state.lastAt,now)};
 // Salient cues prompt an early *decision*, never a hardcoded face.
 if(['pet','happy','sad','angry','surprised','music','return','away'].includes(signal))
  next.changedAt=Math.min(next.changedAt,now-3700);
 const impulse=AFFECT_IMPULSES[signal]||{};
 for(const key of ['calm','curiosity','warmth','tension','energy']){
  next[key]=clampAffect(next[key]+(impulse[key]||0));
 }
 return next;
}
export function setAffectMusic(state,playing,now=state.lastAt){
 if(Boolean(playing)===state.music)return state;
 const next=affectSignal(state,playing?'music':'none',now);
 next.music=Boolean(playing);
 return next;
}
function nextRandom(state){
 let x=state.seed>>>0;
 x^=x<<13;x^=x>>>17;x^=x<<5;
 state.seed=x>>>0||123456789;
 return state.seed/4294967296;
}
export function affectTick(state,now){
 const elapsed=Math.max(0,Math.min(15000,now-state.lastAt));
 const next={...state,lastAt:now};
 const target={
  calm:next.music?.85:.55,
  curiosity:.47,warmth:.52,
  tension:next.music?.045:.12,
  energy:next.music?.44:.57
 };
 const alpha=1-Math.exp(-elapsed/(next.music?12000:19500));
 for(const key of Object.keys(target)){
  next[key]=clampAffect(next[key]+(target[key]-next[key])*alpha);
 }
 // A short period of expression inertia prevents twitchy face switching.
 if(now-next.changedAt<3500)return next;
 const {calm,curiosity,warmth,tension,energy,music}=next;
 const scores={
  idle:.28+calm*.5+(1-tension)*.11,
  breath:.10+calm*.48+(music?.18:0),
  serene:music?.48+calm*.62-tension*.43:.02+calm*.15,
  happy:.05+warmth*.62+energy*.14-tension*.13,
  curious:.05+curiosity*.66+energy*.09,
  focused:.04+curiosity*.63+calm*.11,
  thinking:.04+curiosity*.56+(1-energy)*.12,
  pet:Math.max(0,warmth-.56)*2.5+calm*.09,
  love:Math.max(0,warmth-.64)*2.25,
  angry:Math.max(0,tension-.21)*1.24+(1-calm)*.12,
  worried:Math.max(0,tension-.29)*.97+(1-warmth)*.17,
  surprised:Math.max(0,tension-.27)*1.03+Math.max(0,energy-.57)*.35,
  sad:Math.max(0,.40-warmth)*2.35+(1-energy)*.08,
  tired:Math.max(0,.40-energy)*1.65+(1-curiosity)*.05,
  sleep:Math.max(0,.30-energy)*2.05+calm*.08
 };
 // Seeded microvariations produce variety while keeping tests deterministic.
 const previous=next.expression;
 let best=previous,bestScore=(scores[previous]??0)+.075;
 for(const [name,value] of Object.entries(scores)){
  const jitter=(nextRandom(next)-.5)*.085;
  if(value+jitter>bestScore){
   bestScore=value+jitter;best=name;
  }
 }
 if(best!==previous){next.expression=best;next.changedAt=now;}
 else if(now-next.changedAt>12500){
  // Re-evaluate after a while without inventing dramatic reactions.
  next.changedAt=now-1500;
 }
 return next;
}
export function affectView(state){
 return {
  expression:state?.expression||'idle',
  calm:Math.round(clampAffect(state?.calm??.5)*100),
  tension:Math.round(clampAffect(state?.tension??.1)*100),
  curiosity:Math.round(clampAffect(state?.curiosity??.5)*100),
  music:state?.music===true
 };
}
