// 리바이어 공용 도우미 (sim/levia·leviaWhale이 같이 씀): 보석 · 맞히기 · 고래 확률 · 다른 파일 갈고리
import { LEVIA_PERKS as K } from "../itemsLevia";
import { createRng, deriveSeed } from "../rng";
import { LEVIA as L, type GemStyle } from "../weaponsLevia";
import { strike } from "./s2Kit";
import type { DotKind, EnemyState, PlayerState, RunState } from "./types";
import { hasPerk, weaponOf } from "./util";

export const isLevia = (p: PlayerState) => p.characterId === "levia";

export const gemOf = (p: PlayerState): GemStyle => weaponOf(p).sea ?? { gem: "aqua" };

/** 고래 크기 배율 (바다의 왕) */
export const whaleSize = (p: PlayerState) => (hasPerk(p, "lvKingWhale") ? K.lvKingWhale.size : 1);

/** 고래 피해 (공격력 × 배율 × 보석 × 고래수염) */
export const whaleDmg = (p: PlayerState, mul: number) => p.stats.damage * mul * (gemOf(p).power ?? 1) * (hasPerk(p, "lvBaleen") ? K.lvBaleen.mul : 1);

/** 리바이어 공격 한 번 (빙정: 맞은 적 느려짐 · 느려진 적은 더 아픔) · whale: 고래 공격 (심해 압력 느려짐) */
export function lvHit(s: RunState, e: EnemyState, dmg: number, push = 0, kind?: DotKind, whale = false): void {
  const p = s.player;
  const ice = gemOf(p).gem === "ice";
  const slowed = ice && (e.slowTicks ?? 0) > 0;
  strike(s, e, dmg * (slowed ? L.iceTaken : 1), push, kind);
  if (ice) e.slowTicks = Math.max(e.slowTicks ?? 0, L.iceSlow);
  if (whale && hasPerk(p, "lvDeep")) e.slowTicks = Math.max(e.slowTicks ?? 0, K.lvDeep.slow);
}

/** 지금 고래 확률 (기본 + 보석 + 고래의 부름 + 흰 고래 + 안 나온 만큼) */
export function whaleChance(p: PlayerState): number {
  const base = L.whaleBase + (gemOf(p).whale ?? 0) + (hasPerk(p, "lvCall") ? K.lvCall.chance : 0) + (p.lvWhite ?? 0);
  return Math.min(L.whaleMax, base + (p.lvMiss ?? 0) * L.whaleMiss);
}

/** 이번 타에 고래가 나오는지 굴림 (시드로만) · 나오면 안 나온 수를 비우고 흰 고래 확률 + */
export function rollWhale(s: RunState): boolean {
  const p = s.player;
  const r = createRng(deriveSeed(s.seed, "lvWhale", s.tick, p.attackCount)).nextFloat();
  if (r >= whaleChance(p)) {
    p.lvMiss = (p.lvMiss ?? 0) + 1;
    return false;
  }
  p.lvMiss = 0;
  if (hasPerk(p, "lvWhite")) p.lvWhite = Math.min(K.lvWhite.max, (p.lvWhite ?? 0) + K.lvWhite.step);
  return true;
}

/** 소라 갑옷 (classTaken) */
export const leviaTaken = (p: PlayerState) => (hasPerk(p, "lvShell") ? K.lvShell.taken : 1);
/** 용연향: 잠깐 콤보가 빨라짐 (classSpeed) */
export const leviaSpeedMul = (p: PlayerState) => ((p.lvHaste ?? 0) > 0 ? K.lvAmber.speed : 1);
/** 해방의 깃발: 체력이 많으면 피해 + (classDamageMul) */
export const leviaDmgMul = (p: PlayerState) => (hasPerk(p, "lvFlag") && p.hp >= p.stats.maxHp * K.lvFlag.hp ? K.lvFlag.mul : 1);
/** 화면용: 다음 타 (0~2) */
export const leviaStep = (p: PlayerState) => ((p.lvGap ?? 0) > 0 ? (p.lvStep ?? 0) : 0);
