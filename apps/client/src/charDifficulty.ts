// 캐릭터 난이도 (캐릭터 선택창 별 표시 · 처음 하는 사람 추천): 1 = 쉬움(추천, 맨 앞) · 2 = 보통 · 3 = 어려움(조작·규칙이 많음)
import type { CharacterId } from "@pixel-rogue/shared";

const EASY: readonly string[] = ["warden", "drifter", "mage", "gunner"];
const HARD: readonly string[] = ["abandoned", "titan", "oni", "idra", "byeonhui", "elder", "ren", "chronomancer", "summoner", "novice", "artifacter", "punk", "collector", "tracker", "remnant", "silk", "miner", "voyager", "pilgrim", "fallenKing", "scribe"];

export const charDifficulty = (id: CharacterId): 1 | 2 | 3 => (EASY.includes(id) ? 1 : HARD.includes(id) ? 3 : 2);
export const recommended = (id: CharacterId) => charDifficulty(id) === 1;
/** 별 글자 (★ 채움 · ☆ 빈칸) */
export const diffStars = (id: CharacterId) => "★".repeat(charDifficulty(id)) + "☆".repeat(3 - charDifficulty(id));
/** 전체 목록은 추천 캐릭터를 맨 앞으로 (나머지 차례는 그대로) */
export const recommendedFirst = (list: CharacterId[]) => [...list.filter(recommended), ...list.filter((c) => !recommended(c))];
