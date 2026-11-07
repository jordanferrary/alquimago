/**
 * Portuguese conversation context and deterministic arithmetic.
 * Not an LLM: intended to cover dependable everyday interactions without
 * pretending that a small neural intent classifier can reason freely.
 */
const languageText=value=>String(value||'').normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()
 .replace(/[!?.,;:]+$/g,'').replace(/\s+/g,' ').slice(0,240);
const AFFIRM=new Set(['sim','ss','sss','s','claro','claro que sim','isso','isso mesmo','pode','pode sim','pode ser','bora','vamos','vamos sim','com certeza','com ctz','comcerteza','positivo','quero','quero sim','aham','aham sim','uhum','uhum sim','beleza','ok','okay','fechou','ta bom','tá bom','faz','faz sim','por favor','pfv']);
const NEGATE=new Set(['nao','nn','n','nope','nops','negativo','de jeito nenhum','agora nao','hoje nao','melhor nao','nao quero','nao obrigado','nao obrigada','nem','nem pensar','deixa','deixa pra la','prefiro nao','dispenso','nao precisa','nao valeu']);
export function yesNoIntent(value){
 const text=languageText(value);
 if(AFFIRM.has(text))return 'yes';
 if(NEGATE.has(text))return 'no';
 return null;
}
const NUMBERS={
 zero:0,um:1,uma:1,dois:2,duas:2,tres:3,quatro:4,cinco:5,seis:6,
 sete:7,oito:8,nove:9,dez:10,onze:11,doze:12,treze:13,
 quatorze:14,catorze:14,quinze:15,dezesseis:16,dezessete:17,
 dezoito:18,dezenove:19,vinte:20,trinta:30,quarenta:40,
 cinquenta:50,sessenta:60,setenta:70,oitenta:80,noventa:90,
 cem:100,cento:100,duzentos:200,trezentos:300,quatrocentos:400,quinhentos:500,
 mil:1000
};
function wordsToNumber(value){
 const chunks=value.split(/\s+e\s+/);
 if(chunks.length>4)return null;
 let total=0;
 for(const part of chunks){
  let segment=0;
  const words=part.split(/\s+/);
  for(const word of words){
   if(!Object.prototype.hasOwnProperty.call(NUMBERS,word))return null;
   if(word==='mil')segment=(segment||1)*1000;
   else segment+=NUMBERS[word];
  }
  total+=segment;
 }
 return Number.isFinite(total)&&total<=1e6?total:null;
}
function arithmeticText(value){
 let v=languageText(value).replace(/^(?:quanto e|quanto da|qual e o resultado de|qual o resultado de|calcule|calcula|resolva|resolva a conta|me diga quanto e)\s+/,'')
  .replace(/\s*(?:=)\s*$/,'').trim();
 // Recognizable, bounded word-number and arithmetic operators. Do not
 // accidentally calculate the XP, ID, year or unrelated strings.
 v=v.replace(/\b(?:vezes|multiplicado por)\b/g,' * ')
  .replace(/\b(?:dividido por|dividido|sobre)\b/g,' / ')
  .replace(/\b(?:mais|somado com)\b/g,' + ')
  .replace(/\b(?:menos|subtraido de)\b/g,' - ')
  .replace(/\b(?:elevado a|potencia de)\b/g,' ^ ')
  .replace(/(?<=[\d)])\s*[x×]\s*(?=[\d(])/g,' * ')
  .replace(/÷/g,' / ')
  .replace(/,/g,'.');
 v=v.replace(/\b(?:mil|cento|cem|noventa|oitenta|setenta|sessenta|cinquenta|quarenta|trinta|vinte|dezenove|dezoito|dezessete|dezesseis|quinze|quatorze|catorze|treze|doze|onze|dez|nove|oito|sete|seis|cinco|quatro|tres|dois|duas|uma|um|zero)(?:\s+e\s+(?:noventa|oitenta|setenta|sessenta|cinquenta|quarenta|trinta|vinte|dezenove|dezoito|dezessete|dezesseis|quinze|quatorze|catorze|treze|doze|onze|dez|nove|oito|sete|seis|cinco|quatro|tres|dois|duas|uma|um|zero))*/g,
  segment=>{const number=wordsToNumber(segment);return number===null?segment:String(number)});
 return v;
}
export function calculateBasic(input){
 if(typeof input!=='string'||input.length>140)return null;
 const expr=arithmeticText(input);
 if(!expr||expr.length>100||!/[+\-*/^]/.test(expr))return null;
 if(/[^0-9.+\-*/^()\s]/.test(expr))return null;
 const raw=expr.match(/\d+(?:\.\d+)?|\.\d+|[+\-*/^()]/g);
 if(!raw||raw.length>45||raw.join('')!==expr.replace(/\s+/g,''))return null;
 let cursor=0,depth=0;
 function factor(){
  if(depth++>10)throw Error('complexity');
  const token=raw[cursor++];
  let value;
  if(token==='+'||token==='-'){
   value=(token==='-'?-1:1)*factor();
  }else if(token==='('){
   value=expression();
   if(raw[cursor++]!==')')throw Error('missing bracket');
  }else if(token&&/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(token)){
   value=Number(token);
  }else throw Error('invalid number');
  depth--;
  if(!Number.isFinite(value)||Math.abs(value)>1e12)throw Error('overflow');
  return value;
 }
 function power(){
  let x=factor();
  if(raw[cursor]==='^'){cursor++;const exponent=power();if(Math.abs(exponent)>12)throw Error('exponent');x=x**exponent;}
  return x;
 }
 function term(){
  let v=power();
  while(raw[cursor]==='*'||raw[cursor]==='/'){
   const op=raw[cursor++],next=power();
   if(op==='/'&&next===0)throw Error('division by zero');
   v=op==='*'?v*next:v/next;
   if(!Number.isFinite(v)||Math.abs(v)>1e12)throw Error('overflow');
  }
  return v;
 }
 function expression(){
  let v=term();
  while(raw[cursor]==='+'||raw[cursor]==='-'){
   const op=raw[cursor++],next=term();
   v=op==='+'?v+next:v-next;
   if(!Number.isFinite(v)||Math.abs(v)>1e12)throw Error('overflow');
  }
  return v;
 }
 try{
  const value=expression();
  if(cursor!==raw.length||!Number.isFinite(value))return null;
  const rounded=Number(value.toPrecision(12));
  return {expression:expr,value:rounded,text:String(rounded).replace('.',',')};
 }catch{return null;}
}
/**
 * Only a validated pending question can authorize a local safe action.
 * 'yes' on its own never navigates, publishes, logs in, or modifies files.
 */
export function answerFollowUp(text,pending,context={}){
 const polarity=yesNoIntent(text);
 if(!polarity)return null;
 if(!pending||!['play','page-insight','ai-handoff','chat-or-insight'].includes(pending.kind)||
  !Number.isFinite(pending.at)||Date.now()-pending.at>5*60*1000)
  return {reply:'Entendi sua resposta, mas não tenho uma pergunta de sim ou não pendente. Pode me dizer a que você está respondendo?',intent:'clarify',pending:null};
 if(polarity==='no')
  return {reply:'Tudo bem! Não vou iniciar essa ação. Podemos continuar conversando ou escolher outra atividade.',intent:'decline',pending:null};
 if(pending.kind==='play')
  return {reply:'Combinado! Vamos brincar. ✦',intent:'followup',action:'play',pending:null};
 if(pending.kind==='page-insight'){
  const suggestions=Array.isArray(context.suggestions)?context.suggestions:[];
  const tip=suggestions.find(x=>x?.title&&x?.description);
  return {reply:tip?'Encontrei isto na página pública: '+String(tip.title).slice(0,80)+'. '+String(tip.description).slice(0,180):
   'Posso verificar títulos, imagens e navegação pública. Nesta página não encontrei um alerta específico.',intent:'followup',pending:null};
 }
 if(pending.kind==='ai-handoff')
  return {reply:'Certo! A opção “Continuar com IA” fica em Interagir → Ajustes e ferramentas. A escolha do serviço e o envio são feitos por você.',intent:'followup',pending:null};
 return {reply:'Claro! Posso ajudar com conversa, projetos, XP e pequenas contas. Sobre o que vamos falar?',intent:'followup',pending:null};
}
export function pendingFromReply(reply,now=Date.now()){
 if(!reply||!['play','page-insight','ai-handoff','chat-or-insight'].includes(reply.pending?.kind))return null;
 return {kind:reply.pending.kind,at:now};
}
