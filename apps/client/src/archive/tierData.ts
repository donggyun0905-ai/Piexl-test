// 티어표: 단계마다 캐릭터 순서 (위가 셈) · 시즌 2 캐릭터 · 미리보기 캐릭터 고르기
// 사용자가 직접 해 본 표 + 허수아비 30초 측정(시작 무기)·생존 능력치를 맞춰 본 최종본 (이유 글은 i18n/tier)
import type { CharacterId } from "@pixel-rogue/shared";

export type TierId = "god" | "meal" | "mid" | "meh" | "trash";

export const TIERS: readonly { id: TierId; color: string; chars: readonly CharacterId[] }[] = [
  { id: "god", color: "#ff5a6a", chars: ["tracker", "novice", "oni", "silk", "slayer", "automata", "artifacter"] },
  {
    id: "meal",
    color: "#ffa64a",
    chars: ["spiritist", "apostle", "ninja", "summoner", "wanderer", "punk", "imugi", "samyeol", "gunner", "bedouin", "elder", "plague", "chronomancer", "byeonhui"],
  },
  { id: "mid", color: "#ffe066", chars: ["idra", "collector", "pungryu", "leo", "onyx", "doctor", "engineer", "forgotten", "eater", "drifter", "beast", "remnant", "warden", "elementalist"] },
  { id: "meh", color: "#7ad0ff", chars: ["brawler", "fly", "ren", "rider", "titan", "bomber", "general", "mukin", "mage", "mystic"] },
  { id: "trash", color: "#a08ab8", chars: ["abandoned"] },
];

/** 시즌 2 캐릭터 (비르디아·헬리오스·테라코어·아스칼론). 나머지는 시즌 1 */
export const SEASON2: ReadonlySet<CharacterId> = new Set<CharacterId>([
  "idra", "byeonhui", "fly", "elder", "ren", "spiritist",
  "plague", "slayer", "eater", "mukin", "samyeol",
  "automata", "rider", "bomber", "artifacter", "punk", "collector",
  "tracker", "forgotten", "remnant", "wanderer", "silk",
]);

export type TierView = "all" | "s1" | "s2";

export function tierChars(chars: readonly CharacterId[], view: TierView): CharacterId[] {
  return chars.filter((c) => view === "all" || (view === "s2") === SEASON2.has(c));
}
