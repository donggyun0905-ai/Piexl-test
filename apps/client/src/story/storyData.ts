// 스토리(시즌 1·2) 짜임: 진영과 소속 캐릭터 · 최종 보스 · 아카식 레코드 장(등장인물·본문 파일). 글자는 i18n/story
import { CHARACTERS, type CharacterId } from "@pixel-rogue/shared";
import type { Lang } from "../i18n";

/** 본문 한 줄: 글(서술) 또는 [말하는 사람, 대사] */
export type Para = string | readonly [Speaker, string];
export type Chapter = Record<Lang, readonly Para[]>;

/** 캐릭터가 아닌 말하는 사람: 버려진 자들 세 아이 · 보스 · 세 나라 왕 · 이름 모를 누군가 · 여럿 등 (이름은 i18n/story/world·world2) */
export type OtherSpeaker =
  | "raven" | "cain" | "jade" | "kids" | "primeval" | "unknown" | "all"
  | "demigod" | "sage" | "godeater" | "dragon"
  | "kingTerra" | "kingAscalon" | "kingVirdia" | "kings" | "generals"
  | "referee" | "crowd" | "citizen" | "watcher1" | "watcher2" | "watcher3";

/** 말하는 사람: 캐릭터 또는 그 밖의 누군가 */
export type Speaker = CharacterId | OtherSpeaker;

/** 얼굴을 보스 그림(도감)으로 그리는 사람 */
export const BOSS_FACE: Partial<Record<Speaker, string>> = { primeval: "plight", demigod: "demigod", sage: "sage", godeater: "godeater", dragon: "dragon" };

/** 얼굴 그림 (캐릭터 시트 이름). 세 아이: 레이븐 = P2 총 소녀 · 카인 = P3 검 소년 · 제이드 = P1 방패 소년 */
export function speakerSheet(s: Speaker): string | null {
  if (s === "raven") return "abandoned2";
  if (s === "cain") return "abandoned3";
  if (s === "jade" || s === "kids") return "abandoned";
  return s in CHARACTERS ? s : null;
}

export type FactionId = "ascalon" | "terracore" | "helios" | "virdia" | "thalassia" | "akashic" | "outsider" | "archive";

/** 진영 색 · 소속 (그림 이름: 버려진 자들은 세 아이 따로) */
export const FACTIONS: readonly { id: FactionId; color: string; members: readonly Speaker[] }[] = [
  { id: "ascalon", color: "#4a8aff", members: ["warden", "mage", "drifter", "general", "novice", "tracker", "forgotten", "remnant", "wanderer", "silk", "pungryu", "leo"] },
  { id: "terracore", color: "#e8a040", members: ["gunner", "engineer", "doctor", "chronomancer", "titan", "automata", "rider", "bomber", "artifacter", "punk", "collector", "onyx"] },
  { id: "helios", color: "#c83a4a", members: ["apostle", "bedouin", "brawler", "ninja", "raven", "cain", "jade", "oni", "plague", "slayer", "eater", "mukin", "samyeol", "eclipse"] },
  { id: "virdia", color: "#4ac86a", members: ["beast", "summoner", "elementalist", "mystic", "imugi", "idra", "byeonhui", "fly", "elder", "ren", "spiritist", "fenrir"] },
  { id: "thalassia", color: "#3ac8e8", members: ["thorken", "levia", "tail"] },
  { id: "akashic", color: "#b89aff", members: ["scribe", "duck", "stargazer", "miner", "voyager", "zeus"] },
  /** 이방인: 세계의 틀을 벗어난 자들 */
  { id: "outsider", color: "#5ae0d0", members: ["pilgrim", "fallenKing"] },
  /** 서고의 감시자: 한정 캐릭터 (뽑기) */
  { id: "archive", color: "#ffb84a", members: ["lux"] },
];

/** 최종 보스 (도감 적 그림) · 시즌 */
export const STORY_BOSSES = [
  { id: "dragon", kind: "dragon", season: 1 },
  { id: "godeater", kind: "godeater", season: 1 },
  { id: "primeval", kind: "plight", season: 1 },
  { id: "umbra", kind: "umbra", season: 2 },
  { id: "demigod", kind: "demigod", season: 2 },
  { id: "sage", kind: "sage", season: 2 },
] as const;

export type StoryBossId = (typeof STORY_BOSSES)[number]["id"];

export type ChapterId = "ch1" | "ch2" | "ch3" | "ch4" | "ch5" | "ch6";

/** 아카식 레코드 장: 시즌 · 등장인물 (얼굴) */
export const CHAPTERS: readonly { id: ChapterId; season: 1 | 2; cast: readonly Speaker[] }[] = [
  { id: "ch1", season: 1, cast: ["drifter", "warden", "mage", "beast", "mystic", "elementalist", "imugi"] },
  { id: "ch2", season: 1, cast: ["apostle", "brawler", "gunner", "engineer", "chronomancer", "general", "novice"] },
  { id: "ch3", season: 1, cast: ["raven", "cain", "jade", "ninja", "doctor", "titan", "bedouin", "summoner", "oni", "mystic"] },
  { id: "ch4", season: 2, cast: ["apostle", "plague", "slayer", "samyeol", "eater", "general"] },
  { id: "ch5", season: 2, cast: ["kingTerra", "elder", "tracker", "wanderer", "silk", "remnant", "novice", "demigod"] },
  { id: "ch6", season: 2, cast: ["demigod", "sage", "forgotten", "idra", "fly", "automata", "godeater", "primeval", "dragon"] },
];

/** 한 쪽에 넣는 줄 수 */
export const PARAS_PER_PAGE = 9;
