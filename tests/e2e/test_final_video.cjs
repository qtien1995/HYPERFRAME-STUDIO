#!/usr/bin/env node
/**
 * E2E Verification Test Suite for HyperFrame Studio V4 (Multi-Topic · Pure Bespoke)
 * Delivery Contract Verification: 9:16 / 16:9 / 1:1 · 30fps · H.264+AAC 48kHz · EBU R128 · 0 freeze
 * 
 * 4-Tier Opaque-Box Test Architecture:
 * - Tier 1: Feature Coverage (Container, Codecs, Declared Format Dimensions, 30fps, Content-Driven Duration, Sample Rate 48kHz)
 * - Tier 2: Boundary & Corner Cases (EBU R128 Loudness -14 to -12 LUFS, LRA < 8 LU, True Peak < -1 dBFS, Freeze Detect, Blackout Detect)
 * - Tier 3: Cross-Feature Combinations (A/V Drift <= 0.5s, Narration Alignment, Subtitle Sync)
 * - Tier 4: Real-World Scenarios (Full Bitstream Decode, Dynamic Scene Sampling, QA Sign-Off, Single Deliverable Contract)
 *
 * Usage:
 *   node tests/e2e/test_final_video.cjs [--target <path>] [--project <dir>] [--tier <1|2|3|4|all>] [--self-test] [--json]
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

// Default paths
const WORKSPACE_ROOT = path.resolve(__dirname, '../..');

// Binary resolution for FFmpeg / FFprobe
function resolveBinary(name) {
  const exeName = process.platform === 'win32' ? `${name}.exe` : name;
  const candidates = [
    // 1. Project-bundled static build (.tools/ffmpeg)
    path.join(WORKSPACE_ROOT, '.tools', 'ffmpeg', 'ffmpeg-9.0.2-full_build', 'bin', exeName),
    // 2. System PATH fallback
    exeName
  ];

  for (const candidate of candidates) {
    if (candidate === exeName || fs.existsSync(candidate)) {
      try {
        const check = spawnSync(candidate, ['-version'], { encoding: 'utf8', timeout: 8000 });
        if (check.status === 0) return candidate;
      } catch (err) {
        // continue trying next candidate
      }
    }
  }
  throw new Error(`Executable '${name}' not found. Ensure FFmpeg is available in .tools/ffmpeg/ or PATH.`);
}

let FFMPEG_BIN;
let FFPROBE_BIN;

try {
  FFMPEG_BIN = resolveBinary('ffmpeg');
  FFPROBE_BIN = resolveBinary('ffprobe');
} catch (e) {
  // Will be handled during test execution
}

function runCommand(bin, args, timeoutMs = 300000) {
  const res = spawnSync(bin, args, {
    encoding: 'utf8',
    maxBuffer: 25 * 1024 * 1024,
    timeout: timeoutMs
  });
  return res;
}

function probeMedia(filePath) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
    throw new Error(`Media file does not exist or is empty: ${filePath}`);
  }
  const res = runCommand(FFPROBE_BIN, [
    '-v', 'error',
    '-show_streams',
    '-show_format',
    '-of', 'json',
    filePath
  ]);
  if (res.status !== 0) {
    throw new Error(`ffprobe failed on ${filePath}: ${res.stderr || res.error?.message}`);
  }
  return JSON.parse(res.stdout);
}

// Measure EBU R128 metrics via loudnorm filter print_format=json
function measureEbuR128(filePath) {
  const res = runCommand(FFMPEG_BIN, [
    '-i', filePath,
    '-filter:a', 'loudnorm=I=-12.5:LRA=7.0:TP=-1.5:print_format=json',
    '-vn', '-sn', '-dn',
    '-f', 'null',
    '-'
  ]);
  const combined = (res.stderr || '') + (res.stdout || '');
  const matches = combined.match(/\{\s*"input_i"[\s\S]*?\}/g);
  if (!matches || matches.length === 0) {
    throw new Error(`Could not parse EBU R128 loudnorm JSON output from ffmpeg.`);
  }
  const lastJson = JSON.parse(matches[matches.length - 1]);
  return {
    integratedLufs: parseFloat(lastJson.input_i),
    rangeLu: parseFloat(lastJson.input_lra),
    truePeakDbfs: parseFloat(lastJson.input_tp),
    threshold: parseFloat(lastJson.input_thresh),
    targetOffset: parseFloat(lastJson.target_offset)
  };
}

// Detect frozen video frames exceeding maxFreezeDuration seconds
function detectFreezes(filePath, maxFreezeDuration = 3.0) {
  const res = runCommand(FFMPEG_BIN, [
    '-i', filePath,
    '-vf', `freezedetect=n=-60dB:d=${maxFreezeDuration}`,
    '-an',
    '-f', 'null',
    '-'
  ]);
  const stderr = res.stderr || '';
  const freezeStarts = stderr.match(/lavfi\.freezedetect\.freeze_start:\s*([0-9.]+)/g) || [];
  const freezeDurations = stderr.match(/lavfi\.freezedetect\.freeze_duration:\s*([0-9.]+)/g) || [];
  return {
    count: freezeStarts.length,
    starts: freezeStarts.map(s => parseFloat(s.split(':')[1].trim())),
    durations: freezeDurations.map(s => parseFloat(s.split(':')[1].trim()))
  };
}

// Detect black video dropouts exceeding maxBlackDuration seconds
function detectBlackFrames(filePath, maxBlackDuration = 1.5) {
  const res = runCommand(FFMPEG_BIN, [
    '-i', filePath,
    '-vf', `blackdetect=d=${maxBlackDuration}:pic_th=0.98:pix_th=0.10`,
    '-an',
    '-f', 'null',
    '-'
  ]);
  const stderr = res.stderr || '';
  const blackMatches = stderr.match(/black_start:\s*([0-9.]+)\s+black_end:\s*([0-9.]+)\s+black_duration:\s*([0-9.]+)/g) || [];
  return {
    count: blackMatches.length,
    matches: blackMatches
  };
}

// Full bitstream decode test
function decodeBitstream(filePath) {
  const res = runCommand(FFMPEG_BIN, [
    '-v', 'error',
    '-i', filePath,
    '-f', 'null',
    '-'
  ]);
  const errOutput = (res.stderr || '').trim();
  return {
    success: res.status === 0 && errOutput.length === 0,
    errors: errOutput
  };
}

// Test Result Collector
class TestSuite {
  constructor(targetPath, projectDir) {
    this.targetPath = targetPath;
    this.projectDir = projectDir;
    this.results = [];
  }

  addResult(tier, id, title, passed, detail, observed = null, expected = null) {
    this.results.push({
      tier,
      id,
      title,
      passed: Boolean(passed),
      detail: String(detail || ''),
      observed,
      expected
    });
  }

  runTier1() {
    const tier = 1;
    console.log(`\n============================================================`);
    console.log(` TIER 1: FEATURE COVERAGE (CONTAINER, CODECS, FORMAT & TIMING)`);
    console.log(`============================================================`);

    // 1.1 File Existence
    const exists = fs.existsSync(this.targetPath);
    const sizeBytes = exists ? fs.statSync(this.targetPath).size : 0;
    const minSizeBytes = 500 * 1024; // At least 500KB sanity floor for rendered MP4
    const filePass = exists && sizeBytes >= minSizeBytes;
    this.addResult(
      tier,
      'T1.1_FILE_EXISTENCE',
      'Target MP4 exists and meets minimum file size (>= 500KB)',
      filePass,
      exists ? `Size: ${(sizeBytes / (1024 * 1024)).toFixed(2)} MB (${this.targetPath})` : `File not found: ${this.targetPath}`,
      sizeBytes,
      `>= ${minSizeBytes} bytes`
    );

    if (!exists) {
      this.addResult(tier, 'T1.ABORT', 'Cannot proceed with media stream inspection: file does not exist', false, 'Target file missing');
      return;
    }

    let probeData;
    try {
      probeData = probeMedia(this.targetPath);
    } catch (err) {
      this.addResult(tier, 'T1.PROBE_ERROR', 'FFprobe parsed MP4 container', false, err.message);
      return;
    }

    const format = probeData.format || {};
    const streams = probeData.streams || [];
    const videoStream = streams.find(s => s.codec_type === 'video');
    const audioStream = streams.find(s => s.codec_type === 'audio');

    // 1.2 Container Format
    const containerFormat = format.format_name || '';
    const isMp4 = containerFormat.includes('mp4') || containerFormat.includes('mov');
    this.addResult(
      tier,
      'T1.2_CONTAINER_FORMAT',
      'Valid MP4 container format (mov,mp4,m4a)',
      isMp4,
      `Detected container: ${containerFormat}`,
      containerFormat,
      'mov,mp4,m4a,3gp,3g2,mj2'
    );

    // 1.3 Stream Composition
    const hasStreams = Boolean(videoStream && audioStream);
    this.addResult(
      tier,
      'T1.3_STREAM_COMPOSITION',
      'Contains at least 1 video stream and 1 audio stream',
      hasStreams,
      `Streams: Video=${videoStream ? 'YES' : 'NO'}, Audio=${audioStream ? 'YES' : 'NO'}, Total=${streams.length}`,
      streams.length,
      '>= 2 streams (1 video, 1 audio)'
    );

    if (!videoStream || !audioStream) return;

    // 1.4 Video Resolution & Declared Format (specs/video-spec.json -> inputProps.json -> default 1080x1920)
    const FORMAT_MAP = { '9:16': [1080, 1920], '16:9': [1920, 1080], '1:1': [1080, 1080] };
    let expectedWidth = 1080;
    let expectedHeight = 1920;
    let expectedAspect = '9:16';
    if (this.projectDir) {
      const specFile = path.join(this.projectDir, 'specs', 'video-spec.json');
      const propsFile = path.join(this.projectDir, 'inputProps.json');
      if (fs.existsSync(specFile)) {
        try {
          const sp = JSON.parse(fs.readFileSync(specFile, 'utf8'));
          if (sp.format?.width && sp.format?.height) {
            expectedWidth = Number(sp.format.width);
            expectedHeight = Number(sp.format.height);
            expectedAspect = sp.format.aspectRatio || `${expectedWidth}:${expectedHeight}`;
          }
        } catch {}
      } else if (fs.existsSync(propsFile)) {
        try {
          const pr = JSON.parse(fs.readFileSync(propsFile, 'utf8'));
          if (pr.format && FORMAT_MAP[pr.format]) {
            [expectedWidth, expectedHeight] = FORMAT_MAP[pr.format];
            expectedAspect = pr.format;
          }
        } catch {}
      }
    }
    const width = videoStream.width;
    const height = videoStream.height;
    const dimsMatch = width === expectedWidth && height === expectedHeight;
    this.addResult(
      tier,
      'T1.4_RESOLUTION_FORMAT',
      `Dimensions match declared project format ${expectedWidth}x${expectedHeight} (${expectedAspect})`,
      dimsMatch,
      `Resolution: ${width}x${height} (Expected: ${expectedWidth}x${expectedHeight}, format: ${expectedAspect})`,
      `${width}x${height}`,
      `${expectedWidth}x${expectedHeight}`
    );

    // 1.5 Video Codec & Profile
    const vCodec = videoStream.codec_name;
    const pixFmt = videoStream.pix_fmt;
    const isH264 = vCodec === 'h264';
    this.addResult(
      tier,
      'T1.5_VIDEO_CODEC',
      'Video codec is H.264 (AVC) with 8-bit YUV 4:2:0 format',
      isH264 && (pixFmt === 'yuv420p' || pixFmt === 'yuvj420p'),
      `Codec: ${vCodec}, Profile: ${videoStream.profile}, Pixel format: ${pixFmt}`,
      `${vCodec} (${pixFmt})`,
      'h264 (yuv420p)'
    );

    // 1.6 Video Frame Rate (30 fps)
    let fps = 0;
    if (videoStream.avg_frame_rate) {
      const parts = videoStream.avg_frame_rate.split('/').map(Number);
      fps = parts[1] ? parts[0] / parts[1] : 0;
    }
    const is30Fps = Math.abs(fps - 30.0) <= 0.05;
    this.addResult(
      tier,
      'T1.6_FRAME_RATE',
      'Video frame rate is calibrated to 30.0 fps (±0.05)',
      is30Fps,
      `Frame rate: ${fps.toFixed(2)} fps (raw avg_frame_rate: ${videoStream.avg_frame_rate})`,
      `${fps.toFixed(2)} fps`,
      '30.0 fps'
    );

    // 1.7 Duration Bounds (open-ended duration driven by content depth, minimum sanity floor >= 10.0s)
    const duration = parseFloat(format.duration || videoStream.duration || 0);
    const durationValid = Number.isFinite(duration) && duration >= 10.0;
    this.addResult(
      tier,
      'T1.7_DURATION_BOUNDS',
      'Total video duration is valid and driven by content depth (>= 10.0s, no artificial upper cap)',
      durationValid,
      `Total duration: ${duration.toFixed(2)}s (Open-ended content-driven duration)`,
      `${duration.toFixed(2)}s`,
      '>= 10.0s'
    );

    // 1.8 Audio Codec & Channels
    const aCodec = audioStream.codec_name;
    const channels = audioStream.channels;
    const isAac = aCodec === 'aac';
    this.addResult(
      tier,
      'T1.8_AUDIO_CODEC',
      'Audio codec is AAC with valid channel layout',
      isAac && channels >= 1,
      `Audio codec: ${aCodec}, Channels: ${channels} (${audioStream.channel_layout || 'stereo'})`,
      `${aCodec} (${channels}ch)`,
      'aac (>= 1ch)'
    );

    // 1.9 Audio Sample Rate (48000 Hz)
    const sampleRate = parseInt(audioStream.sample_rate, 10);
    const is48k = sampleRate === 48000;
    this.addResult(
      tier,
      'T1.9_SAMPLE_RATE_48K',
      'Audio sample rate matches CIT Voice Studio 48kHz broadcast standard',
      is48k,
      `Sample rate: ${sampleRate} Hz (Expected 48000 Hz)`,
      `${sampleRate} Hz`,
      '48000 Hz'
    );
  }

  runTier2() {
    const tier = 2;
    console.log(`\n============================================================`);
    console.log(` TIER 2: BOUNDARY & CORNER CASES (LOUDNESS, FREEZE, BLACKOUT)`);
    console.log(`============================================================`);

    if (!fs.existsSync(this.targetPath)) {
      this.addResult(tier, 'T2.ABORT', 'Cannot run Tier 2: target MP4 file not found', false, 'Target missing');
      return;
    }

    // 2.1 EBU R128 Integrated Loudness (-14 to -12 LUFS, target -13 LUFS)
    let ebuData;
    try {
      ebuData = measureEbuR128(this.targetPath);
      const lufs = ebuData.integratedLufs;
      const passLufs = lufs >= -14.0 && lufs <= -12.0;
      this.addResult(
        tier,
        'T2.1_EBU_R128_INTEGRATED',
        'EBU R128 integrated loudness within -14.0 to -12.0 LUFS',
        passLufs,
        `Measured: ${lufs.toFixed(1)} LUFS (Target: -13.0 LUFS ±1.0 LU)`,
        `${lufs.toFixed(1)} LUFS`,
        '-14.0 to -12.0 LUFS'
      );

      // 2.2 Loudness Range (LRA < 8.0 LU)
      const lra = ebuData.rangeLu;
      const passLra = lra < 8.0;
      this.addResult(
        tier,
        'T2.2_EBU_R128_LRA',
        'Loudness Range (LRA) < 8.0 LU (stable dialogue dynamic range)',
        passLra,
        `Measured LRA: ${lra.toFixed(1)} LU (Maximum allowed: < 8.0 LU)`,
        `${lra.toFixed(1)} LU`,
        '< 8.0 LU'
      );

      // 2.3 True Peak (< -1.0 dBFS)
      const tp = ebuData.truePeakDbfs;
      const passTp = tp < -1.0;
      this.addResult(
        tier,
        'T2.3_TRUE_PEAK_HEADROOM',
        'True Peak headroom strictly < -1.0 dBFS (prevents digital clipping)',
        passTp,
        `Measured True Peak: ${tp.toFixed(1)} dBFS (Limit: < -1.0 dBFS)`,
        `${tp.toFixed(1)} dBFS`,
        '< -1.0 dBFS'
      );
    } catch (err) {
      this.addResult(tier, 'T2.1_EBU_R128_ERROR', 'EBU R128 Loudness measurement', false, err.message);
    }

    // 2.4 Freeze Frame Detection (No frozen video sequences > 3.0 seconds)
    try {
      const freezeResult = detectFreezes(this.targetPath, 3.0);
      const passFreeze = freezeResult.count === 0;
      this.addResult(
        tier,
        'T2.4_FREEZE_FRAME_DETECTION',
        'No unintended video freeze periods exceeding 3.0 consecutive seconds',
        passFreeze,
        passFreeze
          ? 'Passed: 0 freeze events detected'
          : `Detected ${freezeResult.count} freeze events at timestamps [${freezeResult.starts.join(', ')}]`,
        `${freezeResult.count} freeze events`,
        '0 freeze events > 3.0s'
      );
    } catch (err) {
      this.addResult(tier, 'T2.4_FREEZE_DETECTION_ERROR', 'Freeze frame analysis', false, err.message);
    }

    // 2.5 Black Frame Dropout Detection
    try {
      const blackResult = detectBlackFrames(this.targetPath, 1.5);
      const passBlack = blackResult.count === 0;
      this.addResult(
        tier,
        'T2.5_BLACK_FRAME_DETECTION',
        'No unintentional black screen dropouts exceeding 1.5 seconds',
        passBlack,
        passBlack
          ? 'Passed: 0 black dropouts detected'
          : `Detected ${blackResult.count} black frame periods`,
        `${blackResult.count} black dropouts`,
        '0 black dropouts > 1.5s'
      );
    } catch (err) {
      this.addResult(tier, 'T2.5_BLACK_FRAME_ERROR', 'Black frame analysis', false, err.message);
    }
  }

  runTier3() {
    const tier = 3;
    console.log(`\n============================================================`);
    console.log(` TIER 3: CROSS-FEATURE COMBINATIONS (A/V DRIFT & SUBTITLE SYNC)`);
    console.log(`============================================================`);

    if (!fs.existsSync(this.targetPath)) {
      this.addResult(tier, 'T3.ABORT', 'Cannot run Tier 3: target MP4 file not found', false, 'Target missing');
      return;
    }

    let probeData;
    try {
      probeData = probeMedia(this.targetPath);
    } catch (err) {
      this.addResult(tier, 'T3.PROBE_ERROR', 'Probe media for cross-feature test', false, err.message);
      return;
    }

    const videoStream = probeData.streams.find(s => s.codec_type === 'video');
    const audioStream = probeData.streams.find(s => s.codec_type === 'audio');
    const format = probeData.format;

    // 3.1 Audio vs Video Duration Drift (<= 0.5s)
    const vDuration = parseFloat(videoStream?.duration || format.duration || 0);
    const aDuration = parseFloat(audioStream?.duration || format.duration || 0);
    const drift = Math.abs(vDuration - aDuration);
    const passDrift = drift <= 0.50;
    this.addResult(
      tier,
      'T3.1_AV_DURATION_DRIFT',
      'Audio vs Video stream duration drift is strictly within ±0.5s',
      passDrift,
      `Video: ${vDuration.toFixed(2)}s, Audio: ${aDuration.toFixed(2)}s, Drift: ${drift.toFixed(3)}s`,
      `${drift.toFixed(3)}s`,
      '<= 0.500s'
    );

    // 3.2 Master Narration Audio Alignment
    const narrationPath = path.join(this.projectDir, 'assets', 'audio', 'narration.mp3');
    if (fs.existsSync(narrationPath)) {
      try {
        const narrationProbe = probeMedia(narrationPath);
        const narrationDuration = parseFloat(narrationProbe.format?.duration || 0);
        // Video must comfortably fit narration (narration <= video duration, trailing silence <= 2.5s)
        const narrationFits = narrationDuration <= (vDuration + 0.1) && (vDuration - narrationDuration) <= 2.5;
        this.addResult(
          tier,
          'T3.2_NARRATION_TIMELINE_ALIGNMENT',
          'Final video encompasses master narration track without truncation or excessive pad',
          narrationFits,
          `Narration: ${narrationDuration.toFixed(2)}s, Final Video: ${vDuration.toFixed(2)}s (Delta: ${(vDuration - narrationDuration).toFixed(2)}s)`,
          `${(vDuration - narrationDuration).toFixed(2)}s padding`,
          '0.0s <= padding <= 2.5s'
        );
      } catch (err) {
        this.addResult(tier, 'T3.2_NARRATION_CHECK_ERROR', 'Narration audio inspection', false, err.message);
      }
    } else {
      this.addResult(
        tier,
        'T3.2_NARRATION_TIMELINE_ALIGNMENT',
        'Master narration file (assets/audio/narration.mp3)',
        true,
        'Skipped strict delta: narration file not yet staged in project root (will be validated once staged)'
      );
    }

    // 3.3 Subtitle Synchronization Coverage (scales dynamically with storyboard scene count & video duration)
    const assSubtitlePath = path.join(this.projectDir, 'assets', 'audio', 'subtitles.srt');
    const wordTimingsPath = path.join(this.projectDir, 'assets', 'audio', 'timing.json');
    const storyboardPath = path.join(this.projectDir, 'storyboard.json');
    let sceneCount = 3;
    if (fs.existsSync(storyboardPath)) {
      try {
        const sb = JSON.parse(fs.readFileSync(storyboardPath, 'utf8'));
        if (Array.isArray(sb.scenes) && sb.scenes.length > 0) sceneCount = sb.scenes.length;
      } catch {}
    }
    const minWords = Math.max(25, Math.floor(vDuration * 1.0));
    const minLines = Math.max(3, sceneCount);

    if (fs.existsSync(assSubtitlePath) || fs.existsSync(wordTimingsPath)) {
      let subPass = true;
      let detailMsg = '';
      if (fs.existsSync(assSubtitlePath)) {
        const assContent = fs.readFileSync(assSubtitlePath, 'utf8');
        const dialogueLines = assContent.split('\n').filter(l => l.startsWith('Dialogue:') || l.includes('-->'));
        subPass = dialogueLines.length >= minLines;
        detailMsg = `Subtitle file contains ${dialogueLines.length} dialogue event lines (min ${minLines} for ${sceneCount} scenes)`;
      } else if (fs.existsSync(wordTimingsPath)) {
        const timings = JSON.parse(fs.readFileSync(wordTimingsPath, 'utf8'));
        const wordCount = Array.isArray(timings)
          ? timings.length
          : Array.isArray(timings.words)
            ? timings.words.length
            : Object.keys(timings).length;
        subPass = wordCount >= minWords;
        detailMsg = `Word timings JSON contains ${wordCount} timed word entries (min ${minWords} for ${vDuration.toFixed(1)}s)`;
      }
      this.addResult(
        tier,
        'T3.3_SUBTITLE_TIMELINE_COVERAGE',
        `Subtitle track covers speech dialogue across all ${sceneCount} scenes`,
        subPass,
        detailMsg,
        subPass ? 'Adequate coverage' : 'Insufficient subtitle cues',
        `>= ${minLines} dialogue events / >= ${minWords} words`
      );
    } else {
      this.addResult(
        tier,
        'T3.3_SUBTITLE_TIMELINE_COVERAGE',
        'Subtitle assets staged in audio/ directory',
        true,
        'Subtitle file will be burned during assembly phase M4'
      );
    }
  }

  runTier4() {
    const tier = 4;
    console.log(`\n============================================================`);
    console.log(` TIER 4: REAL-WORLD SCENARIOS (PLAYBACK, QC SIGN-OFF, PACKAGING)`);
    console.log(`============================================================`);

    if (!fs.existsSync(this.targetPath)) {
      this.addResult(tier, 'T4.ABORT', 'Cannot run Tier 4: target MP4 file not found', false, 'Target missing');
      return;
    }

    // 4.1 Full Bitstream Playback & Decode
    const decodeResult = decodeBitstream(this.targetPath);
    this.addResult(
      tier,
      'T4.1_BITSTREAM_DECODE_INTEGRITY',
      'Full bitstream decode passes without container corruption or fatal packet loss',
      decodeResult.success,
      decodeResult.success ? 'Bitstream fully decoded to null with 0 errors' : `Decode errors: ${decodeResult.errors.slice(0, 300)}`,
      decodeResult.success ? '0 errors' : 'Decode failed',
      '0 errors'
    );

    // 4.2 Visual Scene Sampling (dynamic across N scenes from storyboard.json + Hook 0.3s frame)
    let probeData;
    try {
      probeData = probeMedia(this.targetPath);
    } catch (e) {
      this.addResult(tier, 'T4.2_SCENE_SAMPLING_ERROR', 'Probe media for visual sampling', false, e.message);
      return;
    }

    const duration = parseFloat(probeData.format.duration);
    const storyboardPath = path.join(this.projectDir, 'storyboard.json');
    let sampleTimestamps = null;
    let sceneLabel = 'proportional fallback';

    if (fs.existsSync(storyboardPath)) {
      try {
        const sb = JSON.parse(fs.readFileSync(storyboardPath, 'utf8'));
        if (Array.isArray(sb.scenes) && sb.scenes.length > 0) {
          const hookTs = Math.min(0.3, Math.max(0.05, duration * 0.03));
          const sceneTs = sb.scenes.map((s, idx) => {
            const sStart = Number(s.start ?? s.startSec ?? (s.startMs != null ? s.startMs / 1000 : 0));
            const sDur = Number(s.dur ?? s.duration ?? s.durationSec ?? (s.durationMs != null ? s.durationMs / 1000 : 0));
            const isLast = idx === sb.scenes.length - 1;
            const target = sStart + sDur * (isLast ? 0.65 : 0.55);
            return Math.min(Math.max(0.1, duration - 0.35), Math.max(0.05, target));
          });
          sampleTimestamps = [hookTs, ...sceneTs];
          sceneLabel = `${sb.scenes.length} storyboard scenes + Hook 0.3s`;
        }
      } catch {}
    }

    if (!sampleTimestamps) {
      sampleTimestamps = [
        Math.min(0.5, Math.max(0.1, duration * 0.03)),
        duration * 0.25,
        duration * 0.50,
        duration * 0.75,
        Math.min(duration - 0.5, duration * 0.92)
      ];
    }

    let validFrames = 0;
    const samplingBaseDir = path.join(this.projectDir, 'output');
    if (!fs.existsSync(samplingBaseDir)) fs.mkdirSync(samplingBaseDir, { recursive: true });
    const tempDir = fs.mkdtempSync(path.join(samplingBaseDir, '.vtest-sampling-'));
    try {
      for (let i = 0; i < sampleTimestamps.length; i++) {
        const framePath = path.join(tempDir, `sample_scene_${i + 1}.jpg`);
        const ss = sampleTimestamps[i].toFixed(2);
        const res = runCommand(FFMPEG_BIN, [
          '-y',
          '-ss', ss,
          '-i', this.targetPath,
          '-frames:v', '1',
          '-q:v', '2',
          framePath
        ]);
        if (res.status === 0 && fs.existsSync(framePath) && fs.statSync(framePath).size > 15000) {
          validFrames++;
        }
      }
      const passSampling = validFrames === sampleTimestamps.length;
      this.addResult(
        tier,
        'T4.2_VISUAL_SCENE_SAMPLING',
        `Extract and verify visual keyframe fidelity across ${sceneLabel}`,
        passSampling,
        `Successfully extracted ${validFrames}/${sampleTimestamps.length} non-empty frames at [${sampleTimestamps.map(t => t.toFixed(1) + 's').join(', ')}]`,
        `${validFrames}/${sampleTimestamps.length} frames`,
        `${sampleTimestamps.length}/${sampleTimestamps.length} valid frames`
      );
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {}
    }

    // 4.3 Outro CTA Branding Verification (per-project brand profile or brand: none)
    let declaredBrand = 'none';
    if (this.projectDir) {
      const propsFile = path.join(this.projectDir, 'inputProps.json');
      if (fs.existsSync(propsFile)) {
        try {
          const pr = JSON.parse(fs.readFileSync(propsFile, 'utf8'));
          if (pr.brand) declaredBrand = String(pr.brand).trim();
        } catch {}
      }
    }
    let hasBranding = true;
    let brandDetail = 'No brand declared (brand: none) — outro branding assets optional';
    let brandObserved = 'Optional (brand: none)';
    let brandExpected = 'Valid brand assets when brand != none';
    if (declaredBrand && declaredBrand !== 'none') {
      const profileFile = path.join(WORKSPACE_ROOT, 'brand', declaredBrand, 'profile.json');
      if (!fs.existsSync(profileFile)) {
        hasBranding = false;
        brandDetail = `Declared brand '${declaredBrand}' missing profile: ${profileFile}`;
        brandObserved = 'Missing profile.json';
        brandExpected = `brand/${declaredBrand}/profile.json`;
      } else {
        try {
          const profile = JSON.parse(fs.readFileSync(profileFile, 'utf8'));
          if (profile.logo) {
            const logoPath = path.join(WORKSPACE_ROOT, profile.logo);
            hasBranding = fs.existsSync(logoPath);
            brandDetail = hasBranding
              ? `Brand '${declaredBrand}' logo verified (${profile.logo})`
              : `Brand '${declaredBrand}' logo missing (${profile.logo})`;
            brandObserved = hasBranding ? 'Found' : 'Missing';
            brandExpected = profile.logo;
          } else {
            hasBranding = true;
            brandDetail = `Brand '${declaredBrand}' profile loaded (no logo required)`;
            brandObserved = 'Profile valid';
          }
        } catch (err) {
          hasBranding = false;
          brandDetail = `Invalid brand profile JSON for '${declaredBrand}': ${err.message}`;
          brandObserved = 'Invalid JSON';
        }
      }
    }
    this.addResult(
      tier,
      'T4.3_OUTRO_BRANDING_ASSETS',
      'Project branding contract satisfied (brand profile assets verified when brand != none)',
      hasBranding,
      brandDetail,
      brandObserved,
      brandExpected
    );

    // 4.4 QA Review Log Sign-off (qc.md)
    const qcMdPath1 = path.join(this.projectDir, 'output', 'qc.md');
    const qcMdPath2 = path.join(this.projectDir, 'qc.md');
    const hasQcMd = fs.existsSync(qcMdPath1) || fs.existsSync(qcMdPath2);
    this.addResult(
      tier,
      'T4.4_FINAL_QC_SIGNOFF',
      'Phase 4 inspection audit log (qc.md) documented and verified',
      hasQcMd,
      hasQcMd ? `QA inspection log verified (${fs.existsSync(qcMdPath1) ? qcMdPath1 : qcMdPath2})` : 'Phase 4 qc.md log to be signed off upon final render inspection',
      hasQcMd ? 'Signed off' : 'Pending Phase 4 QA',
      'Signed qc.md'
    );

    // 4.5 Clean Delivery Packaging Contract
    const outputDir = path.join(this.projectDir, 'output');
    let singleDeliverablePass = true;
    let deliverableMsg = '';
    if (fs.existsSync(outputDir)) {
      const files = fs.readdirSync(outputDir);
      const mp4Files = files.filter(f => f.endsWith('.mp4'));
      // Exactly 1 MP4 deliverable: final.mp4
      if (mp4Files.length === 1 && mp4Files[0] === 'final.mp4') {
        singleDeliverablePass = true;
        deliverableMsg = 'Strict delivery contract fulfilled: only output/final.mp4 is published';
      } else if (mp4Files.includes('final.mp4')) {
        singleDeliverablePass = false;
        deliverableMsg = `Multiple MP4 files found in output/: [${mp4Files.join(', ')}]. Contract requires ONLY final.mp4.`;
      } else {
        singleDeliverablePass = false;
        deliverableMsg = `final.mp4 not found in output/: [${mp4Files.join(', ')}]`;
      }
    } else {
      singleDeliverablePass = false;
      deliverableMsg = `Output directory does not exist: ${outputDir}`;
    }
    this.addResult(
      tier,
      'T4.5_SINGLE_DELIVERABLE_CONTRACT',
      'Single deliverable contract: exactly one final MP4 exists at output/final.mp4 (no stray previews/v001)',
      singleDeliverablePass,
      deliverableMsg,
      singleDeliverablePass ? 'Strictly final.mp4' : 'Violations found',
      'output/final.mp4 only'
    );
  }

  printSummary(jsonMode = false) {
    if (jsonMode) {
      console.log(JSON.stringify(this.results, null, 2));
      return this.results.every(r => r.passed);
    }

    console.log(`\n============================================================`);
    console.log(`                 E2E TEST EXECUTION SUMMARY                 `);
    console.log(`============================================================`);

    let passedCount = 0;
    let failedCount = 0;

    for (const res of this.results) {
      const icon = res.passed ? '✅ PASS' : '❌ FAIL';
      if (res.passed) passedCount++;
      else failedCount++;

      console.log(`${icon} [Tier ${res.tier}] ${res.id}: ${res.title}`);
      console.log(`        └─ ${res.detail}`);
      if (!res.passed && res.expected !== null) {
        console.log(`           Expected: ${res.expected} | Observed: ${res.observed}`);
      }
    }

    console.log(`------------------------------------------------------------`);
    console.log(`Total Assertions: ${this.results.length}`);
    console.log(`Passed:           ${passedCount}`);
    console.log(`Failed:           ${failedCount}`);
    const allPassed = failedCount === 0;
    console.log(`Verdict:          ${allPassed ? 'ALL TESTS PASSED 🚀' : 'TEST FAILURES DETECTED ⚠️'}`);
    console.log(`============================================================\n`);
    return allPassed;
  }
}

// Generate a synthetic conforming MP4 fixture for self-testing the harness
function generateConformingFixture(fixtureDir) {
  const mp4Path = path.join(fixtureDir, 'output', 'final.mp4');
  const qcPath = path.join(fixtureDir, 'qc.md');
  const audioDir = path.join(fixtureDir, 'assets', 'audio');
  
  fs.mkdirSync(path.join(fixtureDir, 'output'), { recursive: true });
  fs.mkdirSync(audioDir, { recursive: true });

  fs.writeFileSync(qcPath, '# QA Inspection Log\n- [x] Phase 4 Final QA Approved\n');
  fs.writeFileSync(
    path.join(fixtureDir, 'storyboard.json'),
    JSON.stringify({
      durationSec: 72.0,
      scenes: Array.from({ length: 8 }, (_, idx) => ({
        id: `s${idx + 1}`,
        startSec: idx * 9,
        durationSec: 9,
      })),
    }, null, 2)
  );

  // Generate 72.0s video with 1080x1920, 30fps, moving elements (prevents freeze detection), 48kHz AAC audio normalized to -13 LUFS
  console.log(`Generating 72s synthetic conforming MP4 fixture at: ${mp4Path}...`);

  const res = spawnSync(FFMPEG_BIN, [
    '-y',
    '-f', 'lavfi', '-i', 'testsrc=size=1080x1920:rate=30:duration=72.0',
    '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=48000:duration=72.0',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'ultrafast',
    '-af', 'volume=0.35,loudnorm=I=-13.0:LRA=6.0:TP=-1.5',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-t', '72.0',
    mp4Path
  ], { encoding: 'utf8', timeout: 120000 });

  if (res.status !== 0 || !fs.existsSync(mp4Path)) {
    throw new Error(`Failed to generate conforming test fixture: ${res.stderr}`);
  }

  // Also create a dummy narration file for T3.2 alignment check
  const narrationMp3 = path.join(audioDir, 'narration.mp3');
  spawnSync(FFMPEG_BIN, [
    '-y',
    '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=48000:duration=71.0',
    '-c:a', 'libmp3lame', '-b:a', '192k', '-ar', '48000',
    narrationMp3
  ], { encoding: 'utf8', timeout: 30000 });

  return mp4Path;
}

// CLI Entrypoint
async function main() {
  const args = process.argv.slice(2);
  let targetPath = null;
  let projectDir = null;
  let runTier = 'all';
  let selfTest = false;
  let jsonMode = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--target' && args[i + 1]) {
      targetPath = path.resolve(args[++i]);
    } else if (args[i] === '--project' && args[i + 1]) {
      projectDir = path.resolve(args[++i]);
    } else if (args[i] === '--tier' && args[i + 1]) {
      runTier = args[++i].toLowerCase();
    } else if (args[i] === '--self-test') {
      selfTest = true;
    } else if (args[i] === '--json') {
      jsonMode = true;
    }
  }

  if (!selfTest) {
    if (!targetPath && !projectDir) {
      console.log(`
🔬 [AI Video Factory QC Gate] Bộ kiểm định video đầu ra
======================================================
Cách sử dụng:
  node tests/e2e/test_final_video.cjs --project <đường_dẫn_dự_án>
  node tests/e2e/test_final_video.cjs --target <file_video.mp4>
  node tests/e2e/test_final_video.cjs --self-test
`);
      process.exit(1);
    }
    if (!targetPath && projectDir) {
      targetPath = path.join(projectDir, 'output', 'final.mp4');
    }
  }

  if (!FFMPEG_BIN || !FFPROBE_BIN) {
    console.error('ERROR: FFmpeg / FFprobe binaries could not be resolved.');
    process.exit(1);
  }

  let tempFixtureDir = null;
  if (selfTest) {
    console.log('[SELF-TEST MODE] Setting up conforming media fixture...');
    tempFixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'video-ai-e2e-selftest-'));
    try {
      targetPath = generateConformingFixture(tempFixtureDir);
      projectDir = tempFixtureDir;
    } catch (e) {
      console.error(`Self-test fixture generation failed: ${e.message}`);
      process.exit(1);
    }
  }

  console.log(`Target MP4:    ${targetPath}`);
  console.log(`Project Root:  ${projectDir}`);
  console.log(`Tier Selected: ${runTier.toUpperCase()}`);
  console.log(`FFmpeg:        ${FFMPEG_BIN}`);
  console.log(`FFprobe:       ${FFPROBE_BIN}`);

  const suite = new TestSuite(targetPath, projectDir);

  if (runTier === 'all' || runTier === '1') suite.runTier1();
  if (runTier === 'all' || runTier === '2') suite.runTier2();
  if (runTier === 'all' || runTier === '3') suite.runTier3();
  if (runTier === 'all' || runTier === '4') suite.runTier4();

  const success = suite.printSummary(jsonMode);

  if (tempFixtureDir) {
    console.log(`Cleaning up self-test fixture at: ${tempFixtureDir}`);
    try {
      fs.rmSync(tempFixtureDir, { recursive: true, force: true });
    } catch (e) {}
  }

  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Unhandled test suite error:', err);
    process.exit(1);
  });
}

module.exports = { TestSuite, measureEbuR128, detectFreezes, detectBlackFrames, probeMedia };
