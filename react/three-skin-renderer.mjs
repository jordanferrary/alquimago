// Optional adapter: requires npm install three in the host React project.
// Import only when a site opts into GLB skins. The standalone SVG stays free
// of Three.js and loads no external scripts.
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export function registerThreeSkinRenderer(scope=window){
 const registry=scope.AlquimagoSkinRenderers||(scope.AlquimagoSkinRenderers={});
 registry.model3d=({host,url,shapeKeys={}})=>{
  if(!host||typeof url!=='string')throw Error('Invalid 3D skin');
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(38,1,0.01,30);
  camera.position.set(0,1.25,4.2);
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(scope.devicePixelRatio||1,2));
  renderer.setClearColor(0,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  const canvas=renderer.domElement;
  canvas.style.cssText='width:100%;height:100%;display:block;pointer-events:none';
  host.replaceChildren(canvas);
  const keyLight=new THREE.DirectionalLight(0xffe7dc,2);
  keyLight.position.set(3,5,5);
  const fill=new THREE.DirectionalLight(0x9d83ff,1.8);
  fill.position.set(-3,1,3);
  scene.add(keyLight,fill,new THREE.AmbientLight(0xd3c7fa,1.1));
  const mixers=[],meshes=[],targets=new Map();
  let model=null,request=0,disposed=false,last=performance.now(),current='idle',clock=0;
  const loader=new GLTFLoader();
  loader.load(url,gltf=>{
   if(disposed){gltf.scene.traverse(x=>{x.geometry?.dispose?.()});return;}
   model=gltf.scene;
   const box=new THREE.Box3().setFromObject(model);
   const size=new THREE.Vector3(),center=new THREE.Vector3();
   box.getSize(size);box.getCenter(center);
   const largest=Math.max(size.x,size.y,size.z,.001);
   model.scale.setScalar(2.25/largest);
   model.position.sub(center.multiplyScalar(2.25/largest));
   scene.add(model);
   model.traverse(obj=>{
    if(obj.isMesh){
     meshes.push(obj);
     const dict=obj.morphTargetDictionary||{};
     for(const [name,index] of Object.entries(dict)){
      if(!targets.has(name))targets.set(name,[]);
      targets.get(name).push({mesh:obj,index});
     }
    }
   });
   if(gltf.animations?.length){
    const mixer=new THREE.AnimationMixer(model);
    for(const animation of gltf.animations)mixer.clipAction(animation).play();
    mixers.push(mixer);
   }
  },undefined,()=>{/* sprite host can keep rendering neutral scene */});
  function updateSize(){
   const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
   renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  const resize=typeof ResizeObserver!=='undefined'?new ResizeObserver(updateSize):null;
  resize?.observe(host);
  updateSize();
  const names=Object.fromEntries(Object.entries(shapeKeys).filter(([k,v])=>typeof v==='string'&&v.length<65));
  const expressionValue=(key)=>key===current?1:0;
  function frame(now){
   if(disposed)return;
   const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;clock+=dt;
   for(const mixer of mixers)mixer.update(dt);
   for(const [key,name] of Object.entries(names)){
    const group=targets.get(name);
    if(!group)continue;
    const desired=expressionValue(key);
    for(const {mesh,index} of group){
     if(!mesh.morphTargetInfluences)continue;
     const nowValue=mesh.morphTargetInfluences[index]||0;
     mesh.morphTargetInfluences[index]=THREE.MathUtils.lerp(nowValue,desired,Math.min(1,dt*9));
    }
   }
   renderer.render(scene,camera);
   request=requestAnimationFrame(frame);
  }
  request=requestAnimationFrame(frame);
  return {
   setExpression(next){current=typeof next==='string'?next:'idle';},
   dispose(){
    if(disposed)return;disposed=true;
    cancelAnimationFrame(request);resize?.disconnect();
    for(const mixer of mixers)mixer.stopAllAction();
    for(const mesh of meshes){
     mesh.geometry?.dispose?.();
     const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
     for(const mat of materials)mat?.dispose?.();
    }
    renderer.dispose();
    if(canvas.parentNode===host)host.removeChild(canvas);
   }
  };
 };
 return registry.model3d;
}
