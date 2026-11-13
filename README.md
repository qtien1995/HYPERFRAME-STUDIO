# HyperFrame Studio V4

**Multi-Topic · Pure Bespoke Motion Video Production Workspace**

Hệ thống sản xuất video chuyển động độc bản (Pure Bespoke) đa chủ đề, đa tỉ lệ khung hình (`9:16`, `16:9`, `1:1`) bằng **HyperFrames CLI** (`^0.9.15`), **GSAP Timelines** và trình biên dịch **`build-index.cjs`** (HTML, SVG, Procedural Canvas 2D/3D), đồng bộ từng từ với giọng đọc **CIT Voice Studio (VieNeu-TTS 48kHz)**.

---

## Kiến trúc & Triết lý cốt lõi

1. **Pure Bespoke (Độc bản theo chủ đề)**: Mỗi dự án tự định nghĩa ngôn ngữ thị giác, bảng màu `:root`, ẩn dụ trung tâm và hệ thống chuyển động riêng trong `DESIGN.md` và `creative-direction.md` — không ép vào một template cố định.
2. **Word-Level Motion Sync (`T(wordIndex)` & `E(wordIndex)`)**: Mọi tween GSAP đều neo vào mốc thời gian mili-giây thực tế của từng từ trong `assets/audio/timing.json` (đo bằng `ffprobe`).
3. **Cưỡng chế 4 Pha & Cổng duyệt (Gate 1 / Gate 2)**: Máy trạng thái tại [`core/scripts/factory/index.js`](core/scripts/factory/index.js) kiểm soát tiến độ qua từng pha, cấm bỏ qua duyệt kịch bản, art direction hoặc bản vẽ kỹ thuật `PRODUCTION-BLUEPRINT.md`.
4. **Nghiệm thu E2E 4 tầng**: Mọi video đầu ra (`output/final.mp4`) phải vượt qua bộ kiểm định [`tests/e2e/test_final_video.cjs`](tests/e2e/test_final_video.cjs) (container, codec, 30fps, EBU R128 `-14` đến `-12 LUFS`, `0 freeze events`, đồng bộ A/V & phụ đề, decode toàn luồng).

---

## Yêu cầu môi trường & Cài đặt

### Thành phần cần thiết
- **Node.js** (ESM enabled) & npm
- **FFmpeg & FFprobe**: đặt tại `.tools/ffmpeg/ffmpeg-9.0.2-full_build/bin/` hoặc có sẵn trong `PATH`
- **CIT Voice Studio (VieNeu-TTS local)**: chạy tại `http://127.0.0.1:8001` để tạo voiceover 48kHz và trích xuất word boundaries

### Cài đặt & Kiểm tra sức khỏe hệ thống

```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi động dịch vụ nền (CIT Voice Studio trên Windows)
npm run services

# 3. Kiểm tra toàn bộ môi trường (HyperFrames CLI, CIT Voice Studio :8001, FFmpeg/FFprobe, Node.js)
npm run doctor
```

---

## Quy trình sản xuất 4 Pha (Factory Pipeline)

### Pha 1 — Cấu hình, Kịch bản chiều sâu & Đạo diễn mỹ thuật
- Tạo `projects/<id>/inputProps.json`, `script.md`, `beats.json`, `creative-direction.md` và `DESIGN.md` (bắt buộc khai báo bảng màu `:root`).
- Dừng chờ người dùng duyệt **Gate 1** (kịch bản) và **Gate 2** (hướng mỹ thuật & `DESIGN.md`).

```bash
node core/scripts/factory/index.js approve --project <id> --gate GATE1 --evidence "User approved"
node core/scripts/factory/index.js record --project <id> --stage CREATIVE_DIRECTION
node core/scripts/factory/index.js approve --project <id> --gate GATE2 --evidence "User approved"
```

### Pha 2 — Thu âm TTS 48kHz & Chuẩn bị tài nguyên
- Gọi CIT Voice Studio (`:8001`) sinh `assets/audio/narration.mp3`, `assets/audio/timing.json` và trích xuất `word-map.txt`.

```bash
node core/scripts/factory/index.js tts --project <id>
```

### Pha 3 — Bản vẽ kỹ thuật, Biên dịch & Kiểm định Lớp 1
- Xuất `projects/<id>/PRODUCTION-BLUEPRINT.md` (gồm `anchor()`, `T(wordIndex)`, `:root` palette, kiến trúc DOM/SVG).
- Viết `projects/<id>/build-index.cjs` (Full Output, không chứa `TODO`/placeholder) và chạy để sinh `index.html`, `specs/video-spec.json`, `storyboard.json`.
- Kiểm tra composition:

```bash
node projects/<id>/build-index.cjs
npx hyperframes check projects/<id>
```

### Pha 4 — Render Final, Soi Frame PNG & Hard QC
- Chạy pipeline đóng gói và render:

```bash
npm run make -- --project <id>
```

- Soi toàn bộ ảnh kiểm tra trong `projects/<id>/output/storyboard-check/` (`frame_00_hook_0.30s.png` và các frame đại diện từng cảnh).
- Xác nhận đạt kiểm định E2E và ghi nhận hoàn tất:

```bash
npm run verify -- --project projects/<id>
node core/scripts/factory/index.js record --project <id> --stage FINAL_QA --reviewed --artifact qc.md
```

---

## Cấu hình dự án & Brand Profile

### `projects/<id>/inputProps.json`
Đọc tự động bởi [`core/scripts/factory/project-config.js`](core/scripts/factory/project-config.js):

| Trường | Mặc định | Mô tả |
| :--- | :--- | :--- |
| `brand` | `"none"` | `"none"` (không gắn thương hiệu/outro) hoặc ID thư mục trong `brand/<id>/` (vd: `"tien-duong"`) |
| `voice` | `"Hải Đăng"` | Tên giọng đọc trong CIT Voice Studio (`:8001`) |
| `ttsSpeed` | `1.0` | Tốc độ đọc (vd: `0.95`, `1.0`, `1.05`) |
| `format` | `"9:16"` | `"9:16"` (`1080x1920`), `"16:9"` (`1920x1080`), `"1:1"` (`1080x1080`) |
| `targetScenes` | Tự đề xuất | Số cảnh mục tiêu của dự án |
| `targetDurationSec` | Tự đề xuất | Thời lượng dự kiến (giây) |

### Brand Profile (`brand/<id>/profile.json`)
Xem hướng dẫn chi tiết tại [`brand/README.md`](brand/README.md). Hỗ trợ cấu hình `creatorName`, `title`, `company`, `brandName`, `cta`, `forbiddenCtaPatterns`, `logo`, `hashtags`, `outro`. Hiện có sẵn hồ sơ mẫu `brand/tien-duong/`.

---

## Các lệnh NPM & Factory CLI

| Lệnh | Chức năng |
| :--- | :--- |
| `npm run doctor` / `npm run check` | Kiểm tra HyperFrames CLI, CIT Voice Studio `:8001`, FFmpeg/FFprobe và Node.js |
| `npm run services` | Chạy script khởi động CIT Voice Studio (`core/scripts/factory/start-services.ps1`) |
| `npm run preview` | Mở HyperFrames Studio preview (`hyperframes preview`) |
| `npm run make -- --project <id>` | Chạy pipeline sản xuất end-to-end (Gate check → TTS → Render → Verify) |
| `npm run verify -- --project projects/<id>` | Chạy bộ kiểm định E2E 4 tầng (`tests/e2e/test_final_video.cjs`) |
| `npm run test` | Chạy unit test cho factory (`node --test core/tests/factory.test.js`) |
| `npm run clean` | Dọn dẹp file tạm (`core/scripts/factory/clean.js`) |
| `npm run audit:code` | Kiểm tra dead code & duplicate code (`knip` + `jscpd`) |
| `npm run factory -- <subcommand>` | Truy cập trực tiếp Factory CLI (`status`, `next`, `approve`, `record`, `tts`, `render`, `package`, `dirty`) |

---

## Cấu trúc thư mục

```text
HYPERFRAME-STUDIO/
├── AGENTS.md                   # Đặc tả vận hành & kỷ luật 4 Pha của HyperFrame Studio V4
├── DESIGN.md                   # Design system tham chiếu toàn cục
├── package.json                # Scripts & dependencies (hyperframes, minimist, zod)
├── .agents/skills/             # Bộ kỹ năng chuyên biệt (hyperframes, cit-voice-studio, bespoke-video-production, content-studio...)
├── assets/                     # Tài nguyên dùng chung (fonts cục bộ, vendor JS)
├── brand/                      # Hồ sơ thương hiệu cắm-rút theo từng dự án (vd: tien-duong)
├── core/                       # Lõi engine: factory CLI, render, tts, validate, timing, schemas, tests
├── projects/                   # Thư mục các dự án video (kịch bản, blueprint, build-index.cjs, assets)
├── prompts/                    # Bộ prompt vai trò (Story Director, Creative Director, Hook Crafter, Production Agent)
├── rules/                      # Luật sáng tạo độc bản & kể chuyện thị giác
├── templates/                  # Hệ thống thiết kế tham khảo (architectural, cinematic, editorial, paper-collage...)
└── tests/e2e/                  # Bộ kiểm định Hard QC đầu ra cuối cùng (test_final_video.cjs)
```

---

## Dự án mẫu trong Workspace

- [`projects/gia-han-60-ngay/`](projects/gia-han-60-ngay/inputProps.json) — *Gia Hạn 60 Ngày & Khôi Phục Hợp Đồng 2 Năm* (`9:16`, 8 cảnh, brand `tien-duong`)
- [`projects/nguon-goc-bao-hiem/`](projects/nguon-goc-bao-hiem/inputProps.json) — *Thủy Tổ Bảo Hiểm Bắt Nguồn Từ Đâu?* (`9:16`, 13 cảnh, brand `tien-duong`)
- [`projects/quy-trinh-lam-hdbh/`](projects/quy-trinh-lam-hdbh/inputProps.json) — *Quy Trình Từng Bước Để Làm 1 Hợp Đồng Bảo Hiểm* (`9:16`, 10 cảnh, `brand: "none"`)

> Lưu ý: Thư mục `projects/**/output/` (video render `final.mp4`, `dist/`, `storyboard-check/`), `.hyperframes/`, `.tools/` và `node_modules/` được loại trừ khỏi Git qua [`.gitignore`](.gitignore) để giữ repository gọn nhẹ.
