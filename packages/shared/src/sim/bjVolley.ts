// 백인장 때리기: 한 대 · 범위 · 나눠 때리는 기술(난무·회전참·폭우·침격·감옥·팔연참·종언)을 틱마다 한 대씩 · 출혈·죽음 상태이상
import { BJ_PERKS as K } from "../itemsBaekinjang";
import { ENEMIES } from "../content";
import { bjAlive, bjNearest } from "./bjKit";
import type { BjVolley } from "./bjTypes";
import { damageEnemy } from "./combat";
import { pctHp } from "./pctHp";
import { dotDamage } from "./status";
import type { EnemyState, RunState } from "./types";
import { addEffect, normalize } from "./util";

const isBoss = (e: EnemyState) => ENEMIES[e.kind].boss === true || e.kind === "dummy";

/** 한 대 (밀지 않음: 연타가 많아서) · 준 피해 */
export function bjHit(s: RunState, e: EnemyState, dmg: number, knock = false): number {
  if (!bjAlive(e)) return 0;
  const p = s.player;
  const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
  const hp = e.hp;
  damageEnemy(s, e, dmg, d[0], d[1], knock);
  return hp - Math.max(0, e.hp);
}

/** 범위 안 적 모두 때림 (arc가 있으면 dx·dy 쪽 부채꼴만) · 맞힌 수 */
export function bjArea(s: RunState, x: number, y: number, r: number, dmg: number, opt: { arc?: number; dx?: number; dy?: number; knock?: boolean } = {}): number {
  let n = 0;
  for (const e of s.enemies) {
    if (!bjAlive(e)) continue;
    const ex = e.x - x;
    const ey = e.y - y;
    const dist = Math.sqrt(ex * ex + ey * ey);
    if (dist > r + e.r) continue;
    if (opt.arc !== undefined && dist > e.r && (ex * (opt.dx ?? 0) + ey * (opt.dy ?? 0)) / dist < opt.arc) continue;
    bjHit(s, e, dmg, opt.knock);
    n++;
  }
  return n;
}

/** 나눠 때리는 기술 시작 (첫 대는 이번 틱) */
export function bjVolley(s: RunState, v: Omit<BjVolley, "left" | "next">): void {
  (s.player.bjVolleys ??= []).push({ ...v, left: v.n, next: s.tick });
}

/** 붉은 레이저 선 한 줄 (드론이 날아가 꽂힘) */
const line = (s: RunState, x: number, y: number, e: EnemyState, ticks = 8) => addEffect(s, { kind: "bjLine", x, y, dirX: 0, dirY: 0, size: 2, toX: e.x, toY: e.y, maxTicks: ticks });

/** 기술 한 대 */
function once(s: RunState, v: BjVolley): void {
  const p = s.player;
  if (v.kind === "flurry" || v.kind === "reaper") bjArea(s, v.x, v.y, v.r, v.dmg);
  else if (v.kind === "spin") bjArea(s, p.x, p.y, v.r, v.dmg);
  else if (v.kind === "rain") bjArea(s, v.x, v.y, v.r, v.dmg, { arc: K.bjRain.arc, dx: v.dx, dy: v.dy });
  else if (v.kind === "prison") {
    for (const e of s.enemies) {
      if (!bjAlive(e) || (e.x - v.x) ** 2 + (e.y - v.y) ** 2 > (v.r + e.r) ** 2) continue;
      // 갇힌 동안 못 움직임 (보스는 안 갇힘)
      if (!isBoss(e)) e.stunTicks = Math.max(e.stunTicks ?? 0, v.every + 1);
      bjHit(s, e, v.dmg);
    }
  } else if (v.kind === "needle") {
    let e = s.enemies.find((x) => x.id === v.id && bjAlive(x)) ?? bjNearest(s, p.x, p.y, K.bjNeedle.dist);
    if (!e) return void (v.left = 1);
    v.id = e.id;
    line(s, p.x, p.y - 14, e);
    bjHit(s, e, v.dmg);
  } else {
    // 종언: 살아 있는 적에게 차례로 한 기씩
    const foes = s.enemies.filter(bjAlive);
    const e = foes[(v.n - v.left) % Math.max(1, foes.length)];
    if (!e) return;
    const side = (v.n - v.left) % 2 ? 1 : -1;
    line(s, p.x + side * 18, p.y - 12, e, 10);
    e.bjSum = (e.bjSum ?? 0) + bjHit(s, e, v.dmg);
  }
}

/** 기술이 끝날 때 */
function finish(s: RunState, v: BjVolley): void {
  const p = s.player;
  if (v.kind === "reaper") {
    const R = K.bjReaper;
    addEffect(s, { kind: "bjCross", x: v.x, y: v.y, dirX: 0, dirY: 0, size: v.r * 1.2, style: 1, maxTicks: 18 });
    for (const e of s.enemies) {
      if (!bjAlive(e) || (e.x - v.x) ** 2 + (e.y - v.y) ** 2 > (v.r + e.r) ** 2) continue;
      // 죽음: 1초마다 최대 체력 비율 (보스·허수아비는 반감)
      const base = e.kind === "dummy" ? 1000 : pctHp(e);
      e.bjDeath = R.death;
      e.bjDeathDmg = (base * R.pct) / (isBoss(e) ? R.bossDiv : 1);
      bjHit(s, e, p.stats.damage * R.star);
    }
  } else if (v.kind === "end") {
    // 맞고도 살아남은 적: 붉은 십자와 함께 쌓인 피해를 한 번 더
    for (const e of s.enemies) {
      const sum = e.bjSum ?? 0;
      delete e.bjSum;
      if (sum <= 0 || !bjAlive(e)) continue;
      addEffect(s, { kind: "bjCross", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 26, maxTicks: 24 });
      e.hp -= sum;
      e.hitFlash = 6;
    }
  }
}

/** 틱마다: 나눠 때리는 기술 · 출혈 · 죽음 */
export function volleyTick(s: RunState): void {
  const p = s.player;
  if (p.bjVolleys?.length) {
    for (const v of p.bjVolleys) {
      if (v.next > s.tick) continue;
      once(s, v);
      v.next = s.tick + v.every;
      if (--v.left <= 0) finish(s, v);
    }
    p.bjVolleys = p.bjVolleys.filter((v) => v.left > 0);
  }
  for (const e of s.enemies) {
    if ((e.bjBleed ?? 0) > 0 && e.hp > 0 && --e.bjBleed! % 30 === 0) dotDamage(s, e, "bleed", e.bjBleedDmg ?? 0);
    if ((e.bjDeath ?? 0) > 0 && e.hp > 0 && --e.bjDeath! % 60 === 0) dotDamage(s, e, "death", e.bjDeathDmg ?? 0);
  }
}

export { isBoss as bjBoss };
