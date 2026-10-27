// 오토마타(테라코어, 시즌 2) 무기 10개: 모두 손에서 쏘는 레이저가 기본 공격 (쏘고 · 다시 쏘고). 계산은 sim/automata
import type { WeaponDef } from "./content";

/** 레이저 수·사이 각도·굵기 · 자매 인형 수 · 미사일(확률·최소 수) · 맞힌 뒤 옆 적으로 갈라짐 · 묶음 · 몇 번째마다 궤도 포격 */
export interface AutoStyle {
  beams: number;
  spread: number;
  width: number;
  dolls?: number;
  missiles?: { chance: number; n: number };
  split?: number;
  bind?: number;
  sat?: number;
  /** 치명타 확률이 쏠 때마다 바뀜 (차례로 되풀이) · 레이저 색 */
  crits?: readonly number[];
  tint?: string;
  /** 근접 대검: 두 번 이어 베기 */
  sword?: boolean;
}

const A = (id: string, damageMul: number, attackSpeed: number, range: number, auto: AutoStyle) =>
  ({ id, kind: "automaton", damageMul, attackSpeed, range, projectileSpeed: 0, auto, exclusive: "automata" }) as const;

export const AUTOMATA_WEAPONS = {
  /** 손끝 레이저 (처음 무기): 곧은 레이저 한 줄 */
  adFinger: A("adFinger", 1.1, 1.4, 140, { beams: 1, spread: 0, width: 3 }),
  /** 자매 인형: 똑같이 생긴 오토마타 셋이 곁에서 함께 레이저를 쏨 */
  adSisters: A("adSisters", 0.9, 1.2, 130, { beams: 1, spread: 0, width: 3, dolls: 3 }),
  /** 붉은 레이저: 쏠 때마다 치명타 확률 5% → 10% → 15% → 20% (되풀이) */
  adRed: A("adRed", 1.05, 1.4, 140, { beams: 1, spread: 0, width: 3, crits: [0.05, 0.1, 0.15, 0.2], tint: "#ff3a4a" }),
  /** 프리즘 레이저: 맞힌 적에서 가까운 적 둘에게 갈라짐 */
  adPrism: A("adPrism", 0.85, 1.2, 130, { beams: 1, spread: 0, width: 3, split: 2 }),
  /** 과충전 캐논: 굵고 느리고 아주 셈 */
  adCannon: A("adCannon", 2.8, 0.55, 170, { beams: 1, spread: 0, width: 9 }),
  /** 부채 레이저: 다섯 갈래로 펼쳐 쏨 */
  adSweep: A("adSweep", 0.5, 1.1, 110, { beams: 5, spread: 0.2, width: 2 }),
  /** 구속 레이저: 맞은 적이 잠깐 묶임 */
  adBind: A("adBind", 0.9, 1.3, 130, { beams: 1, spread: 0, width: 4, bind: 40 }),
  /** 궤도 위성: 세 번째 레이저마다 하늘에서 빛기둥이 내리꽂힘 */
  adSatellite: A("adSatellite", 0.9, 1.3, 140, { beams: 1, spread: 0, width: 3, sat: 3 }),
  /** 전탄 발사: 레이저와 함께 늘 미사일 12발 넘게 (느림) */
  adArsenal: A("adArsenal", 0.8, 0.7, 140, { beams: 1, spread: 0, width: 4, missiles: { chance: 1, n: 12 } }),
  /** 리펄서 소드: 양손 대검으로 두 번 이어 벰 (근접) */
  adSword: A("adSword", 1.5, 1.1, 44, { beams: 0, spread: 0, width: 0, sword: true }),
} as const satisfies Record<string, WeaponDef>;

/** 오토마타 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const AUTOMATA = {
  /** 자매 인형: 쏘는 사이 틱 · 피해 배율 · 사거리 · 돌아다니는 거리 · 나에게서 멀어질 수 있는 거리 · 빠르기 */
  dollEvery: 45,
  dollMul: 0.5,
  dollRange: 120,
  dollGap: 30,
  dollLeash: 150,
  dollSpeed: 1.6,
  /** 미사일: 한 발 피해 배율 · 폭발 반경 · 빠르기 · 날아가는 틱 · 확률로 더 나오는 수(0~이만큼) */
  missileMul: 0.1,
  missileBlast: 14,
  missileSpeed: 2.4,
  missileTicks: 110,
  missileExtra: 4,
  /** 기본 능력: 쏠 때마다 이 확률로 등 뒤에서 유도 미사일 이만큼 넘게 (무기에 미사일이 있으면 그 무기 값) */
  baseMissiles: { chance: 0.5, n: 7 },
  /** 자매 인형(분신)이 쏠 때 유도 미사일이 나올 확률 */
  dollMissile: 0.35,
  /** 자매 인형이 쏜 미사일 피해 배율 (본체 미사일보다 약하게) */
  dollMissileMul: 0.05,
  /** 붉은 레이저 치명타 배율 */
  critMul: 2,
  /** 리펄서 소드: 두 번째 베기까지 틱 · 부채꼴 (cos) · 밀어내기 */
  swordGap: 7,
  swordArc: 0.1,
  swordPush: 6,
  /** 갈라짐이 닿는 거리 · 피해 배율 */
  splitReach: 70,
  splitMul: 0.6,
  /** 궤도 포격 반경 · 배율 */
  satR: 24,
  satMul: 2.4,
};
