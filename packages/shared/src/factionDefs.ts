// 진영 특징 시스템 수치 (로그만 · 패왕전·대결 제외): 아스칼론 맹세 · 테라코어 과열 · 비르디아 공생 정령 · 헬리오스 타락 · 성국 핵심 스킬 각성 · 탈라시아 물결 콤보 (계산 sim/faction*)
// 새벽의 성흔 성흔 게이지는 weaponsDawn.STIGMA · 진영 소속은 FACTION_MEMBERS (화면 story/storyData도 이것을 씀)
import type { CharacterId } from "./characters";

export type FactionTrait = "ascalon" | "terracore" | "virdia" | "helios" | "seongguk" | "thalassia";

/** 진영 소속 (특징 시스템이 붙는 진영만 · 버려진 자들은 헬리오스) */
export const FACTION_MEMBERS: Record<FactionTrait, readonly CharacterId[]> = {
  ascalon: ["warden", "mage", "drifter", "general", "novice", "tracker", "forgotten", "remnant", "wanderer", "silk", "pungryu", "leo"],
  terracore: ["gunner", "engineer", "doctor", "chronomancer", "titan", "automata", "rider", "bomber", "artifacter", "punk", "collector", "onyx"],
  helios: ["apostle", "bedouin", "brawler", "ninja", "abandoned", "oni", "plague", "slayer", "eater", "mukin", "samyeol", "eclipse"],
  virdia: ["beast", "summoner", "elementalist", "mystic", "imugi", "idra", "byeonhui", "fly", "elder", "ren", "spiritist", "fenrir"],
  thalassia: ["thorken", "levia", "tail", "madQueen", "hook", "orca", "wave", "miryu"],
  seongguk: ["beatrice", "ian", "gabriel", "serena", "rafael", "yuriel", "michaela"],
};

/** 탈라시아 물결 콤보: 맞히면 +1 (every 틱에 한 번까지, 여럿 맞혀도 1) · 맞으면 0 */
export const FACTION_TIDE = {
  /** 콤보가 오르는 가장 짧은 간격 틱 (빔처럼 매 틱 맞히는 무기도 1초에 10까지) */
  every: 6,
  /** 콤보 최대 */
  max: 100,
  /** 콤보 이만큼마다 물 피해 증가 한 단계 */
  step: 10,
  /** 한 단계당 물 피해 증가 (0.08 = +8%) */
  perStep: 0.08,
  /** 물 피해가 없는 캐릭터(매드퀸·후크): 콤보가 이 이상이면 맞힌 적에게 작은 물 피해가 같이 들어감 */
  splashFrom: 20,
  /** 그 작은 물 피해 (공격력 배율, 콤보 배율이 붙음) */
  splashMul: 0.1,
};

/** 헬리오스 타락 스택: 처치 +1 · 맞으면 -1 · 가득이면 폭주 (학살자 피의 학살 중에는 폭주를 미룸) */
export const FACTION_TAINT = {
  /** 타락 최대 */
  max: 30,
  /** 한 스택당 주는 피해 증가 (0.01 = +1%) */
  dmg: 0.01,
  /** 한 스택당 받는 피해 증가 (0.005 = +0.5%) */
  taken: 0.005,
  /** 맞을 때마다 줄어드는 스택 */
  hurtLoss: 1,
  /** 폭주 틱 (6초) */
  rampageTicks: 360,
  /** 폭주 중 공격 속도 배율 */
  rampageSpeed: 1.3,
  /** 폭주가 끝나면 남는 스택 */
  after: 15,
};

/** 테라코어 과열: 맞히면 열이 오르고(every 틱에 한 번까지) 저절로는 안 식음(방이 바뀌어도 그대로) · 100이면 과부하(공격 불가) · 열이 높을 때 대시하면 배출(증기 폭발)로만 비움 */
export const FACTION_HEAT = {
  /** 열이 오르는 가장 짧은 간격 틱 (계속 맞히면 4초쯤에 가득) */
  every: 6,
  /** 열 최대 */
  max: 100,
  /** 맞힐 때 오르는 열 */
  gain: 2.5,
  /** 공격하지 않은 틱마다 식는 열 (0 = 저절로 안 식음) · 식기 시작까지 틱 */
  cool: 0,
  coolDelay: 45,
  /** 열이 가득일 때 주는 피해 증가 (열에 비례, 0.25 = +25%) */
  dmg: 0.25,
  /** 과부하 틱 (2초, 공격 불가) · 끝나면 남는 열 */
  overloadTicks: 120,
  afterOverload: 50,
  /** 이 열 이상에서 대시하면 배출 · 증기 폭발 반지름 · 피해(공격력 배율) */
  ventFrom: 60,
  ventR: 60,
  ventMul: 1.5,
};

/** 아스칼론 맹세: 전투방에 들어설 때 맹세 하나 → 방을 끝낼 때 지켰으면 영광 +1 · 어기면 그 방에서만 약해짐 */
export const FACTION_OATH = {
  /** 맹세 카드가 가운데 떠 있는 틱 (그동안 방이 멈춤, 화면 render/oathCard와 맞춤) */
  introTicks: 100,
  /** 영광 최대 · 영광 1당 주는 피해 증가 */
  gloryMax: 10,
  gloryDmg: 0.02,
  /** 맹세를 어긴 방에서 주는 피해 배율 */
  brokenDmg: 0.85,
  /** 맞지 않기: 이 횟수까지는 괜찮음 */
  hits: 3,
  /** 빠르게 정리: 이 틱 안에 (15초) */
  swiftTicks: 900,
  /** 대시 절제: 이 횟수까지 */
  dashes: 2,
  /** 자리 지키기: 들어선 자리에서 이 거리 안 */
  holdR: 130,
};

/** 비르디아 공생 정령 10종 수치는 spiritDefs (시작할 때 3장 중 1장) */

/** 성국 핵심 스킬 각성: 스킬을 이만큼 쓰면 핵심 스킬이 각성 → 각성한 핵심 스킬을 쓰면 위력 증가 + 금빛 빛기둥 + 캐릭터마다 추가 공격 (한 번 쓰면 각성이 끝나고 다시 셈) */
export const FACTION_CORE = {
  /** 각성까지 스킬 사용 횟수 */
  uses: 12,
  /** 각성한 핵심 스킬을 쓴 뒤 이 틱 동안 주는 피해 배율 (스킬 효과가 이어지는 동안) */
  dmg: 1.3,
  window: 120,
  /** 쓸 때 둘레 금빛 빛기둥: 반지름 · 피해(공격력 배율) */
  pillarR: 70,
  pillarMul: 1.2,
};

/** 성국 각성 핵심 스킬의 추가 공격 (sim/factionCoreArts): 피해(공격력 배율) · 범위 반지름 · 대상 수(이안·라파엘·미카엘라) · 불탐/독 세기 · 속박·기절·독 틱 */
export const FACTION_CORE_ART = {
  mul: 2.2,
  r: 90,
  n: 6,
  burn: 0.6,
  root: 90,
  stun: 60,
  poison: 240,
};

/** 성국 캐릭터마다 핵심 스킬 (0부터: 0 = 1번 스킬) */
export const FACTION_CORE_SKILL: Partial<Record<CharacterId, number>> = { beatrice: 3, ian: 2, gabriel: 1, serena: 3, rafael: 3, yuriel: 3, michaela: 2 };
