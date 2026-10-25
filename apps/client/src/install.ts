// 웹앱 설치: 서비스 워커 등록 · 크롬 계열의 설치 창 붙잡아 두기 · 지금 앱으로 열렸는지
import { useEffect, useState } from "react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

/** 앱으로 설치되어 열린 상태 (주소창 없음) */
export function isInstalledApp(): boolean {
  const modes = ["standalone", "fullscreen", "minimal-ui"];
  return modes.some((m) => window.matchMedia(`(display-mode: ${m})`).matches) || (navigator as { standalone?: boolean }).standalone === true;
}

/** 아이폰·아이패드 (아이패드는 맥처럼 보이므로 터치로 구분). 이 기기들은 설치 창이 없어 안내만 보임 */
export function isIos(): boolean {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

/** 앱으로 열렸을 때 가로로 고정. 매니페스트 orientation과 같은 일인데, 이미 설치한 앱은 매니페스트가 늦게 갱신되므로 직접도 건다.
 *  안드로이드 크롬·엣지만 됨 (아이폰·아이패드·PC는 지원하지 않아 조용히 넘어감) */
function lockLandscape() {
  if (!isInstalledApp()) return;
  const o = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
  o?.lock?.("landscape").catch(() => {});
}

/** 페이지를 열 때 한 번 (main.tsx). 설치 창 이벤트는 일찍 오므로 화면보다 먼저 듣는다 */
export function setupInstall() {
  lockLandscape();
  // 다른 앱에 갔다 돌아오면 고정이 풀리는 기기가 있어 다시 건다
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") lockLandscape();
  });
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // 브라우저가 알아서 띄우는 안내 대신 우리 버튼으로
    deferred = e as InstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => void navigator.serviceWorker.register("/sw.js").catch(() => {}));
  }
}

/** 브라우저 설치 창을 띄움. 띄울 수 없으면 false (→ 설치 방법 안내) */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  const ev = deferred;
  deferred = null; // 설치 창은 한 번만 쓸 수 있음
  notify();
  await ev.prompt();
  await ev.userChoice;
  return true;
}

/** 설치 창을 지금 띄울 수 있는지 (바뀌면 다시 그림) */
export function useCanPrompt(): boolean {
  const [can, setCan] = useState(deferred !== null);
  useEffect(() => {
    const fn = () => setCan(deferred !== null);
    listeners.add(fn);
    return () => void listeners.delete(fn);
  }, []);
  return can;
}
