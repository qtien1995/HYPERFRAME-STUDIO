# Nhật Ký Kiểm Định Chất Lượng (QC Log) — `nguon-goc-bao-hiem`

## 1. Thông tin chung
- **Dự án**: Thủy Tổ Bảo Hiểm Bắt Nguồn Từ Đâu? (`nguon-goc-bao-hiem`)
- **Cấu hình (`inputProps.json`)**: `format: "9:16"` (`1080×1920`) · `brand: "tien-duong"` · `voice: "Hải Đăng"` (`ttsSpeed: 1.0`) · `13` cảnh
- **Engine**: HyperFrames CLI v0.9.15 + GSAP 3.15.0 + CIT Voice Studio ("Hải Đăng" 48kHz)
- **Thời lượng**: `54.356s` (`52.956s` audio + `1.400s` outro tail · final MP4 `54.37s`, `18.73 MB`) · 13 phân cảnh · 223 từ

## 2. Kiểm định Lớp 1 (`npx hyperframes check projects/nguon-goc-bao-hiem`)
- **Verdict**: `Check passed` (`0 error(s)`)
- **Runtime**: `0 errors, 0 warnings`
- **Layout**: `0 issues across 9 sample(s)`
- **Motion**: `0 errors, 0 warnings`
- **Contrast**: `64/64 text checks pass WCAG AA`
- **Audio**: `0 errors, 0 warnings`

## 3. Kiểm định Lớp 2 (Soi trực tiếp Frame Hook 0.30s + 13 Cảnh trong `output/storyboard-check/`)
- `frame_00_hook_0.30s.png` (`0.30s` — Frame-0 Visual Impact): Đạt — Vật thể trung tâm & tiêu đề Hook xuất hiện ngay tại Frame 0, tương phản cao, không đè phụ đề `#subs`.
- `frame_01_s1_1.78s.png` (Cảnh 1 — Đặt vấn đề nguồn gốc bảo hiểm): Đạt — Bố cục cân đối, chữ và đồ họa trung tâm rõ nét.
- `frame_02_s2_4.52s.png` (Cảnh 2 — Thương nhân sông Dương Tử 5.000 năm trước): Đạt — Thuyền buồm chở kiện hàng trên sóng dữ, highlight vàng `NỖI LO LẬT THUYỀN` rõ nét, phụ đề Karaoke không đè hình.
- `frame_03_s3_7.86s.png` (Cảnh 3 — Chia hàng sang nhiều thuyền): Đạt — Sơ đồ phân tán kiện hàng qua đội thuyền trực quan, dễ hiểu khi tắt tiếng.
- `frame_04_s4_12.69s.png` (Cảnh 4 — Nguyên lý phân tán rủi ro): Đạt — Cơ cấu cân bằng rủi ro sắc nét, không nhòe lớp cảnh trước.
- `frame_05_s5_17.25s.png` (Cảnh 5 — Bia đá Bộ luật Hammurabi 1750 TCN): Đạt — Chữ khắc bên trong bia đá và nhãn `BỘ LUẬT HAMMURABI` sắc nét, highlight từ khóa chính xác.
- `frame_06_s6_22.16s.png` (Cảnh 6 — Khế ước xóa nợ hàng hải): Đạt — Minh họa cam kết xóa nợ khi tàu chìm rõ ràng, khoảng thở rộng.
- `frame_07_s7_27.37s.png` (Cảnh 7 — Hải đồ Địa Trung Hải & Luật Hàng hải Rhodes): Đạt — Hải đồ Địa Trung Hải + la bàn + Đảo Rhodes sắc nét, đúng nhịp từ khóa.
- `frame_08_s8_32.12s.png` (Cảnh 8 — Nguyên tắc tổn thất chung): Đạt — Minh họa san sẻ tổn thất giữa các chủ hàng trực quan, không chạm biên an toàn.
- `frame_09_s9_35.69s.png` (Cảnh 9 — Quán cà phê Edward Lloyd tại London 1688): Đạt — Không gian Lloyd's Coffee House và bảng thông tin tàu biển rõ nét.
- `frame_10_s10_40.35s.png` (Cảnh 10 — Thuật ngữ Underwriting / Ký tên dưới sổ tàu): Đạt — Sổ Manifest chuyến tàu, đường kẻ và nét bút ký bên dưới rõ ràng.
- `frame_11_s11_44.56s.png` (Cảnh 11 — Tiến hóa thành định chế tài chính hiện đại): Đạt — Đồ họa chuyển giao từ hàng hải cổ đại sang bảo hiểm hiện đại mạch lạc.
- `frame_12_s12_47.43s.png` (Cảnh 12 — Đúc kết bản chất bảo hiểm): Đạt — Thông điệp cốt lõi rõ ràng, tương phản chuẩn WCAG AA.
- `frame_13_s13_52.44s.png` & `thumb-outro.jpg` (Cảnh 13 — Brand Outro Tiến Dương · Manulife): Đạt — Thẻ Outro căn giữa `X = 540px`, logo Manulife nổi bật trên nền xanh `#00A758`, CTA `Nhắn 'KẾ HOẠCH'` và `@tienduong` rõ ràng.

## 4. Kết quả 22/22 E2E Hard QC Assertions (`tests/e2e/test_final_video.cjs`)
- **Total Assertions**: `22 | Passed: 22 | Failed: 0 | Verdict: ALL TESTS PASSED`
- **Loudness**: `-13.2 LUFS` (Target `-14.0 to -12.0 LUFS`), **LRA**: `1.6 LU` (`< 8.0 LU`), **True Peak**: `-1.4 dBFS` (`< -1.0 dBFS`)
- **Freeze / Blackout**: `0 freeze events`, `0 black dropouts`
- **A/V Drift**: `0.011s` (`<= 0.5s`)
- **Bitstream Decode**: `0 errors`

**Ký duyệt Final QA (Pha 4)**: PASS ✅
