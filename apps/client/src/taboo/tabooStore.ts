// 금기의 서: 고른 금기를 이 기기에 기억 (다음 판에도 그대로)
import { cleanTaboo, type TabooSet } from "@pixel-rogue/shared";
import { loadText, saveText } from "../storage";

const KEY = "taboo";

export function loadTaboo(): TabooSet | undefined {
  try {
    const raw = loadText(KEY);
    return raw ? cleanTaboo(JSON.parse(raw)) : undefined;
  } catch {
    return undefined;
  }
}

export function saveTaboo(t: TabooSet | undefined): void {
  saveText(KEY, JSON.stringify(cleanTaboo(t) ?? {}));
}

/** 금기 점수 단계 (훈장 모양·글자 색): 0 없음 · 1 동 · 2 은 · 3 금 · 4 흑요석 · 5 전설 · 6 태초 */
export function tabooTier(pts: number): number {
  return pts <= 0 ? 0 : pts < 10 ? 1 : pts < 25 ? 2 : pts < 45 ? 3 : pts < 70 ? 4 : pts < 100 ? 5 : 6;
}

/** 무작위 캐릭터로 고르면 켜짐 (직업 무기·패시브·사용 아이템 2개를 무작위로 받고 시작). 캐릭터를 직접 고르면 꺼짐 */
let randomKit = false;
export const setRandomKit = (on: boolean): void => {
  randomKit = on;
};
export const randomKitOn = (): boolean => randomKit;
