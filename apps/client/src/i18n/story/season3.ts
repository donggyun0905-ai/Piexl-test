// 아카식 레코드 시즌 3 본문 모음 (7~9장, 길면 앞·뒤 파일로 나눔)
import type { Chapter } from "../../story/storyData";
import { CH7_EN } from "./ch7.en";
import { CH7_JA } from "./ch7.ja";
import { CH7_KO } from "./ch7.ko";
import { CH8_EN } from "./ch8.en";
import { CH8_JA } from "./ch8.ja";
import { CH8_KO } from "./ch8.ko";
import { CH9A_EN } from "./ch9a.en";
import { CH9A_JA } from "./ch9a.ja";
import { CH9A_KO } from "./ch9a.ko";
import { CH9B_EN } from "./ch9b.en";
import { CH9B_JA } from "./ch9b.ja";
import { CH9B_KO } from "./ch9b.ko";

export const S3_CHAPTERS: Record<"ch7" | "ch8" | "ch9", Chapter> = {
  ch7: { ko: CH7_KO, en: CH7_EN, ja: CH7_JA },
  ch8: { ko: CH8_KO, en: CH8_EN, ja: CH8_JA },
  ch9: { ko: [...CH9A_KO, ...CH9B_KO], en: [...CH9A_EN, ...CH9B_EN], ja: [...CH9A_JA, ...CH9B_JA] },
};
