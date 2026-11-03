// 수집가 그리기 (sim/collector·collectorMoves): 등 뒤 위 공중에 줄지어 뜬 수집 무기 · 무기마다 다른 공격 이펙트(clMove, 무기 색) · 날아가는 탄(clShot)
// 이펙트 모양(from): arc 빛나는 칼날 · spin 한 바퀴 · thrust 찌르기 · slam 내려찍기 · spikes 얼음 가시 · claw 발톱 · beam 레이저 · charge 모으기
//   · fist 주먹 · shock 충격파 · pillar 빛기둥 · vortex 소용돌이 · vines 덩굴 · flash 총구 불꽃 (도구는 render/collectorArt)
import { armsOnBack, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { armSprite, bladeArc, clawMarks, dust, iceSpikes, laser, thrustLine } from "./collectorArt";
import { lerp, type Snap } from "./palette";
import { additive, alpha, beam, crescent, easeOut, glow, rune, shock, sparks } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 등 뒤 위 공중: 얻은 차례로 늘어선 수집 무기 (10개마다 한 줄 위로) · 콤보로 날아 나간 무기는 빠졌다 돌아옴 */
export function drawCollectorBack(ctx: Ctx, s: RunState, alphaT: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "collector" || p.hp <= 0) return;
  const list = armsOnBack(p);
  const px = snap(lerp(p.prevX, p.x, alphaT));
  const py = snap(lerp(p.prevY, p.y, alphaT));
  list.forEach((id, i) => {
    const row = Math.floor(i / 10);
    const inRow = Math.min(10, list.length - row * 10);
    const off = ((i % 10) - (inRow - 1) / 2) * 7;
    const x = px + off - p.faceX * 4;
    const y = py - 31 - row * 10 - Math.abs(off) * 0.12 + Math.sin(s.tick / 14 + i) * 1.2;
    armSprite(ctx, id, x, y, 14, (off / 40) * 0.6);
  });
}

/** 수집가 이펙트면 그리고 true */
export function drawCollectorFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "clMove") return false;
  const t = fx.ticks / fx.maxTicks;
  const f = easeOut(t);
  const fade = 1 - t;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const c = fx.tint ?? "#cfe8ff";
  const id = fx.motif ?? "";
  const a = Math.atan2(fx.dirY, fx.dirX);
  const r = fx.size;
  const w = fx.width ?? 6;
  const seed = Math.round(fx.x * 7 + fx.y * 13);
  switch (fx.from) {
    case "arc":
      bladeArc(ctx, x, y, r, a, fx.arc ?? 1.1, w, c, t, fx.style ?? 0);
      break;
    case "spin":
      // 한 바퀴 베기: 두 칼날이 둘레를 돌며 · 가운데 빛
      for (let k = 0; k < 2; k++) bladeArc(ctx, x, y, r, a + k * Math.PI + f * TAU * 0.5, 1.5, w, c, t);
      additive(ctx, () => glow(ctx, x, y, r * 0.6, c, 0.5 * fade, 1));
      break;
    case "thrust":
      thrustLine(ctx, x, y, a, r, w, c, t);
      break;
    case "streak": {
      // 뻗어 나가는 화살 빛 (피의 활)
      const d = r * Math.min(1, t * 3);
      additive(ctx, () => {
        beam(ctx, x + Math.cos(a) * Math.max(0, d - 40), y + Math.sin(a) * Math.max(0, d - 40), x + Math.cos(a) * d, y + Math.sin(a) * d, w + 1, c, fade);
        glow(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, 6, c, fade, 1);
      });
      break;
    }
    case "slam":
      additive(ctx, () => {
        shock(ctx, x, y, r * f, c, fade, 8);
        glow(ctx, x, y, r * 0.6, c, 0.6 * fade, 1);
        sparks(ctx, x, y, 10, r, t, c, seed);
      });
      dust(ctx, x, y, r, t, seed);
      break;
    case "spikes":
      additive(ctx, () => glow(ctx, x, y, r, c, 0.4 * fade));
      iceSpikes(ctx, x, y, r, c, t, seed);
      break;
    case "claw":
      clawMarks(ctx, x, y, r, c, t, fx.style ?? 1);
      break;
    case "beam":
      additive(ctx, () => laser(ctx, x, y, snap(fx.toX ?? x), snap(fx.toY ?? y), w, c, t));
      break;
    case "charge":
      // 빛이 안으로 모여듦
      additive(ctx, () => {
        glow(ctx, x, y, r * (0.4 + 0.8 * f), c, 0.9, 1.2);
        for (let k = 0; k < 8; k++) {
          const q = (k / 8) * TAU + t * 3;
          const d = r * 2.2 * (1 - f);
          glow(ctx, x + Math.cos(q) * d, y + Math.sin(q) * d, 2.5, c, 1);
        }
      });
      break;
    case "fist": {
      // 거대한 건틀릿이 앞으로 뻗었다 돌아옴 + 속도선 · 앞 충격
      const d = r * Math.sin(Math.min(1, t * 1.3) * Math.PI) * 0.85;
      const hx = x + Math.cos(a) * d;
      const hy = y + Math.sin(a) * d;
      additive(ctx, () => {
        for (let k = -2; k <= 2; k++) beam(ctx, hx - Math.cos(a) * 26 - Math.sin(a) * k * 4, hy - Math.sin(a) * 26 + Math.cos(a) * k * 4, hx - Math.sin(a) * k * 4, hy + Math.cos(a) * k * 4, 1, c, 0.6 * fade);
        crescent(ctx, hx, hy, 14 + 10 * f, a, 1, 8, c, 0.9 * fade);
      });
      armSprite(ctx, id, hx, hy, 38, a + Math.PI / 2, 2 * fade);
      break;
    }
    case "shock":
      additive(ctx, () => crescent(ctx, x, y, r * (0.4 + 0.8 * f), a, 1.2, 6, c, 0.8 * fade));
      dust(ctx, x, y, r, t, seed);
      break;
    case "pillar": {
      // 하늘에서 내리꽂히는 빛기둥 + 바닥 문양
      additive(ctx, () => {
        const top = y - 110;
        for (const [ww, al] of [[r * 0.9, 0.25], [r * 0.45, 0.8], [r * 0.15, 1]] as const) {
          const g = ctx.createLinearGradient(x, top, x, y);
          g.addColorStop(0, alpha(c, 0));
          g.addColorStop(1, al === 1 ? `rgba(255,255,255,${fade})` : alpha(c, al * fade));
          ctx.fillStyle = g;
          ctx.fillRect(x - ww / 2, top, ww, 110 * Math.min(1, t * 4));
        }
        rune(ctx, x, y, r, c, fade, t * 3);
        shock(ctx, x, y, r * f, c, fade, 6);
      });
      break;
    }
    case "vortex":
      // 블랙홀: 검은 핵 + 빨려 드는 보랏빛 나선
      ctx.fillStyle = `rgba(10,0,20,${0.75 * fade})`;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.35, 0, TAU);
      ctx.fill();
      additive(ctx, () => {
        for (let k = 0; k < 4; k++) {
          ctx.strokeStyle = alpha(c, 0.8 * fade);
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i <= 20; i++) {
            const u = i / 20;
            const q = (k / 4) * TAU + u * 3 - t * 12;
            ctx.lineTo(x + Math.cos(q) * r * (1 - u * 0.7), y + Math.sin(q) * r * 0.6 * (1 - u * 0.7));
          }
          ctx.stroke();
        }
        glow(ctx, x, y, r * 0.5, c, 0.6 * fade, 0.5);
      });
      break;
    case "vines":
      // 땅에서 덩굴이 솟아 휘감음 + 잎
      for (let k = 0; k < 7; k++) {
        const q = (k / 7) * TAU + seed;
        const sx = x + Math.cos(q) * r;
        const sy = y + Math.sin(q) * r * 0.6;
        const g = Math.min(1, t * 2.5);
        ctx.strokeStyle = `rgba(40,110,40,${fade})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(lerp(sx, x, 0.5) + Math.sin(q) * 8, lerp(sy, y, 0.5) - 10, lerp(sx, x, g), lerp(sy, y, g));
        ctx.stroke();
        ctx.strokeStyle = alpha(c, fade);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = alpha(c, fade);
        ctx.fillRect(lerp(sx, x, g * 0.6) - 1, lerp(sy, y, g * 0.6) - 2, 3, 2);
      }
      additive(ctx, () => rune(ctx, x, y, r, c, 0.6 * fade, t));
      break;
    case "flash":
      additive(ctx, () => {
        glow(ctx, x, y, r * 1.2, c, fade, 1.5);
        for (let k = -2; k <= 2; k++) beam(ctx, x, y, x + Math.cos(a + k * 0.3) * r * 1.6, y + Math.sin(a + k * 0.3) * r * 1.6, 1.5, c, fade);
      });
      ctx.fillStyle = `rgba(180,180,190,${0.4 * fade})`;
      ctx.beginPath();
      ctx.arc(x - Math.cos(a) * 6 * f, y - 4 * f, 4 + 6 * f, 0, TAU);
      ctx.fill();
      break;
    default:
      return false;
  }
  ctx.globalAlpha = 1;
  return true;
}

/** 수집 탄 (spirit clShot, tint = 무기 id): 화살·마력 화살·석궁 살·산탄·별빛·피/푸른 칼날·쌍월 */
export function drawCollectorShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.spirit !== "clShot") return false;
  const id = pr.tint ?? "";
  const a = Math.atan2(pr.vy, pr.vx);
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const color = { clWhiteBow: "#f4f4ff", clIceBow: "#8ad8ff", clGoldBow: "#ffd040", clCrossbow: "#e0a860", clPistol: "#fff0c0", clStarTome: "#8ab8ff", clBloodHammer: "#ff3a48", clBlueAxe: "#80b8ff", clCrescent: "#8ab8ff" }[id] ?? "#ffffff";
  if (id === "clCrescent") {
    additive(ctx, () => glow(ctx, x, y, 9, color, 0.6));
    armSprite(ctx, id, x, y, 18, tick * 0.6);
    return true;
  }
  if (id === "clBloodHammer" || id === "clBlueAxe") {
    // 날아가는 칼날 (초승달이 앞을 봄)
    additive(ctx, () => {
      crescent(ctx, x - ux * 6, y - uy * 6, 12, a, 1.1, 6, color, 0.95);
      glow(ctx, x, y, 8, color, 0.5);
    });
    return true;
  }
  if (id === "clStarTome") {
    additive(ctx, () => {
      glow(ctx, x, y, 6, color, 0.9, 1.5);
      beam(ctx, x - 4, y, x + 4, y, 1, color, 1);
      beam(ctx, x, y - 4, x, y + 4, 1, color, 1);
      beam(ctx, x - ux * 10, y - uy * 10, x, y, 1, color, 0.5);
    });
    return true;
  }
  if (id === "clPistol") {
    additive(ctx, () => beam(ctx, x - ux * 8, y - uy * 8, x, y, 1.5, color, 1));
    return true;
  }
  // 화살: 살 · 촉 · 깃 + 짧은 빛 꼬리 (황금 활은 거대한 마력 화살)
  const big = id === "clGoldBow" ? 2.2 : id === "clCrossbow" ? 1.3 : 1;
  const L = 8 * big;
  additive(ctx, () => {
    beam(ctx, x - ux * L * 2.4, y - uy * L * 2.4, x - ux * L, y - uy * L, 1.5 * big, color, 0.45);
    if (big > 2) glow(ctx, x, y, 10, color, 0.8, 1);
  });
  ctx.strokeStyle = id === "clCrossbow" ? "#5a3a1a" : "#e8e0c8";
  ctx.lineWidth = big;
  ctx.beginPath();
  ctx.moveTo(x - ux * L, y - uy * L);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + ux * 3 * big, y + uy * 3 * big);
  ctx.lineTo(x - uy * 2 * big, y + ux * 2 * big);
  ctx.lineTo(x + uy * 2 * big, y - ux * 2 * big);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = alpha(color, 0.9);
  ctx.fillRect(x - ux * L - uy * 2 * big - 0.5, y - uy * L + ux * 2 * big - 0.5, 1.5, 1.5);
  ctx.fillRect(x - ux * L + uy * 2 * big - 0.5, y - uy * L - ux * 2 * big - 0.5, 1.5, 1.5);
  return true;
}
