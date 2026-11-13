# DESIGN SYSTEM SPECIFICATION (`nguon-goc-bao-hiem`)
<!-- HYPERFRAME STUDIO V4 · CLAUDE BESPOKE DESIGN STANDARD -->

## 1. TỔNG QUAN HỆ THỐNG THIẾT KẾ (SYSTEM METADATA)
- **Project ID**: `nguon-goc-bao-hiem`
- **Tên dự án**: Thủy Tổ Bảo Hiểm Bắt Nguồn Từ Đâu?
- **Aesthetic Family**: `Editorial Ivory Paper` (Biến thể Hải đồ & Cổ thư Sáng)
- **Tâm lý thị giác (Emotional Intent)**: Điềm đạm, sâu sắc, đáng tin cậy như đang mở một cuốn sử liệu tài chính dưới ánh đèn bàn soi ấm áp.
- **Khổ hình & Viewport**: `1080 × 1920` (Mobile Vertical 9:16), kiểm tra sắc nét ở tỷ lệ thu nhỏ `360 × 640`.
- **Engine & Adapter**: `HyperFrames v0.9.15 + GSAP 3.15.0 + Procedural Canvas 2D + Inline SVG`.

---

## 2. BẢNG MÃ MÀU & THIẾT KẾ BIẾN SỐ (SEMANTIC DESIGN TOKENS)

### 2.1. Khóa cứng CSS Variables (`:root`)
Mọi màu sắc trong `index.html` bắt buộc tham chiếu qua `var(--token)` dưới đây:

```css
:root {
  /* Bề mặt & Không gian giấy ngà cổ thư (Surfaces) */
  --bg-stage: #F4EFE6;         /* Giấy ngà vellum ấm áp */
  --bg-surface: #EAE2D3;       /* Mặt giấy hồ sơ / bia cổ tầng dưới */
  --bg-elevated: #FFFDF8;      /* Vùng giấy được đèn bàn soi trực diện */
  --bg-overlay: rgba(31, 29, 26, 0.90); /* Nền phụ đề Karaoke tương phản cao */

  /* Mực in & Chữ viết (Ink & Typography) */
  --ink-primary: #1F1D1A;      /* Mực than chì graphite chủ đạo */
  --ink-secondary: #5A5247;    /* Mực ghi chú bên lề */
  --ink-dim: #C7BEA9;          /* Chữ ẩn mờ (marginalia) & vạch trừu tượng */
  --ink-nautical: #1E3A5F;     /* Mực xanh hải quân vẽ hải đồ & nét ký Luân Đôn */

  /* Điểm nhấn & Trạng thái (Accents & Status) */
  --accent-highlight: #FDE047; /* Bút dạ quang vàng ấm (Highlight & Karaoke) */
  --accent-amber: #B45309;     /* Đất nung & hổ phách (Bia Hammurabi, kiện hàng) */
  --accent-teal: #0D9488;      /* Xanh ngọc bảo vệ & dòng chảy an toàn */
  --accent-brand: #00A758;     /* Xanh lá thương hiệu Manulife */
  --status-danger: #C2352B;    /* Mực đỏ cảnh báo lật thuyền / rủi ro */
  --status-success: #00A758;   /* Dấu xanh bảo chứng & bình an */

  /* Ánh sáng & Đổ bóng (Light & Elevation) */
  --lamp-glow: radial-gradient(circle 860px at 50% 40%, rgba(255, 253, 245, 0.85) 0%, rgba(244, 239, 230, 0) 80%);
  --shadow-tactile: 0 16px 40px rgba(31, 29, 26, 0.12), 0 4px 12px rgba(31, 29, 26, 0.06);
  --shadow-emboss: inset 0 2px 4px rgba(255, 255, 255, 0.65), 0 4px 8px rgba(31, 29, 26, 0.08);
}
```

### 2.2. Danh sách cấm kỵ màu sắc (Anti-AI Slop Blacklist)
- ❌ **KHÓA BẢNG MÀU DỰ ÁN**: Nền sân khấu của dự án này khóa cứng `#F4EFE6` (giấy ngà vellum).
- ❌ **CẤM** gradient tím/hồng kiểu AI (`#6366f1`, `#a855f7`).
- ❌ **CẤM** viền neon phát sáng sci-fi, vòng tròn phần trăm (`ring progress`), thanh tiến trình phẳng (`flat progress bar`), hoặc thẻ card dashboard chứa 1 icon đứng yên.
- ❌ **CẤM** dùng trắng thuần `#FFFFFF` hoặc đen thuần `#000000` làm mảng nền chính.

---

## 3. THIẾT KẾ CHỮ VIẾT & PHÂN CẤP THỊ GIÁC (TYPOGRAPHIC HIERARCHY)

### 3.1. Phông chữ chuẩn mực
- **Primary Font**: `Be Vietnam Pro` (nhúng `@font-face` cục bộ từ `assets/fonts/BeVietnamPro-{Regular,Medium,Bold,ExtraBold,Black}.ttf`).
- **Số liệu & Năm tháng**: Bắt buộc `font-variant-numeric: tabular-nums`.

### 3.2. Modular Scale
| Cấp bậc | Kích thước | Font Weight | Tracking | Line-height | Vai trò |
|:---|:---|:---|:---|:---|:---|
| **Display / Hook** | `74px – 88px` | `900` | `-0.03em` | `1.08` | Tiêu đề hook lớn (`THỦY TỔ BẢO HIỂM`) |
| **Headline** | `46px – 54px` | `800` | `-0.02em` | `1.18` | Nhãn trung tâm mỗi cảnh lịch sử |
| **Body / Lead** | `32px – 36px` | `700` | `0` | `1.36` | Nhãn trạng thái ngắn (1–4 từ) |
| **Subtitles (Karaoke)** | `33px` | `700` | `0` | `1.42` | Phụ đề 9–10 từ/dòng tại `bottom: 185px` |
| **Marginalia / Stamp** | `22px – 26px` | `700 / 800` | `+0.08em` | `1.0` | Con dấu cơ học, ghi chú sử liệu mờ (`~1750 TCN`, `1688`) |

---

## 4. CHẤT LIỆU VẬT LÝ & KHÔNG GIAN SỐNG (TACTILE & AMBIENT MATERIALITY)

### 4.1. Procedural Canvas (`rng(seed)`)
Sử dụng LCG deterministic seed `20261113` vẽ:
1. Lớp nền giấy ngà `#F4EFE6`.
2. 42.000 vi sợi cellulose li ti độ đục `0.024`.
3. Lưới đường kinh vĩ tuyến hải đồ siêu mảnh (`rgba(30, 58, 95, 0.045)`) và viền khung bản đồ cổ tạo chiều sâu không gian ngay từ frame đầu tiên.

### 4.2. Không gian sống liên tục (Zero Dead Frame)
- **Hạt bụi sáng `#dust .mote`**: 26 hạt bụi ánh sáng ấm tạo bằng `rng(20261113)` trôi chéo nhẹ nhàng trong vùng rọi của `#lamp` với số chu kỳ hữu hạn `repeat: Math.max(0, Math.floor(TOTAL / cyc) - 1)`.
- **Nhịp thở `#cam`**: Từng cảnh S1–S12 chạy `scale: 1.0 -> 1.045` (`ease: "sine.inOut"`), cảnh Outro S13 chạy `scale: 1.0 -> 1.025`, bảo đảm `0 freeze events`.

---

## 5. CƠ CHẾ SỐNG THAY CHO THẺ HỘP (13 LIVING MECHANISMS)

| Cảnh | Ý niệm kịch bản | ✅ Cơ chế sống độc bản (Living Mechanism) |
|:---|:---|:---|
| **S1** | Không từ hợp đồng hiện đại | Tập hồ sơ hợp đồng gạch trừu tượng bị bút mực đỏ gạch chéo dứt khoát |
| **S2** | Nỗi lo lật thuyền trên sông dữ | Con thuyền gỗ chao nghiêng giữa các đường đồng mức sóng cuộn xoáy + vạch đỏ đáy thuyền |
| **S3** | Không dồn hết hàng lên 1 thuyền | Khối hàng nặng đè chìm mớn nước của 1 chiếc thuyền chạm vạch đỏ nguy hiểm |
| **S4** | Chia nhỏ sang nhiều thuyền | Khối hàng tách 5 phần đáp xuống 5 thuyền; thuyền 3 gặp xoáy nước, 4 thuyền vẫn lướt vững |
| **S5** | Khắc vào bộ luật Hammurabi | Bia đất nung khắc từng nét chữ hình nêm phát sáng cùng niên đại `~1750 TCN` |
| **S6** | Đóng phí nhỏ, miễn hoàn trả vốn | Đòn cân cơ học cân đồng xu phí nhỏ với khối vốn lớn + dấu đất nung `MIỄN HOÀN TRẢ` |
| **S7** | Quy ước Tổn thất chung Địa Trung Hải | Hải đồ Địa Trung Hải tự vẽ tuyến tàu SVG + con dấu cuộn thư `TỔN THẤT CHUNG` |
| **S8** | Ném bớt hàng cứu tàu, mọi người bù đắp | Tàu nghiêng hạ 1 kiện hàng lấy lại thăng bằng + 4 cung lực cộng đồng cùng bù đắp |
| **S9** | Quán cà phê cảng Luân Đôn TK 17 | Mặt bàn gỗ quán cà phê với tách cà phê bốc hơi nét mảnh cạnh hải trình `LLOYD'S · 1688` |
| **S10** | Ký tên dưới danh sách tàu (Under-writing) | Trang sổ có đường kẻ ngang: trên là danh sách hàng trừu tượng, dưới là 3 chữ ký tự viết + dấu `CHIA RỦI RO` |
| **S11** | Hàng nghìn năm nguyên lý vẹn nguyên | Thước đo thời gian trượt nối 4 cột mốc văn minh bằng sợi chỉ vàng liền mạch |
| **S12** | Góp bình an số đông đỡ một gia đình | 6 cung hợp lực đan thành vòm lá chắn xanh hấp thụ xung lực giông bão bảo vệ ngôi nhà |
| **S13** | Brand Outro Tiến Dương · Manulife | Thẻ giấy ngà căn giữa (`Center X = 540px`), hiện đủ thông tin từ `0.15s..0.85s` + quẹt dạ quang `Nhắn 'KẾ HOẠCH'` |

---

## 6. ĐIỀU PHỐI CHUYỂN ĐỘNG (MOTION & CHOREOGRAPHY)

- **Vật thể rơi, đập, nảy** (kiện hàng đáp xuống thuyền, con dấu đất nung/sáp, ngôi nhà được nâng đỡ): `ease: "back.out(1.7)"` hoặc `ease: "elastic.out(1, 0.5)"`.
- **Nét vẽ SVG, quẹt bút dạ quang, chữ ký tự viết, thước đo lịch sử**: `ease: "power2.inOut"` hoặc `ease: "expo.out"`.
- **Cấm tuyệt đối** `power1.out`, `power1.inOut`, `none`/`linear` cho các chuyển động chính.
- **Khóa Timing**: Mọi chuyển động neo vào `T(wordIndex)` và `E(wordIndex)` từ `timing.json`.
- **Phụ đề Karaoke**: 9–10 từ/dòng, `bottom: 185px`, tắt dòng cũ tại `W[SUB[li + 1][0]].s - 0.04`.
