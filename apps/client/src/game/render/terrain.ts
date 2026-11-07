// 던전 지형 그리기 (sim/terrain, 독가스는 stalkers): 진흙(젖은 윤기·동심원·거품·돌) · 용암(식은 바위 테·녹은 돌·떠다니는 껍질·거품) · 얕은 물(깊이·가장자리 거품·물결·반짝임, 감전 예고 노랗게 깜빡 · 감전 중엔 번개) · 가시 함정(쇠 발판·못·예고 붉게 · 솟으면 그늘진 가시)
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

const dark = (a: number) => `rgba(0,0,0,${a})`;

/** 가장자리 테: 바깥 어두운 테 + 안쪽 밝은 테 (움푹 들어간 느낌) */
function rim(ctx: Ctx, r: Rect, outer: string, inner: string): void {
  ctx.strokeStyle = outer;
  ctx.lineWidth = 2;
  rounded(ctx, r, 1);
  ctx.stroke();
  ctx.strokeStyle = inner;
  ctx.lineWidth = 1;
  rounded(ctx, r, 3);
  ctx.stroke();
}

/** 진흙: 질척한 갈색 · 젖은 윤기 · 천천히 퍼지는 동심원 · 커졌다 터지는 거품 · 박힌 돌 */
function drawMud(ctx: Ctx, r: Rect, tick: number): void {
  const [x, y, w, h] = r;
  ctx.fillStyle = "#3e2a18";
  rounded(ctx, r);
  ctx.fill();
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "#6a4c2c");
  g.addColorStop(1, "#4a3420");
  ctx.fillStyle = g;
  rounded(ctx, r, 3);
  ctx.fill();
  ctx.save();
  rounded(ctx, r, 3);
  ctx.clip();
  // 젖은 윤기 (위쪽 가로 빛)
  ctx.fillStyle = "rgba(255,230,190,0.12)";
  ctx.fillRect(x + 6, y + 4, w * 0.4, 1);
  ctx.fillRect(x + w * 0.55, y + 6, w * 0.25, 1);
  for (let i = 0; i < 7; i++) {
    const v = spot(x, y, i);
    const bx = x + 5 + (v % Math.max(1, w - 10));
    const by = y + 5 + ((v >> 8) % Math.max(1, h - 10));
    if (i < 2) {
      // 동심원 (천천히 퍼짐)
      const ph = ((tick + (v % 120)) % 120) / 120;
      ctx.strokeStyle = `rgba(40,24,10,${0.6 * (1 - ph)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(bx, by, 2 + ph * 7, 1 + ph * 3, 0, 0, Math.PI * 2);
      ctx.stroke();
      continue;
    }
    // 거품: 커졌다가 터짐
    const ph = (tick + (v % 90)) % 90;
    if (ph < 50) {
      ctx.fillStyle = "#8a6a40";
      const s = ph < 25 ? 1 : 2;
      ctx.fillRect(bx, by, s, s);
      ctx.fillStyle = "rgba(255,240,210,0.5)";
      ctx.fillRect(bx, by, 1, 1);
    } else if (ph < 56) {
      ctx.fillStyle = "#2a1a0c";
      ctx.fillRect(bx - 1, by, 3, 1);
    }
    // 박힌 돌
    if (i === 6) {
      ctx.fillStyle = "#5a5048";
      ctx.fillRect(bx + 2, by + 2, 3, 2);
      ctx.fillStyle = "#8a8070";
      ctx.fillRect(bx + 2, by + 2, 2, 1);
    }
  }
  ctx.restore();
  rim(ctx, r, "#2a1a0c", "rgba(140,100,60,0.35)");
}

/** 용암: 바깥 식은 바위 테 · 안쪽 붉은 녹은 돌 · 떠다니는 검은 껍질 · 밝게 갈라진 틈 · 부글거리는 거품 */
function drawLava(ctx: Ctx, r: Rect, tick: number): void {
  const [x, y, w, h] = r;
  ctx.save();
  // 빛 층이 켜져 있으면 번짐은 빛 층이 (폰에서 shadowBlur는 느림)
  if (!glowHintRect(ctx, x, y, w, h, "#ff6a1a")) {
    ctx.shadowColor = "#ff6a1a";
    ctx.shadowBlur = 8;
  }
  ctx.fillStyle = "#3a1a10";
  rounded(ctx, r);
  ctx.fill();
  ctx.restore();
  const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 2, x + w / 2, y + h / 2, Math.max(w, h) * 0.6);
  g.addColorStop(0, "#ffd84a");
  g.addColorStop(0.45, "#ff8a1a");
  g.addColorStop(1, "#c8380a");
  ctx.fillStyle = g;
  rounded(ctx, r, 3);
  ctx.fill();
  ctx.save();
  rounded(ctx, r, 3);
  ctx.clip();
  // 떠다니는 검은 껍질 (천천히 흐름) + 가장자리 밝은 틈
  for (let i = 0; i < 4; i++) {
    const v = spot(x, y, i + 10);
    const cw = 5 + (v % 6);
    const ch = 3 + ((v >> 3) % 3);
    const cx = x + 4 + ((v + tick * 0.08 * (i % 2 ? 1 : -1)) % Math.max(1, w - cw - 8) + Math.max(1, w - cw - 8)) % Math.max(1, w - cw - 8);
    const cy = y + 4 + ((v >> 6) % Math.max(1, h - ch - 8));
    ctx.fillStyle = "#4a2010";
    ctx.fillRect(Math.round(cx), cy, cw, ch);
    ctx.fillStyle = "#2a100a";
    ctx.fillRect(Math.round(cx) + 1, cy + 1, cw - 2, ch - 2);
    ctx.fillStyle = "#ffe08a";
    ctx.fillRect(Math.round(cx), cy + ch, cw, 1);
  }
  // 부글 거품
  for (let i = 0; i < 3; i++) {
    const v = spot(x, y, i + 30);
    const ph = (tick + (v % 70)) % 70;
    if (ph > 30) continue;
    ctx.fillStyle = ph < 20 ? "#ffe86a" : "#fff4c0";
    const s = ph < 12 ? 1 : 2;
    ctx.fillRect(x + 5 + (v % Math.max(1, w - 10)), y + 5 + ((v >> 7) % Math.max(1, h - 10)), s, s);
  }
  ctx.restore();
  rim(ctx, r, "#2a120a", "rgba(255,160,60,0.5)");
}

/** 물: 깊을수록 진한 파랑 · 가장자리 흰 거품 · 흐르는 물결 줄 · 반짝임 · 감전 예고(노랗게 깜빡)·감전(번개) */
function drawWater(ctx: Ctx, r: Rect, tick: number, warn: boolean, shock: boolean): void {
  const [x, y, w, h] = r;
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, shock ? "rgba(150,220,255,0.8)" : "rgba(70,150,210,0.7)");
  g.addColorStop(1, shock ? "rgba(90,170,255,0.85)" : "rgba(24,70,140,0.8)");
  ctx.fillStyle = g;
  rounded(ctx, r);
  ctx.fill();
  // 가장자리 거품 (일렁임)
  ctx.strokeStyle = `rgba(220,245,255,${0.45 + 0.15 * Math.sin(tick * 0.08 + x)})`;
  ctx.lineWidth = 1;
  rounded(ctx, r, 2);
  ctx.stroke();
  // 물결 줄 (흐름)
  for (let i = 0; i < 5; i++) {
    const v = spot(x, y, i + 20);
    const span = Math.max(1, w - 12);
    const wx = x + 4 + ((v + tick * 0.25) % span);
    const wy = y + 4 + ((v >> 6) % Math.max(1, h - 8));
    ctx.fillStyle = "rgba(200,240,255,0.45)";
    ctx.fillRect(Math.round(wx), wy, 4, 1);
    ctx.fillStyle = "rgba(10,40,90,0.35)";
    ctx.fillRect(Math.round(wx) + 1, wy + 1, 4, 1);
  }
  // 반짝임
  const sv = spot(x, y, Math.floor(tick / 20));
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillRect(x + 4 + (sv % Math.max(1, w - 8)), y + 4 + ((sv >> 5) % Math.max(1, h - 8)), 1, 1);
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

/** 가시 함정: 쇠 발판(테두리·모서리 못) · 구멍 · 예고(붉게 깜빡) · 솟으면 그늘진 가시 */
function drawSpikes(ctx: Ctx, r: Rect, state: 0 | 1 | 2, tick: number): void {
  const [x, y, w, h] = r;
  ctx.fillStyle = "#2a2830";
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  ctx.fillStyle = state === 1 && Math.floor(tick / 5) % 2 === 0 ? "#7a2a2a" : "#4a4652";
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(x + 2, y + 2, w - 4, 1);
  ctx.fillStyle = dark(0.35);
  ctx.fillRect(x + 2, y + h - 3, w - 4, 1);
  // 모서리 못
  ctx.fillStyle = "#8a8698";
  for (const [px, py] of [[x + 3, y + 3], [x + w - 5, y + 3], [x + 3, y + h - 5], [x + w - 5, y + h - 5]]) ctx.fillRect(px!, py!, 2, 2);
  for (let gx = x + 6; gx < x + w - 4; gx += 6) {
    for (let gy = y + 7; gy < y + h - 3; gy += 6) {
      if (state === 2) {
        // 솟은 가시: 왼쪽 밝은 면 · 오른쪽 그늘 · 바닥 그림자
        ctx.fillStyle = dark(0.4);
        ctx.fillRect(gx - 2, gy + 1, 5, 1);
        ctx.fillStyle = "#9a98a8";
        ctx.beginPath();
        ctx.moveTo(gx - 2, gy + 1);
        ctx.lineTo(gx, gy - 6);
        ctx.lineTo(gx + 2, gy + 1);
        ctx.fill();
        ctx.fillStyle = "#e8e8f4";
        ctx.beginPath();
        ctx.moveTo(gx - 2, gy + 1);
        ctx.lineTo(gx, gy - 6);
        ctx.lineTo(gx, gy + 1);
        ctx.fill();
      } else {
        ctx.fillStyle = "#14121a";
        ctx.fillRect(gx - 1, gy - 1, 3, 3);
        ctx.fillStyle = state === 1 ? "#c84a4a" : "#3a3646";
        ctx.fillRect(gx, gy, 1, 1);
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
