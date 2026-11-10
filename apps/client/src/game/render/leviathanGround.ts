// 레비아탄 바닥·하늘 (sim/levKit·bossLeviathan·bossLevWhale·bossLevKing): 깊은 바다(빛줄기) · 투명한 수면(물결) · 비눗방울 · 토네이도 · 물감옥 예고
// 사슬 팔 그림자 · 썰물·밀물 · 소용돌이 · 물의 용 길 / 하늘: 물감옥 물방울 · 떨어지는 거대 물구슬 · 숨 게이지
import { airLeft, BOSS_LEV_KING_RULES as K, BOSS_LEV_KIT_RULES as T, BOSS_LEV_WHALE_RULES as W, inTide, levDirector, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, type RunState } from "@pixel-rogue/shared";
import { drawAirGauge, drawBubbles, drawDeepSea } from "./seaWater";
import { additive, glow } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 바닥 (적보다 먼저) */
export function drawLevGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const e = levDirector(s);
  if (!e) return;
  if (e.lhWet) {
    drawDeepSea(ctx, s);
  } else if (e.lhForm === 2) {
    // 투명한 수면: 밝은 물빛 · 흐르는 물결 줄
    ctx.fillStyle = "rgba(30, 110, 190, 0.32)";
    ctx.fillRect(ROOM_MIN_X, ROOM_MIN_Y, ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y);
    ctx.strokeStyle = "rgba(210, 240, 255, 0.22)";
    ctx.lineWidth = 1;
    for (let yy = ROOM_MIN_Y + 6; yy < ROOM_MAX_Y; yy += 14) {
      ctx.beginPath();
      for (let xx = ROOM_MIN_X; xx <= ROOM_MAX_X; xx += 8) ctx.lineTo(xx, yy + 2 * Math.sin((xx + s.tick * 0.6 + yy * 3) * 0.06));
      ctx.stroke();
    }
  }
  drawBubbles(ctx, s, e.lhBubbles ?? []);
  for (const t of e.lhTorn ?? []) tornado(ctx, snap(t.x), snap(t.y), s.tick, Math.min(1, (t.until - s.tick) / 40));
  // 물감옥 예고: 내 둘레로 물방울이 모여듦
  if (e.lhPrisonAt !== undefined) {
    const k = 1 - Math.max(0, (e.lhPrisonAt - s.tick) / T.PRISON_WARN);
    const x = snap(e.lhPrisonX ?? 0);
    const y = snap(e.lhPrisonY ?? 0);
    ctx.strokeStyle = `rgba(150, 220, 255, ${0.4 + 0.5 * k})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, T.PRISON_R, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = "rgba(200, 240, 255, 0.9)";
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + s.tick * 0.05;
      const r = T.PRISON_R * (1.6 - k * 0.6);
      ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r), 2, 2);
    }
  }
  drawWhaleArms(ctx, s);
  drawKingGround(ctx, s, snap);
}

/** 토네이도: 위로 갈수록 넓어지는 소용돌이 고리 */
function tornado(ctx: Ctx, x: number, y: number, tick: number, a: number): void {
  ctx.fillStyle = `rgba(10, 40, 80, ${0.3 * a})`;
  ctx.beginPath();
  ctx.ellipse(x, y + 4, T.TORN_R * 0.7, T.TORN_R * 0.25, 0, 0, TAU);
  ctx.fill();
  for (let i = 0; i < 7; i++) {
    const h = i * 7;
    const w = 6 + i * 3.5;
    const off = Math.sin(tick * 0.15 + i * 0.9) * (2 + i);
    ctx.strokeStyle = `rgba(${170 + i * 10}, 230, 255, ${(0.75 - i * 0.06) * a})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x + off, y - h, w, w * 0.3, 0, (tick * 0.2 + i) % TAU, ((tick * 0.2 + i) % TAU) + Math.PI * 1.4);
    ctx.stroke();
  }
}

/** 사슬 팔: 내 발밑을 따라오는 검은 손 그림자 (물 아래) */
function drawWhaleArms(ctx: Ctx, s: RunState): void {
  const w = s.enemies.find((o) => o.kind === "levwhale" && o.hp > 0);
  if (w?.lhArmAt === undefined) return;
  const k = Math.min(1, (s.tick - w.lhArmAt) / W.ARM_FOLLOW);
  const p = s.player;
  ctx.fillStyle = `rgba(0, 10, 30, ${0.25 + 0.4 * k})`;
  ctx.beginPath();
  ctx.ellipse(p.x, p.y + 4, W.ARM_R * (0.6 + 0.6 * k), W.ARM_R * 0.45, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = `rgba(120, 140, 160, ${0.5 * k})`;
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + s.tick * 0.03;
    ctx.beginPath();
    ctx.moveTo(p.x + Math.cos(a) * 4, p.y + 4 + Math.sin(a) * 2);
    ctx.lineTo(p.x + Math.cos(a) * 14 * k, p.y + 4 + Math.sin(a) * 6 * k);
    ctx.stroke();
  }
}

/** 해왕: 썰물·밀물 쪽 · 소용돌이 · 물의 용 길 */
function drawKingGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const k = s.enemies.find((o) => o.kind === "levking" && o.hp > 0);
  if (!k) return;
  const t = k.lhTide;
  if (t) {
    const cx = (ROOM_MIN_X + ROOM_MAX_X) / 2;
    const cy = (ROOM_MIN_Y + ROOM_MAX_Y) / 2;
    const [l, top, r, b] = t.side === 0 ? [ROOM_MIN_X, ROOM_MIN_Y, cx, ROOM_MAX_Y] : t.side === 1 ? [cx, ROOM_MIN_Y, ROOM_MAX_X, ROOM_MAX_Y] : t.side === 2 ? [ROOM_MIN_X, ROOM_MIN_Y, ROOM_MAX_X, cy] : [ROOM_MIN_X, cy, ROOM_MAX_X, ROOM_MAX_Y];
    const on = s.tick >= t.at;
    const blink = Math.floor((t.at - s.tick) / 6) % 2 === 0;
    ctx.fillStyle = on ? "rgba(30, 110, 210, 0.45)" : `rgba(60, 150, 255, ${blink ? 0.18 : 0.08})`;
    ctx.fillRect(l, top, r - l, b - top);
    if (!on) {
      ctx.strokeStyle = "rgba(160, 220, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(l + 2, top + 2, r - l - 4, b - top - 4);
    } else {
      ctx.strokeStyle = "rgba(220, 245, 255, 0.35)";
      ctx.lineWidth = 1;
      for (let yy = top + 6; yy < b; yy += 10) {
        ctx.beginPath();
        for (let xx = l; xx <= r; xx += 6) ctx.lineTo(xx, yy + 2 * Math.sin((xx + s.tick * 1.2) * 0.08));
        ctx.stroke();
      }
    }
    // 내가 잠긴 쪽이면 발밑에 물보라
    if (on && inTide(t.side, s.player.x, s.player.y)) additive(ctx, () => glow(ctx, s.player.x, s.player.y + 4, 12, "#6ac8ff", 0.5));
  }
  for (const [x, y, from, until] of k.lhVortex ?? []) {
    if (s.tick < from) continue;
    const a = Math.min(1, (until - s.tick) / 20);
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(120, 200, 255, ${(0.7 - i * 0.18) * a})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const st = -s.tick * 0.15 + i * 2;
      ctx.arc(snap(x), snap(y), K.VORTEX_R * (0.35 + i * 0.3), st, st + Math.PI * 1.3);
      ctx.stroke();
    }
  }
  // 물의 용 길: 예고 중인 선을 따라 푸른 빛
  for (const h of s.hazards ?? []) {
    if (h.from !== "levdragon" || h.toX === undefined || h.toY === undefined || s.tick < h.start) continue;
    const toX = h.toX;
    const toY = h.toY;
    additive(ctx, () => {
      ctx.strokeStyle = `rgba(60, 170, 255, ${0.25 + 0.5 * (1 - Math.max(0, h.tick - s.tick) / K.DRAGON_WARN)})`;
      ctx.lineWidth = K.DRAGON_W * 1.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(h.x, h.y);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      ctx.lineCap = "butt";
    });
  }
}

/** 하늘 (효과 위): 물감옥 물방울 · 떨어지는 거대 물구슬 · 숨 게이지 */
export function drawLevOver(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const e = levDirector(s);
  if (!e) return;
  for (const c of s.enemies) {
    if (c.kind !== "levprison" || c.hp <= 0) continue;
    const r = c.r + 4 + Math.sin(s.tick * 0.2);
    const k = c.hp / c.maxHp;
    ctx.fillStyle = "rgba(90, 180, 255, 0.35)";
    ctx.strokeStyle = c.hitFlash > 0 ? "#ffffff" : "rgba(220, 245, 255, 0.95)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(snap(c.x), snap(c.y) - 4, r, 0, TAU);
    ctx.fill();
    ctx.stroke();
    // 깎일수록 금
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 1;
    for (let i = 0; i < Math.floor((1 - k) * 4); i++) {
      const ang = i * 1.6 - 0.8;
      ctx.beginPath();
      ctx.moveTo(c.x + Math.cos(ang) * r, c.y - 4 + Math.sin(ang) * r);
      ctx.lineTo(c.x + Math.cos(ang + 0.3) * r * 0.5, c.y - 4 + Math.sin(ang + 0.3) * r * 0.5);
      ctx.stroke();
    }
  }
  // 거대 물구슬: 예고 원 위로 떨어져 내려옴
  for (const h of s.hazards ?? []) {
    if (h.from !== "levorb") continue;
    const left = Math.max(0, h.tick - s.tick);
    const oy = h.y - left * 3;
    additive(ctx, () => glow(ctx, h.x, oy, 30, "#3aa0ff", 0.6, 0.3));
    ctx.fillStyle = "rgba(120, 200, 255, 0.5)";
    ctx.strokeStyle = "rgba(230, 248, 255, 0.95)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(h.x, oy, 18, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }
  if (e.lhWet) drawAirGauge(ctx, s, airLeft(e, s.seat ?? 0), a, snap);
}
