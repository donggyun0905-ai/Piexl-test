// 잠시 뒤 폭발 (s.pendingBlasts): 때가 되면 터뜨림 · 달고 온 피해 출처로 셈 (sim/dmgSrc)
import { blastAt } from "./combat";
import { srcAs } from "./dmgSrc";
import type { RunState } from "./types";

/** 때가 된 잠시 뒤 폭발 터뜨리기 */
export function updatePending(s: RunState): void {
  if (s.pendingBlasts.length === 0) return;
  const due = s.pendingBlasts.filter((b) => b.tick <= s.tick);
  s.pendingBlasts = s.pendingBlasts.filter((b) => b.tick > s.tick);
  for (const b of due) srcAs(b.src, () => blastAt(s, b.x, b.y, b.radius, b.damage));
}
