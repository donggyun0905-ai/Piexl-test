// 능력치 계산 끝에 덧씌우는 값 (items.recalcStats): 가브리엘 공격력 한도(넘는 만큼 체력) · 패왕전 보정 · 숨은 시련 어둠의 세계 사거리 상한
import { gabrielStats } from "./gabrielKit";
import { hiddenRange } from "./hiddenFoes";
import { pvpStats } from "./pvp";
import type { RunState } from "./types";

export function modeStats(s: RunState): void {
  gabrielStats(s.player);
  pvpStats(s);
  s.player.stats.range = hiddenRange(s, s.player.stats.range);
}
