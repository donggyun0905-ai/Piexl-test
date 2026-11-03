// 도전과제 캐릭터: 처음엔 파수꾼·떠돌이·마법사만 열려 있고, 나머지는 캐릭터에 어울리는 도전과제를 이루면 열림 (첫 클리어로 5명쯤, 나머지는 캐릭터 클리어 사슬·특별한 클리어·누적).
// 테스트 중에는 전부 열림 (testFlags.TEST_OPEN)
import type { CharacterId } from "@pixel-rogue/shared";
import { loadAchievements } from "./records";
import { TEST_OPEN } from "./testFlags";

/** 테스트 중: 전부 열림 (testFlags) */
export const TEST_ALL_CHARACTERS = TEST_OPEN;

/** 캐릭터 → 열리는 도전과제 (없으면 처음부터 열림) · 2026-11-03 다시 나눔:
 *  ① 첫 클리어 한 판이면 5명 정도 (첫 보스·30마리·상점 4번·4층·첫 클리어)
 *  ② 그 캐릭터로 클리어하면 어울리는 다음 캐릭터 (파수꾼 → 격투가 → 장수 → 묵인 …)
 *  ③ 특별한 클리어 (보스 셋 무피격·상점 안 쓰고·체력 10 이하·10분 안)
 *  ④ 오래 하기 (판 수·승리·처치·보스·돈 누적) */
export const CHARACTER_GOALS: Partial<Record<CharacterId, string>> = {
  // ① 첫 클리어 한 판
  /** 음양사: 첫 보스를 물리침 (퇴마) */
  mystic: "firstBoss",
  /** 야수: 한 판에 적 30마리 (사냥 본능) */
  beast: "kills30",
  /** 기계공학자: 한 판에 상점에서 4번 사기 (부품 모으기) */
  engineer: "shopper",
  /** 의사: 4층까지 살아남기 */
  doctor: "floor4",
  /** 풋내기: 첫 클리어 (처음부터 다시 시작하는 도전) */
  novice: "clearRun",
  // ② 그 캐릭터로 클리어 → 다음 캐릭터
  /** 격투가: 파수꾼으로 클리어 (방패를 내려놓고 맨손으로) */
  brawler: "clearWarden",
  /** 거너: 떠돌이로 클리어 */
  gunner: "clearDrifter",
  /** 원소술사: 마법사로 클리어 */
  elementalist: "clearMage",
  /** 소환술사: 음양사로 클리어 (부적에서 소환으로) */
  summoner: "clearMystic",
  /** 오토마타: 기계공학자로 클리어 */
  automata: "clearEngineer",
  /** 역병의사: 의사로 클리어 */
  plague: "clearDoctor",
  /** 베두인: 야수로 클리어 */
  bedouin: "clearBeast",
  /** 장수: 격투가로 클리어 */
  general: "clearBrawler",
  /** 거인: 거너로 클리어 */
  titan: "clearGunner",
  /** 이무기: 원소술사로 클리어 */
  imugi: "clearElementalist",
  /** 정령사: 소환술사로 클리어 */
  spiritist: "clearSummoner",
  /** 라이더: 베두인으로 클리어 */
  rider: "clearBedouin",
  /** 묵인: 장수로 클리어 */
  mukin: "clearGeneral",
  /** 학살자: 닌자로 클리어 */
  slayer: "clearNinja",
  /** 사멸: 악의 사도로 클리어 */
  samyeol: "clearApostle",
  /** 이터: 역병의사로 클리어 */
  eater: "clearPlague",
  /** 펑크: 버려진 자들로 클리어 */
  punk: "clearAbandoned",
  /** 추적자: 거인으로 클리어 */
  tracker: "clearTitan",
  /** 붐버: 오니로 클리어 */
  bomber: "clearOni",
  /** 잔영: 학살자로 클리어 */
  remnant: "clearSlayer",
  /** 방랑객: 이무기로 클리어 */
  wanderer: "clearImugi",
  /** 잊혀진 자: 이드라로 클리어 */
  forgotten: "clearIdra",
  /** 영사: 변희로 클리어 */
  silk: "clearByeonhui",
  // ③ 특별한 클리어
  /** 닌자: 한 판에 보스 셋을 한 대도 안 맞고 (그림자처럼) */
  ninja: "flawless3",
  /** 시간술사: 상점을 한 번도 안 쓰고 클리어 (시간만으로) */
  chronomancer: "thrift",
  /** 악의 사도: 체력 10 이하로 클리어 (죽음 직전) */
  apostle: "closeCall",
  /** 플라이: 10분 안에 클리어 (빠른 비행) */
  fly: "swiftClear",
  // ④ 오래 하기
  /** 버려진 자들: 10판 (넘어져도 다시 일어나는 골목 아이들) */
  abandoned: "runs10",
  /** 이드라: 5번 클리어 (세계수가 자라듯 천천히) */
  idra: "wins5",
  /** 변희: 적 1000마리 (누적, 온갖 동물을 만나 봄) */
  byeonhui: "kills1000",
  /** 오니: 돈 1000 모으기 (누적, 도깨비 방망이 금 나와라 뚝딱) */
  oni: "gold1000",
  /** 장로: 50판 (오랜 세월) */
  elder: "runs50",
  /** 렌: 누적 보스 50 (대지처럼 버팀) */
  ren: "bosses50",
  /** 아티팩터: 돈 5000 모으기 (누적, 재료) */
  artifacter: "gold5000",
  /** 수집가: 20번 클리어 (누적, 모으고 또 모음) */
  collector: "wins20",
};

/** 이 캐릭터를 고를 수 있는지 */
export function characterOpen(c: CharacterId, achieved: readonly string[] = loadAchievements()): boolean {
  const goal = CHARACTER_GOALS[c];
  return TEST_ALL_CHARACTERS || !goal || achieved.includes(goal);
}

/** 이 도전과제로 열리는 캐릭터 */
export const charactersFor = (achievement: string): CharacterId[] => (Object.keys(CHARACTER_GOALS) as CharacterId[]).filter((c) => CHARACTER_GOALS[c] === achievement);
