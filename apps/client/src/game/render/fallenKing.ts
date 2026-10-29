// 몰락한 왕 왼쪽 위 영혼 스택 창 (악의 사도 영혼 창과 같은 자리): 잘게 쪼개진 푸른 영혼 조각 그림 + 모은 수 + 늘어난 공격력·체력
import { FALLEN_KING, type RunState } from "@pixel-rogue/shared";
import { hudScale } from "./imugiAura";

type Ctx = CanvasRenderingContext2D;

/** 잘게 쪼개진 영혼 (조각 여섯이 반짝이며 흩어짐) */
const BITS: readonly [number, number, number][] = [[1, -9, 2], [4, -10, 2], [6, -7, 2], [0, -5, 2], [3, -4, 3], [6, -3, 2]];

export function drawKingHud(ctx: Ctx, s: RunState, scale: number): void {
  const p = s.player;
  const n = p.fkSouls ?? 0;
  const k = hudScale(scale);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.88;
  ctx.translate(6, s.party ? ((30 + 5 * s.party.length) * scale) / k : 16);
  ctx.fillStyle = "#0a0e1a";
  ctx.fillRect(-2, -12, 12, 13);
  BITS.forEach(([x, y, w], i) => {
    const tw = Math.floor(s.tick / 10 + i) % 3 === 0;
    ctx.fillStyle = tw ? "#e0f8ff" : i % 2 ? "#3ab8ff" : "#7ad8ff";
    ctx.fillRect(x, y, w, w);
  });
  ctx.font = "bold 11px monospace";
  ctx.textBaseline = "alphabetic";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#0a0e1a";
  const num = String(n);
  ctx.strokeText(num, 13, 0);
  ctx.fillStyle = "#9ad8ff";
  ctx.fillText(num, 13, 0);
  const nw = ctx.measureText(num).width;
  ctx.font = "bold 6px monospace";
  const add = `SOUL  ATK +${(n * FALLEN_KING.soulDamage).toFixed(2)}  HP +${(n * FALLEN_KING.soulHp).toFixed(1)}`;
  ctx.strokeText(add, 16 + nw, 0);
  ctx.fillText(add, 16 + nw, 0);
  ctx.restore();
}
