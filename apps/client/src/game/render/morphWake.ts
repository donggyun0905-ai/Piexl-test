// 변희 화면 효과: 사냥 경험치로 얻은 능력이 머리 위에 떠오름 · 각성하면 화면 테두리 안쪽에 그 동물다운 효과 (1.5초, 깜박이다 꺼짐)
import { TICK_RATE, type RunState } from "@pixel-rogue/shared";
import { iconCanvas } from "../iconArt";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 얻은 능력이 떠 있는 틱 · 각성 테두리 틱 */
const GOT_TICKS = TICK_RATE * 2;
const WAKE_TICKS = Math.round(TICK_RATE * 1.5);

/** 머리 위: 얻은 능력 아이콘(빛나는 테두리) + 이름, 천천히 떠오르며 사라짐 */
export function drawMorphGot(ctx: Ctx, s: RunState, alpha: number, snap: Snap, name?: (id: string) => string): void {
  const p = s.player;
  const got = p.mGot;
  if (!got || p.characterId !== "byeonhui") return;
  const age = s.tick - got.tick;
  if (age < 0 || age >= GOT_TICKS) return;
  const k = age / GOT_TICKS;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha) - p.r - 16 - k * 8);
  ctx.globalAlpha = k < 0.75 ? 1 : (1 - k) * 4;
  // 금빛 바탕 + 아이콘
  ctx.fillStyle = "rgba(255, 210, 60, 0.35)";
  ctx.beginPath();
  ctx.arc(x, y, 9 + Math.sin(age / 4) * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.drawImage(iconCanvas({ kind: "passive", id: got.id as never }), x - 7, y - 7, 14, 14);
  if (name) {
    ctx.font = "bold 6px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#000";
    ctx.fillText(name(got.id), x + 0.5, y - 9.5);
    ctx.fillStyle = "#ffe07a";
    ctx.fillText(name(got.id), x, y - 10);
  }
  ctx.globalAlpha = 1;
}

/** 동물마다 테두리 색 (바탕·밝은 색) */
const LOOK: Record<string, readonly [string, string]> = {
  wolf: ["#5a8cff", "#e8f4ff"],
  bear: ["#8a5a2a", "#ffcf8a"],
  eagle: ["#ffe060", "#ffffff"],
  snake: ["#3ac85a", "#c8ff8a"],
  boar: ["#ff7a2a", "#ffe0a0"],
  scorpion: ["#a040ff", "#ffd860"],
  bat: ["#6a2a9a", "#ff5a8a"],
  elephant: ["#9aa0b0", "#ffffff"],
  spider: ["#c8c8d8", "#7a5aa0"],
  phoenix: ["#ff4a1a", "#ffd040"],
};

/** 화면 테두리 안쪽: 각성한 동물다운 효과. 처음엔 번쩍, 깜박이다 꺼짐 (화면 좌표) */
export function drawMorphWake(ctx: Ctx, s: RunState): void {
  const w = s.player.mWake;
  if (!w || s.player.characterId !== "byeonhui") return;
  const age = s.tick - w.tick;
  if (age < 0 || age >= WAKE_TICKS) return;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const u = Math.max(2, Math.round(Math.min(W, H) / 120));
  const [base, hi] = LOOK[w.animal] ?? LOOK.wolf!;
  const k = age / WAKE_TICKS;
  // 깜박임: 뒤로 갈수록 자주 꺼짐
  const on = k < 0.35 || Math.floor(age / (k < 0.7 ? 5 : 3)) % 2 === 0;
  if (!on) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1 - k * 0.6;
  // 테두리 빛 (안쪽으로 번짐)
  const glow = u * 10;
  for (const [x, y, gw, gh, dx, dy] of [
    [0, 0, W, glow, 0, 1],
    [0, H - glow, W, glow, 0, -1],
    [0, 0, glow, H, 1, 0],
    [W - glow, 0, glow, H, -1, 0],
  ] as const) {
    const g = ctx.createLinearGradient(dx < 0 ? x + gw : x, dy < 0 ? y + gh : y, dx > 0 ? x + gw : x, dy > 0 ? y + gh : y);
    g.addColorStop(0, base);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, gw, gh);
  }
  ctx.strokeStyle = hi;
  ctx.fillStyle = hi;
  ctx.lineWidth = u;
  // 둘레를 따라 동물마다 다른 무늬 (같은 틱이면 늘 같은 모양)
  const n = 14;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const seed = (i * 97 + w.tick * 13 + Math.floor(age / 6) * 31) % 101;
    for (const side of [0, 1, 2, 3]) {
      const [px, py, nx, ny] = side === 0 ? [t * W, 0, 0, 1] : side === 1 ? [t * W, H, 0, -1] : side === 2 ? [0, t * H, 1, 0] : [W, t * H, -1, 0];
      edgeMark(ctx, w.animal, px, py, nx, ny, u, seed + side * 7, age);
    }
  }
  ctx.restore();
}

/** 테두리 한 점에서 안쪽(nx, ny)으로 그리는 무늬 */
function edgeMark(ctx: Ctx, animal: string, x: number, y: number, nx: number, ny: number, u: number, seed: number, age: number): void {
  const len = u * (6 + (seed % 7));
  const tx = -ny;
  const ty = nx;
  ctx.beginPath();
  if (animal === "eagle" || animal === "wolf") {
    // 번개 (독수리) · 할퀸 자국 (늑대): 꺾이며 안쪽으로
    ctx.moveTo(x, y);
    let cx = x;
    let cy = y;
    for (let k = 1; k <= 4; k++) {
      const side = ((seed + k) % 2 ? 1 : -1) * u * (animal === "wolf" ? 0.5 : 2);
      cx = x + nx * (len * k) / 2 + tx * side;
      cy = y + ny * (len * k) / 2 + ty * side;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  } else if (animal === "phoenix" || animal === "boar") {
    // 불꽃 (불사조) · 흙먼지 (멧돼지): 흔들리는 혀
    const sway = Math.sin(age / 3 + seed) * u * 2;
    ctx.moveTo(x + tx * u * 2, y + ty * u * 2);
    ctx.quadraticCurveTo(x + nx * len + tx * sway, y + ny * len + ty * sway, x + nx * len * 1.6, y + ny * len * 1.6);
    ctx.quadraticCurveTo(x + nx * len - tx * sway, y + ny * len - ty * sway, x - tx * u * 2, y - ty * u * 2);
    ctx.fill();
  } else if (animal === "spider") {
    // 거미줄: 테두리에서 비스듬히 뻗는 실과 가로줄
    ctx.moveTo(x, y);
    ctx.lineTo(x + nx * len * 2 + tx * len, y + ny * len * 2 + ty * len);
    ctx.moveTo(x + nx * len + tx * u * 2, y + ny * len + ty * u * 2);
    ctx.lineTo(x + nx * len + tx * len, y + ny * len + ty * len);
    ctx.lineWidth = Math.max(1, u / 2);
    ctx.stroke();
    ctx.lineWidth = u;
  } else if (animal === "snake" || animal === "scorpion") {
    // 독 방울이 흘러내림
    const drip = ((age * 2 + seed) % 30) / 30;
    ctx.arc(x + nx * len * drip * 2, y + ny * len * drip * 2, u * (1.5 - drip * 0.6), 0, Math.PI * 2);
    ctx.fill();
  } else if (animal === "bat") {
    // 박쥐 날개 (작은 ∧∧)
    const cx = x + nx * len;
    const cy = y + ny * len;
    ctx.moveTo(cx - tx * u * 3, cy - ty * u * 3);
    ctx.lineTo(cx - tx * u * 1.5 + nx * u * 1.5, cy - ty * u * 1.5 + ny * u * 1.5);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + tx * u * 1.5 + nx * u * 1.5, cy + ty * u * 1.5 + ny * u * 1.5);
    ctx.lineTo(cx + tx * u * 3, cy + ty * u * 3);
    ctx.stroke();
  } else {
    // 곰·코끼리: 땅이 갈라지는 굵은 금
    ctx.moveTo(x, y);
    ctx.lineTo(x + nx * len + tx * u * ((seed % 3) - 1) * 2, y + ny * len + ty * u * ((seed % 3) - 1) * 2);
    ctx.lineTo(x + nx * len * 1.5, y + ny * len * 1.5);
    ctx.lineWidth = u * 1.5;
    ctx.stroke();
    ctx.lineWidth = u;
  }
}
