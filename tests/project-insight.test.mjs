import test from 'node:test';
import assert from 'node:assert/strict';
import {projectMeta,projectAdvice,projectIdentity,shouldCommentProject} from '../src/project-insight.mjs';
const node={getAttribute:key=>({'data-alquimago-project':'Tubarão Estilizado','data-alquimago-category':'Character Sculpt','data-alquimago-year':'2026','data-alquimago-tools':'Blender, ZBrush'}[key]||null)};
test('project commentary is grounded in public project metadata',()=>{
 const meta=projectMeta(node);
 const result=projectAdvice(meta);
 assert.equal(meta.title,'Tubarão Estilizado');
 assert.match(result.comment,/silhueta/);
 assert.match(result.disclaimer,/não na análise visual/);
 assert.ok(projectIdentity(meta));
});
test('proactive commentary respects per-project cooldown and session cap',()=>{
 const key=projectIdentity(projectMeta(node));
 assert.equal(shouldCommentProject({},key,60000),true);
 assert.equal(shouldCommentProject({[key]:60000},key,65000),false);
 assert.equal(shouldCommentProject({[key]:60000},key,120000),true);
 assert.equal(shouldCommentProject(Object.fromEntries(Array.from({length:8},(_,i)=>['p'+i,1])),key,120000),false);
});
