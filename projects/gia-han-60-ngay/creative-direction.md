# ART DIRECTION SHEET — Gia Hạn 60 Ngày & Khôi Phục Hợp Đồng 2 Năm

## 1. Ẩn dụ thị giác trung tâm (Single Central Metaphor)
- **Hình tượng trung tâm**: **Thước Đo Trục Thời Gian Cơ Học & Cổng Khóa Hiệu Lực (The Chronometer Track & Policy Lock Gate)** trên bàn vẽ kỹ thuật sáng sủa.
- **Sự chuyển hóa xuyên suốt qua 8 cảnh**:
  - **Cảnh 1**: Phá bỏ định kiến "trễ 1 ngày = mất sạch" bằng nét gạch đỏ dứt khoát, mở ra thước đo trục thời gian với 2 điểm neo: `60 NGÀY` và `2 NĂM`.
  - **Cảnh 2**: Thanh trượt cơ học mở rộng vùng đệm `01 → 60 NGÀY` bằng vệt dạ quang vàng ấm `#FDE047` (2 tháng xoay xở).
  - **Cảnh 3**: Bên trong vùng đệm 60 ngày, khiên bảo vệ Manulife `#00A758` sáng vững, thanh chi trả tự động trừ phần phí nợ và con dấu **"VẪN BẢO VỆ"** dập nảy mặt giấy (`back.out(1.7)`).
  - **Cảnh 4**: Kim chạm vạch đỏ `NGÀY 61` — chốt khóa cơ học sập ngàm (`elastic.out(1, 0.5)`), màn kính mờ băng giá phủ kín khiên bảo vệ thành trạng thái **"TẠM ĐÓNG BĂNG"**.
  - **Cảnh 5**: Thước đo thu phóng sang tỷ lệ `24 THÁNG (2 NĂM)` — giữ lại đường mạch hợp đồng cũ với mức phí nhẹ hơn so với cột mua mới theo tuổi.
  - **Cảnh 6**: Để mở lại cổng khóa sau ngày 60, 3 cơ cấu kiểm định tuần tự trượt vào rãnh: (1) Đóng bù phí, (2) Kính lúp quang học soi lại hồ sơ sức khỏe, (3) Kim đồng hồ đặt lại thời gian chờ.
  - **Cảnh 7**: Kính lúp rà trúng biến động sức khỏe mới, con dấu đỏ **"TỪ CHỐI"** đập nảy; chia 2 cực đối chiếu siêu dễ hiểu: `60 NGÀY: BẢO VỆ NGAY` vs `2 NĂM: XÉT LẠI TỪ ĐẦU`.
  - **Cảnh 8**: Thẻ Brand Outro Tiến Dương · Manulife căn giữa tuyệt đối (`Center X = 540px`).

## 2. Ngôn ngữ hình ảnh chủ đạo
- **High-End Editorial Minimalism kết hợp Architectural Blueprint Technical Drafting (Bản vẽ cơ chế kỹ thuật trên giấy can sáng)**.
- Khung hình 9:16 thoáng đãng, khoảng thở rộng rãi (*generous whitespace*). Mỗi cảnh chỉ giữ **duy nhất 1 ẩn dụ thị giác trung tâm**.
- **Cấm hoàn toàn thẻ card dashboard và vòng tròn phần trăm (`ring progress`)**: Mọi mốc ngày/năm đều thể hiện qua thước đo vạch khắc micromet và chốt cơ học thật.
- **Zero Text Overload**: Không đưa điều khoản luật dài dòng lên màn hình; toàn bộ chữ nền/hồ sơ chuyển thành vạch trừu tượng (*abstract skeleton lines*) và chú thích lề mờ (*ghosted marginalia* opacity 0.25–0.35).

## 3. Aesthetic Family & Palette
- **Aesthetic Family**: `Architectural Blueprint Navy` (kế thừa từ `templates/design-systems/families/architectural-blueprint-navy.md`, thiết kế nền giấy can kiến trúc sáng).
- **Bảng màu khóa cứng trong `DESIGN.md`**:
  - `--bg-stage`: `#F5F2EB` (Kem sáng giấy can kiến trúc, ấm áp, minh bạch).
  - `--bg-surface`: `#ECE7DC` (Mặt phẳng bản vẽ kỹ thuật).
  - `--bg-elevated`: `#FFFDF8` (Vùng bàn soi rọi sáng trực diện).
  - `--c-ink`: `#1E3A8A` (Mực xanh hải quân bản vẽ kỹ thuật).
  - `--c-ink-dark`: `#1A233A` (Mực than xanh đậm cho chữ tiêu đề sắc nét).
  - `--c-ink-secondary`: `#475569` (Mực ghi chú, vạch chia thước đo).
  - `--c-accent-hl`: `#FDE047` (Vệt bút dạ quang vàng ấm hòa trộn `multiply`).
  - `--c-brand`: `#00A758` (Xanh ngọc lục bảo Manulife — trạng thái bảo vệ sống).
  - `--c-teal`: `#0D9488` (Xanh ngọc kính lúp & đường kích thước CAD).
  - `--c-amber`: `#D97706` (Hổ phách — cửa sổ điều kiện 2 năm).
  - `--c-danger`: `#C2352B` (Mực dấu đỏ — vạch ngày 61, gạch chữ phủ định, dấu từ chối).

## 4. Ánh sáng & Chất liệu thực (Tactile Light-Box)
- Thuật toán **Procedural Canvas 2D** với seed cố định `rng(20261113)` vẽ thớ giấy can kiến trúc, sợi cellulose siêu mảnh và lưới chấm tọa độ CAD thanh mảnh (`80px`).
- Nguồn sáng bàn soi `#lamp` (`radial-gradient`) rọi từ trên xuống, kết hợp `mix-blend-mode: multiply` giúp vệt bút dạ quang vàng `#FDE047` và mực dấu thấm tự nhiên vào thớ giấy can.

## 5. Không gian sống & Ngôn ngữ chuyển động (Zero Dead Frame)
- **Nhịp thở sân khấu `#cam`**: Chuyển động scale liên tục `1.0 → 1.045` (`ease: "sine.inOut"`) qua từng cảnh nội dung và `1.0 → 1.025` ở Outro.
- **Lớp hạt bụi sáng môi trường (`#dust .mote`)**: 26 hạt bụi sáng lơ lửng trong luồng sáng bàn soi với số vòng lặp hữu hạn tính theo tổng thời lượng (`0 freeze events`).

## 6. Kỷ luật GSAP Motion Physics
- **Tuyệt đối cấm** `power1.out`, `power1.inOut`, `none` hay `linear` cho chuyển động chính.
- **Rơi, sập khóa, đập dấu, bật chốt**: Dùng `ease: "back.out(1.7)"` hoặc `ease: "elastic.out(1, 0.5)"` tạo độ nảy cơ học chân thực.
- **Trượt thước đo, kính lúp soi hồ sơ, quẹt bút dạ quang**: Dùng `ease: "power2.inOut"` hoặc `ease: "expo.out"`.
- **Khóa tuyệt đối vào `T(wordIndex)` & `E(wordIndex)`** trích từ `timing.json` của giọng Hải Đăng.

## 7. Kỹ thuật HyperFrames & GSAP kết hợp (≥3)
1. **Procedural Canvas `rng(20261113)`**: Giấy can kiến trúc + lưới chấm tọa độ CAD tất định.
2. **SVG Micrometer Scale & Path Draw (`strokeDashoffset`)**: Thước đo thời gian tự khắc vạch và trục thu phóng 60 ngày → 2 năm.
3. **Mechanical Lock & Elastic Stamp Physics**: Chốt khóa ngày 61 sập ngàm `elastic.out`, con dấu dập nảy giấy `back.out(1.7)`.
4. **Optical Magnifier & Frost Clip-Path**: Kính lúp trượt rọi hồ sơ và màn kính mờ đóng băng mở/đóng qua `clip-path`.
5. **Karaoke Subtitles & Word-Synced Highlights**: Phụ đề 9–10 từ/dòng ở `bottom: 185px`, tắt dòng cũ tại `W[SUB[li + 1][0]].s - 0.04`.

## 8. Điểm đột phá thị giác (Visual Breakthrough)
- **Cơ chế "Thước Đo Biến Tỷ Lệ Liên Hoàn" (Telescoping Chronometer)**: Cùng một trục thước đo bản vẽ nhưng tự biến đổi thang đo từ cận cảnh `01 → 60 NGÀY` (vùng đệm sáng xanh/vàng mượt mà, tự tính trừ phí nợ trên thanh chi trả) sang ngưỡng sập khóa `NGÀY 61` (đóng băng tức thì), rồi thu phóng tỷ lệ mở rộng ra `0 → 24 THÁNG` kèm cổng kiểm định 3 khóa liên hoàn (đóng bù phí + kính lúp rà sức khỏe + đặt lại thời gian chờ). Người mới chưa biết gì về bảo hiểm chỉ cần nhìn hình (dù tắt tiếng) vẫn hiểu rành mạch sự khác biệt trước và sau ngày thứ 60.

## 9. Tốc độ đọc dự kiến (`ttsSpeed`)
- `0.98` (nhịp nói điềm đạm, rõ ràng, đủ khoảng thở cho người mới tiếp thu).

## 10. Cảnh dự kiến (8 cảnh)
- **Cảnh 1**: Phá vỡ hiểu lầm "trễ 1 ngày = mất sạch", mở ra 2 mốc `60 NGÀY` và `2 NĂM`.
- **Cảnh 2**: Mốc 1 — `60 NGÀY` gia hạn đóng phí (2 tháng xoay xở).
- **Cảnh 3**: Quyền lợi bên trong 60 ngày — vẫn bảo vệ, trừ phí nợ khi chi trả, không hỏi sức khỏe.
- **Cảnh 4**: Ranh giới `NGÀY 61` — chốt khóa sập ngàm, tạm đóng băng hiệu lực.
- **Cảnh 5**: Mốc 2 — `2 NĂM` khôi phục hợp đồng cũ (lợi thế giữ tuổi/phí cũ).
- **Cảnh 6**: 3 điều kiện khắt khe của 2 năm (đóng bù phí + thẩm định lại sức khỏe + tính lại thời gian chờ).
- **Cảnh 7**: Nguy cơ dấu đỏ **"TỪ CHỐI"** khi sức khỏe thay đổi & chốt so sánh trực diện `60 NGÀY` vs `2 NĂM`.
- **Cảnh 8**: Brand Outro Tiến Dương · Manulife căn giữa `540px`, quét dạ quang CTA chuẩn gốc **"Nhắn 'KẾ HOẠCH'"**.

User duyệt: ☑
