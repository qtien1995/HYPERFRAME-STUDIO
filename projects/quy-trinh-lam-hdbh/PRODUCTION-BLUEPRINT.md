# PRODUCTION BLUEPRINT — quy-trinh-lam-hdbh
<!-- BẢN VẼ KỸ THUẬT PHA 3 · PURE BESPOKE V4 · TỪ TIMING.JSON THẬT (420 TỪ / 99.798s) -->

## PHẦN 1: WORD MAP & ANCHORS (`timing.json`)

- **Tổng thời lượng audio**: `99.798s` (`2994 frames @ 30fps`)
- **Khoảng đệm cuối (`TAIL`)**: `1.400s` → **Tổng thời lượng video (`TOTAL`)**: `101.198s` (`3036 frames`)
- **Tiền cắt cảnh (`LEAD`)**: `0.250s`

### 1.1. Bảng `anchor(wordIdx, expectedWord)` & Phân bổ 10 cảnh
| Cảnh | Từ neo (`anchor`) | Thời điểm từ (`s`) | Cắt cảnh (`start`) | Thời lượng (`dur`) | Mô tả nhiệm vụ & Ẩn dụ duy nhất |
|:---|:---|:---|:---|:---|:---|
| `s1` | `[0] "Nhiều"` (start `0.000s`) | `0.000s` | `0.000s` | `9.380s` | Hook Frame-0: Bìa hồ sơ & mộc *"KÝ LÀ XONG?"* trên nền đỏ son `#7F1D1D`, gạch ngang mở trục 6 bước |
| `s2` | `anchor(41, "Bước")` | `9.630s` | `9.380s` | `10.140s` | Bước 1: Đòn bẩy cân bằng cơ học đo khoảng trống tài chính vs mệnh giá bảo vệ |
| `s3` | `anchor(82, "Bước")` | `19.770s` | `19.520s` | `10.710s` | Bước 2: Khay hồ sơ mở 3 tập giấy tờ gốc (`CCCD/Khai sinh`, `Y tế cũ`, `Thu nhập`) |
| `s4` | `anchor(127, "Bước")` | `30.480s` | `30.230s` | `10.630s` | Bước 3: Thanh quét quang học soi tờ khai y tế phát hiện kẽ hở khi giấu bệnh cũ |
| `s5` | `anchor(172, "Đặc")` | `41.110s` | `40.860s` | `10.740s` | Ghi âm bắt buộc: Băng thu & 28 sóng âm thanh khóa ổ khóa **"GHI ÂM ĐỐI CHIẾU"** |
| `s6` | `anchor(217, "Bước")` | `51.850s` | `51.600s` | `10.980s` | Bước 4: Kính lúp thẩm định & bộ chia đường ray 4 cửa (`Chuẩn`, `Tăng phí`, `Loại trừ`, `Hoãn`) |
| `s7` | `anchor(261, "Bước")` | `62.830s` | `62.580s` | `12.620s` | Bước 5: Cổng xác thực 3 chốt (`eKYC`, `Chữ ký số`, `Đối chiếu`) mở khóa lá chắn toàn diện |
| `s8` | `anchor(312, "Bước")` | `75.450s` | `75.200s` | `9.970s` | Bước 6: Bút ký biên bản bàn giao kích hoạt thước cửa sổ `01 → 21 NGÀY` cân nhắc miễn phí |
| `s9` | `anchor(354, "Đừng")` | `85.420s` | `85.170s` | `6.860s` | Điểm mù sau ngày 21: Ngàm khóa cơ học sập chốt niêm phong + đồng hồ thời gian chờ |
| `s10` | `anchor(385, "Làm")` | `92.280s` | `92.030s` | `9.168s` | Tổng kết: Mạch dây chuyền khép kín hội tụ 5 chốt hành động chuẩn xác |

### 1.2. Danh sách từ ngắt ranh giới phụ đề (`sceneBreakWords`)
`[40 ("đây."), 81 ("giá."), 126 ("cao."), 171 ("sau."), 216 ("mờ."), 260 ("hoãn."), 311 ("nạn."), 353 ("tiền."), 384 ("đếm.")]` — bảo đảm không có dòng phụ đề Karaoke nào bị kẹt bắc cầu qua hai cảnh khác nhau.

---

## PHẦN 2: PALETTE `:root`, CHẤT LIỆU & KHÔNG GIAN SỐNG

### 2.1. Khóa cứng `:root` CSS Variables (khớp 100% `DESIGN.md`)
```css
:root {
  --bg-stage: #F4EFE6;
  --bg-surface: #EAE2D3;
  --bg-elevated: #FFFDF8;
  --bg-overlay: rgba(24, 24, 27, 0.88);
  --bg-hook: #7F1D1D;
  --ink-hook: #FAF6EE;
  --ink-primary: #1A1B1E;
  --ink-secondary: #57534E;
  --ink-dim: rgba(26, 27, 30, 0.16);
  --accent-1: #FDE047;
  --accent-2: #0F766E;
  --accent-amber: #D97706;
  --status-danger: #B91C1C;
  --status-success: #059669;
  --lamp-vignette: radial-gradient(circle 880px at 50% 38%, rgba(255, 253, 248, 0.85) 0%, rgba(244, 239, 230, 0) 80%);
  --dossier-shadow: 0 18px 42px rgba(26, 27, 30, 0.12), 0 4px 12px rgba(26, 27, 30, 0.06);
}
```

### 2.2. Chất liệu tất định & Chuyển động nền (`0 freeze events`)
- **Procedural Canvas `#bg-canvas`** (`1080×1920`, `rng(20261113)`): Vẽ nền giấy lưu trữ `#F4EFE6`, 38.000 hạt sợi cellulose mịn, lưới dấu thập đăng ký lề tinh tế mỗi `90px` và khung viền hồ sơ hai nét.
- **Đèn bàn soi `#lamp`**: Lớp radial vignette dịu mắt chiếu xuống trung tâm bàn thẩm định.
- **Bụi sáng môi trường `#dust`**: 28 hạt `.mote` chuyển động hữu hạn `repeats = Math.max(0, Math.floor(TOTAL / 4.2) - 1)` (`yoyo: true`).
- **Nhịp máy quay `#cam`**: Biến thiên theo tâm lý từng cảnh (`punch-in`, `pan-right`, `breathe`, `pan-left`, `pull-back`) suốt toàn bộ `TOTAL`.

---

## PHẦN 3: KIẾN TRÚC DOM / SVG THEO KHỔ HÌNH `1080×1920` (9:16)

- **Phân vùng an toàn tuyệt đối (Safe Zones)**:
  - **Archival Header Bar**: `top: 76px`, `left: 68px`, `right: 68px`.
  - **Kicker Pill & Tiêu đề cảnh**: `top: 136px .. 340px`.
  - **Sân khấu ẩn dụ trung tâm**: `top: 360px .. 1440px` (rộng tối đa `940px`, căn giữa `540px`).
  - **Vùng Phụ đề Karaoke (`#subs`)**: `bottom: 185px`, `height: 200px` (`y ≈ 1535px .. 1735px`), hoàn toàn cách ly `>= 95px` bên dưới sân khấu đồ họa để **tuyệt đối không che hoặc chồng lấp chữ**.
- **Chi tiết 10 ẩn dụ độc bản**:
  - `s1`: Nền phủ `#7F1D1D` (`.hook-backdrop`), bìa hồ sơ kem `#FAF6EE` nghiêng `-2deg` + con dấu **"KÝ LÀ XONG?"** hiện sẵn tại `t = 0.0s` (`immediateRender: true`), vạch gạch `#FDE047` + đường ray mở 6 trạm (`01..06`).
  - `s2`: SVG Đòn bẩy cân bằng (`#s2-beam` xoay quanh tâm `(450, 190)`), đĩa trái *Chi phí gia đình*, đĩa phải trượt từ `0 → MỆNH GIÁ ĐÚNG`.
  - `s3`: Khay hồ sơ 3 tầng xếp lớp gáy (`01 CCCD / KHAI SINH`, `02 HỒ SƠ Y TẾ CŨ`, `03 CHỨNG MINH THU NHẬP`).
  - `s4`: Tờ khai y tế SVG + thanh tia quét quang học `#s4-scanner`, vệt mực ẩn *"BỆNH CŨ CHE GIẤU"* cắt đứt mạch chi trả + dấu đỏ **"TỪ CHỐI CHI TRẢ"**.
  - `s5`: Băng thu & 28 thanh sóng âm SVG `#s5-wave-bars`, 3 thẻ chứng thực (`RÕ RỦI RO`, `RÕ ĐIỀU KHOẢN`, `TỰ NGUYỆN`) + ổ khóa xanh ngọc **"GHI ÂM ĐỐI CHIẾU"**.
  - `s6`: Kính lúp SVG `#s6-loupe` trượt rọi hồ sơ + bộ chia đường ray 4 nhánh SVG (`#s6-branch-1..4`) dẫn tới 4 cửa: `CHẤP NHẬN CHUẨN`, `TĂNG PHÍ`, `LOẠI TRỪ BỆNH CŨ`, `TẠM HOÃN`.
  - `s7`: Cổng xác thực 3 chốt gạt (`ĐỊNH DANH`, `CHỮ KÝ SỐ`, `ĐỐI CHIẾU`) + Lá chắn SVG 2 tầng (`#s7-shield-temp` nửa sáng `TẠM THỜI: TAI NẠN` → `#s7-shield-full` mở khóa xanh lục bảo `TOÀN DIỆN`) + mộc **"PHÁT HÀNH"**.
  - `s8`: Biên bản bàn giao có chữ ký SVG path draw (`#s8-sig-path`) + Thước cửa sổ `01 → 21 NGÀY` tô dạ quang vàng + chốt `HỦY NGANG · HOÀN LẠI PHÍ`.
  - `s9`: Hàm ngàm cơ học trên/dưới (`#s9-jaw-top`, `#s9-jaw-bot`) sập khóa bìa hồ sơ + mộc **"QUA NGÀY 21 · ĐÃ KHÓA"** + bánh răng đồng hồ thời gian chờ (`#s9-gear`).
  - `s10`: Mạch đường dẫn SVG nối liền 5 chốt chuẩn (`01 GIẤY TỜ`, `02 KHAI THẬT`, `03 GHI ÂM`, `04 XÁC THỰC`, `05 SOI KỸ 21 NGÀY`) + thông điệp chốt hạ.

---

## PHẦN 4: KỊCH BẢN CHUYỂN ĐỘNG GSAP (`T(wordIndex)` & `E(wordIndex)`)

### 4.1. Kỷ luật Easing & Karaoke
- Chuyển động xuất hiện vật thể, đóng dấu, gạt chốt, sập khóa: `back.out(1.7)` hoặc `elastic.out(1, 0.5)`.
- Thanh quét, xoay đòn bẩy, vẽ path SVG, tô bút dạ quang, mở cửa sổ: `power2.inOut` hoặc `expo.out`.
- Cấm tuyệt đối `power1.out`, `none`, `linear` cho chuyển động chính.
- Phụ đề Karaoke: bật dòng mới tại `W[line[0]].s - 0.03`, **tắt dòng cũ dứt khoát tại `W[SUB[li + 1][0]].s - 0.04`**, nhấn từng từ theo `[ws, we]`.

### 4.2. Mỏ neo GSAP chi tiết theo từng cảnh (`T(wordIndex)`)
- **Cảnh 1 (`s1`)**: Frame-0 (`t=0.0s`) hiện sẵn bìa hồ sơ + `"KÝ LÀ XONG?"`; `T(11)` nhấn sáng; `T(14)` vệt gạch chéo xé ngang (`expo.out`); `T(23)` bìa hồ sơ thu gọn lên trên; `T(29)` đường trục vẽ ra (`strokeDashoffset`) + 6 chốt trạm bật nảy (`back.out(1.7)`).
- **Cảnh 2 (`s2`)**: `T(43)` thước đòn bẩy hiện ra nghiêng `-14deg` bên chi phí gia đình; `T(53)` gạch bỏ chữ *"GÓI RẺ"*; `T(62)` cột chi phí gia đình dâng lên; `T(77)` thanh trượt mệnh giá chạy tới khớp điểm và xoay đòn bẩy về `0deg` (`elastic.out(1, 0.5)`).
- **Cảnh 3 (`s3`)**: `T(84)` mở khay hồ sơ; `T(94)` tập `01 CCCD / KHAI SINH` trượt khớp ngàm (`back.out(1.6)`); `T(107)` tập `02 HỒ SƠ Y TẾ CŨ` trượt khớp; `T(117)` tập `03 CHỨNG MINH THU NHẬP` trượt khớp.
- **Cảnh 4 (`s4`)**: `T(129)` tờ khai y tế bung ra; `T(147)` thanh tia xanh ngọc bắt đầu quét; `T(158)` phát hiện vệt mực ẩn *"BỆNH CŨ CHE GIẤU"* đổi tia sang đỏ; `T(164)` đường dẫn chi trả đứt gãy; `T(166)` mộc **"TỪ CHỐI CHI TRẢ"** dập nảy (`back.out(1.7)`).
- **Cảnh 5 (`s5`)**: `T(177)` hiện máy thu âm & 2 cuộn băng quay; `T(185)` kích hoạt dải 28 sóng âm thanh; `T(201)` lần lượt bật 3 nhãn `RÕ RỦI RO`, `RÕ ĐIỀU KHOẢN`, `TỰ NGUYỆN`; `T(195)`/`T(211)` khóa vào ổ khóa **"GHI ÂM ĐỐI CHIẾU"** (`back.out(1.7)`).
- **Cảnh 6 (`s6`)**: `T(224)` kính lúp rà quét hồ sơ y tế + thẻ `"KHÁM MIỄN PHÍ"`; `T(246)` đường dẫn chia nhánh 4 ngã rẽ bắt đầu vẽ (`expo.out`); `T(249)`, `T(252)`, `T(254)`, `T(258)` lần lượt bật 4 cửa `CHUẨN`, `TĂNG PHÍ`, `LOẠI TRỪ`, `TẠM HOÃN` (`back.out(1.7)`).
- **Cảnh 7 (`s7`)**: `T(271)` bật khung 3 chốt xác thực; `T(273)` gạt chốt `ĐỊNH DANH`; `T(275)` gạt chốt `CHỮ KÝ SỐ`; `T(280)` gạt chốt `ĐỐI CHIẾU`; `T(294)` dập mộc **"PHÁT HÀNH"** (`back.out(1.7)`); `T(296)` từ trạng thái nửa sáng `TẠM THỜI: TAI NẠN` (`T(305)`) mở rực toàn phần lá chắn xanh ngọc `TOÀN DIỆN`.
- **Cảnh 8 (`s8`)**: `T(314)` nét bút ký SVG vẽ chữ ký bàn giao (`expo.out`); `T(322)` đếm bộ đếm `01 → 21 NGÀY` + kéo vệt dạ quang vàng `#FDE047` dọc thước (`power2.inOut`); `T(348)` bật sáng chốt `HỦY NGANG · HOÀN LẠI PHÍ` (`back.out(1.7)`).
- **Cảnh 9 (`s9`)**: `T(364)` hàm ngàm trên/dưới sập khóa vào hồ sơ (`elastic.out(1, 0.5)`); `T(374)` đóng mộc **"QUA NGÀY 21 · ĐÃ KHÓA"**; `T(379)` bánh răng đồng hồ thời gian chờ quay nhịp (`power2.inOut`).
- **Cảnh 10 (`s10`)**: `T(385)` đường mạch tổng kết tự vẽ (`expo.out`); `T(399)`, `T(401)`, `T(403)`, `T(407)`, `T(411)` lần lượt sáng bật 5 chốt hành động (`back.out(1.7)`) hội tụ dưới tiêu đề đúc kết.
