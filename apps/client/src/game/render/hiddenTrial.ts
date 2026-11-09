// 숨은 시련 그리기: 바닥(하이오크 부락 풀숲·어둠의 검은 땅·깊은 바다·비눗방울) · 구조물(성벽·독가스 살포기·해적선) · 독안개 · 숨 게이지
import { breathRatio, fogOn, hiddenOn, ROOM_HEIGHT, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, ROOM_WIDTH, type EnemyState, type HiddenFort, type HiddenTrialState, type RunState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { drawAirGauge, drawBubbles, drawDeepSea } from "./seaWater";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
/** 자리마다 늘 같은 값 (그림용) */
const hash = (i: number, k: number) => ((i * 7919 + k * 104729) % 1000) / 1000;

/** 바닥 (render/terrain, 적 전): 시련마다 바닥 · 독안개 */
export function drawHiddenGround(ctx: Ctx, s: RunState): void {
  const h = hiddenOn(s);
  if (!h) return;
  drawGround(ctx, s, h);
  drawHiddenFog(ctx, s);
}

function drawGround(ctx: Ctx, s: RunState, h: HiddenTrialState): void {
  if (h.kind === 1) {
    // 우거진 부락: 짙은 풀숲 · 가장자리 나무 말뚝 울타리
    ctx.fillStyle = "rgba(30, 60, 20, 0.35)";
    ctx.fillRect(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    for (let i = 0; i < 40; i++) {
      const x = ROOM_MIN_X + hash(i, 1) * (ROOM_MAX_X - ROOM_MIN_X);
      const y = ROOM_MIN_Y + hash(i, 2) * (ROOM_MAX_Y - ROOM_MIN_Y);
      ctx.fillStyle = i % 3 ? "#2f5a22" : "#3f7a2a";
      ctx.fillRect(Math.round(x), Math.round(y), 1, 3);
      ctx.fillRect(Math.round(x) + 2, Math.round(y) + 1, 1, 2);
      ctx.fillRect(Math.round(x) - 2, Math.round(y) + 1, 1, 2);
    }
    ctx.fillStyle = "#6a4a2a";
    for (let x = ROOM_MIN_X + 4; x < ROOM_MAX_X; x += 10) {
      ctx.fillRect(x, ROOM_MIN_Y + 1, 3, 6);
      ctx.fillRect(x, ROOM_MAX_Y - 7, 3, 6);
    }
  } else if (h.kind === 2) {
    // 어둠의 세계: 검은 땅
    ctx.fillStyle = "rgba(4, 0, 10, 0.86)";
    ctx.fillRect(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
  } else if (h.kind === 5) {
    // 죽음의 바다: 깊은 물 · 내려오는 빛줄기 · 비눗방울
    drawDeepSea(ctx, s);
    drawBubbles(ctx, s, h.bubbles ?? []);
  }
}

/** 벽돌 성벽 한 조각 (금이 갈수록 많이) */
function drawWall(ctx: Ctx, x: number, y: number, f: HiddenFort): void {
  const k = f.pool / f.max;
  ctx.fillStyle = "#3a332b";
  ctx.fillRect(x - 10, y - 9, 20, 19);
  ctx.fillStyle = "#7a6e5e";
  ctx.fillRect(x - 9, y - 8, 18, 17);
  ctx.fillStyle = "#5c5246";
  for (const yy of [y - 3, y + 3]) ctx.fillRect(x - 9, yy, 18, 1);
  ctx.fillRect(x - 3, y - 8, 1, 5);
  ctx.fillRect(x + 4, y - 2, 1, 5);
  ctx.fillRect(x - 5, y + 4, 1, 5);
  // 위쪽 성가퀴
  ctx.fillStyle = "#8c806e";
  ctx.fillRect(x - 9, y - 12, 5, 4);
  ctx.fillRect(x + 1, y - 12, 5, 4);
  ctx.fillStyle = "#1a1612";
  if (k < 0.66) {
    ctx.fillRect(x - 6, y - 6, 1, 6);
    ctx.fillRect(x - 5, y, 2, 1);
  }
  if (k < 0.33) {
    ctx.fillRect(x + 3, y - 1, 1, 7);
    ctx.fillRect(x + 4, y + 5, 3, 1);
  }
}

/** 독가스 살포기 (기계): 경고 줄무늬 받침 · 독 탱크 · 눈금 · 위로 뿜는 노즐 · 깜빡이는 등 */
function drawSprayer(ctx: Ctx, s: RunState, x: number, y: number, f: HiddenFort): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + 9, 12, 3, 0, 0, TAU);
  ctx.fill();
  // 받침 (노랑·검정 줄무늬)
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? "#1c1c1c" : "#e8c020";
    ctx.fillRect(x - 12 + i * 4, y + 4, 4, 5);
  }
  // 탱크
  ctx.fillStyle = "#3b4a3a";
  ctx.fillRect(x - 8, y - 10, 16, 15);
  ctx.fillStyle = "#5e7a4e";
  ctx.fillRect(x - 7, y - 9, 14, 13);
  ctx.fillStyle = "#86c060";
  const fill = Math.round(11 * (f.pool / f.max));
  ctx.fillRect(x - 5, y + 2 - fill, 4, fill);
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(x - 6, y - 9, 6, 1);
  // 눈금 다이얼
  ctx.fillStyle = "#e6e6d8";
  ctx.beginPath();
  ctx.arc(x + 3, y - 3, 3, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#c02020";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 3, y - 3);
  ctx.lineTo(x + 3 + Math.cos(s.tick * 0.2) * 2.5, y - 3 + Math.sin(s.tick * 0.2) * 2.5);
  ctx.stroke();
  // 노즐 · 관
  ctx.fillStyle = "#4a4a4a";
  ctx.fillRect(x - 2, y - 16, 4, 6);
  ctx.fillRect(x - 5, y - 17, 10, 2);
  ctx.fillRect(x + 8, y - 6, 4, 2);
  ctx.fillRect(x - 12, y - 4, 4, 2);
  // 깜빡이는 등
  ctx.fillStyle = Math.floor(s.tick / 15) % 2 ? "#ff3020" : "#601010";
  ctx.fillRect(x - 1, y - 19, 2, 2);
  // 뿜어 나오는 독연기
  for (let i = 0; i < 4; i++) {
    const t = (s.tick * 0.6 + i * 12) % 48;
    ctx.fillStyle = `rgba(140, 220, 90, ${0.5 * (1 - t / 48)})`;
    ctx.beginPath();
    ctx.arc(x + Math.sin((i + s.tick * 0.02) * 2) * t * 0.3, y - 18 - t * 0.5, 2 + t * 0.12, 0, TAU);
    ctx.fill();
  }
}

/** 해적선 (조각 첫 번째 자리에서 한 번에): 나무 배 · 대포 구멍 · 돛대와 돛 · 갑판의 선장과 쇠사슬 간수 */
function drawShip(ctx: Ctx, s: RunState, f: HiddenFort): void {
  const x0 = f.xy[0]![0] - 16;
  const x1 = f.xy[f.xy.length - 1]![0] + 16;
  const y = f.xy[0]![1];
  const cx = (x0 + x1) / 2;
  const bob = Math.round(Math.sin(s.tick * 0.05) * 1);
  // 물결
  ctx.fillStyle = "rgba(220, 240, 255, 0.5)";
  for (let x = x0 - 6; x < x1 + 6; x += 6) ctx.fillRect(x + ((s.tick >> 3) % 3), y + 12, 3, 1);
  // 돛대·돛
  ctx.fillStyle = "#4a3018";
  ctx.fillRect(cx - 1, y - 34 + bob, 2, 32);
  ctx.fillStyle = "#d8d0bc";
  ctx.fillRect(cx - 18, y - 30 + bob, 36, 16);
  ctx.fillStyle = "#a01818";
  ctx.fillRect(cx - 18, y - 24 + bob, 36, 3);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(cx + 1, y - 38 + bob, 8, 4);
  // 배 몸통
  ctx.fillStyle = "#3a2410";
  ctx.beginPath();
  ctx.moveTo(x0 - 6, y - 4 + bob);
  ctx.lineTo(x1 + 6, y - 4 + bob);
  ctx.lineTo(x1 - 4, y + 12 + bob);
  ctx.lineTo(x0 + 4, y + 12 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#6a4422";
  ctx.fillRect(x0 - 3, y - 3 + bob, x1 - x0 + 6, 3);
  ctx.fillRect(x0 + 1, y + 3 + bob, x1 - x0 - 2, 2);
  ctx.fillStyle = "#120a04";
  for (let x = x0 + 6; x < x1 - 4; x += 12) ctx.fillRect(x, y + 6 + bob, 3, 3);
  // 금 (체력이 줄수록)
  const k = f.pool / f.max;
  ctx.fillStyle = "#0a0602";
  if (k < 0.66) ctx.fillRect(x0 + 14, y + bob, 1, 8);
  if (k < 0.33) {
    ctx.fillRect(x1 - 20, y - 2 + bob, 1, 10);
    ctx.fillRect(cx, y + 4 + bob, 6, 1);
  }
  // 갑판 위: 쇠사슬 간수 셋 · 가운데 선장
  for (const dx of [-24, 24, 40]) {
    ctx.fillStyle = "#6a6a74";
    ctx.fillRect(cx + dx - 2, y - 11 + bob, 4, 7);
    ctx.fillStyle = "#b8b8c4";
    ctx.fillRect(cx + dx - 3, y - 7 + bob, 1, 3);
  }
  ctx.fillStyle = "#8a1a1a";
  ctx.fillRect(cx - 3, y - 12 + bob, 6, 8);
  ctx.fillStyle = "#e0b890";
  ctx.fillRect(cx - 2, y - 15 + bob, 4, 3);
  ctx.fillStyle = "#141414";
  ctx.fillRect(cx - 4, y - 17 + bob, 8, 2);
}

/** 적 하나 (actors.drawEnemies 앞에서): 구조물·숨은 적이면 그리고 true */
export function drawHiddenFoe(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): boolean {
  const h = s.hidden;
  if (!h || !h.on) return false;
  if (e.kind === "fort") {
    const f = h.forts?.find((o) => o.ids.includes(e.id));
    if (!f) return true;
    if (f.look === "wall") drawWall(ctx, x, y, f);
    else if (f.look === "sprayer") drawSprayer(ctx, s, x, y, f);
    else if (e.id === f.ids[0]) drawShip(ctx, s, f);
    if (e.hitFlash > 0) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.fillRect(x - e.r, y - e.r, e.r * 2, e.r * 2);
    }
    return true;
  }
  // 안개숲: 독가스 안에서 숨은 탄 쏘는 적은 흐릿한 일렁임만
  if (h.kind === 4 && e.kind === "spitter" && e.immune) {
    ctx.strokeStyle = `rgba(200, 255, 200, ${0.15 + 0.1 * Math.sin(s.tick * 0.2 + e.id)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y, e.r, e.r * 0.7, 0, 0, TAU);
    ctx.stroke();
    return true;
  }
  return false;
}

/** 독안개: 맑은 자리만 남기고 방 전체 · 걷히는 동안 옅어짐 */
function drawHiddenFog(ctx: Ctx, s: RunState): void {
  const h = hiddenOn(s);
  if (!h || h.kind !== 4 || !fogOn(s, h)) return;
  const fade = h.gasOff === undefined ? 1 : Math.max(0, (h.gasOff - s.tick) / 180);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
  for (const [px, py, r] of h.pockets ?? []) {
    ctx.moveTo(px + r, py);
    ctx.arc(px, py, r, 0, TAU, true);
  }
  ctx.clip("evenodd");
  ctx.fillStyle = `rgba(70, 120, 50, ${0.5 * fade})`;
  ctx.fillRect(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
  for (let i = 0; i < 18; i++) {
    const x = (hash(i, 3) * ROOM_WIDTH + s.tick * (0.1 + hash(i, 4) * 0.2)) % (ROOM_WIDTH + 40) - 20;
    const y = hash(i, 5) * ROOM_HEIGHT + Math.sin(s.tick * 0.02 + i) * 6;
    ctx.fillStyle = `rgba(150, 200, 110, ${0.18 * fade})`;
    ctx.beginPath();
    ctx.arc(x, y, 14 + hash(i, 6) * 16, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
  // 맑은 자리 테두리
  ctx.strokeStyle = `rgba(220, 255, 200, ${0.5 * fade})`;
  ctx.setLineDash([2, 3]);
  for (const [px, py, r] of h.pockets ?? []) {
    ctx.beginPath();
    ctx.arc(px, py, r, 0, TAU);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

/** 플레이어 머리 위 죽음의 바다 숨 게이지 (캐릭터를 다 그린 뒤, 체력 줄 바로 위) */
export function drawHiddenAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const h = hiddenOn(s);
  if (!h || h.kind !== 5) return;
  drawAirGauge(ctx, s, breathRatio(h), alpha, snap);
}
