// 로비 칩: 도박 게임기(슬롯·주사위·하이로우)에서만 쓰는 놀이용 칩. 쿠폰·스킨으로 바꿀 수 없음.
// 하루(한국 시간)가 바뀌면 1000개보다 적을 때 1000개로 채워 줌. 다른 게임기에서 이기면 조금 받음
import { dayKey } from "@pixel-rogue/shared";
import { loadText, saveText } from "../storage";
import { TEST_OPEN } from "../testFlags";

/** 시험 서버(TEST_OPEN, 라이브에선 꺼짐): 칩 무한 (늘 이만큼, 써도 줄지 않음) */
const TEST_CHIPS = 999_999_999;

const DAILY = 1000;

export function loadChips(): number {
  if (TEST_OPEN) return TEST_CHIPS;
  try {
    const c = JSON.parse(loadText("chips") ?? "{}") as { n?: number; day?: string };
    const today = dayKey(Date.now());
    if (c.day !== today) {
      const n = Math.max(DAILY, c.n ?? DAILY);
      saveText("chips", JSON.stringify({ n, day: today }));
      return n;
    }
    return c.n ?? DAILY;
  } catch {
    return DAILY;
  }
}

export function addChips(delta: number): number {
  if (TEST_OPEN) return TEST_CHIPS;
  const n = Math.max(0, loadChips() + delta);
  saveText("chips", JSON.stringify({ n, day: dayKey(Date.now()) }));
  return n;
}
