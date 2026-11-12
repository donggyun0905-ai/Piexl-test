// 스토리(시즌 1~3) 짜임: 진영과 소속 캐릭터 · 최종 보스 · 아카식 레코드 장(등장인물·본문 파일). 글자는 i18n/story
import { CHARACTERS, FACTION_MEMBERS as M, type CharacterId } from "@pixel-rogue/shared";
import type { Lang } from "../i18n";

/** 본문 한 줄: 글(서술) 또는 [말하는 사람, 대사] */
export type Para = string | readonly [Speaker, string];
export type Chapter = Record<Lang, readonly Para[]>;

/** 캐릭터가 아닌 말하는 사람: 버려진 자들 세 아이 · 보스 · 세 나라 왕 · 이름 모를 누군가 · 여럿 등 (이름은 i18n/story/world·world2) */
export type OtherSpeaker =
  | "raven" | "cain" | "jade" | "kids" | "primeval" | "unknown" | "all"
  | "demigod" | "sage" | "godeater" | "dragon"
  | "kingTerra" | "kingAscalon" | "kingVirdia" | "kings" | "generals"
  | "referee" | "crowd" | "citizen" | "watcher1" | "watcher2" | "watcher3"
  | "asmodeus" | "heavenApostle";

/** 말하는 사람: 캐릭터 또는 그 밖의 누군가 */
export type Speaker = CharacterId | OtherSpeaker;

/** 얼굴을 보스 그림(도감)으로 그리는 사람 */
export const BOSS_FACE: Partial<Record<Speaker, string>> = { primeval: "plight", demigod: "demigod", sage: "sage", godeater: "godeater", dragon: "dragon" };

/** 얼굴 그림 (캐릭터 시트 이름). 세 아이: 레이븐 = P2 총 소녀 · 카인 = P3 검 소년 · 제이드 = P1 방패 소년 · 천의 사도 = 악의 사도 */
export function speakerSheet(s: Speaker): string | null {
  if (s === "raven") return "abandoned2";
  if (s === "cain") return "abandoned3";
  if (s === "jade" || s === "kids") return "abandoned";
  if (s === "heavenApostle") return "apostle";
  return s in CHARACTERS ? s : null;
}

export type FactionId = "ascalon" | "terracore" | "helios" | "virdia" | "thalassia" | "seongguk" | "dawn" | "silber" | "akashic" | "outsider" | "archive";

/** 진영 색 · 소속 (게임 규칙 factionDefs.FACTION_MEMBERS를 씀 · 그림 이름: 버려진 자들은 세 아이 따로) */
export const FACTIONS: readonly { id: FactionId; color: string; members: readonly Speaker[] }[] = [
  { id: "ascalon", color: "#e8641a", members: M.ascalon },
  { id: "terracore", color: "#6b3e1f", members: M.terracore },
  { id: "helios", color: "#c83a4a", members: M.helios.flatMap((c): Speaker[] => (c === "abandoned" ? ["raven", "cain", "jade"] : [c])) },
  { id: "virdia", color: "#4ac86a", members: M.virdia },
  { id: "thalassia", color: "#2a6aff", members: M.thalassia },
  { id: "seongguk", color: "#ffd84a", members: M.seongguk },
  /** 새벽의 성흔: 악마 사냥꾼 (성흔 = 달빛의 힘, 게이지형) */
  { id: "dawn", color: "#ffffff", members: ["blast", "nailer", "scissors", "hellfist", "silverBullet", "blueFlame", "lunatic", "incision", "crusader"] },
  /** 실베르: 강대한 몬스터가 살던 북부를 지켜 온 나라 (처음엔 약하지만 패시브마다 성장) */
  { id: "silber", color: "#7ad0ff", members: M.silber },
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

export type ChapterId = "ch1" | "ch2" | "ch3" | "ch4" | "ch5" | "ch6" | "ch7" | "ch8" | "ch9";

/** 아카식 레코드 장: 시즌 · 등장인물 (얼굴) */
export const CHAPTERS: readonly { id: ChapterId; season: 1 | 2 | 3; cast: readonly Speaker[] }[] = [
  { id: "ch1", season: 1, cast: ["drifter", "warden", "mage", "beast", "mystic", "elementalist", "imugi"] },
  { id: "ch2", season: 1, cast: ["apostle", "brawler", "gunner", "engineer", "chronomancer", "general", "novice"] },
  { id: "ch3", season: 1, cast: ["raven", "cain", "jade", "ninja", "doctor", "titan", "bedouin", "summoner", "oni", "mystic"] },
  { id: "ch4", season: 2, cast: ["apostle", "plague", "slayer", "samyeol", "eater", "general"] },
  { id: "ch5", season: 2, cast: ["kingTerra", "elder", "tracker", "wanderer", "silk", "remnant", "novice", "demigod"] },
  { id: "ch6", season: 2, cast: ["demigod", "sage", "forgotten", "idra", "fly", "automata", "godeater", "primeval", "dragon"] },
  { id: "ch7", season: 3, cast: ["blueFlame", "hellfist", "incision", "crusader", "blast", "lunatic", "asmodeus", "heavenApostle", "brawler"] },
  { id: "ch8", season: 3, cast: ["lunatic", "nailer", "yuriel", "beatrice", "ian", "gabriel", "serena", "michaela", "eclipse", "slayer", "apostle"] },
  { id: "ch9", season: 3, cast: ["miryu", "madQueen", "hook", "tail", "levia", "wave", "thorken", "silverBullet", "general", "doctor", "leo", "pungryu", "onyx", "collector", "demigod", "idra", "fenrir", "asmodeus"] },
];

/** 한 쪽에 넣는 줄 수 */
export const PARAS_PER_PAGE = 9;
