// 로비 펫을 판에 데려가기: 혼자 하기(아레나 빼고)·연습장·광야의 새벽에서만 (일일 도전·레이드 순위·아레나·배틀·협동은 공정하게 펫 없이)
import { recalcStats, type RunState } from "@pixel-rogue/shared";
import { equippedPet } from "../lobby/petStore";
import type { GameMode } from "./gameScreenProps";

/** 새로 시작한 판이면 데리고 갈 펫을 붙임 (이어하기는 저장된 그대로) */
export function withPet(run: RunState, mode: GameMode, arena: boolean): RunState {
  if (run.tick > 0 || run.pet || arena) return run;
  if (mode !== "solo" && mode !== "practice" && mode !== "swarm") return run;
  const pet = equippedPet();
  if (!pet) return run;
  run.pet = pet;
  // 펫 능력치(이동 속도·사거리)를 바로 반영
  recalcStats(run);
  return run;
}
