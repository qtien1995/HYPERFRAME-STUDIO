# PRODUCTION BLUEPRINT — Thủy Tổ Bảo Hiểm Bắt Nguồn Từ Đâu? (`nguon-goc-bao-hiem`)

> **Tài liệu khóa cứng thiết kế & toán đồ họa trước khi biên dịch `build-index.cjs` (Pha 2 Lock)**
> - **Audio đo thực tế (`Hải Đăng 48kHz`, `speed: 1.0`)**: `52.956s` (`52956ms`, `223 words`)
> - **Outro Tail**: `1.800s` ➔ **Tổng thời lượng `TOTAL`**: `54.756s` (`1643 frames` @ `30fps`)
> - **Mốc kiểm định `storyboard-check`**: `10% = 5.48s` (S2), `30% = 16.43s` (S5), `50% = 27.38s` (S7), `70% = 38.33s` (S10), `90% = 49.28s` (S13 Outro).

---

## PHẦN 1 — WORD TIMING & SCENE ANCHORS (`timing.json`)

### 1.1. Bảng Neo Chuyển Cảnh (`anchor(wordIdx, expectedWord)`)
Sử dụng `LEAD_SENTENCE = 0.25` (khi chuyển câu có nhịp nghỉ) và `LEAD_CLAUSE = 0.12` (khi chuyển vế câu liền mạch):

| Scene | Start (s) | End (s) | Duration (s) | Anchor Cut Formula | Word Range | Nội dung lời thoại |
|:---|:---|:---|:---|:---|:---|:---|
| **S1** | `0.000` | `3.241` | `3.241` | `0` | `0..15` | Ít ai ngờ thủy tổ của bảo hiểm không bắt nguồn từ hợp đồng hiện đại, |
| **S2** | `3.241` | `5.560` | `2.319` | `anchor(16, "mà") - 0.12` | `16..24` | mà từ nỗi lo lật thuyền trên sông dữ. |
| **S3** | `5.560` | `9.740` | `4.180` | `anchor(25, "Thời") - 0.25` | `25..42` | Thời cổ đại, thương nhân qua sông Trường Giang hiểm trở không dồn hết hàng lên một thuyền. |
| **S4** | `9.740` | `15.100` | `5.360` | `anchor(43, "Họ") - 0.25` | `43..63` | Họ chia nhỏ gửi đều sang nhiều chiếc cùng đi, để nếu một thuyền gặp xoáy nước, chẳng ai mất trắng. |
| **S5** | `15.100` | `19.000` | `3.900` | `anchor(64, "Sau") - 0.25` | `64..76` | Sau đó, người Lưỡng Hà khắc nguyên tắc này vào bộ luật Hammurabi. |
| **S6** | `19.000` | `24.750` | `5.750` | `anchor(77, "Người") - 0.25` | `77..101` | Người đi biển đóng thêm một phần phí nhỏ, để nếu bão đánh chìm tàu ngoài khơi, họ được miễn hoàn trả vốn ban đầu. |
| **S7** | `24.750` | `29.510` | `4.760` | `anchor(102, "Đến") - 0.25` | `102..121` | Đến thời Hy Lạp cổ đại, thủy thủ vùng Địa Trung Hải lại đặt ra quy ước tổn thất chung. |
| **S8** | `29.510` | `34.250` | `4.740` | `anchor(122, "Nếu") - 0.25` | `122..141` | Nếu phải ném bớt hàng xuống biển để cứu cả con tàu, mọi chủ hàng cùng góp phần bù đắp. |
| **S9** | `34.250` | `36.876` | `2.626` | `anchor(142, "Thế") - 0.25` | `142..153` | Thế kỷ mười bảy, tại quán cà phê ven cảng Luân Đôn, |
| **S10** | `36.876` | `43.200` | `6.324` | `anchor(154, "giới") - 0.12` | `154..178` | giới thương nhân ký tên ngay dưới bản danh sách tàu để cùng chia rủi ro. Ngành bảo hiểm hiện đại thành hình từ đó. |
| **S11** | `43.200` | `45.666` | `2.466` | `anchor(179, "Hàng") - 0.25` | `179..188` | Hàng nghìn năm trôi qua, nguyên lý vẫn vẹn nguyên, |
| **S12** | `45.666` | `48.870` | `3.204` | `anchor(189, "góp") - 0.12` | `189..202` | góp bình an của số đông đỡ lấy một gia đình lúc giông bão. |
| **S13** | `48.870` | `54.756` | `5.886` | `anchor(203, "Nhắn") - 0.25` | `203..222` | Nhắn 'KẾ HOẠCH' để Tiến Dương cùng bạn rà soát lại lá chắn tài chính cho gia đình mình nhé. |

### 1.2. Bảng Chỉ Số Từ Khóa Neo Hiệu Ứng (`T(idx)` & `E(idx)`)
- **S1**: `T(0)=0.000` (Ít), `T(3)=0.444` (thủy), `T(4)=0.698` (tổ), `T(8)=1.459` (không), `T(12)=2.410` (hợp đồng hiện đại).
- **S2**: `T(18)=3.613` (nỗi lo), `T(20)=3.928` (lật), `T(21)=4.117` (thuyền), `T(23)=4.747` (sông dữ).
- **S3**: `T(28)=6.316` (thương nhân), `T(32)=7.192` (Trường Giang), `T(36)=8.120` (không dồn), `T(39)=8.688` (hàng), `T(41)=9.049` (một thuyền).
- **S4**: `T(44)=10.113` (chia nhỏ), `T(49)=11.157` (nhiều chiếc), `T(55)=12.508` (một thuyền), `T(58)=13.245` (xoáy nước), `T(60)=13.800` (chẳng ai mất trắng).
- **S5**: `T(67)=16.072` (Lưỡng Hà), `T(69)=16.531` (khắc), `T(74)=17.777` (bộ luật), `T(76)=18.170` (Hammurabi).
- **S6**: `T(80)=19.888` (đóng thêm), `T(84)=20.758` (phí nhỏ), `T(88)=21.454` (bão đánh chìm), `T(96)=23.191` (miễn hoàn trả), `T(99)=23.829` (vốn ban đầu).
- **S7**: `T(104)=25.453` (Hy Lạp), `T(111)=26.868` (Địa Trung Hải), `T(119)=28.468` (tổn thất chung).
- **S8**: `T(124)=30.192` (ném bớt hàng), `T(130)=31.488` (cứu cả con tàu), `T(134)=32.229` (mọi chủ hàng), `T(140)=33.510` (bù đắp).
- **S9**: `T(142)=34.500` (Thế kỷ mười bảy), `T(147)=35.499` (quán cà phê), `T(152)=36.498` (Luân Đôn).
- **S10**: `T(157)=37.861` (ký tên), `T(160)=38.417` (dưới bản danh sách), `T(167)=39.899` (chia rủi ro), `T(170)=40.940` (Ngành bảo hiểm hiện đại).
- **S11**: `T(179)=43.450` (Hàng nghìn năm), `T(184)=44.590` (nguyên lý), `T(187)=45.217` (vẹn nguyên).
- **S12**: `T(189)=45.786` (góp bình an), `T(193)=46.509` (số đông), `T(195)=46.870` (đỡ lấy), `T(198)=47.352` (gia đình), `T(201)=47.955` (giông bão).
- **S13**: `T(204)=49.336` ('KẾ), `T(205)=49.498` (HOẠCH'), `T(207)=49.930` (Tiến Dương), `T(214)=51.280` (lá chắn tài chính).

---

## PHẦN 2 — PALETTE & TACTILE CANVAS MATH

### 2.1. Khóa cứng CSS Variables (`:root`)
```css
:root {
  --bg-stage: #F4EFE6;
  --bg-surface: #EAE2D3;
  --bg-elevated: #FFFDF8;
  --bg-overlay: rgba(31, 29, 26, 0.90);

  --ink-primary: #1F1D1A;
  --ink-secondary: #5A5247;
  --ink-dim: #C7BEA9;
  --ink-nautical: #1E3A5F;

  --accent-highlight: #FDE047;
  --accent-amber: #B45309;
  --accent-teal: #0D9488;
  --accent-brand: #00A758;
  --status-danger: #C2352B;
  --status-success: #00A758;

  --lamp-glow: radial-gradient(circle 860px at 50% 40%, rgba(255, 253, 245, 0.85) 0%, rgba(244, 239, 230, 0) 80%);
  --shadow-tactile: 0 16px 40px rgba(31, 29, 26, 0.12), 0 4px 12px rgba(31, 29, 26, 0.06);
}
```

### 2.2. Thuật toán Procedural Canvas (`rng(seed)`)
Sử dụng Mulberry32 deterministic PRNG `rng(20261113)` vẽ lên `<canvas id="bg-canvas" width="1080" height="1920">`:
1. Tô nền giấy vellum `--bg-stage` (`#F4EFE6`).
2. Vẽ `42,000` hạt vi sợi cellulose (`rgba(31, 29, 26, 0.024)`, bán kính `0.5..1.3px`).
3. Vẽ lưới kinh vĩ tuyến hải đồ cổ siêu mảnh (`rgba(30, 58, 95, 0.042)`, khoảng cách `180px`) cùng 2 đường viền kép khổ giấy (`inset 36px` và `inset 48px`, `rgba(90, 82, 71, 0.14)`) và hoa gió la bàn mờ ở góc trên phải (`opacity: 0.08`).

### 2.3. Không gian sống liên tục (Zero Dead Frame)
- **Hạt bụi sáng `#dust .mote`**: `26` hạt bụi ánh sáng ấm (`#FFFDF8` / `#FDE047` bán trong suốt, size `4..11px`, blur `1..2px`) sinh tọa độ bằng `rng(20261113)`, trôi dạt theo `ease: "sine.inOut"` với `repeat: Math.max(0, Math.floor(TOTAL / cyc) - 1)` (tuyệt đối không dùng `repeat: -1`).
- **Sân khấu `#cam` thở liên tục**:
  - S1..S12: `tl.fromTo('#cam', { scale: 1.0 }, { scale: 1.045, duration: s.dur, ease: 'sine.inOut', immediateRender: i === 0 }, s.start)`
  - S13 Outro: `tl.fromTo('#cam', { scale: 1.0 }, { scale: 1.025, duration: s.dur, ease: 'sine.inOut', immediateRender: false }, s.start)`

---

## PHẦN 3 — 3-LAYER DOM/SVG ARCHITECTURE (`1080 × 1920`)

Toàn bộ bố cục tuân thủ vùng an toàn thị giác:
- **Vùng Header / Marginalia trên**: `y: 120px – 220px` (nhãn niên đại mờ / chủ đề nhỏ).
- **Vùng Sân khấu Trung tâm (Single Central Metaphor)**: `x: 80px – 1000px`, `y: 230px – 1420px` (tâm ngang `540px`).
- **Vùng An toàn Phụ đề Karaoke (`#subs`)**: `bottom: 185px` (`y: 1535px – 1735px`), tuyệt đối tách rời khỏi vùng đồ họa chính để **không bao giờ đè chữ**.

Mỗi `.clip.scene` gồm 3 lớp lồng trong `.wrap`:
1. **Lớp 1 (Background Materiality — dùng chung ngoài `.scene`)**: `#bg-canvas` (Procedural Vellum + Lưới Hải Đồ) + `#lamp` (Ánh sáng bàn soi rọi xuống tâm).
2. **Lớp 2 (Midground Living Mechanism — riêng từng cảnh `.scene`)**: Sơ đồ SVG vector + vật thể cơ học vận động + skeleton lines (chỉ giữ tối đa 1 cụm từ khóa / con dấu đắt giá per scene).
3. **Lớp 3 (Foreground Optical & Ambient — dùng chung)**: `#dust` (26 hạt bụi ánh sáng) + `#subs` (Phụ đề Karaoke).

### Tọa độ chi tiết 13 Cảnh (Center X = `540px`):
- **S1 (`#s1`)**: Tập hợp đồng giấy vellum (`520×660px`, `x=280, y=340`) chứa 9 vạch trừu tượng (`skeleton lines`) + dòng `HỢP ĐỒNG HIỆN ĐẠI`. Nét gạch chéo đỏ SVG (`M 240 420 L 840 940`, `M 840 420 L 240 940`, `stroke-width: 14px`) + con dấu `KHÔNG PHẢI TỪ ĐÂY` (`y=1120`).
- **S2 (`#s2`)**: Tiêu đề lớn `THỦY TỔ BẢO HIỂM` (`y=250`, `font-size: 74px`, `900`), phía dưới (`y=460..1120`) là SVG 5 tầng đường đồng mức sóng sông cuộn xoáy (`stroke: #1E3A5F`) + **con thuyền gỗ đơn độc** ở tâm `(540, 740)` nghiêng xoay quanh tâm đáy + vạch cảnh báo đỏ `LẬT THUYỀN` (`y=1160`) được bút dạ quang vàng `#FDE047` quét nền.
- **S3 (`#s3`)**: Nhãn niên đại mờ `TRƯỜNG GIANG · CỔ ĐẠI` (`y=210`). SVG sông hiểm với vạch mớn nước đỏ nguy hiểm (`y=880`). **1 chiếc thuyền lớn** ở tâm `(540, 780)` bị đè bởi **1 khối hàng hổ phách khổng lồ (`220×160px`)** làm thân thuyền chìm chạm vạch đỏ + nhãn `1 THUYỀN = 100% RỦI RO` (`y=1120`).
- **S4 (`#s4`)**: Nhãn mờ `PHÂN TÁN RỦI RO` (`y=210`). Hàng trên (`y=440`): khối hàng gốc tách thành **5 kiện hàng nhỏ (`84×68px`)** bay theo 5 quỹ đạo đáp xuống **5 con thuyền** xếp đều tại `x = [170, 355, 540, 725, 910]`, `y = 860`. Thuyền giữa (`x=540`) lọt vào vòng xoáy SVG đỏ nghiêng `28deg` + dấu `✕`; 4 thuyền còn lại bật sáng xanh ngọc `#0D9488` + con dấu `CHẲNG AI MẤT TRẮNG` (`y=1160`).
- **S5 (`#s5`)**: Nhãn mờ `LƯỠNG HÀ · ~1750 TCN` (`y=210`). **Tấm bia đất nung vát đỉnh** (`540×760px`, tâm `x=540, y=680`, màu đất nung `#EAE2D3` viền `#B45309`) chứa 8 dòng ký tự hình nêm trừu tượng (`SVG path`) tự khắc sáng nét vàng + nhãn khắc nổi `BỘ LUẬT HAMMURABI` (`y=1180`).
- **S6 (`#s6`)**: Nhãn mờ `NGUYÊN TẮC CÂN BẰNG` (`y=210`). **Thanh đòn cân cơ học** trục tâm `(540, 620)`: đĩa trái treo **1 đồng xu phí nhỏ (`r=42px`, `#D97706`)**, đĩa phải mang **khối vốn tàu lớn (`160×120px`, `#1E3A5F`)** giữa nét sóng bão. Thanh cân xoay chốt cân bằng và đóng dập con dấu đất nung `MIỄN HOÀN TRẢ` (`y=1100`).
- **S7 (`#s7`)**: Nhãn mờ `HY LẠP CỔ ĐẠI · LEX RHODIA` (`y=210`). **Bản đồ hải trình Địa Trung Hải** SVG (`900×560px`, tâm `x=540, y=640`) vẽ nét đảo bờ biển mờ + đường hải trình đứt nét tự nối giữa 3 cảng biển + cuộn dấu sáp đỏ/xanh `TỔN THẤT CHUNG` (`y=1120`).
- **S8 (`#s8`)**: Nhãn mờ `CỨU CẢ CON TÀU` (`y=210`). Con tàu buồm SVG ở tâm `(540, 680)` ban đầu nghiêng `-22deg`. 1 kiện hàng rơi từ boong xuống vùng sóng (`y=920`), thân tàu lập tức bật thăng bằng `0deg`. Ngay dưới sóng, **4 cung lực màu xanh ngọc `#0D9488`** từ 4 góc dưới hội tụ lại điểm giữa bù đắp kiện hàng + nhãn `CÙNG GÓP BÙ ĐẮP` (`y=1180`).
- **S9 (`#s9`)**: Nhãn mờ `LUÂN ĐÔN · THẾ KỶ XVII` (`y=210`). **Mặt bàn gỗ quán cà phê cảng biển**: tờ hải đồ sông Thames trải phẳng bên dưới, góc trên phải đặt **tách cà phê sứ vẽ nét SVG mảnh (`r=110px`)** với 3 làn hơi ấm lượn sóng liên tục + dấu mốc mờ `LLOYD'S COFFEE HOUSE · 1688` (`y=1140`).
- **S10 (`#s10`)**: Nhãn mờ `NGUỒN GỐC BẢO HIỂM HIỆN ĐẠI` (`y=210`). **Trang sổ Manifest giấy elevated (`780×740px`, tâm `x=540, y=670`)**:
  - Nửa trên: Tiêu đề tàu trừu tượng + 4 dòng danh sách hàng skeleton lines.
  - Chính giữa (`y=660`): **1 Đường kẻ ngang đậm màu graphite (`width: 640px`)** với nhãn nhỏ `THE LINE`.
  - Nửa dưới đường kẻ (`y=710..920`): **3 nét chữ ký mực xanh hải quân (`#1E3A5F`) tự viết tuần tự** ngay dưới đường kẻ, kèm vệt dạ quang vàng quẹt sáng cụm `UNDER-WRITING (KÝ BÊN DƯỚI)` và con dấu xanh `CHIA RỦI RO` (`y=1160`).
- **S11 (`#s11`)**: Nhãn mờ `SỢI CHỈ XUYÊN SUỐT` (`y=210`). **Thước đo thời gian dọc/chéo thanh mảnh** với 5 điểm mốc phát sáng kết nối bằng đường SVG liên tục: `TRƯỜNG GIANG` → `HAMMURABI` → `ĐỊA TRUNG HẢI` → `LUÂN ĐÔN` → `HIỆN ĐẠI`, ở giữa nổi chữ lớn `NGUYÊN LÝ VẸN NGUYÊN` (`y=1140`).
- **S12 (`#s12`)**: Nhãn mờ `BẢN CHẤT NHÂN VĂN` (`y=210`). Chính giữa `(540, 740)` là **ngôi nhà nhỏ đường nét ấm áp (`#1F1D1A`)**. Từ **6 điểm neo cộng đồng** bên ngoài vòng tròn (`r=340px`), 6 cung lực đan lại thành **vòm lá chắn xanh lá Manulife (`#00A758`)** phía trên ngôi nhà. 3 mũi tên giông bão đỏ từ trên lao xuống chạm vòm lá chắn và bị bật dội tan biến, vòm nhún đàn hồi giữ nguyên ngôi nhà bình an + nhãn `SỐ ĐÔNG ĐỠ MỘT NHÀ` (`y=1180`).
- **S13 (`#s13` — Brand Outro)**: Thẻ giấy elevated `#FFFDF8` rộng `880px` (`left: 50%; margin-left: -440px`, **Center X = 540px tuyệt đối**), `top: 320px`, viền mảnh `rgba(31,29,26,0.12)` + bóng `--shadow-tactile`, chứa đầy đủ:
  - `#o-logo`: `assets/branding/manulife-logo.png` (height `72px`, căn giữa)
  - `#o-name`: `TIẾN DƯƠNG` (`48px`, `900`)
  - `#o-title`: `Chuyên Gia Hoạch Định Tài Chính · Manulife Việt Nam` (`26px`, `600`)
  - `#o-rule`: Thanh kẻ ngang emerald (`width: 180px`, `height: 4px`)
  - `#o-cta`: Hộp CTA nổi bật với vệt dạ quang vàng `#FDE047` phía sau chữ **`Nhắn 'KẾ HOẠCH'`** (`38px`, `800`)
  - `#o-sub`: `để nhận bản phân tích lá chắn tài chính cho gia đình` (`26px`, `500`)
  - `#o-handle`: `@tienduong` (`28px`, `700`, `#00A758`)
  - `#o-disc`: `Nội dung mang tính chất chia sẻ giải pháp · Tư vấn theo nhu cầu thực tế` (`20px`, `400`, `#5A5247`)

---

## PHẦN 4 — WORD-SYNCED GSAP CHOREOGRAPHY

### 4.1. Kỷ luật Easing Vật lý & Cấm Ease Phẳng
- **Tuyệt đối CẤM** `power1.out`, `power1.inOut`, `none`/`linear` cho mọi chuyển động chính của đồ họa.
- **Vật rơi, đập, nảy đàn hồi** (tách kiện hàng, đóng con dấu đất nung/sáp, tàu bật thăng bằng, vòm lá chắn hấp thụ bão, CTA box): dùng `ease: "back.out(1.7)"` hoặc `ease: "elastic.out(1, 0.5)"`.
- **Nét vẽ SVG, quẹt bút dạ quang, cân nghiêng, chữ ký tự viết, thước đo**: dùng `ease: "power2.inOut"` hoặc `ease: "expo.out"`.
- **Hạt bụi `#dust .mote` & nhịp thở `#cam`**: dùng `ease: "sine.inOut"`.

### 4.2. Kịch bản Timeline Chi tiết Neo vào `T(wordIndex)`
1. **Scene Transitions (Chống nhòe chữ đè lên nhau)**:
   - Mỗi cảnh `s` (`s1..s13`): xuất hiện rõ ngay đầu cảnh (`duration: 0.18, ease: 'expo.out'`) và **tắt hoàn toàn về `opacity: 0` trong `0.15s` ngay trước khi cảnh kế tiếp bắt đầu** (riêng `s13` giữ tới `TOTAL`) để ảnh PNG không bao giờ bị bóng ma cảnh cũ!
2. **S1 (`0.000s..3.241s`)**:
   - `T(0)` (`0.000s`): Tập hợp đồng hiện lên (`scale: 0.92 -> 1`, `ease: 'back.out(1.7)'`).
   - `T(8)` (`1.459s`, "không"): Nét gạch chéo đỏ #1 vẽ (`strokeDashoffset`, `0.28s`, `expo.out`), tiếp theo nét #2 tại `1.70s`, con dấu `KHÔNG PHẢI TỪ ĐÂY` đập nảy (`back.out(1.7)`).
3. **S2 (`3.241s..5.560s`)**:
   - `3.241s`: Tiêu đề `THỦY TỔ BẢO HIỂM` trượt vào (`expo.out`), sóng sông bắt đầu cuộn liên tục (`sine.inOut`).
   - `T(18)` (`3.613s`, "nỗi lo"): Con thuyền chao nghiêng mạnh (`rotation: -14 -> 18 -> -10`, `elastic.out(1, 0.5)`).
   - `T(20)` (`3.928s`, "lật thuyền"): Bút dạ quang vàng quẹt ngang dưới `LẬT THUYỀN` (`scaleX: 0 -> 1`, `power2.inOut`).
4. **S3 (`5.560s..9.740s`)**:
   - `5.560s`: Thuyền đơn độc nổi trên mực nước (`expo.out`).
   - `T(37)` (`8.378s`, "dồn hết hàng"): Khối hàng lớn rơi từ trên xuống boong (`y: -180 -> 0`, `back.out(1.7)`), thân thuyền chìm sát vạch đỏ (`y: +48px`, `power2.inOut`), nhãn `100% RỦI RO` nảy lên (`back.out(1.7)`).
5. **S4 (`9.740s..15.100s`)**:
   - `9.740s`: 5 con thuyền dàn hàng ngang (`stagger: 0.06`, `expo.out`).
   - `T(44)` (`10.113s`, "chia nhỏ"): 5 kiện hàng bay từ tâm tách tỏa xuống 5 thuyền (`back.out(1.7)`, `stagger: 0.08`).
   - `T(58)` (`13.245s`, "xoáy nước"): Vòng xoáy đỏ xuất hiện dưới thuyền #3, thuyền #3 nghiêng `28deg` (`elastic.out(1, 0.5)`).
   - `T(60)` (`13.800s`, "chẳng ai mất trắng"): 4 thuyền còn lại bật viền xanh ngọc + con dấu `CHẲNG AI MẤT TRẮNG` đập nảy (`back.out(1.7)`).
6. **S5 (`15.100s..19.000s`)**:
   - `15.100s`: Tấm bia đất nung nổi lên (`y: 40 -> 0`, `expo.out`).
   - `T(69)` (`16.531s`, "khắc"): 8 đường chữ hình nêm tự vẽ tuần tự (`strokeDashoffset`, `power2.inOut`).
   - `T(76)` (`18.170s`, "Hammurabi"): Niên đại `HAMMURABI · ~1750 TCN` quẹt sáng dạ quang vàng (`power2.inOut`).
7. **S6 (`19.000s..24.750s`)**:
   - `19.000s`: Trục đòn cân dựng lên (`expo.out`).
   - `T(84)` (`20.758s`, "phí nhỏ"): Đồng xu phí nhỏ rơi vào đĩa trái (`back.out(1.7)`), đòn cân nghiêng nhẹ.
   - `T(88)` (`21.454s`, "bão đánh chìm"): Sóng bão xô đĩa phải; `T(96)` (`23.191s`, "miễn hoàn trả"): Đòn cân chốt thăng bằng + con dấu `MIỄN HOÀN TRẢ` đập nảy mặt giấy (`elastic.out(1, 0.5)`).
8. **S7 (`24.750s..29.510s`)**:
   - `24.750s`: Hải đồ Địa Trung Hải mở ra (`expo.out`).
   - `T(111)` (`26.868s`, "Địa Trung Hải"): Đường hải trình SVG vẽ xuyên 3 cảng (`power2.inOut`).
   - `T(119)` (`28.468s`, "tổn thất chung"): Cuộn dấu `TỔN THẤT CHUNG · LEX RHODIA` đập nảy (`back.out(1.7)`).
9. **S8 (`29.510s..34.250s`)**:
   - `29.510s`: Tàu nghiêng `-22deg` trên sóng (`expo.out`).
   - `T(124)` (`30.192s`, "ném bớt hàng"): 1 kiện hàng rơi xuống đáy sóng (`power2.inOut`).
   - `T(130)` (`31.488s`, "cứu cả con tàu"): Con tàu bật thẳng đứng `0deg` (`elastic.out(1, 0.5)`).
   - `T(134)` (`32.229s`, "mọi chủ hàng... bù đắp"): 4 cung lực xanh ngọc chạy vào tâm (`power2.inOut`) + nhãn `CÙNG GÓP BÙ ĐẮP` nảy lên (`back.out(1.7)`).
10. **S9 (`34.250s..36.876s`)**:
    - `34.250s`: Mặt bàn gỗ & bản đồ Thames mở rộng (`expo.out`).
    - `T(147)` (`35.499s`, "quán cà phê"): Tách cà phê vẽ nét + 3 làn hơi ấm uốn lượn liên tục (`sine.inOut`) + dấu `LLOYD'S · 1688` hiện nét (`back.out(1.7)`).
11. **S10 (`36.876s..43.200s`)**:
    - `36.876s`: Trang sổ Manifest trải ra (`expo.out`), đường kẻ ngang `THE LINE` kẻ nét từ trái qua phải (`power2.inOut`).
    - `T(157)` (`37.861s`, "ký tên ngay dưới"): 3 nét chữ ký mực xanh tự viết lần lượt ngay dưới đường kẻ (`strokeDashoffset`, `power2.inOut`, `stagger: 0.35s`).
    - `T(167)` (`39.899s`, "chia rủi ro"): Quẹt dạ quang `UNDER-WRITING` (`power2.inOut`) + con dấu xanh `CHIA RỦI RO` đập nảy tại `T(170)` (`40.940s`, `elastic.out(1, 0.5)`).
12. **S11 (`43.200s..45.666s`)**:
    - `43.200s`: Sợi chỉ vàng SVG vẽ xuyên qua 5 điểm mốc lịch sử (`power2.inOut`), các điểm mốc bật nảy tuần tự (`back.out(1.7)`), chữ `NGUYÊN LÝ VẸN NGUYÊN` chốt ở `T(187)` (`45.217s`).
13. **S12 (`45.666s..48.870s`)**:
    - `45.666s`: Ngôi nhà nhỏ ở tâm hiện ra (`back.out(1.7)`).
    - `T(189)` (`45.786s`, "góp bình an của số đông"): 6 cung hợp lực vươn lên đan thành vòm lá chắn xanh Manulife (`power2.inOut`).
    - `T(201)` (`47.955s`, "giông bão"): Luồng bão đánh từ trên xuống, vòm lá chắn nảy đàn hồi (`elastic.out(1, 0.5)`) giữ vững ngôi nhà bình an.
14. **S13 (`48.870s..54.756s` — Brand Outro)**:
    - `48.920s .. 49.230s` (`S13 + 0.05s .. 0.36s`): Thẻ `#o-card` (căn giữa tuyệt đối `Center X = 540px`) cùng toàn bộ 8 thành phần (`#o-logo`, `#o-name`, `#o-title`, `#o-rule`, `#o-cta`, `#o-sub`, `#o-handle`, `#o-disc`) xuất hiện đầy đủ 100% với `back.out(1.7)` (bảo đảm tại frame 90% = `49.28s` thẻ đã hiện trọn vẹn).
    - `T(204)` (`49.336s`, `'KẾ HOẠCH'`): Vệt dạ quang vàng quẹt sáng dưới `Nhắn 'KẾ HOẠCH'` (`power2.inOut`) + hộp `#o-cta` nhún đàn hồi (`elastic.out(1, 0.5)`).
    - `49.50s .. 54.756s`: Micro-motion thẻ `#o-card` dao động nổi nhẹ (`y: 0 -> -8 -> 0`, `sine.inOut`) + huy hiệu viền xoay chậm `12deg` đảm bảo `0 freeze events`.

### 4.3. Công thức Phụ đề Karaoke (`#subs`)
- Đặt tại `bottom: 185px`, chia 9–10 từ/dòng ưu tiên ngắt sau dấu câu.
- **Tắt dòng cũ tuyệt đối trước dòng mới**: `en = li < SUB.length - 1 ? Math.max(st + 0.2, W[SUB[li + 1][0]].s - 0.04) : TOTAL`.
- **Bounce từng chữ**: `scale: 1 -> 1.18`, `y: 0 -> -6px`, `color: '#FDE047'`, `ease: 'back.out(3)'` tại `W[wi].s`, trả về `#FFFFFF` tại `W[wi].e`.
