// 베아트리스 그림 도우미: 칼선(가운데 굵고 끝이 가는 빛 칼날) · 빛살 · 깃털 · 악의 마크(×숫자) · 불티
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";

/** 색: 평소 주황 · 태양 붉은빛 · 불꽃 · 금 · 흰 · 짙은 악 */
export const BT = { orange: "#ff9a3a", sun: "#ff2a10", flame: "#ff6a1a", gold: "#ffd24a", white: "#fff6d8", dark: "#5a0a14", evil: "#c0102a", holy: "#fff2a8" };

/** 칼선: (ax,ay)→(bx,by) 중 t0~t1 구간을 가운데가 굵고 끝이 가는 칼날 모양으로 (바깥 빛 · 색 · 흰 속) */
export function bladeStroke(ctx: Ctx, ax: number, ay: number, bx: number, by: number, t0: number, t1: number, w: number, c: string, al: number): void {
  if (t1 <= t0 || al <= 0) return;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const shape = (ww: number, fill: string) => {
    const n = 16;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const u = t0 + ((t1 - t0) * i) / n;
      const k = Math.sin(Math.PI * (i / n)) * ww;
      ctx.lineTo(ax + dx * u + nx * k, ay + dy * u + ny * k);
    }
    for (let i = n; i >= 0; i--) {
      const u = t0 + ((t1 - t0) * i) / n;
      const k = Math.sin(Math.PI * (i / n)) * ww * 0.35;
      ctx.lineTo(ax + dx * u - nx * k, ay + dy * u - ny * k);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };
  additive(ctx, () => {
    shape(w * 2.2, alpha(c, al * 0.22));
    shape(w, alpha(c, al * 0.9));
    shape(w * 0.45, alpha(BT.gold, al));
    shape(w * 0.18, `rgba(255,255,255,${Math.min(1, al)})`);
  });
}

/** 빛살: 가운데에서 바깥으로 n줄 (돌림 spin) */
export function rays(ctx: Ctx, x: number, y: number, r0: number, r1: number, n: number, spin: number, c: string, al: number, w = 2): void {
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const a = spin + (i / n) * Math.PI * 2;
      const long = i % 2 ? 0.7 : 1;
      ctx.strokeStyle = alpha(c, al * (i % 2 ? 0.6 : 1));
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0);
      ctx.lineTo(x + Math.cos(a) * r1 * long, y + Math.sin(a) * r1 * long);
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  });
}

/** 깃털 하나 (x, y · 길이 l · 기울기 a · 투명도) : 흰 깃 + 금빛 깃대 */
export function feather(ctx: Ctx, x: number, y: number, l: number, a: number, al: number): void {
  const c = Math.cos(a);
  const s = Math.sin(a);
  ctx.save();
  ctx.translate(x, y);
  ctx.transform(c, s, -s, c, 0, 0);
  ctx.fillStyle = `rgba(255,253,240,${al})`;
  ctx.beginPath();
  ctx.moveTo(-l / 2, 0);
  ctx.quadraticCurveTo(-l * 0.1, -l * 0.32, l / 2, -l * 0.06);
  ctx.quadraticCurveTo(0, l * 0.22, -l / 2, 0);
  ctx.fill();
  ctx.strokeStyle = alpha(BT.gold, al * 0.9);
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-l / 2 - 1, 0.5);
  ctx.lineTo(l / 2, -l * 0.05);
  ctx.stroke();
  ctx.restore();
}

/** 흩날리는 깃털들: 가운데 (x, y) 반지름 r 둘레 곳곳에서 천천히 떨어지며 흔들림 (n개 · t 시간 틱) */
export function featherField(ctx: Ctx, x: number, y: number, r: number, n: number, t: number, al: number): void {
  for (let i = 0; i < n; i++) {
    const life = 90 + rnd(i, 3) * 60;
    const u = ((t + rnd(i, 7) * life) % life) / life;
    const ang = rnd(i, 11) * Math.PI * 2;
    const dist = r * (0.25 + rnd(i, 13) * 0.85);
    const fx = x + Math.cos(ang) * dist + Math.sin(t * 0.05 + i) * 6;
    const fy = y + Math.sin(ang) * dist * 0.55 - 30 + u * 46;
    const fade = Math.min(1, u * 6, (1 - u) * 4) * al;
    feather(ctx, fx, fy, 8 + rnd(i, 17) * 5, Math.sin(t * 0.06 + i * 1.7) * 0.9 + 0.4, fade);
  }
}

/** 악의 마크: 작은 붉은 X 문장 + "x숫자" (다른 캐릭터 표식과 같은 크기 · 7 이상이면 붉게 타오름) */
export function evilMark(ctx: Ctx, x: number, y: number, n: number, tick: number): void {
  const hot = n >= 7;
  if (hot) additive(ctx, () => glow(ctx, x - 3, y, 4, BT.sun, 0.35 + 0.25 * Math.sin(tick * 0.3)));
  // 문장: 작은 마름모 바탕 + 가운데 X
  ctx.fillStyle = "#1a0206";
  ctx.beginPath();
  ctx.moveTo(x - 3, y - 3);
  ctx.lineTo(x, y);
  ctx.lineTo(x - 3, y + 3);
  ctx.lineTo(x - 6, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = hot ? BT.gold : "#ff4a5a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 4.5, y - 1.5);
  ctx.lineTo(x - 1.5, y + 1.5);
  ctx.moveTo(x - 1.5, y - 1.5);
  ctx.lineTo(x - 4.5, y + 1.5);
  ctx.stroke();
  // x숫자
  const txt = `x${n}`;
  ctx.font = "bold 7px monospace";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(26,2,6,0.9)";
  ctx.strokeText(txt, x + 1, y);
  ctx.fillStyle = hot ? "#ffd8a0" : "#ff7a8a";
  ctx.fillText(txt, x + 1, y);
  ctx.textBaseline = "alphabetic";
}

/** 불티: (x, y) 둘레에서 위로 피어오르는 불씨 n개 (f 0~1 진행) */
export function embers(ctx: Ctx, x: number, y: number, n: number, spread: number, f: number, seed: number, al: number): void {
  additive(ctx, () => {
    for (let i = 0; i < n; i++) {
      const ox = (rnd(seed, i) - 0.5) * spread;
      const rise = (12 + rnd(i, seed) * 20) * f;
      const px = x + ox + Math.sin(f * 6 + i) * 3;
      const py = y - rise + (rnd(i, 5) - 0.5) * spread * 0.4;
      const c = i % 3 === 0 ? BT.gold : i % 3 === 1 ? BT.flame : BT.sun;
      ctx.fillStyle = alpha(c, al * (1 - f * 0.7));
      ctx.fillRect(px - 0.75, py - 0.75, 1.5 + (i % 2), 1.5 + (i % 2));
    }
  });
}
