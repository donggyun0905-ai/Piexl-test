// 아수라 기본 펀치와 공격마다 붙는 기술: 파동(부채꼴) · 연발(연속 펀치) · 육비 난무(날아가는 주먹) · 수라장 · 아수라 각성 굴리기
import { ASURA_PERKS as K } from "../itemsAsura";
import { ASURA_FIST as F } from "../weaponsAsura";
import { asArea, asHit, asRoll } from "./asHit";
import { fistSize, hasAs } from "./asKit";
import { startAwake } from "./asAwake";
import { alive } from "./shadowingSpirits";
import type { RunState } from "./types";
import { addEffect } from "./util";

/** 기본 펀치: 앞을 귀신 주먹으로 넓게 침 (귀신 걸음이면 이번만 2배) */
export function punch(s: RunState): void {
  const p = s.player;
  const k = fistSize(p) * (p.asStepBig ? K.asStep.size : 1);
  p.asStepBig = false;
  const x = p.x + p.faceX * F.reach * k;
  const y = p.y + p.faceY * F.reach * k;
  const r = F.r * k;
  const n = asArea(s, x, y, r, p.stats.damage * F.mul, { split: true, dx: p.faceX, dy: p.faceY });
  addEffect(s, { kind: "asPunch", x, y, dirX: p.faceX, dirY: p.faceY, size: r, style: (p.asHits ?? 0) % 3, maxTicks: 12 });
  afterAttack(s, x, y, k, n);
}

/** 공격 하나가 끝날 때마다 (기본 펀치·각성 공격 모두) */
export function afterAttack(s: RunState, x: number, y: number, size: number, hitN: number): void {
  const p = s.player;
  if (hitN > 0 && hasAs(p, "asFury")) {
    p.asFury = Math.min(K.asFury.max, (p.asFury ?? 0) + 1);
    p.asFuryAt = s.tick;
  }
  if (hasAs(p, "asWave")) (p.asWaves ??= []).push({ at: s.tick + K.asWave.delay, x, y, dx: p.faceX, dy: p.faceY, size });
  const barrage = hasAs(p, "asBarrage");
  if (hasAs(p, "asRapid") && asRoll(s, "asRapid") < (barrage ? K.asBarrage.chance : K.asRapid.chance)) {
    const n = barrage ? K.asBarrage.hits : K.asRapid.hits;
    const r = K.asRapid.r * size;
    (p.asRapids ??= []).push({ x, y, dx: p.faceX, dy: p.faceY, r, dmg: p.stats.damage * K.asRapid.mul, left: n, n });
    addEffect(s, { kind: "asRapid", x, y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: n });
  }
  if (hasAs(p, "asFlying")) launchFist(s);
  const chance = hasAs(p, "asSix") ? K.asSix.chance : K.asUlt.chance;
  if (hasAs(p, "asUlt") && !(p.asAwake ?? 0) && !s.pw && asRoll(s, "asUlt") < chance) startAwake(s);
}

/** 육비 난무: 가장 가까운 적 쪽으로 귀신 주먹 하나 */
function launchFist(s: RunState): void {
  const p = s.player;
  let best: { dx: number; dy: number; d: number } | null = null;
  for (const e of s.enemies) {
    if (!alive(e)) continue;
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > 0 && d <= K.asFlying.dist && (!best || d < best.d)) best = { dx: dx / d, dy: dy / d, d };
  }
  if (!best) return;
  (p.asFists ??= []).push({ x: p.x, y: p.y, dx: best.dx, dy: best.dy, age: 0, dmg: p.stats.damage * K.asFlying.mul });
}

/** 틱마다: 기다리는 파동 · 연속 펀치 · 날아가는 주먹 */
export function movesTick(s: RunState): void {
  const p = s.player;
  if (p.asWaves?.length) {
    for (const w of p.asWaves) {
      if (w.at > s.tick) continue;
      const press = hasAs(p, "asPress");
      const r = K.asWave.r * w.size;
      asArea(s, p.x, p.y, r, p.stats.damage * K.asWave.mul * (press ? K.asPress.mul : 1), { arc: K.asWave.arc, dx: w.dx, dy: w.dy, knock: press });
      addEffect(s, { kind: "asWave", x: p.x, y: p.y, dirX: w.dx, dirY: w.dy, size: r, maxTicks: 14 });
    }
    p.asWaves = p.asWaves.filter((w) => w.at > s.tick);
  }
  if (p.asRapids?.length) {
    for (const r of p.asRapids) {
      asArea(s, r.x, r.y, r.r, r.dmg, { dx: r.dx, dy: r.dy });
      r.left--;
    }
    p.asRapids = p.asRapids.filter((r) => r.left > 0);
  }
  if (p.asFists?.length) {
    const F2 = K.asFlying;
    p.asFists = p.asFists.filter((f) => {
      f.x += f.dx * F2.speed;
      f.y += f.dy * F2.speed;
      f.age++;
      const e = s.enemies.find((m) => alive(m) && (m.x - f.x) ** 2 + (m.y - f.y) ** 2 <= (m.r + F2.r) ** 2);
      if (e) {
        asHit(s, e, f.dmg, f.dx, f.dy);
        addEffect(s, { kind: "asFistHit", x: f.x, y: f.y, dirX: f.dx, dirY: f.dy, size: 14, maxTicks: 10 });
        return false;
      }
      return f.age < F2.life;
    });
  }
}
