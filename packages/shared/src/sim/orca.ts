// 오르카(탈라시아, 격투가): 누르고 있으면 4연속 콤보 (물보라 잽 → 소용돌이 훅 → 물기둥 어퍼 → 상어 기공파, sim/orcaMoves)
// 움직이며 때려도·대시해도 콤보가 이어짐 (자유롭게) · 때릴수록 해방 게이지 → 가득 차면 대시가 '범고래 돌파'
import { TICK_RATE } from "../constants";
import { ORCA_PERKS as K } from "../itemsOrca";
import { ORCA as O } from "../weaponsOrca";
import { freeTick, launchDart } from "./orcaFree";
import { breachTick, geysers, sharksTick, sharkWave, spray, startBreach, whirl } from "./orcaMoves";
import { roomKey } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { hasPerk } from "./util";

const MOVES = [spray, whirl, geysers, sharkWave];

/** 방이 바뀌면 상어·장판을 거둠 (게이지는 남김) */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.ocRoom === key) return;
  p.ocRoom = key;
  resetOrca(p, true);
}

/** 대시를 막 시작했는지: 게이지가 가득이면 범고래 돌파 · 파도 타기는 다음 타격 강화·콤보 한 단계 건너뜀 */
function dashCheck(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  const start = dashing && !p.ocDash;
  p.ocDash = dashing;
  if (!start) return;
  if ((p.ocTide ?? 0) >= O.tideMax) {
    startBreach(s);
    p.ocDash = false;
    return;
  }
  if (p.ocStep) p.attackCooldown = 0;
  if (p.ocStep && (p.ocGap ?? 0) < O.comboGap) p.ocGap = 0;
  if (hasSurf(p)) {
    p.ocSurf = K.ocSurf.ticks;
    if (p.ocStep) p.ocStep = Math.min(3, p.ocStep + 1);
  }
}

const hasSurf = (p: PlayerState) => hasPerk(p, "ocSurf");

/** 틱마다 (권갑 무기를 들었을 때 player에서) */
export function orcaTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  sharksTick(s);
  if (p.ocSurf) p.ocSurf--;
  if (p.ocBreach) {
    breachTick(s);
    return;
  }
  dashCheck(s);
  if (p.ocBreach) return;
  freeTick(s);
  p.ocGap = (p.ocGap ?? 0) + 1;
  if (p.ocGap > O.comboGap) p.ocStep = 0;
  if (!want || p.attackCooldown > 0) return;
  const k = p.ocStep ?? 0;
  const surf = (p.ocSurf ?? 0) > 0 ? K.ocSurf.mul : 1;
  p.ocSurf = 0;
  MOVES[k]!(s, surf);
  launchDart(s);
  p.ocLast = { k, t: s.tick };
  p.ocStep = (k + 1) % MOVES.length;
  p.ocGap = 0;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * (O.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 (keepRoom: 방 이름·게이지는 남김) */
export function resetOrca(p: PlayerState, keepRoom = false): void {
  for (const k of ["ocSharks", "ocPools", "ocBreach", "ocDash", "ocSurf", "ocStep", "ocGap", "ocLast", "ocDarts", "ocBolt"] as const) delete p[k];
  if (!keepRoom) for (const k of ["ocRoom", "ocTide", "ocFree", "ocFree0"] as const) delete p[k];
}

export { isOrca, orcaTaken } from "./orcaMoves";
