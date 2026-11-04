 'use client';
import {useCallback, useEffect, useRef, useState} from 'react';

const TARGET = 100;
export default function ShakeRitual({onClose,onComplete,soundEnabled}) {
  const [energy, setEnergy] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [sensorState, setSensorState] = useState('idle');
  const [hint, setHint] = useState('กดค้างแล้วลากขึ้น–ลงเพื่อเขย่ากระบอก');
  const [stickDropped, setStickDropped] = useState(false);
  const energyRef = useRef(0);
  const pointerRef = useRef(null);
  const sensorRef = useRef({last:0,prev:0,gravity:0,initialized:false});
  const audioRef = useRef(null);
  const doneRef = useRef(false);

  const clack = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const audio = audioRef.current || new Ctx();
      audioRef.current = audio;
      if (audio.state === 'suspended') audio.resume().catch(()=>{});
      const osc = audio.createOscillator(), gain = audio.createGain();
      const t = audio.currentTime;
      osc.type = 'triangle'; osc.frequency.setValueAtTime(480,t);
      osc.frequency.exponentialRampToValueAtTime(240,t+.065);
      gain.gain.setValueAtTime(.0001,t);
      gain.gain.exponentialRampToValueAtTime(.028,t+.008);
      gain.gain.exponentialRampToValueAtTime(.0001,t+.11);
      osc.connect(gain).connect(audio.destination);
      osc.start(t); osc.stop(t+.12);
    } catch (_) {}
  }, [soundEnabled]);

  const addShake = useCallback((amount, direction=1) => {
    if (doneRef.current) return;
    const next = Math.min(TARGET, energyRef.current + amount);
    energyRef.current = next;
    setEnergy(next);
    setTilt(Math.max(-16, Math.min(16, direction*13)));
    clack();
    if (next >= TARGET) {
      doneRef.current = true;
      setStickDropped(true);
      setHint('ไม้เซียมซีหล่นแล้ว แตะเพื่อเปิดใบคำทำนาย');
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(55);
    }
  }, [clack]);

  const onPointerDown = (event) => {
    if (doneRef.current) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerRef.current = {id:event.pointerId, y:event.clientY, direction:0, distance:0};
  };
  const onPointerMove = (event) => {
    const ptr = pointerRef.current;
    if (!ptr || ptr.id !== event.pointerId || doneRef.current) return;
    event.preventDefault();
    const delta = event.clientY - ptr.y;
    ptr.y = event.clientY;
    const sign = Math.sign(delta);
    if (!sign) return;
    if (sign !== ptr.direction) {ptr.direction=sign;ptr.distance=0;}
    ptr.distance += Math.abs(delta);
    if (ptr.distance >= 32) {
      addShake(14,sign);
      ptr.distance = 0;
    } else setTilt(sign * Math.min(13,ptr.distance*.4));
  };
  const endPointer = () => {pointerRef.current=null;setTilt(0)};

  const sensorMotion = useCallback((event) => {
    if (doneRef.current) return;
    const a = event.acceleration;
    const g = event.accelerationIncludingGravity;
    let value = a && Number.isFinite(a.y) ? a.y : null;
    if (value === null && g && Number.isFinite(g.y)) {
      const s = sensorRef.current;
      if (!s.initialized) {s.gravity=g.y;s.initialized=true;return;}
      s.gravity = .88*s.gravity+.12*g.y;
      value = g.y-s.gravity;
    }
    if (value === null) return;
    const s = sensorRef.current, now=performance.now();
    // Require an intentional stroke and debounce; avoid idle sensor noise.
    if (Math.abs(value) >= 5.0 && now-s.last >= 180) {
      const direction=Math.sign(value);
      if (direction !== s.prev || now-s.last > 500) {
        s.prev=direction;s.last=now;
        addShake(Math.min(18,Math.max(10,Math.abs(value)*1.4)), direction);
      }
    }
  },[addShake]);

  const enableMotion = async () => {
    if (!('DeviceMotionEvent' in window)) {setSensorState('unavailable');return;}
    try {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        const permission=await DeviceMotionEvent.requestPermission();
        if (permission !== 'granted') {setSensorState('denied');return;}
      }
      sensorRef.current={last:0,prev:0,gravity:0,initialized:false};
      setSensorState('enabled');
      setHint('ถือโทรศัพท์ให้มั่น แล้วเขย่าเบา ๆ หรือปัดที่กระบอก');
    } catch (_) {setSensorState('denied');}
  };
  useEffect(()=>{
    if(sensorState!=='enabled' || stickDropped) return;
    window.addEventListener('devicemotion',sensorMotion,{passive:true});
    return ()=>window.removeEventListener('devicemotion',sensorMotion);
  },[sensorState,sensorMotion,stickDropped]);
  useEffect(()=>()=>{try{audioRef.current?.close()}catch(_){}},[]);

  return <div className="overlay">
    <div className="ritual fortune-gesture">
      <button className="close" onClick={onClose} aria-label="ปิดพิธี">✕</button>
      <div className="eyebrow">INTERACTIVE FORTUNE RITUAL</div>
      <div className="sacred-icon">❋</div>
      <h2>ตั้งจิตอธิษฐาน</h2>
      <p>นึกถึงเรื่องที่อยากขอคำแนะนำ แล้วเขย่ากระบอกด้วยตัวเอง</p>
      <div className="shake-touch-area" role="group" aria-label="พื้นที่เขย่ากระบอกเซียมซี"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={endPointer} onPointerCancel={endPointer}>
        <div className={'siamsi gesture-cup'+(stickDropped?' stick-complete':'')} style={{transform:`rotate(${tilt}deg)`}}>
          <div className="sticks">{Array.from({length:9},(_,i)=><i key={i} style={{transform:`rotate(${(i-4)*4}deg)`,height:`${89+(i%4)*10}px`}}/>)}</div>
          <div className="cup"><span>福</span></div>
          {stickDropped&&<div className="fortune-fallen-stick" aria-hidden="true"/>}
        </div>
        <span className="shake-tip">{stickDropped?'✦ ได้ไม้เซียมซีแล้ว':'↕ ลากขึ้น–ลง / ปัดเพื่อเขย่า'}</span>
      </div>
      <div className="shake-meter" role="progressbar" aria-label="ความคืบหน้าในการเขย่า" aria-valuenow={Math.round(energy)} aria-valuemin={0} aria-valuemax={100}>
        <span style={{width:`${energy}%`}}/>
      </div>
      <div className="shake-message" aria-live="polite">{hint}</div>
      {!stickDropped && <>
        {sensorState!=='enabled' && <button className="motion-allow" onClick={enableMotion}>
          {sensorState==='denied'?'ไม่อนุญาตเซนเซอร์ — ใช้นิ้วปัดแทน':sensorState==='unavailable'?'เซนเซอร์ไม่พร้อม — ใช้นิ้วปัดแทน':'📱 เปิดการเขย่าโทรศัพท์จริง'}
        </button>}
        {sensorState==='enabled' && <span className="motion-on">✓ เซนเซอร์พร้อม · เขย่าเบา ๆ ได้เลย</span>}
        <button className="shake-fallback" onClick={()=>addShake(15,energyRef.current%2?1:-1)}>เขย่าแบบแตะปุ่ม (ทางเลือก)</button>
      </>}
      {stickDropped && <button className="primary shake-reveal" onClick={onComplete}>✨ เปิดใบเซียมซี</button>}
      <div className="footnote">ใช้เล่นเพื่อความเพลิดเพลิน · หากเวียนหัวหรือไม่สะดวกเคลื่อนไหว ใช้ปุ่มสำรองได้</div>
    </div>
  </div>;
}
