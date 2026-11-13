import test, { after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { validateSpec } from "../schemas/zod.js";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "factory-test-"));
process.env.FACTORY_ROOT = root;
const state = await import("../scripts/factory/state.js");
const { main } = await import("../scripts/factory/index.js");
const { muxAndNormalize } = await import("../scripts/factory/media.js");
const { loadProjectConfig } = await import("../scripts/factory/project-config.js");

// Seed brand/tien-duong/profile.json inside isolated test root
const brandDir = path.join(root, "brand", "tien-duong");
fs.mkdirSync(brandDir, { recursive: true });
fs.writeFileSync(path.join(brandDir, "profile.json"), JSON.stringify({
  id: "tien-duong",
  creatorName: "Tiến Dương",
  cta: "Nhắn 'KẾ HOẠCH'",
  forbiddenCtaPatterns: ["nhắn\\s*(chữ)?\\s*(soi|trụ|nịt|phanh|phao)\\b"]
}));
after(() => fs.rmSync(root, { recursive: true, force: true }));

function put(id, relative, content = "x") {
  const file = state.artifactPath(id, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

const VALID_DESIGN = `# DESIGN SYSTEM SPECIFICATION
:root {
  --bg-stage: #F4EFE6;
  --ink-primary: #1F1D1A;
}
Font: Be Vietnam Pro (400, 500, 700, 800, 900).
Procedural Canvas rng(seed) tactile surface and Zero Dead Frame (#dust .mote + #cam scale 1 -> 1.045).
CTA chuẩn: Nhắn 'KẾ HOẠCH' để nhận bản phân tích rủi ro và giải pháp tài chính vững bền.
`.repeat(3);

const VALID_BLUEPRINT = `# PRODUCTION BLUEPRINT
1. Word Map & Scene Anchors: anchor(0, "Xin")
2. Palette & Tactile Canvas: :root { --bg-stage: #F4EFE6; } rng(20261109)
3. 3-Layer DOM/SVG Architecture
4. Word-Synced GSAP Choreography: T(0) -> E(1) with back.out(1.7) and power2.inOut. Nhắn 'KẾ HOẠCH'.
`.repeat(5);

const VALID_COMPILER = `const fs = require("fs");
// Full Output V4 Compiler
function anchor(idx, expect) { return 0; }
function T(i) { return 0; }
function rng(seed) { return () => 0.5; }
// Generate index.html with :root --bg-stage: #F4EFE6 and Nhắn 'KẾ HOẠCH'
`.repeat(6);

const VALID_HTML = `<!doctype html><html lang="vi"><head><style>:root { --bg-stage: #F4EFE6; }</style></head><body><div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-duration="1"></div></body></html>`.repeat(6);

function fixture(id) {
  put(id, "script.md", "# Narration\nXin chào.\n");
  put(id, "beats.json", '[{"meaning":"hi","visualAction":"reveal"}]');
  put(id, "creative-direction.md", "direction");
  put(id, "DESIGN.md", VALID_DESIGN);
  put(id, "PRODUCTION-BLUEPRINT.md", VALID_BLUEPRINT);
  put(id, "build-index.cjs", VALID_COMPILER);
  put(id, "index.html", VALID_HTML);
  put(id, "assets/audio/narration.mp3", "fake-audio");
  put(id, "assets/audio/timing.json", '{"durationMs":1000}');
  put(id, "storyboard.json", '{"scenes":[{"id":"s1","start":0,"dur":1}]}');
  put(id, "specs/video-spec.json", JSON.stringify({
    schemaVersion: "0.1",
    project: { id, title: "test", version: 1 },
    format: { aspectRatio: "9:16", width: 1080, height: 1920, targetDurationMs: 1000 },
    content: { coreMessage: "test", audience: "test", tone: "test", language: "vi" },
    script: {
      narration: "Xin chào.",
      scenes: [{
        id: "s1",
        purpose: "test",
        narration: "Xin chào.",
        durationMs: 1000,
        visualIntent: { description: "test", layout: "centered" },
        motionIntent: [],
        assets: []
      }]
    }
  }));
  put(id, "output/final.mp4", "final");
  put(id, "output/final-qc.json", '{"pass":true,"kind":"final"}');
  put(id, "output/final-contact-sheet.svg", "image");
  put(id, "qc.md", "Reviewed");
}

function complete(id) {
  fixture(id);
  state.recordStage(id, "SCRIPT", []);
  state.recordStage(id, "BEATS", []);
  state.approveGate(id, "GATE1", "user approved script and beats");
  state.recordStage(id, "CREATIVE_DIRECTION", []);
  state.approveGate(id, "GATE2", "user selected direction");
  state.recordStage(id, "TTS", [], { voice: "Hải Đăng", speed: 1.0, provider: "cit-voice-studio" });
  state.recordStage(id, "STORYBOARD", []);
  state.recordStage(id, "VIDEO_SPEC", []);
  state.recordStage(id, "VALIDATION", []);
  state.recordStage(id, "PRODUCTION", []);
  state.recordStage(id, "FINAL_RENDER", [], { engine: "HYPERFRAMES" });
  state.recordStage(id, "FINAL_QA", ["qc.md"], { reviewed: true });
  state.recordStage(id, "DONE", ["output/final.mp4"]);
}

test("Gate 1 requires both script and beats; Gate 2 requires CREATIVE_DIRECTION", () => {
  const id = "gates";
  fixture(id);
  assert.throws(() => state.approveGate(id, "GATE1", "yes"), /Expected SCRIPT/);
  state.recordStage(id, "SCRIPT", []);
  assert.throws(() => state.approveGate(id, "GATE1", "yes"), /Expected BEATS/);
  state.recordStage(id, "BEATS", []);
  state.approveGate(id, "GATE1", "user approved both");
  assert.equal(state.evaluate(id).next, "CREATIVE_DIRECTION");
  assert.throws(() => state.approveGate(id, "GATE2", "yes"), /Expected CREATIVE_DIRECTION/);
});

test("DONE becomes dirty when script, asset, or MP4 changes", () => {
  for (const [id, changed, firstDirty] of [
    ["script_change", "script.md", "SCRIPT"],
    ["asset_change", "assets/extra.png", "FINAL_RENDER"],
    ["missing_mp4", "output/final.mp4", "FINAL_RENDER"]
  ]) {
    complete(id);
    assert.equal(state.evaluate(id).done, true);
    if (id === "missing_mp4") fs.rmSync(state.artifactPath(id, changed));
    else put(id, changed, "changed");
    const checked = state.evaluate(id);
    assert.equal(checked.done, false);
    assert.equal(checked.next, firstDirty);
    assert.equal(checked.stages.DONE.status, "dirty");
  }
});

test("legacy DONE is never trusted and is backed up on first write", () => {
  const id = "legacy";
  fixture(id);
  put(id, "state.json", '{"schemaVersion":"0.1","stages":{"DONE":{"status":"complete"}}}');
  assert.equal(state.evaluate(id).needsReview, true);
  assert.equal(state.evaluate(id).next, "SCRIPT");
  state.recordStage(id, "SCRIPT", []);
  assert.ok(fs.existsSync(state.artifactPath(id, "state.v0.1.json")));
  assert.equal(state.evaluate(id).next, "BEATS");
});

test("missing render output fails, and final render is blocked before upstream phases", async () => {
  assert.throws(() => muxAndNormalize("missing.mp4", "missing.mp3", "out.mp4", 1), /no MP4/);
  fixture("no_gates");
  await assert.rejects(main(["render", "--project", "no_gates"]), /Expected SCRIPT/);
});

test("Multi-style freedom: dark background and custom fonts pass Gate 2; brand CTA rules apply per-project", async () => {
  const id = "multi_style";
  fixture(id);
  state.recordStage(id, "SCRIPT", []);
  state.recordStage(id, "BEATS", []);
  state.approveGate(id, "GATE1", "approved");

  // 1. Dark cinematic background without 'Be Vietnam Pro' is accepted
  const darkDesign = `# DESIGN SYSTEM SPECIFICATION
:root {
  --bg-stage: #0A0F1D;
  --ink-primary: #F1F5F9;
}
Font: Space Grotesk (700, 800).
Cinematic dark documentary world with spotlight and living diagrams.
`.repeat(4);
  put(id, "DESIGN.md", darkDesign);
  await main(["record", "--project", id, "--stage", "CREATIVE_DIRECTION"]);
  await main(["approve", "--project", id, "--gate", "GATE2", "--evidence", "approved dark theme"]);
  assert.equal(state.evaluate(id).next, "TTS");

  // 2. When brand is 'none' (default), metaphor phrases like 'Nhắn chữ SOI' are NOT blocked
  const idNoBrand = "cta_no_brand";
  fixture(idNoBrand);
  state.recordStage(idNoBrand, "SCRIPT", []);
  state.recordStage(idNoBrand, "BEATS", []);
  state.approveGate(idNoBrand, "GATE1", "approved");
  put(idNoBrand, "DESIGN.md", darkDesign + "\nNhắn chữ SOI ngay!");
  await main(["record", "--project", idNoBrand, "--stage", "CREATIVE_DIRECTION"]);
  assert.equal(state.evaluate(idNoBrand).next, "GATE2");

  // 3. When brand is 'tien-duong', forbidden metaphor CTA in DESIGN.md IS rejected
  const idBrand = "cta_tien_duong";
  fixture(idBrand);
  put(idBrand, "inputProps.json", JSON.stringify({ brand: "tien-duong" }));
  state.recordStage(idBrand, "SCRIPT", []);
  state.recordStage(idBrand, "BEATS", []);
  state.approveGate(idBrand, "GATE1", "approved");
  put(idBrand, "DESIGN.md", darkDesign + "\nNhắn chữ SOI ngay!");
  await assert.rejects(main(["record", "--project", idBrand, "--stage", "CREATIVE_DIRECTION"]), /BRAND CTA VIOLATION/);
});

test("artifact paths cannot escape a project", () => {
  assert.throws(() => state.artifactPath("gates", "../outside"), /escapes/);
  assert.throws(() => state.projectDir("../outside"), /Invalid project id/);
});

test("TTS source keeps multiline narration and render cache notices custom HTML & compiler", () => {
  const id = "narration";
  fixture(id);
  put(id, "script.md", "# Narration\nDòng một.\nDòng hai.\n# Beats\nOther text\n");
  assert.equal(state.narrationFromScript(id), "Dòng một.\nDòng hai.");
  const before = state.renderInput(id);
  put(id, "index.html", VALID_HTML + "<!-- updated -->");
  assert.notEqual(state.renderInput(id), before);
});

test("completed final render is a cache hit without calling the renderer", async () => {
  const id = "cache_hit";
  complete(id);
  await main(["render", "--project", id]);
  assert.equal(state.evaluate(id).done, true);
});

test("loadProjectConfig resolves defaults, formats (9:16, 16:9, 1:1), voice, and brand profiles", () => {
  const idDef = "cfg_default";
  fixture(idDef);
  const cfg0 = loadProjectConfig(idDef);
  assert.equal(cfg0.brand, "none");
  assert.equal(cfg0.brandProfile, null);
  assert.equal(cfg0.voice, "Hải Đăng");
  assert.equal(cfg0.ttsSpeed, 1.0);
  assert.equal(cfg0.format, "9:16");
  assert.equal(cfg0.width, 1080);
  assert.equal(cfg0.height, 1920);

  const id169 = "cfg_169";
  fixture(id169);
  put(id169, "inputProps.json", JSON.stringify({ format: "16:9", voice: "Minh Quang", ttsSpeed: 1.05, brand: "tien-duong" }));
  const cfg1 = loadProjectConfig(id169);
  assert.equal(cfg1.format, "16:9");
  assert.equal(cfg1.width, 1920);
  assert.equal(cfg1.height, 1080);
  assert.equal(cfg1.voice, "Minh Quang");
  assert.equal(cfg1.ttsSpeed, 1.05);
  assert.equal(cfg1.brandProfile?.creatorName, "Tiến Dương");

  const idBadFmt = "cfg_bad_fmt";
  fixture(idBadFmt);
  put(idBadFmt, "inputProps.json", JSON.stringify({ format: "4:3" }));
  assert.throws(() => loadProjectConfig(idBadFmt), /không hỗ trợ/);

  const idBadBrand = "cfg_bad_brand";
  fixture(idBadBrand);
  put(idBadBrand, "inputProps.json", JSON.stringify({ brand: "unknown-brand" }));
  assert.throws(() => loadProjectConfig(idBadBrand), /không tồn tại/);
});

test("validateSpec supports open-ended scene counts and durations driven by content depth", () => {
  for (const [count, totalMs] of [[3, 25000], [12, 120000], [24, 480000]]) {
    const durMs = Math.floor(totalMs / count);
    const scenes = Array.from({ length: count }, (_, i) => ({
      id: `s${i + 1}`,
      purpose: `Act scene ${i + 1}`,
      narration: "",
      startMs: i * durMs,
      durationMs: durMs,
      visualIntent: { description: `Scene ${i + 1}`, layout: "centered" },
      motionIntent: [{ type: "fade-in", subject: `s${i + 1}` }],
      assets: []
    }));
    const res = validateSpec({
      schemaVersion: "0.1",
      project: { id: `flex-${count}`, title: `Flex ${count}`, version: 1 },
      format: { aspectRatio: "9:16", width: 1080, height: 1920, fpsPreference: 30, targetDurationMs: totalMs },
      content: { coreMessage: "Flexible", audience: "General", tone: "Editorial", language: "vi" },
      script: { narration: "Test", scenes }
    });
    assert.equal(res.valid, true, `Expected ${count} scenes / ${totalMs}ms to validate`);
  }
});
