// 화면 요소(창·카드) 위에 빛 층을 붙이는 훅: 매 화면 each(parts, 너비, 높이, 화면 수)를 불러 화면 좌표(CSS 픽셀)로 빛을 놓음
// each는 바뀌지 않는 함수로 (모듈 상수). 명예의 전당 우승자 카드 등. 한 화면에 여러 개 쓰지 않음 (WebGL은 브라우저마다 동시에 16개쯤까지)
import { useEffect, useRef } from "react";
import { GlowCanvas } from "./glowCanvas";
import type { GlowParts } from "./glowParts";

export type GlowEach = (parts: GlowParts, w: number, h: number, n: number) => void;

export function useGlow<T extends HTMLElement>(each: GlowEach, className = "glow-layer"): React.RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const g = new GlowCanvas(el, className);
    let raf = 0;
    let n = 0;
    const loop = () => {
      const dt = g.tick();
      if (g.ready() && g.parts) {
        const { w, h } = g.size();
        each(g.parts, w, h, n++);
        g.render(dt, 1, 0, 0);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      g.destroy();
    };
  }, [each, className]);
  return ref;
}
