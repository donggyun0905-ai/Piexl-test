// 이터(헬리오스) 무기: 이빨 달린 그림자 하나. 누를 때마다 열 가지 공격 중 하나가 확률로 나옴 (계산은 sim/eater)
import type { WeaponDef } from "./content";

/**
 * slash 그림자 베기 · blades 그림자 검기 셋 · bite 손에서 커진 아가리가 물어뜯음 · abyss 땅에서 솟는 심연의 괴물
 * spear 그림자 창 · barrage 뒤에서 솟는 창들이 여러 번 씹음 · xcut X자 가르기 · dashBite 돌진해 씹어먹기
 * triBite 아가리가 위·가운데·아래로 세 번 씹음 · lurker 땅에서 솟아 물고기처럼 낚아채 사라짐
 */
export type MawMove = "slash" | "blades" | "bite" | "abyss" | "spear" | "barrage" | "xcut" | "dashBite" | "triBite" | "lurker";

export const EATER_WEAPONS = {
  /** 이빨 달린 그림자: 넓고 세지만 느림 */
  shadowMaw: { id: "shadowMaw", kind: "maw", damageMul: 1, attackSpeed: 0.55, range: 60, projectileSpeed: 3.2, exclusive: "eater" },
} as const satisfies Record<string, WeaponDef>;

/** 이터 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const EATER = {
  /** 공격마다 [나올 확률 무게, 피해 배율] */
  moves: {
    slash: [16, 1],
    blades: [12, 0.8],
    bite: [14, 1.6],
    abyss: [8, 2.2],
    spear: [12, 1.3],
    barrage: [8, 0.55],
    xcut: [10, 1.2],
    dashBite: [8, 1.5],
    triBite: [6, 1],
    lurker: [6, 2.5],
  } satisfies Record<MawMove, readonly [number, number]>,
  /** 부채꼴 (cos) · 검기 거리 · 심연 반경 · 창 폭 · 연타 횟수·간격 · 세 번 씹기 간격 · 낚아채기 거리 배율 */
  arc: 0.1,
  bladeRange: 130,
  abyssR: 30,
  spearW: 8,
  barrageN: 5,
  barrageGap: 6,
  triGap: 8,
  lurkReach: 2,
  /** 낚아채기·통째로 삼키기: 맞은 뒤 체력이 이만큼 이하인 일반 적은 삼킴 */
  swallow: 0.25,
  /** 연타·세 번 씹기·낚아채기가 무는 둘레 (모든 공격이 범위) */
  splash: 20,
  /** 먹은(쓰러뜨린) 적마다 재생력 + · 상한 · 재생력: 10초마다 그만큼 · 재생력 10마다 공격력 + */
  regenPer: 0.1,
  regenMax: 100,
  dmgPer10: 3,
};
