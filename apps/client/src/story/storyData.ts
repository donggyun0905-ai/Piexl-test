// 스토리(시즌 1) 짜임: 진영과 소속 캐릭터 · 최종 보스 · 아카식 레코드 장(등장인물·본문 파일). 글자는 i18n/story
import type { CharacterId } from "@pixel-rogue/shared";
import type { Lang } from "../i18n";

/** 본문 한 줄: 글(서술) 또는 [말하는 사람, 대사] */
export type Para = string | readonly [Speaker, string];
export type Chapter = Record<Lang, readonly Para[]>;

/** 말하는 사람: 캐릭터 + 버려진 자들 세 아이 · 태초의 빛과 어둠 · 이름 모를 누군가 · 여럿 */
export type Speaker = CharacterId | "raven" | "cain" | "jade" | "kids" | "primeval" | "unknown" | "all";

/** 얼굴 그림 (캐릭터 시트 이름). 세 아이: 레이븐 = P2 총 소녀 · 카인 = P3 검 소년 · 제이드 = P1 방패 소년 */
export function speakerSheet(s: Speaker): string | null {
  if (s === "raven") return "abandoned2";
  if (s === "cain") return "abandoned3";
  if (s === "jade" || s === "kids") return "abandoned";
  if (s === "primeval" || s === "unknown" || s === "all") return null;
  return s;
}

export type FactionId = "ascalon" | "terracore" | "helios" | "virdia" | "akashic";

/** 진영 색 · 소속 (그림 이름: 버려진 자들은 세 아이 따로) */
export const FACTIONS: readonly { id: FactionId; color: string; members: readonly Speaker[] }[] = [
  { id: "ascalon", color: "#4a8aff", members: ["warden", "mage", "drifter", "general", "novice", "tracker", "forgotten", "remnant"] },
  { id: "terracore", color: "#e8a040", members: ["gunner", "engineer", "doctor", "chronomancer", "titan", "automata", "rider", "bomber", "artifacter", "punk"] },
  { id: "helios", color: "#c83a4a", members: ["apostle", "bedouin", "brawler", "ninja", "raven", "cain", "jade", "oni", "plague", "slayer", "eater", "mukin", "samyeol"] },
  { id: "virdia", color: "#4ac86a", members: ["beast", "summoner", "elementalist", "mystic", "imugi", "idra", "byeonhui", "fly", "elder", "ren", "spiritist"] },
  { id: "akashic", color: "#b89aff", members: ["scribe", "duck", "stargazer"] },
];

/** 최종 보스 (도감 적 그림) */
export const STORY_BOSSES = [
  { id: "dragon", kind: "dragon" },
  { id: "godeater", kind: "godeater" },
  { id: "primeval", kind: "plight" },
] as const;

export type ChapterId = "ch1" | "ch2" | "ch3";

/** 아카식 레코드 장: 등장인물 (얼굴) */
export const CHAPTERS: readonly { id: ChapterId; cast: readonly Speaker[] }[] = [
  { id: "ch1", cast: ["drifter", "warden", "mage", "beast", "mystic", "elementalist", "imugi"] },
  { id: "ch2", cast: ["apostle", "brawler", "gunner", "engineer", "chronomancer", "general", "novice"] },
  { id: "ch3", cast: ["raven", "cain", "jade", "ninja", "doctor", "titan", "bedouin", "summoner", "oni", "mystic"] },
];

/** 한 쪽에 넣는 줄 수 */
export const PARAS_PER_PAGE = 9;
