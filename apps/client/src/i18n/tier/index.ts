// 티어표 캐릭터마다 이유 글 (언어 → 캐릭터)
import type { CharacterId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import { TIER_EN } from "./en";
import { TIER_JA } from "./ja";
import { TIER_KO } from "./ko";
import { TIER_EN_DAWN, TIER_JA_DAWN, TIER_KO_DAWN } from "./dawn";
import { TIER_EN_SILBER, TIER_JA_SILBER, TIER_KO_SILBER } from "./silber";

const REASONS: Record<Lang, Partial<Record<CharacterId, string>>> = { ko: { ...TIER_KO, ...TIER_KO_DAWN, ...TIER_KO_SILBER }, en: { ...TIER_EN, ...TIER_EN_DAWN, ...TIER_EN_SILBER }, ja: { ...TIER_JA, ...TIER_JA_DAWN, ...TIER_JA_SILBER } };

export const tierReason = (c: CharacterId, lang: Lang): string => REASONS[lang][c] ?? "";
