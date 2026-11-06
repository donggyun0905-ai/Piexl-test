// 베아트리스 그리기 (몸 둘레). 몸 뒤: 날아가는 태양의 낙인 검기 · 태양 검날 붉은 태양 기운
// 몸 위: 적 머리 위 악 표시(붉은 X 눈금 10칸) · 자애 금빛 후광(체력 1) · 회복 불가 짙은 붉은 금 간 고리 · 체력이 낮을수록 타오르는 불꽃
import { isBea, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, beam, glow, shock, sparks, type Ctx } from "./pwFxBits";
import { BT, xMark } from "./beatriceFx";

/** 몸 뒤 */
export function drawBeatriceBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isBea(p) || s.over) return;
  for (const w of p.btWaves ?? []) {
    // 낙인 검기: 진행 방향에 수직인 커다란 초승달 불꽃 칼날 + 지나온 자리 불꽃 꼬리
    const x = snap(w.x);
    const y = snap(w.y) - 4;
    const al = Math.min(1, w.left / 40);
    const nx = -w.dy;
    const ny = w.dx;
    additive(ctx, () => {
      beam(ctx, x - w.dx * 26, y - w.dy * 26, x, y, w.w * 0.5, BT.flame, al * 0.4);
      beam(ctx, x + nx * w.w * 1.3, y + ny * w.w * 1.3, x - nx * w.w * 1.3, y - ny * w.w * 1.3, 7, BT.sun, al);
      beam(ctx, x + nx * w.w + w.dx * 4, y + ny * w.w + w.dy * 4, x - nx * w.w + w.dx * 4, y - ny * w.w + w.dy * 4, 3, BT.gold, al);
      glow(ctx, x, y, w.w * 1.4, BT.sun, 0.35 * al);
    });
  }
  if ((p.btSolar ?? 0) > 0 || (p.btGrace ?? 0) > 0) {
    const px = snap(lerp(p.prevX, p.x, a0));
    const py = snap(lerp(p.prevY, p.y, a0));
    additive(ctx, () => glow(ctx, px, py, 22 + Math.sin(s.tick * 0.2) * 2, BT.sun, 0.35, 0.2));
  }
}

/** 적 머리 위 악: 짙은 붉은 눈금 (10칸) · 7 이상이면 붉게 깜빡이는 X */
function evilMarks(ctx: Ctx, s: RunState, snap: Snap): void {
  for (const e of s.enemies) {
    const n = e.btEvil ?? 0;
    if (n <= 0 || e.hp <= 0) continue;
    const x = snap(e.x);
    const y = snap(e.y) - e.r - 10;
    ctx.fillStyle = "rgba(20,0,4,0.85)";
    ctx.fillRect(x - 11, y - 1, 22, 4);
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i < n ? (n >= 7 ? BT.sun : BT.evil) : "rgba(90,20,30,0.6)";
      ctx.fillRect(x - 10 + i * 2, y, 1, 2);
    }
    if (n >= 7 && (s.tick >> 3) % 2) additive(ctx, () => xMark(ctx, x, y - 6, 4, 0, 2, BT.sun, 0.9));
  }
}

/** 몸 위 */
export function drawBeatriceAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isBea(p) || s.over) return;
  evilMarks(ctx, s, snap);
  const px = snap(lerp(p.prevX, p.x, a0));
  const by = snap(lerp(p.prevY, p.y, a0));
  // 체력이 낮을수록 몸에서 불꽃이 타오름 (심판의 불꽃)
  const low = 1 - p.hp / Math.max(1, p.stats.maxHp);
  if (low > 0.3) additive(ctx, () => sparks(ctx, px, by, Math.round(low * 8), 16, (s.tick % 30) / 30, BT.flame, s.tick >> 5, low));
  if ((p.btGrace ?? 0) > 0) {
    // 자애: 머리 위 금빛 후광 + 몸을 감싼 흰빛 (체력 1에서 줄지 않음)
    additive(ctx, () => {
      shock(ctx, px, by - 26, 9 + Math.sin(s.tick * 0.25), BT.gold, 0.9, 2);
      glow(ctx, px, by - 8, 20, BT.white, 0.3, 0.4);
      beam(ctx, px, by + 4, px, by - 40, 3, BT.gold, 0.3);
    });
  } else if ((p.btNoHeal ?? 0) > 0) {
    // 회복 불가: 몸 둘레 짙은 붉은 고리에 금이 가 있음 (깜빡이며)
    const al = 0.5 + 0.3 * Math.sin(s.tick * 0.3);
    ctx.strokeStyle = alpha(BT.dark, al);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(px, by + 2, 14, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = alpha("#ff4a5a", al);
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const t = (i / 4) * Math.PI * 2 + 0.3;
      ctx.beginPath();
      ctx.moveTo(px + Math.cos(t) * 11, by + 2 + Math.sin(t) * 4);
      ctx.lineTo(px + Math.cos(t) * 17, by + 2 + Math.sin(t) * 8);
      ctx.stroke();
    }
  }
}
