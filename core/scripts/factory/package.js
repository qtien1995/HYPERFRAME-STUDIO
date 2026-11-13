import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { projectDir } from "./state.js";
import { loadProjectConfig } from "./project-config.js";
import { resolveMediaBinary } from "./media.js";

function extractFrame(ffmpegBin, videoFile, timestampSec, outputFile) {
  const res = spawnSync(ffmpegBin, [
    "-y",
    "-ss", String(timestampSec),
    "-i", videoFile,
    "-vframes", "1",
    "-q:v", "2",
    outputFile
  ], { encoding: "utf8", timeout: 30000 });
  return res.status === 0 && fs.existsSync(outputFile);
}

export async function packageProject(projectId) {
  const pDir = projectDir(projectId);
  const finalVideo = path.join(pDir, "output", "final.mp4");
  if (!fs.existsSync(finalVideo)) {
    throw new Error(`Cannot package: missing output/final.mp4 in project ${projectId}. Run final render first.`);
  }

  const distDir = path.join(pDir, "output", "dist");
  const thumbDir = path.join(distDir, "thumbnails");
  fs.mkdirSync(thumbDir, { recursive: true });

  const ffmpegBin = resolveMediaBinary("ffmpeg");

  let durationSec = 30;
  const timingFile = path.join(pDir, "assets", "audio", "timing.json");
  if (fs.existsSync(timingFile)) {
    try {
      const timing = JSON.parse(fs.readFileSync(timingFile, "utf8"));
      if (timing.durationSec) durationSec = timing.durationSec;
    } catch {}
  }

  let sbScenes = [];
  const storyboardFile = path.join(pDir, "storyboard.json");
  if (fs.existsSync(storyboardFile)) {
    try {
      const sb = JSON.parse(fs.readFileSync(storyboardFile, "utf8"));
      if (Number(sb.totalDurationSec) > 0) durationSec = Number(sb.totalDurationSec);
      if (Array.isArray(sb.scenes)) sbScenes = sb.scenes;
    } catch {}
  }

  let hookTime = Math.min(1.5, Math.max(0.3, durationSec * 0.05));
  let climaxTime = durationSec * 0.45;
  let outroTime = Math.max(durationSec - 2.0, durationSec * 0.85);

  if (sbScenes.length > 0) {
    const first = sbScenes[0];
    const mid = sbScenes[Math.floor(sbScenes.length / 2)];
    const last = sbScenes[sbScenes.length - 1];
    const sceneMid = (s, ratio = 0.55) => {
      const st = Number(s.start ?? s.startSec ?? (s.startMs != null ? s.startMs / 1000 : 0));
      const du = Number(s.dur ?? s.duration ?? s.durationSec ?? (s.durationMs != null ? s.durationMs / 1000 : 0));
      return Math.max(0.2, Math.min(durationSec - 0.2, st + du * ratio));
    };
    hookTime = sceneMid(first, 0.5);
    climaxTime = sceneMid(mid, 0.55);
    outroTime = sceneMid(last, 0.65);
  }

  const thumbs = [
    { name: "thumb-hook.jpg", time: hookTime },
    { name: "thumb-climax.jpg", time: climaxTime },
    { name: "thumb-outro.jpg", time: outroTime }
  ];

  for (const t of thumbs) {
    const outPath = path.join(thumbDir, t.name);
    extractFrame(ffmpegBin, finalVideo, t.time, outPath);
  }

  let beatsData = [];
  const beatsFile = path.join(pDir, "beats.json");
  if (fs.existsSync(beatsFile)) {
    try { beatsData = JSON.parse(fs.readFileSync(beatsFile, "utf8")); } catch {}
  }

  const projCfg = loadProjectConfig(projectId);
  const userBrand = projCfg.brandProfile || {};

  let displayTitle = projCfg.title || "";
  if (!displayTitle) {
    const specFile = path.join(pDir, "specs", "video-spec.json");
    if (fs.existsSync(specFile)) {
      try {
        const sp = JSON.parse(fs.readFileSync(specFile, "utf8"));
        if (sp.project?.title && sp.project.title !== projectId) displayTitle = sp.project.title;
      } catch {}
    }
  }
  if (!displayTitle) {
    displayTitle = projectId.replace(/[-_]/g, " ").toUpperCase();
  }

  const brandHashtags = Array.isArray(userBrand.hashtags) ? userBrand.hashtags : [];
  const slugTag = projectId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  const metadata = {
    projectId,
    format: projCfg.format,
    generatedAt: new Date().toISOString(),
    creator: userBrand.creatorName || undefined,
    brand: userBrand.brandName || undefined,
    titles: [
      displayTitle,
      `Giải Mã Toàn Bộ: ${displayTitle}`,
      `Sự Thật Ít Ai Biết Về: ${displayTitle}`
    ],
    description: `${displayTitle} — Video giải thích trực quan, cô đọng và dễ hiểu.${userBrand.cta ? `\n\n${userBrand.cta}` : ""}`,
    hashtags: [
      slugTag ? `#${slugTag}` : null,
      userBrand.handle ? `#${userBrand.handle.replace(/[@#\s]/g, "")}` : null,
      ...brandHashtags,
      "#kienthuc",
      "#hocmoingay",
      "#xuhuong"
    ].filter(Boolean),
    chapters: sbScenes.length > 0 ? sbScenes.map((s, idx) => ({
      index: idx + 1,
      title: s.act || beatsData[idx]?.meaning || beatsData[idx]?.title || `Phần ${idx + 1}`,
      approxTimeSec: Math.round(Number(s.start ?? s.startSec ?? (s.startMs != null ? s.startMs / 1000 : 0)))
    })) : Array.isArray(beatsData) && beatsData.length > 0 ? beatsData.map((b, idx) => ({
      index: idx + 1,
      title: b.meaning || b.title || `Phần ${idx + 1}`,
      approxTimeSec: Math.round((idx / beatsData.length) * durationSec)
    })) : [
      { index: 1, title: "Hook & Đặt vấn đề", approxTimeSec: 0 },
      { index: 2, title: "Giải mã cốt lõi", approxTimeSec: Math.round(durationSec * 0.3) },
      { index: 3, title: "Tổng kết", approxTimeSec: Math.round(durationSec * 0.8) }
    ]
  };

  fs.writeFileSync(path.join(distDir, "metadata.json"), JSON.stringify(metadata, null, 2) + "\n");

  const captionText = `${metadata.titles[0]}\n\n${metadata.description}\n\n${metadata.hashtags.join(" ")}\n`;
  fs.writeFileSync(path.join(distDir, "caption.txt"), captionText);

  console.log("==================================================");
  console.log(`   PACKAGING COMPLETE FOR PROJECT: ${projectId}`);
  console.log("==================================================");
  console.log(`📁 Distribution folder: ${distDir}`);
  console.log(`🖼️  Thumbnails generated in: output/dist/thumbnails/`);
  console.log(`📋 Metadata & SEO titles: output/dist/metadata.json`);
  console.log(`📝 Ready-to-paste caption: output/dist/caption.txt`);
  console.log("==================================================\n");

  return { distDir, metadata };
}
