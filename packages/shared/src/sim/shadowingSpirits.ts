// 쉐도잉 날아가는 것(검기·학·유령·혜성·나비·용)과 바닥 자리(두루마리 용·연꽃·달·유성·소용돌이) 처리 · 범위 피해 도우미
// 그림 줄 번호(row)는 sdTypes.SD_ROW. 그리기는 화면 render/shadowingFx
import { ENEMIES } from "../enemyDefs";
import { SHADOWING_PERKS as K } from "../itemsShadowing";
import { damageEnemy, healPlayer } from "./combat";
import type { InkSpirit, InkZone } from "./sdTypes";
import { ignite } from "./status";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, keepInRoom, normalize, roomGrid } from "./util";

/** 맞힐 수 있는 적인지 */
export const alive = (e: EnemyState) => e.hp > 0 && !e.immune && !e.pwHid;

/** (x, y)에서 가장 가까운 적 */
export function nearestFoe(s: RunState, x: number, y: number, skip: readonly number[] = []): EnemyState | null {
  let best: EnemyState | null = null;
  let bd = Infinity;
  for (const e of s.enemies) {
    if (!alive(e) || skip.includes(e.id)) continue;
    const d = (e.x - x) ** 2 + (e.y - y) ** 2;
    if (d < bd) {
      bd = d;
      best = e;
    }
  }
  return best;
}

/** 밀지 않는 피해 */
export const damageEnemyLite = (s: RunState, e: EnemyState, dmg: number, dx: number, dy: number) => damageEnemy(s, e, dmg, dx, dy, false);

/** 범위 피해 + 그림 줄 터짐 · 묶음·불·밀기 (보스는 밀리지 않음) · 맞힌 수 */
export function inkArea(s: RunState, x: number, y: number, r: number, dmg: number, row: number, opt: { stun?: number; burn?: number; push?: number } = {}): number {
  let n = 0;
  const g = roomGrid(s);
  for (const e of s.enemies) {
    if (!alive(e) || (e.x - x) ** 2 + (e.y - y) ** 2 > (r + e.r) ** 2) continue;
    const d = normalize(e.x - x, e.y - y) ?? [0, 0];
    damageEnemyLite(s, e, dmg, d[0], d[1]);
    if (opt.stun) e.stunTicks = Math.max(e.stunTicks ?? 0, opt.stun);
    if (opt.burn) ignite(e, opt.burn);
    if (opt.push && !ENEMIES[e.kind].boss) {
      e.x += d[0] * opt.push;
      e.y += d[1] * opt.push;
      keepInRoom(e, g);
    }
    n++;
  }
  addEffect(s, { kind: "sdBurst", x, y, dirX: 0, dirY: 0, size: r, style: row, maxTicks: 28 });
  return n;
}

/** 날아가는 것 하나 놓기 */
export function addSpirit(s: RunState, sp: Omit<InkSpirit, "h">): void {
  (s.player.sdSpirits ??= []).push({ ...sp, h: [] });
}

/** 바닥 자리 하나 놓기 */
export function addZone(s: RunState, z: Omit<InkZone, "age">): void {
  (s.player.sdZones ??= []).push({ ...z, age: 0 });
}

/** 날아가는 것 움직이기 · 맞히기 */
function moveSpirit(s: RunState, sp: InkSpirit): boolean {
  sp.t--;
  if (sp.path) {
    // 용: 획 점을 따라감
    sp.at = (sp.at ?? 0) + K.sdDragon.speed;
    const i = Math.min(sp.path.length / 2 - 1, Math.floor(sp.at)) * 2;
    sp.vx = sp.path[i]! - sp.x;
    sp.vy = sp.path[i + 1]! - sp.y;
    sp.x = sp.path[i]!;
    sp.y = sp.path[i + 1]!;
    if (sp.at >= sp.path.length / 2 - 1) sp.t = 0;
  } else {
    if (sp.home) {
      const e = nearestFoe(s, sp.x, sp.y, sp.h);
      const sp0 = Math.hypot(sp.vx, sp.vy);
      const d = e ? normalize(e.x - sp.x, e.y - sp.y) : null;
      if (d) {
        sp.vx = d[0] * sp0;
        sp.vy = d[1] * sp0;
      }
    }
    sp.x += sp.vx;
    sp.y += sp.vy;
  }
  for (const e of s.enemies) {
    if (!alive(e) || sp.h.includes(e.id) || dist2(e, sp) > (e.r + sp.r) ** 2) continue;
    sp.h.push(e.id);
    const d = normalize(sp.vx, sp.vy) ?? [0, 0];
    if (sp.burst) inkArea(s, sp.x, sp.y, sp.burst, sp.dmg, sp.row);
    else {
      damageEnemyLite(s, e, sp.dmg, d[0], d[1]);
      addEffect(s, { kind: "sdBurst", x: e.x, y: e.y, dirX: d[0], dirY: d[1], size: sp.r * 2, style: sp.row, maxTicks: 18 });
    }
    if (sp.once) return false;
  }
  return sp.t > 0;
}

/** 바닥 자리: 간격마다 피해·끌어당김·회복, delay면 끝날 때 한 번 터짐 */
function zoneTick(s: RunState, z: InkZone): boolean {
  z.age++;
  const p = s.player;
  if (z.pull) {
    const g = roomGrid(s);
    for (const e of s.enemies) {
      if (!alive(e) || ENEMIES[e.kind].boss || (e.x - z.x) ** 2 + (e.y - z.y) ** 2 > z.r * z.r) continue;
      const d = normalize(z.x - e.x, z.y - e.y);
      if (!d) continue;
      e.x += d[0] * z.pull;
      e.y += d[1] * z.pull;
      keepInRoom(e, g);
    }
  }
  if (z.every && z.age % z.every === 0) {
    if (z.dmg > 0) inkArea(s, z.x, z.y, z.r, z.dmg, z.row, { stun: z.stun });
    if (z.heal && (p.x - z.x) ** 2 + (p.y - z.y) ** 2 <= z.r * z.r) healPlayer(s, z.heal);
  }
  if (z.age < z.life) return true;
  if (!z.every && z.dmg > 0) inkArea(s, z.x, z.y, z.r, z.dmg, z.row, { stun: z.stun, burn: z.burn ? z.dmg * 0.5 : undefined });
  return false;
}

/** 틱마다: 날아가는 것·바닥 자리 */
export function spiritsTick(s: RunState): void {
  const p = s.player;
  if (p.sdSpirits?.length) p.sdSpirits = p.sdSpirits.filter((sp) => moveSpirit(s, sp));
  if (p.sdZones?.length) p.sdZones = p.sdZones.filter((z) => zoneTick(s, z));
}
