// 차원의 순례자 전용 아이템 20개 (여러 차원에서 모은 능력·물건). 효과는 sim/pgHero·pgBag. 수치는 PILGRIM_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const E = <T extends string>(id: T) => ({ id, mods: [] as StatMod[], exclusive: "pilgrim" as const, effect: true as const });
const M = <T extends string>(id: T, mods: StatMod[]) => ({ id, mods, exclusive: "pilgrim" as const });

export const PILGRIM_PASSIVES = {
  /** 커다란 배낭: 최대 체력 +30 */
  pgPack: M("pgPack", [{ stat: "maxHp", add: 30 }]),
  /** 닳은 여행 부츠: 이동 속도 +12% */
  pgBoots: M("pgBoots", [{ stat: "moveSpeed", mul: 1.12 }]),
  /** 돋보기: 사거리 +25 */
  pgLens: M("pgLens", [{ stat: "range", add: 25 }]),
  /** 네잎클로버: 행운 +2 */
  pgClover: M("pgClover", [{ stat: "luck", add: 2 }]),
  /** 간식 주머니: 공격 속도 +10% */
  pgSnack: M("pgSnack", [{ stat: "attackSpeed", mul: 1.1 }]),
  /** 순례자 배지: 공격력 +15% */
  pgBadge: M("pgBadge", [{ stat: "damage", mul: 1.15 }]),
  /** 수집 일지: 도감 한 칸마다 공격력이 두 배로 오름 */
  pgJournal: E("pgJournal"),
  /** 배낭 정리: 더 자주 꺼내 씀 */
  pgRummage: E("pgRummage"),
  /** 두 겹 배낭: 꺼낼 때 둘을 꺼냄 */
  pgDoubleBag: E("pgDoubleBag"),
  /** 메아리 구슬: 확률로 한 번 더 공격 */
  pgEcho: E("pgEcho"),
  /** 여행 기념품: 처치하면 확률로 체력 회복 */
  pgSouvenir: E("pgSouvenir"),
  /** 차원 도장: 처치마다 도장, 다 모으면 아직 없는 순례자 무기가 떨어짐 */
  pgStamp: E("pgStamp"),
  /** 모닥불: 꺼내 쓸 때마다 체력 회복 */
  pgCampfire: E("pgCampfire"),
  /** 별 가루: 탄이 맞은 자리 둘레도 맞음 */
  pgStarDust: E("pgStarDust"),
  /** 수정 열쇠고리: 보스에게 피해 + */
  pgKeyring: E("pgKeyring"),
  /** 그림엽서: 도감 다섯 칸마다 받는 피해 - */
  pgPostcard: E("pgPostcard"),
  /** 접이식 텐트: 맞으면 확률로 잠깐 무적 */
  pgTent: E("pgTent"),
  /** 지름길: 대시한 뒤 첫 공격이 세짐 */
  pgShortcut: E("pgShortcut"),
  /** 행운 동전: 꺼내 쓴 수집품이 세짐 */
  pgLuckyCoin: E("pgLuckyCoin"),
  /** 세계수 잎: 도감이 많으면 공격이 빨라짐 */
  pgWorldLeaf: E("pgWorldLeaf"),
} as const satisfies Record<string, PassiveDef>;

/** 순례자 아이템 수치 */
export const PILGRIM_PERKS = {
  pgJournal: { mul: 2 },
  pgRummage: { every: 3 },
  pgDoubleBag: { n: 2 },
  pgEcho: { chance: 0.2 },
  pgSouvenir: { chance: 0.15, heal: 4 },
  pgStamp: { need: 30 },
  pgCampfire: { heal: 0.02 },
  pgStarDust: { r: 22, mul: 0.3 },
  pgKeyring: { mul: 1.3 },
  pgPostcard: { per: 5, cut: 0.04 },
  pgTent: { chance: 0.2, ticks: 60 },
  pgShortcut: { mul: 2 },
  pgLuckyCoin: { mul: 1.5 },
  pgWorldLeaf: { need: 10, mul: 1.25 },
};
