// 차원의 순례자(히든) 그리기 (화려하게: 빛·충격파·문양·불똥 겹침): 땅에 놓인 것(깃발·차원의 문·태엽 폭탄·떨어질 별 자리) · 발밑 수집 도감 칸·배낭 뒤지기 점 · 수집품 탄 7가지 · 효과 (베기·불꽃·냄비·빛줄기·우산·방울·모래·폭발·별똥별·열쇠·배낭에서 튀어나온 수집품·회복)
import { PG_IDS, PILGRIM, pilgrimBook, type EffectState, type ProjectileState, type RunState, type WeaponId } from "@pixel-rogue/shared";
import { iconCanvas } from "../iconArt";
import { lerp, type Snap } from "./palette";
import { additive, alpha, beam, crescent, glow, rune, shock, sparks } from "./pwFxBits";

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
      additive(ctx, () => {
        beam(ctx, x - dx * 10, y - dy * 10, x, y, 3, "#ff6aa8", 0.5);
        glow(ctx, x, y, 8, "#ff6aa8", 0.8, 1.6);
      });
      for (const [ox, oy] of [[0, -3], [-3, 0], [3, 0], [0, 3]] as const) rect(ctx, "#fff0a0", x + ox / 1.5, y + oy / 1.5, 1, 1);
      rect(ctx, "#ffffff", x - 1, y - 1, 2, 2);
      break;
    case "pgNeedle":
      additive(ctx, () => glow(ctx, x, y, 5, "#ff4a5a", 0.6, 1));
      beam(ctx, x - dx * 9, y - dy * 9, x, y, 1.5, "#ff4a5a", 0.9);
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
      additive(ctx, () => glow(ctx, x, y, 5, "#c8f0ff", 0.6, 1.2));
      beam(ctx, x - dx * 7, y - dy * 7, x, y, 2, "#c8f0ff", 0.9);
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
  // 차원 빛: 모든 수집품 효과 뒤에 보랏빛 차원 무늬·별 조각이 같이 번짐
  const seed = fx.x * 7 + fx.y * 13;
  additive(ctx, () => {
    switch (fx.kind) {
      case "pgSlash": {
        const a = Math.atan2(fx.dirY, fx.dirX) + f * 0.6;
        crescent(ctx, x, y - 4, r * (0.7 + f * 0.35), a, 1.1, 9 * t + 2, VIO_L, t);
        crescent(ctx, x, y - 4, r * (0.55 + f * 0.3), a - 0.2, 0.9, 5 * t + 1, SKY, t * 0.8);
        sparks(ctx, x + Math.cos(a) * r * 0.7, y - 4 + Math.sin(a) * r * 0.7, 10, r * 0.6, f, "#ffffff", seed);
        break;
      }
      case "pgFire":
        glow(ctx, x, y, r * (0.4 + f * 0.7), "#ff8a3a", t, 1.2);
        shock(ctx, x, y, r * (0.3 + f * 0.8), "#ffd040", t, 3);
        sparks(ctx, x, y, 20, r * 1.1, f, "#ffd860", seed);
        sparks(ctx, x, y, 10, r * 0.7, f, "#ff5a2a", seed + 3);
        break;
      case "pgBonk": {
        const bx = x + fx.dirX * 10;
        const by = y + fx.dirY * 10 - 4;
        glow(ctx, bx, by, 6 + f * r * 0.5, "#ffe060", t, 1.5);
        shock(ctx, bx, by, 4 + f * r * 0.7, "#e0e8ff", t, 4);
        sparks(ctx, bx, by, 12, r * 0.8, f, "#ffe060", seed);
        // 머리 위 도는 별 (기절)
        for (let i = 0; i < 3; i++) glow(ctx, bx + Math.cos(f * 9 + i * 2.1) * 8, by - 10 + Math.sin(f * 9 + i * 2.1) * 3, 3, GOLD, t, 1.5);
        break;
      }
      case "pgBeam": {
        const tx = fx.toX ?? x;
        const ty = fx.toY ?? y;
        const c = fx.tint ?? "#ffe8a0";
        beam(ctx, x, y, tx, ty, (r + 6) * t, c, t * 0.5);
        beam(ctx, x, y, tx, ty, (r + 2) * t, c, t);
        beam(ctx, x, y, tx, ty, 1.5 * t + 0.5, "#ffffff", t);
        glow(ctx, x, y, 10 + r, c, t, 1.5);
        for (let i = 1; i <= 6; i++) glow(ctx, lerp(x, tx, i / 6), lerp(y, ty, i / 6) + Math.sin(i * 2 + f * 8) * 3, 3 + r * 0.4, "#ffffff", t * 0.8, 1);
        break;
      }
      case "pgPush":
        crescent(ctx, x, y - 4, r * (0.5 + f * 0.6), Math.atan2(fx.dirY, fx.dirX), 1, 10 * t + 2, "#5a7ae0", t);
        shock(ctx, x + fx.dirX * r * 0.5, y + fx.dirY * r * 0.5 - 4, r * (0.3 + f * 0.6), "#3c4c94", t, 4);
        sparks(ctx, x + fx.dirX * r * 0.5, y - 4, 14, r * 0.8, f, GOLD, seed);
        break;
      case "pgRing":
        glow(ctx, x, y, r * (0.3 + f * 0.5), VIO, t * 0.5, 0.6);
        shock(ctx, x, y, r * (0.2 + f * 0.8), fx.tint ?? "#e0e8ff", t, 3);
        shock(ctx, x, y, r * (0.1 + f * 0.6), VIO_L, t * 0.8, 2);
        rune(ctx, x, y, r * 0.5, VIO_L, t * 0.7, f * 3);
        sparks(ctx, x, y, 14, r, f, "#ffffff", seed);
        break;
      case "pgSand":
        glow(ctx, x, y, r * (0.3 + f * 0.7), "#ffd860", t * 0.6, 0.8);
        rune(ctx, x, y, r * 0.7, GOLD, t, -f * 4);
        shock(ctx, x, y, r * (0.2 + f * 0.8), "#ffe8a0", t, 2);
        sparks(ctx, x, y, 24, r, f, "#ffe8a0", seed);
        break;
      case "pgBlast":
        glow(ctx, x, y, r * (0.5 + f * 1.1), "#ff8a3a", t, 1.6);
        shock(ctx, x, y, r * (0.3 + f * 1.1), "#ffd040", t, 5);
        shock(ctx, x, y, r * (0.1 + f * 0.7), "#ffffff", t * 0.8, 2);
        sparks(ctx, x, y, 22, r * 1.3, f, "#ffb03a", seed);
        sparks(ctx, x, y, 10, r * 0.8, f, "#c88a2a", seed + 5);
        break;
      case "pgFall":
        if (f < 0.25) {
          beam(ctx, x + 20, y - 70, x, y, 8, "#ff8a3a", 0.6);
          beam(ctx, x + 20, y - 70, x, y, 3, "#ffffff", 1);
        }
        glow(ctx, x, y, r * (0.6 + f * 1.1), GOLD, t, 2);
        shock(ctx, x, y, r * (0.3 + f * 1.1), "#fff0a0", t, 4);
        sparks(ctx, x, y, 26, r * 1.5, f, "#fff0a0", seed);
        break;
      case "pgKey":
        glow(ctx, x, y, 12 + f * 10, GOLD, t, 1.6);
        rune(ctx, x, y, 10 + f * 6, "#fff0a0", t, f * 5);
        shock(ctx, x, y, 4 + f * 16, "#fff0a0", t, 2);
        sparks(ctx, x, y, 12, 18, f, GOLD, seed);
        break;
      case "pgPlant":
        shock(ctx, x, y, r * (0.2 + f * 0.8), VIO_L, t * 0.8, 3);
        rune(ctx, x, y, r * 0.5, VIO_L, t * 0.6, f * 2);
        break;
      case "pgHeal":
        glow(ctx, x, y - 6, r, fx.tint ?? "#8af0a0", t * 0.7, 1);
        sparks(ctx, x, y - 6, 10, r, f, fx.tint ?? "#c8ffd8", seed);
        break;
    }
  });
  return true;
}
