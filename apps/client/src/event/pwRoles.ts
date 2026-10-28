// 패왕전 역할군 (밴픽 탭·캐릭터 옆 노란 글씨): 원딜(원거리) · 근딜(근거리) · 힐러 · 탱커
import type { CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

export type PwRole = "ranged" | "melee" | "healer" | "tank";
export const PW_ROLES: readonly PwRole[] = ["ranged", "melee", "healer", "tank"];

const TANK: readonly CharacterId[] = ["warden", "titan", "oni", "mukin", "slayer", "ren", "abandoned"];
const HEALER: readonly CharacterId[] = ["doctor", "mystic", "apostle", "spiritist"];
const MELEE: readonly CharacterId[] = ["elementalist", "brawler", "beast", "summoner", "novice", "general", "imugi", "byeonhui", "fly", "eater", "rider", "punk", "wanderer"];

/** 캐릭터 역할 (나머지는 원딜) */
export const roleOf = (c: CharacterId): PwRole => (TANK.includes(c) ? "tank" : HEALER.includes(c) ? "healer" : MELEE.includes(c) ? "melee" : "ranged");

/** 캐릭터 옆 짧은 이름 · 탭 이름 */
export const ROLE_TAG: Record<PwRole, TextKey> = { ranged: "pwRoleRanged", melee: "pwRoleMelee", healer: "pwRoleHealer", tank: "pwRoleTank" };
export const ROLE_TAB: Record<PwRole, TextKey> = { ranged: "pwTabRanged", melee: "pwTabMelee", healer: "pwRoleHealer", tank: "pwRoleTank" };
