# AGENTS.md — HYPERFRAME STUDIO V4 (MULTI-TOPIC · PURE BESPOKE VIDEO ENGINE)

## Mục tiêu

Workspace sản xuất video đa chủ đề, đa phong cách bằng Codex/Antigravity theo triết lý **độc bản thuần túy (Pure Bespoke)**: mỗi video là một tác phẩm được thiết kế riêng từ nội dung, cảm xúc và thế giới quan của chủ đề đó (khoa học, lịch sử, công nghệ, điện ảnh, kinh tế, văn hóa, đời sống, tài chính...).

- **Engine duy nhất**: **HyperFrames CLI v0.9.15 + GSAP Timelines + trình sinh mã `build-index.cjs`** (Native HTML, SVG, Procedural Canvas 2D/3D).
- **Voiceover**: CIT Voice Studio (VieNeu-TTS local `:8001`, 48kHz, trích xuất timing từng từ; giọng mặc định `"Hải Đăng"`, có thể đổi giọng theo từng dự án qua `inputProps.json`).

---

## THỨ ĐƯỢC KHÓA — CHỈ 3 NHÓM KỶ LUẬT CHẤT LƯỢNG NÀY, NGOÀI RA KHÔNG KHÓA GÌ HẾT

1. **Giao thức 4 Pha Tuần Tự & Cổng Duyệt User (Gate 1 / Gate 2)**: Làm xong pha nào dừng lại nghiệm thu pha đó, cấm nhảy cóc từ TTS sang code mà bỏ qua `PRODUCTION-BLUEPRINT.md`, cấm tự duyệt (fast-track).
2. **Đồng bộ Từng Từ (`T(wordIndex)`) & CIT Voice Studio `:8001`**: Mọi chuyển động GSAP neo vào mili-giây từ ngữ thật trong `timing.json` qua `build-index.cjs`. CIT Voice Studio offline thì DỪNG và báo lỗi (không tự ý fallback sang dịch vụ khác).
3. **Cổng QC Kỹ Thuật (`tests/e2e/test_final_video.cjs`) & Chống AI Slop**: Khổ hình đúng theo khai báo dự án, 30fps, H.264+AAC 48kHz, âm lượng EBU R128 (-14..-12 LUFS), `0 freeze events`, `0 error(s)` trên `npx hyperframes check`.

---

## ⚙️ CẤU HÌNH LINH HOẠT THEO TỪNG DỰ ÁN (`projects/<id>/inputProps.json`)

Mọi thông số sáng tạo và định dạng đều do từng dự án tự quyết định trong `projects/<id>/inputProps.json` (đọc tự động qua `core/scripts/factory/project-config.js`):

| Trường | Mặc định (khi bỏ trống) | Các giá trị hỗ trợ & Ý nghĩa |
| :--- | :--- | :--- |
| `brand` | `"none"` | `"none"` (không gắn thương hiệu, không cần thẻ outro/CTA) hoặc ID hồ sơ trong `brand/<id>/profile.json` (ví dụ `"tien-duong"`). |
| `voice` | `"Hải Đăng"` | Tên giọng đọc bất kỳ trong CIT Voice Studio (`:8001`) phù hợp với tính cách nội dung. |
| `ttsSpeed` | `1.0` | Tốc độ đọc (ví dụ `0.95` trầm tĩnh, `1.05` nhịp nhanh). |
| `format` | `"9:16"` | `"9:16"` (`1080×1920` dọc), `"16:9"` (`1920×1080` ngang), `"1:1"` (`1080×1080` vuông). |
| `targetScenes` | Tự động đề xuất theo ý tưởng | Số cảnh không giới hạn cứng — tự động đề xuất tại Pha 1 dựa trên độ sâu thực tế của chủ đề. |
| `targetDurationSec` | Tự động đề xuất theo ý tưởng | Thời lượng mở hoàn toàn — đủ để mổ xẻ thấu đáo bản chất vấn đề, không cắt gọt nông cạn. |

---

## ⚖️ LUẬT SÁNG TẠO ĐỘC BẢN ĐA CHỦ ĐỀ

**ĐIỀU 1 — TỰ DO THẨM MỸ THEO CHỦ ĐỀ & CHỐNG AI SLOP:**
- **Không đóng khung vào bất kỳ một phong cách cố định nào**: Tùy chủ đề (vũ trụ, cổ sử, công nghệ lõi, tâm lý học, kinh tế, tài chính...), Director hoàn toàn tự do chọn ngôn ngữ thị giác phù hợp: tối điện ảnh (Cinematic Dark), động năng màu mạnh (Kinetic Bold Color), cắt dán đa chất liệu (Paper Collage), bản vẽ kỹ thuật (Blueprint), hoặc sáng tối giản (Editorial Light). Thư viện `templates/design-systems/families/` chỉ là gợi ý tham khảo, không bắt buộc.
- **Mỗi cảnh 1 ẩn dụ thị giác trung tâm (Single Central Metaphor)**: Khoảng thở hợp lý, không nhồi nhét nhiều đồ họa rời rạc cạnh tranh nhau.
- **Loại bỏ tư duy Dashboard/Widget rẻ tiền**: Cấm vẽ vòng tròn phần trăm (`ring progress`), thanh tiến trình phẳng vô hồn, hay thẻ hộp chứa 1 icon đứng yên giữa khung + chữ chạy bên dưới.
- **Cấm nhồi nhét văn bản (Zero Text Overload)**: Không bê nguyên đoạn văn dài lên màn hình; văn bản phụ chuyển thành đường nét trừu tượng hoặc nhãn chú thích ngắn (2–5 từ).

**ĐIỀU 2 — ART DIRECTION SHEET & `DESIGN.md` TRƯỚC KHI CODE:**
Trước khi viết code, Director bắt buộc xuất `creative-direction.md` và `DESIGN.md` định nghĩa rõ: (1) Lý do chọn ngôn ngữ thị giác cho chủ đề này; (2) Ẩn dụ trung tâm & cơ chế sống; (3) Hệ màu `:root` CSS Variables; (4) Bộ font cục bộ; (5) Ngôn ngữ máy quay & chuyển cảnh. Chưa được User duyệt = không code.

**ĐIỀU 3 — HÌNH TỰ KỂ CHUYỆN, CHẤT LIỆU CÓ CHỦ ĐÍCH & KHÔNG GIAN SỐNG (ZERO DEAD FRAME):**
- **Ẩn dụ tiến hoá & Sơ đồ sống (Living Mechanisms):** Hình ảnh tự vận động để giải thích cơ chế; tắt tiếng vẫn hiểu câu chuyện đang diễn ra.
- **Chất liệu & Ánh sáng có chủ đích:** Tự do dùng Procedural Canvas, SVG filters, hạt sáng, lưới không gian, thấu kính, 3D CSS... phù hợp đề tài. Nếu dùng sinh số ngẫu nhiên trên Canvas/DOM thì dùng hàm `rng(seed)` cố định để đảm bảo render tất định (deterministic).
- **Zero Dead Frame & Nhịp máy quay điện ảnh:** Sân khấu `#cam` vận động đa hướng theo tâm lý từng cảnh (`punch-in`, `pull-back`, `pan-left`, `pan-right`, `breathe`) kết hợp nối mạch **Match-Cut** giữa các cảnh, bảo đảm đạt tuyệt đối **`0 freeze events`**.

**ĐIỀU 4 — VẬT LÝ HỌC CHUYỂN ĐỘNG GSAP & ĐỒNG BỘ TỪNG TỪ (`T(wordIndex)`):**
- **Easing vật lý có trọng lượng**: Cấm dùng `power1.out` hay `none`/`linear` cho chuyển động chính. Va chạm/xuất hiện vật thể dùng `ease: "back.out(1.7)"` hoặc `ease: "elastic.out(1, 0.5)"`; quét/trượt dẫn hướng mắt dùng `ease: "power2.inOut"` hoặc `ease: "expo.out"`.
- **Khóa toàn bộ chuyển động vào `T(wordIndex)` & `E(wordIndex)`**: Cấm gán cứng giây ước lượng (`0.5s`, `1.2s`...). Mọi tween GSAP phải neo trực tiếp vào mili-giây của từ ngữ trong `timing.json`.

**ĐIỀU 5 — CẢNH 1 ĐẬP VÀO PHẢI THU HÚT (FRAME-0 VISUAL IMPACT):**
- Tại `t = 0.0s`, vật thể trung tâm và tiêu đề Hook (2–5 từ đắt giá) phải hiện diện ngay lập tức trên khung hình (cấm mở màn bằng màn hình trống rồi mới fade-in chậm).
- Cảnh 1 (`s1`, 0–3 giây đầu) được phép phá cách hoàn toàn về bảng màu và độ tương phản (`--bg-hook`) để tạo cú sốc thị giác giữ chân người xem ngay lập tức.

**ĐIỀU 6 — TƯƠNG PHẢN & ĐỘ DỄ ĐỌC (READABILITY & CONTRAST):**
- Bất kể dự án chọn nền sáng, nền tối điện ảnh hay nền màu rực, chữ và đồ họa chính phải đạt độ tương phản chuẩn WCAG AA so với nền, dễ đọc ngay trên màn hình đích.

---

## 🧠 BỘ NÃO BIÊN KỊCH ĐA CHỦ ĐỀ (CHUẨN KỊCH BẢN GATE 1)

1. **Chiều sâu bản chất & Cấm "Cưỡi ngựa xem hoa" (Deep-Dive First-Principles)**:
   - Tuyệt đối không viết kịch bản hời hợt kiểu điểm báo bề nổi, liệt kê gạch đầu dòng sách giáo khoa hay lướt qua khái niệm mà không giải thích cơ chế.
   - Bắt buộc bóc tách đến tận gốc rễ (**First-Principles**): (a) **Tại sao** cơ chế/hiện tượng đó sinh ra? (b) **Nó vận hành ngầm như thế nào** qua từng mắt xích nhân – quả cụ thể? (c) **Điểm mù / góc khuất / hiểu lầm phổ biến** mà số đông thường mắc phải là gì? (d) **Hệ quả thực tế & bài học đắt giá** là gì?
2. **Tự động đề xuất Số cảnh, Cấu trúc & Thời lượng theo Ý tưởng (Zero Fixed Cap)**:
   - Không đóng khung cứng số cảnh, số hồi hay giới hạn giây.
   - Ở Pha 1, dựa trên độ sâu và bản chất của ý tưởng, Story Director tự động phân tích và đề xuất **số cảnh (`N`), thời lượng dự kiến và cấu trúc dẫn chuyện tối ưu** trong `inputProps.json` + `script.md` để trình User duyệt tại Gate 1. Nếu chủ đề phức tạp, bắt buộc chia đủ số cảnh để mỗi cảnh giải phẫu triệt để 1 mắt xích cơ chế.
3. **Thanh lọc số liệu tự suy diễn (Fact-Check Filter)**:
   - Không bịa đặt số liệu thống kê không có nguồn kiểm chứng trong lời thoại. Nếu số liệu chưa có nguồn chính thống, chuyển thành từ định tính trung thực (*"phần lớn"*, *"đa số"*, *"nhiều trường hợp"*, *"thường"*).
4. **Brand & CTA theo từng dự án**:
   - Nếu `brand: "none"` (mặc định): Kết thúc bằng thông điệp đắt giá của bộ phim, không ép gắn thương hiệu hay CTA bán hàng.
   - Nếu `brand: "<id>"` (ví dụ `"tien-duong"`): Đọc `brand/<id>/profile.json` để đưa đúng thông tin thương hiệu, CTA chuẩn và tuân thủ `forbiddenCtaPatterns` của brand đó.
5. **Vệ sinh Markdown cho VieNeu-TTS**:
   - Cấm tuyệt đối đặt dòng kẻ ngang `---` bên dưới hoặc bên trong mục `# Narration` trong `script.md`.

---

## 🔒 GIAO THỨC CƯỠNG CHẾ 4 PHA TUẦN TỰ & PHÂN VAI MODEL TỐI ƯU QUOTA (ONE-PHASE-PER-TURN)

> **Quy tắc Báo Trước Model Cụ Thể (Mandatory Next-Model Banner)**: Vì mỗi lượt chạy (turn/task) trên Antigravity gắn với 1 model cố định, ở **cuối mỗi Pha**, AI **BẮT BUỘC** phải in hộp thông báo chỉ rõ **tên chính xác của Model** cần chọn cho Pha kế tiếp (`Gemini 4 Hydrogen (High)`, `Gemini 4 Argon (High)`, `Gemini 3.8 Flash (High)`, hoặc `Claude Sonnet 5.5 (High)` / `Claude Opus 5.5 (High)`).

### PHA 1 — CẤU HÌNH DỰ ÁN, KỊCH BẢN CHIỀU SÂU & ĐẠO DIỄN MỸ THUẬT · *[MODEL: 🧠 Gemini 4 Hydrogen (High/XHigh) hoặc Gemini 4 Argon (High)]* · *[CẤM GỌI TTS · CẤM VIẾT CODE]*
1. Tạo `projects/<id>/inputProps.json` (tự động đề xuất `targetScenes`, `targetDurationSec`, chốt `brand`, `voice`, `ttsSpeed`, `format`). Nếu Brief chưa nói rõ có dùng brand hay không, hỏi User hoặc để mặc định `"brand": "none"` và nêu rõ khi trình duyệt Gate 1.
2. Viết `projects/<id>/script.md` (mổ xẻ có chiều sâu bản chất, số cảnh và cấu trúc tự động theo ý tưởng, cấm đặt `---` dưới `# Narration`) và `projects/<id>/beats.json`.
3. Soạn `projects/<id>/creative-direction.md` và `projects/<id>/DESIGN.md` (bắt buộc có `:root` khóa bảng màu của dự án).
4. Ghi nhận `SCRIPT`, `BEATS` và **DỪNG LẠI** chờ User duyệt `GATE1` & `GATE2`.
5. **Bắt buộc báo trước ở cuối Pha 1**:
   > 🔔 **CHỌN MODEL CHO PHA 2 (Thu âm TTS & Chuẩn bị tài nguyên)**: Hãy chuyển sang **`Gemini 3.8 Flash (High)`** (chạy CLI/TTS siêu tốc & dùng bể quota hồi theo giờ) rồi nhắn *"Duyệt"*.

### PHA 2 — DUYỆT GATE, ĐO NHỊP VOICE 48kHz & DỌN TÀI NGUYÊN CỤC BỘ · *[MODEL: ⚡ Gemini 3.8 Flash (High)]* · *[CẤM VIẾT CODE ĐỒ HỌA Ở PHA NÀY]*
1. Khi User duyệt, chạy lệnh chốt `approve --gate GATE1`, `record --stage CREATIVE_DIRECTION`, `approve --gate GATE2`.
2. Chạy `node core/scripts/factory/index.js tts --project <id>` để sinh `assets/audio/narration.mp3` và `assets/audio/timing.json` theo đúng `voice` và `ttsSpeed` của dự án.
3. Chuẩn bị đầy đủ tài nguyên cục bộ (`assets/fonts/`, `assets/vendor/gsap.min.js`, và `assets/branding/` nếu dự án có brand).
4. Trích xuất bảng tra cứu từ ngữ gọn gàng (`[wordIdx] "word" (startSec -> endSec)`) từ `timing.json` lưu vào `projects/<id>/assets/audio/word-map.txt` (giúp tiết kiệm tối đa token đọc JSON ở Pha 3).
5. **DỪNG LẠI** báo cáo kết quả thu âm và **Bắt buộc báo trước ở cuối Pha 2**:
   > 🔔 **CHỌN MODEL CHO PHA 3 (Thiết kế Blueprint & Code Đồ họa SVG/GSAP)**: Hãy chuyển sang **`Claude Sonnet 5.5 (High)`** *(khuyên dùng chuẩn — tối ưu quota Claude)* hoặc **`Claude Opus 5.5 (High)`** *(nếu muốn đồ họa phức tạp kịch trần)* trước khi nhắn *"Chạy Pha 3"*!

### PHA 3 — BẢN VẼ KỸ THUẬT (`PRODUCTION-BLUEPRINT.md`), COMPILER (`build-index.cjs`) & KIỂM ĐỊNH LỚP 1 · *[MODEL: 🎨 Claude Sonnet 5.5 (High) / Claude Opus 5.5 (High)]* · *[CẤM RENDER MP4 Ở PHA NÀY]*
1. Đọc `DESIGN.md` và `assets/audio/word-map.txt` (cùng `timing.json`), xuất bản vẽ kỹ thuật `projects/<id>/PRODUCTION-BLUEPRINT.md` gồm 4 phần: (1) Word Map & `anchor(wordIdx, expectedWord)`; (2) Palette `:root` & Chất liệu/Không gian sống; (3) Kiến trúc DOM/SVG theo khổ hình `WIDTH×HEIGHT`; (4) Kịch bản GSAP gắn chặt vào `T(wordIndex)` và `E(wordIndex)`.
2. Viết trọn vẹn `projects/<id>/build-index.cjs` từ `PRODUCTION-BLUEPRINT.md` (Full Output Enforcement, cấm `TODO` hay viết tắt, đồ họa SVG/Canvas sống động và vật lý GSAP mượt mà).
3. Chạy `node projects/<id>/build-index.cjs` để sinh đồng bộ `index.html`, `specs/video-spec.json`, `storyboard.json`.
4. Chạy `npx hyperframes check projects/<id>` đạt **`0 error(s)`** và ghi nhận `STORYBOARD`, `VIDEO_SPEC`, `VALIDATION`, `PRODUCTION`.
5. **DỪNG LẠI** báo cáo hoàn tất bộ code đồ họa và **Bắt buộc báo trước ở cuối Pha 3**:
   > 🔔 **CHỌN MODEL CHO PHA 4 (Render MP4, Soi ảnh PNG & Hard QC)**: Hãy chuyển về **`Gemini 4 Hydrogen (High)`** *(hoặc **`Gemini 3.8 Flash (High)`** / **`Gemini 4 Argon (High)`**)* trước khi nhắn *"Chạy Pha 4"* để không tốn quota Claude khi đọc ảnh PNG!

### PHA 4 — RENDER FINAL, SOI TOÀN BỘ FRAME PNG THỰC TẾ (LỚP 2) & NGHIỆM THU HARD QC · *[MODEL: 👁️ Gemini 4 Hydrogen (High) / ⚡ Gemini 3.8 Flash (High) / 🧠 Gemini 4 Argon (High)]*
1. Khởi tạo `projects/<id>/qc.md` và chạy `npm run make -- --project <id>`.
2. Dùng `read_file` **soi trực tiếp toàn bộ các file PNG** trong `projects/<id>/output/storyboard-check/` (`frame_00_hook_0.30s.png` + đủ `N` frame đại diện từng cảnh `s1..sN`): kiểm tra Frame-0 Hook, không đè phụ đề `#subs`, không tràn chữ, không nhòe lớp cảnh cũ, và kiểm tra thẻ Outro (nếu có brand).
3. Khi đạt **22/22 E2E Hard QC Assertions PASS** và toàn bộ ảnh PNG hoàn hảo: ghi nhận `FINAL_QA --reviewed --artifact qc.md`, `DONE` và bàn giao `output/final.mp4`.

---

## LỆNH THƯỜNG DÙNG

- `npm run doctor` — kiểm tra sức khoẻ hệ thống (Voice Studio, HyperFrames, FFmpeg).
- `npm run services` — khởi động CIT Voice Studio.
- `npm run preview` — mở HyperFrames Studio preview.
- `npm run make -- --project <id>` — kiểm tra Gate 1/2 đã duyệt → TTS → render HyperFrames → verify (fail QC = dừng, không final).
- `npm run verify -- --project projects/<id>` — chạy bộ kiểm định E2E độc lập.
- `npx hyperframes check projects/<id>` — kiểm tra lỗi composition trước khi render.
