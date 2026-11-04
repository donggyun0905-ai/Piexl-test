// 대장간 그림 (sim/forge): 방 꾸밈(위쪽 벽 화덕·불꽃·굴뚝 불빛 · 연장 걸이 · 무기 걸이 · 숯 더미 · 물통 · 바닥 불빛 · 떠오르는 불티)
// · 가운데 모루 + 그 옆 대장장이: 사용자 그림 sprites/blacksmith.png (64×64 6장, 원본 art/대장장이) · 못 불러오면 코드로 그린 대장장이·모루
import { ROOM_WIDTH, type Pickup, type RunState } from "@pixel-rogue/shared";
import { drawSprite } from "../sprites";
import { additive, alpha, glow, rnd, sparks, type Ctx } from "./pwFxBits";

/** 망치질 한 번 (틱) · 내려치는 틱 */
const SWING = 48;
const HIT = 22;

/** 방 꾸밈 (바닥·벽 쪽, 물건 아래에 그림) */
export function drawForgeRoom(ctx: Ctx, s: RunState, cx: number, cy: number): void {
  const t = s.tick;
  const top = cy - 80;
  // 바닥 불빛 (화덕에서 번지는 주황빛, 숨 쉬듯)
  additive(ctx, () => glow(ctx, cx - 70, top + 30, 120, "#ff7a2a", 0.28 + 0.06 * Math.sin(t / 9)));
  hearth(ctx, cx - 70, top + 4, t);
  toolRack(ctx, cx + 64, top + 2);
  weaponRack(ctx, cx + 120, top + 4);
  coal(ctx, cx - 118, top + 34);
  barrel(ctx, cx + 34, cy + 6, t);
  grindstone(ctx, cx - 110, cy + 56, t);
  ingots(ctx, cx + 104, cy + 60);
  // 떠오르는 불티
  additive(ctx, () => {
    for (let i = 0; i < 22; i++) {
      const f = ((t * (0.5 + rnd(i, 1) * 0.6) + i * 37) % 200) / 200;
      const x = cx - 70 + (rnd(i, 2) - 0.5) * 60 + Math.sin(t / 14 + i) * 6;
      const y = top + 16 - f * 70 + f * 160 * rnd(i, 3) * 0;
      glow(ctx, x + f * (rnd(i, 4) - 0.5) * 40, y, 2, i % 3 ? "#ffb347" : "#ffe6a0", (1 - f) * 0.9, 1);
    }
  });
  // 벽 그을음 줄
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, top - 18, ROOM_WIDTH, 6);
}

/** 벽돌 화덕: 아치 속 불꽃 · 숯 · 위 굴뚝 */
function hearth(ctx: Ctx, x: number, y: number, t: number): void {
  // 벽돌 몸
  ctx.fillStyle = "#4a2c22";
  ctx.fillRect(x - 32, y - 18, 64, 40);
  ctx.fillStyle = "#6a3e2c";
  for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) ctx.fillRect(x - 31 + c * 8 + (r % 2) * 4, y - 17 + r * 8, 7, 7);
  // 굴뚝
  ctx.fillStyle = "#3a221a";
  ctx.fillRect(x - 10, y - 34, 20, 18);
  // 아치 입구
  ctx.fillStyle = "#140806";
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 22);
  ctx.lineTo(x - 18, y + 2);
  ctx.arc(x, y + 2, 18, Math.PI, 0);
  ctx.lineTo(x + 18, y + 22);
  ctx.fill();
  // 불꽃 (혀처럼 일렁임)
  additive(ctx, () => {
    glow(ctx, x, y + 12, 26, "#ff6a1e", 0.9, 0.4);
    for (let k = 0; k < 7; k++) {
      const fx = x - 12 + k * 4;
      const h = 10 + Math.sin(t / 5 + k * 1.7) * 4 + rnd(k, 3) * 4;
      const g = ctx.createLinearGradient(fx, y + 20, fx, y + 20 - h);
      g.addColorStop(0, "rgba(255,240,180,0.95)");
      g.addColorStop(0.5, "rgba(255,150,40,0.8)");
      g.addColorStop(1, "rgba(255,60,20,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(fx - 3, y + 20);
      ctx.quadraticCurveTo(fx + Math.sin(t / 4 + k) * 2, y + 20 - h * 0.6, fx, y + 20 - h);
      ctx.quadraticCurveTo(fx + 1, y + 20 - h * 0.5, fx + 3, y + 20);
      ctx.fill();
    }
    glow(ctx, x, y - 30, 14, "#ff8a3a", 0.35 + 0.1 * Math.sin(t / 7), 0);
  });
  ctx.fillStyle = "#2a1410";
  ctx.fillRect(x - 18, y + 20, 36, 3);
}

/** 연장 걸이: 망치·집게·줄 */
function toolRack(ctx: Ctx, x: number, y: number): void {
  ctx.fillStyle = "#5a3a22";
  ctx.fillRect(x - 22, y - 2, 44, 3);
  // 망치
  ctx.fillStyle = "#7a5a3a";
  ctx.fillRect(x - 16, y, 2, 14);
  ctx.fillStyle = "#8a8a96";
  ctx.fillRect(x - 19, y + 12, 8, 4);
  // 집게
  ctx.strokeStyle = "#6a6a76";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 2, y);
  ctx.lineTo(x - 4, y + 16);
  ctx.moveTo(x + 2, y);
  ctx.lineTo(x + 4, y + 16);
  ctx.stroke();
  // 줄
  ctx.fillStyle = "#9a9aa6";
  ctx.fillRect(x + 12, y, 3, 14);
  ctx.fillStyle = "#6a4a2a";
  ctx.fillRect(x + 12, y, 3, 4);
}

/** 무기 걸이: 칼 셋 */
function weaponRack(ctx: Ctx, x: number, y: number): void {
  ctx.fillStyle = "#4a2e1c";
  ctx.fillRect(x - 16, y + 18, 32, 4);
  for (let k = 0; k < 3; k++) {
    const bx = x - 10 + k * 10;
    ctx.fillStyle = "#c8ccd8";
    ctx.fillRect(bx, y - 4, 2, 22);
    ctx.fillStyle = "#e8eaf2";
    ctx.fillRect(bx, y - 4, 1, 22);
    ctx.fillStyle = "#b8862a";
    ctx.fillRect(bx - 2, y - 6, 6, 2);
  }
}

/** 숯 더미 (몇 개가 빨갛게 달아오름) */
function coal(ctx: Ctx, x: number, y: number): void {
  for (let k = 0; k < 9; k++) {
    const px = x + (rnd(k, 5) - 0.5) * 22;
    const py = y + (rnd(5, k) - 0.5) * 8 - (k % 3) * 2;
    ctx.fillStyle = k % 4 === 0 ? "#a8341a" : "#1e1a1a";
    ctx.fillRect(Math.round(px), Math.round(py), 4, 3);
  }
}

/** 숫돌 (바퀴가 돎) */
function grindstone(ctx: Ctx, x: number, y: number, t: number): void {
  ctx.fillStyle = "#4a2e1c";
  ctx.fillRect(x - 12, y + 4, 24, 3);
  ctx.fillRect(x - 10, y - 2, 2, 8);
  ctx.fillRect(x + 8, y - 2, 2, 8);
  ctx.fillStyle = "#7a7a84";
  ctx.beginPath();
  ctx.arc(x, y - 4, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#5a5a64";
  ctx.lineWidth = 1;
  const a = t / 10;
  ctx.beginPath();
  ctx.moveTo(x, y - 4);
  ctx.lineTo(x + Math.cos(a) * 7, y - 4 + Math.sin(a) * 7);
  ctx.stroke();
}

/** 쇳덩이 더미 (반짝) */
function ingots(ctx: Ctx, x: number, y: number): void {
  for (const [dx, dy] of [[-8, 0], [0, 0], [8, 0], [-4, -4], [4, -4], [0, -8]] as const) {
    ctx.fillStyle = "#6a6a78";
    ctx.fillRect(x + dx - 4, y + dy, 8, 4);
    ctx.fillStyle = "#a8a8b8";
    ctx.fillRect(x + dx - 4, y + dy, 8, 1);
  }
}

/** 담금질 물통 (김이 오름) */
function barrel(ctx: Ctx, x: number, y: number, t: number): void {
  ctx.fillStyle = "#5a3a22";
  ctx.fillRect(x - 9, y - 8, 18, 14);
  ctx.fillStyle = "#3a2414";
  ctx.fillRect(x - 9, y - 4, 18, 2);
  ctx.fillRect(x - 9, y + 2, 18, 2);
  ctx.fillStyle = "#2a5a8a";
  ctx.fillRect(x - 8, y - 9, 16, 3);
  for (let k = 0; k < 3; k++) {
    const f = ((t + k * 30) % 90) / 90;
    ctx.fillStyle = `rgba(220,220,230,${0.25 * (1 - f)})`;
    ctx.beginPath();
    ctx.arc(x - 4 + k * 4 + Math.sin(t / 15 + k) * 2, y - 12 - f * 16, 2 + f * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** 가운데 모루 + 대장장이 (pk.x, pk.y = 모루 자리) */
export function drawForgeAnvil(ctx: Ctx, s: RunState, pk: Pickup, near: boolean): void {
  const x = Math.round(pk.x);
  const y = Math.round(pk.y);
  const ph = s.tick % SWING;
  // 그림자
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + 9, 16, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // 사용자 그림 (모루까지 한 장, 64×64 6장: 서기 2 · 들기 · 내려치기 · 불똥 · 다시 들기) · 모루가 그림 오른쪽에 있어 왼쪽으로 옮겨 그림
  const art = ph < HIT - 6 ? 2 : ph < HIT ? 3 : ph < HIT + 8 ? 4 : ph < HIT + 16 ? 5 : Math.floor(s.tick / 30) % 2;
  if (drawSprite(ctx, "blacksmith", x - 11, y - 23, art)) {
    if (ph >= HIT && ph < HIT + 8) additive(ctx, () => glow(ctx, x + 2, y - 8, 14, "#ff9a3a", 0.5 * (1 - (ph - HIT) / 8), 0.6));
    nearRing(ctx, s, x, y, near);
    return;
  }
  // 모루: 받침 · 몸 · 뿔
  ctx.fillStyle = "#3a3a44";
  ctx.fillRect(x - 6, y + 2, 12, 7);
  ctx.fillStyle = "#4e4e5a";
  ctx.fillRect(x - 9, y - 3, 18, 6);
  ctx.beginPath();
  ctx.moveTo(x + 9, y - 3);
  ctx.lineTo(x + 16, y - 2);
  ctx.lineTo(x + 9, y + 1);
  ctx.fill();
  ctx.fillStyle = "#8a8a98";
  ctx.fillRect(x - 9, y - 4, 18, 1);
  // 달군 쇠막대 (내려칠 때 더 밝게)
  const hot = ph >= HIT && ph < HIT + 8 ? 1 : 0.6;
  ctx.fillStyle = `rgba(255,${Math.round(140 + 80 * hot)},60,1)`;
  ctx.fillRect(x - 5, y - 6, 10, 2);
  additive(ctx, () => glow(ctx, x, y - 6, 9, "#ff8a3a", 0.6 * hot, 0.5));
  // 대장장이 (모루 왼쪽, 오른쪽을 봄)
  smith(ctx, x - 20, y, ph);
  // 내려칠 때 불똥
  if (ph >= HIT && ph < HIT + 14) additive(ctx, () => sparks(ctx, x, y - 6, 10, 18, (ph - HIT) / 14, "#ffc060", s.tick - ph));
  nearRing(ctx, s, x, y, near);
}

/** 가까이 서면 발밑 고리 */
function nearRing(ctx: Ctx, s: RunState, x: number, y: number, near: boolean): void {
  if (near) {
    ctx.strokeStyle = alpha("#ffb060", 0.6 + 0.3 * Math.sin(s.tick / 8));
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x - 6, y + 9, 30, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/** 그림이 없을 때 대장장이: 넓은 어깨 · 가죽 앞치마 · 두건 · 망치를 든 팔이 들렸다 내려옴 */
function smith(ctx: Ctx, x: number, y: number, ph: number): void {
  // 팔 각도: 들기(위) → 내려치기
  const up = ph < HIT ? Math.min(1, ph / (HIT - 6)) : Math.max(0, 1 - (ph - HIT) / 4);
  const ang = -0.2 - up * 1.9;
  // 다리
  ctx.fillStyle = "#3a2a20";
  ctx.fillRect(x - 5, y + 1, 4, 8);
  ctx.fillRect(x + 1, y + 1, 4, 8);
  // 몸 · 앞치마
  ctx.fillStyle = "#c08a6a";
  ctx.fillRect(x - 7, y - 14, 14, 15);
  ctx.fillStyle = "#6a4024";
  ctx.fillRect(x - 6, y - 9, 12, 12);
  ctx.fillStyle = "#4e2e18";
  ctx.fillRect(x - 6, y - 9, 12, 1);
  // 머리 · 두건 · 수염
  ctx.fillStyle = "#c08a6a";
  ctx.fillRect(x - 4, y - 22, 8, 8);
  ctx.fillStyle = "#7a2a1a";
  ctx.fillRect(x - 5, y - 23, 10, 3);
  ctx.fillStyle = "#5a3a22";
  ctx.fillRect(x - 3, y - 16, 7, 3);
  ctx.fillStyle = "#1a1210";
  ctx.fillRect(x + 1, y - 19, 1, 1);
  // 망치 든 팔 (어깨에서)
  const sx = x + 5;
  const sy = y - 12;
  const ex = sx + Math.cos(ang) * 10;
  const ey = sy + Math.sin(ang) * 10;
  ctx.strokeStyle = "#c08a6a";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  // 망치: 자루 + 머리
  const hx = ex + Math.cos(ang) * 7;
  const hy = ey + Math.sin(ang) * 7;
  ctx.strokeStyle = "#7a5a3a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(hx, hy);
  ctx.stroke();
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(ang + Math.PI / 2);
  ctx.fillStyle = "#6a6a76";
  ctx.fillRect(-4, -2, 8, 4);
  ctx.fillStyle = "#9a9aa8";
  ctx.fillRect(-4, -2, 8, 1);
  ctx.restore();
  ctx.lineCap = "butt";
}
