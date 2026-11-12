// 타격음 기준: 피해 숫자(game/damageNumbers)와 같게 "지난번보다 체력이 줄어든 적 수"를 셈
// (맞은 적 수가 그대로여도 · 상태이상·직접 깎는 피해여도 숫자가 뜨면 소리가 나게, 2026-11-12 사용자 요청)
import type { RunState } from "@pixel-rogue/shared";

/** 판마다 하나: 부를 때마다 지난번 뒤로 체력이 줄어든(맞은) 적 수 */
export function hitCounter(): (run: RunState) => number {
  let where = "";
  let hp = new Map<number, number>();
  return (run) => {
    const here = `${run.floor}/${run.roomId}`;
    const next = new Map<number, number>();
    let n = 0;
    for (const e of run.enemies) {
      const before = here === where ? hp.get(e.id) : undefined;
      if (before !== undefined && e.hp < before - 0.001) n++;
      next.set(e.id, e.hp);
    }
    where = here;
    hp = next;
    return n;
  };
}
