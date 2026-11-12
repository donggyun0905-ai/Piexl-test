// 기어스 때리기: 한 대 (피해 숫자를 한 대마다 따로 기록) · 원 안 모두 · 나눠 때리는 공격 목록 처리
import { damageEnemy as damageEnemy_ } from "./combat";
import { srcEach, srcFn } from "./dmgSrc";
import { geDmgMul } from "./geKit";
import type { GeSeq } from "./geTypes";
import { alive, stun } from "./s2Kit";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, normalize } from "./util";
const damageEnemy = srcFn("geHit", () => damageEnemy_);

/** 한 대 + 화면용 기록 (한 대마다 따로 피해 숫자) · 밀지 않음 */
export function geStrike(s: RunState, e: EnemyState, dmg: number, fx = 0, fy = 0): void {
  if (e.hp <= 0) return;
  const p = s.player;
  if (p.geLogT !== s.tick) {
    p.geLogT = s.tick;
    p.geLog = [];
  }
  const d = normalize(e.x - fx, e.y - fy) ?? [p.faceX, p.faceY];
  const hp = e.hp;
  const c0 = e.critTick;
  e.critTick = undefined;
  damageEnemy(s, e, dmg * geDmgMul(p), d[0], d[1], false);
  const crit = e.critTick === s.tick;
  if (!crit) e.critTick = c0;
  const amt = hp - Math.max(0, e.hp);
  if (amt > 0) p.geLog!.push({ id: e.id, amt, crit });
}

/** (x, y) 둘레 r 안 적 모두 한 대씩 · 맞힌 수 */
export function geArea(s: RunState, x: number, y: number, r: number, dmg: number, stunTicks = 0): number {
  let n = 0;
  for (const e of alive(s)) {
    if (dist2(e, { x, y }) > (r + e.r) ** 2) continue;
    geStrike(s, e, dmg, x, y);
    if (stunTicks > 0) stun(e, stunTicks);
    n++;
  }
  return n;
}

/** 나눠 때리는 공격 넣기 (t = 0이면 이번 틱부터) */
export const geSeq = (s: RunState, q: GeSeq) => void (s.player.geSeqs ??= []).push(q);

/** 틱마다: 나눠 때리는 공격을 한 번씩 (적 한 명이면 그 적이 죽거나 사라지면 끝) */
export function seqTick(s: RunState): void {
  const p = s.player;
  if (!p.geSeqs?.length) return;
  for (const q of srcEach(p.geSeqs)) {
    if (--q.t > 0) continue;
    q.t = q.gap;
    q.left--;
    if (q.id !== undefined) {
      const e = s.enemies.find((x) => x.id === q.id);
      if (!e || e.hp <= 0) q.left = 0;
      else {
        geStrike(s, e, q.dmg, p.x, p.y);
        addEffect(s, { kind: "geGuardHit", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 6, maxTicks: 8 });
      }
      continue;
    }
    geArea(s, q.x, q.y, q.r, q.dmg, q.stun ?? 0);
    if (q.fx) addEffect(s, { kind: q.fx, x: q.x, y: q.y, dirX: p.faceX, dirY: p.faceY, size: q.r, maxTicks: 14 });
    q.stun = 0;
  }
  p.geSeqs = p.geSeqs.filter((q) => q.left > 0);
}

/** 바라보는 쪽 앞 자리 */
export const front = (s: RunState, d: number): [number, number] => [s.player.x + s.player.faceX * d, s.player.y + s.player.faceY * d];

/** (x, y)에서 가장 가까운 적 (dist 안) */
export function nearest(s: RunState, x: number, y: number, dist: number): EnemyState | undefined {
  let best: EnemyState | undefined;
  let bd = dist * dist;
  for (const e of alive(s)) {
    const d = dist2(e, { x, y });
    if (d < bd || (d === bd && best && e.id < best.id)) [best, bd] = [e, d];
  }
  return best;
}

/** 방향 (없으면 바라보는 쪽) */
export const dirTo = (s: RunState, x: number, y: number): [number, number] => normalize(x - s.player.x, y - s.player.y) ?? [s.player.faceX, s.player.faceY];
