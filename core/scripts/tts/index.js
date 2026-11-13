import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { spawnSync } from "child_process";
import minimist from "minimist";
import { resolveMediaBinary } from "../factory/media.js";
import { pingHttp } from "../factory/services.js";

function convertWavToMp3(wavPath, mp3Path) {
  const ffmpegBin = resolveMediaBinary("ffmpeg");
  const res = spawnSync(ffmpegBin, [
    "-y",
    "-i", wavPath,
    "-c:a", "libmp3lame",
    "-b:a", "192k",
    "-ar", "48000",
    mp3Path
  ], { encoding: "utf8", timeout: 60000 });
  if (res.status !== 0 || !fs.existsSync(mp3Path)) {
    throw new Error(`FFmpeg WAV to MP3 conversion failed: ${(res.stderr || res.error?.message || "").slice(-500)}`);
  }
}

function measureDurationWithFfprobe(mediaPath) {
  const ffprobeBin = resolveMediaBinary("ffprobe");
  const res = spawnSync(ffprobeBin, [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    mediaPath
  ], { encoding: "utf8", timeout: 10000 });
  const dur = parseFloat((res.stdout || "").trim());
  if (Number.isFinite(dur) && dur > 0) return dur;
  return null;
}

async function generateViaCitVoiceStudio(text, voiceId = "Hải Đăng", speed = 1.0) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      text,
      voice_id: voiceId,
      speed: Number(speed) || 1.0,
      format: "wav"
    });

    const req = http.request({
      hostname: "127.0.0.1",
      port: 8001,
      path: "/api/tts/generate-with-subtitles",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      },
      timeout: 420000
    }, (res) => {
      let body = "";
      res.on("data", chunk => { body += chunk; });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const data = JSON.parse(body);
            resolve(data);
          } catch (err) {
            reject(new Error(`Invalid JSON from CIT Voice Studio: ${err.message}`));
          }
        } else {
          reject(new Error(`CIT Voice Studio error ${res.statusCode}: ${body.slice(0, 300)}`));
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Timeout calling CIT Voice Studio"));
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  const argv = minimist(process.argv.slice(2));
  const projectId = argv.project;
  const text = argv.text;
  const speed = argv.speed != null ? Number(argv.speed) : 1.0;
  
  if (!projectId || !text) {
    console.error("Usage: node index.js --project <project-id> --text \"<narration>\" [--voice <voice>] [--speed <speed>]");
    process.exit(1);
  }

  // Resolve project directory & config properly via factory state
  const { projectDir: getProjectDir } = await import("../factory/state.js");
  const { loadProjectConfig } = await import("../factory/project-config.js");
  const pDir = getProjectDir(projectId);
  const projCfg = loadProjectConfig(projectId);
  const voice = argv.voice ? String(argv.voice).trim() : projCfg.voice;
  const audioDir = path.join(pDir, "assets", "audio");
  
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const outputPath = path.join(audioDir, "narration.mp3");
  const timingPath = path.join(audioDir, "timing.json");
  const srtPath = path.join(audioDir, "subtitles.srt");

  console.log(`🎙️ [AI Audio Studio] Generating narration for project: ${projectId}...`);

  // Check CIT Voice Studio status
  const isCitOnline = (await pingHttp("http://127.0.0.1:8001", 1500)).ok;

  if (!isCitOnline) {
    console.error("❌ [CIT Voice Studio Error] CIT Voice Studio (VieNeu-TTS local :8001) đang OFFLINE!");
    console.error("   Hệ thống yêu cầu CIT Voice Studio hoạt động (không tự ý fallback sang dịch vụ khác).");
    console.error("   Vui lòng khởi động dịch vụ giọng đọc bằng: npm run services");
    process.exit(1);
  }

  console.log(`✨ Using CIT Voice Studio (VieNeu-TTS :8001 | Voice: "${voice}" 48kHz Studio | Speed: ${speed})`);

  try {
    const citRes = await generateViaCitVoiceStudio(text, voice, speed);
    const audioBytes = Buffer.from(citRes.audio_base64, "base64");
    const tempWav = path.join(audioDir, "narration.raw.wav");
    fs.writeFileSync(tempWav, audioBytes);

    // Convert WAV to MP3
    convertWavToMp3(tempWav, outputPath);
    try { fs.rmSync(tempWav); } catch {}

    // Measure true duration with FFprobe
    const measuredSec = measureDurationWithFfprobe(outputPath) || citRes.duration_seconds || 0;
    const durationMs = Math.round(measuredSec * 1000);
    const durationFrames = Math.ceil(measuredSec * 30);

    // Parse cues to word-level boundaries
    const words = [];
    const cues = Array.isArray(citRes.cues) ? citRes.cues : [];
    if (cues.length > 0) {
      for (const cue of cues) {
        const cueStartSec = Number(cue.start) || 0;
        const cueEndSec = Number(cue.end) || (cueStartSec + 1);
        const cueText = String(cue.text || "").trim().replace(/\r?\n/g, " ");
        const cueWords = cueText.split(/\s+/).filter(Boolean);
        if (!cueWords.length) continue;

        const cueDurMs = Math.max(100, Math.round((cueEndSec - cueStartSec) * 1000));
        const totalChars = cueWords.reduce((acc, w) => acc + w.length, 0) || cueWords.length;
        let currentMs = Math.round(cueStartSec * 1000);

        for (const w of cueWords) {
          const dur = Math.max(60, Math.round(cueDurMs * (w.length / totalChars)));
          words.push({
            word: w,
            startMs: currentMs,
            durationMs: dur
          });
          currentMs += dur;
        }
      }
    }

    if (citRes.srt) {
      fs.writeFileSync(srtPath, citRes.srt, "utf8");
    }

    const timingData = {
      durationSec: Number(measuredSec.toFixed(3)),
      durationMs,
      durationFrames,
      fps: 30,
      provider: "cit-voice-studio",
      voice,
      speed,
      measuredBy: "ffprobe",
      words
    };

    fs.writeFileSync(timingPath, JSON.stringify(timingData, null, 2));
    console.log(`✅ Success (CIT Voice Studio)! Saved to ${outputPath}`);
    console.log(`⏱️  Timing: ${measuredSec.toFixed(2)}s (${durationMs}ms) / ${durationFrames} frames (${words.length} words synced)`);
  } catch (citErr) {
    console.error(`❌ [CIT Synthesis Error] ${citErr.message}`);
    console.error("   Dừng quy trình do lỗi tổng hợp giọng từ CIT Voice Studio.");
    process.exit(1);
  }
}

run();
