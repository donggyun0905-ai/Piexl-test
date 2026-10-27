// 제우스(히든, 시즌 2): 신들의 왕 · 번개 무기 10개 (계산은 sim/zeus, 신의 힘은 sim/zeusPower)
import type { WeaponDef } from "./content";

/** 번개 방식: javelin 번개창 던지기(맞으면 옮겨 붙음) · sky 하늘에서 내리치는 벼락 · chain 연쇄 번개 · storm 폭풍 구름 · aegis 방패로 밀쳐 기절
 *  · eagle 유도 독수리 · clap 둘레 천둥 파동 · spear 방 끝까지 벼락창 · orb 떠다니며 지지는 구전 · titan 거인 사냥 벼락 */
export type ThunderMode = "javelin" | "sky" | "chain" | "storm" | "aegis" | "eagle" | "clap" | "spear" | "orb" | "titan";

/** 방식 · 옮겨 붙는 수 · 범위(폭발·파동·구름) */
export interface ThunderStyle {
  mode: ThunderMode;
  chains: number;
  radius: number;
}

const Z = (id: string, damageMul: number, attackSpeed: number, range: number, zeus: ThunderStyle) =>
  ({ id, kind: "thunder", damageMul, attackSpeed, range, projectileSpeed: 6, zeus, exclusive: "zeus" }) as const;

export const ZEUS_WEAPONS = {
  /** 번개창 (처음 무기): 빠르게 날아가 맞으면 둘레 적에게 옮겨 붙음 */
  zsBolt: Z("zsBolt", 1, 1.2, 160, { mode: "javelin", chains: 2, radius: 0 }),
  /** 하늘의 벼락: 노린 적 머리 위로 벼락이 내리꽂힘 (둘레도 맞음) */
  zsSky: Z("zsSky", 1.3, 1, 170, { mode: "sky", chains: 0, radius: 24 }),
  /** 연쇄 번개: 손끝에서 뻗어 적 여섯을 잇따라 지짐 */
  zsChain: Z("zsChain", 0.8, 1.2, 130, { mode: "chain", chains: 6, radius: 0 }),
  /** 폭풍 구름: 적 위에 구름을 띄워 3초 동안 벼락이 쏟아짐 */
  zsStorm: Z("zsStorm", 0.6, 0.6, 170, { mode: "storm", chains: 0, radius: 40 }),
  /** 아이기스: 신의 방패로 앞을 밀쳐 기절 · 들고 있는 동안 받는 피해 -25% */
  zsAegis: Z("zsAegis", 1.4, 1.1, 40, { mode: "aegis", chains: 0, radius: 40 }),
  /** 독수리: 신의 독수리가 끝까지 쫓아가 꿰뚫음 */
  zsEagle: Z("zsEagle", 1.1, 1, 200, { mode: "eagle", chains: 0, radius: 0 }),
  /** 천둥소리: 둘레로 천둥 파동이 퍼져 맞은 적을 잠깐 멈춤 */
  zsClap: Z("zsClap", 1.2, 0.9, 60, { mode: "clap", chains: 0, radius: 64 }),
  /** 신의 벼락창: 느리지만 방 끝까지 뻗는 거대한 벼락 */
  zsSpear: Z("zsSpear", 3, 0.4, 200, { mode: "spear", chains: 0, radius: 10 }),
  /** 구전: 천천히 떠다니며 둘레 적을 계속 지지는 번개 구슬 */
  zsOrb: Z("zsOrb", 0.6, 0.7, 150, { mode: "orb", chains: 0, radius: 44 }),
  /** 거인 사냥: 보스에게 3배 · 맞힌 자리 둘레로 벼락 셋 */
  zsTitan: Z("zsTitan", 1.2, 0.9, 150, { mode: "titan", chains: 0, radius: 36 }),
} as const satisfies Record<string, WeaponDef>;

/** 제우스 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const ZEUS = {
  /** 감전: 맞을 때마다 쌓임(최대) · 쌓인 만큼 더 받는 피해 */
  shockMax: 5,
  shockTaken: 0.06,
  /** 옮겨 붙는 거리 · 피해 배율 */
  chainReach: 110,
  chainMul: 0.7,
  /** 천벌 게이지: 맞힐 때마다 +1, 다 차면 제우스 강림 (틱 · 그동안 벼락 간격 · 벼락 배율 · 공격 속도 배율) */
  wrathNeed: 120,
  godTicks: 480,
  godGap: 12,
  godMul: 2,
  godSpeed: 2,
  /** 폭풍 구름: 남는 틱 · 벼락 간격 · 한 번 배율 */
  stormTicks: 180,
  stormGap: 20,
  stormMul: 1.2,
  /** 구전: 지지는 간격 · 한 번 배율 · 속도 */
  orbGap: 15,
  orbMul: 0.6,
  orbSpeed: 1.2,
  /** 아이기스: 받는 피해 배율 · 기절 틱 · 밀침 */
  aegisTaken: 0.75,
  aegisStun: 60,
  aegisPush: 20,
  /** 번개 걸음(대시): 지나간 길 피해 배율 · 폭 */
  dashMul: 1.5,
  dashWidth: 10,
  /** 거인 사냥: 보스 배율 · 둘레 벼락 수 */
  titanBoss: 3,
  titanBolts: 3,
};
