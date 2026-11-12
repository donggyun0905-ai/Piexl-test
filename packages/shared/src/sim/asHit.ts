// 아수라 때리기: 한 대 (악귀 추가 피해·업화) · 분쇄(한 틱에 한 대씩 나눠 때림) · 둘레 범위
import { ASURA_PERKS as K } from "../itemsAsura";
import { createRng, deriveSeed } from "../rng";
import { asDmgMul, hasAs } from "./asKit";
import { damageEnemy as damageEnemy_ } from "./combat";
import { alive } from "./shadowingSpirits";
import { ignite } from "./status";
import type { EnemyState, RunState } from "./types";
import { addEffect, normalize } from "./util";
import { srcFn, srcEach } from "./dmgSrc";
const damageEnemy = srcFn("asHit", () => damageEnemy_);

/** 시드 확률 (굴릴 때마다 다른 값) */
export function asRoll(s: RunState, tag: string): number {
  const p = s.player;
  p.asRolls = (p.asRolls ?? 0) + 1;
  return createRng(deriveSeed(s.seed, tag, s.tick, p.asRolls)).nextFloat();
}

/** 피해 한 대 + 화면용 기록 (한 대마다 따로 피해 숫자) */
function strike(s: RunState, e: EnemyState, dmg: number, dx: number, dy: number, knock: boolean): void {
  const p = s.player;
  if (p.asLogT !== s.tick) {
    p.asLogT = s.tick;
    p.asLog = [];
  }
  const hp = e.hp;
  const c0 = e.critTick;
  e.critTick = undefined;
  damageEnemy(s, e, dmg, dx, dy, knock);
  const crit = e.critTick === s.tick;
  if (!crit) e.critTick = c0;
  const amt = hp - Math.max(0, e.hp);
  if (amt > 0) p.asLog!.push({ id: e.id, amt, crit });
}

/** 한 대: 피해 · 악귀(확률로 붉게 터지며 추가 피해, 업화면 불탐) */
function hitOnce(s: RunState, e: EnemyState, dmg: number, dx: number, dy: number, knock: boolean): void {
  if (!alive(e)) return;
  const p = s.player;
  strike(s, e, dmg, dx, dy, knock);
  if (!hasAs(p, "asDemon") || !alive(e) || asRoll(s, "asDemon") >= K.asDemon.chance) return;
  const extra = dmg * K.asDemon.mul;
  strike(s, e, extra, dx, dy, false);
  addEffect(s, { kind: "asDemon", x: e.x, y: e.y - e.r * 0.4, dirX: dx, dirY: dy, size: e.r + 8, maxTicks: 14 });
  if (hasAs(p, "asHell")) ignite(e, extra * K.asHell.burn);
}

/** 주먹 한 대 (split이고 분쇄가 있으면 n번으로 나눠 한 틱에 한 번씩) */
export function asHit(s: RunState, e: EnemyState, dmg: number, dx: number, dy: number, opt: { split?: boolean; knock?: boolean } = {}): void {
  const p = s.player;
  const d = dmg * asDmgMul(p);
  if (opt.split && hasAs(p, "asCrush")) {
    const n = K.asCrush.n;
    (p.asSplit ??= []).push({ id: e.id, dmg: d / n, left: n, dx, dy });
    return;
  }
  hitOnce(s, e, d, dx, dy, !!opt.knock);
}

/** 틱마다: 나눠 때리는 피해를 한 대씩 */
export function splitTick(s: RunState): void {
  const p = s.player;
  if (!p.asSplit?.length) return;
  for (const h of srcEach(p.asSplit)) {
    const e = s.enemies.find((x) => x.id === h.id);
    if (e && alive(e)) hitOnce(s, e, h.dmg, h.dx, h.dy, false);
    h.left = e && alive(e) ? h.left - 1 : 0;
  }
  p.asSplit = p.asSplit.filter((h) => h.left > 0);
}

/** 범위 안 적 모두 때림 (arc가 있으면 dx·dy 쪽 부채꼴만) · 맞힌 수 */
export function asArea(s: RunState, x: number, y: number, r: number, dmg: number, opt: { split?: boolean; knock?: boolean; stun?: number; arc?: number; dx?: number; dy?: number } = {}): number {
  let n = 0;
  for (const e of s.enemies) {
    if (!alive(e)) continue;
    const ex = e.x - x;
    const ey = e.y - y;
    const dist = Math.sqrt(ex * ex + ey * ey);
    if (dist > r + e.r) continue;
    if (opt.arc !== undefined && dist > e.r && (ex * (opt.dx ?? 0) + ey * (opt.dy ?? 0)) / dist < opt.arc) continue;
    const d = normalize(ex, ey) ?? [opt.dx ?? 0, opt.dy ?? 0];
    asHit(s, e, dmg, d[0], d[1], opt);
    if (opt.stun && e.kind !== "dummy") e.stunTicks = Math.max(e.stunTicks ?? 0, opt.stun);
    n++;
  }
  return n;
}
