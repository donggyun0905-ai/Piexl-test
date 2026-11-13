// 아슈바르 효과 시트(4칸) 넘기기 (블뢰·존): 짧은 효과는 차례대로 한 번 · 긴 효과는 첫 칸부터 차례로 → 가운데 칸들을 부드럽게 오감(반복) → 끝 OUTRO 틱 동안 마지막 칸 (docs/FX_FRAMES.md)
// 다음 칸과 겹쳐(빛 더하기) 넘어가서 칸이 적어도 여러 장처럼 보임 · 겹치는 동안 두 칸 모두 밝게 (어두워졌다 밝아지는 깜빡임 없게)
import type { sheetPic } from "./noirArt";
import type { Ctx } from "./pwFxBits";

type Pic = ReturnType<typeof sheetPic>;
/** 반복에 쓰는 칸: 칸 번호 · 좌우 뒤집기 */
export type Frame = readonly [number, boolean];
/** 보통 반복 (가운데 두 칸) */
export const MID: readonly Frame[] = [[1, false], [2, false]];
/** 이보다 짧은 효과는 반복 없이 차례대로 */
const SHORT = 32;
/** 처음 칸들(0 → 반복 첫 칸)을 하나 넘기는 틱 */
const STEP = 5;
const OUTRO = 10;

/** 효과 하나 그리기 (ticks: 남은 틱) · period: 반복 칸 하나가 머무는 틱 */
export function sheetLoop(ctx: Ctx, pic: Pic, row: number, ticks: number, maxTicks: number, x: number, y: number, w: number, a: number, rot = 0, flip = false, loop: readonly Frame[] = MID, period = 8): void {
  const draw = ([col, f]: Frame, k: number) => k > 0.01 && pic(ctx, row, col, x, y, w, a * k, rot, f !== flip);
  const e = maxTicks - ticks;
  if (maxTicks < SHORT) {
    const pos = Math.min(3, (e / Math.max(6, maxTicks * 0.75)) * 3);
    const col = Math.floor(pos);
    return col < 3 ? blend(draw, [col, false], [col + 1, false], pos - col) : void draw([3, false], 1);
  }
  // 처음: 0칸부터 반복 첫 칸까지 차례로 (예: 반복이 2칸부터면 0 → 1 → 2)
  const first = loop[0]!;
  const intro = STEP * Math.max(1, first[0]);
  if (e < intro) {
    const k = e / STEP;
    const c = Math.floor(k);
    return blend(draw, [c, false], c + 1 >= first[0] ? first : [c + 1, false], k - c);
  }
  const pos = (e - intro) / period;
  const i = Math.floor(pos);
  const m = pos - i;
  const out = ticks < OUTRO ? 1 - ticks / OUTRO : 0;
  if (out > 0) return blend(draw, loop[i % loop.length]!, [3, false], out);
  blend(draw, loop[i % loop.length]!, loop[(i + 1) % loop.length]!, m);
}

/** 두 칸 겹치기 (m: 0 앞 칸 → 1 뒤 칸) · 가운데에서 둘 다 다 밝음 */
function blend(draw: (f: Frame, k: number) => unknown, a: Frame, b: Frame, m: number): void {
  draw(a, Math.min(1, 2 * (1 - m)));
  draw(b, Math.min(1, 2 * m));
}
