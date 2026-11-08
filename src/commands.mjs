/**
 * Exact owner-initiated Studio commands. A spoken phrase is a convenience
 * shortcut, NEVER a password, authorization proof, or autonomous permission.
 */
export function normalizeCommand(text){
 if(typeof text!=='string')return '';
 return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLocaleLowerCase('pt-BR')
  .trim()
  .replace(/[.!?,;:]+$/g,'')
  .trim().replace(/\s+/g,' ').slice(0,100);
}
export function recognizeStudioCommand(text,phrase='vai comprar pão'){
 const normalized=normalizeCommand(text),target=normalizeCommand(phrase);
 if(!normalized||!target)return null;
 return normalized===target?'prepare-publish':null;
}
