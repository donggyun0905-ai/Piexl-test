// 아슈바르 효과 시트(4칸) 넘기기 (블뢰·존): 짧은 효과는 차례대로 한 번 · 긴 효과는 첫 칸 → 가운데 칸들을 부드럽게 오감(반복) → 끝에 마지막 칸
// 다음 칸과 겹쳐(빛 더하기) 넘어가서 칸이 적어도 여러 장처럼 보임
import type { sheetPic } from "./noirArt";
import type { Ctx } from "./pwFxBits";

type Pic = ReturnType<typeof sheetPic>;
/** 반복에 쓰는 칸: 칸 번호 · 좌우 뒤집기 */
export type Frame = readonly [number, boolean];
/** 보통 반복 (가운데 두 칸) */
export const MID: readonly Frame[] = [[1, false], [2, false]];
/** 이보다 짧은 효과는 반복 없이 차례대로 */
const SHORT = 32;
const INTRO = 8;
const OUTRO = 10;

/** 효과 하나 그리기 (ticks: 남은 틱) · period: 반복 칸 하나가 머무는 틱 */
export function sheetLoop(ctx: Ctx, pic: Pic, row: number, ticks: number, maxTicks: number, x: number, y: number, w: number, a: number, rot = 0, flip = false, loop: readonly Frame[] = MID, period = 8): void {
  const draw = ([col, f]: Frame, k: number) => k > 0.01 && pic(ctx, row, col, x, y, w, a * k, rot, f !== flip);
  const e = maxTicks - ticks;
  if (maxTicks < SHORT) {
    const pos = Math.min(3, (e / Math.max(6, maxTicks * 0.75)) * 3);
    const col = Math.floor(pos);
    draw([col, false], col < 3 ? 1 - (pos - col) : 1);
    if (col < 3) draw([col + 1, false], pos - col);
    return;
  }
  if (e < INTRO) {
    draw([0, false], 1 - e / INTRO);
    draw(loop[0]!, e / INTRO);
    return;
  }
  const pos = (e - INTRO) / period;
  const i = Math.floor(pos);
  const m = pos - i;
  const out = ticks < OUTRO ? 1 - ticks / OUTRO : 0;
  draw(loop[i % loop.length]!, (1 - m) * (1 - out));
  draw(loop[(i + 1) % loop.length]!, m * (1 - out));
  draw([3, false], out);
}
