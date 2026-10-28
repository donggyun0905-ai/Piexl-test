// 장로 그리기: 바닥에 깔린 네모난 진(발동 전엔 채워지는 빛, 진마다 꾸밈) · 진 효과(불·빛기둥 · 양쪽 벽 · 떨어지는 검 · 바위 주먹)
import { FORMATIONS, type EffectState, type ElderSeal, type FormationKind, type RunState } from "@pixel-rogue/shared";
import { additive, beam, glow, shock, sparks } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 진마다 빛 색 */
const SEAL_COLOR: Record<FormationKind, string> = {
  vine: "#5ac84a",
  daggers: "#ff8a3a",
  walls: "#9aa3b8",
  pit: "#a87a4a",
  swords: "#c8d0e0",
  thunder: "#ffe04a",
  frost: "#8ad8ff",
  wind: "#a8e8c8",
  fist: "#a8a090",
  heaven: "#fff4c0",
};

/** 오검진 단검 다섯 자리 (꼭짓점) */
function pentagon(r: number): [number, number][] {
  return [0, 1, 2, 3, 4].map((i) => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
}

function drawSeal(ctx: Ctx, g: ElderSeal, snap: Snap, tick: number): void {
  const x = snap(g.x);
  const y = snap(g.y);
  const r = g.r;
  const c = SEAL_COLOR[g.kind];
  const total = FORMATIONS[g.kind].arm;
  const armed = g.arm <= 0;
  // 바닥 그늘 + 테두리 (발동 전엔 가운데부터 채워지는 빛)
  ctx.fillStyle = "rgba(10, 16, 10, 0.35)";
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  if (!armed) {
    const k = 1 - g.arm / Math.max(1, total);
    ctx.globalAlpha = 0.25 + 0.2 * k;
    ctx.fillStyle = c;
    ctx.fillRect(x - r * k, y - r * k, r * 2 * k, r * 2 * k);
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = c;
  ctx.lineWidth = 1;
  ctx.globalAlpha = armed ? 0.9 : 0.5 + 0.3 * Math.sin(tick * 0.4);
  ctx.strokeRect(x - r + 0.5, y - r + 0.5, r * 2 - 1, r * 2 - 1);
  ctx.strokeRect(x - r + 3.5, y - r + 3.5, r * 2 - 7, r * 2 - 7);
  ctx.globalAlpha = 1;
  // 진마다 꾸밈
  ctx.fillStyle = c;
  if (g.kind === "daggers") {
    for (const [dx, dy] of pentagon(r * 0.75)) {
      ctx.fillStyle = "#e8ecf4";
      ctx.fillRect(Math.round(x + dx), Math.round(y + dy) - 3, 1, 5);
      ctx.fillStyle = "#8a6a3a";
      ctx.fillRect(Math.round(x + dx) - 1, Math.round(y + dy) - 4, 3, 1);
    }
  } else if (g.kind === "vine") {
    ctx.fillRect(x - 5, y - 2, 10, 2);
    ctx.fillRect(x - 5, y - 2, 2, 8);
    ctx.fillRect(x + 3, y - 2, 2, 8);
  } else if (g.kind === "pit" && armed) {
    ctx.fillStyle = "#0c0808";
    ctx.fillRect(x - r * 0.7, y - r * 0.7, r * 1.4, r * 1.4);
    ctx.fillStyle = "#4a3020";
    ctx.fillRect(x - r * 0.7, y - r * 0.7, r * 1.4, 2);
  } else if (g.kind === "wind" && armed) {
    ctx.strokeStyle = c;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x, y, (r * (i + 1)) / 3.5, tick * 0.3 + i, tick * 0.3 + i + Math.PI);
      ctx.stroke();
    }
  } else if (g.kind === "heaven") {
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      ctx.fillStyle = "#fff4c0";
      ctx.fillRect(Math.round(x + dx! * r * 0.75) - 1, Math.round(y + dy! * r * 0.75) - 6, 3, 8);
    }
  } else {
    ctx.fillRect(x - 1, y - 1, 3, 3);
  }
}

/** 바닥의 진들 (적 아래) */
export function drawElderGround(ctx: Ctx, s: RunState, snap: Snap): void {
  for (const g of s.player.seals ?? []) drawSeal(ctx, g, snap, s.tick);
}

/** 진 효과 */
export function drawElderFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  if (fx.kind === "elPillar") {
    // 위로 솟는 불·빛기둥
    const h = 50 * Math.min(1, t * 3);
    ctx.globalAlpha = 1 - t * 0.8;
    const grad = ctx.createLinearGradient(0, y - h, 0, y);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.4, fx.tint ?? "#ff9a3a");
    grad.addColorStop(1, fx.tint ? "#ffffff" : "#ff4a1a");
    ctx.fillStyle = grad;
    ctx.fillRect(x - r * 0.6, y - h, r * 1.2, h + r * 0.4);
    ctx.globalAlpha = 1;
    // 기둥 속 흰 빛 + 바닥 빛 고리 + 오르는 불씨
    additive(ctx, () => {
      beam(ctx, x, y - h, x, y, r * 0.35, fx.tint ?? "#ffd07a", 1 - t);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, 0.45);
      shock(ctx, 0, 0, r * (0.8 + t), fx.tint ?? "#ff9a3a", 1 - t, 5);
      ctx.restore();
      sparks(ctx, x, y - h * 0.5, 6, h * 0.6, t, fx.tint ?? "#ffd060", fx.x + fx.y);
    });
    return true;
  }
  if (fx.kind === "elWalls") {
    // 양쪽에서 다가와 부딪히는 벽
    const gap = r * Math.max(0, 1 - t * 2.5);
    // 부딪히는 순간 먼지 충격
    if (gap <= 0) additive(ctx, () => {
      glow(ctx, x + 3, y, r, "#d8d0c0", (1 - t) * 0.8, 1);
      sparks(ctx, x + 3, y, 8, r * 1.2, t, "#e8e0d0", fx.x);
    });
    ctx.fillStyle = "#7a7a8a";
    ctx.fillRect(x - gap - 6, y - r, 6, r * 2);
    ctx.fillRect(x + gap, y - r, 6, r * 2);
    ctx.fillStyle = "#a8a8b8";
    ctx.fillRect(x - gap - 6, y - r, 2, r * 2);
    ctx.fillRect(x + gap + 4, y - r, 2, r * 2);
    return true;
  }
  if (fx.kind === "elSword") {
    // 하늘에서 떨어져 꽂히는 강철 검
    const fall = Math.min(1, t * 3);
    const sy = y - 40 * (1 - fall);
    // 떨어지는 빛 꼬리 → 꽂힐 때 번쩍
    additive(ctx, () => {
      if (fall < 1) beam(ctx, x, sy - 40, x, sy, 3, "#c8d8ff", 0.6);
      else {
        glow(ctx, x, y, 14, "#e8ecf4", 1 - t, 1.4);
        shock(ctx, x, y, 6 + (t - 0.33) * 30, "#ffffff", 1 - t, 3);
      }
    });
    ctx.fillStyle = "#e8ecf4";
    ctx.fillRect(x - 1, sy - 14, 2, 14);
    ctx.fillStyle = "#ffd040";
    ctx.fillRect(x - 3, sy - 15, 6, 2);
    ctx.fillStyle = "#6a4a2a";
    ctx.fillRect(x - 1, sy - 19, 2, 4);
    return true;
  }
  if (fx.kind === "elFist") {
    // 바닥에서 솟는 바위 주먹
    const up = Math.sin(Math.min(1, t * 1.6) * Math.PI) * r;
    // 땅이 갈라지는 빛 + 튀는 돌
    additive(ctx, () => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, 0.4);
      shock(ctx, 0, 0, r * (0.6 + t), "#ffb070", 1 - t, 5);
      ctx.restore();
    });
    ctx.fillStyle = "#8a8478";
    ctx.fillRect(x - r * 0.5, y - up, r, up);
    ctx.fillStyle = "#a8a090";
    ctx.fillRect(x - r * 0.5, y - up - 6, r, 7);
    ctx.fillStyle = "#c8c0b0";
    for (let i = 0; i < 3; i++) ctx.fillRect(Math.round(x - r * 0.4 + i * r * 0.3), Math.round(y - up - 6), 2, 2);
    return true;
  }
  return false;
}
