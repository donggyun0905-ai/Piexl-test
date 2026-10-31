// 졸개 행동 (enemies에서 부름): 날벌레(무리 지어 천천히, 흔들리며) · 가디언(돌진 → 멈춰서 앞쪽 휘두르기)
import { ENEMIES } from "../content";
import { renMelee } from "./ren";
import { damagePlayer } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, DIR16, dist2, normalize } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 날벌레: 이 거리 안 같은 무리 쪽으로 모이는 힘 · 흔들림 크기 */
  GNAT_FLOCK: 40,
  GNAT_PULL: 0.35,
  GNAT_WOBBLE: 0.45,
  /** 천사장을 지키는 가디언이 서는 거리 */
  GUARD_RING: 22,
  GUARD_WINDUP: 30,
  GUARD_CHARGE: 16,
  GUARD_DASH: 2.4,
  GUARD_DAMAGE: 14,
};
export { R as MINIONS_RULES };

/** 날벌레 무리: 한 자리에 6마리, 넓게 퍼져서 나옴 (방 배치·연습장 같이 씀) */
export const SWARM: readonly (readonly [number, number])[] = [[0, 0], [22, 8], [-20, 12], [8, -22], [-14, -18], [18, 24]];
/** 날벌레 빠르기: 플레이어 이동 속도의 이 배율 (절반) */
export const GNAT_SPEED_MUL = 0.5;
/** 가디언: 이 거리 안에 들어오면 돌진 준비 · 준비 틱 · 돌진 틱·빠르기 · 휘두르기 준비 틱 · 휘두르는 거리·범위(cos)·피해 */
export const GUARD_NEAR = 90;
export const GUARD_SWING_TICKS = 20;
export const GUARD_REACH = 26;
export const GUARD_ARC = 0.3;

/** 날벌레: 플레이어의 절반 빠르기로 다가가되 가까운 무리 쪽으로 모이고, 이리저리 흔들림 */
export function updateGnat(s: RunState, e: EnemyState, go: readonly [number, number]): void {
  const speed = s.player.stats.moveSpeed * GNAT_SPEED_MUL;
  let cx = 0;
  let cy = 0;
  let n = 0;
  for (const o of s.enemies) {
    if (o === e || o.kind !== "gnat" || o.hp <= 0 || dist2(o, e) > R.GNAT_FLOCK * R.GNAT_FLOCK) continue;
    cx += o.x;
    cy += o.y;
    n++;
  }
  const flock: readonly [number, number] = n > 0 ? (normalize(cx / n - e.x, cy / n - e.y) ?? [0, 0]) : [0, 0];
  const w = DIR16[(Math.floor(s.tick / 12) + e.id * 5) % 16]!;
  const dir = normalize(go[0] + flock[0] * R.GNAT_PULL + w[0] * R.GNAT_WOBBLE, go[1] + flock[1] * R.GNAT_PULL + w[1] * R.GNAT_WOBBLE) ?? [0, 0];
  e.x += dir[0] * speed;
  e.y += dir[1] * speed;
  e.dirX = dir[0];
}

/** 가디언: 걷기 → (가까우면) 돌진 준비 → 돌진 → 멈춰서 휘두르기 준비 → 앞쪽 휘두르기 */
export function updateGuardian(s: RunState, e: EnemyState, toP: readonly [number, number], go: readonly [number, number]): void {
  const p = s.player;
  e.timer--;
  if (e.phase === "walk") {
    e.x += go[0] * ENEMIES.guardian.speed;
    e.y += go[1] * ENEMIES.guardian.speed;
    e.dirX = toP[0];
    e.dirY = toP[1];
    if (e.timer <= 0 && dist2(e, p) < GUARD_NEAR * GUARD_NEAR) {
      e.phase = "windup";
      e.timer = R.GUARD_WINDUP;
    }
  } else if (e.phase === "windup") {
    e.dirX = toP[0];
    e.dirY = toP[1];
    if (e.timer <= 0) {
      e.phase = "charge";
      e.timer = R.GUARD_CHARGE;
    }
  } else if (e.phase === "charge") {
    e.x += e.dirX * R.GUARD_DASH;
    e.y += e.dirY * R.GUARD_DASH;
    const close = (GUARD_REACH - 6) * (GUARD_REACH - 6);
    if (e.timer <= 0 || dist2(e, p) < close) {
      // 멈춰서 플레이어 쪽으로 휘두를 준비 (예고 표시)
      e.phase = "swing";
      e.timer = GUARD_SWING_TICKS;
      e.dirX = toP[0];
      e.dirY = toP[1];
    }
  } else if (e.timer <= 0) {
    // 휘두르기: 앞쪽 부채꼴 안이면 맞음 (대시로 피할 수 있음)
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d <= GUARD_REACH + p.r && (d < e.r + p.r || (dx * e.dirX + dy * e.dirY) / d >= GUARD_ARC) && p.dashTicks === 0) damagePlayer(s, renMelee(s, R.GUARD_DAMAGE), "guardian");
    addEffect(s, { kind: "cleave", x: e.x, y: e.y, dirX: e.dirX, dirY: e.dirY, size: GUARD_REACH, maxTicks: 10 });
    e.phase = "walk";
    e.timer = 90;
  }
}

/** 천사장 곁을 지키는 가디언: 플레이어가 가까이 오기 전까지 천사장 둘레 자리로 걸음 (aux = 천사장 id) */
export function guardSpot(s: RunState, e: EnemyState, go: readonly [number, number]): readonly [number, number] {
  const boss = s.enemies.find((o) => o.id === e.aux && o.hp > 0);
  if (!boss || dist2(e, s.player) < GUARD_NEAR * GUARD_NEAR) return go;
  const d = DIR16[(e.id * 5 + Math.floor(s.tick / 20)) % 16]!;
  const to = normalize(boss.x + d[0] * R.GUARD_RING - e.x, boss.y + d[1] * R.GUARD_RING - e.y);
  const far = (boss.x + d[0] * R.GUARD_RING - e.x) ** 2 + (boss.y + d[1] * R.GUARD_RING - e.y) ** 2;
  return to && far > 4 ? to : [0, 0];
}
