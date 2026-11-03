// 던전 받은 피해 정리 (쓰러졌을 때 화면이 보여 줌, 패왕전은 pvpRecap): 이 방에서 무엇에 얼마나 맞았는지 · 가장 큰 한 방 · 마지막 한 방
// combat.damagePlayer가 실제로 줄어든 체력을 적음 (방이 바뀌면 새로)
import { titanHurt } from "./titan";
import type { RunState } from "./types";

/** 맞은 것 하나: 출처(적 종류 · "env" 지형·상태이상 · "?" 모름) · 합 · 가장 큰 한 방 · 맞은 횟수 */
export interface HurtRow {
  by: string;
  dmg: number;
  max: number;
  n: number;
}

export interface HurtLogPlayerState {
  /** 이 방(층 × 1000 + 방)에서 받은 피해 · 마지막 한 방 */
  hurtLog?: { key: number; rows: HurtRow[]; last?: { by: string; dmg: number; tick: number } };
}

/** 실제로 줄어든 체력 기록 (combat.damagePlayer) */
export function logTaken(s: RunState, from: string | undefined, taken: number, env: boolean): void {
  if (taken <= 0 || s.pvp) return;
  const p = s.player;
  const key = s.floor * 1000 + s.roomId;
  let h = p.hurtLog;
  if (!h || h.key !== key) h = p.hurtLog = { key, rows: [] };
  const by = from ?? (env ? "env" : "?");
  let r = h.rows.find((x) => x.by === by);
  if (!r) h.rows.push((r = { by, dmg: 0, max: 0, n: 0 }));
  r.dmg += taken;
  r.max = Math.max(r.max, taken);
  r.n++;
  h.last = { by, dmg: taken, tick: s.tick };
}

/** 체력이 줄어든 뒤 (combat.damagePlayer): 거인 기계팔 에너지 · 받은 피해 기록 */
export function hpLost(s: RunState, dmg: number, taken: number, from: string | undefined, env: boolean): void {
  titanHurt(s, dmg);
  logTaken(s, from, taken, env);
}
