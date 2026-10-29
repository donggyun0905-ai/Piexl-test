// 판에 데려온 로비 펫: 플레이어 뒤를 졸졸 따라다님 (그림은 lobby/petArt) · 애호의 피리면 로비 펫 모두가 줄지어 따라옴
import { LOBBY_PET_IDS, type RunState } from "@pixel-rogue/shared";
import { drawPetArt } from "../../lobby/petArt";
import { lerp, type Snap } from "./palette";

export function drawRunPet(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  const flute = p.passives.includes("petFlute");
  if ((!s.pet && !flute) || p.hp <= 0) return;
  const face = p.faceX < 0 ? -1 : 1;
  const px = lerp(p.prevX, p.x, alpha);
  const py = lerp(p.prevY, p.y, alpha) + p.r + 1;
  const list = flute ? LOBBY_PET_IDS : [s.pet!];
  // 뒤쪽으로 부채꼴로 늘어섬 (가까운 줄 · 먼 줄)
  list.forEach((id, i) => {
    const row = Math.floor(i / 4);
    const col = (i % 4) - 1.5;
    drawPetArt(ctx, id, snap(px - face * (13 + row * 12)), snap(py + col * 7 - row * 2), face, s.tick / 60 + i * 0.3);
  });
}
