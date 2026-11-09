// 미니 게임 캔버스 선명하게: 창 확대(MiniGame zoom) × 화면 픽셀 밀도만큼 큰 그림판에 그리고 같은 크기로 보여 줌
import { createContext, useContext, useEffect, useState, type RefObject } from "react";

/** MiniGame이 내용에 건 확대 배율 */
export const MiniZoom = createContext(1);

/** 그림판 배율 (그리기 전에 ctx.setTransform(k, 0, 0, k, 0, 0)) · 너무 크지 않게 6배까지 */
export function useCrispCanvas(ref: RefObject<HTMLCanvasElement | null>, w: number, h: number): number {
  const zoom = useContext(MiniZoom);
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      // 실제로 보이는 크기 (CSS 높이·너비 고정 포함) ÷ 그림 크기
      const r = el.getBoundingClientRect();
      const shown = Math.max(r.width / w, r.height / h, zoom);
      const next = Math.min(6, Math.max(1, Math.ceil(shown * (window.devicePixelRatio || 1) * 2) / 2));
      if (next === k) return;
      el.width = Math.round(w * next);
      el.height = Math.round(h * next);
      setK(next);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, w, h, zoom, k]);
  return k;
}

/** 그리기 시작: 배율 맞추고 부드럽게 (도트 그림은 smooth=false) */
export function crispBegin(ctx: CanvasRenderingContext2D, k: number, smooth = true): void {
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.imageSmoothingEnabled = smooth;
}
