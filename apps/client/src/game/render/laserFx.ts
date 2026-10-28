// 레이저·번개·화염·충격파·낙하 표시 효과 (기계공학자 무기, 다른 캐릭터도 같은 종류를 씀): 빛줄기 · 갈라지는 번개 · 일렁이는 불 · 충격파 · 도는 조준선
import type { EffectState, RunState } from "@pixel-rogue/shared";
import { additive, alpha, beam, glow, shock, sparks } from "./pwFxBits";
import { C, lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 갈라지는 번개 한 줄기 (틱마다 모양이 바뀜) */
function zigzag(ctx: Ctx, x: number, y: number, tx: number, ty: number, seed: number, jag: number): void {
  const n = Math.max(3, Math.round(Math.hypot(tx - x, ty - y) / 8));
  const nx = -(ty - y);
  const ny = tx - x;
  const l = Math.hypot(nx, ny) || 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let k = 1; k < n; k++) {
    const u = k / n;
    const off = (Math.sin(seed * 12.9 + k * 78.2) * 43758.5 % 1) * jag;
    ctx.lineTo(lerp(x, tx, u) + (nx / l) * off, lerp(y, ty, u) + (ny / l) * off);
  }
  ctx.lineTo(tx, ty);
  ctx.stroke();
}

/** 레이저 종류 효과면 그리고 true */
export function drawLaserKind(ctx: Ctx, s: RunState, fx: EffectState, x: number, y: number, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  switch (fx.kind) {
    case "beam": {
      // 레이저: 일렁이는 굵기의 빛줄기 + 끝의 빛 덩이와 불똥
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const w = (fx.width ?? 1) * (1.6 + 0.3 * Math.sin(s.tick * 1.3));
      additive(ctx, () => {
        beam(ctx, x, y, tx, ty, w + 1, C.beam, 0.95);
        glow(ctx, x, y, w * 3, C.beam, 0.7);
        glow(ctx, tx, ty, w * 4 + 3, C.beam, 0.9, 1.4);
        sparks(ctx, tx, ty, 4, w * 4 + 6, (s.tick % 6) / 6, "#ffd0b0", s.tick);
      });
      return true;
    }
    case "bolt": {
      // 번개: 두 줄기로 갈라지며 번쩍이는 꺾은선 + 맞은 곳 빛
      const tx = fx.toX ?? fx.x;
      const ty = fx.toY ?? fx.y;
      additive(ctx, () => {
        ctx.lineJoin = "round";
        for (const [c, w, j] of [[alpha(C.bolt, 0.35 * t), 4, 6], [alpha(C.bolt, t), 1.5, 6], ["rgba(255,255,255," + t + ")", 0.8, 6]] as const) {
          ctx.strokeStyle = c;
          ctx.lineWidth = w;
          zigzag(ctx, x, y, tx, ty, s.tick + fx.x, j);
        }
        ctx.strokeStyle = alpha(C.bolt, 0.5 * t);
        ctx.lineWidth = 1;
        zigzag(ctx, x, y, tx, ty, s.tick * 3 + fx.y, 10);
        glow(ctx, tx, ty, 9, C.bolt, t, 1.5);
      });
      return true;
    }
    case "flame": {
      // 화염 방사: 안쪽 흰빛 → 주황 → 붉은 끝으로 일렁이는 부채꼴 + 날리는 불씨
      const a = Math.atan2(fx.dirY, fx.dirX);
      const half = Math.acos(Math.max(-1, Math.min(1, fx.width ?? 0.6)));
      const r = fx.size * (0.92 + 0.08 * Math.sin(s.tick * 0.9));
      additive(ctx, () => {
        const g = ctx.createRadialGradient(x, y, 2, x, y, r);
        g.addColorStop(0, "rgba(255,250,220,0.75)");
        g.addColorStop(0.35, alpha(C.flame, 0.6));
        g.addColorStop(0.8, "rgba(255,80,30,0.35)");
        g.addColorStop(1, "rgba(255,60,20,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, r, a - half, a + half);
        ctx.closePath();
        ctx.fill();
        sparks(ctx, x, y, 7, r, (s.tick % 10) / 10, "#ffd060", s.tick >> 2);
      });
      return true;
    }
    case "ring": {
      if (fx.follow) {
        // 자기장: 옅은 빛 원 + 서로 반대로 도는 점선 두 겹
        additive(ctx, () => {
          glow(ctx, x, y, fx.size, C.bolt, 0.35);
          ctx.setLineDash([3, 4]);
          ctx.lineWidth = 1;
          for (const dir of [1, -1]) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((s.tick / 30) * dir);
            ctx.strokeStyle = alpha(C.bolt, 0.7);
            ctx.beginPath();
            ctx.arc(0, 0, fx.size * (dir > 0 ? 1 : 0.8), 0, TAU);
            ctx.stroke();
            ctx.restore();
          }
          ctx.setLineDash([]);
        });
      } else {
        // 해머·지뢰 충격파: 흙빛 충격파 + 불똥
        const r = Math.max(2, fx.size * (1.1 - t * 0.5));
        additive(ctx, () => {
          glow(ctx, x, y, r * 0.8, C.flame, t * 0.7, 1);
          shock(ctx, x, y, r, C.flame, t, 6);
          sparks(ctx, x, y, 8, r * 1.2, 1 - t, "#ffd060", fx.x + fx.y);
        });
      }
      return true;
    }
    case "mark": {
      // 낙하 표시: 도는 조준선 + 조여 오는 원 + 가운데 빛
      const a = 0.9 - 0.5 * t;
      ctx.save();
      ctx.translate(x, y);
      additive(ctx, () => {
        glow(ctx, 0, 0, fx.size * 0.5, C.beam, a * (1 - t));
        ctx.strokeStyle = alpha(C.beam, a);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, fx.size, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(1, fx.size * t), 0, TAU);
        ctx.stroke();
        ctx.rotate(s.tick / 12);
        ctx.beginPath();
        for (let k = 0; k < 4; k++) {
          const b = (k * Math.PI) / 2;
          ctx.moveTo(Math.cos(b) * fx.size * 0.6, Math.sin(b) * fx.size * 0.6);
          ctx.lineTo(Math.cos(b) * fx.size * 1.25, Math.sin(b) * fx.size * 1.25);
        }
        ctx.stroke();
      });
      ctx.restore();
      return true;
    }
    default:
      return false;
  }
}
