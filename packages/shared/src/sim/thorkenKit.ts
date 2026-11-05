// 토르켄 공용 도우미 (sim/thorken·thorkenBall·thorkenStorm이 같이 씀): 사슬 길이 · 게이지 · 맞히기 · 다른 파일 갈고리
import { THORKEN_PERKS as K } from "../itemsThorken";
import { THORKEN as T, type FlailStyle } from "../weaponsThorken";
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { blocksShot } from "./layout";
import { isBoss, strike } from "./s2Kit";
import type { DotKind, EnemyState, PlayerState, RunState } from "./types";
import { hasPerk, roomGrid, weaponOf } from "./util";

export const isThorken = (p: PlayerState) => p.characterId === "thorken";

export const flailOf = (p: PlayerState): FlailStyle => weaponOf(p).flail ?? { ball: "iron", power: 2.6 };

/** 사거리 배율: 사거리가 늘면 사슬도 같이 길어짐 (무기 기본 사거리 = 1) */
const rangeMul = (p: PlayerState) => Math.max(T.chainMinMul, p.stats.range / (weaponOf(p).range || 70));

/** 사슬 길이 (크라켄·따개비 사슬 · 사거리) */
export const chainLen = (p: PlayerState) => T.chain * (flailOf(p).chain ?? 1) * (hasPerk(p, "tkBarnacle") ? K.tkBarnacle.chain : 1) * rangeMul(p);

/** 철구공이 (x, y)에 못 들어감: 방 벽 · 방 안 벽·기둥 (구덩이는 넘어감) */
export function ballBlocked(s: RunState, x: number, y: number): boolean {
  const m = T.ballR * 0.5;
  if (x < ROOM_MIN_X + m || x > ROOM_MAX_X - m || y < ROOM_MIN_Y + m || y > ROOM_MAX_Y - m) return true;
  const g = roomGrid(s);
  return !!g && blocksShot(g, x, y);
}

/** 나 → (x, y)로 가다 막히기 바로 전 자리 */
export function lastFree(s: RunState, x0: number, y0: number, x1: number, y1: number): [number, number] {
  const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 4));
  let fx = x0;
  let fy = y0;
  for (let i = 1; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    const y = y0 + ((y1 - y0) * i) / steps;
    if (ballBlocked(s, x, y)) break;
    fx = x;
    fy = y;
  }
  return [fx, fy];
}

/** 폭풍 게이지 채우기 (갈매기 깃털) */
export function addGauge(p: PlayerState, n: number): void {
  p.tkGauge = Math.min(T.gaugeMax, (p.tkGauge ?? 0) + n * (hasPerk(p, "tkGull") ? K.tkGull.mul : 1));
}

/** 토르켄 공격 한 번 (빙해: 느려진 적은 더 아픔 · 밀침은 보스 빼고) */
export function tkHit(s: RunState, e: EnemyState, dmg: number, push = 0, kind?: DotKind): void {
  const slowed = flailOf(s.player).ball === "floe" && (e.slowTicks ?? 0) > 0;
  strike(s, e, dmg * (slowed ? T.floeTaken : 1), push, kind);
}

/** (x, y) 쪽으로 끌어당김 (보스 빼고) */
export function pullTo(e: EnemyState, x: number, y: number, pull: number): void {
  if (isBoss(e) || e.kind === "dummy") return;
  const dx = x - e.x;
  const dy = y - e.y;
  const d = Math.hypot(dx, dy);
  if (d < 2) return;
  const m = Math.min(pull, d - 1) / d;
  e.x += dx * m;
  e.y += dy * m;
}

/** 산호 갑옷: 철구공이 나가 있으면 받는 피해 줄어듦 (classTaken) */
export const thorkenTaken = (p: PlayerState) => (hasPerk(p, "tkCoral") && p.tkMode === 2 ? K.tkCoral.taken : 1);
/** 순풍의 돛: 대시 뒤 공격 속도 (classSpeed) */
export const thorkenSpeedMul = (p: PlayerState) => ((p.tkSail ?? 0) > 0 ? K.tkSail.speed : 1);
/** 화면용: 폭풍 게이지 (0~1) */
export const thorkenGauge = (p: PlayerState) => (p.tkGauge ?? 0) / T.gaugeMax;
