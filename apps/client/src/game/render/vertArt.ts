// 베르 그리기: 효과 시트 그림 한 칸 · 방에 남는 꽃·덩굴·포식자·썩은 땅 · 덩굴 인형 · 씨앗 점 (악마 계급 마크는 느아르와 같이 render/noirArt)
// 그림 sprites/vertFx.png (192칸 4×16, 줄 차례는 ROW) — scripts/art/vert.py
import { ENEMIES, VT_EXTRA, VT_SKILLS, type RunState } from "@pixel-rogue/shared";
import { drawEnemySprite } from "../sprites";
import { img } from "./lunaticFx";
import { sheetPic } from "./noirArt";
import { lerp, type Snap } from "./palette";
import { additive, glow, type Ctx } from "./pwFxBits";

export const VT = { green: "#7ae05a", light: "#d8ffb0", deep: "#2a7a1a", poison: "#5ac83a" };
/** 효과 시트의 줄 (scripts/art/vert.py ROWS 차례) */
export const ROW = {
  vtSlash: 0, vtSpin: 1, vtFrenzy: 2, vtWhip: 3, vtSeed: 4, vtBloom: 5, vtDrain: 6, vtWither: 7,
  vtGarden: 8, vtForest: 9, vtErode: 10, vtPrison: 11, vtThrall: 12, vtMaw: 13, vtDance: 14, vtEnd: 15,
} as const;
export const vtPic = sheetPic(img("vertFx"));

/** 바닥: 체내 개화 꽃 · 시든 덩굴 · 만개의 포식자(평소 4칸, 물 때 3칸) · 대지 부식 땅 */
export function drawVertFloor(ctx: Ctx, s: RunState, snap: Snap): void {
  for (const f of s.player.vtPlants ?? []) {
    const [x, y] = [snap(f.x), snap(f.y)];
    const a = Math.min(1, (f.until - s.tick) / 20);
    if (f.kind === "erode") continue;
    if (f.kind === "gas") {
      additive(ctx, () => glow(ctx, x, y, VT_EXTRA.gas.r, VT.poison, 0.12 * a, 0));
      vtPic(ctx, ROW.vtBloom, 3, x, y, 64, 0.85 * a);
    } else if (f.kind === "vine") vtPic(ctx, ROW.vtWither, 3, x, y, 60, 0.8 * a);
    else vtPic(ctx, ROW.vtMaw, (f.bite ?? 0) > s.tick ? 2 : 3, x, y, VT_SKILLS.maw.r * 1.6, a);
  }
}

/** 몸 위: 덩굴 인형(되살린 적 · 초록 빛) · 씨앗이 있는 적 머리 위 씨앗 점 */
export function drawVertAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "vert") return;
  for (const t of p.vtThralls ?? []) {
    const x = snap(lerp(t.prevX, t.x, alpha));
    const y = snap(lerp(t.prevY, t.y, alpha));
    additive(ctx, () => glow(ctx, x, y + t.r * 0.6, t.r + 6, VT.green, 0.3));
    const frame = t.swing > 0 ? 3 : Math.floor(s.tick / 12) % 2;
    if (!drawEnemySprite(ctx, t.kind, x, y, frame, t.face < 0, [VT.deep, 0.45], t.r / ENEMIES[t.kind].radius)) {
      ctx.fillStyle = VT.deep;
      ctx.fillRect(x - t.r, y - t.r, t.r * 2, t.r * 2);
    }
  }
  for (const e of s.enemies) {
    const n = e.vtSeed ?? 0;
    if (e.hp <= 0 || n <= 0) continue;
    const [x, y] = [snap(e.x), snap(e.y - e.r)];
    ctx.fillStyle = VT.green;
    for (let i = 0; i < n; i++) ctx.fillRect(x - n * 1.5 + i * 3, y - 5, 2, 2);
  }
}
