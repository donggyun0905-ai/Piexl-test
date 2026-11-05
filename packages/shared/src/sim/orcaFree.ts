// 오르카 해방 상태 (범고래 돌파로 내려앉은 뒤 10초): 모든 공격 범위 넓어짐 · 공격 속도 빨라짐 · 타격마다 물 상어 추가타 · 대시가 번개 대시
import { ORCA_PERKS as K } from "../itemsOrca";
import { ORCA as O } from "../weaponsOrca";
import { damageEnemy } from "./combat";
import { blocksShot } from "./layout";
import { alive, onSegment, stun } from "./s2Kit";
import { statusHit } from "./statusHit";
import type { PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";

export const isFree = (p: PlayerState) => (p.ocFree ?? 0) > 0;
/** 모든 공격 범위 배율 (해방 중) */
export const wide = (p: PlayerState) => (isFree(p) ? O.freeRange : 1);
/** 공격 속도 배율 (classSpeed) */
export const orcaSpeedMul = (p: PlayerState) => (isFree(p) ? O.freeSpeed : 1);

/** 해방 시작 (범고래 돌파가 내려앉을 때) */
export function startFree(s: RunState): void {
  const p = s.player;
  p.ocFree = p.ocFree0 = O.freeTicks + (hasPerk(p, "ocLiberty") ? K.ocLiberty.ticks : 0);
  addEffect(s, { kind: "ocFree", x: p.x, y: p.y, dirX: 0, dirY: -1, size: 40, maxTicks: 40 });
}

/** 해방 중 타격마다: 바라보는 쪽으로 물 상어 한 마리가 튀어나가 꿰뚫음 */
export function launchDart(s: RunState): void {
  const p = s.player;
  if (!isFree(p)) return;
  (p.ocDarts ??= []).push({ x: p.x + p.faceX * 8, y: p.y + p.faceY * 8, dx: p.faceX, dy: p.faceY, left: O.dartRange, hit: [] });
}

/** 틱마다: 물 상어 추가타 · 번개 대시 · 해방 시간 */
export function freeTick(s: RunState): void {
  const p = s.player;
  if (p.ocFree && --p.ocFree <= 0) delete p.ocFree;
  if (p.ocDarts) {
    const g = roomGrid(s);
    p.ocDarts = p.ocDarts.filter((d) => {
      d.x += d.dx * O.dartSpeed;
      d.y += d.dy * O.dartSpeed;
      d.left -= O.dartSpeed;
      for (const e of alive(s)) {
        if (d.hit.includes(e.id) || dist2(e, d) > (O.dartR + e.r) ** 2) continue;
        d.hit.push(e.id);
        statusHit(s, e, "tide", p.stats.damage * O.dartMul, d.dx, d.dy, false);
        addEffect(s, { kind: "ocDart", x: e.x, y: e.y, dirX: d.dx, dirY: d.dy, size: 14, maxTicks: 14 });
      }
      const wall = d.x < ROOM_MIN_X || d.x > ROOM_MAX_X || d.y < ROOM_MIN_Y || d.y > ROOM_MAX_Y || (g !== null && blocksShot(g, d.x, d.y));
      return d.left > 0 && !wall;
    });
    if (p.ocDarts.length === 0) delete p.ocDarts;
  }
  boltTick(s);
}

/** 번개 대시: 해방 중 대시하면 지나간 자리에 번개 (한 대시에 적마다 한 번) · 끝나면 번개 줄기 효과 */
function boltTick(s: RunState): void {
  const p = s.player;
  const b = p.ocBolt;
  if (!b && isFree(p) && p.dashTicks > 0) {
    p.ocBolt = { x: p.prevX, y: p.prevY, hit: [] };
    addEffect(s, { kind: "ocBolt", x: p.prevX, y: p.prevY, toX: p.prevX, toY: p.prevY, dirX: p.dashDirX, dirY: p.dashDirY, size: 0, maxTicks: 4 });
  }
  const c = p.ocBolt;
  if (!c) return;
  for (const e of onSegment(s, c.x, c.y, p.x, p.y, O.boltW)) {
    if (c.hit.includes(e.id)) continue;
    c.hit.push(e.id);
    damageEnemy(s, e, p.stats.damage * O.boltMul, p.dashDirX, p.dashDirY, false);
    stun(e, O.boltStun);
  }
  if (p.dashTicks > 0) return;
  addEffect(s, { kind: "ocBolt", x: c.x, y: c.y, toX: p.x, toY: p.y, dirX: p.dashDirX, dirY: p.dashDirY, size: O.boltW, maxTicks: 24 });
  delete p.ocBolt;
}
