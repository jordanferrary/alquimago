// Lightweight on-device neural intent classifier.
// 96 input feature neurons -> 24 hidden tanh neurons -> 12 intent output neurons.
// Trainable weights; never stores chat messages, credentials or raw text.
export const INTENTS=['greeting','identity','status','pet','play','brew','rest','navigate','insight','help','mood','thanks'];
const INPUTS=96,HIDDEN=24,OUTPUTS=INTENTS.length;
export const NEURAL_PROTOTYPES_LIMIT=64;
const samples={
 greeting:['oi','oie','oii','oiii','olá','ola','ola tudo bem','oi tudo bem','oiee','eae','eai','eai mago','opa','salve','bom dia','boa tarde','boa noite','oi maguinho','hey','hello','hello friend','oi maguinho como vai','e aí tudo bem','salvee','ola alquimago','bom dia alquimago','boa noite mago','eae parceiro','saudacoes','opa tudo certo','e aí mago'],
 identity:['quem é você','seu nome','como você se chama','quem e voce','o que voce e','voce e uma ia','pra que voce serve','me conta quem voce e','me diz seu nome','voce tem cerebro','qual e sua funcao','o que voce consegue fazer','que tipo de familiar voce e','o que e alquimago'],
 status:['qual meu xp','quanto xp eu tenho','meu nivel','qual o nivel','quanta energia','meu progresso','status','quanto de xp tenho','como estou de xp','mostre meu progresso','to em qual nivel','quanta energia voce tem','quanto falta pra subir de nivel','quais os seus atributos','me mostra as estatisticas','quantos pontos eu tenho'],
 pet:['carinho','quero fazer carinho','como faço carinho','passar a mao na cabeca','posso te acariciar','afagar o mago','quer um carinho','posso passar a mao na sua cabeca','como dar carinho','vou fazer cafune','voce gosta de cafune','passa a mao no chapeu','como acariciar o maguinho','quero te fazer cafune'],
 play:['vamos brincar','quero brincar','brincadeira','jogar um joguinho','brincar com voce','quer brincar comigo','bora brincar','brincar agora','vamos jogar a bolinha','brincar de novo','quero jogar com voce','comeca uma brincadeira','ta afim de brincar'],
 brew:['pocao','poção','faz poção','criar elixir','mistura magica','alquimia','preparar pocao','bora fazer uma pocao','prepare um elixir','pode criar uma pocao','vamos misturar ingredientes','quero fazer magia','pocao de criatividade','quero mexer no caldeirao','me ajuda com alquimia'],
 rest:['dormir','descansa','vai descansar','meditar','hora de dormir','ta com sono','recarregar energia','voce precisa descansar','vai dormir mago','descansa um pouco','quero que voce medite','medite um pouco','precisa de energia','dorme um pouquinho','pausa para descanso'],
 navigate:['abra a galeria','abre a galeria','ir para contato','navegar para sobre','abrir portfólio','vai para inicio','mostra a home','abrir a pagina contato','vamos para galeria','me mostra a pagina de contato','quero entrar na home','como vou pra sobre','ir na area de projetos','abre os trabalhos','leva ate meu portfolio','quero ver a pagina inicial'],
 insight:['ideias para o site','me da sugestoes','sugestão pro site','analise esta pagina','como melhorar meu site','ache erros no projeto','dica de design','me da um feedback da obra','analise o projeto que estou vendo','o que achou desse projeto','quais pontos eu posso melhorar','me de uma critica construtiva','tem alguma dica de composicao','me da sugestoes de design','o que falta nessa pagina'],
 help:['ajuda','preciso de ajuda','o que voce faz','quais comandos','como funciona','comandos','ajude-me','me ajuda com isso','me explica seus recursos','me ensine como funciona','quais funcoes voce tem','me conta seus comandos','do que e capaz','como posso falar com voce','como voce aprende'],
 mood:['como esta seu humor','ta feliz','se sente bem','voce ta triste','qual seu humor','ta animado','como voce esta hoje','qual e seu estado atual','voce esta contente','ta de bom humor','como anda sua curiosidade','ta animadinho','como se sente','qual e a sua energia emocional'],
 thanks:['obrigado','valeu','muito obrigado','brigado','agradeco','thanks','obg','obrigada','obg mago','valeu demais','vlw','agradecido','brigada','muito grato','obrigado pela ajuda']
};
const neuralClamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
function canon(input){
 return String(input||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
 .replace(/(.)\1{3,}/g,'$1$1').replace(/[^a-z0-9\s]/g,' ').trim().replace(/\s+/g,' ').slice(0,120);
}
function hash(value){
 let n=2166136261;
 for(let i=0;i<value.length;i++){n^=value.charCodeAt(i);n=Math.imul(n,16777619);}
 return n>>>0;
}
export function neuralFeatures(text){
 const s=canon(text),vec=Array(INPUTS).fill(0);
 if(!s)return vec;
 const tokens=s.split(' ');
 const features=[...tokens.map(w=>'t:'+w)];
 const padded='^'+s+'$';
 for(let i=0;i<padded.length-2;i++)features.push('3:'+padded.slice(i,i+3));
 for(let i=0;i<tokens.length-1;i++)features.push('p:'+tokens[i]+' '+tokens[i+1]);
 for(const feature of features)vec[hash(feature)%INPUTS]+=1;
 const norm=Math.hypot(...vec)||1;return vec.map(v=>v/norm);
}
// Curated vectors never change: calculate them once instead of re-hashing
// hundreds of example phrases for every visitor message.
let referenceVectorsCache=null;
function referenceVectors(){
 if(!referenceVectorsCache)referenceVectorsCache=Object.values(samples).flat().map(neuralFeatures);
 return referenceVectorsCache;
}
function deterministic(index){return ((hash('arcane-seed-'+index)%20001)/10000-1)*.13;}
export function newNeuralModel(){
 return {version:1,
  inputHidden:Array.from({length:INPUTS*HIDDEN},(_,i)=>deterministic(i)),
  hiddenBias:Array(HIDDEN).fill(0),
  hiddenOutput:Array.from({length:HIDDEN*OUTPUTS},(_,i)=>deterministic(i+3000)),
  outputBias:Array(OUTPUTS).fill(0),
  learned:0,prototypes:[],seedVersion:2
 };
}
export function neuralForward(model,text){
 const x=neuralFeatures(text),hidden=Array(HIDDEN).fill(0),raw=Array(OUTPUTS).fill(0);
 for(let j=0;j<HIDDEN;j++){
  let z=model.hiddenBias[j];
  for(let i=0;i<INPUTS;i++)if(x[i])z+=x[i]*model.inputHidden[i*HIDDEN+j];
  hidden[j]=Math.tanh(z);
 }
 for(let k=0;k<OUTPUTS;k++){
  let z=model.outputBias[k];
  for(let j=0;j<HIDDEN;j++)z+=hidden[j]*model.hiddenOutput[j*OUTPUTS+k];
  raw[k]=z;
 }
 const highest=Math.max(...raw);
 const exp=raw.map(z=>Math.exp(neuralClamp(z-highest,-40,40)));
 const total=exp.reduce((a,b)=>a+b,0);
 const probs=exp.map(n=>n/total);
 const chosen=probs.indexOf(Math.max(...probs));
 return {intent:INTENTS[chosen],confidence:probs[chosen],probabilities:probs,x,hidden};
}
export function trainNeural(model,text,intent,rate=.075){
 const target=INTENTS.indexOf(intent);
 if(target<0||!canon(text))return model;
 const {probabilities,x,hidden}=neuralForward(model,text);
 const outputError=probabilities.map((p,k)=>(k===target?1:0)-p);
 const hiddenError=Array(HIDDEN).fill(0);
 for(let j=0;j<HIDDEN;j++){
  let sum=0;for(let k=0;k<OUTPUTS;k++)sum+=outputError[k]*model.hiddenOutput[j*OUTPUTS+k];
  hiddenError[j]=sum*(1-hidden[j]*hidden[j]);
 }
 for(let k=0;k<OUTPUTS;k++)model.outputBias[k]=neuralClamp(model.outputBias[k]+rate*outputError[k],-5,5);
 for(let j=0;j<HIDDEN;j++){
  model.hiddenBias[j]=neuralClamp(model.hiddenBias[j]+rate*hiddenError[j],-5,5);
  for(let k=0;k<OUTPUTS;k++){
   const ix=j*OUTPUTS+k;
   model.hiddenOutput[ix]=neuralClamp(model.hiddenOutput[ix]+rate*outputError[k]*hidden[j],-5,5);
  }
 }
 for(let i=0;i<INPUTS;i++)if(x[i])for(let j=0;j<HIDDEN;j++){
  const ix=i*HIDDEN+j;
  model.inputHidden[ix]=neuralClamp(model.inputHidden[ix]+rate*hiddenError[j]*x[i],-5,5);
 }
 model.learned=neuralClamp((model.learned||0)+1,0,1000000);
 return model;
}
export function seedNeuralModel(){
 // Standalone builds embed a validated, pre-trained immutable seed. This
 // skips ~15k training iterations during startup on mobile and older PCs.
 if(typeof ALQUIMAGO_PRETRAINED!=='undefined'){
  const ready=restoreNeuralModel(ALQUIMAGO_PRETRAINED);
  if(ready)return ready;
 }
 const model=newNeuralModel();
 const list=Object.entries(samples).flatMap(([intent,phrases])=>phrases.map(text=>({intent,text})));
 // Deterministic initial examples, no network or personal data.
 for(let epoch=0;epoch<85;epoch++)
   for(const entry of list)trainNeural(model,entry.text,entry.intent,.11);
 model.learned=0;
 return model;
}
export function neuralPredict(model,text){
 const result=neuralForward(model,text);
 const profiles=Array.isArray(model.prototypes)?model.prototypes:[];
 let best=null,similarityToTaught=0;
 for(const entry of profiles){
  if(!entry||!Array.isArray(entry.features)||entry.features.length!==96||!INTENTS.includes(entry.intent))continue;
  const score=entry.features.reduce((total,n,i)=>total+n*result.x[i],0);
  if(score>similarityToTaught){similarityToTaught=score;best=entry.intent;}
 }
 // Explicit user teaching wins for the same phrase and very close variants.
 if(best&&similarityToTaught>=.90)return {intent:best,confidence:Math.min(.99,similarityToTaught),similarity:similarityToTaught,taught:true};
 // A softmax can be overconfident on unknown sentences. The nearest known
 // phrase provides an additional out-of-distribution similarity gate.
 let similarity=0;
 for(const vector of referenceVectors()){
  let dot=0;
  for(let i=0;i<INPUTS;i++)dot+=vector[i]*result.x[i];
  if(dot>similarity)similarity=dot;
 }
 return {intent:result.intent,confidence:result.confidence*similarity,similarity};
}
export function teachNeural(model,text,intent){
 if(!INTENTS.includes(intent)||!String(text||'').trim())return false;
 const before=Math.max(0,Number(model.learned)||0);
 for(let n=0;n<32;n++)trainNeural(model,text,intent,.065);
 const vector=neuralFeatures(text);
 const profiles=Array.isArray(model.prototypes)?model.prototypes:[];
 // Numerical features only, no raw chat content. One prototype per corrected
 // phrasing. Keep the last 24 to bound file size and learning complexity.
 const features=vector.map(n=>Number(n.toFixed(5)));
 const existing=profiles.findIndex(entry=>entry?.features?.every((n,i)=>Math.abs(n-features[i])<.00001));
 if(existing>=0)profiles.splice(existing,1);
 profiles.push({intent,features});
 model.prototypes=profiles.slice(-NEURAL_PROTOTYPES_LIMIT);
 model.learned=before+1;
 return true;
}
export function restoreNeuralModel(value){
 if(!value||value.version!==1)return null;
 const arrays=[['inputHidden',INPUTS*HIDDEN],['hiddenBias',HIDDEN],['hiddenOutput',HIDDEN*OUTPUTS],['outputBias',OUTPUTS]];
 for(const [key,length] of arrays)
  if(!Array.isArray(value[key])||value[key].length!==length||!value[key].every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=5))return null;
 const prototypes=Array.isArray(value.prototypes)?value.prototypes.slice(-NEURAL_PROTOTYPES_LIMIT).filter(entry=>
   entry&&INTENTS.includes(entry.intent)&&Array.isArray(entry.features)&&entry.features.length===INPUTS&&
   entry.features.every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1)
  ).map(entry=>({intent:entry.intent,features:[...entry.features]})):[];
 return {...Object.fromEntries(arrays.map(([key])=>[key,[...value[key]]])),version:1,
  learned:typeof value.learned==='number'?neuralClamp(value.learned,0,1e6):0,prototypes,
  seedVersion:Number.isSafeInteger(value.seedVersion)?Math.max(1,Math.min(2,value.seedVersion)):1};
}
export function serializeNeuralModel(model){
 const clean=restoreNeuralModel(model);
 return clean?{...clean,
  inputHidden:clean.inputHidden.map(n=>Number(n.toFixed(5))),
  hiddenOutput:clean.hiddenOutput.map(n=>Number(n.toFixed(5))),
  hiddenBias:clean.hiddenBias.map(n=>Number(n.toFixed(5))),
  outputBias:clean.outputBias.map(n=>Number(n.toFixed(5))),
  prototypes:clean.prototypes.map(entry=>({intent:entry.intent,features:entry.features.map(n=>Number(n.toFixed(5)))}))
 }:null;
}

export function neuralKey(namespace='default'){
 return 'alquimago:neural:v1:'+(/^[A-Za-z0-9_-]{1,48}$/.test(namespace)?namespace:'default');
}
export function upgradeNeuralSeed(model){
 const restored=restoreNeuralModel(model);
 if(!restored)return seedNeuralModel();
 if(restored.seedVersion>=2)return restored;
 const current=restored.learned,prototypes=restored.prototypes;
 // Teach the new, curated PT-BR examples without resetting personalized weights.
 for(let round=0;round<12;round++){
  for(const [intent,phrases] of Object.entries(samples))
   for(const sentence of phrases)trainNeural(restored,sentence,intent,.065);
 }
 restored.learned=current;
 restored.prototypes=prototypes;
 restored.seedVersion=2;
 return restored;
}
export function readNeural(storage,namespace='default'){
 try{
  const raw=storage.getItem(neuralKey(namespace));
  if(!raw||raw.length>200000)return null;
  return upgradeNeuralSeed(JSON.parse(raw));
 }catch{return null;}
}
export function writeNeural(storage,namespace,model){
 try{
  const valid=serializeNeuralModel(model);
  if(!valid)return false;
  const text=JSON.stringify(valid);
  if(text.length>200000)return false;
  storage.setItem(neuralKey(namespace),text);
  return true;
 }catch{return false;}
}
