// 가브리엘 전용 아이템 20개: 철옹·방어 5 · 망치·대지 5 · 중력 5 · 스킬·성벽 5. 효과는 sim/gabriel·gabrielSkills·gabrielKit. 수치는 GABRIEL_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "gabriel" as const, effect: true as const });

export const GABRIEL_PASSIVES = {
  // ── 철옹·방어 ──
  /** 강철 판갑: 철옹이 더 단단해짐 */
  gbPlate: P("gbPlate", [{ stat: "maxHp", add: 20 }]),
  /** 수호자의 맹세: 방에 들어갈 때 보호막 */
  gbVow: P("gbVow", [{ stat: "maxHp", add: 10 }]),
  /** 가시 방패: 맞으면 둘레 적에게 체력 비례 피해 · 압박 */
  gbThorns: P("gbThorns"),
  /** 성채의 위엄: 보호막이 있는 동안 주는 피해 증가 */
  gbAegis: P("gbAegis", [{ stat: "damage", add: 1 }]),
  /** 강철 의지: 체력이 절반 이하면 받는 피해가 더 줄어듦 */
  gbIron: P("gbIron", [{ stat: "maxHp", add: 10 }]),
  // ── 망치·대지 ──
  /** 단조 해머: 기본 망치 피해 증가 */
  gbForge: P("gbForge", [{ stat: "damage", add: 1 }]),
  /** 대지 진동: 3타 대지 강타가 더 넓음 */
  gbQuake: P("gbQuake", [{ stat: "range", add: 5 }]),
  /** 묵직한 일격: 3타 기절이 더 김 */
  gbStun: P("gbStun"),
  /** 여진: 3타 뒤 같은 자리에 빛의 망치가 한 번 더 */
  gbAfter: P("gbAfter"),
  /** 거인의 손: 1·2타가 더 멀리 닿음 */
  gbTitan: P("gbTitan", [{ stat: "maxHp", add: 10 }]),
  // ── 중력 ──
  /** 중력 핵: 압박된 적이 받는 피해 증가 */
  gbGrav: P("gbGrav", [{ stat: "damage", add: 1 }]),
  /** 사건의 지평선: 중력 붕괴가 더 넓고 세게 끌어당김 */
  gbPull: P("gbPull"),
  /** 무게: 압박이 더 오래 감 */
  gbWeight: P("gbWeight", [{ stat: "maxHp", add: 10 }]),
  /** 압괴: 압박된 적을 쓰러뜨리면 그 자리에 진동 */
  gbCrush: P("gbCrush"),
  /** 궤도 유지: 중력 붕괴로 보호막을 터뜨려도 일부가 남음 */
  gbOrbit: P("gbOrbit"),
  // ── 스킬·성벽 ──
  /** 방패 강타: 방패 돌진이 더 멀리, 더 셈 */
  gbBash: P("gbBash", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 성벽 확장: 성벽 보호막·진동이 더 큼 */
  gbBulwark: P("gbBulwark", [{ stat: "maxHp", add: 10 }]),
  /** 빛의 망치: 궁극기 중 함께 휘둘러지는 빛의 망치가 더 셈 */
  gbLight: P("gbLight", [{ stat: "damage", add: 1 }]),
  /** 불멸: 궁극기가 더 오래 가고 보호막이 더 큼 */
  gbImmortal: P("gbImmortal", [{ stat: "maxHp", add: 10 }]),
  /** 굳은 신앙: 모든 스킬 대기가 짧아짐 */
  gbFaith: P("gbFaith", [{ stat: "attackSpeed", add: 0.05 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const GABRIEL_PERKS = {
  /** 강철 판갑: 철옹 받는 피해 배율 (원래 값 대신) */
  gbPlate: { halve: 0.4 },
  /** 수호자의 맹세: 방에 들어갈 때 보호막 (최대 체력 비율) */
  gbVow: { shield: 0.2 },
  /** 가시 방패: 둘레 반지름 · 피해(최대 체력 비율) */
  gbThorns: { r: 60, hpMul: 0.15 },
  /** 성채의 위엄: 보호막이 있을 때 피해 배율 */
  gbAegis: { mul: 1.25 },
  /** 강철 의지: 기준 체력 비율 · 받는 피해 배율 */
  gbIron: { below: 0.5, taken: 0.8 },
  /** 단조 해머: 기본 망치 피해 배율 */
  gbForge: { mul: 1.25 },
  /** 대지 진동: 대지 강타 반지름 배율 */
  gbQuake: { r: 1.35 },
  /** 묵직한 일격: 기절 배율 */
  gbStun: { mul: 2 },
  /** 여진: 늦게 떨어지는 틱 · 피해 배율 (대지 강타 대비) */
  gbAfter: { delay: 24, mul: 0.6 },
  /** 거인의 손: 1·2타 닿는 거리 배율 */
  gbTitan: { r: 1.3 },
  /** 중력 핵: 압박된 적이 받는 피해 더함 */
  gbGrav: { taken: 0.2 },
  /** 사건의 지평선: 반지름 배율 · 끌어당김 배율 */
  gbPull: { r: 1.4, pull: 1.5 },
  /** 무게: 압박 틱 배율 */
  gbWeight: { mul: 1.6 },
  /** 압괴: 진동 반지름 · 피해(최대 체력 비율) */
  gbCrush: { r: 50, hpMul: 0.1 },
  /** 궤도 유지: 터뜨린 뒤 남는 보호막 비율 */
  gbOrbit: { keep: 0.5 },
  /** 방패 강타: 거리 배율 · 피해 배율 */
  gbBash: { dist: 1.3, mul: 1.5 },
  /** 성벽 확장: 보호막 배율 · 진동 반지름 배율 */
  gbBulwark: { shield: 1.5, r: 1.3 },
  /** 빛의 망치: 추가타 피해 배율 */
  gbLight: { mul: 1.5 },
  /** 불멸: 유지 틱 더함 · 영역 보호막 더함 */
  gbImmortal: { more: 180, shield: 50 },
  /** 굳은 신앙: 스킬 대기 배율 */
  gbFaith: { cd: 0.85 },
};
