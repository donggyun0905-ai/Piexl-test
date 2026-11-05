// Canvas 2D 그리기 → 빛 층 다리: 그리는 쪽이 shadowBlur(폰에서 느린 번짐) 대신 "여기 빛"을 남기면 게임 빛 층이 받아 그림
// 빛 층이 실제로 돌고 있을 때만 받음 (꺼져 있거나 WebGL이 없으면 false → 그리는 쪽은 예전처럼 shadowBlur로 번짐)
// 자리는 캔버스 픽셀로 저장 (ctx 변환을 거친 뒤) → glowLayer가 게임 좌표로 되돌림

export interface GlowHint {
  /** 캔버스 픽셀 자리·지름 */
  x: number;
  y: number;
  d: number;
  color: string;
}

let active = false;
const hints: GlowHint[] = [];

/** 게임 빛 층이 그릴 수 있는지 (glowLayer가 매 화면 정함) */
export function setGlowActive(v: boolean): void {
  active = v;
  if (!v) hints.length = 0;
}

/** 빛 남기기 (지금 ctx 변환 기준 x·y, 지름 size). 받았으면 true → shadowBlur 생략 */
export function glowHint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): boolean {
  if (!active) return false;
  if (hints.length >= 120) return true;
  const m = ctx.getTransform();
  hints.push({ x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f, d: size * Math.hypot(m.a, m.b), color });
  return true;
}

/** 네모(용암 등)를 따라 빛 여러 개 */
export function glowHintRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string): boolean {
  if (!active) return false;
  const d = Math.min(w, h) * 2.4;
  const n = Math.max(1, Math.min(8, Math.round(Math.max(w, h) / Math.max(4, Math.min(w, h)))));
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    glowHint(ctx, w >= h ? x + w * t : x + w / 2, w >= h ? y + h / 2 : y + h * t, d, color);
  }
  return true;
}

/** 이번 화면에 남은 빛 모두 꺼냄 */
export function takeGlowHints(): GlowHint[] {
  return hints.splice(0);
}
