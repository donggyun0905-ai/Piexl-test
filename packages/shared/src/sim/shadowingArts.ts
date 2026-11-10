// 쉐도잉 전용 패시브 20개 효과 (수치 itemsShadowing.SHADOWING_PERKS · 그림 줄 sdTypes.SD_ROW)
// 봉인(닫힌 원)·일필 베기(곧은 줄)·획을 마침·획이 사라짐·그리는 중·획에 닿음·처치·대시에 붙는 기술. 날개(대시 획)는 sim/shadowing
import { SHADOWING_PERKS as K } from "../itemsShadowing";
import { createRng, deriveSeed } from "../rng";
import { rot } from "./orbit";
import { SD_ROW as ROW, type InkStroke } from "./sdTypes";
import { centerOf, cornersOf, strokeLen } from "./shadowingShape";
import { addSpirit, addZone, inkArea, nearestFoe } from "./shadowingSpirits";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, normalize } from "./util";

type C = { x: number; y: number; r: number };
const dmgOf = (s: RunState) => s.player.stats.damage;
const turn = (d: readonly [number, number], a: number): [number, number] => {
  const v = rot(a);
  return [d[0] * v[0] - d[1] * v[1], d[0] * v[1] + d[1] * v[0]];
};

/** 가까운 적 쪽으로 쫓아가는 것 하나 (학·유령·혜성·나비) */
function homing(s: RunState, x: number, y: number, row: number, speed: number, dmg: number, burst?: number): void {
  const e = nearestFoe(s, x, y);
  const d = (e ? normalize(e.x - x, e.y - y) : null) ?? [s.player.faceX, s.player.faceY];
  addSpirit(s, { x, y, vx: d[0] * speed, vy: d[1] * speed, t: 150, dmg, r: 8, row, home: true, once: true, ...(burst ? { burst } : {}) });
}

/** 봉인(닫힌 원)을 마쳤을 때: 수묵 산수화 · 연꽃 · 얼음 가시 · 소용돌이 · 황금 문 · 유성 */
export function onSeal(s: RunState, k: InkStroke, c: C, meInside: boolean): void {
  const p = s.player;
  const dmg = dmgOf(s);
  const r = Math.max(24, c.r);
  if (hasPerk(p, "sdScroll")) addZone(s, { x: c.x, y: c.y, r: r * K.sdScroll.size, row: ROW.scroll, life: K.sdScroll.delay, dmg: dmg * K.sdScroll.mul });
  if (hasPerk(p, "sdLotus")) addZone(s, { x: c.x, y: c.y, r, row: ROW.lotus, life: K.sdLotus.ticks, every: K.sdLotus.every, dmg: dmg * K.sdLotus.mul, heal: K.sdLotus.heal });
  if (hasPerk(p, "sdFrost")) inkArea(s, c.x, c.y, K.sdFrost.r, dmg * K.sdFrost.mul, ROW.frost, { stun: 20 });
  if (hasPerk(p, "sdVortex")) addZone(s, { x: c.x, y: c.y, r: r + 12, row: ROW.vortex, life: K.sdVortex.ticks, dmg: 0, pull: K.sdVortex.pull });
  if (hasPerk(p, "sdGate") && meInside) p.sdGateT = K.sdGate.ticks;
  if (hasPerk(p, "sdMeteor") && c.r * 2 >= K.sdMeteor.size) {
    for (let i = 0; i < K.sdMeteor.n; i++) {
      const rng = createRng(deriveSeed(s.seed, "sdMeteor", s.tick, k.id, i));
      const v = rot(rng.nextFloat() * Math.PI * 2);
      const f = rng.nextFloat() * c.r * 0.6;
      addZone(s, { x: c.x + v[0] * f, y: c.y + v[1] * f, r: K.sdMeteor.r, row: ROW.meteor, life: K.sdMeteor.delay + i * 8, dmg: dmg * K.sdMeteor.mul });
    }
  }
}

/** 일필 베기(곧은 줄)를 마쳤을 때: 검기 · 벚꽃 물결 */
export function onSlash(s: RunState, x1: number, y1: number, x2: number, y2: number, d: readonly [number, number]): void {
  const p = s.player;
  const dmg = dmgOf(s);
  if (hasPerk(p, "sdSword")) {
    const w = K.sdSword;
    for (let i = 0; i < w.n; i++) {
      const v = turn(d, (i - (w.n - 1) / 2) * 0.22);
      addSpirit(s, { x: x2, y: y2, vx: v[0] * w.speed, vy: v[1] * w.speed, t: w.ticks, dmg: dmg * w.mul, r: 8, row: ROW.sword });
    }
  }
  if (hasPerk(p, "sdSakura")) {
    // 벚꽃 물결: 줄 위 세 자리에서 줄 방향으로 밀쳐 냄
    for (let i = 0; i < 3; i++) {
      const t = (i + 1) / 4;
      inkArea(s, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 22, dmg * K.sdSakura.mul / 3, ROW.sakura, { push: K.sdSakura.push });
    }
  }
}

/** 획을 마쳤을 때(모양과 상관없이): 학 · 달 · 별 · 용 */
export function onFinish(s: RunState, k: InkStroke): void {
  const p = s.player;
  if (k.pts.length < 4) return;
  const dmg = dmgOf(s);
  const lx = k.pts[k.pts.length - 2]!;
  const ly = k.pts[k.pts.length - 1]!;
  if (hasPerk(p, "sdCrane") && strokeLen(k.pts) >= K.sdCrane.minLen) homing(s, lx, ly, ROW.crane, K.sdCrane.speed, dmg * K.sdCrane.mul, K.sdCrane.r);
  if (hasPerk(p, "sdMoon") && (p.sdDone ?? 0) % K.sdMoon.every === 0) {
    const c = centerOf(k.pts);
    addZone(s, { x: c.x, y: c.y, r: K.sdMoon.r, row: ROW.moon, life: K.sdMoon.delay, dmg: dmg * K.sdMoon.mul });
  }
  if (hasPerk(p, "sdStar")) for (const [x, y] of cornersOf(k.pts, K.sdStar.bend, K.sdStar.max)) inkArea(s, x, y, K.sdStar.r, dmg * K.sdStar.mul, ROW.star);
  if (hasPerk(p, "sdDragon") && k.ink >= K.sdDragon.ink) addSpirit(s, { x: k.pts[0]!, y: k.pts[1]!, vx: 0, vy: 0, t: 999, dmg: dmg * K.sdDragon.mul, r: 14, row: ROW.dragon, path: [...k.pts], at: 0 });
}

/** 획이 사라질 때: 불기둥 */
export function onFade(s: RunState, k: InkStroke): void {
  if (!hasPerk(s.player, "sdFlame") || k.pts.length < 2) return;
  const f = K.sdFlame;
  const dmg = dmgOf(s) * f.mul;
  inkArea(s, k.pts[k.pts.length - 2]!, k.pts[k.pts.length - 1]!, f.r, dmg, ROW.flame, { burn: dmg * f.burn });
}

/** 그리는 동안 (d = 이번에 그린 길이): 나비 */
export function onDraw(s: RunState, x: number, y: number, d: number): void {
  const p = s.player;
  if (!hasPerk(p, "sdButterfly")) return;
  p.sdFly = (p.sdFly ?? 0) + d;
  while (p.sdFly >= K.sdButterfly.every) {
    p.sdFly -= K.sdButterfly.every;
    homing(s, x, y, ROW.butterfly, K.sdButterfly.speed, dmgOf(s) * K.sdButterfly.mul);
  }
}

/** 획에 닿은 적: 얼음 결정(느려짐) */
export function strokeTouch(s: RunState, e: EnemyState): void {
  if (hasPerk(s.player, "sdFrost")) e.slowTicks = Math.max(e.slowTicks ?? 0, K.sdFrost.slow);
}

/** 붓 그림으로 처치: 유령 */
export function onKill(s: RunState, e: EnemyState): void {
  if (hasPerk(s.player, "sdGhost")) homing(s, e.x, e.y, ROW.ghost, K.sdGhost.speed, dmgOf(s) * K.sdGhost.mul);
}

/** 틱마다: 시계(잉크를 다 쓰면) · 황금 문 시간 · 혜성(대시) */
export function artsTick(s: RunState): void {
  const p = s.player;
  if ((p.sdGateT ?? 0) > 0) p.sdGateT = (p.sdGateT ?? 0) - 1;
  if ((p.sdClockT ?? 0) > 0) p.sdClockT = (p.sdClockT ?? 0) - 1;
  if ((p.sdClockCd ?? 0) > 0) p.sdClockCd = (p.sdClockCd ?? 0) - 1;
  if ((p.sdCometCd ?? 0) > 0) p.sdCometCd = (p.sdCometCd ?? 0) - 1;
  if (hasPerk(p, "sdClock") && (p.sdInk ?? 100) < 1 && (p.sdClockCd ?? 0) <= 0) {
    p.sdClockT = K.sdClock.ticks;
    p.sdClockCd = K.sdClock.cool;
    addEffect(s, { kind: "sdBurst", x: p.x, y: p.y - 10, dirX: 0, dirY: 0, size: 30, style: ROW.clock, maxTicks: K.sdClock.ticks });
  }
  const dashing = p.dashTicks > 0;
  const start = dashing && !p.sdDash;
  p.sdDash = dashing;
  if (start && hasPerk(p, "sdComet") && (p.sdCometCd ?? 0) <= 0) {
    p.sdCometCd = K.sdComet.cool;
    homing(s, p.sdBx ?? p.x, p.sdBy ?? p.y, ROW.comet, K.sdComet.speed, dmgOf(s) * K.sdComet.mul);
  }
}
