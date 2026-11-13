# HỆ THỐNG PROMPTS ĐẠO DIỄN & SẢN XUẤT VIDEO (HYPERFRAME STUDIO V4 — MULTI-TOPIC BESPOKE ENGINE)

Hệ thống prompt tiêu chuẩn của HyperFrame Studio V4 (Multi-Topic & Multi-Style Bespoke Engine), định hình vai trò các Agent sản xuất video độc bản ở bất kỳ chủ đề nào bằng **HyperFrames CLI + GSAP Timelines + trình sinh mã `build-index.cjs`**, triệt tiêu hoàn toàn khuôn mẫu rẻ tiền và đảm bảo chất lượng hình ảnh - âm thanh đạt chuẩn phát sóng.

---

## 1. Cấu trúc thư mục Prompts

```text
prompts/
├── story-director.md      # Bộ não Biên kịch: Chiều sâu bản chất (First-Principles), tự đề xuất số cảnh & cấu trúc theo ý tưởng (Gate 1)
├── creative-director.md   # Đạo diễn Mỹ thuật & Cơ chế Sống: Tự do phong cách theo đề tài, Frame-0 Hook, DESIGN.md (Gate 2)
├── video-personas.md      # Danh mục Role-Playing Personas chuyên sâu cho từng thể loại video
├── hook-crafter.md        # 5 Công thức chế tác Hook 3s đầu viral + Frame-0 Visual Impact
└── production-agent.md    # Kiến trúc Compiler build-index.cjs: Đa tỉ lệ khung hình, Neo timing T(wordIndex) (Pha 3 & Pha 4)
```

---

## 2. Quy trình ứng dụng trong Pipeline Sản xuất (Giao thức Cưỡng chế 4 Pha Tuần tự)

```text
1. Ý tưởng / Đề tài từ người dùng + Cấu hình dự án (inputProps.json: format, voice, brand)
   ↓
2. PHA 1 — Story Director & Creative Director (prompts/story-director.md + creative-director.md)
   ├─ Chọn Persona chuyên môn phù hợp từ: prompts/video-personas.md
   ├─ Mổ xẻ chiều sâu bản chất (cấm cưỡi ngựa xem hoa), tự đề xuất số cảnh & thời lượng theo độ lớn của ý tưởng
   ├─ Thanh lọc số liệu không nguồn (Fact-Check Filter), khai báo inputProps.json & vệ sinh Markdown (không đặt '---' dưới # Narration)
   ├─ Xuất script.md, beats.json, inputProps.json, creative-direction.md và DESIGN.md (tự do phong cách theo đề tài)
   └─ DỪNG LẠI trình User phê duyệt GATE 1 & GATE 2 (CẤM FAST-TRACK, CẤM GỌI TTS, CẤM VIẾT CODE)
   ↓
3. PHA 2 — Đo nhịp Voice & Bản vẽ Kỹ thuật (PRODUCTION-BLUEPRINT.md)
   ├─ Tạo giọng đọc CIT Voice Studio theo inputProps.json (48kHz, trích xuất timing.json)
   ├─ Chuẩn bị tài nguyên nội bộ (assets/fonts, assets/vendor/gsap.min.js, assets/branding nếu có brand)
   ├─ Xuất PRODUCTION-BLUEPRINT.md đầy đủ 4 phần (Word Map/anchor, :root + Texture/Surface, DOM/SVG, GSAP T(i))
   └─ DỪNG LẠI báo cáo Blueprint trước khi viết code (CẤM VIẾT build-index.cjs CÙNG LƯỢT)
   ↓
4. PHA 3 — Lắp ráp Compiler & Kiểm định Lớp 1 (prompts/production-agent.md)
   ├─ Viết trình sinh mã projects/<id>/build-index.cjs đọc trực tiếp timing.json (anchor + T(wordIndex))
   ├─ Tự động sinh đồng bộ index.html, specs/video-spec.json, storyboard.json (N cảnh theo kịch bản)
   └─ Kiểm định Lớp 1: npx hyperframes check (bắt buộc 0 errors) ➔ Ghi nhận PRODUCTION
   ↓
5. PHA 4 — Render Final, Kiểm định Lớp 2 (Hook 0.30s + N Frame PNG) & 22 Cổng E2E Hard QC
   ├─ Chạy npm run make -- --project <id>
   ├─ Kiểm định Lớp 2: Mở và soi trực tiếp frame_00_hook_0.30s.png + toàn bộ N ảnh PNG trong output/storyboard-check/
   └─ Đạt 22/22 E2E Hard QC Assertions (-14 đến -12 LUFS, 0 freeze events) ➔ Nghiệm thu DONE
```
