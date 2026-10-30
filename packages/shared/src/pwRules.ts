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
  xp: { minion: [32, 11], tower: [80, 40], jungle: [45, 15], boss: [160, 80], hero: [90, 30] } as Record<string, readonly [number, number]>,
  heroPerLv: 12,
  /** 막타 돈 (+ 1초마다 1원) · 시작 돈 */
  gold: { minion: 22, tower: 160, jungle: 40, boss: 300, hero: 160 },
  goldStart: 300,
  /** 쟁탈전: 병사가 쓰러질 때 근처(near) 같은 편이 막타를 못 쳐도 받는 돈 비율 (한 줄 길이라 여럿이 같이 큼) */
  nearGold: 0.4,
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
  jungle: { hp: 400, dmg: 7, every: 60, range: 22, speed: 0.6, r: 8 },
  /** 전쟁의 서막 안개 지역: 보스 몬스터 · 큰 보스 둘 */
  elite: { hp: 1600, dmg: 24, every: 70, range: 30, speed: 0.6, r: 11 },
  dragon: { hp: 5200, dmg: 40, every: 80, range: 60, speed: 0.5, r: 16 },
  godeater: { hp: 5200, dmg: 40, every: 80, range: 60, speed: 0.5, r: 16 },
  /** 기간토마키아: 뿔 거인 (붉은 뿔 어려움 · 푸른 뿔 보통 · 흰 뿔 쉬움) · 도깨비 */
  giantRed: { hp: 4200, dmg: 38, every: 70, range: 40, speed: 0.55, r: 15 },
  giantBlue: { hp: 2200, dmg: 26, every: 70, range: 34, speed: 0.55, r: 13 },
  giantWhite: { hp: 1000, dmg: 16, every: 70, range: 28, speed: 0.55, r: 11 },
  goblin: { hp: 240, dmg: 8, every: 50, range: 18, speed: 0.7, r: 7 },
  /** 병사 한 무리: 근접 · 원거리 수 · 나오는 간격 틱 · 시간이 갈수록 강해짐(1분마다 체력·공격 배율) · 가운데를 점령한 편 병사 배율 */
  wave: { melee: 3, ranged: 2, every: 28 * TICK_RATE, grow: 0.04, center: 1.4 },
  /** 병사가 상대를 찾는 거리 · 보스·정글 몬스터가 집에서 벗어나는 최대 거리 */
  aggro: 90,
  leash: 110,
  /** 병사(근접·원거리) 피해 배율: 캐릭터에게 (아프지 않게) · 포탑에게 (포탑은 병사로 밂) */
  vsHero: 0.35,
  vsTower: 2,
  /** 정글·거인: 마지막으로 맞은 뒤 이 틱이 지나면 1초마다 최대 체력 비율로 회복 */
  calm: 3 * TICK_RATE,
  calmHeal: 0.08,
  /** 귀환: 집까지 걸리는 틱 */
  recall: 5 * TICK_RATE,
};

/** 전쟁의 서막 (sim/pwWar): 체크포인트 점령 초·반지름(px) · 상대 집 점령 초 · 정글·큰 보스 다시 나오기 · 갓이터 강화 남는 틱 */
export const PW_WAR = {
  pointSec: 6,
  pointR: 40,
  baseSec: 10,
  campBack: 75 * TICK_RATE,
  bigBack: 180 * TICK_RATE,
  buffTicks: 150 * TICK_RATE,
  /** 처음 나오는 때 (판 시작 뒤 틱): 파멸의 용 10분 · 갓이터 15분 */
  dragonAt: 10 * 60 * TICK_RATE,
  godeaterAt: 15 * 60 * TICK_RATE,
  /** 파멸의 용: 잡은 편 모두(쓰러져 있어도) 영구 강화 · 쓰러져도 남음 · 잡을 때마다 쌓임: 공격력 · 공격 속도 배율 · 최대 쌓임 */
  dragon: { dmg: 1.08, rate: 1.05, max: 4 },
  /** 갓이터: 잡은 편 중 살아 있는 사람만 buffTicks 동안 · 쓰러지면 사라짐: 공격력 · 받는 피해 · 1초마다 최대 체력 비율 재생 */
  godeater: { dmg: 1.12, taken: 0.8, regen: 0.015 },
  /** AI: 이 분까지는 길마다 나뉘어 성장(위 1·가운데 1·아래 2·정글 1), 뒤로는 함께 싸우며 포탑 부수기 · 이만큼 돈이 쌓이면 귀환해 장보기 */
  splitMin: 10,
  shopGold: 1400,
  /** AI 정글이 보스 몬스터(안개 지역 보스)를 잡으러 가는 레벨 */
  eliteLv: 6,
  /** AI 큰 보스: 살아 있는 우리 편 레벨 합이 이만큼 되고 세 명 넘게 살아 있어야 핑을 찍고 모임 · 보스 둘레에 이만큼 모여야 침 */
  bossLv: { dragon: 36, godeater: 46 } as Record<string, number>,
  bossGather: 3,
  /** 10분 전 AI: 상대 캐릭터는 먼저 때리지 않음 (맞았거나 이 거리 안: 근접은 사거리, 원거리는 사거리의 절반) · 맞은 뒤 이 틱 동안은 맞받아침 */
  calmHurt: 3 * TICK_RATE,
};

/** 핑 (sim/pwPing): 보이는 틱 · 한 사람이 다시 찍는 간격 틱 · AI가 따라가는 거리 */
export const PW_PING = { show: 5 * TICK_RATE, every: TICK_RATE, follow: 700, followTicks: 8 * TICK_RATE };

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

/** 기간토마키아 (sim/pwGiga): 30명 생존 + 성장 · 나 + AI 29명 (서버 없이 화면에서만 계산) */
export const PW_GIGA = {
  /** 들판: 라스트 보스 방(29×17)의 가로·세로 12배 (0.48.255부터 1.5배) · 오른쪽 바깥 실내 구역 너비 (건물 안 방들, 담으로 막혀 문으로만 드나듦) */
  cols: 348,
  rows: 204,
  inW: 66,
  giants: { giantRed: 5, giantBlue: 9, giantWhite: 16 },
  goblins: 60,
  chests: 260,
  /** 배낭 칸 (그중 한 칸은 금고) */
  bag: 10,
  /** 닿는 거리 (상자·떨어진 배낭·출구·건물 문) · 제작하며 가만히 있는 틱 */
  reach: 22,
  craftHold: 3 * TICK_RATE,
  /** 자기장: 단계 길이 틱 · 다음 원 배율 · 가장 작은 반지름 */
  zone: { every: 150 * TICK_RATE, shrink: 0.75, minR: 40 },
  /** 임시 출구가 생기는 때 (틱) */
  exitAt: [9 * 60 * TICK_RATE, 17 * 60 * TICK_RATE],
  /** 상자 하나: 돈 범위 · 조합 장비 확률 · 사용 아이템 확률 · 상점 물건 확률 */
  chest: { gold: [40, 160], gear: 0.55, use: 0.45, goods: 0.06 },
  /** 건물 안 상자 (더 좋음): 돈 범위 · 조합 장비 확률 · 전설 장비 확률 · 사용 아이템 확률 · 상점 물건 확률 */
  inChest: { gold: [100, 280], gear: 0.95, legend: 0.12, use: 0.6, goods: 0.12 },
  /** 뿔 거인 보상: 돈 · 장비 수 · 전설 장비 확률 · 상점 물건 확률 */
  drop: {
    giantRed: { gold: 900, gear: 4, legend: 0.6, goods: 0.5 },
    giantBlue: { gold: 450, gear: 3, legend: 0.25, goods: 0.2 },
    giantWhite: { gold: 200, gear: 2, legend: 0, goods: 0.06 },
    goblin: { gold: 40, gear: 0, legend: 0, goods: 0.01 },
  } as Record<string, { gold: number; gear: number; legend: number; goods: number }>,
  /** 뿔 거인 기술 (맞아서 화가 났을 때만): 간격 틱 · 쓰는 거리 · 준비 틱 · 피해 배율(거인 공격력의) · 범위
   *  흰 뿔 돌 던지기(날아가는 틱) · 푸른 뿔 돌진(달리는 틱·빠르기) · 붉은 뿔 레이저(빛 틱·길이·굵기) · 붉은 뿔 내려찍기 */
  skill: {
    rock: { every: 4 * TICK_RATE, range: 150, wind: 12, fly: 36, mul: 1.1, r: 20 },
    charge: { every: 5 * TICK_RATE, range: 170, wind: 30, dash: 20, speed: 6, mul: 1.4, r: 16 },
    laser: { every: 6 * TICK_RATE, range: 230, wind: 45, beam: 14, len: 260, w: 10, mul: 1.6 },
    quake: { every: 9 * TICK_RATE / 2, range: 70, wind: 36, mul: 1.2, r: 64 },
  },
  /** 상점 물건 (배낭에 넣고 나가면 가져감) */
  goods: ["g:ticket", "g:ecoin", "g:chips", "g:skin", "g:fx"],
  /** 우승 칩 */
  winChips: 50000,
  /** AI: 이 레벨이 되어야 그 거인을 노림 · 상대 캐릭터를 알아채는 거리(px) */
  botLv: { giantRed: 14, giantBlue: 9, giantWhite: 5, goblin: 1 } as Record<string, number>,
  botSight: 170,
  /** AI: 판 시작 뒤 이 틱까지는 맞았을 때만 싸움 (먼저 흩어져 파밍) · 체력이 이 비율 아래이거나 상대가 이만큼 레벨이 높으면 도망 */
  botCalm: 90 * TICK_RATE,
  botFlee: 0.35,
  botFleeLv: 3,
  /** 도깨비 다시 나오기: 간격 틱 · 한 번에 */
  goblinEvery: 45 * TICK_RATE,
  goblinWave: 8,
};
