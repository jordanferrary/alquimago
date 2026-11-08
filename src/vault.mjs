/**
 * Alquimago Vault (ALQ-V1)
 * At-rest protection for device-local familiar data.
 * AES-256-GCM is a standard cryptographic primitive, not a homemade cipher.
 * Its non-extractable WebCrypto key is stored in IndexedDB; same-origin scripts
 * can still request decryption. This is not server-side authorization.
 */
export const VAULT_VERSION=1;
export const VAULT_DATABASE='alquimago-private-vault';
const toText=new TextEncoder(),fromText=new TextDecoder();
const namespaceName=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]{1,48}$/.test(value)?value:'default';
export function vaultKeys(namespace='default'){
 const ns=namespaceName(namespace);
 const keys=['memory:v2','dialogue:v1','lessons:v1','teaching:v2','neural:v1','prefs:v1','cortex:v1']
  .map(part=>'alquimago:'+part+':'+ns);
 if(ns==='default')keys.push('alquimago:v1');
 return keys;
}
export function createIndexedDbVaultStore(indexedDBFactory=globalThis.indexedDB){
 if(!indexedDBFactory)throw Error('IndexedDB não disponível.');
 const dbPromise=new Promise((resolve,reject)=>{
  const open=indexedDBFactory.open(VAULT_DATABASE,1);
  open.onupgradeneeded=()=>{if(!open.result.objectStoreNames.contains('records'))open.result.createObjectStore('records');};
  open.onerror=()=>reject(open.error||Error('Falha ao abrir cofre.'));
  open.onsuccess=()=>resolve(open.result);
 });
 const call=(mode,action)=>dbPromise.then(db=>new Promise((resolve,reject)=>{
  const transaction=db.transaction('records',mode),store=transaction.objectStore('records');
  let result;
  let failed=false;
  transaction.oncomplete=()=>resolve(result);
  transaction.onabort=()=>{if(!failed){failed=true;reject(transaction.error||Error('Transação do cofre abortada.'));}};
  transaction.onerror=()=>{if(!failed){failed=true;reject(transaction.error||Error('Falha de armazenamento do cofre.'));}};
  try{
   const request=action(store);
   request.onsuccess=()=>{result=request.result;};
   request.onerror=()=>{if(!failed){failed=true;reject(request.error||Error('Falha ao acessar cofre.'));}};
  }catch(error){failed=true;reject(error);try{transaction.abort();}catch{}}
 }));
 return {
  get:key=>call('readonly',s=>s.get(key)),
  put:(key,value)=>call('readwrite',s=>s.put(value,key))
 };
}
const bytesToBase64=bytes=>{
 let string='';
 for(let i=0;i<bytes.length;i+=0x8000)string+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
 return btoa(string);
};
const base64ToBytes=value=>{
 if(typeof value!=='string'||value.length>800000)throw Error('Registro de cofre inválido.');
 return Uint8Array.from(atob(value),c=>c.charCodeAt(0));
};
const emptyStorage=()=>({
 getItem:()=>null,setItem:()=>{throw Error('Cofre não disponível. Dados não salvos.');},
 removeItem:()=>{throw Error('Cofre não disponível.');}
});
export function unavailableVault(reason='Cofre seguro não disponível.'){
 return {status:'unavailable',reason,storage:emptyStorage(),flush:async()=>false};
}
export async function createAlquimagoVault({
 namespace='default',legacyStorage=null,cryptoProvider=globalThis.crypto,
 persistence=null,indexedDBFactory=globalThis.indexedDB,onStatus=()=>{}
}={}){
 const ns=namespaceName(namespace),allowed=new Set(vaultKeys(ns));
 if(!cryptoProvider?.subtle||!cryptoProvider.getRandomValues)return unavailableVault('WebCrypto indisponível: a memória não será salva sem proteção.');
 let dataStore;
 try{dataStore=persistence||createIndexedDbVaultStore(indexedDBFactory);}
 catch{return unavailableVault('IndexedDB indisponível: a memória não será salva sem proteção.');}
 const aad=toText.encode('alquimago:ALQ-V1:'+ns),keyName='key:'+ns,recordName='data:'+ns;
 const values=new Map();
 let key,record,failed=null,running=null,dirty=false;
 const notify=(status,reason='')=>{try{onStatus({status,reason});}catch{}};
 const seal=async value=>{
  const iv=cryptoProvider.getRandomValues(new Uint8Array(12));
  const encrypted=await cryptoProvider.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad},key,toText.encode(value));
  return {format:'ALQ-V1',version:VAULT_VERSION,iv:bytesToBase64(iv),payload:bytesToBase64(new Uint8Array(encrypted))};
 };
 const unseal=async payload=>{
  if(!payload||payload.format!=='ALQ-V1'||payload.version!==1)throw Error('Formato de cofre incompatível.');
  const iv=base64ToBytes(payload.iv),cipher=base64ToBytes(payload.payload);
  if(iv.length!==12||cipher.length<16)throw Error('Cofre inválido.');
  const plain=await cryptoProvider.subtle.decrypt({name:'AES-GCM',iv,additionalData:aad},key,cipher);
  const parsed=JSON.parse(fromText.decode(plain));
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error('Dados incompatíveis.');
  return parsed;
 };
 const persist=async()=>{
  if(running)return running;
  running=(async()=>{
   while(dirty){
    dirty=false;
    try{
     const payload=JSON.stringify(Object.fromEntries(values));
     if(payload.length>800000)throw Error('Memória excedeu o limite do cofre.');
     await dataStore.put(recordName,await seal(payload));
     notify('protected');
    }catch(error){
     failed=error;notify('error','Não foi possível gravar a memória criptografada.');
     return false;
    }
   }
   return true;
  })().finally(()=>{running=null;});
  return running;
 };
 const storage={
  getItem:name=>allowed.has(name)?values.get(name)??null:null,
  setItem:(name,value)=>{
   if(!allowed.has(name)||typeof value!=='string')throw Error('Registro não permitido pelo cofre.');
   if(failed)throw Error('Cofre bloqueado após falha de gravação.');
   values.set(name,value);dirty=true;void persist();
  },
  removeItem:name=>{
   if(!allowed.has(name))return;
   if(failed)throw Error('Cofre bloqueado após falha de gravação.');
   values.delete(name);dirty=true;void persist();
  }
 };
 try{
  record=await dataStore.get(recordName);
  key=await dataStore.get(keyName);
  if(record&&!key)throw Error('Chave ausente: os dados anteriores não podem ser recuperados.');
  if(!key){
   key=await cryptoProvider.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
   await dataStore.put(keyName,key);
  }
  if(key.extractable!==false||key.algorithm?.name!=='AES-GCM')throw Error('Chave incompatível.');
  if(record){
   const entries=await unseal(record);
   for(const [name,value] of Object.entries(entries))
    if(allowed.has(name)&&typeof value==='string')values.set(name,value);
  }else{
   for(const name of allowed){
    let old=null;
    try{old=legacyStorage?.getItem(name);}catch{}
    if(typeof old==='string')values.set(name,old);
   }
   // Durable authenticated ciphertext must be stored before removing plaintext.
   await dataStore.put(recordName,await seal(JSON.stringify(Object.fromEntries(values))));
  }
  for(const name of allowed){
   // Old localStorage copies are not used after the vault is unlocked.
   try{legacyStorage?.removeItem(name);}catch{}
  }
  notify('protected');
  return {
   status:'protected',reason:'AES-256-GCM · chave local não exportável',storage,
   flush:async()=>{while(running)await running;if(dirty)return persist();return !failed;}
  };
 }catch(error){
  notify('unavailable','Cofre não pôde ser aberto. Os dados existentes foram preservados.');
  return unavailableVault('Cofre não pôde ser aberto; não foram feitas gravações em texto puro.');
 }
}
