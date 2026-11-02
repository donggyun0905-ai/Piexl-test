// 경매장 '암흑가' 그림 (sim/auction): 붉은 융단 무대 · 상품 받침 다섯(4번째부터 ??? 천) · 의자 두 줄에 그림자 손님(부를 때 번호표를 듦)
// · 진행자(값이 적힌 팻말을 들고, 낙찰 때 망치) · 하나·둘·셋 표시. 효과(돈 날림·띠링)는 render/vaultFx
import { AUCTION, auctionHere, goingStage, hostY, LOT_GAP, lotHidden, lotY, SHADOW_SEATS, type RunState } from "@pixel-rogue/shared";
import { iconCanvas, type IconItem } from "../iconArt";
import { additive, alpha, glow } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const GOLD = "#e8c25a";

/** 그림자 손님 자리 (두 줄) */
export function seatPos(i: number, cx: number, cy: number): { x: number; y: number } {
  const row = i % 2;
  const col = Math.floor(i / 2);
  const cols = Math.ceil(SHADOW_SEATS / 2);
  return { x: cx + (col - (cols - 1) / 2) * 30 + (row ? 15 : 0), y: cy + 28 + row * 30 };
}

export function drawAuctionHall(ctx: Ctx, s: RunState, cx: number, cy: number): void {
  const a = auctionHere(s);
  const t = s.tick;
  // 무대: 붉은 융단 · 금테 · 뒤쪽 휘장
  const top = lotY() - 18;
  ctx.fillStyle = "#3a0c14";
  ctx.fillRect(cx - 90, top, 180, 44);
  ctx.fillStyle = "#5a1420";
  for (let i = 0; i < 12; i++) ctx.fillRect(cx - 90 + i * 15, top, 7, 44);
  ctx.fillStyle = GOLD;
  ctx.fillRect(cx - 92, top + 44, 184, 2);
  // 상품 받침
  for (let i = 0; i < AUCTION.lots; i++) {
    const x = cx + (i - (AUCTION.lots - 1) / 2) * LOT_GAP;
    const y = lotY();
    const lot = a?.lots[i];
    const now = a?.lot === i;
    if (now) additive(ctx, () => glow(ctx, x, y - 4, 16, GOLD, 0.5 + 0.2 * Math.sin(t / 8), 0.5));
    ctx.fillStyle = "#1a1018";
    ctx.fillRect(x - 8, y + 6, 16, 6);
    ctx.fillStyle = GOLD;
    ctx.fillRect(x - 8, y + 6, 16, 1);
    if (!lot) continue;
    ctx.globalAlpha = lot.won ? 0.35 : 1;
    if (lotHidden(a!, i)) {
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
    ctx.fillStyle = "#3a2410";
    ctx.fillRect(p.x - 7, p.y - 2, 14, 10);
    ctx.fillStyle = "#5a3a1a";
    ctx.fillRect(p.x - 7, p.y - 6, 14, 4);
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
}

/** 진행자: 연미복 · 값 팻말 (앞선 사람 색) · 하나·둘·셋 · 낙찰 때 망치를 내리침 */
export function drawAuctioneer(ctx: Ctx, s: RunState, x: number): void {
  const a = auctionHere(s);
  const y = hostY() + 32;
  const t = s.tick;
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
