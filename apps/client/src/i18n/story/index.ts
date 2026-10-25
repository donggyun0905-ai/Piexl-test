// 아카식 레코드 본문 모음 (장마다 한·영·일, 3장은 길어서 앞·뒤 파일로 나눔)
import type { Chapter, ChapterId } from "../../story/storyData";
import { CH1_EN } from "./ch1.en";
import { CH1_JA } from "./ch1.ja";
import { CH1_KO } from "./ch1.ko";
import { CH2_EN } from "./ch2.en";
import { CH2_JA } from "./ch2.ja";
import { CH2_KO } from "./ch2.ko";
import { CH3A_EN } from "./ch3a.en";
import { CH3A_JA } from "./ch3a.ja";
import { CH3A_KO } from "./ch3a.ko";
import { CH3B_EN } from "./ch3b.en";
import { CH3B_JA } from "./ch3b.ja";
import { CH3B_KO } from "./ch3b.ko";

export const CHAPTER_TEXT: Record<ChapterId, Chapter> = {
  ch1: { ko: CH1_KO, en: CH1_EN, ja: CH1_JA },
  ch2: { ko: CH2_KO, en: CH2_EN, ja: CH2_JA },
  ch3: { ko: [...CH3A_KO, ...CH3B_KO], en: [...CH3A_EN, ...CH3B_EN], ja: [...CH3A_JA, ...CH3B_JA] },
};
