// 매드퀸 무기들 한 틱: 날아가는 포탄(닿거나 벽·끝에서 폭발) · 터렛(사거리 안 적에게 작은 포탄) · 일제사격 낙하탄
import { MADQUEEN_PERKS as K } from "../itemsMadQueen";
import { MADQUEEN as Q } from "../weaponsMadQueen";
import { blocksShot } from "./layout";
import { boomR, explode as explode_, fleetOf, mqSpot } from "./madQueenKit";
import type { MqShell, MqTurret } from "./madQueenTypes";
import { alive, stun } from "./s2Kit";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, hasPerk, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";
import { srcFn } from "./dmgSrc";
const explode = srcFn("madQueenArms", () => explode_);

/** 포탄 하나를 쏨 (땅 위 x,y에서 dx,dy 쪽 · 그림은 높이 h의 포구에서 나옴) */
export function fireShell(s: RunState, x: number, y: number, dx: number, dy: number, o: { sp: number; range: number; r: number; boom: number; dmg: number; src: 0 | 1; h: number }): void {
  const t = Math.ceil(o.range / o.sp);
  (s.player.mqShells ??= []).push({ x, y, dx, dy, sp: o.sp, t, t0: t, r: o.r, boom: o.boom, dmg: o.dmg, src: o.src, h: o.h });
}

/** 포탄 하나 한 틱 · 끝나면 false */
function shellStep(s: RunState, w: MqShell): boolean {
  w.t--;
  if (w.src === 2) {
    if (w.t > 0) return true;
    for (const e of explode(s, w.x, w.y, w.boom, w.dmg, 4)) stun(e, Q.salvoStun);
    return false;
  }
  w.x += w.dx * w.sp;
  w.y += w.dy * w.sp;
  w.h = Math.max(0, w.h - Q.shellDrop);
  const g = roomGrid(s);
  const wall = w.x < ROOM_MIN_X || w.x > ROOM_MAX_X || w.y < ROOM_MIN_Y || w.y > ROOM_MAX_Y || (g !== null && blocksShot(g, w.x, w.y));
  const hit = alive(s).some((e) => dist2(e, w) <= (e.r + w.r) ** 2);
  if (!wall && !hit && w.t > 0) return true;
  explode(s, w.x - (wall ? w.dx * w.sp * 0.5 : 0), w.y - (wall ? w.dy * w.sp * 0.5 : 0), w.boom, w.dmg);
  return false;
}

/** 사거리 안 가장 가까운 적 */
function nearest(s: RunState, x: number, y: number, range: number): EnemyState | undefined {
  let best: EnemyState | undefined;
  for (const e of alive(s)) {
    if (dist2(e, { x, y }) > (range + e.r) ** 2) continue;
    if (!best || dist2(e, { x, y }) < dist2(best, { x, y })) best = e;
  }
  return best;
}

/** 터렛 하나 한 틱: 사거리 안 적에게 포신을 돌려 작은 포탄 (대포보다 빠름) */
function turretStep(s: RunState, u: MqTurret, speed: number): void {
  const p = s.player;
  u.age++;
  if (u.cd > 0) u.cd--;
  const over = hasPerk(p, "mqOverclock");
  const range = Q.turretRange * (over ? K.mqOverclock.range : 1);
  const e = nearest(s, u.x, u.y, range);
  if (!e) return;
  u.a = Math.atan2(e.y - u.y, e.x - u.x);
  if (u.cd > 0 || u.age < 12) return;
  const every = Q.turretEvery * (fleetOf(p).turretEvery ?? 1) * (over ? K.mqOverclock.every : 1);
  u.cd = Math.max(8, Math.round(every / Math.max(0.3, speed)));
  const d = Math.hypot(e.x - u.x, e.y - u.y) || 1;
  const dx = (e.x - u.x) / d;
  const dy = (e.y - u.y) / d;
  fireShell(s, u.x + dx * 10, u.y + dy * 10, dx, dy, { sp: Q.turretSpeed, range: range + 30, r: Q.turretShellR, boom: boomR(p, Q.turretBoom), dmg: p.stats.damage * Q.turretMul, src: 1, h: Q.turretH });
  addEffect(s, { kind: "mqMuzzle", x: u.x + dx * 12, y: u.y + dy * 12 - Q.turretH, dirX: dx, dirY: dy, size: 6, maxTicks: 8, style: fleetOf(p).color });
}

/** 전탄 일제사격: 적마다 한 발 + 맵 아무 곳에 여러 발이 하늘에서 떨어짐 (시드로 자리·늦춤을 정함) */
export function startSalvo(s: RunState, rnd: () => number): void {
  const p = s.player;
  const barrage = hasPerk(p, "mqBarrage");
  const dmg = p.stats.damage * Q.salvoMul * (barrage ? K.mqBarrage.mul : 1);
  const boom = boomR(p, Q.salvoR);
  const list = (p.mqShells ??= []);
  const drop = (x: number, y: number) => {
    const t = Q.salvoFall + Math.floor(rnd() * Q.salvoSpread);
    list.push({ x, y, dx: 0, dy: 0, sp: 0, t, t0: t, r: 6, boom, dmg, src: 2, h: 0 });
  };
  for (const e of alive(s)) drop(e.x, e.y);
  const n = Math.round(Q.salvoShots * (barrage ? K.mqBarrage.shots : 1));
  for (let i = 0; i < n; i++) drop(...mqSpot(s, rnd, 12, 12));
  p.mqSalvo = Q.salvoFall + Q.salvoSpread + 10;
  addEffect(s, { kind: "mqSalvo", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 60, maxTicks: 50, follow: true, style: fleetOf(p).color });
}

/** 틱마다: 포탄·터렛 */
export function armsTick(s: RunState, speed: number): void {
  const p = s.player;
  if (p.mqSalvo) p.mqSalvo--;
  for (const u of p.mqTurrets ?? []) turretStep(s, u, speed);
  if (p.mqShells) {
    p.mqShells = p.mqShells.filter((w) => shellStep(s, w));
    if (p.mqShells.length === 0) delete p.mqShells;
  }
}
