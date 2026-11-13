# ART DIRECTION SHEET — Quy Trình Từng Bước Để Làm 1 Hợp Đồng Bảo Hiểm

1. **Cấu hình dự án (`inputProps.json`)**: `format: "9:16"` (`1080×1920`) · `voice: "Hải Đăng"` · `ttsSpeed: 1.02` · `brand: "none"` *(mặc định; đổi sang `"tien-duong"` nếu User xác nhận gắn thương hiệu tại Gate 1)* · `targetScenes: 10` · `targetDurationSec: 108`.
2. **Ngôn ngữ thị giác chọn cho chủ đề này & Lý do**:
   - **Editorial Ivory Archival & Legal Press (Hồ sơ Lưu trữ Ngà Ấm & Dây chuyền Kiểm định Pháp lý)** kết hợp **Hook Đỏ Son Phá Cách** ở Cảnh 1.
   - *Lý do*: Khác với bảng vẽ kỹ thuật thuần CAD (blueprint xanh dương) vốn hợp với các mốc thời gian cơ học, chủ đề "quy trình làm một hợp đồng bảo hiểm" là hành trình xác lập một **giao kèo pháp lý, y tế và xác thực minh bạch** giữa khách hàng và công ty bảo hiểm. Bề mặt giấy hồ sơ ngà ấm (`#F4EFE6`), mực than chì đậm (`#1A1B1E`), dấu mộc đỏ son (`#B91C1C`) và xanh ngọc pháp lý (`#0F766E`) mang lại cảm giác chân thực như đang mở từng trang hồ sơ trên bàn thẩm định thực sự.
3. **Ẩn dụ thị giác trung tâm (Single Central Metaphor)**:
   - **Dây Chuyền Hồ Sơ & Trạm Đóng Dấu Pháp Lý (The Policy Dossier Verification Line)**: Xuyên suốt 10 cảnh là một tập hồ sơ hợp đồng đi qua từng trạm kiểm định thật — mỗi cảnh chỉ giữ 1 ẩn dụ trung tâm:
     - **Cảnh 1 (Hook)**: Phá bỏ dấu mộc ảo tưởng *"KÝ LÀ XONG?"* trên nền đỏ son `#7F1D1D`.
     - **Cảnh 2 (Bước 1 — Đo nhu cầu)**: Đòn bẩy cân bằng cơ học đo khoảng trống tài chính gia đình vs mệnh giá bảo vệ.
     - **Cảnh 3 (Bước 2 — Giấy tờ cần thiết)**: Khay phân loại mở 3 ngăn tài liệu chuẩn (`CCCD / KHAI SINH`, `HỒ SƠ Y TẾ CŨ`, `CHỨNG MINH THU NHẬP`).
     - **Cảnh 4 (Bước 3 — Kê khai trung thực)**: Thanh quét quang học rà tờ khai y tế phát hiện điểm đứt mạch khi giấu bệnh cũ.
     - **Cảnh 5 (Ghi âm bắt buộc)**: Dải sóng âm thanh (*waveform*) chạy qua đầu ghi khóa vào ổ khóa minh bạch **"GHI ÂM ĐỐI CHIẾU"**.
     - **Cảnh 6 (Bước 4 — Thẩm định)**: Kính lúp thẩm định chia dòng hồ sơ ra đúng 4 ngã rẽ cơ học (`CHUẨN` / `TĂNG PHÍ` / `LOẠI TRỪ` / `TẠM HOÃN`).
     - **Cảnh 7 (Bước 5 — Xác thực & Phát hành)**: Cổng xác thực 3 chốt (`ĐỊNH DANH · CHỮ KÝ SỐ · ĐỐI CHIẾU`) mở khóa con dấu **"PHÁT HÀNH"** phủ sáng toàn phần lá chắn 2 tầng.
     - **Cảnh 8 (Bước 6 — Bàn giao & 21 ngày)**: Nét bút ký biên bản bật mở cửa sổ `01 → 21 NGÀY` tô dạ quang vàng `#FDE047`.
     - **Cảnh 9 (Điểm mù sau ngày 21)**: Cửa sổ `NGÀY 21` sập khóa ngàm và bánh răng thời gian chờ quay nhịp.
     - **Cảnh 10 (Tổng kết)**: Dây chuyền hội tụ thành 1 mạch pháp lý hoàn chỉnh với 5 chốt khóa hành động.
4. **Palette (`:root`) & Chất liệu ánh sáng**:
   - `--bg-stage: #F4EFE6`, `--bg-surface: #EAE2D3`, `--bg-elevated: #FFFDF8`, `--bg-overlay: rgba(24, 24, 27, 0.88)`
   - `--bg-hook: #7F1D1D`, `--ink-hook: #FAF6EE` (riêng Cảnh 1 tạo cú sốc thị giác ngay Frame 0)
   - `--ink-primary: #1A1B1E`, `--ink-secondary: #57534E`, `--ink-dim: rgba(26, 27, 30, 0.16)`
   - `--accent-1: #FDE047` (dạ quang vàng Highlight & Karaoke), `--accent-2: #0F766E` (xanh ngọc pháp lý), `--status-danger: #B91C1C`, `--status-success: #059669`, `--accent-amber: #D97706`.
   - Chất liệu: Procedural Canvas `rng(20261113)` vẽ thớ giấy hồ sơ ngà ấm, sợi cellulose mảnh và viền thước đo kỹ thuật, kết hợp ánh sáng bàn soi `#lamp` (`radial-gradient`) và `mix-blend-mode: multiply`.
5. **Nhịp máy quay `#cam` & Chuyển cảnh nối mạch (Match-Cut)**:
   - `#cam` vận động liên tục qua từng cảnh (`punch-in` khi quét hồ sơ & sóng ghi âm, `pan-right` khi tách 4 ngã rẽ, `pull-back` ở tổng kết), kết hợp hạt bụi sáng môi trường lặp hữu hạn `Math.floor(TOTAL / cyc) - 1` -> bảo đảm tuyệt đối `0 freeze events`.
   - Nối mạch **Match-Cut**: Đường trục tiến độ hồ sơ dẫn mắt từ cảnh này trượt mượt sang cảnh kế tiếp thay vì cắt rời rạc.
6. **Kỷ luật GSAP Motion Physics**:
   - Tuyệt đối không dùng `power1.out`, `none` hay `linear` cho chuyển động chính.
   - Đóng dấu mộc, sập khóa ngày 21, gạt chốt xác thực, bật ngã rẽ: `ease: "back.out(1.7)"` hoặc `ease: "elastic.out(1, 0.5)"`.
   - Quét tia soi y tế, chạy sóng ghi âm, trượt khay giấy tờ, tô bút dạ quang, vẽ đường path SVG: `ease: "power2.inOut"` hoặc `ease: "expo.out"`.
   - 100% neo vào `T(wordIndex)` & `E(wordIndex)` từ `timing.json`.
7. **Kỹ thuật HyperFrames & GSAP kết hợp (≥3)**:
   - Procedural Canvas `rng(seed)` tạo vân giấy lưu trữ tất định.
   - SVG Path Draw (`strokeDashoffset`) cho nét bút ký bàn giao, đường nối trạm kiểm định, vạch gạch Hook.
   - Audio Waveform Synthesis trên SVG cho cảnh Ghi âm tư vấn bắt buộc.
   - Mechanical Physics (`back.out`, `elastic.out`) cho đòn bẩy cân bằng, cổng xác thực 3 chốt, con dấu phát hành và ngàm khóa ngày 21.
   - Clip-path / Mask Wipe cho tia quét hồ sơ y tế, vệt bút dạ quang và cửa sổ 21 ngày.
   - Karaoke Subtitles 9–10 từ/dòng ngắt sạch tại `W[SUB[li + 1][0]].s - 0.04`.
8. **Điểm đột phá thị giác (Visual Breakthrough)**:
   - **Bộ đôi "Sóng Ghi Âm Đối Chiếu → Cổng Xác Thực 3 Chốt" (Cảnh 5 & Cảnh 7)**: Minh họa sống động những khâu mà đa số người mua thường tưởng là "rườm rà", hóa ra lại là 2 lớp khóa bảo vệ trực tiếp cho chính khách hàng — ghi âm khóa bằng chứng tư vấn minh bạch và xác thực 3 chốt mở khóa lá chắn toàn diện.
9. **Phân cảnh dự kiến (10 cảnh)**:
   - s1: Hook 3s — Phá vỡ hiểu lầm "Ký là xong" (Frame-0 Impact)
   - s2: Bước 1 — Đo khoảng trống tài chính
   - s3: Bước 2 — Chuẩn bị bộ giấy tờ hợp lệ (CCCD/Khai sinh · Y tế cũ · Chứng minh thu nhập)
   - s4: Bước 3 — Hồ sơ yêu cầu & Nút thắt trung thực tuyệt đối
   - s5: Yêu cầu Ghi âm tư vấn bắt buộc (liên kết đầu tư)
   - s6: Bước 4 — Thẩm định rủi ro & 4 ngã rẽ
   - s7: Bước 5 — Xác thực để phát hành & Ranh giới bảo vệ tạm thời
   - s8: Bước 6 — Bàn giao & 21 ngày cân nhắc miễn phí
   - s9: Điểm mù sau ngày 21 & Đếm thời gian chờ
   - s10: Tổng kết quy trình & 5 chốt hành động *(hoặc Brand Outro nếu User chọn gắn brand)*

User duyệt: ☐
