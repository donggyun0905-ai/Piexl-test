// 이벤트 '패왕전': AI 캐릭터들과 겨루는 일곱 가지 대결 수치 (계산은 sim/paewang·paewangAi, 맵은 paewangMaps)
import type { CharacterId } from "./characters";
import { PW_MAP_SETS, type PwArenaId } from "./paewangMaps";

export type PwMode = "duel" | "pair" | "trio" | "squad" | "tourney" | "brawl" | "gungame";
export const PW_MODES: readonly PwMode[] = ["duel", "pair", "trio", "squad", "tourney", "brawl", "gungame"];

/** AI 보정: 체력 · 피해 · 공격 빠르기 · 조준 정확도(0~1) · 이동 빠르기 · 피하기(대시) 확률 */
export interface PwDiff {
  hp: number;
  dmg: number;
  rate: number;
  aim: number;
  speed: number;
  dodge: number;
}

const EASY: PwDiff = { hp: 0.8, dmg: 0.7, rate: 0.8, aim: 0.55, speed: 0.9, dodge: 0.15 };
const NORMAL: PwDiff = { hp: 1, dmg: 1, rate: 1, aim: 0.75, speed: 1, dodge: 0.3 };
const HARD: PwDiff = { hp: 1.3, dmg: 1.25, rate: 1.15, aim: 0.88, speed: 1.08, dodge: 0.45 };
const BRUTAL: PwDiff = { hp: 1.7, dmg: 1.5, rate: 1.3, aim: 0.95, speed: 1.15, dodge: 0.6 };

export interface PwModeDef {
  /** 고를 수 있는 경기장 5개 (paewangMaps.PW_MAP_SETS) */
  maps: readonly PwArenaId[];
  /** 판 수: 3이면 3판 2선승 */
  rounds: number;
  /** 내 편 AI 수 · 상대 AI 수 (토너먼트는 차례로 하나씩 나옴) */
  allies: number;
  foes: number;
  /** 모두가 서로 적 (대난투·데스매치) */
  ffa: boolean;
  /** 이기면 받는 돈 (로비 칩) */
  reward: number;
  diff: PwDiff;
  /** 준비방에서 무기·패시브·아이템을 고름 (데스매치는 모두 무작위) */
  prep: boolean;
}

export const PW_MODE: Record<PwMode, PwModeDef> = {
  /** 1대1: 작은 경기장 · 쉬움 · 3판 2선승 */
  duel: { maps: PW_MAP_SETS.duel, rounds: 3, allies: 0, foes: 1, ffa: false, reward: 1000, diff: EASY, prep: true },
  /** 2대2: 중간 경기장 · 보통 · 3판 2선승 */
  pair: { maps: PW_MAP_SETS.pair, rounds: 3, allies: 1, foes: 2, ffa: false, reward: 2000, diff: NORMAL, prep: true },
  /** 3대3: 넓은 경기장 · 보통 · 3판 2선승 */
  trio: { maps: PW_MAP_SETS.trio, rounds: 3, allies: 2, foes: 3, ffa: false, reward: 3000, diff: NORMAL, prep: true },
  /** 5대5: 큰 경기장 · 어려움 · 3판 2선승 */
  squad: { maps: PW_MAP_SETS.squad, rounds: 3, allies: 4, foes: 5, ffa: false, reward: 5000, diff: HARD, prep: true },
  /** 토너먼트: 3명씩, 1대1로 차례로 (이긴 사람은 체력 그대로 다음 상대) · 보통 · 3판 2선승 */
  tourney: { maps: PW_MAP_SETS.duel, rounds: 3, allies: 2, foes: 3, ffa: false, reward: 3000, diff: NORMAL, prep: true },
  /** 대난투: 20명이 큰 들판에서 · 아주 어려움 · 단판 */
  brawl: { maps: PW_MAP_SETS.brawl, rounds: 1, allies: 0, foes: 19, ffa: true, reward: 20000, diff: BRUTAL, prep: true },
  /** 데스매치: 5명 · 처치할 때마다 다음 레벨(더 약한 캐릭터) · 21레벨에서 처치하면 승리 · 보통 · 단판 */
  gungame: { maps: PW_MAP_SETS.gungame, rounds: 1, allies: 0, foes: 4, ffa: true, reward: 10000, diff: NORMAL, prep: false },
};

/** 데스매치 레벨별 캐릭터: 1레벨이 가장 센 티어, 21레벨이 가장 약한 캐릭터 (관리자가 바꿔 가며 조정) */
export const PW_TIERS: readonly CharacterId[] = [
  "slayer", "oni", "titan", "eater", "wanderer", "remnant", "punk",
  "tracker", "imugi", "general", "apostle", "bedouin", "ninja", "brawler",
  "gunner", "mage", "engineer", "drifter", "warden", "mystic", "novice",
];

/** 패왕전 공통 수치 */
export const PW = {
  /** 준비방: 고르는 캐릭터 전용 패시브 수 · 전투에 나가면 무작위로 받는 공용 패시브 수 · 사용 아이템 수 */
  passives: 5,
  randomPassives: 5,
  uses: 2,
  /** 같은 패시브는 이만큼까지 (효과 아이템은 하나) · 사용 아이템은 서로 달라야 함 */
  stackMax: 3,
  /** 전투에 나가면 모두(AI 포함) 체력 가득 · 처음 보호막(없음) · 대신 모두가 받는 피해 배율 */
  shield: 0,
  taken: 0.6,
  heal: 0.8,
  /** 역할군 상성 (sim/pwMatchup): 전사가 마법사·암살자에게 받는 피해 · 원딜→전사 · 마법사→암살자 · 암살자→원딜·마법사 주는 피해 · 서포터 회복량 */
  roles: { warriorTaken: 1, rangedVsWarrior: 1, mageVsAssassin: 1.49, assassinVsRangedMage: 1.24, supportHeal: 1.3 },
  /** 시작하고 아무도 못 움직이는 틱 (화면에 3·2·1·START) */
  ready: 180,
  /** 3판 2선승: 판이 끝나고 다음 판 준비 전에 결과를 보여 주는 틱 */
  roundGap: 90,
  /** 3판 2선승: 마지막 사람이 쓰러진 뒤 그대로 보여 주는 틱 (그다음 자리 정리·준비) */
  roundWait: 180,
  /** AI 체력 = 캐릭터 최대 체력 × hpBase × 보정 · 한 번 공격 피해 = 캐릭터 공격력 × 무기 배율 × dmgBase × 보정 */
  hpBase: 2.6,
  dmgBase: 0.85,
  /** AI 공격 빠르기 = 무기 초당 공격 × rateBase × 보정 (최대 rateMax) */
  rateBase: 0.5,
  rateMax: 2,
  /** AI 이동 빠르기 = 캐릭터 이동 × moveBase × 보정 */
  moveBase: 0.75,
  /** 이 거리보다 짧은 무기는 근접으로 휘두름 · 원거리 사거리 범위 */
  meleeRange: 45,
  rangeMin: 70,
  rangeMax: 140,
  /** 기술(원거리 부채꼴 5발 · 근접 돌진 베기) 간격 틱 · 대시 쿨타임 */
  skillEvery: 300,
  dashEvery: 150,
  dashTicks: 10,
  dashSpeed: 3.2,
  /** 수풀에 숨으면 이 거리 안에서만 보임 · 보이는 거리 */
  hideNear: 40,
  sight: 240,
  /** AI가 안 보이게 된 상대를 마지막 본 곳(수풀 쪽)으로 찾아가 때리는 틱 */
  hunt: 180,
  /** 소환한 것 하나의 체력 (쓴 사람 최대 체력 × 이 값) */
  minionHp: 0.3,
  /** 풋내기 패시브: 체력 1로 버티는 틱 */
  standTicks: 180,
  /** 스킬 그림이 남는 시간 배율 (그림만) */
  fxLinger: 1.6,
  /** 다음 상대가 나오기까지(토너먼트) · 다시 살아나기까지(데스매치) 틱 */
  nextFoe: 90,
  respawn: 180,
  /** 데스매치 레벨 수 · 다시 살아난 뒤 무적 틱 */
  gunLevels: 21,
  spawnGuard: 120,
  /** 한 번(한 틱)에 받는 피해 최대: (최대 체력 + 처음 보호막)의 이 비율 (한 방에 쓰러지지 않게) */
  burstCap: 0.3,
  /** 거인 고철 수리(강타마다 회복) 배율: 맞으면 강타 에너지가 차서 끝없이 회복하지 않게 */
  titanRepair: 0.25,
  /** 숲 함정: 간격 · 튀어나와 있는 틱 · 피해 */
  trapEvery: 150,
  trapUp: 40,
  trapDmg: 14,
  /** 경기장 지형: 용암(0.5초마다) · 솟은 가시 피해 */
  lavaDmg: 9,
  /** 스킬: 피해 1배 · 독(0.5초마다, 스킬 피해 배율) · 소환한 것 이동 속도 */
  skillDmg: 8,
  skillDot: 0.15,
  minionSpeed: 1.1,
  /** AI가 틱마다 스킬을 써 볼 확률 */
  botSkill: 0.04,
  /** 거대한 평타 줄이기 (화면을 덮지 않게): 영사 실 길이 */
  silkReach: 150,
  /** 거대한 평타(학살자 대낫 콤보) 크기 배율 */
  bigBasic: 0.6,
  spikeDmg: 12,
  /** 모든 모드: 경기장에 사용 아이템·강화 구슬이 떨어지는 간격 · 바닥에 남는 최대 수(대난투는 더 많이) */
  dropEvery: 420,
  dropMax: 4,
  dropMaxBrawl: 10,
  /** 강화 구슬: 회복(최대 체력 비율) · 공격 속도·이동 속도 강화 틱 */
  orbHeal: 0.25,
  orbTicks: 300,
  orbMove: 1.4,
  /** 얼음 시계: 던지는 최대 거리 · 날아가는 틱 · 얼리는 범위 · 얼리는 틱 · 터진 뒤 그림 틱 */
  iceRange: 150,
  iceFly: 18,
  iceRadius: 40,
  iceStun: 90,
  iceShow: 24,
};
