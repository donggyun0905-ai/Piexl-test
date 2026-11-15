// 지도 로딩 화면 (docs/QUEST.md 4절): 흐린 세계 지도 그림 · 지역 이름 · '이야기를 펼치는 중…' · 펜이 지나가는 줄
// 지도를 다 받아도 처음 MIN_MS 동안은 보여 주고, 끝나면 사라짐 (실패하면 실패 글)
import { useEffect, useState } from "react";
import type { TextKey } from "../i18n";

/** 가장 짧게 보여 주는 시간 (ms) */
const MIN_MS = 1200;

export function WorldLoading({ t, state, place }: { t: (k: TextKey) => string; state: "loading" | "ok" | "fail"; place: string }) {
  const [wait, setWait] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setWait(false), MIN_MS);
    return () => window.clearTimeout(id);
  }, []);
  const done = state === "ok" && !wait;
  return (
    <div className={`world-loading-screen${done ? " done" : ""}`} style={{ backgroundImage: `url(${import.meta.env.BASE_URL}world/worldMap.webp)` }} aria-hidden={done}>
      <div className="world-loading-box">
        <strong>{place}</strong>
        <span>{t(state === "fail" ? "worldFail" : "worldLoadingStory")}</span>
        {state !== "fail" && <div className="world-loading-line" />}
      </div>
    </div>
  );
}
