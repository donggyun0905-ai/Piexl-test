import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { unlockAudio } from "./audio/sound";
import { refreshBalance } from "./balance";
import { syncCloud } from "./cloudSave";
import { setupInstall } from "./install";
import { syncProfile } from "./player";
import "./styles/index.css";

const root = document.getElementById("root");
if (!root) throw new Error("#root 없음");
// 브라우저는 사람이 누른 뒤에만 소리를 낼 수 있음
for (const ev of ["pointerdown", "keydown"]) window.addEventListener(ev, unlockAudio, { passive: true });
// Ctrl+S(맥은 Cmd+S)를 눌러도 브라우저 '저장' 창이 뜨지 않게
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.code === "KeyS") e.preventDefault();
});
// 새 버전이 올라가 예전 화면 파일이 없어졌으면 (나눠 받는 화면) 새로 고쳐 새 버전으로
window.addEventListener("vite:preloadError", () => location.reload());
// 웹앱 설치 준비 (서비스 워커·설치 창)
setupInstall();
// 다른 기기에서 바꾼 닉네임·해금 맞추기 (열 때 한 번)
void syncProfile();
// 쿠폰·스킨 등 상점 쪽 저장을 서버 백업과 맞춤
void syncCloud();
// 게임 수치 (관리자 페이지에서 바꾼 값). 못 받으면 마지막으로 받은 값으로
void refreshBalance();
// 관리자 티어 플레잉 (/?tierplay): 캐릭터를 차례로 한 판씩 해 보고 기록 (관리자 페이지 '티어 플레잉'의 플레이하기)
const TierPlay = lazy(() => import("./tierplay/TierPlay").then((m) => ({ default: m.TierPlay })));
const tierPlay = new URLSearchParams(location.search).has("tierplay");
createRoot(root).render(
  <StrictMode>
    <Suspense fallback={null}>
      {tierPlay ? <TierPlay /> : <App />}
    </Suspense>
  </StrictMode>,
);
