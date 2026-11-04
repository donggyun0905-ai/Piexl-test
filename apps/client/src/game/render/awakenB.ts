// 각성 증강 그림 둘째 묶음: 번개 사슬·정령 줄기(zap) · 어둠 심연 · 죽음 사신의 낫 · 대지 지각 분쇄 · 물 해일 (나눠 보내기는 awakenA)
import type { Aw } from "./awakenA";
import { additive, alpha, crescent, easeOut, glow, rnd, shock, sparks, type Ctx } from "./pwFxBits";

const TAU = Math.PI * 2;

export function drawAwakenB(ctx: Ctx, w: Aw): boolean {
  const from = w.fx.from;
  if (from === "zap") zap(ctx, w);
  else if (from === "field" && w.fx.motif === "dark") abyss(ctx, w);
  else if (from === "scythe") scythe(ctx, w);
  else if (from === "quake") quake(ctx, w);
  else if (from === "wave") wave(ctx, w);
  else return false;
  return true;
}

/** 번개: 2틱마다 모양이 바뀌는 지그재그 + 곁가지 · 흰 속 · 닿은 곳 섬광 / 정령 줄기: 보랏빛 곡선 위를 날아가는 빛 구슬 */
function zap(ctx: Ctx, w: Aw): void {
  const { x, y, t } = w;
  const tx = w.fx.toX ?? x;
  const ty = w.fx.toY ?? y;
  const fade = 1 - t;
  if (w.fx.motif === "summon") {
    const mx = (x + tx) / 2 + (ty - y) * 0.3;
    const my = (y + ty) / 2 - (tx - x) * 0.3 - 10;
    const u = Math.min(1, t * 2.2);
    const at = (v: number) => [(1 - v) ** 2 * x + 2 * (1 - v) * v * mx + v * v * tx, (1 - v) ** 2 * y + 2 * (1 - v) * v * my + v * v * ty] as const;
    additive(ctx, () => {
      for (let k = 0; k < 8; k++) {
        const v = Math.max(0, u - k * 0.04);
        const [px, py] = at(v);
        glow(ctx, px, py, 5 - k * 0.5, k ? "#b48cff" : "#f0e0ff", fade * (1 - k / 9), k ? 0 : 1);
      }
      if (u >= 1) glow(ctx, tx, ty, 9, "#c9a8ff", fade, 1);
    });
    return;
  }
  const seed = w.seed + Math.floor(w.e / 2) * 17;
  const pts: [number, number][] = [[x, y]];
  const n = 7;
  const len = Math.hypot(tx - x, ty - y) || 1;
  const nx = -(ty - y) / len;
  const ny = (tx - x) / len;
  for (let k = 1; k < n; k++) {
    const off = (rnd(seed, k) - 0.5) * Math.min(18, len * 0.25);
    pts.push([x + ((tx - x) * k) / n + nx * off, y + ((ty - y) * k) / n + ny * off]);
  }
  pts.push([tx, ty]);
  additive(ctx, () => {
    ctx.lineJoin = "round";
    for (const [col, lw] of [[alpha("#7ab8ff", 0.35 * fade), 6], [alpha("#bfe0ff", 0.9 * fade), 2.4], [`rgba(255,255,255,${fade})`, 1]] as const) {
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.beginPath();
      pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.stroke();
    }
    // 곁가지
    ctx.strokeStyle = alpha("#cfe6ff", 0.7 * fade);
    ctx.lineWidth = 1;
    for (let k = 2; k < n; k += 2) {
      const [px, py] = pts[k]!;
      const ang = rnd(k, seed) * TAU;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(ang) * 9, py + Math.sin(ang) * 9);
      ctx.stroke();
    }
    glow(ctx, tx, ty, 12, "#9fd0ff", fade, 1);
    sparks(ctx, tx, ty, 6, 14, t, "#dff0ff", w.seed);
  });
}

/** 어둠 심연: 검보라 소용돌이 팔 넷이 돌며 · 가운데는 검은 구멍 · 바깥 조각이 빨려 들어감 */
function abyss(ctx: Ctx, w: Aw): void {
  const { x, y, r, e, life } = w;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(5,0,15,${0.85 * life})`);
  g.addColorStop(0.35, `rgba(50,10,90,${0.55 * life})`);
  g.addColorStop(1, "rgba(60,20,110,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let k = 0; k < 4; k++) {
      const base = (k * TAU) / 4 + e * 0.08;
      ctx.strokeStyle = alpha("#a35cff", 0.7 * life);
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let j = 0; j <= 20; j++) {
        const u = j / 20;
        const ang = base + u * 2.6;
        const d = r * (1 - u) * 0.95;
        if (j) ctx.lineTo(x + Math.cos(ang) * d, y + Math.sin(ang) * d);
        else ctx.moveTo(x + Math.cos(ang) * d, y + Math.sin(ang) * d);
      }
      ctx.stroke();
    }
    // 빨려 드는 조각
    for (let k = 0; k < 14; k++) {
      const ph = (rnd(w.seed, k) + e * 0.015) % 1;
      const ang = rnd(k, w.seed) * TAU + ph * 2.2;
      const d = r * (1 - ph);
      glow(ctx, x + Math.cos(ang) * d, y + Math.sin(ang) * d, 2.5, "#d6b0ff", ph * life, 1);
    }
    shock(ctx, x, y, r * (0.95 + Math.sin(e * 0.2) * 0.03), "#7d3cff", 0.5 * life, 3);
  });
}

/** 사신의 낫: 커다란 초승달이 내 둘레를 한 바퀴 휘두름 · 뒤로 흐려지는 잔상 · 흩어지는 넋 */
function scythe(ctx: Ctx, w: Aw): void {
  const { x, y, r, t } = w;
  const sweep = easeOut(Math.min(1, t * 1.6)) * TAU;
  const fade = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
  additive(ctx, () => {
    // 잔상 (뒤로 갈수록 흐린 보랏빛 칼날) → 맨 앞은 흰 칼날
    for (let k = 6; k >= 0; k--) {
      const ang = sweep - k * 0.3 - Math.PI / 2;
      crescent(ctx, x, y, r, ang, 0.55, k ? 9 : 13, k ? "#8a7cff" : "#f0eeff", fade * (1 - k / 7) * (k ? 0.6 : 1));
    }
    glow(ctx, x, y, r * 0.5, "#6a5acd", 0.4 * fade);
    for (let k = 0; k < 8; k++) {
      const ang = rnd(w.seed, k) * TAU;
      const d = r * (0.6 + 0.5 * t);
      glow(ctx, x + Math.cos(ang) * d, y + Math.sin(ang) * d - t * 14, 3, "#cfc8ff", fade * 0.8, 1);
    }
  });
}

/** 바위 가시 하나 (밝은 옆면 · 어두운 옆면) */
function spike(ctx: Ctx, x: number, y: number, h: number, wd: number, a: number): void {
  ctx.fillStyle = `rgba(110,74,44,${a})`;
  ctx.beginPath();
  ctx.moveTo(x - wd, y);
  ctx.lineTo(x, y - h);
  ctx.lineTo(x + wd, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = `rgba(196,150,100,${a})`;
  ctx.beginPath();
  ctx.moveTo(x - wd, y);
  ctx.lineTo(x, y - h);
  ctx.lineTo(x - wd * 0.15, y);
  ctx.closePath();
  ctx.fill();
}

/** 지각 분쇄: 갈라지는 땅 금 → 고리마다 차례로 솟는 바위 가시 · 흙먼지 */
function quake(ctx: Ctx, w: Aw): void {
  const { x, y, r, e, life } = w;
  const step = w.fx.width ?? 8;
  const rings = 3;
  ctx.strokeStyle = `rgba(60,36,18,${0.6 * life})`;
  ctx.lineWidth = 1.2;
  for (let k = 0; k < 10; k++) {
    const ang = (k * TAU) / 10 + rnd(w.seed, k) * 0.4;
    const len = r * Math.min(1, e / (step * rings));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(ang) * len * 0.5 + rnd(k, 1) * 4, y + Math.sin(ang) * len * 0.5);
    ctx.lineTo(x + Math.cos(ang + 0.1) * len, y + Math.sin(ang + 0.1) * len);
    ctx.stroke();
  }
  for (let i = 0; i < rings; i++) {
    const at = step * (i + 1);
    if (e < at) continue;
    const f = Math.min(1, (e - at) / 6);
    const out = e - at > 20 ? Math.max(0, 1 - (e - at - 20) / 16) : 1;
    const rr = (r / rings) * (i + 1);
    const n = 8 + i * 5;
    for (let k = 0; k < n; k++) {
      const ang = (k * TAU) / n + i * 0.3;
      const h = (9 + rnd(k, i) * 7) * easeOut(f) * out;
      spike(ctx, x + Math.cos(ang) * rr, y + Math.sin(ang) * rr * 0.85, h, 3.5, out * life);
    }
    if (e - at < 14) {
      ctx.fillStyle = `rgba(170,140,100,${0.4 * (1 - (e - at) / 14)})`;
      ctx.beginPath();
      ctx.ellipse(x, y, rr + 6, (rr + 6) * 0.85, 0, 0, TAU);
      ctx.ellipse(x, y, Math.max(0, rr - 6), Math.max(0, rr - 6) * 0.85, 0, 0, TAU, true);
      ctx.fill();
    }
  }
}

/** 해일: 앞으로 밀려가는 물마루 (짙은 파랑 → 하늘색, 꼭대기 흰 거품) · 뒤로 남는 물빛 · 튀는 물방울 */
function wave(ctx: Ctx, w: Aw): void {
  const { x, y, t, life } = w;
  const tx = w.fx.toX ?? x;
  const ty = w.fx.toY ?? y;
  const len = Math.hypot(tx - x, ty - y) || 1;
  const ang = Math.atan2(ty - y, tx - x);
  const half = w.r / 2;
  const along = len * t;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  // 지나온 자리의 물빛
  const g = ctx.createLinearGradient(0, 0, along, 0);
  g.addColorStop(0, "rgba(40,120,220,0)");
  g.addColorStop(1, `rgba(60,150,240,${0.35 * life})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, -half, along, half * 2);
  // 물마루: 앞으로 굽은 띠
  for (const [off, col, wd] of [[0, "#1f5fbf", 12], [3, "#3d9be9", 8], [6, "#8fd3ff", 4]] as const) {
    ctx.fillStyle = alpha(col, 0.9 * life);
    ctx.beginPath();
    for (let k = 0; k <= 16; k++) {
      const v = -half + (half * 2 * k) / 16;
      const bulge = Math.cos((v / half) * (Math.PI / 2)) * 8 + Math.sin(v * 0.4 + w.e * 0.4) * 1.5;
      if (k) ctx.lineTo(along + off + bulge, v);
      else ctx.moveTo(along + off + bulge, v);
    }
    for (let k = 16; k >= 0; k--) {
      const v = -half + (half * 2 * k) / 16;
      ctx.lineTo(along + off - wd + Math.cos((v / half) * (Math.PI / 2)) * 4, v);
    }
    ctx.fill();
  }
  // 거품·물방울
  additive(ctx, () => {
    for (let k = 0; k < 14; k++) {
      const v = -half + rnd(w.seed, k) * half * 2;
      const up = ((w.e * 0.08 + rnd(k, w.seed)) % 1) * 10;
      glow(ctx, along + 8 + up, v + Math.sin(k + w.e * 0.3) * 2, 2.5, "#e6f8ff", life * (1 - up / 10), 1);
    }
  });
  ctx.restore();
}
