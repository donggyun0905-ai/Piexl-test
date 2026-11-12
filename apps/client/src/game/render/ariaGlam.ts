// 아리아 꾸밈 (화면만): 음표 빛 꼬리 · 지휘봉 금빛 궤적 · 악기 연주 음파·발밑 빛 고리 · 몸 둘레 떠도는 작은 오선 빛
// ariaArt의 drawAriaAir·drawAriaGround가 부름 (상태는 읽기만, 꼬리 자리는 화면에서만 기억)
import type { ArInst, RunState } from "@pixel-rogue/shared";
import { AR, AR_COLORS } from "./ariaArt";
import { lerp, type Snap } from "./palette";
import { additive, alpha, crescent, glow, type Ctx } from "./pwFxBits";

/** 음표마다 지나온 자리 (화면에서만 · 틱마다 한 점, 10점까지) */
const trails = new Map<object, { x: number; y: number }[]>();
let trailTick = -1;
const TRAIL = 10;

/** 음표 빛 꼬리: 지나온 자리를 따라 음표 색 점이 작아지며 사라짐 · 군데군데 반짝임 */
export function noteTrails(ctx: Ctx, s: RunState, snap: Snap): void {
  const notes = s.player.arNotes ?? [];
  if (trailTick !== s.tick) {
    if (s.tick !== trailTick + 1) trails.clear();
    trailTick = s.tick;
    const live = new Set<object>(notes);
    for (const k of trails.keys()) if (!live.has(k)) trails.delete(k);
    for (const n of notes) {
      const t = trails.get(n) ?? [];
      t.push({ x: n.x, y: n.y });
      if (t.length > TRAIL) t.shift();
      trails.set(n, t);
    }
  }
  additive(ctx, () => {
    for (const n of notes) {
      const t = trails.get(n);
      if (!t) continue;
      const col = AR_COLORS[n.kind & 7]!;
      for (let i = 0; i < t.length - 1; i++) {
        const k = (i + 1) / t.length;
        glow(ctx, snap(t[i]!.x), snap(t[i]!.y), 2 + n.r * 0.5 * k, col, 0.35 * k);
        if ((i + s.tick + n.kind) % 5 === 0) {
          ctx.fillStyle = alpha(AR.pale, 0.8 * k);
          ctx.fillRect(snap(t[i]!.x) - 0.5, snap(t[i]!.y) - 2, 1, 4);
          ctx.fillRect(snap(t[i]!.x) - 2, snap(t[i]!.y) - 0.5, 4, 1);
        }
      }
    }
  });
}

/** 지휘봉 궤적: 공격한 순간 몸 앞에 금빛 초승달 한 획 + 작은 빛 */
export function batonSwing(ctx: Ctx, s: RunState, x: number, y: number): void {
  const p = s.player;
  const since = s.tick - (p.arAtkAt ?? -99);
  if (since < 0 || since > 12) return;
  const f = since / 12;
  const ang = Math.atan2(p.faceY, p.faceX) - 0.9 + f * 1.8;
  additive(ctx, () => {
    crescent(ctx, x, y - 8, 16, ang, 0.7, 4, AR.gold, 0.8 * (1 - f));
    glow(ctx, x + Math.cos(ang) * 16, y - 8 + Math.sin(ang) * 16, 6, AR.pale, 0.8 * (1 - f), 0.6);
  });
}

/** 악기 발밑 빛 고리 (천천히 돎) · 연주하면 음파 셋이 퍼짐 */
export function instGlam(ctx: Ctx, i: ArInst, x: number, y: number, s: RunState, w: number): void {
  const t = s.tick + i.x;
  ctx.strokeStyle = alpha(AR.gold, 0.35);
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.lineDashOffset = -t * 0.3;
  ctx.beginPath();
  ctx.ellipse(x, y + w * 0.36, w * 0.45, w * 0.13, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  const play = i.playAt !== undefined ? s.tick - i.playAt : 99;
  if (play > 30) return;
  additive(ctx, () => {
    for (let k = 0; k < 3; k++) {
      const g = play / 30 - k * 0.18;
      if (g <= 0 || g >= 1) continue;
      ctx.strokeStyle = alpha(AR_COLORS[(i.kind * 2 + k) & 7]!, 0.7 * (1 - g));
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y - 4, w * (0.4 + g * 0.9), -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.stroke();
    }
  });
}

/** 몸 둘레 오선 빛: 다섯 줄이 몸 뒤로 둥글게 흐름 (악보 완성 동안은 더 밝게) */
export function staffHalo(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  const x = snap(lerp(p.prevX, p.x, a));
  const y = snap(lerp(p.prevY, p.y, a)) - 12;
  const on = (p.arFinale ?? 0) > 0 ? 1 : 0.35;
  additive(ctx, () => {
    for (let l = 0; l < 5; l++) {
      ctx.strokeStyle = alpha(AR.gold, 0.18 * on);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      const r = 20 + l * 2.2;
      const st = s.tick * 0.02 + l * 0.15;
      ctx.ellipse(x, y, r, r * 0.38, 0, st, st + Math.PI * 1.1);
      ctx.stroke();
    }
  });
}
