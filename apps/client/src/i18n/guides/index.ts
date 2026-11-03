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
import { GUIDE_EN_T3, GUIDE_JA_T3, GUIDE_KO_T3 } from "./t3";
import { GUIDE_EN_ASC, GUIDE_JA_ASC, GUIDE_KO_ASC } from "./asc";
import { GUIDE_EN_ASC2, GUIDE_JA_ASC2, GUIDE_KO_ASC2 } from "./asc2";
import { GUIDE_EN_SECRET, GUIDE_JA_SECRET, GUIDE_KO_SECRET } from "./secret";
import { GUIDE_EN_ARCHIVE, GUIDE_JA_ARCHIVE, GUIDE_KO_ARCHIVE } from "./archive";
import { EVO_DESC } from "../items/morphEvo";
import { fateParts } from "../items/voyagerAbilities";

const GUIDES: Record<Lang, Partial<Record<CharacterId, readonly string[]>>> = {
  ko: { ...GUIDE_KO_A, ...GUIDE_KO_B, ...GUIDE_KO_S2, ...GUIDE_KO_H2, ...GUIDE_KO_T2, ...GUIDE_KO_T3, ...GUIDE_KO_ASC, ...GUIDE_KO_ASC2, ...GUIDE_KO_SECRET, ...GUIDE_KO_ARCHIVE },
  en: { ...GUIDE_EN_A, ...GUIDE_EN_B, ...GUIDE_EN_S2, ...GUIDE_EN_H2, ...GUIDE_EN_T2, ...GUIDE_EN_T3, ...GUIDE_EN_ASC, ...GUIDE_EN_ASC2, ...GUIDE_EN_SECRET, ...GUIDE_EN_ARCHIVE },
  ja: { ...GUIDE_JA_A, ...GUIDE_JA_B, ...GUIDE_JA_S2, ...GUIDE_JA_H2, ...GUIDE_JA_T2, ...GUIDE_JA_T3, ...GUIDE_JA_ASC, ...GUIDE_JA_ASC2, ...GUIDE_JA_SECRET, ...GUIDE_JA_ARCHIVE },
};

/** 운명의 여행자 운명 36칸: "⚀⚁ 버프(설명) / 기술(설명) / 능력(설명)" */
const FACE = "⚀⚁⚂⚃⚄⚅";
const fateLines = (lang: Lang) => Array.from({ length: 36 }, (_, i) => `${FACE[Math.floor(i / 6)]}${FACE[i % 6]} ${fateParts(i, lang).map((f) => `${f.name}(${f.desc})`).join(" / ")}`);

/** 변희는 각성 기술 목록(동물 무기 설명과 같은 글)을 뒤에 붙임 · 운명의 여행자는 운명 36칸 */
export const charGuide = (c: CharacterId, lang: Lang): readonly string[] => [...(GUIDES[lang][c] ?? []), ...(c === "byeonhui" ? Object.values(EVO_DESC).map((d) => d[lang]) : []), ...(c === "voyager" ? fateLines(lang) : [])];
