'use client';
import {useCallback, useEffect, useRef, useState} from 'react';
import ShakeRitual from './ShakeRitual';

const fortunes = [
 ['รุ่งอรุณแห่งโอกาส','เรื่องที่รอคอยกำลังเริ่มเห็นทางสว่าง จงก้าวต่อไปอย่างมั่นคง ความพยายามเล็ก ๆ จะนำไปสู่ผลลัพธ์ที่งดงาม','การงานมีแนวโน้มก้าวหน้า หากลงมืออย่างสม่ำเสมอ','ค่อย ๆ ดูแลความสัมพันธ์ด้วยความจริงใจ'],
 ['สายน้ำแห่งความสงบ','บางเรื่องไม่จำเป็นต้องรีบหาคำตอบ เมื่อใจนิ่งขึ้น ทิศทางจะปรากฏชัดเจนเอง','อย่าตัดสินใจด้วยความกังวล','คนใกล้ตัวพร้อมรับฟัง เพียงเปิดใจพูดคุย'],
 ['ดอกบัวกลางสระ','แม้เส้นทางเคยขรุขระ แต่ประสบการณ์จะกลายเป็นพลังให้คุณเติบโต','เหมาะกับการเรียนรู้สิ่งใหม่','ความสัมพันธ์งอกงามจากความเข้าใจ'],
 ['ลมพัดผ่านระฆัง','การเปลี่ยนแปลงไม่ใช่สิ่งน่ากลัว บางครั้งการปล่อยสิ่งเก่าคือการเปิดพื้นที่ให้สิ่งดี','ลองปรับวิธีทำงานเดิม ๆ','ให้เวลาตัวเองและอีกฝ่าย'],
 ['แสงเทียนไม่ดับ','ความตั้งใจที่แน่วแน่มีคุณค่า แม้คนอื่นยังมองไม่เห็นผล จงอดทนอย่างมีสติ','งานระยะยาวมีโอกาสสำเร็จ','ความใส่ใจเล็กน้อยสร้างความอบอุ่น'],
 ['สะพานไม้ข้ามธาร','มีผู้คนและโอกาสพร้อมช่วยให้คุณข้ามอุปสรรค อย่ากลัวการขอความร่วมมือ','การทำงานเป็นทีมส่งผลดี','มิตรภาพที่ดีเป็นพลังสำคัญ'],
 ['ต้นไทรแผ่ร่ม','รากฐานที่คุณสร้างไว้กำลังแข็งแรง เหมาะแก่การดูแลและต่อยอดมากกว่าการเร่งรีบ','จัดระบบก่อนเริ่มโครงการใหม่','ครอบครัวและเพื่อนให้กำลังใจ'],
 ['จันทร์ส่องวิหาร','สิ่งที่ยังไม่ชัดต้องใช้เวลา อย่าให้ความคิดมากบดบังความจริงที่อยู่ตรงหน้า','ตรวจสอบข้อมูลให้ครบ','คุยกันด้วยเหตุผลและความอ่อนโยน'],
 ['นกกลับรัง','การกลับไปหาสิ่งเรียบง่ายอาจทำให้พบความสุขที่หลงลืมไป','ทบทวนเป้าหมายของตนเอง','ใช้เวลากับคนที่ทำให้สบายใจ'],
 ['เมฆคล้อยเหนือภูเขา','อุปสรรคไม่ได้อยู่ตลอดไป ความอดทนและมุมมองใหม่จะช่วยให้เห็นทางออก','งานที่ติดขัดจะค่อย ๆ คลี่คลาย','อย่าเก็บทุกเรื่องไว้คนเดียว'],
 ['ประตูแห่งการเริ่มต้น','วันนี้เป็นวันที่เหมาะจะเริ่มต้นสิ่งเล็ก ๆ ที่เคยผัดวันประกันพรุ่ง','เริ่มจากแผนที่ทำได้จริง','กล้าส่งความรู้สึกดี ๆ ออกไป'],
 ['ระฆังรับอรุณ','ข่าวดีอาจมาในรูปแบบที่ไม่คาดคิด จงเปิดใจต่อความเป็นไปได้ และใช้สติเลือกทางของตน','โอกาสใหม่อาจเกิดจากการพบปะ','ความจริงใจจะนำพาความสัมพันธ์ที่ดี']
];

function TempleScene({active, onNear, onInteract, walkingRef}) {
 const mountRef=useRef(null); const actionRef=useRef({onNear,onInteract});
 useEffect(()=>{actionRef.current={onNear,onInteract}},[onNear,onInteract]);
 useEffect(()=>{
 if(!active || !mountRef.current)return;
 let cancelled=false, cleanup=()=>{};
 (async()=>{
 const THREE=await import('three'); if(cancelled)return;
 const host=mountRef.current;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#e3d2b6');scene.fog=new THREE.FogExp2('#e3d2b6',0.0038);
 const camera=new THREE.PerspectiveCamera(64,1,.1,180); camera.position.set(0,1.72,27);camera.lookAt(0,3,-11);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.35 : 1.65));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.07;renderer.outputColorSpace=THREE.SRGBColorSpace; host.appendChild(renderer.domElement);
 const hemi=new THREE.HemisphereLight('#eff1e9','#6a6956',1.55);scene.add(hemi);
 const sun=new THREE.DirectionalLight('#ffe8c4',2.35);sun.position.set(-24,34,14);sun.castShadow=true;sun.shadow.mapSize.set(window.innerWidth < 760 ? 1024 : 2048,window.innerWidth < 760 ? 1024 : 2048);sun.shadow.bias=-0.0003;sun.shadow.camera.left=-38;sun.shadow.camera.right=38;sun.shadow.camera.top=38;sun.shadow.camera.bottom=-38;sun.shadow.normalBias=.025;scene.add(sun);
 const mat=(color,roughness=1,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 // Generated PBR-style textures: no external downloads, licenses or network dependencies.
 const proceduralTexture=(base,detail,kind,size=512)=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
  const ctx=canvas.getContext('2d');ctx.fillStyle=base;ctx.fillRect(0,0,size,size);
  let seed=kind==='stone'?31:kind==='wood'?59:83;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  for(let i=0;i<8500;i++){const v=Math.floor(rnd()*255);ctx.fillStyle=`rgba(${v},${v},${v},${.013+rnd()*.045})`;ctx.fillRect(rnd()*size,rnd()*size,1+rnd()*7,1+rnd()*3)}
  if(kind==='stone'){ctx.strokeStyle='rgba(85,72,61,.24)';ctx.lineWidth=3;for(let y=0;y<=size;y+=size/4){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(size,y);ctx.stroke()}for(let i=0;i<4;i++){let y=i*size/4;for(let x=(i%2)*size/4;x<=size;x+=size/2){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+size/4);ctx.stroke()}}}
  if(kind==='wood'){for(let i=0;i<140;i++){ctx.strokeStyle=`rgba(35,20,12,${.04+rnd()*.11})`;ctx.lineWidth=.4+rnd()*2;let y=rnd()*size;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(size*.3,y+rnd()*14,size*.7,y-rnd()*14,size,y+rnd()*9);ctx.stroke()}}
  if(kind==='tile'){ctx.lineWidth=2;ctx.strokeStyle='rgba(35,12,10,.28)';for(let y=0;y<size;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(size,y);ctx.stroke();for(let x=(Math.floor(y/64)%2)*32;x<size;x+=64){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+64);ctx.stroke()}}}
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return tex;
 };
 const groundTex=proceduralTexture('#bfae96',null,'stone');groundTex.repeat.set(3,24);
 const woodTex=proceduralTexture('#715044',null,'wood');woodTex.repeat.set(2,2);
 const roofTex=proceduralTexture('#8c4131',null,'tile');roofTex.repeat.set(4,3);
 const plaster=mat('#e0c9a8'),gold=mat('#b88a35',.32,.62),dark=mat('#4a2220'),red=mat('#822e23'),stone=mat('#b7aa93'),leaf=mat('#56784a'),wood=new THREE.MeshStandardMaterial({map:woodTex,roughness:.83}),white=mat('#e7d9bb');
 const pathMaterial=new THREE.MeshStandardMaterial({map:groundTex,roughness:.95});
 const roofMaterial=new THREE.MeshStandardMaterial({map:roofTex,roughness:.86,metalness:0,side:THREE.DoubleSide});
 const cube=(w,h,d,m,x,y,z,sh=true)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=sh;o.receiveShadow=true;scene.add(o);return o};
 const cyl=(rt,rb,h,m,x,y,z,n=12)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),m);o.position.set(x,y,z);o.castShadow=true;scene.add(o);return o};
 const edgeGold = new THREE.MeshStandardMaterial({
  color: 0xb99135,
  metalness: 0.65,
  roughness: 0.32,
});
 cube(180,.15,180,mat('#82906c'),0,-.11,0,false);
 cube(6,.06,60,pathMaterial,0,.01,11,false);
 for(let i=0;i<16;i++){const z=27-i*2.55;cube(6.2,.025,.08,mat('#c7b89c'),0,.05,z,false)}
 // Outer temple platform and stairs
 cube(16,1,15,plaster,0,.52,-12);
 for(let i=0;i<4;i++)cube(8,.14,1.1,stone,0,.14+i*.13,-3.85-i*.8);
 cube(15,7,11,plaster,0,4.4,-13.4);
 cube(12.2,5.4,.18,red,0,4.3,-7.83);
 cube(3.0,5.2,.22,wood,0,3.6,-7.69);
 cube(2.2,4.5,.26,mat('#25201b'),0,3.55,-7.51);
 for(const x of [-6.2,-4.1,4.1,6.2]){cyl(.39,.46,6.6,red,x,4.25,-6.4);cyl(.56,.55,.28,gold,x,7.58,-6.4);cyl(.58,.54,.3,gold,x,1.1,-6.4)}
 // V03.1: roof slopes, multi-tiered gables, finials, gilded ornament instead of flat blocks.
 const beam=(a,b,r,material,radial=8)=>{const v=new THREE.Vector3().subVectors(b,a),mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),radial),material);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());mesh.castShadow=true;scene.add(mesh);return mesh};
 const roofPlane=(verts,material)=>{const shape=new THREE.BufferGeometry();shape.setAttribute('position',new THREE.Float32BufferAttribute(verts.flat(),3));shape.setIndex([0,1,2,0,2,3]);shape.computeVertexNormals();const mesh=new THREE.Mesh(shape,material);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);return mesh};
 function templeRoof(width,depth,y,zFront,rise){
  const x=width/2,zBack=zFront-depth;
  roofPlane([[-x,y,zFront],[0,y+rise,zFront],[0,y+rise,zBack],[-x,y,zBack]],roofMaterial);
  roofPlane([[0,y+rise,zFront],[x,y,zFront],[x,y,zBack],[0,y+rise,zBack]],roofMaterial);
  beam(new THREE.Vector3(-x,y,zFront+.15),new THREE.Vector3(0,y+rise,zFront+.15),.105,gold);
  beam(new THREE.Vector3(0,y+rise,zFront+.15),new THREE.Vector3(x,y,zFront+.15),.105,gold);
  beam(new THREE.Vector3(0,y+rise,zFront),new THREE.Vector3(0,y+rise,zBack),.12,gold);
  for(const side of [-1,1]){
   const xEdge=side*x;
   beam(new THREE.Vector3(xEdge,y+.02,zFront+.45),new THREE.Vector3(xEdge,y+.02,zBack),.09,dark);
   const tip=beam(new THREE.Vector3(xEdge,y,zFront+.2),new THREE.Vector3(xEdge+side*.45,y+.72,zFront+.9),.10,gold);
  }
  // Gable infill under the roof, facing the player.
  const gable=new THREE.Shape();gable.moveTo(-x+.1,y+.05);gable.lineTo(0,y+rise-.17);gable.lineTo(x-.1,y+.05);gable.closePath();
  const ornament=new THREE.Mesh(new THREE.ShapeGeometry(gable),mat('#713725'));ornament.position.z=zFront-.045;scene.add(ornament);
   // V03.4: keep the roof edge silhouette clean. A single subtle emblem
   // replaces the old fan of floating wire-like gold beams on every gable.
   const trim=new THREE.Mesh(new THREE.TorusGeometry(.22,.028,6,32),gold);
   trim.position.set(0,y+rise*.48,zFront+.065);scene.add(trim);
 }
 // V03.3: original handcrafted gilded relief, shipped as a reusable local GLB asset.
 // Keep existing procedural temple as a fallback if the model cannot be loaded.
 const ornamentAssetPromise=import('three/addons/loaders/GLTFLoader.js').then(({GLTFLoader})=>{
  const loader=new GLTFLoader();
  return new Promise(resolve=>loader.load('/models/temple-ornaments.glb',gltf=>{
   if(!cancelled){
    gltf.scene.traverse(node=>{
     if(node.isMesh){
      node.castShadow=false;node.receiveShadow=true;
      const m=node.material;
      if(m){m.metalness=.24;m.roughness=.62;m.needsUpdate=true}
     }
    });
    scene.add(gltf.scene);
   }
   resolve();
  },undefined,err=>{console.warn('Temple GLB ornament fallback:',err);resolve()}));
 }).catch(err=>console.warn('GLB loader unavailable:',err));
 // Layered glazed roof tiles and gold ridge ornaments; instances limit draw calls.
 function decorateRoof(width,depth,y,zFront,rise){
  const tileMaterial=new THREE.MeshStandardMaterial({color:'#9c4531',roughness:.62,metalness:.04});
  const rows=11,cols=Math.max(14,Math.floor(width/.55)),total=rows*cols*2;
  const geometry=new THREE.BoxGeometry(.38,.025,.66),tiles=new THREE.InstancedMesh(geometry,tileMaterial,total);
  const dummy=new THREE.Object3D();let idx=0;
  for(const side of [-1,1])for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
   const t=(col+.5)/cols,half=width/2,xx=side*(.13+t*(half-.25));
   const zz=zFront-.40-(row+.5)*(depth-.8)/rows;
   dummy.position.set(xx,y+rise*(1-Math.abs(xx)/half)+.065,zz);
   dummy.rotation.set(0,0,-side*Math.atan2(rise,half));dummy.updateMatrix();tiles.setMatrixAt(idx++,dummy.matrix);
  }
  tiles.castShadow=true;tiles.receiveShadow=true;tiles.instanceMatrix.needsUpdate=true;scene.add(tiles);
  // Ridge profile intentionally uncluttered; avoid duplicate spiky finials.
 }
 templeRoof(20.8,17.5,8.1,-4.35,3.05);
 templeRoof(16.9,14.3,10.25,-5.65,2.55);
 templeRoof(12.8,11.3,12.05,-7.05,2.15);
 decorateRoof(20.8,17.5,8.1,-4.35,3.05);
 decorateRoof(16.9,14.3,10.25,-5.65,2.55);
 decorateRoof(12.8,11.3,12.05,-7.05,2.15);
 // Stucco window recesses and hand-made frames.
 for(const side of [-1,1])for(let z=-11;z>-16;z-=2.5){
  cube(.12,2.45,1.2,wood,side*7.58,4.4,z);cube(.14,.15,1.35,gold,side*7.67,5.57,z);
 }
  // Warm carved-gold frame. The local GLB supplies the prominent gable relief.
  const gableGold=new THREE.MeshStandardMaterial({color:'#b79250',roughness:.66,metalness:.23});
 for(const side of [-1,1]){
  // Trim running down the front façade.
  cube(.11,6.4,.28,gold,side*7.35,4.85,-7.67);
  for(let j=0;j<6;j++){
   const ornament=new THREE.Mesh(new THREE.OctahedronGeometry(.16,0),gableGold);
   ornament.position.set(side*7.35,2.3+j*.92,-7.44);scene.add(ornament);
  }
 }
 // Window / door carved architraves at the altar entrance.
 for(const x of [-1.7,1.7])cube(.22,5.65,.3,gold,x,3.62,-7.35);
 cube(3.62,.25,.36,gold,0,6.43,-7.35);
 for(let i=0;i<9;i++){const x=-1.4+i*.35;cube(.065,.85,.08,gold,x,5.8,-7.08)}
 // ceremonial entrance lintel and ornamental hanging garlands
 cube(5.2,.35,.35,edgeGold,0,6.85,-6.35);
 for(let x=-1.8;x<=1.81;x+=1.2){const pendant=cyl(.045,.085,.22,edgeGold,x,6.60,-6.0,8);pendant.rotation.z=.1}
 // V03.3: shallow carved paneling, lintels and base plinths add architectural scale.
 const limeWash=proceduralTexture('#d5b993',null,'stone',512);limeWash.repeat.set(2,2);
 const stucco=new THREE.MeshStandardMaterial({map:limeWash,roughness:1});
 for(const sign of [-1,1]){
  cube(.16,4.9,8.7,stucco,sign*7.58,4.15,-13.5,false);
  for(let k=0;k<5;k++){
   const z=-17.5+k*1.85;
   cube(.21,2.5,.10,wood,sign*7.68,4.1,z);
   cube(.23,.10,1.5,gold,sign*7.7,5.36,z+.58);
  }
  cube(.34,.25,12.0,gold,sign*7.55,1.15,-13.0);
 }
 for(const sign of [-1,1]){
  cube(3.55,.16,.27,gold,sign*4.9,6.8,-7.55);
  for(let k=0;k<6;k++){
   const x=sign*(3.65+k*.5);
   const knob=new THREE.Mesh(new THREE.SphereGeometry(.065,8,6),edgeGold);
   knob.position.set(x,6.66,-7.34);scene.add(knob);
  }
 }
 // V04.3 FANTASY LOTUS GARDEN — organic ponds, light foliage, low-cost animation.
 // All shapes are local, original procedural geometry; no external assets or fetches.
 const pondRipples=[];
 const pondWater=new THREE.MeshStandardMaterial({color:'#3f9e9c',roughness:.27,metalness:.06,transparent:true,opacity:.95,side:THREE.DoubleSide,depthWrite:true});
 const pondBase=mat('#45695d'),pondBank=mat('#9d9978');
 const lilyGreen=[mat('#527b55'),mat('#67935c'),mat('#8cac6b')];
 const petalColors=[mat('#ee8fb2',.72),mat('#ffc5d4',.68),mat('#ffe3d9',.7)];
 const lotusCore=mat('#efc968',.68),reedMat=mat('#738a56');
 const pondStoneMaterials=['#b9ac91','#ccbea4','#a39c86'].map(c=>mat(c));
 const pondRingMaterial=new THREE.MeshBasicMaterial({color:'#d7ede0',transparent:true,opacity:.28,depthWrite:false});
 const pondSeed=(j,offset=0)=>Math.sin((j+1)*12.9898+offset*78.233)*43758.5453;
 const fract=v=>v-Math.floor(v);
 const pondContour=[];
 for(let i=0;i<64;i++){
  const a=i*Math.PI*2/64;
  const wobble=1+.065*Math.sin(a*3+.7)+.042*Math.cos(a*5-1.2);
  pondContour.push(new THREE.Vector2(Math.cos(a)*2.75*wobble,Math.sin(a)*5.85*wobble));
 }
 const pondShape=new THREE.Shape();pondContour.forEach((v,i)=>i?pondShape.lineTo(v.x,v.y):pondShape.moveTo(v.x,v.y));pondShape.closePath();
 const pondSurfaceGeometry=new THREE.ShapeGeometry(pondShape,32);
 // A notched lily pad (not a simple circular disk).
 const lilyPadShape=new THREE.Shape();
 lilyPadShape.moveTo(0,0);
 for(let i=0;i<=22;i++){
  const angle=.25+(Math.PI*2-.5)*i/22;
  lilyPadShape.lineTo(Math.cos(angle),Math.sin(angle));
 }
 lilyPadShape.closePath();
 const lilyPadGeometry=new THREE.ShapeGeometry(lilyPadShape);
 const petalGeometry=new THREE.SphereGeometry(1,9,6);
 const blossomGroups=[];
 const addPond=(cx,side)=>{
  const centerZ=13;
  const basin=new THREE.Mesh(pondSurfaceGeometry,pondBase);
  basin.rotation.x=-Math.PI/2;basin.position.set(cx,.055,centerZ);basin.scale.set(1.055,1.055,1);basin.receiveShadow=true;scene.add(basin);
  const surface=new THREE.Mesh(pondSurfaceGeometry,pondWater);
  surface.rotation.x=-Math.PI/2;surface.position.set(cx,.105,centerZ);surface.receiveShadow=true;scene.add(surface);
  // Natural sandstone rim and grass, with a single instanced draw for each material.
  const stoneGeometry=new THREE.DodecahedronGeometry(.25,0);
  const stones=new THREE.InstancedMesh(stoneGeometry,pondStoneMaterials[side===1?0:1],64);
  const grassGeometry=new THREE.ConeGeometry(.11,.48,3);
  const reeds=new THREE.InstancedMesh(grassGeometry,reedMat,32);
  const dummy=new THREE.Object3D();let rIndex=0;
  pondContour.forEach((pt,i)=>{
    const v=.95+fract(pondSeed(i,side))*.5;
    dummy.position.set(cx+pt.x*1.035,.11,centerZ-pt.y*1.035);
    dummy.rotation.set(.08*i,i*.7,.05*i);
    dummy.scale.set(.65*v,.38*v,1.25*v);dummy.updateMatrix();stones.setMatrixAt(i,dummy.matrix);
    if(i%2===0){
      const spread=1.11+fract(pondSeed(i,11))*.15;
      dummy.position.set(cx+pt.x*spread,.18,centerZ-pt.y*spread);
      dummy.rotation.set(0,i*1.7,.15);
      dummy.scale.set(.6+(i%3)*.12,.7+(i%4)*.14,.6);dummy.updateMatrix();reeds.setMatrixAt(rIndex++,dummy.matrix);
    }
  });
  stones.instanceMatrix.needsUpdate=true;reeds.instanceMatrix.needsUpdate=true;
  stones.receiveShadow=true;scene.add(stones,reeds);
  // Deterministic placement: varied sizes, some leaves, a few flowers and small buds.
  for(let i=0;i<22;i++){
    const angle=pondSeed(i,3)*Math.PI*2;
    const x=Math.sin(i*2.399+side)*(.35+(i%4)*.38);
    const z=(fract(pondSeed(i,9))-.5)*9.5;
    const wx=cx+x,wz=centerZ+z;
    const pad=new THREE.Mesh(lilyPadGeometry,lilyGreen[i%lilyGreen.length]);
    const size=.32+(i%5)*.068;
    pad.rotation.x=-Math.PI/2;pad.rotation.z=angle;
    pad.scale.set(size,size,size);pad.position.set(wx,.119+(i%3)*.002,wz);scene.add(pad);
    if(i%4===0){
      const bloom=new THREE.Group();bloom.position.set(wx+.16,.15,wz+.12);
      const bud=i%8===0;
      const layers=bud?1:2;
      for(let layer=0;layer<layers;layer++)for(let k=0;k<(bud?6:8);k++){
        const a=k*Math.PI*2/(bud?6:8)+layer*.3;
        const petal=new THREE.Mesh(petalGeometry,petalColors[(i+layer)%3]);
        const radial=bud?.085:(layer===0?.19:.10);
        petal.position.set(Math.cos(a)*radial,.12+layer*.05,Math.sin(a)*radial);
        petal.scale.set(bud?.085:.14,bud?.24:(layer===0?.23:.20),bud?.095:.11);
        petal.rotation.set(Math.sin(a)*(bud?.27:.72),0,-Math.cos(a)*(bud?.27:.72));
        bloom.add(petal);
      }
      const core=new THREE.Mesh(new THREE.SphereGeometry(.068,10,6),lotusCore);
      core.position.y=.13; bloom.add(core);scene.add(bloom);
      blossomGroups.push({mesh:bloom,baseY:bloom.position.y,phase:i*1.3});
    }
  }
  // Ripple rings move subtly; no expensive water shaders.
  for(let i=0;i<3;i++){
    const ring=new THREE.Mesh(new THREE.RingGeometry(.38,.40,48),pondRingMaterial.clone());
    ring.rotation.x=-Math.PI/2;
    ring.position.set(cx+(i-1)*.8,.129,centerZ+(i-1)*2.6);
    scene.add(ring);pondRipples.push({mesh:ring,phase:i/3+(side===1?.15:.55)});
  }
 };
 addPond(-6.9,-1);addPond(6.9,1);
 // Irregular dressed stone paving; subtle joints add spatial depth.
 const pavingMaterials=['#c9bca5','#c3b49e','#d0c2ae','#bcad99'].map(c=>new THREE.MeshStandardMaterial({color:c,map:groundTex,roughness:1}));
 for(let row=0;row<31;row++){
  const z=-1.8+row*.98;
  for(let col=0;col<4;col++){
   const x=-2.19+col*1.46+((row%2)-.5)*.18;
   const slab=new THREE.Mesh(new THREE.BoxGeometry(1.445,.024,.968),pavingMaterials[(row*3+col)%4]);
   slab.position.set(x,.054,z);slab.receiveShadow=true;scene.add(slab);
  }
 }
 // Path stones & leaf scatter
 const pebbleMats=[mat('#bcae91'),mat('#ccbca1'),mat('#a99f8a')];
 for(let i=0;i<130;i++){
  const z= -2.2+(i*0.719)%30, x=(Math.sin(i*24.71)*.5+.5)*5.75-2.875;
  const pebble=new THREE.Mesh(new THREE.DodecahedronGeometry(.07+(i%4)*.018,0),pebbleMats[i%3]);pebble.scale.y=.25;pebble.position.set(x,.091,z);scene.add(pebble);
 }
  // V03.4 naturalistic grove: branching trunks + alpha-cut foliage sprays.
  // No overlapping icosahedron canopy balls or stacked leaves above spheres.
  const mountain=mat('#a1a28c');
  for(let i=0;i<11;i++){
   const x=-85+i*17, h=11+(Math.sin(i*2.63)+1)*5;
   const hill=new THREE.Mesh(new THREE.ConeGeometry(24,h,8),mountain);hill.position.set(x,h/2-1,-82);scene.add(hill);
  }
  const foliageMats=['#395d3a','#527b45','#668b50','#779957','#456f43'].map(c=>mat(c));
  const trunkMat=mat('#675040');
  const crownShape=new THREE.IcosahedronGeometry(.72,1); // small potted shrubs only
  const leafCanvas=document.createElement('canvas');leafCanvas.width=leafCanvas.height=256;
  const lc=leafCanvas.getContext('2d');
  // Leaves on several fine branchlets; transparent corners stay genuinely transparent.
  let leafSeed=19;const leafRnd=()=>{leafSeed=(leafSeed*1664525+1013904223)>>>0;return leafSeed/4294967296};
  lc.strokeStyle='rgba(60,74,41,.75)';lc.lineWidth=2.5;
  for(let arm=0;arm<8;arm++){
   const angle=arm*Math.PI/4,xe=128+Math.cos(angle)*(70+leafRnd()*24),ye=135+Math.sin(angle)*(67+leafRnd()*18);
   lc.beginPath();lc.moveTo(128,135);lc.quadraticCurveTo((128+xe)/2+9,(135+ye)/2-9,xe,ye);lc.stroke();
   for(let leaf=0;leaf<11;leaf++){
    const t=.26+leaf*.065,px=128+(xe-128)*t,py=135+(ye-135)*t;
    for(const side of [-1,1]){
     lc.save();lc.translate(px+side*5,py);lc.rotate(angle+side*.8);
     lc.fillStyle=['#345b33','#477840','#668c4b','#73924e','#527a43'][Math.floor(leafRnd()*5)];
     lc.beginPath();lc.ellipse(0,side*7,4.5+leafRnd()*2,9+leafRnd()*4,.15,0,Math.PI*2);lc.fill();lc.restore();
    }
   }
  }
  const leafTexture=new THREE.CanvasTexture(leafCanvas);leafTexture.colorSpace=THREE.SRGBColorSpace;
  const leafMaterial=new THREE.MeshStandardMaterial({map:leafTexture,transparent:true,alphaTest:.32,side:THREE.DoubleSide,roughness:1,depthWrite:true});
  const treeCount=14,cardsPerTree=14;
  const branchCards=new THREE.InstancedMesh(new THREE.PlaneGeometry(1.6,1.6),leafMaterial,treeCount*cardsPerTree);
  const leafDummy=new THREE.Object3D();let leafIdx=0;
  function tree(x,z,scale=1,idx=0){
   const height=3.5*scale;
   const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.095*scale,.23*scale,height,9),trunkMat);
   trunk.position.set(x,height/2,z);trunk.castShadow=true;scene.add(trunk);
   for(let j=0;j<6;j++){
    const a=j*2.39996,r=(.68+j%3*.25)*scale,py=height*(.68+(j%3)*.1);
    beam(new THREE.Vector3(x,height*.6,z),new THREE.Vector3(x+Math.cos(a)*r,py,z+Math.sin(a)*r),.045*scale,trunkMat,7);
   }
   for(let j=0;j<cardsPerTree;j++){
    const a=j*2.39996+idx*.4,rad=(.30+(j%5)*.20)*scale;
    leafDummy.position.set(x+Math.cos(a)*rad,height+(.02+(j%6)*.24)*scale,z+Math.sin(a)*rad);
    leafDummy.rotation.set((j%3-.5)*.32,a*.72,(j%4)*.33);
    leafDummy.scale.setScalar(scale*(.68+(j%3)*.17));leafDummy.updateMatrix();branchCards.setMatrixAt(leafIdx++,leafDummy.matrix);
   }
  }
  for(const side of [-1,1])for(let j=0;j<7;j++)tree(side*(13.8+(j%2)*3.8),-1+j*5.9,.83+(j%3)*.18,j+(side===1?7:0));
  branchCards.instanceMatrix.needsUpdate=true;scene.add(branchCards);
 // Low irregular hedges along the edges of the garden.
 for(let i=0;i<130;i++){
  const z=-28+(i*7.13)%70,x=(i%2?1:-1)*(10.8+(i*3.17)%7);
  const size=.23+(i%7)*.085;
  const bush=new THREE.Mesh(crownShape,foliageMats[i%5]);bush.position.set(x,size*.68,z);bush.scale.set(size,size*.78,size);scene.add(bush);
 }
 // Soft sun disk, decorative butterflies and floating dust
 const sunDisc=new THREE.Mesh(new THREE.SphereGeometry(4,20,12),new THREE.MeshBasicMaterial({color:'#fff0b8',fog:false}));sunDisc.position.set(-39,30,-77);scene.add(sunDisc);
 const butterflies=[];
 for(let i=0;i<12;i++){
  const group=new THREE.Group();let butterflyColor=i%2?'#d6b57c':'#f1e0ad';
  const wingMat=new THREE.MeshBasicMaterial({color:butterflyColor,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false});
  for(const dir of [-1,1]){const wing=new THREE.Mesh(new THREE.CircleGeometry(.10,3),wingMat);wing.scale.set(.85,1.7,1);wing.position.x=dir*.09;wing.rotation.y=dir*.45;group.add(wing)}
  group.position.set((i%2?1:-1)*(4.4+i%4),1.2+i%3,18-(i*3.6)%26);scene.add(group);butterflies.push({group,base:group.position.clone(),seed:i*1.93});
 }
 // hanging bells and archway
 for(const x of [-3.8,3.8]){
  cyl(.35,.35,4,red,x,2.1,11);cube(1.4,.36,1.4,gold,x,4.15,11)
 }
 cube(9,.52,1.4,red,0,4.58,11);cube(10,.17,1.7,gold,0,4.9,11);
 beam(new THREE.Vector3(-5.5,5.05,11),new THREE.Vector3(0,6.25,11),.13,gold);
 beam(new THREE.Vector3(0,6.25,11),new THREE.Vector3(5.5,5.05,11),.13,gold);
 cube(2.8,.75,.16,wood,0,4.16,11.82);
 // Thai gateway roof with layered red clay tiles, raised gable and small gilded finials.
 templeRoof(11.2,3.3,5.12,12.65,1.45);
 decorateRoof(11.2,3.3,5.12,12.65,1.45);
 const gateSign=cube(2.85,.72,.13,wood,0,4.2,12.23);
 for(const x of [-1.8,1.8]){
  const motif=new THREE.Mesh(new THREE.TorusGeometry(.18,.035,7,16),gold);
  motif.position.set(x,4.17,12.28);scene.add(motif);
 }

 // altar at entrance
 cube(4.3,1.2,1.9,wood,0,1.85,-5.1);cube(4.5,.12,2.1,gold,0,2.5,-5.1);
 const pot=cyl(.47,.62,1.1,red,0,3.13,-5.05,24);cyl(.49,.49,.09,gold,0,3.73,-5.05,24);
 const stickMat=mat('#d6ba7c');for(let i=0;i<25;i++){let a=i*2.399,r=.12*Math.sqrt(i/25);const s=cyl(.018,.018,1.0,stickMat,Math.cos(a)*r,4.14+Math.sin(i*3)*.06,-5.05+Math.sin(a)*r,5);s.rotation.z=(Math.sin(i*3)*.1)}
 // incense holders and lanterns
 for(const x of [-1.55,1.55]){cyl(.2,.3,.42,gold,x,2.77,-5.1);for(let j=0;j<3;j++)cyl(.012,.012,.65,wood,x+(j-1)*.07,3.26,-5.1)}
 const lanternMat=new THREE.MeshStandardMaterial({color:'#f9c382',emissive:'#ef9a50',emissiveIntensity:1.2});
 for(const x of [-4.6,4.6])for(const z of [8,-2]){cyl(.045,.045,3.9,wood,x,1.9,z);const l=cyl(.47,.38,1.1,lanternMat,x,3.5,z,12);cyl(.49,.49,.13,dark,x,4.1,z);cyl(.49,.49,.13,dark,x,2.88,z);if(z===8){const light=new THREE.PointLight('#ffc274',4,5);light.position.set(x,3.5,z);scene.add(light)}}
 // side ornamental walls and plants
 for(const x of [-11.2,11.2]){
  for(let z=-3;z<26;z+=5){cyl(.2,.3,1.1,wood,x,.65,z);const crown=new THREE.Mesh(crownShape,foliageMats[(Math.floor(z)+30)%5]);crown.position.set(x,1.7,z);crown.scale.set(.95,.75,.95);scene.add(crown)}
  cube(.36,.38,35,plaster,x,.19,10,false)
 }
 for(const x of [-10.6,10.6])for(let z=-2;z<23;z+=4){const s=cyl(.65,.7,.58,stone,x,.3,z);const b=new THREE.Mesh(crownShape,foliageMats[3]);b.position.set(x,1,z);b.scale.set(.85,.7,.85);scene.add(b)}
 // floating dust
 const count=260,pos=new Float32Array(count*3);for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*22;pos[i*3+1]=Math.random()*9+.3;pos[i*3+2]=(Math.random()-.5)*45+6};const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.BufferAttribute(pos,3));const dust=new THREE.Points(geom,new THREE.PointsMaterial({color:'#ffe8aa',size:.065,transparent:true,opacity:.5,depthWrite:false}));scene.add(dust);
 // pointer movement + keyboard navigation
 const keys=new Set();let yaw=0,pitch=.045,near=false,frame=0;const velocity=new THREE.Vector2();const clock=new THREE.Clock();
 const down=e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','w','a','s','d','W','A','S','D','e','E'].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());if(e.key.toLowerCase()==='e'&&near)actionRef.current.onInteract()};const up=e=>keys.delete(e.key.toLowerCase());window.addEventListener('keydown',down);window.addEventListener('keyup',up);
 let grabbing=false,oldX=0,oldY=0;const pointerDown=e=>{grabbing=true;oldX=e.clientX;oldY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)};const pointerMove=e=>{if(!grabbing)return;yaw-=(e.clientX-oldX)*.004;pitch=Math.max(-.34,Math.min(.35,pitch-(e.clientY-oldY)*.003));oldX=e.clientX;oldY=e.clientY};const pointerUp=()=>grabbing=false;
 renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointermove',pointerMove);renderer.domElement.addEventListener('pointerup',pointerUp);renderer.domElement.style.touchAction='none';
 const resize=()=>{const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.fov=h>w?72:64;camera.updateProjectionMatrix();renderer.setSize(w,h)};resize();const observer=new ResizeObserver(resize);observer.observe(host);
 const tick=()=>{frame=requestAnimationFrame(tick);const dt=Math.min(clock.getDelta(),.04);let f=0,side=0;const mov=walkingRef.current;
 if(keys.has('w')||keys.has('arrowup')||mov.forward)f=1;if(keys.has('s')||keys.has('arrowdown')||mov.back)f=-1;
 if(keys.has('a')||keys.has('arrowleft')||mov.left)side=-1;if(keys.has('d')||keys.has('arrowright')||mov.right)side=1;
 // Smoothed first-person movement plus collision for gateway pillars and altar zone.
 const len=Math.hypot(f,side)||1;f/=len;side/=len;
 const targetX=(-Math.sin(yaw)*f+Math.cos(yaw)*side)*4.35;
 const targetZ=(-Math.cos(yaw)*f-Math.sin(yaw)*side)*4.35;
 const smoothing=1-Math.exp(-dt*10);
 velocity.x+=(targetX-velocity.x)*smoothing;velocity.y+=(targetZ-velocity.y)*smoothing;
 const radius=.33;
 const blocked=(x,z)=>{
  if(x < -7+radius || x > 7-radius || z < -2.05 || z > 27)return true;
  // Solid columns supporting the ceremonial entrance.
  if(Math.abs(z-11)<.55+radius && (Math.abs(x-3.8)<.42+radius || Math.abs(x+3.8)<.42+radius))return true;
  // Keep players on the garden path instead of walking onto the water.
  for(const cx of [-6.9,6.9])if(((x-cx)/3.05)**2+((z-13)/6.0)**2<1)return true;
  // Do not walk through decorative lanterns.
  for(const zz of [8,-2])for(const xx of [-4.6,4.6])if(Math.hypot(x-xx,z-zz)<.23+radius)return true;
  return false;
 };
 const newX=camera.position.x+velocity.x*dt,newZ=camera.position.z+velocity.y*dt;
 if(!blocked(newX,camera.position.z))camera.position.x=newX;else velocity.x=0;
 if(!blocked(camera.position.x,newZ))camera.position.z=newZ;else velocity.y=0;
 camera.position.y=1.72+(Math.hypot(velocity.x,velocity.y)>.35?Math.sin(clock.elapsedTime*10.8)*.023:0);
 camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;
 // Require a clear view toward the altar as well as physical proximity.
  const altarDirection=new THREE.Vector3(-camera.position.x,2.9-camera.position.y,-5.1-camera.position.z).normalize();
  const gaze=new THREE.Vector3(0,0,-1).applyEuler(camera.rotation);
  const isNear=camera.position.z<0.6&&Math.abs(camera.position.x)<3.3&&gaze.dot(altarDirection)>.66;if(isNear!==near){near=isNear;actionRef.current.onNear(near)}
 dust.rotation.y+=dt*.003;const elapsed=clock.elapsedTime;for(const r of pondRipples){const t=(elapsed*.085+r.phase)%1;r.mesh.scale.setScalar(.55+t*.9);r.mesh.material.opacity=.20*(1-t)}for(const f of blossomGroups){f.mesh.position.y=f.baseY+Math.sin(elapsed*1.15+f.phase)*.018;}for(const b of butterflies){b.group.position.x=b.base.x+Math.sin(elapsed*.65+b.seed)*.35;b.group.position.y=b.base.y+Math.sin(elapsed*1.4+b.seed)*.17;b.group.rotation.y=Math.sin(elapsed*8+b.seed)*.38}renderer.render(scene,camera)};tick();
 cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);renderer.domElement.removeEventListener('pointerdown',pointerDown);renderer.domElement.removeEventListener('pointermove',pointerMove);renderer.domElement.removeEventListener('pointerup',pointerUp);renderer.dispose();const disposedGeometry=new Set(),disposedMaterial=new Set();scene.traverse(o=>{if(o.geometry&&!disposedGeometry.has(o.geometry)){disposedGeometry.add(o.geometry);o.geometry.dispose()}if(o.material){const m=Array.isArray(o.material)?o.material:[o.material];m.forEach(v=>{if(!disposedMaterial.has(v)){disposedMaterial.add(v);v.dispose()}})}});host.removeChild(renderer.domElement)};
 })();return()=>{cancelled=true;cleanup()}
 },[active,walkingRef]);
 return <div ref={mountRef} className="scene"/>;
}

export default function Home(){
 const [phase,setPhase]=useState('intro'),[near,setNear]=useState(false),[fortune,setFortune]=useState(null),[sound,setSound]=useState(false);
 const walkingRef=useRef({forward:false,back:false,left:false,right:false});const audioRef=useRef(null);
 const enterRitual=useCallback(()=>{setPhase('ritual')},[]);
 const begin=()=>setPhase('walk');
 const playChime=()=>{if(!sound)return;try{let ac=audioRef.current;if(!ac){ac=new (window.AudioContext||window.webkitAudioContext)();audioRef.current=ac}if(ac.state==='suspended')ac.resume();for(const [i,f] of [523.25,659.25,783.99].entries()){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,ac.currentTime+i*.14);g.gain.exponentialRampToValueAtTime(.055,ac.currentTime+i*.14+.025);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+i*.14+1.3);o.connect(g).connect(ac.destination);o.start(ac.currentTime+i*.14);o.stop(ac.currentTime+i*.14+1.4)}}catch(e){}};
 const completeRitual=()=>{setFortune(Math.floor(Math.random()*fortunes.length));setPhase('result');playChime()};
 const reset=()=>{setFortune(null);setPhase('walk')};
 // V02: optional synthesized environment sound, no external audio downloads.
 useEffect(()=>{
  if(!sound||phase!=='walk')return;
  let context,wind,filter,gain,bellTimer;
  try{
   context=new (window.AudioContext||window.webkitAudioContext)();
   const seconds=3,buffer=context.createBuffer(1,context.sampleRate*seconds,context.sampleRate);
   const out=buffer.getChannelData(0);let smooth=0;
   for(let i=0;i<out.length;i++){smooth=smooth*.985+(Math.random()*2-1)*.015;out[i]=smooth*.7}
   wind=context.createBufferSource();wind.buffer=buffer;wind.loop=true;
   filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=480;
   gain=context.createGain();gain.gain.value=.15;
   wind.connect(filter).connect(gain).connect(context.destination);wind.start();
   const bell=()=>{if(context.state!=='running')return;const t=context.currentTime;
    [1,2.01,3.98].forEach((mult,i)=>{let osc=context.createOscillator(),vol=context.createGain();osc.type='sine';osc.frequency.value=392*mult;vol.gain.setValueAtTime(.0001,t);vol.gain.exponentialRampToValueAtTime(.012/(i+1),t+.035);vol.gain.exponentialRampToValueAtTime(.0001,t+3.4);osc.connect(vol).connect(context.destination);osc.start(t);osc.stop(t+3.5)})};
   bellTimer=window.setInterval(bell,18000);
   context.resume().catch(()=>{});
  }catch(e){}
  return()=>{if(bellTimer)clearInterval(bellTimer);try{wind?.stop();context?.close()}catch(e){}};
 },[sound,phase]);
 const movement=(dir,value)=>{walkingRef.current[dir]=value};
 return <main>
  <TempleScene active={phase!=='intro'} onNear={setNear} onInteract={enterRitual} walkingRef={walkingRef}/>
  {phase==='intro'&&<div className="intro"><div className="intro-art"><div className="intro-glow"/><div className="intro-temple">✧</div></div><div className="eyebrow">AN IMMERSIVE TEMPLE EXPERIENCE</div><h1>วิหารเซียมซี</h1><p className="intro-sub">เดินผ่านประตูวัด ฟังเสียงในใจ<br/>แล้วให้ใบเซียมซีพาคุณพบถ้อยคำแห่งกำลังใจ</p><button className="primary" onClick={begin}>เข้าสู่วิหาร <span>↗</span></button><div className="intro-note">ประสบการณ์จำลองเพื่อความเพลิดเพลินและการใคร่ครวญ</div></div>}
  {phase==='walk'&&<><div className="topbar"><div className="brand">✦ วิหารเซียมซี <small>Temple Fortune Walk · V04.3.1.3</small></div><button className="sound" onClick={()=>setSound(v=>!v)}>{sound?'♪ เสียงเปิด':'♪ เสียงปิด'}</button></div><div className="crosshair">✦</div><div className="walkhint">{near?'ถึงโต๊ะเซียมซีแล้ว กดปุ่มเพื่อเริ่มพิธี':'เดินตามทางหิน ผ่านสระบัว ไปยังศาลาด้านหน้า'}</div>{near&&<button className="interact" onClick={enterRitual}>✦ เสี่ยงเซียมซี <span>กด E</span></button>}<div className="movement"><div><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);movement('forward',true)}} onPointerUp={()=>movement('forward',false)} onPointerCancel={()=>movement('forward',false)}>↑</button></div><div><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);movement('left',true)}} onPointerUp={()=>movement('left',false)} onPointerCancel={()=>movement('left',false)}>←</button><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);movement('back',true)}} onPointerUp={()=>movement('back',false)} onPointerCancel={()=>movement('back',false)}>↓</button><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);movement('right',true)}} onPointerUp={()=>movement('right',false)} onPointerCancel={()=>movement('right',false)}>→</button></div></div><div className="walkfooter">W A S D / ปุ่มลูกศร · ลากจอเพื่อมองรอบตัว</div></>}
  {phase==='ritual'&&<ShakeRitual onClose={()=>setPhase('walk')} onComplete={completeRitual} soundEnabled={sound}/>}
  {phase==='result'&&fortune!==null&&<div className="overlay"><div className="paper"><div className="paper-ornament">❋ ✧ ❋</div><div className="eyebrow">FORTUNE STICK NO.</div><div className="fortune-num">{String(fortune+1).padStart(2,'0')}</div><h2>{fortunes[fortune][0]}</h2><div className="rule"/><p className="fortune-main">“{fortunes[fortune][1]}”</p><div className="fortune-detail"><div><b>การงาน · การเรียน</b><p>{fortunes[fortune][2]}</p></div><div><b>ความสัมพันธ์</b><p>{fortunes[fortune][3]}</p></div></div><div className="paper-actions"><button onClick={()=>window.print()}>บันทึก / พิมพ์ใบเซียมซี</button><button className="primary" onClick={reset}>กลับไปเดินในวัด</button></div><div className="footnote">เซียมซีจำลองเพื่อความบันเทิงและการสะท้อนความคิด</div></div></div>}
 </main>
}
