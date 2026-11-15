// 세계 지도 장소 앞 버튼 글자 (아이콘 + 할 일 · WorldMode가 F 버튼에 씀)
import type { TextKey } from "../i18n";
import type { Place } from "./worldPlaces";

export const placeAction = (t: (k: TextKey) => string, p: Place): string =>p.use === "char" ? `👤 ${t("wpUseMirror")}` : p.use === "gear" ? `🎒 ${t("wpUseChest")}` : p.use === "book" ? `📖 ${t("wpUseBook")}` : p.use === "lobby" ? `🚪 ${t("wpGoIn")}` : p.gate === "boss" ? `💀 ${t("bgChallenge")}` : p.gate === "tower" ? `🗼 ${t("wpGoIn")}` : p.gate === "colosseum" ? `🏟 ${t("wpGoIn")}` : p.gate === "arena" ? `👑 ${t("wpGoIn")}` : p.gate === "swarm" ? `🏜 ${t("wpGoIn")}` : p.kind === "dungeon" ? `⚔ ${t("wpEnter")}` : p.kind === "npc" ? `💬 ${t("wpTalk")}` : p.kind === "door" ? `🚪 ${t("wpGoIn")}` : p.kind === "exit" ? `🚪 ${t("wpGoOut")}` : p.kind === "warp" ? `✨ ${t("wpWarpUse")}` : p.kind === "pass" ? `🚶 ${t("wpCross")}` : `📜 ${t("wpRead")}`;
