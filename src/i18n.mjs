// Portuguese is the only built-in language. Other languages require a
// site-owned same-origin JSON pack; no automatic translation or external API.
export const PT_BR={
 code:'pt-BR',
 tabs:{chat:'Conversar',insights:'Observar',actions:'Interagir'},
 ui:{
  close:'Fechar',send:'Enviar',message:'Escreva para o familiar...',
  learn:'Ensinar',learnTitle:'Qual era o significado da última mensagem?',
  learnSuccess:'Aprendi. Teste novamente essa frase.',
  publish:'Publicar alterações',cancel:'Descartar ao recarregar',
  projectTitle:'Análise de projeto',settings:'Ajustes',back:'Voltar',
  privacy:'Somente informações públicas da página são observadas.',
  status:'Memória temporária até publicar',
  autonomous:'Observação proativa',
  customSkin:'Aparência',
  copy:'Copiar para IA',
  noPreview:'Nenhum projeto observado ainda.'
 }
};
const plainObject=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
export function normalizeLanguage(input){
 const d=plainObject(input),labels=plainObject(d.ui),tabs=plainObject(d.tabs);
 const safe=(value,fallback)=>typeof value==='string'&&value.trim()?value.trim().slice(0,140):fallback;
 return {
  code:safe(d.code,'pt-BR'),
  tabs:Object.fromEntries(Object.entries(PT_BR.tabs).map(([k,v])=>[k,safe(tabs[k],v)])),
  ui:Object.fromEntries(Object.entries(PT_BR.ui).map(([k,v])=>[k,safe(labels[k],v)])),
  intentLabels:Object.fromEntries(Object.entries(plainObject(d.intentLabels)).filter(([k,v])=>
    /^[a-z]{3,15}$/.test(k)&&typeof v==='string'&&v.length<=80)),
  responses:Object.fromEntries(Object.entries(plainObject(d.responses)).filter(([k,v])=>
    /^[a-z]{3,15}$/.test(k)&&typeof v==='string'&&v.length<=500)),
  intentSamples:Object.fromEntries(Object.entries(plainObject(d.intentSamples)).filter(([k,v])=>
    /^[a-z]{3,15}$/.test(k)&&Array.isArray(v)).map(([k,v])=>[k,v.filter(x=>typeof x==='string'&&x.length<=120).slice(0,12)]))
 };
}
export async function loadLanguage(path,{pageUrl,fetcher}={}){
 if(!path)return normalizeLanguage(null);
 const base=pageUrl||globalThis.location?.href;
 if(!base)throw Error('URL da página indisponível');
 const href=new URL(path,base);
 if(href.origin!==new URL(base).origin || !/\.json$/i.test(href.pathname))throw Error('Idioma deve ser JSON público da mesma origem');
 const response=await (fetcher||globalThis.fetch)(href.href,{credentials:'same-origin',redirect:'error',cache:'no-store'});
 if(!response.ok)throw Error('Idioma indisponível');
 const raw=await response.text();if(raw.length>25000)throw Error('Idioma muito grande');
 return normalizeLanguage(JSON.parse(raw));
}
