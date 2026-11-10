// 레이드: 내 캐릭터 표시 (늘 보임, 2026-11-10 사용자 요청: 위에 크게 · 바닥에 동그란 원)
// 머리 위: 크게 떠서 위아래로 흔들리는 빛나는 역삼각 보석 표지 (테두리·안쪽 빛·도는 반짝임) · 발밑: 반투명 원판 + 굵은 고리 + 퍼지는 고리
// 2026-11-10 사용자 요청: 너무 커서 표지·원 모두 절반으로 · 레이드 방은 화면을 절반으로 줄여 보니 더 크게 (render/s3Bosses가 바닥·위에서 부름)
import { lerp, type Snap } from "./palette";
import { RAID_ROOM, type RunState } from "@pixel-rogue/shared";
import { additive, glow } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const COLOR = "#4af07a";

const sizeOf = (s: RunState) => (s.roomId === RAID_ROOM.boss ? 1.5 : 0.85);
function me(s: RunState, a: number, snap: Snap): { x: number; y: number; r: number } | null {
  const p = s.player;
  if (!s.raidBoss || p.hp <= 0 || s.over) return null;
  return { x: snap(lerp(p.prevX, p.x, a)), y: snap(lerp(p.prevY, p.y, a)), r: p.r };
}

/** 발밑 원 (사람보다 아래) */
export function drawRaidMeRing(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const m = me(s, a, snap);
  if (!m) return;
  const k = sizeOf(s);
  const t = s.tick;
  const R = m.r / 2 + 7 * k;
  const y = m.y + m.r * 0.5;
  ctx.save();
  ctx.fillStyle = "rgba(74, 240, 122, 0.22)";
  ctx.beginPath();
  ctx.ellipse(m.x, y, R, R * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = 2 * k;
  ctx.stroke();
  // 퍼지는 고리 (1초마다)
  const f = (t % 60) / 60;
  ctx.globalAlpha = 1 - f;
  ctx.lineWidth = k;
  ctx.beginPath();
  ctx.ellipse(m.x, y, R * (1 + f * 0.6), R * 0.55 * (1 + f * 0.6), 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** 머리 위 표지 (사람·효과보다 위) */
export function drawRaidMeMark(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const m = me(s, a, snap);
  if (!m) return;
  const k = sizeOf(s);
  const t = s.tick;
  const w = 9 * k;
  const h = 14 * k;
  const cy = m.y - m.r - 6 - 22 * k + Math.sin(t / 10) * 3 * k;
  additive(ctx, () => glow(ctx, m.x, cy, w * 2.2, COLOR, 0.45, 0.4));
  // 역삼각 보석: 어두운 테두리 → 초록 몸 → 밝은 왼쪽 면
  const gem = (pad: number, col: string) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(m.x - w - pad, cy - h * 0.35 - pad);
    ctx.lineTo(m.x, cy - h * 0.7 - pad);
    ctx.lineTo(m.x + w + pad, cy - h * 0.35 - pad);
    ctx.lineTo(m.x, cy + h * 0.6 + pad * 1.4);
    ctx.closePath();
    ctx.fill();
  };
  gem(1.5 * k, "#072410");
  gem(0, COLOR);
  ctx.fillStyle = "#c8ffd4";
  ctx.beginPath();
  ctx.moveTo(m.x - w, cy - h * 0.35);
  ctx.lineTo(m.x, cy - h * 0.7);
  ctx.lineTo(m.x, cy + h * 0.6);
  ctx.closePath();
  ctx.globalAlpha = 0.45;
  ctx.fill();
  ctx.globalAlpha = 1;
  // 도는 반짝임
  const sp = (t % 90) / 90;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(m.x - w + sp * w * 2 - k, cy - h * 0.35 - k, 2 * k, 2 * k);
}
