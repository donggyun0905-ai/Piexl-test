// 검은 잔영의 첫 짐승 데스웜: 땅속에서는 예고 없이 다가옴 → 갑자기 플레이어 자리에 위험 표시가 뜨고 솟아오름(사방으로 바위)
// 솟는 데 1초 → 아주 긴 몸이 끝까지 빠져나오며 공중으로 날아 다른 땅에 머리부터 박힘(떨어질 자리에 표시, 사방으로 바위) → 꼬리까지 들어가면 다시 땅속
// 머리가 나와 있는 동안만 맞음 · 공중의 긴 몸에 닿아도 피해 · 체력 10% 아래면 필살기(wormUlt)
import { createRng, deriveSeed } from "../rng";
import { ENEMIES } from "../content";
import { half, hitDamage, shotDamage } from "./bossKit";
import { ultReady } from "./bossUlts";
import { damagePlayer } from "./combat";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { DIR16, enemyShot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { startWormUlt, updatePools, updateWormUlt } from "./wormUlt";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 땅속에서 다니는 틱 (절반 아래) · 땅속 빠르기 */
  UNDER: 150,
  UNDER_HALF: 100,
  /** 되살린 검은 데스웜 (예전의 빠른 주기) */
  UNDER_DARK: 130,
  UNDER_DARK_HALF: 90,
  UNDER_SPEED: 1.1,
  /** 갑자기 뜨는 표시가 터지기까지 · 솟는 범위(몸 반경에 더함) · 솟는 데 */
  WARN: 34,
  RISE_PAD: 8,
  RISE: 60,
  /** 공중으로 날아가는 거리 · 빠르기 (절반 아래) · 몸 길이 · 몸 굵기(반) */
  FLY: 260,
  FLY_SPEED: 1.7,
  FLY_SPEED_HALF: 2.2,
  BODY: 270,
  BODY_R: 20,
  /** 솟을 때·들어갈 때 바위 빠르기 */
  ROCK_SPEED: 1.5,
};
export { R as BOSS_WORM_RULES };

/** 땅속 (몸이 안 보이고 맞지 않음) */
export const wormHidden = (e: EnemyState) => e.phase === "walk" || e.phase === "windup";

/** 몸 둘레에서 사방으로 바위 (절반 아래면 16발, 아니면 8발) */
function rocks(s: RunState, e: EnemyState, x: number, y: number): void {
  const step = half(e) ? 1 : 2;
  for (let i = e.count % step; i < 16; i += step) {
    const d = DIR16[i]!;
    Object.assign(enemyShot(s, x + d[0] * e.r, y + d[1] * e.r, d[0], d[1], R.ROCK_SPEED, shotDamage(s)), { look: "rock" as const, r: 3 });
  }
}

function hide(e: EnemyState): void {
  e.phase = "walk";
  e.timer = e.dark ? (half(e) ? R.UNDER_DARK_HALF : R.UNDER_DARK) : half(e) ? R.UNDER_HALF : R.UNDER;
  e.air = true;
  e.immune = true;
  delete e.wormPath;
}

/** 공중의 몸 마디 자리 (꼬리 → 머리): 솟은 자리에서 들어갈 자리까지 길 위 [from, to] 구간 */
export function wormBody(path: number[], step = 12): [number, number][] {
  const [sx, sy, lx, ly, u] = path as [number, number, number, number, number];
  const len = Math.hypot(lx - sx, ly - sy) || 1;
  const from = Math.max(0, u - R.BODY);
  const to = Math.min(u, len);
  const out: [number, number][] = [];
  for (let d = from; d <= to; d += step) out.push([sx + ((lx - sx) * d) / len, sy + ((ly - sy) * d) / len]);
  return out;
}

export function updateWorm(s: RunState, e: EnemyState, toP: readonly [number, number], spawned: EnemyState[]): void {
  const p = s.player;
  updatePools(s, e);
  if (ultReady(e)) startWormUlt(s, e);
  if (e.ultAt !== undefined) return updateWormUlt(s, e, spawned);
  if (wormHidden(e)) {
    e.air = true;
    e.immune = true;
  }
  if (e.phase === "walk") {
    // 땅속: 표시 없이 플레이어 쪽으로
    e.x += toP[0] * R.UNDER_SPEED;
    e.y += toP[1] * R.UNDER_SPEED;
    if (e.timer > 0) return;
    e.phase = "windup";
    e.timer = R.WARN;
    e.x = p.x;
    e.y = p.y;
    addShape(s, R.WARN, { x: e.x, y: e.y, radius: e.r + R.RISE_PAD, damage: hitDamage(s) * 1.3, fx: "meteor" });
    return;
  }
  if (e.phase === "windup") {
    if (e.timer > 0) return;
    // 솟아오름: 이제 맞음
    e.phase = "act";
    e.aux = 0;
    e.air = false;
    e.immune = false;
    e.wormPath = [e.x, e.y, e.x, e.y, 0];
    rocks(s, e, e.x, e.y);
    e.count++;
    return;
  }
  const path = e.wormPath ?? [e.x, e.y, e.x, e.y, 0];
  e.aux = (e.aux ?? 0) + 1;
  if (e.aux < R.RISE) return;
  if (e.aux === R.RISE) {
    // 다 솟음: 플레이어 쪽(가까우면 무작위)으로 날아갈 자리를 정하고 표시
    const rng = createRng(deriveSeed(s.seed, "worm", e.count));
    const near = Math.hypot(p.x - path[0]!, p.y - path[1]!) < 30;
    let d = (near ? null : normalize(p.x - path[0]!, p.y - path[1]!)) ?? DIR16[rng.int(0, 15)]!;
    const m = e.r + 4;
    const land = (v: readonly [number, number]) =>
      [Math.max(ROOM_MIN_X + m, Math.min(ROOM_MAX_X - m, path[0]! + v[0] * R.FLY)), Math.max(ROOM_MIN_Y + m, Math.min(ROOM_MAX_Y - m, path[1]! + v[1] * R.FLY))] as const;
    // 벽에 막혀 너무 짧으면 반대쪽으로
    if (Math.hypot(land(d)[0] - path[0]!, land(d)[1] - path[1]!) < R.FLY / 2) d = [-d[0], -d[1]];
    const [lx, ly] = land(d);
    e.wormPath = [path[0]!, path[1]!, lx, ly, 0];
    const speed = half(e) ? R.FLY_SPEED_HALF : R.FLY_SPEED;
    addShape(s, Math.max(1, Math.round(Math.hypot(lx - e.x, ly - e.y) / speed)), { x: lx, y: ly, radius: e.r + R.RISE_PAD, damage: hitDamage(s), fx: "meteor" });
    e.dirX = d[0] >= 0 ? 1 : -1;
    return;
  }
  const wp = e.wormPath!;
  const len = Math.hypot(wp[2]! - wp[0]!, wp[3]! - wp[1]!);
  const before = wp[4]!;
  wp[4] = before + (half(e) ? R.FLY_SPEED_HALF : R.FLY_SPEED);
  const u = wp[4]!;
  if (u <= len) {
    e.x = wp[0]! + ((wp[2]! - wp[0]!) * u) / (len || 1);
    e.y = wp[1]! + ((wp[3]! - wp[1]!) * u) / (len || 1);
  } else if (before <= len) {
    // 머리가 땅에 박힘: 바위, 이제 맞지 않음 (꼬리는 아직 들어가는 중)
    e.x = wp[2]!;
    e.y = wp[3]!;
    rocks(s, e, e.x, e.y);
    e.air = true;
    e.immune = true;
  }
  // 공중의 긴 몸에 닿으면 피해
  const rr = R.BODY_R + p.r;
  if (wormBody(wp, 10).some(([x, y]) => (x - p.x) ** 2 + (y - p.y) ** 2 < rr * rr)) damagePlayer(s, ENEMIES.sandworm.contactDamage);
  if (u - R.BODY >= len) hide(e);
}
