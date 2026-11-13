// 마젠타 그리기: 효과 시트 그림 한 칸 · 방의 향기 연기(거의 안 보이게) · 매혹된 적 하트 · 저주 겹 점 (악마 계급 마크는 느아르와 같이 render/noirArt)
// 그림 sprites/magentaFx.png (192칸 4×16, 줄 차례는 ROW) — scripts/art/magenta.py
import { MZ_SCENT, type RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import { sheetPic } from "./noirArt";
import type { Snap } from "./palette";
import { additive, glow, type Ctx } from "./pwFxBits";

export const MZ = { pink: "#ff3ab8", light: "#ffc8f0", deep: "#a01a8a", curse: "#c08aff" };
/** 효과 시트의 줄 (scripts/art/magenta.py ROWS 차례) */
export const ROW = {
  mzRain: 0, mzBloom: 1, mzWave: 2, mzPollen: 3, mzGaze: 4, mzClone: 5, mzVolcano: 6, mzBrand: 7,
  mzPrison: 8, mzGarden: 9, mzVortex: 10, mzErode: 11, mzCollapse: 12, mzSoul: 13, mzStorm: 14, mzEnd: 15,
} as const;
export const mzPic = sheetPic(img("magentaFx"));

/** 작은 하트 (매혹) */
export function heart(ctx: Ctx, x: number, y: number, k: number, color: string, a: number): void {
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.fillStyle = color;
  for (const [dx, dy, w, h] of [[-2, -1, 2, 2], [1, -1, 2, 2], [-3, 0, 7, 2], [-2, 1, 5, 1], [-1, 2, 3, 1], [0, 3, 1, 1]] as const) ctx.fillRect(x + dx * k, y + dy * k, w * k, h * k);
  ctx.restore();
}

/** 바닥 위: 향기 연기 (거의 보이지 않을 만큼 흐릿하게, 천천히 일렁임) */
export function drawMagentaFloor(ctx: Ctx, s: RunState, snap: Snap): void {
  for (const f of s.player.mzScents ?? []) {
    const left = Math.min(1, (f.until - s.tick) / 60);
    const wob = 1 + Math.sin((s.tick + f.x) * 0.03) * 0.06;
    additive(ctx, () => glow(ctx, snap(f.x), snap(f.y), MZ_SCENT.r * wob, MZ.pink, 0.1 * left, 0));
  }
}

/** 몸 위: 매혹된 적 머리 위 하트 · 저주 겹 점 */
export function drawMagentaAir(ctx: Ctx, s: RunState, _alpha: number, snap: Snap): void {
  if (s.player.characterId !== "magenta") return;
  for (const e of s.enemies) {
    if (e.hp <= 0) continue;
    const [x, y] = [snap(e.x), snap(e.y - e.r)];
    if ((e.mzCharm ?? 0) > s.tick) heart(ctx, x - 3, y - 10 + Math.sin(s.tick * 0.15) * 1.5, 1, MZ.pink, 0.9);
    const n = e.mzHex ?? 0;
    ctx.fillStyle = MZ.curse;
    for (let i = 0; i < n; i++) ctx.fillRect(x - n + i * 2, y - 4, 1, 1);
  }
}
