// 시즌 1 보스·일반 몬스터 공격 그림: 보스가 있는 방이면 그 보스 색·모양으로 베기·찌르기·터짐을 그림 · 박격포 포탄 · 쏜 적마다 다른 탄
// 강철 거구(쇳조각) · 무리 여왕(알) · 공허의 눈(눈동자 구슬) · 검은 기사(보랏빛 검기) · 활잡이 · 세이렌 · 켄타우로스 · 하드플랜트 · 데스 · 검신 · 천사장 · 침 뱉는 적(산성 침)
import type { EffectState, Hazard, ProjectileState, RunState } from "@pixel-rogue/shared";
import { additive, alpha, beam, crescent, glow, shock, sparks } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 보스·적마다 빛 색: 주 색 · 밝은 색 */
const PAL: Record<string, readonly [string, string]> = {
  hulk: ["#ff9a3c", "#e8ecf4"],
  brood: ["#a0e060", "#d88aff"],
  seer: ["#b06aff", "#ff8ae8"],
  knight: ["#8a5ad8", "#e8dcff"],
  archer: ["#7ad86a", "#fff4c0"],
  siren: ["#5ae8ff", "#ff9ad8"],
  centaur: ["#e8a040", "#fff0c8"],
  plant: ["#5ac84a", "#e0ffa0"],
  reaper: ["#7affc8", "#c8a8ff"],
  swordgod: ["#ffe08a", "#ffffff"],
  archangel: ["#fff0b0", "#ffffff"],
  spitter: ["#9ae84a", "#e8ffb0"],
  mortar: ["#ff8a3a", "#ffe0a0"],
};

/** 지금 방의 시즌 1 보스 (없으면 null) */
function bossOf(s: RunState): string | null {
  for (const e of s.enemies) if (e.hp > 0 && e.kind !== "dummy" && PAL[e.kind] && e.kind !== "spitter" && e.kind !== "mortar") return e.kind;
  return null;
}

/** 위험 표시가 터진 효과를 그 보스(또는 박격포) 모양으로 그리면 true */
export function drawS1BossFx(ctx: Ctx, s: RunState, fx: EffectState, snap: Snap): boolean {
  if (!fx.foe) return false;
  const who = fx.from ?? bossOf(s);
  const pal = who ? PAL[who] : undefined;
  if (!pal || !who) return false;
  const [c, hi] = pal;
  const t = fx.ticks / fx.maxTicks;
  const u = 1 - t;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const seed = fx.x * 3 + fx.y;
  switch (fx.kind) {
    case "bslash": {
      // 보스 칼날: 그 보스 색 두 겹 초승달 + 날 끝 불똥 (한 바퀴면 충격파)
      const r = fx.size * (1.05 - 0.15 * t);
      additive(ctx, () => {
        if ((fx.width ?? -1) <= -1) {
          shock(ctx, x, y, r, c, t, 9);
          shock(ctx, x, y, r * 0.9, hi, t * 0.7, 3);
        } else {
          const a = Math.atan2(fx.dirY, fx.dirX);
          const half = Math.acos(fx.width ?? 0);
          crescent(ctx, x, y, r, a, half, 8 * t + 1, c, t);
          crescent(ctx, x, y, r * 0.86, a, half * 0.85, 3 * t, hi, t * 0.9);
          sparks(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r, 6, r * 0.5, u, hi, seed);
        }
      });
      return true;
    }
    case "stab": {
      // 창·돌진 찌르기: 그 보스 색 빛 창날 + 끝의 빛 + 지나간 바람
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const k = Math.min(1, u * 4);
      const ex = x + (tx - x) * k;
      const ey = y + (ty - y) * k;
      additive(ctx, () => {
        beam(ctx, x, y, ex, ey, (fx.width ?? 3) + 2, c, t);
        glow(ctx, ex, ey, 10 + 6 * t, hi, t, 1.5);
      });
      return true;
    }
    case "gleam": {
      // 검신 검기: 금빛 빛줄기 + 줄을 따라 번쩍이는 칼빛
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      additive(ctx, () => {
        beam(ctx, x, y, tx, ty, 2 + 4 * t, c, t);
        for (let k = 0.2; k < 1; k += 0.2) glow(ctx, x + (tx - x) * k, y + (ty - y) * k, 5 + 4 * t, hi, t, 1.2);
      });
      return true;
    }
    case "burst": {
      if (who === "mortar") {
        // 박격포 포탄 터짐: 섬광 → 불 충격파 → 검은 연기 · 흙 조각
        ctx.fillStyle = `rgba(40, 30, 30, ${0.4 * t})`;
        ctx.beginPath();
        ctx.arc(x, y - u * 4, fx.size * (1 + u), 0, TAU);
        ctx.fill();
        additive(ctx, () => {
          glow(ctx, x, y, fx.size * 2, c, t, u < 0.25 ? 1.6 : 0.4);
          shock(ctx, x, y, fx.size * (0.8 + u * 1.5), c, t, 6);
          sparks(ctx, x, y, 10, fx.size * 2.5, u, hi, seed);
        });
        return true;
      }
      // 보스 탄 터짐: 그 보스 색 빛 + 충격파
      additive(ctx, () => {
        glow(ctx, x, y, fx.size * 1.8, c, t, 1);
        shock(ctx, x, y, fx.size * (0.8 + u), hi, t, 5);
        sparks(ctx, x, y, 8, fx.size * 2, u, c, seed);
      });
      return true;
    }
    default:
      return false;
  }
}

/** 박격포 위험 표시: 하늘에서 떨어지는 포탄 (가까워질수록 그림자가 짙고 포탄이 커짐) */
export function drawMortarShell(ctx: Ctx, h: Hazard, f: number, tick: number): void {
  if (h.from !== "mortar") return;
  const y0 = h.y - 80 * (1 - f);
  ctx.fillStyle = `rgba(0, 0, 0, ${0.15 + 0.35 * f})`;
  ctx.beginPath();
  ctx.ellipse(h.x, h.y + 2, 3 + 6 * f, 1.5 + 2.5 * f, 0, 0, TAU);
  ctx.fill();
  additive(ctx, () => beam(ctx, h.x, y0 - 14, h.x, y0, 3, "#ffb060", 0.4 + 0.4 * f));
  ctx.fillStyle = "#2a2a32";
  ctx.beginPath();
  ctx.arc(h.x, y0, 2.5 + f, 0, TAU);
  ctx.fill();
  // 심지 불꽃
  additive(ctx, () => glow(ctx, h.x, y0 - 3, 3, "#ffb040", (tick >> 1) % 2 ? 1 : 0.6, 1));
}

/** 쏜 적마다 다른 탄 (모양 없는 적 탄): 그리면 true */
export function drawFoeShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.fromPlayer || pr.look || !pr.from) return false;
  const pal = PAL[pr.from];
  if (!pal) return false;
  const [c, hi] = pal;
  const v = Math.hypot(pr.vx, pr.vy) || 1;
  const ux = pr.vx / v;
  const uy = pr.vy / v;
  const r = pr.r;
  additive(ctx, () => {
    beam(ctx, x - ux * r * 4, y - uy * r * 4, x, y, r * 1.4, c, 0.55);
    glow(ctx, x, y, r * 2.8, c, 0.8);
  });
  switch (pr.from) {
    case "hulk": {
      // 달궈진 쇳조각: 도는 모난 쇠 + 붉은 열
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tick / 3 + pr.id);
      ctx.fillStyle = "#5a5a68";
      ctx.fillRect(-r, -r * 0.6, r * 2, r * 1.2);
      ctx.fillStyle = "#ff9a3c";
      ctx.fillRect(-r * 0.4, -r * 0.6, r * 0.8, r * 0.5);
      ctx.restore();
      return true;
    }
    case "brood": {
      // 벌레 알: 연두 알 + 보랏빛 속 + 꿈틀
      ctx.fillStyle = "#3a5a1a";
      ctx.beginPath();
      ctx.ellipse(x, y, r + 1, r + 0.4 + Math.sin(tick / 3 + pr.id) * 0.5, Math.atan2(uy, ux), 0, TAU);
      ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.8, Math.atan2(uy, ux), 0, TAU);
      ctx.fill();
      ctx.fillStyle = hi;
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
      return true;
    }
    case "seer": {
      // 공허의 눈 구슬: 검은 구슬 속에서 나를 노려보는 눈동자
      ctx.fillStyle = "#14082a";
      ctx.beginPath();
      ctx.arc(x, y, r + 1, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = alpha(c, 0.9);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = hi;
      ctx.beginPath();
      ctx.ellipse(x + ux, y + uy, r * 0.55, r * 0.3, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillRect(Math.round(x + ux) - 0.5, Math.round(y + uy) - 1, 1, 2);
      return true;
    }
    case "spitter": {
      // 산성 침: 초록 방울 + 떨어지는 침방울
      ctx.fillStyle = "#3a6a14";
      ctx.beginPath();
      ctx.arc(x, y, r + 0.8, 0, TAU);
      ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x - 0.5, y - 0.5, r, 0, TAU);
      ctx.fill();
      ctx.fillStyle = hi;
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 2, 1, 1);
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x - ux * 5), Math.round(y - uy * 5 + ((tick >> 2) % 3)), 1, 2);
      return true;
    }
    default: {
      // 그 밖의 보스 탄: 그 보스 색 구슬 + 밝은 속
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
      ctx.fillStyle = hi;
      ctx.beginPath();
      ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.45, 0, TAU);
      ctx.fill();
      return true;
    }
  }
}
