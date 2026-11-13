/*
 * build-index.cjs — Trình biên dịch HyperFrames V4 Pure Bespoke
 * Dự án: gia-han-60-ngay (Gia Hạn 60 Ngày & Khôi Phục Hợp Đồng 2 Năm)
 * Độc bản 100% · Architectural Blueprint Navy (Nền sáng giấy can #F5F2EB)
 * Đồng bộ từng từ qua VieNeu-TTS Hải Đăng 48kHz (Tốc độ 0.98)
 */
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const PROJECT_ID = path.basename(DIR);
const timing = JSON.parse(fs.readFileSync(path.join(DIR, "assets/audio/timing.json"), "utf8"));

// 1. Lọc và chuẩn hóa từ ngữ từ timing.json
const words = timing.words
  .filter(w => w.word && w.word.trim() && w.word.trim() !== "---")
  .map(w => ({
    w: w.word.trim(),
    s: +(w.startMs / 1000).toFixed(3),
    e: +((w.startMs + w.durationMs) / 1000).toFixed(3)
  }));

const AUDIO = +(timing.durationMs / 1000).toFixed(3);
const TAIL = 1.350;
const TOTAL = +(AUDIO + TAIL).toFixed(3);

// 2. Mốc neo chuyển cảnh theo từ khóa thật (anchor)
const norm = s => s.toLowerCase().normalize("NFC").replace(/[.,:;?!'"“”]/g, "");
function anchor(idx, expect) {
  if (!words[idx] || norm(words[idx].w) !== norm(expect)) {
    throw new Error(`Anchor ${idx} expected "${expect}" got "${words[idx] && words[idx].w}"`);
  }
  return words[idx].s;
}

const LEAD = 0.25;
const cuts = [
  0,
  +(anchor(40, "Mốc") - LEAD).toFixed(3),
  +(anchor(74, "Điều") - LEAD).toFixed(3),
  +(anchor(122, "Nhưng") - LEAD).toFixed(3),
  +(anchor(169, "Lúc") - LEAD).toFixed(3),
  +(anchor(203, "Nhưng") - LEAD).toFixed(3),
  +(anchor(243, "Nếu") - LEAD).toFixed(3),
  +(anchor(294, "Nhắn") - LEAD).toFixed(3),
  TOTAL
].map(v => +v.toFixed(3));

const scenes = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((id, i) => ({
  id,
  start: cuts[i],
  dur: +(cuts[i + 1] - cuts[i]).toFixed(3)
}));

// 3. Phân chia phụ đề Karaoke chuẩn 8–10 từ/dòng, luôn ngắt sạch tại ranh giới cảnh
const sceneBreakWords = new Set([39, 73, 121, 168, 202, 242, 293]);
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

// Sinh 61 vạch thước đo SVG cho Scene 2 (vị trí x từ 60 đến 800)
const s2Ticks = Array.from({ length: 61 }, (_, i) => {
  const x = +(60 + (i / 60) * 740).toFixed(1);
  const isMajor = i % 10 === 0;
  const isMid = i % 5 === 0 && !isMajor;
  const h = isMajor ? 42 : isMid ? 26 : 14;
  const y1 = 150 - h;
  const stroke = i === 60 ? "var(--c-brand)" : isMajor ? "var(--c-ink)" : "var(--c-ink-secondary)";
  const sw = isMajor ? 3.5 : 1.8;
  const op = isMajor ? 0.95 : 0.45;
  const label = isMajor ? `<text x="${x}" y="185" text-anchor="middle" font-size="22" font-weight="800" fill="${i === 60 ? "var(--c-brand)" : "var(--c-ink-secondary)"}" style="font-variant-numeric:tabular-nums">${i}</text>` : "";
  return `<line x1="${x}" y1="${y1}" x2="${x}" y2="150" stroke="${stroke}" stroke-width="${sw}" opacity="${op}"/>${label}`;
}).join("\n            ");

// Sinh vạch thước đo 24 tháng cho Scene 5 (x từ 60 đến 800)
const s5Ticks = Array.from({ length: 25 }, (_, i) => {
  const x = +(60 + (i / 24) * 740).toFixed(1);
  const isYear = i % 12 === 0;
  const isHalf = i % 6 === 0 && !isYear;
  const h = isYear ? 40 : isHalf ? 26 : 14;
  const y1 = 100 - h;
  const stroke = isYear ? "var(--c-amber)" : "var(--c-ink-secondary)";
  const sw = isYear ? 3.5 : 1.8;
  const labelText = i === 0 ? "0" : i === 12 ? "1 NĂM" : i === 24 ? "2 NĂM" : "";
  const label = labelText ? `<text x="${x}" y="136" text-anchor="middle" font-size="22" font-weight="800" fill="${i === 24 ? "var(--c-amber)" : "var(--c-ink-secondary)"}" style="font-variant-numeric:tabular-nums">${labelText}</text>` : "";
  return `<line x1="${x}" y1="${y1}" x2="${x}" y2="100" stroke="${stroke}" stroke-width="${sw}" opacity="${isYear ? 1 : 0.55}"/>${label}`;
}).join("\n            ");

// 4. Mã nguồn HTML + GSAP Timeline
const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1080, height=1920">
<title>Gia Hạn 60 Ngày &amp; Khôi Phục Hợp Đồng 2 Năm</title>
<style>
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Medium.ttf') format('truetype'); font-weight: 500; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Bold.ttf') format('truetype'); font-weight: 700; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-ExtraBold.ttf') format('truetype'); font-weight: 800; font-style: normal; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Black.ttf') format('truetype'); font-weight: 900; font-style: normal; }

:root {
  --bg-stage: #F5F2EB;
  --bg-surface: #ECE7DC;
  --bg-elevated: #FFFDF8;
  --bg-frost: rgba(232, 240, 245, 0.86);
  --bg-overlay: rgba(26, 35, 58, 0.90);

  --c-ink: #1E3A8A;
  --c-ink-dark: #1A233A;
  --c-ink-secondary: #475569;
  --c-ink-dim: #C7C2B4;

  --c-accent-hl: #FDE047;
  --c-brand: #008744;
  --c-brand-dark: #006B38;
  --c-teal: #0D9488;
  --c-amber: #B45309;
  --c-danger: #C2352B;

  --lamp-glow: radial-gradient(circle 850px at 50% 38%, rgba(255, 253, 248, 0.85) 0%, rgba(245, 242, 235, 0) 80%);
  --shadow-tactile: 0 14px 38px rgba(26, 35, 58, 0.12), 0 4px 10px rgba(26, 35, 58, 0.06);
  --shadow-stamp: 0 6px 16px rgba(194, 53, 43, 0.22);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root {
  width: 100%; height: 100%; overflow: hidden;
  font-family: 'Be Vietnam Pro', sans-serif;
  background: var(--bg-stage); color: var(--c-ink-dark);
}

#bg-canvas { position: absolute; inset: 0; width: 1080px; height: 1920px; z-index: 0; }
#lamp { position: absolute; inset: 0; pointer-events: none; z-index: 1; background: var(--lamp-glow); }
#dust { position: absolute; inset: 0; pointer-events: none; z-index: 2; overflow: hidden; }
.mote { position: absolute; border-radius: 50%; background: rgba(253, 224, 71, 0.45); filter: blur(1px); }

#cam { position: absolute; inset: 0; transform-origin: 50% 42%; z-index: 3; }
.scene, .wrap { position: absolute; inset: 0; width: 1080px; height: 1920px; }
#s2w, #s3w, #s4w, #s5w, #s6w, #s7w, #s8w { opacity: 0; }

/* Marginalia & Typography */
.blueprint-ref {
  position: absolute; top: 86px; left: 72px; right: 72px;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 20px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase;
  color: var(--c-ink); opacity: 0.34; font-variant-numeric: tabular-nums;
}
.scene-kicker {
  position: absolute; top: 158px; left: 50%; width: 680px; margin-left: -340px; text-align: center;
  font-size: 24px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--c-ink);
}
.scene-kicker span {
  display: inline-block; padding: 10px 26px; border-radius: 999px;
  border: 2px solid rgba(30, 58, 138, 0.22); background: rgba(255, 253, 248, 0.72);
}
.kicker-danger span { color: var(--c-danger); border-color: rgba(194, 53, 43, 0.28); background: rgba(255, 245, 245, 0.85); }
.kicker-brand span { color: var(--c-brand); border-color: rgba(0, 167, 88, 0.28); background: rgba(240, 253, 244, 0.85); }
.kicker-amber span { color: var(--c-amber); border-color: rgba(217, 119, 6, 0.30); background: rgba(255, 251, 235, 0.85); }

.scene-title {
  position: absolute; top: 236px; left: 70px; right: 70px; text-align: center;
  font-size: 54px; font-weight: 900; line-height: 1.16; letter-spacing: -0.02em; color: var(--c-ink-dark);
}
.scene-sub {
  position: absolute; top: 316px; left: 90px; right: 90px; text-align: center;
  font-size: 30px; font-weight: 500; line-height: 1.38; color: var(--c-ink-secondary);
}

/* Scene 1: Phá vỡ hiểu lầm */
#s1-myth {
  position: absolute; top: 380px; left: 90px; width: 900px; text-align: center;
}
.s1-myth-top {
  font-size: 56px; font-weight: 800; color: var(--c-ink-dark); letter-spacing: -0.02em;
}
.s1-myth-lost {
  position: relative; display: inline-block; margin-top: 14px;
  font-size: 82px; font-weight: 900; color: var(--c-danger); letter-spacing: -0.02em;
}
#s1-strike {
  position: absolute; left: -16px; top: 48%; width: calc(100% + 32px); height: 14px;
  background: var(--c-danger); border-radius: 7px; transform-origin: 0% 50%; transform: scaleX(0);
}
#s1-axis-wrap {
  position: absolute; top: 760px; left: 90px; width: 900px; height: 460px;
}
.s1-node {
  position: absolute; top: 170px; width: 360px; text-align: center;
}
#s1-node1 { left: 20px; }
#s1-node2 { right: 20px; }
.s1-node-badge {
  display: inline-block; padding: 14px 32px; border-radius: 18px;
  font-size: 46px; font-weight: 900; font-variant-numeric: tabular-nums;
  box-shadow: var(--shadow-tactile);
}
#s1-node1 .s1-node-badge { background: var(--bg-elevated); color: var(--c-brand); border: 3px solid var(--c-brand); }
#s1-node2 .s1-node-badge { background: var(--bg-elevated); color: var(--c-amber); border: 3px solid var(--c-amber); }
.s1-node-lbl {
  margin-top: 16px; font-size: 28px; font-weight: 700; color: var(--c-ink-secondary); letter-spacing: 0.02em;
}
.skeleton-stack { margin: 16px auto 0; width: 220px; display: flex; flex-direction: column; gap: 10px; align-items: center; }
.sk-line { height: 6px; border-radius: 3px; background: var(--c-ink-dim); opacity: 0.65; }

/* Scene 2: 60 ngày gia hạn */
#s2-counter-wrap {
  position: absolute; top: 390px; left: 90px; width: 900px; text-align: center;
}
#s2-day-num {
  font-size: 136px; font-weight: 900; line-height: 1; color: var(--c-brand);
  font-variant-numeric: tabular-nums; letter-spacing: -0.04em;
}
#s2-day-unit {
  font-size: 38px; font-weight: 800; color: var(--c-ink); letter-spacing: 0.14em; margin-top: 6px;
}
#s2-ruler-box {
  position: absolute; top: 670px; left: 110px; width: 860px; height: 240px;
}
#s2-hl-band {
  position: absolute; left: 60px; top: 76px; width: 740px; height: 74px;
  background: var(--c-accent-hl); border-radius: 10px; opacity: 0.72;
  mix-blend-mode: multiply; transform-origin: 0% 50%; transform: scaleX(0);
}
#s2-needle {
  position: absolute; left: 60px; top: 38px; width: 6px; height: 140px; margin-left: -3px;
  background: var(--c-ink-dark); border-radius: 3px;
}
#s2-needle::before {
  content: ""; position: absolute; top: -14px; left: -11px;
  width: 28px; height: 28px; border-radius: 50%; background: var(--c-brand); border: 4px solid var(--bg-elevated);
  box-shadow: 0 4px 10px rgba(0, 167, 88, 0.35);
}
#s2-gate-pill {
  position: absolute; top: 990px; left: 160px; width: 760px; padding: 26px 36px;
  border-radius: 22px; background: var(--bg-elevated); border: 2.5px solid var(--c-brand);
  box-shadow: var(--shadow-tactile); display: flex; align-items: center; justify-content: center; gap: 18px;
}
#s2-gate-dot { width: 22px; height: 22px; border-radius: 50%; background: var(--c-brand); }
#s2-gate-txt { font-size: 36px; font-weight: 800; color: var(--c-ink-dark); }

/* Scene 3: Quyền lợi bên trong 60 ngày */
#s3-shield-stage {
  position: absolute; top: 390px; left: 240px; width: 600px; height: 420px;
}
#s3-stamp {
  position: absolute; top: 530px; left: 530px; width: 340px; padding: 18px 20px;
  border: 6px solid var(--c-brand); border-radius: 14px; background: rgba(255, 253, 248, 0.94);
  color: var(--c-brand); text-align: center; transform: rotate(-9deg);
  box-shadow: 0 12px 28px rgba(0, 167, 88, 0.22);
}
#s3-stamp-main { font-size: 36px; font-weight: 900; letter-spacing: 0.04em; }
#s3-stamp-sub { font-size: 20px; font-weight: 700; letter-spacing: 0.1em; color: var(--c-ink-secondary); margin-top: 4px; }

#s3-payout {
  position: absolute; top: 870px; left: 110px; width: 860px;
}
.s3-pay-lbl { font-size: 26px; font-weight: 800; letter-spacing: 0.08em; color: var(--c-ink); margin-bottom: 18px; }
#s3-pay-track {
  position: relative; width: 100%; height: 84px; display: flex; align-items: center; gap: 12px;
}
#s3-pay-main {
  flex: 1; height: 100%; border-radius: 16px; background: var(--c-brand); color: #FFFDF8;
  display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800;
  box-shadow: var(--shadow-tactile);
}
#s3-pay-deduct {
  width: 240px; height: 100%; border-radius: 16px; background: var(--bg-surface);
  border: 2.5px dashed var(--c-amber); color: var(--c-amber);
  display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800;
}
#s3-nohealth-wrap {
  position: absolute; top: 1120px; left: 100px; width: 880px; text-align: center;
}
#s3-nohealth-txt {
  position: relative; display: inline-block; padding: 12px 28px;
  font-size: 40px; font-weight: 900; color: var(--c-ink-dark); z-index: 2;
}
#s3-nohealth-hl {
  position: absolute; left: 0; bottom: 8px; width: 100%; height: 42px;
  background: var(--c-accent-hl); border-radius: 10px; z-index: 1;
  mix-blend-mode: multiply; transform-origin: 0% 50%; transform: scaleX(0);
}

/* Scene 4: Ngày 61 đóng băng */
#s4-boundary {
  position: absolute; top: 370px; left: 110px; width: 860px; height: 220px;
}
#s4-freeze-stage {
  position: absolute; top: 620px; left: 150px; width: 780px; height: 460px;
  border-radius: 28px; overflow: hidden; border: 2px solid rgba(30, 58, 138, 0.16);
  background: var(--bg-elevated); box-shadow: var(--shadow-tactile);
}
#s4-frost {
  position: absolute; inset: 0; background: var(--bg-frost);
  backdrop-filter: blur(4px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  clip-path: inset(0 0 100% 0);
}
#s4-stamp {
  padding: 16px 36px; border: 6px solid var(--c-ink); border-radius: 14px;
  background: rgba(255, 253, 248, 0.94); color: var(--c-ink);
  font-size: 44px; font-weight: 900; letter-spacing: 0.05em; transform: rotate(-5deg);
}
#s4-nopay {
  position: absolute; top: 1150px; left: 140px; width: 800px; text-align: center;
  padding: 22px 28px; border-radius: 18px; background: rgba(194, 53, 43, 0.09);
  border: 2.5px solid var(--c-danger); color: var(--c-danger);
  font-size: 36px; font-weight: 900; letter-spacing: 0.02em;
}

/* Scene 5: 2 năm khôi phục hợp đồng cũ */
#s5-hero {
  position: absolute; top: 380px; left: 90px; width: 900px; text-align: center;
}
#s5-num {
  font-size: 112px; font-weight: 900; color: var(--c-amber); line-height: 1;
  font-variant-numeric: tabular-nums; letter-spacing: -0.03em;
}
#s5-sub-txt { font-size: 34px; font-weight: 700; color: var(--c-ink); margin-top: 8px; }
#s5-ruler-wrap { position: absolute; top: 560px; left: 110px; width: 860px; height: 170px; }
#s5-compare-wrap { position: absolute; top: 770px; left: 90px; width: 900px; height: 500px; }

/* Scene 6: 3 điều kiện khắt khe */
.s6-mech {
  position: absolute; left: 100px; width: 880px; height: 210px;
  border-bottom: 2px dashed rgba(30, 58, 138, 0.18);
  display: flex; align-items: center; gap: 36px; padding: 0 20px;
}
#s6-m1 { top: 410px; }
#s6-m2 { top: 660px; }
#s6-m3 { top: 910px; border-bottom: none; }
.s6-num {
  font-size: 56px; font-weight: 900; color: var(--c-amber); font-variant-numeric: tabular-nums;
  width: 90px; flex-shrink: 0;
}
.s6-body { flex: 1; position: relative; }
.s6-title { font-size: 38px; font-weight: 900; color: var(--c-ink-dark); line-height: 1.25; }
.s6-meta { font-size: 26px; font-weight: 600; color: var(--c-ink-secondary); margin-top: 8px; }
.s6-icon-box { width: 170px; height: 140px; position: relative; flex-shrink: 0; }

/* Scene 7: Rủi ro bị từ chối & Câu chốt */
#s7-dossier {
  position: absolute; top: 340px; left: 150px; width: 780px; height: 390px;
  background: var(--bg-elevated); border: 2px solid rgba(30, 58, 138, 0.18); border-radius: 22px;
  padding: 36px 44px; box-shadow: var(--shadow-tactile);
}
.s7-dos-hdr { font-size: 24px; font-weight: 800; letter-spacing: 0.10em; color: var(--c-ink); margin-bottom: 24px; }
.s7-sk-row { height: 14px; border-radius: 7px; background: var(--c-ink-dim); margin-bottom: 20px; opacity: 0.55; }
#s7-alert-line {
  height: 20px; width: 78%; border-radius: 10px; background: rgba(194, 53, 43, 0.22);
  border: 2px solid var(--c-danger); margin-bottom: 20px;
}
#s7-reject {
  position: absolute; right: 54px; bottom: 34px; padding: 14px 24px;
  border: 6px solid var(--c-danger); border-radius: 14px; background: rgba(255, 253, 248, 0.96);
  color: var(--c-danger); font-size: 32px; font-weight: 900; letter-spacing: 0.04em;
  transform: rotate(-8deg); box-shadow: var(--shadow-stamp);
}
#s7-split {
  position: absolute; top: 800px; left: 90px; width: 900px;
  display: flex; flex-direction: column; gap: 28px;
}
.s7-pole {
  padding: 28px 36px; border-radius: 22px; background: var(--bg-elevated);
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: var(--shadow-tactile);
}
#s7-p1 { border-left: 14px solid var(--c-brand); }
#s7-p2 { border-left: 14px solid var(--c-amber); }
.s7-pole-time { font-size: 46px; font-weight: 900; font-variant-numeric: tabular-nums; }
#s7-p1 .s7-pole-time { color: var(--c-brand); }
#s7-p2 .s7-pole-time { color: var(--c-amber); }
.s7-pole-desc { font-size: 32px; font-weight: 800; color: var(--c-ink-dark); text-align: right; position: relative; padding: 4px 12px; }
#s7-p1-hl {
  position: absolute; left: 0; bottom: 2px; width: 100%; height: 34px;
  background: var(--c-accent-hl); border-radius: 8px; z-index: 0; mix-blend-mode: multiply;
  transform-origin: 0% 50%; transform: scaleX(0);
}

/* Scene 8: Brand Outro (Center X = 540px) */
#outro-card {
  position: absolute; left: 50%; top: 250px; width: 880px; margin-left: -440px;
  background: var(--bg-elevated); border: 2px solid rgba(30, 58, 138, 0.14); border-radius: 36px;
  padding: 56px 48px; box-shadow: var(--shadow-tactile);
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
#o-badge {
  width: 280px; height: 76px; border-radius: 20px; background: var(--c-brand);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10px 28px rgba(0, 167, 88, 0.25); margin-bottom: 24px; padding: 12px 24px;
}
#o-badge img { width: 100%; height: 100%; object-fit: contain; }
#o-name { font-size: 56px; font-weight: 900; color: var(--c-ink-dark); letter-spacing: -0.02em; margin-bottom: 8px; }
#o-title { font-size: 28px; font-weight: 700; color: var(--c-brand); margin-bottom: 20px; }
#o-rule { width: 140px; height: 3px; background: var(--c-ink-dim); margin-bottom: 24px; }
#o-tagline { font-size: 24px; font-weight: 700; color: var(--c-ink-secondary); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 34px; }
#o-cta {
  width: 100%; padding: 28px 24px; border-radius: 22px;
  background: #FFFDF8; border: 2.5px solid var(--c-brand);
  position: relative; overflow: hidden; margin-bottom: 26px;
}
#o-cta-hl {
  position: absolute; left: 0; top: 0; width: 100%; height: 100%;
  background: var(--c-accent-hl); z-index: 1; transform-origin: 0% 50%;
  mix-blend-mode: multiply; opacity: 0.7; transform: scaleX(0);
}
#o-cta-text { font-size: 36px; font-weight: 900; color: var(--c-ink-dark); position: relative; z-index: 2; line-height: 1.35; }
#o-sub { font-size: 25px; font-weight: 600; color: var(--c-ink-secondary); margin-bottom: 16px; line-height: 1.4; max-width: 680px; }
#o-handle { font-size: 30px; font-weight: 800; color: var(--c-ink); margin-bottom: 14px; }
#o-disc { font-size: 20px; font-weight: 500; color: var(--c-ink-secondary); line-height: 1.4; max-width: 680px; }

/* Subtitles Karaoke */
#subs { position: absolute; left: 0; right: 0; bottom: 185px; height: 220px; pointer-events: none; z-index: 10; }
.sub-line {
  position: absolute; left: 50%; bottom: 0; width: 960px; margin-left: -480px;
  text-align: center; opacity: 0; padding: 20px 32px; background: var(--bg-overlay);
  border-radius: 24px; font-size: 38px; font-weight: 800; line-height: 1.42;
  color: rgba(255, 255, 255, 0.62); box-shadow: 0 16px 40px rgba(26, 35, 58, 0.25);
}
.sub-word { display: inline-block; margin: 0 5px; transform-origin: 50% 80%; }
</style>
<script src="assets/vendor/gsap.min.js"></script>
</head>
<body>
<div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-duration="${TOTAL}">
  <audio id="narration" src="assets/audio/narration.mp3" data-start="0" data-duration="${AUDIO}" data-track-index="0"></audio>

  <canvas id="bg-canvas" width="1080" height="1920"></canvas>
  <div id="lamp"></div>
  <div id="dust"></div>

  <div id="cam">
    <!-- CẢNH 1: Phá vỡ hiểu lầm trễ 1 ngày -->
    <div ${sceneAttr("s1")}>
      <div class="wrap" id="s1w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="blueprint-ref"><span>REF // LUẬT KDBH</span><span>MỐC 60D — 2Y</span></div>
        <div class="scene-kicker kicker-danger"><span>HIỂU LẦM PHỔ BIẾN</span></div>
        <div id="s1-myth">
          <div class="s1-myth-top">TRỄ PHÍ 1 NGÀY</div>
          <div class="s1-myth-lost">= MẤT SẠCH?<div id="s1-strike"></div></div>
        </div>
        <div id="s1-axis-wrap">
          <svg width="900" height="160" viewBox="0 0 900 160">
            <line id="s1-track" x1="180" y1="80" x2="720" y2="80" stroke="var(--c-ink)" stroke-width="6" stroke-linecap="round"/>
            <circle cx="180" cy="80" r="14" fill="var(--c-brand)"/>
            <circle cx="720" cy="80" r="14" fill="var(--c-amber)"/>
          </svg>
          <div class="s1-node" id="s1-node1">
            <div class="s1-node-badge">60 NGÀY</div>
            <div class="s1-node-lbl">GIA HẠN ĐÓNG PHÍ</div>
            <div class="skeleton-stack"><div class="sk-line" style="width:180px"></div><div class="sk-line" style="width:130px"></div></div>
          </div>
          <div class="s1-node" id="s1-node2">
            <div class="s1-node-badge">2 NĂM</div>
            <div class="s1-node-lbl">KHÔI PHỤC HỢP ĐỒNG</div>
            <div class="skeleton-stack"><div class="sk-line" style="width:180px"></div><div class="sk-line" style="width:140px"></div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- CẢNH 2: Mốc 1 — 60 ngày gia hạn -->
    <div ${sceneAttr("s2")}>
      <div class="wrap" id="s2w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="blueprint-ref"><span>MỐC THỜI GIAN 01</span><span>VÙNG ĐỆM AN TOÀN</span></div>
        <div class="scene-kicker"><span>GIA HẠN ĐÓNG PHÍ</span></div>
        <div id="s2-counter-wrap">
          <div id="s2-day-num">01</div>
          <div id="s2-day-unit">NGÀY GIA HẠN (2 THÁNG)</div>
        </div>
        <div id="s2-ruler-box">
          <div id="s2-hl-band"></div>
          <svg width="860" height="220" viewBox="0 0 860 220" style="position:relative; z-index:2;">
            <line x1="60" y1="150" x2="800" y2="150" stroke="var(--c-ink)" stroke-width="4"/>
            ${s2Ticks}
          </svg>
          <div id="s2-needle"></div>
        </div>
        <div id="s2-gate-pill">
          <div id="s2-gate-dot"></div>
          <div id="s2-gate-txt">HỢP ĐỒNG CHƯA HỀ HỦY · THÊM 2 THÁNG XOAY XỞ</div>
        </div>
      </div>
    </div>

    <!-- CẢNH 3: Quyền lợi trong 60 ngày -->
    <div ${sceneAttr("s3")}>
      <div class="wrap" id="s3w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="blueprint-ref"><span>HIỆU LỰC BẢO VỆ</span><span>01 → 60 NGÀY</span></div>
        <div class="scene-kicker kicker-brand"><span>TRONG SUỐT 60 NGÀY</span></div>
        <div class="scene-title">VẪN BẢO VỆ BÌNH THƯỜNG</div>
        <div id="s3-shield-stage">
          <svg width="600" height="420" viewBox="0 0 600 420">
            <path id="s3-shield" d="M 300 40 L 470 105 L 470 220 C 470 315, 385 375, 300 405 C 215 375, 130 315, 130 220 L 130 105 Z"
              fill="rgba(0, 167, 88, 0.14)" stroke="var(--c-brand)" stroke-width="8" stroke-linejoin="round"/>
            <path id="s3-check" d="M 235 220 L 285 270 L 375 165" fill="none" stroke="var(--c-brand)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div id="s3-stamp">
          <div id="s3-stamp-main">VẪN BẢO VỆ</div>
          <div id="s3-stamp-sub" data-layout-ignore>100% HIỆU LỰC</div>
        </div>
        <div id="s3-payout">
          <div class="s3-pay-lbl">NẾU CÓ BIẾN CỐ LÚC ĐANG NỢ PHÍ:</div>
          <div id="s3-pay-track">
            <div id="s3-pay-main">VẪN XEM XÉT CHI TRẢ</div>
            <div id="s3-pay-deduct">- PHÍ THIẾU</div>
          </div>
        </div>
        <div id="s3-nohealth-wrap">
          <div id="s3-nohealth-txt">KHÔNG HỎI LẠI SỨC KHỎE<div id="s3-nohealth-hl"></div></div>
        </div>
      </div>
    </div>

    <!-- CẢNH 4: Ngày 61 đóng băng -->
    <div ${sceneAttr("s4")}>
      <div class="wrap" id="s4w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="blueprint-ref"><span>RANH GIỚI NGUY HIỂM</span><span>NGÀY THỨ 61</span></div>
        <div class="scene-kicker kicker-danger"><span>QUA NGÀY THỨ 60</span></div>
        <div class="scene-title" style="color:var(--c-danger);">TẠM NGƯNG HIỆU LỰC</div>
        <div id="s4-boundary">
          <svg width="860" height="200" viewBox="0 0 860 200">
            <rect x="60" y="75" width="370" height="44" rx="8" fill="rgba(0, 167, 88, 0.18)"/>
            <rect x="430" y="75" width="370" height="44" rx="8" fill="rgba(194, 53, 43, 0.16)"/>
            <line x1="60" y1="120" x2="800" y2="120" stroke="var(--c-ink)" stroke-width="4"/>
            <line x1="430" y1="30" x2="430" y2="165" stroke="var(--c-danger)" stroke-width="6" stroke-dasharray="10 6"/>
            <text x="245" y="162" text-anchor="middle" font-size="26" font-weight="800" fill="var(--c-brand)">NGÀY 01 — 60</text>
            <text x="615" y="162" text-anchor="middle" font-size="28" font-weight="900" fill="var(--c-danger)">NGÀY 61+</text>
            <g id="s4-lock-pin">
              <circle cx="380" cy="97" r="18" fill="var(--c-danger)" stroke="var(--bg-elevated)" stroke-width="5"/>
            </g>
          </svg>
        </div>
        <div id="s4-freeze-stage" data-layout-allow-overflow>
          <svg width="780" height="460" viewBox="0 0 780 460">
            <path d="M 390 70 L 520 120 L 520 220 C 520 300, 455 355, 390 385 C 325 355, 260 300, 260 220 L 260 120 Z"
              fill="rgba(71, 85, 105, 0.12)" stroke="var(--c-ink-secondary)" stroke-width="6"/>
            <g id="s4-lock-shackle">
              <path d="M 340 215 L 340 175 C 340 140, 440 140, 440 175 L 440 215" fill="none" stroke="var(--c-ink-dark)" stroke-width="14" stroke-linecap="round"/>
              <rect x="320" y="210" width="140" height="105" rx="18" fill="var(--c-ink-dark)"/>
              <circle cx="390" cy="255" r="14" fill="var(--bg-elevated)"/>
              <rect x="385" y="262" width="10" height="24" rx="4" fill="var(--bg-elevated)"/>
            </g>
          </svg>
          <div id="s4-frost">
            <div id="s4-stamp">TẠM ĐÓNG BĂNG</div>
          </div>
        </div>
        <div id="s4-nopay">BIẾN CỐ LÚC NÀY → KHÔNG ĐƯỢC CHI TRẢ</div>
      </div>
    </div>

    <!-- CẢNH 5: Mốc 2 — 2 năm khôi phục hợp đồng cũ -->
    <div ${sceneAttr("s5")}>
      <div class="wrap" id="s5w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="blueprint-ref"><span>MỐC THỜI GIAN 02</span><span>CỬA SỔ HỒI SINH</span></div>
        <div class="scene-kicker kicker-amber"><span>KHÔI PHỤC HỢP ĐỒNG</span></div>
        <div id="s5-hero">
          <div id="s5-num">2 NĂM</div>
          <div id="s5-sub-txt">GIỮ LẠI HỢP ĐỒNG CŨ (24 THÁNG)</div>
        </div>
        <div id="s5-ruler-wrap">
          <svg width="860" height="160" viewBox="0 0 860 160">
            <rect x="60" y="60" width="740" height="40" rx="8" fill="rgba(217, 119, 6, 0.14)"/>
            <line x1="60" y1="100" x2="800" y2="100" stroke="var(--c-ink)" stroke-width="4"/>
            ${s5Ticks}
          </svg>
        </div>
        <div id="s5-compare-wrap">
          <svg width="900" height="480" viewBox="0 0 900 480">
            <line x1="90" y1="400" x2="830" y2="400" stroke="var(--c-ink-dim)" stroke-width="3"/>
            <line x1="90" y1="60" x2="90" y2="400" stroke="var(--c-ink-dim)" stroke-width="3"/>
            <path id="s5-curve-new" d="M 110 340 Q 450 280, 790 95" fill="none" stroke="var(--c-danger)" stroke-width="10" stroke-linecap="round"/>
            <path id="s5-curve-old" d="M 110 340 L 790 315" fill="none" stroke="var(--c-brand)" stroke-width="10" stroke-linecap="round"/>
            <text id="s5-lbl-new" x="780" y="70" text-anchor="end" font-size="30" font-weight="900" fill="var(--c-danger)">MUA MỚI (PHÍ ĐẮT THEO TUỔI)</text>
            <text id="s5-lbl-old" x="780" y="285" text-anchor="end" font-size="30" font-weight="900" fill="var(--c-brand)">KHÔI PHỤC HỢP ĐỒNG CŨ</text>
          </svg>
        </div>
      </div>
    </div>

    <!-- CẢNH 6: 3 điều kiện khắt khe -->
    <div ${sceneAttr("s6")}>
      <div class="wrap" id="s6w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="blueprint-ref"><span>ĐIỀU KIỆN BẮT BUỘC</span><span>KHÁC HẲN 60 NGÀY</span></div>
        <div class="scene-kicker kicker-amber"><span>CÁI GIÁ CỦA 2 NĂM</span></div>
        <div class="scene-title">3 ĐIỀU KIỆN KHÔI PHỤC</div>

        <div class="s6-mech" id="s6-m1">
          <div class="s6-num">01</div>
          <div class="s6-body">
            <div class="s6-title">ĐÓNG BÙ PHÍ CÒN THIẾU</div>
            <div class="s6-meta">Bổ sung toàn bộ phần phí gián đoạn</div>
          </div>
          <div class="s6-icon-box">
            <svg width="170" height="140" viewBox="0 0 170 140">
              <rect x="20" y="55" width="130" height="30" rx="15" fill="var(--bg-surface)" stroke="var(--c-ink)" stroke-width="3"/>
              <rect id="s6-bar1" x="24" y="59" width="122" height="22" rx="11" fill="var(--c-amber)"/>
            </svg>
          </div>
        </div>

        <div class="s6-mech" id="s6-m2">
          <div class="s6-num">02</div>
          <div class="s6-body">
            <div class="s6-title">THẨM ĐỊNH LẠI SỨC KHỎE</div>
            <div class="s6-meta">Xét duyệt hồ sơ y tế tại thời điểm xin lại</div>
          </div>
          <div class="s6-icon-box">
            <svg width="170" height="140" viewBox="0 0 170 140">
              <rect x="30" y="20" width="95" height="105" rx="10" fill="var(--bg-elevated)" stroke="var(--c-ink)" stroke-width="3"/>
              <line x1="46" y1="45" x2="108" y2="45" stroke="var(--c-ink-dim)" stroke-width="6" stroke-linecap="round"/>
              <line x1="46" y1="68" x2="96" y2="68" stroke="var(--c-ink-dim)" stroke-width="6" stroke-linecap="round"/>
              <line x1="46" y1="91" x2="104" y2="91" stroke="var(--c-ink-dim)" stroke-width="6" stroke-linecap="round"/>
              <g id="s6-loupe">
                <circle cx="88" cy="70" r="28" fill="rgba(13, 148, 136, 0.16)" stroke="var(--c-teal)" stroke-width="6"/>
                <line x1="108" y1="90" x2="136" y2="118" stroke="var(--c-teal)" stroke-width="9" stroke-linecap="round"/>
              </g>
            </svg>
          </div>
        </div>

        <div class="s6-mech" id="s6-m3">
          <div class="s6-num">03</div>
          <div class="s6-body">
            <div class="s6-title">TÍNH LẠI THỜI GIAN CHỜ</div>
            <div class="s6-meta">Một số quyền lợi bắt đầu đếm lại từ đầu</div>
          </div>
          <div class="s6-icon-box">
            <svg width="170" height="140" viewBox="0 0 170 140">
              <circle cx="85" cy="70" r="46" fill="var(--bg-elevated)" stroke="var(--c-ink)" stroke-width="5"/>
              <line x1="85" y1="30" x2="85" y2="40" stroke="var(--c-danger)" stroke-width="4"/>
              <g id="s6-clock-hand" style="transform-origin: 85px 70px;">
                <line x1="85" y1="70" x2="85" y2="36" stroke="var(--c-danger)" stroke-width="6" stroke-linecap="round"/>
              </g>
              <circle cx="85" cy="70" r="7" fill="var(--c-ink-dark)"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- CẢNH 7: Rủi ro bị từ chối & Câu chốt dễ nhớ -->
    <div ${sceneAttr("s7")}>
      <div class="wrap" id="s7w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div class="blueprint-ref"><span>TỔNG KẾT SO SÁNH</span><span>ĐỪNG ĐỂ TRỄ 60 NGÀY</span></div>
        <div class="scene-kicker kicker-danger"><span>RỦI RO KHI CHỜ ĐỢI</span></div>

        <div id="s7-dossier" data-layout-allow-overflow>
          <div class="s7-dos-hdr">ĐƠN XIN KHÔI PHỤC HỢP ĐỒNG</div>
          <div class="s7-sk-row" style="width:92%;"></div>
          <div id="s7-alert-line"></div>
          <div class="s7-sk-row" style="width:65%;"></div>
          <div style="font-size:28px; font-weight:800; color:var(--c-danger); margin-top:26px;">PHÁT SINH VẤN ĐỀ SỨC KHỎE MỚI</div>
          <div id="s7-reject">LOẠI TRỪ / TỪ CHỐI</div>
        </div>

        <div id="s7-split">
          <div class="s7-pole" id="s7-p1">
            <div class="s7-pole-time">60 NGÀY</div>
            <div class="s7-pole-desc">
              <div id="s7-p1-hl"></div>
              <span style="position:relative; z-index:2;">BẢO VỆ · KHÔNG HỎI SỨC KHỎE</span>
            </div>
          </div>
          <div class="s7-pole" id="s7-p2">
            <div class="s7-pole-time">2 NĂM</div>
            <div class="s7-pole-desc">XÉT LẠI TỪ ĐẦU</div>
          </div>
        </div>
      </div>
    </div>

    <!-- CẢNH 8: Brand Outro -->
    <div ${sceneAttr("s8")}>
      <div class="wrap" id="s8w" data-layout-allow-overlap data-layout-allow-occlusion>
        <div id="outro-card">
          <div id="o-badge"><img src="assets/branding/manulife-logo.png" alt="Manulife"></div>
          <div id="o-name">TIẾN DƯƠNG</div>
          <div id="o-title">Chuyên Gia Hoạch Định Tài Chính · Manulife Việt Nam</div>
          <div id="o-rule"></div>
          <div id="o-tagline">HOẠCH ĐỊNH TÀI CHÍNH · BẢO VỆ VỮNG BỀN</div>
          <div id="o-cta">
            <div id="o-cta-hl"></div>
            <div id="o-cta-text">Nhắn 'KẾ HOẠCH'</div>
          </div>
          <div id="o-sub">để nhận bản phân tích rủi ro và giải pháp tài chính vững bền</div>
          <div id="o-handle">@tienduong</div>
          <div id="o-disc" data-layout-ignore>Nội dung mang tính chất chia sẻ giải pháp · Liên hệ để được tư vấn theo nhu cầu thực tế</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Phụ đề Karaoke đồng bộ từng từ -->
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

  // 1. Procedural Canvas: Giấy can kiến trúc + Sợi cellulose + Lưới chấm CAD 80px
  (function initCanvas() {
    var c = document.getElementById('bg-canvas');
    if (!c) return;
    var ctx = c.getContext('2d');
    var w = c.width = 1080, h = c.height = 1920;
    var r = rng(20261113);

    ctx.fillStyle = '#F5F2EB';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(30, 58, 138, 0.022)';
    for (var i = 0; i < 38000; i++) {
      var x = r() * w, y = r() * h, rad = r() * 1.15;
      ctx.fillRect(x, y, rad, rad);
    }

    ctx.fillStyle = 'rgba(30, 58, 138, 0.11)';
    for (var gx = 40; gx < w; gx += 80) {
      for (var gy = 40; gy < h; gy += 80) {
        ctx.fillRect(gx, gy, 2, 2);
      }
    }

    ctx.strokeStyle = 'rgba(30, 58, 138, 0.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, w - 88, h - 88);
  })();

  // 2. 26 hạt bụi ánh sáng trôi nhẹ liên tục
  (function initDust() {
    var d = document.getElementById('dust');
    if (!d) return;
    var r = rng(20261113);
    for (var i = 0; i < 26; i++) {
      var m = document.createElement('div');
      m.className = 'mote';
      var sz = 3 + r() * 4;
      m.style.width = sz + 'px';
      m.style.height = sz + 'px';
      m.style.left = (90 + r() * 900) + 'px';
      m.style.top = (180 + r() * 1450) + 'px';
      m.style.opacity = (0.22 + r() * 0.48).toFixed(2);
      d.appendChild(m);
    }
  })();

  var tl = gsap.timeline({ paused: true });

  // 3. Nhịp thở sân khấu #cam liên tục (0 freeze events)
  SC.forEach(function (s, i) {
    tl.fromTo('#cam', { scale: 1.0 }, {
      scale: i === SC.length - 1 ? 1.025 : 1.045,
      duration: s.dur,
      ease: 'sine.inOut',
      immediateRender: i === 0
    }, s.start);
  });

  var motes = document.querySelectorAll('.mote');
  if (motes.length) {
    var cyc = 4.2;
    var repeats = Math.max(0, Math.floor(TOTAL / cyc) - 1);
    tl.to(motes, {
      y: '-=48',
      x: '+=16',
      duration: cyc,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: repeats
    }, 0);
  }

  // 4. DIỄN HOẠT CHI TIẾT 8 CẢNH NEO VÀO T(wordIndex)
  // CẢNH 1 (0.00s -> 9.42s)
  tl.fromTo('#s1-myth', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' }, T(0));
  tl.fromTo('#s1-strike', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'expo.out' }, T(16));
  tl.to('#s1-myth', { y: -32, opacity: 0.44, scale: 0.88, duration: 0.55, ease: 'power2.inOut' }, T(23));
  tl.fromTo('#s1-track', { strokeDasharray: 540, strokeDashoffset: 540 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, T(26));
  tl.fromTo('#s1-node1', { y: 34, scale: 0.72, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)' }, T(29));
  tl.fromTo('#s1-node2', { y: 34, scale: 0.72, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)' }, T(31));
  tl.to('#s1w', { opacity: 0, duration: 0.22, ease: 'power2.inOut' }, SC[0].start + SC[0].dur - 0.22);

  // CẢNH 2 (9.42s -> 17.81s)
  tl.fromTo('#s2w', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, SC[1].start);
  var dayObj = { val: 1 };
  var dayEl = document.getElementById('s2-day-num');
  tl.to(dayObj, {
    val: 60,
    duration: 2.3,
    ease: 'power2.inOut',
    onUpdate: function () {
      if (dayEl) {
        var n = Math.round(dayObj.val);
        dayEl.textContent = (n < 10 ? '0' : '') + n;
      }
    }
  }, T(44));
  tl.fromTo('#s2-needle', { x: 0 }, { x: 740, duration: 2.3, ease: 'power2.inOut' }, T(44));
  tl.fromTo('#s2-hl-band', { scaleX: 0 }, { scaleX: 1, duration: 2.3, ease: 'power2.inOut' }, T(44));
  tl.fromTo('#s2-gate-pill', { y: 30, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)' }, T(62));
  tl.to('#s2-gate-pill', { scale: 1.03, duration: 0.35, yoyo: true, repeat: 1, ease: 'back.out(1.7)' }, T(69));
  tl.to('#s2w', { opacity: 0, duration: 0.22, ease: 'power2.inOut' }, SC[1].start + SC[1].dur - 0.22);

  // CẢNH 3 (17.81s -> 29.61s)
  tl.fromTo('#s3w', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, SC[2].start);
  tl.fromTo('#s3-shield-stage', { scale: 0.72, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.65, ease: 'back.out(1.6)' }, T(74));
  tl.fromTo('#s3-check', { strokeDasharray: 260, strokeDashoffset: 260 }, { strokeDashoffset: 0, duration: 0.65, ease: 'expo.out' }, T(80));
  tl.fromTo('#s3-stamp', { scale: 2.0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }, T(86));
  tl.fromTo('#s3-payout', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, T(100));
  tl.fromTo('#s3-pay-deduct', { x: -30, opacity: 0.4 }, { x: 14, opacity: 1, duration: 0.55, ease: 'back.out(1.7)' }, T(109));
  tl.fromTo('#s3-nohealth-wrap', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.5)' }, T(115));
  tl.fromTo('#s3-nohealth-hl', { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: 'power2.inOut' }, T(117));
  tl.to('#s3w', { opacity: 0, duration: 0.22, ease: 'power2.inOut' }, SC[2].start + SC[2].dur - 0.22);

  // CẢNH 4 (29.61s -> 41.18s)
  tl.fromTo('#s4w', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, SC[3].start);
  tl.fromTo('#s4-lock-pin', { x: 0 }, { x: 185, duration: 0.9, ease: 'power2.inOut' }, T(125));
  tl.fromTo('#s4-lock-shackle', { y: -32 }, { y: 0, duration: 0.65, ease: 'elastic.out(1, 0.5)' }, T(134));
  tl.fromTo('#s4-frost', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.85, ease: 'power2.inOut' }, T(136));
  tl.fromTo('#s4-stamp', { scale: 1.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }, T(147));
  tl.fromTo('#s4-nopay', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, T(158));
  tl.to('#s4w', { opacity: 0, duration: 0.22, ease: 'power2.inOut' }, SC[3].start + SC[3].dur - 0.22);

  // CẢNH 5 (41.18s -> 48.66s)
  tl.fromTo('#s5w', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, SC[4].start);
  tl.fromTo('#s5-num', { scale: 0.65, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)' }, T(179));
  tl.fromTo('#s5-curve-old', { strokeDasharray: 720, strokeDashoffset: 720 }, { strokeDashoffset: 0, duration: 0.85, ease: 'power2.inOut' }, T(186));
  tl.fromTo('#s5-lbl-old', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' }, T(186));
  tl.fromTo('#s5-curve-new', { strokeDasharray: 780, strokeDashoffset: 780 }, { strokeDashoffset: 0, duration: 0.9, ease: 'expo.out' }, T(193));
  tl.fromTo('#s5-lbl-new', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.45, ease: 'back.out(1.5)' }, T(193));
  tl.to('#s5w', { opacity: 0, duration: 0.22, ease: 'power2.inOut' }, SC[4].start + SC[4].dur - 0.22);

  // CẢNH 6 (48.66s -> 58.34s)
  tl.fromTo('#s6w', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, SC[5].start);
  tl.fromTo(['#s6-m1', '#s6-m2', '#s6-m3'], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.12, ease: 'back.out(1.5)' }, SC[5].start + 0.12);
  tl.fromTo('#s6-bar1', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, T(214));
  tl.fromTo('#s6-loupe', { x: -24, y: 12 }, { x: 18, y: -8, duration: 1.0, ease: 'power2.inOut', yoyo: true, repeat: 1 }, T(224));
  tl.fromTo('#s6-clock-hand', { rotation: -270 }, { rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, T(235));
  tl.to('#s6w', { opacity: 0, duration: 0.22, ease: 'power2.inOut' }, SC[5].start + SC[5].dur - 0.22);

  // CẢNH 7 (58.34s -> 71.14s)
  tl.fromTo('#s7w', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, SC[6].start);
  tl.fromTo('#s7-dossier', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, T(243));
  tl.fromTo('#s7-alert-line', { scaleX: 0.3, opacity: 0.2 }, { scaleX: 1, opacity: 1, duration: 0.55, ease: 'power2.inOut' }, T(251));
  tl.fromTo('#s7-reject', { scale: 1.75, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: 'back.out(1.7)' }, T(265));
  tl.fromTo('#s7-p1', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' }, T(272));
  tl.fromTo('#s7-p1-hl', { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: 'power2.inOut' }, T(278));
  tl.fromTo('#s7-p2', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, T(283));
  tl.to('#s7w', { opacity: 0, duration: 0.22, ease: 'power2.inOut' }, SC[6].start + SC[6].dur - 0.22);

  // CẢNH 8: Brand Outro (71.14s -> End) — Đầy đủ sớm trong 0.15..0.85s đầu cảnh
  var s8Start = SC[7].start;
  tl.fromTo('#s8w', { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' }, s8Start);
  tl.fromTo('#outro-card', { opacity: 0, scale: 0.92, y: 24 }, { opacity: 1, scale: 1.0, y: 0, duration: 0.5, ease: 'back.out(1.4)' }, s8Start + 0.08);
  tl.fromTo('#o-cta-hl', { scaleX: 0 }, { scaleX: 1.0, duration: 0.55, ease: 'power2.inOut' }, T(295));
  tl.fromTo('#o-cta-text', { scale: 1.0 }, { scale: 1.06, duration: 0.22, yoyo: true, repeat: 1, ease: 'back.out(2)' }, T(296));
  tl.to('#outro-card', { y: -8, duration: 2.0, yoyo: true, repeat: 1, ease: 'sine.inOut' }, s8Start + 0.9);

  // 5. Phụ đề Karaoke nhảy từng từ — Tắt dòng cũ tại W[SUB[li + 1][0]].s - 0.04
  SUB.forEach(function (line, li) {
    var el = document.getElementById('sl' + li);
    var st = li === 0 ? 0 : Math.max(0, W[line[0]].s - 0.03);
    var en = li < SUB.length - 1 ? Math.max(st + 0.2, W[SUB[li + 1][0]].s - 0.04) : TOTAL;
    tl.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out', immediateRender: li === 0 }, st);
    if (li < SUB.length - 1) tl.set(el, { opacity: 0 }, en);
    line.forEach(function (wi) {
      var w = document.getElementById('sw' + wi), ws = W[wi].s, we = Math.max(W[wi].e, ws + 0.12);
      tl.fromTo(w, { scale: 1, y: 0, color: 'rgba(255,255,255,0.62)' }, { scale: 1.18, y: -6, color: '#FDE047', duration: 0.1, ease: 'back.out(3)', immediateRender: false }, ws);
      tl.to(w, { scale: 1, y: 0, color: '#FFFFFF', duration: 0.12, ease: 'power2.out' }, we);
    });
  });

  window.__timelines['main'] = tl;
})();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(DIR, "index.html"), html, "utf8");

// 5. Tự động xuất đồng bộ specs/video-spec.json và storyboard.json
fs.mkdirSync(path.join(DIR, "specs"), { recursive: true });
const videoSpec = {
  schemaVersion: "0.1",
  project: { id: PROJECT_ID, title: "Gia Hạn 60 Ngày & Khôi Phục Hợp Đồng 2 Năm", version: 1 },
  format: { aspectRatio: "9:16", width: 1080, height: 1920, fpsPreference: 30, targetDurationMs: Math.round(TOTAL * 1000) },
  content: { coreMessage: "Phân biệt rõ 60 ngày gia hạn đóng phí và 2 năm khôi phục hợp đồng", audience: "General", tone: "Editorial Light", language: "vi" },
  script: {
    narration: words.map(w => w.w).join(" "),
    scenes: scenes.map((s, idx) => ({
      id: s.id,
      purpose: `Scene ${idx + 1}`,
      narration: "",
      startMs: Math.round(s.start * 1000),
      durationMs: Math.round(s.dur * 1000),
      visualIntent: { description: `Scene ${idx + 1}`, layout: "centered" },
      motionIntent: [{ type: "fade-in", subject: s.id }],
      assets: idx === 7 ? [{ id: "logo", type: "image", path: "assets/branding/manulife-logo.png" }] : []
    }))
  },
  engineRouting: { suggestedEngine: "HYPERFRAMES", reason: "Pure Bespoke V4 Compiler" }
};

fs.writeFileSync(path.join(DIR, "specs", "video-spec.json"), JSON.stringify(videoSpec, null, 2) + "\n", "utf8");
fs.writeFileSync(path.join(DIR, "storyboard.json"), JSON.stringify({ projectId: PROJECT_ID, totalDurationSec: TOTAL, scenes }, null, 2) + "\n", "utf8");

console.log("✅ [Compiler] Successfully compiled index.html, specs/video-spec.json, and storyboard.json for " + PROJECT_ID + " (" + TOTAL + "s)");
