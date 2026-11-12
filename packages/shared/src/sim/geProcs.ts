// 기어스 공격: 쌍방패 강타(쌍성 방패면 크고 여러 번) · 공격마다 확률 기술 (대지 분쇄·방패 던지기·연속 방패타·천상의 수호자·청뢰 방패 폭풍) · 메아리 방패
// 던진 방패 날아가기 · 위성 방패 · 천상의 수호자 방패에 부딪힌 적 60번 (나눠 때리기는 geHit.seqTick)
import { GE_PERKS as K } from "../itemsGears";
import { GE_ATTACK as A } from "../weaponsGears";
import { srcEach, srcRun } from "./dmgSrc";
import { front, geArea, geSeq, geStrike } from "./geHit";
import { geRoll, geSize, hasGe } from "./geKit";
import { rot } from "./orbit";
import { alive } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, dist2 } from "./util";

/** 기본 공격 한 번: 앞을 두 방패로 강타 (나눠 때림) · 그 뒤 확률 기술 */
export function slam(s: RunState): void {
  const p = s.player;
  const twin = hasGe(p, "geTwin");
  const k = geSize(p) * (twin ? K.geTwin.size : 1);
  const [x, y] = front(s, A.reach * k);
  const r = A.r * k;
  const dmg = p.stats.damage * A.mul;
  const go = () => geSeq(s, { x, y, r, left: twin ? K.geTwin.hits : A.hits, gap: A.gap, t: 0, dmg });
  if (twin) srcRun(s, "geTwin", go);
  else go();
  addEffect(s, { kind: twin ? "geTwin" : "geSlam", x, y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 18 });
  if (hasGe(p, "geEcho")) srcRun(s, "geEcho", () => geSeq(s, { x, y, r, left: 1, gap: 1, t: K.geEcho.delay, dmg: dmg * K.geEcho.mul, fx: "geEcho" }));
  procs(s);
}

/** 공격마다 확률 기술 */
function procs(s: RunState): void {
  const p = s.player;
  const dmg = p.stats.damage;
  const k = geSize(p);
  if (hasGe(p, "geBarrage") && geRoll(s, "geBarrage") < K.geBarrage.chance) srcRun(s, "geBarrage", () => {
    const B = K.geBarrage;
    const [x, y] = front(s, A.reach * k);
    geSeq(s, { x, y, r: B.r * k, left: B.hits, gap: B.gap, t: 2, dmg: dmg * B.mul });
    addEffect(s, { kind: "geBarrage", x, y, dirX: p.faceX, dirY: p.faceY, size: B.r * k, maxTicks: B.hits * B.gap + 6 });
  });
  if (hasGe(p, "geQuake") && geRoll(s, "geQuake") < K.geQuake.chance) srcRun(s, "geQuake", () => {
    const Q = K.geQuake;
    const [x, y] = front(s, Q.reach * k);
    geSeq(s, { x, y, r: Q.r * k, left: Q.hits, gap: Q.gap, t: 4, dmg: dmg * Q.mul, stun: Q.stun });
    addEffect(s, { kind: "geQuake", x, y, dirX: p.faceX, dirY: p.faceY, size: Q.r * k, maxTicks: Q.hits * Q.gap + 8 });
  });
  if (hasGe(p, "geThrow") && geRoll(s, "geThrow") < K.geThrow.chance) srcRun(s, "geThrow", () => {
    (p.geThrows ??= []).push({ x: p.x, y: p.y, dx: p.faceX, dy: p.faceY, age: 0, dmg: dmg * K.geThrow.mul, hit: [] });
  });
  if (hasGe(p, "geStorm") && geRoll(s, "geStorm") < K.geStorm.chance) srcRun(s, "geStorm", () => {
    const S = K.geStorm;
    geSeq(s, { x: p.x, y: p.y, r: S.r * k, left: S.hits, gap: S.gap, t: 6, dmg: dmg * S.mul });
    addEffect(s, { kind: "geStorm", x: p.x, y: p.y, dirX: 0, dirY: 0, size: S.r * k, maxTicks: S.hits * S.gap + 10 });
  });
  if (hasGe(p, "geGuardian") && (p.geGuard ?? 0) <= 0 && geRoll(s, "geGuardian") < K.geGuardian.chance) {
    p.geGuard = K.geGuardian.ticks;
    p.geGuardAt = s.tick;
  }
}

/** 던진 방패: 뚫고 지나가며 한 번씩 · 끝에서 터짐 */
export function throwTick(s: RunState): void {
  const p = s.player;
  if (!p.geThrows?.length) return;
  const T = K.geThrow;
  const k = geSize(p);
  for (const t of srcEach(p.geThrows)) {
    t.age++;
    t.x += t.dx * T.speed;
    t.y += t.dy * T.speed;
    for (const e of alive(s)) {
      if (t.hit.includes(e.id) || dist2(e, t) > (T.r * k + e.r) ** 2) continue;
      t.hit.push(e.id);
      geStrike(s, e, t.dmg, t.x - t.dx, t.y - t.dy);
    }
    if (t.age >= T.life * k) {
      geArea(s, t.x, t.y, T.boomR * k, p.stats.damage * T.boomMul);
      addEffect(s, { kind: "geBoom", x: t.x, y: t.y, dirX: t.dx, dirY: t.dy, size: T.boomR * k, maxTicks: 16 });
    }
  }
  p.geThrows = p.geThrows.filter((t) => t.age < T.life * k);
}

/** 위성 방패 자리 (i번째, 이번 틱) */
export function orbitAt(s: RunState, i: number): [number, number] {
  const p = s.player;
  const O = K.geOrbit;
  const v = rot(((s.tick % O.turn) / O.turn) * Math.PI * 2 + (i * Math.PI * 2) / O.n);
  const r = O.r * geSize(p);
  return [p.x + v[0] * r, p.y + v[1] * r];
}

/** 위성 방패: 닿은 적을 때림 (같은 적은 잠시 뒤에 다시) */
export function orbitTick(s: RunState): void {
  const p = s.player;
  if (!hasGe(p, "geOrbit")) return;
  const O = K.geOrbit;
  srcRun(s, "geOrbit", () => {
    for (let i = 0; i < O.n; i++) {
      const [x, y] = orbitAt(s, i);
      for (const e of alive(s)) {
        if ((e.geOrbHit ?? -999) > s.tick - O.again || dist2(e, { x, y }) > (O.size + e.r) ** 2) continue;
        e.geOrbHit = s.tick;
        geStrike(s, e, p.stats.damage * O.mul, x, y);
      }
    }
  });
}

/** 천상의 수호자: 앞 방패에 부딪힌 적마다 60번 나눠 때림 (이미 맞는 중인 적은 빼고) */
export function guardTick(s: RunState): void {
  const p = s.player;
  if ((p.geGuard ?? 0) <= 0) return;
  p.geGuard!--;
  const G = K.geGuardian;
  const k = geSize(p);
  const [x, y] = front(s, G.reach * k);
  srcRun(s, "geGuardian", () => {
    for (const e of alive(s)) {
      if (dist2(e, { x, y }) > (G.r * k + e.r) ** 2) continue;
      if (p.geSeqs?.some((q) => q.id === e.id)) continue;
      geSeq(s, { x, y, r: 0, left: G.hits, gap: 1, t: 0, dmg: p.stats.damage * G.mul, id: e.id });
    }
  });
}
