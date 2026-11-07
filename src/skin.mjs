// Skin manifest: default SVG, a hosted image, or a custom GLB model rendered
// by an OPTIONAL host adapter. No network libraries are loaded by Alquimago.
export const DEFAULT_SKIN={type:'svg',src:'',shapeKeys:{
 breath:'Breath',idle:'Idle',blink:'Blink',happy:'Happy',curious:'Curious',
 talk:'Talk',sleep:'Sleep',pet:'Pet',surprised:'Surprised',
 focused:'Focused',sad:'Sad',
 tired:'Tired',yawn:'Yawn',angry:'Angry',confused:'Confused',
 excited:'Excited',shy:'Shy',love:'Love',proud:'Proud',
 thinking:'Thinking',worried:'Worried',laugh:'Laugh',
 lookleft:'LookLeft',lookright:'LookRight',lookup:'LookUp',lookdown:'LookDown'
}};
export function normalizeSkin(value){
 const v=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 const type=['svg','image','model3d'].includes(v.type)?v.type:'svg';
 const source=typeof v.src==='string'&&v.src.length<500?v.src.trim():'';
 const shapes=v.shapeKeys&&typeof v.shapeKeys==='object'&&!Array.isArray(v.shapeKeys)?v.shapeKeys:{};
 const shapeKeys=Object.fromEntries(Object.entries(DEFAULT_SKIN.shapeKeys).map(([key,fallback])=>[
  key,typeof shapes[key]==='string'&&/^[\w .-]{1,64}$/.test(shapes[key])?shapes[key]:fallback
 ]));
 return {type,src:source,shapeKeys};
}
export function safeSkinUrl(skin,pageUrl){
 try{
  const u=new URL(skin.src,pageUrl),p=new URL(pageUrl);
  if(!['https:','http:'].includes(u.protocol)||u.origin!==p.origin||u.username||u.password)return null;
  const image=/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(u.pathname);
  const model=/\.(glb|gltf)$/i.test(u.pathname);
  return skin.type==='image'&&image||skin.type==='model3d'&&model?u.href:null;
 }catch{return null;}
}
export function skinExpression(mood){
 return ({feliz:'happy',animado:'happy',curioso:'curious',meditando:'sleep',sonolento:'sleep',concentrado:'focused',triste:'sad'})[mood]||'idle';
}
