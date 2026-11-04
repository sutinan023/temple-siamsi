# วิหารเซียมซี · Temple Walk V03.3

อัปเดตจาก V03.2 โดยคง UI การเดิน การชนวัตถุ เสียง และคำทำนาย 12 ใบเดิม

## สิ่งที่เปลี่ยน

- **GLB จริงในโปรเจกต์:** `public/models/temple-ornaments.glb` เป็นโมเดล relief สีทองที่สร้างขึ้นใหม่สำหรับโปรเจกต์นี้เอง ครอบคลุมหน้าบันวิหาร 3 ชั้น ซุ้มประตู และลายแกะกรอบทางเข้าวิหาร
- โหลดด้วย `GLTFLoader` จาก `/models/temple-ornaments.glb`; ถ้าไฟล์โหลดไม่ได้จะยังคงฉากเดิมไว้และแจ้งใน Console
- ปรับแสงหมอก สีและวัสดุ; เพิ่มผิวฉาบบนผนังและลวดลายขอบ
- เพิ่มชั้นใบไม้แบบ alpha-tested บนต้นไม้ และกลีบบัวในบ่อน้ำ
- **ไม่เปลี่ยน** ระบบ WASD/ปุ่มเคลื่อนที่, เดินแบบ smoothing/collision, interaction E, การเขย่าเซียมซี, 12 คำทำนาย หรือสไตล์ UI

> V03.3 เป็นการเริ่มใช้ GLB สำหรับ *รายละเอียดตกแต่ง* ยังไม่ใช่โมเดลอาคารวัดทั้งหมดแบบ photogrammetry/Blender ระดับสมจริงใกล้ภาพถ่าย

## การติดตั้ง

ใช้ Node.js 20+ (แนะนำ 22)

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

## การติดตั้งทับโปรเจกต์เก่า

สำรองโปรเจกต์ก่อน จากไฟล์ ZIP ให้คัดลอก **ทั้ง** `app/page.jsx` และ `public/models/temple-ornaments.glb` ไปยังโปรเจกต์เดิม ไม่จำเป็นต้องแทน CSS ถ้าใช้ V03.2 อยู่แล้ว

> สำคัญ: ต้องมีไฟล์ `public/models/temple-ornaments.glb` ด้วย ไม่เช่นนั้นประดับทอง 3D ใหม่จะไม่ปรากฏ

## ตรวจสอบ

1. เปิด DevTools > Network ตรวจคำขอ `temple-ornaments.glb` ว่า HTTP 200
2. เปิด DevTools > Console ตรวจว่าไม่มี `GLB loader unavailable` หรือ `Temple GLB ornament fallback`
3. ทดลองกดเริ่มเดิน เดินด้วย WASD หรือปุ่มจอ ผ่านประตูไปยังโต๊ะเซียมซี
4. กด E / ปุ่ม เสี่ยงเซียมซี เขย่า 3 ครั้ง เปิดใบคำทำนาย และกลับมาเดิน
5. ทดลองแนวตั้งบนมือถือ/Device Toolbar และสังเกตความลื่นไหล

## การทดสอบที่ทำในสภาพแวดล้อมผู้สร้าง

- ตรวจ `app/page.jsx` ด้วย TypeScript JSX parser: ผ่าน (0 syntax errors)
- เปิดและตรวจโครงสร้าง GLB ด้วย trimesh: ผ่าน (2 meshes)
- **ยังไม่ได้รัน Next.js build หรือทดสอบการแสดงผลเบราว์เซอร์จริง** เพราะไม่มีแพ็กเกจ Next.js ใน npm offline cache

## หมายเหตุ Performance

GLB ประมาณ 1 MB (uncompressed); ใบไม้ใช้ InstancedMesh เพื่อลด draw calls. ถ้าบนมือถือกระตุก ควรเพิ่ม adaptive quality / shadow distance ในเวอร์ชันถัดไป
