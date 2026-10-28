// 보스 공격 효과 (bossFx가 부름): 칼날 베기 · 찌르기 · 덩굴 · 검기 · 받아 넘김 · 그림자 대검 · 바늘 · 대낫 · 불기둥 · 메테오 · 빛기둥
import type { EffectState } from "@pixel-rogue/shared";
import { additive, alpha, beam, crescent, glow, shock, sparks } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 찌르기: 빠르게 뻗는 빛 날 + 끝에서 터지는 빛 (격투가·거너 찌르기도 같이 씀) */
export function drawStab(ctx: Ctx, x: number, y: number, tx: number, ty: number, t: number, width: number): void {
  const k = Math.min(1, (1 - t) * 4);
  const ex = x + (tx - x) * k;
  const ey = y + (ty - y) * k;
  additive(ctx, () => {
    beam(ctx, x, y, ex, ey, width + 1, "#a8c8ff", t);
    const r = 3 + 6 * Math.sin(t * Math.PI);
    glow(ctx, ex, ey, r * 1.6, "#d8e8ff", t, 1.5);
    ctx.strokeStyle = `rgba(255,255,255,${t})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ex - r * 1.5, ey);
    ctx.lineTo(ex + r * 1.5, ey);
    ctx.moveTo(ex, ey - r * 1.5);
    ctx.lineTo(ex, ey + r * 1.5);
    ctx.stroke();
  });
}

/** 보스 공격 효과면 그리고 true */
export function drawBossHit(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  const u = 1 - t;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const tx = snap(fx.toX ?? fx.x);
  const ty = snap(fx.toY ?? fx.y);
  const seed = fx.x * 3 + fx.y;
  switch (fx.kind) {
    case "bslash": {
      // 칼날 자국: 붉은 기운을 두른 흰 초승달이 바깥으로 번짐 (한 바퀴면 고리)
      const r = fx.size * (1.05 - 0.15 * t);
      additive(ctx, () => {
        if ((fx.width ?? -1) <= -1) shock(ctx, x, y, r, "#ff6a5a", t, 7);
        else {
          const a = Math.atan2(fx.dirY, fx.dirX);
          const half = Math.acos(fx.width ?? 0);
          crescent(ctx, x, y, r, a, half, 7 * t + 1, "#ff5a4a", t);
          crescent(ctx, x, y, r * 0.86, a, half * 0.85, 3 * t, "#ffe8d8", t * 0.8);
        }
      });
      return true;
    }
    case "stab":
      drawStab(ctx, x, y, tx, ty, t, fx.width ?? 3);
      return true;
    case "vine": {
      // 덩굴: 땅이 갈라지며 솟은 굵은 줄기 + 가시 + 흙먼지
      const w = fx.width ?? 6;
      ctx.globalAlpha = Math.min(1, t * 2);
      ctx.lineCap = "round";
      for (const [c, ww] of [["#1a4a1a", w * 1.8], ["#3a8a3a", w * 1.1], ["#8ae07a", w * 0.4]] as const) {
        ctx.strokeStyle = c;
        ctx.lineWidth = ww;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
      ctx.lineCap = "butt";
      ctx.fillStyle = "#d8f8b0";
      for (let k = 0.1; k < 1; k += 0.15) {
        const px = x + (tx - x) * k;
        const py = y + (ty - y) * k;
        ctx.beginPath();
        ctx.moveTo(px - 1.5, py - 1);
        ctx.lineTo(px, py - 4);
        ctx.lineTo(px + 1.5, py - 1);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (u < 0.35) additive(ctx, () => sparks(ctx, x, y, 6, 12, u / 0.35, "#a0d070", seed));
      return true;
    }
    case "gleam":
    case "rgleam":
    case "memory": {
      // 검기·기억력 선: 빛줄기가 지나가며 가운데서 크게 반짝임
      const c = fx.kind === "rgleam" ? "#ff5a5a" : fx.kind === "memory" ? "#ffffff" : "#c8d8ff";
      additive(ctx, () => {
        beam(ctx, x, y, tx, ty, fx.kind === "memory" ? (fx.width ?? 6) * 1.4 : 1 + 3 * t, c, t);
        glow(ctx, (x + tx) / 2, (y + ty) / 2, 6 + 8 * t, c, t, 1.2);
      });
      return true;
    }
    case "parry": {
      // 받아 넘김: 엇갈린 빛 X + 흰 고리 + 불똥
      additive(ctx, () => {
        glow(ctx, x, y, 14, "#ffffff", t, 1.5);
        beam(ctx, x - 7, y - 7, x + 7, y + 7, 2, "#e8f0ff", t);
        beam(ctx, x - 7, y + 7, x + 7, y - 7, 2, "#e8f0ff", t);
        shock(ctx, x, y, 6 + 14 * u, "#ffffff", t, 3);
        sparks(ctx, x, y, 8, 18, u, "#fff0b0", seed);
      });
      return true;
    }
    case "dark":
    case "fake": {
      // 그림자 대검 찍기: 소용돌이 치는 검은 연기 + 보랏빛 테두리 + 빛나는 칼날 · 거짓 공격은 보라 연기만
      const r = fx.size * (1.1 - 0.2 * t);
      const dark = fx.kind === "dark";
      ctx.globalAlpha = t;
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * TAU + u * 2;
        ctx.fillStyle = dark ? "rgba(30, 14, 46, 0.55)" : "rgba(170, 90, 255, 0.22)";
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, r * 0.75, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      additive(ctx, () => {
        shock(ctx, x, y, r, "#9a5aff", t, 5);
        if (dark) beam(ctx, x, y - fx.size, x, y + fx.size * 0.4, 2.5, "#c8b8ff", t);
      });
      return true;
    }
    case "spike": {
      // 바닥에서 솟은 검은 바늘 + 끝의 보랏빛 + 갈라진 땅
      ctx.globalAlpha = t;
      ctx.fillStyle = "#1e1028";
      for (const dx of [-3, 0, 3]) {
        ctx.beginPath();
        ctx.moveTo(x + dx - 2, y + 3);
        ctx.lineTo(x + dx, y - fx.size * (dx === 0 ? 1.4 : 1));
        ctx.lineTo(x + dx + 2, y + 3);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      additive(ctx, () => {
        glow(ctx, x, y - fx.size * 1.3, 5, "#b070ff", t, 1);
        ctx.save();
        ctx.translate(x, y + 2);
        ctx.scale(1, 0.45);
        shock(ctx, 0, 0, 6 + 8 * u, "#8a4ad8", t, 3);
        ctx.restore();
      });
      return true;
    }
    case "scythe": {
      // 솟은 대낫: 빛나는 휜 날 + 자루
      ctx.strokeStyle = alpha("#5a4a6a", t);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + fx.size * 0.4);
      ctx.lineTo(x, y - fx.size * 0.6);
      ctx.stroke();
      additive(ctx, () => crescent(ctx, x, y + fx.size * 0.4, fx.size, -Math.PI / 2, 0.45 * Math.PI, 4 * t + 1, "#b8a0ff", t));
      return true;
    }
    case "pillar": {
      // 불기둥: 아래가 넓고 위로 일렁이며 솟는 불 + 바닥 빛
      const h = 60 * Math.min(1, u * 3 + 0.2);
      const w = fx.size;
      additive(ctx, () => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, 0.45);
        glow(ctx, 0, 0, w * 1.6, "#ff7a2a", t);
        ctx.restore();
        for (const [c, ww, a] of [["#ff5a1a", 1, 0.6], ["#ffb040", 0.6, 0.7], ["#fff0b0", 0.25, 0.9]] as const) {
          const g = ctx.createLinearGradient(0, y - h, 0, y);
          g.addColorStop(0, alpha(c, 0));
          g.addColorStop(0.6, alpha(c, a * t));
          g.addColorStop(1, alpha(c, a * t));
          ctx.fillStyle = g;
          const wob = Math.sin(fx.ticks / 2 + ww * 9) * 1.5;
          ctx.fillRect(x - (w * ww) / 2 + wob, y - h, w * ww, h + 3);
        }
        sparks(ctx, x, y - h * 0.5, 6, h * 0.6, u, "#ffd060", seed);
      });
      return true;
    }
    case "meteor": {
      // 메테오: 하얀 섬광 → 불 충격파 · 불똥 · 검은 연기
      const r = fx.size * (1.2 - 0.3 * t);
      ctx.fillStyle = `rgba(40, 20, 10, ${0.35 * t})`;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.9, 0, TAU);
      ctx.fill();
      additive(ctx, () => {
        glow(ctx, x, y, r, "#ff6a1a", t, u < 0.2 ? 2 : 0.6);
        shock(ctx, x, y, r * (0.6 + 0.6 * u), "#ffb040", t, 8);
        sparks(ctx, x, y, 14, r * 1.4, u, "#ffd060", seed);
      });
      return true;
    }
    case "holy": {
      // 빛기둥: 하늘에서 내리꽂힌 빛 + 둘레 빛살 + 바닥 빛 고리 + 오르는 빛 점
      const w = fx.size;
      additive(ctx, () => {
        for (const [ww, a] of [[1.2, 0.35], [0.6, 0.6], [0.22, 0.95]] as const) {
          const g = ctx.createLinearGradient(0, y - 70, 0, y);
          g.addColorStop(0, "rgba(255,240,180,0)");
          g.addColorStop(1, `rgba(255,240,180,${a * t})`);
          ctx.fillStyle = g;
          ctx.fillRect(x - (w * ww) / 2, y - 70, w * ww, 70);
        }
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, 0.45);
        glow(ctx, 0, 0, w * 1.5, "#ffe08a", t, 1);
        shock(ctx, 0, 0, w * (0.8 + 0.6 * u), "#fff4c8", t, 4);
        ctx.restore();
        sparks(ctx, x, y - 20, 8, 26, u, "#fff8d8", seed);
      });
      return true;
    }
    default:
      return false;
  }
}
