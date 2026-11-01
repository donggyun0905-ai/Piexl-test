// 단련의 방 미니게임 공용: 매 프레임 돌리기 · 미니게임 중 게임 조작 키 막기(화살표·WASD·Space·F) · 터지는 조각 효과 · 점수 한도
import { useEffect, useLayoutEffect, useRef } from "react";

/** 점수 한도 (sim/gym: 100점마다 포인트 1, 최대 10) */
export const MAX_SCORE = 1000;

/** 매 프레임 fn(지난 프레임부터 흐른 초, 시작부터 흐른 초) */
export function useFrame(fn: (dt: number, t: number) => void, on = true): void {
  const ref = useRef(fn);
  useLayoutEffect(() => {
    ref.current = fn;
  });
  useEffect(() => {
    if (!on) return;
    let id = 0;
    let last = performance.now();
    const t0 = last;
    const step = (now: number) => {
      ref.current(Math.min(0.05, (now - last) / 1000), (now - t0) / 1000);
      last = now;
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [on]);
}

const BLOCK = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD", "Space", "KeyF", "Enter"]);

/** 미니게임 중에는 이 키들이 게임(캐릭터 이동·F)으로 가지 않고 미니게임에만 (onKey가 받음) */
export function useGymKeys(onKey: (code: string) => void, on = true): void {
  const ref = useRef(onKey);
  useLayoutEffect(() => {
    ref.current = onKey;
  });
  useEffect(() => {
    if (!on) return;
    const down = (e: KeyboardEvent) => {
      if (!BLOCK.has(e.code)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!e.repeat) ref.current(e.code);
    };
    const up = (e: KeyboardEvent) => {
      if (BLOCK.has(e.code)) e.stopImmediatePropagation();
    };
    window.addEventListener("keydown", down, true);
    window.addEventListener("keyup", up, true);
    return () => {
      window.removeEventListener("keydown", down, true);
      window.removeEventListener("keyup", up, true);
    };
  }, [on]);
}

export interface Burst {
  x: number;
  y: number;
  age: number;
  color: string;
}

/** 터지는 효과: 바깥으로 퍼지는 조각 + 고리 (age 0 → 0.5초) */
export function drawBursts(ctx: CanvasRenderingContext2D, list: Burst[], dt: number): Burst[] {
  for (const b of list) {
    b.age += dt;
    const k = b.age / 0.5;
    ctx.globalAlpha = Math.max(0, 1 - k);
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 10 + k * 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.fillRect(b.x + Math.cos(a) * (8 + k * 40) - 2, b.y + Math.sin(a) * (8 + k * 40) - 2, 4, 4);
    }
  }
  ctx.globalAlpha = 1;
  return list.filter((b) => b.age < 0.5);
}

/** 화면에 깔리는 큰 숫자 글자 (점수·안내) */
export function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string): void {
  ctx.font = `bold ${size}px sans-serif`;
  ctx.textAlign = "center";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#140f1c";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}
