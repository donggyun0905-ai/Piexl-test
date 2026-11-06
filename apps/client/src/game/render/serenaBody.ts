// 세레나 그리기 (몸 둘레). 몸 뒤: 환혹의 무도 중 발밑에서 천천히 도는 꽃
// 몸 위: 몸 둘레를 자유롭게 날아다니는 비수와 뒤따르는 사슬 (몸과 이어져 있지 않음) · 환혹의 무도 중 분홍 눈가루 · 환혹의 스텝 중 꽃잎
// 가시가 박힌 적(머리 위 금빛 가시 수) · 마비된 적(분홍 별 고리) · 매혹된 적(머리 위 하트 · 나에게 이어진 분홍 실)
import { isSerena, SERENA, snOrbAt, snOrbCount, snOrbRadius, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, ring, type Ctx } from "./pwFxBits";
import { chainPath, flyingChain, hash, onTilt, petal, SN, type Pt } from "./serenaArt";
import { DASH_LINK, DASH_TILT } from "./serenaFx";

/** 날아다니는 비수 하나: 지금 자리부터 지나온 자리까지 사슬이 따라옴 */
function flying(ctx: Ctx, s: RunState, bx: number, by: number, i: number, ult: boolean): void {
  const p = s.player;
  const path: Pt[] = [];
  for (let k = 0; k <= 22; k++) {
    const [x, y] = snOrbAt(p, s.tick - k, i);
    path.push([bx + (x - p.x), by - 6 + (y - p.y) * 0.6]);
  }
  flyingChain(ctx, path, 0.95, ult ? SN.pink : i % 2 ? SN.ether : SN.light);
}

/** 발밑 꽃: 바깥 꽃잎은 도는 사슬이 따라가는 테두리와 같은 크기·각도 (SERENA.ultPetals·ultPetalSpin) · 안쪽 꽃잎은 반대로 돌며 피었다 오므렸다 함 */
function flower(ctx: Ctx, x: number, y: number, r: number, t: number, al: number): void {
  additive(ctx, () => {
    const breathe = 0.85 + 0.15 * Math.sin(t * 0.08);
    const n = SERENA.ultPetals;
    for (let i = 0; i < n; i++) petal(ctx, x, y, t * SERENA.ultPetalSpin + (i / n) * Math.PI * 2, r, r * 0.42, SN.pink, 0.2 * al);
    for (let i = 0; i < 8; i++) petal(ctx, x, y, -t * 0.03 + ((i + 0.5) / 8) * Math.PI * 2, r * 0.45 * breathe, r * 0.18, SN.white, 0.2 * al);
    glow(ctx, x, y, r * 0.3, SN.gold, 0.35 * al);
  });
}

/** 몸 뒤 */
export function drawSerenaBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isSerena(p) || s.over || !(p.snUlt ?? 0)) return;
  const al = Math.min(1, p.snUlt! / 30);
  flower(ctx, snap(lerp(p.prevX, p.x, a0)), snap(lerp(p.prevY, p.y, a0)) - 6, snOrbRadius(p), s.tick, al);
}

/** 분홍 눈가루: 아주 작은 점이 둘레에서 반짝이며 천천히 내려앉음 */
function snow(ctx: Ctx, x: number, y: number, t: number): void {
  additive(ctx, () => {
    for (let i = 0; i < 40; i++) {
      const life = 90;
      const born = Math.floor((t + i * 37) / life);
      const u = ((t + i * 37) % life) / life;
      const seed = i * 13 + born * 7;
      const px = x + (hash(seed) - 0.5) * 150 + Math.sin(u * 6 + i) * 4;
      const py = y - 50 + hash(seed + 1) * 40 + u * 50;
      const tw = (t + i * 5) % 12 < 2 ? 1 : 0.6;
      ctx.fillStyle = alpha(i % 4 === 0 ? SN.white : SN.pink, tw * (1 - u) * 0.9);
      ctx.fillRect(Math.round(px), Math.round(py), 1, 1);
    }
  });
}

/** 환혹의 스텝 돌진마다: 몸 둘레를 기울어진 고리(1번 / · 2번 - · 3번 \\)를 따라 비수 사슬이 휘돎 · 사슬 색은 연한 회색 · 노랑 · 분홍 */
function dashRing(ctx: Ctx, s: RunState, x: number, y: number, k: number): void {
  const rush = s.player.s2Rush!;
  const tilt = DASH_TILT[k] ?? 0;
  const link = DASH_LINK[k] ?? SN.steel;
  const r = SERENA.stepSpinR;
  const u = 1 - rush.t / SERENA.stepTicks;
  const th = Math.atan2(rush.dy, rush.dx) + u * Math.PI * 2.4;
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (const [w, al] of [[6, 0.2], [2, 0.55]] as const) {
      ctx.strokeStyle = alpha(link, al);
      ctx.lineWidth = w;
      ctx.beginPath();
      for (let j = 0; j <= 30; j++) {
        const [px, py] = onTilt(x, y, r, tilt, th - j * 0.09);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  });
  const trail: Pt[] = [];
  for (let j = 0; j <= 20; j++) trail.push(onTilt(x, y, r, tilt, th - j * 0.11));
  flyingChain(ctx, trail, 1, link, link);
}

/** 몸 위 */
export function drawSerenaAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isSerena(p) || s.over) return;
  const bx = snap(lerp(p.prevX, p.x, a0));
  const by = snap(lerp(p.prevY, p.y, a0));
  const ult = (p.snUlt ?? 0) > 0;
  for (let i = 0; i < snOrbCount(p); i++) flying(ctx, s, bx, by, i, ult);
  if (ult) {
    snow(ctx, bx, by, s.tick);
    additive(ctx, () => glow(ctx, bx, by - 8, 16 + Math.sin(s.tick * 0.2) * 3, SN.pink, 0.22));
  }
  if (p.s2Rush && p.snDashK !== undefined) dashRing(ctx, s, bx, by - 8, p.snDashK);
  for (const e of s.enemies) {
    if (e.hp <= 0 || !(e.snThorns || e.snNumb || e.snCharm)) continue;
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
    if ((e.snCharm ?? 0) > 0) {
      // 매혹: 머리 위에서 콩닥이는 하트 · 나에게 이어진 분홍 실
      const hy = top - 6 - ((s.tick >> 4) % 2);
      ctx.fillStyle = SN.rose;
      ctx.fillRect(x - 2, hy, 2, 2);
      ctx.fillRect(x + 1, hy, 2, 2);
      ctx.fillRect(x - 2, hy + 1, 5, 2);
      ctx.fillRect(x - 1, hy + 3, 3, 1);
      ctx.fillRect(x, hy + 4, 1, 1);
      // 나에게 이어진 분홍 사슬 (살랑이며 끌어당김)
      const pts: Pt[] = [];
      const sway = Math.sin(s.tick * 0.12 + e.id) * 8;
      for (let j = 0; j <= 12; j++) {
        const u = j / 12;
        pts.push([x + (bx - x) * u, y - e.r + (by - 8 - y + e.r) * u - Math.sin(u * Math.PI) * (14 + sway)]);
      }
      chainPath(ctx, pts, 0.7, SN.pink, false, SN.pink);
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
