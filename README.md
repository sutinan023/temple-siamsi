# Temple Siamsi V04 — Interactive Fortune Shake

ต่อยอดจาก V03.4 โดยไม่เปลี่ยน UI เดินวัดและคำทำนายเดิม

## วิธีทดสอบ
1. npm install
2. npm run dev
3. เปิด http://localhost:3000 และเดินถึงโต๊ะเซียมซี
4. บน PC กดค้างและลากกระบอกขึ้นลง หรือกดปุ่มสำรอง
5. บนมือถือ ปัดขึ้นลงบนกระบอก หรือกด “เปิดการเขย่าโทรศัพท์จริง” เพื่อขอสิทธิ์เซนเซอร์ (ต้อง HTTPS บน iPhone)
6. เมื่อพลังเต็ม ให้กดเปิดใบเซียมซีด้วยตัวเอง

## Files updated
- app/page.jsx: เปลี่ยน ritual overlay เป็น ShakeRitual; ยังคง fortune 12 ใบ
- app/ShakeRitual.jsx: pointer + optional devicemotion gesture, manual fallback, reveal
- app/globals.css: เฉพาะสไตล์ ritual ใหม่
- public/models/temple-ornaments.glb: ไฟล์เดิม ไม่แก้

หมายเหตุ: อุปกรณ์บางรุ่นหรือเบราว์เซอร์อาจไม่รองรับ motion sensor ใช้ปัด/ปุ่มสำรองได้เสมอ
