// 패왕전 역할군 (화면·관리자 공용): 전사 · 원딜 · 마법사 · 암살자 · 서포터. 캐릭터마다 role = 이 순서 번호 (관리자 '패왕전 수치'에서 옮김)
import type { CharacterId } from "./characters";

export const PW_ROLE_IDS = ["warrior", "ranged", "mage", "assassin", "support"] as const;
export type PwRoleId = (typeof PW_ROLE_IDS)[number];

const MEMBERS: Record<PwRoleId, readonly CharacterId[]> = {
  warrior: ["beatrice", "levia", "thorken", "eclipse", "warden", "novice", "general", "imugi", "titan", "oni", "byeonhui", "mukin", "collector", "leo", "onyx"],
  ranged: ["drifter", "engineer", "gunner", "ninja", "chronomancer", "idra", "samyeol", "automata", "tracker", "madQueen"],
  mage: ["wave", "mage", "elementalist", "summoner", "pungryu", "elder", "ren", "plague", "bomber", "spiritist"],
  assassin: ["ian", "tail", "hook", "orca", "miryu", "brawler", "beast", "fly", "slayer", "eater", "bedouin", "abandoned", "rider", "punk", "remnant", "wanderer", "silk", "fenrir"],
  support: ["mystic", "doctor", "apostle", "artifacter", "forgotten"],
};

/** 캐릭터 → { role: 번호 } (관리자 수치 표) */
export const PW_ROLE_TABLE: Record<string, { role: number }> = Object.fromEntries(PW_ROLE_IDS.flatMap((r, i) => MEMBERS[r].map((c) => [c, { role: i }])));

/** 캐릭터 역할 (표에 없으면 원딜) */
export const pwRoleOf = (c: CharacterId): PwRoleId => PW_ROLE_IDS[PW_ROLE_TABLE[c]?.role ?? 1] ?? "ranged";
