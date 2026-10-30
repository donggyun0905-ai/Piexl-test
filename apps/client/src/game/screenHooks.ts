// 게임 화면 도우미: 화면 배율 · 뒤로가기 · 맞을 때 흔들림
import { VIEW_HEIGHT, VIEW_WIDTH } from "@pixel-rogue/shared";
import { useEffect, useState, type RefObject } from "react";
import { setViewWide } from "./viewSize";

/** 화면에 맞는 배율: 남는 곳 없이 꽉 채움 (정수배로 줄이지 않음) */
function fitScale(w: number, h: number): number {
  return Math.max(0.5, Math.min(w / VIEW_WIDTH, h / VIEW_HEIGHT));
}

/** 로그(넓은 PC 화면): 맵 좌우에 남겨 두는 칸 너비 (왼쪽 능력치·버프 창, 오른쪽 미니맵) */
const SIDE = 180;

/** 감싼 칸 크기에 맞춰 배율 조정. fill(패왕전): 높이에 맞추고 남는 가로는 보이는 영역을 넓혀 채움 → [배율, 가로 넓힘]
 * 로그: 넓은 화면이면 좌우 칸(SIDE)을 빼고 맞춤 · 실제 남은 여백을 CSS --side로 (왼쪽 칸이 맵에 겹치지 않게) */
export function useFitScale(wrapRef: RefObject<HTMLElement | null>, fill = false): [number, number] {
  const [fit, setFit] = useState<[number, number]>([1, 1]);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      const side = !fill && wrap.clientWidth >= 900 ? SIDE : 0;
      const scale = fitScale(wrap.clientWidth - side * 2, wrap.clientHeight);
      wrap.style.setProperty("--side", `${Math.floor((wrap.clientWidth - VIEW_WIDTH * scale) / 2)}px`);
      const wide = fill ? Math.min(2.2, Math.max(1, wrap.clientWidth / scale / VIEW_WIDTH)) : 1;
      setViewWide(wide);
      setFit([scale, wide]);
    });
    ro.observe(wrap);
    return () => {
      ro.disconnect();
      setViewWide(1);
    };
  }, [wrapRef, fill]);
  return fit;
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
