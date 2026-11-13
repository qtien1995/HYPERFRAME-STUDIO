import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import minimist from "minimist";
import { validateSpec } from "../../schemas/zod.js";
import { duration } from "./media.js";
import {
  ROOT,
  artifactPath,
  approveGate,
  evaluate,
  invalidateFrom,
  narrationFromScript,
  projectDir,
  readState,
  recordStage,
  stageInput
} from "./state.js";
import { loadProjectConfig } from "./project-config.js";

// Kiểm tra CTA bị cấm theo brand của dự án (chỉ chạy khi dự án có brand và brand khai báo forbiddenCtaPatterns)
function checkBrandCta(project, content, filename) {
  const { brandProfile } = loadProjectConfig(project);
  if (!brandProfile || !Array.isArray(brandProfile.forbiddenCtaPatterns)) return;
  for (const pattern of brandProfile.forbiddenCtaPatterns) {
    if (new RegExp(pattern, "i").test(content)) {
      throw new Error(
        `[BRAND CTA VIOLATION]: '${filename}' chứa CTA bị cấm bởi brand '${brandProfile.id}' (pattern: ${pattern}). ` +
        (brandProfile.cta ? `Dùng CTA chuẩn của brand: ${brandProfile.cta}` : "")
      );
    }
  }
}

function requireDesign(project) {
  const file = artifactPath(project, "DESIGN.md");
  if (!fs.existsSync(file) || fs.statSync(file).size < 500) {
    throw new Error(
      `[PHASE 1 LOCK]: Thiếu hoặc chưa hoàn chỉnh 'projects/${project}/DESIGN.md' (yêu cầu >= 500 bytes). ` +
      `Bắt buộc hoàn thành bản hợp đồng thiết kế DESIGN.md (Design Tokens :root, Typography, Motion, Anti-AI Slop) trước khi chốt Gate 2.`
    );
  }
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes(":root")) {
    throw new Error(
      `[PHASE 1 LOCK]: 'projects/${project}/DESIGN.md' thiếu hệ token ':root'. Phải khóa bảng màu bằng CSS variables trước khi qua Gate 2.`
    );
  }
  checkBrandCta(project, content, `projects/${project}/DESIGN.md`);
}

function requireBlueprint(project) {
  const file = artifactPath(project, "PRODUCTION-BLUEPRINT.md");
  if (!fs.existsSync(file) || fs.statSync(file).size < 800) {
    throw new Error(
      `[PHASE 2 LOCK]: Thiếu hoặc chưa hoàn chỉnh 'projects/${project}/PRODUCTION-BLUEPRINT.md' (yêu cầu >= 800 bytes). ` +
      `Cấm nhảy cóc từ TTS sang viết code! Bắt buộc hoàn thành Pha 2 (xuất PRODUCTION-BLUEPRINT.md gồm Word Map/anchor, Palette :root, DOM/SVG và kịch bản GSAP T(wordIndex)) và dừng nghiệm thu trước khi sang Pha 3.`
    );
  }
  const content = fs.readFileSync(file, "utf8");
  const requiredTokens = ["anchor", "T(", ":root"];
  const missing = requiredTokens.filter(t => !content.includes(t));
  if (missing.length > 0) {
    throw new Error(
      `[PHASE 2 LOCK]: 'projects/${project}/PRODUCTION-BLUEPRINT.md' thiếu các thành phần kỹ thuật bắt buộc: [${missing.join(", ")}]. ` +
      `Phải định nghĩa đủ anchor(), T(wordIndex) và :root palette trong Blueprint trước khi sang Pha 3.`
    );
  }
  checkBrandCta(project, content, `projects/${project}/PRODUCTION-BLUEPRINT.md`);
}

function requireCompiler(project) {
  const compilerFile = artifactPath(project, "build-index.cjs");
  const htmlFile = artifactPath(project, "index.html");
  if (!fs.existsSync(compilerFile) || fs.statSync(compilerFile).size < 1000) {
    throw new Error(
      `[PHASE 3 LOCK]: Thiếu hoặc chưa hoàn chỉnh 'projects/${project}/build-index.cjs'. Bắt buộc biên dịch từ build-index.cjs sang index.html.`
    );
  }
  if (!fs.existsSync(htmlFile) || fs.statSync(htmlFile).size < 1000) {
    throw new Error(
      `[PHASE 3 LOCK]: Thiếu 'projects/${project}/index.html'. Hãy chạy 'node projects/${project}/build-index.cjs' và 'npx hyperframes check projects/${project}' đạt 0 errors.`
    );
  }
  const code = fs.readFileSync(compilerFile, "utf8");
  if (/\/\/\s*TODO|\/\*\s*TODO|các cảnh sau tương tự|tự viết tiếp/i.test(code)) {
    throw new Error(
      `[PHASE 3 LOCK - FULL OUTPUT ENFORCEMENT]: Phát hiện comment viết tắt / placeholder ('TODO' / 'tự viết tiếp') trong 'build-index.cjs'. Cấm cắt xén mã nguồn!`
    );
  }
  checkBrandCta(project, code, `projects/${project}/build-index.cjs`);
}

function requireSpec(project) {
  const file = artifactPath(project, "specs/video-spec.json");
  const spec = JSON.parse(fs.readFileSync(file, "utf8"));
  const result = validateSpec(spec);
  if (!result.valid) throw new Error(`Invalid VideoSpec: ${JSON.stringify(result.errors)}`);
  for (const scene of spec.script.scenes) {
    for (const asset of scene.assets) {
      const assetFile = artifactPath(project, asset.path);
      if (!fs.existsSync(assetFile) || fs.statSync(assetFile).size === 0) throw new Error(`Missing asset: ${asset.path}`);
    }
  }
  return spec;
}

function requireTechnicalQa(project) {
  const file = artifactPath(project, "output/final-qc.json");
  const qc = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!qc.pass || qc.kind !== "final") throw new Error("final technical QA did not pass");
  return qc;
}

function status(project) {
  const result = evaluate(project);
  const { signatures, ...visible } = result;
  return visible;
}

export async function main(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv;
  const args = minimist(rest, { boolean: ["reviewed"] });
  if (!command || command === "help") {
    console.log("factory <doctor|status|next|record|approve|check|dirty|tts|render|package> --project <id> [options]");
    return;
  }
  if (command === "doctor" || command === "health") {
    const { runDoctor } = await import("./doctor.js");
    await runDoctor();
    return;
  }
  if (command === "start-services" || command === "start") {
    const psScript = path.join(ROOT, "core", "scripts", "factory", "start-services.ps1");
    spawnSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psScript], {
      stdio: "inherit"
    });
    return;
  }
  const project = args.project;
  projectDir(project);
  if (command === "package") {
    const { packageProject } = await import("./package.js");
    await packageProject(project);
    return;
  }
  if (command === "status") { console.log(JSON.stringify(status(project), null, 2)); return; }
  if (command === "next") { console.log(JSON.stringify({ project, next: evaluate(project).next })); return; }
  if (command === "check") {
    const result = status(project);
    console.log(JSON.stringify(result, null, 2));
    if (Object.values(result.stages).some(item => item.status === "dirty")) process.exitCode = 1;
    return;
  }
  if (command === "dirty") {
    console.log(JSON.stringify(invalidateFrom(project, String(args.stage || "").toUpperCase()).stages));
    return;
  }
  if (command === "approve") {
    const gate = String(args.gate || "").toUpperCase();
    if (gate === "GATE2") requireDesign(project);
    const result = approveGate(project, gate, args.evidence);
    console.log(JSON.stringify({ approved: gate, next: result.next }));
    return;
  }
  if (command === "record") {
    const stage = String(args.stage || "").toUpperCase();
    if (stage === "CREATIVE_DIRECTION") requireDesign(project);
    if (["STORYBOARD", "VIDEO_SPEC", "VALIDATION", "PRODUCTION"].includes(stage)) requireBlueprint(project);
    if (["VIDEO_SPEC", "VALIDATION", "PRODUCTION"].includes(stage)) {
      requireCompiler(project);
      requireSpec(project);
    }
    if (stage === "VALIDATION") {
      const checked = spawnSync(process.execPath,
        [path.join(ROOT, "core", "scripts", "validate", "index.js"), "--project", project],
        { cwd: path.join(ROOT, "core"), stdio: "inherit", timeout: 30000 });
      if (checked.status !== 0) throw new Error(`VideoSpec validation failed: ${checked.status ?? checked.error?.message}`);
    }
    if (stage === "TTS") {
      const voiceSeconds = duration(artifactPath(project, "assets/audio/narration.mp3"));
      const timing = JSON.parse(fs.readFileSync(artifactPath(project, "assets/audio/timing.json"), "utf8"));
      if (Math.abs(timing.durationMs / 1000 - voiceSeconds) > 0.1) throw new Error("TTS timing is not measured from actual audio");
      if (!Array.isArray(timing.words) || !timing.words.length || timing.words.some(word =>
        !Number.isFinite(word.startMs) || !Number.isFinite(word.durationMs) || word.durationMs <= 0)) {
        throw new Error("TTS needs measured word boundaries");
      }
    }
    if (stage === "FINAL_QA") requireTechnicalQa(project);
    const artifacts = args.artifact ? [args.artifact].flat() : [];
    const defaultEngine = stage === "FINAL_RENDER" ? (args.engine || "HYPERFRAMES") : args.engine;
    const metadata = {
      ...(args.reviewed && { reviewed: true }),
      ...(args.voice && { voice: args.voice }),
      ...(args.speed && { speed: Number(args.speed) }),
      ...(args.provider && { provider: args.provider }),
      ...(defaultEngine && { engine: defaultEngine })
    };
    const result = recordStage(project, stage, artifacts, metadata);
    console.log(JSON.stringify({ recorded: stage, next: result.next }));
    return;
  }
  if (command === "tts") {
    const { ensureCitVoiceStudio } = await import("./services.js");
    await ensureCitVoiceStudio(4000);

    const projCfg = loadProjectConfig(project);
    const resolvedVoice = args.voice ? String(args.voice).trim() : projCfg.voice;
    const resolvedSpeed = args.speed != null ? Number(args.speed) : projCfg.ttsSpeed;

    const settings = {
      voice: resolvedVoice,
      speed: resolvedSpeed,
      provider: "cit-voice-studio",
    };
    const state = readState(project);
    let current = evaluate(project, state);
    const prior = current.signatures.GATE2;
    const wantedInput = prior && stageInput(project, "TTS", state, prior, settings);
    if (current.stages.TTS.status === "complete" && state.stages.TTS?.input === wantedInput) {
      console.log(JSON.stringify({ stage: "TTS", cache: "HIT" })); return;
    }
    if (state.stages.TTS && state.stages.TTS.input !== wantedInput) {
      current = invalidateFrom(project, "TTS");
    }
    if (current.next !== "TTS") throw new Error(`Expected ${current.next} before TTS`);
    const narration = narrationFromScript(project);
    const commandArgs = [path.join(ROOT, "core", "scripts", "tts", "index.js"), "--project", project,
      "--text", narration, "--voice", resolvedVoice, "--speed", String(resolvedSpeed)];
    const result = spawnSync(process.execPath, commandArgs, { cwd: path.join(ROOT, "core"), stdio: "inherit", timeout: 600000 });
    if (result.status !== 0) throw new Error(`TTS failed with code ${result.status ?? result.error?.message}`);
    const voiceSeconds = duration(artifactPath(project, "assets/audio/narration.mp3"));
    const timingFile = artifactPath(project, "assets/audio/timing.json");
    const timing = JSON.parse(fs.readFileSync(timingFile, "utf8"));
    timing.durationSec = voiceSeconds;
    timing.durationMs = Math.round(voiceSeconds * 1000);
    timing.durationFrames = Math.ceil(voiceSeconds * 30);
    timing.measuredBy = "ffprobe";
    fs.writeFileSync(timingFile, JSON.stringify(timing, null, 2) + "\n");
    if (!Array.isArray(timing.words) || !timing.words.length) throw new Error("TTS provider returned no word boundaries");
    const recorded = recordStage(project, "TTS", [], settings);
    console.log(JSON.stringify({ stage: "TTS", cache: "MISS", next: recorded.next }));
    return;
  }
  if (command === "render") {
    const stage = "FINAL_RENDER";
    requireBlueprint(project);
    requireCompiler(project);
    requireSpec(project);
    let current = evaluate(project);
    if (current.stages[stage].status === "complete") {
      console.log(JSON.stringify({ render: "final", cache: "HIT" }));
      return;
    }
    if (current.next !== stage) {
      throw new Error(`Expected ${current.next} before ${stage}`);
    }
    process.env.FACTORY_FINAL_APPROVED = "1";
    try {
      const { renderProject } = await import("../render/index.js");
      const report = await renderProject({ project });
      const recorded = recordStage(project, stage, [], { engine: report.engine });
      console.log(JSON.stringify({ render: "final", qa: report, next: recorded.next }));
    } finally {
      delete process.env.FACTORY_FINAL_APPROVED;
    }
    return;
  }
  throw new Error(`Unknown factory command: ${command}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
