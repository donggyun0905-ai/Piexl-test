// 판 진행 중 기록: 업적 달성 알림, 이어하기 저장(혼자 하기, 입력 기록 포함), 끝났을 때 점수·최고 기록
import { achievedIn, arenaCleared, computeScore, type RunState } from "@pixel-rogue/shared";
import { recordRun } from "../shop/missions";
import { getPlayerId, syncUnlocks } from "../player";
import { apiPost } from "../api";
import { addAchievements, addCareer, addHistory, clearSavedRun, loadAchievements, loadCareer, saveBestIfHigher, saveFloorBest, saveRun } from "../records";
import type { Result } from "./GameOverlays";
import { clearRaidLog, recordRaidInput, saveRaidLog, startRaidLog } from "./raidLog";
import type { TickInput } from "@pixel-rogue/shared";
import type { DamageTracker } from "./damageNumbers";
import { buildSummary, TakenTracker } from "./runSummary";
import { noteRun } from "../codex/codexStore";
import { recordMedal } from "../medals/medals";
import { recordModeMedal } from "../medals/modeMedals";
import { createUnlockRun } from "../unlock/runStats";

/** coop: 협동 인원 (같이 낸 기록을 최근 기록에 남김, 최고 기록·이어하기는 혼자 하기만) */
export function createRunTracker(solo: boolean, seedText: string, run: RunState, onAchievement: (id: string) => void, coop = 0) {
  const known = new Set(loadAchievements());
  /** 이 판 전까지의 누적 기록 (누적 업적은 이것 + 이번 판) */
  const career = loadCareer();
  let finished = false;
  const earned: string[] = [];
  let savedKey = "";
  let historyAdded = false;
  let clearSent = false;
  const taken = new TakenTracker();
  const unlock = createUnlockRun(run);
  if (solo) startRaidLog(run);
  const save = () => {
    if (!solo || run.over) return;
    saveRun(seedText, run);
    saveRaidLog();
  };
  return {
    save,
    /** 틱마다 입력 (혼자 하기는 레이드 확인용으로 기록) */
    record(input: TickInput, next?: (input: TickInput) => void): void {
      if (solo) recordRaidInput(input);
      next?.(input);
    },
    /** 틱을 진행한 프레임마다 */
    advance(): void {
      taken.observe(run);
      unlock.observe();
      noteRun(run);
      for (const id of achievedIn(run, career)) {
        if (known.has(id)) continue;
        known.add(id);
        earned.push(id);
        addAchievements([id]);
        syncUnlocks();
        onAchievement(id);
      }
      // 이어하기: 방·층이 바뀔 때마다 저장
      const k = `${run.floor}/${run.roomId}`;
      if (k !== savedKey) {
        savedKey = k;
        save();
      }
    },
    /** 판이 끝났을 때 결과 */
    finish(damage?: DamageTracker): Result {
      this.advance(); // 마지막 틱에 달성한 업적 (클리어 등)
      if (!finished) {
        finished = true;
        // 일일 미션 (혼자 하기·일일 도전)
        if (solo || run.sudden) recordRun(run);
        unlock.finish();
        // 레이드 아레나·패왕전은 누적 기록·최고 기록에 넣지 않음 (순위표는 따로)
        if (!run.arenaLv && !run.pw && !run.pvp) addCareer(run);
      }
      const score = computeScore(run);
      let newBest = false;
      if (solo && run.arenaLv) {
        clearSavedRun();
        clearRaidLog();
      } else if (solo && run.hero) {
        // 영웅의 길도 최고 단계만 따로
        clearSavedRun();
        clearRaidLog();
        newBest = saveFloorBest("heroBest", run.floor);
      } else if (solo && run.endless) {
        // 무한 모드는 최고 층만 따로 (보통 판 최고 점수·기록에는 넣지 않음)
        clearSavedRun();
        clearRaidLog();
        newBest = saveFloorBest("endlessBest", run.floor);
      } else if (solo || coop > 0) {
        if (solo) {
          clearSavedRun();
          clearRaidLog();
        }
        const rec = {
          score: score.total,
          floor: run.floor,
          kills: run.kills,
          ticks: run.tick,
          won: run.won,
          characterId: run.player.characterId,
          seedText,
          date: new Date().toISOString().slice(0, 10),
          ...(coop > 0 ? { coop } : {}),
        };
        if (solo) newBest = saveBestIfHigher(rec);
        // 라스트 보스에 도전해 다시 끝난 판은 최근 기록에 한 번만
        if (!historyAdded) addHistory(rec);
        historyAdded = true;
      }
      const arenaLevel = run.arenaLv ? arenaCleared(run) : undefined;
      const summary = buildSummary(run, damage, taken.taken);
      // 라스트 보스를 깼으면 훈장 (혼자 하기만, 레이드 아레나는 빼고)
      if (solo && !run.arenaLv) recordMedal(run, summary);
      // 무한·아레나·영웅의 길 기록 훈장
      if (solo) recordModeMedal(run, summary);
      // 6층을 처음 깼으면(영웅의 길은 끝까지 깼으면, 따로) 걸린 시간을 서버로 (관리자 화면에서 캐릭터별 평균). 규칙이 다른 판은 빼고, 한 판에 한 번
      if (solo && run.won && !clearSent && !run.lastBoss && !run.endless && !run.arenaLv && !run.taboo && !run.randomKit && !run.sudden) {
        clearSent = true;
        void apiPost("/api/stats/clear", { player: getPlayerId(), character: run.player.characterId, ticks: run.tick, ...(run.hero ? { mode: "hero" } : {}) });
      }
      return { won: run.won, floor: run.floor, kills: run.kills, ticks: run.tick, score, newBest, achievements: [...earned], arenaLevel, summary };
    },
  };
}
export { withPet } from "./runPet";
