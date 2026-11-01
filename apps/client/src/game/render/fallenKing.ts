// 몰락한 왕 왼쪽 위 영혼 스택 창 (악의 사도 영혼 창과 같은 자리): 잘게 쪼개진 푸른 영혼 조각 그림 + 모은 수 + 늘어난 공격력·체력
import { FALLEN_KING, type RunState } from "@pixel-rogue/shared";
import { hudScale } from "./imugiAura";
import { lerp, type Snap } from "./palette";
import { additive, glow } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;

/** 몸 둘레 (플레이어 다음): 왕관·어깨에서 일렁이는 푸른 불빛 · 위로 날리는 푸른 불티 · 칼날의 붉은 빛 */
export function drawKingAura(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "fallenKing" || p.hp <= 0 || p.kingRoom !== undefined) return;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a));
  const f = 0.75 + 0.25 * Math.sin(s.tick * 0.23) * Math.sin(s.tick * 0.07);
  // 그림 시트 v2 (128칸 → 32, sprites.ts fallenKing)
  additive(ctx, () => {
    glow(ctx, x, y - 36, 9 * f, "#3ab8ff", 0.55 * f, 0.4);
    for (const sx of [-1, 1]) glow(ctx, x + sx * 10, y - 30, 6 * f, "#3ab8ff", 0.45 * f);
    glow(ctx, x - (p.faceX < 0 ? -1 : 1) * 14, y - 36, 8, "#ff2a3a", 0.25 + 0.1 * f);
    for (let i = 0; i < 6; i++) {
      const k = ((s.tick + i * 23) % 90) / 90;
      const ex = x + Math.sin(i * 2.3 + s.tick * 0.03) * (8 + i);
      glow(ctx, ex, y - 26 - k * 28, 1.6 * (1 - k), i % 3 ? "#7ad8ff" : "#e8fbff", 1 - k);
    }
  });
}

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
