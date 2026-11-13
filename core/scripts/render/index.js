import fs from "node:fs";
import path from "node:path";
import { validateSpec } from "../../schemas/zod.js";
import { calculateTimelineDuration } from "../../timing/index.js";
import { artifactPath, projectDir } from "../factory/state.js";
import { duration, inspectMedia, muxAndNormalize } from "../factory/media.js";
import * as hyperframesAdapter from "../../../engines/hyperframes/adapter/index.js";

export async function renderProject({ project }) {
  if (process.env.FACTORY_FINAL_APPROVED !== "1") {
    throw new Error("Final render must be invoked through the factory CLI");
  }
  const root = projectDir(project);
  const spec = JSON.parse(fs.readFileSync(artifactPath(project, "specs/video-spec.json"), "utf8"));
  const validation = validateSpec(spec);
  if (!validation.valid) throw new Error(`Invalid VideoSpec: ${JSON.stringify(validation.errors)}`);
  const selectedEngine = "HYPERFRAMES";
  const narration = artifactPath(project, "assets/audio/narration.mp3");
  const expected = calculateTimelineDuration(spec).actualDurationMs / 1000;
  if (!expected) throw new Error("VideoSpec has no duration");
  const voiceDuration = duration(narration);
  if (voiceDuration > expected + 0.1 || expected - voiceDuration > 2.5) {
    throw new Error(`Narration ${voiceDuration}s does not match video ${expected}s`);
  }
  const outputDir = path.join(root, "output");
  fs.mkdirSync(outputDir, { recursive: true });
  const raw = path.join(outputDir, `final.${process.pid}.raw.mp4`);
  const candidate = path.join(outputDir, `final.${process.pid}.candidate.mp4`);
  const candidateSheet = path.join(outputDir, `final.${process.pid}.contact-sheet.svg`);
  const final = path.join(outputDir, "final.mp4");
  const finalSheet = path.join(outputDir, "final-contact-sheet.svg");
  const qcFile = path.join(outputDir, "final-qc.json");

  try {
    const rendered = await hyperframesAdapter.render(spec, { projectRoot: root, outputPath: raw });
    if (!rendered.success || !fs.existsSync(raw) || fs.statSync(raw).size === 0) {
      throw new Error(rendered.error || "HyperFrames adapter returned success without MP4");
    }
    muxAndNormalize(raw, narration, candidate, expected);
    const qc = inspectMedia(candidate, narration, spec, candidateSheet);
    if (!qc.pass) throw new Error(`Technical QA failed: ${qc.failures.join(", ")}`);
    for (const [source, destination] of [[candidate, final], [candidateSheet, finalSheet]]) {
      if (fs.existsSync(destination)) {
        try {
          fs.rmSync(destination);
          fs.renameSync(source, destination);
        } catch {
          fs.copyFileSync(source, destination);
          try { fs.rmSync(source); } catch {}
        }
      } else {
        fs.renameSync(source, destination);
      }
    }
    qc.kind = "final";
    fs.writeFileSync(qcFile, JSON.stringify(qc, null, 2) + "\n");
    return { success: true, engine: selectedEngine, final, qcFile, qc };
  } finally {
    for (const temp of [raw, candidate, candidateSheet]) {
      if (fs.existsSync(temp)) {
        try { fs.rmSync(temp); } catch {}
      }
    }
  }
}
