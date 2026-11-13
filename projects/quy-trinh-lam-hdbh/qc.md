# BÁO CÁO KIỂM ĐỊNH CHẤT LƯỢNG (HARD QC GATE) — `quy-trinh-lam-hdbh`

- **Ngày thực hiện**: 2026-11-13
- **Khổ hình & Thời lượng**: `9:16` (`1080×1920`) | `30.00 fps` | `101.20s` (Video `101.20s` / Narration `99.80s` / A/V Drift `0.002s`)
- **Voiceover**: CIT Voice Studio (`:8001`) — Giọng `"Hải Đăng"` (`speed: 1.02`, `48000 Hz`, 420 từ đồng bộ từng từ)
- **Brand**: `"none"` (không gắn thẻ outro thương hiệu)

---

## 1. Kiểm định Lớp 1 (`npx hyperframes check projects/quy-trinh-lam-hdbh`)
- **Lint**: `0 error(s)`, `12 warning(s)`
- **Runtime**: `0 errors`, `0 warnings`
- **Layout**: `0 issues across 9 sample(s)`
- **Motion**: `0 errors`, `0 warnings`
- **Contrast**: `82/82 text checks pass WCAG AA`
- **Craft**: `0 error(s)`, `37 warning(s)`
- **Audio**: `0 errors`, `0 warnings`
- **Verdict**: `Check passed` (`exit code 0`)

---

## 2. Kiểm định Lớp 2 — Soi Frame PNG Thực Tế (`output/storyboard-check/`)

Đã gọi `read_file` soi trực tiếp **11/11 frame PNG** trích xuất từ `output/final.mp4` cuối cùng:

1. `frame_00_hook_0.30s.png` (`0.3s`): Nền đỏ `#7F1D1D` tương phản mạnh ngay tại Frame 0; thẻ hồ sơ `"CHỌN GÓI · KÝ TÊN = XONG NGAY?"` và tem `"HIỂU LẦM PHỔ BIẾN"` hiển thị tức thì rõ nét; phụ đề Karaoke nằm đúng vùng an toàn phía dưới, không che đồ họa.
2. `frame_01_s1_5.16s.png` (`5.2s`): Đường gạch đỏ xuyên qua `"= XONG NGAY?"` rõ ràng, thẻ đẩy mượt lên trên nhường vùng dưới cho lộ trình chuẩn hóa sắp xuất hiện; độ tương phản chữ sắc nét.
3. `frame_02_s2_14.96s.png` (`15.0s`): Cân tiểu ly nghiêng trái (`CHI PHÍ SỐNG & NỢ GIA ĐÌNH`), `"CHỌN GÓI NÀO RẺ NHẤT?"` được gạch bỏ sạch sẽ, khối mục tiêu bên phải đang vào nhịp, không đè phụ đề.
4. `frame_03_s3_25.41s.png` (`25.4s`): Khối `"TẬP 01 · NHÂN THÂN (CCCD / Hộ Chiếu · BẮT BUỘC)"` căn giữa gọn gàng với khoảng thở rộng, sẵn sàng tiếp nối Tập 02 & Tập 03 theo timing lời thoại.
5. `frame_04_s4_36.08s.png` (`36.1s`): Phiếu `"HỒ SƠ YÊU CẦU BẢO HIỂM"` cùng thanh quét teal quét qua dòng `02. ĐƠN THUỐC & LỊCH SỬ KHÁM BỆNH`, ống dẫn `"KẼ HỞ PHÁP LÝ"` nối mượt xuống dưới, chữ rõ và thoáng.
6. `frame_05_s5_46.77s.png` (`46.8s`): Đầu băng `"REC · ĐANG GHI ÂM TƯ VẤN"` với 28 thanh sóng âm hoạt động cân đối; nút teal `"KHÓA BẰNG CHỨNG · TRÁNH MẬP MỜ"` hiển thị trọn vẹn trên 1 dòng gọn gàng (đã xử lý triệt để lỗi rớt chữ `"MỜ"` sau re-render).
7. `frame_06_s6_57.64s.png` (`57.6s`): Kính lúp rà soát hồ sơ kèm nhãn vàng `"KHÁM SỨC KHỎE MIỄN PHÍ"` và hai nhánh phân luồng bắt đầu vẽ mượt mà, không đè chữ, không chạm vùng phụ đề.
8. `frame_07_s7_69.52s.png` (`69.5s`): Ba công tắc xác thực (`01. Kiểm tra định danh (eKYC)`, `02. Chữ ký điện tử / Mã OTP`, `03. Gọi điện đối chiếu khách hàng`) bật hoàn chỉnh; lá chắn tách đôi hiển thị nhãn `"CHỜ DUYỆT: TẠM THỜI TAI NẠN"` trước khi kích hoạt toàn diện.
9. `frame_08_s8_80.68s.png` (`80.7s`): Thẻ `"BIÊN BẢN BÀN GIAO HỢP ĐỒNG · KÝ XÁC NHẬN"` với nét chữ ký rõ; thước `"21 NGÀY CÂN NHẮC"` tô vàng suốt trục `01 – 7 – 14 – 21`, sắc nét toàn khung.
10. `frame_09_s9_88.94s.png` (`88.9s`): Khung `"BỘ HỢP ĐỒNG CHÍNH THỨC / Mọi điều khoản đã xác lập hiệu lực"` kẹp giữa hai ngàm khóa trên/dưới; tem đỏ `"QUA NGÀY 21 · ĐÃ KHÓA"` đóng gọn ở khoang dưới của thẻ (đã xử lý triệt để lỗi che chữ tiêu đề thẻ sau re-render).
11. `frame_10_s10_97.99s.png` (`98.0s`): Đủ 5 chốt khóa an toàn (`01 Chuẩn Bị Đủ Giấy Tờ`, `02 Kê Khai Trung Thực`, `03 Ghi Âm Minh Bạch`, `04 Xác Thực Chuẩn Xác`, `05 Kiểm Tra Kỹ 21 Ngày`) xếp thẳng hàng, cân đối tuyệt đối với phụ đề Karaoke ở đáy khung.

---

## 3. Kiểm định Chéo Nội Dung & Pháp Lý
- Khớp 100% nội dung yêu cầu của người dùng: quy trình từng bước làm HĐBH, đủ 3 nhóm giấy tờ cần thiết (Nhân thân, Y tế, Tài chính), yêu cầu ghi âm tư vấn minh bạch (bắt buộc cho liên kết đầu tư), và 3 chốt xác thực (eKYC, chữ ký điện tử/OTP, gọi điện đối chiếu) trước khi phát hành.
- Không bịa đặt số liệu, tuân thủ bộ quy tắc chính sách nội dung sạch và không gắn brand ngoài phạm vi (`brand: "none"`).

---

## 4. Kết quả Cổng E2E Hard QC Gate (`tests/e2e/test_final_video.cjs`)
- **Total Assertions**: `22` | **Passed**: `22` | **Failed**: `0`
- **Verdict**: `ALL TESTS PASSED 🚀`
- **Thông số kỹ thuật**:
  - Định dạng: `H.264 High (yuv420p)` `1080x1920`, `30.00 fps`, `33.55 MB`
  - Âm thanh: `AAC 48000 Hz (mono)`
  - EBU R128 Integrated Loudness: `-13.3 LUFS` (chuẩn `-14.0..-12.0 LUFS`)
  - Loudness Range (LRA): `1.5 LU` (`< 8.0 LU`)
  - True Peak: `-1.4 dBFS` (`< -1.0 dBFS`)
  - Freeze / Blackout: `0 freeze events` | `0 black dropouts`
  - Bitstream Decode Integrity: `0 errors`

**KẾT LUẬN NGHIỆM THU CUỐI CÙNG**: `PASS ✅`
