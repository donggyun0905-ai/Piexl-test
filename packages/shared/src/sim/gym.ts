// 단련의 방 (4층부터 층마다 하나): 기구 셋(샌드백·랫풀다운·벤치 프레스) 중 하나만 골라 F → 미니게임(화면) → 점수(최대 1000)로 강화 포인트(최대 10)
// 포인트로 능력치·무기·가진 패시브를 한 단계씩 강화 (언제든 다시 F로 창을 열어 남은 포인트를 씀). 창에서 누른 것은 입력 menu로 와서 같은 결과 (기록·협동)
import { DEVIL_PASSIVES } from "../itemsDevil";
import { HIDDEN_PASSIVES } from "../itemsHidden";
import type { ExtraStats } from "../characters";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import type { StatMod } from "../stats";
import { recalcStats } from "./items";
import { fxKeys } from "./gymPerks";
import { addPickup, CX, CY } from "./loot";
import type { PlayerState, RunState } from "./types";
import { addEffect } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 이 층부터 층마다 단련의 방 하나 */
  FROM_FLOOR: 4,
  /** 점수 몇 점마다 포인트 1 · 한 번에 얻는 최대 포인트 · 한 항목 최대 단계 */
  SCORE_PER_PT: 100,
  MAX_PTS: 10,
  MAX_LV: 10,
  /** 단계마다 오르는 몫: 공격력 % · 최대 체력 · 공격 속도 % · 이동 속도 % · 사거리 % · 행운 */
  damage: 0.05,
  maxHp: 10,
  attackSpeed: 0.04,
  moveSpeed: 0.03,
  range: 0.05,
  luck: 1,
  /** 치명타 확률 · 치명타 피해 · 방어력 · 재생력 · 흡혈(목록에서 뺌, GYM_OFF) · 회피 */
  critChance: 0.03,
  critDamage: 0.1,
  defense: 4,
  regen: 1,
  lifesteal: 0.01,
  dodge: 0.02,
  /** 무기 숙련: 공격력·공격 속도 각각 % */
  weapon: 0.03,
  /** 패시브 강화: 능력치가 붙은 패시브는 그 좋은 몫의 이 배만큼 더 (깎는 몫은 그대로) · 효과 수치는 sim/gymPerks의 GYM_FX_RULES */
  passiveBoost: 0.5,
};
export { R as GYM_RULES };

/** 강화할 수 있는 능력치 (화면 차례 = 입력 번호) · 패시브는 32 + 가진 패시브 차례 */
export const GYM_STATS = ["damage", "maxHp", "attackSpeed", "moveSpeed", "range", "luck", "critChance", "critDamage", "defense", "regen", "lifesteal", "dodge", "weapon"] as const;
export type GymStat = (typeof GYM_STATS)[number];
/** 강화 목록에서 뺀 능력치 (입력 번호가 바뀌지 않게 자리는 남김 · 2026-11-01 흡혈 뺌) */
export const GYM_OFF: readonly GymStat[] = ["lifesteal"];
/** 입력 menu 기능 번호: 미니게임 결과 (a = 기구, b = 점수 ÷ 20) · 강화 (a = 항목) */
export const GYM_OP = { result: 9, up: 10 } as const;
export const PASSIVE_AT = 32;

/** 이 캐릭터에게는 효과가 없어 막은 능력치 (2026-11-01 전체 캐릭터 점검):
 *  최대 체력 고정(거너·저주받은 주사위 체력) · 공격 간격이 무기에 고정(버려진 자들·잔영)이거나 차크람이 돌아와야 다시 던짐(베두인) ·
 *  주 공격이 치명타를 굴리지 않음(기계공학자 광선·의사) */
const NO_EFFECT: Partial<Record<string, readonly GymStat[]>> = {
  gunner: ["maxHp"],
  remnant: ["attackSpeed"],
  abandoned: ["attackSpeed"],
  bedouin: ["attackSpeed"],
  engineer: ["critChance", "critDamage"],
  doctor: ["critChance", "critDamage"],
};
export const gymBlocked = (p: PlayerState, k: GymStat): boolean => GYM_OFF.includes(k) || !!NO_EFFECT[p.characterId]?.includes(k) || (k === "maxHp" && p.curseHp !== undefined);

export const gymFloor = (floor: number) => floor >= R.FROM_FLOOR;
const roomKey = (s: RunState) => s.floor * 1000 + s.roomId;
/** 이 방의 기구를 이미 썼는지 (셋 중 하나만) */
export const gymUsed = (s: RunState) => !!s.player.gym?.rooms.includes(roomKey(s));
/** 단련할 수 없는 패시브: 악마의 거래 · 히든 아이템 */
const NO_GYM = new Set<string>([...Object.keys(DEVIL_PASSIVES), ...Object.keys(HIDDEN_PASSIVES)]);
/** 단련할 수 있는 가진 패시브 (같은 것은 하나로): 좋은 능력치 몫이 있거나 올릴 효과 수치가 있는 것만 (sim/gymPerks) · 악마·히든은 빼고 */
export const gymPassives = (p: PlayerState) => [...new Set(p.passives)].filter((id) => !NO_GYM.has(id) && (gymPassiveStep(id).length > 0 || fxKeys(id).length > 0));
export const gymLv = (p: PlayerState, key: string) => p.gym?.lv[key] ?? 0;
const ensure = (p: PlayerState) => (p.gym ??= { pts: 0, lv: {}, rooms: [] });

/** 방에 처음 들어가면 기구 셋 (group = 기구 번호 0 샌드백 · 1 랫풀다운 · 2 벤치 프레스) */
export function spawnGym(s: RunState, roomId: number): void {
  for (let i = 0; i < 3; i++) addPickup(s, roomId, "gym", "0", CX - 56 + i * 56, CY - 8, i);
}

/** 창에서 누른 것 (sim/station.stationMenu가 넘김) */
export function gymMenu(s: RunState, op: number, a: number, b: number): void {
  const p = s.player;
  if (op === GYM_OP.result) {
    if (s.map.rooms[s.roomId]?.type !== "gym" || gymUsed(s) || a > 2) return;
    const g = ensure(p);
    const score = Math.min(1000, b * 20);
    const pts = Math.min(R.MAX_PTS, Math.floor(score / R.SCORE_PER_PT));
    g.pts += pts;
    g.rooms.push(roomKey(s));
    g.last = { device: a, score, pts };
    addEffect(s, { kind: "hdShow", x: p.x, y: p.y - 14, dirX: 0, dirY: 0, size: 14, maxTicks: 40 });
    return;
  }
  if (op !== GYM_OP.up || !p.gym || p.gym.pts <= 0) return;
  const key = a < PASSIVE_AT ? GYM_STATS[a] : (() => {
    const id = gymPassives(p)[a - PASSIVE_AT];
    return id ? `p:${id}` : undefined;
  })();
  if (!key || gymLv(p, key) >= R.MAX_LV || (a < PASSIVE_AT && gymBlocked(p, key as GymStat))) return;
  p.gym.lv[key] = gymLv(p, key) + 1;
  p.gym.pts--;
  recalcStats(s);
  addEffect(s, { kind: "plus", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 12, maxTicks: 20 });
}

/** 한 단계마다 오르는 몫 (화면 설명·계산) */
export const gymStep = (k: GymStat) => R[k];

/** 패시브 한 단계마다 오르는 능력치 몫 (화면 설명·계산): 그 패시브의 좋은 능력치 몫 × passiveBoost (깎는 몫은 키우지 않음) · 없으면 빈 목록 */
export function gymPassiveStep(id: PassiveId): StatMod[] {
  const mods = ((PASSIVES[id] as PassiveDef).mods ?? []) as readonly StatMod[];
  const out: StatMod[] = [];
  for (const m of mods) {
    if ((m.add ?? 0) > 0) out.push({ stat: m.stat, add: m.add! * R.passiveBoost });
    if ((m.mul ?? 1) > 1) out.push({ stat: m.stat, mul: 1 + (m.mul! - 1) * R.passiveBoost });
  }
  return out;
}

/** 강화한 능력치 (recalcStats, sim/station.stationMods) */
export function gymMods(p: PlayerState): StatMod[] {
  if (!p.gym) return [];
  const L = (k: string) => gymLv(p, k);
  const out: StatMod[] = [
    { stat: "damage", mul: 1 + R.damage * L("damage") + R.weapon * L("weapon") },
    { stat: "maxHp", add: R.maxHp * L("maxHp") },
    { stat: "attackSpeed", mul: 1 + R.attackSpeed * L("attackSpeed") + R.weapon * L("weapon") },
    { stat: "moveSpeed", mul: 1 + R.moveSpeed * L("moveSpeed") },
    { stat: "range", mul: 1 + R.range * L("range") },
    { stat: "luck", add: R.luck * L("luck") },
  ];
  for (const id of gymPassives(p)) {
    const lv = L(`p:${id}`);
    if (!lv) continue;
    for (const m of gymPassiveStep(id)) out.push({ stat: m.stat, ...(m.add !== undefined ? { add: m.add * lv } : {}), ...(m.mul !== undefined ? { mul: 1 + (m.mul - 1) * lv } : {}) });
  }
  return out;
}

/** 강화한 추가 스탯 (sim/baseStats.extraOf) */
export function gymExtras(p: PlayerState): Partial<ExtraStats> | null {
  if (!p.gym) return null;
  const L = (k: string) => gymLv(p, k);
  return { critChance: R.critChance * L("critChance"), critDamage: R.critDamage * L("critDamage"), defense: R.defense * L("defense"), regen: R.regen * L("regen"), lifesteal: R.lifesteal * L("lifesteal"), dodge: R.dodge * L("dodge") };
}

/** 단련의 방 상태 (PlayerState) */
export interface GymPlayerState {
  /** 남은 포인트 · 항목마다 단계 (능력치 이름 · 무기 weapon · 패시브 p:id) · 쓴 방 (층 × 1000 + 방) · 마지막 미니게임 결과 */
  gym?: { pts: number; lv: Record<string, number>; rooms: number[]; last?: { device: number; score: number; pts: number } };
}
