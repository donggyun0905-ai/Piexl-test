// 세레나 그리기 (몸 둘레). 몸 뒤: 가시 정원 장판(빛의 강철 가시가 솟은 금빛 원)
// 몸 위: 늘 몸 둘레를 크게 도는 비수 달린 사슬 채찍(휘어진 사슬 + 빛 잔상) · 환혹의 스텝 중 꽃잎 · 가시가 박힌 적(머리 위 금빛 가시 수) · 마비된 적(분홍 별 고리)
import { isSerena, snOrbAt, snOrbCount, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, ring, type Ctx } from "./pwFxBits";
import { chainWhip, SN } from "./serenaArt";

/** 몸 뒤 */
export function drawSerenaBack(ctx: Ctx, s: RunState, _a0: number, snap: Snap): void {
  const p = s.player;
  if (!isSerena(p) || s.over) return;
  for (const f of p.snFields ?? []) {
    const x = snap(f.x);
    const y = snap(f.y);
    const al = Math.min(1, f.t / 30);
    ctx.fillStyle = alpha(SN.gold, 0.1 * al);
    ctx.beginPath();
    ctx.ellipse(x, y, f.r, f.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    additive(ctx, () => {
      ctx.strokeStyle = alpha(SN.light, 0.6 * al);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, y, f.r, f.r * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    // 솟은 가시: 자리로 정한 고정 무늬 · 살짝 반짝임
    const seed = Math.abs(Math.round(f.x * 13 + f.y * 7));
    for (let i = 0; i < 9; i++) {
      const t = ((seed + i * 47) % 100) / 100;
      const d = (((seed >> 2) + i * 31) % 100) / 100;
      const tx = x + Math.cos(t * Math.PI * 2) * f.r * 0.85 * d;
      const ty = y + Math.sin(t * Math.PI * 2) * f.r * 0.45 * d;
      const h = 4 + ((seed + i) % 3);
      const tw = (s.tick + i * 9) % 40 < 4 ? 1 : 0.75;
      ctx.fillStyle = alpha(i % 2 ? SN.gold : SN.white, tw * al);
      ctx.fillRect(Math.round(tx), Math.round(ty - h), 1, h);
      ctx.fillRect(Math.round(tx) - 1, Math.round(ty) - 1, 3, 1);
    }
  }
}

/** 도는 사슬 채찍 하나: 손에서 뻗어 나가 뒤로 휘어진 사슬 + 비수가 지나간 빛 잔상 */
function orbChain(ctx: Ctx, s: RunState, bx: number, by: number, i: number, ult: boolean): void {
  const p = s.player;
  const at = (k: number): [number, number] => {
    const [x, y] = snOrbAt(p, s.tick - k, i);
    return [bx + (x - p.x), by - 6 + (y - p.y) * 0.6];
  };
  const [tx, ty] = at(0);
  const [mx, my] = at(10);
  const glowC = ult ? SN.pink : i % 2 ? SN.ether : SN.light;
  additive(ctx, () => {
    // 잔상: 비수가 지나간 자리
    for (let k = 1; k <= 8; k++) {
      const [x0, y0] = at((k - 1) * 2);
      const [x1, y1] = at(k * 2);
      ctx.strokeStyle = alpha(glowC, 0.5 * (1 - k / 9));
      ctx.lineWidth = 3 - k * 0.3;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
  });
  chainWhip(ctx, bx, by - 8, (bx + mx) / 2, (by - 8 + my) / 2, tx, ty, 0.95, glowC);
}

/** 몸 위 */
export function drawSerenaAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isSerena(p) || s.over) return;
  const bx = snap(lerp(p.prevX, p.x, a0));
  const by = snap(lerp(p.prevY, p.y, a0));
  const ult = (p.snUlt ?? 0) > 0;
  for (let i = 0; i < snOrbCount(p); i++) orbChain(ctx, s, bx, by, i, ult);
  if (ult) additive(ctx, () => glow(ctx, bx, by - 8, 18 + Math.sin(s.tick * 0.2) * 3, SN.pink, 0.25));
  if (p.s2Rush) {
    // 환혹의 스텝: 둘레를 도는 꽃잎
    additive(ctx, () => {
      for (let i = 0; i < 6; i++) {
        const a = s.tick * 0.5 + (i / 6) * Math.PI * 2;
        ctx.fillStyle = alpha(i % 2 ? SN.pink : SN.white, 0.8);
        ctx.beginPath();
        ctx.ellipse(bx + Math.cos(a) * 12, by - 8 + Math.sin(a) * 7, 3, 1.5, a, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
  for (const e of s.enemies) {
    if (e.hp <= 0 || !(e.snThorns || e.snNumb)) continue;
    const x = snap(lerp(e.prevX, e.x, a0));
    const y = snap(lerp(e.prevY, e.y, a0));
    const top = y - e.r - 9;
    // 가시 수: 머리 위 금빛 가시 (가득 차면 분홍)
    const k = e.snThorns ?? 0;
    for (let i = 0; i < k; i++) {
      const tx = x - (k - 1) * 1.5 + i * 3;
      ctx.fillStyle = (e.snNumb ?? 0) > 0 ? SN.pink : SN.gold;
      ctx.fillRect(Math.round(tx), top, 1, 3);
      ctx.fillRect(Math.round(tx) - 1, top + 2, 3, 1);
    }
    if ((e.snNumb ?? 0) > 0) {
      // 마비: 몸 둘레를 도는 분홍 별 고리
      additive(ctx, () => {
        ring(ctx, x, y - e.r * 0.5, e.r + 4, alpha(SN.pink, 0.4), 1);
        for (let i = 0; i < 3; i++) {
          const a = s.tick * 0.15 + (i / 3) * Math.PI * 2;
          ctx.fillStyle = SN.white;
          ctx.fillRect(Math.round(x + Math.cos(a) * (e.r + 4)), Math.round(y - e.r * 0.5 + Math.sin(a) * (e.r + 4) * 0.4), 1, 1);
        }
      });
    }
  }
}
