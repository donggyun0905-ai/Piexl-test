// 수집가 그리기 (sim/collector): 등 뒤 위 공중에 줄지어 뜬 수집 무기(사용자가 준 무기 그림 sprites/collector_arms)
// · 콤보 한 칸마다 그 무기가 직접 나와 공격하는 모습 (효과 clMove, from = 무기 id, 색 = 무기 색)
//   검: 내 둘레를 한 바퀴 · 낫: 크게 쓸기 · 망치·큰칼: 떨어져 내리찍기 · 카타나: 발도 · 지팡이: 떠올라 마법 · 활·석궁·총: 나타나 쏨
//   창·쌍월: 던짐 · 별의 마법서: 별이 떨어짐 · 눈의 마법서: 빛줄기 · 황금 건틀릿: 거대한 주먹 · 발톱: X자 할퀴기 · 도끼: 둘레를 돎
import { armsOnBack, CL_ARM_IDS, CL_ARMS, type ClArmId, type EffectState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, beam, crescent, easeOut, glow, rune, shock, sparks } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const CELL = 48;
const BASE = "#cfe8ff";

const sheet = new Image();
sheet.src = `${import.meta.env.BASE_URL}sprites/collector_arms.png`;

const colorOf = (id?: string) => (id && id in CL_ARMS ? CL_ARMS[id as ClArmId].color : BASE);

/** 수집 무기 그림 하나 (가운데 x,y · 크기 size · 기울기 rot · 투명도 a) */
function armSprite(ctx: Ctx, id: string, x: number, y: number, size: number, rot = 0, a = 1): void {
  const i = CL_ARM_IDS.indexOf(id as ClArmId);
  if (i < 0 || !sheet.complete || sheet.naturalWidth === 0 || a <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(sheet, i * CELL, 0, CELL, CELL, -size / 2, -size / 2, size, size);
  ctx.restore();
}

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

/** 지나간 자리 빛 꼬리 (원호: 가운데 x,y · 반지름 r · a0→a1) */
function arcTrail(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, c: string, al: number): void {
  for (const [w, k] of [[6, 0.25], [2.5, 0.8], [1, 1]] as const) {
    ctx.strokeStyle = k === 1 ? `rgba(255,255,255,${al})` : c;
    ctx.globalAlpha = al * k;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x, y, r, Math.min(a0, a1), Math.max(a0, a1));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/** 네 갈래 별빛 */
function star(ctx: Ctx, x: number, y: number, r: number, c: string, a: number): void {
  glow(ctx, x, y, r * 1.6, c, a, 1);
  beam(ctx, x - r, y, x + r, y, 1.5, c, a);
  beam(ctx, x, y - r, x, y + r, 1.5, c, a);
}

/** 수집가 이펙트면 그리고 true */
export function drawCollectorFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "clMove") return false;
  const t = fx.ticks / fx.maxTicks;
  const f = easeOut(t);
  const fade = 1 - t;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const tx = snap(fx.toX ?? fx.x);
  const ty = snap(fx.toY ?? fx.y);
  const id = fx.from ?? "clBlade";
  const c = colorOf(id);
  const a = Math.atan2(fx.dirY, fx.dirX);
  const r = fx.size;
  const arm = id in CL_ARMS ? CL_ARMS[id as ClArmId] : undefined;
  const seed = Math.round(fx.x * 7 + fx.y * 13);
  // 무기 그림은 빛 위에 (빛은 더하기로)
  const sprite: [number, number, number, number, number][] = [];
  additive(ctx, () => {
    switch (arm?.style) {
      case undefined: {
        // 기본 검: 깔끔한 초승달 하나
        crescent(ctx, x, y, r * (0.8 + 0.25 * f), a - 0.3 + 0.6 * f, 1.2, r * 0.35, c, 0.85 * fade);
        break;
      }
      case "sweep":
      case "whirl": {
        // 무기가 내 둘레를 돎 (검 한 바퀴 · 도끼 n바퀴, 도끼는 스스로도 회전) + 지나간 빛 꼬리
        const turns = arm.style === "whirl" ? (arm.n ?? 2) : 1;
        const rr = r * 0.8;
        const ang = a - Math.PI + f * TAU * turns;
        arcTrail(ctx, x, y, rr, ang - Math.min(TAU * 0.9, f * TAU * turns), ang, c, 0.8 * fade);
        const sx = x + Math.cos(ang) * rr;
        const sy = y + Math.sin(ang) * rr;
        glow(ctx, sx, sy, 9, c, 0.7 * fade);
        if (t > 0.85) sparks(ctx, sx, sy, 6, 12, (t - 0.85) / 0.15, c, seed);
        sprite.push([sx, sy, 18, arm.style === "whirl" ? f * TAU * 4 : ang + Math.PI / 2 + Math.PI / 4, fade * 1.4]);
        break;
      }
      case "reap": {
        // 큰 낫이 앞을 크게 쓸어 벰
        const ang = a - 1.8 + f * 3.6;
        const rr = r * 0.7;
        crescent(ctx, x, y, r * (0.9 + 0.15 * f), ang - 0.6, 0.9, r * 0.4, c, 0.75 * fade);
        sprite.push([x + Math.cos(ang) * rr, y + Math.sin(ang) * rr, 30, ang + Math.PI / 2, fade * 1.5]);
        break;
      }
      case "chop": {
        // 하늘에서 떨어져 내리찍기 (0~0.35 떨어짐 · 그 뒤 충격파·금)
        const fall = Math.min(1, t / 0.35);
        const sy = lerp(ty - 70, ty - 8, fall * fall);
        if (fall < 1) beam(ctx, tx, sy - 30, tx, sy, 3, c, 0.5);
        else {
          const k = (t - 0.35) / 0.65;
          shock(ctx, tx, ty, r * 1.2 * easeOut(k), c, 1 - k, 8);
          glow(ctx, tx, ty, r * 0.8, c, 0.7 * (1 - k), 1);
          for (let i = 0; i < 6; i++) {
            const q = (i / 6) * TAU + seed;
            beam(ctx, tx, ty, tx + Math.cos(q) * r * easeOut(k), ty + Math.sin(q) * r * 0.6 * easeOut(k), 1.2, c, 1 - k);
          }
        }
        sprite.push([tx, sy, 26, fall < 1 ? fall * 2.5 : 0.6, t < 0.35 ? 1 : 1.5 * fade]);
        break;
      }
      case "iai": {
        // 발도: 번쩍이는 한 줄 + 잔상 + 끝에 카타나
        beam(ctx, x, y, tx, ty, 5 * fade + 1, c, fade);
        for (let k = 1; k <= 4; k++) glow(ctx, lerp(x, tx, k / 5), lerp(y, ty, k / 5), 6, c, 0.6 * fade);
        if (t < 0.4) sparks(ctx, tx, ty, 10, 22, t / 0.4, c, seed);
        sprite.push([tx, ty, 22, a + Math.PI / 4, fade * 1.5]);
        break;
      }
      case "cast": {
        // 지팡이가 내 머리 위로 떠올라 빛나고, 노린 자리에 마법 (태양: 빛기둥 · 공허: 소용돌이 · 덩굴: 가시 덩굴)
        const sy = y - 26 - 6 * f;
        glow(ctx, x, sy - 6, 10, c, 0.8 * fade, 1);
        rune(ctx, tx, ty, r, c, fade, t * (id === "clVoidStaff" ? -8 : 3));
        if (id === "clSunStaff") beam(ctx, tx, ty - 90 * (1 - f), tx, ty, 8 * fade + 2, c, fade);
        else if (id === "clVoidStaff") {
          glow(ctx, tx, ty, r * (1 - 0.5 * f), "#2a0a4a", 0.8 * fade);
          for (let i = 0; i < 6; i++) {
            const q = (i / 6) * TAU + t * 10;
            glow(ctx, tx + Math.cos(q) * r * (1 - f), ty + Math.sin(q) * r * 0.6 * (1 - f), 4, c, fade);
          }
        } else
          for (let i = 0; i < 7; i++) {
            const q = (i / 7) * TAU + seed;
            beam(ctx, tx + Math.cos(q) * r, ty + Math.sin(q) * r * 0.6, tx + Math.cos(q) * r * (1 - f), ty + Math.sin(q) * r * 0.6 * (1 - f), 2, c, fade);
          }
        shock(ctx, tx, ty, r * f, c, 0.7 * fade, 6);
        sprite.push([x + 10, sy, 20, 0.3, fade * 1.5]);
        break;
      }
      case "volley": {
        // 활·석궁·총이 내 앞에 나타나 쏨: 화살·탄이 빛 꼬리를 끌며 날아감
        const n = arm.n ?? 1;
        const spread = id === "clPistol" ? 0.06 : 0.16;
        for (let i = 0; i < n; i++) {
          const q = a + (i - (n - 1) / 2) * spread;
          const d = r * Math.min(1, t * 2.2 + (id === "clPistol" ? -i * 0.08 : 0));
          if (d <= 0 || d >= r) continue;
          const hx = x + Math.cos(q) * d;
          const hy = y + Math.sin(q) * d;
          beam(ctx, x + Math.cos(q) * Math.max(0, d - 26), y + Math.sin(q) * Math.max(0, d - 26), hx, hy, (arm.width ?? 3) * 0.6, c, 1);
          glow(ctx, hx, hy, 5, c, 1, 1);
        }
        sprite.push([x + Math.cos(a) * 10, y + Math.sin(a) * 10, 20, a + Math.PI / 4, fade * 1.6]);
        break;
      }
      case "throw": {
        // 창·쌍월을 던짐: 무기가 직접 날아가며 꿰뚫음 (쌍월은 돌며)
        const d = r * Math.min(1, f * 1.2);
        const hx = x + Math.cos(a) * d;
        const hy = y + Math.sin(a) * d;
        beam(ctx, x + Math.cos(a) * d * 0.4, y + Math.sin(a) * d * 0.4, hx, hy, 3, c, 0.7 * fade);
        glow(ctx, hx, hy, 9, c, 0.7 * fade);
        sprite.push([hx, hy, 22, id === "clCrescent" ? t * TAU * 3 : a + Math.PI / 4, fade * 1.6]);
        break;
      }
      case "stars": {
        // 하늘에서 별이 떨어져 터짐
        const drop = Math.min(1, t * 2.4);
        const sy = lerp(y - 100, y, drop);
        beam(ctx, x + 12 * (1 - drop), sy - 26, x, sy, 2, c, 0.8);
        star(ctx, x, sy, 5, c, 1);
        if (drop >= 1) {
          const k = (t - 1 / 2.4) / (1 - 1 / 2.4);
          shock(ctx, x, y, r * 1.8 * easeOut(k), c, 1 - k, 6);
          sparks(ctx, x, y, 8, r * 1.6, k, c, seed);
        }
        break;
      }
      case "beam": {
        // 마법서가 펼쳐지며 굵은 빛줄기
        beam(ctx, x, y, tx, ty, (arm.width ?? 8) * (0.4 + 0.8 * Math.sin(Math.min(1, t * 1.5) * Math.PI)) + 1, c, fade);
        glow(ctx, x + Math.cos(a) * 12, y + Math.sin(a) * 12, 12, c, fade, 1);
        sprite.push([x + Math.cos(a) * 12, y + Math.sin(a) * 12 - 4, 20, 0, fade * 1.6]);
        break;
      }
      case "punch": {
        // 거대한 황금 주먹이 앞으로 뻗었다 돌아옴 + 앞 충격파
        const d = r * Math.sin(Math.min(1, t * 1.4) * Math.PI) * 0.8;
        const hx = x + Math.cos(a) * d;
        const hy = y + Math.sin(a) * d;
        crescent(ctx, hx, hy, 16 + 10 * f, a, 0.9, 8, c, 0.8 * fade);
        sparks(ctx, hx, hy, 8, 20, t, c, seed);
        sprite.push([hx, hy, 28, a + Math.PI / 2, fade * 1.5]);
        break;
      }
      case "claw": {
        // 노린 적에 X자 발톱 자국이 차례로 (n번)
        const n = arm.n ?? 3;
        for (let i = 0; i < n; i++) {
          const k = Math.min(1, Math.max(0, t * (n + 1) - i));
          if (k <= 0) continue;
          const o = (i - (n - 1) / 2) * 5;
          for (const dir of [1, -1])
            beam(ctx, tx - 12 + o, ty - 12 * dir, lerp(tx - 12 + o, tx + 12 + o, k), lerp(ty - 12 * dir, ty + 12 * dir, k), 2, c, fade);
        }
        sprite.push([tx + 10, ty - 10, 18, -0.5 + t * 1.2, fade * 1.5]);
        break;
      }
    }
  });
  for (const [sx, sy, size, rot, al] of sprite) armSprite(ctx, id, sx, sy, size, rot, al);
  ctx.globalAlpha = 1;
  return true;
}
