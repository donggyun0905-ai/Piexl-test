// 미니 게임 공용: 랜덤(시드 랜덤을 시각으로 시작, 꾸밈용이라 게임 기록과 상관없음) · 섞기 · 칩 이긴 보상
import { createRng } from "@pixel-rogue/shared";

export const rng = createRng(Date.now() >>> 0);
export const rand = () => rng.nextFloat();
export const randInt = (min: number, max: number) => rng.int(min, max);

export function shuffle<T>(list: T[]): T[] {
  for (let i = list.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [list[i], list[j]] = [list[j]!, list[i]!];
  }
  return list;
}

/** 칩이 드는 게임이 아닌 게임기에서 이기면 받는 칩 */
export const WIN_CHIPS = 30;
