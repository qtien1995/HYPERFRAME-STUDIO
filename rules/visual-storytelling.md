# Visual Storytelling Rules — Chuẩn Thiết Kế Đa Khổ Hình (9:16 · 16:9 · 1:1) & Kiến Trúc Compiler

> Nguyên tắc số 1: Hình phải tự kể được câu chuyện bằng cơ chế sống, ánh sáng có chủ đích và chuyển động máy quay liền mạch — xem [`AGENTS.md`](file:///d:/AI/HYPERFRAME-STUDIO/AGENTS.md) và [`rules/bespoke-creativity.md`](file:///d:/AI/HYPERFRAME-STUDIO/rules/bespoke-creativity.md).

---

## 1. KHUNG HÌNH & VÙNG AN TOÀN THEO KHỔ ĐÃ KHAI BÁO (`format`)

Dự án khai báo `format` trong `projects/<id>/inputProps.json` (mặc định `"9:16"`):

1. **Khổ dọc `"9:16"` (`1080 × 1920` — Reels / TikTok / Shorts)**:
   - Vùng nội dung chính: `y: 130 -> 1650`, `x: 60 -> 1020`.
   - Top Safe Zone (`y: 0 -> 120`): Tránh tai thỏ / thanh trạng thái.
   - Bottom Safe Zone (`y: 1720 -> 1920`): Tránh UI tương tác nền tảng; dải phụ đề Karaoke `#subs` đặt tại `bottom: 185px` (rộng `980px`).
2. **Khổ ngang `"16:9"` (`1920 × 1080` — YouTube / Phim tài liệu / Thuyết trình)**:
   - Vùng nội dung chính: `y: 80 -> 900`, `x: 120 -> 1800`.
   - Dải phụ đề Karaoke `#subs` đặt tại `bottom: 84px` (rộng `1240px`, căn giữa tại `X = 960px`).
3. **Khổ vuông `"1:1"` (`1080 × 1080` — Feed / Carousel Video)**:
   - Vùng nội dung chính: `y: 80 -> 880`, `x: 70 -> 1010`.
   - Dải phụ đề Karaoke `#subs` đặt tại `bottom: 84px` (rộng `980px`, căn giữa tại `X = 540px`).

---

## 2. KỶ LUẬT Ý NIỆM THỊ GIÁC & SƠ ĐỒ SỐNG (LIVING MECHANISMS)

### 2.1. Triết lý 1 Ẩn dụ Thị giác Duy nhất (Single Central Metaphor)
1. **Loại bỏ tư duy Thẻ Card Dashboard hay Báo cáo Kỹ thuật**:
   - Nghiêm cấm vẽ vòng tròn phần trăm (`ring progress` / `donut gauge`), thanh tiến trình phẳng kiểu web/app, hay thẻ hộp bo góc chứa 1 icon đứng yên giữa khung + chữ chạy bên dưới.
   - **Mỗi cảnh chỉ chứa DUY NHẤT 1 ẩn dụ thị giác trung tâm**: Toàn bộ sự chú ý tập trung vào một cơ chế tự vận hành để diễn giải nội dung.
2. **Cấm nhồi nhét văn bản (Zero Text Overload)**:
   - Tuyệt đối không bê nguyên đoạn văn dài dòng lên màn hình.
   - Văn bản bổ trợ chuyển thành vạch trừu tượng (skeleton lines) hoặc chữ chú thích ngắn (marginalia opacity 0.2–0.35).

### 2.2. Kỷ luật Typography & Chữ viết
1. **CẤM CẮT CHỮ (NO TRUNCATION)**: Không dùng `overflow: hidden` làm cụt chữ hay `text-overflow: ellipsis`.
2. **CẤM CO CHỮ (NO SHRINK-TO-FIT)**: Không giảm cỡ chữ bất thường gây khó đọc.
3. **CẤM RENDER KHUNG RỖNG (NO EMPTY CONTAINERS)**: Không render khung viền trống khi nhãn rỗng.
4. **Font chữ cục bộ & Hỗ trợ tiếng Việt**:
   - Chọn bộ font phù hợp với chủ đề (ví dụ `Be Vietnam Pro` hoặc bộ font khác có đủ dấu tiếng Việt), đặt file `.ttf`/`.woff2` vào `projects/<id>/assets/fonts/` và khai báo `@font-face` cục bộ trong `<style>` của `index.html`.
   - Các bộ đếm số bắt buộc bật `font-variant-numeric: tabular-nums`.

---

## 3. VẬT LÝ HỌC CHUYỂN ĐỘNG GSAP & ĐỒNG BỘ TỪNG TỪ (`T(wordIndex)`)

1. **Bảng Quy Chuẩn Easing Vật Lý**:
   - **Cấm Easing Mặc Định Vô Hồn**: Nghiêm cấm dùng `power1.out`, `power1.inOut` hay `none` / `linear` cho chuyển động chính.
   - **Va chạm, Rơi, Xuất Hiện Vật Thể**: Dùng `ease: "back.out(1.7)"` hoặc `ease: "elastic.out(1, 0.5)"`.
   - **Quét, Trượt, Dẫn Hướng Mắt**: Dùng `ease: "power2.inOut"` hoặc `ease: "expo.out"`.
   - **Nhảy Từng Chữ Phụ Đề Karaoke**: Dùng `ease: "back.out(3)"`.
   - **Chuyển Động Máy Quay `#cam`**: Dùng `ease: "sine.inOut"`.
2. **Khóa Toàn Bộ Chuyển Động Vào Hàm `T(wordIndex)` & `E(wordIndex)`**:
   - Cấm gán cứng giây ước lượng (`0.5s`, `1.2s`...). Toàn bộ timeline GSAP neo trực tiếp vào mảng timing từng từ trong `timing.json`.
3. **Nhịp Máy Quay Điện Ảnh & Chống Đứng Hình (`0 freeze events`)**:
   - Sân khấu `#cam` vận động đa hướng theo tâm lý từng cảnh (`punch-in`, `pull-back`, `pan-left`, `pan-right`, `breathe`) kết hợp nối mạch Match-Cut.
   - Bắt buộc có chuyển động môi trường nền với số lần lặp hữu hạn `repeat: Math.max(0, Math.floor(TOTAL / cyc) - 1)`. Nếu dùng sinh số ngẫu nhiên trên Canvas/DOM, dùng hàm `rng(seed)` cố định để render tất định.

---

## 4. KIẾN TRÚC COMPILER `build-index.cjs` (ZERO HAND-CODED TIMESTAMPS)

1. **Cấm viết tay các con số giây ước lượng vào `index.html`**: Mọi mã HTML/CSS/SVG/GSAP phải được biên dịch từ `projects/<id>/build-index.cjs`.
2. **Đọc `inputProps.json` & `assets/audio/timing.json`**:
   - Lấy `format` (`WIDTH × HEIGHT`) từ `inputProps.json`.
   - Lọc sạch token `---` từ `timing.json`, dùng `anchor(idx, expect)` để khóa mốc chuyển cảnh (`s1..sN`, số cảnh tự động theo chiều sâu đề tài).
3. **Tự động sinh đồng bộ 3 file từ 1 nguồn duy nhất**:
   - `projects/<id>/index.html`
   - `projects/<id>/specs/video-spec.json`
   - `projects/<id>/storyboard.json`

---

## 5. PHỤ ĐỀ KARAOKE ĐỒNG BỘ THEO TỪ (CHỐNG CHỒNG LẤP `content_overlap`)

- **Phân dòng (9–10 từ/dòng)**: Ngắt ưu tiên ở dấu câu khi đạt 9+ chữ, hoặc tối đa 10 chữ/dòng; gộp dòng cuối <4 chữ vào dòng trước nếu tổng ≤ 10 chữ.
- **Khóa thời điểm tắt dòng cũ**: Thời điểm ẩn dòng phụ đề hiện tại (`en`) bắt buộc khóa tại **`W[SUB[li + 1][0]].s - 0.04`** để dòng cũ tắt hẳn trước khi dòng kế tiếp mở.
- **Hiệu ứng nhảy từng chữ**: Mỗi từ bọc trong `span.sub-word` (`display: inline-block; margin: 0 5px; transform-origin: 50% 80%;`), phóng to `scale: 1.18, y: -6` tại `W[wi].s` và trở về `scale: 1.0, y: 0` tại `Math.max(W[wi].e, ws + 0.12)`.

---

## 6. KẾT PHIM & THẺ BRAND OUTRO (THEO CẤU HÌNH `brand`)

- **Khi `brand: "none"` (mặc định)**: Cảnh cuối (`sN`) kết thúc tự nhiên theo mạch cảm xúc/thông điệp của bộ phim, giữ micro-motion đến hết `TAIL` (`1.4s`).
- **Khi `brand: "<id>"` (ví dụ `"tien-duong"`)**: Đọc `brand/<id>/profile.json`, hiển thị thẻ Brand Outro căn giữa tuyệt đối theo trục ngang (`Center X = WIDTH / 2`) ngay trong `0.15s .. 0.85s` đầu của cảnh cuối (`SC[SC.length - 1].start`), nhấn highlight CTA chuẩn của brand tại `T(ctaWordIndex)` và giữ micro-motion chống freeze frame.

---

## 7. TIÊU CHUẨN ÂM THANH: EBU R128

- Giọng đọc từ CIT Voice Studio (`:8001`, 48kHz) theo `voice` và `ttsSpeed` đã khai báo trong `inputProps.json`.
- Chuẩn đo EBU R128: `Integrated Loudness` **-14.0 đến -12.0 LUFS**, `True Peak` **< -1.0 dBFS**, `Loudness Range (LRA)` **< 8.0 LU**.
