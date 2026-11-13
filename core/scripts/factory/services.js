import http from "node:http";
import { spawn } from "node:child_process";

export function pingHttp(url, timeoutMs = 2000) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const req = http.request(
        {
          hostname: parsed.hostname,
          port: parsed.port,
          path: parsed.pathname + parsed.search,
          method: "GET",
          timeout: timeoutMs,
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => { body += chunk; });
          res.on("end", () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 500,
              statusCode: res.statusCode,
              body,
            });
          });
        }
      );
      req.on("error", (err) => resolve({ ok: false, error: err.message }));
      req.on("timeout", () => {
        req.destroy();
        resolve({ ok: false, error: "timeout" });
      });
      req.end();
    } catch (err) {
      resolve({ ok: false, error: err.message });
    }
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function ensureCitVoiceStudio(timeoutMs = 15000) {
  if ((await pingHttp("http://127.0.0.1:8001", 1000)).ok) return true;

  console.log("⚡ [Auto-Service] CIT Voice Studio (:8001) chưa bật. Đang tự động kích hoạt...");

  const psCommand = `
    $exes = @(
      "$env:LOCALAPPDATA\\Programs\\CIT Voice Studio\\CIT-Voice-Studio.exe",
      "$env:LOCALAPPDATA\\Programs\\CIT Voice Studio\\CIT Voice Studio.exe",
      "$env:ProgramFiles\\CIT Voice Studio\\CIT-Voice-Studio.exe",
      "$env:ProgramFiles\\CIT Voice Studio\\CIT Voice Studio.exe",
      "D:\\AI\\CIT-Voice-Studio-v1.0.3-win-x86_64.exe"
    )
    foreach ($e in $exes) {
      if (Test-Path $e) {
        Start-Process -FilePath $e
        break
      }
    }
  `;

  try {
    const child = spawn("powershell.exe", ["-NoProfile", "-Command", psCommand], {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    child.unref();

    // Poll until online
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      await sleep(1500);
      if ((await pingHttp("http://127.0.0.1:8001", 1000)).ok) {
        console.log("✅ [Auto-Service] CIT Voice Studio đã sẵn sàng! (:8001)");
        return true;
      }
    }
  } catch (err) {
    console.warn(`⚠️ [Auto-Service] Không thể tự gọi CIT Voice Studio: ${err.message}`);
  }

  console.log(
    "ℹ️ [Auto-Service] Đã gửi lệnh khởi động CIT Voice Studio. Nếu ứng dụng chưa mở, vui lòng nhấp đúp biểu tượng CIT Voice Studio trên màn hình Desktop."
  );
  return false;
}
