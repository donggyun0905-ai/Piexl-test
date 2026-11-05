// 매드퀸 그리기 (몸 둘레). 몸 뒤: 맵의 터렛(내려앉기·포신 돌리기·바닥 빛 고리·사거리) · 일제사격 떨어질 자리 표시 · 포탄 그림자
// 몸 위: 머리 위 미래형 대포(1~4문, 쏠 때 반동) · 양옆 날개 무기(둥글게 감쌈) · 날아가는 포탄 · 하늘에서 떨어지는 일제사격 포탄
import { cannonCount, cannonPos, isMadQueen, MADQUEEN, WEAPONS, wingPos, type RunState, type WeaponDef } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, ring, type Ctx } from "./pwFxBits";
import { armSprite, mqColor, MQ_FOAM, shellOrb } from "./madQueenArt";

const TAU = Math.PI * 2;
const colorOf = (s: RunState) => (WEAPONS[s.player.weaponId] as WeaponDef).fleet?.color ?? 0;

/** 몸 뒤: 터렛 · 떨어질 자리 · 포탄 그림자 */
export function drawMadQueenBack(ctx: Ctx, s: RunState, _a0: number, snap: Snap): void {
  const p = s.player;
  if (!isMadQueen(p) || s.over) return;
  const col = colorOf(s);
  const c = mqColor(col);
  const t = s.tick;
  for (const u of p.mqTurrets ?? []) {
    const x = snap(u.x);
    const y = snap(u.y);
    const land = Math.min(1, u.age / 12);
    additive(ctx, () => {
      // 바닥 빛 고리 (돌아가는 네 조각) · 아주 옅은 사거리
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = alpha(c, 0.55 * land);
      for (let i = 0; i < 4; i++) {
        const a = t * 0.04 + (i / 4) * TAU;
        ctx.beginPath();
        ctx.ellipse(x, y + 4, 13, 5, 0, a, a + 1);
        ctx.stroke();
      }
      ring(ctx, x, y, MADQUEEN.turretRange * (p.passives.includes("mqOverclock") ? 1.3 : 1), alpha(c, 0.07 * land), 1);
      glow(ctx, x, y + 3, 12, c, 0.35 * land);
    });
    const drop = (1 - land) * 70;
    armSprite(ctx, 1, col, x, y - 10 - drop, 30, u.a, false, 0.3 + land * 0.7);
  }
  for (const w of p.mqShells ?? []) {
    const x = snap(w.x);
    const y = snap(w.y);
    if (w.src === 2) {
      // 일제사격: 떨어질 자리에 작은 빛 과녁 → 떨어지기 직전에만 폭발 크기 고리
      const k = 1 - w.t / w.t0;
      const near = Math.max(0, 1 - w.t / MADQUEEN.salvoFall);
      additive(ctx, () => {
        ring(ctx, x, y, 4 + (1 - k) * 4, alpha(MQ_FOAM, 0.25 + k * 0.4), 1);
        ctx.fillStyle = alpha(c, 0.5);
        ctx.fillRect(x - 6, y, 12, 1);
        ctx.fillRect(x, y - 6, 1, 12);
        if (near > 0) {
          ring(ctx, x, y, w.boom, alpha(c, near * 0.35), 1);
          ctx.fillStyle = alpha(c, near * 0.07);
          ctx.beginPath();
          ctx.arc(x, y, w.boom, 0, TAU);
          ctx.fill();
        }
      });
    } else {
      ctx.fillStyle = "rgba(0,20,40,0.25)";
      ctx.beginPath();
      ctx.ellipse(x, y + 2, w.r, w.r * 0.45, 0, 0, TAU);
      ctx.fill();
    }
  }
}

/** 몸 위: 대포 · 날개 · 포탄 */
export function drawMadQueenAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isMadQueen(p) || s.over) return;
  const col = colorOf(s);
  const c = mqColor(col);
  const t = s.tick;
  const px = lerp(p.prevX, p.x, a0);
  const py = lerp(p.prevY, p.y, a0);
  const ang = Math.atan2(p.faceY, p.faceX);
  // 날개 무기: 짝수 왼쪽 · 홀수 오른쪽, 위 줄은 위로 · 아래 줄은 아래로 펼쳐 둥글게 감쌈
  for (let i = 0; i < (p.mqWings ?? 0); i++) {
    const [wx, wy] = wingPos(p, i);
    const side = i % 2 === 0 ? -1 : 1;
    const up = i < 2 ? 1 : -1;
    const x = snap(px + wx - p.x);
    const y = snap(py + wy - p.y + Math.sin(t * 0.06 + i) * 1.5);
    const wa = side < 0 ? Math.PI + 0.4 * up : -0.4 * up;
    additive(ctx, () => glow(ctx, x - side * 4, y, 14, c, 0.3 + Math.sin(t * 0.1 + i) * 0.08));
    armSprite(ctx, 2, col, x, y, 30, wa);
  }
  // 머리 위 대포: 둥실 떠 있고 쏘면 뒤로 튐
  const n = cannonCount(p);
  const kick = Math.max(0, 6 - (t - (p.mqShot ?? -99)));
  for (let i = 0; i < n; i++) {
    const [cx, cy] = cannonPos(p, i, n);
    const x = snap(px + cx - p.x - p.faceX * kick * 0.8);
    const y = snap(py + cy - p.y - p.faceY * kick * 0.5 + Math.sin(t * 0.07 + i * 1.3) * 1.2);
    additive(ctx, () => {
      glow(ctx, x, y + 6, 10, c, 0.35);
      ctx.strokeStyle = alpha(c, 0.5);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, y + 8, 8, 2.5, 0, 0, TAU);
      ctx.stroke();
    });
    armSprite(ctx, 0, col, x, y, 24, ang);
  }
  // 포탄
  for (const w of p.mqShells ?? []) {
    if (w.src === 2) {
      if (w.t > MADQUEEN.salvoFall) continue;
      const h = (w.t / MADQUEEN.salvoFall) * 170;
      shellOrb(ctx, snap(w.x), snap(w.y - h), 4, c, 0, 1);
      continue;
    }
    shellOrb(ctx, snap(w.x), snap(w.y - w.h), w.src === 0 ? 3.5 : 2.6, c, w.dx, w.dy);
  }
}
