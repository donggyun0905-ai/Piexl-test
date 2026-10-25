// 캐릭터 설명 모음: 언어 → 캐릭터 → 줄들 (스토리 '캐릭터' 탭 · 게임 능력치 창 아래 '캐릭터 설명 보기')
import type { CharacterId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import { GUIDE_EN_A } from "./enA";
import { GUIDE_EN_B } from "./enB";
import { GUIDE_JA_A } from "./jaA";
import { GUIDE_JA_B } from "./jaB";
import { GUIDE_KO_A } from "./koA";
import { GUIDE_KO_B } from "./koB";

const GUIDES: Record<Lang, Partial<Record<CharacterId, readonly string[]>>> = {
  ko: { ...GUIDE_KO_A, ...GUIDE_KO_B },
  en: { ...GUIDE_EN_A, ...GUIDE_EN_B },
  ja: { ...GUIDE_JA_A, ...GUIDE_JA_B },
};

export const charGuide = (c: CharacterId, lang: Lang): readonly string[] => GUIDES[lang][c] ?? [];
