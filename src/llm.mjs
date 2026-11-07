/**
 * Optional REAL LLM transport. Disabled by default.
 * No model secrets in the bundle. Each request requires explicit consent.
 * Requests only the allowed server endpoint, never arbitrary web links.
 */
export function validateModelEndpoint(value,{pageUrl}={}){
 if(typeof value!=='string'||!value.trim()||value.length>500)return null;
 try{
  const u=new URL(value,pageUrl||globalThis.location?.href);
  if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash)return null;
  if(!/^\/api\/assistant\/?$/.test(u.pathname))return null;
  return u.href;
 }catch{return null;}
}
export function prepareModelConversation(prompt,history=[],project=null){
 const clean=x=>typeof x==='string'?x.replace(/[\u0000-\u001f\u007f]/g,' ').trim():'';
 const question=clean(prompt).slice(0,650);
 if(!question)return null;
 const safeHistory=Array.isArray(history)?history.slice(-8).filter(entry=>
  entry&&['user','familiar'].includes(entry.role)&&typeof entry.text==='string'
 ).map(entry=>({role:entry.role==='familiar'?'assistant':'user',content:clean(entry.text).slice(0,600)})):[];
 const context=project&&typeof project==='object'?{
  title:clean(project.title).slice(0,100),
  category:clean(project.category).slice(0,70),
  year:clean(project.year).slice(0,8),
  tools:Array.isArray(project.tools)?project.tools.slice(0,12).map(x=>clean(x).slice(0,55)):[]
 }:null;
 return {message:question,history:safeHistory,project:context,locale:'pt-BR'};
}
export async function askLanguageModel({endpoint,prompt,history=[],project,fetcher,signal,pageUrl}){
 const url=validateModelEndpoint(endpoint,{pageUrl});
 if(!url)throw Error('A conexão com a IA não está configurada em um endpoint seguro.');
 const body=prepareModelConversation(prompt,history,project);
 if(!body)throw Error('Escreva uma pergunta para a IA.');
 const impl=fetcher||globalThis.fetch;
 if(typeof impl!=='function')throw Error('Conexão de rede indisponível.');
 const response=await impl(url,{
  method:'POST',credentials:'include',redirect:'error',cache:'no-store',
  referrerPolicy:'no-referrer',
  headers:{'Content-Type':'application/json','X-Alquimago-Request':'1'},
  body:JSON.stringify(body),signal
 });
 if(!response.ok){
  if(response.status===401)throw Error('É preciso conectar a conta autorizada para usar a IA.');
  if(response.status===429)throw Error('O limite de conversas com IA foi atingido. Continue no modo local.');
  throw Error('O serviço de IA está indisponível. O modo local continua funcionando.');
 }
 const data=await response.json();
 const text=typeof data.reply==='string'?data.reply.trim().slice(0,2600):'';
 if(!text)throw Error('O modelo não retornou uma resposta utilizável.');
 return {reply:text,engine:'generative',model:typeof data.model==='string'?data.model.slice(0,80):'modelo configurado'};
}
