// 웨이브 빚은 것 그리기 1: 초승달 · 물나비 · 물창 · 여신 · 꿈의 고래 · 거품 · 물시계 · 해파리 · 물거울 · 구름 · 용오름 · 연꽃·꽃잎 · 물방울
import { jellyPts, type RunState, type WvBit } from "@pixel-rogue/shared";
import { additive, alpha, glow, rnd, shock, type Ctx } from "./pwFxBits";
import { caustic, glint, glints } from "./seaLight";
import { blob, butterfly, crestWave, dreamWhale, goddess, waterFill, WV } from "./waveArt";
import { jelly, petal, waterGirl, zapLine } from "./waveShapes";

export { petal } from "./waveShapes";

const TAU = Math.PI * 2;
export type BitDraw = (ctx: Ctx, s: RunState, b: WvBit, x: number, y: number) => void;
/** 나타날 때·사라질 때 부드럽게 */
export const life = (b: WvBit, fade = 12) => Math.min(1, b.t / fade, (b.t0 - b.t + 1) / 6);
const ang = (b: WvBit) => Math.atan2(b.dy, b.dx);





export const BITS_A: Record<string, BitDraw> = {
  crest: (ctx, s, b, x, y) => crestWave(ctx, x, y, ang(b), b.v ?? 8, life(b, 6), s.tick),
  wvButterfly: (ctx, s, b, x, y) => {
    butterfly(ctx, x, y, ang(b), (s.tick * 0.09 + (b.v ?? 0)) % 1, 4.5, life(b));
    glints(ctx, x - b.dx * 6, y - b.dy * 6, 4, 2, s.tick, b.v ?? 0, WV.foam, 0.6 * life(b));
  },
  wvSpear: (ctx, s, b, x, y) => {
    const a0 = ang(b);
    const aim = b.n === 0;
    const grow = aim ? Math.min(1, (b.t0 - b.t) / 16) : 1;
    const len = 30 * grow;
    if (aim) additive(ctx, () => {
      // 물이 모여드는 소용돌이
      for (let i = 0; i < 6; i++) {
        const t = (s.tick * 0.15 + i) % 1;
        const r = 18 * (1 - t);
        const aa = i * 1.05 + s.tick * 0.12;
        ctx.fillStyle = alpha(WV.foam, t);
        ctx.fillRect(x + Math.cos(aa) * r, y + Math.sin(aa) * r * 0.7, 1.5, 1.5);
      }
    });
    else additive(ctx, () => {
      const g = ctx.createLinearGradient(x, y, x - b.dx * 70, y - b.dy * 70);
      g.addColorStop(0, alpha(WV.aqua, 0.8));
      g.addColorStop(1, alpha(WV.aqua, 0));
      ctx.strokeStyle = g;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - b.dx * 70, y - b.dy * 70);
      ctx.stroke();
    });
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a0);
    additive(ctx, () => glow(ctx, 0, 0, len, WV.aqua, 0.7 * grow, 0.4));
    waterFill(ctx, 0, 0, len * 0.5, grow, () => {
      ctx.beginPath();
      ctx.moveTo(len * 0.6, 0);
      ctx.lineTo(len * 0.25, -3.5);
      ctx.lineTo(len * 0.28, -1.2);
      ctx.lineTo(-len * 0.6, -1.2);
      ctx.lineTo(-len * 0.7, 0);
      ctx.lineTo(-len * 0.6, 1.2);
      ctx.lineTo(len * 0.28, 1.2);
      ctx.lineTo(len * 0.25, 3.5);
      ctx.closePath();
    }, 1);
    glint(ctx, len * 0.6, 0, 3 + Math.sin(s.tick * 0.5), WV.foam, grow);
    ctx.restore();
  },
  wvGoddess: (ctx, s, b, x, y) => {
    const age = b.t0 - b.t;
    const pour = age > 10 ? Math.max(0, 1 - ((age - 10) % 30) / 12) : 0;
    goddess(ctx, x, y + 6, 0.9, life(b, 20) * 0.95, s.tick, pour);
  },
  wvBubble: (ctx, s, b, x, y) => {
    const r = (b.v ?? 6) + 6 + Math.sin(s.tick * 0.2) * 0.8;
    const a = life(b, 6);
    additive(ctx, () => glow(ctx, x, y, r * 1.3, WV.pale, 0.35 * a));
    ctx.fillStyle = alpha(WV.aqua, 0.15 * a);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    // 무지갯빛이 도는 얇은 막
    const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
    g.addColorStop(0, alpha(WV.pink, a));
    g.addColorStop(0.5, alpha(WV.foam, a));
    g.addColorStop(1, alpha(WV.aqua, a));
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.strokeStyle = alpha("#ffffff", 0.9 * a);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.7, -2.6, -1.8);
    ctx.stroke();
  },
  wvJelly: (ctx, s, b) => {
    const a = life(b, 20);
    const pts = jellyPts(b).map(([px, py]) => [Math.round(px), Math.round(py)] as const);
    const zap = (b.t0 - b.t) % 20 < 5;
    for (let i = 0; i < 3; i++) {
      const [ax, ay] = pts[i]!;
      const [bx, by] = pts[(i + 1) % 3]!;
      if (zap) zapLine(ctx, ax, ay, bx, by, s.tick + i * 7, a);
      else additive(ctx, () => {
        ctx.strokeStyle = alpha(WV.gold, 0.25 * a);
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }
    pts.forEach(([px, py], i) => jelly(ctx, px, py - Math.sin(s.tick * 0.08 + i * 2) * 2, a, s.tick, i * 2.1));
  },
  wvMirror: (ctx, s, b, x, y) => {
    const a = life(b, 20) * (0.75 + Math.sin(s.tick * 0.3) * 0.1);
    waterGirl(ctx, x, y, a, s.tick, b.dx >= 0 ? 1 : -1);
    caustic(ctx, x, y + 2, 9, s.tick, 0.5 * a);
  },
  wvCloud: (ctx, s, b, x, y) => {
    const a = life(b, 20);
    const cy = y - 26;
    // 빗줄기
    additive(ctx, () => {
      ctx.strokeStyle = alpha(WV.sky, 0.7 * a);
      ctx.lineWidth = 1;
      for (let i = 0; i < 9; i++) {
        const u = ((s.tick * 0.09 + rnd(i, 4)) % 1);
        const rx = x + (rnd(4, i) - 0.5) * 30;
        const ry = cy + 4 + u * 28;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 1, ry + 4);
        ctx.stroke();
      }
    });
    for (const [ox, oy, r] of [[-9, 1, 6], [0, -3, 8], [9, 0, 6], [4, 3, 5], [-4, 3, 5]] as const) {
      ctx.fillStyle = alpha(oy < 0 ? "#f4fbff" : "#c8d8ea", 0.92 * a);
      ctx.beginPath();
      ctx.arc(x + ox, cy + oy, r, 0, TAU);
      ctx.fill();
    }
    additive(ctx, () => glow(ctx, x, cy, 18, WV.aqua, 0.25 * a));
  },
  wvSpout: (ctx, s, b, x, y) => {
    const a = life(b, 20);
    additive(ctx, () => glow(ctx, x, y - 14, 30, WV.aqua, 0.4 * a));
    for (let i = 0; i < 9; i++) {
      const u = i / 8;
      const r = 4 + u * 16;
      const yy = y - u * 34;
      const sway = Math.sin(s.tick * 0.12 + u * 3) * u * 6;
      ctx.strokeStyle = alpha(i % 2 ? WV.aqua : WV.foam, (0.4 + u * 0.5) * a);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(x + sway, yy, r, r * 0.3, 0, s.tick * 0.3 + i, s.tick * 0.3 + i + Math.PI * 1.5);
      ctx.stroke();
    }
    for (let k = 0; k < 8; k++) {
      const t = s.tick * 0.25 + k * 0.8;
      const h = (k * 4.3) % 30;
      ctx.fillStyle = alpha(WV.foam, a);
      ctx.fillRect(x + Math.cos(t) * (6 + h * 0.5), y - h + Math.sin(t) * 2, 1.5, 1.5);
    }
  },
  wvLotus: (ctx, s, b, x, y) => {
    const k = 8;
    const age = b.t0 - b.t;
    const open = Math.min(1, age / 20);
    const a = life(b, 10);
    additive(ctx, () => glow(ctx, x, y, 26 * open, WV.pink, 0.5 * a, 0.4));
    caustic(ctx, x, y, 22, s.tick, 0.5 * a);
    for (let i = (b.n ?? 0); i < k; i++) petal(ctx, x, y, (i * TAU) / k + age * 0.02, 6 + open * 10, a);
    for (let i = 0; i < 5; i++) petal(ctx, x, y, (i * TAU) / 5 - age * 0.03, 5 + open * 4, a * 0.9);
    additive(ctx, () => glow(ctx, x, y, 5, WV.gold, a, 1));
  },
  wvPetal: (ctx, s, b, x, y) => {
    additive(ctx, () => glow(ctx, x, y, 8, WV.pink, 0.4 * life(b, 6)));
    petal(ctx, x - b.dx * 5, y - b.dy * 5, ang(b) + Math.sin(s.tick * 0.4) * 0.3, 10, life(b, 6));
  },
  wvDrop: (ctx, _s, b, x, y) => {
    additive(ctx, () => {
      ctx.strokeStyle = alpha(WV.aqua, 0.6);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - b.dx * 8, y - b.dy * 8);
      ctx.stroke();
      glow(ctx, x, y, 4, WV.foam, 0.8, 1);
    });
  },
  /** 꿈의 고래: 바닥 아래 헤엄치는 그림자 (몸 뒤) */
  wvWhale: (ctx, s, b, x, y) => {
    const a = life(b, 4);
    ctx.save();
    ctx.globalAlpha = 0.55;
    dreamWhale(ctx, x, y + 2, ang(b), 0.8, a * 0.6, s.tick);
    ctx.restore();
    additive(ctx, () => shock(ctx, x, y, 14 + (s.tick % 16), WV.foam, 0.4 * a, 2));
  },
  /** 물시계: 느려진 시간의 원 (몸 뒤) */
  wvClock: (ctx, s, b, x, y) => {
    const a = life(b, 20);
    const r = 70;
    ctx.fillStyle = alpha(WV.deep, 0.16 * a);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    additive(ctx, () => {
      shock(ctx, x, y, r, WV.aqua, 0.5 * a, 4);
      // 안쪽으로 천천히 줄어드는 물결 (거꾸로 흐르는 시간)
      for (let i = 0; i < 3; i++) shock(ctx, x, y, r * (1 - ((s.tick * 0.006 + i / 3) % 1)), WV.pale, 0.25 * a, 2);
      ctx.strokeStyle = alpha(WV.gold, 0.7 * a);
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const t = (i / 12) * TAU;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(t) * (r - 8), y + Math.sin(t) * (r - 8));
        ctx.lineTo(x + Math.cos(t) * (r - (i % 3 ? 4 : 0)), y + Math.sin(t) * (r - (i % 3 ? 4 : 0)));
        ctx.stroke();
      }
      ctx.lineWidth = 2;
      for (const [len, sp] of [[r * 0.5, 0.01], [r * 0.75, 0.04]] as const) {
        const t = s.tick * sp - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(t) * len, y + Math.sin(t) * len);
        ctx.stroke();
      }
    });
    blob(ctx, x, y, 4, a, s.tick, 5, 0.05);
  },
};
