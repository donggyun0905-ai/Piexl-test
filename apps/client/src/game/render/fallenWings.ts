// 히든 아이템 '떨어진 신의 날개' 그림: 등 뒤에서 좌우로 활짝 펼친 깃털 날개 (몸보다 먼저 그림)
// 깃털 세 겹(긴 첫째 깃·둘째 깃·짧은 덮깃)이 짙은 청록 뿌리 → 하늘빛 → 흰 끝으로 물듦 · 천천히 퍼덕이며 깃 끝에서 빛 가루가 흩날림
import type { RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, rnd } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const DEEP = "#0a2a48";
const TEAL = "#1690b8";
const CYAN = "#3ae8f0";
const PALE = "#d8ffff";
const LINE = "#06182a";

/** 깃털 하나: 뿌리(0,0)에서 ang 방향으로 len, 가운데가 넓고 끝이 뾰족 · 뿌리→끝 색 번짐 */
function feather(ctx: Ctx, bx: number, by: number, ang: number, len: number, w: number, a: number, light: number): void {
  const dx = Math.cos(ang);
  const dy = Math.sin(ang);
  const nx = -dy;
  const ny = dx;
  const tx = bx + dx * len;
  const ty = by + dy * len;
  const mx = bx + dx * len * 0.45;
  const my = by + dy * len * 0.45;
  const g = ctx.createLinearGradient(bx, by, tx, ty);
  g.addColorStop(0, alpha(DEEP, a));
  g.addColorStop(0.35, alpha(TEAL, a));
  g.addColorStop(0.7 - light * 0.15, alpha(CYAN, a));
  g.addColorStop(0.9, alpha(PALE, a));
  g.addColorStop(1, alpha("#ffffff", a));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(bx + nx * w * 0.3, by + ny * w * 0.3);
  ctx.quadraticCurveTo(mx + nx * w, my + ny * w, tx, ty);
  ctx.quadraticCurveTo(mx - nx * w * 0.6, my - ny * w * 0.6, bx - nx * w * 0.3, by - ny * w * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = alpha(LINE, a * 0.8);
  ctx.lineWidth = 0.7;
  ctx.stroke();
  // 깃대: 가운데 밝은 줄
  ctx.strokeStyle = alpha(PALE, a * 0.5);
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(bx + dx * len * 0.85, by + dy * len * 0.85);
  ctx.stroke();
}

/** 한쪽 날개 (side ±1, 어깨 bx·by, open 0~1 펼친 정도) · 깃 끝 자리를 돌려줌
 * 뼈대: 어깨 → 팔꿈치 → 손목이 위·바깥으로 솟고, 손목에서 첫째 깃이 바깥으로 활짝 · 팔을 따라 둘째 깃이 아래로 늘어짐 · 덮깃이 뿌리를 덮음 */
function wing(ctx: Ctx, bx: number, by: number, side: number, open: number, a: number): [number, number][] {
  const tips: [number, number][] = [];
  const at = (deg: number) => {
    const r = (deg * Math.PI) / 180;
    return side > 0 ? r : Math.PI - r;
  };
  const ex = bx + side * 9;
  const ey = by - 8 - open * 3;
  const wx = bx + side * (19 + open * 3);
  const wy = by - 15 - open * 6;
  const onArm = (u: number): [number, number] => (u < 0.5 ? [lerp(bx, ex, u * 2), lerp(by, ey, u * 2)] : [lerp(ex, wx, u * 2 - 1), lerp(ey, wy, u * 2 - 1)]);
  // 둘째 깃: 팔을 따라 아래·바깥으로 늘어짐 (안쪽이 짧음)
  for (let i = 0; i < 8; i++) {
    const u = 0.15 + i * 0.11;
    const [rx, ry] = onArm(u);
    feather(ctx, rx, ry, at(98 - i * 7 - open * 6), 14 + i * 1.6, 4.2, a, 0.3);
  }
  // 첫째 깃: 손목에서 바깥 위 → 바깥 아래로 부채처럼 (가장 긺)
  for (let i = 0; i < 7; i++) {
    const deg = -58 + i * 13 + (1 - open) * 10;
    const len = 30 - Math.abs(i - 2) * 2.4;
    const ang = at(deg);
    const rx = wx - side * i * 0.8;
    const ry = wy + i * 1.6;
    feather(ctx, rx, ry, ang, len, 4.4, a, 1);
    tips.push([rx + Math.cos(ang) * len, ry + Math.sin(ang) * len]);
  }
  // 덮깃: 팔 위를 덮는 짧은 밝은 깃
  for (let i = 0; i < 7; i++) {
    const [rx, ry] = onArm(0.05 + i * 0.14);
    feather(ctx, rx, ry, at(70 - i * 6), 8 + i * 0.6, 3.4, a, 0);
  }
  // 앞 가장자리 (팔): 밝은 선
  ctx.strokeStyle = alpha(PALE, a * 0.85);
  ctx.lineWidth = 1.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.quadraticCurveTo(ex, ey - 2, wx, wy);
  ctx.stroke();
  ctx.lineCap = "butt";
  return tips;
}

/** 등 뒤 날개 (떨어진 신의 날개를 가졌을 때) */
export function drawFallenWings(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (p.hp <= 0 || !p.passives.includes("fallenWings")) return;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a)) - 10;
  // 천천히 퍼덕임: 펼침 정도 0.55~1 · 퍼덕일 때 몸이 살짝 뜸
  const beat = Math.sin(s.tick * 0.07);
  const open = 0.78 + 0.22 * beat;
  const lift = -beat * 1.2;
  // 날개 뒤 은은한 빛
  additive(ctx, () => {
    glow(ctx, x - 22, y - 10 + lift, 28, CYAN, 0.28);
    glow(ctx, x + 22, y - 10 + lift, 28, CYAN, 0.28);
  });
  const tips: [number, number][] = [];
  for (const side of [-1, 1]) tips.push(...wing(ctx, x + side * 3, y + lift, side, open, 0.92));
  // 깃 끝 빛 · 흩날리는 빛 가루와 작은 깃털
  additive(ctx, () => {
    tips.forEach(([tx, ty], i) => {
      const tw = 0.4 + 0.4 * Math.sin(s.tick * 0.2 + i * 1.3);
      glow(ctx, tx, ty, 2.5, PALE, tw * 0.6, 1);
    });
    for (let k = 0; k < 10; k++) {
      const life = ((s.tick + k * 23) % 90) / 90;
      const [tx, ty] = tips[(k * 5) % tips.length]!;
      const px = tx + (rnd(k, 3) - 0.5) * 10 + Math.sin(life * 6 + k) * 3;
      const py = ty + life * 26;
      ctx.fillStyle = alpha(k % 3 ? CYAN : PALE, 0.8 * (1 - life));
      ctx.fillRect(px, py, k % 4 === 0 ? 2 : 1, k % 4 === 0 ? 2 : 1);
    }
  });
}
