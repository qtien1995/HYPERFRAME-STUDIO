# DESIGN SYSTEM SPECIFICATION (DESIGN.md TEMPLATE)
<!-- HYPERFRAME STUDIO V4 · MULTI-TOPIC & MULTI-STYLE BESPOKE CONTRACT -->

## 1. TỔNG QUAN HỆ THỐNG THIẾT KẾ (SYSTEM METADATA)
- **Project ID**: `<project_id>`
- **Tên dự án**: `<project_title>`
- **Chủ đề & Ngữ cảnh**: `<Khoa học / Lịch sử / Công nghệ / Tài chính / Điện ảnh / Giải trí / ...>`
- **Aesthetic Direction (Ngôn ngữ thị giác chọn cho chủ đề này)**: `<Tự định nghĩa hoặc tham khảo thư viện gợi ý tại templates/design-systems/families/>`
- **Lý do chọn ngôn ngữ thị giác này**: `<Giải thích vì sao bảng màu, chất liệu và nhịp chuyển động này phục vụ tốt nhất cho cảm xúc của chủ đề>`
- **Khổ hình & Viewport**: `<9:16 (1080×1920) | 16:9 (1920×1080) | 1:1 (1080×1080)>` (khớp với `inputProps.json`).
- **Brand Profile**: `<none | tien-duong | brand_id>`
- **Engine & Adapter**: `HyperFrames v0.9.15 + GSAP 3.15.0 + Native HTML/SVG/Canvas`.

---

## 2. BẢNG MÃ MÀU & THIẾT KẾ BIẾN SỐ (SEMANTIC DESIGN TOKENS)

### 2.1. Khóa cứng CSS Variables (`:root`)
Mọi mã màu của dự án phải được khai báo trong `:root` và truy xuất qua `var(--token)`. Nền có thể **sáng, tối điện ảnh, tương phản màu mạnh, hay đa chất liệu** tùy theo cảm xúc chủ đề — miễn đảm bảo độ tương phản chữ đọc rõ ràng (WCAG AA) và không rơi vào giao diện AI rẻ tiền.

```css
:root {
  /* Bề mặt & Không gian (Surfaces) */
  --bg-stage: #121316;         /* Nền tổng thể sân khấu (chọn theo cảm xúc chủ đề) */
  --bg-surface: #1C1E24;       /* Bề mặt lớp trung gian / đạo cụ chính */
  --bg-elevated: #262932;      /* Vùng nổi cao / điểm hội tụ ánh sáng */
  --bg-overlay: rgba(15, 16, 20, 0.86); /* Nền mờ cho phụ đề Karaoke */

  /* Đặc quyền Phá Cách Cảnh 1 Hook (Tùy chọn) */
  --bg-hook: #7F1D1D;          /* Bề mặt tương phản mạnh cho Cảnh 1 (0–3s đầu) */
  --ink-hook: #FAF7F2;

  /* Chữ viết & Đường nét (Typography & Linework) */
  --ink-primary: #F5F5F7;      /* Màu chữ và nét vẽ chính (tương phản cao với --bg-stage) */
  --ink-secondary: #A1A6B4;    /* Chú thích phụ, nhãn bên lề */
  --ink-dim: rgba(245, 245, 247, 0.25); /* Vạch skeleton, lưới tọa độ chìm */

  /* Điểm nhấn & Trạng thái (Accents) */
  --accent-1: #FDE047;         /* Điểm nhấn chủ đạo & highlight từ khóa Karaoke */
  --accent-2: #38BDF8;         /* Điểm nhấn cơ chế / luồng dữ liệu */
  --status-danger: #EF4444;    /* Xung đột, cảnh báo, phủ định */
  --status-success: #10B981;   /* Giải pháp, xác nhận */
}
```

### 2.2. Danh sách cấm kỵ thẩm mỹ chung (Universal Anti-AI Slop Blacklist)
- ❌ **CẤM** thẻ card dashboard rẻ tiền chứa 1 icon đứng yên giữa khung + chữ chạy bên dưới.
- ❌ **CẤM** vòng tròn phần trăm (`ring progress` / `donut gauge`) hoặc thanh tiến trình phẳng vô hồn khi không phục vụ trực tiếp cơ chế thật.
- ❌ **CẤM** gradient tím/hồng mặc định vô nghĩa của AI (`linear-gradient(135deg, #6366f1, #a855f7)`).
- ❌ **CẤM** nhồi nhét đoạn văn bản dài lên màn hình (chuyển văn bản phụ thành vạch trừu tượng skeleton lines hoặc chữ chú thích ngắn 2–5 từ).

---

## 3. THIẾT KẾ CHỮ VIẾT & PHÂN CẤP THỊ GIÁC (TYPOGRAPHIC HIERARCHY)

### 3.1. Phông chữ theo chủ đề
- Chọn bộ font phù hợp cá tính chủ đề (ví dụ: `Be Vietnam Pro`, `Inter`, `Space Grotesk`, `Playfair Display`, `JetBrains Mono`...) và nhúng `@font-face` cục bộ từ `assets/fonts/` để HyperFrames đóng gói thành Data URI (0 lỗi `font_family_without_font_face`).
- **Bắt buộc hỗ trợ đầy đủ dấu tiếng Việt** nếu video dùng ngôn ngữ tiếng Việt (tránh lỗi lệch dấu do fallback font).
- **Bộ đếm & Số liệu**: Bật `font-variant-numeric: tabular-nums` cho mọi con số biến thiên.

### 3.2. Bảng tỷ lệ chữ gợi ý
| Cấp bậc (Level) | Cỡ chữ (Size) | Độ đậm (Weight) | Mục đích sử dụng |
|:---|:---|:---|:---|
| **Display / Hook** | `72px – 96px` | `800 / 900` | Từ khóa mở màn Cảnh 1, con số trung tâm |
| **Headline** | `44px – 56px` | `700 / 800` | Tiêu đề phân cảnh, nhãn cơ chế chính |
| **Subtitles (Karaoke)** | `36px – 44px` | `700 / 800` | Dòng phụ đề 9–10 từ (`.sub-line`) |
| **Marginalia / Label** | `22px – 28px` | `600 / 700` | Nhãn sơ đồ, chú thích ngắn |

---

## 4. CHẤT LIỆU, ÁNH SÁNG & KHÔNG GIAN SỐNG (MATERIALITY & ZERO DEAD FRAME)

- **Chất liệu & Ánh sáng theo chủ đề**: Tự do sử dụng Procedural Canvas, SVG filters, ánh sáng spotlight, hạt môi trường, lưới kỹ thuật, thấu kính quang học, hoặc hình khối 3D CSS/Canvas tùy theo thế giới thị giác của video (mọi hiệu ứng ngẫu nhiên nếu dùng phải có seed cố định để render tất định).
- **Zero Dead Frame (`0 freeze events`)**:
  - Sân khấu `#cam` vận động liên tục theo tâm lý từng cảnh (`punch-in`, `pull-back`, `pan-left`, `pan-right`, `breathe`).
  - Có chuyển động môi trường nền (hạt sáng, sóng lưới, dòng chảy, hoặc ánh sáng quét) lặp hữu hạn để không có khung hình nào đứng yên quá 3 giây.

---

## 5. SƠ ĐỒ SỐNG & ĐIỀU PHỐI CHUYỂN ĐỘNG (LIVING MECHANISMS & GSAP PHYSICS)

1. **Mỗi cảnh 1 ẩn dụ thị giác trung tâm (Single Central Metaphor)**: Hình ảnh tự vận động để giải thích cơ chế; tắt tiếng vẫn hiểu câu chuyện.
2. **Easing vật lý có trọng lượng**:
   - Va chạm, xuất hiện có quán tính: `back.out(1.7)` hoặc `elastic.out(1, 0.5)`.
   - Quét, trượt, dẫn hướng mắt: `power2.inOut` hoặc `expo.out`.
   - Cấm dùng `power1.out` hay `none`/`linear` cho chuyển động chính.
3. **Khóa toàn bộ timeline vào hàm `T(wordIndex)` & `E(wordIndex)`**:
   - Cấm gán cứng giây ước lượng; mọi tween GSAP neo trực tiếp vào mili-giây của từ ngữ trong `timing.json`.
   - Phụ đề Karaoke tắt dòng cũ tại `W[SUB[li + 1][0]].s - 0.04` (chống `content_overlap`).
4. **Outro (Chỉ áp dụng khi `brand != "none"`)**:
   - Nếu dự án có khai báo brand trong `inputProps.json`, cảnh cuối hiển thị đầy đủ thông tin từ `brand/<id>/profile.json`, căn giữa theo trục ngang (`WIDTH / 2`). Nếu `brand: "none"`, cảnh cuối kết thúc tự nhiên theo mạch nội dung của bộ phim.
