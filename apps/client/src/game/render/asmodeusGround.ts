// 아스모데우스의 화신체 바닥·덮개 그리기: 두 빛의 바닥(체스판) · 불꽃 담 · 결정 창 벽 · 놓인 블랙홀 · 빨아들이기 · 욕망의 잔상
// · 톱니 날 고리 · 궁극기(가운데 큰 블랙홀 · 붉은 마법진 · 조여 드는 톱니 고리) / 덮개: 단 하나의 빈자리(방이 어두워지고 빈자리만 빛남) · 매혹 예고
import {
  asmoBoss,
  asmoUltT,
  BOSS_ASMO_KIT_RULES as K,
  BOSS_ASMO_LORD_RULES as L,
  BOSS_ASMO_ULTS_RULES as U,
  BOSS_ASMO_VOID_RULES as V,
  chessOn,
  chessSafe,
  ROOM_MAX_X,
  ROOM_MAX_Y,
  ROOM_MIN_X,
  ROOM_MIN_Y,
  sawing,
  sawSpot,
  trailAt,
  type EnemyState,
  type RunState,
} from "@pixel-rogue/shared";
import { additive, glow, shock } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const cy = () => (ROOM_MIN_Y + ROOM_MAX_Y) / 2;
const cx = () => (ROOM_MIN_X + ROOM_MAX_X) / 2;

/** 바닥 (사람·적 아래) */
export function drawAsmoGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const e = asmoBoss(s);
  if (!e) return;
  chess(ctx, s, e);
  ultFloor(ctx, s, e);
  for (const w of e.amWalls ?? []) {
    const on = s.tick >= w[4];
    const a = on ? 0.9 : 0.25 + 0.2 * Math.sin(s.tick * 0.3);
    ctx.lineCap = "round";
    additive(ctx, () => {
      ctx.strokeStyle = `rgba(170, 60, 255, ${a * 0.5})`;
      ctx.lineWidth = K.WALL_W * 2 + 6;
      line(ctx, snap(w[0]), snap(w[1]), snap(w[2]), snap(w[3]));
    });
    ctx.strokeStyle = on ? "rgba(230, 170, 255, 0.95)" : `rgba(200, 120, 255, ${a})`;
    ctx.lineWidth = on ? K.WALL_W * 2 : 2;
    line(ctx, snap(w[0]), snap(w[1]), snap(w[2]), snap(w[3]));
    if (on) {
      // 담 위로 일렁이는 불꽃
      const len = Math.hypot(w[2] - w[0], w[3] - w[1]);
      ctx.fillStyle = "rgba(255, 210, 255, 0.85)";
      for (let d = (s.tick * 1.5) % 10; d < len; d += 10) {
        const k = d / len;
        const h = 3 + ((d * 7 + s.tick) % 5);
        ctx.fillRect(Math.round(w[0] + (w[2] - w[0]) * k), Math.round(w[1] + (w[3] - w[1]) * k - h), 1, h);
      }
    }
    ctx.lineCap = "butt";
  }
  for (const b of e.amBlocks ?? []) crystal(ctx, snap(b[0]), snap(b[1]), K.BLOCK_R, s.tick);
  for (const h of e.amHoles ?? []) {
    const k = Math.max(0, Math.min(1, 1 - (h[2] - s.tick) / (V.HOLE_WARN + V.HOLE_GAP * 2)));
    additive(ctx, () => glow(ctx, snap(h[0]), snap(h[1]), 14 + 10 * k, "#8a30ff", 0.6));
    ctx.fillStyle = "#05000a";
    ctx.beginPath();
    ctx.arc(snap(h[0]), snap(h[1]), 5 + 5 * k, 0, TAU);
    ctx.fill();
  }
  if (e.amSuckEnd !== undefined) swirl(ctx, s, snap(e.amSuckX ?? e.x), snap(e.amSuckY ?? e.y), 90, 1);
  // 욕망의 잔상: 1.5초 전 내 자리의 보라 그림자
  (e.amTrail ?? []).forEach((_, seat) => {
    const g = trailAt(e, seat);
    if (!g) return;
    additive(ctx, () => glow(ctx, snap(g[0]), snap(g[1]) - 6, 16, "#c040ff", 0.55));
    ctx.fillStyle = "rgba(120, 40, 180, 0.6)";
    ctx.beginPath();
    ctx.ellipse(snap(g[0]), snap(g[1]) - 6, 5, 9, 0, 0, TAU);
    ctx.fill();
  });
  if (sawing(s, e)) for (let k = 0; k < L.SAWS; k++) saw(ctx, s, ...sawSpot(s, e, k).map(snap) as [number, number]);
}

/** 덮개 (사람·적 위): 단 하나의 빈자리 · 매혹 예고 */
export function drawAsmoOver(ctx: Ctx, s: RunState): void {
  const e = asmoBoss(s);
  if (!e) return;
  const now = e.amSafe?.[0];
  if (now) {
    const f = Math.max(0, Math.min(1, 1 - (now[2] - s.tick) / V.SAFE_WARN));
    ctx.save();
    ctx.fillStyle = `rgba(20, 0, 36, ${0.2 + 0.5 * f})`;
    ctx.beginPath();
    ctx.rect(ROOM_MIN_X - 40, ROOM_MIN_Y - 40, ROOM_MAX_X - ROOM_MIN_X + 80, ROOM_MAX_Y - ROOM_MIN_Y + 80);
    ctx.arc(now[0], now[1], V.SAFE_R, 0, TAU);
    ctx.fill("evenodd");
    ctx.restore();
    additive(ctx, () => {
      glow(ctx, now[0], now[1], V.SAFE_R * 1.6, "#fff0ff", 0.25 + 0.35 * f, 0.4);
      shock(ctx, now[0], now[1], V.SAFE_R, "#ffffff", 0.5 + 0.4 * f, 2);
    });
    const next = e.amSafe?.[1];
    if (next) additive(ctx, () => shock(ctx, next[0], next[1], V.SAFE_R, "#b070ff", 0.3, 1));
  }
  if (e.amCharmAt !== undefined) {
    // 매혹 예고: 방 가장자리가 분홍으로 물듦
    const a = 0.12 + 0.1 * Math.sin(s.tick * 0.3);
    ctx.strokeStyle = `rgba(255, 90, 200, ${a * 3})`;
    ctx.lineWidth = 8;
    ctx.strokeRect(ROOM_MIN_X + 4, ROOM_MIN_Y + 4, ROOM_MAX_X - ROOM_MIN_X - 8, ROOM_MAX_Y - ROOM_MIN_Y - 8);
  }
}

/** 두 빛의 바닥: 보라·분홍 칸 (안전한 색 칸은 밝게, 바뀌기 직전 깜빡임) */
function chess(ctx: Ctx, s: RunState, e: EnemyState): void {
  if (!chessOn(s, e)) return;
  const gap = e.amChessGap ?? K.CHESS_GAP;
  const t = (s.tick - (e.amChessAt ?? 0)) % gap;
  const safe = chessSafe(s, e);
  const soon = t > gap - 36 && Math.floor(s.tick / 4) % 2 === 0;
  const c = K.CHESS_CELL;
  for (let y = ROOM_MIN_Y, j = 0; y < ROOM_MAX_Y; y += c, j++)
    for (let x = ROOM_MIN_X, i = 0; x < ROOM_MAX_X; x += c, i++) {
      const col = (i + j) % 2;
      const ok = col === safe && !soon;
      ctx.fillStyle = col === 0 ? `rgba(150, 60, 255, ${ok ? 0.32 : 0.12})` : `rgba(255, 90, 200, ${ok ? 0.32 : 0.12})`;
      ctx.fillRect(x, y, Math.min(c, ROOM_MAX_X - x), Math.min(c, ROOM_MAX_Y - y));
      if (!ok && t < K.CHESS_HIT + 6) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
        ctx.fillRect(x, y, Math.min(c, ROOM_MAX_X - x), Math.min(c, ROOM_MAX_Y - y));
      }
    }
  // 보스 머리 위 불꽃 = 지금 안전한 색
  const col = (soon ? 1 - safe : safe) === 0 ? "#a050ff" : "#ff5ac8";
  additive(ctx, () => glow(ctx, e.x, e.y - 52, 12 + 2 * Math.sin(s.tick * 0.4), col, 0.95, 0.4));
}

/** 궁극기 바닥: 검은 해(가운데 블랙홀) · 군주(붉은 마법진 · 조여 드는 톱니 고리) */
function ultFloor(ctx: Ctx, s: RunState, e: EnemyState): void {
  const t = asmoUltT(s, e);
  if (t < 0) return;
  if (e.amUlt === 1 && t < U.WAVE_AT) {
    const r = U.CORE_R * Math.min(1, t / 60);
    swirl(ctx, s, cx(), cy(), 200, Math.min(1, t / 60));
    additive(ctx, () => glow(ctx, cx(), cy(), r * 3, "#7a20ff", 0.7, 0.1));
    ctx.fillStyle = "#020004";
    ctx.beginPath();
    ctx.arc(cx(), cy(), r, 0, TAU);
    ctx.fill();
    additive(ctx, () => shock(ctx, cx(), cy(), r + 3, "#e0b0ff", 0.9, 3));
    return;
  }
  if (e.amUlt === 2 || e.amUlt === 3) {
    const a = 0.25 + 0.1 * Math.sin(s.tick * 0.1);
    ctx.strokeStyle = `rgba(255, 40, 60, ${a})`;
    ctx.lineWidth = 2;
    for (const r of [60, 110, 160]) {
      ctx.beginPath();
      ctx.arc(cx(), cy(), r, 0, TAU);
      ctx.stroke();
    }
    for (let k = 0; k < 6; k++) {
      const v = (k / 6) * TAU + s.tick * 0.004;
      line(ctx, cx() + Math.cos(v) * 160, cy() + Math.sin(v) * 160, cx() + Math.cos(v + 2.1) * 160, cy() + Math.sin(v + 2.1) * 160);
    }
  }
  if (e.amUlt === 2 && t >= U.SAW_AT) {
    const k = Math.min(1, (t - U.SAW_AT) / U.SAW_WARN);
    const r = 20 + (Math.hypot(ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y) / 2) * (1 - k);
    for (let i = 0; i < 24; i++) {
      const v = (i / 24) * TAU + t * 0.05;
      saw(ctx, s, s.player.x + Math.cos(v) * r, s.player.y + Math.sin(v) * r);
    }
  }
}

/** 빨려 드는 소용돌이 줄 */
function swirl(ctx: Ctx, s: RunState, x: number, y: number, r: number, a: number): void {
  ctx.strokeStyle = `rgba(190, 120, 255, ${0.5 * a})`;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i++) {
    const k = 1 - ((s.tick * 0.012 + i / 8) % 1);
    const v = (i / 8) * TAU + s.tick * 0.03;
    ctx.beginPath();
    ctx.arc(x, y, r * k, v, v + 0.9);
    ctx.stroke();
  }
}

/** 붉은 결정 창 (박힌 벽) */
function crystal(ctx: Ctx, x: number, y: number, r: number, tick: number): void {
  additive(ctx, () => glow(ctx, x, y - 4, r * 1.8, "#ff2a4a", 0.4));
  ctx.fillStyle = "#5a0a1a";
  ctx.beginPath();
  ctx.moveTo(x, y - r * 2);
  ctx.lineTo(x + r * 0.6, y);
  ctx.lineTo(x, y + r * 0.4);
  ctx.lineTo(x - r * 0.6, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = `rgba(255, 120, 140, ${0.7 + 0.3 * Math.sin(tick * 0.2 + x)})`;
  ctx.fillRect(Math.round(x - 1), Math.round(y - r * 1.6), 1, Math.round(r * 1.4));
}

/** 붉은 톱니 날 하나 (돎) */
function saw(ctx: Ctx, s: RunState, x: number, y: number): void {
  additive(ctx, () => glow(ctx, x, y, 14, "#ff2a3a", 0.5));
  ctx.fillStyle = "#c01828";
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const v = (i / 12) * TAU + s.tick * 0.3;
    const r = i % 2 === 0 ? L.SAW_R : L.SAW_R * 0.55;
    ctx.lineTo(x + Math.cos(v) * r, y + Math.sin(v) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffd0d0";
  ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
}

function line(ctx: Ctx, x: number, y: number, tx: number, ty: number): void {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(tx, ty);
  ctx.stroke();
}
