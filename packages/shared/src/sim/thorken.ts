// 토르켄(탈라시아): 닻 + 사슬로 이은 철구공. 처음 누르면 철구공을 던짐(떨어진 자리에 천둥)
// 그 뒤 누를 때마다 닻을 크게 휘두르고, 사슬 끝 철구공이 같이 휩쓸려 크게 돎 (sim/thorkenBall)
// 대시하면 철구공을 감아 들임 → 다시 던질 수 있음. 폭풍 게이지가 차면 다음 휘두르기에 태풍 + 천둥 (sim/thorkenStorm)
import { TICK_RATE } from "../constants";
import { THORKEN_PERKS as K } from "../itemsThorken";
import { THORKEN as T } from "../weaponsThorken";
import { inCone, roomKey, shoot } from "./s2Kit";
import { ballHits, sweepTick, startSweep } from "./thorkenBall";
import { addGauge, chainLen, lastFree, tkHit } from "./thorkenKit";
import { callStorm, landClap, stormTick } from "./thorkenStorm";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 철구공 던지기: 바라보는 쪽으로 사슬 끝까지 (벽·기둥에 부딪히면 그 앞에서 멈춤) */
function throwBall(s: RunState): void {
  const p = s.player;
  const L = chainLen(p);
  const dx = p.faceX;
  const dy = p.faceY;
  const [ax, ay] = lastFree(s, p.x, p.y, p.x + dx * L, p.y + dy * L);
  const at = { x: ax, y: ay };
  const d = Math.hypot(ax - p.x, ay - p.y);
  p.tkMode = 1;
  p.tkFly = { x0: p.x, y0: p.y, x1: at.x, y1: at.y, t: T.throwTicks };
  addEffect(s, { kind: "tkThrow", x: p.x, y: p.y, dirX: dx, dirY: dy, size: d, toX: at.x, toY: at.y, maxTicks: T.throwTicks, tint: p.weaponId });
}

/** 닻 휘두르기 (넓고 셈) + 바다의 삼지창 물살 */
function swingAnchor(s: RunState): void {
  const p = s.player;
  const hits = inCone(s, T.anchorReach, T.anchorArc);
  for (const e of hits) tkHit(s, e, p.stats.damage * T.anchorMul, T.anchorPush);
  addGauge(p, hits.length * T.gaugeAnchor);
  addEffect(s, { kind: "tkAnchor", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: T.anchorReach, maxTicks: 14, tint: String(p.tkDir ?? 1) });
  if (hasPerk(p, "tkTrident")) {
    const k = K.tkTrident;
    for (let i = 0; i < k.n; i++) shoot(s, (i - (k.n - 1) / 2) * k.spread, { damage: p.stats.damage * k.mul, spirit: "tkWater", r: 4, range: k.range, pierce: 2 });
  }
}

/** 방이 바뀌면 철구공은 손에 · 태풍·소용돌이는 사라짐 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.tkRoom === key) return;
  p.tkRoom = key;
  resetThorken(p, true);
}

/** 대시: 시작하면 철구공을 감아 들임 (돌아오는 길의 적을 때림) · 끝나면 순풍의 돛 */
function dashCheck(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  if (dashing && !p.tkDashing && (p.tkMode === 1 || p.tkMode === 2)) {
    addEffect(s, { kind: "tkReel", x: p.tkBx ?? p.x, y: p.tkBy ?? p.y, dirX: 0, dirY: 0, size: 8, toX: p.x, toY: p.y, maxTicks: T.reelTicks + 4 });
    p.tkMode = 3;
    p.tkRet = { t: T.reelTicks, hit: [] };
    delete p.tkFly;
    delete p.tkSweep;
  }
  if (!dashing && p.tkDashing && hasPerk(p, "tkSail")) p.tkSail = K.tkSail.ticks;
  p.tkDashing = dashing;
}

/** 감아 들이는 중: 철구공이 나에게 날아오며 지나는 적을 때림 */
function reelTick(s: RunState): void {
  const p = s.player;
  const r = p.tkRet;
  if (!r) {
    p.tkMode = 0;
    return;
  }
  const bx = p.tkBx ?? p.x;
  const by = p.tkBy ?? p.y;
  // 한 틱 사이도 빈틈 없이 (3번 나눠 확인)
  let n = 0;
  for (let k = 1; k <= 3; k++) {
    const u = k / 3 / r.t;
    n += ballHits(s, bx + (p.x - bx) * u, by + (p.y - by) * u, T.reelMul, r.hit);
  }
  addGauge(p, n * T.gaugeBall);
  p.tkBx = bx + (p.x - bx) / r.t;
  p.tkBy = by + (p.y - by) / r.t;
  r.t--;
  if (r.t > 0) return;
  p.tkMode = 0;
  delete p.tkRet;
}

/** 철구공이 날아가는 중 · 나가 있으면 내가 멀어질 때 끌려옴 · 감아 들이는 중 */
function ballTick(s: RunState): void {
  const p = s.player;
  if (p.tkMode === 3) return reelTick(s);
  const f = p.tkFly;
  if (p.tkMode === 1 && f) {
    f.t--;
    const k = 1 - f.t / T.throwTicks;
    p.tkBx = f.x0 + (f.x1 - f.x0) * k;
    p.tkBy = f.y0 + (f.y1 - f.y0) * k;
    if (f.t <= 0) {
      p.tkMode = 2;
      delete p.tkFly;
      landClap(s, f.x1, f.y1);
    }
    return;
  }
  if (p.tkMode !== 2 || p.tkSweep) {
    if (!p.tkMode) {
      p.tkBx = p.x;
      p.tkBy = p.y;
    }
    return;
  }
  const L = chainLen(p);
  const dx = (p.tkBx ?? p.x) - p.x;
  const dy = (p.tkBy ?? p.y) - p.y;
  const d = Math.hypot(dx, dy);
  if (d > L) {
    p.tkBx = p.x + (dx / d) * L;
    p.tkBy = p.y + (dy / d) * L;
  }
}

/** 틱마다 (닻을 들었을 때 player에서) */
export function thorkenTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  dashCheck(s);
  ballTick(s);
  sweepTick(s);
  stormTick(s);
  if (p.tkSail) p.tkSail--;
  if (!want || p.attackCooldown > 0 || p.tkMode === 1 || p.tkMode === 3) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  if (!p.tkMode) {
    throwBall(s);
    return;
  }
  if ((p.tkGauge ?? 0) >= T.gaugeMax) callStorm(s, p.tkBx ?? p.x, p.tkBy ?? p.y);
  swingAnchor(s);
  startSweep(s);
}

/** 연습장 등에서 다시 시작할 때 (keepRoom: 방 이름은 남김) */
export function resetThorken(p: PlayerState, keepRoom = false): void {
  for (const k of ["tkMode", "tkBx", "tkBy", "tkFly", "tkRet", "tkSweep", "tkDir", "tkSwings", "tkStorm", "tkWhirls", "tkDashing", "tkSail"] as const) delete p[k];
  if (!keepRoom) {
    delete p.tkRoom;
    delete p.tkGauge;
  }
}

export { isThorken, thorkenGauge } from "./thorkenKit";
