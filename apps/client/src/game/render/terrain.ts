// 던전 지형 그리기 (sim/terrain, 독가스는 stalkers): 진흙(갈색·거품) · 용암(일렁이는 금·빛) · 얕은 물(물결, 감전 예고는 노랗게 깜빡 · 감전 중엔 번개) · 가시 함정(예고 붉게 · 솟으면 가시)
import { glowHintRect } from "../glow/glowHints";
import { drawHiddenGround } from "./hiddenTrial";
import { spikeState, terrainIdle, type RunState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";
import { drawGas } from "./stalkers";

type Ctx = CanvasRenderingContext2D;
type Rect = readonly [number, number, number, number];

/** 칸 안 고정된 점 자리 (꾸밈이 매 프레임 흔들리지 않게) */
const spot = (x: number, y: number, k: number) => ((x * 73856093) ^ (y * 19349663) ^ (k * 83492791)) >>> 0;

function rounded(ctx: Ctx, [x, y, w, h]: Rect, inset = 1): void {
  ctx.beginPath();
  ctx.roundRect(x + inset, y + inset, w - inset * 2, h - inset * 2, 4);
}

function drawMud(ctx: Ctx, r: Rect, tick: number): void {
  ctx.fillStyle = "#4a3420";
  rounded(ctx, r);
  ctx.fill();
  ctx.fillStyle = "#5e4428";
  rounded(ctx, r, 3);
  ctx.fill();
  const [x, y, w, h] = r;
  for (let i = 0; i < 6; i++) {
    const v = spot(x, y, i);
    const bx = x + 4 + (v % Math.max(1, w - 8));
    const by = y + 4 + ((v >> 8) % Math.max(1, h - 8));
    // 거품: 커졌다가 터짐
    const ph = (tick + (v % 90)) % 90;
    if (ph < 50) {
      ctx.fillStyle = "#7a5a34";
      ctx.fillRect(bx, by, ph < 30 ? 1 : 2, ph < 30 ? 1 : 2);
    }
    ctx.fillStyle = "#3a2614";
    ctx.fillRect(bx + 3, by + 2, 2, 1);
  }
}

function drawLava(ctx: Ctx, r: Rect, tick: number): void {
  const [x, y, w, h] = r;
  ctx.save();
  // 빛 층이 켜져 있으면 번짐은 빛 층이 (폰에서 shadowBlur는 느림)
  if (!glowHintRect(ctx, x, y, w, h, "#ff6a1a")) {
    ctx.shadowColor = "#ff6a1a";
    ctx.shadowBlur = 8;
  }
  ctx.fillStyle = "#c8380a";
  rounded(ctx, r);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#ff7a1a";
  rounded(ctx, r, 3);
  ctx.fill();
  // 일렁이는 밝은 줄
  for (let i = 0; i < 4; i++) {
    const v = spot(x, y, i + 10);
    const ly = y + 4 + ((v >> 4) % Math.max(1, h - 8));
    const off = Math.sin((tick + v) * 0.05) * 3;
    ctx.fillStyle = i % 2 ? "#ffd84a" : "#ffb03a";
    ctx.fillRect(x + 4 + off + (v % 5), ly, Math.max(2, w - 12), 1);
  }
}

function drawWater(ctx: Ctx, r: Rect, tick: number, warn: boolean, shock: boolean): void {
  const [x, y, w, h] = r;
  ctx.fillStyle = shock ? "rgba(120, 200, 255, 0.75)" : "rgba(40, 110, 170, 0.6)";
  rounded(ctx, r);
  ctx.fill();
  // 물결
  ctx.fillStyle = "rgba(200, 240, 255, 0.5)";
  for (let i = 0; i < 4; i++) {
    const v = spot(x, y, i + 20);
    const wx = x + 3 + ((v + tick * 0.3) % Math.max(1, w - 10));
    const wy = y + 3 + ((v >> 6) % Math.max(1, h - 6));
    ctx.fillRect(Math.round(wx), wy, 5, 1);
  }
  if (warn && Math.floor(tick / 6) % 2 === 0) {
    ctx.strokeStyle = "#fff27a";
    ctx.lineWidth = 2;
    rounded(ctx, r);
    ctx.stroke();
  }
  if (shock) {
    // 물 위를 달리는 번개
    ctx.strokeStyle = Math.floor(tick / 3) % 2 ? "#ffffff" : "#fff27a";
    ctx.lineWidth = 1;
    for (let i = 0; i < 2; i++) {
      const v = spot(x, y, i + Math.floor(tick / 4));
      ctx.beginPath();
      let px = x + 2;
      let py = y + 3 + (v % Math.max(1, h - 6));
      ctx.moveTo(px, py);
      while (px < x + w - 4) {
        px += 4;
        py = Math.max(y + 2, Math.min(y + h - 2, py + ((v >> (px % 7)) % 5) - 2));
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }
}

function drawSpikes(ctx: Ctx, r: Rect, state: 0 | 1 | 2, tick: number): void {
  const [x, y, w, h] = r;
  ctx.fillStyle = state === 1 && Math.floor(tick / 5) % 2 === 0 ? "#6a2a2a" : "#3a3640";
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  for (let gx = x + 4; gx < x + w - 2; gx += 6) {
    for (let gy = y + 5; gy < y + h - 1; gy += 6) {
      if (state === 2) {
        // 솟은 가시
        ctx.fillStyle = "#c8c8d4";
        ctx.beginPath();
        ctx.moveTo(gx - 2, gy + 1);
        ctx.lineTo(gx, gy - 5);
        ctx.lineTo(gx + 2, gy + 1);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(gx, gy - 4, 1, 2);
      } else {
        ctx.fillStyle = "#1a1820";
        ctx.fillRect(gx - 1, gy - 1, 2, 2);
      }
    }
  }
}

/** 바닥 위 · 적과 플레이어 아래 */
export function drawTerrain(ctx: Ctx, s: RunState, snap: Snap): void {
  drawGas(ctx, s, snap);
  // 숨은 시련 바닥·독안개·숨 게이지 (render/hiddenTrial)
  drawHiddenGround(ctx, s);
  const t = s.terrain;
  if (!t || t.room !== s.roomId) return;
  const tick = s.tick;
  for (const r of t.mud) drawMud(ctx, r, tick);
  for (const r of t.lava) drawLava(ctx, r, tick);
  const shocking = (t.shock ?? 0) > 0;
  const warn = shocking && tick < (t.shockAt ?? 0);
  for (const r of t.water) drawWater(ctx, r, tick, warn, shocking && !warn);
  // 방을 정리하면 가시는 들어간 채
  const idle = terrainIdle(s);
  t.spikes.forEach((r, i) => drawSpikes(ctx, r, idle ? 0 : spikeState(tick, i), tick));
}
