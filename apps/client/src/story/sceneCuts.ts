// 스토리 장면 컷: 장마다 몇 번째 문단부터 어떤 그림인지 (그림 목록·GPT 프롬프트 docs/STORY_ART.md)
// 그림 파일 public/story/{장}-{컷 번호}.webp 가 있으면 그 그림, 없으면 배경 종류(bg)로 그린 임시 그림 + 말하는 캐릭터 (story/sceneBg)
import type { ChapterId } from "./storyData";

export type SceneBg = "forest" | "castle" | "fire" | "room" | "mountain" | "night" | "dawn" | "sea" | "temple" | "snow" | "abyss" | "city";

export interface SceneCut {
  /** 이 문단(0부터)부터 */
  at: number;
  bg: SceneBg;
}

export const SCENE_CUTS: Record<ChapterId, readonly SceneCut[]> = {
  ch1: [
    { at: 0, bg: "forest" }, // 1 사냥꾼과 잠든 어린 용
    { at: 4, bg: "fire" }, // 2 어미 용의 아스칼론 습격
    { at: 7, bg: "room" }, // 3 의료소의 세 사람, 맹세
    { at: 13, bg: "forest" }, // 4 야수·원소술사가 새끼 용을 지킴
    { at: 19, bg: "mountain" }, // 5 산꼭대기 결전
    { at: 22, bg: "forest" }, // 6 비르디아 치유소의 대립
    { at: 29, bg: "night" }, // 7 그림자 속 누군가와 검은 약
    { at: 34, bg: "dawn" }, // 8 어미 용의 작별·세계수의 씨앗
  ],
  // 2~9장 컷은 그림 목록을 쓰면서 채움 (그 전에는 장 하나에 배경 하나)
  ch2: [{ at: 0, bg: "city" }],
  ch3: [{ at: 0, bg: "night" }],
  ch4: [{ at: 0, bg: "fire" }],
  ch5: [{ at: 0, bg: "castle" }],
  ch6: [{ at: 0, bg: "abyss" }],
  ch7: [{ at: 0, bg: "night" }],
  ch8: [{ at: 0, bg: "temple" }],
  ch9: [{ at: 0, bg: "sea" }],
};

/** 문단 i가 속한 컷 번호 (0부터) */
export function cutIndex(ch: ChapterId, i: number): number {
  const cuts = SCENE_CUTS[ch];
  let n = 0;
  while (n + 1 < cuts.length && cuts[n + 1]!.at <= i) n++;
  return n;
}

/** 컷 그림 파일 (있을 수도 없을 수도) */
export const cutImage = (ch: ChapterId, n: number): string => `${import.meta.env.BASE_URL}story/${ch}-${n + 1}.webp`;
