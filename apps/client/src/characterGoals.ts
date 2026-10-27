// 도전과제 캐릭터: 처음엔 파수꾼·떠돌이·마법사만 열려 있고, 나머지는 캐릭터에 어울리는 도전과제를 이루면 열림.
// 테스트 중에는 전부 열림 (testFlags.TEST_OPEN)
import type { CharacterId } from "@pixel-rogue/shared";
import { loadAchievements } from "./records";
import { TEST_OPEN } from "./testFlags";

/** 테스트 중: 전부 열림 (testFlags) */
export const TEST_ALL_CHARACTERS = TEST_OPEN;

/** 캐릭터 → 열리는 도전과제 (없으면 처음부터 열림) */
export const CHARACTER_GOALS: Partial<Record<CharacterId, string>> = {
  /** 음양사: 첫 보스를 물리침 (퇴마) */
  mystic: "firstBoss",
  /** 격투가: 한 판에 적 70마리 (맨몸 난투) */
  brawler: "kills70",
  /** 야수: 한 판에 적 30마리 (사냥 본능) */
  beast: "kills30",
  /** 기계공학자: 한 판에 상점에서 4번 사기 (부품 모으기) */
  engineer: "shopper",
  /** 원소술사: 한 판에 패시브 5개 (원소 모으기) */
  elementalist: "passives5",
  /** 의사: 4층까지 살아남기 */
  doctor: "floor4",
  /** 베두인: 5층까지 (먼 길을 걷는 사막의 전사) */
  bedouin: "floor5",
  /** 거너: 한 판에 적 120마리 (사냥꾼) */
  gunner: "hunter",
  /** 장수: 한 판에 보스 3마리 (일기당천) */
  general: "boss3",
  /** 이무기: 6층까지 (하늘로 오르는 용) */
  imugi: "floor6",
  /** 악의 사도: 보스 10마리를 쓰러뜨림 (누적, 영혼을 모음) */
  apostle: "bosses10",
  /** 버려진 자들: 10판 (넘어져도 다시 일어나는 골목 아이들) */
  abandoned: "runs10",
  /** 거인: 한 판에 패시브 10개 (기계팔을 계속 고쳐 붙임) */
  titan: "passives10",
  /** 오니: 한 판에 돈 300 (도깨비 방망이 금 나와라 뚝딱) */
  oni: "gold300",
  /** 닌자: 보스를 한 대도 안 맞고 물리침 (그림자처럼) */
  ninja: "flawlessBoss",
  /** 소환술사: 한 판에 적 170마리 (군단) */
  summoner: "kills170",
  /** 시간술사: 12분 안에 클리어 (시간을 다룸) */
  chronomancer: "fastClear",
  /** 이드라: 5번 클리어 (세계수가 자라듯 천천히) */
  idra: "wins5",
  /** 변희: 적 1000마리 (누적, 온갖 동물을 만나 봄) */
  byeonhui: "kills1000",
  /** 플라이: 10분 안에 클리어 (빠른 비행) */
  fly: "swiftClear",
  /** 장로: 50판 (오랜 세월) */
  elder: "runs50",
  /** 렌: 누적 보스 50 (대지처럼 버팀) */
  ren: "bosses50",
  /** 정령사: 누적 5000마리 (정령들과 오래 함께) */
  spiritist: "kills5000",
  plague: "kills5000",
  slayer: "runs50",
  eater: "kills5000",
  mukin: "wins5",
  samyeol: "kills5000",
  automata: "kills5000",
  rider: "kills5000",
  bomber: "kills5000",
  artifacter: "kills5000",
  punk: "kills5000",
  tracker: "kills5000",
  forgotten: "kills5000",
  remnant: "kills5000",
  wanderer: "kills5000",
  /** 풋내기: 첫 클리어 (처음부터 다시 시작하는 도전) */
  novice: "clearRun",
};

/** 이 캐릭터를 고를 수 있는지 */
export function characterOpen(c: CharacterId, achieved: readonly string[] = loadAchievements()): boolean {
  const goal = CHARACTER_GOALS[c];
  return TEST_ALL_CHARACTERS || !goal || achieved.includes(goal);
}

/** 이 도전과제로 열리는 캐릭터 */
export const charactersFor = (achievement: string): CharacterId[] => (Object.keys(CHARACTER_GOALS) as CharacterId[]).filter((c) => CHARACTER_GOALS[c] === achievement);
