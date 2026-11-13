import fs from "node:fs";
import path from "node:path";
import { ROOT, projectDir } from "./state.js";

const DEFAULTS = Object.freeze({
  brand: "none",
  voice: "Hải Đăng",
  ttsSpeed: 1.0,
  format: "9:16",
  language: "vi"
});

const FORMATS = Object.freeze({
  "9:16": [1080, 1920],
  "16:9": [1920, 1080],
  "1:1": [1080, 1080]
});

function loadBrandProfile(brandId) {
  if (!brandId || brandId === "none") return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(brandId)) throw new Error(`Invalid brand id: ${brandId}`);
  const file = path.join(ROOT, "brand", brandId, "profile.json");
  if (!fs.existsSync(file)) {
    throw new Error(`Brand '${brandId}' không tồn tại: thiếu brand/${brandId}/profile.json (dùng "none" nếu video không cần brand).`);
  }
  const profile = JSON.parse(fs.readFileSync(file, "utf8"));
  return { id: brandId, ...profile };
}

export function loadProjectConfig(project) {
  const file = path.join(projectDir(project), "inputProps.json");
  let raw = {};
  if (fs.existsSync(file)) {
    raw = JSON.parse(fs.readFileSync(file, "utf8"));
  }
  const merged = { ...DEFAULTS };
  for (const key of Object.keys(raw)) {
    if (raw[key] !== undefined && raw[key] !== null && raw[key] !== "") merged[key] = raw[key];
  }
  // Legacy: spec.ttsSpeed
  if (raw.ttsSpeed == null && raw.spec?.ttsSpeed != null) merged.ttsSpeed = raw.spec.ttsSpeed;
  merged.ttsSpeed = Number(merged.ttsSpeed);
  if (!Number.isFinite(merged.ttsSpeed) || merged.ttsSpeed <= 0) {
    throw new Error(`ttsSpeed không hợp lệ trong projects/${project}/inputProps.json`);
  }
  const dims = FORMATS[merged.format];
  if (!dims) {
    throw new Error(`format '${merged.format}' không hỗ trợ. Chọn một trong: ${Object.keys(FORMATS).join(", ")}`);
  }
  const [width, height] = dims;
  const brandProfile = loadBrandProfile(merged.brand);
  return { ...merged, width, height, brandProfile, hasInputProps: fs.existsSync(file) };
}
