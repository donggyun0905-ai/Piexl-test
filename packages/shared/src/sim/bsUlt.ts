// 빙설 궁극기 빙설창: 머리 위에서 3초 기를 모은 뒤 바라보는(마우스) 쪽으로 날아감
// 아직 안 맞힌 적에 닿으면 멈춰 슬로우 모션이 되고 그 적을 빠르게 60번 때림 → 관통해 다시 날아감 → 다음 적 … 맵 끝까지
// 슬로우 동안 적은 쉬고(punk.timeSlowed가 bsSlowed를 부름) 적 탄도 느려짐 · 빙설은 무적
import { ENEMIES } from "../enemyDefs";
import { BINGSEOL_PERKS as K } from "../itemsBingseol";
import { iceHit } from "./bsHit";
import { alive } from "./shadowingSpirits";
import { restoreShots, slowShots } from "./slowShots";
import type { RunState } from "./types";
import { addEffect, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

const U = K.bsUlt;
/** 기 모으는 동안 머리 위 높이 */
export const ULT_LIFT = 22;

/** 빙설창 생김 (공격할 때 확률, sim/bsArms) */
export function startUlt(s: RunState): void {
  const p = s.player;
  p.bsUlt = { t: 0, x: p.x, y: p.y - ULT_LIFT, dx: p.faceX, dy: p.faceY, target: -1, pause: 0, hits: 0, done: [], dmg: (p.stats.damage * U.mul) / U.hits };
}

/** 끝 (느리게 한 적 탄을 원래대로) */
function stop(s: RunState): void {
  const p = s.player;
  if (p.bsFrozen) restoreShots(s, p.bsFrozen, U.shotSlow);
  delete p.bsFrozen;
  delete p.bsUlt;
}

/** 틱마다 */
export function ultTick(s: RunState): void {
  const p = s.player;
  const u = p.bsUlt;
  if (!u) return;
  u.t++;
  if (u.t < U.charge) {
    // 기 모으기: 몸을 따라감
    u.x = p.x;
    u.y = p.y - ULT_LIFT;
    return;
  }
  if (u.t === U.charge) {
    u.dx = p.faceX;
    u.dy = p.faceY;
    u.x = p.x;
    u.y = p.y;
  }
  if (u.pause > 0) {
    pauseTick(s);
    return;
  }
  u.x += u.dx * U.speed;
  u.y += u.dy * U.speed;
  if (u.x < ROOM_MIN_X - 30 || u.x > ROOM_MAX_X + 30 || u.y < ROOM_MIN_Y - 30 || u.y > ROOM_MAX_Y + 30) {
    stop(s);
    return;
  }
  // 아직 안 맞힌 적 중 가장 가까운 적에 멈춤
  let best = -1;
  let bd = Infinity;
  for (const e of s.enemies) {
    if (!alive(e) || u.done.includes(e.id)) continue;
    const d = (e.x - u.x) ** 2 + (e.y - u.y) ** 2;
    if (d <= (U.r + e.r) ** 2 && d < bd) {
      bd = d;
      best = e.id;
    }
  }
  if (best < 0) return;
  u.target = best;
  u.pause = U.pause;
  u.hits = 0;
}

/** 멈춘 동안: 슬로우 모션 · 그 적을 나눠 때림 (멈춤 틱 동안 hits번) */
function pauseTick(s: RunState): void {
  const p = s.player;
  const u = p.bsUlt!;
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  p.bsFrozen = slowShots(s, p.bsFrozen, U.shotSlow);
  const e = s.enemies.find((x) => x.id === u.target && alive(x));
  u.pause--;
  if (e) {
    const due = Math.min(U.hits, Math.ceil(((U.pause - u.pause) * U.hits) / U.pause));
    const dmg = u.dmg * (ENEMIES[e.kind].boss ? U.bossMul : 1);
    while (u.hits < due && alive(e)) {
      u.hits++;
      iceHit(s, e, dmg, u.dx, u.dy);
      if (u.hits % 3 === 0) addEffect(s, { kind: "bsUltHit", x: e.x, y: e.y, dirX: u.dx, dirY: u.dy, size: e.r, style: u.hits, maxTicks: 10 });
    }
  }
  if (!e || !alive(e)) u.pause = 0;
  if (u.pause > 0) return;
  // 관통: 다음 적으로
  u.done.push(u.target);
  u.target = -1;
  if (p.bsFrozen) restoreShots(s, p.bsFrozen, U.shotSlow);
  delete p.bsFrozen;
}

/** 슬로우 모션 동안: 적이 이번 틱을 쉬는지 (보스는 네 틱 중 한 틱만 움직임) */
export function bsSlowed(s: RunState, boss: boolean): boolean {
  const u = s.player.bsUlt;
  if (!u || u.pause <= 0) return false;
  return !boss || s.tick % 4 !== 0;
}
