'use client';
import {useCallback, useEffect, useRef, useState} from 'react';

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
 const scene=new THREE.Scene();scene.background=new THREE.Color('#e7cba0');scene.fog=new THREE.FogExp2('#e7cba0',0.014);
 const camera=new THREE.PerspectiveCamera(72,1,.1,180); camera.position.set(0,1.7,26);camera.lookAt(0,2,0);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;renderer.outputColorSpace=THREE.SRGBColorSpace; host.appendChild(renderer.domElement);
 const hemi=new THREE.HemisphereLight('#fff3d9','#71826c',1.7);scene.add(hemi);
 const sun=new THREE.DirectionalLight('#ffe1a5',2.7);sun.position.set(-11,21,15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-0.0003;sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;scene.add(sun);
 const mat=(color,roughness=1,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const plaster=mat('#eed6a6'),gold=mat('#c79d45',.38,.6),dark=mat('#6b2822'),red=mat('#873627'),stone=mat('#b5a58e'),leaf=mat('#56784a'),wood=mat('#55372a'),white=mat('#e6d8ba');
 const cube=(w,h,d,m,x,y,z,sh=true)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=sh;o.receiveShadow=true;scene.add(o);return o};
 const cyl=(rt,rb,h,m,x,y,z,n=12)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),m);o.position.set(x,y,z);o.castShadow=true;scene.add(o);return o};
 cube(180,.15,180,mat('#82906c'),0,-.11,0,false);
 cube(6,.06,60,stone,0,.01,11,false);
 for(let i=0;i<16;i++){const z=27-i*2.55;cube(6.2,.025,.08,mat('#c7b89c'),0,.05,z,false)}
 // Outer temple platform and stairs
 cube(16,1,15,plaster,0,.52,-12);
 for(let i=0;i<4;i++)cube(8,.14,1.1,stone,0,.14+i*.13,-3.85-i*.8);
 cube(15,7,11,plaster,0,4.4,-13.4);
 cube(12.2,5.4,.18,red,0,4.3,-7.83);
 cube(3.0,5.2,.22,wood,0,3.6,-7.69);
 cube(2.2,4.5,.26,mat('#25201b'),0,3.55,-7.51);
 for(const x of [-6.2,-4.1,4.1,6.2]){cyl(.39,.46,6.6,red,x,4.25,-6.4);cyl(.56,.55,.28,gold,x,7.58,-6.4);cyl(.58,.54,.3,gold,x,1.1,-6.4)}
 // tiered roof
 for(const [w,d,y] of [[20.5,16,8.6],[17,13,10.05],[13,10,11.3]]){
  const roof=cube(w,.4,d,dark,0,y,-12.6);roof.rotation.z=0;
  cube(w+.3,.13,.3,gold,0,y+.26,-4.6-(16-d)/2);
 }
 const ridge=cube(15,.65,1.2,gold,0,12.1,-12.6);ridge.rotation.z=0;
 for(let x of [-9.8,9.8]){cyl(.15,.28,2.3,gold,x,9.5,-5.3,8)}

 // V02: layered Thai-style gables / carved gold roof edges
 const roofTile=mat('#762f27',.9), edgeGold=mat('#e0b960',.46,.25), mural=mat('#d49b60');
 function gable(z,width,baseY,peakY){
  const shape=new THREE.Shape();shape.moveTo(-width/2,baseY);shape.lineTo(0,peakY);shape.lineTo(width/2,baseY);shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth:.34,bevelEnabled:false});
  const face=new THREE.Mesh(geo,roofTile);face.position.z=z;face.castShadow=true;scene.add(face);
  for(const side of [-1,1]){
   const a=new THREE.Vector3(0,peakY,z+.42),b=new THREE.Vector3(side*width/2,baseY,z+.42);
   const v=b.clone().sub(a), beam=new THREE.Mesh(new THREE.CylinderGeometry(.10,.12,v.length(),8),edgeGold);
   beam.position.copy(a).add(b).multiplyScalar(.5);beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());scene.add(beam);
  }
  const medallion=new THREE.Mesh(new THREE.SphereGeometry(.43,12,8),edgeGold);medallion.position.set(0,baseY+.9,z+.51);medallion.scale.z=.2;scene.add(medallion);
 }
 gable(-4.69,20.5,8.65,11.1);gable(-6.18,17,10.1,12.2);gable(-7.68,13,11.4,13.1);
 for(const x of [-1,1])for(const [w,y,z] of [[10.35,8.7,-4.55],[8.5,10.2,-6.07],[6.5,11.5,-7.6]]){
  const tip=cyl(.04,.20,1.5,edgeGold,x*w,y+.6,z,8);tip.rotation.z=-x*.6;
 }
 // ceremonial entrance lintel and ornamental hanging garlands
 cube(5.2,.35,.35,edgeGold,0,6.85,-6.35);
 for(let x=-2.1;x<=2.11;x+=.7){const pendant=cyl(.02,.12,.45,edgeGold,x,6.52,-6.0,6);pendant.rotation.z=.1}
 // Courtyard water features and stone borders, outside the central walkway
 const water=new THREE.MeshPhysicalMaterial({color:'#4c817c',metalness:.18,roughness:.16,transparent:true,opacity:.89,clearcoat:.8});
 const lily=mat('#6f9657'), flower=mat('#e8b3a8');
 for(const x of [-12.5,12.5]){
  cube(6,.22,13,stone,x,.06,13,false);
  const pond=cube(5.5,.045,12.5,water,x,.18,13,false);pond.material.depthWrite=true;
  for(let j=0;j<11;j++){
   const zz=8+(j*1.11)%10,xx=x+Math.sin(j*8.2)*2.0;
   const pad=new THREE.Mesh(new THREE.CircleGeometry(.24+(j%3)*.07,14),lily);
   pad.rotation.x=-Math.PI/2;pad.position.set(xx,.215,zz);scene.add(pad);
   if(j%4===0){const bloom=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),flower);bloom.position.set(xx,.30,zz);scene.add(bloom)}
  }
  for(const side of [-1,1])cube(.27,.35,13,plaster,x+side*3,.35,13,false);
  for(const z of [6.5,19.5])cube(6.1,.35,.27,plaster,x,.35,z,false);
 }
 // Path stones & leaf scatter
 const pebbleMats=[mat('#bcae91'),mat('#ccbca1'),mat('#a99f8a')];
 for(let i=0;i<130;i++){
  const z= -2.2+(i*0.719)%30, x=(Math.sin(i*24.71)*.5+.5)*5.75-2.875;
  const pebble=new THREE.Mesh(new THREE.DodecahedronGeometry(.07+(i%4)*.018,0),pebbleMats[i%3]);pebble.scale.y=.25;pebble.position.set(x,.075,z);scene.add(pebble);
 }
 // Distant mountains, bushes and garden sculptures
 const mountain=mat('#819075');
 for(let i=0;i<14;i++){
  const x=-80+i*13, h=15+(Math.sin(i*2.63)+1)*8;
  const hill=new THREE.Mesh(new THREE.ConeGeometry(18,h,5),mountain);hill.position.set(x,h/2-1,-65);scene.add(hill);
 }
 const bushMaterials=[mat('#446c45'),mat('#6b8651'),mat('#81985e')];
 for(let i=0;i<100;i++){
  const z=-30+(i*13.37)%78, x=(i%2?1:-1)*(11+(i*7.17)%15);
  const size=.25+(i%9)*.08;
  const bush=new THREE.Mesh(new THREE.IcosahedronGeometry(size,0),bushMaterials[i%3]);bush.position.set(x,size*.65,z);bush.castShadow=i%4===0;scene.add(bush);
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
 // altar at entrance
 cube(4.3,1.2,1.9,wood,0,1.85,-5.1);cube(4.5,.12,2.1,gold,0,2.5,-5.1);
 const pot=cyl(.47,.62,1.1,red,0,3.13,-5.05,24);cyl(.49,.49,.09,gold,0,3.73,-5.05,24);
 const stickMat=mat('#d6ba7c');for(let i=0;i<25;i++){let a=i*2.399,r=.12*Math.sqrt(i/25);const s=cyl(.018,.018,1.0,stickMat,Math.cos(a)*r,4.14+Math.sin(i*3)*.06,-5.05+Math.sin(a)*r,5);s.rotation.z=(Math.sin(i*3)*.1)}
 // incense holders and lanterns
 for(const x of [-1.55,1.55]){cyl(.2,.3,.42,gold,x,2.77,-5.1);for(let j=0;j<3;j++)cyl(.012,.012,.65,wood,x+(j-1)*.07,3.26,-5.1)}
 const lanternMat=new THREE.MeshStandardMaterial({color:'#f9c382',emissive:'#ef9a50',emissiveIntensity:1.2});
 for(const x of [-4.6,4.6])for(const z of [8,-2]){cyl(.045,.045,3.9,wood,x,1.9,z);const l=cyl(.47,.38,1.1,lanternMat,x,3.5,z,12);cyl(.49,.49,.13,dark,x,4.1,z);cyl(.49,.49,.13,dark,x,2.88,z);const light=new THREE.PointLight('#ffc274',8,8);light.position.set(x,3.5,z);scene.add(light)}
 // side ornamental walls and plants
 for(const x of [-9,9]){
  for(let z=-3;z<26;z+=5){cyl(.22,.32,1.8,wood,x,1,z);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.75,1),leaf);crown.position.set(x,3.1,z);crown.castShadow=true;scene.add(crown)}
  cube(.45,1.3,35,plaster,x,.7,10,false)
 }
 for(const x of [-7.6,7.6])for(let z=-2;z<23;z+=4){const s=cyl(.65,.7,.58,stone,x,.3,z);const b=new THREE.Mesh(new THREE.SphereGeometry(.65,12,10),mat('#4f7045'));b.position.set(x,1,z);scene.add(b)}
 // floating dust
 const count=260,pos=new Float32Array(count*3);for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*22;pos[i*3+1]=Math.random()*9+.3;pos[i*3+2]=(Math.random()-.5)*45+6};const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.BufferAttribute(pos,3));const dust=new THREE.Points(geom,new THREE.PointsMaterial({color:'#ffe8aa',size:.065,transparent:true,opacity:.5,depthWrite:false}));scene.add(dust);
 // pointer movement + keyboard navigation
 const keys=new Set();let yaw=0,pitch=0,near=false,frame=0;let touchX=0;const clock=new THREE.Clock();
 const down=e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','w','a','s','d','W','A','S','D','e','E'].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());if(e.key.toLowerCase()==='e'&&near)actionRef.current.onInteract()};const up=e=>keys.delete(e.key.toLowerCase());window.addEventListener('keydown',down);window.addEventListener('keyup',up);
 let grabbing=false,oldX=0,oldY=0;const pointerDown=e=>{grabbing=true;oldX=e.clientX;oldY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)};const pointerMove=e=>{if(!grabbing)return;yaw-=(e.clientX-oldX)*.004;pitch=Math.max(-.34,Math.min(.35,pitch-(e.clientY-oldY)*.003));oldX=e.clientX;oldY=e.clientY};const pointerUp=()=>grabbing=false;
 renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointermove',pointerMove);renderer.domElement.addEventListener('pointerup',pointerUp);renderer.domElement.style.touchAction='none';
 const resize=()=>{const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)};resize();const observer=new ResizeObserver(resize);observer.observe(host);
 const tick=()=>{frame=requestAnimationFrame(tick);const dt=Math.min(clock.getDelta(),.04);let f=0,side=0;const mov=walkingRef.current;
 if(keys.has('w')||keys.has('arrowup')||mov.forward)f=1;if(keys.has('s')||keys.has('arrowdown')||mov.back)f=-1;
 if(keys.has('a')||keys.has('arrowleft')||mov.left)side=-1;if(keys.has('d')||keys.has('arrowright')||mov.right)side=1;
 if(f||side){let len=Math.hypot(f,side);f/=len;side/=len;const sz=dt*5.1;camera.position.x+=(-Math.sin(yaw)*f+Math.cos(yaw)*side)*sz;camera.position.z+=(-Math.cos(yaw)*f-Math.sin(yaw)*side)*sz;camera.position.x=Math.max(-7,Math.min(7,camera.position.x));camera.position.z=Math.max(-2.75,Math.min(27,camera.position.z))}
 camera.position.y=1.7+(f||side?Math.sin(performance.now()*.012)*.045:0);
 camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;
 const isNear=camera.position.z<1.8&&Math.abs(camera.position.x)<3.7;if(isNear!==near){near=isNear;actionRef.current.onNear(near)}
 dust.rotation.y+=dt*.003;const elapsed=clock.elapsedTime;for(const b of butterflies){b.group.position.x=b.base.x+Math.sin(elapsed*.65+b.seed)*.35;b.group.position.y=b.base.y+Math.sin(elapsed*1.4+b.seed)*.17;b.group.rotation.y=Math.sin(elapsed*8+b.seed)*.38}renderer.render(scene,camera)};tick();
 cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);renderer.domElement.removeEventListener('pointerdown',pointerDown);renderer.domElement.removeEventListener('pointermove',pointerMove);renderer.domElement.removeEventListener('pointerup',pointerUp);renderer.dispose();scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const m=Array.isArray(o.material)?o.material:[o.material];m.forEach(v=>v.dispose())}});host.removeChild(renderer.domElement)};
 })();return()=>{cancelled=true;cleanup()}
 },[active,walkingRef]);
 return <div ref={mountRef} className="scene"/>;
}

export default function Home(){
 const [phase,setPhase]=useState('intro'),[near,setNear]=useState(false),[shake,setShake]=useState(0),[fortune,setFortune]=useState(null),[sound,setSound]=useState(false);
 const walkingRef=useRef({forward:false,back:false,left:false,right:false});const audioRef=useRef(null);
 const enterRitual=useCallback(()=>{setPhase('ritual');setShake(0)},[]);
 const begin=()=>setPhase('walk');
 const playChime=()=>{if(!sound)return;try{let ac=audioRef.current;if(!ac){ac=new (window.AudioContext||window.webkitAudioContext)();audioRef.current=ac}if(ac.state==='suspended')ac.resume();for(const [i,f] of [523.25,659.25,783.99].entries()){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,ac.currentTime+i*.14);g.gain.exponentialRampToValueAtTime(.055,ac.currentTime+i*.14+.025);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+i*.14+1.3);o.connect(g).connect(ac.destination);o.start(ac.currentTime+i*.14);o.stop(ac.currentTime+i*.14+1.4)}}catch(e){}};
 const draw=()=>{if(shake>=3)return;const next=shake+1;setShake(next);if(next===3){setTimeout(()=>{const n=Math.floor(Math.random()*fortunes.length);setFortune(n);setPhase('result');playChime()},950)}};
 const reset=()=>{setFortune(null);setShake(0);setPhase('walk')};
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
  {phase==='walk'&&<><div className="topbar"><div className="brand">✦ วิหารเซียมซี <small>Temple Fortune Walk</small></div><button className="sound" onClick={()=>setSound(v=>!v)}>{sound?'♪ เสียงเปิด':'♪ เสียงปิด'}</button></div><div className="crosshair">✦</div><div className="walkhint">{near?'ถึงโต๊ะเซียมซีแล้ว กดปุ่มเพื่อเริ่มพิธี':'เดินตามทางหิน ผ่านสระบัว ไปยังศาลาด้านหน้า'}</div>{near&&<button className="interact" onClick={enterRitual}>✦ เสี่ยงเซียมซี <span>กด E</span></button>}<div className="movement"><div><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);movement('forward',true)}} onPointerUp={()=>movement('forward',false)} onPointerCancel={()=>movement('forward',false)}>↑</button></div><div><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);movement('left',true)}} onPointerUp={()=>movement('left',false)} onPointerCancel={()=>movement('left',false)}>←</button><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);movement('back',true)}} onPointerUp={()=>movement('back',false)} onPointerCancel={()=>movement('back',false)}>↓</button><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);movement('right',true)}} onPointerUp={()=>movement('right',false)} onPointerCancel={()=>movement('right',false)}>→</button></div></div><div className="walkfooter">W A S D / ปุ่มลูกศร · ลากจอเพื่อมองรอบตัว</div></>}
  {phase==='ritual'&&<div className="overlay"><div className="ritual"><button className="close" onClick={()=>setPhase('walk')}>✕</button><div className="eyebrow">THE FORTUNE RITUAL</div><div className="sacred-icon">❋</div><h2>ตั้งจิตอธิษฐาน</h2><p>นึกถึงเรื่องที่อยากขอคำแนะนำ แล้วค่อย ๆ เขย่ากระบอกเซียมซีให้ครบ 3 ครั้ง</p><div className={'siamsi '+(shake>0?'shaken':'')} style={{'--tilt':shake%2?'12deg':'-9deg'}}><div className="sticks">{Array.from({length:9},(_,i)=><i key={i} style={{transform:`rotate(${(i-4)*4}deg)`,height:`${89+(i%4)*10}px`}}/>)}</div><div className="cup"><span>福</span></div></div><div className="progress">{[1,2,3].map(i=><span key={i} className={shake>=i?'lit':''}/>)}</div><button className="primary" onClick={draw} disabled={shake>=3}>{shake>=3?'กำลังเปิดใบเซียมซี…':`เขย่ากระบอก · ${shake}/3`}</button><div className="footnote">ผลเซียมซีเป็นเนื้อหาเชิงสร้างสรรค์ ไม่ใช่การทำนายที่รับประกันอนาคต</div></div></div>}
  {phase==='result'&&fortune!==null&&<div className="overlay"><div className="paper"><div className="paper-ornament">❋ ✧ ❋</div><div className="eyebrow">FORTUNE STICK NO.</div><div className="fortune-num">{String(fortune+1).padStart(2,'0')}</div><h2>{fortunes[fortune][0]}</h2><div className="rule"/><p className="fortune-main">“{fortunes[fortune][1]}”</p><div className="fortune-detail"><div><b>การงาน · การเรียน</b><p>{fortunes[fortune][2]}</p></div><div><b>ความสัมพันธ์</b><p>{fortunes[fortune][3]}</p></div></div><div className="paper-actions"><button onClick={()=>window.print()}>บันทึก / พิมพ์ใบเซียมซี</button><button className="primary" onClick={reset}>กลับไปเดินในวัด</button></div><div className="footnote">เซียมซีจำลองเพื่อความบันเทิงและการสะท้อนความคิด</div></div></div>}
 </main>
}
