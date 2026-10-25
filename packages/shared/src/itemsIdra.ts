// 이드라 전용 아이템 20개 (이드라는 공용 아이템이 나오지 않고 이것만 나옴). 능력치 8개 · 효과 12개 (sim/idra). 수치는 IDRA_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const S = <I extends string>(id: I, mods: StatMod[]) => ({ id, mods, exclusive: "idra" as const });
const E = <I extends string>(id: I, mods: StatMod[] = []) => ({ id, mods, exclusive: "idra" as const, effect: true as const });

export const IDRA_PASSIVES = {
  /** 새싹 잎: 최대 체력 +15 */
  idSprout: S("idSprout", [{ stat: "maxHp", add: 15 }]),
  /** 세계수 수액: 공격력 +12% */
  idSap: S("idSap", [{ stat: "damage", mul: 1.12 }]),
  /** 산들바람: 공격 속도 +12% */
  idBreeze: S("idBreeze", [{ stat: "attackSpeed", mul: 1.12 }]),
  /** 깊은 뿌리: 사거리 +12% */
  idRoots: S("idRoots", [{ stat: "range", mul: 1.12 }]),
  /** 네잎 클로버: 행운 +1 */
  idClover: S("idClover", [{ stat: "luck", add: 1 }]),
  /** 꽃잎 신발: 이동 속도 +8% */
  idPetal: S("idPetal", [{ stat: "moveSpeed", mul: 1.08 }]),
  /** 도토리: 최대 체력 +8 · 공격력 +6% */
  idAcorn: S("idAcorn", [{ stat: "maxHp", add: 8 }, { stat: "damage", mul: 1.06 }]),
  /** 아침 이슬: 2초마다 체력 1 회복 */
  idDew: E("idDew"),
  /** 갈래 화살: 대궁 화살이 세 갈래 */
  idSplitArrow: E("idSplitArrow"),
  /** 뿌리 화살: 대궁 화살에 맞은 적이 1초 묶임 */
  idRootArrow: E("idRootArrow"),
  /** 쌍단검: 단검이 두 번 찌름 */
  idTwinStab: E("idTwinStab"),
  /** 나무 쪼개기: 우드브레이커 일격 3배 → 5배 */
  idBreaker: E("idBreaker"),
  /** 가시 방패: 방패 모습일 때 맞으면 둘레 적에게 공격력 1.5배 피해 */
  idThornShield: E("idThornShield"),
  /** 태고의 벽: 방패 모습일 때 받는 피해 -30% → -50% · 보호막 두 배 */
  idAncientWall: E("idAncientWall"),
  /** 긴 가시 채찍: 채찍 사거리 +40% · 폭 +4 */
  idLongWhip: E("idLongWhip"),
  /** 가시덤불: 채찍 독 두 배 · 맞은 적이 느려짐 */
  idBramble: E("idBramble"),
  /** 만개: 변환 일격의 범위·피해 1.8배 */
  idBloomSwap: E("idBloomSwap"),
  /** 가이아의 은총: 모습을 바꿀 때 체력 2 회복 */
  idGaiaGrace: E("idGaiaGrace"),
  /** 사계: 네 모습을 모두 거치면 8초 동안 피해 +35% */
  idFourSeasons: E("idFourSeasons"),
  /** 세계수의 심장: 체력이 절반 아래로 내려가면 방마다 한 번 최대 체력 25% 회복 + 2초 무적 */
  idWorldHeart: E("idWorldHeart", [{ stat: "maxHp", add: 10 }]),
} as const satisfies Record<string, PassiveDef>;

/** 이드라 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱) */
export const IDRA_PERKS = {
  idDew: { every: 120, heal: 1 },
  idRootArrow: { ticks: 60 },
  idBreaker: { mul: 5 },
  idThornShield: { r: 30, mul: 1.5 },
  idAncientWall: { taken: 0.5, gain: 2 },
  idLongWhip: { reach: 1.4, width: 4 },
  idBramble: { poison: 2, slow: 60 },
  idBloomSwap: { mul: 1.8 },
  idGaiaGrace: { heal: 2 },
  idFourSeasons: { ticks: 480, damage: 1.35 },
  idWorldHeart: { heal: 0.25, invuln: 120 },
};
