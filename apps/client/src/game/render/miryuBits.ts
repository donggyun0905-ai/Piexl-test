// 미류 그림 조각 (miryuFx·miryuBody가 씀): 칼빛 · 칼끝에서 접선으로 튀는 물보라 · 일섬에 갈라지는 물벽 · 해방 물기둥을 감아 오르는 물줄기
// · 흘려 모은 물방울 '물 구슬' (테두리·하이라이트가 있는 눈물 모양 — 물길의 흐르는 물살 줄과 다르게 보이도록)
import { additive, alpha, easeOut, glow, rnd, type Ctx } from "./pwFxBits";
import { MR } from "./miryuArt";

/** 칼빛: 휩쓴 호 전체를 따라 아주 얇은 흰 줄이 번쩍 (al) */
export function edgeGlint(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, al: number): void {
  if (al <= 0.01) return;
  additive(ctx, () => {
    ctx.strokeStyle = alpha(MR.foam, al);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r + 2, a0, a1, a1 < a0);
    ctx.stroke();
    ctx.strokeStyle = alpha(MR.aqua, al * 0.5);
    ctx.lineWidth = 3;
    ctx.stroke();
  });
}

/** 칼끝이 지나간 호를 따라 바깥·앞쪽(접선)으로 튀어 나가는 물방울 (side: 휩쓴 쪽) */
export function tangentSpray(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, f: number, seed: number, n: number): void {
  if (f >= 1) return;
  const dir = a1 < a0 ? -1 : 1;
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n;
    const at = a0 + (a1 - a0) * u;
    const lf = Math.max(0, Math.min(1, (f - u * 0.25) / 0.75));
    if (lf <= 0) continue;
    const go = easeOut(lf) * (8 + rnd(seed, i) * 14);
    const tx = Math.cos(at + dir * Math.PI / 2);
    const ty = Math.sin(at + dir * Math.PI / 2);
    const px = x + Math.cos(at) * (r + go * 0.5) + tx * go;
    const py = y + Math.sin(at) * (r + go * 0.5) + ty * go + lf * lf * 6;
    ctx.fillStyle = alpha(i % 3 ? MR.aqua : MR.foam, 1 - lf);
    const s = i % 4 === 0 ? 2 : 1;
    ctx.fillRect(Math.round(px), Math.round(py), s, s);
  }
}

/** 해룡 일섬에 양옆으로 갈라지는 물벽: 줄을 따라 솟았다가 바깥으로 쓰러짐 */
export function partWalls(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, f: number, al: number): void {
  const len = Math.hypot(x1 - x0, y1 - y0) || 1;
  const dx = (x1 - x0) / len;
  const dy = (y1 - y0) / len;
  const open = easeOut(Math.min(1, f / 0.6));
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (const s of [-1, 1]) {
      const off = 4 + open * 10;
      for (const [c, w, a] of [[MR.sea, 3, 0.5], [MR.foam, 1.2, 0.9]] as const) {
        ctx.strokeStyle = alpha(c, a * al);
        ctx.lineWidth = w;
        ctx.beginPath();
        for (let i = 0; i <= 12; i++) {
          const u = i / 12;
          const wave = Math.sin(u * Math.PI) * (1 + Math.sin(u * 9 + f * 8) * 0.25);
          const px = x0 + dx * len * u - dy * s * off * wave;
          const py = y0 + dy * len * u + dx * s * off * wave - wave * 4 * (1 - open);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }
    ctx.lineCap = "butt";
  });
}

/** 해방 물기둥을 감아 오르는 두 줄기 (해룡이 솟아오르는 모양) */
export function helix(ctx: Ctx, x: number, y: number, h: number, w: number, tick: number, al: number): void {
  if (h < 4) return;
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (const k of [0, Math.PI]) {
      ctx.strokeStyle = alpha(k ? MR.foam : MR.aqua, 0.85 * al);
      ctx.lineWidth = k ? 1.5 : 2.5;
      ctx.beginPath();
      for (let i = 0; i <= 24; i++) {
        const u = i / 24;
        const t = u * Math.PI * 4 + tick * 0.35 + k;
        const px = x + Math.cos(t) * w * (1 - u * 0.4);
        const py = y - u * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  });
}

/** 물 구슬 (흘려 모은 물방울): 진한 테두리 · 맑은 속 · 흰 하이라이트 · 도는 쪽(dx, dy)으로 끝이 뾰족한 눈물 모양 */
export function pearl(ctx: Ctx, x: number, y: number, dx: number, dy: number, r: number, al: number, tick: number, seed: number): void {
  const a = Math.atan2(dy, dx);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.beginPath();
  ctx.moveTo(r * 1.9, 0);
  ctx.quadraticCurveTo(r * 0.6, -r * 1.05, 0, -r);
  ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, true);
  ctx.quadraticCurveTo(r * 0.6, r * 1.05, r * 1.9, 0);
  ctx.closePath();
  ctx.fillStyle = alpha("#0a2a6a", 0.9 * al);
  ctx.fill();
  ctx.scale(0.72, 0.72);
  ctx.fillStyle = alpha(MR.aqua, al);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = alpha(MR.foam, al);
  ctx.fillRect(Math.round(x - r * 0.4), Math.round(y - r * 0.5), 1, 1);
  if ((tick + seed * 7) % 40 < 6) additive(ctx, () => glow(ctx, x, y, r * 3, MR.foam, 0.7 * al, 1));
}
