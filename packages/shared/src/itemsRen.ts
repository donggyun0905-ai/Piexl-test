// 렌 전용 아이템 20개. 능력치 6 · 효과 14 (sim/ren). 수치는 REN_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const S = <I extends string>(id: I, mods: StatMod[]) => ({ id, mods, exclusive: "ren" as const });
const E = <I extends string>(id: I, mods: StatMod[] = []) => ({ id, mods, exclusive: "ren" as const, effect: true as const });

export const REN_PASSIVES = {
  /** 바위 심장: 최대 체력 +20 */
  renStone: S("renStone", [{ stat: "maxHp", add: 20 }]),
  /** 참나무 팔: 공격력 +12% */
  renOak: S("renOak", [{ stat: "damage", mul: 1.12 }]),
  /** 넓은 땅: 사거리 +15% */
  renSoil: S("renSoil", [{ stat: "range", mul: 1.15 }]),
  /** 뿌리 맥박: 공격 속도 +10% */
  renRootPulse: S("renRootPulse", [{ stat: "attackSpeed", mul: 1.1 }]),
  /** 이끼 신: 이동 속도 +8% */
  renMoss: S("renMoss", [{ stat: "moveSpeed", mul: 1.08 }]),
  /** 호박 구슬: 행운 +1 */
  renAmber: S("renAmber", [{ stat: "luck", add: 1 }]),
  /** 수호 토목 둘 더 */
  renGuardPlus: E("renGuardPlus"),
  /** 가시 토목: 수호 토목이 부딪힌 적에게 주는 피해 세 배 */
  renThorn: E("renThorn"),
  /** 단단한 벽: 원거리 탄을 막는 확률 70% → 85% */
  renWall: E("renWall"),
  /** 되받기: 막은 탄이 적에게 되돌아감 */
  renReflect: E("renReflect"),
  /** 여진: 토목이 떨어진 자리에 0.5초 뒤 한 번 더 */
  renQuake: E("renQuake"),
  /** 깊은 뿌리: 묶기 두 배 오래 */
  renBindLong: E("renBindLong"),
  /** 대지의 힘: 대지의 추가 공격 피해 +30% */
  renEarth: E("renEarth"),
  /** 조여드는 감옥: 가둔 적이 갇힌 동안 피해를 받음 */
  renPrisonDmg: E("renPrisonDmg"),
  /** 거대 토목: 토목 크기 +30% */
  renBigger: E("renBigger"),
  /** 대지 붕괴: 다섯 차례를 다 돌면 사거리 안 모든 적에게 큰 토목 */
  renCollapse: E("renCollapse"),
  /** 다시 자람: 탄을 막을 때마다 체력 1 회복 */
  renRegrow: E("renRegrow"),
  /** 거목: 보스에게 피해 +30% */
  renHeavy: E("renHeavy"),
  /** 짓눌림: 짓뭉개기에 맞은 적이 0.5초 멈춤 */
  renCrushStun: E("renCrushStun"),
  /** 터지는 감옥: 가둔 감옥이 풀릴 때 터짐 */
  renBurstPrison: E("renBurstPrison", [{ stat: "maxHp", add: 5 }]),
} as const satisfies Record<string, PassiveDef>;

/** 렌 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱) */
export const REN_PERKS = {
  renGuardPlus: { guards: 2 },
  renThorn: { mul: 3 },
  renWall: { block: 0.85 },
  renReflect: { mul: 1 },
  renQuake: { delay: 30, mul: 0.6 },
  renBindLong: { mul: 2 },
  renEarth: { mul: 1.3 },
  renPrisonDmg: { per: 0.15 },
  renBigger: { r: 1.3 },
  renCollapse: { mul: 2 },
  renRegrow: { heal: 1 },
  renHeavy: { mul: 1.3 },
  renCrushStun: { ticks: 30 },
  renBurstPrison: { mul: 1.5, r: 30 },
};
