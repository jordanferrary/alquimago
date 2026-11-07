// Read-only inspection of explicit public file URLs. Not a filesystem scanner.
const EXT=/\.(?:txt|md|json|csv|html|css|js|mjs|ts|tsx)$/i;
const FORBIDDEN=/(?:^|\/)(?:\.git|\.env(?:\.|$)|secrets?|private|credentials?)(?:\/|\.|$)/i;
export function resolveProjectFile(value,pageUrl){
  if(typeof value!=='string'||!value.trim()||value.length>512)return null;
  try{
    const u=new URL(value,pageUrl),host=new URL(pageUrl);
    if(!/^https?:$/.test(u.protocol)||u.origin!==host.origin||!EXT.test(u.pathname)||FORBIDDEN.test(u.pathname)||u.username||u.password)return null;
    return u.href;
  }catch{return null;}
}
export async function inspectProjectFiles(list,{pageUrl,fetcher,maxBytes=64000}={}){
  const reader=fetcher||globalThis.fetch,base=pageUrl||globalThis.location?.href;
  if(!base||typeof reader!=='function')return [];
  const files=[...new Set((Array.isArray(list)?list:[]).filter(x=>typeof x==='string'&&x.trim()))].slice(0,12);
  const results=[];
  for(const file of files){
    const url=resolveProjectFile(file,base);
    if(!url){results.push({file,status:'blocked'});continue;}
    try{
      const response=await reader(url,{credentials:'same-origin',redirect:'error',cache:'no-store'});
      if(!response.ok){results.push({file,status:'unavailable'});continue;}
      const size=Number(response.headers?.get?.('content-length'));
      if(Number.isFinite(size)&&size>maxBytes){results.push({file,status:'oversized'});continue;}
      const buffer=await response.arrayBuffer();
      if(buffer.byteLength>maxBytes){results.push({file,status:'oversized'});continue;}
      results.push({file,status:'read',bytes:buffer.byteLength,excerpt:new TextDecoder().decode(buffer).slice(0,2000)});
    }catch{results.push({file,status:'unavailable'});}
  }
  return results;
}

/** An explicitly configured, bounded public JSON snapshot, not arbitrary browsing. */
export async function readPublicSnapshot(value,{pageUrl,fetcher,maxBytes=180000}={}){
 const base=pageUrl||globalThis.location?.href;
 if(!base)return null;
 const href=resolveProjectFile(value,base);
 if(!href||!new URL(href).pathname.endsWith('.json'))return null;
 try{
  const reader=fetcher||globalThis.fetch;
  if(typeof reader!=='function')return null;
  const response=await reader(href,{credentials:'same-origin',redirect:'error',cache:'no-store'});
  if(!response.ok)return null;
  const declared=Number(response.headers?.get?.('content-length'));
  if(Number.isFinite(declared)&&declared>maxBytes)return null;
  const body=await response.arrayBuffer();
  if(body.byteLength>maxBytes)return null;
  const parsed=JSON.parse(new TextDecoder().decode(body));
  return parsed&&typeof parsed==='object'&&parsed.schema===2?parsed:null;
 }catch{return null;}
}
