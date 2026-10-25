// 캐릭터 설명 모음: 언어 → 캐릭터 → 줄들 (스토리 '캐릭터' 탭 · 게임 능력치 창 아래 '캐릭터 설명 보기')
import type { CharacterId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import { GUIDE_EN_A } from "./enA";
import { GUIDE_EN_B } from "./enB";
import { GUIDE_JA_A } from "./jaA";
import { GUIDE_JA_B } from "./jaB";
import { GUIDE_KO_A } from "./koA";
import { GUIDE_KO_B } from "./koB";
import { GUIDE_EN_S2, GUIDE_JA_S2, GUIDE_KO_S2 } from "./s2";
import { GUIDE_EN_H2, GUIDE_JA_H2, GUIDE_KO_H2 } from "./h2";
import { GUIDE_EN_T2, GUIDE_JA_T2, GUIDE_KO_T2 } from "./t2";

const GUIDES: Record<Lang, Partial<Record<CharacterId, readonly string[]>>> = {
  ko: { ...GUIDE_KO_A, ...GUIDE_KO_B, ...GUIDE_KO_S2, ...GUIDE_KO_H2, ...GUIDE_KO_T2 },
  en: { ...GUIDE_EN_A, ...GUIDE_EN_B, ...GUIDE_EN_S2, ...GUIDE_EN_H2, ...GUIDE_EN_T2 },
  ja: { ...GUIDE_JA_A, ...GUIDE_JA_B, ...GUIDE_JA_S2, ...GUIDE_JA_H2, ...GUIDE_JA_T2 },
};

export const charGuide = (c: CharacterId, lang: Lang): readonly string[] => GUIDES[lang][c] ?? [];
