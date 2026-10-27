// 거대 매 · 거대 전갈 필살기 (체력 10% 아래 한 번, 끝날 때까지 무적 — bosses.updateBoss)
// 매: 맵 전체에 갓이터만큼 굵은 # 모양 선(세로 둘·가로 둘)이 뜨고 매가 빠르게 가로지름 → 바로 앞 선이 없던 자리에 다음 # · 10번 뒤 떨어져 경직
// 전갈: 그 자리에 버티고 꼬리에서 검은 독액(죽음)을 30초 동안 천천히 뿜음 (돌아가는 소용돌이 + 플레이어 쪽 부채꼴)
import { createRng, deriveSeed } from "../rng";
import { hitDamage, shotDamage } from "./bossKit";
import { addShape } from "./hazards";
import { rot } from "./orbit";
import type { EnemyState, RunState } from "./types";
import { addEffect, enemyShot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { ROOM_CX, ROOM_CY } from "../constants";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 매 #: 횟수 · 다음 #까지 · 보이고 터지기까지 · 선 굵기(반) · 피해 배율 · 끝나고 경직 */
  GRID_TIMES: 10,
  GRID_GAP: 75,
  GRID_WARN: 70,
  GRID_W: 24,
  GRID_MUL: 1.2,
  GRID_DAZE: 180,
  /** 전갈 검은 독액: 틱 · 소용돌이 간격 · 갈래 · 도는 빠르기 · 탄 빠르기 · 부채꼴 간격 · 부채꼴 탄 빠르기 */
  DOOM_TICKS: 1800,
  SPIRAL_GAP: 8,
  ARMS: 3,
  SPIN: 0.11,
  SPEED: 0.6,
  FAN_GAP: 90,
  FAN_SPEED: 0.9,
};
export { R as BEAST_ULTS_RULES };

const TAU = Math.PI * 2;

/** 매 #: 모두 미리 깔아 둠 (i번째는 i×간격 뒤에 보이고 그 뒤 터짐). 선은 지난 #의 선 사이 한가운데로 옮겨 감 */
export function startRocUlt(s: RunState, e: EnemyState): void {
  e.ultAt = s.tick;
  e.air = true;
  e.phase = "walk";
  const rng = createRng(deriveSeed(s.seed, "rocUlt", e.id));
  const w = ROOM_MAX_X - ROOM_MIN_X;
  const h = ROOM_MAX_Y - ROOM_MIN_Y;
  let ox = 0.15 + rng.nextFloat() * 0.2;
  let oy = 0.15 + rng.nextFloat() * 0.2;
  for (let i = 0; i < R.GRID_TIMES; i++) {
    const appear = i * R.GRID_GAP;
    const fire = appear + R.GRID_WARN;
    const line = { radius: 0, damage: hitDamage(s) * R.GRID_MUL, width: R.GRID_W, fx: "gleam" as const };
    for (const f of [ox, ox + 0.5]) {
      const x = ROOM_MIN_X + w * f;
      addShape(s, fire, { ...line, x, y: ROOM_MIN_Y, toX: x, toY: ROOM_MAX_Y }, appear);
    }
    for (const f of [oy, oy + 0.5]) {
      const y = ROOM_MIN_Y + h * f;
      addShape(s, fire, { ...line, x: ROOM_MIN_X, y, toX: ROOM_MAX_X, toY: y }, appear);
    }
    ox = (ox + 0.25) % 0.5;
    oy = (oy + 0.25) % 0.5;
  }
}

/** 매 #이 끝나면 방 가운데 떨어져 경직 (true면 필살기 중) */
export function updateRocUlt(s: RunState, e: EnemyState): boolean {
  const t = s.tick - e.ultAt!;
  if (t < (R.GRID_TIMES - 1) * R.GRID_GAP + R.GRID_WARN + 10) return true;
  e.ultAt = undefined;
  e.phase = "act";
  e.timer = R.GRID_DAZE;
  e.x = ROOM_CX;
  e.y = ROOM_CY;
  e.air = false;
  e.immune = false;
  addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r * 2, maxTicks: 18 });
  return false;
}

export function startScorpionUlt(s: RunState, e: EnemyState): void {
  e.ultAt = s.tick;
  e.phase = "act";
  e.air = false;
  e.aux = 0;
}

/** 전갈 검은 독액 30초 (true면 필살기 중) */
export function updateScorpionUlt(s: RunState, e: EnemyState): boolean {
  const t = s.tick - e.ultAt!;
  if (t >= R.DOOM_TICKS) {
    e.ultAt = undefined;
    e.immune = false;
    e.timer = 60;
    return false;
  }
  // 꼬리 끝(등 위)에서
  const tx = e.x - e.dirX * 4;
  const ty = e.y - e.r * 0.6;
  const shot = (dx: number, dy: number, speed: number) =>
    Object.assign(enemyShot(s, tx, ty, dx, dy, speed, shotDamage(s)), { look: "doom" as const, r: 3, doom: true, ticksLeft: 900 });
  if (t % R.SPIRAL_GAP === 0) {
    for (let i = 0; i < R.ARMS; i++) {
      // 테일러 급수가 정확하도록 한 바퀴 안의 각도로
      const d = rot(((t * R.SPIN) % TAU) + (i * TAU) / R.ARMS - Math.PI);
      shot(d[0], d[1], R.SPEED);
    }
  }
  if (t % R.FAN_GAP === R.FAN_GAP / 2) {
    const to = normalize(s.player.x - tx, s.player.y - ty) ?? [0, 1];
    for (const k of [-0.4, -0.2, 0, 0.2, 0.4]) {
      const r = rot(k);
      shot(to[0] * r[0] - to[1] * r[1], to[0] * r[1] + to[1] * r[0], R.FAN_SPEED);
    }
  }
  return true;
}
