import {calculateBasic,answerFollowUp} from './conversation.mjs';
import {answerFromKnowledge} from './knowledge.mjs';
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
 // Help about THIS portfolio must reference the owner-facing Local Studio,
 // never generic suggestions to open source files or edit CSS by hand.
 // This branch is deliberately deterministic and does not consult Gemini.
 const studioChange=/\b(onde|como|local|lugar|alterar|altero|alteracao|modificar|mudar|mudo|trocar|troco|editar|edito|configurar|personalizar|ajustar|ajusto)\b/.test(q);
 const siteContext=/\b(site|portfolio|pagina|paleta|tema|cores|cor|visual|aparencia|studio)\b/.test(q);
 if(siteContext&&(
    /\b(paleta de cores|cores? (do|da|de|no|na|do meu|deste) (site|portfolio|pagina)|cor (principal|secundaria|do site|de fundo)|tema (do|do meu) (site|portfolio)|fundo do (site|portfolio))\b/.test(q)
    ||studioChange&&/\b(cores?|paleta|tema|aparencia)\b/.test(q)
  ))
  return {reply:'Para mudar as cores deste portfólio, desbloqueie o Local Studio e abra Ferramentas → Identidade → Paleta de cores. Lá você pode escolher uma cor pelo seletor cromático, HEX ou RGB, experimentar presets e conferir o resultado em tempo real. Clique em “Salvar paleta” e depois em “Publicar” para aplicar aos visitantes. Não precisa editar nenhum arquivo!',intent:'studio-guide'};
 if(studioChange&&/\b(projetos?|obras?)\b/.test(q)&&/\b(adicionar|adiciono|criar|crio|novo|editar|edito|alterar|mudar)\b/.test(q))
  return {reply:'No Local Studio, abra Ferramentas → Projetos → Novo projeto para cadastrar uma obra. Para ajustar uma obra existente, abra a página dela e use “Editar obra atual”. Revise o resultado e clique em “Publicar” quando estiver pronto.',intent:'studio-guide'};
 if(studioChange&&/\b(redes sociais|instagram|links? sociais)\b/.test(q))
  return {reply:'Para atualizar suas redes, abra Local Studio → Ferramentas → Conteúdo → Redes sociais. Edite os links, confira a prévia e publique as mudanças quando estiver satisfeito.',intent:'studio-guide'};
 if(studioChange&&/\b(skins?|mascote|modelo 3d|alquimago)\b/.test(q))
  return {reply:'Para personalizar meu modelo, abra Local Studio → Ferramentas → Familiar → Ateliê do Alquimago. Lá você importa o GLB e ajusta expressões, câmera e animações. Depois revise e publique.',intent:'studio-guide'};


 // Handle a user's answer BEFORE unrelated neural intent classification.
 const followup=answerFollowUp(raw,context.pending,{suggestions:context.suggestions});
 if(followup)return followup;
 const calculation=calculateBasic(raw);
 if(calculation)return {reply:'O resultado é '+calculation.text+'. ✦',intent:'math'};
 const grounded=answerFromKnowledge(raw,{knowledge:context.knowledge,lastProjectId:context.lastProjectId,focusTitle:context.focusTitle});
 if(grounded)return grounded;
 if(/\b(o que (voce|vc) (pode|consegue|sabe) fazer|(voce|vc) (pode|consegue|sabe) fazer (o que|oque)|o que voce faz|quais (suas|as) (funcoes|habilidades|capacidades)|para que voce serve|como voce funciona)\b/.test(q))
  return {reply:'Sou o Alquimago! Posso explicar recursos do portfólio, reconhecer projetos públicos, fazer contas simples, mostrar meu estado e reutilizar lições que você aprovou. Quando eu não souber algo, posso consultar o Gemini com sua permissão; a resposta só vira meu conhecimento após sua revisão. ✦',intent:'help'};
 if(context.neuralIntent==='greeting'||/^(?:oi+e*|oie+|ola+|eai+|eae+|opa+|salve+)[!?. ]*$/.test(q)||/\b(bom dia|boa tarde|boa noite)\b/.test(q))
  return {reply:'Oi! Sou '+name+'. Conheço os projetos públicos deste site, posso resolver contas e sugerir melhorias. Diga o nome de uma obra ou faça uma pergunta.',intent:'greeting'};
 if(context.neuralIntent==='identity'||/\b(quem (e|eh) voce|seu nome|qual (e|eh) (o )?seu nome|como voce se chama|o que voce (e|eh)|vc (e|eh))\b/.test(q))
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
  return {reply:'Posso orientar sobre obras públicas, recursos da página, contas, minhas emoções e memória aprovada. Se o assunto exigir conhecimento novo, consulto o Gemini somente quando habilitado e ofereço a resposta para revisão antes de aprender.',intent:'help'};
 if(context.neuralIntent==='mood'||/\b(triste|feliz|humor|sentindo|emocao)\b/.test(q))
  return {reply:'Meu humor simbólico agora está '+mood+'. Ele reage aos cuidados, às brincadeiras e ao tempo, mas não significa que eu tenha sentimentos humanos.',intent:'mood'};
 if(context.neuralIntent==='thanks'||/\b(obrigado|valeu|agradeco)\b/.test(q))
  return {reply:'Sempre um prazer ajudar nas suas criações. ✦',intent:'thanks'};
 return {reply:'Ainda não tenho informação suficiente para responder com segurança. Posso consultar as obras públicas, falar sobre a página ou fazer contas. Se quiser uma resposta mais ampla, é necessário conectar um modelo de linguagem.',intent:'unknown'};
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
