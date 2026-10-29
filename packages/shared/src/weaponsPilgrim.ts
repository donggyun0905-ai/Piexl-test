// 차원의 순례자(히든): 수많은 차원을 다니며 무기·능력·물건을 모으는 수집가 · 차원 수집품 무기 20개 (계산은 sim/pgHero, 배낭은 sim/pgBag)
import type { WeaponDef } from "./content";

/** 수집품 방식: star 별 탄 · slash 앞 베기 · flag 깃발 꽂기(자리 피해) · lantern 둘레 불꽃 · bonk 냄비로 때려 기절 · map 방 끝까지 지도 빛 · needle 유도 바늘
 *  · boomerang 갔다 돌아옴 · sling 조약돌 셋 · umbrella 우산으로 밀침(받는 피해 -) · bell 방울 파동 기절 · crane 종이학 셋 · prism 수정 빛줄기 · gear 태엽 폭탄
 *  · meteor 떨어지는 별 · seed 씨앗 탄(회복) · shards 거울 조각 여섯 · sand 모래시계(둘레 멈춤) · key 열쇠(약한 적 즉시 처치) · gate 차원의 문(끌어당김) */
export type CurioMode = "star" | "slash" | "flag" | "lantern" | "bonk" | "map" | "needle" | "boomerang" | "sling" | "umbrella" | "bell" | "crane" | "prism" | "gear" | "meteor" | "seed" | "shards" | "sand" | "key" | "gate";

/** 방식 · 범위(베기·폭발·파동·자리) */
export interface CurioStyle {
  mode: CurioMode;
  radius: number;
}

const P = (id: string, damageMul: number, attackSpeed: number, range: number, mode: CurioMode, radius = 0) =>
  ({ id, kind: "curio", damageMul, attackSpeed, range, projectileSpeed: 4, curio: { mode, radius }, exclusive: "pilgrim" }) as const;

export const PILGRIM_WEAPONS = {
  /** 순례자의 지팡이 (처음 무기): 분홍 보석에서 별 탄 */
  pgStaff: P("pgStaff", 1, 1.3, 150, "star"),
  /** 이세계의 낡은 칼: 앞을 넓게 벰 */
  pgBlade: P("pgBlade", 1.3, 1.2, 40, "slash", 44),
  /** 차원 깃발: 적 자리에 깃발을 꽂아 3초 동안 둘레를 지짐 */
  pgFlag: P("pgFlag", 0.5, 0.6, 150, "flag", 36),
  /** 길잡이 랜턴: 둘레로 불꽃이 퍼짐 */
  pgLantern: P("pgLantern", 1, 0.9, 50, "lantern", 50),
  /** 여행 냄비: 가까이서 세게 때려 기절 */
  pgPan: P("pgPan", 1.8, 0.9, 30, "bonk", 30),
  /** 펼친 지도: 방 끝까지 빛줄기 */
  pgMap: P("pgMap", 1.4, 0.6, 200, "map", 8),
  /** 별 나침반: 끝까지 쫓아가는 바늘 */
  pgCompass: P("pgCompass", 1, 1.1, 180, "needle"),
  /** 바람 부메랑: 꿰뚫고 갔다가 돌아옴 */
  pgBoomerang: P("pgBoomerang", 1.1, 0.9, 120, "boomerang"),
  /** 조약돌 새총: 조약돌 셋을 펼쳐 쏨 */
  pgSling: P("pgSling", 0.7, 1.1, 130, "sling"),
  /** 별빛 우산: 앞을 밀쳐 냄 · 들고 있으면 받는 피해 -20% */
  pgUmbrella: P("pgUmbrella", 1.2, 1, 36, "umbrella", 36),
  /** 은방울: 둘레로 방울 소리 파동, 잠깐 멈춤 */
  pgBell: P("pgBell", 0.9, 0.8, 60, "bell", 60),
  /** 종이학: 유도하는 종이학 셋 */
  pgCrane: P("pgCrane", 0.6, 0.9, 160, "crane"),
  /** 차원 수정: 꿰뚫는 빛줄기 */
  pgCrystal: P("pgCrystal", 1.5, 0.8, 160, "prism", 6),
  /** 태엽 폭탄: 적 자리에 던져 잠시 뒤 터짐 */
  pgClock: P("pgClock", 2.2, 0.6, 140, "gear", 40),
  /** 떨어진 별: 노린 자리에 별똥별이 떨어짐 */
  pgMeteor: P("pgMeteor", 2, 0.5, 170, "meteor", 32),
  /** 세계수 씨앗: 씨앗 탄, 맞히면 체력 회복 */
  pgSeed: P("pgSeed", 1, 1, 150, "seed"),
  /** 거울 조각: 여섯 방향으로 조각 */
  pgMirror: P("pgMirror", 0.8, 0.9, 110, "shards"),
  /** 모래시계: 둘레 적을 멈춤 */
  pgHourglass: P("pgHourglass", 0.6, 0.6, 70, "sand", 70),
  /** 만능 열쇠: 한 적을 세게 · 체력이 적은 적은 바로 처치 */
  pgKey: P("pgKey", 2, 0.8, 120, "key"),
  /** 차원의 문: 적 자리에 문을 열어 3초 동안 끌어당기며 지짐 */
  pgGate: P("pgGate", 0.6, 0.5, 160, "gate", 60),
} as const satisfies Record<string, WeaponDef>;

/** 순례자 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const PILGRIM = {
  /** 수집 도감: 들어 본 순례자 무기 한 칸마다 공격력 + */
  bookDmg: 0.02,
  /** 배낭 뒤지기: 이 공격마다 도감의 다른 수집품을 꺼내 한 번 씀 (배율) */
  bagEvery: 5,
  bagMul: 0.8,
  /** 깃발·문: 남는 틱 · 피해 간격 · 문이 끌어당기는 힘 */
  zoneTicks: 180,
  zoneGap: 20,
  gatePull: 0.6,
  /** 태엽 폭탄·별: 터질 때까지 틱 */
  gearFuse: 40,
  meteorFuse: 24,
  /** 냄비·방울·모래시계 기절 틱 · 우산 밀침·받는 피해 */
  bonkStun: 40,
  bellStun: 30,
  sandStun: 60,
  umbrellaPush: 18,
  umbrellaTaken: 0.8,
  /** 씨앗: 맞힐 때 최대 체력 회복 비율 · 열쇠: 이 체력 비율 아래 보통 적은 바로 처치 */
  seedHeal: 0.01,
  keyExec: 0.2,
};
