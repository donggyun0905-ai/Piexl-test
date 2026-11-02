// 원소술사 공격 키: 강철 구슬 총알 · 트리거(구슬을 쏘고 다 쓰면 재장전) · 중력 내려찍기 · 갓 핸드(잡아 들었다 내려찍기)
// 나머지 무기(원소구슬·빛·은하수·행성·검·별)는 공격 키 없이 회전체가 알아서 때림 (orbit)
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import { blastAt, damageEnemy } from "./combat";
import { orbCount } from "./orbit";
import { CRIT_MUL } from "./orbitBlades";
import { orbShot } from "./orbitPerks";
import type { EnemyState, RunState } from "./types";
import { weaponDot } from "./orbitElements";
import { addEffect, dist2, keepInRoom, normalize, roomGrid, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 강철 총알 · 트리거 탄 빠르기 */
  STEEL_SPEED: 4.5,
  TRIGGER_SPEED: 7,
  TRIGGER_PIERCE: 3,
  TRIGGER_GROW: 0.5,
  TRIGGER_ADD: 2,
  /** 트리거 치명타: 기본 20%, 무기 기본 수보다 더 채워진 구슬 하나마다 +5% */
  TRIGGER_CRIT: 0.2,
  TRIGGER_CRIT_ADD: 0.05,
  /** 중력: 띄웠다 찍는 기절 틱 */
  GRAVITY_STUN: 24,
  /** 중력: 같은 자리에 두 번째 중력이 이 틱 뒤 한 번 더 (공격력 배율) */
  GRAVITY_ECHO: 30,
  GRAVITY_ECHO_MUL: 0.7,
  HAND_RADIUS: 28,
  HAND_BOSS_MUL: 2,
  HAND_LIFT: 18,
};
export { R as ORBIT_ATTACK_RULES };

/** 트리거: 재장전 2초 · 쏠 때 50% 확률로 +2 · 최대 15개, 다 차면 한 번에 모두 2배로 */
export const TRIGGER_RELOAD = 120;
export const TRIGGER_MAX = 15;
/** 갓 핸드: 들고 있는 틱 · 찍는 범위 · 보스전 피해 배율 · 잡은 적을 드는 높이 */
export const HAND_TICKS = 24;

/** 공격 키 (공격 속도 간격마다) */
export function orbitAttack(s: RunState): void {
  const p = s.player;
  const w = weaponOf(p);
  const dmg = p.stats.damage;
  const face: [number, number] = [p.faceX, p.faceY];
  const ticks = (speed: number) => Math.ceil(p.stats.range / speed);
  if (w.orbit === "steel") {
    s.projectiles.push(orbShot(s, p.x + face[0] * 6, p.y + face[1] * 6, face, R.STEEL_SPEED, dmg, "steel", { ticksLeft: ticks(R.STEEL_SPEED), dot: "bleed" }));
  } else if (w.orbit === "trigger") {
    triggerShot(s, dmg, ticks(R.TRIGGER_SPEED));
  } else if (w.orbit === "gravity") {
    gravitySlam(s, dmg);
  } else if (w.orbit === "hand") {
    grab(s);
  }
}

function triggerShot(s: RunState, dmg: number, life: number): void {
  const p = s.player;
  if ((p.reloadTicks ?? 0) > 0) return;
  const loaded = p.loaded ?? orbCount(p);
  const chance = R.TRIGGER_CRIT + R.TRIGGER_CRIT_ADD * Math.max(0, loaded - orbCount(p));
  const shot = (dx: number, dy: number, mul: number) => {
    const crit = createRng(deriveSeed(s.seed, "triggerCrit", s.nextId)).nextFloat() < chance;
    const pr = orbShot(s, p.x, p.y, [dx, dy], R.TRIGGER_SPEED, dmg * mul * (crit ? CRIT_MUL : 1), "trigger", { ticksLeft: life, pierce: R.TRIGGER_PIERCE, hitIds: [], dot: "storm" });
    s.projectiles.push(crit ? { ...pr, crit } : pr);
  };
  if (loaded >= TRIGGER_MAX) {
    // 15개가 다 차면 부채꼴로 모두 한 번에, 피해 2배
    for (let i = 0; i < loaded; i++) {
      const k = (i - (loaded - 1) / 2) * 0.06;
      const d = normalize(p.faceX - p.faceY * k, p.faceY + p.faceX * k) ?? [p.faceX, p.faceY];
      shot(d[0], d[1], 2);
    }
    p.loaded = 0;
  } else {
    shot(p.faceX, p.faceY, 1);
    p.loaded = loaded - 1;
    if (createRng(deriveSeed(s.seed, "trigger", s.tick)).nextFloat() < R.TRIGGER_GROW) p.loaded = Math.min(TRIGGER_MAX, p.loaded + R.TRIGGER_ADD);
  }
  if (p.loaded <= 0) p.reloadTicks = TRIGGER_RELOAD;
}

function gravitySlam(s: RunState, dmg: number): void {
  const p = s.player;
  for (const e of s.enemies) {
    const rr = p.stats.range + e.r;
    if (e.hp <= 0 || e.immune || dist2(e, p) > rr * rr) continue;
    damageEnemy(s, e, dmg, 0, 0);
    weaponDot(s, e, "curse", dmg);
    if (e.kind !== "dummy") e.stunTicks = Math.max(e.stunTicks ?? 0, ENEMIES[e.kind].boss ? R.GRAVITY_STUN / 2 : R.GRAVITY_STUN);
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r * 2, maxTicks: 12 });
  }
  addEffect(s, { kind: "slam", x: p.x, y: p.y, dirX: 0, dirY: 0, size: p.stats.range, maxTicks: 20 });
  // 같은 자리에 두 번째 중력: 잠시 뒤 한 번 더 내려앉음
  s.pendingBlasts.push({ tick: s.tick + R.GRAVITY_ECHO, x: p.x, y: p.y, radius: p.stats.range, damage: dmg * R.GRAVITY_ECHO_MUL });
  addEffect(s, { kind: "elWell", x: p.x, y: p.y, dirX: 0, dirY: 0, size: p.stats.range, maxTicks: R.GRAVITY_ECHO });
}

/** 갓 핸드: 사거리 안 가까운 일반 적을 잡아 듦. 보스·허수아비 앞이면 돌멩이를 듦 (handId 0) */
function grab(s: RunState): void {
  const p = s.player;
  if ((p.handTicks ?? 0) > 0) return;
  let best: EnemyState | null = null;
  let any = false;
  for (const e of s.enemies) {
    const rr = p.stats.range + e.r;
    if (e.hp <= 0 || e.immune || dist2(e, p) > rr * rr) continue;
    any = true;
    if (ENEMIES[e.kind].boss || e.kind === "dummy") continue;
    if (!best || dist2(e, p) < dist2(best, p)) best = e;
  }
  if (!best && !any) return;
  p.handId = best ? best.id : 0;
  p.handTicks = HAND_TICKS;
}

/** 틱마다: 잡은 적을 머리 위에 들고 있다가 가까운 다른 적에게 내려찍음 */
export function updateHand(s: RunState): void {
  const p = s.player;
  if ((p.handTicks ?? 0) <= 0) return;
  p.handTicks = (p.handTicks ?? 0) - 1;
  const held = p.handId ? s.enemies.find((e) => e.id === p.handId && e.hp > 0) : undefined;
  if (held) {
    held.x = p.x;
    held.y = p.y - R.HAND_LIFT;
    keepInRoom(held, roomGrid(s));
    held.stunTicks = Math.max(held.stunTicks ?? 0, 2);
  }
  if (p.handTicks > 0) return;
  // 내려찍을 자리: 가장 가까운 다른 적 (없으면 바라보는 쪽)
  let target: EnemyState | null = null;
  for (const e of s.enemies) {
    if (e === held || e.hp <= 0) continue;
    if (!target || dist2(e, p) < dist2(target, p)) target = e;
  }
  const x = target ? target.x : p.x + p.faceX * 40;
  const y = target ? target.y : p.y + p.faceY * 40;
  if (held) {
    held.x = x;
    held.y = y;
    keepInRoom(held, roomGrid(s));
  }
  const boss = s.enemies.some((e) => ENEMIES[e.kind].boss && e.hp > 0);
  blastAt(s, x, y, R.HAND_RADIUS, p.stats.damage * (boss ? R.HAND_BOSS_MUL : 1));
  for (const e of s.enemies) if (e.hp > 0 && (e.x - x) ** 2 + (e.y - y) ** 2 <= (R.HAND_RADIUS + e.r) ** 2) weaponDot(s, e, "gold", p.stats.damage);
  addEffect(s, { kind: "slam", x, y, dirX: 0, dirY: 0, size: R.HAND_RADIUS, maxTicks: 18 });
  p.handId = undefined;
}
