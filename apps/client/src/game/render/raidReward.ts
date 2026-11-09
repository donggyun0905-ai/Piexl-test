// 레이드 보상 방 그리기 (sim/raidReward): 금빛 방에 붉은 융단 · 상자 둘레 마법진과 빛기둥 여섯 · 떠다니는 별빛 · 큰 보물 상자(맞으면 흔들림)
// 열리면: 뚜껑이 열리고 하늘로 솟는 빛 · 금화와 색종이가 쏟아짐
import { RAID_ROOM, ROOM_CX, ROOM_CY, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, type EnemyState, type RunState } from "@pixel-rogue/shared";
import { lucFx } from "./lucArt";
import { additive, beam, glow } from "./pwFxBits";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const CONFETTI = ["#ffd040", "#ff60a0", "#60d0ff", "#a070ff", "#60e080", "#ffffff"];

/** 바닥 꾸밈 (적보다 아래) */
export function drawRaidReward(ctx: Ctx, s: RunState, snap: Snap): void {
  if (!s.raidBoss || s.roomId !== RAID_ROOM.reward) return;
  const t = s.tick;
  const cx = ROOM_CX;
  const cy = ROOM_CY - 6;
  // 바닥: 어두운 보라 대리석 + 금빛 줄눈 (금빛 방 바탕을 덮음)
  ctx.fillStyle = "#1c0a2a";
  ctx.fillRect(ROOM_MIN_X, ROOM_MIN_Y, ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y);
  for (let x = ROOM_MIN_X; x < ROOM_MAX_X; x += 32)
    for (let y = ROOM_MIN_Y; y < ROOM_MAX_Y; y += 32) {
      ctx.fillStyle = ((x + y) / 32) % 2 ? "#26103a" : "#1f0c30";
      ctx.fillRect(x + 1, y + 1, 30, 30);
    }
  ctx.fillStyle = "rgba(232, 184, 64, 0.18)";
  for (let x = ROOM_MIN_X; x < ROOM_MAX_X; x += 32) ctx.fillRect(x, ROOM_MIN_Y, 1, ROOM_MAX_Y - ROOM_MIN_Y);
  for (let y = ROOM_MIN_Y; y < ROOM_MAX_Y; y += 32) ctx.fillRect(ROOM_MIN_X, y, ROOM_MAX_X - ROOM_MIN_X, 1);
  // 붉은 융단 (아래 문에서 상자까지) · 금테
  ctx.fillStyle = "#6a1028";
  ctx.fillRect(cx - 34, cy, 68, ROOM_MAX_Y - cy);
  ctx.fillStyle = "#e8b840";
  ctx.fillRect(cx - 34, cy, 4, ROOM_MAX_Y - cy);
  ctx.fillRect(cx + 30, cy, 4, ROOM_MAX_Y - cy);
  for (let y = cy + 12; y < ROOM_MAX_Y; y += 18) {
    ctx.fillStyle = "rgba(255, 210, 90, 0.5)";
    ctx.fillRect(cx - 4, y, 8, 8);
  }
  // 벽 둘레 금테 (두 줄)
  ctx.strokeStyle = "rgba(232, 184, 64, 0.55)";
  ctx.lineWidth = 3;
  ctx.strokeRect(ROOM_MIN_X + 6, ROOM_MIN_Y + 6, ROOM_MAX_X - ROOM_MIN_X - 12, ROOM_MAX_Y - ROOM_MIN_Y - 12);
  ctx.lineWidth = 1;
  ctx.strokeRect(ROOM_MIN_X + 12, ROOM_MIN_Y + 12, ROOM_MAX_X - ROOM_MIN_X - 24, ROOM_MAX_Y - ROOM_MIN_Y - 24);
  // 상자 받침: 세 단 대리석 계단 (금테)
  for (let k = 2; k >= 0; k--) {
    const w = 120 + k * 36;
    const h = 46 + k * 14;
    ctx.fillStyle = k % 2 ? "#2e1446" : "#3a1a58";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 14, w / 2, h / 2, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 210, 90, 0.7)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // 상자 둘레 마법진
  lucFx(ctx, 0, 0, 3, cx, cy + 10, 220, 0.35 + 0.1 * Math.sin(t * 0.05));
  // 빛기둥 여섯
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * TAU + t * 0.004;
    const x = cx + Math.cos(a) * 150;
    const y = cy + 10 + Math.sin(a) * 70;
    additive(ctx, () => {
      glow(ctx, x, y, 18, "#ffb030", 0.45, 0.15);
      beam(ctx, x, y, x, y - 90, 5, "#ffc860", 0.25 + 0.1 * Math.sin(t * 0.1 + k));
    });
  }
  // 위쪽 벽 깃발 (보라·금)
  for (let k = 0; k < 5; k++) {
    const x = ROOM_MIN_X + ((k + 0.5) / 5) * (ROOM_MAX_X - ROOM_MIN_X);
    const sway = Math.sin(t * 0.05 + k) * 2;
    ctx.fillStyle = k % 2 ? "#4a1a7a" : "#7a1a3a";
    ctx.beginPath();
    ctx.moveTo(x - 12, ROOM_MIN_Y);
    ctx.lineTo(x + 12, ROOM_MIN_Y);
    ctx.lineTo(x + 12 + sway, ROOM_MIN_Y + 38);
    ctx.lineTo(x + sway, ROOM_MIN_Y + 30);
    ctx.lineTo(x - 12 + sway, ROOM_MIN_Y + 38);
    ctx.fill();
    ctx.fillStyle = "#ffd040";
    ctx.fillRect(x - 3 + sway / 2, ROOM_MIN_Y + 12, 6, 6);
  }
  // 떠다니는 별빛 (은은하게)
  for (let i = 0; i < 18; i++) {
    const x = ROOM_MIN_X + ((i * 97) % (ROOM_MAX_X - ROOM_MIN_X));
    const y = ROOM_MAX_Y - ((t * (0.3 + (i % 4) * 0.15) + i * 41) % (ROOM_MAX_Y - ROOM_MIN_Y));
    additive(ctx, () => glow(ctx, x, y, 2 + (i % 3), i % 3 ? "#ffc040" : "#a070ff", 0.5, 0.2));
  }
  const opened = s.raidBoss.fight?.opened;
  if (opened !== undefined) drawOpen(ctx, cx, cy, t - opened, t);
  void snap;
}

/** 닫힌 상자 (적 대신 그림, 맞으면 흔들림) */
export function drawChest(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): void {
  const shake = e.hitFlash > 0 ? Math.sin(s.tick * 2.3) * 2 : 0;
  additive(ctx, () => glow(ctx, x, y - 10, 60, "#ffb030", 0.2 + 0.08 * Math.sin(s.tick * 0.08), 0.1));
  box(ctx, x + shake, y, false, s.tick, 1 - e.hp / e.maxHp);
}

/** 상자 몸 (w 110) · open이면 뚜껑을 젖힘 · crack 0~1 금 */
function box(ctx: Ctx, x: number, y: number, open: boolean, t: number, crack: number): void {
  const w = 110;
  const h = 64;
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(x, y + h / 2 + 4, w * 0.55, 10, 0, 0, TAU);
  ctx.fill();
  // 몸통
  ctx.fillStyle = "#3a1650";
  ctx.fillRect(x - w / 2, y - h / 2 + 18, w, h - 18);
  ctx.fillStyle = "#e8b840";
  ctx.fillRect(x - w / 2, y - h / 2 + 18, w, 5);
  ctx.fillRect(x - w / 2, y + h / 2 - 5, w, 5);
  for (const k of [-0.35, 0.35]) ctx.fillRect(x + k * w - 3, y - h / 2 + 18, 6, h - 18);
  // 자물쇠·보석
  ctx.fillStyle = "#ffd860";
  ctx.fillRect(x - 9, y - 4, 18, 20);
  ctx.fillStyle = `hsl(${280 + Math.sin(t * 0.1) * 20}, 90%, 65%)`;
  ctx.fillRect(x - 4, y + 1, 8, 8);
  if (!open) {
    // 뚜껑 (둥근 위)
    ctx.fillStyle = "#4a1e66";
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y - h / 2 + 18);
    ctx.quadraticCurveTo(x, y - h / 2 - 22, x + w / 2, y - h / 2 + 18);
    ctx.fill();
    ctx.strokeStyle = "#e8b840";
    ctx.lineWidth = 4;
    ctx.stroke();
    // 틈에서 새는 빛 · 맞을수록 금이 감
    additive(ctx, () => beam(ctx, x - w / 2 + 6, y - h / 2 + 18, x + w / 2 - 6, y - h / 2 + 18, 2, "#fff0a0", 0.4 + crack * 0.6));
    ctx.strokeStyle = `rgba(255, 240, 160, ${crack})`;
    ctx.lineWidth = 1.5;
    for (let k = 0; k < Math.floor(crack * 6); k++) {
      ctx.beginPath();
      ctx.moveTo(x - w / 2 + 12 + k * 16, y - h / 2 + 22);
      ctx.lineTo(x - w / 2 + 18 + k * 16, y - h / 2 + 36);
      ctx.lineTo(x - w / 2 + 14 + k * 16, y - h / 2 + 46);
      ctx.stroke();
    }
  } else {
    // 젖힌 뚜껑
    ctx.fillStyle = "#4a1e66";
    ctx.fillRect(x - w / 2, y - h / 2 - 22, w, 22);
    ctx.fillStyle = "#e8b840";
    ctx.fillRect(x - w / 2, y - h / 2 - 22, w, 4);
    // 안쪽 금화
    ctx.fillStyle = "#ffd040";
    ctx.beginPath();
    ctx.ellipse(x, y - h / 2 + 20, w * 0.42, 10, 0, 0, TAU);
    ctx.fill();
  }
}

/** 열린 상자: 하늘로 솟는 빛 · 금화와 색종이 */
function drawOpen(ctx: Ctx, cx: number, cy: number, dt: number, t: number): void {
  additive(ctx, () => {
    beam(ctx, cx, cy - 20, cx, ROOM_MIN_Y - 40, 30 + Math.sin(t * 0.1) * 5, "#ffd070", Math.min(1, dt / 20) * 0.45);
    glow(ctx, cx, cy - 20, 80, "#ffc040", 0.35, 0.25);
  });
  box(ctx, cx, cy, true, t, 0);
  for (let i = 0; i < 90; i++) {
    const life = (dt * (0.8 + (i % 5) * 0.12) + i * 7) % 160;
    const ang = (i * 2.399) % TAU;
    const sp = 1.2 + (i % 7) * 0.35;
    const x = cx + Math.cos(ang) * sp * life;
    const y = cy - 30 - Math.sin(Math.abs(ang)) * sp * life * 0.9 + 0.02 * life * life;
    if (y > ROOM_MAX_Y || x < ROOM_MIN_X || x > ROOM_MAX_X) continue;
    ctx.fillStyle = i % 3 === 0 ? "#ffd040" : CONFETTI[i % CONFETTI.length]!;
    if (i % 3 === 0) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, TAU);
      ctx.fill();
    } else ctx.fillRect(x, y, 4, 2 + (i % 2) * 3);
  }
}
