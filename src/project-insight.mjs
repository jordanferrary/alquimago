// Advisory commentary on PUBLIC PROJECT METADATA. Never claims to have inspected
// artwork pixels, and never reads form fields or private editor data.
const trim=(v,n=150)=>typeof v==='string'?v.trim().slice(0,n):'';
const unique=x=>[...new Set(x)];
export function projectMeta(element){
 if(!element||typeof element.getAttribute!=='function')return null;
 const title=trim(element.getAttribute('data-alquimago-project'),100);
 if(!title)return null;
 return {
  title,
  category:trim(element.getAttribute('data-alquimago-category'),70),
  year:trim(element.getAttribute('data-alquimago-year'),6),
  tools:trim(element.getAttribute('data-alquimago-tools'),150)
 };
}
const matches=(text,words)=>words.some(w=>text.includes(w));
export function projectAdvice(meta){
 if(!meta?.title)return null;
 const category=(meta.category||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const title=meta.title;
 const tips=[];
 if(matches(category,['character','personagem','criatura','sculpt','character design']))
  tips.push('Confira a leitura da silhueta, a expressão facial e o equilíbrio entre detalhes grandes e pequenos.');
 if(matches(category,['environment','ambiente','cenario','world','scene']))
  tips.push('Uma boa apresentação destaca hierarquia visual, iluminação e profundidade entre primeiro plano e fundo.');
 if(matches(category,['game','jogo','interactive','interativo']))
  tips.push('Vale mostrar o ativo funcionando na engine, além da modelagem e do orçamento técnico quando relevante.');
 if(matches(category,['stylized','estilizado','handpaint','hand-painted','asset','prop']))
  tips.push('Teste se o material e as cores reforçam a leitura de formas antes dos microdetalhes.');
 if(matches(category,['motion','animation','anima']))
  tips.push('Mostrar breakdowns e timing ajuda a revelar as decisões de movimento por trás do resultado.');
 if(meta.tools)tips.push('Ferramentas informadas: '+meta.tools+'. Uma pequena nota sobre o processo agrega contexto técnico.');
 if(!tips.length)tips.push('Eu incluiria um detalhe de processo, desafios e decisões de direção de arte na página completa.');
 if(!meta.year)tips.push('Uma data de criação ajuda a mostrar a evolução dos projetos ao longo do portfólio.');
 const primary=tips[0];
 return {
  title,
  label:'Sobre '+title,
  comment:'Estou vendo o projeto "'+title+'" ('+(meta.category||'arte')+'). '+primary,
  tips:unique(tips).slice(0,3),
  disclaimer:'Opinião baseada nos metadados da obra, não na análise visual dos pixels.',
  category:meta.category
 };
}
export function projectIdentity(meta){
 if(!meta?.title)return '';
 const str=[meta.title,meta.category,meta.year].join('|');
 let h=2166136261;
 for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}
 return (h>>>0).toString(36);
}
export function shouldCommentProject(history,key,now,{cooldownMs=45000,maxPerSession=8}={}){
 if(!key)return false;
 const records=history&&typeof history==='object'?history:{};
 const last=records[key]||0;
 const count=Object.keys(records).length;
 return count<maxPerSession && (!last||now-last>=cooldownMs);
}
