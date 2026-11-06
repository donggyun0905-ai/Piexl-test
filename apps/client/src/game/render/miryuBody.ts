// 미류 그리기 (몸 둘레). 몸 뒤: 흐르는 물길 · 물칼날 꼬리 · 해룡 물빛 그림자
// 몸 위: 해룡 (몸통·머리) · 되돌리는 물칼날 · 칼 둘레를 도는 물방울 · 게이지가 차면 몸을 감는 물살 · 머리 위 해류 게이지
import { isMiryu, MIRYU, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, shock, type Ctx } from "./pwFxBits";
import { glints } from "./seaLight";
import { hpBarTop } from "./hpTop";
import { dragonBody, flowRibbon, MR, waterBlade } from "./miryuArt";

/** 몸 뒤 */
export function drawMiryuBack(ctx: Ctx, s: RunState, _a0: number, snap: Snap): void {
  const p = s.player;
  if (!isMiryu(p) || s.over) return;
  const frost = p.weaponId === "mrFrost";
  for (const w of p.mrStreams ?? []) {
    // 생길 때 빠르게 차오르고, 사라질 때 흐려짐
    const al = Math.min(1, (w.t0 - w.t) / 6 + 0.3, w.t / 30);
    flowRibbon(ctx, w.pts.map(([x, y]) => [snap(x), snap(y)] as const), w.w, al, s.tick, frost);
  }
  const d = p.mrDragon;
  if (d) additive(ctx, () => {
    for (const [x, y] of d.body) glow(ctx, snap(x), snap(y) + 10, 18 * d.size, MR.deep, 0.18);
  });
}

/** 머리 위 해류 게이지: 차는 동안 물빛 · 가득이면 흰빛 깜빡 · 해룡이 나와 있으면 금빛 */
function gauge(ctx: Ctx, s: RunState, x: number, y: number): void {
  const p = s.player;
  const r = p.mrDragon ? 1 : Math.min(1, (p.mrFlow ?? 0) / MIRYU.flowMax);
  const top = hpBarTop(p, y) - 5;
  const w = 18;
  ctx.fillStyle = "rgba(4,16,32,0.9)";
  ctx.fillRect(x - w / 2 - 1, top - 1, w + 2, 4);
  ctx.fillStyle = p.mrDragon ? MR.eye : r >= 1 && (s.tick >> 2) % 2 ? "#ffffff" : MR.aqua;
  ctx.fillRect(x - w / 2, top, Math.round(w * r), 2);
  if (r >= 1) additive(ctx, () => glow(ctx, x - w / 2 + w * r, top + 1, 5, MR.aqua, 0.8));
  // 모은 물방울: 게이지 아래 작은 점
  const n = p.mrDrops ?? 0;
  for (let i = 0; i < Math.min(10, n); i++) {
    ctx.fillStyle = MR.foam;
    ctx.fillRect(x - w / 2 + i * 2, top + 3, 1, 1);
  }
}

/** 몸 위 */
export function drawMiryuAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isMiryu(p) || s.over) return;
  const px = snap(lerp(p.prevX, p.x, a0));
  const by = snap(lerp(p.prevY, p.y, a0));
  const py = by - 4;
  for (const b of p.mrBlades ?? []) waterBlade(ctx, snap(b.x), snap(b.y), b.dx, b.dy, Math.min(1, b.left / 30));
  // 모은 물방울: 칼(몸 앞) 둘레를 물 흐르듯 돌아감
  const n = p.mrDrops ?? 0;
  if (n > 0) additive(ctx, () => {
    for (let i = 0; i < n; i++) {
      const t = s.tick * 0.09 + (i / n) * Math.PI * 2;
      const x = px + Math.cos(t) * 13;
      const y = py + Math.sin(t) * 6;
      glow(ctx, x, y, 4, MR.aqua, 0.9, 1);
      ctx.fillStyle = alpha(MR.foam, 0.9);
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  });
  const full = (p.mrFlow ?? 0) >= MIRYU.flowMax && !p.mrDragon;
  if (full) {
    // 게이지 가득: 몸을 감아 오르는 두 줄기 물살 (해룡이 깨어나려 함)
    additive(ctx, () => {
      ctx.lineCap = "round";
      for (const k of [0, Math.PI]) {
        ctx.strokeStyle = alpha(MR.aqua, 0.75);
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 14; i++) {
          const u = i / 14;
          const t = s.tick * 0.15 + k + u * Math.PI * 2;
          const x = px + Math.cos(t) * (11 - u * 3);
          const y = by + 2 - u * 22 + Math.sin(t) * 4;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.lineCap = "butt";
      shock(ctx, px, by, 14 + Math.sin(s.tick * 0.2) * 2, MR.aqua, 0.45, 2);
    });
    glints(ctx, px, py, 16, 3, s.tick, 5, MR.foam, 0.8);
  }
  const d = p.mrDragon;
  if (d) {
    const body = d.body.map(([x, y]) => [snap(x), snap(y) - 10] as const);
    dragonBody(ctx, body, d.size, d.dx, d.dy, s.tick, Math.min(1, d.body.length / 4));
  }
  if (!s.pvp) gauge(ctx, s, px, by);
}
