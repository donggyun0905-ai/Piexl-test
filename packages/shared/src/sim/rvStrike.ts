// 레이븐 때리기: 한 대 · 범위 · 줄 · 체크 붙이기·터뜨리기(체크메이트) · 예약 공격 넣기
import { ENEMIES } from "../content";
import { RV_PERKS as K } from "../itemsRaven";
import { RV_CHECK } from "../weaponsRaven";
import { damageEnemy } from "./combat";
import { srcFn } from "./dmgSrc";
import { hasRv, rvAlive, rvChecked } from "./rvKit";
import type { RvEvent } from "./rvTypes";
import type { EnemyState, RunState } from "./types";
import { addEffect, normalize } from "./util";

type Hit = { knock?: boolean; stun?: number; check?: boolean; pop?: boolean };

export const rvBoss = (e: EnemyState) => ENEMIES[e.kind].boss === true || e.kind === "dummy";

/** 체크메이트 한 방 (기본 패시브 출처로 따로 셈) */
const mateHit = srcFn("rvCheck", () => (s: RunState, e: EnemyState, dmg: number, dx: number, dy: number) => damageEnemy(s, e, dmg, dx, dy, false));

/** 체크 붙이기 */
export function putCheck(s: RunState, e: EnemyState): void {
  if (!rvAlive(e)) return;
  if (!rvChecked(s, e)) addEffect(s, { kind: "rvCheck", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 8, maxTicks: 16 });
  e.rvCheck = s.tick + RV_CHECK.ticks;
}

/** 체크가 붙은 적이면 터뜨림: 금빛 왕관과 큰 피해 · 연쇄 체크 · 템포 */
export function popCheck(s: RunState, e: EnemyState): void {
  if (!rvChecked(s, e)) return;
  const p = s.player;
  delete e.rvCheck;
  addEffect(s, { kind: "rvMatePop", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 16, maxTicks: 22 });
  mateHit(s, e, p.stats.damage * RV_CHECK.mul, 0, 0);
  if (hasRv(p, "rvChain"))
    for (const o of s.enemies) if (o !== e && rvAlive(o) && (o.x - e.x) ** 2 + (o.y - e.y) ** 2 <= (K.rvChain.r + o.r) ** 2) putCheck(s, o);
  if (hasRv(p, "rvTempo")) for (const [i, v] of (p.rvSkillCd ?? []).entries()) p.rvSkillCd![i] = Math.max(0, v - K.rvTempo.cut);
}

/** 한 대 · 기절(보스 빼고) · 체크 붙이기 · 체크 터뜨리기 */
export function rvHit(s: RunState, e: EnemyState, dmg: number, o: Hit = {}): void {
  if (!rvAlive(e)) return;
  const p = s.player;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  const pop = o.pop && rvChecked(s, e);
  damageEnemy(s, e, dmg, d[0], d[1], !!o.knock);
  if (o.stun && !rvBoss(e) && e.hp > 0) e.stunTicks = Math.max(e.stunTicks ?? 0, o.stun);
  if (pop) popCheck(s, e);
  else if (o.check) putCheck(s, e);
}

/** 범위 안 적 모두 · 맞힌 수 */
export function rvArea(s: RunState, x: number, y: number, r: number, dmg: number, o: Hit = {}): number {
  let n = 0;
  for (const e of s.enemies) {
    if (!rvAlive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (r + e.r) ** 2) continue;
    rvHit(s, e, dmg, o);
    n++;
  }
  return n;
}

/** 줄 위 적 모두 (x,y에서 dx,dy 쪽으로 len, 너비 w) */
export function rvLine(s: RunState, x: number, y: number, dx: number, dy: number, len: number, w: number, dmg: number, o: Hit = {}): void {
  for (const e of s.enemies) {
    if (!rvAlive(e)) continue;
    const t = Math.max(0, Math.min(len, (e.x - x) * dx + (e.y - y) * dy));
    if ((e.x - x - dx * t) ** 2 + (e.y - y - dy * t) ** 2 <= (w + e.r) ** 2) rvHit(s, e, dmg, o);
  }
}

/** 예약 공격 넣기 (지금 출처를 달고 감: srcRun 안이면 그 패시브) */
export function rvSchedule(s: RunState, ev: RvEvent): void {
  (s.player.rvEvents ??= []).push(ev);
}
