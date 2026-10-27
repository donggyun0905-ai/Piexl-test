// 레이드 명예의 전당: 라스트 보스 셋을 보스방에 들어가서 잡기까지 걸린 시간으로 보스별 순위.
// 서버는 순위 안에 드는 기록만 판 전체(1층 → 6층 클리어 → 라스트 보스 고르기 → 7층)를 입력 기록으로 다시 돌려 확인. 레이드 아레나(깬 레벨·시간)도 같은 방식
import type { CharacterId, LastBossKind } from "./content";
import { createRun, continueToLastFloor, stepSim } from "./sim/index";
import type { RunState, TickInput } from "./sim/types";

/** 명예의 전당 보스 (태초의 빛과 어둠은 plight 하나로) · 보스마다 보여 주는 순위 수 */
export const RAID_BOSSES: readonly LastBossKind[] = ["dragon", "godeater", "plight"];
export const RAID_BOARD_SIZE = 10;

/** 레이드에 쓸 수 있는 판: 혼자 하기에서 라스트 보스를 잡고 끝남 */
export function raidCleared(run: RunState): boolean {
  return run.won && run.lastBoss !== undefined && (RAID_BOSSES as readonly string[]).includes(run.lastBoss) && run.raidTicks !== undefined && !run.endless && !run.hero && !run.sudden && !run.taboo && !run.randomKit;
}

/** 입력 기록으로 판 전체 다시 돌리기: 6층을 깨고 끝나면 그 자리에서 라스트 보스에 도전 */
export function replayRaid(seed: number, characterId: CharacterId, unlocks: readonly string[], boss: LastBossKind, inputs: readonly TickInput[]): RunState {
  const run = createRun(seed, characterId, unlocks);
  for (const input of inputs) {
    if (run.over) {
      if (!run.won || run.lastBoss) break;
      continueToLastFloor(run, boss);
    }
    stepSim(run, input);
  }
  return run;
}

/** 레이드 아레나 순위표 수 (전체 기간) */
export const ARENA_BOARD_SIZE = 30;

/** 레이드 아레나 입력 기록으로 판 전체 다시 돌리기 */
export function replayArena(seed: number, characterId: CharacterId, unlocks: readonly string[], inputs: readonly TickInput[]): RunState {
  const run = createRun(seed, characterId, unlocks, false, false, true);
  for (const input of inputs) {
    if (run.over) break;
    stepSim(run, input);
  }
  return run;
}
