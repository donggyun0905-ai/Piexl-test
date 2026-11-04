// 각성 증강 그림 (sim/awakenCasts, 효과 "awaken": motif = 꼬리표, from = 모양): 여기는 나눠 보내기 · 얼음 서리바람 · 불 유성 · 독 역병 꽃 · 빛 후광·빛기둥
// 나머지는 awakenB(번개·정령 줄기·어둠·죽음·대지·물) · awakenC(날카로움·단단함·바람·행운·소환·피)
import type { EffectState } from "@pixel-rogue/shared";
import { drawAwakenB } from "./awakenB";
import { drawAwakenC } from "./awakenC";
import type { Snap } from "./palette";
import { additive, alpha, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";

const TAU = Math.PI * 2;

/** 그림 하나에 넘기는 값: 자리 · 크기 · 지난 틱 · 지난 정도(0→1) · 들어오고 나가는 투명도 */
export interface Aw {
  fx: EffectState;
  x: number;
  y: number;
  r: number;
  e: number;
  t: number;
  /** 처음 12틱 동안 나타나고 마지막 16틱 동안 사라짐 */
  life: number;
  seed: number;
}

/** 각성 그림이면 그리고 true */
export function drawAwakenFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "awaken") return false;
  const e = fx.maxTicks - fx.ticks;
  const a: Aw = { fx, x: snap(fx.x), y: snap(fx.y), r: fx.size, e, t: e / fx.maxTicks, life: Math.min(1, e / 12, fx.ticks / 16), seed: Math.round(fx.x * 3 + fx.y * 7) };
  ctx.save();
  if (fx.from === "field" && fx.motif === "ice") frostGale(ctx, a);
  else if (fx.from === "meteor") meteor(ctx, a);
  else if (fx.from === "field" && fx.motif === "poison") plagueBloom(ctx, a);
  else if (fx.from === "halo") halo(ctx, a);
  else if (fx.from === "pillar") pillar(ctx, a);
  else if (!drawAwakenB(ctx, a)) drawAwakenC(ctx, a);
  ctx.restore();
  return true;
}

/** 여섯 갈래 얼음 결정 (가지마다 작은 곁가지) */
function snowflake(ctx: Ctx, x: number, y: number, s: number, rot: number, a: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.strokeStyle = `rgba(235,252,255,${a})`;
  ctx.lineWidth = Math.max(0.6, s * 0.18);
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let k = 0; k < 6; k++) {
    const c = Math.cos((k * TAU) / 6);
    const n = Math.sin((k * TAU) / 6);
    ctx.moveTo(0, 0);
    ctx.lineTo(c * s, n * s);
    // 곁가지 둘
    const bx = c * s * 0.55;
    const by = n * s * 0.55;
    for (const side of [-1, 1]) {
      const ang = (k * TAU) / 6 + side * 0.7;
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(ang) * s * 0.35, by + Math.sin(ang) * s * 0.35);
    }
  }
  ctx.stroke();
  ctx.fillStyle = `rgba(255,255,255,${a})`;
  ctx.fillRect(-0.7, -0.7, 1.4, 1.4);
  ctx.restore();
}

/** 얼음 서리바람: 서리 낀 둥근 땅 · 가장자리를 도는 바람 줄기 · 그 안에 눈처럼 내리는 결정 · 땅에 닿으면 반짝 */
function frostGale(ctx: Ctx, w: Aw): void {
  const { x, y, r, e, life } = w;
  // 땅: 가운데가 옅은 얼음빛 원판 + 서리 무늬
  const g = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
  g.addColorStop(0, `rgba(190,240,255,${0.18 * life})`);
  g.addColorStop(0.75, `rgba(120,200,255,${0.22 * life})`);
  g.addColorStop(1, `rgba(220,250,255,${0.45 * life})`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.92, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = `rgba(230,250,255,${0.18 * life})`;
  ctx.lineWidth = 0.8;
  for (let k = 0; k < 9; k++) {
    const ang = rnd(w.seed, k) * TAU;
    const len = r * (0.45 + rnd(k, w.seed) * 0.45);
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(ang) * r * 0.2, y + Math.sin(ang) * r * 0.2);
    ctx.lineTo(x + Math.cos(ang + 0.15) * len, y + Math.sin(ang + 0.15) * len);
    ctx.stroke();
  }
  additive(ctx, () => {
    // 가장자리를 도는 서리바람 세 줄기
    ctx.lineCap = "round";
    for (let k = 0; k < 3; k++) {
      const start = e * 0.05 + (k * TAU) / 3;
      for (let j = 0; j < 6; j++) {
        ctx.strokeStyle = `rgba(200,245,255,${(0.55 - j * 0.08) * life})`;
        ctx.lineWidth = 2.2 - j * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, r * (0.9 - j * 0.02), start - j * 0.12, start - j * 0.12 + 0.5);
        ctx.stroke();
      }
    }
    // 테두리 빛
    shock(ctx, x, y, r, "#bff4ff", 0.5 * life, 4);
  });
  // 눈처럼 내리는 결정 (범위 안에서 위에서 아래로, 좌우로 흔들리며)
  const n = Math.round(14 + r / 4);
  for (let k = 0; k < n; k++) {
    const speed = 0.006 + rnd(k, 3) * 0.006;
    const ph = (rnd(w.seed, k + 40) + e * speed) % 1;
    const col = (rnd(k, w.seed + 9) * 2 - 1) * 0.85;
    const dy = -1 + ph * 2;
    const half = Math.sqrt(Math.max(0, 1 - dy * dy));
    const fx = x + col * half * r + Math.sin(e * 0.06 + k) * 3;
    const fy = y + dy * r * 0.92;
    const fade = Math.min(1, ph * 6, (1 - ph) * 5) * life;
    snowflake(ctx, fx, fy, 2.2 + rnd(k, 5) * 2.6, e * 0.03 * (k % 2 ? 1 : -1) + k, 0.9 * fade);
    // 땅에 닿을 때 반짝
    if (ph > 0.9) additive(ctx, () => glow(ctx, fx, fy, 5, "#e0fbff", (ph - 0.9) * 8 * life, 1));
  }
}

/** 불 유성: 땅에 붉은 예고 고리 → 불꼬리를 끌고 비스듬히 떨어지는 유성 → 폭발 · 불똥 · 달아오른 자국 */
function meteor(ctx: Ctx, w: Aw): void {
  const { x, y, r, e } = w;
  const hit = w.fx.width ?? 30;
  if (e < hit) {
    const f = e / hit;
    // 예고: 좁혀 드는 고리
    ctx.strokeStyle = alpha("#ff5a1e", 0.35 + 0.4 * f);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y, r * (1.6 - f * 0.6), r * (0.8 - f * 0.3), 0, 0, TAU);
    ctx.stroke();
    const hx = x - 70 * (1 - f);
    const hy = y - 150 * (1 - f) ** 1.1;
    additive(ctx, () => {
      // 불꼬리 (뒤로 갈수록 가늘고 붉게)
      for (let k = 0; k < 10; k++) {
        const u = k / 10;
        glow(ctx, hx - 12 * u * 2.2, hy - 26 * u * 2.2, 9 * (1 - u) + 2, k < 3 ? "#ffd27a" : "#ff6a1e", 0.8 * (1 - u));
      }
      glow(ctx, hx, hy, 10, "#ffb347", 1, 1);
    });
    return;
  }
  const f = Math.min(1, (e - hit) / 22);
  additive(ctx, () => {
    glow(ctx, x, y, r * 2.2 * easeOut(f), "#ff7a2a", 1 - f, 1);
    glow(ctx, x, y - 10 * f, r * 1.2, "#ffd27a", (1 - f) * 0.9, 1);
    shock(ctx, x, y, r * 1.8 * easeOut(f), "#ffc070", 1 - f, 6);
    shock(ctx, x, y, r * 1.1 * easeOut(f), "#ff5a1e", 1 - f, 4);
    sparks(ctx, x, y, 18, r * 2.4, f, "#ffb347", w.seed);
  });
  // 달아오른 자국
  ctx.fillStyle = `rgba(60,20,10,${0.45 * (1 - f)})`;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.7, r * 0.35, 0, 0, TAU);
  ctx.fill();
}

/** 독 역병 꽃: 독 안개 원 · 가운데서 꽃잎 여섯 장이 피어 천천히 돎 · 부글부글 거품 · 떠다니는 포자 */
function plagueBloom(ctx: Ctx, w: Aw): void {
  const { x, y, r, e, life } = w;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(150,255,90,${0.28 * life})`);
  g.addColorStop(0.7, `rgba(70,160,40,${0.24 * life})`);
  g.addColorStop(1, "rgba(40,90,20,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  // 꽃잎 (처음 24틱에 피어남)
  const open = easeOut(Math.min(1, e / 24));
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(e * 0.01);
  for (const [len, col, off] of [[16, "#7a2fa8", 0], [11, "#c64bd8", TAU / 12]] as const) {
    for (let k = 0; k < 6; k++) {
      ctx.save();
      ctx.rotate((k * TAU) / 6 + off);
      ctx.fillStyle = alpha(col, 0.9 * life);
      ctx.beginPath();
      ctx.ellipse(len * open * 0.55, 0, len * open * 0.55, 4 * open + 1, 0, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.fillStyle = alpha("#d6ff4a", life);
  ctx.beginPath();
  ctx.arc(0, 0, 3.5 * open, 0, TAU);
  ctx.fill();
  ctx.restore();
  // 거품 (올라가며 커졌다 터짐)
  for (let k = 0; k < 12; k++) {
    const ph = (rnd(w.seed, k) + e * (0.01 + rnd(k, 2) * 0.01)) % 1;
    const ang = rnd(k, w.seed) * TAU;
    const d = r * 0.85 * Math.sqrt(rnd(k + 7, w.seed));
    const bx = x + Math.cos(ang) * d;
    const by = y + Math.sin(ang) * d * 0.9 - ph * 10;
    ctx.strokeStyle = alpha("#c8ff7a", (1 - ph) * 0.8 * life);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bx, by, 1 + ph * 3, 0, TAU);
    ctx.stroke();
  }
  // 포자
  additive(ctx, () => {
    for (let k = 0; k < 10; k++) {
      const ang = rnd(k, 31) * TAU + e * 0.02;
      const d = r * (0.3 + 0.6 * ((rnd(k, 17) + e * 0.004) % 1));
      glow(ctx, x + Math.cos(ang) * d, y + Math.sin(ang) * d, 3, "#b6ff5a", 0.7 * life, 1);
    }
  });
}

/** 빛 후광: 내 둘레로 퍼지는 금빛 고리 · 햇살 줄기 */
function halo(ctx: Ctx, w: Aw): void {
  const { x, y, r, t } = w;
  const f = easeOut(t);
  additive(ctx, () => {
    shock(ctx, x, y, r * f, "#ffe58a", 1 - t, 6);
    glow(ctx, x, y, r * 0.8, "#fff2b0", 0.7 * (1 - t), 1);
    ctx.strokeStyle = `rgba(255,236,160,${0.6 * (1 - t)})`;
    ctx.lineWidth = 2;
    for (let k = 0; k < 12; k++) {
      const ang = (k * TAU) / 12 + t * 0.6;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(ang) * r * 0.3 * f, y + Math.sin(ang) * r * 0.3 * f);
      ctx.lineTo(x + Math.cos(ang) * r * 1.1 * f, y + Math.sin(ang) * r * 1.1 * f);
      ctx.stroke();
    }
  });
}

/** 빛기둥: 땅에 금빛 문양이 모이고 → 하늘에서 내리꽂는 흰 빛줄기 · 십자 반짝임 */
function pillar(ctx: Ctx, w: Aw): void {
  const { x, y, r, e } = w;
  const hit = w.fx.width ?? 24;
  if (e < hit) {
    const f = e / hit;
    additive(ctx, () => {
      ctx.strokeStyle = alpha("#ffe27a", 0.3 + 0.5 * f);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(x, y, r * (1.3 - 0.3 * f), r * (0.55 - 0.1 * f), 0, 0, TAU);
      ctx.stroke();
      glow(ctx, x, y, r * f, "#fff0a0", 0.5 * f);
    });
    return;
  }
  const f = Math.min(1, (e - hit) / 20);
  const width = r * 0.9 * (1 - f * 0.7);
  additive(ctx, () => {
    const g = ctx.createLinearGradient(x, y - 160, x, y);
    g.addColorStop(0, "rgba(255,250,220,0)");
    g.addColorStop(1, `rgba(255,245,200,${1 - f})`);
    ctx.fillStyle = g;
    ctx.fillRect(x - width, y - 160, width * 2, 160);
    ctx.fillStyle = `rgba(255,255,255,${1 - f})`;
    ctx.fillRect(x - width * 0.3, y - 160, width * 0.6, 160);
    glow(ctx, x, y, r * 1.5, "#ffe58a", 1 - f, 1);
    // 십자 반짝임
    ctx.strokeStyle = `rgba(255,255,255,${1 - f})`;
    ctx.lineWidth = 1.5;
    const s = 10 * (1 - f) + 4;
    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.lineTo(x + s, y);
    ctx.moveTo(x, y - s);
    ctx.lineTo(x, y + s);
    ctx.stroke();
  });
}
