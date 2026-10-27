// 1단계(1·2층) 새 보스: 검은 기사 · 얍삽한 활잡이. 체력 절반 아래면 더 빠르고 공격이 늘어남
import { ENEMIES } from "../content";
import { distTo, fan, half, hitDamage, keepAway, ring } from "./bossKit";
import { addShape } from "./hazards";
import type { EnemyState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 검은 기사: 베기 반경·부채꼴 cos · 마지막 회전 베기 반경 · 한 걸음 · 찌르며 돌진 길이·빠르기 */
  SLASH_R: 42,
  SLASH_ARC: 0.25,
  SPIN_R: 57,
  STEP: 8,
  THRUST_LEN: 110,
  THRUST_SPEED: 3.4,
  /** 활잡이: 플레이어가 가까우면 뒤로 뛰는 대기 틱 · 뛰는 빠르기·틱 */
  LEAP_WAIT: 120,
  LEAP_SPEED: 2.6,
  LEAP_TICKS: 16,
  /** 활잡이 화살 피해 배율 (보스 탄 기본 피해에 곱함, 어렵다는 의견으로 낮춤) */
  ARROW_MUL: 0.6,
};
export { R as BOSSES_ONE_RULES };

type Vec = readonly [number, number];

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
      addShape(s, warn, { x: e.x, y: e.y, radius: 0, damage: hitDamage(s), toX: e.x + toP[0] * R.THRUST_LEN, toY: e.y + toP[1] * R.THRUST_LEN, width: 6, fx: "stab" });
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
    e.x += toP[0] * R.STEP;
    e.y += toP[1] * R.STEP;
    const spin = st === 3;
    const warn = h ? 20 : 26;
    addShape(s, warn, { x: e.x, y: e.y, radius: spin ? R.SPIN_R : R.SLASH_R + st * 4, damage: hitDamage(s), dirX: toP[0], dirY: toP[1], arc: spin ? -1 : R.SLASH_ARC, fx: "bslash" });
    if (h && st === 2) fan(s, e, toP, [-1, 0, 1], 1.6);
    e.step = st + 1;
    e.timer = warn + 10;
  } else if (e.phase === "windup") {
    if (e.timer <= 0) {
      e.phase = "charge";
      e.timer = Math.round(R.THRUST_LEN / R.THRUST_SPEED);
    }
  } else {
    e.x += e.dirX * R.THRUST_SPEED;
    e.y += e.dirY * R.THRUST_SPEED;
    if (e.timer <= 0) {
      e.phase = "walk";
      e.timer = h ? 50 : 80;
    }
  }
}

/** 얍삽한 활잡이: 거리를 두고 옆걸음 · 벽에 튕기는 화살 부채꼴 · 사방 화살 · 가까이 오면 뒤로 뜀 */
export function updateArcher(s: RunState, e: EnemyState, toP: Vec, go: Vec): void {
  const h = half(e);
  if ((e.aux ?? 0) > 0) e.aux = (e.aux ?? 0) - 1;
  if (e.phase === "charge") {
    e.x += e.dirX * R.LEAP_SPEED;
    e.y += e.dirY * R.LEAP_SPEED;
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
    e.timer = R.LEAP_TICKS;
    e.dirX = -toP[0];
    e.dirY = -toP[1];
    e.aux = R.LEAP_WAIT;
    return;
  }
  if (e.timer > 0) return;
  e.count++;
  const from = s.projectiles.length;
  if (e.count % 3 === 0) ring(s, e, h ? 1 : 2, e.count, 1.5, { look: "arrow", bounces: 1 });
  else fan(s, e, toP, h ? [-2, -1, 0, 1, 2] : [-1, 0, 1], 2.2, { look: "arrow", bounces: h ? 2 : 1 });
  // 방금 쏜 화살은 약하게
  for (const pr of s.projectiles.slice(from)) pr.damage = Math.max(1, Math.round(pr.damage * R.ARROW_MUL));
  e.timer = h ? 55 : 75;
}
