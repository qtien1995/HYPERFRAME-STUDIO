# Nhật Ký Kiểm Định Chất Lượng (QC Log) — `gia-han-60-ngay`

## 1. Thông tin chung
- **Dự án**: Gia Hạn 60 Ngày & Khôi Phục Hợp Đồng 2 Năm (`gia-han-60-ngay`)
- **Cấu hình (`inputProps.json`)**: `format: "9:16"` (`1080×1920`) · `brand: "tien-duong"` · `voice: "Hải Đăng"` (`ttsSpeed: 0.98`) · `8` cảnh
- **Engine**: HyperFrames CLI v0.9.15 + GSAP 3.15.0 + CIT Voice Studio ("Hải Đăng" 48kHz)
- **Video Final**: `output/final.mp4` (`1080×1920`, `30.00 fps`, H.264 High + AAC 48kHz, `76.37s`, `17.27 MB`)

## 2. Kiểm định Lớp 1 (`npx hyperframes check projects/gia-han-60-ngay`)
- **Verdict**: `Check passed` (`0 error(s)`)
- **Runtime**: `0 errors, 0 warnings`
- **Layout**: `0 issues across 9 sample(s)`
- **Motion**: `0 errors, 0 warnings`
- **Audio**: `0 errors, 0 warnings`

## 3. Kiểm định Lớp 2 (Soi trực tiếp Frame Hook 0.30s + 8 Cảnh trong `output/storyboard-check/`)
- `frame_00_hook_0.30s.png` (`0.30s` — Frame-0 Visual Impact): Đạt — Vật thể trung tâm & tiêu đề Hook xuất hiện ngay lập tức trên nền kem `#F6F2EA`, khoảng thở thoáng, phụ đề `#subs` rõ nét.
- `frame_01_s1_5.18s.png` (Cảnh 1 — Phủ định lầm tưởng): Đạt — Nét gạch đỏ phủ định rõ ràng, 2 chốt `60 NGÀY` và `2 NĂM` cân đối, phụ đề Karaoke sắc nét.
- `frame_02_s2_14.03s.png` (Cảnh 2 — Trục thời gian 60 ngày): Đạt — Thanh thước thời gian 60 ngày và mốc kích hoạt rõ ràng, không chạm viền.
- `frame_03_s3_24.30s.png` (Cảnh 3 — Khiên bảo vệ trong 60 ngày): Đạt — Khiên bảo vệ `#008744` & con dấu `VẪN BẢO VỆ / 100% HIỆU LỰC` sắc nét, không đè phụ đề.
- `frame_04_s4_35.97s.png` (Cảnh 4 — Qua ngày 61 tạm mất hiệu lực): Đạt — Thước ranh giới `NGÀY 01–60 | NGÀY 61+`, lớp kính mờ & dấu `TẠM ĐÓNG BĂNG` rõ nét, không nhòe chữ cảnh cũ.
- `frame_05_s5_45.29s.png` (Cảnh 5 — Quyền khôi phục 24 tháng): Đạt — Khung cửa sổ 24 tháng khôi phục hợp đồng rõ ràng, bố cục cân đối.
- `frame_06_s6_53.98s.png` (Cảnh 6 — 3 điều kiện khôi phục): Đạt — 3 cơ cấu điều kiện `01–03` (đóng bù phí, kính lúp thẩm định sức khỏe, đồng hồ thời gian chờ) căn chỉnh chuẩn, thoáng sạch.
- `frame_07_s7_65.38s.png` (Cảnh 7 — Đối chiếu 60 ngày vs 2 năm): Đạt — Tờ đơn khôi phục với dấu đỏ `LOẠI TRỪ / TỪ CHỐI` không tràn khung + trục đối chiếu 2 cực `60 NGÀY` vs `2 NĂM` dễ hiểu ngay khi tắt tiếng.
- `frame_08_s8_74.52s.png` & `thumb-outro.jpg` (Cảnh 8 — Brand Outro Tiến Dương · Manulife): Đạt — Thẻ Tiến Dương · Manulife căn giữa tuyệt đối (`Center X = 540px`), CTA `Nhắn 'KẾ HOẠCH'` quét dạ quang vàng chuẩn xác, phụ đề ngắt sạch tại ranh giới cảnh.

## 4. Kết quả 22/22 E2E Hard QC Assertions (`tests/e2e/test_final_video.cjs`)
- **Total Assertions**: `22 | Passed: 22 | Failed: 0 | Verdict: ALL TESTS PASSED`
- **Loudness**: `-13.1 LUFS` (Target `-14.0 to -12.0 LUFS`), **LRA**: `1.5 LU` (`< 8.0 LU`), **True Peak**: `-1.4 dBFS` (`< -1.0 dBFS`)
- **Freeze / Blackout**: `0 freeze events`, `0 black dropouts`
- **A/V Drift**: `0.031s` (`<= 0.5s`)
- **Bitstream Decode**: `0 errors`

**Ký duyệt Final QA (Pha 4)**: PASS ✅
