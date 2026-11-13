// 브라우저 전체 화면 켜기·끄기 (스토리 장면 보기 버튼). 장면을 닫으면 켜 둔 전체 화면도 끔
import { useEffect, useState } from "react";

/** 이 브라우저가 전체 화면을 지원하는지 (iPhone Safari 등은 안 됨 → 버튼 숨김) */
export const canFull = typeof document !== "undefined" && !!document.documentElement.requestFullscreen;

export function useFullscreen() {
  const [full, setFull] = useState(() => !!document.fullscreenElement);

  useEffect(() => {
    const on = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", on);
    return () => {
      document.removeEventListener("fullscreenchange", on);
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    };
  }, []);

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void document.documentElement.requestFullscreen().catch(() => {});
  };
  return { full, toggleFull };
}
