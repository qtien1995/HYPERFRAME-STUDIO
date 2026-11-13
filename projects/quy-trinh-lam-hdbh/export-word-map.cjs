const fs = require("fs");
const path = require("path");

const timingPath = path.join(__dirname, "assets/audio/timing.json");
const outPath = path.join(__dirname, "assets/audio/word-map.txt");

const data = JSON.parse(fs.readFileSync(timingPath, "utf8"));
const words = data.words || [];
const lines = words.map((w, i) => {
  const startSec = (w.startMs / 1000).toFixed(3);
  const endSec = ((w.startMs + w.durationMs) / 1000).toFixed(3);
  return `[${i}] "${w.word}" (${startSec}s -> ${endSec}s)`;
});

fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Exported ${words.length} words to ${outPath}`);
