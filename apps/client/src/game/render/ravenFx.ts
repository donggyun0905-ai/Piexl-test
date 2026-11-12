// 레이븐 효과 (기본 공격·확률 기물): 킹 내려찍기 · 퀸 빛기둥 · 체크·체크메이트 · 나이트 도약 · 비숍 대각선 · 퀸 칙령 · 킹 심판 · 승격 퀸 폭발 · 폰 맞음
// 스킬 효과는 ravenFxSkills
import type { EffectState } from "@pixel-rogue/shared";
import { PIECE, RV, rvPiece, rvPieceLit } from "./ravenArt";
import { crown, drawRavenSkillFx, pillar } from "./ravenFxSkills";
import type { Snap } from "./palette";
import { additive, alpha, beam, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";

/** 금빛 바닥 갈라짐 (내려찍기) */
function cracks(ctx: Ctx, x: number, y: number, r: number, a: number, seed: number): void {
  ctx.strokeStyle = alpha(RV.gold, a);
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 6; i++) {
    const ang = i * 1.05 + seed * 0.37;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(ang) * r * 0.5, y + Math.sin(ang) * r * 0.3);
    ctx.lineTo(x + Math.cos(ang + 0.25) * r, y + Math.sin(ang + 0.25) * r * 0.55);
    ctx.stroke();
  }
}

const KINDS = new Set(["rvSlam", "rvPillar", "rvMatePop", "rvCheck", "rvKnight", "rvKnightLand", "rvBeam", "rvDecree", "rvJudge", "rvPromo", "rvPawnHit"]);

export function drawRavenFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return drawRavenSkillFx(ctx, fx, snap);
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  switch (fx.kind) {
    case "rvSlam": {
      // 킹 내려찍기: 흑금 충격파 + 갈라짐 + 먼지
      cracks(ctx, x, y, r * 1.1, 0.8 * (1 - f), fx.x);
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.4 + easeOut(f) * 0.8), RV.gold, 0.9 * (1 - f), 6);
        glow(ctx, x, y, r * 0.9, RV.violet, 0.5 * (1 - f), 0.3);
        sparks(ctx, x, y, 10, r * 1.3, f, RV.pale, fx.x + fx.y, 1);
      });
      return true;
    }
    case "rvPillar": {
      // 퀸 빛기둥: 솟구쳤다 가늘어짐 (style 1 = 여왕의 광휘 작은 기둥)
      const up = Math.min(1, f * 4);
      pillar(ctx, x, y, r * (1 - f * 0.5), 90 * up * (fx.style ? 0.7 : 1), 1 - f);
      additive(ctx, () => sparks(ctx, x, y - 20, 8, r * 2, f, RV.pale, fx.x, 1));
      return true;
    }
    case "rvMatePop": {
      // 체크메이트: 금빛 왕관 + 빛살 열둘
      additive(ctx, () => {
        glow(ctx, x, y, r * (1 + f), RV.gold, 0.8 * (1 - f), 0.8);
        for (let i = 0; i < 12; i++) {
          const ang = (i / 12) * Math.PI * 2 + f;
          beam(ctx, x + Math.cos(ang) * r * 0.4, y + Math.sin(ang) * r * 0.4, x + Math.cos(ang) * r * (0.8 + f), y + Math.sin(ang) * r * (0.8 + f), 1.5, RV.gold, 0.8 * (1 - f));
        }
      });
      crown(ctx, x, y - r * 0.6 - f * 10, 14 + f * 6, 1 - f * f);
      return true;
    }
    case "rvCheck": {
      additive(ctx, () => ring(ctx, x, y, r * (0.6 + f * 0.6), alpha(RV.gold, 0.9 * (1 - f)), 2));
      return true;
    }
    case "rvKnight": {
      // 나이트 도약: 가로로 한 번, 세로로 한 번 뛰는 L자 · 금빛 잔상 · 마지막에 내려찍음
      const tx = snap(fx.toX ?? x);
      const ty = snap(fx.toY ?? y);
      const leg = f < 0.5 ? f * 2 : (f - 0.5) * 2;
      const [ax, ay, bx, by] = f < 0.5 ? [x, y, tx, y] : [tx, y, tx, ty];
      const px = ax + (bx - ax) * leg;
      const py = ay + (by - ay) * leg - Math.sin(leg * Math.PI) * 26;
      additive(ctx, () => {
        beam(ctx, x, y, tx, y, 1.2, RV.gold, 0.35 * (1 - f));
        beam(ctx, tx, y, tx, ty, 1.2, RV.gold, 0.35 * (1 - f));
        for (let k = 1; k <= 3; k++) glow(ctx, px - (bx - ax) * 0.05 * k, py + 6 * k, 10, RV.gold, 0.25 / k);
      });
      rvPieceLit(ctx, PIECE.goldKnight, px, py + 14, 34, 1, RV.gold, tx < x);
      return true;
    }
    case "rvKnightLand": {
      additive(ctx, () => {
        shock(ctx, x, y, r * easeOut(f) * 1.2, RV.gold, 1 - f, 7);
        sparks(ctx, x, y, 14, r * 1.5, f, RV.gold, fx.y, 1);
      });
      cracks(ctx, x, y, r, 0.7 * (1 - f), fx.y);
      return true;
    }
    case "rvBeam": {
      // 비숍: 먼저 나타나 예고선 → 양쪽 대각선 금빛 광선
      const len = r;
      const fire = 8 / fx.maxTicks;
      const g = f < fire ? 0 : (f - fire) / (1 - fire);
      rvPieceLit(ctx, PIECE.bishop, x, y + 8, 28, f < 0.85 ? 1 : (1 - f) / 0.15, RV.pale);
      additive(ctx, () => {
        for (const sgn of [1, -1]) {
          const dx = (fx.dirX - sgn * fx.dirY) * Math.SQRT1_2;
          const dy = (fx.dirY + sgn * fx.dirX) * Math.SQRT1_2;
          if (g <= 0) beam(ctx, x - dx * len, y - dy * len, x + dx * len, y + dy * len, 1, RV.pale, 0.4);
          else beam(ctx, x - dx * len, y - dy * len, x + dx * len, y + dy * len, (fx.width ?? 10) * (1.2 - g * 0.8), RV.gold, 1 - g);
        }
        if (g > 0) glow(ctx, x, y - 10, 30, RV.gold, 0.6 * (1 - g), 0.6);
      });
      return true;
    }
    case "rvDecree": {
      // 퀸 칙령: 백색 퀸이 떠오르며 빛남 → 8방향 빛살
      const up = easeOut(Math.min(1, f * 1.6));
      additive(ctx, () => glow(ctx, x, y - up * 14, 26, RV.pale, 0.6 * (1 - f * 0.5), 0.5));
      rvPiece(ctx, PIECE.queen, x, y + 10 - up * 14, 30, f < 0.8 ? 1 : (1 - f) / 0.2);
      if (f > 0.45)
        additive(ctx, () => {
          for (let i = 0; i < 8; i++) {
            const ang = (i * Math.PI) / 4;
            beam(ctx, x, y - 8, x + Math.cos(ang) * 30, y - 8 + Math.sin(ang) * 30, 1.5, RV.gold, (1 - f) * 1.6);
          }
        });
      return true;
    }
    case "rvJudge": {
      // 킹 심판: 땅에 그림자가 커지고 거대한 흑색 킹이 하늘에서 떨어짐 → 쾅
      const fall = 30 / fx.maxTicks;
      if (f < fall) {
        const k = f / fall;
        ctx.fillStyle = `rgba(20, 10, 40, ${0.15 + 0.35 * k})`;
        ctx.beginPath();
        ctx.ellipse(x, y, r * (0.4 + 0.6 * k), r * 0.35 * (0.4 + 0.6 * k), 0, 0, Math.PI * 2);
        ctx.fill();
        ring(ctx, x, y, r, alpha(RV.gold, 0.3 + 0.4 * k), 1);
        rvPiece(ctx, PIECE.king, x, y - (1 - k * k) * 140, r * 1.6, 0.4 + 0.6 * k);
      } else {
        const k = (f - fall) / (1 - fall);
        rvPieceLit(ctx, PIECE.king, x, y + r * 0.2, r * 1.6, 1 - k, RV.violet);
        additive(ctx, () => {
          shock(ctx, x, y, r * (0.6 + easeOut(k) * 0.9), RV.violet, 1 - k, 9);
          glow(ctx, x, y, r * 1.2, RV.gold, 0.7 * (1 - k), 0.5);
          sparks(ctx, x, y, 18, r * 1.8, k, RV.gold, fx.x, 1);
        });
        cracks(ctx, x, y, r * 1.3, 0.8 * (1 - k), fx.x);
      }
      return true;
    }
    case "rvPromo": {
      // 승격: 폰이 거대한 퀸으로 바뀌며 폭발
      const k = Math.min(1, f * 3);
      rvPieceLit(ctx, PIECE.queen, x, y + 12, 30 + k * 20, 1 - f, RV.pale);
      additive(ctx, () => {
        glow(ctx, x, y, r * (0.5 + f), RV.gold, 0.9 * (1 - f), 0.9);
        shock(ctx, x, y, r * easeOut(f) * 1.1, RV.gold, 1 - f, 8);
        sparks(ctx, x, y, 20, r * 1.6, f, RV.pale, fx.x, 1);
      });
      return true;
    }
    case "rvPawnHit": {
      additive(ctx, () => {
        glow(ctx, x, y, r * 1.2, fx.style ? RV.pale : RV.gold, 0.7 * (1 - f), 0.5);
        sparks(ctx, x, y, 5, r * 2, f, RV.gold, fx.x + fx.ticks, 1);
      });
      return true;
    }
  }
  return false;
}
