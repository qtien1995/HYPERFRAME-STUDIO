# DESIGN SYSTEM SPECIFICATION — GIA HẠN 60 NGÀY & KHÔI PHỤC HỢP ĐỒNG 2 NĂM

> Hợp đồng thiết kế kỹ thuật cho dự án `gia-han-60-ngay`, chọn ngôn ngữ thị giác **Architectural Blueprint Navy** trên nền giấy can kỹ thuật sáng, bảo đảm tối giản cao cấp và cơ chế sống liên hoàn 8 cảnh.

---

## 1. METADATA & EMOTIONAL INTENT

- **Project ID**: `gia-han-60-ngay`
- **Tên dự án**: Thời Gian Gia Hạn Đóng Phí 60 Ngày & Khôi Phục Hợp Đồng 2 Năm
- **Aesthetic Family**: `Architectural Blueprint Navy` (Bản vẽ kỹ thuật trên giấy can sáng & Bàn soi cơ chế)
- **Tỷ lệ khung hình**: `9:16` (`1080 × 1920 px`), kiểm tra sắc nét trên `360 × 640` viewport
- **Engine & Adapter**: `HyperFrames v0.9.15 + GSAP 3.15.0 + Procedural Canvas 2D`
- **Tâm lý thị giác (Emotional Intent)**: Giải tỏa nỗi hoang mang cho người chưa biết gì về bảo hiểm bằng sự minh bạch, rành mạch như một bản vẽ kỹ thuật được giải thích từng bước trên bàn sáng.

---

## 2. SEMANTIC DESIGN TOKENS (`:root`)

Mọi mã màu bắt buộc khai báo trong `:root` và truy xuất qua `var(--token)`. Cấm dùng mã HEX rời rạc trong CSS inline hoặc script.

```css
:root {
  /* Bề mặt giấy can kiến trúc */
  --bg-stage: #F5F2EB;                  /* Kem sáng giấy can kiến trúc */
  --bg-surface: #ECE7DC;                /* Mặt phẳng hồ sơ / bản vẽ phụ */
  --bg-elevated: #FFFDF8;               /* Vùng được đèn bàn rọi sáng trực tiếp */
  --bg-frost: rgba(232, 240, 245, 0.80); /* Lớp kính mờ đóng băng ngày 61 */
  --bg-overlay: rgba(26, 35, 58, 0.90); /* Dải nền phụ đề Karaoke tương phản cao */

  /* Mực in & Chữ viết */
  --c-ink: #1E3A8A;                     /* Mực xanh hải quân bản vẽ chủ đạo */
  --c-ink-dark: #1A233A;                /* Mực than xanh đậm cho tiêu đề & số lớn */
  --c-ink-secondary: #475569;           /* Mực ghi chú kỹ thuật & vạch chia thước */
  --c-ink-dim: #C7C2B4;                 /* Vạch trừu tượng skeleton lines & marginalia mờ */

  /* Điểm nhấn & Trạng thái cơ chế */
  --c-accent-hl: #FDE047;               /* Vệt bút dạ quang vàng ấm (Highlight & Karaoke) */
  --c-brand: #00A758;                   /* Xanh ngọc lục bảo Manulife (Bảo vệ hiệu lực) */
  --c-teal: #0D9488;                    /* Xanh ngọc kính lúp & tia rọi CAD */
  --c-amber: #D97706;                   /* Hổ phách cho cửa sổ điều kiện 2 năm */
  --c-danger: #C2352B;                  /* Mực dấu đỏ (Gạch phủ định, mốc 61, từ chối) */

  /* Ánh sáng & Đổ bóng vật lý */
  --lamp-glow: radial-gradient(circle 850px at 50% 38%, rgba(255, 253, 248, 0.85) 0%, rgba(245, 242, 235, 0) 80%);
  --shadow-tactile: 0 14px 38px rgba(26, 35, 58, 0.12), 0 4px 10px rgba(26, 35, 58, 0.06);
  --shadow-stamp: 0 6px 16px rgba(194, 53, 43, 0.22);
}
```

---

## 3. ANTI-AI SLOP BLACKLIST (DANH SÁCH CẤM KỴ)

- ❌ **KHÓA BẢNG MÀU DỰ ÁN**: `--bg-stage` của dự án này khóa cứng `#F5F2EB` (giấy can kiến trúc).
- ❌ **CẤM THẺ CARD DASHBOARD**: Không đặt 1 icon đứng yên trong thẻ bo góc + chữ mô tả bên dưới.
- ❌ **CẤM VÒNG TRÒN PHẦN TRĂM & PROGRESS BAR PHẲNG**: Không dùng `ring progress`, donut gauge hay thanh loading web app.
- ❌ **CẤM NHỒI NHÉT VĂN BẢN**: Tuyệt đối không chép nguyên văn điều khoản luật lên màn hình. Mọi văn bản phụ biến thành vạch trừu tượng (`skeleton lines`) hoặc chú thích mờ (`ghosted marginalia`, opacity `0.25–0.35`).
- ❌ **CẤM CTA GƯỢNG ÉP**: Chỉ dùng CTA chuẩn thương hiệu: `Nhắn 'KẾ HOẠCH'`.
- ❌ **CẤM EASING MẶC ĐỊNH**: Cấm `power1.out`, `power1.inOut`, `none`/`linear` cho các chuyển động chính.

---

## 4. TYPOGRAPHIC HIERARCHY

- **Primary Font**: `Be Vietnam Pro` (khai báo `@font-face` cục bộ từ `assets/fonts/BeVietnamPro-*.ttf`).
- **Số liệu & Thước đo**: Bắt buộc `font-variant-numeric: tabular-nums` để số nhảy không rung trục ngang.

| Cấp bậc | Size | Weight | Line Height | Tracking | Vai trò sử dụng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Giant Metric** | `78px – 96px` | `900` (Black) | `1.05` | `-0.03em` | Con số mốc thời gian (`60`, `61`, `2 NĂM`) |
| **Scene Headline** | `48px – 56px` | `800` (ExtraBold) | `1.16` | `-0.02em` | Tiêu đề ngắn 2–4 từ mỗi cảnh |
| **Mechanism Label** | `30px – 36px` | `700` (Bold) | `1.28` | `0.00em` | Nhãn trên thước đo, con dấu cơ học |
| **Karaoke Subtitle** | `32px – 34px` | `700` (Bold) | `1.42` | `0.00em` | Phụ đề 9–10 từ/dòng tại `bottom: 185px` |
| **Marginalia / Ruler** | `20px – 24px` | `500` (Medium) | `1.20` | `+0.06em` | Tọa độ thước đo bản vẽ, ghi chú lề mờ |

---

## 5. TACTILE MATERIALITY & PROCEDURAL CANVAS MATH

### 5.1. Giấy Can Bản Vẽ & Lưới Tọa Độ Tất Định (`rng(20261113)`)
```javascript
function drawBlueprintPaper(canvas, seed = 20261113) {
  let s = seed;
  const rng = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const ctx = canvas.getContext('2d');
  const w = canvas.width = 1080;
  const h = canvas.height = 1920;

  ctx.fillStyle = '#F5F2EB';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(30, 58, 138, 0.022)';
  for (let i = 0; i < 38000; i++) {
    const x = rng() * w, y = rng() * h, r = rng() * 1.15;
    ctx.fillRect(x, y, r, r);
  }

  ctx.fillStyle = 'rgba(30, 58, 138, 0.11)';
  for (let x = 40; x < w; x += 80) {
    for (let y = 40; y < h; y += 80) {
      ctx.fillRect(x, y, 2, 2);
    }
  }
}
```

### 5.2. Chống Đứng Hình Tuyệt Đối (Zero Dead Frame)
- **Lớp hạt bụi sáng môi trường (`#dust .mote`)**: 26 hạt bụi ánh sáng trôi nhẹ trong luồng đèn bàn `#lamp` với số vòng lặp hữu hạn `repeat: Math.max(0, Math.floor(TOTAL / cyc) - 1)`.
- **Nhịp thở sân khấu (`#cam`)**: Scale liên tục `1.0 → 1.045` (`ease: "sine.inOut"`) qua từng cảnh nội dung và `1.0 → 1.025` ở Outro, bảo đảm `0 freeze events`.

---

## 6. LIVING MECHANISM SPECIFICATIONS (8 CẢNH — THAY THẾ THẺ CARD)

| Ý niệm trong kịch bản | Cơ chế vật lý sống động (Living Mechanism) | Easing GSAP vật lý |
| :--- | :--- | :--- |
| **Hiểu lầm trễ 1 ngày (Cảnh 1)** | Nét bút đỏ gạch ngang dứt khoát cụm "MẤT SẠCH", thước đo bản vẽ tự kẻ đường dẫn tới 2 chốt `60 NGÀY` và `2 NĂM` | Gạch chữ & kẻ trục: `expo.out`<br>Chốt nảy: `back.out(1.7)` |
| **Vùng đệm 60 ngày (Cảnh 2)** | Kim thước trượt mượt dọc 60 vạch chia micromet, vệt dạ quang vàng `#FDE047` thấm sáng vùng đệm `2 THÁNG` | Kim thước & dạ quang: `power2.inOut` |
| **Quyền lợi trong 60 ngày (Cảnh 3)** | Khiên bảo vệ `#00A758` sáng vững, thanh chi trả tự tách trừ phần phí nợ nhỏ, con dấu "VẪN BẢO VỆ" dập nảy & quẹt sáng "KHÔNG XÉT SỨC KHỎE" | Con dấu: `back.out(1.7)`<br>Thanh trừ phí & dạ quang: `power2.inOut` |
| **Ngày 61 đóng băng (Cảnh 4)** | Kim chạm vạch đỏ `61`, chốt khóa cơ học sập ngàm, màn kính mờ băng giá phủ kín vùng bảo vệ kèm nhãn "TẠM ĐÓNG BĂNG" | Chốt sập: `elastic.out(1, 0.5)`<br>Kính mờ: `power2.inOut` |
| **Cửa sổ 2 năm giữ hợp đồng cũ (Cảnh 5)** | Thước đo thu phóng sang trục `24 THÁNG (2 NĂM)`, đường mạch hợp đồng cũ sáng nối tiếp, đối chiếu thanh chi phí mua mới tăng vọt theo tuổi | Thu phóng & mạch: `expo.out`<br>Thanh đối chiếu: `back.out(1.4)` |
| **3 điều kiện khôi phục (Cảnh 6)** | 3 cơ cấu kiểm định lần lượt trượt khớp ngàm: (1) Đóng bù phí, (2) Kính lúp soi vạch hồ sơ sức khỏe, (3) Kim đồng hồ quay lại mốc thời gian chờ | Khớp chốt: `back.out(1.5)`<br>Kính lúp & kim: `power2.inOut` |
| **Rủi ro từ chối & câu chốt (Cảnh 7)** | Con dấu đỏ "TỪ CHỐI" đập nảy lên hồ sơ, trục đối chiếu tách 2 cực `60 NGÀY: BẢO VỆ NGAY` vs `2 NĂM: XÉT LẠI TỪ ĐẦU` | Con dấu: `back.out(1.7)`<br>Tách trục & dạ quang: `expo.out` |
| **Brand Outro (Cảnh 8)** | Thẻ Tiến Dương · Manulife căn giữa tuyệt đối (`Center X = 540px`), hiện đủ sớm trong `0.85s` đầu, quẹt dạ quang CTA `Nhắn 'KẾ HOẠCH'` | Thẻ nảy: `back.out(1.4)`<br>CTA quẹt sáng: `power2.inOut` |
