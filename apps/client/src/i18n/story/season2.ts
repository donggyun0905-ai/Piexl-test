// 아카식 레코드 시즌 2 본문 모음 (4~6장, 길면 앞·뒤 파일로 나눔)
import type { Chapter } from "../../story/storyData";
import { CH4_EN } from "./ch4.en";
import { CH4_JA } from "./ch4.ja";
import { CH4_KO } from "./ch4.ko";
import { CH5_EN } from "./ch5.en";
import { CH5A_JA } from "./ch5a.ja";
import { CH5A_KO } from "./ch5a.ko";
import { CH5B_JA } from "./ch5b.ja";
import { CH5B_KO } from "./ch5b.ko";
import { CH6A_EN } from "./ch6a.en";
import { CH6A_JA } from "./ch6a.ja";
import { CH6A_KO } from "./ch6a.ko";
import { CH6B_EN } from "./ch6b.en";
import { CH6B_JA } from "./ch6b.ja";
import { CH6B_KO } from "./ch6b.ko";

export const S2_CHAPTERS: Record<"ch4" | "ch5" | "ch6", Chapter> = {
  ch4: { ko: CH4_KO, en: CH4_EN, ja: CH4_JA },
  ch5: { ko: [...CH5A_KO, ...CH5B_KO], en: CH5_EN, ja: [...CH5A_JA, ...CH5B_JA] },
  ch6: { ko: [...CH6A_KO, ...CH6B_KO], en: [...CH6A_EN, ...CH6B_EN], ja: [...CH6A_JA, ...CH6B_JA] },
};
