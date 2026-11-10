// 레이드 방 꾸밈 (루시퍼에 맞게, 2026-11-09): 흑요석 바닥 · 보라 금 · 바닥 의식 고리 · 화로 · 찢긴 깃발 · 부러진 기둥 · 떨어지는 잿가루 (2페이즈는 붉게)
// 숨는 돌기둥 (sim/lucCover): 바닥(그림자·받침·부서진 돌 더미·다시 생기는 고리) · 위(기둥 몸 — 뒤에 사람이 있으면 흐리게 · 남은 횟수 칸)
import { allPlayers, COVER_HITS, COVER_RADIUS, lucCovers, RAID_ROOM, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, type RunState } from "@pixel-rogue/shared";
import { additive, glow } from "./pwFxBits";
import { lucProp } from "./lucArt";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const TILE = 32;
/** 돌기둥 몸 높이 (석조 기둥 그림 column.png, 2026-11-10) */
const COL_H = 60;

const inBoss = (s: RunState) => !!s.raidBoss && s.roomId === RAID_ROOM.boss;

/** 바닥 꾸밈 (방 바탕 위 · 적·사람보다 아래) */
export function drawLucArena(ctx: Ctx, s: RunState, snap: Snap): void {
  // 바닥이 꺼진 하늘에서는 꾸밈(화로·깃발·기둥·잿가루·돌기둥)을 그리지 않음
  if (!inBoss(s) || s.raidBoss?.fight?.p2 === "sky") return;
  const t = s.tick;
  const p2 = s.raidBoss?.fight?.phase === 2;
  const W = ROOM_MAX_X - ROOM_MIN_X;
  const H = ROOM_MAX_Y - ROOM_MIN_Y;
  const cx = (ROOM_MIN_X + ROOM_MAX_X) / 2;
  const cy = (ROOM_MIN_Y + ROOM_MAX_Y) / 2 + 10;
  // 흑요석 바닥 (칸마다 조금씩 다른 색) · 줄눈
  ctx.fillStyle = p2 ? "#160609" : "#0e0716";
  ctx.fillRect(ROOM_MIN_X, ROOM_MIN_Y, W, H);
  for (let x = ROOM_MIN_X, i = 0; x < ROOM_MAX_X; x += TILE, i++)
    for (let y = ROOM_MIN_Y, j = 0; y < ROOM_MAX_Y; y += TILE, j++) {
      const v = (i * 7 + j * 13) % 5;
      ctx.fillStyle = p2 ? ["#1e0a0e", "#220b10", "#1a080c", "#260d12", "#1c090d"][v]! : ["#160b22", "#1a0d27", "#130920", "#1d0f2b", "#170c24"][v]!;
      ctx.fillRect(x + 1, y + 1, TILE - 2, TILE - 2);
    }
  // 빛나는 금 (보라 · 2페이즈는 붉은 용암빛)
  const vein = p2 ? "255, 70, 40" : "170, 80, 255";
  ctx.lineWidth = 1.5;
  for (let k = 0; k < 14; k++) {
    let x = ROOM_MIN_X + ((k * 211) % W);
    let y = ROOM_MIN_Y + ((k * 127) % H);
    ctx.strokeStyle = `rgba(${vein}, ${0.25 + 0.15 * Math.sin(t * 0.03 + k)})`;
    ctx.beginPath();
    ctx.moveTo(snap(x), snap(y));
    for (let n = 0; n < 5; n++) {
      x += ((k * 37 + n * 53) % 41) - 20;
      y += ((k * 29 + n * 61) % 31) - 8;
      ctx.lineTo(snap(x), snap(y));
    }
    ctx.stroke();
  }
  // 바닥 의식 고리 둘 (천천히 돎) · 고리 위 글자 칸
  for (const [r, dir] of [[210, 1], [250, -1]] as const) {
    ctx.strokeStyle = `rgba(${vein}, 0.35)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.5, 0, 0, TAU);
    ctx.stroke();
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * TAU + t * 0.002 * dir;
      ctx.fillStyle = `rgba(${vein}, ${k % 3 ? 0.35 : 0.7})`;
      ctx.fillRect(snap(cx + Math.cos(a) * r) - 2, snap(cy + Math.sin(a) * r * 0.5) - 2, 4, 4);
    }
  }
  // 위쪽 벽: 찢긴 깃발 (검은 보라·검붉음)
  for (let k = 0; k < 7; k++) {
    const x = ROOM_MIN_X + ((k + 0.5) / 7) * W;
    const sway = Math.sin(t * 0.04 + k * 1.3) * 3;
    ctx.fillStyle = k % 2 ? "#2a0f3a" : "#3a0f1c";
    ctx.beginPath();
    ctx.moveTo(x - 14, ROOM_MIN_Y);
    ctx.lineTo(x + 14, ROOM_MIN_Y);
    ctx.lineTo(x + 12 + sway, ROOM_MIN_Y + 52);
    ctx.lineTo(x + 4 + sway, ROOM_MIN_Y + 40);
    ctx.lineTo(x - 2 + sway, ROOM_MIN_Y + 56);
    ctx.lineTo(x - 12 + sway, ROOM_MIN_Y + 44);
    ctx.fill();
    ctx.fillStyle = p2 ? "#ff6040" : "#c080ff";
    ctx.fillRect(x - 3 + sway / 2, ROOM_MIN_Y + 16, 6, 6);
  }
  // 옆 벽: 작은 석조 기둥 (그림이 없으면 그루터기)
  for (let k = 0; k < 4; k++) {
    const y = ROOM_MIN_Y + ((k + 0.5) / 4) * H;
    for (const x of [ROOM_MIN_X + 14, ROOM_MAX_X - 14]) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.ellipse(x, y + 8, 14, 5, 0, 0, TAU);
      ctx.fill();
      if (lucProp(ctx, "column.png", x, y + 10, 40, 0.9)) continue;
      ctx.fillStyle = "#3a3448";
      ctx.fillRect(x - 10, y - 14, 20, 22);
      ctx.fillStyle = "#4e4660";
      ctx.fillRect(x - 10, y - 14, 20, 4);
      ctx.fillStyle = "#2a2436";
      ctx.fillRect(x - 3, y - 12, 2, 18);
    }
  }
  // 화로 여섯 (네 모서리 + 아래 양쪽): 돌 받침 + 일렁이는 불꽃
  const fire = p2 ? "#ff5a20" : "#a050ff";
  const spots = [
    [ROOM_MIN_X + 46, ROOM_MIN_Y + 70],
    [ROOM_MAX_X - 46, ROOM_MIN_Y + 70],
    [ROOM_MIN_X + 46, ROOM_MAX_Y - 40],
    [ROOM_MAX_X - 46, ROOM_MAX_Y - 40],
    [cx - W * 0.3, ROOM_MAX_Y - 30],
    [cx + W * 0.3, ROOM_MAX_Y - 30],
  ];
  spots.forEach(([x, y], k) => {
    ctx.fillStyle = "#2c2638";
    ctx.fillRect(x! - 9, y! - 6, 18, 10);
    ctx.fillStyle = "#463e58";
    ctx.fillRect(x! - 11, y! - 9, 22, 4);
    const f = 0.7 + 0.3 * Math.sin(t * 0.25 + k * 1.7);
    additive(ctx, () => {
      glow(ctx, x!, y! - 14, 40 * f, fire, 0.45, 0.2);
      glow(ctx, x!, y! - 16, 10 * f, "#ffffff", 0.5, 0.4);
    });
    ctx.fillStyle = fire;
    for (let n = 0; n < 3; n++) ctx.fillRect(x! - 6 + n * 4, y! - 12 - ((t + n * 7 + k * 5) % 12), 3, 5);
  });
  // 떨어지는 잿가루
  for (let i = 0; i < 46; i++) {
    const x = ROOM_MIN_X + ((i * 151 + Math.floor(Math.sin(t * 0.01 + i) * 20)) % W);
    const y = ROOM_MIN_Y + ((t * (0.25 + (i % 4) * 0.1) + i * 53) % H);
    ctx.fillStyle = i % 5 ? `rgba(${vein}, 0.35)` : "rgba(255, 255, 255, 0.4)";
    ctx.fillRect(snap(x), snap(y), 2, 2);
  }
  drawCoverBase(ctx, s, snap);
}

/** 돌기둥 바닥: 그림자·받침 · 부서졌으면 돌 더미 + 다시 생기기까지 고리 */
function drawCoverBase(ctx: Ctx, s: RunState, snap: Snap): void {
  const R = COVER_RADIUS();
  for (const c of lucCovers(s)) {
    const x = snap(c[0]!);
    const y = snap(c[1]!);
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.beginPath();
    ctx.ellipse(x, y + 4, R + 6, (R + 6) * 0.45, 0, 0, TAU);
    ctx.fill();
    if (c[2]! > 0) continue;
    // 부서진 돌 더미
    ctx.fillStyle = "#4a4458";
    for (let k = 0; k < 6; k++) ctx.fillRect(x - R + ((k * 11) % (R * 2)), y - 4 + ((k * 7) % 8), 7, 5);
    // 다시 생기기까지 (점점 차는 고리)
    const left = Math.max(0, c[3]! - s.tick);
    const k = 1 - Math.min(1, left / 1200);
    ctx.strokeStyle = "rgba(200, 190, 230, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - 6, R, -Math.PI / 2, -Math.PI / 2 + TAU * k);
    ctx.stroke();
  }
}

/** 돌기둥 몸 (사람·적 위): 뒤에 사람이 있으면 흐리게 · 금 간 정도 · 남은 횟수 칸 */
export function drawCoverTop(ctx: Ctx, s: RunState, snap: Snap): void {
  if (!inBoss(s) || s.raidBoss?.fight?.p2 === "sky") return;
  const R = COVER_RADIUS();
  const max = COVER_HITS();
  const players = allPlayers(s);
  for (const c of lucCovers(s)) {
    if (c[2]! <= 0) continue;
    const x = snap(c[0]!);
    const y = snap(c[1]!);
    const behind = players.some((p) => p.hp > 0 && p.y < y && p.y > y - COL_H - 10 && Math.abs(p.x - x) < R + 8);
    ctx.save();
    ctx.globalAlpha = behind ? 0.45 : 1;
    // 몸: 석조 기둥 그림 (없으면 돌 원기둥: 밝은 왼쪽 · 어두운 오른쪽 · 위 머리돌 · 보라 룬)
    if (!lucProp(ctx, "column.png", x, y + 6, COL_H + 6)) drawColumnBody(ctx, s, x, y, R, c[0]!);
    // 금: 맞은 만큼
    ctx.strokeStyle = "#1a1624";
    ctx.lineWidth = 1.5;
    const lost = max - c[2]!;
    for (let k = 0; k < lost; k++) {
      const sx = x - R + 3 + ((k * 9) % (R * 2 - 6));
      ctx.beginPath();
      ctx.moveTo(sx, y - COL_H + 4 + k * 6);
      ctx.lineTo(sx + 5, y - COL_H + 12 + k * 6);
      ctx.lineTo(sx + 1, y - COL_H + 18 + k * 6);
      ctx.stroke();
    }
    ctx.restore();
    // 남은 횟수 칸 (머리 위)
    const w = 5;
    const left = x - (max * (w + 1)) / 2;
    for (let k = 0; k < max; k++) {
      ctx.fillStyle = "#000";
      ctx.fillRect(left + k * (w + 1) - 1, y - COL_H - 15, w + 2, 6);
      ctx.fillStyle = k < c[2]! ? "#c8c0e8" : "#3a3448";
      ctx.fillRect(left + k * (w + 1), y - COL_H - 14, w, 4);
    }
  }
}

/** 그림을 못 불러왔을 때 돌기둥 몸 */
function drawColumnBody(ctx: Ctx, s: RunState, x: number, y: number, R: number, seed: number): void {
  ctx.fillStyle = "#5a5470";
  ctx.fillRect(x - R, y - COL_H, R * 2, COL_H);
  ctx.fillStyle = "#6e6886";
  ctx.fillRect(x - R, y - COL_H, R * 0.7, COL_H);
  ctx.fillStyle = "#423c56";
  ctx.fillRect(x + R * 0.4, y - COL_H, R * 0.6, COL_H);
  ctx.fillStyle = "#7a7494";
  ctx.fillRect(x - R - 3, y - COL_H - 6, R * 2 + 6, 7);
  ctx.fillRect(x - R - 2, y - 4, R * 2 + 4, 5);
  ctx.fillStyle = `rgba(190, 120, 255, ${0.5 + 0.3 * Math.sin(s.tick * 0.06 + seed)})`;
  ctx.fillRect(x - 2, y - COL_H + 12, 4, 10);
  ctx.fillRect(x - 5, y - COL_H + 15, 10, 3);
}
