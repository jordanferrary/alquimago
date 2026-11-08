/**
 * Public-portfolio retrieval. No external services or guessing about artwork
 * pixels. This engine must be usable in any React site, not tied to an artist.
 */
const kText=(value,max=600)=>typeof value==='string'?value.replace(/[\u0000-\u001f\u007f<>]/g,' ').trim().slice(0,max):'';
export const knowledgeCanon=value=>String(value||'').normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR')
 .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const STOP=new Set('um uma o a os as de do da dos das e em no na nos nas para por com que qual quais como quanto quantos meus minhas seus suas sobre este esse essa isso projeto projetos trabalho trabalhos obra obras arte artes me fala diga explica falar quero saber esse aqui dele dela ele ela do isso'.split(' '));
const SUBJECT=/\b(projeto|obra|arte|portfolio|galeria|trabalho|personagem|modelagem|sculpt|design|capa|frankie|alice|piplup)\b/;
const FEEDBACK=/\b(analisa|analisar|analise|avaliar|avaliacao|opina|opiniao|feedback|critica|melhorar|sugestao|dica|acha|achou|recomend)\b/;
const LIST=/\b(quais|liste|lista|mostre|mostrar|todos|quantos|quantas)\b/;
const TOOLS=/\b(ferramenta|ferramentas|software|softwares|programa|programas|usou|fez|feito|produziu|criou|modelou)\b/;
const YEAR=/\b(ano|quando|data|epoca|criado)\b/;
const CATEGORY=/\b(categoria|tipo|estilo|classe)\b/;
const PRONOUN=/\b(ele|ela|dele|dela|desse|dessa|dele|obra|projeto|essa|esse|deste|desta|aqui|nela|nele)\b/;
function safeProject(value){
 if(!value||typeof value!=='object')return null;
 const title=kText(value.title,100),id=kText(value.id,90);
 if(!title||!id||!/^[-a-zA-Z0-9_]{3,90}$/.test(id))return null;
 const tools=Array.isArray(value.tools)?value.tools.filter(t=>typeof t==='string').map(t=>kText(t,55)).filter(Boolean).slice(0,12):[];
 const category=kText(value.category,70),year=kText(String(value.year||''),8);
 const description=kText(value.description,650);
 return {id,title,category,year,tools,description,featured:value.featured===true};
}
export function normalizeKnowledge(data){
 const root=data&&typeof data==='object'?data:{};
 const projects=Array.isArray(root.projects)?root.projects:
  Array.isArray(root.store?.projects)?root.store.projects:[];
 const seen=new Set(),out=[];
 for(const item of projects.slice(0,180)){
  const project=safeProject(item);
  if(!project||seen.has(project.id))continue;
  seen.add(project.id);out.push(project);
 }
 return {schema:1,revision:kText(root.revision,100),projects:out};
}
export async function loadKnowledge(path,{pageUrl,fetcher}={}){
 const origin=pageUrl||globalThis.location?.href;
 if(!origin||typeof path!=='string'||!path.trim())return normalizeKnowledge(null);
 const target=new URL(path,origin),base=new URL(origin);
 if(target.origin!==base.origin||!target.pathname.endsWith('.json')||target.username||target.password)
  throw Error('Base de conhecimento precisa ser um JSON público da mesma origem');
 const resp=await (fetcher||globalThis.fetch)(target.href,{
  method:'GET',credentials:'same-origin',redirect:'error',cache:'no-store'
 });
 if(!resp.ok)throw Error('Base pública de projetos indisponível');
 const length=Number(resp.headers?.get?.('content-length')||0);
 if(length>190000)throw Error('Base pública grande demais');
 const raw=await resp.text();
 if(raw.length>190000)throw Error('Base pública grande demais');
 return normalizeKnowledge(JSON.parse(raw));
}
const keys=text=>knowledgeCanon(text).split(' ').filter(w=>w.length>2&&!STOP.has(w));
function relevance(text,project){
 const q=knowledgeCanon(text),title=knowledgeCanon(project.title);
 if(!title)return 0;
 const titleTokens=keys(title),queryTokens=keys(q);
 if(q.includes(title)&&title.length>=4)return 20+title.length/10;
 let score=0;
 for(const term of titleTokens){
  if(queryTokens.includes(term))score+=term.length>=6?6:4;
  else if(term.length>=5&&queryTokens.some(w=>w.startsWith(term.slice(0,5))||term.startsWith(w.slice(0,5))))score+=2;
 }
 return titleTokens.length?score/titleTokens.length:score;
}
function chooseProject(text,knowledge,lastId='',focusTitle=''){
 const records=knowledge.projects||[];
 const q=knowledgeCanon(text);
 // Broad site feedback is not automatically criticism of the last project.
 // An explicit project title or pronoun is required to reuse its context.
 const broadlyAboutSite=/\b(?:site|portfolio|pagina|galeria)\b/.test(q)&&
  !/\b(?:dela|dele|nela|nele|essa obra|esse projeto|dessa obra)\b/.test(q);
 const namesAProject=records.some(project=>{
  const title=knowledgeCanon(project.title);
  return title.length>=4&&q.includes(title);
 });
 if(broadlyAboutSite&&!namesAProject)return null;
 const results=records.map(project=>({project,score:relevance(text,project)})).sort((a,b)=>b.score-a.score);
 if(results[0]?.score>=2.2)return results[0].project;
 if(PRONOUN.test(knowledgeCanon(text))||TOOLS.test(knowledgeCanon(text))||FEEDBACK.test(knowledgeCanon(text))){
  return records.find(p=>p.id===lastId)||
   records.find(p=>knowledgeCanon(p.title)===knowledgeCanon(focusTitle))||null;
 }
 return null;
}
function adviceFor(project){
 const c=knowledgeCanon(project.category+' '+project.title);
 if(/personagem|character|sculpt|criatura|face|rosto/.test(c))
  return 'Comece mostrando a silhueta, depois o acabamento e um detalhe de expressão. Um breakdown ajudaria a explicar suas decisões de modelagem.';
 if(/environment|cenario|ambiente|room|scene/.test(c))
  return 'Vale apresentar uma vista geral, um close dos materiais e um breakdown de iluminação. Isso facilita avaliar a composição e a profundidade.';
 if(/motion|animacao|animation/.test(c))
  return 'Mostre a animação completa e um breakdown do timing, das curvas e das decisões de movimento.';
 return 'Eu mostraria o resultado, um close técnico e um pequeno relato do processo. Assim, quem visita entende tanto a obra quanto as decisões de produção.';
}
export function answerFromKnowledge(text,context={}){
 const knowledge=normalizeKnowledge(context.knowledge),q=knowledgeCanon(text);
 const projects=knowledge.projects;
 if(!q||!projects.length)return null;
 const project=chooseProject(text,knowledge,context.lastProjectId,context.focusTitle);
 const listQuestion=LIST.test(q)&&
  /\b(projetos|trabalhos|obras|portfolio|galeria|artes|quantos|quantas)\b/.test(q);
 if(listQuestion&&(!project||/\b(todos|quantos|quais|lista)\b/.test(q))){
  const featured=projects.filter(p=>p.featured).length;
  const names=projects.slice(0,9).map(p=>'“'+p.title+'”').join(', ');
  return {intent:'project-list',reply:'Neste portfólio há '+projects.length+' projeto'+(projects.length===1?'':'s')+' publicado'+(projects.length===1?'':'s')+
   ' ('+featured+' em destaque). Encontrei: '+names+(projects.length>9?' e outros.':'.')+
   ' Se quiser, pergunte sobre uma obra pelo nome.',projectId:null,source:'public-portfolio'};
 }
 if(!project)return null;
 if(TOOLS.test(q)){
  return {intent:'project-fact',projectId:project.id,source:'public-portfolio',
   reply:project.tools.length?'No projeto “'+project.title+'”, as ferramentas cadastradas são: '+project.tools.join(', ')+'.':
    'O projeto “'+project.title+'” está publicado, mas as ferramentas não foram informadas. Não vou inventar quais foram usadas.'};
 }
 if(YEAR.test(q)){
  return {intent:'project-fact',projectId:project.id,source:'public-portfolio',
   reply:project.year?'“'+project.title+'” está registrado no portfólio com o ano '+project.year+'.':
    'O ano de “'+project.title+'” não está informado nos dados públicos.'};
 }
 if(CATEGORY.test(q)){
  return {intent:'project-fact',projectId:project.id,source:'public-portfolio',
   reply:project.category?'“'+project.title+'” está classificado como '+project.category+'.':
    'O projeto “'+project.title+'” não tem categoria cadastrada.'};
 }
 if(FEEDBACK.test(q)){
  return {intent:'project-advice',projectId:project.id,source:'public-portfolio',
   reply:'Sobre “'+project.title+'”: '+adviceFor(project)+
   ' Minha análise se baseia na categoria e nos dados publicados, não em reconhecer todos os detalhes visuais da imagem.'};
 }
 if(SUBJECT.test(q)||relevance(q,project)>=2.2||PRONOUN.test(q)){
  const facts=[project.category?'categoria '+project.category:null,project.year?'ano '+project.year:null,
   project.tools.length?'ferramentas '+project.tools.join(', '):null].filter(Boolean);
  const description=project.description?
   ' Há uma descrição publicada para essa obra.' : ' Ainda não há descrição cadastrada.';
  return {intent:'project-info',projectId:project.id,source:'public-portfolio',
   reply:'Encontrei “'+project.title+'” no portfólio. '+(facts.length?facts.join('; ').replace(/^categoria /,'Categoria ')+'. ':'')+
   description.trimStart()+' Posso comentar a apresentação ou informar as ferramentas cadastradas.'};
 }
 return null;
}
