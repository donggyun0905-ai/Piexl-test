// 방 설명 창(RoomGuide)을 열 때 처음 고를 방 (처음 만난 방 카드의 '자세히', game/RunGuide)
import type { PracticeRoom } from "@pixel-rogue/shared";

let wanted: PracticeRoom | null = null;
export const pickGuideRoom = (k: PracticeRoom) => void (wanted = k);
/** 한 번 읽으면 지움 */
export function takeGuideRoom(): PracticeRoom | null {
  const k = wanted;
  wanted = null;
  return k;
}
