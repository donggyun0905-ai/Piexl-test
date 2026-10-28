// 에테르 광부 그리기: 바닥(구덩이·에테르 결정·다이너마이트·떨어질 바위 그림자) · 땅굴 흙더미 · 원석 막대
// 탄: 결정 파편 · 광차 · 도는 곡괭이 / 효과: 곡괭이질 · 땅 갈라짐·분출 · 바위 · 폭발 · 결정 깨짐 · 구덩이에 빠짐 · 보석 · 에테르 기둥 · 카나리아
import { caveNeed, minerOre, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { glowEdge } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const ETHER = "#5ad8e8";
const ETHER_L = "#c8fbff";
const DIRT = "#6a4a2a";
const DIRT_D = "#3a2618";
const IRON = "#9aa3b8";
const WOOD = "#8a5a2a";

function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, c: string, w: number): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  glowEdge(ctx, c, w);
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.stroke();
}
function disc(ctx: Ctx, x: number, y: number, r: number, c: string): void {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, TAU);
  ctx.fill();
}
/** 마름모 결정 */
function crystal(ctx: Ctx, x: number, y: number, r: number, c: string, glow: string): void {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.moveTo(x, y - r * 1.4);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r * 0.8);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = glow;
  ctx.fillRect(Math.round(x - 1), Math.round(y - r * 0.8), 1, Math.max(1, Math.round(r)));
}

/** 바닥: 구덩이 · 에테르 결정 · 다이너마이트 · 떨어질 바위 그림자 */
export function drawMinerGround(ctx: Ctx, s: RunState, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "miner") return;
  for (const pit of p.mnPits ?? []) {
    const x = snap(pit.x);
    const y = snap(pit.y);
    ctx.globalAlpha = Math.min(1, pit.t / 30);
    ctx.fillStyle = DIRT;
    ctx.beginPath();
    ctx.ellipse(x, y, 15, 9, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#0a0608";
    ctx.beginPath();
    ctx.ellipse(x, y + 1, 12, 7, 0, 0, TAU);
    ctx.fill();
  }
  for (const n of p.mnNodes ?? []) {
    const x = snap(n.x);
    const y = snap(n.y);
    ctx.globalAlpha = n.t < 60 && s.tick % 8 < 4 ? 0.4 : 1;
    ctx.globalAlpha *= 0.3;
    disc(ctx, x, y, 8 + Math.sin(s.tick * 0.1 + n.x) * 1.5, ETHER);
    ctx.globalAlpha = n.t < 60 && s.tick % 8 < 4 ? 0.4 : 1;
    crystal(ctx, x - 3, y + 1, 3, "#3aa8c8", ETHER_L);
    crystal(ctx, x + 1, y - 1, 4.5, ETHER, ETHER_L);
  }
  for (const b of p.mnBombs ?? []) {
    const x = snap(b.x);
    const y = snap(b.y);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#d83a3a";
    ctx.fillRect(x - 3, y - 5, 6, 8);
    ctx.fillStyle = "#f2e6cc";
    ctx.fillRect(x - 3, y - 2, 6, 1);
    line(ctx, x, y - 5, x + 2, y - 8, "#4a3a2a", 1);
    if (s.tick % 4 < 2) disc(ctx, x + 2, y - 9, 1.5, "#ffd040");
  }
  for (const r of p.mnRocks ?? []) {
    const k = 1 - Math.min(1, r.t / 40);
    ctx.globalAlpha = 0.25 + k * 0.35;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.ellipse(snap(r.x), snap(r.y), 6 + k * 14, 3 + k * 7, 0, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** 위: 떨어지는 바위 · 땅굴 흙더미 · 발밑 원석 막대 (광산 붕괴까지) */
export function drawMinerAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "miner") return;
  for (const r of p.mnRocks ?? []) {
    const h = r.t * 4;
    const x = snap(r.x);
    const y = snap(r.y - h);
    disc(ctx, x, y, 7, "#6a6a7a");
    disc(ctx, x - 2, y - 2, 3, "#9a9aaa");
  }
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  if (p.mnBurrow) {
    ctx.fillStyle = DIRT;
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 11, 7, 0, Math.PI, TAU);
    ctx.fill();
    for (let i = 0; i < 4; i++) disc(ctx, x - 9 + i * 6, y + 4 - ((s.tick + i * 3) % 6), 1.5, DIRT_D);
  }
  const k = Math.min(1, minerOre(p) / caveNeed(s));
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x - 9, y + 8, 18, 3);
  ctx.fillStyle = k > 0.9 && s.tick % 10 < 5 ? "#ffffff" : ETHER;
  ctx.fillRect(x - 8, y + 9, Math.round(16 * k), 1);
}

/** 결정 파편 · 광차 · 도는 곡괭이 */
export function drawMinerShot(ctx: Ctx, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.spirit === "mnShard") {
    crystal(ctx, x, y, 2.5, ETHER, ETHER_L);
    return true;
  }
  if (pr.spirit === "mnCart") {
    ctx.fillStyle = DIRT;
    ctx.fillRect(x - 9, y - 7, 18, 9);
    ctx.fillStyle = "#b07a40";
    ctx.fillRect(x - 9, y - 7, 18, 2);
    crystal(ctx, x - 3, y - 8, 3, ETHER, ETHER_L);
    crystal(ctx, x + 3, y - 9, 3.5, "#ffd040", "#ffffff");
    const spin = tick % 4 < 2 ? IRON : "#e8ecf4";
    disc(ctx, x - 5, y + 3, 3, spin);
    disc(ctx, x + 5, y + 3, 3, spin);
    return true;
  }
  if (pr.spirit === "mnPickaxe") {
    const a = tick * 0.6;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    line(ctx, x - dx * 7, y - dy * 7, x + dx * 7, y + dy * 7, WOOD, 2);
    line(ctx, x + dx * 7 - dy * 5, y + dy * 7 + dx * 5, x + dx * 7 + dy * 5, y + dy * 7 - dx * 5, IRON, 2);
    return true;
  }
  return false;
}

/** 효과 */
export function drawMinerFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("mn")) return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  ctx.globalAlpha = 1 - t;
  switch (fx.kind) {
    case "mnSwing": {
      // 곡괭이가 위에서 앞으로 내리찍는 호 + 찍힌 자리 돌 부스러기
      const a = Math.atan2(fx.dirY, fx.dirX);
      const sweep = fx.width ? 0.6 : 1.4;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y - 2, r * 0.9, a - sweep + t * sweep, a + 0.3);
      ctx.stroke();
      const hx = x + fx.dirX * r * 0.8;
      const hy = y + fx.dirY * r * 0.8;
      for (let i = 0; i < 4; i++) disc(ctx, hx + Math.cos(i * 1.7) * t * 8, hy + Math.sin(i * 1.7) * t * 8 - t * 4, 1, i % 2 ? ETHER : "#8a8a9a");
      break;
    }
    case "mnCrack":
    case "mnErupt": {
      const tx = snap(fx.toX ?? fx.x);
      const ty = snap(fx.toY ?? fx.y);
      const erupt = fx.kind === "mnErupt";
      ctx.globalAlpha = erupt ? 1 - t : 0.6 + t * 0.4;
      // 지그재그 금
      ctx.strokeStyle = erupt ? ETHER_L : "#1a0e08";
      ctx.lineWidth = erupt ? r * (1 - t) + 1 : 2;
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) {
        const k = i / 8;
        const off = i % 2 ? 3 : -3;
        const px = x + (tx - x) * k - ((ty - y) / (Math.hypot(tx - x, ty - y) || 1)) * off;
        const py = y + (ty - y) * k + ((tx - x) / (Math.hypot(tx - x, ty - y) || 1)) * off;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      if (!erupt && t > 0.6) line(ctx, x, y, tx, ty, ETHER, 1);
      if (erupt) for (let i = 0; i < 6; i++) disc(ctx, x + ((tx - x) * i) / 5, y + ((ty - y) * i) / 5 - t * 14, 2 * (1 - t), i % 2 ? ETHER : DIRT);
      break;
    }
    case "mnRock":
    case "mnBoom":
    case "mnBurst": {
      const c = fx.kind === "mnBoom" ? "#ff7a3a" : fx.kind === "mnBurst" ? DIRT : "#8a8a9a";
      disc(ctx, x, y, r * (0.4 + t * 0.6), c);
      ctx.globalAlpha = (1 - t) * 0.8;
      disc(ctx, x, y, r * (0.2 + t * 0.4), fx.kind === "mnBoom" ? "#ffd040" : fx.kind === "mnBurst" ? DIRT_D : "#c8c8d0");
      for (let i = 0; i < 8; i++) disc(ctx, x + Math.cos(i * 0.8) * r * t, y + Math.sin(i * 0.8) * r * t, 1.5, fx.kind === "mnBoom" ? "#ffffff" : DIRT_D);
      break;
    }
    case "mnCave": {
      // 화면 위에서 먼지가 쏟아짐
      for (let i = 0; i < 30; i++) disc(ctx, x - 200 + ((i * 67) % 400), y - 140 + ((i * 41 + t * 300) % 280), 1.2, "#b8a890");
      break;
    }
    case "mnShatter":
      for (let i = 0; i < 6; i++) crystal(ctx, x + Math.cos(i * 1.05) * r * t, y + Math.sin(i * 1.05) * r * t, 2, ETHER, ETHER_L);
      disc(ctx, x, y, r * 0.5 * (1 - t), ETHER_L);
      break;
    case "mnFall":
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, y, r * (1 - t) + 1, (r * (1 - t)) / 2 + 1, 0, 0, TAU);
      ctx.stroke();
      break;
    case "mnDig":
      for (let i = 0; i < 6; i++) disc(ctx, x + Math.cos(i) * r * t, y - Math.sin(t * Math.PI) * 8 + Math.sin(i) * 3, 1.5, DIRT);
      break;
    case "mnPull":
      ctx.strokeStyle = "#d83a3a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r * (1 - t), 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = "#3a6ad8";
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.5, r * (1 - t) - 3), 0, TAU);
      ctx.stroke();
      break;
    case "mnGem":
      crystal(ctx, x, y, r * 0.8, fx.tint ?? "#ff7ad8", "#ffffff");
      break;
    case "mnPillar":
      ctx.fillStyle = ETHER;
      ctx.fillRect(x - r * 0.4 * (1 - t), y - 60, r * 0.8 * (1 - t) + 1, 60);
      ctx.fillStyle = ETHER_L;
      ctx.fillRect(x - 1, y - 60, 2, 60);
      break;
    case "mnCanary":
      ctx.strokeStyle = "#ffe040";
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(x, y, ((t + i / 3) % 1) * r, 0, TAU);
        ctx.stroke();
      }
      break;
  }
  ctx.globalAlpha = 1;
  return true;
}
