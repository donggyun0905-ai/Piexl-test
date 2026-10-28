// 오니 추가 공격 효과: 번개 부채꼴·불꽃·금화·한파·어둠·빛 기둥·해일·물보라·영령·신인족 각성·방망이 휘두르기 (바닥·게이지는 oni)
import type { EffectState } from "@pixel-rogue/shared";
import { additive, crescent, glow, shock, sparks } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 효과마다 같은 모양이 나오게 하는 작은 난수 (0~1) */
const hash = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** 부채꼴 번개 가닥들 (색 · 검은 번개는 보라 테두리) */
function bolts(ctx: Ctx, fx: EffectState, x: number, y: number, t: number): void {
  const half = Math.acos(Math.max(-1, Math.min(1, fx.width ?? 0.35)));
  const base = Math.atan2(fx.dirY, fx.dirX);
  const dark = fx.tint === "#1a1020";
  for (let i = 0; i < 7; i++) {
    const a = base - half + (half * 2 * (i + 0.5)) / 7;
    const len = fx.size * (0.7 + hash(i + fx.x) * 0.3);
    const pts: [number, number][] = [[x, y]];
    for (let j = 1; j <= 5; j++) {
      const d = (len * j) / 5;
      const off = (hash(i * 11 + j + Math.floor(fx.ticks / 3)) - 0.5) * 8;
      pts.push([x + Math.cos(a) * d - Math.sin(a) * off, y + Math.sin(a) * d + Math.cos(a) * off]);
    }
    if (!dark) additive(ctx, () => {
      ctx.strokeStyle = `rgba(255,240,150,${0.35 * t})`;
      ctx.lineWidth = 7;
      ctx.beginPath();
      pts.forEach(([px, py], k) => (k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.stroke();
    });
    for (const [w, c] of dark ? [[3, "#9a6aff"], [1, "#0a0610"]] : [[3, fx.tint ?? "#ffe04a"], [1, "#ffffff"]]) {
      ctx.strokeStyle = c as string;
      ctx.lineWidth = w as number;
      ctx.globalAlpha = t;
      ctx.beginPath();
      pts.forEach(([px, py], k) => (k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.stroke();
    }
  }
}

/** 부채꼴로 흩어지는 조각들 (불꽃·금화) */
function scatter(ctx: Ctx, fx: EffectState, x: number, y: number, t: number, colors: string[], sz: number): void {
  const half = Math.acos(Math.max(-1, Math.min(1, fx.width ?? 0.2)));
  const base = Math.atan2(fx.dirY, fx.dirX);
  const go = 1 - t;
  // 부채꼴 가운데 빛
  additive(ctx, () => glow(ctx, x + Math.cos(base) * fx.size * 0.4 * go, y + Math.sin(base) * fx.size * 0.4 * go, fx.size * 0.6, colors[1]!, t * 0.6));
  for (let i = 0; i < 26; i++) {
    const a = base + (hash(i) * 2 - 1) * half;
    const r = fx.size * (0.2 + hash(i + 50) * 0.8) * Math.min(1, go * 1.6);
    ctx.globalAlpha = Math.min(1, t * 1.5);
    ctx.fillStyle = colors[i % colors.length]!;
    const s2 = sz + (i % 3 === 0 ? 1 : 0);
    ctx.fillRect(Math.round(x + Math.cos(a) * r - s2 / 2), Math.round(y + Math.sin(a) * r - s2 / 2 - Math.sin(go * Math.PI) * 4 * hash(i + 9)), s2, s2);
  }
}

const ONI_FX = new Set(["oBolt", "oFlame", "oCoins", "oFrost", "oDark", "oPillar", "oWave", "oSplash", "oSpirit", "oGod", "oSwing"]);

/** 오니 효과면 그리고 true */
export function drawOniFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!ONI_FX.has(fx.kind)) return false;
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const tint = fx.tint ?? "#ffffff";
  switch (fx.kind) {
    case "oSwing": {
      const a = Math.atan2(fx.dirY, fx.dirX);
      const sweep = (1 - t) * 2.2 - 1.1;
      // 방망이 바람: 방망이 색 빛 초승달
      additive(ctx, () => crescent(ctx, x, y - 3, fx.size * 0.9, (a - 1.1 + a + sweep) / 2, Math.max(0.2, (sweep + 1.1) / 2), 6 * t + 1, tint, t));
      ctx.globalAlpha = t * 0.8;
      ctx.strokeStyle = "#e8e0f0";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y - 3, fx.size * 0.85, a - 1.1, a + sweep);
      ctx.stroke();
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    }
    case "oBolt":
      bolts(ctx, fx, x, y, t);
      break;
    case "oFlame":
      scatter(ctx, fx, x, y, t, ["#ff4a1a", "#ff8a2a", "#ffd040", "#c82a1a"], 3);
      break;
    case "oCoins":
      scatter(ctx, fx, x, y, t, ["#ffd040", "#fff0a0", "#c88a20"], 3);
      break;
    case "oFrost": {
      additive(ctx, () => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, 0.7);
        shock(ctx, 0, 0, fx.size * (1.1 - t * 0.5), tint, t, 7);
        glow(ctx, 0, 0, fx.size, "#c8f4ff", t * 0.5);
        ctx.restore();
      });
      ctx.globalAlpha = t;
      ctx.strokeStyle = tint;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(x, y, fx.size * (1.1 - t * 0.5), fx.size * (1.1 - t * 0.5) * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r = fx.size * (1 - t) * 1.1;
        ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r * 0.7), 2, 2);
      }
      if (fx.dirX) bolts(ctx, { ...fx, size: fx.size * 0.6, width: -1 }, x, y - 4, t * 0.6);
      break;
    }
    case "oDark": {
      additive(ctx, () => shock(ctx, x, y - 3, fx.size * (1.2 - t * 0.7), "#8a5ab8", t, 6));
      ctx.globalAlpha = t;
      ctx.fillStyle = "#2a1040";
      ctx.beginPath();
      ctx.arc(x, y - 3, fx.size * (1 - t) * 0.7 + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + hash(i) * 0.4;
        const r = fx.size * (1.2 - t * 0.7);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 3, y - 3 + Math.sin(a) * 3);
        ctx.lineTo(x + Math.cos(a) * r, y - 3 + Math.sin(a) * r);
        ctx.stroke();
      }
      break;
    }
    case "oPillar": {
      // 하늘에서 내리꽂는 빛 기둥 + 사방으로 터지는 빛
      const w = 10 * t + 2;
      additive(ctx, () => {
        for (const [ww, a] of [[3, 0.3], [1, 0.7], [0.45, 1]] as const) {
          const g = ctx.createLinearGradient(0, y - 120, 0, y);
          g.addColorStop(0, "rgba(255,248,216,0)");
          g.addColorStop(1, `rgba(255,248,216,${a * t})`);
          ctx.fillStyle = g;
          ctx.fillRect(x - (w * ww) / 2, y - 120, w * ww, 120);
        }
        glow(ctx, x, y, fx.size, "#ffd040", t, 1.2);
        shock(ctx, x, y, fx.size * (1.3 - t), "#fff0a0", t, 5);
      });
      ctx.globalAlpha = t;
      ctx.strokeStyle = "#ffd040";
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r = fx.size * (1.3 - t);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4);
        ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
        ctx.stroke();
      }
      break;
    }
    case "oWave": {
      const a = Math.atan2(fx.dirY, fx.dirX);
      const half = Math.acos(Math.max(-1, Math.min(1, fx.width ?? 0.3)));
      for (let i = 0; i < 3; i++) {
        const r = fx.size * ((1 - t) * 0.9 + 0.1) - i * 6;
        if (r <= 2) continue;
        additive(ctx, () => crescent(ctx, x, y - 2, r, a, half, 5 - i, i === 0 ? "#e0f4ff" : tint, t * (1 - i * 0.25)));
      }
      break;
    }
    case "oSplash": {
      const k = 1 - t;
      const tx = fx.toX ?? x;
      const ty = fx.toY ?? y;
      ctx.globalAlpha = t;
      ctx.fillStyle = "#7ac8ff";
      for (let i = 0; i < 4; i++) {
        const u = Math.min(1, k * 1.5 - i * 0.1);
        if (u <= 0) continue;
        ctx.fillRect(Math.round(x + (tx - x) * u), Math.round(y + (ty - y) * u - Math.sin(u * Math.PI) * 8), 2, 2);
      }
      if (k > 0.6) {
        ctx.strokeStyle = "#e0f4ff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(snap(tx), snap(ty), 3 + (k - 0.6) * 12, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case "oSpirit": {
      // 서늘한 영령이 솟아오름
      const up = (1 - t) * 14;
      additive(ctx, () => {
        glow(ctx, x, y - 8 - up, 10, "#c8f4ff", t * 0.8, 1);
        shock(ctx, x, y, fx.size * (1 - t * 0.5), tint, t, 4);
      });
      ctx.globalAlpha = t * 0.9;
      ctx.fillStyle = "#e0f8ff";
      ctx.beginPath();
      ctx.arc(x, y - 8 - up, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x - 4, y - 8 - up, 8, 7);
      ctx.fillStyle = tint;
      ctx.fillRect(x - 2, y - 9 - up, 1, 1);
      ctx.fillRect(x + 1, y - 9 - up, 1, 1);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, fx.size * (1 - t * 0.5), 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "oGod": {
      // 신인족 각성: 금빛 폭발 + 붉은 충격파
      additive(ctx, () => {
        glow(ctx, x, y - 6, fx.size * 1.5, "#ffd040", t, t > 0.8 ? 1.8 : 0.5);
        shock(ctx, x, y - 6, fx.size * (1.6 - t), "#ff6a2a", t, 7);
        sparks(ctx, x, y - 6, 16, fx.size * 2, 1 - t, "#fff0a0", fx.x + fx.y);
      });
      ctx.globalAlpha = t;
      ctx.strokeStyle = "#ffd040";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y - 6, fx.size * (1.6 - t), 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        ctx.strokeStyle = i % 2 ? "#ff4a2a" : "#fff0a0";
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 8, y - 6 + Math.sin(a) * 8);
        ctx.lineTo(x + Math.cos(a) * fx.size * (2 - t), y - 6 + Math.sin(a) * fx.size * (2 - t));
        ctx.stroke();
      }
      break;
    }
  }
  ctx.globalAlpha = 1;
  return true;
}
