// 변희 동물 경험치: 든 동물로 적을 쓰러뜨리면 그 동물 경험치가 참 (일반 적 3 · 보스 20). 100이 차면 그 동물 전용 능력 셋 중 하나를 얻음
// 전용 능력은 상점·보물방 등에서는 나오지 않음 (loot). 얻은 능력은 무기를 바꿔도 그대로 (그 동물을 들었을 때만 효과)
import { ENEMIES } from "../content";
import { PASSIVE_IDS, PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRng, deriveSeed } from "../rng";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 처치 경험치 (일반 · 보스) · 가득 */
  KILL: 3,
  BOSS: 20,
  FULL: 100,
};
export { R as MORPH_XP_RULES };

/** 이 무기(동물) 전용 능력 */
export const animalPassives = (weaponId: string): PassiveId[] => PASSIVE_IDS.filter((id) => xpOnly(PASSIVES[id]) && (PASSIVES[id] as PassiveDef).forWeapon === weaponId);

/** 경험치로만 얻는 능력인지 (상점·보물방에서 빼기) */
export function xpOnly(def: PassiveDef): boolean {
  return def.exclusive === "byeonhui" && def.forWeapon !== undefined;
}

/** 화면용: 지금 동물 경험치 0~1 · 얻은 능력 수 (다 얻으면 null) */
export function morphXp(p: PlayerState): { fill: number; got: number } | null {
  const w = weaponOf(p);
  if (p.characterId !== "byeonhui" || !w.animal) return null;
  const own = animalPassives(w.id);
  const got = own.filter((id) => p.passives.includes(id)).length;
  if (got >= own.length) return null;
  return { fill: Math.min(1, (p.mXp?.[w.animal] ?? 0) / R.FULL), got };
}

/** 적을 쓰러뜨림 (combat.removeDead): 지금 동물 경험치, 다 차면 능력 하나. 얻었으면 true (능력치 다시 계산은 부른 쪽에서) */
export function morphKill(s: RunState, e: EnemyState): boolean {
  const p = s.player;
  const w = weaponOf(p);
  if (p.characterId !== "byeonhui" || !w.animal || e.kind === "dummy") return false;
  const left = animalPassives(w.id).filter((id) => !p.passives.includes(id));
  if (!left.length) return false;
  const xp = { ...p.mXp };
  let v = (xp[w.animal] ?? 0) + (ENEMIES[e.kind].boss ? R.BOSS : R.KILL);
  let gained = false;
  if (v >= R.FULL) {
    v -= R.FULL;
    const pick = left[createRng(deriveSeed(s.seed, "morphXp", w.animal, p.passives.length)).int(0, left.length - 1)]!;
    p.passives.push(pick);
    gained = true;
    if (left.length === 1) v = 0;
    addEffect(s, { kind: "mEvo", x: p.x, y: p.y, dirX: ANIMALS.indexOf(w.animal), dirY: 0, size: left.length === 1 ? 48 : 24, maxTicks: 30 });
  }
  xp[w.animal] = v;
  p.mXp = xp;
  return gained;
}

const ANIMALS = ["wolf", "bear", "eagle", "snake", "boar", "scorpion", "bat", "elephant", "spider", "phoenix"];
