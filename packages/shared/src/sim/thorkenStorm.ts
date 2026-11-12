// 토르켄 태풍·천둥·소용돌이: 던진 철구공이 떨어진 자리 천둥 · 게이지가 차면 태풍(철구공을 따라 움직임) + 하늘에서 천둥
import { THORKEN_PERKS as K } from "../itemsThorken";
import { THORKEN as T } from "../weaponsThorken";
import { addGauge, pullTo, tkHit as tkHit_ } from "./thorkenKit";
import type { TkVortex } from "./thorkenTypes";
import { rot } from "./orbit";
import { alive, inCircle, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, dist2, hasPerk } from "./util";
import { srcFn, srcEach } from "./dmgSrc";
const tkHit = srcFn("thorkenStorm", () => tkHit_);

/** (x, y)에 천둥 한 번 (둘레 r · 기절) */
export function clap(s: RunState, x: number, y: number, r: number, dmg: number, stunT: number): number {
  const hits = inCircle(s, x, y, r);
  for (const e of hits) {
    tkHit(s, e, dmg, 6, "shock");
    stun(e, stunT);
  }
  addEffect(s, { kind: "tkClap", x, y, dirX: 0, dirY: 0, size: r, maxTicks: 22 });
  return hits.length;
}

/** 던진 철구공이 떨어짐: 물보라 + 천둥 (고래의 노래면 더 넓고 셈) */
export function landClap(s: RunState, x: number, y: number): void {
  const p = s.player;
  const whale = hasPerk(p, "tkWhale");
  const n = clap(s, x, y, T.clapR * (whale ? K.tkWhale.r : 1), p.stats.damage * T.clapMul * (whale ? K.tkWhale.mul : 1), T.clapStun);
  addGauge(p, T.gaugeClap + n * T.gaugeBall);
  addEffect(s, { kind: "tkSplash", x, y, dirX: 0, dirY: 0, size: T.clapR, maxTicks: 26 });
}

/** 게이지가 가득: 태풍을 (x, y)에 · 하늘에서 천둥 여러 번 (심해 진주 +) · 해방의 종 무적·탄 지우기 */
export function callStorm(s: RunState, x: number, y: number): void {
  const p = s.player;
  p.tkGauge = 0;
  const lh = hasPerk(p, "tkLighthouse");
  p.tkStorm = { x, y, t: Math.round(T.stormTicks * (lh ? K.tkLighthouse.ticks : 1)), cd: 0, r: T.stormR };
  addEffect(s, { kind: "tkStormCall", x, y, dirX: 0, dirY: 0, size: T.stormR, maxTicks: 30 });
  // 천둥: 태풍 둘레 가까운 적부터 (없으면 둘레 빈자리)
  const n = T.bolts + (hasPerk(p, "tkPearl") ? K.tkPearl.bolts : 0);
  const foes = alive(s).sort((a, b) => dist2(a, { x, y }) - dist2(b, { x, y }) || a.id - b.id);
  for (let i = 0; i < n; i++) {
    const e = foes.length > 0 ? foes[i % foes.length]! : null;
    const [c, sn] = rot(i * 1.257);
    const bx = e ? e.x : x + c * T.stormR * 0.7;
    const by = e ? e.y : y + sn * T.stormR * 0.7;
    addEffect(s, { kind: "tkBolt", x: bx, y: by, dirX: 0, dirY: 0, size: 14, maxTicks: 18 + i * 3 });
    if (e && e.hp > 0) {
      tkHit(s, e, p.stats.damage * T.boltMul, 0, "shock");
      stun(e, T.boltStun);
    }
  }
  if (hasPerk(p, "tkBell")) {
    p.invulnTicks = Math.max(p.invulnTicks, K.tkBell.invuln);
    s.projectiles = s.projectiles.filter((pr) => pr.fromPlayer || dist2(pr, p) > K.tkBell.r ** 2);
    addEffect(s, { kind: "tkBell", x: p.x, y: p.y, dirX: 0, dirY: 0, size: K.tkBell.r, maxTicks: 30 });
  }
}

/** 소용돌이·태풍 하나 틱: 끌어당기고 몇 틱마다 피해 */
function spin(s: RunState, v: TkVortex, pull: number, gap: number, dmg: number): void {
  v.t--;
  for (const e of inCircle(s, v.x, v.y, v.r)) pullTo(e, v.x, v.y, pull);
  if (v.cd > 0) {
    v.cd--;
    return;
  }
  v.cd = gap;
  for (const e of inCircle(s, v.x, v.y, v.r)) tkHit(s, e, dmg, 0, "storm");
}

/** 틱마다: 태풍은 철구공(없으면 나)을 따라 천천히 움직임 · 소용돌이 */
export function stormTick(s: RunState): void {
  const p = s.player;
  const st = p.tkStorm;
  if (st) {
    const tx = p.tkMode === 2 ? (p.tkBx ?? p.x) : p.x;
    const ty = p.tkMode === 2 ? (p.tkBy ?? p.y) : p.y;
    st.x += (tx - st.x) * 0.08;
    st.y += (ty - st.y) * 0.08;
    spin(s, st, T.stormPull * (hasPerk(p, "tkLighthouse") ? K.tkLighthouse.pull : 1), T.stormGap, p.stats.damage * T.stormMul);
    // 태풍 속에서는 50틱마다 천둥이 가장 튼튼한 적에게
    if (st.t % 50 === 25) {
      const e = inCircle(s, st.x, st.y, st.r).sort((a, b) => b.hp - a.hp || a.id - b.id)[0];
      if (e) {
        tkHit(s, e, p.stats.damage * T.boltMul * 0.5, 0, "shock");
        addEffect(s, { kind: "tkBolt", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 10, maxTicks: 16 });
      }
    }
    if (st.t <= 0) delete p.tkStorm;
  }
  if (p.tkWhirls) {
    for (const w of srcEach(p.tkWhirls)) spin(s, w, T.whirlPull, T.whirlGap, p.stats.damage * T.whirlMul);
    p.tkWhirls = p.tkWhirls.filter((w) => w.t > 0);
    if (p.tkWhirls.length === 0) delete p.tkWhirls;
  }
}

/** 소용돌이 하나 남김 (소용돌이 철구, 셋까지) */
export function addWhirl(s: RunState, x: number, y: number): void {
  const p = s.player;
  (p.tkWhirls ??= []).push({ x, y, t: T.whirlTicks, cd: 0, r: T.whirlR });
  if (p.tkWhirls.length > 3) p.tkWhirls.shift();
}
