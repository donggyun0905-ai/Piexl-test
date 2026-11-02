// 단련의 방 미니게임 공용: 시작 호루라기·운동 박자 · 매 프레임 돌리기 · 미니게임 중 게임 조작 키 막기(화살표·WASD·Space·F)·게임 시간 멈춤 표시 · 터지는 조각 효과 · 점수 한도
import { useEffect, useLayoutEffect, useRef } from "react";
import { play } from "../../audio/sound";

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

/** 시작할 때 호루라기, 끝날 때까지 운동 박자 (speed(): 지금 빠르기 배율, 1이 보통 · 0.5초에 한 번) */
export function useGymBeat(over: () => boolean, speed: () => number = () => 1): void {
  const ref = useRef({ over, speed });
  useLayoutEffect(() => {
    ref.current = { over, speed };
  });
  useEffect(() => {
    play("gymStart");
    let id = 0;
    const beat = () => {
      if (ref.current.over()) return;
      play("gymBeat");
      id = window.setTimeout(beat, 500 / Math.max(0.5, ref.current.speed()));
    };
    id = window.setTimeout(beat, 600);
    return () => clearTimeout(id);
  }, []);
}

/** 미니게임 중인지 (혼자 하는 판은 그동안 게임 시간이 멈춤, GameScreen paused) · 끝나 결과를 보내면 바로 풂 (결과 입력이 처리되게) */
let playing = 0;
export const gymPlaying = () => playing > 0;
export function useGymPause(on: boolean): void {
  useEffect(() => {
    if (!on) return;
    playing++;
    return () => {
      playing--;
    };
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
