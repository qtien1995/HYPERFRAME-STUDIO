# BESPOKE CREATIVITY RULES — HYPERFRAME STUDIO V4 (MULTI-TOPIC · MULTI-STYLE)

---

## 1. TỰ DO NGÔN NGỮ THỊ GIÁC THEO CHỦ ĐỀ & CHỐNG AI SLOP

### 1.1. Chủ đề nào — Thế giới thị giác đó (Zero Forced Style)
1. **Không đóng khung vào một phong cách cố định**:
   - Mỗi chủ đề có một bầu không khí riêng: video về hố đen vũ trụ hay điều tra lịch sử có thể dùng nền tối điện ảnh sâu thẳm; video về kinh tế vĩ mô hay thể thao có thể dùng mảng màu mạnh Bauhaus/Swiss Grid; video kể chuyện văn hóa có thể dùng cắt dán collage; video phân tích tài liệu/hợp đồng có thể dùng bàn soi giấy sáng.
   - **Cấm thói quen mặc định quay về một bảng màu duy nhất** nếu chủ đề không cần. Trong Art Direction Sheet, Director bắt buộc trả lời: *"Tại sao ngôn ngữ thị giác này là lựa chọn đắt giá nhất cho chủ đề này?"*.
2. **Mỗi cảnh chỉ chứa DUY NHẤT 1 ẩn dụ thị giác trung tâm (Single Central Metaphor)**:
   - Không phân mảnh sự chú ý bằng nhiều đồ họa rời rạc. Một cơ chế chính xuất hiện, biến đổi hoặc vận động để kể trọn vẹn ý của cảnh đó.
   - Loại bỏ hoàn toàn tư duy thẻ card dashboard rẻ tiền (cấm `ring progress`, thanh tiến trình phẳng vô hồn, hoặc hộp bo góc chứa 1 icon đứng yên + chữ chạy bên dưới).
3. **Cấm nhồi nhét văn bản (Zero Text Overload)**:
   - Không bê nguyên đoạn văn dài lên màn hình. Văn bản bổ trợ chuyển thành vạch trừu tượng (skeleton lines) hoặc nhãn chú thích ngắn 2–5 từ.
4. **Cảnh 1 Đập Vào Phải Thu Hút (Frame-0 Impact & Hook Breakaway)**:
   - Tại `t = 0.0s`, vật thể trung tâm và tiêu đề Hook đã hiện diện ngay lập tức (cấm khởi đầu bằng màn hình trống rồi mới fade-in).
   - Cảnh 1 (`s1`) được phép phá cách bảng màu/tương phản (`--bg-hook`) để tạo cú hích thị giác ngay giây đầu tiên.

---

## 2. VẬT LÝ HỌC CHUYỂN ĐỘNG GSAP & ĐỒNG BỘ TỪNG TỪ (`T(wordIndex)`)

1. **Năng lực Easing Vật lý Chân thực**:
   - Nghiêm cấm dùng `ease: "power1.out"`, `ease: "power1.inOut"` hay `ease: "none"` / `linear` cho bất kỳ chuyển động chính nào.
   - **Va chạm, rơi, xuất hiện vật thể có khối lượng**: Dùng `ease: "back.out(1.7)"` hoặc `ease: "elastic.out(1, 0.5)"`.
   - **Quét, trượt, dẫn hướng tầm mắt**: Dùng `ease: "power2.inOut"` hoặc `ease: "expo.out"`.
2. **Khóa Toàn Bộ Chuyển Động Vào Hàm `T(wordIndex)` & `E(wordIndex)`**:
   - Cấm gán cứng giây ước lượng (`0.5s`, `1.2s`...). Toàn bộ timeline GSAP phải neo trực tiếp vào mảng timing từng từ `timing.json`.
3. **Không Gian Sống Liên Tục & Nhịp Máy Quay Điện Ảnh (`0 freeze events`)**:
   - Container `#cam` vận động đa hướng theo tâm lý từng cảnh (`punch-in`, `pull-back`, `pan-left`, `pan-right`, `breathe`) kết hợp cầu nối **Match-Cut** giữa các cảnh để tạo cảm giác liền mạch như xem một bộ phim.
   - Bắt buộc có chuyển động môi trường nền lặp hữu hạn (`Math.floor(TOTAL / cyc) - 1`) để toàn bộ video không có khung hình nào đứng yên quá 3 giây.
   - Nếu sử dụng hiệu ứng vẽ ngẫu nhiên (hạt, vân bề mặt, sao trời, nhiễu...), bắt buộc dùng hàm sinh số giả ngẫu nhiên có seed cố định (`rng(seed)`) để render tất định 100%.

---

## 3. HỢP ĐỒNG THIẾT KẾ (`DESIGN.md`) & THƯ VIỆN GỢI Ý (TÙY CHỌN)

Mỗi dự án ở Pha 1 phải xuất file `projects/<id>/DESIGN.md` (theo mẫu [`templates/design-systems/DESIGN-TEMPLATE.md`](file:///d:/AI/HYPERFRAME-STUDIO/templates/design-systems/DESIGN-TEMPLATE.md)) khóa cứng `:root` CSS Variables của riêng dự án đó.

Có thể tự sáng tạo mới 100% hoặc tham khảo các họ phong cách gợi ý trong `templates/design-systems/families/`:
- [`cinematic-dark-documentary.md`](file:///d:/AI/HYPERFRAME-STUDIO/templates/design-systems/families/cinematic-dark-documentary.md): Phim tài liệu điện ảnh tối, spotlight & rim light sắc lạnh (vũ trụ, điều tra, lịch sử, công nghệ lõi).
- [`kinetic-bold-color.md`](file:///d:/AI/HYPERFRAME-STUDIO/templates/design-systems/families/kinetic-bold-color.md): Động năng màu mạnh Swiss Grid / Bauhaus (kinh tế, thể thao, văn hóa đại chúng, marketing).
- [`paper-collage-cutout.md`](file:///d:/AI/HYPERFRAME-STUDIO/templates/design-systems/families/paper-collage-cutout.md): Cắt dán đa chất liệu thủ công (kể chuyện nhân vật, triết học, đời sống).
- [`editorial-ivory-paper.md`](file:///d:/AI/HYPERFRAME-STUDIO/templates/design-systems/families/editorial-ivory-paper.md), [`clinical-precision-teal.md`](file:///d:/AI/HYPERFRAME-STUDIO/templates/design-systems/families/clinical-precision-teal.md), [`architectural-blueprint-navy.md`](file:///d:/AI/HYPERFRAME-STUDIO/templates/design-systems/families/architectural-blueprint-navy.md): Phong cách hồ sơ in ấn, y khoa lâm sàng, bản vẽ kỹ thuật.

---

## 4. MẪU ART DIRECTION SHEET (Director điền trước mỗi video, User duyệt tại Gate 2 mới code)

```markdown
# ART DIRECTION SHEET — <tên video>

1. Cấu hình dự án (`inputProps.json`): <format: 9:16 | 16:9 | 1:1 · voice · ttsSpeed · brand: none | id>
2. Ngôn ngữ thị giác chọn cho chủ đề này & Lý do: <mô tả phong cách, bầu không khí và vì sao nó hợp nhất với chủ đề>
3. Ẩn dụ thị giác trung tâm (Single Central Metaphor): <hình tượng/cơ chế vật lý duy nhất sinh ra từ nội dung & cách nó biến đổi qua từng Hồi>
4. Palette (`:root`) & Chất liệu ánh sáng: <bảng mã màu HEX khóa cứng trong DESIGN.md, nguồn sáng và bề mặt không gian>
5. Nhịp máy quay `#cam` & Chuyển cảnh nối mạch (Match-Cut): <quy hoạch chuyển động máy quay theo tâm lý từng chặng + chuyển động môi trường chống đứng hình>
6. Kỷ luật GSAP Motion Physics: <va chạm/xuất hiện dùng back.out(1.7) hoặc elastic.out(1, 0.5), quét/trượt dùng power2.inOut hoặc expo.out, neo 100% vào T(wordIndex)>
7. Kỹ thuật HyperFrames & GSAP kết hợp (≥3): <SVG path draw, living diagram, mask/clip-path, 3D stage, canvas, kinetic typography...>
8. Điểm đột phá thị giác (Visual Breakthrough): <khoảnh khắc đắt giá nhất của video, tắt tiếng vẫn hiểu trọn thông điệp>
9. Phân cảnh dự kiến (N cảnh tự động đề xuất theo độ sâu ý tưởng): <liệt kê từng Cảnh giải phẫu cơ chế, Cảnh 1 Frame-0 Impact, và kết phim / Brand Outro nếu có brand>
User duyệt: ☐
```

---

## 5. CHECKLIST NGHIỆM THU TRƯỚC KHI RENDER

- ☐ **Gate 1 & Gate 2 Đã Duyệt**: Có `inputProps.json`, `script.md`, `creative-direction.md` và `DESIGN.md` đã được User duyệt thật.
- ☐ **Chiều sâu Nội dung & Ngôn ngữ thị giác khớp chủ đề**: Kịch bản giải phẫu tận gốc bản chất (không cưỡi ngựa xem hoa); bảng màu `:root` đạt độ tương phản dễ đọc (WCAG AA).
- ☐ **Cảnh 1 Frame-0 Impact**: Tại `t = 0.0s`, vật thể & tiêu đề Hook đã hiện diện ngay lập tức (không màn hình trống).
- ☐ **Số cảnh theo chiều sâu đề tài & Match-Cut**: Số cảnh tự động theo độ phức tạp của ý tưởng; có nối mạch Match-Cut và chuyển động `#cam` đa hướng.
- ☐ **Zero Cheap UI Widgets**: Không có `ring progress`, thanh tiến trình phẳng rẻ tiền, hay thẻ hộp chứa icon đứng yên.
- ☐ **GSAP Motion Physics & `T(wordIndex)`**: Dùng easing vật lý (`back.out(1.7)`, `elastic.out`, `power2.inOut`, `expo.out`); toàn bộ chuyển động neo vào `T(wordIndex)`.
- ☐ **Zero Dead Frame (`0 freeze events`)**: Không gian sân khấu vận động liên tục xuyên suốt mọi cảnh.
- ☐ **Kiểm định 2 Lớp Hoàn Hảo**: `npx hyperframes check` đạt `0 error(s)` và soi đủ `frame_00_hook_0.30s.png` + toàn bộ `N` frame PNG đại diện từng cảnh.
- ☐ **Brand (nếu khai báo)**: Nếu `brand != "none"`, thông tin và CTA khớp đúng `brand/<id>/profile.json`; nếu `brand: "none"`, kết phim tự nhiên không ép thương hiệu.
