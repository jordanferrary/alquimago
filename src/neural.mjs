// Lightweight on-device neural intent classifier.
// 96 input feature neurons -> 24 hidden tanh neurons -> 12 intent output neurons.
// Trainable weights; never stores chat messages, credentials or raw text.
export const INTENTS=['greeting','identity','status','pet','play','brew','rest','navigate','insight','help','mood','thanks'];
const INPUTS=96,HIDDEN=24,OUTPUTS=INTENTS.length;
const samples={
 greeting:['oi','oie','oii','oiii','olá','ola','ola tudo bem','oi tudo bem','oiee','eae','eai','eai mago','opa','salve','bom dia','boa tarde','boa noite','oi maguinho','hey','hello','hello friend'],
 identity:['quem é você','seu nome','como você se chama','quem e voce','o que voce e','voce e uma ia'],
 status:['qual meu xp','quanto xp eu tenho','meu nivel','qual o nivel','quanta energia','meu progresso','status','quanto de xp tenho'],
 pet:['carinho','quero fazer carinho','como faço carinho','passar a mao na cabeca','posso te acariciar','afagar o mago'],
 play:['vamos brincar','quero brincar','brincadeira','jogar um joguinho','brincar com voce'],
 brew:['pocao','poção','faz poção','criar elixir','mistura magica','alquimia','preparar pocao'],
 rest:['dormir','descansa','vai descansar','meditar','hora de dormir','ta com sono','recarregar energia'],
 navigate:['abra a galeria','abre a galeria','ir para contato','navegar para sobre','abrir portfólio','vai para inicio','mostra a home','abrir a pagina contato'],
 insight:['ideias para o site','me da sugestoes','sugestão pro site','analise esta pagina','como melhorar meu site','ache erros no projeto','dica de design'],
 help:['ajuda','preciso de ajuda','o que voce faz','quais comandos','como funciona','comandos','ajude-me'],
 mood:['como esta seu humor','ta feliz','se sente bem','voce ta triste','qual seu humor','ta animado'],
 thanks:['obrigado','valeu','muito obrigado','brigado','agradeco','thanks','obg']
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
function deterministic(index){return ((hash('arcane-seed-'+index)%20001)/10000-1)*.13;}
export function newNeuralModel(){
 return {version:1,
  inputHidden:Array.from({length:INPUTS*HIDDEN},(_,i)=>deterministic(i)),
  hiddenBias:Array(HIDDEN).fill(0),
  hiddenOutput:Array.from({length:HIDDEN*OUTPUTS},(_,i)=>deterministic(i+3000)),
  outputBias:Array(OUTPUTS).fill(0),
  learned:0
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
 // A softmax can be overconfident on unknown sentences. The nearest known
 // phrase provides an additional out-of-distribution similarity gate.
 const similarity=Math.max(0,...Object.values(samples).flat().map(sample=>{
  const vector=neuralFeatures(sample);
  return vector.reduce((sum,value,i)=>sum+value*result.x[i],0);
 }));
 return {intent:result.intent,confidence:result.confidence*similarity,similarity};
}
export function restoreNeuralModel(value){
 if(!value||value.version!==1)return null;
 const arrays=[['inputHidden',INPUTS*HIDDEN],['hiddenBias',HIDDEN],['hiddenOutput',HIDDEN*OUTPUTS],['outputBias',OUTPUTS]];
 for(const [key,length] of arrays)
  if(!Array.isArray(value[key])||value[key].length!==length||!value[key].every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=5))return null;
 return {...Object.fromEntries(arrays.map(([key])=>[key,[...value[key]]])),version:1,
  learned:typeof value.learned==='number'?neuralClamp(value.learned,0,1e6):0};
}
export function serializeNeuralModel(model){
 const clean=restoreNeuralModel(model);
 return clean?{...clean,
  inputHidden:clean.inputHidden.map(n=>Number(n.toFixed(5))),
  hiddenOutput:clean.hiddenOutput.map(n=>Number(n.toFixed(5))),
  hiddenBias:clean.hiddenBias.map(n=>Number(n.toFixed(5))),
  outputBias:clean.outputBias.map(n=>Number(n.toFixed(5)))
 }:null;
}

export function neuralKey(namespace='default'){
 return 'alquimago:neural:v1:'+(/^[A-Za-z0-9_-]{1,48}$/.test(namespace)?namespace:'default');
}
export function readNeural(storage,namespace='default'){
 try{
  const raw=storage.getItem(neuralKey(namespace));
  if(!raw||raw.length>180000)return null;
  return restoreNeuralModel(JSON.parse(raw));
 }catch{return null;}
}
export function writeNeural(storage,namespace,model){
 try{
  const valid=serializeNeuralModel(model);
  if(!valid)return false;
  storage.setItem(neuralKey(namespace),JSON.stringify(valid));
  return true;
 }catch{return false;}
}
