// 레이븐 공용 도우미 (sim/raven·rvStrike·rvProcs·rvUnits·rvSkills·classTaken이 같이 씀): 굴림·체스판 안·받는 피해·가까운 적
// 가벼운 것만 불러옴 (classTaken이 부름)
import { RV_PERKS as K } from "../itemsRaven";
import { createRng, deriveSeed } from "../rng";
import { RAVEN_WEAPONS } from "../weaponsRaven";
import type { EnemyState, RunState } from "./types";

type P = RunState["player"];

export const isRaven = (p: P) => p.characterId === "chessRaven";
export const hasRv = (p: P, id: string) => p.passives.includes(id as never);
export const rvAlive = (e: EnemyState) => e.hp > 0 && !e.immune && !e.pwHid;

/** 사거리 증가 배율 (util.reachOf와 같은 계산, 무거운 가져오기 없이) */
export const rvReach = (p: P) => Math.max(0.5, p.stats.range / RAVEN_WEAPONS.rvLance.range);

/** 시드 확률 (굴릴 때마다 다른 값) */
export function rvRoll(s: RunState, tag: string): number {
  const p = s.player;
  p.rvRolls = (p.rvRolls ?? 0) + 1;
  return createRng(deriveSeed(s.seed, tag, s.tick, p.rvRolls)).nextFloat();
}

/** 왕국의 체스판 절반 크기 (몸 가운데에서 가장자리까지) */
export const boardHalf = (p: P) => (K.rvBoard.cell * K.rvBoard.n * rvReach(p)) / 2;

/** 적이 체스판 안에 있는지 (체스판 패시브를 가진 레이븐만) */
export function inBoard(p: P, e: EnemyState): boolean {
  if (!isRaven(p) || !hasRv(p, "rvBoard")) return false;
  const h = boardHalf(p);
  return Math.abs(e.x - p.x) <= h && Math.abs(e.y - p.y) <= h;
}

/** 체스판 안 적이 받는 피해 배율 */
export const rvTaken = (s: RunState, e: EnemyState) => (inBoard(s.player, e) ? K.rvBoard.taken : 1);

/** 레이븐이 받는 피해 배율 (스테일메이트) */
export const rvHurtMul = (p: P) => (isRaven(p) && hasRv(p, "rvStale") ? K.rvStale.taken : 1);

/** 체크 표식이 붙은 적인지 */
export const rvChecked = (s: RunState, e: EnemyState) => (e.rvCheck ?? 0) > s.tick;

/** 가장 가까운 적 (x·y에서 dist 안, 바라보는 쪽을 조금 먼저) */
export function rvNearest(s: RunState, x: number, y: number, dist: number, fx = 0, fy = 0): EnemyState | null {
  let best: EnemyState | null = null;
  let score = Infinity;
  for (const e of s.enemies) {
    if (!rvAlive(e)) continue;
    const dx = e.x - x;
    const dy = e.y - y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > dist + e.r) continue;
    const v = d - (d > 0 ? ((dx * fx + dy * fy) / d) * 40 : 0);
    if (v < score) [best, score] = [e, v];
  }
  return best;
}

/** 체력이 가장 많은 적 (dist 안) — 킹 심판·그랜드 십자가 노림 */
export function rvStrongest(s: RunState, x: number, y: number, dist: number): EnemyState | null {
  let best: EnemyState | null = null;
  for (const e of s.enemies) {
    if (!rvAlive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (dist + e.r) ** 2) continue;
    if (!best || e.hp > best.hp) best = e;
  }
  return best;
}

/** 스킬 대기 배율 (템포) */
export const rvCdMul = (p: P) => (hasRv(p, "rvTempo") ? K.rvTempo.cd : 1);
