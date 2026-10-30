// 야수 덮치기 호랑이: 게이지 막대(발밑) · 변신하면 캐릭터 대신 거대한 호랑이
// 그림은 새 4방향 시트 public/sprites/beasttiger.png (scripts/art/import_v2.py) → 없으면 옆모습 beast_tiger.png (tiger_sprite.py) → 코드 그림
import { TIGER, type RunState } from "@pixel-rogue/shared";
import { drawCharacter, hasV2, isCasting } from "../sprites";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const FUR = "#f08a2a";
const STRIPE = "#2a1a10";
const WHITE = "#fff4e0";

/** 지금 호랑이로 변해 있는지 (그리기에서 캐릭터 몸을 숨김) */
export const isTiger = (s: RunState) => (s.player.tigerTicks ?? 0) > 0;

/** 덮치기 무기를 들었으면 발밑에 게이지 · 호랑이면 큰 호랑이와 남은 시간 */
export function drawBeastTiger(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (s.over || p.weaponId !== "pouncers") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  if (isTiger(s)) drawTiger(ctx, s, x, y);
  const k = isTiger(s) ? (p.tigerTicks ?? 0) / TIGER.ticks : (p.tigerGauge ?? 0) / TIGER.full;
  const bx = x - 7;
  const by = y + p.r + (isTiger(s) ? 9 : 6);
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(bx - 1, by - 1, 16, 3);
  // 게이지는 주황으로 차오르고, 다 차기 직전엔 깜빡임 · 변신 중엔 남은 시간이 빨갛게 줄어듦
  const near = !isTiger(s) && k >= 0.8 && (s.tick >> 3) % 2 === 0;
  ctx.fillStyle = isTiger(s) ? "#ff5a3a" : near ? "#fff3b0" : "#ff9a3c";
  ctx.fillRect(bx, by, Math.max(0, Math.round(14 * k)), 1);
}

/** 호랑이 시트: 한 칸 크기 · 발 높이(칸 위에서) */
const SHEET = { w: 56, h: 34, foot: 31 };
let sheet: HTMLImageElement | null = null;
function tigerSheet(): HTMLImageElement | null {
  if (!sheet) {
    sheet = new Image();
    sheet.src = `${import.meta.env.BASE_URL}sprites/beast_tiger.png`;
  }
  return sheet.complete && sheet.naturalWidth > 0 ? sheet : null;
}

/** 거대한 호랑이: 걸으면 네 장면, 덮치는(대시) 동안은 몸을 쭉 뻗은 장면 · 발밑에 불꽃 기운 */
function drawTiger(ctx: Ctx, s: RunState, x: number, y: number): void {
  const img = tigerSheet();
  const v2 = hasV2("beasttiger");
  if (!img && !v2) return drawTigerCode(ctx, s, x, y);
  const p = s.player;
  const moving = p.x !== p.prevX || p.y !== p.prevY;
  const frame = p.dashTicks > 0 ? 4 : moving ? (s.tick >> 3) % 4 : 0;
  const face = p.faceX < 0 ? -1 : 1;
  // 발밑 불꽃 기운 (숨 쉬듯) + 위로 오르는 불씨
  ctx.globalAlpha = 0.22 + 0.1 * Math.sin(s.tick * 0.15);
  ctx.fillStyle = "#ff7a2a";
  ctx.beginPath();
  ctx.ellipse(x, y + 3, 26, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 8; i++) {
    const t = ((s.tick + i * 9) % 36) / 36;
    ctx.globalAlpha = 0.8 * (1 - t);
    ctx.fillStyle = i % 2 ? "#ffd040" : "#ff5a2a";
    ctx.fillRect(Math.round(x - 22 + ((i * 37) % 44)), Math.round(y + 2 - t * 22), 2, 2);
  }
  ctx.globalAlpha = 1;
  // 새 백호: 앞·뒤·왼·오 · 걷기 · 공격 · 대시 자세
  if (v2) {
    const pose = { faceX: p.faceX, faceY: p.faceY, moving, casting: isCasting(s.tick, p.attackCount), step: s.tick >> 3, dash: p.dashTicks > 0 };
    drawCharacter(ctx, "beasttiger", x, y, p.r, pose);
    return;
  }
  if (!img) return;
  ctx.save();
  ctx.translate(x, y + 4);
  ctx.scale(face, 1);
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(-22, -1, 44, 2);
  ctx.drawImage(img, frame * SHEET.w, 0, SHEET.w, SHEET.h, -SHEET.w / 2, -SHEET.foot, SHEET.w, SHEET.h);
  ctx.restore();
}

/** 코드로 그린 호랑이 (그림을 불러오기 전) */
function drawTigerCode(ctx: Ctx, s: RunState, x: number, y: number): void {
  const p = s.player;
  const moving = p.x !== p.prevX || p.y !== p.prevY;
  const step = moving && (s.tick >> 3) % 2 === 0 ? 1 : 0;
  const face = p.faceX < 0 ? -1 : 1;
  // 발밑 주황 기운이 숨 쉬듯
  ctx.globalAlpha = 0.18 + 0.08 * Math.sin(s.tick * 0.15);
  ctx.fillStyle = "#ff9a3c";
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.save();
  ctx.translate(x, y + 3);
  ctx.scale(face * TIGER.scale, TIGER.scale);
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(-7, 0, 15, 1);
  // 꼬리 (끝이 위로 휨, 줄무늬)
  ctx.fillStyle = FUR;
  ctx.fillRect(-9, -6, 2, 1);
  ctx.fillRect(-10, -8 - step, 1, 3);
  ctx.fillStyle = STRIPE;
  ctx.fillRect(-10, -9 - step, 1, 1);
  // 몸 · 다리 (걸으면 앞뒤가 엇갈림)
  ctx.fillStyle = FUR;
  ctx.fillRect(-7, -7, 11, 5);
  ctx.fillRect(-7 + step, -2, 2, 2);
  ctx.fillRect(-4 - step, -2, 2, 2);
  ctx.fillRect(0 + step, -2, 2, 2);
  ctx.fillRect(3 - step, -2, 2, 2);
  ctx.fillStyle = WHITE;
  ctx.fillRect(-5, -3, 8, 1);
  // 머리 · 귀 · 흰 뺨과 주둥이
  ctx.fillStyle = FUR;
  ctx.fillRect(3, -10, 6, 6);
  ctx.fillRect(3, -11, 2, 1);
  ctx.fillRect(7, -11, 2, 1);
  ctx.fillStyle = WHITE;
  ctx.fillRect(6, -6, 4, 2);
  ctx.fillRect(4, -5, 2, 1);
  // 줄무늬 · 눈 · 코
  ctx.fillStyle = STRIPE;
  for (const sx of [-6, -3, 0]) ctx.fillRect(sx, -7, 1, 3);
  ctx.fillRect(5, -10, 1, 2);
  ctx.fillRect(9, -6, 1, 1);
  ctx.fillStyle = "#e8ff70";
  ctx.fillRect(7, -9, 1, 1);
  ctx.restore();
}
