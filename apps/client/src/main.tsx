import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { unlockAudio } from "./audio/sound";
import { refreshBalance } from "./balance";
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
// 웹앱 설치 준비 (서비스 워커·설치 창)
setupInstall();
// 다른 기기에서 바꾼 닉네임·해금 맞추기 (열 때 한 번)
void syncProfile();
// 게임 수치 (관리자 페이지에서 바꾼 값). 못 받으면 마지막으로 받은 값으로
void refreshBalance();
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
