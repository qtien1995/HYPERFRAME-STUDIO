# VIDEO FACTORY — PRODUCTION AGENT (COMPILER ARCHITECTURE)

## Vai trò

Nhận Cấu hình (`inputProps.json`) + Story (`script.md`, `beats.json`) + Art Direction (`creative-direction.md`, `DESIGN.md`) đã duyệt qua Gate 1 & Gate 2 (hoặc nhận `PRODUCTION-BLUEPRINT.md`) và biên dịch thành dự án HyperFrames hoàn chỉnh.

- **Engine duy nhất được khóa cứng**: **HyperFrames CLI v0.9.15 + GSAP Timelines + trình sinh mã `projects/<id>/build-index.cjs`**.

---

## ⚙️ Kiến trúc Compiler `build-index.cjs` Bắt buộc (Zero Hand-Coded Timestamps)

1. **Cấm viết tay các con số giây ước lượng vào `index.html`**:
   - Mọi mã HTML/CSS/SVG/GSAP phải được sinh ra tự động từ script `projects/<id>/build-index.cjs`.
2. **Đọc `inputProps.json` & `assets/audio/timing.json`**:
   - Đọc `format` (`9:16` = `1080×1920`, `16:9` = `1920×1080`, `1:1` = `1080×1080`) và `brand` từ `inputProps.json`.
   - Đọc `assets/audio/timing.json`, lọc sạch các token rỗng hoặc `---`.
3. **Khóa mốc chuyển cảnh bằng `anchor(wordIdx, expectedWord)`**:
   - Dùng hàm `anchor(idx, expect)` để xác thực vị trí từ đầu mỗi cảnh (`s1..sN` theo kịch bản).
4. **Gắn mọi Tween GSAP vào `T(wordIndex)` và `E(wordIndex)`**:
   - Mọi chuyển động cơ chế sống, vẽ đường SVG, biến đổi đạo cụ, nhảy số đều bám chính xác đến từng mili-giây của từ được phát âm thông qua `T(wordIndex)` và `E(wordIndex)`.
5. **Tự động sinh đồng bộ 3 tạo phẩm từ `build-index.cjs`**:
   - `projects/<id>/index.html` (khớp `data-width` và `data-height` của khổ hình dự án)
   - `projects/<id>/specs/video-spec.json`
   - `projects/<id>/storyboard.json`
6. **Phụ đề Karaoke 9–10 từ/dòng Chống Chồng Lấp (`content_overlap`)**:
   - Thời điểm tắt dòng phụ đề cũ khóa cứng tại **`W[SUB[li + 1][0]].s - 0.04`** để dòng cũ biến mất hoàn toàn trước khi dòng mới xuất hiện.

---

## Thứ tự thực thi bắt buộc

1. **Kiểm tra trạng thái duyệt**:
   - Xác nhận `node core/scripts/factory/index.js status --project <id>` đã qua Gate 1 và Gate 2.
2. **Tạo Voice & Trích xuất Word Timing (Pha 2)**:
   - Chạy `node core/scripts/factory/index.js tts --project <id>` (tự động đọc `voice` và `ttsSpeed` từ `inputProps.json`).
   - Xuất `projects/<id>/PRODUCTION-BLUEPRINT.md` đầy đủ 4 phần (Word Map/anchor, `:root` palette, DOM/SVG theo khổ hình, và kịch bản GSAP `T(wordIndex)`). Dừng lại báo cáo ở cuối Pha 2.
3. **Chuẩn bị Fonts & Assets cục bộ (Pha 3)**:
   - Đặt bộ font đã chọn trong `DESIGN.md` vào `projects/<id>/assets/fonts/`, `gsap.min.js` vào `projects/<id>/assets/vendor/`, và logo thương hiệu vào `projects/<id>/assets/branding/` (nếu `brand != "none"`).
4. **Viết và chạy Compiler `projects/<id>/build-index.cjs` (Pha 3)**:
   - Dựng không gian, chất liệu và ánh sáng đúng theo `DESIGN.md` & `PRODUCTION-BLUEPRINT.md`.
   - Dựng các cảnh `.clip.scene` (`s1`..`sN`) với cơ chế sống tự vận động và chuyển động `#cam` đa hướng gắn với `T(wordIndex)`. Cảnh 1 (`s1`) hiển thị ngay tại Frame 0 (`t = 0.0s`).
   - Nếu dự án có `brand != "none"`, dựng thẻ Brand Outro ở cảnh cuối căn giữa (`Center X = WIDTH / 2`) theo `brand/<id>/profile.json`.
   - Chạy `node projects/<id>/build-index.cjs` và `npx hyperframes check projects/<id>` đạt **`0 error(s)`**.
5. **Render Final & Kiểm định Lớp 2 (Pha 4)**:
   - Chạy `npm run make -- --project <id>`.
   - Dùng `read_file` soi trực tiếp `frame_00_hook_0.30s.png` và đủ `N` frame PNG đại diện cho từng cảnh trong `projects/<id>/output/storyboard-check/`.
   - Ghi báo cáo vào `projects/<id>/qc.md` và cập nhật trạng thái `FINAL_QA` -> `DONE`.
