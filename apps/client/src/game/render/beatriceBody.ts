// 베아트리스 그리기 (몸 둘레). 몸 뒤: 자애 영역(성녀의 빛 원 · 흩날리는 깃털) · 날아가는 태양의 낙인 검기 · 태양 검날 붉은 태양 기운
// 몸 위: 적 머리 위 악의 마크(×숫자) · 내 머리 위 모은 악(심판까지) · 자애 금빛 후광 · 회복 불가 금 간 고리 · 체력이 낮을수록 타오르는 불티
import { BEATRICE, isBea, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, shock, type Ctx } from "./pwFxBits";
import { bladeStroke, BT, embers, evilMark, featherField, rays } from "./beatriceArt";
import { hpBarTop } from "./hpTop";

/** 자애 영역: 캐릭터 둘레 동그란 성녀의 빛 (노랑·하양) · 도는 빛 고리 · 피어오르는 빛 알갱이 · 곳곳에 흩날리는 깃털 */
function graceField(ctx: Ctx, x: number, y: number, t: number, left: number): void {
  const R = 64;
  const al = Math.min(1, left / 20, (BEATRICE.graceTicks - left) / 12 + 0.2);
  additive(ctx, () => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, R);
    g.addColorStop(0, `rgba(255,255,240,${0.32 * al})`);
    g.addColorStop(0.6, `rgba(255,236,150,${0.18 * al})`);
    g.addColorStop(1, "rgba(255,220,120,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, R, R * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    for (const [rr, c, w] of [[1, BT.gold, 2], [0.86, BT.white, 1]] as const) {
      ctx.strokeStyle = alpha(c, 0.75 * al);
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.ellipse(x, y, R * rr, R * rr * 0.62, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 테두리를 따라 도는 작은 빛 십자 여덟
    for (let i = 0; i < 8; i++) {
      const a = t * 0.02 + (i / 8) * Math.PI * 2;
      const px = x + Math.cos(a) * R * 0.93;
      const py = y + Math.sin(a) * R * 0.93 * 0.62;
      ctx.fillStyle = alpha(BT.holy, al);
      ctx.fillRect(px - 0.5, py - 2.5, 1, 5);
      ctx.fillRect(px - 2.5, py - 0.5, 5, 1);
    }
    // 바닥에서 피어오르는 빛 알갱이
    for (let i = 0; i < 14; i++) {
      const u = ((t * 0.8 + i * 23) % 70) / 70;
      const a = i * 2.39;
      const d = R * (0.2 + ((i * 37) % 10) / 12);
      ctx.fillStyle = alpha(i % 2 ? BT.holy : "#ffffff", al * (1 - u));
      ctx.fillRect(x + Math.cos(a) * d * 0.9, y + Math.sin(a) * d * 0.5 - u * 34, 1.5, 1.5);
    }
  });
  rays(ctx, x, y - 10, 8, 30, 10, t * 0.03, BT.holy, 0.25 * al, 1);
  featherField(ctx, x, y, R * 1.15, 16, t, al);
}

/** 몸 뒤 */
export function drawBeatriceBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isBea(p) || s.over) return;
  const px = snap(lerp(p.prevX, p.x, a0));
  const py = snap(lerp(p.prevY, p.y, a0));
  if ((p.btGrace ?? 0) > 0) graceField(ctx, px, py + 4, s.tick, p.btGrace!);
  for (const w of p.btWaves ?? []) {
    // 낙인 검기: 진행 방향에 수직인 커다란 불꽃 칼날(가운데 굵은 칼선) + 뒤로 끌리는 불꽃 꼬리
    const x = snap(w.x);
    const y = snap(w.y) - 4;
    const al = Math.min(1, w.left / 40);
    const nx = -w.dy * w.w * 1.4;
    const ny = w.dx * w.w * 1.4;
    const bend = 8;
    additive(ctx, () => {
      glow(ctx, x - w.dx * 10, y - w.dy * 10, w.w * 1.6, BT.sun, 0.35 * al);
      for (let i = 1; i <= 4; i++) glow(ctx, x - w.dx * i * 9, y - w.dy * i * 9, w.w * (1 - i * 0.18), BT.flame, 0.25 * al);
    });
    bladeStroke(ctx, x + nx - w.dx * bend, y + ny - w.dy * bend, x - nx - w.dx * bend, y - ny - w.dy * bend, 0, 1, 7, BT.sun, al);
    bladeStroke(ctx, x + nx * 0.8, y + ny * 0.8, x - nx * 0.8, y - ny * 0.8, 0, 1, 4, BT.gold, al);
    embers(ctx, x - w.dx * 12, y - w.dy * 12, 6, w.w * 2, (s.tick % 20) / 20, w.x, al);
  }
  if ((p.btSolar ?? 0) > 0 || (p.btGrace ?? 0) > 0) {
    // 태양 검날: 몸 뒤 붉은 태양 원반 + 천천히 도는 빛살
    additive(ctx, () => glow(ctx, px, py - 6, 20 + Math.sin(s.tick * 0.2) * 2, BT.sun, 0.4, 0.25));
    rays(ctx, px, py - 6, 10, 24, 12, s.tick * 0.02, BT.flame, 0.35, 1.5);
  }
}

/** 몸 위 */
export function drawBeatriceAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isBea(p) || s.over) return;
  for (const e of s.enemies) if ((e.btEvil ?? 0) > 0 && e.hp > 0) evilMark(ctx, snap(e.x) + 4, snap(e.y) - e.r - 9, e.btEvil!, s.tick);
  const px = snap(lerp(p.prevX, p.x, a0));
  const by = snap(lerp(p.prevY, p.y, a0));
  // 모은 악 (심판까지): 내 체력 줄 위에 악의 마크 ×숫자
  const n = p.btPurged ?? 0;
  if (n > 0) evilMark(ctx, px + 4, hpBarTop(p, by) - 7, n, s.tick);
  // 체력이 낮을수록 몸에서 불티가 타오름 (심판의 불꽃)
  const low = 1 - p.hp / Math.max(1, p.stats.maxHp);
  if (low > 0.3) embers(ctx, px, by + 4, Math.round(low * 10), 16, (s.tick % 40) / 40, s.tick >> 6, low);
  if ((p.btGrace ?? 0) > 0) {
    // 자애: 머리 위 금빛 후광 + 몸을 감싼 흰빛
    additive(ctx, () => {
      shock(ctx, px, by - 28, 8 + Math.sin(s.tick * 0.25), BT.gold, 0.95, 2);
      glow(ctx, px, by - 8, 18, BT.white, 0.28, 0.5);
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
