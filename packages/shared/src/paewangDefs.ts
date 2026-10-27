// 이벤트 '패왕전': AI 캐릭터들과 겨루는 여섯 가지 대결 수치 (계산은 sim/paewang·paewangAi, 맵은 paewangMaps)
import type { CharacterId } from "./characters";
import type { PwArenaId } from "./paewangMaps";

export type PwMode = "duel" | "trio" | "squad" | "tourney" | "brawl" | "gungame";
export const PW_MODES: readonly PwMode[] = ["duel", "trio", "squad", "tourney", "brawl", "gungame"];

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
  arena: PwArenaId;
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
  /** 1대1: 작은 경기장 · 쉬움 */
  duel: { arena: "small", allies: 0, foes: 1, ffa: false, reward: 1000, diff: EASY, prep: true },
  /** 3대3: 넓은 경기장 · 보통 */
  trio: { arena: "wide", allies: 2, foes: 3, ffa: false, reward: 3000, diff: NORMAL, prep: true },
  /** 5대5: 함정과 나무가 우거진 큰 숲 · 어려움 */
  squad: { arena: "forest", allies: 4, foes: 5, ffa: false, reward: 5000, diff: HARD, prep: true },
  /** 토너먼트: 3명씩, 1대1로 차례로 (이긴 사람은 체력 그대로 다음 상대) · 보통 */
  tourney: { arena: "small", allies: 2, foes: 3, ffa: false, reward: 3000, diff: NORMAL, prep: true },
  /** 대난투: 20명이 큰 들판에서 · 아이템이 떨어짐 · 아주 어려움 */
  brawl: { arena: "field", allies: 0, foes: 19, ffa: true, reward: 20000, diff: BRUTAL, prep: true },
  /** 데스매치: 5명 · 처치할 때마다 다음 레벨(더 약한 캐릭터) · 21레벨에서 처치하면 승리 · 보통 */
  gungame: { arena: "manor", allies: 0, foes: 4, ffa: true, reward: 10000, diff: NORMAL, prep: false },
};

/** 데스매치 레벨별 캐릭터: 1레벨이 가장 센 티어, 21레벨이 가장 약한 캐릭터 (관리자가 바꿔 가며 조정) */
export const PW_TIERS: readonly CharacterId[] = [
  "slayer", "oni", "titan", "eater", "wanderer", "remnant", "punk",
  "tracker", "imugi", "general", "apostle", "bedouin", "ninja", "brawler",
  "gunner", "mage", "engineer", "drifter", "warden", "mystic", "novice",
];

/** 패왕전 공통 수치 */
export const PW = {
  /** 준비방: 고르는 패시브 수 · 사용 아이템 수 */
  passives: 10,
  uses: 2,
  /** 같은 패시브는 이만큼까지 (효과 아이템은 하나) · 사용 아이템은 서로 달라야 함 */
  stackMax: 3,
  /** 전투에 나가면 모두(AI 포함) 체력은 그대로 · 보호막 shield로 시작 */
  shield: 500,
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
  /** 다음 상대가 나오기까지(토너먼트) · 다시 살아나기까지(데스매치) 틱 */
  nextFoe: 90,
  respawn: 180,
  /** 데스매치 레벨 수 · 다시 살아난 뒤 무적 틱 */
  gunLevels: 21,
  spawnGuard: 120,
  /** 숲 함정: 간격 · 튀어나와 있는 틱 · 피해 */
  trapEvery: 150,
  trapUp: 40,
  trapDmg: 14,
  /** 대난투: 아이템이 떨어지는 간격 · 바닥에 남는 최대 수 */
  dropEvery: 420,
  dropMax: 8,
};
