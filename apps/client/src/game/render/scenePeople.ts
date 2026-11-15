// 장면 그리기 도우미 (render/index에서 뗌): 사람마다 자리를 바꿔 그리기 · 마우스 자리 → 게임 좌표
import { useSeat, type RunState } from "@pixel-rogue/shared";
import { pwShown } from "./pwLook";
import type { DrawOptions } from "./index";

/** 사람마다 그 자리를 꺼내 놓고 그림 (협동은 다른 사람 먼저, 나는 맨 위). me: 내 자리 */
/** 패왕전: 쓰러진 사람·수풀에 숨은 상대는 몸·장치·효과를 하나도 그리지 않음 */
export function eachPerson(s: RunState, fn: (me: boolean) => void): void {
  const party = s.party;
  if (!party) return fn(true);
  const mine = s.seat ?? 0;
  for (let i = 0; i < party.length; i++) {
    if (i === mine || (s.pvp && !pwShown(s, i))) continue;
    useSeat(s, i);
    fn(false);
  }
  useSeat(s, mine);
  if (!s.pvp || pwShown(s, mine)) fn(true);
}

/** 마우스 자리 → 게임 좌표 */
export function cursorWorld(ctx: CanvasRenderingContext2D, opt: DrawOptions, k: number, camX: number, camY: number): { x: number; y: number } | null {
  const m = opt.cursor?.();
  if (!m) return null;
  const r = ctx.canvas.getBoundingClientRect();
  return { x: ((m.x - r.left) * (ctx.canvas.width / r.width)) / k + camX, y: ((m.y - r.top) * (ctx.canvas.height / r.height)) / k + camY };
}

