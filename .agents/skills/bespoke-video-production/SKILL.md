---
name: bespoke-video-production
description: >-
  Quy trình sản xuất video độc bản đa chủ đề, đa phong cách chất lượng cao (Pure Bespoke V4) từ Concept/Brief đến file MP4 xuất xưởng đạt 22/22 chuẩn E2E Hard QC Gate. Tự động đề xuất số cảnh, cấu trúc và thời lượng theo chiều sâu ý tưởng (cấm cưỡi ngựa xem hoa), khổ hình 9:16 / 16:9 / 1:1, giọng đọc tùy chọn qua CIT Voice Studio 48kHz, brand cắm-rút qua inputProps.json, GSAP timeline đồng bộ từng từ qua build-index.cjs và kiểm định 2 lớp (hyperframes check + soi frame PNG thực tế). Kích hoạt khi người dùng yêu cầu: "làm video", "sản xuất video bespoke", "dựng video từ concept", "render video cuối cùng", hoặc gọi /bespoke-video-production.
---

# Bespoke Video Production (Multi-Topic · Multi-Style V4 Runbook)

Skill này hướng dẫn toàn bộ quy trình thiết kế, dựng hình, âm thanh và kiểm định video MP4 độc bản cho **bất kỳ chủ đề nào** (khoa học, lịch sử, công nghệ, điện ảnh, kinh tế, đời sống, tài chính...), không đóng khung vào một phong cách hay thương hiệu cố định.

---

## 1. 6 Trụ cột chất lượng cốt lõi

1. **Tự do ngôn ngữ thị giác theo chủ đề & Chống AI Slop**:
   - Không áp đặt một bảng màu hay chất liệu cố định. Tùy nội dung, tự do chọn phong cách: tối điện ảnh (Cinematic Dark), động năng màu mạnh (Kinetic Bold), cắt dán (Paper Collage), bản vẽ kỹ thuật (Blueprint), hoặc sáng tối giản (Editorial Light) — miễn chữ đạt độ tương phản dễ đọc (WCAG AA).
   - **Mỗi cảnh 1 ẩn dụ thị giác trung tâm (Single Central Metaphor)**: Cấm thẻ card dashboard rẻ tiền (`ring progress`, thanh tiến trình phẳng, hộp chứa icon đứng yên + chữ chạy bên dưới) và cấm nhồi nhét đoạn văn bản dài.
   - **Frame-0 Impact ở Cảnh 1**: Ngay tại `t = 0.0s`, vật thể trung tâm + tiêu đề Hook (2–5 từ) phải hiển thị ngay lập tức; Cảnh 1 được phép phá cách độ tương phản (`--bg-hook`) để hút mắt tức thì.

2. **Living Diagrams & GSAP Motion Physics (Sơ đồ sống & Easing vật lý)**:
   - Mỗi cảnh là một cơ chế thị giác tự vận hành biến đổi theo lời thoại; tắt tiếng vẫn hiểu câu chuyện.
   - **Easing vật lý**: Cấm dùng `power1.out` hay `none`/`linear` cho chuyển động chính. Va chạm/rơi/xuất hiện dùng `ease: "back.out(1.7)"` hoặc `ease: "elastic.out(1, 0.5)"`; quét/trượt dùng `ease: "power2.inOut"` hoặc `ease: "expo.out"`.

3. **Word-Level Choreography qua `build-index.cjs` (`T(wordIndex)`)**:
   - Không viết tay các con số giây ước lượng vào `index.html`.
   - Viết script [`projects/<id>/build-index.cjs`](./examples/build-index-template.cjs) đọc trực tiếp `inputProps.json` và `assets/audio/timing.json`:
      - Dùng `anchor(wordIndex, expectedWord)` để khóa điểm cắt cảnh (`N` cảnh theo độ sâu kịch bản).
     - Dùng `T(wordIndex)` và `E(wordIndex)` để gắn từng hiệu ứng GSAP vào đúng mili-giây từ đó được phát âm.
     - Tự động xuất đồng bộ 3 tệp: `index.html`, `specs/video-spec.json`, và `storyboard.json`.

4. **Continuous Micro-Motion & Nhịp máy quay điện ảnh (`0 freeze events`)**:
   - Sân khấu `#cam` vận động đa hướng theo tâm lý từng cảnh (`punch-in`, `pull-back`, `pan-left`, `pan-right`, `breathe`) kết hợp nối mạch Match-Cut.
   - Có chuyển động môi trường nền với số lần lặp hữu hạn `Math.floor(TOTAL / cyc) - 1` (nếu dùng ngẫu nhiên phải qua `rng(seed)` cố định), đảm bảo `freezedetect` đạt **`0 freeze events`**.

5. **Kỷ luật Font Cục bộ & Phụ đề Karaoke không chồng lấp**:
   - **Font**: Đặt bộ font đã chọn trong `DESIGN.md` (hỗ trợ đủ dấu tiếng Việt nếu lời thoại tiếng Việt) vào `projects/<id>/assets/fonts/` và khai báo `@font-face` cục bộ trong `<style>` của `index.html`.
   - **Phụ đề Karaoke**: Chia 9–10 từ/dòng (`.sub-line`), tắt dòng cũ tại `W[SUB[li + 1][0]].s - 0.04` (trước khi dòng mới mở `40ms`) để không bao giờ bị lỗi `content_overlap`.

6. **Cấu hình dự án & Brand cắm-rút qua `inputProps.json`**:
   - Khai báo `format` (`"9:16"` | `"16:9"` | `"1:1"`), `voice` (mặc định `"Hải Đăng"`), `ttsSpeed` (mặc định `1.0`), và `brand` (`"none"` mặc định hoặc ID trong `brand/<id>/profile.json` như `"tien-duong"`).
   - Nếu `brand: "none"`, kết phim tự nhiên theo nội dung; nếu có `brand`, cảnh cuối hiển thị đầy đủ thông tin và CTA từ `brand/<id>/profile.json`, căn giữa theo trục ngang (`WIDTH / 2`).

---

## 2. Quy trình thực thi 4 Pha Cưỡng Chế & Phân Vai Model Tối Ưu Quota (One-Phase-Per-Turn)

> **Quy tắc Báo Trước Model Cụ Thể (Mandatory Next-Model Banner)**: Vì mỗi lượt chạy (turn/task) trên Antigravity gắn với 1 model cố định, ở **cuối mỗi Pha**, AI **BẮT BUỘC** phải in hộp thông báo chỉ rõ **tên chính xác của Model** cần chọn cho Pha kế tiếp (`Gemini 4 Hydrogen (High)`, `Gemini 4 Argon (High)`, `Gemini 3.8 Flash (High)`, hoặc `Claude Sonnet 5.5 (High)` / `Claude Opus 5.5 (High)`).

### 🔒 PHA 1: Cấu hình (`inputProps.json`), Kịch bản (`script.md`), Đạo diễn (`creative-direction.md`) & Hợp đồng Thiết kế (`DESIGN.md`) — *[MODEL: 🧠 Gemini 4 Hydrogen (High/XHigh) hoặc Gemini 4 Argon (High)]* · *[CẤM GỌI TTS · CẤM VIẾT CODE]*

1. Tạo thư mục `projects/<id>/` cùng các file:
   - `inputProps.json`: Khai báo `projectId`, `format` (`"9:16"` / `"16:9"` / `"1:1"`), `voice`, `ttsSpeed`, `brand` (`"none"` hoặc `"tien-duong"` / `<id>`), cùng `targetScenes` và `targetDurationSec` tự động đề xuất theo độ sâu đề tài.
   - `script.md`: Lời thoại dưới mục `# Narration` tự nhiên, **đi sâu giải phẫu bản chất (First-Principles, cấm cưỡi ngựa xem hoa)**, số cảnh và thời lượng tự động đề xuất theo ý tưởng, lọc bỏ số liệu không nguồn (Fact-Check Filter). **Cấm đặt dòng `---` bên dưới nội dung `# Narration`**.
   - `beats.json`: Danh sách các nhịp thị giác tương ứng với từng mắt xích cơ chế của kịch bản.
   - `creative-direction.md`: Điền đầy đủ Art Direction Sheet theo `rules/bespoke-creativity.md` (nêu rõ ngôn ngữ thị giác chọn cho chủ đề và lý do).
   - `DESIGN.md`: Theo mẫu [`templates/design-systems/DESIGN-TEMPLATE.md`](file:///d:/AI/HYPERFRAME-STUDIO/templates/design-systems/DESIGN-TEMPLATE.md) (bắt buộc có `:root` khóa bảng màu của dự án).
2. Ghi nhận trạng thái:
   ```powershell
   npm run factory -- record --stage SCRIPT --project <id>
   npm run factory -- record --stage BEATS --project <id>
   ```
3. **CHỐT CHẶN 1 (HARD STOP #1)**: Trình `inputProps.json`, `script.md`, `creative-direction.md` và `DESIGN.md` chờ User duyệt Gate 1 & Gate 2.
4. **BẮT BUỘC IN THÔNG BÁO BÁO TRƯỚC MODEL Ở CUỐI PHA 1**:
   > 🔔 **CHỌN MODEL CHO PHA 2 (Thu âm TTS & Chuẩn bị tài nguyên)**: Hãy chuyển sang **`Gemini 3.8 Flash (High)`** (chạy CLI/TTS siêu tốc & dùng bể quota hồi theo giờ) rồi nhắn *"Duyệt"*.

---

### 🔒 PHA 2: Duyệt Gate, Đo nhịp Voice 48kHz & Dọn Tài Nguyên Cục Bộ — *[MODEL: ⚡ Gemini 3.8 Flash (High)]* · *[CẤM VIẾT CODE ĐỒ HỌA Ở PHA NÀY]*

1. Khi User duyệt Gate 1 & Gate 2, chạy các lệnh ghi nhận:
   ```powershell
   node core/scripts/factory/index.js approve --project <id> --gate GATE1 --evidence "<ly_do_user_duyet>"
   node core/scripts/factory/index.js record --stage CREATIVE_DIRECTION --project <id>
   node core/scripts/factory/index.js approve --project <id> --gate GATE2 --evidence "<ly_do_user_duyet>"
   ```
2. Kiểm tra CIT Voice Studio (`:8001`) qua `npm run doctor` (nếu offline chạy `npm run services`), sau đó chạy TTS và đo timing thật theo `voice` & `ttsSpeed` của dự án:
   ```powershell
   node core/scripts/factory/index.js tts --project <id>
   ```
3. Chuẩn bị đầy đủ tài nguyên trong `projects/<id>/assets/` (`assets/fonts/`, `assets/vendor/gsap.min.js`, và `assets/branding/` nếu dự án có brand).
4. Trích xuất bảng tra cứu từ ngữ gọn gàng (`[wordIdx] "word" (startSec -> endSec)`) từ `projects/<id>/assets/audio/timing.json` lưu vào `projects/<id>/assets/audio/word-map.txt` (giúp tiết kiệm tối đa token đọc JSON ở Pha 3).
5. **CHỐT CHẶN 2 (HARD STOP #2)**: Báo cáo kết quả thu âm (thời lượng, tổng số từ) và **BẮT BUỘC IN THÔNG BÁO BÁO TRƯỚC MODEL Ở CUỐI PHA 2**:
   > 🔔 **CHỌN MODEL CHO PHA 3 (Thiết kế Blueprint & Code Đồ họa SVG/GSAP)**: Hãy chuyển sang **`Claude Sonnet 5.5 (High)`** *(khuyên dùng chuẩn — tối ưu quota Claude)* hoặc **`Claude Opus 5.5 (High)`** *(nếu muốn đồ họa phức tạp kịch trần)* trước khi nhắn *"Chạy Pha 3"*!

---

### 🔒 PHA 3: Bản vẽ Kỹ thuật (`PRODUCTION-BLUEPRINT.md`), Trình biên dịch (`build-index.cjs`) & Kiểm định Lớp 1 (`hyperframes check`) — *[MODEL: 🎨 Claude Sonnet 5.5 (High) / Claude Opus 5.5 (High)]* · *[CẤM RENDER KHI CHƯA 0 ERRORS]*

1. Đọc `DESIGN.md`, `assets/audio/word-map.txt` (và `timing.json`), **xuất Bản vẽ Kỹ thuật `projects/<id>/PRODUCTION-BLUEPRINT.md` (BẮT BUỘC)** gồm 4 phần:
   - **Phần 1 (Word Map & Anchors)**: Bảng tra cứu `wordIndex` và danh sách `anchor(wordIdx, expectedWord)`.
   - **Phần 2 (Palette `:root` & Materiality)**: Hệ màu CSS Variables `:root`, chất liệu & chuyển động môi trường + máy quay `#cam`.
   - **Phần 3 (DOM/SVG Architecture)**: Cấu trúc DOM/SVG từng cảnh theo khổ hình `WIDTH × HEIGHT`.
   - **Phần 4 (Word-Synced GSAP Choreography)**: Bảng kịch bản tween GSAP gắn chặt vào `T(wordIndex)` và `E(wordIndex)`, công thức ngắt phụ đề Karaoke (`W[SUB[li + 1][0]].s - 0.04`).
2. Dựa trên `PRODUCTION-BLUEPRINT.md` và mẫu [`examples/build-index-template.cjs`](./examples/build-index-template.cjs), viết hoàn chỉnh `projects/<id>/build-index.cjs` (Full Output Enforcement, cấm `// TODO`).
3. Chạy `node projects/<id>/build-index.cjs` để sinh đồng bộ `index.html`, `specs/video-spec.json`, `storyboard.json`.
4. Chạy `npx hyperframes check projects/<id>` đạt **`0 error(s)`** và ghi nhận trạng thái:
   ```powershell
   node core/scripts/factory/index.js record --stage STORYBOARD --project <id>
   node core/scripts/factory/index.js record --stage VIDEO_SPEC --project <id>
   node core/scripts/factory/index.js record --stage VALIDATION --project <id>
   node core/scripts/factory/index.js record --stage PRODUCTION --project <id>
   ```
5. **CHỐT CHẶN 3 (HARD STOP #3)**: Báo cáo hoàn tất bộ code đồ họa và **BẮT BUỘC IN THÔNG BÁO BÁO TRƯỚC MODEL Ở CUỐI PHA 3**:
   > 🔔 **CHỌN MODEL CHO PHA 4 (Render MP4, Soi ảnh PNG & Hard QC)**: Hãy chuyển về **`Gemini 4 Hydrogen (High)`** *(hoặc **`Gemini 3.8 Flash (High)`** / **`Gemini 4 Argon (High)`**)* trước khi nhắn *"Chạy Pha 4"* để không tốn quota Claude khi đọc ảnh PNG!

---

### 🔒 PHA 4: Kiểm định Lớp 2 — Render Final, Soi Toàn Bộ Frame PNG Thực Tế & Khóa E2E Hard QC — *[MODEL: 👁️ Gemini 4 Hydrogen (High) / ⚡ Gemini 3.8 Flash (High) / 🧠 Gemini 4 Argon (High)]*

1. Tạo file `projects/<id>/qc.md` và chạy:
   ```powershell
   npm run make -- --project <id>
   ```
2. **Kiểm định Lớp 2 (Bắt buộc)**: Dùng `read_file` **soi trực tiếp toàn bộ các file PNG** trong `projects/<id>/output/storyboard-check/` (`frame_00_hook_0.30s.png` + đủ `N` frame đại diện từng cảnh `s1..sN`).
3. Khi đạt **`Failed: 0 | Verdict: ALL TESTS PASSED`** và toàn bộ ảnh PNG hoàn hảo, ghi nhận hoàn tất:
   ```powershell
   node core/scripts/factory/index.js record --stage FINAL_QA --reviewed --artifact qc.md --project <id>
   node core/scripts/factory/index.js record --stage DONE --artifact output/final.mp4 --project <id>
   node core/scripts/factory/index.js status --project <id>
   ```
