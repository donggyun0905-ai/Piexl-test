// 레이드 보스 루시퍼 공용: 수치 · 싸움 상태 · 사람 고르기 · 피해 주기 (대시 무적·어둠의 세계는 맞지 않음)
import { createRng, deriveSeed, type Rng } from "../rng";
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { damagePlayer } from "./combat";
import { allPlayers, eachSeat } from "./party";
import { dashDodged, statusImmune } from "./remnant";
import type { LucFight } from "./lucTypes";
import type { PlayerState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 1페이즈 체력 · 2페이즈 체력 (enemyDefsRaid 루시퍼 체력 = 둘의 합) · 페이즈마다 체력 줄 수 · 악마의 불길이 나오기 시작하는 줄 */
  P1_HP: 88000,
  P2_HP: 160000,
  LINES: 99,
  FLAME_LINES: 30,
  /** 기본 공격 사이 (틱) · 2페이즈 */
  ATK_GAP: 85,
  ATK_GAP_2: 65,
  /** 피해: 어둠 불기둥 · 별 고리 · 가시 고리 · 지진파 · 검기 · X자 · 보라 구 */
  FIRE: 42,
  MINE: 32,
  CROWN: 48,
  WAVE: 36,
  SLASH: 70,
  X: 50,
  ORB: 55,
  /** 상태이상 틱: 화상 · 독 · 감속 · 기절 · 치유 감소(50%) */
  BURN: 240,
  POISON: 240,
  SLOW: 150,
  STUN: 45,
  CUT: 360,
  /** 치유 감소 배율 */
  CUT_MUL: 0.5,
  /** 흰색 돔 밖에 있던 사람이 받는 피해 (최대 체력 비율) */
  DOME_CUT: 0.8,
  /** 석화의 빔 간격 · 기둥이 남아 있으면 주는 보호막 (겹치지 않고 이 값으로 다시 채움) */
  BEAM_GAP: 3600,
  SHIELD: 10000,
};
export { R as LUC_RULES };

/** 싸움 상태 (처음이면 만듦) */
export function lucFight(s: RunState): LucFight {
  const r = s.raidBoss!;
  return (r.fight ??= { phase: 1, nextAtk: s.tick + 150, atkN: 0, pose: 0, poseEnd: 0, beamAt: s.tick + R.BEAM_GAP, down: 0, waves: [], mines: [], crowns: [], xs: [], orbs: [] });
}

/** 이 틱·이름으로 정해지는 랜덤 */
export const lucRng = (s: RunState, tag: string, k = 0): Rng => createRng(deriveSeed(s.seed, "luc", tag, s.tick, k));

/** 맞을 수 있는 사람 (살아 있고 어둠의 세계가 아님) [자리, 플레이어] */
export function lucTargets(s: RunState): [number, PlayerState][] {
  return allPlayers(s)
    .map((p, i) => [i, p] as [number, PlayerState])
    .filter(([, p]) => p.hp > 0 && !p.raidDark);
}

/** 상태이상: 화상 · 독 · 감속 · 기절 · 치유 감소 */
export type LucStatus = "burn" | "poison" | "slow" | "stun" | "cut";

/** 맞은 사람에게 상태이상 (상태이상 면역이면 없음) */
export function lucStatus(p: PlayerState, st: LucStatus | undefined): void {
  if (!st || statusImmune(p) || p.hp <= 0) return;
  if (st === "burn") p.dbBurn = Math.max(p.dbBurn ?? 0, R.BURN);
  else if (st === "poison") p.poison = Math.max(p.poison ?? 0, R.POISON);
  else if (st === "slow") p.dbSlow = Math.max(p.dbSlow ?? 0, R.SLOW);
  else if (st === "stun") p.dbStun = Math.max(p.dbStun ?? 0, R.STUN);
  else p.raidCut = Math.max(p.raidCut ?? 0, R.CUT);
}

/** 위험 표시(sim/hazards)로 맞았을 때: 그 공격의 상태이상 (from 이름) */
const HAZARD_STATUS: Record<string, LucStatus> = { fire: "burn", spin: "slow", sweep: "stun", rain: "poison", chainx: "slow", ice: "slow", gold: "cut", meteor: "burn", hand: "stun", swordfall: "burn" };
export function hazardStatus(s: RunState, from: string | undefined): void {
  if (s.raidBoss && from) lucStatus(s.player, HAZARD_STATUS[from]);
}

/** 조건에 맞는 사람마다 피해 + 상태이상 (dodge: 대시 중이면 피함) */
export function lucHurt(s: RunState, dmg: number, hit: (p: PlayerState, seat: number) => boolean, dodge = true, st?: LucStatus): void {
  eachSeat(
    s,
    (i) => {
      const p = s.player;
      if (p.raidDark || !hit(p, i)) return;
      if (dodge && dashDodged(s)) return;
      const hp = p.hp;
      damagePlayer(s, dmg, "lucifer");
      if (p.hp < hp) lucStatus(p, st);
    },
    true,
  );
}

/** 원 안인지 */
export const near = (p: { x: number; y: number }, x: number, y: number, r: number) => (p.x - x) ** 2 + (p.y - y) ** 2 <= r * r;

/** 방 안 무작위 자리 (벽에서 margin 떨어짐) */
export function lucSpot(rng: Rng, margin = 40): [number, number] {
  return [ROOM_MIN_X + margin + rng.nextFloat() * (ROOM_MAX_X - ROOM_MIN_X - 2 * margin), ROOM_MIN_Y + margin + rng.nextFloat() * (ROOM_MAX_Y - ROOM_MIN_Y - 2 * margin)];
}

/** 체력 줄 하나 크기 (페이즈마다 다름) · 이 페이즈 바닥 체력 (1페이즈는 2페이즈 체력 위쪽만 셈) */
export const lucLineHp = (phase: 1 | 2) => (phase === 1 ? R.P1_HP : R.P2_HP) / R.LINES;
export const lucBase = (phase: 1 | 2) => (phase === 1 ? R.P2_HP : 0);

/** 페이즈 안 남은 체력 줄 */
export function lucLines(hp: number, phase: 1 | 2): number {
  return Math.max(0, Math.ceil((hp - lucBase(phase)) / lucLineHp(phase) - 1e-6));
}

/** 그림 칸을 잠깐 바꿈 */
export function lucPose(s: RunState, f: LucFight, pose: number, ticks = 40): void {
  f.pose = pose;
  f.poseEnd = s.tick + ticks;
}
