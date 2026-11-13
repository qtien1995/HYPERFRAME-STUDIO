import minimist from "minimist";
import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { ROOT, projectDir } from "./state.js";
import { loadProjectConfig } from "./project-config.js";
import { resolveMediaBinary } from "./media.js";

const argv = minimist(process.argv.slice(2));
const project = argv.project || argv.p;

if (!project) {
  console.log(`
🎬 [HyperFrame Studio V4] Lệnh Sản Xuất Video (Make Pipeline)
============================================================
Cách sử dụng:
  npm run make -- --project <tên_folder_dự_án>

Quy trình tự động gồm 4 bước (Cưỡng chế 4 Pha):
  1. Kiểm tra Cổng Duyệt User (Pha 1: Gate 1 kịch bản + Gate 2 Art Direction Sheet & DESIGN.md)
  2. Tạo giọng đọc TTS & kiểm tra khóa PRODUCTION-BLUEPRINT.md (Pha 2) + build-index.cjs (Pha 3)
  3. Render Final MP4 (theo khổ hình dự án, EBU R128) + Trích xuất storyboard-check (Hook 0.30s + N cảnh) + Hard QC Gate (Pha 4)
  4. Đóng gói thumbnails, metadata SEO và hoàn thiện output
`);
  process.exit(0);
}

try {
  const pDir = projectDir(project);
  const projCfg = loadProjectConfig(project);
  console.log(`\n🚀 [MAKE PIPELINE V4] Bắt đầu sản xuất video bespoke cho: ${project}`);
  console.log(`📂 Thư mục: ${pDir}`);
  console.log(`⚙️  Cấu hình: Format ${projCfg.format} (${projCfg.width}x${projCfg.height}) | Voice: ${projCfg.voice} (${projCfg.ttsSpeed}x) | Brand: ${projCfg.brand}\n`);

  const factoryCli = path.join(ROOT, "core", "scripts", "factory", "index.js");

  // Bước 1: Kiểm tra Cổng duyệt (Gate 1 & Gate 2) - CẤM FAST-TRACK
  console.log(`▶️ [1/4] Kiểm tra Cổng Duyệt User (Gate 1 & Gate 2)...`);
  const nextRes = spawnSync(process.execPath, [factoryCli, "next", "--project", project], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (nextRes.status !== 0) {
    throw new Error(`Không thể kiểm tra trạng thái dự án: ${nextRes.stderr || nextRes.error?.message}`);
  }

  let nextStage = "";
  try {
    const nextJson = JSON.parse(nextRes.stdout.trim());
    nextStage = nextJson.next;
  } catch {
    nextStage = "";
  }

  const unapprovedStages = ["SCRIPT", "BEATS", "GATE1", "CREATIVE_DIRECTION", "GATE2"];
  if (unapprovedStages.includes(nextStage)) {
    console.error(`\n⛔ [GATE CHECK BLOCKED]: Dự án '${project}' đang ở giai đoạn '${nextStage}', CHƯA ĐƯỢC USER DUYỆT!`);
    console.error(`   Quy định V4 Bespoke: Cấm fast-track tự duyệt dưới mọi hình thức.`);
    console.error(`   👉 Trình kịch bản + Art Direction Sheet cho User.`);
    console.error(`   👉 Duyệt xong dùng lệnh: node core/scripts/factory/index.js approve --project ${project} --gate <GATE1|GATE2> --evidence "User approved"`);
    process.exit(1);
  }
  console.log(`   ✅ Cổng duyệt hợp lệ (Giai đoạn tiếp theo: ${nextStage || "DONE"})`);

  // Bước 2: Tạo giọng đọc & nhịp timing
  console.log(`\n▶️ [2/4] Tạo giọng thuyết minh & Đo nhịp từng từ (TTS: ${projCfg.voice})...`);
  const step2 = spawnSync(process.execPath, [factoryCli, "tts", "--project", project], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (step2.status !== 0) {
    throw new Error("Lỗi tại Bước 2 (TTS & Timing)");
  }

  // Chốt chặn Pha 2 & Pha 3: Kiểm tra PRODUCTION-BLUEPRINT.md và build-index.cjs + storyboard.json
  const blueprintFile = path.join(pDir, "PRODUCTION-BLUEPRINT.md");
  const compilerFile = path.join(pDir, "build-index.cjs");
  const htmlFile = path.join(pDir, "index.html");
  const storyboardFile = path.join(pDir, "storyboard.json");
  if (!fs.existsSync(blueprintFile) || fs.statSync(blueprintFile).size < 800) {
    console.error(`\n⛔ [PHASE 2 LOCK BLOCKED]: Thiếu hoặc chưa hoàn chỉnh '${blueprintFile}'!`);
    console.error(`   Cấm nhảy cóc từ TTS sang Render! Bắt buộc hoàn thành Pha 2 (xuất PRODUCTION-BLUEPRINT.md) và Pha 3 (build-index.cjs -> index.html) trước.`);
    process.exit(1);
  }
  if (!fs.existsSync(compilerFile) || !fs.existsSync(htmlFile) || !fs.existsSync(storyboardFile)) {
    console.error(`\n⛔ [PHASE 3 LOCK BLOCKED]: Thiếu 'build-index.cjs', 'index.html' hoặc 'storyboard.json' trong '${pDir}'!`);
    console.error(`   Bắt buộc hoàn thành Pha 3 (biên dịch build-index.cjs và chạy npx hyperframes check đạt 0 errors) trước khi chạy npm run make.`);
    process.exit(1);
  }
  console.log(`   ✅ Đã xác nhận khóa Pha 2 (PRODUCTION-BLUEPRINT.md) & Pha 3 (build-index.cjs + index.html + storyboard.json)`);

  // Bước 3: Render Final MP4
  console.log(`\n▶️ [3/4] Dựng hình HyperFrames & Chuẩn hóa âm lượng EBU R128 (Render Final)...`);
  const step3 = spawnSync(
    process.execPath,
    [factoryCli, "render", "--project", project],
    {
      cwd: ROOT,
      stdio: "inherit",
    }
  );
  if (step3.status !== 0) {
    throw new Error("Lỗi tại Bước 3 (Render Final MP4)");
  }

  const finalVideo = path.join(pDir, "output", "final.mp4");
  if (!fs.existsSync(finalVideo)) {
    throw new Error(`File output/final.mp4 không tồn tại sau render!`);
  }

  // (a) Trích frame tĩnh động theo storyboard.json (Hook 0.30s + đủ N cảnh) vào <project>/output/storyboard-check/
  const storyboardCheckDir = path.join(pDir, "output", "storyboard-check");
  fs.mkdirSync(storyboardCheckDir, { recursive: true });
  for (const oldFile of fs.readdirSync(storyboardCheckDir)) {
    if (/^frame_.*\.png$/i.test(oldFile)) {
      try { fs.rmSync(path.join(storyboardCheckDir, oldFile), { force: true }); } catch {}
    }
  }

  const ffprobeBin = resolveMediaBinary("ffprobe");
  const ffmpegBin = resolveMediaBinary("ffmpeg");

  const probeDur = spawnSync(ffprobeBin, [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    finalVideo,
  ], { encoding: "utf8" });
  const totalSec = parseFloat(probeDur.stdout.trim()) || 0;

  const extractAt = (timeSec, outName) => {
    const safeSec = Math.max(0, Math.min(Math.max(0, totalSec - 0.1), timeSec));
    const frameOut = path.join(storyboardCheckDir, outName);
    spawnSync(ffmpegBin, [
      "-y",
      "-ss", String(safeSec),
      "-i", finalVideo,
      "-vframes", "1",
      "-q:v", "2",
      frameOut,
    ]);
  };

  const sb = JSON.parse(fs.readFileSync(storyboardFile, "utf8"));
  const sbScenes = Array.isArray(sb.scenes) ? sb.scenes : [];
  if (sbScenes.length === 0) {
    throw new Error(`storyboard.json không chứa danh sách scenes hợp lệ!`);
  }

  console.log(`\n📸 Đang trích xuất frame Hook 0.30s + ${sbScenes.length} cảnh từ storyboard.json vào storyboard-check/...`);
  const hookSec = Math.min(0.3, Math.max(0.05, totalSec * 0.05));
  extractAt(hookSec, `frame_00_hook_${hookSec.toFixed(2)}s.png`);
  sbScenes.forEach((sc, idx) => {
    const sStart = Number(sc.start ?? sc.startSec ?? (sc.startMs != null ? sc.startMs / 1000 : 0));
    const sDur = Number(sc.dur ?? sc.duration ?? sc.durationSec ?? (sc.durationMs != null ? sc.durationMs / 1000 : 0));
    const isLast = idx === sbScenes.length - 1;
    const midSec = sStart + sDur * (isLast ? 0.65 : 0.55);
    const idSlug = String(sc.id || `s${idx + 1}`).replace(/[^a-zA-Z0-9_-]/g, "");
    extractAt(midSec, `frame_${String(idx + 1).padStart(2, "0")}_${idSlug}_${midSec.toFixed(2)}s.png`);
  });
  console.log(`   ✅ Đã trích 1 frame Hook + ${sbScenes.length} frame cảnh vào storyboard-check/`);

  // Dọn dẹp tệp FAILED cũ nếu có để đảm bảo quy chuẩn T4.5 (chỉ duy nhất final.mp4)
  const prevFailed = path.join(pDir, "output", "final.FAILED.mp4");
  if (fs.existsSync(prevFailed)) fs.rmSync(prevFailed);

  // (b) Chạy bộ kiểm định lên file final: tests/e2e/test_final_video.cjs
  console.log(`\n🔬 [HARD QC GATE] Chạy bộ kiểm định E2E chất lượng video final...`);
  const testSuite = path.join(ROOT, "tests", "e2e", "test_final_video.cjs");
  const qcRes = spawnSync(process.execPath, [testSuite, "--project", pDir], {
    cwd: ROOT,
    stdio: "inherit",
  });

  // (c) Fail BẤT KỲ mục nào -> đổi tên thành final.FAILED.mp4, in các mục fail, exit 1
  if (qcRes.status !== 0) {
    const failedVideo = path.join(pDir, "output", "final.FAILED.mp4");
    if (fs.existsSync(finalVideo)) {
      if (fs.existsSync(failedVideo)) fs.rmSync(failedVideo);
      fs.renameSync(finalVideo, failedVideo);
    }
    console.error(`\n❌ [HARD QC FAILED]: Video không đạt chuẩn kiểm định!`);
    console.error(`   Đã đổi tên: final.mp4 -> final.FAILED.mp4`);
    console.error(`   Chỉ pass toàn bộ tiêu chuẩn mới được giữ file final.mp4.`);
    process.exit(1);
  }
  console.log(`   ✅ HARD QC GATE: 100% TIÊU CHUẨN ĐẠT! Giữ nguyên final.mp4.`);

  // Bước 4: Đóng gói
  console.log(`\n▶️ [4/4] Đóng gói thành phẩm (Thumbnails, SEO Metadata)...`);
  const step4 = spawnSync(process.execPath, [factoryCli, "package", "--project", project], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (step4.status !== 0) {
    throw new Error("Lỗi tại Bước 4 (Package)");
  }

  const qcFile = path.join(pDir, "output", "final-qc.json");

  console.log(`\n============================================================`);
  console.log(`🎉 XUẤT XƯỞNG THÀNH CÔNG DỰ ÁN: ${project}`);
  console.log(`============================================================`);
  if (fs.existsSync(finalVideo)) {
    const stats = fs.statSync(finalVideo);
    console.log(`🎬 Video Final: ${finalVideo} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
  }
  if (fs.existsSync(qcFile)) {
    console.log(`📊 Báo cáo QC:  ${qcFile}`);
  }
  console.log(`============================================================\n`);
} catch (error) {
  console.error(`\n❌ [MAKE FAILED]: ${error.message}`);
  process.exit(1);
}
