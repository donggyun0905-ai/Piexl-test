// 지도 최종보스 도전 판 표시 (world/BossTry가 넣고 game/runTracker가 봄: 기록·업적·해금·순위에 넣지 않음)
import type { RunState } from "@pixel-rogue/shared";

const runs = new WeakSet<RunState>();
export const markBossTry = (r: RunState): void => void runs.add(r);
export const isBossTry = (r: RunState): boolean => runs.has(r);
