import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LESSONS_LIMIT,approveLesson,recallLesson,recallLessonFollowup,
  readLessons,writeLessons
} from '../src/learning.mjs';
import {
  TEACHING_EXAMPLES_LIMIT,approveTeachingExample,
  readTeachingExamples,writeTeachingExamples
} from '../src/teaching-intents.mjs';
import {
  NEURAL_PROTOTYPES_LIMIT,newNeuralModel,teachNeural,
  serializeNeuralModel,restoreNeuralModel,neuralPredict
} from '../src/neural.mjs';
import {
  CORTEX_CELLS,CORTEX_MOTORS,CORTEX_SYNAPSES,
  createCortex,createCortexRuntime,rewardCortex,cortexSummary,pulseCortex
} from '../src/behavior.mjs';

const data=new Map();
const storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};
test('expanded approved knowledge persists without changing the old key',()=>{
 assert.equal(LESSONS_LIMIT,128);
 let library=null;
 for(let i=0;i<110;i++){
  const result=approveLesson(library,'Qual conceito local '+i+'?','Conceito confirmado '+i);
  assert.equal(result.ok,true);
  library=result.library;
 }
 assert.equal(library.lessons.length,110);
 assert.equal(writeLessons(storage,'cognitive',library),true);
 assert.equal(readLessons(storage,'cognitive').lessons.length,110);
 assert.equal(recallLesson('Qual conceito local 0?',readLessons(storage,'cognitive'))?.reply,'Conceito confirmado 0');
 assert.equal(readLessons(storage,'another').lessons.length,0);
});

test('multi-intent examples persist up to 160 without publishing them',()=>{
 assert.equal(TEACHING_EXAMPLES_LIMIT,160);
 let memory=null;
 for(let i=0;i<130;i++){
  const result=approveTeachingExample(memory,'Exemplo revisado número '+i,{intents:['question','correction'],tone:'neutral'});
  assert.equal(result.ok,true);
  memory=result.memory;
 }
 assert.equal(memory.examples.length,130);
 assert.equal(writeTeachingExamples(storage,'cognitive',memory),true);
 assert.equal(readTeachingExamples(storage,'cognitive').examples.length,130);
});

test('neural prototypes have bounded expanded capacity and survive numeric backup',()=>{
 const model=newNeuralModel();
 assert.equal(NEURAL_PROTOTYPES_LIMIT,64);
 for(let i=0;i<78;i++)assert.equal(teachNeural(model,'Linguagem ensinada '+i,'help'),true);
 assert.equal(model.prototypes.length,64);
 const saved=serializeNeuralModel(model);
 assert.equal(restoreNeuralModel(saved)?.prototypes.length,64);
 assert.equal(JSON.stringify(saved).includes('Linguagem ensinada'),false);
 const predict=neuralPredict(restoreNeuralModel(saved),'Linguagem ensinada 77');
 assert.equal(predict.intent,'help');
 assert.ok(predict.confidence>=.9);
});

test('repeat follow-up requires the actual last reply to match an approved lesson',()=>{
 const library=approveLesson(null,'O que é um gizmo?','Gizmo é um controle de transformação.').library;
 const history=[{role:'user',text:'O que é um gizmo?'},{role:'familiar',text:'Gizmo é um controle de transformação.'}];
 assert.match(recallLessonFollowup('Pode repetir?',history,library)?.reply,/Gizmo é/);
 assert.equal(recallLessonFollowup('Pode repetir?',history.slice(0,1),library),null);
 assert.equal(recallLessonFollowup('Pode repetir?',[
  {role:'user',text:'O que é um gizmo?'},{role:'familiar',text:'Esta é uma resposta não verificada.'}
 ],library),null);
 assert.equal(recallLessonFollowup('Pode explicar outra questão?',history,library),null);
});

test('behavior feedback adjusts active motor pathways, never inactive synapses',()=>{
 const runtime=createCortexRuntime(createCortex(42));
 assert.equal(runtime.eligibility.length,CORTEX_SYNAPSES);
 const target=CORTEX_CELLS-CORTEX_MOTORS+2;
 const index=runtime.post.findIndex(v=>v===target);
 assert.ok(index>=0);
 rewardCortex(runtime,'dica','gallery',1,1000);
 assert.equal(Object.keys(runtime.state.synapses).length,0);
 runtime.eligibility[index]=6;
 rewardCortex(runtime,'dica','gallery',1,2000);
 assert.ok(runtime.state.synapses[index]>0);
 assert.equal(cortexSummary(runtime.state).plasticSynapses,1);
 runtime.spikes.fill(1);
 pulseCortex(runtime,Array(32).fill(1));
 assert.ok(runtime.eligibility.some(v=>v>0));
});
