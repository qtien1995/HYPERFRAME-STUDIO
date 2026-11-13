/*
 * build-index.cjs — Trình biên dịch HyperFrames V4 Pure Bespoke
 * Dự án: nguon-goc-bao-hiem (Thủy Tổ Bảo Hiểm Bắt Nguồn Từ Đâu?)
 * Chạy: node projects/nguon-goc-bao-hiem/build-index.cjs
 */
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const PROJECT_ID = path.basename(DIR);
const timing = JSON.parse(fs.readFileSync(path.join(DIR, "assets/audio/timing.json"), "utf8"));

// 1. Lọc token rỗng và dấu phân cách '---'
const words = timing.words
  .filter(w => w.word && w.word.trim() && w.word.trim() !== "---")
  .map(w => ({
    w: w.word.trim(),
    s: +(w.startMs / 1000).toFixed(3),
    e: +((w.startMs + w.durationMs) / 1000).toFixed(3)
  }));

const AUDIO = +(timing.durationMs / 1000).toFixed(3);
const TAIL = 1.4;
const TOTAL = +(AUDIO + TAIL).toFixed(3);

// 2. Hàm neo thời gian chính xác vào từ khóa thật trong timing.json
const norm = s => s.toLowerCase().normalize("NFC").replace(/[.,:;!?'"“”]/g, "");
function anchor(idx, expect) {
  if (!words[idx] || norm(words[idx].w) !== norm(expect)) {
    throw new Error(`Anchor ${idx} expected "${expect}" got "${words[idx] && words[idx].w}"`);
  }
  return words[idx].s;
}

const LEAD_S = 0.25;
const LEAD_C = 0.12;

const cuts = [
  0,
  anchor(16, "mà") - LEAD_C,
  anchor(25, "Thời") - LEAD_S,
  anchor(43, "Họ") - LEAD_S,
  anchor(64, "Sau") - LEAD_S,
  anchor(77, "Người") - LEAD_S,
  anchor(102, "Đến") - LEAD_S,
  anchor(122, "Nếu") - LEAD_S,
  anchor(142, "Thế") - LEAD_S,
  anchor(154, "giới") - LEAD_C,
  anchor(179, "Hàng") - LEAD_S,
  anchor(189, "góp") - LEAD_C,
  anchor(203, "Nhắn") - LEAD_S,
  TOTAL
].map(v => +v.toFixed(3));

const sceneMeta = [
  { id: "s1", range: [0, 15], purpose: "Phá định kiến: Không bắt nguồn từ hợp đồng hiện đại", layout: "centered", motion: "interrupt", desc: "Tập hợp đồng hiện đại gạch trừu tượng bị bút mực đỏ gạch chéo" },
  { id: "s2", range: [16, 24], purpose: "Hook sông dữ: Nỗi lo lật thuyền", layout: "centered", motion: "flow", desc: "Con thuyền đơn độc chao nghiêng giữa đường đồng mức sóng cuộn" },
  { id: "s3", range: [25, 42], purpose: "Trường Giang: Dồn hết hàng lên 1 thuyền", layout: "centered", motion: "collapse", desc: "Khối hàng nặng đè chìm mớn nước của duy nhất 1 con thuyền" },
  { id: "s4", range: [43, 63], purpose: "Cơ chế chia nhỏ hàng hóa lên 5 thuyền", layout: "split", motion: "stagger", desc: "Tách khối hàng làm 5 kiện đáp xuống 5 thuyền; 1 gặp xoáy nước, 4 vững vàng" },
  { id: "s5", range: [64, 76], purpose: "Lưỡng Hà: Khắc nguyên tắc vào bộ luật Hammurabi", layout: "centered", motion: "draw-in", desc: "Bia đất nung khắc nét chữ hình nêm phát sáng cùng niên đại 1750 TCN" },
  { id: "s6", range: [77, 101], purpose: "Cơ chế Hammurabi: Đổi phí nhỏ miễn hoàn trả vốn", layout: "split", motion: "compare-state", desc: "Cán cân cơ học cân đồng xu phí nhỏ với khối vốn tàu và đóng dấu miễn hoàn trả" },
  { id: "s7", range: [102, 121], purpose: "Hy Lạp cổ đại: Quy ước Tổn thất chung Địa Trung Hải", layout: "centered", motion: "draw-in", desc: "Hải đồ Địa Trung Hải tự vẽ tuyến tàu cùng dấu Tổn thất chung" },
  { id: "s8", range: [122, 141], purpose: "Hy sinh phần nhỏ cứu tàu & mọi chủ hàng bù đắp", layout: "centered", motion: "transform", desc: "Tàu nghiêng hạ 1 kiện hàng lấy lại thăng bằng, 4 cung lực cộng đồng cùng bù đắp" },
  { id: "s9", range: [142, 153], purpose: "Luân Đôn thế kỷ 17: Quán cà phê ven cảng", layout: "centered", motion: "flow", desc: "Mặt bàn gỗ quán cà phê với tách cà phê bốc hơi cạnh bản đồ cảng Thames 1688" },
  { id: "s10", range: [154, 178], purpose: "Giải mã Underwriting: Ký tên dưới danh sách tàu", layout: "centered", motion: "marker-draw", desc: "Trang sổ có đường kẻ ngang; 3 chữ ký mực xanh tự viết ngay bên dưới đường kẻ" },
  { id: "s11", range: [179, 188], purpose: "Sợi chỉ xuyên suốt hàng nghìn năm lịch sử", layout: "timeline", motion: "timeline-progress", desc: "Thước đo thời gian nối 5 cột mốc văn minh bằng sợi chỉ liền mạch" },
  { id: "s12", range: [189, 202], purpose: "Bản chất cốt lõi: Vòm số đông đỡ một gia đình", layout: "centered", motion: "shield-expand", desc: "6 cung hợp lực đan vòm lá chắn xanh Manulife che chở ngôi nhà trước bão" },
  { id: "s13", range: [203, 222], purpose: "Brand Outro & CTA Tiến Dương Manulife", layout: "centered", motion: "card-reveal", desc: "Thẻ chuyên gia Tiến Dương Manulife căn giữa với highlight CTA Nhắn KẾ HOẠCH" }
];

const scenes = sceneMeta.map((m, i) => ({
  id: m.id,
  start: cuts[i],
  dur: +(cuts[i + 1] - cuts[i]).toFixed(3),
  purpose: m.purpose,
  layout: m.layout,
  motion: m.motion,
  desc: m.desc,
  narration: words.slice(m.range[0], m.range[1] + 1).map(x => x.w).join(" ")
}));

// 3. Chia phụ đề Karaoke 9-10 từ/dòng, ưu tiên ngắt sau dấu câu hoặc khoảng nghỉ
const subLines = [];
let cur = [];
words.forEach((w, i) => {
  cur.push(i);
  const punct = /[.,?!:;]$/.test(w.w);
  if (
    (cur.length >= 8 && punct) ||
    cur.length >= 10 ||
    i === words.length - 1 ||
    (punct && /[.?!]$/.test(w.w) && cur.length >= 5 && words[i + 1] && words[i + 1].s - w.e > 0.45)
  ) {
    subLines.push(cur);
    cur = [];
  }
});
for (let i = subLines.length - 1; i > 0; i--) {
  if (subLines[i].length < 4 && subLines[i - 1].length + subLines[i].length <= 10) {
    subLines[i - 1] = subLines[i - 1].concat(subLines[i]);
    subLines.splice(i, 1);
  }
}

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const subsHTML = subLines
  .map(
    (line, li) =>
      `<div class="sub-line" id="sl${li}">${line
        .map(i => `<span class="sub-word" id="sw${i}">${esc(words[i].w)}</span>`)
        .join(" ")}</div>`
  )
  .join("\n      ");

const sceneAttr = id => {
  const s = scenes.find(x => x.id === id);
  return `class="clip scene" id="${id}" data-start="${s.start}" data-duration="${s.dur}" data-track-index="1"`;
};

// 4. Tạo HTML hoàn chỉnh theo chuẩn HyperFrames V4
const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1080, height=1920">
<title>${PROJECT_ID}</title>
<style>
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

@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Medium.ttf') format('truetype'); font-weight: 500; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Bold.ttf') format('truetype'); font-weight: 700; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-ExtraBold.ttf') format('truetype'); font-weight: 800; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Black.ttf') format('truetype'); font-weight: 900; font-style: normal; }

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg-stage);
  color: var(--ink-primary);
  font-family: 'Be Vietnam Pro', sans-serif;
  font-variant-numeric: tabular-nums;
}

#cam {
  position: absolute;
  inset: 0;
  width: 1080px;
  height: 1920px;
  transform-origin: 50% 44%;
}
#bg-canvas {
  position: absolute;
  inset: 0;
  width: 1080px;
  height: 1920px;
  display: block;
}
#lamp {
  position: absolute;
  inset: 0;
  background: var(--lamp-glow);
  pointer-events: none;
}

.scene, .wrap {
  position: absolute;
  inset: 0;
  width: 1080px;
  height: 1920px;
}
.scene { opacity: 0; }

.marginalia {
  position: absolute;
  top: 175px;
  left: 0;
  width: 1080px;
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-secondary);
  opacity: 0.72;
}

.stamp-box {
  position: absolute;
  left: 50%;
  width: 680px;
  margin-left: -340px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.stamp-pill {
  display: inline-block;
  padding: 16px 38px;
  border-radius: 14px;
  font-size: 38px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 4px solid currentColor;
  background: rgba(255, 253, 248, 0.92);
  box-shadow: var(--shadow-tactile);
}
.hl-wrap {
  position: relative;
  display: inline-block;
  padding: 8px 24px;
}
.hl-bar {
  position: absolute;
  inset: 6px 0;
  background: var(--accent-highlight);
  mix-blend-mode: multiply;
  transform-origin: 0% 50%;
  transform: scaleX(0);
  border-radius: 8px;
  display: block;
}
.stamp-reveal { opacity: 0; }
.hl-txt {
  position: relative;
  z-index: 1;
}

/* S1: Hợp đồng hiện đại bị gạch */
#s1-folio {
  position: absolute;
  left: 50%;
  margin-left: -260px;
  top: 320px;
  width: 520px;
  height: 680px;
  background: var(--bg-elevated);
  border: 2px solid rgba(31, 29, 26, 0.16);
  border-radius: 16px;
  box-shadow: var(--shadow-tactile);
  padding: 54px 48px;
}
#s1-folio-head {
  font-size: 32px;
  font-weight: 800;
  color: var(--ink-primary);
  margin-bottom: 34px;
  padding-bottom: 20px;
  border-bottom: 3px solid var(--ink-primary);
  letter-spacing: -0.02em;
}
.skel-line {
  height: 14px;
  border-radius: 7px;
  background: var(--ink-dim);
  opacity: 0.55;
  margin-bottom: 24px;
}
#s1-svg {
  position: absolute;
  left: 0;
  top: 0;
  width: 1080px;
  height: 1920px;
  pointer-events: none;
}

/* S2: Hook sông dữ */
#s2-title {
  position: absolute;
  top: 235px;
  left: 0;
  width: 1080px;
  text-align: center;
  font-size: 74px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--ink-primary);
}
#s2-svg {
  position: absolute;
  left: 80px;
  top: 410px;
  width: 920px;
  height: 600px;
}

/* S3: Trường Giang 1 thuyền quá tải */
#s3-svg {
  position: absolute;
  left: 80px;
  top: 320px;
  width: 920px;
  height: 700px;
}

/* S4: Chia nhỏ 5 thuyền */
#s4-svg {
  position: absolute;
  left: 40px;
  top: 290px;
  width: 1000px;
  height: 760px;
}

/* S5: Bia đá Hammurabi */
#s5-stele {
  position: absolute;
  left: 50%;
  margin-left: -265px;
  top: 300px;
  width: 530px;
  height: 720px;
  background: var(--bg-surface);
  border: 4px solid var(--accent-amber);
  border-radius: 220px 220px 24px 24px;
  box-shadow: var(--shadow-tactile);
  padding: 110px 60px 50px;
}
#s5-stele-inner {
  width: 100%;
  height: 100%;
  border: 2px solid rgba(180, 83, 9, 0.35);
  border-radius: 170px 170px 14px 14px;
  padding: 40px 30px;
}

/* S6: Cán cân Hammurabi */
#s6-svg {
  position: absolute;
  left: 60px;
  top: 300px;
  width: 960px;
  height: 720px;
}

/* S7: Hải đồ Địa Trung Hải */
#s7-svg {
  position: absolute;
  left: 70px;
  top: 310px;
  width: 940px;
  height: 680px;
}

/* S8: Tàu thăng bằng Tổn thất chung */
#s8-svg {
  position: absolute;
  left: 60px;
  top: 300px;
  width: 960px;
  height: 730px;
}

/* S9: Quán cà phê cảng Luân Đôn */
#s9-svg {
  position: absolute;
  left: 80px;
  top: 300px;
  width: 920px;
  height: 710px;
}

/* S10: Sổ Manifest Underwriting */
#s10-ledger {
  position: absolute;
  left: 50%;
  margin-left: -390px;
  top: 290px;
  width: 780px;
  height: 760px;
  background: var(--bg-elevated);
  border: 2px solid rgba(31, 29, 26, 0.18);
  border-radius: 18px;
  box-shadow: var(--shadow-tactile);
}
#s10-svg {
  position: absolute;
  inset: 0;
  width: 780px;
  height: 760px;
}

/* S11: Sợi chỉ thời gian */
#s11-svg {
  position: absolute;
  left: 70px;
  top: 270px;
  width: 940px;
  height: 770px;
}

/* S12: Vòm lá chắn gia đình */
#s12-svg {
  position: absolute;
  left: 70px;
  top: 280px;
  width: 940px;
  height: 750px;
}

/* S13: Brand Outro Card (Center X = 540px tuyệt đối) */
#o-card {
  position: absolute;
  left: 50%;
  margin-left: -440px;
  top: 290px;
  width: 880px;
  background: var(--bg-elevated);
  border: 2px solid rgba(31, 29, 26, 0.14);
  border-radius: 34px;
  box-shadow: var(--shadow-tactile);
  padding: 58px 54px 52px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#o-emblem {
  position: absolute;
  top: -32px;
  right: 44px;
  width: 84px;
  height: 84px;
  pointer-events: none;
}
#o-logo-badge {
  background: var(--accent-brand);
  padding: 14px 34px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 8px 20px rgba(0, 167, 88, 0.22);
}
#o-logo {
  height: 54px;
  width: auto;
  display: block;
}
#o-name {
  font-size: 52px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--ink-primary);
  margin-bottom: 10px;
}
#o-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--ink-secondary);
  margin-bottom: 28px;
}
#o-rule {
  width: 180px;
  height: 5px;
  border-radius: 3px;
  background: var(--accent-brand);
  margin-bottom: 34px;
  display: block;
}
#o-cta {
  position: relative;
  display: inline-block;
  padding: 20px 44px;
  border-radius: 20px;
  background: rgba(0, 167, 88, 0.10);
  border: 3px solid var(--accent-brand);
  font-size: 40px;
  font-weight: 900;
  color: var(--ink-primary);
  margin-bottom: 20px;
  overflow: hidden;
}
#o-cta-hl {
  position: absolute;
  inset: 0;
  background: var(--accent-highlight);
  opacity: 0.72;
  transform-origin: 0% 50%;
  display: block;
}
#o-cta-txt {
  position: relative;
  z-index: 1;
}
#o-sub {
  font-size: 28px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--ink-secondary);
  max-width: 720px;
  margin-bottom: 26px;
}
#o-handle {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent-brand);
  margin-bottom: 18px;
}
#o-disc {
  font-size: 22px;
  font-weight: 400;
  color: var(--ink-secondary);
  opacity: 0.80;
}

/* Hạt bụi sáng môi trường */
#dust {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.mote {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 253, 248, 0.95) 0%, rgba(253, 224, 71, 0.45) 60%, rgba(253, 224, 71, 0) 100%);
}

/* Phụ đề Karaoke không chồng lấp */
#subs {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 185px;
  height: 200px;
  pointer-events: none;
}
.sub-line {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 980px;
  margin-left: -490px;
  text-align: center;
  opacity: 0;
  padding: 20px 32px;
  background: var(--bg-overlay);
  border-radius: 24px;
  font-size: 38px;
  font-weight: 800;
  line-height: 1.42;
  color: rgba(255, 255, 255, 0.62);
  box-shadow: 0 12px 30px rgba(31, 29, 26, 0.22);
}
.sub-word {
  display: inline-block;
  margin: 0 5px;
  transform-origin: 50% 80%;
}
</style>
<script src="assets/vendor/gsap.min.js"></script>
</head>
<body>
<div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-duration="${TOTAL}">
  <audio id="narration" src="assets/audio/narration.mp3" data-start="0" data-duration="${AUDIO}" data-track-index="0"></audio>
  <div id="cam">
    <canvas id="bg-canvas" width="1080" height="1920"></canvas>
    <div id="lamp"></div>

    <!-- S1: Gạt bỏ hợp đồng hiện đại -->
    <div ${sceneAttr("s1")}>
      <div class="wrap" id="s1w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="marginalia">THỦY TỔ BẢO HIỂM · 01</div>
        <div id="s1-folio">
          <div id="s1-folio-head">HỢP ĐỒNG HIỆN ĐẠI</div>
          <div class="skel-line" style="width: 92%"></div>
          <div class="skel-line" style="width: 78%"></div>
          <div class="skel-line" style="width: 96%"></div>
          <div class="skel-line" style="width: 65%"></div>
          <div class="skel-line" style="width: 88%"></div>
          <div class="skel-line" style="width: 82%"></div>
          <div class="skel-line" style="width: 90%"></div>
          <div class="skel-line" style="width: 54%"></div>
        </div>
        <svg id="s1-svg" viewBox="0 0 1080 1920">
          <path id="s1-x1" d="M 250 380 L 830 960" fill="none" stroke="#C2352B" stroke-width="16" stroke-linecap="round"/>
          <path id="s1-x2" d="M 830 380 L 250 960" fill="none" stroke="#C2352B" stroke-width="16" stroke-linecap="round"/>
        </svg>
        <div class="stamp-box stamp-reveal" id="s1-stamp" style="top: 1090px; color: #C2352B; transform: rotate(-4deg);">
          <span class="stamp-pill">KHÔNG BẮT NGUỒN TỪ ĐÂY</span>
        </div>
      </div>
    </div>

    <!-- S2: Hook nỗi lo lật thuyền trên sông dữ -->
    <div ${sceneAttr("s2")}>
      <div class="wrap" id="s2w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div id="s2-title">THỦY TỔ BẢO HIỂM</div>
        <svg id="s2-svg" viewBox="0 0 920 600">
          <path class="s2-wave" d="M 30 390 Q 140 330 250 390 T 470 390 T 690 390 T 890 390" fill="none" stroke="#1E3A5F" stroke-width="5" stroke-opacity="0.35"/>
          <path class="s2-wave" d="M 10 440 Q 120 370 240 440 T 480 440 T 720 440 T 910 440" fill="none" stroke="#1E3A5F" stroke-width="7" stroke-opacity="0.65"/>
          <path class="s2-wave" d="M 40 495 Q 160 435 280 495 T 520 495 T 760 495 T 890 495" fill="none" stroke="#C2352B" stroke-width="4" stroke-dasharray="14 10" stroke-opacity="0.75"/>
          <g id="s2-boat" style="transform-origin: 460px 360px;">
            <path d="M 270 315 L 650 315 L 595 390 L 325 390 Z" fill="#1F1D1A" stroke="#1F1D1A" stroke-width="4" stroke-linejoin="round"/>
            <line x1="460" y1="315" x2="460" y2="120" stroke="#1F1D1A" stroke-width="8" stroke-linecap="round"/>
            <path d="M 468 135 Q 605 190 590 295 L 468 295 Z" fill="#FFFDF8" stroke="#1E3A5F" stroke-width="5"/>
            <rect x="345" y="255" width="90" height="60" rx="6" fill="#B45309"/>
          </g>
        </svg>
        <div class="stamp-box" style="top: 1085px; font-size: 48px; font-weight: 900; color: #C2352B;">
          <span class="hl-wrap"><span class="hl-bar" id="s2-hl"></span><span class="hl-txt">NỖI LO LẬT THUYỀN</span></span>
        </div>
      </div>
    </div>

    <!-- S3: Trường Giang quá tải 1 thuyền -->
    <div ${sceneAttr("s3")}>
      <div class="wrap" id="s3w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="marginalia">SÔNG TRƯỜNG GIANG · CỔ ĐẠI</div>
        <svg id="s3-svg" viewBox="0 0 920 700">
          <path d="M 40 470 Q 160 445 280 470 T 520 470 T 760 470 T 880 470" fill="none" stroke="#1E3A5F" stroke-width="5" stroke-opacity="0.5"/>
          <line x1="80" y1="530" x2="840" y2="530" stroke="#C2352B" stroke-width="4" stroke-dasharray="12 10"/>
          <text x="840" y="512" text-anchor="end" fill="#C2352B" font-family="Be Vietnam Pro" font-size="28" font-weight="800">NGƯỠNG CHÌM</text>
          <g id="s3-ship">
            <path d="M 260 420 L 660 420 L 605 495 L 315 495 Z" fill="#1F1D1A"/>
            <line x1="460" y1="420" x2="460" y2="270" stroke="#1F1D1A" stroke-width="7"/>
            <path d="M 468 282 L 560 340 L 468 380 Z" fill="#EAE2D3" stroke="#1F1D1A" stroke-width="4"/>
            <g id="s3-crate" style="opacity: 0;">
              <rect x="330" y="275" width="210" height="145" rx="12" fill="#B45309" stroke="#1F1D1A" stroke-width="5"/>
              <line x1="330" y1="347" x2="540" y2="347" stroke="#FDE047" stroke-width="6"/>
              <line x1="435" y1="275" x2="435" y2="420" stroke="#FDE047" stroke-width="6"/>
            </g>
          </g>
        </svg>
        <div class="stamp-box stamp-reveal" id="s3-stamp" style="top: 1090px; color: #C2352B;">
          <span class="stamp-pill">1 THUYỀN = 100% RỦI RO</span>
        </div>
      </div>
    </div>

    <!-- S4: Chia nhỏ sang 5 thuyền -->
    <div ${sceneAttr("s4")}>
      <div class="wrap" id="s4w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="marginalia">SÔNG TRƯỜNG GIANG · PHÂN TÁN RỦI RO</div>
        <svg id="s4-svg" viewBox="0 0 1000 760">
          <!-- Quỹ đạo phân tách -->
          <path class="s4-arc" d="M 500 130 Q 250 180 120 430" fill="none" stroke="#B45309" stroke-width="3" stroke-dasharray="8 8" stroke-opacity="0.55"/>
          <path class="s4-arc" d="M 500 130 Q 380 200 310 430" fill="none" stroke="#B45309" stroke-width="3" stroke-dasharray="8 8" stroke-opacity="0.55"/>
          <path class="s4-arc" d="M 500 130 L 500 430" fill="none" stroke="#B45309" stroke-width="3" stroke-dasharray="8 8" stroke-opacity="0.55"/>
          <path class="s4-arc" d="M 500 130 Q 620 200 690 430" fill="none" stroke="#B45309" stroke-width="3" stroke-dasharray="8 8" stroke-opacity="0.55"/>
          <path class="s4-arc" d="M 500 130 Q 750 180 880 430" fill="none" stroke="#B45309" stroke-width="3" stroke-dasharray="8 8" stroke-opacity="0.55"/>

          <!-- Khối hàng gốc phía trên -->
          <rect id="s4-src" x="430" y="50" width="140" height="90" rx="12" fill="#B45309" stroke="#1F1D1A" stroke-width="4"/>

          <!-- Đường sóng chung -->
          <path d="M 20 555 Q 140 535 260 555 T 500 555 T 740 555 T 980 555" fill="none" stroke="#1E3A5F" stroke-width="4" stroke-opacity="0.45"/>

          <!-- Xoáy nước tại thuyền giữa -->
          <g id="s4-vortex" style="transform-origin: 500px 595px; opacity: 0;">
            <ellipse cx="500" cy="595" rx="85" ry="24" fill="none" stroke="#C2352B" stroke-width="5"/>
            <ellipse cx="500" cy="605" rx="52" ry="14" fill="none" stroke="#C2352B" stroke-width="4"/>
          </g>

          <!-- 5 thuyền + 5 kiện hàng -->
          <g class="s4-b" id="s4-b1"><path d="M 55 510 L 185 510 L 165 552 L 75 552 Z" fill="#1F1D1A"/><rect class="s4-p" id="s4-p1" x="88" y="458" width="64" height="50" rx="8" fill="#B45309" stroke="#1F1D1A" stroke-width="3" opacity="0"/><circle class="s4-ok" cx="120" cy="615" r="22" fill="#0D9488" opacity="0"/><path class="s4-ok" d="M 110 615 L 117 622 L 131 607" fill="none" stroke="#FFFDF8" stroke-width="4" stroke-linecap="round" opacity="0"/></g>
          <g class="s4-b" id="s4-b2"><path d="M 245 510 L 375 510 L 355 552 L 265 552 Z" fill="#1F1D1A"/><rect class="s4-p" id="s4-p2" x="278" y="458" width="64" height="50" rx="8" fill="#B45309" stroke="#1F1D1A" stroke-width="3" opacity="0"/><circle class="s4-ok" cx="310" cy="615" r="22" fill="#0D9488" opacity="0"/><path class="s4-ok" d="M 300 615 L 307 622 L 321 607" fill="none" stroke="#FFFDF8" stroke-width="4" stroke-linecap="round" opacity="0"/></g>
          <g class="s4-b" id="s4-b3" style="transform-origin: 500px 530px;"><path d="M 435 510 L 565 510 L 545 552 L 455 552 Z" fill="#C2352B"/><rect class="s4-p" id="s4-p3" x="468" y="458" width="64" height="50" rx="8" fill="#B45309" stroke="#1F1D1A" stroke-width="3" opacity="0"/></g>
          <g class="s4-b" id="s4-b4"><path d="M 625 510 L 755 510 L 735 552 L 645 552 Z" fill="#1F1D1A"/><rect class="s4-p" id="s4-p4" x="658" y="458" width="64" height="50" rx="8" fill="#B45309" stroke="#1F1D1A" stroke-width="3" opacity="0"/><circle class="s4-ok" cx="690" cy="615" r="22" fill="#0D9488" opacity="0"/><path class="s4-ok" d="M 680 615 L 687 622 L 701 607" fill="none" stroke="#FFFDF8" stroke-width="4" stroke-linecap="round" opacity="0"/></g>
          <g class="s4-b" id="s4-b5"><path d="M 815 510 L 945 510 L 925 552 L 835 552 Z" fill="#1F1D1A"/><rect class="s4-p" id="s4-p5" x="848" y="458" width="64" height="50" rx="8" fill="#B45309" stroke="#1F1D1A" stroke-width="3" opacity="0"/><circle class="s4-ok" cx="880" cy="615" r="22" fill="#0D9488" opacity="0"/><path class="s4-ok" d="M 870 615 L 877 622 L 891 607" fill="none" stroke="#FFFDF8" stroke-width="4" stroke-linecap="round" opacity="0"/></g>
        </svg>
        <div class="stamp-box stamp-reveal" id="s4-stamp" style="top: 1095px; color: #0D9488;">
          <span class="stamp-pill">CHẲNG AI MẤT TRẮNG</span>
        </div>
      </div>
    </div>

    <!-- S5: Bia đá Bộ luật Hammurabi -->
    <div ${sceneAttr("s5")}>
      <div class="wrap" id="s5w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="marginalia">LƯỠNG HÀ · ~1750 TCN</div>
        <div id="s5-stele">
          <div id="s5-stele-inner">
            <svg viewBox="0 0 360 440" width="100%" height="100%">
              <path d="M 30 60 L 140 60 M 165 60 L 320 60 M 30 115 L 220 115 M 245 115 L 330 115 M 30 170 L 110 170 M 140 170 L 290 170 M 30 225 L 260 225 M 285 225 L 330 225 M 30 280 L 190 280 M 220 280 L 320 280 M 30 335 L 130 335 M 160 335 L 270 335 M 30 390 L 310 390" fill="none" stroke="#B45309" stroke-opacity="0.22" stroke-width="7" stroke-linecap="round"/>
              <path class="s5-cune" d="M 30 60 L 140 60 M 165 60 L 320 60" fill="none" stroke="#B45309" stroke-width="8" stroke-linecap="round"/>
              <path class="s5-cune" d="M 30 115 L 220 115 M 245 115 L 330 115" fill="none" stroke="#5A5247" stroke-width="7" stroke-linecap="round"/>
              <path class="s5-cune" d="M 30 170 L 110 170 M 140 170 L 290 170" fill="none" stroke="#B45309" stroke-width="8" stroke-linecap="round"/>
              <path class="s5-cune" d="M 30 225 L 260 225 M 285 225 L 330 225" fill="none" stroke="#5A5247" stroke-width="7" stroke-linecap="round"/>
              <path class="s5-cune" d="M 30 280 L 190 280 M 220 280 L 320 280" fill="none" stroke="#B45309" stroke-width="8" stroke-linecap="round"/>
              <path class="s5-cune" d="M 30 335 L 130 335 M 160 335 L 270 335" fill="none" stroke="#5A5247" stroke-width="7" stroke-linecap="round"/>
              <path class="s5-cune" d="M 30 390 L 310 390" fill="none" stroke="#B45309" stroke-width="8" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <div class="stamp-box" style="top: 1095px; font-size: 46px; font-weight: 900; color: #1F1D1A;">
          <span class="hl-wrap"><span class="hl-bar" id="s5-hl"></span><span class="hl-txt">BỘ LUẬT HAMMURABI</span></span>
        </div>
      </div>
    </div>

    <!-- S6: Cơ chế Hammurabi Đổi phí nhỏ - Miễn hoàn trả -->
    <div ${sceneAttr("s6")}>
      <div class="wrap" id="s6w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="marginalia">LUẬT HÀNG HẢI LƯỠNG HÀ</div>
        <svg id="s6-svg" viewBox="0 0 960 720">
          <!-- Trục trụ cân -->
          <line x1="480" y1="180" x2="480" y2="570" stroke="#1F1D1A" stroke-width="10" stroke-linecap="round"/>
          <path d="M 380 570 L 580 570 L 540 535 L 420 535 Z" fill="#1F1D1A"/>
          <circle cx="480" cy="180" r="18" fill="#B45309" stroke="#1F1D1A" stroke-width="5"/>

          <!-- Đòn cân xoay -->
          <g id="s6-beam" style="transform-origin: 480px 180px;">
            <line x1="170" y1="180" x2="790" y2="180" stroke="#1F1D1A" stroke-width="10" stroke-linecap="round"/>
            <!-- Đĩa trái: Phí nhỏ -->
            <line x1="190" y1="180" x2="150" y2="330" stroke="#5A5247" stroke-width="3"/>
            <line x1="190" y1="180" x2="230" y2="330" stroke="#5A5247" stroke-width="3"/>
            <path d="M 120 330 Q 190 365 260 330 Z" fill="#EAE2D3" stroke="#1F1D1A" stroke-width="4"/>
            <g id="s6-coin" style="opacity: 0;">
              <circle cx="190" cy="288" r="42" fill="#FDE047" stroke="#B45309" stroke-width="5"/>
              <text x="190" y="298" text-anchor="middle" fill="#1F1D1A" font-family="Be Vietnam Pro" font-size="28" font-weight="900">PHÍ</text>
            </g>
            <!-- Đĩa phải: Vốn tàu gặp bão -->
            <line x1="770" y1="180" x2="720" y2="330" stroke="#5A5247" stroke-width="3"/>
            <line x1="770" y1="180" x2="820" y2="330" stroke="#5A5247" stroke-width="3"/>
            <path d="M 685 330 Q 770 370 855 330 Z" fill="#EAE2D3" stroke="#1F1D1A" stroke-width="4"/>
            <g id="s6-cap">
              <rect x="700" y="242" width="140" height="86" rx="10" fill="#1E3A5F" stroke="#1F1D1A" stroke-width="4"/>
              <text x="770" y="295" text-anchor="middle" fill="#FFFDF8" font-family="Be Vietnam Pro" font-size="28" font-weight="800">VỐN TÀU</text>
            </g>
          </g>
          <!-- Sóng bão bên phải -->
          <path id="s6-storm" d="M 650 430 Q 710 390 770 430 T 890 430" fill="none" stroke="#C2352B" stroke-width="6" stroke-linecap="round" opacity="0"/>
        </svg>
        <div class="stamp-box stamp-reveal" id="s6-stamp" style="top: 1090px; color: #B45309; transform: rotate(-3deg);">
          <span class="stamp-pill">MIỄN HOÀN TRẢ VỐN</span>
        </div>
      </div>
    </div>

    <!-- S7: Hải đồ Địa Trung Hải -->
    <div ${sceneAttr("s7")}>
      <div class="wrap" id="s7w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="marginalia">HY LẠP CỔ ĐẠI · LEX RHODIA</div>
        <svg id="s7-svg" viewBox="0 0 940 680">
          <rect x="20" y="20" width="900" height="620" rx="22" fill="#FFFDF8" stroke="#1E3A5F" stroke-width="4"/>
          <!-- Đường bờ biển trừu tượng -->
          <path d="M 20 190 Q 170 150 290 210 T 520 175 T 770 220 L 920 180 L 920 20 L 20 20 Z" fill="#EAE2D3" stroke="#5A5247" stroke-width="3"/>
          <path d="M 20 510 Q 220 465 410 520 T 760 490 L 920 520 L 920 640 L 20 640 Z" fill="#EAE2D3" stroke="#5A5247" stroke-width="3"/>
          <!-- La bàn hải đồ -->
          <circle cx="790" cy="120" r="44" fill="none" stroke="#1E3A5F" stroke-width="2" stroke-opacity="0.5"/>
          <path d="M 790 66 L 798 112 L 844 120 L 798 128 L 790 174 L 782 128 L 736 120 L 782 112 Z" fill="#1E3A5F" fill-opacity="0.28"/>
          <!-- Tuyến hải trình SVG -->
          <path id="s7-route" d="M 160 360 Q 340 265 490 355 T 790 325" fill="none" stroke="#1E3A5F" stroke-width="7" stroke-linecap="round"/>
          <circle class="s7-port" cx="160" cy="360" r="14" fill="#B45309" stroke="#FFFDF8" stroke-width="4"/>
          <circle class="s7-port" cx="490" cy="355" r="18" fill="#0D9488" stroke="#FFFDF8" stroke-width="4"/>
          <circle class="s7-port" cx="790" cy="325" r="14" fill="#B45309" stroke="#FFFDF8" stroke-width="4"/>
          <text x="490" y="425" text-anchor="middle" fill="#1E3A5F" font-family="Be Vietnam Pro" font-size="28" font-weight="800">ĐẢO RHODES</text>
        </svg>
        <div class="stamp-box stamp-reveal" id="s7-stamp" style="top: 1090px; color: #1E3A5F;">
          <span class="stamp-pill">QUY ƯỚC TỔN THẤT CHUNG</span>
        </div>
      </div>
    </div>

    <!-- S8: Ném bớt hàng cứu tàu & Mọi chủ hàng bù đắp -->
    <div ${sceneAttr("s8")}>
      <div class="wrap" id="s8w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="marginalia">CỨU CẢ CON TÀU · CÙNG BÙ ĐẮP</div>
        <svg id="s8-svg" viewBox="0 0 960 730">
          <!-- Mặt sóng -->
          <path d="M 40 430 Q 180 400 320 430 T 600 430 T 880 430" fill="none" stroke="#1E3A5F" stroke-width="5" stroke-opacity="0.55"/>
          <!-- Thân tàu nghiêng -> thăng bằng -->
          <g id="s8-ship" style="transform-origin: 480px 395px;">
            <path d="M 270 350 L 690 350 L 630 435 L 330 435 Z" fill="#1F1D1A"/>
            <line x1="480" y1="350" x2="480" y2="140" stroke="#1F1D1A" stroke-width="8"/>
            <path d="M 488 155 Q 640 220 620 330 L 488 330 Z" fill="#FFFDF8" stroke="#1E3A5F" stroke-width="5"/>
            <rect x="335" y="285" width="70" height="65" rx="8" fill="#1E3A5F"/>
            <rect x="412" y="285" width="60" height="65" rx="8" fill="#0D9488"/>
          </g>
          <!-- Kiện hàng ném xuống biển -->
          <rect id="s8-drop" x="210" y="290" width="68" height="60" rx="8" fill="#B45309" stroke="#1F1D1A" stroke-width="4"/>
          <!-- 4 cung lực chủ hàng cùng bù đắp -->
          <path class="s8-comp" d="M 140 640 Q 260 540 460 560" fill="none" stroke="#0D9488" stroke-width="7" stroke-linecap="round"/>
          <path class="s8-comp" d="M 320 665 Q 400 580 465 565" fill="none" stroke="#0D9488" stroke-width="7" stroke-linecap="round"/>
          <path class="s8-comp" d="M 640 665 Q 560 580 495 565" fill="none" stroke="#0D9488" stroke-width="7" stroke-linecap="round"/>
          <path class="s8-comp" d="M 820 640 Q 700 540 500 560" fill="none" stroke="#0D9488" stroke-width="7" stroke-linecap="round"/>
          <rect id="s8-fill" x="444" y="528" width="72" height="64" rx="10" fill="#00A758" stroke="#FFFDF8" stroke-width="4" opacity="0"/>
        </svg>
        <div class="stamp-box stamp-reveal" id="s8-stamp" style="top: 1095px; color: #0D9488;">
          <span class="stamp-pill">MỌI CHỦ HÀNG CÙNG BÙ ĐẮP</span>
        </div>
      </div>
    </div>

    <!-- S9: Quán cà phê cảng Luân Đôn -->
    <div ${sceneAttr("s9")}>
      <div class="wrap" id="s9w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="marginalia">LUÂN ĐÔN · THẾ KỶ XVII</div>
        <svg id="s9-svg" viewBox="0 0 920 710">
          <!-- Tờ hải đồ sông Thames -->
          <rect x="80" y="130" width="760" height="490" rx="18" fill="#FFFDF8" stroke="#5A5247" stroke-width="3"/>
          <path d="M 110 420 Q 270 350 420 435 T 790 365" fill="none" stroke="#1E3A5F" stroke-width="10" stroke-opacity="0.28" stroke-linecap="round"/>
          <line x1="130" y1="210" x2="430" y2="210" stroke="#C7BEA9" stroke-width="10" stroke-linecap="round"/>
          <line x1="130" y1="255" x2="360" y2="255" stroke="#C7BEA9" stroke-width="10" stroke-linecap="round"/>
          <line x1="130" y1="300" x2="395" y2="300" stroke="#C7BEA9" stroke-width="10" stroke-linecap="round"/>
          <!-- Tách cà phê sứ vẽ nét -->
          <g id="s9-cup">
            <ellipse cx="620" cy="390" rx="130" ry="38" fill="#EAE2D3" stroke="#1F1D1A" stroke-width="5"/>
            <path d="M 530 280 L 710 280 Q 700 390 620 390 Q 540 390 530 280 Z" fill="#FFFDF8" stroke="#1F1D1A" stroke-width="5"/>
            <path d="M 705 298 Q 755 300 752 340 Q 750 370 698 365" fill="none" stroke="#1F1D1A" stroke-width="6"/>
            <ellipse cx="620" cy="280" rx="90" ry="18" fill="#5A5247" stroke="#1F1D1A" stroke-width="4"/>
            <!-- 3 làn hơi ấm -->
            <path class="s9-steam" d="M 580 245 Q 565 210 585 175 T 580 120" fill="none" stroke="#B45309" stroke-width="4" stroke-linecap="round" opacity="0.65"/>
            <path class="s9-steam" d="M 620 240 Q 640 200 618 160 T 625 105" fill="none" stroke="#B45309" stroke-width="4" stroke-linecap="round" opacity="0.75"/>
            <path class="s9-steam" d="M 660 245 Q 645 212 665 175 T 658 125" fill="none" stroke="#B45309" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
          </g>
        </svg>
        <div class="stamp-box stamp-reveal" id="s9-stamp" style="top: 1090px; color: #1E3A5F;">
          <span class="stamp-pill">LLOYD'S COFFEE HOUSE · 1688</span>
        </div>
      </div>
    </div>

    <!-- S10: Giải mã Under-writing -->
    <div ${sceneAttr("s10")}>
      <div class="wrap" id="s10w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="marginalia">NGUỒN GỐC BẢO HIỂM HIỆN ĐẠI</div>
        <div id="s10-ledger">
          <svg id="s10-svg" viewBox="0 0 780 760">
            <text x="65" y="92" fill="#1F1D1A" font-family="Be Vietnam Pro" font-size="30" font-weight="900">DANH SÁCH CHUYẾN TÀU (MANIFEST)</text>
            <rect x="65" y="135" width="520" height="14" rx="7" fill="#C7BEA9" opacity="0.65"/>
            <rect x="65" y="175" width="640" height="14" rx="7" fill="#C7BEA9" opacity="0.55"/>
            <rect x="65" y="215" width="460" height="14" rx="7" fill="#C7BEA9" opacity="0.55"/>
            <rect x="65" y="255" width="590" height="14" rx="7" fill="#C7BEA9" opacity="0.45"/>

            <!-- Đường kẻ ngang chia đôi -->
            <line id="s10-line" x1="65" y1="350" x2="715" y2="350" stroke="#1F1D1A" stroke-width="6" stroke-linecap="round"/>
            <text x="65" y="328" fill="#B45309" font-family="Be Vietnam Pro" font-size="28" font-weight="800">KÝ NGAY BÊN DƯỚI ĐƯỜNG KẺ</text>

            <!-- 3 nét chữ ký mực xanh tự viết dưới đường kẻ -->
            <path class="s10-sig" d="M 85 460 C 110 400, 145 495, 175 435 C 200 400, 225 480, 265 445 L 295 450" fill="none" stroke="#1E3A5F" stroke-width="6" stroke-linecap="round"/>
            <path class="s10-sig" d="M 335 455 C 355 410, 390 490, 420 430 C 445 395, 470 475, 515 440 L 540 448" fill="none" stroke="#1E3A5F" stroke-width="6" stroke-linecap="round"/>
            <path class="s10-sig" d="M 160 560 C 195 505, 240 595, 285 535 C 320 500, 360 585, 430 545 L 485 552" fill="none" stroke="#1E3A5F" stroke-width="6" stroke-linecap="round"/>

            <rect id="s10-hl" x="65" y="618" width="650" height="68" rx="12" fill="#FDE047" opacity="0.85" style="transform-origin: 65px 652px; transform: scaleX(0);"/>
            <text x="390" y="664" text-anchor="middle" fill="#1F1D1A" font-family="Be Vietnam Pro" font-size="34" font-weight="900">UNDER-WRITING · CHIA RỦI RO</text>
          </svg>
        </div>
        <div class="stamp-box stamp-reveal" id="s10-stamp" style="top: 1110px; color: #00A758;">
          <span class="stamp-pill">BẢO HIỂM HIỆN ĐẠI RA ĐỜI</span>
        </div>
      </div>
    </div>

    <!-- S11: Sợi chỉ thời gian xuyên suốt -->
    <div ${sceneAttr("s11")}>
      <div class="wrap" id="s11w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="marginalia">HÀNG NGHÌN NĂM XUYÊN SUỐT</div>
        <svg id="s11-svg" viewBox="0 0 940 770">
          <path id="s11-thread" d="M 220 110 C 420 190, 720 190, 700 285 C 680 380, 220 380, 240 475 C 260 570, 700 570, 470 675" fill="none" stroke="#00A758" stroke-width="9" stroke-linecap="round"/>
          <g class="s11-node" style="opacity: 0;"><circle cx="220" cy="110" r="22" fill="#B45309" stroke="#FFFDF8" stroke-width="5"/><text x="275" y="120" fill="#1F1D1A" font-family="Be Vietnam Pro" font-size="30" font-weight="800">TRƯỜNG GIANG</text></g>
          <g class="s11-node" style="opacity: 0;"><circle cx="700" cy="285" r="22" fill="#B45309" stroke="#FFFDF8" stroke-width="5"/><text x="645" y="295" text-anchor="end" fill="#1F1D1A" font-family="Be Vietnam Pro" font-size="30" font-weight="800">HAMMURABI</text></g>
          <g class="s11-node" style="opacity: 0;"><circle cx="240" cy="475" r="22" fill="#1E3A5F" stroke="#FFFDF8" stroke-width="5"/><text x="295" y="485" fill="#1F1D1A" font-family="Be Vietnam Pro" font-size="30" font-weight="800">ĐỊA TRUNG HẢI</text></g>
          <g class="s11-node" style="opacity: 0;"><circle cx="470" cy="675" r="26" fill="#00A758" stroke="#FFFDF8" stroke-width="5"/><text x="520" y="685" fill="#00A758" font-family="Be Vietnam Pro" font-size="32" font-weight="900">LUÂN ĐÔN → NAY</text></g>
        </svg>
        <div class="stamp-box stamp-reveal" id="s11-stamp" style="top: 1105px; color: #1F1D1A;">
          <span class="stamp-pill">NGUYÊN LÝ VẸN NGUYÊN</span>
        </div>
      </div>
    </div>

    <!-- S12: Vòm hợp lực số đông đỡ một gia đình -->
    <div ${sceneAttr("s12")}>
      <div class="wrap" id="s12w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="marginalia">BẢN CHẤT NHÂN VĂN</div>
        <svg id="s12-svg" viewBox="0 0 940 750">
          <!-- 6 cung hợp lực từ số đông -->
          <path class="s12-arc" d="M 110 530 Q 170 230 470 230" fill="none" stroke="#0D9488" stroke-width="7" stroke-linecap="round"/>
          <path class="s12-arc" d="M 195 320 Q 300 210 470 230" fill="none" stroke="#00A758" stroke-width="7" stroke-linecap="round"/>
          <path class="s12-arc" d="M 330 160 Q 400 205 470 230" fill="none" stroke="#00A758" stroke-width="7" stroke-linecap="round"/>
          <path class="s12-arc" d="M 610 160 Q 540 205 470 230" fill="none" stroke="#00A758" stroke-width="7" stroke-linecap="round"/>
          <path class="s12-arc" d="M 745 320 Q 640 210 470 230" fill="none" stroke="#00A758" stroke-width="7" stroke-linecap="round"/>
          <path class="s12-arc" d="M 830 530 Q 770 230 470 230" fill="none" stroke="#0D9488" stroke-width="7" stroke-linecap="round"/>

          <!-- 6 điểm neo cộng đồng -->
          <circle class="s12-dot" cx="110" cy="530" r="16" fill="#0D9488"/>
          <circle class="s12-dot" cx="195" cy="320" r="16" fill="#00A758"/>
          <circle class="s12-dot" cx="330" cy="160" r="16" fill="#00A758"/>
          <circle class="s12-dot" cx="610" cy="160" r="16" fill="#00A758"/>
          <circle class="s12-dot" cx="745" cy="320" r="16" fill="#00A758"/>
          <circle class="s12-dot" cx="830" cy="530" r="16" fill="#0D9488"/>

          <!-- Vòm lá chắn xanh -->
          <path id="s12-dome" d="M 170 550 A 300 300 0 0 1 770 550" fill="rgba(0, 167, 88, 0.08)" stroke="#00A758" stroke-width="14" stroke-linecap="round" style="transform-origin: 470px 420px; opacity: 0;"/>

          <!-- Ngôi nhà gia đình ở tâm -->
          <g id="s12-home" style="transform-origin: 470px 510px;">
            <path d="M 370 480 L 470 390 L 570 480 L 570 610 L 370 610 Z" fill="#FFFDF8" stroke="#1F1D1A" stroke-width="8" stroke-linejoin="round"/>
            <rect x="444" y="530" width="52" height="80" rx="6" fill="#B45309"/>
          </g>

          <!-- Tia giông bão -->
          <path class="s12-bolt" d="M 320 40 L 385 170 L 355 180 L 405 245" fill="none" stroke="#C2352B" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
          <path class="s12-bolt" d="M 470 25 L 470 155 L 450 165 L 470 220" fill="none" stroke="#C2352B" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
          <path class="s12-bolt" d="M 620 40 L 555 170 L 585 180 L 535 245" fill="none" stroke="#C2352B" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
        </svg>
        <div class="stamp-box stamp-reveal" id="s12-stamp" style="top: 1095px; color: #00A758;">
          <span class="stamp-pill">SỐ ĐÔNG ĐỠ MỘT GIA ĐÌNH</span>
        </div>
      </div>
    </div>

    <!-- S13: Brand Outro & CTA -->
    <div ${sceneAttr("s13")}>
      <div class="wrap" id="s13w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div id="o-card">
          <svg id="o-emblem" viewBox="0 0 84 84">
            <circle cx="42" cy="42" r="36" fill="#FFFDF8" stroke="#00A758" stroke-width="3" stroke-dasharray="6 5"/>
            <path d="M 42 14 L 48 36 L 70 42 L 48 48 L 42 70 L 36 48 L 14 42 L 36 36 Z" fill="#00A758" opacity="0.85"/>
          </svg>
          <div id="o-logo-badge"><img id="o-logo" src="assets/branding/manulife-logo.png" alt="Manulife"></div>
          <div id="o-name">TIẾN DƯƠNG</div>
          <div id="o-title">Chuyên Gia Hoạch Định Tài Chính · Manulife Việt Nam</div>
          <div id="o-rule"></div>
          <div id="o-cta">
            <span id="o-cta-hl"></span>
            <span id="o-cta-txt">Nhắn 'KẾ HOẠCH'</span>
          </div>
          <div id="o-sub">để nhận bản phân tích lá chắn tài chính cho gia đình</div>
          <div id="o-handle">@tienduong</div>
          <div id="o-disc" data-layout-ignore>Nội dung mang tính chất chia sẻ giải pháp · Liên hệ để được tư vấn theo nhu cầu thực tế</div>
        </div>
      </div>
    </div>

    <!-- Lớp hạt bụi sáng môi trường -->
    <div id="dust" data-layout-allow-overlap></div>
  </div>

  <!-- Phụ đề Karaoke -->
  <div id="subs" data-layout-allow-overlap>
      ${subsHTML}
  </div>
</div>

<script>
(function () {
  var W = ${JSON.stringify(words)};
  var SUB = ${JSON.stringify(subLines)};
  var SC = ${JSON.stringify(scenes)};
  var TOTAL = ${TOTAL};
  function T(i) { return W[i].s; }
  function E(i) { return W[i].e; }
  function rng(seed) {
    return function () {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var rand = rng(20261113);

  // 1. Vẽ chất liệu giấy cổ vellum & lưới hải đồ bằng Procedural Canvas
  (function drawArchivalCanvas() {
    var canvas = document.getElementById("bg-canvas");
    var ctx = canvas.getContext("2d");
    var w = 1080, h = 1920;
    ctx.fillStyle = "#F4EFE6";
    ctx.fillRect(0, 0, w, h);

    // Vi sợi cellulose
    ctx.fillStyle = "rgba(31, 29, 26, 0.024)";
    for (var i = 0; i < 42000; i++) {
      var x = rand() * w;
      var y = rand() * h;
      var r = 0.5 + rand() * 0.9;
      ctx.fillRect(x, y, r, r);
    }

    // Lưới hải đồ kinh vĩ tuyến mờ
    ctx.strokeStyle = "rgba(30, 58, 95, 0.045)";
    ctx.lineWidth = 1.5;
    for (var gx = 180; gx < w; gx += 180) {
      ctx.beginPath(); ctx.moveTo(gx, 50); ctx.lineTo(gx, h - 50); ctx.stroke();
    }
    for (var gy = 180; gy < h; gy += 180) {
      ctx.beginPath(); ctx.moveTo(50, gy); ctx.lineTo(w - 50, gy); ctx.stroke();
    }

    // Viền đôi khổ giấy cổ thư
    ctx.strokeStyle = "rgba(90, 82, 71, 0.16)";
    ctx.lineWidth = 2;
    ctx.strokeRect(38, 38, w - 76, h - 76);
    ctx.strokeStyle = "rgba(90, 82, 71, 0.09)";
    ctx.strokeRect(50, 50, w - 100, h - 100);
  })();

  // 2. Tạo 26 hạt bụi sáng môi trường
  var dustBox = document.getElementById("dust");
  var motes = [];
  for (var m = 0; m < 26; m++) {
    var dot = document.createElement("div");
    dot.className = "mote";
    var sz = 4 + Math.floor(rand() * 8);
    dot.style.width = sz + "px";
    dot.style.height = sz + "px";
    dot.style.left = Math.round(60 + rand() * 960) + "px";
    dot.style.top = Math.round(120 + rand() * 1450) + "px";
    dot.style.opacity = (0.28 + rand() * 0.45).toFixed(2);
    dustBox.appendChild(dot);
    motes.push({
      el: dot,
      dx: (rand() > 0.5 ? 1 : -1) * (16 + rand() * 28),
      dy: -(24 + rand() * 44),
      cyc: 4.2 + rand() * 2.6
    });
  }

  // Helper chuẩn bị SVG stroke draw
  function prepStroke(sel) {
    var nodes = document.querySelectorAll(sel);
    nodes.forEach(function (el) {
      var len = typeof el.getTotalLength === "function" ? el.getTotalLength() : 600;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
    });
  }

  prepStroke("#s1-x1, #s1-x2, .s5-cune, #s7-route, .s8-comp, .s10-sig, #s11-thread, .s12-arc");

  var tl = gsap.timeline({ paused: true });

  // 3. Hạt bụi môi trường hữu hạn (0 freeze events)
  motes.forEach(function (mt) {
    var reps = Math.max(0, Math.floor(TOTAL / mt.cyc) - 1);
    tl.to(mt.el, {
      x: mt.dx,
      y: mt.dy,
      duration: mt.cyc,
      repeat: reps,
      yoyo: true,
      ease: "sine.inOut"
    }, 0);
  });

  // 4. Camera thở liên tục và chuyển cảnh dứt khoát (không nhòe đè chữ)
  SC.forEach(function (s, i) {
    var endScale = i === SC.length - 1 ? 1.025 : 1.045;
    tl.fromTo("#cam", { scale: 1.0 }, { scale: endScale, duration: s.dur, ease: "sine.inOut", immediateRender: i === 0 }, s.start);

    var scEl = document.getElementById(s.id);
    if (i === 0) {
      tl.set(scEl, { opacity: 1 }, 0);
    } else if (i === SC.length - 1) {
      tl.set(scEl, { opacity: 1 }, s.start);
    } else {
      tl.fromTo(scEl, { opacity: 0 }, { opacity: 1, duration: 0.14, ease: "expo.out", immediateRender: false }, s.start);
    }
    if (i < SC.length - 1) {
      var exitAt = Math.max(s.start + 0.25, s.start + s.dur - 0.14);
      tl.to(scEl, { opacity: 0, duration: 0.13, ease: "power2.inOut" }, exitAt);
    }
  });

  // 5. Diễn hoạt 13 cảnh khóa chặt vào T(wordIndex) với Easing vật lý

  // S1 (0..3.241s): Gạt bỏ hợp đồng hiện đại
  tl.fromTo("#s1-folio", { y: 40, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, 0.04);
  tl.to("#s1-x1", { strokeDashoffset: 0, duration: 0.30, ease: "expo.out" }, T(8));
  tl.to("#s1-x2", { strokeDashoffset: 0, duration: 0.30, ease: "expo.out" }, T(9) + 0.06);
  tl.fromTo("#s1-stamp", { scale: 1.45, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.38, ease: "back.out(1.7)", immediateRender: false }, T(12));

  // S2 (3.241s..5.560s): Hook lật thuyền sông dữ
  var s2s = SC[1].start;
  tl.fromTo("#s2-title", { y: -26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, ease: "expo.out", immediateRender: false }, s2s + 0.04);
  tl.to(".s2-wave", { x: 24, duration: 1.1, repeat: 1, yoyo: true, ease: "sine.inOut" }, s2s);
  tl.fromTo("#s2-boat", { rotation: -6 }, { rotation: 16, duration: 0.55, ease: "elastic.out(1, 0.5)", immediateRender: false }, T(18));
  tl.to("#s2-boat", { rotation: -12, duration: 0.50, ease: "elastic.out(1, 0.5)" }, T(21));
  tl.fromTo("#s2-hl", { scaleX: 0 }, { scaleX: 1, duration: 0.42, ease: "power2.inOut", immediateRender: false }, T(20));

  // S3 (5.560s..9.740s): Trường Giang quá tải 1 thuyền
  var s3s = SC[2].start;
  tl.fromTo("#s3-ship", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "expo.out", immediateRender: false }, s3s + 0.06);
  tl.fromTo("#s3-crate", { y: -210, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "back.out(1.7)", immediateRender: false }, T(37));
  tl.to("#s3-ship", { y: 44, rotation: -3, duration: 0.45, ease: "power2.inOut" }, T(37) + 0.14);
  tl.fromTo("#s3-stamp", { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.38, ease: "back.out(1.7)", immediateRender: false }, T(41));

  // S4 (9.740s..15.100s): Chia nhỏ sang 5 thuyền
  var s4s = SC[3].start;
  tl.fromTo(".s4-b", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: "expo.out", immediateRender: false }, s4s + 0.05);
  tl.fromTo("#s4-src", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.32, ease: "back.out(1.7)", immediateRender: false }, s4s + 0.05);
  tl.to("#s4-src", { scale: 0.4, opacity: 0.25, duration: 0.35, ease: "power2.inOut" }, T(44));
  tl.fromTo(".s4-p", { y: -280, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, stagger: 0.08, ease: "back.out(1.7)", immediateRender: false }, T(44));
  tl.to("#s4-vortex", { opacity: 1, scale: 1.08, duration: 0.35, ease: "expo.out" }, T(58));
  tl.to("#s4-b3", { rotation: 26, y: 38, duration: 0.55, ease: "elastic.out(1, 0.5)" }, T(58) + 0.06);
  tl.to(".s4-ok", { opacity: 1, duration: 0.35, stagger: 0.05, ease: "back.out(1.7)" }, T(60));
  tl.fromTo("#s4-stamp", { scale: 1.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.40, ease: "back.out(1.7)", immediateRender: false }, T(60) + 0.10);

  // S5 (15.100s..19.000s): Bia đất nung Hammurabi
  var s5s = SC[4].start;
  tl.fromTo("#s5-stele", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: "expo.out", immediateRender: false }, s5s + 0.06);
  tl.to(".s5-cune", { strokeDashoffset: 0, duration: 0.32, stagger: 0.14, ease: "power2.inOut" }, T(69));
  tl.fromTo("#s5-hl", { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.inOut", immediateRender: false }, T(75));

  // S6 (19.000s..24.750s): Cán cân Hammurabi
  var s6s = SC[5].start;
  tl.fromTo("#s6-beam", { rotation: -9 }, { rotation: -6, duration: 0.36, ease: "expo.out", immediateRender: false }, s6s + 0.08);
  tl.fromTo("#s6-coin", { y: -150, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "back.out(1.7)", immediateRender: false }, T(84));
  tl.to("#s6-beam", { rotation: 10, duration: 0.45, ease: "power2.inOut" }, T(88));
  tl.to("#s6-storm", { opacity: 0.85, x: -16, duration: 0.45, ease: "power2.inOut" }, T(88));
  tl.to("#s6-beam", { rotation: 0, duration: 0.58, ease: "elastic.out(1, 0.5)" }, T(96));
  tl.fromTo("#s6-stamp", { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "elastic.out(1, 0.5)", immediateRender: false }, T(96) + 0.10);

  // S7 (24.750s..29.510s): Hải đồ Địa Trung Hải
  var s7s = SC[6].start;
  tl.fromTo("#s7-svg", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.36, ease: "expo.out", immediateRender: false }, s7s + 0.06);
  tl.to("#s7-route", { strokeDashoffset: 0, duration: 1.15, ease: "power2.inOut" }, T(111));
  tl.fromTo(".s7-port", { scale: 0 }, { scale: 1, duration: 0.34, stagger: 0.25, ease: "back.out(1.7)", immediateRender: false }, T(111) + 0.10);
  tl.fromTo("#s7-stamp", { scale: 1.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.40, ease: "back.out(1.7)", immediateRender: false }, T(119));

  // S8 (29.510s..34.250s): Thả bớt hàng cứu tàu & Cùng bù đắp
  var s8s = SC[7].start;
  tl.fromTo("#s8-ship", { rotation: -22 }, { rotation: -18, duration: 0.35, ease: "expo.out", immediateRender: false }, s8s + 0.06);
  tl.to("#s8-drop", { y: 175, x: -45, opacity: 0.4, duration: 0.65, ease: "power2.inOut" }, T(124));
  tl.to("#s8-ship", { rotation: 0, duration: 0.65, ease: "elastic.out(1, 0.5)" }, T(130));
  tl.to(".s8-comp", { strokeDashoffset: 0, duration: 0.65, stagger: 0.07, ease: "power2.inOut" }, T(134));
  tl.fromTo("#s8-fill", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)", immediateRender: false }, T(140));
  tl.fromTo("#s8-stamp", { scale: 1.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.40, ease: "back.out(1.7)", immediateRender: false }, T(139));

  // S9 (34.250s..36.876s): Quán cà phê cảng Luân Đôn
  var s9s = SC[8].start;
  tl.fromTo("#s9-svg", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "expo.out", immediateRender: false }, s9s + 0.05);
  tl.fromTo("#s9-cup", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.40, ease: "back.out(1.7)", immediateRender: false }, T(147));
  tl.to(".s9-steam", { y: -18, duration: 1.1, repeat: 1, yoyo: true, stagger: 0.12, ease: "sine.inOut" }, T(147));
  tl.fromTo("#s9-stamp", { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.36, ease: "back.out(1.7)", immediateRender: false }, T(151));

  // S10 (36.876s..43.200s): Giải mã Under-writing
  var s10s = SC[9].start;
  tl.fromTo("#s10-ledger", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38, ease: "expo.out", immediateRender: false }, s10s + 0.05);
  tl.to(".s10-sig", { strokeDashoffset: 0, duration: 0.62, stagger: 0.38, ease: "power2.inOut" }, T(157));
  tl.fromTo("#s10-hl", { scaleX: 0 }, { scaleX: 1, duration: 0.50, ease: "power2.inOut", immediateRender: false }, T(167));
  tl.fromTo("#s10-stamp", { scale: 1.45, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.46, ease: "elastic.out(1, 0.5)", immediateRender: false }, T(170));

  // S11 (43.200s..45.666s): Sợi chỉ thời gian xuyên suốt
  var s11s = SC[10].start;
  tl.to("#s11-thread", { strokeDashoffset: 0, duration: 1.45, ease: "power2.inOut" }, s11s + 0.06);
  tl.fromTo(".s11-node", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.34, stagger: 0.28, ease: "back.out(1.7)", immediateRender: false }, s11s + 0.10);
  tl.fromTo("#s11-stamp", { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.38, ease: "back.out(1.7)", immediateRender: false }, T(186));

  // S12 (45.666s..48.870s): Vòm hợp lực số đông đỡ một gia đình
  var s12s = SC[11].start;
  tl.fromTo("#s12-home", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.40, ease: "back.out(1.7)", immediateRender: false }, s12s + 0.05);
  tl.fromTo(".s12-dot", { scale: 0 }, { scale: 1, duration: 0.30, stagger: 0.05, ease: "back.out(1.7)", immediateRender: false }, T(189));
  tl.to(".s12-arc", { strokeDashoffset: 0, duration: 0.60, stagger: 0.05, ease: "power2.inOut" }, T(189));
  tl.fromTo("#s12-dome", { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42, ease: "back.out(1.7)", immediateRender: false }, T(193));
  tl.fromTo(".s12-bolt", { y: -45, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, stagger: 0.04, ease: "expo.out", immediateRender: false }, T(201) - 0.08);
  tl.to(".s12-bolt", { opacity: 0, y: -20, duration: 0.24, ease: "power2.inOut" }, T(201) + 0.22);
  tl.to("#s12-dome", { scale: 1.05, duration: 0.32, ease: "elastic.out(1, 0.5)" }, T(201));
  tl.to("#s12-dome", { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" }, T(201) + 0.32);
  tl.fromTo("#s12-stamp", { scale: 1.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.38, ease: "back.out(1.7)", immediateRender: false }, T(195));

  // S13 (48.870s..TOTAL): Brand Outro (hiện đủ 100% sắc nét ngay đầu cảnh)
  var s13s = SC[12].start;
  tl.fromTo("#o-card", { y: 22, scale: 0.96, opacity: 1 }, { y: 0, scale: 1, opacity: 1, duration: 0.28, ease: "back.out(1.7)", immediateRender: false }, s13s);
  tl.fromTo(["#o-logo-badge", "#o-name", "#o-title", "#o-rule", "#o-cta", "#o-sub", "#o-handle", "#o-disc"],
    { y: 10, opacity: 0.9 },
    { y: 0, opacity: 1, duration: 0.20, stagger: 0.015, ease: "expo.out", immediateRender: false },
    s13s + 0.01
  );
  tl.set("#o-cta-hl", { scaleX: 0 }, 0);
  tl.fromTo("#o-cta-hl", { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.inOut", immediateRender: false }, T(204));
  tl.fromTo("#o-cta", { scale: 1 }, { scale: 1.05, duration: 0.30, ease: "elastic.out(1, 0.5)", immediateRender: false }, T(204));
  tl.to("#o-cta", { scale: 1, duration: 0.32, ease: "elastic.out(1, 0.5)" }, T(204) + 0.34);

  // Micro-motion liên tục trên Outro chống lỗi freeze 3s
  var outroDur = Math.max(1.5, TOTAL - (s13s + 0.5));
  tl.to("#o-card", { y: -8, duration: outroDur / 2, repeat: 1, yoyo: true, ease: "sine.inOut" }, s13s + 0.45);
  tl.to("#o-emblem", { rotation: 24, duration: outroDur, ease: "sine.inOut" }, s13s + 0.45);

  // 6. Phụ đề Karaoke đồng bộ từng từ (tắt dòng cũ trước khi mở dòng mới 40ms)
  SUB.forEach(function (line, li) {
    var el = document.getElementById("sl" + li);
    var st = li === 0 ? 0 : Math.max(0, W[line[0]].s - 0.03);
    var en = li < SUB.length - 1 ? Math.max(st + 0.2, W[SUB[li + 1][0]].s - 0.04) : TOTAL;
    tl.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.14, ease: "expo.out", immediateRender: li === 0 }, st);
    if (li < SUB.length - 1) tl.set(el, { opacity: 0 }, en);
    line.forEach(function (wi) {
      var w = document.getElementById("sw" + wi), ws = W[wi].s, we = Math.max(W[wi].e, ws + 0.12);
      tl.fromTo(w, { scale: 1, y: 0, color: "rgba(255,255,255,0.62)" }, { scale: 1.18, y: -6, color: "#FDE047", duration: 0.1, ease: "back.out(3)", immediateRender: false }, ws);
      tl.to(w, { scale: 1, y: 0, color: "#FFFFFF", duration: 0.12, ease: "power2.out" }, we);
    });
  });

  window.__timelines["main"] = tl;
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(DIR, "index.html"), html, "utf8");

// 5. Xuất đồng bộ specs/video-spec.json và storyboard.json từ cùng nguồn timing
fs.mkdirSync(path.join(DIR, "specs"), { recursive: true });
const videoSpec = {
  schemaVersion: "0.1",
  project: { id: PROJECT_ID, title: "Thủy Tổ Bảo Hiểm Bắt Nguồn Từ Đâu?", version: 1 },
  format: { aspectRatio: "9:16", width: 1080, height: 1920, fpsPreference: 30, targetDurationMs: Math.round(TOTAL * 1000) },
  content: { coreMessage: "Nguồn gốc lịch sử của bảo hiểm và nguyên lý cộng đồng chia sẻ rủi ro", audience: "Gia đình Việt Nam quan tâm bảo vệ tài chính", tone: "Editorial Light · Điềm tĩnh", language: "vi" },
  script: {
    narration: words.map(w => w.w).join(" "),
    scenes: scenes.map(s => ({
      id: s.id,
      purpose: s.purpose,
      narration: s.narration,
      startMs: Math.round(s.start * 1000),
      durationMs: Math.round(s.dur * 1000),
      visualIntent: { description: s.desc, layout: s.layout },
      motionIntent: [{ type: s.motion, subject: s.id }],
      assets: [
        { id: "narration", type: "audio", path: "assets/audio/narration.mp3" },
        ...(s.id === "s13" ? [{ id: "manulife-logo", type: "image", path: "assets/branding/manulife-logo.png" }] : [])
      ]
    }))
  },
  engineRouting: { suggestedEngine: "HYPERFRAMES", reason: "Pure Bespoke V4 Compiler" }
};
fs.writeFileSync(path.join(DIR, "specs", "video-spec.json"), JSON.stringify(videoSpec, null, 2) + "\n", "utf8");
fs.writeFileSync(path.join(DIR, "storyboard.json"), JSON.stringify({ projectId: PROJECT_ID, totalDurationSec: TOTAL, audioDurationSec: AUDIO, scenes }, null, 2) + "\n", "utf8");

console.log(`Built ${PROJECT_ID}: ${TOTAL}s (${scenes.length} scenes, ${subLines.length} subtitle lines, ${words.length} words)`);
