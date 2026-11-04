// 처음 하는 사람을 위한 특별한 방 단계적 열기 (혼자 하기만): 화면이 unlocks에 "intro:N"(끝낸 판 수)을 넣으면
// 판 수에 따라 제단 → 단련 → 시련 → 비밀의 방·차원의 순례자 차례로 열림 (아직이면 그 방은 전투방). 표시가 없으면 모두 열림
import type { RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry): 끝낸 판이 이만큼이면 열림 */
const R = {
  /** 제단의 방 */
  ALTAR: 1,
  /** 단련의 방 · 대장간 */
  GYM: 2,
  /** 시련의 방 */
  TRIAL: 3,
  /** 비밀의 방(금 간 벽) · 차원의 순례자 */
  SECRET: 4,
};
export { R as INTRO_RULES };
export type IntroRoom = keyof typeof R;

/** 끝낸 판 수 (표시가 없으면 모두 열린 것으로) */
export function introRuns(s: Pick<RunState, "unlocks">): number {
  const tag = s.unlocks.find((u) => u.startsWith("intro:"));
  return tag ? Number(tag.slice(6)) || 0 : Number.POSITIVE_INFINITY;
}
/** 이 방이 열렸는지 */
export const introOpen = (s: Pick<RunState, "unlocks">, room: IntroRoom) => introRuns(s) >= R[room];
/** 아직 다 열리지 않은 판 (레이드 기록에서 뺌) */
export const introActive = (s: Pick<RunState, "unlocks">) => introRuns(s) < R.SECRET;
/** 다음에 열릴 방 (없으면 null, 화면 안내) */
export function introNext(runs: number): { room: IntroRoom; at: number } | null {
  const order: IntroRoom[] = ["ALTAR", "GYM", "TRIAL", "SECRET"];
  const room = order.find((k) => runs < R[k]);
  return room ? { room, at: R[room] } : null;
}

/** 층 시작 (rooms.startFloor): 아직 안 열린 방은 전투방으로 */
export function introRooms(s: RunState): void {
  const lock: Record<string, IntroRoom> = { altar: "ALTAR", gym: "GYM", forge: "GYM", trial: "TRIAL" };
  for (const r of s.map.rooms) if (lock[r.type] && !introOpen(s, lock[r.type]!)) r.type = "combat";
}
