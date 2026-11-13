import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./state.js";

console.log(`\n🧹 [HyperFrame Studio V4] Bắt đầu dọn dẹp các tệp nháp tạm (.tmp, .raw.mp4)...`);

let deletedCount = 0;
let freedBytes = 0;

function cleanDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(dirPath, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === ".runtime") {
          try {
            const sz = getDirSize(fullPath);
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log(`  -> Xóa thư mục runtime: ${fullPath}`);
            deletedCount++;
            freedBytes += sz;
          } catch (e) {
            console.warn(`  ! Không thể xóa ${fullPath}: ${e.message}`);
          }
        } else if (!["node_modules", ".git", ".archive"].includes(ent.name)) {
          cleanDir(fullPath);
        }
      } else {
        const name = ent.name.toLowerCase();
        if (
          name.endsWith(".tmp") ||
          name.endsWith(".tmp.mp4") ||
          name.endsWith(".raw.mp4") ||
          name.endsWith(".candidate.mp4") ||
          name.includes(".candidate.") ||
          name.endsWith(".tmp.svg")
        ) {
          try {
            const sz = fs.statSync(fullPath).size;
            fs.rmSync(fullPath, { force: true });
            console.log(`  -> Xóa file tạm: ${fullPath} (${(sz / 1024).toFixed(1)} KB)`);
            deletedCount++;
            freedBytes += sz;
          } catch (e) {
            console.warn(`  ! Không thể xóa file ${fullPath}: ${e.message}`);
          }
        }
      }
    }
  } catch {
    // Ignore inaccessible folders
  }
}

function getDirSize(p) {
  let total = 0;
  try {
    for (const file of fs.readdirSync(p, { recursive: true })) {
      const fp = path.join(p, file);
      if (fs.statSync(fp).isFile()) total += fs.statSync(fp).size;
    }
  } catch {}
  return total;
}

function cleanProjectArtifacts(projectsRoot) {
  if (!fs.existsSync(projectsRoot)) return;
  for (const ent of fs.readdirSync(projectsRoot, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const pDir = path.join(projectsRoot, ent.name);

    // 1. Giữ lại duy nhất bản log check mới nhất trong .hyperframes/artifacts/checks/
    const checksDir = path.join(pDir, ".hyperframes", "artifacts", "checks");
    if (fs.existsSync(checksDir)) {
      const checkFiles = fs.readdirSync(checksDir)
        .filter(f => f.endsWith(".json"))
        .map(f => {
          const fp = path.join(checksDir, f);
          const stat = fs.statSync(fp);
          return { name: f, fullPath: fp, mtimeMs: stat.mtimeMs, size: stat.size };
        })
        .sort((a, b) => b.mtimeMs - a.mtimeMs);
      for (const stale of checkFiles.slice(1)) {
        try {
          fs.rmSync(stale.fullPath, { force: true });
          deletedCount++;
          freedBytes += stale.size;
          console.log(`  -> Xóa check log cũ: ${stale.fullPath}`);
        } catch {}
      }
    }

    // 2. Trong output/storyboard-check/, xóa các frame kiểu cũ (frame_10pct_*) nếu đã có frame chuẩn V4 (frame_00_hook_*),
    // và với mỗi chỉ số cảnh (frame_00_*, frame_01_*...) chỉ giữ bản mới nhất.
    const sbDir = path.join(pDir, "output", "storyboard-check");
    if (fs.existsSync(sbDir)) {
      const sbFiles = fs.readdirSync(sbDir).filter(f => f.endsWith(".png"));
      const hasV4Frames = sbFiles.some(f => /^frame_\d{2}_/i.test(f));
      if (hasV4Frames) {
        for (const legacy of sbFiles.filter(f => /^frame_\d+pct_/i.test(f))) {
          const fp = path.join(sbDir, legacy);
          try {
            const sz = fs.statSync(fp).size;
            fs.rmSync(fp, { force: true });
            deletedCount++;
            freedBytes += sz;
            console.log(`  -> Xóa frame % kiểu cũ: ${fp}`);
          } catch {}
        }
      }
      const groups = new Map();
      for (const f of fs.readdirSync(sbDir).filter(x => x.endsWith(".png"))) {
        const m = f.match(/^(frame_\d{2}_[a-zA-Z0-9_-]+)_[\d.]+s\.png$/i) || f.match(/^(frame_\d+pct)_[\d.]+s\.png$/i);
        if (!m) continue;
        const key = m[1].toLowerCase();
        const fp = path.join(sbDir, f);
        const stat = fs.statSync(fp);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push({ fullPath: fp, mtimeMs: stat.mtimeMs, size: stat.size });
      }
      for (const list of groups.values()) {
        list.sort((a, b) => b.mtimeMs - a.mtimeMs);
        for (const stale of list.slice(1)) {
          try {
            fs.rmSync(stale.fullPath, { force: true });
            deletedCount++;
            freedBytes += stale.size;
            console.log(`  -> Xóa frame storyboard trùng lặp cũ: ${stale.fullPath}`);
          } catch {}
        }
      }
    }

    // 3. Dọn các thư mục tạm .vtest-sampling-* trong output/
    const outDir = path.join(pDir, "output");
    if (fs.existsSync(outDir)) {
      for (const item of fs.readdirSync(outDir, { withFileTypes: true })) {
        if (item.isDirectory() && item.name.startsWith(".vtest-sampling-")) {
          const full = path.join(outDir, item.name);
          const sz = getDirSize(full);
          try {
            fs.rmSync(full, { recursive: true, force: true });
            deletedCount++;
            freedBytes += sz;
            console.log(`  -> Xóa thư mục test tạm: ${full}`);
          } catch {}
        }
      }
    }
  }
}

cleanDir(path.join(ROOT, "projects"));
cleanProjectArtifacts(path.join(ROOT, "projects"));

console.log(`\n============================================================`);
console.log(`✅ HOÀN TẤT DỌN DẸP!`);
console.log(`   - Tổng số file/thư mục tạm đã dọn: ${deletedCount}`);
console.log(`   - Dung lượng giải phóng: ${(freedBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`============================================================\n`);
