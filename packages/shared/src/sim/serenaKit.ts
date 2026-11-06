// 세레나 공용 도우미: 맞히기(빛 피해 추가 · 가시) · 가시·마비 · 도는 사슬 채찍 자리 · 받는 피해 · 처치 · 스킬 대기
import { SERENA_PERKS as K } from "../itemsSerena";
import { SERENA as N } from "../weaponsSerena";
import { rot } from "./orbit";
import { inCircle, isBoss, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

const TAU = Math.PI * 2;

export const isSerena = (p: PlayerState) => p.characterId === "serena";

/** 가시 최대 개수 */
const thornCap = (p: PlayerState) => N.thornMax + (hasPerk(p, "snThorn") ? K.snThorn.more : 0);

/** 가시 n개 박음 → 가득 차면 마비 (보스는 느려지지 않고 받는 피해만) */
export function addThorns(s: RunState, e: EnemyState, n: number): void {
  const p = s.player;
  if (e.hp <= 0 || n <= 0) return;
  const cap = thornCap(p);
  const was = e.snThorns ?? 0;
  e.snThorns = Math.min(cap, was + n);
  e.snThornT = N.thornTicks;
  e.snThornAt ??= s.tick + N.thornEvery;
  if (e.snThorns < cap || was >= cap) return;
  const t = Math.round(N.numbTicks * (hasPerk(p, "snNumb") ? K.snNumb.mul : 1));
  e.snNumb = Math.max(e.snNumb ?? 0, t);
  if (!isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, t);
  addEffect(s, { kind: "snNumbFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 6, maxTicks: 24 });
}

/** 한 번 맞힘: 공격력 배율 mul (치명타는 combat에서) + 빛 피해 추가 + 가시 */
export function snHit(s: RunState, e: EnemyState, mul: number, thorns = 1, push = 0): void {
  const p = s.player;
  if (e.hp <= 0) return;
  const mirage = (p.snMirage ?? 0) > 0 ? K.snMirage.mul : 1;
  const dmg = p.stats.damage * mul * mirage;
  strike(s, e, dmg, push);
  if (e.hp > 0) strike(s, e, dmg * N.lightMul * (hasPerk(p, "snEther") ? K.snEther.mul : 1), 0, "radiance");
  addThorns(s, e, thorns);
}

/** 가시: 시간마다 가시 수만큼 피해 · 시간이 지나면 빠짐 · 마비 시간 */
export function thornTick(s: RunState): void {
  const p = s.player;
  const per = p.stats.damage * N.thornMul * (hasPerk(p, "snBarb") ? K.snBarb.mul : 1);
  for (const e of s.enemies) {
    if ((e.snNumb ?? 0) > 0 && --e.snNumb! <= 0) delete e.snNumb;
    if (!e.snThorns) continue;
    if (--e.snThornT! <= 0 || e.hp <= 0) {
      delete e.snThorns;
      delete e.snThornT;
      delete e.snThornAt;
      continue;
    }
    if (s.tick < (e.snThornAt ?? 0)) continue;
    e.snThornAt = s.tick + N.thornEvery;
    strike(s, e, per * e.snThorns, 0, "bleed");
  }
}

/** 도는 사슬 채찍 개수 · 반지름 */
/** 도는 사슬 반지름 (화면의 무도 꽃 크기도 같이 씀) */
export function orbRadiusOf(p: PlayerState): number {
  return orbRadius(p);
}

export function orbCount(p: PlayerState): number {
  return ((p.snUlt ?? 0) > 0 ? N.ultOrbN : N.orbN) + (hasPerk(p, "snChain") ? K.snChain.more : 0);
}
function orbRadius(p: PlayerState): number {
  return N.orbR * ((p.snUlt ?? 0) > 0 ? N.ultOrbR : 1) * (hasPerk(p, "snReach") ? K.snReach.r : 1);
}

/** 도는 사슬 채찍 i의 비수 자리 (몸 둘레를 크게 돌며 안팎으로 휘저음, 화면도 같이 씀) */
export function snOrbAt(p: PlayerState, tick: number, i: number): [number, number] {
  const n = orbCount(p);
  const [c, sn] = rot(((tick * N.orbSpin) % TAU) + (i / n) * TAU);
  if ((p.snUlt ?? 0) > 0) {
    // 환혹의 무도: 발밑 꽃의 테두리를 따라 돎 (꽃잎 끝에서 가장 멀고 꽃잎 사이에서 오목)
    const th = ((tick * N.orbSpin) % TAU) + (i / n) * TAU - ((tick * N.ultPetalSpin) % TAU);
    const [k] = rot((th * N.ultPetals) / 2);
    const r = orbRadius(p) * (N.ultInner + (1 - N.ultInner) * Math.abs(k));
    return [p.x + c * r, p.y + sn * r];
  }
  const [w] = rot(((tick * N.orbWave) % TAU) + i * 2.1);
  const r = orbRadius(p) * (1 - N.orbSway / 2 + (N.orbSway / 2) * w);
  return [p.x + c * r, p.y + sn * r];
}

/** 적이 받는 피해 배율 (마비 · 매혹, classTaken.foeTaken) */
export function snFoeTaken(s: RunState, e: EnemyState): number {
  if (!isSerena(s.player)) return 1;
  const numb = (e.snNumb ?? 0) > 0 ? N.numbTaken + (hasPerk(s.player, "snVenom") ? K.snVenom.taken : 0) : 0;
  return 1 + numb + ((e.snCharm ?? 0) > 0 ? N.charmTaken : 0);
}

/** 처치할 때 (hiddenPerks.relicKill): 가시 꽃망울 */
export function serenaKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (!isSerena(p) || !hasPerk(p, "snBloom") || (e.snThorns ?? 0) < thornCap(p)) return;
  for (const o of inCircle(s, e.x, e.y, K.snBloom.r)) {
    if (o === e) continue;
    strike(s, o, p.stats.damage * K.snBloom.mul, 0, "bleed");
    addThorns(s, o, K.snBloom.thorns);
  }
  addEffect(s, { kind: "snBloomFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: K.snBloom.r, maxTicks: 24 });
}

/** 스킬마다 대기 틱 (아이템 반영) */
export function snCooldown(p: PlayerState, i: number): number {
  return Math.round((N.cooldowns[i] ?? 0) * (hasPerk(p, "snMuse") ? K.snMuse.cd : 1));
}

/** 화면용: 스킬마다 남은 대기 0~1 (0 = 쓸 수 있음) */
export function serenaSkills(p: PlayerState): number[] {
  return [0, 1, 2, 3].map((i) => Math.min(1, (p.snCd?.[i] ?? 0) / Math.max(1, snCooldown(p, i))));
}
