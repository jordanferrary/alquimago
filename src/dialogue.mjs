import {calculateBasic,answerFollowUp} from './conversation.mjs';
// Local, transparent conversation engine. Not a model of language or remote chat API.
// It only reads text the visitor explicitly enters into the familiar's own chat.
export function safeChatText(input){
 if(typeof input!=='string')return '';
 return input.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,320);
}
const plain=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function sensitiveChatText(text){
 return /(?:github_pat_|gh[pousr]_|\bsk-[a-zA-Z0-9]{12,}|\bAIza[a-zA-Z0-9_-]{20,}|\b(?:senha|password|token|secret|api\s*key)\b)/i.test(text);
}
export function respondToChat(input,context={}){
 const raw=safeChatText(input),q=plain(raw);
 const name=context.name||'Alquimago',mood=context.mood||'curioso';
 const page=context.page||'home',level=Math.max(1,Number(context.level)||1),xp=Math.max(0,Number(context.xp)||0);
 const tips=Array.isArray(context.suggestions)?context.suggestions:[];
 if(!raw)return {reply:'Escreva uma pergunta ou escolha um dos assuntos do grimório.',intent:'empty'};
 if(sensitiveChatText(raw))return {reply:'Isso parece conter informações privadas. Não compartilhe senhas ou tokens comigo. Não registrei essa mensagem no histórico.',intent:'private',store:false};
 // Handle a user's answer BEFORE unrelated neural intent classification.
 const followup=answerFollowUp(raw,context.pending,{suggestions:context.suggestions});
 if(followup)return followup;
 const calculation=calculateBasic(raw);
 if(calculation)return {reply:'O resultado é '+calculation.text+'. ✦',intent:'math'};
 if(context.neuralIntent==='greeting'||/^(?:oi+e*|oie+|ola+|eai+|eae+|opa+|salve+)[!?. ]*$/.test(q)||/\b(bom dia|boa tarde|boa noite)\b/.test(q))
  return {reply:'Saudações! Sou '+name+'. Minha poção está borbulhando e estou '+mood+'. Quer que eu analise a estrutura pública desta página? Responda sim ou não.',intent:'greeting',pending:{kind:'page-insight'}};
 if(context.neuralIntent==='identity'||/\b(quem (e|eh) voce|seu nome|o que voce (e|eh)|vc (e|eh))\b/.test(q))
  return {reply:'Sou '+name+', um familiar arcano interativo. Tenho memória local, sentimentos simbólicos e observo apenas a estrutura pública da página. Ainda não sou uma IA conversacional completa.',intent:'identity'};
 if(context.neuralIntent==='status'||/\b(xp|nivel|experiencia|progresso|status|energia)\b/.test(q))
  return {reply:'Meu grimório registra nível '+level+' e '+xp+' XP. Carinhos aumentam nossa afinidade, mas não geram XP infinito. Explorar uma rota ou realizar uma tarefa relevante ajuda na evolução.',intent:'status'};
 if(context.neuralIntent==='pet'||/\b(carinho|acariciar|afagar|cabeca|cabecinha)\b/.test(q))
  return {reply:'Passe o mouse suavemente de um lado para o outro sobre meu chapéu, sem clicar! Também pode arrastar o dedo sobre minha cabeça no celular. ✧',intent:'pet'};
 if(context.neuralIntent==='play'||/\b(brincar|brincadeira|jogar|bolinha)\b/.test(q))
  return {reply:'Uma brincadeira arcana! Quer que eu comece? Responda sim ou não.',intent:'play',pending:{kind:'play'}};
 if(context.neuralIntent==='brew'||/\b(pocao|elixir|alquimia|mistura)\b/.test(q))
  return {reply:'Misturei três gotas de luar, uma runa violeta e muita curiosidade. Poção concluída! ⚗',intent:'brew',action:'brew'};
 if(context.neuralIntent==='rest'||/\b(descansar|dormir|sono|meditar)\b/.test(q))
  return {reply:'Vou meditar por um instante e recuperar minha energia arcana.',intent:'rest',action:'rest'};
 if(/\b(abra|abre|abrir|navegar|visitar|ir|vai|levar|leva)\b.*\b(galeria|portfolio|contato|sobre|inicio|home)\b/.test(q)){
  const target=q.match(/\b(galeria|portfolio|contato|sobre|inicio|home)\b/)?.[1]||'';
  return {reply:'Vou procurar a seção '+target+' na navegação pública do site.',intent:'navigate',target};
 }
 if(context.neuralIntent==='insight'||/\b(sugestao|melhorar|analisar|erro|problema|site|pagina|projeto)\b/.test(q)){
  const tip=tips.find(t=>!['route','studio'].includes(t.id))||tips[0];
  return {reply:tip?'Encontrei uma observação sobre '+page+': '+tip.title+'. '+tip.description+' Quer que eu mostre como continuar com uma IA?':'Estou acompanhando a seção '+page+'. Posso revisar títulos, imagens e navegação pública; para analisar o código completo, preciso de arquivos autorizados.',intent:'insight',...(tip?{pending:{kind:'ai-handoff'}}:{})};
 }
 if(context.neuralIntent==='help'||/\b(ajuda|comandos|o que (faz|sabe)|como funciona)\b/.test(q))
  return {reply:'Podemos conversar sobre XP, carinho, poções, emoções e sugestões do site. Também sei responder sim ou não conforme a pergunta anterior e calcular contas como 2 + 2 ou 12 dividido por 4.',intent:'help'};
 if(context.neuralIntent==='mood'||/\b(triste|feliz|humor|sentindo|emocao)\b/.test(q))
  return {reply:'Meu humor simbólico agora está '+mood+'. Ele reage aos cuidados, às brincadeiras e ao tempo, mas não significa que eu tenha sentimentos humanos.',intent:'mood'};
 if(context.neuralIntent==='thanks'||/\b(obrigado|valeu|agradeco)\b/.test(q))
  return {reply:'Sempre um prazer ajudar nas suas criações. ✦',intent:'thanks'};
 return {reply:'Ainda não sei responder diretamente a isso. Quer que eu procure uma sugestão na estrutura pública desta página? Responda sim ou não.',intent:'unknown',pending:{kind:'page-insight'}};
}

export function dialogueKey(namespace='default'){
 const safe=/^[A-Za-z0-9_-]{1,48}$/.test(namespace)?namespace:'default';
 return 'alquimago:dialogue:v1:'+safe;
}
export function readDialogue(storage,namespace='default'){
 try{
  const raw=JSON.parse(storage.getItem(dialogueKey(namespace))||'[]');
  if(!Array.isArray(raw))return [];
  return raw.slice(-24).filter(item=>
   item && ['user','familiar'].includes(item.role) &&
   typeof item.text==='string' && !sensitiveChatText(item.text)
  ).map(item=>({role:item.role,text:safeChatText(item.text)}));
 }catch{return [];}
}
export function writeDialogue(storage,namespace='default',history=[]){
 const safe=Array.isArray(history)?history.slice(-24).filter(item=>
  item && ['user','familiar'].includes(item.role)&&typeof item.text==='string'&&!sensitiveChatText(item.text)
 ).map(item=>({role:item.role,text:safeChatText(item.text)})):[];
 try{storage.setItem(dialogueKey(namespace),JSON.stringify(safe));return true;}
 catch{return false;}
}
