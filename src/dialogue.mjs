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
 if(/\b(oi|ola|eai|opa|bom dia|boa tarde|boa noite|salve)\b/.test(q))
  return {reply:'Saudações! Sou '+name+'. Minha poção está borbulhando e estou '+mood+'. Quer conversar, brincar ou analisar esta página?',intent:'greeting'};
 if(/\b(quem (e|eh) voce|seu nome|o que voce (e|eh)|vc (e|eh))\b/.test(q))
  return {reply:'Sou '+name+', um familiar arcano interativo. Tenho memória local, sentimentos simbólicos e observo apenas a estrutura pública da página. Ainda não sou uma IA conversacional completa.',intent:'identity'};
 if(/\b(xp|nivel|experiencia|progresso|status|energia)\b/.test(q))
  return {reply:'Meu grimório registra nível '+level+' e '+xp+' XP. Carinhos aumentam nossa afinidade, mas não geram XP infinito. Explorar uma rota ou realizar uma tarefa relevante ajuda na evolução.',intent:'status'};
 if(/\b(carinho|acariciar|afagar|cabeca|cabecinha)\b/.test(q))
  return {reply:'Passe o mouse suavemente de um lado para o outro sobre meu chapéu, sem clicar! Também pode arrastar o dedo sobre minha cabeça no celular. ✧',intent:'pet'};
 if(/\b(brincar|brincadeira|jogar|bolinha)\b/.test(q))
  return {reply:'Uma brincadeira arcana! Vou gastar um pouco de energia e ganhar curiosidade. Vamos?',intent:'play',action:'play'};
 if(/\b(pocao|elixir|alquimia|mistura)\b/.test(q))
  return {reply:'Misturei três gotas de luar, uma runa violeta e muita curiosidade. Poção concluída! ⚗',intent:'brew',action:'brew'};
 if(/\b(descansar|dormir|sono|meditar)\b/.test(q))
  return {reply:'Vou meditar por um instante e recuperar minha energia arcana.',intent:'rest',action:'rest'};
 if(/\b(sugestao|melhorar|analisar|erro|problema|site|pagina|projeto)\b/.test(q)){
  const tip=tips.find(t=>!['route','studio'].includes(t.id))||tips[0];
  return {reply:tip?'Encontrei uma observação sobre '+page+': '+tip.title+'. '+tip.description+' Quer levar isso para uma IA?':'Estou acompanhando a seção '+page+'. Posso revisar títulos, imagens e navegação pública; para analisar o código completo, preciso de arquivos autorizados.',intent:'insight'};
 }
 if(/\b(ajuda|comandos|o que (faz|sabe)|como funciona)\b/.test(q))
  return {reply:'Podemos conversar sobre XP, carinho, poções, emoções e sugestões do site. Também posso listar rotas do projeto e preparar um resumo para ChatGPT ou Gemini.',intent:'help'};
 if(/\b(triste|feliz|humor|sentindo|emocao)\b/.test(q))
  return {reply:'Meu humor simbólico agora está '+mood+'. Ele reage aos cuidados, às brincadeiras e ao tempo, mas não significa que eu tenha sentimentos humanos.',intent:'mood'};
 if(/\b(obrigado|valeu|agradeco)\b/.test(q))
  return {reply:'Sempre um prazer ajudar nas suas criações. ✦',intent:'thanks'};
 return {reply:'Essa pergunta vai além das respostas locais que conheço. Posso analisar a estrutura do site ou preparar sua pergunta para um modelo de IA, com sua autorização.',intent:'unknown'};
}
