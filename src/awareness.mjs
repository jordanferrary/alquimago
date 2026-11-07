// Privacy-preserving UI awareness: DOM metadata and public routes only.
// Never inspect input values, textarea contents, credentials or chats.
export function routeSignature(url){
 try{const u=new URL(url);return (u.pathname+u.hash).slice(0,120);}catch{return '/';}
}
export function readPublicPage(doc,locationUrl){
 const u=new URL(locationUrl),ids=[...doc.querySelectorAll('[id]')].map(x=>x.id);
 const imgs=[...doc.querySelectorAll('img')];
 const hash=(u.hash||'').toLowerCase();
 const route=hash.includes('contato')||hash.includes('contact')?'contact':
  hash.includes('portfolio')||hash.includes('gallery')?'gallery':
  hash.includes('sobre')||hash.includes('about')?'about':
  hash.includes('project/')?'project':
  hash.includes('page/')?'custom':'home';
 const editorial=!!doc.querySelector('.studio-dock,.studio-dock-root,[data-studio],.editor-overlay,.editor-panel');
 const heading=doc.querySelector('h1');
 const labels=[...doc.querySelectorAll('button')].filter(x=>!x.getAttribute('aria-label')&&!x.textContent.trim()).length;
 const metadata={
  route,signature:routeSignature(locationUrl),title:String(doc.title||'').slice(0,100),
  heading:!!heading,images:imgs.length,missingAlt:imgs.filter(i=>!i.hasAttribute('alt')).length,
  brokenImages:imgs.filter(i=>i.complete&&i.naturalWidth===0&&i.currentSrc).length,
  duplicateIds:ids.length-new Set(ids).size,unlabeledButtons:labels,
  links:doc.querySelectorAll('a[href]').length,editorial
 };
 return metadata;
}
export function suggestionsFromPage(page){
 if(!page)return [];
 const suggestions=[];
 const push=(id,title,description)=>suggestions.push({id,title,description});
 if(page.missingAlt)push('alt','Imagens sem descrição',page.missingAlt+' imagem(ns) sem atributo alt. Revise a acessibilidade.');
 if(page.brokenImages)push('broken','Imagens com erro',page.brokenImages+' mídia(s) não carregaram corretamente nesta página.');
 if(page.duplicateIds)push('ids','IDs repetidos',page.duplicateIds+' identificador(es) duplicados podem atrapalhar links e acessibilidade.');
 if(!page.heading)push('heading','Hierarquia da página','A página atual não possui título principal (h1).');
 if(page.unlabeledButtons)push('buttons','Botões sem nome',page.unlabeledButtons+' botão(ões) sem rótulo acessível.');
 const labels={
  home:['Destaques da página','Confira se a chamada principal conduz à obra certa.'],
  gallery:['Galeria de projetos','Revise o enquadramento das capas em telas menores.'],
  project:['Apresentação do projeto','Verifique o ritmo entre imagens, descrição e detalhes da obra.'],
  contact:['Página de contato','Confira links de redes sociais e o espaço ocupado na tela.'],
  about:['Página sobre','Reforce o que torna a trajetória e as habilidades relevantes.'],
  custom:['Página personalizada','Revise se os blocos estão claros e têm bons pontos de ação.']
 };
 const [title,description]=labels[page.route]||labels.home;
 push('route',title,description);
 if(page.editorial)push('editor','Modo de edição','Há controles do editor na página. Revise a prévia antes de publicar.');
 return suggestions.slice(0,6);
}
export function samePageSignature(a,b){
 return !!a&&!!b&&a.signature===b.signature&&a.images===b.images&&
 a.missingAlt===b.missingAlt&&a.brokenImages===b.brokenImages&&
 a.duplicateIds===b.duplicateIds&&a.unlabeledButtons===b.unlabeledButtons&&
 a.editorial===b.editorial;
}
