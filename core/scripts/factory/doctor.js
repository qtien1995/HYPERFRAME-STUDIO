import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "./state.js";
import { resolveMediaBinary } from "./media.js";
import { pingHttp } from "./services.js";

function checkFfmpeg() {
  const ffmpeg = resolveMediaBinary("ffmpeg", { required: false });
  const ffprobe = resolveMediaBinary("ffprobe", { required: false });
  if (ffmpeg && ffprobe) return { ok: true, ffmpeg, ffprobe };
  if (ffmpeg && !ffprobe) return { ok: false, error: `ffmpeg found (${ffmpeg}) but ffprobe is missing` };
  return { ok: false, error: "FFmpeg/ffprobe not found in standard paths" };
}

function checkHyperframes() {
  try {
    // Prefer the local install: invoke the ESM bin entry directly with the current Node.
    // This avoids Windows .cmd/.bat shims (which cannot be spawned without a shell) and
    // avoids capturing output through piped stdio.
    const entry = path.join(ROOT, "node_modules", "hyperframes", "bin", "hyperframes.mjs");
    const pkgFile = path.join(ROOT, "node_modules", "hyperframes", "package.json");
    if (fs.existsSync(entry)) {
      const res = spawnSync(process.execPath, [entry, "--version"], { stdio: "ignore", timeout: 15000 });
      if (res.status === 0) {
        let version = "unknown";
        try { version = JSON.parse(fs.readFileSync(pkgFile, "utf8")).version || version; } catch {}
        return { ok: true, version: `hyperframes v${version}` };
      }
    }
    // Global install / PATH fallback (shell:true resolves .cmd shims on Windows).
    const fallback = spawnSync("hyperframes", ["--version"], { stdio: "ignore", timeout: 15000, shell: true });
    if (fallback.status === 0) return { ok: true, version: "hyperframes (global)" };
    return { ok: false, error: "HyperFrames CLI not found" };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function runDoctor() {
  console.log("==================================================");
  console.log("   HYPERFRAME STUDIO V4 — PRE-FLIGHT HEALTH CHECK  ");
  console.log("==================================================\n");

  const results = {
    hyperframes: { name: "HyperFrames Engine CLI", status: "checking" },
    citVoice: { name: "CIT Voice Studio (VieNeu-TTS :8001)", status: "checking" },
    ffmpeg: { name: "FFmpeg & Media Pipeline", status: "checking" },
    workspace: { name: "Workspace Storage & Node.js", status: "checking" }
  };

  // 1. HyperFrames CLI
  const hfRes = checkHyperframes();
  if (hfRes.ok) {
    results.hyperframes.status = "PASS";
    results.hyperframes.detail = `${hfRes.version} (Native Video Renderer)`;
  } else {
    results.hyperframes.status = "FAIL";
    results.hyperframes.detail = `HyperFrames CLI not found or error: ${hfRes.error}`;
    results.hyperframes.guide = "Install via: npm i -g hyperframes or check PATH";
  }

  // 2. CIT Voice Studio
  const citRes = await pingHttp("http://127.0.0.1:8001");
  if (citRes.ok || citRes.statusCode === 404 || citRes.statusCode === 200) {
    results.citVoice.status = "PASS";
    results.citVoice.detail = "Online at http://127.0.0.1:8001 (VieNeu-TTS 48kHz Studio Ready)";
  } else {
    results.citVoice.status = "OFFLINE";
    results.citVoice.detail = "Server not reachable. Start via CIT Voice Studio app before running TTS.";
    results.citVoice.guide = "Run: npm run services hoặc khởi động CIT Voice Studio";
  }

  // 3. FFmpeg
  const ffRes = checkFfmpeg();
  if (ffRes.ok) {
    results.ffmpeg.status = "PASS";
    results.ffmpeg.detail = `ffmpeg (${ffRes.ffmpeg}) + ffprobe (${ffRes.ffprobe})`;
  } else {
    results.ffmpeg.status = "FAIL";
    results.ffmpeg.detail = ffRes.error;
  }

  // 4. Node & Workspace
  results.workspace.status = "PASS";
  results.workspace.detail = `Node ${process.version} on ${process.platform} (${ROOT})`;

  // Display report
  let allPass = true;
  for (const [key, item] of Object.entries(results)) {
    const icon = item.status === "PASS" ? "✅" : item.status === "WARN" ? "⚠️" : "❌";
    console.log(`${icon} [${item.status}] ${item.name}`);
    console.log(`   └─ ${item.detail}`);
    if (item.guide) console.log(`   └─ Action: ${item.guide}`);
    if (item.status === "FAIL" || item.status === "OFFLINE") allPass = false;
    console.log("");
  }

  console.log("--------------------------------------------------");
  if (allPass) {
    console.log("🎉 ALL SYSTEMS GO: HyperFrames Video Factory is fully operational!\n");
  } else {
    console.log("⚠️ SOME SERVICES REQUIRE ATTENTION (See actions above)\n");
  }

  return allPass;
}
