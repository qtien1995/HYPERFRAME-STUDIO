/**
 * Keyword-to-Asset Mapper for Auto-Footage & HyperFrames.
 * Tự động phân tích transcript / word timestamps để tìm các từ khóa trọng tâm
 * (Thương hiệu, thuật ngữ, số liệu, cột mốc) và ánh xạ timecode để chèn Overlays/HandDrawn SVG.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Danh mục thực thể mặc định đa chủ đề (khoa học, lịch sử, công nghệ, kinh tế, tài chính)
export const DEFAULT_KEYWORD_RULES = [
  {
    regex: /(\d+(\.\d+)?%|\d+\s*(tỷ|triệu|nghìn|năm|thế kỷ|km|m|giây|ngày|tháng))/i,
    type: "metric_highlight",
    category: "numbers_and_time",
  },
  {
    regex: /(nguyên lý|cơ chế|quy luật|bản chất|hệ thống|thuật toán|cấu trúc)/i,
    type: "living_mechanism_trigger",
    category: "mechanism",
  },
  {
    regex: /(lạm phát|lãi suất|tỷ giá|gdp|dòng tiền|rủi ro|thanh khoản|hợp đồng)/i,
    type: "stat_callout",
    category: "economics_finance",
  },
  {
    regex: /(chú ý|quan trọng|cảnh báo|lưu ý|bí mật|sự thật|ngược lại|nhưng)/i,
    type: "handdrawn_circle",
    category: "attention_pivot",
  },
];

/**
 * Phân tích danh sách từ vựng có timestamp
 * @param {Array<{word: string, start?: number, end?: number, startMs?: number, durationMs?: number}>} wordsInput
 * @param {Array} customRules
 */
export function mapKeywordsToOverlays(wordsInput, customRules = []) {
  const words = Array.isArray(wordsInput) ? wordsInput : (wordsInput?.words || []);
  const rules = [...DEFAULT_KEYWORD_RULES, ...customRules];
  const overlays = [];

  for (let i = 0; i < words.length; i++) {
    const item = words[i];
    const text = String(item.word || "").trim();
    const startSec = item.start ?? (item.startMs != null ? item.startMs / 1000 : 0);
    const endSecRaw = item.end ?? (item.durationMs != null ? startSec + item.durationMs / 1000 : startSec + 0.3);

    for (const rule of rules) {
      if (rule.regex.test(text)) {
        overlays.push({
          matchedText: text,
          type: rule.type,
          category: rule.category,
          startSec,
          endSec: Math.max(endSecRaw + 2.5, startSec + 3.0),
          frameStart: Math.round(startSec * 30),
          frameEnd: Math.round((startSec + 3.0) * 30),
        });
        break;
      }
    }
  }

  return overlays;
}

// CLI usage
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log("Usage: node core/scripts/footage/keyword-mapper.js <words_json_file> <output_plan_file>");
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1];

  try {
    const rawData = fs.readFileSync(inputFile, "utf8");
    const words = JSON.parse(rawData);
    const plan = mapKeywordsToOverlays(words);

    fs.writeFileSync(outputFile, JSON.stringify(plan, null, 2) + "\n", "utf8");
    console.log(`[✓] Đã tạo plan ánh xạ ${plan.length} điểm chạm thị giác -> ${outputFile}`);
  } catch (err) {
    console.error(`[!] Lỗi xử lý keyword mapping: ${err.message}`);
    process.exit(1);
  }
}
