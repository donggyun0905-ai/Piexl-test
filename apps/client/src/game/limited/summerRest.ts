// 여름 파도 대기 장면: 모래 위 줄무늬 비치 타월 · 빨강·흰 파라솔 그늘 · 타월에 기대어 누워 낮잠 자는 내 캐릭터
// · 둘레를 둥실 도는 여름 물건(비치볼·수박·아이스크림·게·불가사리·선글라스) · 반짝이는 물결 · 갈매기는 summerDraw (화면 전용)
import type { RunState } from "@pixel-rogue/shared";
import { drawBody } from "../render/actors";
import { sheetFor } from "../sprites";
import { drawMap } from "./tigerArt";
import { FLOAT_COLORS, FLOATS, PARASOL, PARASOL_COLORS } from "./summerArt";

type Ctx = CanvasRenderingContext2D;

function drawFloats(ctx: Ctx, px: number, py: number, k: number, tick: number, front: boolean): void {
  const n = FLOATS.length;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + tick * 0.004;
    if (Math.sin(a) > 0 !== front) continue;
    const x = Math.round(px + Math.cos(a) * 58);
    const y = Math.round(py - 4 + Math.sin(a) * 28 + Math.sin(tick * 0.06 + i * 1.3) * 3);
    // 물 위에 뜬 듯 아래에 잔물결
    ctx.globalAlpha = k * (front ? 0.5 : 0.3);
    ctx.strokeStyle = "#bff4ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y + 6, 7 + Math.sin(tick * 0.1 + i) , 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = k * (front ? 1 : 0.6);
    drawMap(ctx, FLOATS[i]!, FLOAT_COLORS, x, y, 1);
  }
}

/** 대기 장면 (k: 기운 0~1, 다 차면 캐릭터가 누워 잠). 늘 그림이 있으니 true */
export function drawSummerRest(ctx: Ctx, s: RunState, px: number, py: number, k: number, tick: number): boolean {
  // 모래빛 바닥 + 둘레 물결 고리
  const glow = ctx.createRadialGradient(px, py + 6, 4, px, py + 6, 50);
  glow.addColorStop(0, `rgba(240, 214, 160, ${0.5 * k})`);
  glow.addColorStop(0.7, `rgba(120, 220, 255, ${0.25 * k})`);
  glow.addColorStop(1, "rgba(120, 220, 255, 0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = glow;
  ctx.fillRect(px - 54, py - 40, 108, 90);
  for (let i = 0; i < 3; i++) {
    const r = ((tick * 0.3 + i * 18) % 54) + 10;
    ctx.globalAlpha = k * 0.5 * (1 - r / 64);
    ctx.strokeStyle = "#e8fcff";
    ctx.beginPath();
    ctx.ellipse(px, py + 6, r, r * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  drawFloats(ctx, px, py, k, tick, false);
  // 파라솔 (그림자 → 천)
  ctx.globalAlpha = 0.3 * k;
  ctx.fillStyle = "#0a1830";
  ctx.beginPath();
  ctx.ellipse(px + 4, py + 10, 26, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = k;
  drawMap(ctx, PARASOL, PARASOL_COLORS, px + 6, py - 18 - (1 - k) * 6, 2);
  // 줄무늬 비치 타월
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? "#ffffff" : "#3ab8f0";
    ctx.fillRect(px - 14 + i * 5, py + 2, 5, 14);
  }
  ctx.fillStyle = "#ffd040";
  ctx.fillRect(px - 14, py + 2, 30, 1);
  ctx.fillRect(px - 14, py + 15, 30, 1);
  if (k >= 1) {
    // 타월에 기대어 누워 낮잠 (천천히 숨 쉼) + Zz
    const p = s.player;
    ctx.save();
    ctx.translate(px, py + 8);
    ctx.rotate(-1.15 + Math.sin(tick * 0.04) * 0.02);
    drawBody(ctx, p.characterId, 0, 0, p.r, { faceX: 0, faceY: 1, moving: false, casting: false, step: 0 }, 0, sheetFor(p.characterId, p.lv));
    ctx.restore();
    const z = (tick >> 5) % 3;
    ctx.fillStyle = "#c8f0ff";
    for (let i = 0; i <= z; i++) ctx.fillRect(px - 8 + i * 4, py - 6 - i * 4, 3, 1);
  }
  drawFloats(ctx, px, py, k, tick, true);
  return true;
}
