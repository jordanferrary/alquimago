// Lightweight color/contrast assessment of PUBLIC same-origin portfolio covers.
// No remote inference, face detection, identification or hidden image uploads.
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
export function imageMetrics(pixels){
 if(!pixels||!pixels.data||!pixels.width||!pixels.height)return null;
 const d=pixels.data,w=pixels.width,h=pixels.height,total=Math.min(w*h,4096);
 let sum=0,sumSq=0,dark=0,bright=0,colors=0,saturation=0;
 const bins=new Set();
 for(let i=0;i<total;i++){
  const pos=i*4,r=d[pos],g=d[pos+1],b=d[pos+2],alpha=d[pos+3];
  if(alpha<40)continue;
  const light=.2126*r+.7152*g+.0722*b;
  sum+=light;sumSq+=light*light;
  if(light<45)dark++;if(light>210)bright++;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  saturation+=(max-min)/255;
  bins.add((r>>5)+'-'+(g>>5)+'-'+(b>>5));
  colors++;
 }
 if(!colors)return null;
 const mean=sum/colors;
 const deviation=Math.sqrt(Math.max(0,sumSq/colors-mean*mean));
 return {
  brightness:Math.round(mean/255*100),
  luminanceVariation:Math.round(deviation/255*100),
  darkPercent:Math.round(dark/colors*100),
  brightPercent:Math.round(bright/colors*100),
  colorGroups:bins.size,
  saturation:Math.round(saturation/colors*100)
 };
}
export function imageMetricAdvice(metric){
 if(!metric)return '';
 if(metric.luminanceVariation<12)return 'A capa tem pouca variação de luminosidade. Vale conferir o contraste e a leitura da silhueta em miniatura.';
 if(metric.darkPercent>78)return 'A capa tem predominância de tons escuros. Confira se o assunto principal continua legível em telas pequenas.';
 if(metric.brightPercent>72)return 'A capa tem muitas áreas claras. Verifique se detalhes e texto mantêm contraste suficiente.';
 if(metric.saturation<13)return 'A paleta é pouco saturada. Se essa for a intenção, confira se luz e volume ainda definem bem as formas.';
 if(metric.colorGroups>95)return 'A capa tem diversidade de cores. Um ponto focal claro pode ajudar a organizar a leitura visual.';
 return 'A distribuição geral de luz e cor parece equilibrada nesta amostra; observe a leitura do tema em tamanho reduzido.';
}
export async function inspectCover(image,{pageUrl,scale=48}={}){
 if(!image||!image.complete||!image.naturalWidth)return null;
 try{
  const base=pageUrl||globalThis.location?.href;
  if(!base)return null;
  const src=image.currentSrc||image.src;
  const resolved=new URL(src,base),origin=new URL(base).origin;
  if(resolved.origin!==origin)return null;
  const side=clamp(scale,16,64);
  const canvas=document.createElement('canvas');
  canvas.width=side;canvas.height=side;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  if(!ctx)return null;
  ctx.drawImage(image,0,0,side,side);
  return imageMetrics(ctx.getImageData(0,0,side,side));
 }catch{return null;}
}
