# ART DIRECTION SHEET — Thủy Tổ Bảo Hiểm Bắt Nguồn Từ Đâu? (`nguon-goc-bao-hiem`)

1. **Ẩn dụ thị giác trung tâm (Single Central Metaphor)**:
   - **"Sợi chỉ San Sẻ Rủi Ro trên Bàn Soi Hải Đồ Cổ" (The Thread of Shared Risk on an Illuminated Archival Desk)**: Câu chuyện được kể bằng **13 cảnh chuyển nhịp nhanh (4–8 giây/cảnh)**, mỗi cảnh nắm giữ DUY NHẤT một khoảnh khắc trực quan sắc nét:
     * C1: Tập hợp đồng hiện đại bị gạch đỏ phủ định.
     * C2: Con thuyền đơn độc chao nghiêng giữa sóng dữ sông Trường Giang.
     * C3: 1 khối hàng nặng đè chìm mớn nước 1 chiếc thuyền (`100% rủi ro`).
     * C4: Tách thành 5 kiện sang 5 thuyền (1 gặp xoáy nước, 4 vững vàng).
     * C5: Bia đất nung Hammurabi (`~1750 TCN`) khắc nét chữ hình nêm phát sáng.
     * C6: Cán cân cơ học đổi đồng xu phí nhỏ lấy dấu đất nung `MIỄN HOÀN TRẢ`.
     * C7: Hải đồ Địa Trung Hải tự vẽ tuyến tàu & dấu `TỔN THẤT CHUNG`.
     * C8: Tàu hạ bớt 1 kiện hàng lấy lại thăng bằng + 4 cung lực cùng bù đắp.
     * C9: Bàn gỗ quán cà phê cảng Luân Đôn & dấu mốc `LLOYD'S · 1688`.
     * C10: Trang sổ manifest có đường kẻ ngang + 3 chữ ký tự viết dưới vạch (`UNDER-WRITING`).
     * C11: Thước đo thời gian nối 4 cột mốc lịch sử bằng sợi chỉ vàng liền mạch.
     * C12: 6 cung hợp lực đan thành vòm lá chắn xanh bảo vệ ngôi nhà trước giông bão.
     * C13: Thẻ chuyên gia Tiến Dương · Manulife căn giữa tuyệt đối (`Center X = 540px`), quẹt dạ quang `Nhắn 'KẾ HOẠCH'`.

2. **Ngôn ngữ hình ảnh chủ đạo**:
   - **High-End Editorial Minimalism & Living Diagrams**: Loại bỏ hoàn toàn thẻ card dashboard, vòng tròn phần trăm hay thanh tiến trình phẳng. Toàn bộ văn bản dài/dữ liệu phụ chuyển hóa thành vạch trừu tượng (abstract skeleton lines) và chữ ẩn mờ biên bản cổ (ghosted marginalia opacity `0.22–0.32`), giữ khoảng thở rộng rãi trên khổ dọc 9:16. Tắt tiếng vẫn hiểu 100% mạch chuyện qua chuyển động cơ học.

3. **Aesthetic Family & Palette**:
   - **Editorial Ivory Paper (Biến thể Hải đồ & Cổ thư Sáng)**: Chọn nền giấy ngà thanh lịch (`--bg-stage: #F4EFE6`), mực than chì graphite (`#1F1D1A`), mực hải quân cổ điển (`#1E3A5F`), mực đất nung terracotta (`#B45309`), xanh lá thương hiệu Manulife (`#00A758`), và bút dạ quang vàng ấm (`#FDE047`). (Khóa cứng trong `DESIGN.md`).

4. **Ánh sáng & Chất liệu thực (Tactile Light-Box)**:
   - Vẽ bề mặt giấy vellum/ivory ngà có vân sợi cellulose li ti và đường kinh vĩ hải đồ mờ bằng **Procedural Canvas có seed cố định (`rng(20261113)`)**.
   - Nguồn sáng rọi tập trung từ bàn soi tài liệu (`#lamp` radial vignette ấm) làm nổi bật vệt bút dạ quang vàng (`#FDE047`) và mực xanh ngọc/hải quân với hòa trộn `mix-blend-mode: multiply`.

5. **Không gian sống & Ngôn ngữ chuyển động (Zero Dead Frame)**:
   - Sân khấu `#cam` thở liên tục qua từng cảnh (`scale: 1.0 -> 1.045`, `ease: "sine.inOut"`; Outro `1.0 -> 1.025`).
   - Lớp hạt bụi sáng môi trường (`#dust .mote`) gồm 26 hạt khởi tạo bằng `rng(seed)` trôi nhẹ liên tục với số vòng lặp hữu hạn (`Math.max(0, Math.floor(TOTAL / cyc) - 1)`), đảm bảo `0 freeze events`.

6. **Kỷ luật GSAP Motion Physics**:
   - Cấm tuyệt đối `power1.out`, `power1.inOut`, `none`/`linear` cho chuyển động chính.
   - Vật thể có trọng lượng/đóng dấu/kiện hàng rơi/lá chắn bật nảy: Dùng `ease: "back.out(1.7)"` hoặc `ease: "elastic.out(1, 0.5)"`.
   - Nét vẽ SVG hải trình, quẹt bút dạ quang, thanh cân trượt, chữ ký tự viết: Dùng `ease: "power2.inOut"` hoặc `ease: "expo.out"`.
   - Toàn bộ timeline khóa chặt vào thời gian phát âm từng từ trong `timing.json` thông qua `anchor()` và `T(wordIndex)`.

7. **Kỹ thuật HyperFrames & GSAP kết hợp (≥ 4 kỹ thuật)**:
   1. **Procedural Canvas 2D (`rng(seed)`)**: Vân giấy cổ thư & lưới tọa độ hải đồ tất định.
   2. **SVG Stroke Path Drawing (`strokeDashoffset`)**: Vẽ sóng sông dữ, đường đục chữ hình nêm, tuyến hải đồ Địa Trung Hải, 3 chữ ký "Under-writing" và thước nối lịch sử.
   3. **Living Physics Mechanisms**: Cán cân Hammurabi nghiêng-chốt khóa, quỹ đạo chia 5 kiện hàng lên 5 thuyền, tàu thăng bằng Tổn thất chung, vòm lá chắn hấp thụ lực bão.
   4. **Mask Highlighter Wipe & Con dấu đàn hồi**: Vệt dạ quang vàng quẹt ngang từ khóa + con dấu đập nảy mặt giấy.
   5. **Word-Level Karaoke Subtitles**: Nhảy từng từ `.sub-word` đúng `T(wordIndex)` với ngắt dòng trước 40ms chống overlap.

8. **Điểm đột phá thị giác (Visual Breakthrough)**:
   - Nhịp dựng **13 cảnh chuyển động liên hoàn (4–8s/cảnh)** giữ lực hút thị giác không một giây chững, giải mã trực diện từng cơ chế lịch sử (từ gạt bỏ hợp đồng dày cộm -> phân tách 5 thuyền -> cán cân Hammurabi -> thăng bằng Tổn thất chung -> nét ký Under-writing dưới đường kẻ -> sợi chỉ thời gian -> vòm lá chắn gia đình).

9. **Tốc độ đọc dự kiến (`ttsSpeed`)**: `1.0` (tổng thời lượng dự kiến ~78–82 giây cho 225 từ, nằm chuẩn trong khung 45–90s).

10. **Cảnh dự kiến (13 cảnh)**:
    - C1: Gạt bỏ hợp đồng hiện đại (~4.2s)
    - C2: Hook — Nỗi lo lật thuyền trên sông dữ (~4.3s)
    - C3: Trường Giang — Quá tải trên 1 con thuyền (~6.0s)
    - C4: Trường Giang — Chia đều sang 5 thuyền (~7.5s)
    - C5: Lưỡng Hà — Bia đá bộ luật Hammurabi (~5.5s)
    - C6: Lưỡng Hà — Cán cân đổi phí nhỏ miễn hoàn trả (~8.0s)
    - C7: Địa Trung Hải — Hải đồ quy ước Tổn thất chung (~6.0s)
    - C8: Địa Trung Hải — Hạ bớt hàng cứu cả tàu & bù đắp (~7.5s)
    - C9: Luân Đôn TK 17 — Quán cà phê cảng biển 1688 (~5.0s)
    - C10: Luân Đôn — Giải mã nét ký Under-writing dưới danh sách tàu (~8.5s)
    - C11: Sợi chỉ thời gian nối liền 4 nền văn minh (~5.0s)
    - C12: Vòm hợp lực số đông đỡ một gia đình (~5.5s)
    - C13: Brand Outro Tiến Dương · Manulife & CTA `Nhắn 'KẾ HOẠCH'` (~7.0s)

User duyệt: ☑
