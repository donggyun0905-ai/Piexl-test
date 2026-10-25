// 1단계(1·2층) 새 보스: 검은 기사 · 얍삽한 활잡이. 체력 절반 아래면 더 빠르고 공격이 늘어남
import { ENEMIES } from "../content";
import { distTo, fan, half, hitDamage, keepAway, ring } from "./bossKit";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";

type Vec = readonly [number, number];

/** 검은 기사: 베기 반경·부채꼴 cos · 마지막 회전 베기 반경 · 한 걸음 · 찌르며 돌진 길이·빠르기 */
const SLASH_R = 42;
const SLASH_ARC = 0.25;
const SPIN_R = 57;
const STEP = 8;
const THRUST_LEN = 110;
const THRUST_SPEED = 3.4;

/** 검은 기사: 걷기 → 3연속 베기(절반 아래면 회전 베기까지 4연속, 세 번째에 검기) 또는 찌르며 돌진 */
export function updateKnight(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const h = half(e);
  if (e.phase === "walk") {
    e.x += go[0] * ENEMIES.knight.speed;
    e.y += go[1] * ENEMIES.knight.speed;
    e.dirX = toP[0];
    e.dirY = toP[1];
    if (e.timer > 0) return;
    e.count++;
    if (distTo(s, e) < 70 || e.count % 3 !== 0) {
      e.phase = "swing";
      e.step = 0;
      e.timer = 0;
    } else {
      // 찌르며 돌진: 플레이어 쪽 긴 선이 먼저 보이고, 선이 터지는 순간 돌진
      const warn = h ? 30 : 40;
      e.phase = "windup";
      e.timer = warn;
      addShape(s, warn, { x: e.x, y: e.y, radius: 0, damage: hitDamage(s), toX: e.x + toP[0] * THRUST_LEN, toY: e.y + toP[1] * THRUST_LEN, width: 6, fx: "stab" });
    }
  } else if (e.phase === "swing") {
    if (e.timer > 0) return;
    const n = h ? 4 : 3;
    const st = e.step ?? 0;
    if (st >= n) {
      e.phase = "walk";
      e.timer = h ? 60 : 90;
      return;
    }
    e.dirX = toP[0];
    e.dirY = toP[1];
    e.x += toP[0] * STEP;
    e.y += toP[1] * STEP;
    const spin = st === 3;
    const warn = h ? 20 : 26;
    addShape(s, warn, { x: e.x, y: e.y, radius: spin ? SPIN_R : SLASH_R + st * 4, damage: hitDamage(s), dirX: toP[0], dirY: toP[1], arc: spin ? -1 : SLASH_ARC, fx: "bslash" });
    if (h && st === 2) fan(s, e, toP, [-1, 0, 1], 1.6);
    e.step = st + 1;
    e.timer = warn + 10;
  } else if (e.phase === "windup") {
    if (e.timer <= 0) {
      e.phase = "charge";
      e.timer = Math.round(THRUST_LEN / THRUST_SPEED);
    }
  } else {
    e.x += e.dirX * THRUST_SPEED;
    e.y += e.dirY * THRUST_SPEED;
    if (e.timer <= 0) {
      e.phase = "walk";
      e.timer = h ? 50 : 80;
    }
  }
}

/** 활잡이: 플레이어가 가까우면 뒤로 뛰는 대기 틱 · 뛰는 빠르기·틱 */
const LEAP_WAIT = 120;
const LEAP_SPEED = 2.6;
const LEAP_TICKS = 16;

/** 얍삽한 활잡이: 거리를 두고 옆걸음 · 벽에 튕기는 화살 부채꼴 · 사방 화살 · 가까이 오면 뒤로 뜀 */
export function updateArcher(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const h = half(e);
  if ((e.aux ?? 0) > 0) e.aux = (e.aux ?? 0) - 1;
  if (e.phase === "charge") {
    e.x += e.dirX * LEAP_SPEED;
    e.y += e.dirY * LEAP_SPEED;
    if (e.timer <= 0) {
      e.phase = "walk";
      e.timer = 20;
    }
    return;
  }
  const speed = ENEMIES.archer.speed;
  keepAway(s, e, toP, go, 95, speed);
  // 옆걸음 (공격할 때마다 방향을 바꿈)
  const side = e.count % 2 === 0 ? 1 : -1;
  e.x += -toP[1] * side * speed * 0.6;
  e.y += toP[0] * side * speed * 0.6;
  e.dirX = toP[0];
  if (distTo(s, e) < 40 && (e.aux ?? 0) === 0) {
    e.phase = "charge";
    e.timer = LEAP_TICKS;
    e.dirX = -toP[0];
    e.dirY = -toP[1];
    e.aux = LEAP_WAIT;
    return;
  }
  if (e.timer > 0) return;
  e.count++;
  if (e.count % 3 === 0) ring(s, e, h ? 1 : 2, e.count, 1.5, { look: "arrow", bounces: 1 });
  else fan(s, e, toP, h ? [-2, -1, 0, 1, 2] : [-1, 0, 1], 2.2, { look: "arrow", bounces: h ? 2 : 1 });
  e.timer = h ? 55 : 75;
}
