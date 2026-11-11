// 갓이터 혼자 남았을 때: 방을 4분할해 무작위 구역에 거대한 낫을 내려 하나씩 닫음 (마지막 한 곳만 남음)
// 닫히는 순간 그 구역에 있으면(대시로 피하지 못하면) 피해 20 + 태초의 어둠처럼 깜깜해짐. 닫힌 구역에 머물러도 같음
import { dashDodged } from "./remnant";
import { ROOM_CX, ROOM_CY } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { damagePlayer as damagePlayer_ } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { srcFn } from "./dmgSrc";
const damagePlayer = srcFn("bossZones", () => damagePlayer_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 닫는 구역 수 · 첫 예고 · 구역 사이 간격 · 다 닫힌 뒤 다시 열릴 때까지 · 닫힌 구역에 머물면 다시 맞는 간격 */
  CLOSE: 3,
  FIRST: 70,
  GAP: 70,
  HOLD: 90,
  REHIT: 30,
  BLIND_TICKS: 300,
};
export { R as BOSS_ZONES_RULES };

/** 갇혔을 때 피해 · 깜깜한 틱 */
export const ZONE_DAMAGE = 20;

/** 사분면 q의 [왼, 위, 오른, 아래] (0 왼위 · 1 오른위 · 2 왼아래 · 3 오른아래) */
export function zoneRect(q: number): [number, number, number, number] {
  const left = q % 2 === 0;
  const top = q < 2;
  return [left ? ROOM_MIN_X : ROOM_CX, top ? ROOM_MIN_Y : ROOM_CY, left ? ROOM_CX : ROOM_MAX_X, top ? ROOM_CY : ROOM_MAX_Y];
}

function inZone(q: number, x: number, y: number): boolean {
  const [l, t, r, b] = zoneRect(q);
  return x >= l && x <= r && y >= t && y <= b;
}

/** 구역 닫기 시작 (이미 진행 중이면 false) */
export function closeZones(s: RunState, e: EnemyState): boolean {
  if (e.zones) return false;
  const rng = createRng(deriveSeed(s.seed, "zones", e.id, s.tick));
  const order = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) {
    const j = rng.int(0, i);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  e.zones = order.slice(0, R.CLOSE).map((q, i) => ({ q, at: s.tick + R.FIRST + i * R.GAP }));
  e.zonesEnd = s.tick + R.FIRST + (R.CLOSE - 1) * R.GAP + R.HOLD;
  return true;
}

function trap(s: RunState): void {
  const p = s.player;
  if (p.invulnTicks > 0 || dashDodged(s)) return;
  damagePlayer(s, ZONE_DAMAGE);
  p.blindTicks = R.BLIND_TICKS;
}

/** 틱마다: 낫이 내려오면 구역이 닫히고, 닫힌 구역 안의 플레이어를 맞힘 · 시간이 되면 다 열림 */
export function updateZones(s: RunState, e: EnemyState): void {
  if (!e.zones) return;
  const p = s.player;
  if (s.tick >= (e.zonesEnd ?? 0) || e.hp <= 0) {
    e.zones = undefined;
    e.zonesEnd = undefined;
    return;
  }
  for (const z of e.zones) {
    if (s.tick < z.at) continue;
    if (s.tick === z.at) {
      const [l, t, r, b] = zoneRect(z.q);
      addEffect(s, { kind: "burst", x: (l + r) / 2, y: (t + b) / 2, dirX: 0, dirY: 0, size: (r - l) / 2, maxTicks: 18 });
    }
    if ((s.tick - z.at) % R.REHIT === 0 && inZone(z.q, p.x, p.y)) trap(s);
  }
}
