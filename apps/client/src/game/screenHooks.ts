// 게임 화면 도우미: 화면 배율 · 뒤로가기 · 맞을 때 흔들림
import { VIEW_HEIGHT, VIEW_WIDTH } from "@pixel-rogue/shared";
import { useEffect, useState, type RefObject } from "react";

/** 화면에 맞는 배율: 남는 곳 없이 꽉 채움 (정수배로 줄이지 않음) */
function fitScale(w: number, h: number): number {
  return Math.max(0.5, Math.min(w / VIEW_WIDTH, h / VIEW_HEIGHT));
}

/** 감싼 칸 크기에 맞춰 배율 조정 */
export function useFitScale(wrapRef: RefObject<HTMLElement | null>): number {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => setScale(fitScale(wrap.clientWidth, wrap.clientHeight)));
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [wrapRef]);
  return scale;
}

/** 모바일 뒤로가기 → 페이지를 나가지 않고 onBack (onBack은 바뀌지 않는 함수로) */
export function useBackButton(onBack: () => void) {
  useEffect(() => {
    history.pushState({ pixelRogueGame: true }, "");
    const onPop = () => {
      history.pushState({ pixelRogueGame: true }, "");
      onBack();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [onBack]);
}

/** 맞으면 캔버스가 잠깐 흔들림. 돌려주는 함수에 세기를 넘김 */
export function createShaker(canvas: HTMLCanvasElement): (power: number) => void {
  let shakeUntil = 0;
  return (power) => {
    shakeUntil = performance.now() + 180;
    const shake = () => {
      const left = shakeUntil - performance.now();
      if (left <= 0) {
        canvas.style.transform = "";
        return;
      }
      const d = power * (left / 180);
      canvas.style.transform = `translate(${(((left * 7) % 3) - 1) * d}px, ${(((left * 13) % 3) - 1) * d}px)`;
      requestAnimationFrame(shake);
    };
    requestAnimationFrame(shake);
  };
}
