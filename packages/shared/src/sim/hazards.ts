// 적이 남기는 위험 표시: 미리 보이고, 정해진 틱에 범위 안 플레이어에게 피해 (원 · 부채꼴 · 선). 대시 중이면 피함
import { damagePlayer } from "./combat";
import { throughDash } from "./bossGrip";
import type { Hazard } from "./fxTypes";
import type { RunState } from "./types";
import { eachSeat } from "./party";
import { addEffect, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { moonOut } from "./moonlight";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 심판: 이만큼(0.2초) 안 움직였으면 가만히 있던 것 */
  STILL_JUDGE: 12,
};
export { R as HAZARDS_RULES };

/** 표시가 뜨고 터지기까지 (0.85초): 보고 피할 수 있는 시간 */
export const HAZARD_WARN_TICKS = 50;
export const HAZARD_RADIUS = 22;

export function addHazard(s: RunState, x: number, y: number, damage: number, from?: string): void {
  (s.hazards ??= []).push({ tick: s.tick + HAZARD_WARN_TICKS, start: s.tick, x, y, radius: HAZARD_RADIUS, damage: damage * moonOut(), ...(from ? { from } : {}) });
}

/** 모양 있는 위험 표시 (warn틱 뒤 터짐, appear틱 뒤부터 보임) */
export function addShape(s: RunState, warn: number, h: Omit<Hazard, "tick" | "start">, appear = 0): void {
  // 선 끝은 방 안까지만
  const to = h.toX !== undefined && h.toY !== undefined ? { toX: Math.max(ROOM_MIN_X, Math.min(ROOM_MAX_X, h.toX)), toY: Math.max(ROOM_MIN_Y, Math.min(ROOM_MAX_Y, h.toY)) } : {};
  (s.hazards ??= []).push({ tick: s.tick + warn, start: s.tick + appear, ...h, ...to, damage: h.damage * moonOut() }); // 달빛 걸린 적이 만든 장판은 약함
}

/** 플레이어(반지름 r)가 범위 안인지 */
export function inHazard(h: Hazard, px: number, py: number, r: number): boolean {
  if (h.toX !== undefined && h.toY !== undefined) {
    const vx = h.toX - h.x;
    const vy = h.toY - h.y;
    const len2 = vx * vx + vy * vy || 1;
    const t = Math.max(0, Math.min(1, ((px - h.x) * vx + (py - h.y) * vy) / len2));
    const dx = h.x + vx * t - px;
    const dy = h.y + vy * t - py;
    const w = (h.width ?? 4) + r;
    return dx * dx + dy * dy <= w * w;
  }
  const dx = px - h.x;
  const dy = py - h.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d > h.radius + r) return false;
  if (h.arc === undefined || h.arc <= -1 || d <= r) return true;
  return (dx * (h.dirX ?? 1) + dy * (h.dirY ?? 0)) / d >= h.arc;
}

export function updateHazards(s: RunState): void {
  const list = s.hazards;
  if (!list || list.length === 0) return;
  s.hazards = list.filter((h) => {
    // 만든 적이 쓰러졌으면 공격도 멈춤
    if (h.owner !== undefined && !s.enemies.some((e) => e.id === h.owner && e.hp > 0)) return false;
    if (s.tick < h.tick) return true;
    if (h.hold) return s.tick < h.tick + 300;
    // 심판: 검정이면 움직인 사람이, 붉은색이면 가만히 있던 사람이 맞음
    // 협동: 범위 안 사람 모두
    eachSeat(
      s,
      () => {
        const p = s.player;
        const hit = h.still ? (h.still === "black") === p.stillTicks < R.STILL_JUDGE : inHazard(h, p.x, p.y, p.r);
        if (hit && h.damage > 0) {
          if (h.noDodge) throughDash(s, () => damagePlayer(s, h.damage, h.by));
          else damagePlayer(s, h.damage, h.by);
        }
      },
      !!s.party,
    );
    if (h.fx) addEffect(s, { kind: h.fx, x: h.x, y: h.y, dirX: h.dirX ?? 0, dirY: h.dirY ?? 0, size: h.radius, maxTicks: 14, toX: h.toX, toY: h.toY, width: h.toX !== undefined ? h.width : h.arc, foe: true, from: h.from });
    else addEffect(s, { kind: "burst", x: h.x, y: h.y, dirX: 0, dirY: 0, size: h.radius * 0.6, maxTicks: 14, foe: true, from: h.from });
    return false;
  });
}
