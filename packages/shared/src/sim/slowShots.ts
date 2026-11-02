// 시간 느리게 (펑크 신경 가속 · 잔영 회피 슬로우모션): 적 탄을 느리게 했다가 끝나면 원래 빠르기로
import type { RunState } from "./types";

/** 아직 느리게 하지 않은 적 탄을 mul배로 느리게 (느리게 한 탄 번호 목록을 돌려줌) */
export function slowShots(s: RunState, frozen: readonly number[] | undefined, mul: number): number[] {
  const set = new Set(frozen ?? []);
  for (const pr of s.projectiles) {
    if (pr.fromPlayer || set.has(pr.id)) continue;
    pr.vx *= mul;
    pr.vy *= mul;
    pr.ticksLeft = Math.ceil(pr.ticksLeft / mul);
    set.add(pr.id);
  }
  return [...set];
}

/** 느리게 했던 탄을 원래 빠르기로 */
export function restoreShots(s: RunState, frozen: readonly number[] | undefined, mul: number): void {
  const set = new Set(frozen ?? []);
  for (const pr of s.projectiles) {
    if (!set.has(pr.id)) continue;
    pr.vx /= mul;
    pr.vy /= mul;
    pr.ticksLeft = Math.ceil(pr.ticksLeft * mul);
  }
}
