// 능력치 계산 끝에 모드마다 덧씌우는 값 (items.recalcStats): 패왕전 보정 · 숨은 시련 어둠의 세계 사거리 상한
import { hiddenRange } from "./hiddenFoes";
import { pvpStats } from "./pvp";
import type { RunState } from "./types";

export function modeStats(s: RunState): void {
  pvpStats(s);
  s.player.stats.range = hiddenRange(s, s.player.stats.range);
}
