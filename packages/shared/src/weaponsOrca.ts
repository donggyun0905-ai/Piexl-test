// 오르카(탈라시아, 격투가): 푸른 물기운을 두른 주먹으로 넓게 때리는 4연속 콤보 → 마지막은 살아 있는 상어 기공파 (스스로 먹잇감을 찾아 헤엄쳐 물어뜯음)
// 때릴수록 해방 게이지가 차고, 가득 차면 대시가 '해방: 범고래 돌파'로 바뀜 (거대한 범고래 물기운이 되어 적을 뚫고 나가 큰 파도로 내려앉음)
// 무기 = 권갑·손목띠 6가지. 계산은 sim/orca·orcaMoves
import type { WeaponDef } from "./content";

/** 권갑 종류: tide 파도 · riptide 이안류(큰 소용돌이) · geyser 간헐천(물기둥 셋) · megalodon 메갈로돈(큰 상어) · pod 범고래 무리(상어 셋) · maelstrom 대소용돌이(소용돌이 장판) */
export type OrcaKind = "tide" | "riptide" | "geyser" | "megalodon" | "pod" | "maelstrom";

/** 권갑 하나: 종류 · 소용돌이 크기 배율 · 끌어당김 배율 · 물기둥 수 · 상어 크기·피해 배율 · 상어 수 · 사냥 횟수 더함 · 소용돌이 장판 */
export interface OrcaStyle {
  orca: OrcaKind;
  whirl?: number;
  pull?: number;
  geysers?: number;
  shark?: number;
  sharks?: number;
  hunts?: number;
  pool?: boolean;
}

const W = (id: string, damageMul: number, attackSpeed: number, orca: OrcaStyle) =>
  ({ id, kind: "riptide", damageMul, attackSpeed, range: 60, projectileSpeed: 6, orca, exclusive: "orca" }) as const;

export const ORCA_WEAPONS = {
  /** 파도 손목띠 (처음 무기): 고른 성능 */
  ocTide: W("ocTide", 1, 1, { orca: "tide" }),
  /** 이안류 권갑: 둘째 타 소용돌이가 40% 크고 두 배로 끌어당김 */
  ocRiptide: W("ocRiptide", 0.95, 1, { orca: "riptide", whirl: 1.4, pull: 2 }),
  /** 간헐천 너클: 셋째 타 물기둥이 앞으로 셋 줄지어 솟음 */
  ocGeyser: W("ocGeyser", 0.9, 1, { orca: "geyser", geysers: 3 }),
  /** 메갈로돈 이빨: 상어 기공파가 1.7배 크고 1.5배 세게 물지만 사냥은 1번 적게 */
  ocMegalodon: W("ocMegalodon", 1, 0.95, { orca: "megalodon", shark: 1.5, hunts: -1 }),
  /** 범고래 무리: 상어 기공파가 셋으로 갈라져 따로 사냥 (하나는 약함) */
  ocPod: W("ocPod", 0.95, 1, { orca: "pod", sharks: 3, shark: 0.55 }),
  /** 대소용돌이 권갑: 상어가 터진 자리에 적을 빨아들이는 소용돌이 장판 */
  ocMaelstrom: W("ocMaelstrom", 0.95, 0.95, { orca: "maelstrom", pool: true }),
} as const satisfies Record<string, WeaponDef>;

/** 오르카 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀, 부채꼴은 cos: 1 한 줄 · 0 반원 · -1 한 바퀴) */
export const ORCA = {
  /** 콤보 4타 간격 (공격 간격 배율) · 이 틱 동안 안 때리면 콤보가 처음으로 */
  stepTime: [0.5, 0.5, 0.6, 0.9],
  comboGap: 50,
  /** 1타 물보라 잽: 거리 · 부채꼴 · 피해 배율 · 밀어냄 */
  sprayReach: 48,
  sprayArc: 0.15,
  sprayMul: 0.7,
  sprayPush: 6,
  /** 2타 소용돌이 훅: 반지름(나를 둘러쌈) · 피해 배율 · 나에게 끌어당김 */
  whirlR: 44,
  whirlMul: 0.8,
  whirlPull: 10,
  /** 3타 물기둥 어퍼: 앞 거리 · 반지름 · 피해 배율 · 띄움(기절) 틱 · 물기둥 사이 */
  geyserAt: 40,
  geyserR: 28,
  geyserMul: 1.1,
  geyserStun: 30,
  geyserGap: 32,
  /** 4타 상어 기공파: 빠르기 · 몸 반지름 · 무는 피해 배율 · 사냥 횟수 · 찾는 거리 · 꺾는 정도 · 최대 틱 · 터짐 반지름·피해 */
  sharkSpeed: 5.5,
  sharkR: 10,
  biteMul: 1.4,
  hunts: 3,
  huntR: 150,
  turn: 0.22,
  sharkLife: 90,
  burstR: 34,
  burstMul: 0.6,
  /** 셋으로 갈라지는 상어 사이 각 (라디안) */
  podSpread: 0.45,
  /** 대소용돌이 장판: 반지름 · 남는 틱 · 한 틱 끌어당김 · 피해 간격 · 피해 배율 */
  poolR: 46,
  poolTicks: 120,
  poolPull: 1.1,
  poolEvery: 15,
  poolMul: 0.25,
  /** 해방 게이지: 가득 · 맞힌 적 하나마다 · 상어가 물 때마다 */
  tideMax: 100,
  tideHit: 2,
  tideBite: 5,
  /** 해방: 범고래 돌파 (대시): 한 틱 거리 · 틱 · 부딪힌 적 피해 배율 · 옆으로 밀어냄 · 기절 */
  breachStep: 7,
  breachTicks: 24,
  breachMul: 2,
  breachPush: 18,
  breachStun: 20,
  /** 돌파 끝 큰 파도: 반지름 · 피해 배율 · 밀어냄 · 기절 */
  waveR: 72,
  waveMul: 2.4,
  wavePush: 22,
  waveStun: 40,
  /** 해방 상태 (범고래 돌파 뒤): 틱 · 모든 공격 범위 배율 · 공격 속도 배율 */
  freeTicks: 600,
  freeRange: 1.35,
  freeSpeed: 1.3,
  /** 해방 중 추가타: 타격마다 날아가는 물 상어 · 빠르기 · 거리 · 몸 반지름 · 피해 배율 */
  dartSpeed: 7,
  dartRange: 150,
  dartR: 10,
  dartMul: 0.6,
  /** 해방 중 번개 대시: 지나간 자리 폭 · 피해 배율 · 기절 틱 */
  boltW: 16,
  boltMul: 1.2,
  boltStun: 20,
};
