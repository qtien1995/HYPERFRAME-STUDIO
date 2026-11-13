# BẢN VẼ KỸ THUẬT SẢN XUẤT (PRODUCTION BLUEPRINT V4)
## DỰ ÁN: GIA HẠN 60 NGÀY & KHÔI PHỤC HỢP ĐỒNG 2 NĂM (`gia-han-60-ngay`)

> **Tiêu chuẩn**: Pure Bespoke V4 · Architectural Blueprint Navy (Nền sáng giấy can `#F5F2EB`) · Physics GSAP Choreography · Full Word-Sync 100%
> **Nguồn Audio**: CIT Voice Studio (VieNeu-TTS local `:8001`, giọng **Hải Đăng** 48kHz, `ttsSpeed: 0.98`)
> **Thời lượng Audio thật**: `74.986s` (`74,986ms` / `2,250 frames` / `311 words` đồng bộ)
> **Thời lượng Video**: `76.19s` (`2,286 frames` @ `30fps`, `TAIL_PAD = 1.20s`, đạt chuẩn `T1.7_DURATION_BOUNDS: 45s–90s`)

---

## PHẦN 1: WORD TIMING & SCENE ANCHORS (`311 WORDS @ SPEED 0.98`)

### 1.1. Bảng Neo Chuyển Cảnh (Scene Cut Anchors — `LEAD = 0.25s`)
| Scene | Tên phân cảnh | Anchor Call | startMs | Scene Start (`s`) | Scene End (`s`) | Duration (`s`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S1** | Phá vỡ hiểu lầm trễ 1 ngày | `anchor(0, "Nhiều")` | `0ms` | `0.00s` | `9.42s` | `9.42s` |
| **S2** | Mốc 1: 60 ngày gia hạn là gì | `anchor(40, "Mốc")` | `9,670ms` | `9.42s` | `17.81s` | `8.39s` |
| **S3** | Quyền lợi bên trong 60 ngày | `anchor(74, "Điều")` | `18,060ms` | `17.81s` | `29.61s` | `11.80s` |
| **S4** | Ranh giới ngày 61: Đóng băng | `anchor(122, "Nhưng")` | `29,860ms` | `29.61s` | `41.18s` | `11.57s` |
| **S5** | Mốc 2: 2 năm khôi phục HĐ cũ | `anchor(169, "Lúc")` | `41,430ms` | `41.18s` | `48.66s` | `7.48s` |
| **S6** | 3 điều kiện khắt khe khi khôi phục | `anchor(203, "Nhưng")` | `48,910ms` | `48.66s` | `58.34s` | `9.68s` |
| **S7** | Rủi ro từ chối & Câu chốt dễ nhớ | `anchor(243, "Nếu")` | `58,590ms` | `58.34s` | `71.14s` | `12.80s` |
| **S8** | Brand Outro Tiến Dương · Manulife | `anchor(294, "Nhắn")` | `71,390ms` | `71.14s` | `76.19s` | `5.05s` |

### 1.2. Hàm Neo & Tra Cứu Mili-giây Chuẩn (`anchor`, `T`, `E`)
```javascript
function anchor(idx, expectedWord) {
  const w = W[idx];
  if (!w) throw new Error(`Missing word index ${idx}`);
  const clean = w.w.replace(/[.,:;?!'"“”]/g, "").toLowerCase();
  const expClean = expectedWord.replace(/[.,:;?!'"“”]/g, "").toLowerCase();
  if (clean !== expClean) {
    throw new Error(`Anchor mismatch at index ${idx}: expected '${expectedWord}', got '${w.w}'`);
  }
  return w.s;
}
const T = (idx) => Math.max(0, W[idx].s);
const E = (idx) => Math.max(0, W[idx].e);
```

### 1.3. Mốc Word Index Trọng Tâm Nhấn Hiệu Ứng (`T(wordIndex)`)
- **S1**: `W[3]` ("trễ" `0.861s`), `W[8]` ("một" `1.837s`), `W[14]` ("hủy" `2.871s`), `W[16]` ("mất" `3.334s`), `W[23]` ("không" `5.133s`), `W[29]` ("hai" `6.554s`), `W[30]` ("mốc" `6.744s`).
- **S2**: `W[44]` ("60" `10.493s`), `W[45]` ("ngày" `10.630s`), `W[55]` ("kẹt" `13.199s`), `W[62]` ("chưa" `14.870s`), `W[69]` ("hai" `16.337s`), `W[70]` ("tháng" `16.528s`).
- **S3**: `W[80]` ("60" `19.692s`), `W[86]` ("bảo" `20.901s`), `W[93]` ("biến" `22.952s`), `W[98]` ("nợ" `24.044s`), `W[105]` ("chi" `25.399s`), `W[109]` ("trừ" `26.175s`), `W[117]` ("không" `28.032s`), `W[120]` ("sức" `28.721s`).
- **S4**: `W[127]` ("61" `31.115s`), `W[136]` ("tạm" `32.935s`), `W[147]` ("đóng" `35.681s`), `W[148]` ("băng." `35.925s`), `W[158]` ("không" `38.319s`), `W[160]` ("chi" `38.890s`).
- **S5**: `W[179]` ("2" `43.500s`), `W[180]` ("năm" `43.565s`), `W[183]` ("khôi" `44.082s`), `W[186]` ("hợp" `44.794s`), `W[194]` ("mua" `46.340s`), `W[199]` ("đắt" `47.300s`).
- **S6**: `W[206]` ("60" `49.695s`), `W[214]` ("đóng" `51.658s`), `W[224]` ("thẩm" `53.762s`), `W[227]` ("sức" `54.496s`), `W[235]` ("thời" `56.165s`), `W[237]` ("chờ" `56.699s`).
- **S7**: `W[251]` ("phát" `60.483s`), `W[265]` ("loại" `63.440s`), `W[268]` ("từ" `64.169s`), `W[272]` ("60" `65.609s`), `W[278]` ("không" `66.918s`), `W[283]` ("2" `68.391s`), `W[290]` ("xét" `69.768s`).
- **S8**: `W[294]` ("Nhắn" `71.390s`), `W[295]` ("'KẾ" `71.626s`), `W[296]` ("HOẠCH'" `71.803s`).

---

## PHẦN 2: PALETTE & TACTILE CANVAS MATH (`:root` & `rng(20261113)`)

### 2.1. Khóa cứng CSS Variables (`:root`)
```css
:root {
  --bg-stage: #F5F2EB;
  --bg-surface: #ECE7DC;
  --bg-elevated: #FFFDF8;
  --bg-frost: rgba(232, 240, 245, 0.84);
  --bg-overlay: rgba(26, 35, 58, 0.90);

  --c-ink: #1E3A8A;
  --c-ink-dark: #1A233A;
  --c-ink-secondary: #475569;
  --c-ink-dim: #C7C2B4;

  --c-accent-hl: #FDE047;
  --c-brand: #00A758;
  --c-brand-dark: #006B38;
  --c-teal: #0D9488;
  --c-amber: #D97706;
  --c-danger: #C2352B;

  --lamp-glow: radial-gradient(circle 850px at 50% 38%, rgba(255, 253, 248, 0.85) 0%, rgba(245, 242, 235, 0) 80%);
  --shadow-tactile: 0 14px 38px rgba(26, 35, 58, 0.12), 0 4px 10px rgba(26, 35, 58, 0.06);
  --shadow-stamp: 0 6px 16px rgba(194, 53, 43, 0.22);
  --font-main: "Be Vietnam Pro", sans-serif;
}
```

### 2.2. Procedural Canvas 2D (`rng(20261113)`) & Không gian sống
- **`#paper-canvas` (`1080×1920`)**:
  - Hàm `rng(seed = 20261113)` dùng LCG `(s * 16807) % 2147483647` vẽ nền `#F5F2EB`, `38,000` vi sợi cellulose `rgba(30, 58, 138, 0.022)`, lưới chấm tọa độ CAD `80px` màu `rgba(30, 58, 138, 0.11)`, và 2 đường khung bản vẽ kiến trúc mảnh ở lề (`x = 44px..1036px`, `y = 44px..1876px`).
- **`#dust .mote`**:
  - Tạo `26` hạt bụi ánh sáng (`size: 3–7px`, màu vàng ấm/trắng ngà `rgba(253, 224, 71, 0.38)` / `rgba(255, 253, 248, 0.72)`) trong vùng chiếu sáng bàn soi `#lamp`.
  - Lặp hữu hạn an toàn: `repeat: Math.max(0, Math.floor(TOTAL / cyc) - 1)`, `yoyo: true`, `ease: "sine.inOut"`.
- **Sân khấu `#cam` thở liên tục**:
  - `S1..S7`: `tl.fromTo('#cam', { scale: 1.0 }, { scale: 1.045, duration: sc.dur, ease: 'sine.inOut' }, sc.s)`.
  - `S8`: `tl.fromTo('#cam', { scale: 1.0 }, { scale: 1.025, duration: sc.dur, ease: 'sine.inOut' }, sc.s)`.
  - Bảo đảm `0 freeze events` trên toàn bộ `76.19s`.

---

## PHẦN 3: KIẾN TRÚC DOM & SVG 3 LỚP (`1080×1920`)

Vùng an toàn bố cục:
- **Header/Marginalia Top**: `y: 95px..165px` (ký hiệu bản vẽ kỹ thuật mờ `REF // LUAT-KDBH · 60D-2Y`, opacity `0.32`).
- **Main Living Mechanism Stage**: `x: 70px..1010px`, `y: 230px..1420px` (rộng rãi, khoảng thở lớn, tuyệt đối tách biệt vùng phụ đề!).
- **Karaoke Subtitle Safe Zone (`#subs`)**: `bottom: 185px` (`y: 1520px..1735px`), `width: 940px`, căn giữa `left: 70px`.

Cấu trúc 3 lớp:
- **Lớp 1 (Background)**:
  - `<canvas id="paper-canvas" width="1080" height="1920">`
  - `<div id="lamp">` (Radial gradient ánh sáng bàn soi)
  - `<div id="dust">` (26 `.mote` particles)
- **Lớp 2 (Midground `#cam` — 8 scenes `.clip.scene` với `.wrap` có `data-layout-allow-overlap data-layout-allow-occlusion`)**:
  - **S1 (`#s1`) — Phá vỡ hiểu lầm**:
    - Nhãn lề mờ trên cùng: `HIỂU LẦM PHỔ BIẾN`
    - Cụm chữ lớn: `TRỄ 1 NGÀY` (`64px`, `#1A233A`) + `= MẤT SẠCH?` (`76px`, `#C2352B`), đi kèm thanh gạch ngang SVG `#s1-strike` (`stroke="#C2352B"`, `strokeWidth="12"`).
    - Bên dưới là trục bản vẽ kiến trúc `#s1-track` (`y = 980px`) tự vẽ từ trái sang phải với 2 chốt tọa độ cơ học bật nảy: chốt trái `#s1-node1` (`60 NGÀY` — xanh ngọc lục bảo `#00A758`) và chốt phải `#s1-node2` (`2 NĂM` — hổ phách `#D97706`), kèm các vạch skeleton trừu tượng bên dưới thay chữ dài.
  - **S2 (`#s2`) — Mốc 1: 60 ngày gia hạn đóng phí**:
    - Tiêu đề bản vẽ: `MỐC 01 · GIA HẠN ĐÓNG PHÍ` (`44px`, `#1E3A8A`).
    - Cơ chế sống: Thước đo micromet lớn `#s2-ruler` (`width: 860px`, khắc 60 vạch chia `01 → 60`), vùng đệm sáng dạ quang `#s2-hl-band` (`#FDE047`, `mix-blend-mode: multiply`), kim thước cơ học `#s2-needle` trượt từ vạch `01` đến `60`, đồng hồ số `font-variant-numeric: tabular-nums` `#s2-day-num` đếm `01 → 60 NGÀY` (`96px`, `#1A233A`), kèm chú thích ngắn `"THÊM 2 THÁNG XOAY XỞ"`.
    - Dưới thước đo là chốt bảo vệ `#s2-gate` ở trạng thái mở thông mạch xanh `#00A758`.
  - **S3 (`#s3`) — Quyền lợi bên trong 60 ngày**:
    - Tiêu đề: `TRONG 60 NGÀY GIA HẠN` (`44px`, `#1E3A8A`).
    - Cơ chế sống trung tâm: Chiếc khiên bản vẽ kỹ thuật `#s3-shield` (`#00A758`, ở `y = 430px..820px`) phát xung sóng an toàn + con dấu cơ học hình chữ nhật nghiêng `-6deg` `#s3-stamp` (**`VẪN BẢO VỆ`**) dập nảy lên mặt giấy.
    - Thanh cơ chế chi trả trực quan `#s3-payout` (`y = 890px..1130px`): Thanh quyền lợi `100% QUYỀN LỢI` tự tách nhẹ một khớp nhỏ `- PHÍ CÒN NỢ` và giữ nguyên phần chi trả chính (không dùng card hộp; chỉ dùng thanh kiến trúc có đường kích thước CAD).
    - Nhãn đáy quẹt bút dạ quang `#s3-nohealth`: **`KHÔNG HỎI LẠI SỨC KHỎE`** thấm vàng `#FDE047`.
  - **S4 (`#s4`) — Ranh giới Ngày 61: Đóng băng**:
    - Tiêu đề: `BƯỚC SANG NGÀY THỨ 61` (`44px`, `#C2352B`).
    - Cơ chế sống: Thước đo vạch ranh giới đỏ `NGÀY 60 | NGÀY 61`, kim thước `#s4-needle` vượt qua vạch 61 làm chốt khóa cơ học `#s4-lock` sập ngàm xuống.
    - Lớp kính mờ băng giá `#s4-frost` (`--bg-frost` + họa tiết tinh thể băng SVG mảnh) trượt che phủ toàn bộ khiên bảo vệ qua `clip-path`, con dấu cảnh báo `#s4-stamp` (**`TẠM ĐÓNG BĂNG`**) dập xuống, đường mạch chi trả bên dưới đứt đoạn với nhãn **`KHÔNG CHI TRẢ`**.
  - **S5 (`#s5`) — Mốc 2: 2 năm khôi phục hợp đồng cũ**:
    - Tiêu đề: `MỐC 02 · KHÔI PHỤC HỢP ĐỒNG` (`44px`, `#1E3A8A`).
    - Cơ chế sống "Telescoping Chronometer": Trục thước đo thu phóng tỷ lệ mở rộng ra **`0 → 24 THÁNG (2 NĂM)`** (`#s5-num`: `2 NĂM`, `92px`, `#D97706`).
    - So sánh trực quan bằng 2 đường dốc kiến trúc (tuyệt đối không dùng card): Đường dưới **`GIỮ HỢP ĐỒNG CŨ`** (phí ổn định, xanh `#00A758`) vs Đường trên **`MUA MỚI THEO TUỔI`** (dốc tăng cao theo tuổi, đỏ/xám `#C2352B`).
  - **S6 (`#s6`) — 3 điều kiện khắt khe khi khôi phục**:
    - Tiêu đề: `3 ĐIỀU KIỆN KHÔI PHỤC` (`44px`, `#1E3A8A`).
    - Cơ chế sống 3 khóa kiểm định dọc trục thời gian (mỗi khóa là một cơ cấu SVG vận động theo lời thoại, không dùng thẻ card hộp):
      1. `#s6-c1` (`y = 430px`): Khớp rãnh cơ học **`01 · ĐÓNG BÙ PHÍ THIẾU`** (thanh trượt khớp vào ngàm).
      2. `#s6-c2` (`y = 690px`): Tờ hồ sơ skeleton lines có chiếc **Kính lúp quang học `#s6-loupe`** trượt ngang rọi sáng chữ **`02 · THẨM ĐỊNH LẠI SỨC KHỎE`**.
      3. `#s6-c3` (`y = 950px`): Mặt đồng hồ kỹ thuật cơ khí **`03 · TÍNH LẠI THỜI GIAN CHỜ`** với kim quay lùi về vạch `0`.
  - **S7 (`#s7`) — Rủi ro từ chối & Câu chốt so sánh**:
    - Nửa trên (`y = 330px..780px`): Tờ đơn khôi phục có kính lúp rọi trúng vệt đỏ cảnh báo sức khỏe mới → con dấu đỏ **`LOẠI TRỪ / TỪ CHỐI`** (`#s7-reject`) dập nảy lên mặt giấy (`back.out(1.7)`).
    - Nửa dưới (`y = 830px..1280px`): Cán cân / Trục so sánh 2 cực tối giản (không card):
      * Trái/Trên: **`60 NGÀY`** + vệt dạ quang vàng + **`BẢO VỆ · KHÔNG HỎI SỨC KHỎE`** (`#00A758`).
      * Phải/Dưới: **`2 NĂM`** + mực hổ phách + **`XÉT LẠI TỪ ĐẦU`** (`#D97706`).
  - **S8 (`#s8`) — Brand Outro Tiến Dương · Manulife**:
    - Căn giữa tuyệt đối (`Center X = 540px`, `left: 90px; width: 900px; text-align: center; display: flex; flex-direction: column; align-items: center;`).
    - Toàn bộ thành phần (`#o-badge` chứa `assets/branding/manulife-logo.png` trên nền `#008744`, `#o-name` `TIẾN DƯƠNG`, `#o-title` `Chuyên Gia Hoạch Định Tài Chính · Manulife Việt Nam`, `#o-rule`, `#o-cta` `Nhắn 'KẾ HOẠCH'`, `#o-sub`, `#o-handle` `@tienduong`, `#o-disc`) xuất hiện đầy đủ trong `0.15s..0.85s` đầu cảnh (`S8 + 0.15s`), sau đó quét bút dạ quang vàng `#FDE047` qua cụm `'KẾ HOẠCH'` đúng tại `T(295)`.
- **Lớp 3 (Foreground `#subs`)**:
  - `data-layout-allow-overlap` trên `#subs`.
  - Phụ đề Karaoke chia 9–10 từ/dòng (`.sub-line`), tắt dòng cũ tại `W[SUB[li + 1][0]].s - 0.04` trước khi dòng mới mở.
  - Từ đang đọc `.sub-word`: `margin: 0 5px`, `scale: 1.18`, `y: -6`, `color: '#FDE047'`, `ease: 'back.out(3)'`.

---

## PHẦN 4: KỊCH BẢN DIỄN HOẠT GSAP GẮN TRỰC TIẾP `T(wordIndex)`

### 4.1. Kỷ luật Easing Vật lý
- Rơi, đập dấu, sập khóa, bật chốt: `back.out(1.7)` hoặc `elastic.out(1, 0.5)`.
- Trượt thước đo, kính lúp, quét dạ quang, gạch chữ, màn kính mờ: `power2.inOut` hoặc `expo.out`.
- Cấm tuyệt đối `power1.out`, `power1.inOut`, `none`, `linear`.

### 4.2. Choreography Chi Tiết 8 Cảnh (`T(idx)` & `E(idx)`)
1. **S1 (`0.00s – 9.42s`)**:
   - `0.05s`: Nhãn lề & cụm chữ `TRỄ 1 NGÀY = MẤT SẠCH?` bật lên (`back.out(1.6)`).
   - `T(16)` ("mất" `3.334s`): Thanh gạch ngang đỏ `#s1-strike` quét `scaleX: 0 → 1` (`duration: 0.45s`, `ease: "expo.out"`).
   - `T(23)` ("không" `5.133s`): Cụm hiểu lầm mờ bớt (`opacity: 0.25`) và thu nhẹ lên trên, trục thước bản vẽ `#s1-track` tự vẽ `strokeDashoffset → 0` (`ease: "power2.inOut"`).
   - `T(29)` ("hai" `6.554s`) & `T(30)` ("mốc"): Hai chốt tọa độ `60 NGÀY` (`#s1-node1`) và `2 NĂM` (`#s1-node2`) bật nảy liên tiếp (`back.out(1.7)`).
   - `9.42s`: `#s1` mờ gọn `opacity: 0` (`0.22s`, `ease: "power2.inOut"`).
2. **S2 (`9.42s – 17.81s`)**:
   - `9.42s`: `#s2` hiện rõ (`0.25s`, `ease: "power2.out"`).
   - `T(44)` ("60" `10.493s`): Kim thước `#s2-needle` trượt mượt từ mốc 01 đến 60 (`duration: 2.2s`, `ease: "power2.inOut"`), đồng thời vệt dạ quang `#s2-hl-band` quét sáng vùng đệm (`scaleX: 0 → 1`) và counter `#s2-day-num` nhảy số `1 → 60` (tính qua proxy object trong `onUpdate`).
   - `T(62)` ("chưa" `14.870s`): Chốt bảo vệ `#s2-gate` nhún sáng khẳng định trạng thái vẫn mở (`back.out(1.5)`).
   - `T(69)` ("hai" `16.337s`): Nhãn phụ `"THÊM 2 THÁNG XOAY XỞ"` trượt quét sáng (`expo.out`).
3. **S3 (`17.81s – 29.61s`)**:
   - `17.81s`: `#s3` hiện rõ, khiên bảo vệ `#s3-shield` bung nở đàn hồi (`scale: 0.7 → 1`, `ease: "back.out(1.6)"`).
   - `T(86)` ("bảo" `20.901s`): Con dấu cơ học `#s3-stamp` (`VẪN BẢO VỆ`) dập nảy xuống góc khiên (`scale: 1.8 → 1`, `ease: "back.out(1.7)"`).
   - `T(105)` ("chi" `25.399s`) → `T(109)` ("trừ" `26.175s`): Thanh chi trả `#s3-payout` hiện ra, phần `- PHÍ CÒN NỢ` tách trượt nhẹ sang phải (`expo.out`), giữ vững khối chi trả chính xanh ngọc `#00A758`.
   - `T(117)` ("không" `28.032s`): Bút dạ quang vàng quét ngang nhãn `#s3-nohealth` (`KHÔNG HỎI LẠI SỨC KHỎE`, `ease: "power2.inOut"`).
4. **S4 (`29.61s – 41.18s`)**:
   - `29.61s`: `#s4` hiện rõ với vạch đỏ `NGÀY 61`.
   - `T(127)` ("61" `31.115s`): Kim thước vượt vạch đỏ, chốt khóa cơ học `#s4-lock` sập ngàm xuống (`y: -45 → 0`, `ease: "elastic.out(1, 0.5)"`).
   - `T(136)` ("tạm" `32.935s`) → `T(147)` ("đóng" `35.681s`): Lớp kính mờ `#s4-frost` trượt khép phủ kín khiên bảo vệ (`clipPath`, `ease: "power2.inOut"`), con dấu `#s4-stamp` (`TẠM ĐÓNG BĂNG`) dập nảy (`back.out(1.7)`).
   - `T(158)` ("không" `38.319s`): Đường dẫn chi trả gãy ngắt kèm nhãn đỏ `KHÔNG CHI TRẢ` nhấp nảy (`back.out(1.6)`).
5. **S5 (`41.18s – 48.66s`)**:
   - `41.18s`: `#s5` hiện rõ, trục thước thu phóng mở ra `0 → 24 THÁNG` (`expo.out`).
   - `T(179)` ("2" `43.500s`): Số lớn `#s5-num` (`2 NĂM`) bật nảy (`back.out(1.7)`).
   - `T(186)` ("hợp" `44.794s`): Đường nét xanh `GIỮ HỢP ĐỒNG CŨ` tự vẽ thẳng đều (`strokeDashoffset → 0`, `ease: "power2.inOut"`).
   - `T(194)` ("mua" `46.340s`) → `T(199)` ("đắt" `47.300s`): Đường đỏ `MUA MỚI THEO TUỔI` vẽ dốc đứng lên trên (`expo.out`), làm rõ sự chênh lệch chi phí.
6. **S6 (`48.66s – 58.34s`)**:
   - `48.66s`: `#s6` hiện rõ khung 3 chốt điều kiện.
   - `T(214)` ("đóng" `51.658s`): Chốt 1 (`ĐÓNG BÙ PHÍ THIẾU`) trượt khớp vào rãnh (`x: -60 → 0`, `ease: "back.out(1.5)"`).
   - `T(224)` ("thẩm" `53.762s`): Kính lúp quang học `#s6-loupe` trượt ngang qua các vạch skeleton của hồ sơ sức khỏe (`x: -180 → 180`, `ease: "power2.inOut"`).
   - `T(235)` ("thời" `56.165s`): Kim đồng hồ thời gian chờ `#s6-clock-hand` xoay ngược `-270deg → 0deg` (`ease: "elastic.out(1, 0.6)"`) quay lại vạch ban đầu.
7. **S7 (`58.34s – 71.14s`)**:
   - `58.34s`: `#s7` hiện rõ tờ đơn khôi phục ở nửa trên.
   - `T(251)` ("phát" `60.483s`): Vệt cảnh báo đỏ lóe lên dưới kính lúp (`power2.out`).
   - `T(265)` ("loại" `63.440s`) → `T(268)` ("từ" `64.169s`): Con dấu đỏ `#s7-reject` (`LOẠI TRỪ / TỪ CHỐI`) đập nảy mạnh xuống tờ đơn (`scale: 2.1 → 1`, `ease: "back.out(1.7)"`).
   - `T(272)` ("60" `65.609s`): Vế đối chiếu `60 NGÀY: BẢO VỆ · KHÔNG HỎI SỨC KHỎE` bật sáng + quẹt bút dạ quang vàng (`power2.inOut`).
   - `T(283)` ("2" `68.391s`): Vế đối chiếu `2 NĂM: XÉT LẠI TỪ ĐẦU` hiện rõ bên dưới tạo thế tương phản đắt giá (`expo.out`).
8. **S8 (`71.14s – 76.19s`)**:
   - `71.14s`: `#s8` hiện rõ. Toàn bộ thành phần thẻ thương hiệu Tiến Dương · Manulife (`#o-badge`, `#o-name`, `#o-title`, `#o-rule`, `#o-cta`, `#o-sub`, `#o-handle`, `#o-disc`) trượt nảy hoàn chỉnh trong `0.15s..0.85s` đầu (`ease: "back.out(1.4)"`, đảm bảo frame 90% đầy đủ 100%).
   - `T(295)` ("'KẾ" `71.626s`) → `E(296)` ("HOẠCH'" `72.157s`): Bút dạ quang vàng `#FDE047` quét sáng cụm `'KẾ HOẠCH'` (`ease: "power2.inOut"`) và nút CTA nhún nhẹ (`back.out(1.7)`).
   - `72.2s..76.19s`: Thẻ giữ nhịp micro-motion trôi nhẹ (`y: 0 → -8`, `sine.inOut`) + hạt bụi + `#cam` thở (`scale: 1 → 1.025`) đến hết video.
