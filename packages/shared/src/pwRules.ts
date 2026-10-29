// 패왕전 새 대결 유형 수치 (docs/PW_MODES.md). 계산은 sim/pwCapture
import { TICK_RATE } from "./constants";

/** 점령전 */
export const PW_CAP = {
  /** 우리 편만 구역에 있을 때 0 → 100%까지 걸리는 초 */
  fullSec: 70,
  /** 쓰러진 뒤 집에서 다시 태어나기까지 틱 */
  respawn: 6 * TICK_RATE,
  /** 버프 자리: F를 누르고 가만히 있어야 하는 틱 · 먹은 뒤 다시 생기는 틱 · 닿는 거리 */
  buffHold: 3 * TICK_RATE,
  buffBack: 60 * TICK_RATE,
  buffReach: 22,
  /** 버프: 남는 틱 · 공격력·공격 속도·이동 배율 · 1초마다 최대 체력 비율 회복 */
  buff: { t: 40 * TICK_RATE, dmg: 1.2, rate: 1.15, move: 1.1, regen: 0.012 },
  /** 점프대: 날아가는 틱 · 내린 뒤 다시 뛰지 않는 틱 */
  jumpTicks: 42,
  jumpRest: 50,
};

/** 성장 (쟁탈전 · 전쟁의 서막): 레벨 · 경험치 · 돈 · 집 · 다시 태어나기 (sim/pwGrow) */
export const PW_GROW = {
  maxLv: 18,
  /** 다음 레벨까지 경험치 = base + per × (지금 레벨 - 1) */
  xpBase: 90,
  xpPer: 45,
  /** 레벨 하나마다 (모든 캐릭터 같음): 최대 체력 · 공격력 · 공격 속도 · 방어력 */
  perLv: { hp: 0.07, dmg: 0.05, rate: 0.012, def: 1 },
  /** 막타 · 가까이 있을 때(경험치 받는 범위 px) 받는 경험치: 병사 · 포탑 · 정글 몬스터 · 보스 · 상대 캐릭터(+ 상대 레벨마다) */
  near: 190,
  xp: { minion: [32, 11], tower: [80, 40], jungle: [22, 8], boss: [160, 80], hero: [90, 30] } as Record<string, readonly [number, number]>,
  heroPerLv: 12,
  /** 막타 돈 (+ 1초마다 1원) · 시작 돈 */
  gold: { minion: 22, tower: 160, jungle: 30, boss: 300, hero: 160 },
  goldStart: 300,
  /** 집: 반지름(px) · 1초마다 최대 체력 비율 회복 · 다시 태어나기 틱 = 바탕 + 레벨마다 */
  homeR: 64,
  homeHeal: 0.1,
  respawn: 4 * TICK_RATE,
  respawnPerLv: 1.2 * TICK_RATE,
  /** 장비 칸 수 · 대시 대기 줄임 최대 · 장비 이동 속도 더하기 최대 */
  slots: 6,
  dashCutMax: 0.4,
  moveMax: 0.5,
  /** 증강을 고르는 레벨 */
  augLv: [3, 7, 11, 15],
  /** 중첩: 이 틱 안에 다시 때리거나 맞으면 유지 */
  stackKeep: 5 * TICK_RATE,
};

/** 병사·포탑·보스 (sim/pwLane): 체력 · 공격 · 공격 간격 틱 · 사거리 · 이동 · 반지름 */
export const PW_UNIT = {
  minion: { hp: 260, dmg: 9, every: 50, range: 18, speed: 0.55, r: 6 },
  archer: { hp: 180, dmg: 12, every: 70, range: 80, speed: 0.55, r: 6 },
  tower: { hp: 1500, dmg: 30, every: 70, range: 112, speed: 0, r: 12 },
  boss: { hp: 3600, dmg: 36, every: 80, range: 70, speed: 0.5, r: 13 },
  jungle: { hp: 520, dmg: 12, every: 60, range: 22, speed: 0.6, r: 8 },
  /** 전쟁의 서막 안개 지역: 보스 몬스터 · 큰 보스 둘 */
  elite: { hp: 1600, dmg: 24, every: 70, range: 30, speed: 0.6, r: 11 },
  dragon: { hp: 5200, dmg: 40, every: 80, range: 60, speed: 0.5, r: 16 },
  godeater: { hp: 5200, dmg: 40, every: 80, range: 60, speed: 0.5, r: 16 },
  /** 병사 한 무리: 근접 · 원거리 수 · 나오는 간격 틱 · 시간이 갈수록 강해짐(1분마다 체력·공격 배율) · 가운데를 점령한 편 병사 배율 */
  wave: { melee: 3, ranged: 2, every: 28 * TICK_RATE, grow: 0.04, center: 1.4 },
  /** 병사가 상대를 찾는 거리 · 보스·정글 몬스터가 집에서 벗어나는 최대 거리 */
  aggro: 90,
  leash: 110,
};

/** 전쟁의 서막 (sim/pwWar): 체크포인트 점령 초·반지름(px) · 상대 집 점령 초 · 정글·큰 보스 다시 나오기 · 큰 보스 처치 팀 강화(남는 틱 · 파멸의 용 공격력·공격 속도 · 갓이터 받는 피해·재생) */
export const PW_WAR = {
  pointSec: 6,
  pointR: 40,
  baseSec: 10,
  campBack: 75 * TICK_RATE,
  bigBack: 180 * TICK_RATE,
  buffTicks: 150 * TICK_RATE,
  dragon: { dmg: 1.2, rate: 1.1 },
  godeater: { taken: 0.85, regen: 0.012 },
};

/** 쟁탈전 (sim/pwContest): 가운데·상대 집 점령에 걸리는 초 */
export const PW_CONTEST = { centerSec: 15, baseSec: 10 };

/** 증강: 고를 때 셋 중 하나 (pwGear가 효과를 셈) */
export const PW_AUGS = {
  vamp: { lifesteal: 0.08 },
  edge: { sharpness: 0.15 },
  fatal: { critChance: 0.12, critDamage: 0.3 },
  skin: { defense: 20 },
  bloom: { regen: 30 },
  might: { dmgMul: 1.12 },
  swift: { move: 0.12, rateMul: 1.1 },
  giant: { hpMul: 1.15 },
  focus: { skillCd: 0.8 },
  spell: { skillDmg: 1.25 },
  echo: { skillDmg: 1.1, skillCd: 0.9 },
  rush: { dashCut: 0.2, move: 0.06 },
} as const;
export type PwAugId = keyof typeof PW_AUGS;
