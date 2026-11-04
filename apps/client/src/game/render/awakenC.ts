// 각성 증강 그림 셋째 묶음: 날카로움 천검 · 단단함 강철 요새 · 바람 대회오리 · 행운 금화 · 소환 정령 토템 · 피 핏빛 달·피의 가시 (나눠 보내기는 awakenA)
import type { Aw } from "./awakenA";
import { additive, alpha, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";

const TAU = Math.PI * 2;

export function drawAwakenC(ctx: Ctx, w: Aw): boolean {
  switch (w.fx.from) {
    case "sword": return (sword(ctx, w), true);
    case "dome": return (dome(ctx, w), true);
    case "cyclone": return (cyclone(ctx, w), true);
    case "coin": return (coin(ctx, w), true);
    case "totem": return (totem(ctx, w), true);
    case "moon": return (moon(ctx, w), true);
    case "spike": return (bloodSpike(ctx, w), true);
  }
  return false;
}

/** 빛나는 칼 한 자루 (칼끝이 아래) */
function blade(ctx: Ctx, x: number, y: number, h: number, a: number): void {
  ctx.fillStyle = `rgba(230,240,255,${a})`;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 3.5, y - h * 0.8);
  ctx.lineTo(x + 3.5, y - h * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = `rgba(255,215,120,${a})`;
  ctx.fillRect(x - 5, y - h * 0.8 - 1.5, 10, 2);
  ctx.fillStyle = `rgba(120,90,60,${a})`;
  ctx.fillRect(x - 1, y - h, 2, h * 0.2);
}

/** 천검: 하늘에서 빛나는 칼이 내리꽂히고 → 섬광·X자 베기·불똥 → 꽂힌 칼이 흐려짐 */
function sword(ctx: Ctx, w: Aw): void {
  const { x, y, r, e } = w;
  const hit = w.fx.width ?? 18;
  if (e < hit) {
    const f = easeOut(e / hit);
    const sy = y - 120 * (1 - f);
    additive(ctx, () => glow(ctx, x, sy - 8, 10, "#bcd8ff", 0.8, 1));
    blade(ctx, x, sy, 34, 0.95);
    ctx.strokeStyle = alpha("#bcd8ff", 0.4 * f);
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.45, 0, 0, TAU);
    ctx.stroke();
    return;
  }
  const f = Math.min(1, (e - hit) / 16);
  blade(ctx, x, y + 6, 34, 1 - f);
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.4, "#cfe2ff", 1 - f, 1);
    ctx.strokeStyle = `rgba(255,255,255,${1 - f})`;
    ctx.lineWidth = 2;
    const s = r * (0.6 + f * 0.6);
    ctx.beginPath();
    ctx.moveTo(x - s, y - s * 0.6);
    ctx.lineTo(x + s, y + s * 0.6);
    ctx.moveTo(x + s, y - s * 0.6);
    ctx.lineTo(x - s, y + s * 0.6);
    ctx.stroke();
    sparks(ctx, x, y, 10, r * 1.6, f, "#e0ecff", w.seed);
  });
}

/** 강철 요새: 육각 방벽 (벌집 무늬) 이 내 둘레에 맥박처럼 솟음 */
function dome(ctx: Ctx, w: Aw): void {
  const { x, y, r, t } = w;
  const f = easeOut(Math.min(1, t * 2));
  const fade = 1 - t;
  const hex = (cx: number, cy: number, s: number) => {
    ctx.beginPath();
    for (let k = 0; k < 6; k++) ctx.lineTo(cx + Math.cos((k * TAU) / 6) * s, cy + Math.sin((k * TAU) / 6) * s);
    ctx.closePath();
  };
  const R = r * (0.85 + f * 0.15);
  ctx.fillStyle = `rgba(120,170,255,${0.12 * fade})`;
  hex(x, y, R);
  ctx.fill();
  additive(ctx, () => {
    ctx.strokeStyle = alpha("#a8ccff", 0.35 * fade);
    ctx.lineWidth = 1;
    const s = 9;
    for (let i = -4; i <= 4; i++)
      for (let j = -4; j <= 4; j++) {
        const cx = x + i * s * 1.5;
        const cy = y + (j + (i % 2 ? 0.5 : 0)) * s * Math.sqrt(3);
        if (Math.hypot(cx - x, cy - y) < R - s) {
          hex(cx, cy, s * 0.92);
          ctx.stroke();
        }
      }
    ctx.strokeStyle = alpha("#dcebff", 0.9 * fade);
    ctx.lineWidth = 2.5;
    hex(x, y, R);
    ctx.stroke();
    shock(ctx, x, y, R * f, "#9cc4ff", 0.5 * fade, 4);
  });
}

/** 대회오리: 가까운 적 쪽으로 나아가는 깔때기 (위로 갈수록 넓은 고리들이 서로 다르게 돎) · 감겨 도는 잎·먼지 */
function cyclone(ctx: Ctx, w: Aw): void {
  const { r, e, t, life } = w;
  const x = w.x + ((w.fx.toX ?? w.x) - w.x) * t;
  const y = w.y + ((w.fx.toY ?? w.y) - w.y) * t;
  ctx.fillStyle = `rgba(160,150,120,${0.25 * life})`;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.35, 0, 0, TAU);
  ctx.fill();
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let k = 0; k < 9; k++) {
      const u = k / 8;
      const rw = r * (0.35 + u * 0.9);
      const cy = y - u * 46;
      const sway = Math.sin(e * 0.12 + k * 0.6) * 4 * u;
      const spin = e * (0.35 - u * 0.12) + k;
      ctx.strokeStyle = alpha(k % 2 ? "#c8fff0" : "#7fe6d2", (0.75 - u * 0.3) * life);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x + sway, cy, rw, rw * 0.3, 0, spin, spin + 3.6);
      ctx.stroke();
    }
    for (let k = 0; k < 10; k++) {
      const u = (rnd(w.seed, k) + e * 0.01) % 1;
      const ang = e * 0.3 + k * 1.7;
      const rw = r * (0.4 + u * 0.9);
      glow(ctx, x + Math.cos(ang) * rw, y - u * 46 + Math.sin(ang) * rw * 0.3, 2.2, k % 3 ? "#9cff8a" : "#ffffff", life, 1);
    }
  });
}

/** 금화: 빙글빙글 돌며 떨어지는 금화 → 반짝 별 터짐 · 튀어 오르는 작은 금화 */
function coin(ctx: Ctx, w: Aw): void {
  const { x, y, r, e } = w;
  const hit = w.fx.width ?? 20;
  const disc = (cx: number, cy: number, s: number, spin: number, a: number) => {
    const sx = Math.max(0.15, Math.abs(Math.cos(spin)));
    ctx.fillStyle = `rgba(160,110,10,${a})`;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 0.8, s * sx, s, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = `rgba(255,214,60,${a})`;
    ctx.beginPath();
    ctx.ellipse(cx, cy, s * sx, s, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = `rgba(255,248,190,${a})`;
    ctx.fillRect(cx - s * sx * 0.3, cy - s * 0.5, Math.max(1, s * sx * 0.35), s);
  };
  if (e < hit) {
    const f = e / hit;
    additive(ctx, () => glow(ctx, x, y - 110 * (1 - f * f), 9, "#ffd84a", 0.7, 1));
    disc(x, y - 110 * (1 - f * f), 7.5, e * 0.5, 1);
    return;
  }
  const f = Math.min(1, (e - hit) / 16);
  additive(ctx, () => {
    glow(ctx, x, y, r * 1.5, "#ffd84a", 1 - f, 1);
    ctx.fillStyle = `rgba(255,250,200,${1 - f})`;
    const s = 12 * (1 - f) + 3;
    ctx.beginPath();
    for (let k = 0; k < 8; k++) {
      const rr = k % 2 ? s * 0.3 : s;
      ctx.lineTo(x + Math.cos((k * TAU) / 8) * rr, y + Math.sin((k * TAU) / 8) * rr);
    }
    ctx.fill();
  });
  for (let k = 0; k < 4; k++) {
    const ang = -Math.PI / 2 + (rnd(w.seed, k) - 0.5) * 2.4;
    const d = 16 * f;
    disc(x + Math.cos(ang) * d * 1.5, y + Math.sin(ang) * d * 1.5 + 20 * f * f, 3.5, e * 0.6 + k, 1 - f);
  }
}

/** 정령 토템: 떠 있는 수정 · 아래 마법진 · 둘레를 도는 정령 셋(빛 꼬리) */
function totem(ctx: Ctx, w: Aw): void {
  const { x, y, e, life } = w;
  const bob = Math.sin(e * 0.08) * 2;
  ctx.strokeStyle = alpha("#b48cff", 0.5 * life);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 20, 8, 0, 0, TAU);
  ctx.ellipse(x, y + 10, 14, 5.5, 0, 0, TAU);
  ctx.stroke();
  ctx.fillStyle = alpha("#d9c4ff", life);
  ctx.beginPath();
  ctx.moveTo(x, y - 12 + bob);
  ctx.lineTo(x + 5, y - 2 + bob);
  ctx.lineTo(x, y + 6 + bob);
  ctx.lineTo(x - 5, y - 2 + bob);
  ctx.closePath();
  ctx.fill();
  additive(ctx, () => {
    glow(ctx, x, y - 3 + bob, 12, "#a77bff", 0.7 * life, 1);
    for (let k = 0; k < 3; k++) {
      for (let j = 0; j < 6; j++) {
        const ang = e * 0.08 + (k * TAU) / 3 - j * 0.12;
        glow(ctx, x + Math.cos(ang) * 16, y - 2 + Math.sin(ang) * 7, 4 - j * 0.5, j ? "#b48cff" : "#ffffff", life * (1 - j / 7), j ? 0 : 1);
      }
    }
  });
}

/** 핏빛 달: 머리 위에 떠오르는 붉은 달 (그늘진 초승달 · 붉은 무리) */
function moon(ctx: Ctx, w: Aw): void {
  const { x, y, r, life, e } = w;
  const yy = y - Math.min(1, e / 20) * 6;
  additive(ctx, () => glow(ctx, x, yy, r * 2.6, "#ff2a3a", 0.8 * life));
  ctx.fillStyle = alpha("#c4102a", life);
  ctx.beginPath();
  ctx.arc(x, yy, r, 0, TAU);
  ctx.fill();
  ctx.fillStyle = alpha("#ff5a64", 0.8 * life);
  ctx.beginPath();
  ctx.arc(x - r * 0.25, yy - r * 0.2, r * 0.75, 0, TAU);
  ctx.fill();
  ctx.fillStyle = alpha("#7a0a1a", 0.6 * life);
  for (let k = 0; k < 4; k++) {
    ctx.beginPath();
    ctx.arc(x + (rnd(k, 3) - 0.5) * r, yy + (rnd(3, k) - 0.5) * r, 1.5 + rnd(k, 9) * 2, 0, TAU);
    ctx.fill();
  }
}

/** 피의 가시: 땅의 붉은 웅덩이 → 솟구치는 검붉은 가시 다발 · 튀는 핏방울 */
function bloodSpike(ctx: Ctx, w: Aw): void {
  const { x, y, r, e } = w;
  const hit = w.fx.width ?? 20;
  const pool = Math.min(1, e / hit);
  const out = e > hit ? Math.max(0, 1 - (e - hit) / 20) : 1;
  ctx.fillStyle = `rgba(120,0,20,${0.5 * pool * out})`;
  ctx.beginPath();
  ctx.ellipse(x, y, r * pool, r * 0.45 * pool, 0, 0, TAU);
  ctx.fill();
  if (e < hit) return;
  const f = easeOut(Math.min(1, (e - hit) / 5));
  for (let k = 0; k < 9; k++) {
    const ox = (k - 4) * 4 + (rnd(w.seed, k) - 0.5) * 3;
    const h = (24 + rnd(k, w.seed) * 16) * f * (1 - Math.abs(k - 4) / 7);
    ctx.fillStyle = `rgba(${140 + k * 12},${k % 2 ? 20 : 8},34,${out})`;
    ctx.beginPath();
    ctx.moveTo(x + ox - 3.5, y);
    ctx.lineTo(x + ox + (k - 4) * 1.6, y - h);
    ctx.lineTo(x + ox + 3.5, y);
    ctx.closePath();
    ctx.fill();
  }
  additive(ctx, () => {
    glow(ctx, x, y - 6, r * 1.2, "#ff1a3a", out * 0.8, 1);
    sparks(ctx, x, y - 8, 9, r * 1.4, Math.min(1, (e - hit) / 20), "#ff3a4a", w.seed);
  });
}
