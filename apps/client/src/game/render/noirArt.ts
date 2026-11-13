// 느아르 그리기: 등 뒤 악마 계급 마크 (하위·중위·고위·대악마) · 효과 시트 그림 한 칸
// 그림 sprites/noirFx.png (192칸 4×16, 줄 차례는 ROW) · noirMarks.png (160칸 4×1) — scripts/art/noir.py
import { isAshvar, type RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import { lerp, type Snap } from "./palette";
import { additive, glow, type Ctx } from "./pwFxBits";

export const NR = { violet: "#a05aff", light: "#d8b8ff", red: "#ff3a5a", black: "#140c1e", deep: "#4a1a7a" };
/** 효과 시트의 줄 (scripts/art/noir.py ROWS 차례) */
export const ROW = {
  nrSlash: 0, nrGrasp: 1, nrFlurry: 2, nrSqueeze: 3, nrSpin: 4, nrDrain: 5, nrSever: 6, nrDevour: 7,
  nrOrigin: 8, nrRush: 9, nrRift: 10, nrBrand: 11, nrAbyss: 12, nrBarrier: 13, nrEnd: 14, nrMoon: 15,
} as const;
const FX = img("noirFx");
const MARKS = img("noirMarks");
const C = 192;
const M = 160;
const ok = (i: HTMLImageElement) => i.complete && i.naturalWidth > 0;

/** 효과 시트(192칸) 한 장 → 빛 그림 한 칸 그리는 함수 (row 줄, col 칸) → (x, y) 가운데, 너비 w, 각도 (더해 그림) · flip = 좌우 뒤집기 · 루주도 같이 씀 */
export function sheetPic(sheet: HTMLImageElement) {
  return (ctx: Ctx, row: number, col: number, x: number, y: number, w: number, a = 1, angle = 0, flip = false): void => {
    if (!ok(sheet) || a <= 0) return;
    additive(ctx, () => {
      ctx.save();
      ctx.globalAlpha *= Math.min(1, a);
      ctx.translate(x, y);
      if (angle) ctx.rotate(angle);
      if (flip) ctx.scale(-1, 1);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(sheet, col * C, row * C, C, C, -w / 2, -w / 2, w, w);
      ctx.restore();
    });
  };
}
export const nrPic = sheetPic(FX);

/** 네 칸을 정해진 틱(play 이하) 동안 이어서(다음 칸과 겹쳐 부드럽게) 보여 주고, 끝나면 마지막 칸에서 머묾 (블뢰·존) */
export function sheetPlay(ctx: Ctx, pic: ReturnType<typeof sheetPic>, row: number, ticks: number, maxTicks: number, playMax: number, x: number, y: number, w: number, a: number, rot = 0, flip = false): void {
  const play = Math.max(8, Math.min(playMax, maxTicks * 0.7));
  const pos = Math.min(3, ((maxTicks - ticks) / play) * 3);
  const col = Math.floor(pos);
  const mix = pos - col;
  pic(ctx, row, col, x, y, w, a * (col < 3 ? 1 - mix : 1), rot, flip);
  if (col < 3 && mix > 0) pic(ctx, row, col + 1, x, y, w, a * mix, rot, flip);
}

/** 등 뒤 (몸보다 먼저, 느아르·루주): 악마 계급 마크 · 계급이 오를수록 크고 진하게, 은은히 숨 쉬듯 빛남 */
export function drawNoirBack(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (!isAshvar(p) || !ok(MARKS)) return;
  const rk = Math.max(0, Math.min(3, p.nrRank ?? 0));
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha)) - p.r - 4;
  const w = 34 + rk * 8;
  const pulse = 0.5 + 0.5 * Math.sin(s.tick * 0.06);
  if (rk >= 2) additive(ctx, () => glow(ctx, x, y, w * 0.6, rk === 3 ? NR.red : NR.violet, 0.18 + 0.12 * pulse, 0.5));
  ctx.save();
  ctx.globalAlpha *= 0.55 + rk * 0.1 + 0.1 * pulse;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(MARKS, rk * M, 0, M, M, x - w / 2, y - w / 2, w, w);
  ctx.restore();
}
