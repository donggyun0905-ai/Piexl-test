// 히든 아이템 동료 그림 (p.allies, sim/allies): 그 캐릭터 그림 + 머리 위 체력 줄 · 풋내기 레벨 · 발밑 빛 (월계선 금빛 · 거짓된 용사 은빛)
import type { RunState } from "@pixel-rogue/shared";
import { drawBody } from "./actors";
import { lerp, type Snap } from "./palette";
import { drawCharacter } from "../sprites";

type Ctx = CanvasRenderingContext2D;

export function drawAllies(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  for (const al of s.player.allies ?? []) {
    const x = snap(lerp(al.prevX, al.x, a));
    const y = snap(lerp(al.prevY, al.y, a));
    // 발밑 빛 고리
    ctx.save();
    ctx.globalAlpha = 0.35 + 0.15 * Math.sin(s.tick * 0.1);
    ctx.strokeStyle = al.kind === "laurel" ? "#ffd56a" : "#c8d8ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 7, 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    const pose = { faceX: al.faceX, faceY: al.faceY, moving: al.moving, casting: al.cd > al.rate - 8, step: Math.floor(s.tick / 8) };
    if (al.hurt > 0 && Math.floor(al.hurt / 3) % 2 === 0) ctx.globalAlpha = 0.5;
    if (!drawCharacter(ctx, al.char, x, y, 5, pose)) drawBody(ctx, al.char, x, y, 5, pose, Math.floor(s.tick / 8));
    ctx.globalAlpha = 1;
    // 체력 줄 (머리 위)
    const w = 18;
    const top = y - 26;
    ctx.fillStyle = "#1a0e12";
    ctx.fillRect(x - w / 2 - 1, top - 1, w + 2, 4);
    ctx.fillStyle = al.hp / al.maxHp > 0.35 ? "#5ad05a" : "#ff5a3a";
    ctx.fillRect(x - w / 2, top, Math.max(0, (w * al.hp) / al.maxHp), 2);
    if (al.lv) {
      ctx.font = "bold 5px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffe8a0";
      ctx.fillText(`Lv${al.lv}`, x, top - 2);
    }
  }
}
