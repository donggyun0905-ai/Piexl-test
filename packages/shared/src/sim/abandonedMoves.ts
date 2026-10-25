// 버려진 자들 기술 하나하나: 방패(치기·돌진·내려찍기·벽·막기) · 총(한 발·세 발·다섯 발·관통·수류탄·저격) · 검(베기·찌르기·한 바퀴·검기·X자·돌진 베기). 특수기는 abandonedShow
// 휘두르기·찌르기·폭발·검기는 장수 기술(generalMoves)을 그대로 씀
import { ENEMIES } from "../enemyDefs";
import { ABANDONED as A, type TagMove } from "../weaponsAbandoned";
import { cross, sweep, thrustLine, wave } from "./generalMoves";
import type { EnemyState, RunState } from "./types";
import { addEffect, keepInRoom, normalize, roomGrid } from "./util";

/** 적을 밀고 (보스 빼고) 기절 */
export function shove(s: RunState, e: EnemyState, dx: number, dy: number, push: number, stun: number): void {
  if (ENEMIES[e.kind].boss || e.kind === "dummy") return;
  e.x += dx * push;
  e.y += dy * push;
  keepInRoom(e, roomGrid(s));
  if (stun > 0) e.stunTicks = Math.max(e.stunTicks ?? 0, stun);
}

/** 반경 안 앞쪽(arc) 적을 맞히고 밀침 */
function shieldArc(s: RunState, dmg: number, radius: number, arc: number, push: number, stun: number): void {
  const p = s.player;
  const hit = s.enemies.filter((e) => {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.hypot(dx, dy);
    return e.hp > 0 && d <= radius + e.r && (arc <= -1 || d <= p.r + e.r || (dx * p.faceX + dy * p.faceY) / d >= arc);
  });
  sweep(s, dmg, radius, arc);
  for (const e of hit) {
    const d = normalize(e.x - p.x, e.y - p.y) ?? [p.faceX, p.faceY];
    shove(s, e, d[0], d[1], push, stun);
  }
}

/** 총알 하나 (각도 a만큼 돌려서) */
export function bullet(s: RunState, x: number, y: number, fx: number, fy: number, dmg: number, a = 0, extra: { pierce?: number; reach?: number; blast?: number } = {}): void {
  const p = s.player;
  const dx = fx * Math.cos(a) - fy * Math.sin(a);
  const dy = fx * Math.sin(a) + fy * Math.cos(a);
  const sp = A.bulletSpeed;
  s.projectiles.push({
    id: s.nextId++,
    fromPlayer: true,
    x: x + dx * 6,
    y: y + dy * 6,
    prevX: x,
    prevY: y,
    r: 2,
    vx: dx * sp,
    vy: dy * sp,
    damage: dmg,
    ticksLeft: Math.ceil((p.stats.range * 3 * (extra.reach ?? 1)) / sp),
    spirit: "bullet",
    ...(extra.pierce ? { pierce: extra.pierce, hitIds: [] } : {}),
    ...(extra.blast ? { blast: extra.blast, splash: 1 } : {}),
  });
}

/** 기술 하나 (지금 run.player 기준, dmg = 이미 배율을 곱한 피해) */
export function doTagMove(s: RunState, mv: TagMove, dmg: number): void {
  const p = s.player;
  const r = p.stats.range;
  const f: [number, number] = [p.faceX, p.faceY];
  switch (mv.kind) {
    case "bash":
      return shieldArc(s, dmg, r * 0.8, 0.4, A.push, 0);
    case "wall":
      return shieldArc(s, dmg, r, -0.1, A.push * 2, 0);
    case "slam":
      shieldArc(s, dmg, r * 0.9, -1, 0, A.stun);
      return addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r * 0.9, maxTicks: 16 });
    case "guard":
      p.abGuard = A.guardTicks;
      return shieldArc(s, dmg, r * 0.7, 0.3, A.push, 0);
    case "charge": {
      const x0 = p.x;
      const y0 = p.y;
      p.x += f[0] * A.chargeDist;
      p.y += f[1] * A.chargeDist;
      keepInRoom(p, roomGrid(s));
      shieldArc(s, dmg, r * 0.7, 0.2, A.push, A.stun / 2);
      return addEffect(s, { kind: "streak", x: x0, y: y0, dirX: f[0], dirY: f[1], size: 4, toX: p.x, toY: p.y, maxTicks: 12 });
    }
    case "shot":
      return bullet(s, p.x, p.y, f[0], f[1], dmg);
    case "burst":
      for (const a of [-A.spread / 2, 0, A.spread / 2]) bullet(s, p.x, p.y, f[0], f[1], dmg / 3, a);
      return;
    case "spray":
      for (let i = -2; i <= 2; i++) bullet(s, p.x, p.y, f[0], f[1], dmg / 4, i * A.spread);
      return;
    case "pierce":
      return bullet(s, p.x, p.y, f[0], f[1], dmg, 0, { pierce: 3 });
    case "snipe":
      return bullet(s, p.x, p.y, f[0], f[1], dmg, 0, { pierce: 99, reach: A.snipeReach });
    case "grenade":
      return bullet(s, p.x, p.y, f[0], f[1], dmg, 0, { blast: A.grenadeR, reach: 0.8 });
    case "slash":
      return sweep(s, dmg, r, 0.3);
    case "thrust":
      return thrustLine(s, dmg, r * 1.4);
    case "spin":
      return sweep(s, dmg, r, -1);
    case "wave":
      sweep(s, dmg * 0.5, r, 0.3);
      return wave(s, dmg, r * 3);
    case "cross":
      return cross(s, dmg, r * 1.3);
    case "dash": {
      const x0 = p.x;
      const y0 = p.y;
      p.x += f[0] * A.chargeDist;
      p.y += f[1] * A.chargeDist;
      keepInRoom(p, roomGrid(s));
      thrustLine(s, dmg, A.chargeDist + r * 0.5, 6, 0);
      return addEffect(s, { kind: "streak", x: x0, y: y0, dirX: f[0], dirY: f[1], size: 3, toX: p.x, toY: p.y, maxTicks: 12 });
    }
  }
}
