// 레이븐 스킬 효과: 체스판 금빛 기둥 · 체크메이트 포위(기물 8)·한 대 · 캐슬링 잔상·룩 충격파 · 그랜드 기물·십자 빛·시작 번쩍 (+ 빛기둥·왕관 그림 공용)
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, type EffectState } from "@pixel-rogue/shared";
import { GRAND_PIECES, PIECE, RV, rvPiece, rvPieceLit } from "./ravenArt";
import type { Snap } from "./palette";
import { additive, alpha, beam, easeOut, glow, ring, shock, sparks, type Ctx } from "./pwFxBits";

/** 빛기둥 (발 자리 x, y · 반지름 r · 높이 h · 진하기 a) — 바닥 고리 + 위로 옅어지는 금빛 기둥 + 흰 심 */
export function pillar(ctx: Ctx, x: number, y: number, r: number, h: number, a: number, col = RV.gold): void {
  if (h <= 0 || a <= 0) return;
  additive(ctx, () => {
    const g = ctx.createLinearGradient(x, y - h, x, y);
    g.addColorStop(0, alpha(col, 0));
    g.addColorStop(0.6, alpha(col, 0.55 * a));
    g.addColorStop(1, alpha(RV.pale, 0.9 * a));
    ctx.fillStyle = g;
    ctx.fillRect(x - r * 0.8, y - h, r * 1.6, h);
    ctx.fillStyle = `rgba(255,255,255,${0.7 * a})`;
    ctx.fillRect(x - r * 0.22, y - h * 0.85, r * 0.44, h * 0.85);
    glow(ctx, x, y, r * 1.4, col, 0.6 * a, 0.5);
  });
  ctx.strokeStyle = alpha(RV.pale, 0.8 * a);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.4, 0, 0, Math.PI * 2);
  ctx.stroke();
}

/** 금빛 왕관 (가운데 x, y · 너비 w) */
export function crown(ctx: Ctx, x: number, y: number, w: number, a: number): void {
  if (a <= 0) return;
  const h = w * 0.6;
  ctx.fillStyle = alpha(RV.gold, a);
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y + h / 2);
  ctx.lineTo(x - w / 2, y - h / 2);
  ctx.lineTo(x - w / 4, y);
  ctx.lineTo(x, y - h * 0.7);
  ctx.lineTo(x + w / 4, y);
  ctx.lineTo(x + w / 2, y - h / 2);
  ctx.lineTo(x + w / 2, y + h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = alpha(RV.pale, a);
  ctx.lineWidth = 1;
  ctx.stroke();
}

/** 체크메이트 포위 기물 차례 (8개) */
const RING = [PIECE.rook, PIECE.knight, PIECE.bishop, PIECE.queen, PIECE.rook, PIECE.knight, PIECE.bishop, PIECE.pawn];
const KINDS = new Set(["rvBoardHit", "rvMateRing", "rvMateHit", "rvCastle", "rvRookShock", "rvGrandPiece", "rvCross", "rvGrand"]);

export function drawRavenSkillFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!KINDS.has(fx.kind)) return false;
  const f = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  switch (fx.kind) {
    case "rvBoardHit": {
      // 고른 칸이 금빛으로 차오르다 → 기둥
      const left = fx.ticks;
      if (left > 16) {
        const k = 1 - (left - 16) / (fx.maxTicks - 16);
        ctx.fillStyle = alpha(RV.gold, 0.15 + 0.3 * k);
        ctx.fillRect(x - r * 0.65, y - r * 0.65, r * 1.3, r * 1.3);
        ctx.strokeStyle = alpha(RV.pale, 0.5 + 0.5 * k);
        ctx.lineWidth = 1;
        ctx.strokeRect(x - r * 0.65, y - r * 0.65, r * 1.3, r * 1.3);
      } else {
        const k = 1 - left / 16;
        pillar(ctx, x, y, r * 0.8, 110 * Math.min(1, k * 3), 1 - k);
      }
      return true;
    }
    case "rvMateRing": {
      // 기물 8개가 하나씩 내려앉아 둘러쌈 → 마지막에 가운데로 덮침
      const hold = (fx.maxTicks - 26) / fx.maxTicks;
      const rush = f > hold ? easeOut((f - hold) / (1 - hold)) : 0;
      ring(ctx, x, y, r, alpha(RV.gold, 0.5 * (1 - rush)), 1.5);
      for (let i = 0; i < 8; i++) {
        const born = Math.min(1, Math.max(0, (f / hold) * 8 - i * 0.6));
        if (born <= 0) continue;
        const ang = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const d = r * (1 - rush * 0.85);
        const px = x + Math.cos(ang) * d;
        const py = y + Math.sin(ang) * d;
        additive(ctx, () => beam(ctx, px, py - 8, x, y, 1, RV.gold, 0.3 * born));
        rvPieceLit(ctx, RING[i]!, px, py + 8 - (1 - born) * 20, 22, born * (1 - rush * 0.5), i % 2 ? RV.pale : RV.violet);
      }
      if (rush > 0) additive(ctx, () => glow(ctx, x, y, r * 0.8, RV.gold, 0.8 * rush, 0.7));
      return true;
    }
    case "rvMateHit": {
      const ang = ((fx.style ?? 0) / 8) * Math.PI * 2 - Math.PI / 2;
      additive(ctx, () => {
        beam(ctx, x + Math.cos(ang) * r * 1.3, y + Math.sin(ang) * r * 1.3, x, y, 3, RV.gold, 1 - f);
        sparks(ctx, x, y, 6, r, f, RV.pale, fx.x + (fx.style ?? 0), 1);
      });
      return true;
    }
    case "rvCastle": {
      // 캐슬링: 두 자리 사이 금빛 줄 · 두고 온 자리에 룩, 새 자리에 킹 잔상 · 방어막 고리
      const tx = snap(fx.toX ?? x);
      const ty = snap(fx.toY ?? y);
      additive(ctx, () => {
        beam(ctx, x, y - 8, tx, ty - 8, 3, RV.gold, 0.9 * (1 - f));
        for (let k = 1; k <= 4; k++) glow(ctx, x + (tx - x) * (k / 5), y - 8 + (ty - y) * (k / 5), 9, RV.pale, 0.4 * (1 - f));
        shock(ctx, tx, ty - 6, 18 + easeOut(f) * 16, RV.gold, 1 - f, 5);
      });
      rvPieceLit(ctx, PIECE.rook, x, y + 10, 34, 1 - f * 0.6, RV.violet);
      rvPiece(ctx, PIECE.king, tx + 14, ty + 6, 24, 0.7 * (1 - f));
      return true;
    }
    case "rvRookShock": {
      additive(ctx, () => {
        shock(ctx, x, y, r * (0.4 + easeOut(f) * 0.8), RV.violet, 1 - f, 8);
        glow(ctx, x, y, r, RV.gold, 0.5 * (1 - f), 0.4);
        sparks(ctx, x, y, 12, r * 1.4, f, RV.pale, fx.x, 1);
      });
      return true;
    }
    case "rvGrandPiece": {
      // 그랜드: 기물이 위쪽 바깥에서 날아들어 적을 덮침 (style = 기물 6종)
      const kind = GRAND_PIECES[(fx.style ?? 0) % 6]!;
      const side = (fx.style ?? 0) % 2 ? 1 : -1;
      const k = Math.min(1, f * 2.2);
      const px = x + side * (1 - k) * 90;
      const py = y - (1 - k) * 110;
      if (k < 1) additive(ctx, () => beam(ctx, px, py - 10, x + side * (1 - k) * 60, y - (1 - k) * 70, 2, RV.gold, 0.5));
      rvPieceLit(ctx, kind, px, py + 12, 30, f < 0.8 ? 1 : (1 - f) / 0.2, kind === PIECE.king || kind === PIECE.rook ? RV.violet : RV.gold);
      if (k >= 1) additive(ctx, () => shock(ctx, x, y, r * easeOut((f - 0.45) / 0.55), RV.gold, 1 - f, 6));
      return true;
    }
    case "rvCross": {
      // 킹과 퀸의 십자 빛: 가로·세로로 방을 가르는 금빛 띠 + 가운데에 킹·퀸
      const w = r * (1.2 - f * 0.6);
      const a = f < 0.15 ? f / 0.15 : 1 - (f - 0.15) / 0.85;
      additive(ctx, () => {
        beam(ctx, ROOM_MIN_X, y, ROOM_MAX_X, y, w, RV.gold, a);
        beam(ctx, x, ROOM_MIN_Y, x, ROOM_MAX_Y, w, RV.gold, a);
        glow(ctx, x, y, 90, RV.pale, a, 1);
      });
      rvPieceLit(ctx, PIECE.king, x + 20, y + 10, 56, a, RV.violet);
      rvPieceLit(ctx, PIECE.queen, x - 20, y + 10, 56, a, RV.pale, true);
      return true;
    }
    case "rvGrand": {
      // 시작: 방 가운데에서 금빛 고리 여러 겹 (판 그림은 바닥에서)
      if (f > 0.3) return true;
      const k = f / 0.3;
      additive(ctx, () => {
        for (let i = 0; i < 4; i++) ring(ctx, x, y, 20 + easeOut(Math.max(0, k - i * 0.12)) * 300, alpha(RV.gold, 0.7 * (1 - k)), 3);
        glow(ctx, x, y, 120, RV.pale, 0.6 * (1 - k), 0.8);
      });
      return true;
    }
  }
  return false;
}
