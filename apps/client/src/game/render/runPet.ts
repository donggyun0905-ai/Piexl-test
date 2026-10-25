// 판에 데려온 로비 펫: 플레이어 뒤를 졸졸 따라다님 (그림은 lobby/petArt)
import type { RunState } from "@pixel-rogue/shared";
import { drawPetArt } from "../../lobby/petArt";
import { lerp, type Snap } from "./palette";

export function drawRunPet(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (!s.pet || p.hp <= 0) return;
  const face = p.faceX < 0 ? -1 : 1;
  const x = lerp(p.prevX, p.x, alpha) - face * 13;
  const y = lerp(p.prevY, p.y, alpha) + p.r + 1;
  drawPetArt(ctx, s.pet, snap(x), snap(y), face, s.tick / 60);
}
