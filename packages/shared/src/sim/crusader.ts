// 크루세이더(새벽의 성흔, 성십자가의 거인 · 탱커): 누르면 십자가를 머리 위로 들어 올림 (버팀: 받는 피해 감소 · 느리게 걸음)
// → 앞 땅을 내리찍음 (찍은 자리 둘레 피해·기절) → 땅이 십자가 모양으로 갈라져 나감 (앞 긴 팔 · 양옆 · 뒤, 마디마다 차례로 돌판이 솟음)
// 속죄의 무게 (받은 피해·맞힌 적) 가득 → 그 내려찍기에 하늘에서 심판의 십자가 · 대시는 성벽 돌진 (sim/crusaderRam)
// 성흔이 가득 차면 성십자가 강림: 거인화 (받는 피해 감소 · 내려찍을 때마다 심판의 십자가 · 걸으면 땅이 울림). 수치 weaponsCrusader.CRUSADER · 아이템 itemsCrusader
import { srcRun, srcFn } from "./dmgSrc";
import { TICK_RATE } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { CRUSADER_PERKS as K } from "../itemsCrusader";
import { CRUSADER as C } from "../weaponsCrusader";
import { addCrack, addWeight, addZone, cracksTick as cracksTick_, crHits as crHits_, crStrike as crStrike_, dropJudge, haloTick as haloTick_, throwHalo, weightFull, zonesTick as zonesTick_ } from "./crusaderKit";
import { ramTick } from "./crusaderRam";
import { alive, inCircle, roomKey, stun } from "./s2Kit";
import { isAwake, stigmaTick } from "./stigma";
import type { RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";
const cracksTick = srcFn("crusader", () => cracksTick_), crHits = srcFn("crusader", () => crHits_), crStrike = srcFn("crusader", () => crStrike_), haloTick = srcFn("crusader", () => haloTick_), zonesTick = srcFn("crusader", () => zonesTick_);

/** 내려찍기: 앞 땅 둘레 피해·기절 · 십자 균열 · 무게 가득(또는 강림 중)이면 심판의 십자가 · 여진 · 가시 후광 */
function slam(s: RunState): void {
  const p = s.player;
  const rm = reachOf(p);
  const x = p.x + p.faceX * C.slamFwd * rm;
  const y = p.y + p.faceY * C.slamFwd * rm;
  const r = C.slamR * rm;
  const heavy = hasPerk(p, "crHeavy") ? K.crHeavy.mul : 1;
  const hit = inCircle(s, x, y, r);
  for (const e of hit) {
    crStrike(s, e, C.slamMul * heavy, C.slamPush);
    stun(e, C.slamStun);
  }
  const more = hasPerk(p, "crLong") ? K.crLong.more : 0;
  addCrack(p, { x, y, dx: p.faceX, dy: p.faceY, n: [C.armLong + more, C.armSide + more, C.armSide + more, C.armBack], mul: C.segMul * heavy, hit: hit.map((e) => e.id), pillar: hasPerk(p, "crPillar") });
  addEffect(s, { kind: "crSlamFx", x, y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 30 });
  addWeight(p, hit.length * C.weightPerHit);
  crHits(s, hit.length);
  if (isAwake(p) || weightFull(p)) {
    dropJudge(p, x + p.faceX * C.segLen * rm, y + p.faceY * C.segLen * rm);
    if (!isAwake(p)) p.crWeight = 0;
  }
  if (hasPerk(p, "crAfter")) addZone(p, { k: 0, x, y, t: K.crAfter.delay, r: r * K.crAfter.r, mul: K.crAfter.mul * heavy });
  p.crSlams = (p.crSlams ?? 0) + 1;
  if (hasPerk(p, "crHalo") && p.crSlams % K.crHalo.every === 0 && !p.crHalo) throwHalo(p);
  p.crLast = s.tick;
}

/** 강림 중: 걸으면 거인의 발걸음 · 십자가 비 */
function awakeTick(s: RunState): void {
  const p = s.player;
  if (!isAwake(p)) return;
  const giant = hasPerk(p, "crGiant");
  if (p.x !== p.prevX || p.y !== p.prevY) {
    p.crStep = (p.crStep ?? C.stepEvery) - 1;
    if (p.crStep <= 0) {
      p.crStep = C.stepEvery;
      const r = C.stepR * reachOf(p) * (giant ? K.crGiant.r : 1);
      const hit = inCircle(s, p.x, p.y, r);
      for (const e of hit) crStrike(s, e, C.stepMul, 3);
      crHits(s, hit.length);
      addEffect(s, { kind: "crStepFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 18 });
    }
  }
  if (!hasPerk(p, "crRain")) return; return srcRun(s, "crRain", () => {
  p.crRainT = (p.crRainT ?? K.crRain.every) - 1;
  if (p.crRainT > 0) return;
  p.crRainT = K.crRain.every;
  const reach = K.crRain.reach * reachOf(p);
  const near = alive(s).filter((e) => (e.x - p.x) ** 2 + (e.y - p.y) ** 2 <= reach * reach);
  const e = near[Math.floor(createRng(deriveSeed(s.seed, "crRain", s.tick)).nextFloat() * near.length)];
  if (e) addZone(p, { k: 3, x: e.x, y: e.y, t: Math.round(C.judgeFall * 0.75), r: K.crRain.r * reachOf(p), mul: K.crRain.mul });
}); }

/** 틱마다 (성십자가를 들었을 때 player에서) */
export function crusaderTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if (p.crRoom !== roomKey(s)) {
    for (const k of ["crCracks", "crZones", "crHalo", "crRam", "crWind", "crWindMax"] as const) delete p[k];
    p.crRoom = roomKey(s);
  }
  // 깎인 체력만큼 무게
  if (p.crHp !== undefined && p.hp < p.crHp) addWeight(p, (p.crHp - p.hp) * C.weightPerHp);
  p.crHp = p.hp;
  if ((p.crThornCd ?? 0) > 0) p.crThornCd!--;
  stigmaTick(p);
  cracksTick(s);
  zonesTick(s);
  haloTick(s);
  ramTick(s);
  awakeTick(s);
  // 대시하면 들어 올리던 것을 내려놓음
  if (p.dashTicks > 0 || p.s2Rush) {
    delete p.crWind;
    delete p.crWindMax;
    return;
  }
  const cycle = TICK_RATE / speed;
  if (p.crWind) {
    if (--p.crWind > 0) return;
    delete p.crWind;
    delete p.crWindMax;
    p.attackCount++;
    slam(s);
    p.attackCooldown = Math.max(1, Math.round(cycle * C.recoverT));
    return;
  }
  if (!want || p.attackCooldown > 0) return;
  p.crWind = p.crWindMax = Math.max(1, Math.round(cycle * C.windT * (hasPerk(p, "crQuick") ? K.crQuick.time : 1)));
  addEffect(s, { kind: "crLiftFx", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: p.crWind, maxTicks: p.crWind, follow: true });
}

/** 연습장 등에서 다시 시작할 때 */
export function resetCrusader(p: RunState["player"]): void {
  for (const k of ["sgGauge", "sgAwake", "sgAwakeMax", "crWind", "crWindMax", "crSlams", "crLast", "crWeight", "crHp", "crThornCd", "crCracks", "crZones", "crHalo", "crRam", "crStep", "crRainT", "crRoom"] as const) delete p[k];
}

export { crusaderMoveMul, crusaderHurt, crusaderTaken, isCrusader } from "./crusaderKit";
