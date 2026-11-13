/*
 * build-index-template.cjs — Mẫu trình sinh mã HyperFrames đồng bộ từng từ (Word-Level Choreography)
 * Đa chủ đề · Đa phong cách · Tự động thích ứng N cảnh theo độ sâu ý tưởng & khổ hình 9:16 / 16:9 / 1:1
 * Đặt tại: projects/<project-id>/build-index.cjs
 * Chạy:    node projects/<project-id>/build-index.cjs
 */
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const PROJECT_ID = path.basename(DIR);
const timing = JSON.parse(fs.readFileSync(path.join(DIR, "assets/audio/timing.json"), "utf8"));

// 0. Đọc cấu hình dự án từ inputProps.json (format: 9:16 | 16:9 | 1:1, brand: none | <id>)
const FORMATS = { "9:16": [1080, 1920], "16:9": [1920, 1080], "1:1": [1080, 1080] };
let inputProps = {};
const propsPath = path.join(DIR, "inputProps.json");
if (fs.existsSync(propsPath)) {
  try { inputProps = JSON.parse(fs.readFileSync(propsPath, "utf8")); } catch {}
}
const ASPECT = FORMATS[inputProps.format] ? inputProps.format : "9:16";
const [WIDTH, HEIGHT] = FORMATS[ASPECT];
const SUB_W = Math.min(WIDTH - 100, 1240);
const SUB_BOTTOM = HEIGHT === 1080 ? 84 : 185;
const SUB_FONT = HEIGHT === 1080 ? 38 : 44;

// 1. Lọc bỏ token rỗng hoặc dấu phân cách '---'
const words = timing.words
  .filter(w => w.word && w.word.trim() && w.word.trim() !== "---")
  .map(w => ({
    w: w.word.trim(),
    s: +(w.startMs / 1000).toFixed(3),
    e: +((w.startMs + w.durationMs) / 1000).toFixed(3)
  }));

const AUDIO = +(timing.durationMs / 1000).toFixed(3);
const TAIL = 1.4; // Khoảng đệm cuối video (nằm trong khung chuẩn 0..2.5s của E2E QC)
const TOTAL = +(AUDIO + TAIL).toFixed(3);

// 2. Hàm khóa mốc chuyển cảnh theo từ khóa thật trong timing.json
const norm = s => s.toLowerCase().normalize("NFC").replace(/[.,:;!?]/g, "");
function anchor(idx, expect) {
  if (!words[idx] || norm(words[idx].w) !== norm(expect)) {
    throw new Error(`Anchor ${idx} expected "${expect}" got "${words[idx] && words[idx].w}"`);
  }
  return words[idx].s;
}

const LEAD = 0.25;
// Cấu hình danh sách cảnh tự động theo độ sâu kịch bản (mỗi cảnh giải phẫu 1 mắt xích cơ chế)
// cam: 'punch-in' | 'pull-back' | 'pan-left' | 'pan-right' | 'breathe'
const sceneConfigs = [
  { id: "s1", act: "Cảnh 1 - Hook", cam: "punch-in", anchor: null },
  { id: "s2", act: "Cảnh 2 - Bối cảnh gốc rễ", cam: "pan-right", anchor: [25, "Từ_khóa_cảnh_2"] },
  { id: "s3", act: "Cảnh 3 - Cơ chế 1", cam: "breathe", anchor: [77, "Từ_khóa_cảnh_3"] },
  { id: "s4", act: "Cảnh 4 - Cơ chế 2", cam: "pan-left", anchor: [120, "Từ_khóa_cảnh_4"] },
  { id: "s5", act: "Cảnh 5 - Điểm mù / Bước ngoặt", cam: "pull-back", anchor: [179, "Từ_khóa_cảnh_5"] },
  { id: "s6", act: "Cảnh 6 - Đúc kết / Outro", cam: "breathe", anchor: [200, "Từ_khóa_cảnh_6"] }
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

// 3. Chia phụ đề Karaoke chuẩn 9-10 từ/dòng, ưu tiên ngắt ở dấu câu
const subLines = [];
let cur = [];
words.forEach((w, i) => {
  cur.push(i);
  const punct = /[.,?!:;]$/.test(w.w);
  if (
    (cur.length >= 9 && punct) ||
    cur.length >= 10 ||
    i === words.length - 1 ||
    (punct && /[.?!]$/.test(w.w) && cur.length >= 6 && words[i + 1] && words[i + 1].s - w.e > 0.45)
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

const scenesHTML = scenes
  .map(
    s =>
      `<div class="clip scene" id="${s.id}" data-start="${s.start}" data-duration="${s.dur}" data-track-index="1"><div class="wrap" id="${s.id}w" data-layout-allow-overlap data-layout-allow-occlusion></div></div>`
  )
  .join("\n    ");

// 4. Khung HTML + GSAP Timeline chuẩn HyperFrames
const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=${WIDTH}, height=${HEIGHT}">
<title>${PROJECT_ID}</title>
<style>
/* Nhúng @font-face cục bộ từ assets/fonts/ theo bộ font đã chọn trong DESIGN.md (ví dụ Be Vietnam Pro): */
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Regular.ttf') format('truetype'); font-weight: 400; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Medium.ttf') format('truetype'); font-weight: 500; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Bold.ttf') format('truetype'); font-weight: 700; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-ExtraBold.ttf') format('truetype'); font-weight: 800; }
@font-face { font-family: 'Be Vietnam Pro'; src: url('assets/fonts/BeVietnamPro-Black.ttf') format('truetype'); font-weight: 900; }

/* Điền hệ Semantic Tokens từ DESIGN.md của dự án (sáng, tối điện ảnh, màu mạnh, collage... tùy chủ đề) */
:root {
  --bg-stage: #121316;
  --bg-surface: #1C1E24;
  --ink-primary: #F5F5F7;
  --ink-secondary: #A1A6B4;
  --accent-1: #FDE047;
  --accent-2: #38BDF8;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100%; height: 100%; overflow: hidden; font-family: 'Be Vietnam Pro', sans-serif; background: var(--bg-stage); color: var(--ink-primary); }
#cam { position: absolute; inset: 0; transform-origin: 50% 45%; }
.scene, .wrap { position: absolute; inset: 0; width: 100%; height: 100%; }

/* Phụ đề Karaoke không chồng lấp, tự động co giãn theo khổ hình */
#subs { position: absolute; left: 0; right: 0; bottom: ${SUB_BOTTOM}px; height: 200px; pointer-events: none; }
.sub-line { position: absolute; left: 50%; bottom: 0; width: ${SUB_W}px; margin-left: -${Math.round(SUB_W / 2)}px; text-align: center; opacity: 0; padding: 20px 32px; background: rgba(18,19,22,.86); border-radius: 24px; font-size: ${SUB_FONT}px; font-weight: 800; line-height: 1.4; color: rgba(255,255,255,.55); }
.sub-word { display: inline-block; margin: 0 5px; transform-origin: 50% 80%; }
</style>
<script src="assets/vendor/gsap.min.js"></script>
</head>
<body>
<div id="root" data-composition-id="main" data-width="${WIDTH}" data-height="${HEIGHT}" data-duration="${TOTAL}">
  <audio id="narration" src="assets/audio/narration.mp3" data-start="0" data-duration="${AUDIO}" data-track-index="0"></audio>
  <div id="cam">
    ${scenesHTML}
  </div>
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

  var tl = gsap.timeline({ paused: true });

  // Chuyển động máy quay đa hướng theo tâm lý từng cảnh (chống lỗi freeze frame)
  SC.forEach(function (s, i) {
    var isLast = i === SC.length - 1;
    var cam = s.cam || 'breathe';
    var fromVars = { scale: 1, x: 0, y: 0 };
    var toVars = { scale: isLast ? 1.025 : 1.045, x: 0, y: 0, duration: s.dur, ease: 'sine.inOut', immediateRender: i === 0 };
    if (cam === 'punch-in') { fromVars = { scale: 1, x: 0, y: 0 }; toVars.scale = 1.055; }
    else if (cam === 'pull-back') { fromVars = { scale: 1.055, x: 0, y: 0 }; toVars.scale = 1.0; }
    else if (cam === 'pan-left') { fromVars = { scale: 1.03, x: 18, y: 0 }; toVars.scale = 1.03; toVars.x = -18; }
    else if (cam === 'pan-right') { fromVars = { scale: 1.03, x: -18, y: 0 }; toVars.scale = 1.03; toVars.x = 18; }
    tl.fromTo('#cam', fromVars, toVars, s.start);
  });

  // Phụ đề Karaoke nhảy từng từ — tắt dòng cũ tại W[SUB[li + 1][0]].s - 0.04
  SUB.forEach(function (line, li) {
    var el = document.getElementById('sl' + li);
    var st = li === 0 ? 0 : Math.max(0, W[line[0]].s - .03);
    var en = li < SUB.length - 1 ? Math.max(st + .2, W[SUB[li + 1][0]].s - .04) : TOTAL;
    tl.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .14, ease: 'power2.out', immediateRender: li === 0 }, st);
    if (li < SUB.length - 1) tl.set(el, { opacity: 0 }, en);
    line.forEach(function (wi) {
      var w = document.getElementById('sw' + wi), ws = W[wi].s, we = Math.max(W[wi].e, ws + .12);
      tl.fromTo(w, { scale: 1, y: 0, color: 'rgba(255,255,255,0.55)' }, { scale: 1.18, y: -6, color: 'var(--accent-1)', duration: .1, ease: 'back.out(3)', immediateRender: false }, ws);
      tl.to(w, { scale: 1, y: 0, color: '#FFFFFF', duration: .12, ease: 'power1.out' }, we);
    });
  });

  window.__timelines['main'] = tl;
})();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(DIR, "index.html"), html, "utf8");

// 5. Tự động xuất đồng bộ specs/video-spec.json và storyboard.json từ cùng một nguồn timing
fs.mkdirSync(path.join(DIR, "specs"), { recursive: true });
const videoSpec = {
  schemaVersion: "0.1",
  project: { id: PROJECT_ID, title: PROJECT_ID, version: 1 },
  format: { aspectRatio: ASPECT, width: WIDTH, height: HEIGHT, fpsPreference: 30, targetDurationMs: Math.round(TOTAL * 1000) },
  content: { coreMessage: PROJECT_ID, audience: "General", tone: "Bespoke", language: inputProps.language || "vi" },
  script: {
    narration: words.map(w => w.w).join(" "),
    scenes: scenes.map((s, idx) => ({
      id: s.id,
      purpose: s.act || `Scene ${idx + 1}`,
      narration: "",
      startMs: Math.round(s.start * 1000),
      durationMs: Math.round(s.dur * 1000),
      visualIntent: { description: s.act || `Scene ${idx + 1}`, layout: "centered" },
      motionIntent: [{ type: "fade-in", subject: s.id }],
      assets: []
    }))
  },
  engineRouting: { suggestedEngine: "HYPERFRAMES", reason: "Pure Bespoke V4 Compiler" }
};
fs.writeFileSync(path.join(DIR, "specs", "video-spec.json"), JSON.stringify(videoSpec, null, 2) + "\n", "utf8");
fs.writeFileSync(path.join(DIR, "storyboard.json"), JSON.stringify({ projectId: PROJECT_ID, format: ASPECT, width: WIDTH, height: HEIGHT, totalDurationSec: TOTAL, scenes }, null, 2) + "\n", "utf8");
