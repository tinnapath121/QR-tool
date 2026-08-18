# คู่มือพาเว็บ Universal QR Tool ขึ้นจริง + เปิดใช้ Ads แบบละเอียด

เอกสารนี้ไล่ทีละขั้นตอนตั้งแต่ยังไม่มีเว็บ จนถึงมีโฆษณาโชว์บนเว็บจริง อ้างอิงจากเอกสารทางการของ Google ล่าสุด (สิงหาคม 2026)

---

## ภาพรวมลำดับขั้นตอน

1. เตรียมโดเมน
2. Push โค้ดขึ้น GitHub
3. Deploy ขึ้น Netlify + ต่อโดเมน + HTTPS
4. แก้ placeholder โดเมนในไฟล์ + เช็คเว็บที่ deploy จริง
5. ลงทะเบียน Google Search Console
6. เตรียมเนื้อหา/ทราฟฟิกก่อนสมัคร AdSense
7. สมัคร Google AdSense (มีจุดสำคัญเรื่อง consent banner ต้องอ่าน)
8. ผ่านการอนุมัติแล้ว → เปิดใช้ ads.txt + ใส่ client ID จริง
9. ถ้ามีผู้ชมยุโรป/อังกฤษ/สวิส → ต้องรู้เรื่อง CMP ที่ Google รับรอง
10. หลังจากนั้น: ติดตามผล, Core Web Vitals, นโยบายความหนาแน่นโฆษณา

โดยรวมกินเวลาไม่ต่ำกว่า 2-4 สัปดาห์ (ส่วนใหญ่คือเวลารอ DNS, รอ Google เข้ามาเก็บข้อมูล, รอผลตรวจสอบ AdSense)

---

## ขั้นที่ 1 — เตรียมโดเมน

ถ้ายังไม่มีโดเมน ซื้อได้จากผู้ให้บริการเช่น Cloudflare Registrar, Namecheap, Porkbun หรือผู้ให้บริการในไทยก็ได้ ราคาโดเมน `.com` ทั่วไปอยู่ที่ประมาณ 300-500 บาท/ปี

แนะนำ: เลือกโดเมนสั้น จำง่าย สื่อถึง "QR" หรือชื่อแบรนด์ที่ไม่ซ้ำกับใคร เช็คให้แน่ใจว่ายังไม่มีคนใช้ก่อนซื้อ

---

## ขั้นที่ 2 — Push โค้ดขึ้น GitHub

1. สร้าง repository ใหม่บน GitHub (private หรือ public ก็ได้)
2. ในเครื่องคุณ:
   ```
   cd path/to/qr-tool
   git init
   git add .
   git commit -m "Initial commit: Universal QR Tool"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. ตรวจสอบว่าไฟล์ทั้งหมด (index.html, css/, js/, images/, robots.txt, sitemap.xml, _headers, 404.html) ขึ้นไปครบบน GitHub

---

## ขั้นที่ 3 — Deploy ขึ้น Netlify + ต่อโดเมน + HTTPS

1. เข้า [netlify.com](https://www.netlify.com) → สมัคร/ล็อกอิน → "Add new site" → "Import an existing project"
2. เชื่อมกับ GitHub แล้วเลือก repo ที่เพิ่ง push
3. ตั้งค่า build:
   - Build command: **เว้นว่างไว้** (เว็บนี้เป็น static ล้วน ไม่ต้อง build)
   - Publish directory: `.` (หรือ path ที่มี index.html อยู่)
4. กด Deploy — Netlify จะให้ URL ชั่วคราวแบบ `random-name-123.netlify.app` มาก่อน ลองเปิดเช็คว่าเว็บขึ้นถูกต้อง
5. ต่อโดเมนของตัวเอง: ไปที่ Site settings → Domain management → Add a domain → ใส่โดเมนที่ซื้อมา
6. Netlify จะบอกให้ไปตั้งค่า DNS ที่ผู้ให้บริการโดเมน (ปกติมี 2 วิธี: เปลี่ยน nameserver ไปใช้ของ Netlify ทั้งหมด หรือใส่ record CNAME/A ตามที่ Netlify ระบุ) — เลือกวิธีไหนก็ได้ตามที่ถนัด
7. รอ DNS อัปเดต (จากไม่กี่นาทีถึง 24-48 ชม.) Netlify จะออก **HTTPS ให้อัตโนมัติฟรี** ผ่าน Let's Encrypt — ข้อนี้สำคัญมาก เพราะฟีเจอร์กล้องสแกน QR **ต้องใช้ HTTPS เท่านั้นถึงจะทำงาน**

---

## ขั้นที่ 4 — แก้ placeholder โดเมน + เช็คเว็บจริง

ค้นหาคำว่า `your-domain.com` ในโปรเจกต์แล้วแทนที่ด้วยโดเมนจริงของคุณ (มีอยู่ในไฟล์เหล่านี้):

- `index.html` — canonical, og:url, og:image, twitter:image, JSON-LD `url`
- `robots.txt` — บรรทัด Sitemap
- `sitemap.xml` — `<loc>`

จากนั้น commit + push ใหม่ (Netlify จะ auto-deploy ให้)

**เช็คลิสต์หลัง deploy จริง:**
- [ ] เปิดเว็บผ่าน `https://` (ไม่ใช่ `http://`) — เช็ค SSL lock ในเบราว์เซอร์
- [ ] ทดสอบกล้องสแกน QR บนมือถือจริง (ต้องขอสิทธิ์กล้องได้)
- [ ] ทดสอบ generate → download PNG/SVG
- [ ] ทดสอบสลับภาษา + dark mode
- [ ] เปิด `https://yourdomain.com/robots.txt` และ `/sitemap.xml` ดูว่าขึ้นถูกต้อง
- [ ] เปิดหน้าที่ไม่มีจริง เช่น `https://yourdomain.com/abc123` ดูว่าขึ้นหน้า 404 ที่ทำไว้

---

## ขั้นที่ 5 — Google Search Console

1. เข้า [search.google.com/search-console](https://search.google.com/search-console)
2. เพิ่ม property แบบ "Domain" (ครอบคลุมทุก subdomain) แล้ว verify ผ่าน DNS TXT record ที่ Netlify/ผู้ให้บริการโดเมนของคุณ
3. ไปที่ Sitemaps → ใส่ `sitemap.xml` → Submit
4. ใช้ "URL Inspection" กด "Request Indexing" สำหรับหน้าแรก เพื่อเร่งให้ Google เข้ามาเก็บข้อมูลเร็วขึ้น

---

## ขั้นที่ 6 — เตรียมเนื้อหา/ทราฟฟิกก่อนสมัคร AdSense

Google ไม่ได้ระบุตัวเลขทราฟฟิกขั้นต่ำตายตัว แต่จากเอกสารทางการของ Google ([Eligibility requirements for AdSense](https://support.google.com/adsense/answer/9724?hl=en)) เงื่อนไขหลักคือ:

- อายุ 18 ปีขึ้นไป
- เนื้อหาต้อง "มีคุณภาพ เป็นต้นฉบับ และดึงดูดผู้เข้าชมได้จริง" ไม่ใช่หน้าเว็บที่ทำขึ้นมาลวกๆ
- ทำตาม AdSense Program policies ทุกข้อ
- ต้องเข้าถึง/แก้ไข source code ของเว็บได้จริง (ข้อนี้คุณผ่านอยู่แล้วเพราะ deploy เองผ่าน git)

สิ่งที่ช่วยให้ผ่านง่ายขึ้นในทางปฏิบัติ (จากประสบการณ์ทั่วไป ไม่ใช่กฎตายตัวของ Google):
- ปล่อยเว็บทิ้งไว้สักพัก (1-2 สัปดาห์ขึ้นไป) ให้ Google index และมีคนเข้าใช้งานจริงบ้าง
- แชร์ลิงก์ในที่ที่เกี่ยวข้อง (ชุมชนนักพัฒนา, โซเชียล, ฟอรัมที่เกี่ยวกับเครื่องมือ QR) เพื่อให้มีทราฟฟิกจริง ไม่ใช่ปั๊มยอดปลอม
- เว็บนี้มีหน้า Privacy Policy, บทความ "How QR Codes Work" และ FAQ อยู่แล้วซึ่งช่วยเรื่อง "เนื้อหามีสาระ" — แต่ถ้าอยากเพิ่มความมั่นใจ อาจเพิ่มบทความสั้นๆ อื่นที่เกี่ยวกับการใช้ QR code ในชีวิตจริงได้อีก

---

## ขั้นที่ 7 — สมัคร Google AdSense

1. เข้า [google.com/adsense](https://www.google.com/adsense/start/) → สมัครด้วยบัญชี Google → ใส่ URL เว็บของคุณ (ต้องเป็นโดเมนจริงที่มี HTTPS แล้ว ใช้ `localhost` หรือ URL ชั่วคราวของ Netlify ไม่ได้)
2. AdSense จะให้โค้ด snippet มาแปะใน `<head>` ของเว็บเพื่อยืนยันความเป็นเจ้าของ + ให้ระบบตรวจสอบเว็บ

**⚠️ จุดสำคัญที่ต้องรู้ก่อน:** เว็บนี้ถูกออกแบบให้ **ไม่โหลดสคริปต์ AdSense จนกว่าผู้ใช้จะกด "Accept" บน cookie banner ก่อน** (เพื่อความเป็นส่วนตัว) แต่ระบบตรวจสอบอัตโนมัติของ Google อาจไม่ได้ "กด Accept" ให้ระหว่างสแกนเว็บคุณ ซึ่งอาจทำให้ Google ตรวจไม่พบโค้ดและใช้เวลานานขึ้นในการอนุมัติ

ทางแก้มี 2 ทาง เลือกได้ตามที่คุณสบายใจ:

- **ทางเลือก A (ง่ายกว่า):** ระหว่างรอสมัคร/รอตรวจสอบ ให้แปะโค้ด snippet ที่ Google ให้มาไว้ใน `<head>` ของ `index.html` แบบไม่มีเงื่อนไขไปก่อน (ไม่ต้องรอ consent) พอได้รับอนุมัติแล้วค่อยเอาออก แล้วกลับไปใช้ระบบ consent-gate เดิมที่ผมทำไว้ (ใส่ `ADSENSE_CLIENT_ID` ใน `js/app.js` แทน)
- **ทางเลือก B (ตรงตามมาตรฐาน Google มากกว่า):** ปรับให้เว็บโหลดสคริปต์ AdSense เสมอ (ไม่ต้องรอกด Accept) แต่ใช้ **Google Consent Mode** ส่งสัญญาณบอก Google ว่าผู้ใช้ยังไม่ยินยอมให้เก็บข้อมูลส่วนตัว จนกว่าจะกด Accept — เป็นวิธีที่ Google แนะนำในเอกสารทางการ และทำให้ระบบตรวจสอบของ Google เจอโค้ดได้ทันทีโดยไม่ต้องสลับโค้ดไปมา — **ถ้าอยากได้แบบนี้บอกผมได้ แก้ให้ได้เลย**

3. หลังส่งใบสมัคร Google จะใช้เวลาตรวจสอบ (มักไม่กี่วันถึง ~2 สัปดาห์ อาจนานกว่านั้นได้ ไม่มีกำหนดตายตัว)

---

## ขั้นที่ 8 — ผ่านการอนุมัติแล้ว: เปิดใช้งานจริง

1. ใน AdSense dashboard → Sites → เลือกเว็บของคุณ → คัดลอกค่า **Publisher ID** (รูปแบบ `ca-pub-XXXXXXXXXXXXXXXX`)
2. เปิดไฟล์ `js/app.js` แก้บรรทัด:
   ```js
   var ADSENSE_CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXXX"; // ใส่ค่าจริงตรงนี้
   ```
3. เปิดไฟล์ `index.html` แล้วเอา comment `<!-- -->` ที่ครอบ `<ins class="adsbygoogle">` ออกในทุกจุดที่ต้องการเปิดใช้ (มี 4 จุด: sidebar ซ้าย, ขวา, footer, anchor มือถือ) — ใส่ `data-ad-client` และ `data-ad-slot` ให้ตรงกับที่ AdSense สร้างให้คุณในแต่ละหน่วยโฆษณา
4. สร้างไฟล์ `ads.txt` ที่ root ของเว็บ (`yourdomain.com/ads.txt`) ตามที่ AdSense บอก (ไปที่ Sites → เลือกเว็บ → "View ads.txt guidance" จะได้บรรทัดที่ต้องใส่ รูปแบบประมาณนี้):
   ```
   google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
   ```
   (แทนที่ตัวเลขด้วย publisher ID จริงของคุณ) — ไฟล์นี้**จำเป็นสำหรับให้ AdSense จ่ายเงินให้ถูกต้อง** ไม่มีไฟล์นี้เสี่ยงรายได้หาย
5. commit + push ขึ้น GitHub → Netlify deploy ให้อัตโนมัติ
6. กลับไปที่ AdSense → กด "Check for updates" เพื่อให้ระบบมาเช็ค ads.txt ใหม่
7. รอ 24-48 ชม. โฆษณาจะเริ่มโชว์จริง (ช่วงแรกอาจเห็นแค่ blank หรือโฆษณาน้อยระหว่างระบบเรียนรู้เว็บคุณ เป็นเรื่องปกติ)

---

## ขั้นที่ 9 — ถ้ามีผู้ชมจากยุโรป/อังกฤษ/สวิส (สำคัญ ต้องรู้)

ตามนโยบายล่าสุดของ Google ([Google consent management requirements](https://support.google.com/adsense/answer/13554116?hl=en)): การจะโชว์ **โฆษณาแบบ personalized** ให้ผู้ชมใน EEA, UK (บังคับตั้งแต่ 16 ม.ค. 2024) และสวิตเซอร์แลนด์ (บังคับตั้งแต่ 31 ก.ค. 2024) **ต้องใช้ Consent Management Platform (CMP) ที่ Google รับรองและรองรับมาตรฐาน IAB TCF เท่านั้น** — cookie banner ธรรมดาที่ผมทำเองในเว็บนี้ **ไม่นับเป็น CMP ที่ได้รับการรับรอง**

ผลถ้าไม่มี CMP ที่รับรอง: ผู้ชมจากโซนนั้นจะยังเห็นโฆษณาได้ แต่เป็น **โฆษณาแบบไม่ personalized หรือโฆษณาแบบจำกัด** ซึ่งรายได้ต่อการเข้าชมจะต่ำกว่าปกติ — ไม่ได้ปิดโฆษณาทั้งหมด แค่ได้ราคาต่ำกว่า

ทางเลือกของคุณ:
- **ถ้ากลุ่มเป้าหมายหลักคือไทย/เอเชีย** ไม่ต้องทำอะไรเพิ่ม ผลกระทบต่ำ ปล่อยไว้แบบนี้ได้
- **ถ้าอยากได้รายได้เต็มจากยุโรปด้วย** แนะนำใช้ **Google Funding Choices** (ฟรี, Google ทำให้เอง, certified CMP อยู่แล้ว) เข้าไปตั้งค่าได้ใน AdSense dashboard → Privacy & messaging — บอกผมได้ถ้าอยากให้ช่วยต่อสาย Funding Choices เข้ากับเว็บ

---

## ขั้นที่ 10 — หลังจากนั้น: ดูแลต่อเนื่อง

- **Google Search Console** — เช็ค Core Web Vitals, coverage errors เป็นระยะ
- **AdSense Policy Center** — เช็คว่ามี policy violation แจ้งเตือนไหม (เช่น ad density สูงเกินไป, invalid clicks)
- **อย่าคลิกโฆษณาตัวเองเด็ดขาด** แม้เพื่อทดสอบ — Google แบนบัญชีทันทีถ้าเจอ invalid traffic รวมถึงห้ามขอให้คนอื่นช่วยคลิกด้วย
- **payout threshold** ปกติต้องสะสมยอดถึงขั้นต่ำ (แนะนำเช็คตัวเลขล่าสุดในบัญชี AdSense ของคุณเองเพราะอาจเปลี่ยนตามประเทศ/เวลา) และต้องยืนยันตัวตน + ที่อยู่ก่อนรับเงินได้

---

## สรุปสิ่งที่ต้องทำเองนอกเหนือจากโค้ด

| งาน | ทำที่ไหน |
|---|---|
| ซื้อโดเมน | ผู้ให้บริการโดเมน |
| Push โค้ด | GitHub |
| Deploy + ต่อโดเมน | Netlify |
| Verify เว็บ | Google Search Console |
| สมัคร + รอผล | Google AdSense |
| ใส่ publisher ID จริง | `js/app.js` (1 บรรทัด) |
| เปิดใช้หน่วยโฆษณา | `index.html` (เอา comment ออก) |
| สร้าง ads.txt | root ของเว็บ |
| (ถ้าต้องการ) CMP สำหรับ EEA | AdSense → Privacy & messaging |

---

*อ้างอิง: [Eligibility requirements for AdSense](https://support.google.com/adsense/answer/9724?hl=en), [Google consent management requirements](https://support.google.com/adsense/answer/13554116?hl=en), [Ads.txt guide](https://support.google.com/adsense/answer/12171612?hl=en) — ข้อมูล ณ สิงหาคม 2026 นโยบายของ Google อาจเปลี่ยนแปลงได้ ควรเช็คหน้าทางการอีกครั้งก่อนดำเนินการจริง*
