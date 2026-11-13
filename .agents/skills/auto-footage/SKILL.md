---
name: auto-footage
description: "Tự động biên tập video quay sẵn (raw footage/talking-head) chuyên nghiệp trên HyperFrames Studio V4: tự động cắt lọc khoảng lặng (jump-cut), tách nền người nói bằng AI (Cutout Matting) để người nổi trước đồ họa, phụ đề động highlight từng từ (Karaoke-style), tự động nhận diện từ khóa để bật logo/thẻ số liệu (Keyword Mapping), chèn hiệu ứng vẽ tay SVG (HandDrawn Circle/Underline), và cân bằng âm thanh chuẩn EBU R128."
---

# Auto Footage & Talking-Head Studio (HyperFrames V4)

Quy trình tự động hóa toàn diện cho video người nói trước camera (vlog, phân tích chuyên sâu, chia sẻ chuyên gia) kết hợp trực tiếp với **HyperFrames CLI + GSAP Timelines (`build-index.cjs`)**.

---

## 🚀 Các Năng Lực Cốt Lõi

1. **AI Video Matting (Tách nền người nói)**: Dùng mô hình RVM (`core/scripts/footage/cutout.py`) bóc tách người nói thành video WebM trong suốt (`speaker_alpha.webm`). Cho phép người nói đứng đè lên các sơ đồ cơ chế sống (Living Mechanisms) hoặc Procedural Canvas trong HyperFrames.
2. **Hiệu ứng Vẽ tay SVG & GSAP (`strokeDashoffset`)**: Khoanh tròn hữu cơ, gạch chân uốn lượn, vệt bút dạ quang (`mix-blend-mode: multiply`) và mũi tên chỉ trỏ được điều khiển trực tiếp bằng GSAP theo `T(wordIndex)`.
3. **Keyword-to-Asset Mapping**: Tự động quét từ khóa trọng tâm (thuật ngữ, số liệu, cột mốc, thương hiệu) từ `timing.json` để gợi ý điểm neo đồ họa (`core/scripts/footage/keyword-mapper.js`).
4. **Silence Cut & Word-Synced Karaoke Subs**: Cắt khoảng lặng chính xác, tạo phụ đề Karaoke 9–10 từ/dòng chuẩn nhịp giọng nói.

---

## 🛠️ Quy Trình Xử Lý 6 Bước Chuẩn (SOP)

### Bước 1: Khởi tạo Project trong `projects/<id>/`
- Tạo thư mục `projects/<id>/` và cấu hình `inputProps.json` (`format`: `"9:16"` / `"16:9"` / `"1:1"`, `brand`: `"none"` hoặc `<brand-id>`).
- Đưa video gốc vào thư mục dự án: `projects/<id>/assets/raw-footage.mp4`.

### Bước 2: Tự động Lọc khoảng lặng (Jump-Cut)
- Sử dụng FFmpeg `silencedetect` để phát hiện và cắt khoảng ngập ngừng:
  ```bash
  ffmpeg -i projects/<id>/assets/raw-footage.mp4 -af silencedetect=noise=-30dB:d=0.45 -f null -
  ```

### Bước 3: Tách Nền Người Nói AI (Tùy chọn Chế độ Nổi trước Đồ Họa)
- Nếu kịch bản yêu cầu người nói nổi trên không gian đồ họa động hoặc sơ đồ cơ chế sống:
  ```bash
  python core/scripts/footage/cutout.py projects/<id>/assets/raw-footage.mp4 projects/<id>/assets/cutout/ --format webm --ratio 0.4
  ```
- Kết quả tạo ra `projects/<id>/assets/cutout/speaker_alpha.webm` (video kênh alpha trong suốt).
- Trong `index.html` (sinh từ `build-index.cjs`), nhúng theo chuẩn HyperFrames:
  ```html
  <video class="clip" src="assets/cutout/speaker_alpha.webm" muted data-start="0" data-duration="60" data-track-index="2" style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); z-index:25;"></video>
  ```

### Bước 4: Nhận Diện Từ Khóa & Tạo Plan Hiển Thị (Keyword Mapping)
- Chạy mapper trên `timing.json` để tự động gợi ý các điểm rơi đồ họa:
  ```bash
  node core/scripts/footage/keyword-mapper.js projects/<id>/assets/audio/timing.json projects/<id>/assets/overlays_plan.json
  ```

### Bước 5: Chèn SVG Vẽ Tay & Sơ Đồ Cơ Chế Sống Trong `build-index.cjs`
- Dùng inline SVG + GSAP timeline neo vào `T(wordIndex)` với easing vật lý (`back.out(1.7)`, `elastic.out(1, 0.5)`, `power2.inOut`, `expo.out`):
  - **Khoanh tròn từ khóa**: SVG `<path>` vẽ nét bằng `strokeDashoffset` tại `T(wordIndex)`.
  - **Vệt highlight dạ quang**: `<rect>` hoặc `<span class="hl">` mở rộng `scaleX: 0 -> 1` (`transformOrigin: "0% 50%"`, `ease: "power2.inOut"`).
  - **Con dấu / Nhãn số liệu**: Bật nảy với `ease: "back.out(1.7)"` và `font-variant-numeric: tabular-nums`.

### Bước 6: Hoàn Tất Render & Kiểm Định E2E Hard QC
- Biên dịch `node projects/<id>/build-index.cjs` và kiểm tra `npx hyperframes check projects/<id>` đạt `0 error(s)`.
- Chạy `npm run make -- --project <id>` để xuất `output/final.mp4` đạt chuẩn:
  - Khổ hình khớp `inputProps.json` (`9:16` / `16:9` / `1:1`), 30fps, H.264 + AAC 48kHz.
  - Loudness EBU R128: **-14.0 đến -12.0 LUFS; True Peak < -1.0 dBFS; LRA < 8.0 LU**.
  - Không đứng hình quá 3 giây (`0 freeze events`).
