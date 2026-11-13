# DESIGN.md — HYPERFRAME STUDIO V4 (SSOT MOTION & VISUAL SPECIFICATION · MULTI-TOPIC & MULTI-STYLE)

> **Single Source of Truth (SSOT)** khóa các chuẩn kỹ thuật cốt lõi về khung hình, chuyển động vật lý, chiều sâu lớp và đồng bộ âm thanh–hình ảnh cho hệ thống sản xuất video độc bản (HyperFrames Engine v0.9.15).
> Thẩm mỹ, bảng màu, chất liệu và bộ font **THEO TỪNG VIDEO** được định nghĩa tự do trong `projects/<id>/DESIGN.md` (Design Contract) và thư viện tham khảo `templates/design-systems/families/*.md`.
> Hỗ trợ đa tỉ lệ khung hình qua `projects/<id>/inputProps.json`: **`9:16` (`1080 × 1920`, mặc định)** · **`16:9` (`1920 × 1080`)** · **`1:1` (`1080 × 1080`)** @ 30fps.

---

## 1. TỰ DO THẨM MỸ THEO ĐỀ TÀI & CHỐNG AI SLOP (MULTI-STYLE FREEDOM)

- **Tự do chọn hệ màu & phong cách theo cảm xúc chủ đề**:
  - **Light Editorial / Tactile Paper**: Giấy ngà `#F4EFE6`, trắng ấm `#FAF7F2`, mực graphite `#1F1D1A` (phù hợp tài chính, luật, giải thích chuyên sâu).
  - **Cinematic Dark Documentary**: Nền tối điện ảnh `#0B0E14`, spotlight có hướng, vàng hổ phách `#F59E0B` (phù hợp lịch sử, vũ trụ, điều tra, công nghệ sâu).
  - **Kinetic Bold Color**: Tương phản khối màu mạnh `#F4F0EA` / `#FF4D00` / `#0057FF` (phù hợp sáng tạo, thể thao, văn hóa đại chúng).
  - **Paper Collage & Cutout / Blueprint**: Cắt dán thủ công hoặc bản vẽ kỹ thuật cơ khí.
- **Đặc quyền Phá Cách & Frame-0 Impact cho Cảnh 1 (`--bg-hook`)**:
  - Cảnh 1 (`s1`, 0–3 giây đầu) được phép dùng bảng màu tương phản gắt (`--bg-hook` / `--ink-hook`) để giữ chân người xem ngay lập tức.
  - Tại `t = 0.0s` (Frame 0) và `t = 0.30s`, hình tượng trung tâm và tiêu đề Hook phải hiện diện ngay trên sân khấu (cấm khởi đầu bằng màn hình trống).
- **Anti-AI Slop Blacklist (Cấm tuyệt đối ở mọi chủ đề)**:
  - ❌ Cấm gradient tím/hồng mặc định vô nghĩa (`linear-gradient(135deg, #6366f1, #a855f7)`).
  - ❌ Cấm vòng tròn phần trăm (`ring progress`), thanh tiến trình phẳng vô hồn hoặc lạm dụng thẻ card/hộp quá 30% thời lượng video.

---

## 2. KHUNG HÌNH & VÙNG AN TOÀN ĐA TỈ LỆ

### 2.1. Thông số cơ bản (đọc từ `projects/<id>/inputProps.json`)
- **`9:16` (Mặc định Shorts/Reels/TikTok)**: `1080 × 1920 px` (`Center X = 540px`).
- **`16:9` (YouTube / Landscape Presentation)**: `1920 × 1080 px` (`Center X = 960px`).
- **`1:1` (Square Feed / Carousel Video)**: `1080 × 1080 px` (`Center X = 540px`).
- **Frame rate**: `30 fps` · **Color space**: `sRGB` · **Box-sizing**: `border-box`.

### 2.2. Vùng an toàn tham chiếu (`9:16` — `1080 × 1920`)
| Khu vực | Tọa độ | Mục đích |
| :--- | :--- | :--- |
| **Top Safe** | `y: 0 → 120` | Tránh status bar, tai thỏ, dynamic island. Cấm đặt tiêu đề/avatar. |
| **Bottom Safe** | `y: 1720 → 1920` | Tránh thanh điều hướng & UI tương tác TikTok/Reels. Cấm đặt phụ đề/logo. |
| **Vùng nội dung** | `y: 130 → 1650` | Phân bố cân bằng, không dồn đỉnh, không bỏ trống nửa dưới. |
| **Neo phụ đề Karaoke** | `bottom: 185px` (9:16) / `bottom: 84px` (16:9, 1:1) | Cố định giữa các cảnh, không nhảy vị trí. |

---

## 3. HỆ THỐNG LỚP CHIỀU SÂU (3 LỚP VẬT LÝ + OVERLAY)

```
[Overlay]    Phụ đề Karaoke (#subs) + Global VFX (ánh sáng, vignette, hạt môi trường #dust)
[Foreground] z-index: 30-39 — Ánh sáng, kính quang học, tia quét, con dấu nổi
[Midground]  z-index: 20-29 — Cơ chế sống trung tâm (Living Diagram / Evolving Metaphor)
[Background] z-index: 0-19  — Chất liệu bề mặt (Procedural Canvas / SVG Grid) + chữ ma chìm
```

- **Background**: bề mặt vật lý hoặc không gian khí quyển (vẽ tất định seek-safe), chữ ẩn mờ (ghosted marginalia opacity 0.2–0.35).
- **Midground**: DUY NHẤT 1 ẩn dụ thị giác trung tâm tự vận động mỗi cảnh.
- **Foreground**: ánh sáng có hướng, kính quang học hoặc lớp tương tác vật lý.
- **Overlay**: phụ đề Karaoke đọc rõ trên mọi nền cảnh.

---

## 4. CHẤT LIỆU CÓ CHIỀU SÂU & KHÔNG GIAN SỐNG LIÊN TỤC

### 4.1. Bề mặt tất định (`rng(seed)` / SVG Pattern)
- Mọi bề mặt procedural trên `canvas#bg-canvas` phải dùng hàm sinh số giả ngẫu nhiên có seed cố định (`rng(seed)`) để đảm bảo tính tất định tuyệt đối khi render từng frame (seek-safe).

### 4.2. Không gian sống liên tục (Zero Dead Frame) & Camera Đa Hướng
- Lớp hạt môi trường (`#dust .mote`) trôi nhẹ liên tục trong luồng sáng.
- Sân khấu `#cam` vận động đa hướng theo tâm lý từng cảnh (`punch-in`, `pull-back`, `pan-left`, `pan-right`, `breathe`) và nối mạch Match-Cut giữa các cảnh `s1..sN`.
- Đạt tuyệt đối **`0 freeze events`** (không đứng hình quá 3 giây).

---

## 5. VẬT LÝ CHUYỂN ĐỘNG GSAP (MOTION PHYSICS & WORD-SYNC MANDATE)

### 5.1. Kỷ luật Easing vật lý chân thực
| Loại chuyển động | Ease bắt buộc |
| :--- | :--- |
| Rơi, đập, xuất hiện vật thể (con dấu, ổ khóa, vật thể nảy) | `back.out(1.7)` hoặc `elastic.out(1, 0.5)` |
| Quét bút dạ quang, trượt kính lúp, rà thước đo, cắt khối | `power2.inOut` hoặc `expo.out` |
| Nhảy từng chữ Karaoke | `back.out(3)` |
| Trôi dạt / ánh sáng / nhịp thở `#cam` | `sine.inOut` |
| ❌ CẤM | `power1.out`, `power1.inOut`, `none`, `linear` cho chuyển động chính |

### 5.2. Khóa timeline vào hàm `T(wordIndex)` / `E(wordIndex)`
- CẤM gán cứng giây ước lượng (`0.5s`, `1.2s`...). Mọi tween GSAP neo vào mili-giây từ ngữ trong `timing.json`:
  - `T(i)` = `words[i].startMs / 1000`, `E(i)` = `(words[i].startMs + words[i].durationMs) / 1000`.
- Lọc bỏ token `---`; khóa mốc chuyển cảnh bằng `anchor(idx, expectedWord)`.

---

## 6. TYPOGRAPHY & PHỤ ĐỀ KARAOKE

### 6.1. Typography tự do theo chủ đề
- Được tự do chọn bộ font phù hợp với chủ đề (Editorial Serif, Geometric Sans, Brutalist Display, Monospace...), miễn là **nhúng `@font-face` cục bộ** từ `assets/fonts/` (mặc định có sẵn `Be Vietnam Pro`).
- **Số liệu** bắt buộc `font-variant-numeric: tabular-nums`.
- ❌ Cấm cắt chữ (`overflow:hidden`/`ellipsis`), cấm co chữ, cấm render khung rỗng.

### 6.2. Phụ đề Karaoke
- Từng từ bọc `span.sub-word`: `display:inline-block; margin:0 5px; transform-origin:50% 80%`.
- Tắt dòng cũ tại `W[SUB[li+1][0]].s - 0.04` (chống `content_overlap`).
- Từ đang đọc: `scale: 1.18`, `y: -6px`, màu nhấn tương phản cao (`back.out(3)`).

---

## 7. CẤU HÌNH THƯƠNG HIỆU TÙY CHỌN (PER-PROJECT BRAND PROFILE)

- Quản lý qua trường `"brand"` trong `projects/<id>/inputProps.json`:
  - **`"brand": "none"` (Mặc định)**: Video thuần nội dung/kể chuyện độc lập, không ép chèn thẻ Brand Outro hay CTA thương hiệu; cảnh cuối (`sN`) kết thúc bằng bài học đúc kết hoặc câu hỏi mở.
  - **`"brand": "<brand-id>"` (ví dụ `"tien-duong"`)**: Nạp cấu hình từ `brand/<brand-id>/profile.json`. Thẻ `#o-card` căn giữa theo `WIDTH / 2`, tuân thủ CTA chuẩn của hồ sơ thương hiệu đó.

---

## 8. ÂM THANH (EBU R128 · ZERO-SFX)

- **Giọng đọc**: CIT Voice Studio (VieNeu-TTS local `:8001`, 48kHz), chọn giọng qua trường `"voice"` trong `inputProps.json` (mặc định `"Hải Đăng"`).
- **Chuẩn đo**:
  - `Integrated Loudness`: **-14.0 → -12.0 LUFS** (target -12.5).
  - `True Peak`: **< -1.0 dBFS**.
  - `Loudness Range (LRA)`: **< 8.0 LU**.
- **Zero-SFX**: cấm SFX lấn giọng; BGM nền (nếu có) -18 → -22dB.

---

## 9. QUY TRÌNH & CỔNG (THAM CHIẾU)

Tuân thủ nghiêm ngặt **4 Pha tuần tự** và **Hard Gates** trong [`AGENTS.md`](file:///d:/AI/HYPERFRAME-STUDIO/AGENTS.md):
- Pha 1: `script.md` (chiều sâu bản chất, số cảnh & thời lượng tự động theo ý tưởng), `beats.json`, `inputProps.json`, `creative-direction.md`, `DESIGN.md` → Gate 1 & Gate 2.
- Pha 2: `assets/audio/narration.mp3` + `timing.json`, `PRODUCTION-BLUEPRINT.md` → Hard Stop.
- Pha 3: `build-index.cjs` → `index.html` + `specs/video-spec.json` + `storyboard.json`; `hyperframes check` 0 errors.
- Pha 4: `qc.md`, render `output/final.mp4`, soi `frame_00_hook_0.30s.png` + `N` frame PNG, 22 cổng QC.

---

## 10. TÀI LIỆU THAM CHIẾU

- [`AGENTS.md`](file:///d:/AI/HYPERFRAME-STUDIO/AGENTS.md) — luật tối cao + 4 pha + QC.
- [`brand/README.md`](file:///d:/AI/HYPERFRAME-STUDIO/brand/README.md) — hướng dẫn cấu hình Brand Profile theo dự án.
- [`rules/bespoke-creativity.md`](file:///d:/AI/HYPERFRAME-STUDIO/rules/bespoke-creativity.md) — Art Direction Sheet + checklist chống rập khuôn.
- [`rules/visual-storytelling.md`](file:///d:/AI/HYPERFRAME-STUDIO/rules/visual-storytelling.md) — safe zones đa tỉ lệ, typography, compiler, phụ đề.
- [`templates/design-systems/DESIGN-TEMPLATE.md`](file:///d:/AI/HYPERFRAME-STUDIO/templates/design-systems/DESIGN-TEMPLATE.md) — khuôn Design Contract cho mỗi video.
- `templates/design-systems/families/*.md` — thư viện Aesthetic Family tham khảo (Light Editorial, Dark Documentary, Kinetic Bold, Paper Collage, Blueprint...).
- `projects/<id>/DESIGN.md` — hợp đồng thiết kế riêng của từng video.
