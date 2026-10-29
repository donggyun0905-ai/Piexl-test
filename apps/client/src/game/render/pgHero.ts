// 차원의 순례자(히든) 그리기: 땅에 놓인 것(깃발·차원의 문·태엽 폭탄·떨어질 별 자리) · 발밑 수집 도감 칸·배낭 뒤지기 점 · 수집품 탄 7가지 · 효과 (베기·불꽃·냄비·빛줄기·우산·방울·모래·폭발·별똥별·열쇠·배낭에서 튀어나온 수집품·회복)
import { PG_IDS, PILGRIM, pilgrimBook, type EffectState, type ProjectileState, type RunState, type WeaponId } from "@pixel-rogue/shared";
import { iconCanvas } from "../iconArt";
import { lerp, type Snap } from "./palette";
import { additive, alpha, beam, glow, shock, sparks } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const VIO = "#8a5aff";
const VIO_L = "#c8a8ff";
const SKY = "#7ad0f0";
const GOLD = "#ffd040";

function rect(ctx: Ctx, c: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

/** 땅: 깃발(보라 깃발 + 범위 원) · 차원의 문(소용돌이) · 태엽 폭탄(째깍째깍) · 떨어질 별 자리(붉은 원) */
export function drawPgGround(ctx: Ctx, s: RunState, snap: Snap): void {
  for (const m of s.player.pgMarks ?? []) {
    const x = snap(m.x);
    const y = snap(m.y);
    const r = m.r ?? 30;
    if (m.kind === "flag") {
      ctx.strokeStyle = alpha(VIO_L, 0.35);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.stroke();
      rect(ctx, "#8a94a8", x, y - 16, 1, 16);
      const wave = Math.round(Math.sin(s.tick * 0.2));
      rect(ctx, VIO, x + 1, y - 16 + wave, 7, 5);
      rect(ctx, VIO_L, x + 1, y - 16 + wave, 7, 1);
      rect(ctx, GOLD, x + 4, y - 14 + wave, 1, 1);
    } else if (m.kind === "gate") {
      additive(ctx, () => {
        glow(ctx, x, y, r * 0.8, VIO, 0.35, 1);
        for (let i = 0; i < 3; i++) {
          const a = s.tick * (0.08 + i * 0.04) + i * 2;
          ctx.strokeStyle = alpha(i === 1 ? "#6ad8ff" : VIO_L, 0.7);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(x, y, r * (0.5 - i * 0.12), r * (0.35 - i * 0.08), 0, a, a + Math.PI * 1.3);
          ctx.stroke();
        }
      });
      ctx.fillStyle = "rgba(10,2,24,0.8)";
      ctx.beginPath();
      ctx.ellipse(x, y, r * 0.18, r * 0.12, 0, 0, TAU);
      ctx.fill();
    } else if (m.kind === "gear") {
      rect(ctx, "#c88a2a", x - 3, y - 3, 7, 7);
      rect(ctx, "#ffe8a0", x - 2, y - 2, 5, 5);
      rect(ctx, "#3a2a1a", x, y - 2, 1, 3);
      if ((m.t >> 2) % 2) rect(ctx, "#ff4a3a", x + 3, y - 5, 2, 2);
    } else if (m.kind === "meteor") {
      ctx.strokeStyle = alpha("#ff6a3a", 0.5 + 0.4 * Math.sin(s.tick * 0.5));
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.stroke();
      const k = m.t / PILGRIM.meteorFuse;
      additive(ctx, () => glow(ctx, x + 20 * k, y - 70 * k, 7, GOLD, 1, 1.5));
    }
  }
}

/** 발밑: 수집 도감 칸 수 (작은 책 + 숫자) · 배낭 뒤지기까지 남은 점 */
export function drawPgAura(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "pilgrim" || p.hp <= 0) return;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a));
  const n = pilgrimBook(p);
  rect(ctx, "#6a3a8a", x - 12, y + 6, 5, 6);
  rect(ctx, "#f8f4ec", x - 11, y + 7, 3, 4);
  ctx.font = "bold 6px monospace";
  ctx.fillStyle = n >= PG_IDS.length ? GOLD : "#e8f4ff";
  ctx.fillText(String(n), x - 6, y + 12);
  const every = p.passives.includes("pgRummage") ? 3 : PILGRIM.bagEvery;
  const k = p.attackCount % every;
  for (let i = 0; i < every - 1; i++) rect(ctx, i < k ? SKY : "rgba(255,255,255,0.25)", x + 3 + i * 3, y + 9, 2, 2);
}

/** 수집품 탄. 그렸으면 true */
export function drawPgShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (!pr.spirit?.startsWith("pg")) return false;
  const sp = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / sp;
  const dy = pr.vy / sp;
  switch (pr.spirit) {
    case "pgStar":
      additive(ctx, () => glow(ctx, x, y, 6, "#ff6aa8", 0.7, 1.4));
      for (const [ox, oy] of [[0, -3], [-3, 0], [3, 0], [0, 3]] as const) rect(ctx, "#fff0a0", x + ox / 1.5, y + oy / 1.5, 1, 1);
      rect(ctx, "#ffffff", x - 1, y - 1, 2, 2);
      break;
    case "pgNeedle":
      beam(ctx, x - dx * 6, y - dy * 6, x, y, 1, "#ff4a5a", 0.9);
      rect(ctx, "#ffffff", x, y, 1, 1);
      break;
    case "pgBoom": {
      // 빙글빙글 도는 부메랑 (V자)
      const a = tick * 0.5;
      const c = Math.cos(a) * 5;
      const s2 = Math.sin(a) * 5;
      beam(ctx, x - c, y - s2, x, y, 2, "#c89a5a", 1);
      beam(ctx, x, y, x + s2, y - c, 2, "#8a5a2a", 1);
      additive(ctx, () => glow(ctx, x, y, 7, "#c8fff0", 0.3));
      break;
    }
    case "pgPebble":
      rect(ctx, "#a8a0a0", x - 1, y - 1, 3, 3);
      rect(ctx, "#e0d8d0", x - 1, y - 1, 1, 1);
      break;
    case "pgCrane": {
      const flap = Math.sin(tick * 0.4) * 3;
      beam(ctx, x - dx * 4 - dy * (4 + flap), y - dy * 4 + dx * (4 + flap), x, y, 1.5, "#f8f4ec", 1);
      beam(ctx, x - dx * 4 + dy * (4 + flap), y - dy * 4 - dx * (4 + flap), x, y, 1.5, "#ff8ab8", 1);
      rect(ctx, "#d84a5a", x + dx * 2, y + dy * 2, 1, 1);
      break;
    }
    case "pgSeed":
      rect(ctx, "#8a5a2a", x - 2, y - 2, 4, 4);
      rect(ctx, "#5ad07a", x - 1, y - 4, 2, 2);
      additive(ctx, () => glow(ctx, x, y, 5, "#8af0a0", 0.4));
      break;
    case "pgShard":
      beam(ctx, x - dx * 4, y - dy * 4, x, y, 2, "#c8f0ff", 0.9);
      rect(ctx, "#ffffff", x, y, 1, 1);
      break;
    default:
      return false;
  }
  return true;
}

/** 효과. 그렸으면 true */
export function drawPgFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("pg")) return false;
  const t = fx.ticks / fx.maxTicks;
  const f = 1 - t;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  if (fx.kind === "pgBag") {
    // 배낭에서 튀어나온 수집품 (아이콘이 위로 솟았다 사라짐)
    const id = PG_IDS[fx.size] as WeaponId | undefined;
    if (!id) return true;
    const up = Math.min(1, f * 4) * 10;
    ctx.globalAlpha = Math.min(1, t * 3);
    additive(ctx, () => glow(ctx, x, y - up, 12, VIO_L, 0.5, 1));
    ctx.drawImage(iconCanvas({ kind: "weapon", id }), Math.round(x - 8), Math.round(y - 8 - up));
    ctx.globalAlpha = 1;
    return true;
  }
  additive(ctx, () => {
    switch (fx.kind) {
      case "pgSlash": {
        const a = Math.atan2(fx.dirY, fx.dirX);
        ctx.strokeStyle = alpha("#e0e8ff", t);
        ctx.lineWidth = 3 * t + 1;
        ctx.beginPath();
        ctx.arc(x, y - 4, r * (0.6 + f * 0.4), a - 1 + f * 0.6, a + 1 + f * 0.6);
        ctx.stroke();
        break;
      }
      case "pgFire":
        glow(ctx, x, y, r * (0.4 + f * 0.6), "#ff8a3a", t, 1);
        sparks(ctx, x, y, 12, r, f, "#ffd860", fx.x);
        break;
      case "pgBonk":
        shock(ctx, x + fx.dirX * 10, y + fx.dirY * 10 - 4, 4 + f * r * 0.5, "#e0e8ff", t, 3);
        sparks(ctx, x + fx.dirX * 10, y - 8, 5, 10, f, "#ffe060", fx.y);
        break;
      case "pgBeam":
        beam(ctx, x, y, fx.toX ?? x, fx.toY ?? y, (r + 2) * t, fx.tint ?? "#ffe8a0", t);
        beam(ctx, x, y, fx.toX ?? x, fx.toY ?? y, 1.5 * t, "#ffffff", t);
        break;
      case "pgPush":
        shock(ctx, x + fx.dirX * r * 0.5, y + fx.dirY * r * 0.5 - 4, r * (0.3 + f * 0.5), "#3c4c94", t, 4);
        sparks(ctx, x + fx.dirX * r * 0.5, y - 4, 8, r * 0.6, f, GOLD, fx.x);
        break;
      case "pgRing":
        shock(ctx, x, y, r * (0.2 + f * 0.8), fx.tint ?? "#e0e8ff", t, 2);
        shock(ctx, x, y, r * (0.1 + f * 0.6), VIO_L, t * 0.7, 1);
        break;
      case "pgSand":
        glow(ctx, x, y, r * (0.3 + f * 0.7), "#ffd860", t * 0.5, 0.6);
        sparks(ctx, x, y, 18, r, f, "#ffe8a0", fx.y);
        break;
      case "pgBlast":
        glow(ctx, x, y, r * (0.4 + f), "#ff8a3a", t, 1.4);
        shock(ctx, x, y, r * (0.3 + f), "#ffd040", t, 4);
        sparks(ctx, x, y, 12, r, f, "#c88a2a", fx.x);
        break;
      case "pgFall":
        if (f < 0.2) beam(ctx, x + 20, y - 70, x, y, 4, GOLD, 1);
        glow(ctx, x, y, r * (0.5 + f), GOLD, t, 1.6);
        sparks(ctx, x, y, 16, r * 1.2, f, "#fff0a0", fx.y);
        break;
      case "pgKey":
        glow(ctx, x, y, 10 + f * 8, GOLD, t, 1.2);
        shock(ctx, x, y, 4 + f * 12, "#fff0a0", t, 2);
        break;
      case "pgPlant":
        shock(ctx, x, y, r * (0.2 + f * 0.8), VIO_L, t * 0.8, 2);
        break;
      case "pgHeal":
        glow(ctx, x, y - 6, r, fx.tint ?? "#8af0a0", t * 0.7, 1);
        sparks(ctx, x, y - 6, 6, r, f, fx.tint ?? "#c8ffd8", fx.y);
        break;
    }
  });
  return true;
}
