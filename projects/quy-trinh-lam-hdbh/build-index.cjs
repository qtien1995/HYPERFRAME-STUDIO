/*
 * build-index.cjs — Trình biên dịch HyperFrames V4 Pure Bespoke
 * Dự án: quy-trinh-lam-hdbh (Quy Trình Từng Bước Để Làm 1 Hợp Đồng Bảo Hiểm)
 * Độc bản 100% · Editorial Ivory Archival & Legal Press + Hook Đỏ Son (#7F1D1D)
 * Đồng bộ từng từ qua VieNeu-TTS Hải Đăng 48kHz (Tốc độ 1.02 · 420 từ · 99.80s)
 */
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const PROJECT_ID = path.basename(DIR);
const timing = JSON.parse(fs.readFileSync(path.join(DIR, "assets/audio/timing.json"), "utf8"));

// 0. Đọc cấu hình dự án từ inputProps.json
const FORMATS = { "9:16": [1080, 1920], "16:9": [1920, 1080], "1:1": [1080, 1080] };
let inputProps = {};
const propsPath = path.join(DIR, "inputProps.json");
if (fs.existsSync(propsPath)) {
  try { inputProps = JSON.parse(fs.readFileSync(propsPath, "utf8")); } catch {}
}
const ASPECT = FORMATS[inputProps.format] ? inputProps.format : "9:16";
const [WIDTH, HEIGHT] = FORMATS[ASPECT];
const SUB_W = Math.min(WIDTH - 100, 980);
const SUB_BOTTOM = HEIGHT === 1080 ? 84 : 185;
const SUB_FONT = HEIGHT === 1080 ? 38 : 41;

// 1. Lọc và chuẩn hóa từng từ từ timing.json
const words = timing.words
  .filter(w => w.word && w.word.trim() && w.word.trim() !== "---")
  .map(w => ({
    w: w.word.trim(),
    s: +(w.startMs / 1000).toFixed(3),
    e: +((w.startMs + w.durationMs) / 1000).toFixed(3)
  }));

const AUDIO = +(timing.durationMs / 1000).toFixed(3);
const TAIL = 1.400;
const TOTAL = +(AUDIO + TAIL).toFixed(3);

// 2. Hàm khóa mốc chuyển cảnh theo từ khóa thật trong timing.json
const norm = s => s.toLowerCase().normalize("NFC").replace(/[.,:;!?'"“”]/g, "");
function anchor(idx, expect) {
  if (!words[idx] || norm(words[idx].w) !== norm(expect)) {
    throw new Error(`Anchor ${idx} expected "${expect}" got "${words[idx] && words[idx].w}"`);
  }
  return words[idx].s;
}

const LEAD = 0.25;
const sceneConfigs = [
  { id: "s1", act: "Cảnh 1 - Hook: Phá vỡ hiểu lầm ký là xong", cam: "punch-in", anchor: null },
  { id: "s2", act: "Cảnh 2 - Bước 1: Đo khoảng trống tài chính", cam: "pan-right", anchor: [41, "Bước"] },
  { id: "s3", act: "Cảnh 3 - Bước 2: Chuẩn bị bộ giấy tờ hợp lệ", cam: "breathe", anchor: [82, "Bước"] },
  { id: "s4", act: "Cảnh 4 - Bước 3: Hồ sơ yêu cầu & Kê khai trung thực", cam: "punch-in", anchor: [127, "Bước"] },
  { id: "s5", act: "Cảnh 5 - Yêu cầu Ghi âm tư vấn bắt buộc", cam: "pan-left", anchor: [172, "Đặc"] },
  { id: "s6", act: "Cảnh 6 - Bước 4: Thẩm định rủi ro & 4 ngã rẽ", cam: "pan-right", anchor: [217, "Bước"] },
  { id: "s7", act: "Cảnh 7 - Bước 5: Xác thực phát hành & Bảo vệ tạm thời", cam: "punch-in", anchor: [261, "Bước"] },
  { id: "s8", act: "Cảnh 8 - Bước 6: Bàn giao & 21 ngày cân nhắc miễn phí", cam: "breathe", anchor: [312, "Bước"] },
  { id: "s9", act: "Cảnh 9 - Điểm mù sau ngày 21 & Thời gian chờ", cam: "pan-left", anchor: [354, "Đừng"] },
  { id: "s10", act: "Cảnh 10 - Tổng kết quy trình & 5 chốt hành động", cam: "pull-back", anchor: [385, "Làm"] }
];

const cuts = [
  ...sceneConfigs.map((cfg, idx) =>
    idx === 0 || !cfg.anchor ? 0 : +(anchor(cfg.anchor[0], cfg.anchor[1]) - LEAD).toFixed(3)
  ),
  TOTAL
].map(v => +v.toFixed(3));

const scenes = sceneConfigs.map((cfg, i) => ({
  id: cfg.id,
  act: cfg.act,
  cam: cfg.cam,
  start: cuts[i],
  dur: +(cuts[i + 1] - cuts[i]).toFixed(3)
}));

// 3. Chia phụ đề Karaoke chuẩn 8–10 từ/dòng, ngắt sạch tại ranh giới cảnh
const sceneBreakWords = new Set([40, 81, 126, 171, 216, 260, 311, 353, 384]);
const subLines = [];
let cur = [];
words.forEach((w, i) => {
  cur.push(i);
  const punct = /[.,?!:;]$/.test(w.w);
  const isBreak = sceneBreakWords.has(i);
  if (
    isBreak ||
    (cur.length >= 8 && punct) ||
    cur.length >= 10 ||
    i === words.length - 1 ||
    (punct && cur.length >= 6 && words[i + 1] && words[i + 1].s - w.e > 0.35)
  ) {
    subLines.push(cur);
    cur = [];
  }
});
for (let i = subLines.length - 1; i > 0; i--) {
  const prevLast = subLines[i - 1][subLines[i - 1].length - 1];
  if (!sceneBreakWords.has(prevLast) && subLines[i].length < 4 && subLines[i - 1].length + subLines[i].length <= 12) {
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

// Sinh 28 thanh sóng âm SVG cho Cảnh 5 (Ghi âm bắt buộc)
const waveHeights = [22, 40, 68, 48, 86, 62, 108, 78, 124, 92, 66, 114, 88, 130, 96, 72, 118, 84, 58, 102, 74, 112, 64, 86, 52, 70, 38, 24];
const s5WaveBars = waveHeights.map((h, i) => {
  const x = 90 + i * 26;
  const y = Math.round(130 - h / 2);
  const fill = i >= 10 && i <= 17 ? "var(--accent-2)" : "var(--ink-primary)";
  return `<rect class="s5-bar" id="s5-bar-${i}" x="${x}" y="${y}" width="12" height="${h}" rx="6" fill="${fill}" opacity="0.88"/>`;
}).join("\n            ");

// Sinh vạch thước cửa sổ 01..21 cho Cảnh 8 (21 ngày cân nhắc)
const s8Ticks = Array.from({ length: 22 }, (_, i) => {
  const x = +(55 + (i / 21) * 750).toFixed(1);
  const isMajor = i === 0 || i === 7 || i === 14 || i === 21;
  const h = isMajor ? 42 : 18;
  const y1 = 110 - h;
  const label = isMajor ? `<text data-layout-ignore x="${x}" y="148" text-anchor="middle" font-size="22" font-weight="800" fill="${i === 21 ? "var(--status-danger)" : "var(--ink-secondary)"}" style="font-variant-numeric:tabular-nums">${i === 0 ? "01" : i}</text>` : "";
  return `<line x1="${x}" y1="${y1}" x2="${x}" y2="110" stroke="${i === 21 ? "var(--status-danger)" : "var(--ink-primary)"}" stroke-width="${isMajor ? 3.5 : 1.8}" opacity="${isMajor ? 0.95 : 0.45}"/>${label}`;
}).join("\n            ");

// 4. Xuất HTML hoàn chỉnh + GSAP Timeline
const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=${WIDTH}, height=${HEIGHT}">
<title>Quy Trình Từng Bước Để Làm 1 Hợp Đồng Bảo Hiểm</title>
<style>
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Medium.ttf') format('truetype'); font-weight: 500; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Bold.ttf') format('truetype'); font-weight: 700; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-ExtraBold.ttf') format('truetype'); font-weight: 800; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Black.ttf') format('truetype'); font-weight: 900; font-style: normal; }

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

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root {
  width: 100%; height: 100%; overflow: hidden;
  font-family: 'Be Vietnam Pro', sans-serif;
  background: var(--bg-stage); color: var(--ink-primary);
}

#bg-canvas { position: absolute; inset: 0; width: ${WIDTH}px; height: ${HEIGHT}px; z-index: 0; }
#lamp { position: absolute; inset: 0; pointer-events: none; z-index: 1; background: var(--lamp-vignette); }
#dust { position: absolute; inset: 0; pointer-events: none; z-index: 2; overflow: hidden; }
.mote { position: absolute; border-radius: 50%; background: rgba(217, 119, 6, 0.28); filter: blur(1px); }

#cam { position: absolute; inset: 0; transform-origin: 50% 42%; z-index: 3; }
.scene, .wrap { position: absolute; inset: 0; width: ${WIDTH}px; height: ${HEIGHT}px; }
#s2w, #s3w, #s4w, #s5w, #s6w, #s7w, #s8w, #s9w, #s10w { opacity: 0; }

/* Archival Header & Typography */
.archival-ref {
  position: absolute; top: 76px; left: 72px; right: 72px;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 20px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase;
  color: var(--ink-secondary); opacity: 0.56; font-variant-numeric: tabular-nums;
}
.scene-kicker {
  position: absolute; top: 142px; left: 50%; width: 780px; margin-left: -390px; text-align: center;
  font-size: 28px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
}
.scene-kicker span {
  display: inline-block; padding: 10px 28px; border-radius: 999px;
  background: var(--bg-elevated); color: var(--accent-2);
  border: 2.5px solid rgba(15, 118, 110, 0.35);
  box-shadow: 0 4px 12px rgba(26, 27, 30, 0.06);
}
.kicker-danger span { color: var(--status-danger); border-color: rgba(185, 28, 28, 0.35); background: #FFF5F5; }
.kicker-amber span { color: var(--accent-amber); border-color: rgba(217, 119, 6, 0.35); background: #FFFBEB; }
.kicker-success span { color: var(--status-success); border-color: rgba(5, 150, 105, 0.35); background: #ECFDF5; }

.scene-title {
  position: absolute; top: 222px; left: 72px; right: 72px; text-align: center;
  font-size: 52px; font-weight: 900; line-height: 1.18; letter-spacing: -0.02em; color: var(--ink-primary);
}
.scene-sub {
  position: absolute; top: 304px; left: 86px; right: 86px; text-align: center;
  font-size: 29px; font-weight: 600; line-height: 1.35; color: var(--ink-secondary);
}

/* ================= CẢNH 1: HOOK ĐỎ SON (FRAME-0 IMPACT) ================= */
#s1w {
  background: radial-gradient(circle 920px at 50% 40%, #991B1B 0%, var(--bg-hook) 70%, #450A0A 100%);
  color: var(--ink-hook);
}
#s1-grid {
  position: absolute; inset: 48px; border: 2px solid rgba(250, 246, 238, 0.16);
  pointer-events: none;
}
#s1-top-badge {
  position: absolute; top: 120px; left: 50%; width: 580px; margin-left: -290px; text-align: center;
  font-size: 24px; font-weight: 800; letter-spacing: 0.14em; color: var(--accent-1);
}
#s1-dossier-hero {
  position: absolute; top: 430px; left: 100px; width: 880px; padding: 54px 48px;
  background: var(--ink-hook); color: var(--ink-primary); border-radius: 26px;
  box-shadow: 0 28px 64px rgba(0, 0, 0, 0.38); border: 4px solid #E5DEC9;
  transform: rotate(-1.5deg);
}
.s1-doc-tag {
  font-size: 22px; font-weight: 800; letter-spacing: 0.14em; color: var(--status-danger);
  border-bottom: 3px solid rgba(26, 27, 30, 0.14); padding-bottom: 16px; margin-bottom: 26px;
  display: flex; justify-content: space-between;
}
.s1-hook-line1 {
  font-size: 50px; font-weight: 800; color: var(--ink-primary); line-height: 1.25;
}
.s1-hook-line2-wrap {
  position: relative; display: inline-block; margin-top: 12px;
}
.s1-hook-line2 {
  font-size: 86px; font-weight: 900; color: var(--status-danger); letter-spacing: -0.02em; line-height: 1.05;
}
#s1-strike {
  position: absolute; left: -18px; top: 50%; width: calc(100% + 36px); height: 18px; margin-top: -9px;
  background: var(--ink-primary); border-radius: 9px; transform-origin: 0% 50%; transform: scaleX(0);
  box-shadow: 0 4px 0 var(--accent-1);
}
#s1-sk-rows { margin-top: 28px; display: flex; flex-direction: column; gap: 12px; }
.s1-sk { height: 10px; border-radius: 5px; background: var(--ink-dim); }
#s1-myth-stamp {
  position: absolute; right: 36px; bottom: 28px; padding: 14px 26px;
  border: 6px solid var(--status-danger); border-radius: 14px; color: var(--status-danger);
  font-size: 32px; font-weight: 900; transform: rotate(-10deg); background: rgba(250, 246, 238, 0.94);
}
#s1-rail-box {
  position: absolute; top: 755px; left: 70px; width: 940px; height: 540px; opacity: 0;
}
#s1-rail-head {
  text-align: center; font-size: 40px; font-weight: 900; color: var(--accent-1);
  letter-spacing: 0.04em; margin-bottom: 34px;
}
.s1-steps-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
}
.s1-step-chip {
  background: rgba(250, 246, 238, 0.10); border: 2.5px solid rgba(250, 246, 238, 0.38);
  border-radius: 20px; padding: 24px 18px; text-align: center; opacity: 0;
}
.s1-chip-num {
  font-size: 24px; font-weight: 900; color: var(--accent-1); letter-spacing: 0.1em; font-variant-numeric: tabular-nums;
}
.s1-chip-txt {
  margin-top: 10px; font-size: 28px; font-weight: 800; color: var(--ink-hook); line-height: 1.25;
}

/* ================= CẢNH 2: BƯỚC 1 - ĐO KHOẢNG TRỐNG TÀI CHÍNH ================= */
#s2-reject-pill {
  position: absolute; top: 382px; left: 50%; width: 540px; margin-left: -270px; text-align: center;
  padding: 16px 28px; border-radius: 16px; background: var(--bg-surface); border: 2.5px solid var(--ink-dim);
  font-size: 32px; font-weight: 800; color: var(--ink-secondary);
}
#s2-reject-line {
  position: absolute; left: 32px; top: 50%; width: calc(100% - 64px); height: 7px; margin-top: -3.5px;
  background: var(--status-danger); border-radius: 4px; transform-origin: 0% 50%; transform: scaleX(0);
}
#s2-scale-stage {
  position: absolute; top: 510px; left: 70px; width: 940px; height: 640px;
}
#s2-status-banner {
  position: absolute; top: 1180px; left: 130px; width: 820px; padding: 24px 34px;
  border-radius: 22px; background: var(--bg-elevated); border: 3px solid var(--status-success);
  box-shadow: var(--dossier-shadow); text-align: center; opacity: 0;
}
#s2-status-banner strong { font-size: 34px; font-weight: 900; color: var(--status-success); }

/* ================= CẢNH 3: BƯỚC 2 - BỘ GIẤY TỜ HỢP LỆ ================= */
#s3-tray {
  position: absolute; top: 410px; left: 90px; width: 900px; height: 960px;
}
.s3-folder {
  position: relative; width: 100%; margin-bottom: 34px; padding: 30px 36px;
  background: var(--bg-elevated); border-radius: 22px; border: 3px solid var(--ink-primary);
  box-shadow: var(--dossier-shadow); display: flex; align-items: center; gap: 28px; opacity: 0;
}
.s3-folder::before {
  content: attr(data-tab); position: absolute; top: -26px; left: 34px;
  padding: 4px 20px; border-radius: 12px 12px 0 0; background: var(--ink-primary); color: var(--ink-hook);
  font-size: 20px; font-weight: 800; letter-spacing: 0.08em; font-variant-numeric: tabular-nums;
}
.s3-icon-box {
  width: 110px; height: 110px; border-radius: 18px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-surface); border: 2px solid var(--ink-dim);
}
.s3-info h3 { font-size: 34px; font-weight: 900; color: var(--ink-primary); line-height: 1.2; }
.s3-info p { margin-top: 8px; font-size: 28px; font-weight: 600; color: var(--ink-secondary); }
.s3-check-badge {
  margin-left: auto; padding: 10px 20px; border-radius: 12px;
  background: #ECFDF5; border: 2px solid var(--status-success); color: var(--status-success);
  font-size: 28px; font-weight: 900; flex-shrink: 0; opacity: 0;
}

/* ================= CẢNH 4: BƯỚC 3 - KÊ KHAI TRUNG THỰC TUYỆT ĐỐI ================= */
#s4-form {
  position: absolute; top: 395px; left: 100px; width: 880px; padding: 40px 44px;
  background: var(--bg-elevated); border: 3px solid var(--ink-primary); border-radius: 22px;
  box-shadow: var(--dossier-shadow); overflow: hidden;
}
.s4-form-hdr {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 3px solid var(--ink-primary); padding-bottom: 18px; margin-bottom: 24px;
}
.s4-form-hdr span { font-size: 26px; font-weight: 900; letter-spacing: 0.04em; }
.s4-row {
  display: flex; align-items: center; justify-content: space-between; padding: 18px 20px;
  border-radius: 14px; margin-bottom: 16px; background: var(--bg-stage); border: 2px solid var(--ink-dim);
}
.s4-row-lbl { font-size: 28px; font-weight: 800; color: var(--ink-primary); }
.s4-row-val { font-size: 28px; font-weight: 800; padding: 6px 16px; border-radius: 10px; }
.s4-ok { background: #ECFDF5; color: var(--status-success); border: 2px solid var(--status-success); }
#s4-hidden-row { background: #FEF2F2; border-color: rgba(185, 28, 28, 0.35); }
#s4-hidden-val { background: var(--status-danger); color: #FFFDF8; opacity: 0; }
#s4-scanner {
  position: absolute; left: 0; right: 0; top: 80px; height: 10px;
  background: var(--accent-2); box-shadow: 0 0 26px 8px rgba(15, 118, 110, 0.45);
  z-index: 4; opacity: 0;
}
#s4-circuit-box {
  position: absolute; top: 960px; left: 100px; width: 880px; height: 420px;
}
#s4-reject-stamp {
  position: absolute; top: 170px; left: 50%; width: 460px; margin-left: -230px; padding: 18px 24px;
  border: 7px solid var(--status-danger); border-radius: 16px; background: rgba(255, 253, 248, 0.96);
  color: var(--status-danger); font-size: 38px; font-weight: 900; text-align: center;
  transform: rotate(-6deg); box-shadow: 0 14px 30px rgba(185, 28, 28, 0.25); opacity: 0;
}

/* ================= CẢNH 5: YÊU CẦU GHI ÂM BẮT BUỘC ================= */
#s5-tape-deck {
  position: absolute; top: 410px; left: 80px; width: 920px; padding: 40px 42px;
  background: var(--bg-elevated); border: 3px solid var(--ink-primary); border-radius: 28px;
  box-shadow: var(--dossier-shadow);
}
.s5-deck-top {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
}
.s5-rec-pill {
  display: inline-flex; align-items: center; gap: 12px; padding: 10px 22px;
  border-radius: 999px; background: #FEF2F2; border: 2px solid var(--status-danger);
  color: var(--status-danger); font-size: 24px; font-weight: 900;
}
.s5-rec-dot { width: 16px; height: 16px; border-radius: 50%; background: var(--status-danger); }
#s5-wave-box {
  position: relative; width: 100%; height: 270px; background: var(--bg-stage);
  border-radius: 20px; border: 2px solid var(--ink-dim); overflow: hidden;
}
#s5-proof-row {
  position: absolute; top: 880px; left: 80px; width: 920px;
  display: flex; justify-content: space-between; gap: 18px;
}
.s5-proof-tag {
  flex: 1; padding: 22px 14px; border-radius: 18px; background: var(--bg-elevated);
  border: 2.5px solid var(--accent-2); text-align: center; font-size: 27px; font-weight: 900;
  color: var(--accent-2); box-shadow: var(--dossier-shadow); opacity: 0;
}
#s5-lock-seal {
  position: absolute; top: 1045px; left: 110px; width: 860px; padding: 24px 28px;
  border-radius: 22px; background: var(--accent-2); color: #FFFDF8;
  display: flex; align-items: center; justify-content: center; gap: 18px;
  font-size: 30px; font-weight: 900; box-shadow: var(--dossier-shadow); opacity: 0;
  white-space: nowrap;
}

/* ================= CẢNH 6: BƯỚC 4 - THẨM ĐỊNH & 4 NGÃ RẼ ================= */
#s6-inspect-top {
  position: absolute; top: 380px; left: 110px; width: 860px; height: 290px;
}
#s6-loupe {
  position: absolute; top: 20px; left: 260px; width: 220px; height: 220px;
}
#s6-free-exam {
  position: absolute; top: 168px; left: 430px; padding: 14px 26px; border-radius: 14px;
  background: #FFFBEB; border: 2.5px solid var(--accent-amber); color: var(--accent-amber);
  font-size: 28px; font-weight: 900; box-shadow: var(--dossier-shadow); opacity: 0;
}
#s6-tracks-svg {
  position: absolute; top: 650px; left: 70px; width: 940px; height: 230px;
}
#s6-gates {
  position: absolute; top: 880px; left: 60px; width: 960px;
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;
}
.s6-gate {
  padding: 28px 26px; border-radius: 20px; background: var(--bg-elevated);
  border: 3px solid var(--ink-primary); box-shadow: var(--dossier-shadow); opacity: 0;
}
.s6-gate-idx { font-size: 20px; font-weight: 800; letter-spacing: 0.1em; opacity: 0.72; }
.s6-gate-name { margin-top: 8px; font-size: 34px; font-weight: 900; }
#s6-g1 { border-color: var(--status-success); color: var(--status-success); background: #ECFDF5; }
#s6-g2 { border-color: var(--accent-amber); color: var(--accent-amber); background: #FFFBEB; }
#s6-g3 { border-color: var(--accent-2); color: var(--accent-2); background: #F0FDFA; }
#s6-g4 { border-color: var(--status-danger); color: var(--status-danger); background: #FEF2F2; }

/* ================= CẢNH 7: BƯỚC 5 - XÁC THỰC & LÁ CHẮN 2 TẦNG ================= */
#s7-auth-panel {
  position: absolute; top: 385px; left: 90px; width: 900px;
  display: flex; flex-direction: column; gap: 18px;
}
.s7-switch {
  display: flex; align-items: center; justify-content: space-between; padding: 20px 30px;
  border-radius: 18px; background: var(--bg-elevated); border: 2.5px solid var(--ink-primary);
  box-shadow: 0 8px 20px rgba(26, 27, 30, 0.08);
}
.s7-sw-lbl { font-size: 30px; font-weight: 800; color: var(--ink-primary); }
.s7-track {
  position: relative; width: 130px; height: 54px; border-radius: 999px;
  background: var(--bg-surface); border: 2.5px solid var(--ink-dim); padding: 4px;
}
.s7-knob {
  width: 42px; height: 42px; border-radius: 50%; background: var(--ink-secondary);
}
#s7-shield-stage {
  position: absolute; top: 750px; left: 90px; width: 900px; height: 610px;
}
#s7-temp-label {
  position: absolute; top: 215px; left: 45px; width: 360px; text-align: center;
  padding: 16px 18px; border-radius: 16px; background: #FFFBEB; border: 2.5px solid var(--accent-amber);
  color: var(--accent-amber); font-size: 28px; font-weight: 900;
}
#s7-full-label {
  position: absolute; top: 215px; right: 45px; width: 360px; text-align: center;
  padding: 16px 18px; border-radius: 16px; background: #ECFDF5; border: 2.5px solid var(--status-success);
  color: var(--status-success); font-size: 28px; font-weight: 900; opacity: 0;
}
#s7-issue-stamp {
  position: absolute; top: 410px; left: 50%; width: 420px; margin-left: -210px; padding: 16px 22px;
  border: 6px solid var(--status-success); border-radius: 16px; background: rgba(255, 253, 248, 0.96);
  color: var(--status-success); font-size: 36px; font-weight: 900; text-align: center;
  transform: rotate(-5deg); box-shadow: 0 12px 28px rgba(5, 150, 105, 0.25); opacity: 0;
}

/* ================= CẢNH 8: BƯỚC 6 - BÀN GIAO & 21 NGÀY CÂN NHẮC ================= */
#s8-handover-doc {
  position: absolute; top: 390px; left: 110px; width: 860px; padding: 32px 40px;
  background: var(--bg-elevated); border: 3px solid var(--ink-primary); border-radius: 22px;
  box-shadow: var(--dossier-shadow);
}
.s8-doc-top {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 28px; font-weight: 900; color: var(--ink-primary); margin-bottom: 16px;
}
#s8-window-stage {
  position: absolute; top: 690px; left: 100px; width: 880px; height: 420px;
  background: var(--bg-elevated); border: 3px solid var(--accent-2); border-radius: 26px;
  box-shadow: var(--dossier-shadow); padding: 34px 36px;
}
#s8-day-counter {
  text-align: center; font-size: 110px; font-weight: 900; line-height: 1;
  color: var(--accent-2); font-variant-numeric: tabular-nums;
}
#s8-day-unit {
  text-align: center; font-size: 30px; font-weight: 800; color: var(--ink-secondary);
  letter-spacing: 0.12em; margin-top: 6px;
}
#s8-ruler-wrap { position: relative; width: 100%; height: 170px; margin-top: 12px; }
#s8-hl-band {
  position: absolute; left: 55px; top: 44px; width: 750px; height: 66px;
  background: var(--accent-1); border-radius: 10px; opacity: 0.72;
  mix-blend-mode: multiply; transform-origin: 0% 50%; transform: scaleX(0);
}
#s8-refund-pill {
  position: absolute; top: 1150px; left: 130px; width: 820px; padding: 24px 34px;
  border-radius: 20px; background: #ECFDF5; border: 3px solid var(--status-success);
  text-align: center; font-size: 34px; font-weight: 900; color: var(--status-success);
  box-shadow: var(--dossier-shadow); opacity: 0;
}

/* ================= CẢNH 9: ĐIỂM MÙ SAU NGÀY 21 ================= */
#s9-vault-stage {
  position: absolute; top: 400px; left: 110px; width: 860px; height: 540px;
}
#s9-dossier-box {
  position: absolute; top: 132px; left: 100px; width: 660px; padding: 34px 36px 96px;
  background: var(--bg-elevated); border: 3px solid var(--ink-primary); border-radius: 22px;
  box-shadow: var(--dossier-shadow); text-align: center;
}
#s9-dossier-box h3 { font-size: 38px; font-weight: 900; color: var(--ink-primary); }
#s9-dossier-box p { margin-top: 10px; font-size: 25px; font-weight: 700; color: var(--ink-secondary); }
#s9-jaw-top {
  position: absolute; top: 20px; left: 190px; width: 480px; height: 84px;
  background: var(--ink-primary); border-radius: 18px 18px 6px 6px;
  border-bottom: 8px solid var(--accent-amber);
}
#s9-jaw-bot {
  position: absolute; bottom: 28px; left: 190px; width: 480px; height: 84px;
  background: var(--ink-primary); border-radius: 6px 6px 18px 18px;
  border-top: 8px solid var(--accent-amber);
}
#s9-lock-stamp {
  position: absolute; top: 294px; left: 50%; width: 500px; margin-left: -250px; padding: 12px 20px;
  border: 6px solid var(--status-danger); border-radius: 14px; background: rgba(255, 253, 248, 0.96);
  color: var(--status-danger); font-size: 29px; font-weight: 900; text-align: center; white-space: nowrap;
  transform: rotate(-4deg); box-shadow: 0 12px 28px rgba(185, 28, 28, 0.22); opacity: 0;
}
#s9-wait-bar {
  position: absolute; top: 990px; left: 110px; width: 860px; padding: 28px 36px;
  background: #FFFBEB; border: 3px solid var(--accent-amber); border-radius: 22px;
  display: flex; align-items: center; gap: 28px; box-shadow: var(--dossier-shadow); opacity: 0;
}
#s9-gear { width: 86px; height: 86px; flex-shrink: 0; }
#s9-wait-txt h4 { font-size: 32px; font-weight: 900; color: var(--accent-amber); }
#s9-wait-txt p { margin-top: 6px; font-size: 28px; font-weight: 600; color: var(--ink-secondary); }

/* ================= CẢNH 10: TỔNG KẾT QUY TRÌNH ================= */
#s10-chain-box {
  position: absolute; top: 380px; left: 90px; width: 900px; height: 800px;
}
.s10-node {
  position: relative; width: 100%; padding: 22px 32px; margin-bottom: 22px;
  background: var(--bg-elevated); border: 3px solid var(--ink-primary); border-radius: 20px;
  box-shadow: var(--dossier-shadow); display: flex; align-items: center; gap: 22px; opacity: 0;
}
.s10-num {
  width: 58px; height: 58px; border-radius: 14px; background: var(--accent-2); color: #FFFDF8;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: 900; font-variant-numeric: tabular-nums; flex-shrink: 0;
}
.s10-lbl { font-size: 32px; font-weight: 900; color: var(--ink-primary); }
.s10-sub { margin-left: auto; font-size: 24px; font-weight: 700; color: var(--accent-2); }
#s10-final-banner {
  position: absolute; top: 1210px; left: 90px; width: 900px; padding: 26px 34px;
  border-radius: 22px; background: var(--ink-primary); color: var(--accent-1);
  text-align: center; font-size: 32px; font-weight: 900; line-height: 1.32;
  box-shadow: var(--dossier-shadow); opacity: 0;
}

/* ================= PHỤ ĐỀ KARAOKE ================= */
#subs {
  position: absolute; left: 0; right: 0; bottom: ${SUB_BOTTOM}px; height: 200px;
  pointer-events: none; z-index: 10;
}
.sub-line {
  position: absolute; left: 50%; bottom: 0; width: ${SUB_W}px; margin-left: -${Math.round(SUB_W / 2)}px;
  text-align: center; opacity: 0; padding: 20px 30px;
  background: var(--bg-overlay); border-radius: 24px;
  font-size: ${SUB_FONT}px; font-weight: 800; line-height: 1.42; color: rgba(255, 255, 255, 0.58);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);
}
.sub-word { display: inline-block; margin: 0 5px; transform-origin: 50% 80%; }
</style>
<script src="assets/vendor/gsap.min.js"></script>
</head>
<body>
<div id="root" data-composition-id="main" data-width="${WIDTH}" data-height="${HEIGHT}" data-duration="${TOTAL}">
  <audio id="narration" src="assets/audio/narration.mp3" data-start="0" data-duration="${AUDIO}" data-track-index="0"></audio>
  <canvas id="bg-canvas"></canvas>
  <div id="lamp"></div>
  <div id="dust"></div>

  <div id="cam">
    <!-- CẢNH 1: HOOK -->
    <div ${sceneAttr("s1")}>
      <div class="wrap" id="s1w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div id="s1-grid"></div>
        <div id="s1-top-badge" data-layout-ignore>HỒ SƠ BẢO HIỂM NHÂN THỌ · SỰ THẬT PHÁP LÝ</div>

        <div id="s1-dossier-hero" data-layout-allow-occlusion>
          <div class="s1-doc-tag" data-layout-ignore>
            <span>MẪU ĐƠN YÊU CẦU</span>
            <span>TRẠNG THÁI: CHỜ KIỂM ĐỊNH</span>
          </div>
          <div class="s1-hook-line1">CHỌN GÓI · KÝ TÊN</div>
          <div class="s1-hook-line2-wrap" data-layout-allow-occlusion>
            <div class="s1-hook-line2" data-layout-allow-occlusion>= XONG NGAY?</div>
            <div id="s1-strike" data-layout-allow-occlusion></div>
          </div>
          <div id="s1-sk-rows">
            <div class="s1-sk" style="width:92%;"></div>
            <div class="s1-sk" style="width:74%;"></div>
            <div class="s1-sk" style="width:58%;"></div>
          </div>
          <div id="s1-myth-stamp">HIỂU LẦM PHỔ BIẾN</div>
        </div>

        <div id="s1-rail-box">
          <div id="s1-rail-head">QUY TRÌNH 6 CHẶNG CHUẨN ĐỂ HỢP ĐỒNG "SỐNG"</div>
          <div class="s1-steps-grid">
            <div class="s1-step-chip" id="s1-c1"><div class="s1-chip-num" data-layout-ignore>BƯỚC 01</div><div class="s1-chip-txt">Đo Nhu Cầu</div></div>
            <div class="s1-step-chip" id="s1-c2"><div class="s1-chip-num" data-layout-ignore>BƯỚC 02</div><div class="s1-chip-txt">Đủ Giấy Tờ</div></div>
            <div class="s1-step-chip" id="s1-c3"><div class="s1-chip-num" data-layout-ignore>BƯỚC 03</div><div class="s1-chip-txt">Khai &amp; Ghi Âm</div></div>
            <div class="s1-step-chip" id="s1-c4"><div class="s1-chip-num" data-layout-ignore>BƯỚC 04</div><div class="s1-chip-txt">Thẩm Định</div></div>
            <div class="s1-step-chip" id="s1-c5"><div class="s1-chip-num" data-layout-ignore>BƯỚC 05</div><div class="s1-chip-txt">Xác Thực</div></div>
            <div class="s1-step-chip" id="s1-c6"><div class="s1-chip-num" data-layout-ignore>BƯỚC 06</div><div class="s1-chip-txt">21 Ngày Soi</div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- CẢNH 2: BƯỚC 1 - ĐO KHOẢNG TRỐNG TÀI CHÍNH -->
    <div ${sceneAttr("s2")}>
      <div class="wrap" id="s2w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="archival-ref" data-layout-ignore><span>HỒ SƠ BẢO HIỂM · TRẠM 01</span><span>NGUYÊN LÝ THIẾT KẾ</span></div>
        <div class="scene-kicker"><span>BƯỚC 1 · ĐỊNH LƯỢNG NHU CẦU</span></div>
        <div class="scene-title">Đo Khoảng Trống Tài Chính</div>
        <div class="scene-sub">Không chọn gói theo giá rẻ — tính đúng mức gia đình cần khi trụ cột vắng mặt</div>

        <div id="s2-reject-pill">
          CHỌN GÓI NÀO RẺ NHẤT?
          <div id="s2-reject-line"></div>
        </div>

        <div id="s2-scale-stage">
          <svg viewBox="0 0 940 620" width="940" height="620">
            <!-- Trụ cân cố định -->
            <polygon points="470,410 420,560 520,560" fill="var(--ink-primary)"/>
            <rect x="340" y="556" width="260" height="22" rx="11" fill="var(--ink-primary)"/>
            <!-- Thước độ cân bằng -->
            <path d="M 380,350 A 110,110 0 0,1 560,350" fill="none" stroke="var(--ink-dim)" stroke-width="6" stroke-dasharray="10 8"/>
            <circle cx="470" cy="300" r="14" fill="var(--accent-amber)"/>

            <!-- Thanh đòn bẩy xoay quanh (470, 390) -->
            <g id="s2-beam" style="transform-origin: 470px 390px;">
              <rect x="110" y="378" width="720" height="24" rx="12" fill="var(--ink-primary)"/>
              <circle cx="470" cy="390" r="26" fill="var(--bg-elevated)" stroke="var(--ink-primary)" stroke-width="8"/>

              <!-- Đĩa trái: Chi phí gia đình -->
              <rect x="120" y="346" width="250" height="24" rx="8" fill="var(--ink-secondary)"/>
              <g id="s2-left-stack">
                <rect x="145" y="136" width="200" height="202" rx="18" fill="#FEF2F2" stroke="var(--status-danger)" stroke-width="5"/>
                <text x="245" y="218" text-anchor="middle" font-size="28" font-weight="900" fill="var(--status-danger)">CHI PHÍ SỐNG</text>
                <text x="245" y="256" text-anchor="middle" font-size="24" font-weight="700" fill="var(--ink-secondary)">&amp; NỢ GIA ĐÌNH</text>
                <rect x="175" y="284" width="140" height="10" rx="5" fill="rgba(185,28,28,0.22)"/>
              </g>

              <!-- Đĩa phải: Mệnh giá bảo vệ -->
              <rect x="570" y="346" width="250" height="24" rx="8" fill="var(--accent-2)"/>
              <g id="s2-right-block">
                <rect x="595" y="136" width="200" height="202" rx="18" fill="#ECFDF5" stroke="var(--status-success)" stroke-width="5"/>
                <text x="695" y="218" text-anchor="middle" font-size="28" font-weight="900" fill="var(--status-success)">MỆNH GIÁ</text>
                <text x="695" y="256" text-anchor="middle" font-size="28" font-weight="900" fill="var(--status-success)">BẢO VỆ</text>
                <rect x="625" y="284" width="140" height="10" rx="5" fill="rgba(5,150,105,0.28)"/>
              </g>
            </g>
          </svg>
        </div>

        <div id="s2-status-banner"><strong>CÂN BẰNG 0° · QUY RA ĐÚNG MỆNH GIÁ BẢO VỆ</strong></div>
      </div>
    </div>

    <!-- CẢNH 3: BƯỚC 2 - CHUẨN BỊ BỘ GIẤY TỜ HỢP LỆ -->
    <div ${sceneAttr("s3")}>
      <div class="wrap" id="s3w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="archival-ref" data-layout-ignore><span>HỒ SƠ BẢO HIỂM · TRẠM 02</span><span>HỒ SƠ PHÁP LÝ GỐC</span></div>
        <div class="scene-kicker"><span>BƯỚC 2 · CHUẨN BỊ GIẤY TỜ</span></div>
        <div class="scene-title">3 Nhóm Giấy Tờ Cần Có</div>
        <div class="scene-sub">Chuẩn bị đầy đủ ngay từ đầu giúp hồ sơ thông suốt không bị treo bổ sung</div>

        <div id="s3-tray">
          <div class="s3-folder" id="s3-f1" data-tab="TẬP 01 · NHÂN THÂN">
            <div class="s3-icon-box">
              <svg viewBox="0 0 80 80" width="76" height="76">
                <rect x="8" y="18" width="64" height="44" rx="8" fill="none" stroke="var(--ink-primary)" stroke-width="4"/>
                <circle cx="28" cy="38" r="9" fill="var(--accent-2)"/>
                <line x1="44" y1="32" x2="64" y2="32" stroke="var(--ink-primary)" stroke-width="4" stroke-linecap="round"/>
                <line x1="44" y1="44" x2="60" y2="44" stroke="var(--ink-secondary)" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="s3-info">
              <h3>CCCD / Hộ Chiếu</h3>
              <p>Hoặc Giấy khai sinh (nếu mua cho con)</p>
            </div>
            <div class="s3-check-badge" id="s3-ok1">BẮT BUỘC</div>
          </div>

          <div class="s3-folder" id="s3-f2" data-tab="TẬP 02 · Y TẾ">
            <div class="s3-icon-box">
              <svg viewBox="0 0 80 80" width="76" height="76">
                <rect x="16" y="10" width="48" height="60" rx="8" fill="none" stroke="var(--status-danger)" stroke-width="4"/>
                <line x1="40" y1="26" x2="40" y2="48" stroke="var(--status-danger)" stroke-width="6" stroke-linecap="round"/>
                <line x1="29" y1="37" x2="51" y2="37" stroke="var(--status-danger)" stroke-width="6" stroke-linecap="round"/>
                <line x1="26" y1="58" x2="54" y2="58" stroke="var(--ink-dim)" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="s3-info">
              <h3>Hồ Sơ Khám Bệnh Cũ</h3>
              <p>Giấy ra viện, đơn thuốc nếu từng điều trị</p>
            </div>
            <div class="s3-check-badge" id="s3-ok2">NẾU CÓ</div>
          </div>

          <div class="s3-folder" id="s3-f3" data-tab="TẬP 03 · TÀI CHÍNH">
            <div class="s3-icon-box">
              <svg viewBox="0 0 80 80" width="76" height="76">
                <rect x="12" y="16" width="56" height="48" rx="8" fill="none" stroke="var(--accent-amber)" stroke-width="4"/>
                <path d="M 22,50 L 36,38 L 46,44 L 60,26" fill="none" stroke="var(--accent-amber)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="s3-info">
              <h3>Chứng Minh Thu Nhập</h3>
              <p>Bảng lương, sao kê khi mệnh giá cao</p>
            </div>
            <div class="s3-check-badge" id="s3-ok3">MỆNH GIÁ CAO</div>
          </div>
        </div>
      </div>
    </div>

    <!-- CẢNH 4: BƯỚC 3 - HỒ SƠ YÊU CẦU & KÊ KHAI TRUNG THỰC -->
    <div ${sceneAttr("s4")}>
      <div class="wrap" id="s4w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="archival-ref" data-layout-ignore><span>HỒ SƠ BẢO HIỂM · TRẠM 03</span><span>NGUYÊN TẮC TỐI THƯỢNG</span></div>
        <div class="scene-kicker kicker-danger"><span>BƯỚC 3 · KÊ KHAI TRUNG THỰC</span></div>
        <div class="scene-title">Nộp Hồ Sơ &amp; Phí Tạm Tính</div>
        <div class="scene-sub">Mọi thông tin sức khỏe phải trung thực tuyệt đối ngay từ tờ khai đầu tiên</div>

        <div id="s4-form" data-layout-allow-occlusion>
          <div id="s4-scanner" data-layout-allow-occlusion></div>
          <div class="s4-form-hdr" data-layout-ignore>
            <span>HỒ SƠ YÊU CẦU BẢO HIỂM</span>
            <span style="color:var(--accent-2)">PHÍ TẠM TÍNH: ĐÃ ĐÓNG</span>
          </div>
          <div class="s4-row" data-layout-allow-occlusion><span class="s4-row-lbl">01. Thông tin cá nhân &amp; Nghề nghiệp</span><span class="s4-row-val s4-ok">TRUNG THỰC ✓</span></div>
          <div class="s4-row" data-layout-allow-occlusion><span class="s4-row-lbl">02. Thói quen sinh hoạt &amp; Chiều cao/Cân nặng</span><span class="s4-row-val s4-ok">TRUNG THỰC ✓</span></div>
          <div class="s4-row" id="s4-hidden-row" data-layout-allow-occlusion><span class="s4-row-lbl" data-layout-allow-occlusion>03. Tiền sử khám &amp; Điều trị bệnh cũ</span><span class="s4-row-val" id="s4-hidden-val" data-layout-allow-occlusion>GIẤU BỆNH CŨ !</span></div>
        </div>

        <div id="s4-circuit-box">
          <svg viewBox="0 0 880 420" width="880" height="420">
            <path id="s4-pipe-l" d="M 100,90 L 400,90" fill="none" stroke="var(--status-success)" stroke-width="14" stroke-linecap="round"/>
            <path id="s4-pipe-r" d="M 480,90 L 780,90" fill="none" stroke="var(--status-danger)" stroke-width="14" stroke-dasharray="18 14" stroke-linecap="round"/>
            <g id="s4-break-x" style="transform-origin: 440px 90px; opacity: 0;">
              <line x1="415" y1="65" x2="465" y2="115" stroke="var(--status-danger)" stroke-width="12" stroke-linecap="round"/>
              <line x1="465" y1="65" x2="415" y2="115" stroke="var(--status-danger)" stroke-width="12" stroke-linecap="round"/>
            </g>
            <text x="190" y="54" text-anchor="middle" font-size="24" font-weight="800" fill="var(--ink-secondary)">KHI CÓ BIẾN CỐ</text>
            <text x="690" y="54" text-anchor="middle" font-size="24" font-weight="800" fill="var(--status-danger)">KẼ HỞ PHÁP LÝ</text>
          </svg>
          <div id="s4-reject-stamp">TỪ CHỐI CHI TRẢ</div>
        </div>
      </div>
    </div>

    <!-- CẢNH 5: YÊU CẦU GHI ÂM TƯ VẤN BẮT BUỘC -->
    <div ${sceneAttr("s5")}>
      <div class="wrap" id="s5w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="archival-ref" data-layout-ignore><span>HỒ SƠ BẢO HIỂM · LUẬT ĐỊNH</span><span>LIÊN KẾT ĐẦU TƯ</span></div>
        <div class="scene-kicker"><span>BẰNG CHỨNG MINH BẠCH</span></div>
        <div class="scene-title">Ghi Âm Tư Vấn Bắt Buộc</div>
        <div class="scene-sub">Áp dụng cho sản phẩm liên kết đầu tư — khóa chặt nội dung đã tư vấn</div>

        <div id="s5-tape-deck">
          <div class="s5-deck-top">
            <div class="s5-rec-pill"><div class="s5-rec-dot" id="s5-dot"></div>REC · ĐANG GHI ÂM TƯ VẤN</div>
            <div data-layout-ignore style="font-size:24px; font-weight:800; color:var(--ink-secondary);">48kHz · LƯU HỒ SƠ</div>
          </div>
          <div id="s5-wave-box">
            <svg viewBox="0 0 836 260" width="100%" height="260" style="display:block;">
              <line x1="30" y1="130" x2="806" y2="130" stroke="var(--ink-dim)" stroke-width="3"/>
              ${s5WaveBars}
            </svg>
          </div>
        </div>

        <div id="s5-proof-row">
          <div class="s5-proof-tag" id="s5-p1">1. RÕ RỦI RO</div>
          <div class="s5-proof-tag" id="s5-p2">2. RÕ ĐIỀU KHOẢN</div>
          <div class="s5-proof-tag" id="s5-p3">3. TỰ NGUYỆN KÝ</div>
        </div>

        <div id="s5-lock-seal">
          <svg viewBox="0 0 40 40" width="38" height="38">
            <rect x="6" y="18" width="28" height="18" rx="4" fill="#FFFDF8"/>
            <path d="M 12,18 V 12 A 8,8 0 0,1 28,12 V 18" fill="none" stroke="#FFFDF8" stroke-width="4" stroke-linecap="round"/>
          </svg>
          <span>KHÓA BẰNG CHỨNG · TRÁNH MẬP MỜ</span>
        </div>
      </div>
    </div>

    <!-- CẢNH 6: BƯỚC 4 - THẨM ĐỊNH RỦI RO & 4 NGÃ RẼ -->
    <div ${sceneAttr("s6")}>
      <div class="wrap" id="s6w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="archival-ref" data-layout-ignore><span>HỒ SƠ BẢO HIỂM · TRẠM 04</span><span>UNDERWRITING</span></div>
        <div class="scene-kicker kicker-amber"><span>BƯỚC 4 · THẨM ĐỊNH RỦI RO</span></div>
        <div class="scene-title">Soi Hồ Sơ &amp; 4 Ngã Rẽ</div>
        <div class="scene-sub">Công ty định lượng rủi ro thực tế — có thể mời khám miễn phí nếu cần</div>

        <div id="s6-inspect-top">
          <svg viewBox="0 0 860 280" width="860" height="280">
            <rect x="190" y="30" width="360" height="220" rx="18" fill="var(--bg-elevated)" stroke="var(--ink-primary)" stroke-width="4"/>
            <line x1="230" y1="84" x2="500" y2="84" stroke="var(--ink-primary)" stroke-width="8" stroke-linecap="round"/>
            <line x1="230" y1="130" x2="460" y2="130" stroke="var(--ink-dim)" stroke-width="8" stroke-linecap="round"/>
            <line x1="230" y1="176" x2="420" y2="176" stroke="var(--ink-dim)" stroke-width="8" stroke-linecap="round"/>
          </svg>
          <div id="s6-loupe">
            <svg viewBox="0 0 220 220" width="220" height="220">
              <circle cx="95" cy="95" r="68" fill="rgba(15, 118, 110, 0.14)" stroke="var(--accent-2)" stroke-width="10"/>
              <line x1="145" y1="145" x2="196" y2="196" stroke="var(--ink-primary)" stroke-width="16" stroke-linecap="round"/>
            </svg>
          </div>
          <div id="s6-free-exam">KHÁM SỨC KHỎE MIỄN PHÍ</div>
        </div>

        <div id="s6-tracks-svg">
          <svg viewBox="0 0 940 230" width="940" height="230">
            <path id="s6-tr1" d="M 470,0 V 80 C 470,130 220,110 220,220" fill="none" stroke="var(--status-success)" stroke-width="7" stroke-linecap="round"/>
            <path id="s6-tr2" d="M 470,0 V 80 C 470,130 720,110 720,220" fill="none" stroke="var(--accent-amber)" stroke-width="7" stroke-linecap="round"/>
            <path id="s6-tr3" d="M 470,0 V 110 C 470,165 250,150 250,220" fill="none" stroke="var(--accent-2)" stroke-width="5" stroke-dasharray="10 8" stroke-linecap="round"/>
            <path id="s6-tr4" d="M 470,0 V 110 C 470,165 690,150 690,220" fill="none" stroke="var(--status-danger)" stroke-width="5" stroke-dasharray="10 8" stroke-linecap="round"/>
            <circle cx="470" cy="14" r="14" fill="var(--ink-primary)"/>
          </svg>
        </div>

        <div id="s6-gates">
          <div class="s6-gate" id="s6-g1"><div class="s6-gate-idx" data-layout-ignore>CỬA 01</div><div class="s6-gate-name">Chấp Nhận Chuẩn</div></div>
          <div class="s6-gate" id="s6-g2"><div class="s6-gate-idx" data-layout-ignore>CỬA 02</div><div class="s6-gate-name">Tăng Phí Rủi Ro</div></div>
          <div class="s6-gate" id="s6-g3"><div class="s6-gate-idx" data-layout-ignore>CỬA 03</div><div class="s6-gate-name">Loại Trừ Bệnh Cũ</div></div>
          <div class="s6-gate" id="s6-g4"><div class="s6-gate-idx" data-layout-ignore>CỬA 04</div><div class="s6-gate-name">Tạm Hoãn / Từ Chối</div></div>
        </div>
      </div>
    </div>

    <!-- CẢNH 7: BƯỚC 5 - XÁC THỰC PHÁT HÀNH & BẢO VỆ TẠM THỜI -->
    <div ${sceneAttr("s7")}>
      <div class="wrap" id="s7w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="archival-ref" data-layout-ignore><span>HỒ SƠ BẢO HIỂM · TRẠM 05</span><span>CHỐT PHÁT HÀNH</span></div>
        <div class="scene-kicker kicker-success"><span>BƯỚC 5 · XÁC THỰC &amp; PHÁT HÀNH</span></div>
        <div class="scene-title">Xác Thực Để Mở Lá Chắn</div>
        <div class="scene-sub">Chỉ khi xác thực xong &amp; phát hành, quyền lợi toàn diện mới kích hoạt</div>

        <div id="s7-auth-panel">
          <div class="s7-switch">
            <span class="s7-sw-lbl">01. Kiểm tra định danh (eKYC)</span>
            <div class="s7-track" id="s7-t1"><div class="s7-knob" id="s7-k1"></div></div>
          </div>
          <div class="s7-switch">
            <span class="s7-sw-lbl">02. Chữ ký điện tử / Mã OTP</span>
            <div class="s7-track" id="s7-t2"><div class="s7-knob" id="s7-k2"></div></div>
          </div>
          <div class="s7-switch">
            <span class="s7-sw-lbl">03. Gọi điện đối chiếu khách hàng</span>
            <div class="s7-track" id="s7-t3"><div class="s7-knob" id="s7-k3"></div></div>
          </div>
        </div>

        <div id="s7-shield-stage">
          <svg viewBox="0 0 900 580" width="900" height="580">
            <!-- Nửa trái: Bảo vệ tạm thời -->
            <path d="M 450,40 L 220,120 V 290 C 220,425 325,505 450,548 Z" fill="#FEF3C7" stroke="var(--accent-amber)" stroke-width="6"/>
            <!-- Nửa phải: Chưa mở (mờ) rồi phủ xanh toàn diện -->
            <path id="s7-shield-right-dim" d="M 450,40 L 680,120 V 290 C 680,425 575,505 450,548 Z" fill="var(--bg-surface)" stroke="var(--ink-dim)" stroke-width="6"/>
            <path id="s7-shield-full" d="M 450,40 L 680,120 V 290 C 680,425 575,505 450,548 C 325,505 220,425 220,290 V 120 Z" fill="rgba(5, 150, 105, 0.92)" stroke="var(--status-success)" stroke-width="8" opacity="0"/>
            <!-- Vạch check ở giữa lá chắn toàn diện -->
            <path id="s7-shield-check" d="M 380,295 L 430,348 L 535,235" fill="none" stroke="#FFFDF8" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
          </svg>
          <div id="s7-temp-label">CHỜ DUYỆT: TẠM THỜI TAI NẠN</div>
          <div id="s7-full-label">ĐÃ PHÁT HÀNH: TOÀN DIỆN</div>
          <div id="s7-issue-stamp">PHÁT HÀNH CHÍNH THỨC</div>
        </div>
      </div>
    </div>

    <!-- CẢNH 8: BƯỚC 6 - BÀN GIAO & 21 NGÀY CÂN NHẮC -->
    <div ${sceneAttr("s8")}>
      <div class="wrap" id="s8w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="archival-ref" data-layout-ignore><span>HỒ SƠ BẢO HIỂM · TRẠM 06</span><span>QUYỀN LỢI LUẬT ĐỊNH</span></div>
        <div class="scene-kicker"><span>BƯỚC 6 · BÀN GIAO HỢP ĐỒNG</span></div>
        <div class="scene-title">21 Ngày Cân Nhắc Miễn Phí</div>
        <div class="scene-sub">Ký nhận bàn giao để kích hoạt 3 tuần đọc kỹ từng trang điều khoản</div>

        <div id="s8-handover-doc">
          <div class="s8-doc-top">
            <span>BIÊN BẢN BÀN GIAO HỢP ĐỒNG</span>
            <span style="color:var(--accent-2);">KÝ XÁC NHẬN</span>
          </div>
          <svg viewBox="0 0 780 110" width="780" height="110">
            <line x1="20" y1="88" x2="760" y2="88" stroke="var(--ink-dim)" stroke-width="3"/>
            <path id="s8-sig-path" d="M 90,70 C 130,20 175,92 220,38 C 250,14 275,78 320,52 C 370,28 420,76 490,48 C 540,34 590,64 660,44" fill="none" stroke="var(--ink-primary)" stroke-width="7" stroke-linecap="round"/>
          </svg>
        </div>

        <div id="s8-window-stage">
          <div id="s8-day-counter">01</div>
          <div id="s8-day-unit">NGÀY CÂN NHẮC</div>
          <div id="s8-ruler-wrap">
            <div id="s8-hl-band"></div>
            <svg viewBox="0 0 860 170" width="860" height="170" style="position:relative; z-index:2;">
              <line x1="55" y1="110" x2="805" y2="110" stroke="var(--ink-primary)" stroke-width="4"/>
              ${s8Ticks}
            </svg>
          </div>
        </div>

        <div id="s8-refund-pill">KHÔNG PHÙ HỢP → HỦY NGANG &amp; NHẬN LẠI TIỀN</div>
      </div>
    </div>

    <!-- CẢNH 9: ĐIỂM MÙ SAU NGÀY 21 -->
    <div ${sceneAttr("s9")}>
      <div class="wrap" id="s9w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="archival-ref" data-layout-ignore><span>HỒ SƠ BẢO HIỂM · CẢNH BÁO</span><span>ĐỪNG CẤT TỦ NGAY</span></div>
        <div class="scene-kicker kicker-danger"><span>ĐIỂM MÙ SAU NGÀY 21</span></div>
        <div class="scene-title">Điều Khoản Chính Thức Khóa</div>
        <div class="scene-sub">Đọc kỹ trước hạn 21 ngày — đừng nhận xong rồi cất ngay vào tủ</div>

        <div id="s9-vault-stage">
          <div id="s9-jaw-top"></div>
          <div id="s9-dossier-box">
            <h3>BỘ HỢP ĐỒNG CHÍNH THỨC</h3>
            <p>Mọi điều khoản đã xác lập hiệu lực</p>
          </div>
          <div id="s9-jaw-bot"></div>
          <div id="s9-lock-stamp">QUA NGÀY 21 · ĐÃ KHÓA</div>
        </div>

        <div id="s9-wait-bar">
          <svg id="s9-gear" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="34" fill="none" stroke="var(--accent-amber)" stroke-width="10" stroke-dasharray="16 10"/>
            <circle cx="50" cy="50" r="14" fill="var(--accent-amber)"/>
          </svg>
          <div id="s9-wait-txt">
            <h4>THỜI GIAN CHỜ BẮT ĐẦU ĐẾM</h4>
            <p>Áp dụng theo quy tắc quyền lợi từng sản phẩm</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CẢNH 10: TỔNG KẾT QUY TRÌNH & 5 CHỐT HÀNH ĐỘNG -->
    <div ${sceneAttr("s10")}>
      <div class="wrap" id="s10w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="archival-ref" data-layout-ignore><span>HỒ SƠ BẢO HIỂM · TỔNG KẾT</span><span>5 CHỐT BẢO VỆ</span></div>
        <div class="scene-kicker kicker-success"><span>BẢN CHẤT LÀM HỢP ĐỒNG</span></div>
        <div class="scene-title">5 Chốt Khóa An Toàn</div>
        <div class="scene-sub">Không phải mua một tờ giấy — mà là thiết kế một lá chắn chuẩn pháp lý</div>

        <div id="s10-chain-box">
          <div class="s10-node" id="s10-n1"><div class="s10-num" data-layout-ignore>01</div><div class="s10-lbl">Chuẩn Bị Đủ Giấy Tờ</div><div class="s10-sub" data-layout-ignore>NHÂN THÂN · Y TẾ · TÀI CHÍNH</div></div>
          <div class="s10-node" id="s10-n2"><div class="s10-num" data-layout-ignore>02</div><div class="s10-lbl">Kê Khai Trung Thực</div><div class="s10-sub" data-layout-ignore>KHÔNG GIẤU BỆNH CŨ</div></div>
          <div class="s10-node" id="s10-n3"><div class="s10-num" data-layout-ignore>03</div><div class="s10-lbl">Ghi Âm Minh Bạch</div><div class="s10-sub" data-layout-ignore>RÕ RỦI RO &amp; ĐIỀU KHOẢN</div></div>
          <div class="s10-node" id="s10-n4"><div class="s10-num" data-layout-ignore>04</div><div class="s10-lbl">Xác Thực Chuẩn Xác</div><div class="s10-sub" data-layout-ignore>MỞ KHÓA PHÁT HÀNH</div></div>
          <div class="s10-node" id="s10-n5"><div class="s10-num" data-layout-ignore>05</div><div class="s10-lbl">Kiểm Tra Kỹ 21 Ngày</div><div class="s10-sub" data-layout-ignore>TRƯỚC KHI KHÓA HẠN</div></div>
        </div>

        <div id="s10-final-banner">THIẾT KẾ ĐÚNG · KHAI THẬT · SOI KỸ TRƯỚC NGÀY 21</div>
      </div>
    </div>
  </div>

  <div id="subs" data-layout-allow-overlap>
      ${subsHTML}
  </div>
</div>

<script>
window.__timelines = window.__timelines || {};
(function () {
  var W = ${JSON.stringify(words)};
  var SUB = ${JSON.stringify(subLines)};
  var SC = ${JSON.stringify(scenes)};
  var TOTAL = ${TOTAL};

  function T(i) { return W[i].s; }
  function E(i) { return W[i].e; }

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // 1. Procedural Canvas: Giấy lưu trữ ngà ấm + Sợi cellulose + Dấu thập đăng ký lề
  (function initCanvas() {
    var c = document.getElementById('bg-canvas');
    if (!c) return;
    var ctx = c.getContext('2d');
    var w = c.width = ${WIDTH}, h = c.height = ${HEIGHT};
    var r = rng(20261113);

    ctx.fillStyle = '#F4EFE6';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(26, 27, 30, 0.024)';
    for (var i = 0; i < 38000; i++) {
      var x = r() * w, y = r() * h, rad = r() * 1.15;
      ctx.fillRect(x, y, rad, rad);
    }

    ctx.strokeStyle = 'rgba(26, 27, 30, 0.09)';
    ctx.lineWidth = 1.5;
    for (var gx = 90; gx < w; gx += 90) {
      for (var gy = 90; gy < h; gy += 90) {
        ctx.beginPath();
        ctx.moveTo(gx - 4, gy); ctx.lineTo(gx + 4, gy);
        ctx.moveTo(gx, gy - 4); ctx.lineTo(gx, gy + 4);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = 'rgba(26, 27, 30, 0.14)';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, w - 84, h - 84);
  })();

  // 2. 28 hạt bụi ánh sáng lơ lửng trong đèn bàn soi
  (function initDust() {
    var d = document.getElementById('dust');
    if (!d) return;
    var r = rng(20261113);
    for (var i = 0; i < 28; i++) {
      var m = document.createElement('div');
      m.className = 'mote';
      var sz = 3 + r() * 4;
      m.style.width = sz + 'px';
      m.style.height = sz + 'px';
      m.style.left = (90 + r() * 900) + 'px';
      m.style.top = (160 + r() * 1400) + 'px';
      m.style.opacity = (0.20 + r() * 0.44).toFixed(2);
      d.appendChild(m);
    }
  })();

  var tl = gsap.timeline({ paused: true });

  // 3. Nhịp máy quay #cam đa hướng theo tâm lý từng cảnh (0 freeze events)
  SC.forEach(function (s, i) {
    var isLast = i === SC.length - 1;
    var cam = s.cam || 'breathe';
    var fromVars = { scale: 1.0, x: 0, y: 0 };
    var toVars = { scale: isLast ? 1.025 : 1.045, x: 0, y: 0, duration: s.dur, ease: 'sine.inOut', immediateRender: i === 0 };
    if (cam === 'punch-in') { fromVars = { scale: 1.0, x: 0, y: 0 }; toVars.scale = 1.05; }
    else if (cam === 'pull-back') { fromVars = { scale: 1.05, x: 0, y: 0 }; toVars.scale = 1.0; }
    else if (cam === 'pan-left') { fromVars = { scale: 1.03, x: 14, y: 0 }; toVars.scale = 1.03; toVars.x = -14; }
    else if (cam === 'pan-right') { fromVars = { scale: 1.03, x: -14, y: 0 }; toVars.scale = 1.03; toVars.x = 14; }
    tl.fromTo('#cam', fromVars, toVars, s.start);
  });

  var motes = document.querySelectorAll('.mote');
  if (motes.length) {
    var cyc = 4.2;
    var repeats = Math.max(0, Math.floor((TOTAL - 0.15) / cyc) - 1);
    tl.to(motes, {
      y: '-=42',
      x: '+=14',
      duration: cyc,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: repeats
    }, 0);
  }

  // ================= 4. DIỄN HOẠT CHI TIẾT 10 CẢNH NEO VÀO T(wordIndex) =================

  // CẢNH 1 (0.00s -> 9.38s): Frame-0 Impact — Bìa hồ sơ hiện ngay tại t=0.0s
  tl.fromTo('#s1-dossier-hero', { scale: 0.96, rotation: -2.2 }, { scale: 1.0, rotation: -1.5, duration: 0.55, ease: 'back.out(1.7)', immediateRender: true }, 0);
  tl.fromTo('#s1-myth-stamp', { scale: 1.25, rotation: -14 }, { scale: 1.0, rotation: -10, duration: 0.45, ease: 'back.out(1.7)', immediateRender: true }, T(11));
  tl.fromTo('#s1-strike', { scaleX: 0 }, { scaleX: 1, duration: 0.42, ease: 'expo.out' }, T(14));
  tl.to('#s1-dossier-hero', { y: -205, scale: 0.85, opacity: 0.94, duration: 0.55, ease: 'power2.inOut' }, T(20));
  tl.fromTo('#s1-rail-box', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }, T(25));
  tl.fromTo(['#s1-c1', '#s1-c2', '#s1-c3', '#s1-c4', '#s1-c5', '#s1-c6'], { scale: 0.8, y: 24, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.42, stagger: 0.18, ease: 'back.out(1.7)' }, T(31));
  tl.to('#s1w', { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, SC[0].start + SC[0].dur - 0.2);

  // CẢNH 2 (9.38s -> 19.52s): Bước 1 - Đòn bẩy cân bằng tài chính
  tl.fromTo('#s2w', { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' }, SC[1].start);
  tl.fromTo('#s2-beam', { rotation: -13 }, { rotation: -13, duration: 0.01, immediateRender: false }, SC[1].start);
  tl.fromTo('#s2-right-block', { y: -70, opacity: 0.25 }, { y: -70, opacity: 0.25, duration: 0.01, immediateRender: false }, SC[1].start);
  tl.fromTo('#s2-reject-line', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'expo.out' }, T(53));
  tl.to('#s2-reject-pill', { opacity: 0.55, duration: 0.35, ease: 'power2.inOut' }, T(57));
  tl.fromTo('#s2-left-stack', { scale: 0.92 }, { scale: 1.06, duration: 0.5, yoyo: true, repeat: 1, ease: 'back.out(1.6)' }, T(62));
  tl.to('#s2-right-block', { y: 0, opacity: 1, duration: 0.75, ease: 'back.out(1.7)' }, T(70));
  tl.to('#s2-beam', { rotation: 0, duration: 0.95, ease: 'elastic.out(1, 0.5)' }, T(74));
  tl.fromTo('#s2-status-banner', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, T(74));
  tl.to('#s2w', { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, SC[1].start + SC[1].dur - 0.2);

  // CẢNH 3 (19.52s -> 30.23s): Bước 2 - 3 Nhóm giấy tờ hợp lệ
  tl.fromTo('#s3w', { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' }, SC[2].start);
  tl.fromTo('#s3-f1', { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' }, T(91));
  tl.fromTo('#s3-ok1', { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.38, ease: 'back.out(1.7)' }, T(94));
  tl.fromTo('#s3-f2', { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' }, T(106));
  tl.fromTo('#s3-ok2', { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.38, ease: 'back.out(1.7)' }, T(107));
  tl.fromTo('#s3-f3', { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' }, T(117));
  tl.fromTo('#s3-ok3', { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.38, ease: 'back.out(1.7)' }, T(118));
  tl.to('#s3w', { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, SC[2].start + SC[2].dur - 0.2);

  // CẢNH 4 (30.23s -> 40.86s): Bước 3 - Nộp hồ sơ & Nút thắt kê khai trung thực
  tl.fromTo('#s4w', { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' }, SC[3].start);
  tl.fromTo('#s4-form', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, T(129));
  tl.fromTo('#s4-scanner', { y: 0, opacity: 0 }, { y: 295, opacity: 0.92, duration: 1.85, ease: 'power2.inOut' }, T(147));
  tl.to('#s4-scanner', { background: '#B91C1C', boxShadow: '0 0 28px 10px rgba(185, 28, 28, 0.55)', duration: 0.25, ease: 'expo.out' }, T(158));
  tl.fromTo('#s4-hidden-val', { scale: 1.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42, ease: 'back.out(1.7)' }, T(159));
  tl.fromTo('#s4-pipe-l', { strokeDasharray: 320, strokeDashoffset: 320 }, { strokeDashoffset: 0, duration: 0.55, ease: 'expo.out' }, T(162));
  tl.fromTo('#s4-break-x', { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'elastic.out(1, 0.5)' }, T(164));
  tl.fromTo('#s4-reject-stamp', { scale: 1.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: 'back.out(1.7)' }, T(166));
  tl.to('#s4w', { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, SC[3].start + SC[3].dur - 0.2);

  // CẢNH 5 (40.86s -> 51.60s): Yêu cầu Ghi âm tư vấn bắt buộc
  tl.fromTo('#s5w', { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' }, SC[4].start);
  tl.fromTo('#s5-tape-deck', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, T(174));
  tl.to('#s5-dot', { opacity: 0.25, duration: 0.55, yoyo: true, repeat: 14, ease: 'sine.inOut' }, SC[4].start + 0.2);
  tl.fromTo('.s5-bar', { scaleY: 0.35, transformOrigin: '50% 50%' }, { scaleY: 1.25, duration: 0.48, stagger: { each: 0.04, from: 'center' }, yoyo: true, repeat: 12, ease: 'sine.inOut' }, T(184));
  tl.fromTo('#s5-p1', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: 'back.out(1.7)' }, T(201));
  tl.fromTo('#s5-p2', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: 'back.out(1.7)' }, T(204));
  tl.fromTo('#s5-p3', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: 'back.out(1.7)' }, T(207));
  tl.fromTo('#s5-lock-seal', { y: 26, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)' }, T(195));
  tl.to('#s5w', { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, SC[4].start + SC[4].dur - 0.2);

  // CẢNH 6 (51.60s -> 62.58s): Bước 4 - Thẩm định & 4 ngã rẽ
  tl.fromTo('#s6w', { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' }, SC[5].start);
  tl.fromTo('#s6-loupe', { x: -55, y: 12 }, { x: 85, y: -10, duration: 1.5, yoyo: true, repeat: 1, ease: 'power2.inOut' }, T(221));
  tl.fromTo('#s6-free-exam', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: 'back.out(1.7)' }, T(233));
  tl.fromTo(['#s6-tr1', '#s6-tr2', '#s6-tr3', '#s6-tr4'], { strokeDasharray: 480, strokeDashoffset: 480 }, { strokeDashoffset: 0, duration: 0.75, stagger: 0.08, ease: 'expo.out' }, T(242));
  tl.fromTo('#s6-g1', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: 'back.out(1.7)' }, T(248));
  tl.fromTo('#s6-g2', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: 'back.out(1.7)' }, T(250));
  tl.fromTo('#s6-g3', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: 'back.out(1.7)' }, T(252));
  tl.fromTo('#s6-g4', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: 'back.out(1.7)' }, T(254));
  tl.to('#s6w', { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, SC[5].start + SC[5].dur - 0.2);

  // CẢNH 7 (62.58s -> 75.20s): Bước 5 - Xác thực phát hành & Lá chắn 2 tầng
  tl.fromTo('#s7w', { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' }, SC[6].start);
  tl.to('#s7-t1', { background: '#DCFCE7', borderColor: '#059669', duration: 0.35, ease: 'power2.inOut' }, T(273));
  tl.to('#s7-k1', { x: 76, background: '#059669', duration: 0.42, ease: 'back.out(1.7)' }, T(273));
  tl.to('#s7-t2', { background: '#DCFCE7', borderColor: '#059669', duration: 0.35, ease: 'power2.inOut' }, T(275));
  tl.to('#s7-k2', { x: 76, background: '#059669', duration: 0.42, ease: 'back.out(1.7)' }, T(275));
  tl.to('#s7-t3', { background: '#DCFCE7', borderColor: '#059669', duration: 0.35, ease: 'power2.inOut' }, T(280));
  tl.to('#s7-k3', { x: 76, background: '#059669', duration: 0.42, ease: 'back.out(1.7)' }, T(280));
  tl.fromTo('#s7-shield-full', { opacity: 0, scale: 0.92, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.65, ease: 'expo.out' }, T(294));
  tl.fromTo('#s7-shield-check', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, T(296));
  tl.fromTo('#s7-full-label', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }, T(298));
  tl.fromTo('#s7-issue-stamp', { scale: 1.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: 'back.out(1.7)' }, T(294));
  tl.to('#s7w', { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, SC[6].start + SC[6].dur - 0.2);

  // CẢNH 8 (75.20s -> 85.17s): Bước 6 - Bàn giao & 21 ngày cân nhắc miễn phí
  tl.fromTo('#s8w', { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' }, SC[7].start);
  tl.fromTo('#s8-sig-path', { strokeDasharray: 860, strokeDashoffset: 860 }, { strokeDashoffset: 0, duration: 1.15, ease: 'expo.out' }, T(314));
  var day21Obj = { val: 1 };
  var day21El = document.getElementById('s8-day-counter');
  tl.to(day21Obj, {
    val: 21,
    duration: 2.1,
    ease: 'power2.inOut',
    onUpdate: function () {
      if (day21El) {
        var n = Math.round(day21Obj.val);
        day21El.textContent = (n < 10 ? '0' : '') + n;
      }
    }
  }, T(322));
  tl.fromTo('#s8-hl-band', { scaleX: 0 }, { scaleX: 1, duration: 2.1, ease: 'power2.inOut' }, T(322));
  tl.fromTo('#s8-refund-pill', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: 'back.out(1.7)' }, T(342));
  tl.to('#s8w', { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, SC[7].start + SC[7].dur - 0.2);

  // CẢNH 9 (85.17s -> 92.03s): Điểm mù sau ngày 21
  tl.fromTo('#s9w', { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' }, SC[8].start);
  tl.fromTo('#s9-jaw-top', { y: -70 }, { y: 20, duration: 0.72, ease: 'elastic.out(1, 0.5)' }, T(364));
  tl.fromTo('#s9-jaw-bot', { y: 70 }, { y: -20, duration: 0.72, ease: 'elastic.out(1, 0.5)' }, T(364));
  tl.fromTo('#s9-lock-stamp', { scale: 1.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }, T(370));
  tl.fromTo('#s9-wait-bar', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: 'expo.out' }, T(371));
  tl.to('#s9-gear', { rotation: 360, duration: 3.4, ease: 'power2.inOut', transformOrigin: '50% 50%' }, T(379));
  tl.to('#s9w', { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, SC[8].start + SC[8].dur - 0.2);

  // CẢNH 10 (92.03s -> TOTAL): Tổng kết 5 chốt an toàn
  tl.fromTo('#s10w', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, SC[9].start);
  tl.fromTo('#s10-n1', { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }, T(396));
  tl.fromTo('#s10-n2', { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }, T(401));
  tl.fromTo('#s10-n3', { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }, T(403));
  tl.fromTo('#s10-n4', { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }, T(407));
  tl.fromTo('#s10-n5', { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }, T(411));
  tl.fromTo('#s10-final-banner', { y: 24, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)' }, T(414));

  // ================= 5. PHỤ ĐỀ KARAOKE ĐỒNG BỘ TỪNG TỪ =================
  SUB.forEach(function (line, li) {
    var el = document.getElementById('sl' + li);
    var st = li === 0 ? 0 : Math.max(0, W[line[0]].s - 0.03);
    var en = li < SUB.length - 1 ? Math.max(st + 0.2, W[SUB[li + 1][0]].s - 0.04) : TOTAL;
    tl.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out', immediateRender: li === 0 }, st);
    if (li < SUB.length - 1) tl.set(el, { opacity: 0 }, en);
    line.forEach(function (wi) {
      var w = document.getElementById('sw' + wi), ws = W[wi].s, we = Math.max(W[wi].e, ws + 0.12);
      tl.fromTo(w, { scale: 1, y: 0, color: 'rgba(255,255,255,0.62)' }, { scale: 1.16, y: -5, color: '#FDE047', duration: 0.1, ease: 'back.out(3)', immediateRender: false }, ws);
      tl.to(w, { scale: 1, y: 0, color: '#FFFFFF', duration: 0.12, ease: 'power2.out' }, we);
    });
  });

  window.__timelines['main'] = tl;
})();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(DIR, "index.html"), html, "utf8");

// 5. Xuất đồng bộ specs/video-spec.json và storyboard.json
fs.mkdirSync(path.join(DIR, "specs"), { recursive: true });
const videoSpec = {
  schemaVersion: "0.1",
  project: { id: PROJECT_ID, title: inputProps.title || "Quy Trình Từng Bước Để Làm 1 Hợp Đồng Bảo Hiểm", version: 1 },
  format: { aspectRatio: ASPECT, width: WIDTH, height: HEIGHT, fpsPreference: 30, targetDurationMs: Math.round(TOTAL * 1000) },
  content: { coreMessage: "Quy trình 6 bước chuẩn xác để làm một hợp đồng bảo hiểm thực sự có giá trị bảo vệ", audience: "General", tone: "Editorial Ivory Archival", language: inputProps.language || "vi" },
  script: {
    narration: words.map(w => w.w).join(" "),
    scenes: scenes.map((s, idx) => ({
      id: s.id,
      purpose: s.act || `Scene ${idx + 1}`,
      narration: "",
      startMs: Math.round(s.start * 1000),
      durationMs: Math.round(s.dur * 1000),
      visualIntent: { description: s.act || `Scene ${idx + 1}`, layout: "centered" },
      motionIntent: [{ type: idx === 0 ? "scale-in" : "reveal-sequence", subject: s.id }],
      assets: []
    }))
  },
  engineRouting: { suggestedEngine: "HYPERFRAMES", reason: "Pure Bespoke V4 Compiler" }
};

fs.writeFileSync(path.join(DIR, "specs", "video-spec.json"), JSON.stringify(videoSpec, null, 2) + "\n", "utf8");
fs.writeFileSync(path.join(DIR, "storyboard.json"), JSON.stringify({ projectId: PROJECT_ID, format: ASPECT, width: WIDTH, height: HEIGHT, totalDurationSec: TOTAL, scenes }, null, 2) + "\n", "utf8");

console.log(`✅ [Compiler] Compiled index.html, specs/video-spec.json, and storyboard.json for ${PROJECT_ID} (${TOTAL}s · ${scenes.length} scenes)`);
