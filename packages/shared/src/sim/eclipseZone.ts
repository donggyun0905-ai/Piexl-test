// 이클립스 틱마다 도는 것: 맞힘(게이지) · 날아가는 검격 · 블랙홀 · 그림자 돌진 · 영역(이글거리는 영역 + 치유의 빛 / 죽음의 영역)
import { srcRun, srcFn } from "./dmgSrc";
import { ECLIPSE_PERKS as K } from "../itemsEclipse";
import { ECLIPSE as E } from "../weaponsEclipse";
import { heal } from "./heal";
import { alive, inCircle, isBoss, onSegment, strike as strike_ } from "./s2Kit";
import { eclipseDmgMul, zoneR } from "./eclipseStats";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, roomGrid } from "./util";
const strike = srcFn("eclipseZone", () => strike_);

/** 지금 모습의 공격력 */
export const eclipsePower = (p: PlayerState) => p.stats.damage * eclipseDmgMul(p);

/** 맞힘: 게이지가 참 (바뀌는 중에는 안 참) · 쓰러뜨리면 더 */
export function ecHit(s: RunState, e: EnemyState, dmg: number, push = 0, gain = true): void {
  const p = s.player;
  const was = e.hp > 0;
  strike(s, e, dmg, push);
  addEffect(s, { kind: "ecSpark", x: e.x, y: e.y, dirX: p.faceX, dirY: p.faceY, size: p.ecNight ? 10 : 6, maxTicks: p.ecNight ? 14 : 9, width: p.ecNight ? 1 : 0 });
  if (!gain || p.ecShift) return;
  const mul = hasPerk(p, "ecTwilight") ? K.ecTwilight.gain : 1;
  const add = (p.ecNight ? E.nightGain : E.sunGain) + (was && e.hp <= 0 ? E.killGain : 0);
  p.ecGauge = Math.min(E.gaugeMax, (p.ecGauge ?? 0) + add * mul);
}

/** 날아가는 검격: 지나온 줄의 적을 한 번씩 맞힘 */
function cutTick(s: RunState): void {
  const p = s.player;
  if (!p.ecCuts?.length) return;
  for (const c of p.ecCuts) {
    const ax = c.x;
    const ay = c.y;
    c.x += c.dx * c.sp;
    c.y += c.dy * c.sp;
    c.t--;
    for (const e of onSegment(s, ax, ay, c.x, c.y, c.w)) {
      if (c.hit.includes(e.id)) continue;
      c.hit.push(e.id);
      ecHit(s, e, c.dmg, c.sun ? 1 : 4);
    }
  }
  p.ecCuts = p.ecCuts.filter((c) => c.t > 0);
}

/** 블랙홀: 둘레 적을 가운데로 끌어당기고 사이마다 가운데 적을 벰 */
function holeTick(s: RunState): void {
  const p = s.player;
  if (!p.ecHoles?.length) return;
  const g = roomGrid(s);
  for (const h of p.ecHoles) {
    h.t--;
    const hitNow = h.t % E.holeEvery === 0;
    for (const e of alive(s)) {
      const dx = h.x - e.x;
      const dy = h.y - e.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > (h.pull + e.r) ** 2) continue;
      const d = Math.sqrt(d2);
      if (!isBoss(e) && d > 3) {
        const step = Math.min(d - 2, E.holeStep * (hasPerk(p, "ecHorizon") ? K.ecHorizon.size : 1));
        e.x += (dx / d) * step;
        e.y += (dy / d) * step;
        keepInRoom(e, g);
      }
      if (hitNow && d <= h.r + e.r) ecHit(s, e, h.dmg, 0, false);
    }
  }
  p.ecHoles = p.ecHoles.filter((h) => h.t > 0);
}

/** 그림자 돌진: 나아가며 닿은 적을 한 번씩 맞힘 */
function rushTick(s: RunState): void {
  const p = s.player;
  const r = p.ecRush;
  if (!r) return;
  const ax = p.x;
  const ay = p.y;
  p.x += r.dx * E.rushStep;
  p.y += r.dy * E.rushStep;
  keepInRoom(p, roomGrid(s));
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  for (const e of onSegment(s, ax, ay, p.x, p.y, p.r + 12)) {
    if (r.hit.includes(e.id)) continue;
    r.hit.push(e.id);
    ecHit(s, e, r.dmg, 6);
  }
  if (--r.t > 0) return;
  // 지나온 줄 전체에 날 자국 하나
  addEffect(s, { kind: "ecDash", x: r.sx ?? ax, y: r.sy ?? ay, dirX: r.dx, dirY: r.dy, size: 14, toX: p.x, toY: p.y, maxTicks: 18 });
  delete p.ecRush;
}

/** 영역: 태양은 불태우고 몸에서 치유의 빛 · 일식은 죽음의 영역 (피해 + 둔화) */
function zoneTick(s: RunState): void {
  const p = s.player;
  const night = !!p.ecNight;
  const r = zoneR(p);
  if (s.tick % (night ? E.nightEvery : E.sunEvery) === 0) {
    const umbra = night && hasPerk(p, "ecUmbra");
    const dmg = eclipsePower(p) * (night ? E.nightBurn * (umbra ? K.ecUmbra.dmg : 1) : E.sunBurn);
    for (const e of inCircle(s, p.x, p.y, r)) {
      ecHit(s, e, dmg, 0, false);
      if (night && !isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, Math.round(E.slow * (umbra ? K.ecUmbra.slow : 1)));
      addEffect(s, { kind: "ecBurn", x: e.x, y: e.y, dirX: 0, dirY: -1, size: 6, maxTicks: 16, width: night ? 1 : 0 });
    }
  }
  if (!night && s.tick % E.healEvery === 0 && p.hp < p.stats.maxHp) {
    heal(s, p.stats.maxHp * E.heal * (hasPerk(p, "ecDawn") ? K.ecDawn.heal : 1));
    addEffect(s, { kind: "ecHeal", x: p.x, y: p.y, dirX: 0, dirY: -1, size: 12, maxTicks: 30, follow: true });
  }
}

/** 모습이 바뀌는 순간 (개기일식: 둘레 적에게 큰 피해) */
export function totality(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "ecTotality")) return; return srcRun(s, "ecTotality", () => {
  const k = K.ecTotality;
  for (const e of inCircle(s, p.x, p.y, k.r)) {
    ecHit(s, e, eclipsePower(p) * k.mul, 8, false);
    if (!isBoss(e) && e.kind !== "dummy") e.stunTicks = Math.max(e.stunTicks ?? 0, k.stun);
  }
  addEffect(s, { kind: "ecTotal", x: p.x, y: p.y, dirX: 0, dirY: 0, size: k.r, maxTicks: 30, width: p.ecNight ? 1 : 0 });
}); }

export function eclipseWorld(s: RunState): void {
  cutTick(s);
  holeTick(s);
  rushTick(s);
  zoneTick(s);
}
