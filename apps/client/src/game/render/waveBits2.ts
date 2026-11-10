// 웨이브 빚은 것 그리기 2: 물고기 떼 · 물밧줄 · 물풍선·웅덩이 · 진주 · 물의 손 · 분수·물방울 · 물수제비 · 음표 · 문어 · 깃털 · 심해의 눈 · 밀물 썰물 · 물발자국 · 자유의 해일
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "@pixel-rogue/shared";
import { additive, alpha, glow, rnd } from "./pwFxBits";
import { glint } from "./seaLight";
import { ripple, softLight } from "./waveKit";
import { blob, deepEye, note, tentacle, waterFill, waterHand, WV } from "./waveArt";
import { life, type BitDraw } from "./waveBits";
import { feather, fish, rope } from "./waveShapes";

const TAU = Math.PI * 2;




export const BITS_B: Record<string, BitDraw> = {
  wvSchool: (ctx, s, b, x, y) => {
    const a = life(b, 20);
    additive(ctx, () => glow(ctx, x, y, 22, WV.deep, 0.35 * a));
    for (let i = 0; i < 12; i++) {
      const t = s.tick * (0.08 + (i % 3) * 0.015) + (i * TAU) / 12;
      const r = 12 + (i % 4) * 3 + Math.sin(s.tick * 0.1 + i) * 2;
      const fx = x + Math.cos(t) * r;
      const fy = y + Math.sin(t) * r * 0.7;
      fish(ctx, fx, fy, t + Math.PI / 2, a, i % 3 ? WV.aqua : WV.gold);
    }
  },
  wvRope: (ctx, s, b, x, y) => {
    const tight = 1 - b.t / b.t0;
    for (const id of b.ids ?? []) {
      const e = s.enemies.find((o) => o.id === id && o.hp > 0);
      if (e) rope(ctx, Math.round(e.x), Math.round(e.y), x, y, 0.9, s.tick, tight);
    }
    blob(ctx, x, y, 3 + tight * 3, 1, s.tick);
  },
  wvBalloon: (ctx, s, b, x, y) => {
    const f = 1 - b.t / b.t0;
    const h = Math.sin(f * Math.PI) * 44;
    ctx.fillStyle = "rgba(0,20,40,0.3)";
    ctx.beginPath();
    ctx.ellipse(x, y + 3, 6 - h * 0.05, 2, 0, 0, TAU);
    ctx.fill();
    const by = y - h - 6;
    blob(ctx, x, by, 7 + Math.sin(s.tick * 0.4) * 0.6, 1, s.tick, 2, 0.08);
    ctx.fillStyle = WV.foam;
    ctx.fillRect(x - 1, by + 7, 2, 2);
  },
  wvPuddle: (ctx, s, b, x, y) => {
    const a = Math.min(1, b.t / 30);
    const r = b.v ?? 40;
    waterFill(ctx, x, y, r, a * 0.45, () => {
      ctx.beginPath();
      for (let i = 0; i <= 20; i++) {
        const t = (i / 20) * TAU;
        const rr = r * (0.85 + rnd(i % 20, 7) * 0.2);
        ctx.lineTo(x + Math.cos(t) * rr, y + Math.sin(t) * rr * 0.55);
      }
      ctx.closePath();
    }, 1);
    softLight(ctx, x, y, r * 0.7, r * 0.35, s.tick, a);
    // 반들반들한 물웅덩이 윗면 반사
    additive(ctx, () => {
      ctx.strokeStyle = alpha(WV.foam, 0.5 * a);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(x - r * 0.15, y - r * 0.12, r * 0.55, r * 0.2, 0, Math.PI * 1.1, Math.PI * 1.6);
      ctx.stroke();
    });
  },
  wvPearl: (ctx, s, b, x, y) => {
    const n = b.n ?? 0;
    const r = 3.5 + n * 0.4;
    additive(ctx, () => {
      const g = ctx.createLinearGradient(x, y, x - b.dx * (14 + n * 3), y - b.dy * (14 + n * 3));
      g.addColorStop(0, alpha(WV.pink, 0.7));
      g.addColorStop(1, alpha(WV.pink, 0));
      ctx.strokeStyle = g;
      ctx.lineWidth = r * 1.6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - b.dx * (14 + n * 3), y - b.dy * (14 + n * 3));
      ctx.stroke();
      ctx.lineCap = "butt";
      glow(ctx, x, y, r * 3, WV.pale, 0.6);
    });
    const g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, 0.5, x, y, r);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.6, "#f4ecff");
    g.addColorStop(1, "#d8c8f0");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    glint(ctx, x - r * 0.4, y - r * 0.4, 2 + n * 0.3, "#ffffff", 1);
  },
  wvHands: (ctx, s, b, x, y) => {
    const f = 1 - b.t / b.t0;
    const gap = 50 * (1 - f * f);
    const rise = Math.min(1, f * 3);
    softLight(ctx, x, y + 2, 44, 18, s.tick, 0.7);
    ripple(ctx, x, y + 4, 10 + f * 30, 0.6, 1);
    for (const side of [-1, 1]) waterHand(ctx, x - side * gap, y + 6 + (1 - rise) * 10, side, 1.05, rise, s.tick);
  },
  wvFountain: (ctx, s, b, x, y) => {
    const a = life(b, 20);
    ctx.fillStyle = alpha("#c8d6e4", 0.9 * a);
    ctx.beginPath();
    ctx.ellipse(x, y + 2, 10, 4, 0, 0, TAU);
    ctx.fill();
    waterFill(ctx, x, y + 1, 8, a, () => {
      ctx.beginPath();
      ctx.ellipse(x, y + 1, 8, 3, 0, 0, TAU);
    }, 0.6);
    additive(ctx, () => {
      ctx.lineCap = "round";
      ctx.strokeStyle = alpha(WV.foam, 0.9 * a);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - 18 - Math.sin(s.tick * 0.3) * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
      for (const sd of [-1, 1]) {
        ctx.strokeStyle = alpha(WV.aqua, 0.8 * a);
        ctx.beginPath();
        ctx.moveTo(x, y - 18);
        ctx.quadraticCurveTo(x + sd * 8, y - 24, x + sd * 11, y - 2);
        ctx.stroke();
      }
      ctx.lineCap = "butt";
      glow(ctx, x, y - 18, 6, WV.foam, 0.8 * a, 1);
    });
  },
  wvLob: (ctx, _s, b, x, y) => {
    const f = 1 - b.t / b.t0;
    const h = Math.sin(f * Math.PI) * 26;
    additive(ctx, () => glow(ctx, x, y - h, 6, WV.aqua, 0.7, 0.8));
    ctx.fillStyle = alpha(WV.foam, 1);
    ctx.beginPath();
    ctx.arc(x, y - h, 2.2, 0, TAU);
    ctx.fill();
  },
  wvSkip: (ctx, s, b, x, y) => {
    const hop = 34 * (1 + (b.n ?? 0) * 0.12);
    const h = Math.abs(Math.sin(((b.v ?? 0) / hop) * Math.PI)) * 10;
    ctx.fillStyle = "rgba(0,20,40,0.25)";
    ctx.fillRect(x - 3, y + 1, 6, 2);
    ctx.save();
    ctx.translate(x, y - h);
    ctx.rotate(s.tick * 0.4);
    waterFill(ctx, 0, 0, 3.5, 1, () => {
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.8, 2.2, 0, 0, TAU);
    }, 0.8);
    ctx.restore();
  },
  wvNote: (ctx, s, b, x, y) => {
    additive(ctx, () => glow(ctx, x, y, 8, WV.pink, 0.5 * life(b, 6)));
    note(ctx, x, y + Math.sin(s.tick * 0.3 + (b.v ?? 0)) * 1.5, 1, life(b, 6));
  },
  wvOctopus: (ctx, s, b, x, y) => {
    const a = life(b, 10);
    const done = b.n ?? 0;
    const base = Math.atan2(b.dy, b.dx);
    softLight(ctx, x, y, 50, 26, s.tick, 0.7 * a);
    ripple(ctx, x, y, 22 + Math.sin(s.tick * 0.1) * 2, 0.6 * a, 1.2);
    // 아직 안 내리친 다리: 머리 둘레에서 꿈틀
    for (let i = done; i < 8; i++) {
      const t = base + ((i * 3) % 8) * (TAU / 8);
      const len = 16 + Math.sin(s.tick * 0.15 + i) * 3;
      tentacle(ctx, x + Math.cos(t) * 6, y + Math.sin(t) * 4, x + Math.cos(t) * len, y + Math.sin(t) * len * 0.7, 8, a, Math.sin(s.tick * 0.1 + i) * 8);
    }
    blob(ctx, x, y - 6, 10, a, s.tick, 4, 0.06);
    ctx.fillStyle = alpha(WV.ink, a);
    ctx.fillRect(x - 5, y - 6, 2, 2);
    ctx.fillRect(x + 3, y - 6, 2, 2);
  },
  wvFeather: (ctx, s, b, x, y) => feather(ctx, x, y, Math.atan2(b.dy, b.dx) + Math.sin(s.tick * 0.5) * 0.2, life(b, 6)),
  wvEye: (ctx, s, b, x, y) => {
    const f = 1 - b.t / b.t0;
    const open = Math.min(1, f * 2.5);
    ctx.save();
    ctx.translate(x, y + 4);
    ctx.scale(1, 0.55);
    deepEye(ctx, 0, 0, 26, open, 0.9, s.tick);
    ctx.restore();
    // 짓눌러 오는 수압 고리 (점점 좁아짐)
    for (let i = 0; i < 3; i++) {
      const u = (f * 2 + i / 3) % 1;
      ripple(ctx, x, y + 4, 46 * (1 - u), f * u, 1.4, WV.deep, 0.55);
    }
  },
  /** 밀물 썰물: 굵은 물결 띠 (안쪽 짙은 물 · 바깥 흰 물마루) + 물마루에서 튀는 물방울 */
  wvEbb: (ctx, s, b, x, y) => {
    const r = b.v ?? 0;
    if (r < 2) return;
    const out = b.t0 - b.t < 30;
    const lip = out ? r : r - 6;
    additive(ctx, () => {
      const g = ctx.createRadialGradient(x, y, Math.max(0, r - 12), x, y, r + 4);
      g.addColorStop(0, alpha(WV.deep, 0));
      g.addColorStop(0.55, alpha(WV.aqua, 0.45));
      g.addColorStop(0.85, alpha(WV.sky, 0.7));
      g.addColorStop(1, alpha(WV.foam, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r + 4, 0, TAU);
      ctx.arc(x, y, Math.max(0, r - 12), 0, TAU, true);
      ctx.fill();
      // 물마루: 물결치는 흰 줄
      ctx.strokeStyle = alpha(WV.foam, 0.95);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let i = 0; i <= 48; i++) {
        const t = (i / 48) * TAU;
        const rr = lip + Math.sin(t * 9 + s.tick * 0.3) * 1.4;
        ctx.lineTo(x + Math.cos(t) * rr, y + Math.sin(t) * rr);
      }
      ctx.stroke();
      for (let i = 0; i < 18; i++) {
        const t = (i / 18) * TAU + s.tick * 0.01;
        const off = ((s.tick * 0.5 + i * 3) % 8) * (out ? 1 : -1);
        ctx.fillStyle = alpha(i % 2 ? WV.foam : WV.sky, 0.9 - Math.abs(off) / 10);
        ctx.fillRect(x + Math.cos(t) * (lip + off), y + Math.sin(t) * (lip + off) - Math.abs(off) * 0.4, 1.5, 1.5);
      }
    });
  },
  wvTrail: (ctx, s, b) => {
    const pts = b.pts ?? [];
    const from = (b.n ?? 0) * 2;
    for (let i = from; i < pts.length; i += 2) {
      const soon = 1 - Math.min(1, (i - from) / 16);
      const px = Math.round(pts[i]!);
      const py = Math.round(pts[i + 1]!);
      additive(ctx, () => glow(ctx, px, py, 5 + soon * 4, WV.aqua, 0.4 + soon * 0.5, soon));
      ctx.fillStyle = alpha(WV.foam, 0.5 + soon * 0.5);
      ctx.fillRect(px - 1, py - 1, 2, 2);
    }
  },
  /** 자유의 해일: 방을 가로지르는 큰 물벽 (뒤는 짙은 바다 · 앞은 흰 물마루가 말려 넘어옴) */
  wvTsunami: (ctx, s, b, x, y) => {
    const a = life(b, 10);
    const ang = Math.atan2(b.dy, b.dx);
    const span = Math.max(ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y) + 80;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    const g = ctx.createLinearGradient(-60, 0, 20, 0);
    g.addColorStop(0, alpha(WV.deep, 0));
    g.addColorStop(0.55, alpha(WV.deep, 0.55 * a));
    g.addColorStop(0.85, alpha(WV.aqua, 0.75 * a));
    g.addColorStop(1, alpha(WV.foam, 0.95 * a));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-60, -span);
    for (let i = 0; i <= 40; i++) {
      const v = -span + (i / 40) * span * 2;
      ctx.lineTo(18 + Math.sin(v * 0.08 + s.tick * 0.25) * 4 + Math.sin(v * 0.031 - s.tick * 0.1) * 3, v);
    }
    ctx.lineTo(-60, span);
    ctx.closePath();
    ctx.fill();
    additive(ctx, () => {
      ctx.strokeStyle = alpha(WV.foam, a);
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const v = -span + (i / 40) * span * 2;
        ctx.lineTo(18 + Math.sin(v * 0.08 + s.tick * 0.25) * 4 + Math.sin(v * 0.031 - s.tick * 0.1) * 3, v);
      }
      ctx.stroke();
      for (let k = 0; k < 40; k++) {
        const v = -span + rnd(k, 9) * span * 2;
        const up = ((s.tick * 0.05 + rnd(9, k)) % 1);
        ctx.fillStyle = alpha(k % 2 ? WV.foam : WV.sky, a * (1 - up));
        ctx.fillRect(20 + up * 16, v + Math.sin(up * 3) * 4, 2, 2);
      }
    });
    ctx.restore();
    softLight(ctx, x - b.dx * 30, y - b.dy * 30, 40, 30, s.tick, a);
  },
};
