// 경매장 '암흑가' 그림 (sim/auction): 붉은 융단 무대 · 상품 받침 다섯(4번째부터 ??? 천) · 의자 두 줄에 그림자 손님(부를 때 번호표를 듦)
// · 진행자(무대 오른쪽, 값이 적힌 팻말 · 낙찰 때 망치) · 하나·둘·셋 표시 · 맨 앞줄 가운데 내 의자(F로 앉음). 사용자 그림은 render/auctionArt, 효과(돈 날림·띠링)는 render/vaultFx
import { AUCTION, auctionHere, goingStage, HOST_DX, hostY, LOT_GAP, lotHidden, lotY, SHADOW_SEATS, type Pickup, type RunState } from "@pixel-rogue/shared";
import { iconCanvas, type IconItem } from "../iconArt";
import { additive, alpha, glow } from "./pwFxBits";
import { chairArt, hostArt, lotArt, stageArt, throneArt } from "./auctionArt";
import { propReady } from "./propArt";

type Ctx = CanvasRenderingContext2D;
const GOLD = "#e8c25a";

/** 그림자 손님 자리 (두 줄) */
export function seatPos(i: number, cx: number, cy: number): { x: number; y: number } {
  const row = i % 2;
  const col = Math.floor(i / 2);
  const cols = Math.ceil(SHADOW_SEATS / 2);
  return { x: cx + (col - (cols - 1) / 2) * 30 + (row ? 15 : 0), y: cy + 36 + row * 30 };
}

export function drawAuctionHall(ctx: Ctx, s: RunState, cx: number, cy: number): void {
  const a = auctionHere(s);
  const t = s.tick;
  // 무대: 붉은 융단 · 금테 · 뒤쪽 휘장
  const top = lotY() - 26;
  if (!stageArt(ctx, cx)) {
    ctx.fillStyle = "#3a0c14";
    ctx.fillRect(cx - 90, top, 180, 44);
    ctx.fillStyle = "#5a1420";
    for (let i = 0; i < 12; i++) ctx.fillRect(cx - 90 + i * 15, top, 7, 44);
    ctx.fillStyle = GOLD;
    ctx.fillRect(cx - 92, top + 44, 184, 2);
  }
  // 상품 받침
  for (let i = 0; i < AUCTION.lots; i++) {
    const x = cx + (i - (AUCTION.lots - 1) / 2) * LOT_GAP;
    const y = lotY();
    const lot = a?.lots[i];
    const now = a?.lot === i;
    if (now) additive(ctx, () => glow(ctx, x, y - 4, 16, GOLD, 0.5 + 0.2 * Math.sin(t / 8), 0.5));
    const hidden = !!lot && lotHidden(a!, i);
    const art = lotArt(ctx, x, y, hidden ? 1 : lot?.kind === "aug" ? 2 : 0, lot?.won ? 0.4 : 1);
    if (!art) {
      ctx.fillStyle = "#1a1018";
      ctx.fillRect(x - 8, y + 6, 16, 6);
      ctx.fillStyle = GOLD;
      ctx.fillRect(x - 8, y + 6, 16, 1);
    }
    if (!lot) continue;
    ctx.globalAlpha = lot.won ? 0.35 : 1;
    if (art && lot.kind === "passive" && !hidden) ctx.drawImage(iconCanvas({ kind: "passive", id: lot.id } as IconItem), x - 8, y - 14 + Math.round(Math.sin(t / 14 + i)));
    else if (art) {
      // 받침 그림에 천·보석이 있음 (??? 글자만 얹음)
      if (hidden) {
        ctx.fillStyle = "#e8d8ff";
        ctx.font = "bold 7px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("???", x, y + 4);
      }
    } else if (hidden) {
      // ??? : 보랏빛 천을 덮은 상품
      ctx.fillStyle = "#3a1a5a";
      ctx.fillRect(x - 8, y - 10, 16, 16);
      ctx.fillStyle = "#c8a8ff";
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("???", x, y + 1);
    } else if (lot.kind === "passive") ctx.drawImage(iconCanvas({ kind: "passive", id: lot.id } as IconItem), x - 8, y - 10);
    else {
      // 증강 기술: 빛나는 보석
      additive(ctx, () => glow(ctx, x, y - 2, 9, "#7adcff", 0.8, 0.6));
      ctx.fillStyle = "#7adcff";
      ctx.beginPath();
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x + 6, y - 2);
      ctx.lineTo(x, y + 5);
      ctx.lineTo(x - 6, y - 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (lot.won) {
      ctx.fillStyle = lot.won === 1 ? "#7aff9a" : "#ff6a7a";
      ctx.font = "bold 7px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(lot.won === 1 ? "SOLD" : "×", x, y + 20);
    }
    ctx.textAlign = "start";
  }
  // 의자 · 그림자 손님 (지금 앞선 손님은 번호표를 높이 듦)
  const recent = a && a.lead === 2 && t - a.t < 50;
  for (let i = 0; i < SHADOW_SEATS; i++) {
    const p = seatPos(i, cx, cy);
    const chairs = propReady("guestChair");
    if (!chairs) {
      ctx.fillStyle = "#3a2410";
      ctx.fillRect(p.x - 7, p.y - 2, 14, 10);
      ctx.fillStyle = "#5a3a1a";
      ctx.fillRect(p.x - 7, p.y - 6, 14, 4);
    }
    const sway = Math.sin(t / 25 + i) * 0.8;
    ctx.fillStyle = alpha("#08060c", 0.92);
    ctx.fillRect(Math.round(p.x - 5 + sway), p.y - 14, 10, 12);
    ctx.beginPath();
    ctx.arc(p.x + sway, p.y - 17, 4.5, 0, Math.PI * 2);
    ctx.fill();
    // 빛나는 눈
    ctx.fillStyle = alpha("#ffd0a0", 0.7);
    ctx.fillRect(Math.round(p.x - 2 + sway), p.y - 18, 1, 1);
    ctx.fillRect(Math.round(p.x + 1 + sway), p.y - 18, 1, 1);
    // 의자 그림은 뒷모습이라 손님 위에 (머리만 보임)
    if (chairs) chairArt(ctx, p.x, p.y);
    if (recent && a!.who === i) {
      ctx.fillStyle = "#08060c";
      ctx.fillRect(p.x + 5, p.y - 26, 2, 12);
      ctx.fillStyle = "#f4f0e8";
      ctx.fillRect(p.x + 2, p.y - 34, 9, 8);
      ctx.fillStyle = "#101010";
      ctx.font = "bold 6px sans-serif";
      ctx.fillText(String(i + 1), p.x + 4, p.y - 28);
    }
  }
  drawAuctioneer(ctx, s, cx + HOST_DX);
}

/** 내 의자: 붉은 벨벳 안락의자 · 금테 (가까이 가면 금빛, 앉으면 등받이만 보임) */
export function drawMySeat(ctx: Ctx, s: RunState, pk: Pickup, near: boolean): void {
  const x = Math.round(pk.x);
  const y = Math.round(pk.y);
  const sat = pk.itemId === "1";
  if (near && !sat) additive(ctx, () => glow(ctx, x, y, 16, GOLD, 0.45 + 0.15 * Math.sin(s.tick / 10), 0.5));
  if (throneArt(ctx, x, y, sat)) return;
  // 등받이 · 팔걸이 · 방석
  ctx.fillStyle = "#5a0e1a";
  ctx.fillRect(x - 9, y - 14, 18, 12);
  ctx.fillStyle = "#8a1a2a";
  ctx.fillRect(x - 7, y - 12, 14, 9);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x - 10, y - 15, 20, 1);
  if (sat) return;
  ctx.fillStyle = "#5a0e1a";
  ctx.fillRect(x - 11, y - 4, 4, 10);
  ctx.fillRect(x + 7, y - 4, 4, 10);
  ctx.fillStyle = "#a82436";
  ctx.fillRect(x - 7, y - 3, 14, 6);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x - 11, y - 4, 4, 1);
  ctx.fillRect(x + 7, y - 4, 4, 1);
  ctx.fillStyle = "#2a1008";
  ctx.fillRect(x - 9, y + 6, 2, 3);
  ctx.fillRect(x + 7, y + 6, 2, 3);
}

/** 진행자: 연미복 · 값 팻말 (앞선 사람 색) · 하나·둘·셋 · 낙찰 때 망치를 내리침 */
function drawAuctioneer(ctx: Ctx, s: RunState, x: number): void {
  const a = auctionHere(s);
  const y = hostY() + 32;
  const t = s.tick;
  const art = hostArt(ctx, s, a, x, y);
  if (art) return signText(ctx, s, art);
  // 단상
  ctx.fillStyle = "#2a1a10";
  ctx.fillRect(x - 12, y + 2, 24, 12);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x - 12, y + 2, 24, 1);
  // 몸·머리·콧수염·높은 모자
  ctx.fillStyle = "#14101a";
  ctx.fillRect(x - 6, y - 12, 12, 14);
  ctx.fillStyle = "#f4f0e8";
  ctx.fillRect(x - 1, y - 12, 2, 6);
  ctx.fillStyle = "#e8c8a0";
  ctx.fillRect(x - 4, y - 20, 8, 8);
  ctx.fillStyle = "#1a1018";
  ctx.fillRect(x - 3, y - 15, 6, 1);
  ctx.fillRect(x - 5, y - 21, 10, 2);
  ctx.fillRect(x - 3, y - 28, 6, 7);
  const active = a && a.lot >= 0 && a.lot < a.lots.length;
  if (!active) return;
  // 팻말: 지금 값 · 앞선 사람 (나 = 초록 · 그림자 = 빨강)
  const sold = goingStage(a, t) >= 3;
  const lift = s.tick - a.t < 12 ? 3 : 0;
  ctx.fillStyle = "#4a3018";
  ctx.fillRect(x + 9, y - 22 - lift, 2, 16);
  ctx.fillStyle = a.lead === 1 ? "#1e5a2a" : a.lead === 2 ? "#5a1420" : "#2a2a3a";
  ctx.fillRect(x + 2, y - 40 - lift, 28, 17);
  ctx.strokeStyle = GOLD;
  ctx.strokeRect(x + 2.5, y - 39.5 - lift, 27, 16);
  ctx.fillStyle = "#fff6c0";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${a.price}G`, x + 16, y - 28 - lift);
  // 하나·둘·셋 (점 세 개가 차례로 켜짐)
  const stage = goingStage(a, t);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < stage ? "#ff5a3a" : "#3a2a2a";
    ctx.fillRect(x + 8 + i * 6, y - 22 - lift, 4, 3);
  }
  ctx.textAlign = "start";
  // 망치 (낙찰 직전엔 높이 들었다가)
  const up = sold ? 0 : stage >= 2 ? 1 : 0.4;
  ctx.save();
  ctx.translate(x - 8, y - 8);
  ctx.rotate(-up * 1.2);
  ctx.fillStyle = "#6a4020";
  ctx.fillRect(-1, -10, 2, 10);
  ctx.fillStyle = "#8a5a30";
  ctx.fillRect(-4, -13, 8, 4);
  ctx.restore();
}

/** 그림 팻말 위 값·하나둘셋 (판 가운데 = at) */
function signText(ctx: Ctx, s: RunState, at: { x: number; y: number }): void {
  const a = auctionHere(s);
  if (!a || a.lot < 0 || a.lot >= a.lots.length) return;
  ctx.fillStyle = a.lead === 1 ? "#a8ffb8" : a.lead === 2 ? "#ffb0b8" : "#fff6c0";
  ctx.font = "bold 8px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${a.price}G`, at.x, at.y + 1);
  const stage = goingStage(a, s.tick);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < stage ? "#ff5a3a" : "#3a2a2a";
    ctx.fillRect(at.x - 8 + i * 6, at.y + 4, 4, 2);
  }
  ctx.textAlign = "start";
}
