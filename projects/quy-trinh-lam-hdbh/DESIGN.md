# DESIGN SYSTEM SPECIFICATION — quy-trinh-lam-hdbh
<!-- HYPERFRAME STUDIO V4 · MULTI-TOPIC & MULTI-STYLE BESPOKE CONTRACT -->

## 1. TỔNG QUAN HỆ THỐNG THIẾT KẾ (SYSTEM METADATA)
- **Project ID**: `quy-trinh-lam-hdbh`
- **Tên dự án**: Quy Trình Từng Bước Để Làm 1 Hợp Đồng Bảo Hiểm
- **Chủ đề & Ngữ cảnh**: Giáo dục tài chính & Pháp lý hợp đồng bảo hiểm nhân thọ (First-Principles Explainer)
- **Aesthetic Direction**: `Editorial Ivory Archival & Legal Press` (Bàn soi hồ sơ lưu trữ ngà ấm, mực than chì sắc sảo, dấu mộc đỏ son & xanh ngọc pháp lý, riêng Cảnh 1 phá cách với nền Hook đỏ son đậm `#7F1D1D`)
- **Lý do chọn ngôn ngữ thị giác này**: Quy trình làm HĐBH là quá trình xác lập một giao kèo pháp lý, kiểm định hồ sơ giấy tờ, ghi âm minh bạch và xác thực danh tính trước khi phát hành. Chất liệu giấy hồ sơ ngà ấm kết hợp con dấu cơ học, sóng ghi âm đối chiếu và cổng xác thực 3 chốt tạo ngay cảm giác minh bạch, đáng tin cậy, giúp người xem dễ nắm bắt trọn vẹn từng bước.
- **Khổ hình & Viewport**: `9:16 (1080×1920)` (khớp `inputProps.json`)
- **Brand Profile**: `none` *(mặc định chưa gắn brand; có thể đổi sang `tien-duong` khi User duyệt Gate 1)*
- **Engine & Adapter**: `HyperFrames v0.9.15 + GSAP 3.15.0 + Native HTML/SVG/Canvas`

---

## 2. BẢNG MÃ MÀU & THIẾT KẾ BIẾN SỐ (SEMANTIC DESIGN TOKENS)

### 2.1. Khóa cứng CSS Variables (`:root`)
Toàn bộ màu sắc trong `index.html` và SVG phải truy xuất qua `var(--token)` dưới đây, bảo đảm độ tương phản chữ/nền đạt chuẩn WCAG AA:

```css
:root {
  /* Bề mặt & Không gian (Surfaces) */
  --bg-stage: #F4EFE6;                  /* Giấy hồ sơ lưu trữ ngà ấm */
  --bg-surface: #EAE2D3;                /* Lớp tập hồ sơ bên dưới */
  --bg-elevated: #FFFDF8;               /* Trang hồ sơ nằm dưới đèn bàn soi */
  --bg-overlay: rgba(24, 24, 27, 0.88); /* Dải nền mờ phụ đề Karaoke */

  /* Đặc quyền Phá Cách Cảnh 1 Hook */
  --bg-hook: #7F1D1D;                   /* Đỏ son thẩm định tương phản mạnh (0–3s đầu) */
  --ink-hook: #FAF6EE;                  /* Chữ kem sáng trên nền Hook đỏ son */

  /* Chữ viết & Đường nét (Typography & Linework) */
  --ink-primary: #1A1B1E;               /* Mực than chì sắc nét */
  --ink-secondary: #57534E;             /* Chú thích phụ, nhãn trạm kiểm định */
  --ink-dim: rgba(26, 27, 30, 0.16);    /* Vạch skeleton trừu tượng, lưới lề chìm */

  /* Điểm nhấn & Trạng thái (Accents) */
  --accent-1: #FDE047;                  /* Bút dạ quang vàng ấm & highlight Karaoke */
  --accent-2: #0F766E;                  /* Xanh ngọc pháp lý (trục kiểm định, ghi âm & kính soi) */
  --accent-amber: #D97706;              /* Hổ phách (thẩm định, tăng phí, thời gian chờ) */
  --status-danger: #B91C1C;             /* Mực con dấu đỏ (từ chối, giấu bệnh, phủ định) */
  --status-success: #059669;            /* Xanh lục bảo xác nhận (chấp nhận chuẩn, xác thực, phát hành) */

  /* Ánh sáng & Độ sâu (Tactile Lighting) */
  --lamp-vignette: radial-gradient(circle 880px at 50% 38%, rgba(255, 253, 248, 0.85) 0%, rgba(244, 239, 230, 0) 80%);
  --dossier-shadow: 0 18px 42px rgba(26, 27, 30, 0.12), 0 4px 12px rgba(26, 27, 30, 0.06);
}
```

### 2.2. Danh sách cấm kỵ thẩm mỹ chung (Universal Anti-AI Slop Blacklist)
- ❌ **CẤM** thẻ card dashboard chứa 1 icon đứng yên giữa khung + chữ chạy bên dưới.
- ❌ **CẤM** vòng tròn phần trăm (`ring progress` / `donut gauge`) hoặc thanh tiến trình phẳng vô hồn.
- ❌ **CẤM** gradient tím/hồng mặc định của AI.
- ❌ **CẤM** nhồi nhét đoạn văn bản dài lên màn hình (chuyển điều khoản phụ thành vạch skeleton lines và nhãn chú thích ngắn 2–5 từ).

---

## 3. THIẾT KẾ CHỮ VIẾT & PHÂN CẤP THỊ GIÁC (TYPOGRAPHIC HIERARCHY)

### 3.1. Phông chữ cục bộ (Hỗ trợ đủ dấu tiếng Việt)
- **Display / Headline / Body / Subtitles**: `Be Vietnam Pro` (Weights: `600`, `700`, `800`, `900`) — đặt tại `assets/fonts/` và khai báo `@font-face` cục bộ trong `<style>` của `index.html`.
- **Technical Marginalia / Step Index**: `JetBrains Mono` (hoặc `Be Vietnam Pro` với `font-variant-numeric: tabular-nums`) cho mã trạm `01..06` và bộ đếm `01 → 21 NGÀY`.

### 3.2. Bảng tỷ lệ chữ (9:16 — `1080×1920`)
| Cấp bậc (Level) | Cỡ chữ (Size) | Độ đậm (Weight) | Mục đích sử dụng |
|:---|:---|:---|:---|
| **Display / Hook** | `76px – 96px` | `800 / 900` | Từ khóa Hook Cảnh 1 (`KÝ LÀ XONG?`), con số `21 NGÀY` |
| **Headline** | `46px – 58px` | `700 / 800` | Tiêu đề từng bước (`BƯỚC 1: ĐO NHU CẦU`, `GHI ÂM TƯ VẤN`...) |
| **Subtitles (Karaoke)** | `38px – 42px` | `700 / 800` | Dòng phụ đề 9–10 từ (`.sub-line`) tại `bottom: 185px` |
| **Marginalia / Stamp** | `24px – 30px` | `700 / 800` | Nhãn trên con dấu, 3 loại giấy tờ, 4 cửa thẩm định, 3 chốt xác thực |

---

## 4. CHẤT LIỆU, ÁNH SÁNG & KHÔNG GIAN SỐNG (MATERIALITY & ZERO DEAD FRAME)
- **Procedural Canvas `rng(20261113)`**: Tạo vân giấy lưu trữ ngà ấm (`#F4EFE6`), sợi cellulose ngẫu nhiên tất định và dấu thập căn lề hồ sơ tinh tế.
- **Zero Dead Frame (`0 freeze events`)**:
  - Container `#cam` vận động liên tục theo nhịp từng bước (`punch-in` khi quét hồ sơ & sóng ghi âm, `pan-right` khi tách 4 ngã rẽ, `pull-back` ở tổng kết).
  - Lớp bụi sáng bàn soi `#dust .mote` chuyển động hữu hạn `Math.floor(TOTAL / cyc) - 1`.

---

## 5. SƠ ĐỒ SỐNG & ĐIỀU PHỐI CHUYỂN ĐỘNG (LIVING MECHANISMS & GSAP PHYSICS)
1. **Single Central Metaphor**: Một tập hồ sơ duy nhất đi qua 10 nhịp kiểm định pháp lý (Cân bằng nhu cầu → Khay 3 giấy tờ → Thanh quét trung thực → Sóng ghi âm đối chiếu → Bộ chia 4 cửa thẩm định → Cổng xác thực 3 chốt & Lá chắn 2 tầng → Cửa sổ khóa 21 ngày).
2. **Easing vật lý có trọng lượng**:
   - Đóng dấu mộc, sập khóa ngày 21, gạt chốt xác thực, bật cửa phân nhánh: `back.out(1.7)` / `elastic.out(1, 0.5)`.
   - Trượt thanh quét, chạy sóng âm thanh, xoay đòn bẩy, vẽ nét bút ký, tô dạ quang: `power2.inOut` / `expo.out`.
   - Cấm tuyệt đối `power1.out`, `none`, `linear` cho chuyển động chính.
3. **Neo thời gian tuyệt đối**: Mọi tween neo 100% vào `T(wordIndex)` và `E(wordIndex)` từ `timing.json`; dòng phụ đề Karaoke cũ tắt tại `W[SUB[li + 1][0]].s - 0.04`.
4. **Kết phim theo `brand`**: Mặc định `brand: "none"` khép lại ở Cảnh 10 với dây chuyền 5 chốt hành động; nếu cấu hình `brand: "tien-duong"`, hiển thị thêm thẻ Outro căn giữa (`540px`) khớp `brand/tien-duong/profile.json`.
