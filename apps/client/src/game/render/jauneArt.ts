// 존 그리기: 효과 시트 그림 한 칸 · 날아가는 종언의 황천뢰 구체 (악마 계급 마크는 느아르와 같이 render/noirArt)
// 그림 sprites/jauneFx.png (192칸 4×16, 줄 차례는 ROW) — scripts/art/jaune.py
import type { RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import { sheetPic } from "./noirArt";
import type { Snap } from "./palette";
import { additive, glow, type Ctx } from "./pwFxBits";

export const JN = { gold: "#ffd020", light: "#fff6b0", deep: "#ff9a00" };
/** 효과 시트의 줄 (scripts/art/jaune.py ROWS 차례) */
export const ROW = {
  jnClaw: 0, jnFlash: 1, jnRapid: 2, jnFist: 3, jnZig: 4, jnFall: 5, jnClone: 6, jnBind: 7,
  jnOrb: 8, jnChaos: 9, jnHand: 10, jnStep: 11, jnFrenzy: 12, jnBeam: 13, jnThousand: 14, jnEnd: 15,
} as const;
export const jnPic = sheetPic(img("jauneFx"));

/** 몸 위: 날아가는 종언의 구체 (궁극기 그림 첫 칸 + 빛) */
export function drawJauneAir(ctx: Ctx, s: RunState, _alpha: number, snap: Snap): void {
  for (const b of s.player.jnBolts ?? []) {
    const [x, y] = [snap(b.x), snap(b.y)];
    additive(ctx, () => glow(ctx, x, y, 26, JN.gold, 0.6, 0.4));
    jnPic(ctx, ROW.jnEnd, 0, x, y, 52, 1);
  }
}
