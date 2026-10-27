// 잊혀진 자 빛의 고리: 등 뒤 고리(지금의 1.5배, 몸 그림의 일부처럼 늘 보임 · 신족이면 불타는 금빛 고리로 바뀜)
// · 화면 왼쪽 위 게이지(화려한 금빛 테두리 안에 노란 원이 한 바퀴 차오름, 신족이면 남은 시간)
import { forgottenRing, type RunState } from "@pixel-rogue/shared";
import { hudScale } from "./imugiAura";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const GOLD = "#ffd860";
const DEEP = "#b8862a";
const PALE = "#fff6c0";

function ring(ctx: Ctx, x: number, y: number, r: number, c: string, w: number, a0 = 0, a1 = TAU): void {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), a0, a1);
  ctx.stroke();
}

/** 등 뒤 고리: 평소는 은은한 금빛 고리 + 작은 장식 넷 · 신족이면 흰 금빛으로 타오르며 빛살이 돎 */
export function drawHaloBack(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha) - 11);
  const god = (p.fgGod ?? 0) > 0;
  const R = 12;
  if (god) {
    ctx.globalAlpha = 0.35 + 0.15 * Math.sin(s.tick * 0.25);
    ring(ctx, x, y, R + 3, GOLD, 3);
    for (let i = 0; i < 12; i++) {
      const a = s.tick * 0.03 + (i * TAU) / 12;
      ctx.globalAlpha = i % 2 ? 0.5 : 0.8;
      ring(ctx, x, y, R + 2, PALE, 1, a, a + 0.12);
      ctx.strokeStyle = PALE;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * (R + 2), y + Math.sin(a) * (R + 2));
      ctx.lineTo(x + Math.cos(a) * (R + 6 + (i % 3)), y + Math.sin(a) * (R + 6 + (i % 3)));
      ctx.stroke();
    }
    ctx.globalAlpha = 0.95;
    ring(ctx, x, y, R, "#ffffff", 2);
    ring(ctx, x, y, R - 2, GOLD, 1);
  } else {
    ctx.globalAlpha = 0.55;
    ring(ctx, x, y, R, DEEP, 2);
    ctx.globalAlpha = 0.85;
    ring(ctx, x, y, R, GOLD, 1);
    for (let i = 0; i < 4; i++) {
      const a = (i * TAU) / 4 - Math.PI / 2;
      ctx.fillStyle = i % 2 ? GOLD : PALE;
      ctx.fillRect(Math.round(x + Math.cos(a) * R) - 1, Math.round(y + Math.sin(a) * R) - 1, 2, 2);
    }
  }
  ctx.globalAlpha = 1;
}

/** 화면 왼쪽 위 게이지 (맵을 가리지 않게 벽 쪽 모서리) · scale = 게임 1픽셀의 화면 픽셀 */
export function drawHaloHud(ctx: Ctx, s: RunState, scale: number): void {
  const p = s.player;
  if (p.characterId !== "forgotten") return;
  const k = hudScale(scale);
  const god = (p.fgGod ?? 0) > 0;
  const fill = forgottenRing(p);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.save();
  // 협동이면 왼쪽 위 인원 표 아래로
  const cx = 24;
  const cy = s.party ? ((30 + 5 * s.party.length) * scale) / k + 18 : 24;
  const R = 13;
  // 바탕
  ctx.fillStyle = "rgba(20,14,30,0.85)";
  ctx.beginPath();
  ctx.arc(cx, cy, R + 2, 0, TAU);
  ctx.fill();
  // 노란 게이지: 위에서 시계 방향으로 찬 만큼, 한 바퀴 다 차면 신족 (빈 곳은 어둡게)
  ring(ctx, cx, cy, R - 3, "#3a3020", 5);
  if (fill > 0) ring(ctx, cx, cy, R - 3, god ? "#fff3a0" : "#ffd23a", 5, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, fill));
  // 가운데 어두운 구멍 · 신족이면 빛
  ctx.fillStyle = god ? `rgba(255,246,192,${0.5 + 0.3 * Math.sin(s.tick * 0.3)})` : "#140e1e";
  ctx.beginPath();
  ctx.arc(cx, cy, R - 6, 0, TAU);
  ctx.fill();
  // 화려한 금빛 테두리: 두 겹 고리 + 큰 뿔 넷(위아래좌우) + 작은 뿔 넷(대각) + 고리 위 구슬
  ring(ctx, cx, cy, R, DEEP, 3);
  ring(ctx, cx, cy, R, GOLD, 1.5);
  ring(ctx, cx, cy, R - 6, GOLD, 1);
  for (let i = 0; i < 8; i++) {
    const a = (i * TAU) / 8 - Math.PI / 2;
    const big = i % 2 === 0;
    const len = big ? 7 : 4;
    const w = big ? 2.6 : 1.8;
    const bx = cx + Math.cos(a) * R;
    const by = cy + Math.sin(a) * R;
    ctx.fillStyle = big ? GOLD : DEEP;
    ctx.beginPath();
    ctx.moveTo(bx + Math.cos(a) * len, by + Math.sin(a) * len);
    ctx.lineTo(bx + Math.cos(a + Math.PI / 2) * w, by + Math.sin(a + Math.PI / 2) * w);
    ctx.lineTo(bx - Math.cos(a + Math.PI / 2) * w, by - Math.sin(a + Math.PI / 2) * w);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PALE;
    ctx.fillRect(Math.round(bx) - 1, Math.round(by) - 1, 2, 2);
  }
  // 가득 찼거나 신족이면 테두리가 반짝임
  if (god || fill >= 1) {
    ctx.globalAlpha = 0.5 + 0.4 * Math.sin(s.tick * 0.35);
    ring(ctx, cx, cy, R + 2, "#ffffff", 1);
  }
  ctx.restore();
}
