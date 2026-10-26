// 의사, 틱마다: 가운·건강 검진·항체 반응 · 무기 준비 · 날아가는 탄 · 마취 가스 장판 · 구급 키트 폭발 · 봉합 바늘(실·봉합) · 회복 알약 · 구급차
// (던진 것이 날아가는 건 laserGear가 같이 처리)
import { ENEMIES } from "../content";
import { createRng, deriveSeed } from "../rng";
import { damageEnemy, healPlayer, removeDead } from "./combat";
import { blocksShot } from "./layout";
import { PRESCRIPTION_MUL } from "./items";
import { AMB_TICKS, areaMul, GAS_LIFE, medicHit, medicPeriod, reachMul, SUTURE_TICKS } from "./medicWeapons";
import type { Device, EnemyState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, markDot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 항체 반응: 최소 간격(0.3초), 범위 */
  ANTIBODY_EVERY: 18,
  ANTIBODY_RADIUS: 60,
  /** 마취 가스: 범위, 초당 피해(공격력 × 공격 속도 비율) */
  GAS_RADIUS: 32,
  GAS_MUL: 0.8,
  /** 구급 키트: 폭발 범위, 처치한 적이 회복 알약을 떨어뜨릴 확률 */
  MEDKIT_RADIUS: 32,
  PILL_CHANCE: 0.4,
  /** 회복 알약: 회복량, 최대 수, 남는 틱(10초), 줍는 거리 */
  PILL_HEAL: 6,
  PILL_MAX: 5,
  PILL_LIFE: 600,
  PILL_TOUCH: 6,
  /** 봉합 바늘: 실이 끊기는 길이, 실 초당 피해 비율, 봉합 때 가운데로 끌려가는 비율 */
  THREAD_MAX: 120,
  THREAD_MUL: 0.8,
  SUTURE_PULL: 0.7,
  /** 봉합 때 꽂힌 적 하나가 받는 피해 (공격력 배율) */
  SUTURE_MUL: 1.5,
  /** 구급차: 치는 너비(절반), 옆으로 밀어내기 */
  AMB_WIDTH: 12,
  AMB_PUSH: 12,
  /** 봉합 바늘: 최대 수 · 날아가는 탄이 적에 닿는 거리 (몸 반지름에 더함) */
  NEEDLE_MAX: 5,
  SHOT_TOUCH: 2,
  /** 매 틱 맞는 피해(장판·실)는 이 틱마다만 반짝임 */
  FLASH_EVERY: 9,
};
export { R as MEDIC_GEAR_RULES };

export function updateMedicGear(s: RunState): void {
  const p = s.player;
  const w = weaponOf(p);
  if (p.gownTicks) p.gownTicks--;
  if (hasPerk(p, "checkup")) p.fullTicks = p.hp >= p.stats.maxHp ? (p.fullTicks ?? 0) + 1 : 0;
  // 항체 반응: 보호막이 막은 피해를 모아 두었다가 0.3초에 한 번 주변에 돌려줌
  if ((p.antiStore ?? 0) > 0 && s.tick - (p.antiLast ?? -R.ANTIBODY_EVERY) >= R.ANTIBODY_EVERY) {
    for (const e of inside(s, p.x, p.y, R.ANTIBODY_RADIUS)) {
      const dir = normalize(e.x - p.x, e.y - p.y) ?? [0, 0];
      damageEnemy(s, e, p.antiStore ?? 0, dir[0], dir[1]);
    }
    addEffect(s, { kind: "antibody", x: p.x, y: p.y, dirX: 0, dirY: 0, size: R.ANTIBODY_RADIUS, maxTicks: 16, follow: true });
    p.antiStore = 0;
    p.antiLast = s.tick;
  }
  const period = medicPeriod(p);
  if (period > 0) p.gearTicks = Math.min(period, (p.gearTicks ?? period) + 1);
  if (w.medic !== "transfusion") p.tubeTargetId = undefined;
  if (!s.devices?.length) return removeDead(s);
  // 무기를 바꾸면 가스 장판·봉합 바늘은 사라짐 (알약·구급차·날아가는 키트는 그대로)
  s.devices = s.devices.filter((d) => (d.kind === "gas" ? w.medic === "gas" : d.kind === "needle" ? w.medic === "suture" : true));
  const perTick = (mul: number) => (p.stats.damage * p.stats.attackSpeed * mul) / 60;
  const flash = s.tick % R.FLASH_EVERY === 0;
  for (const d of [...s.devices]) {
    if ((d.fly ?? 0) > 0) continue;
    if (d.kind === "shot") shot(s, d);
    else if (d.kind === "gas") {
      // 막 떨어진 가스통: 가스가 퍼짐
      if (d.life === GAS_LIFE) addEffect(s, { kind: "puff", x: d.x, y: d.y, dirX: 0, dirY: 0, size: R.GAS_RADIUS * areaMul(p), maxTicks: 20 });
      d.life = (d.life ?? 0) - 1;
      if (d.life <= 0) remove(s, d);
      else for (const e of inside(s, d.x, d.y, R.GAS_RADIUS * areaMul(p))) {
        const before = e.hp;
        medicHit(s, e, perTick(R.GAS_MUL), 1, flash);
        markDot(s, e, "poison", before - e.hp);
        e.slowTicks = 2;
      }
    } else if (d.kind === "medkit") medkitBlast(s, d);
    else if (d.kind === "pill") pill(s, d);
    else if (d.kind === "ambulance") ambulance(s, d);
  }
  needles(s, perTick(R.THREAD_MUL), flash);
  removeDead(s);
}

function remove(s: RunState, d: Device): void {
  s.devices = (s.devices ?? []).filter((x) => x !== d);
}

function inside(s: RunState, x: number, y: number, radius: number): EnemyState[] {
  return s.enemies.filter((e) => {
    const rr = radius + e.r;
    return e.hp > 0 && (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y) <= rr * rr;
  });
}

/** 구급 키트: 떨어진 자리에서 폭발. 폭발로 쓰러진 적은 확률로 회복 알약 (시드 랜덤) */
function medkitBlast(s: RunState, d: Device): void {
  remove(s, d);
  const radius = R.MEDKIT_RADIUS * areaMul(s.player);
  for (const e of inside(s, d.x, d.y, radius)) {
    medicHit(s, e, d.dmg ?? 0);
    if (e.hp > 0) continue;
    const pills = (s.devices ?? []).filter((x) => x.kind === "pill").length;
    if (pills < R.PILL_MAX && createRng(deriveSeed(s.seed, "pill", s.tick, e.id)).nextFloat() < R.PILL_CHANCE) {
      (s.devices ??= []).push({ id: s.nextId++, kind: "pill", x: e.x, y: e.y, timer: 0, life: R.PILL_LIFE });
    }
  }
  addEffect(s, { kind: "medburst", x: d.x, y: d.y, dirX: 0, dirY: 0, size: radius, maxTicks: 18 });
}

/** 날아가는 탄: 벽에 막히거나 사거리 끝이면 사라짐, 첫 적에 맞음. 봉합 바늘은 그 적에게 꽂힘 (최대 4개, 같은 적엔 하나) */
function shot(s: RunState, d: Device): void {
  d.x += d.vx ?? 0;
  d.y += d.vy ?? 0;
  d.life = (d.life ?? 0) - 1;
  const g = roomGrid(s);
  const out = d.x < ROOM_MIN_X || d.x > ROOM_MAX_X || d.y < ROOM_MIN_Y || d.y > ROOM_MAX_Y || (g !== null && blocksShot(g, d.x, d.y));
  const e = out ? undefined : inside(s, d.x, d.y, R.SHOT_TOUCH)[0];
  if (e) {
    medicHit(s, e, d.dmg ?? 0);
    addEffect(s, { kind: d.shot === "pill" ? "pillpop" : "cut", x: d.x, y: d.y, dirX: d.vx ?? 0, dirY: d.vy ?? 0, size: 3, maxTicks: 10, width: d.id % 3 });
    const needles = (s.devices ?? []).filter((n) => n.kind === "needle");
    if (d.shot === "needle" && needles.length < R.NEEDLE_MAX && !needles.some((n) => n.enemyId === e.id)) {
      s.devices!.push({ id: s.nextId++, kind: "needle", x: e.x, y: e.y, timer: SUTURE_TICKS, enemyId: e.id });
    }
  }
  if (e || out || d.life <= 0) remove(s, d);
}

/** 회복 알약: 닿으면 회복 (회복 아이템이라 처방전 적용), 시간이 지나면 사라짐 */
function pill(s: RunState, d: Device): void {
  const p = s.player;
  d.life = (d.life ?? 0) - 1;
  const rr = p.r + R.PILL_TOUCH;
  if ((d.x - p.x) * (d.x - p.x) + (d.y - p.y) * (d.y - p.y) <= rr * rr) {
    healPlayer(s, R.PILL_HEAL * (hasPerk(p, "prescription") ? PRESCRIPTION_MUL : 1));
    addEffect(s, { kind: "hit", x: d.x, y: d.y, dirX: 0, dirY: 0, size: 4, maxTicks: 8 });
    remove(s, d);
  } else if (d.life <= 0) remove(s, d);
}

/** 구급차: 벽을 무시하고 곧게 달리며 닿은 적을 치고 옆으로 밀어냄 (보스는 피해만). 왕복이면 한 번 더 */
function ambulance(s: RunState, d: Device): void {
  const vx = d.vx ?? 0;
  const vy = d.vy ?? 0;
  d.x += vx;
  d.y += vy;
  const sp = Math.sqrt(vx * vx + vy * vy) || 1;
  const nx = -vy / sp;
  const ny = vx / sp;
  const g = roomGrid(s);
  for (const e of inside(s, d.x, d.y, R.AMB_WIDTH * reachMul(s.player))) {
    if (d.hitIds?.includes(e.id)) continue;
    (d.hitIds ??= []).push(e.id);
    medicHit(s, e, d.dmg ?? 0);
    addEffect(s, { kind: "bump", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: 14 });
    if (ENEMIES[e.kind].boss || e.kind === "dummy") continue;
    const side = (e.x - d.x) * nx + (e.y - d.y) * ny >= 0 ? 1 : -1;
    e.x += nx * side * R.AMB_PUSH;
    e.y += ny * side * R.AMB_PUSH;
    keepInRoom(e, g);
  }
  if (--d.timer > 0) return;
  if (!d.back) return remove(s, d);
  d.back = false;
  d.vx = -vx;
  d.vy = -vy;
  d.timer = AMB_TICKS;
  d.hitIds = [];
}

/** 봉합 바늘: 꽂힌 적을 따라감 (쓰러지면 그 자리에 고정). 이어진 바늘 사이 실에 닿은 다른 적은 피해. 3초 되면 봉합 */
function needles(s: RunState, threadDmg: number, flash: boolean): void {
  const list = (s.devices ?? []).filter((d) => d.kind === "needle");
  if (list.length === 0) return;
  for (const n of list) {
    const e = s.enemies.find((x) => x.id === n.enemyId && x.hp > 0);
    if (e) [n.x, n.y] = [e.x, e.y];
    else n.enemyId = 0;
    n.timer--;
  }
  const stuck = new Set(list.map((n) => n.enemyId));
  for (let i = 0; i + 1 < list.length; i++) {
    const a = list[i]!;
    const b = list[i + 1]!;
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const len2 = vx * vx + vy * vy;
    if (len2 > R.THREAD_MAX * R.THREAD_MAX) continue;
    for (const e of s.enemies) {
      if (e.hp <= 0 || stuck.has(e.id)) continue;
      const k = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((e.x - a.x) * vx + (e.y - a.y) * vy) / len2));
      const dx = a.x + vx * k - e.x;
      const dy = a.y + vy * k - e.y;
      if (dx * dx + dy * dy <= (e.r + 2) * (e.r + 2)) medicHit(s, e, threadDmg, 1, flash);
    }
  }
  if (list.some((n) => n.timer <= 0)) sutureAll(s, list);
}

/** 봉합: 꽂힌 적들이 가운데로 끌려 모이고(보스는 그대로, 보스가 있으면 보스 쪽으로) 각각 공격력만큼 피해. 바늘은 사라짐 */
function sutureAll(s: RunState, list: Device[]): void {
  const p = s.player;
  const stuck = list.map((n) => s.enemies.find((e) => e.id === n.enemyId && e.hp > 0)).filter((e): e is EnemyState => !!e);
  const boss = stuck.find((e) => ENEMIES[e.kind].boss);
  const cx = boss ? boss.x : list.reduce((a, n) => a + n.x, 0) / list.length;
  const cy = boss ? boss.y : list.reduce((a, n) => a + n.y, 0) / list.length;
  const g = roomGrid(s);
  for (const e of stuck) {
    if (!ENEMIES[e.kind].boss && e.kind !== "dummy") {
      e.x += (cx - e.x) * R.SUTURE_PULL;
      e.y += (cy - e.y) * R.SUTURE_PULL;
      keepInRoom(e, g);
    }
    medicHit(s, e, p.stats.damage * R.SUTURE_MUL);
  }
  // 바늘 자리에서 가운데로 바느질 자국
  for (const n of list) addEffect(s, { kind: "stitch", x: n.x, y: n.y, dirX: 0, dirY: 0, size: 0, maxTicks: 20, toX: cx, toY: cy });
  s.devices = (s.devices ?? []).filter((d) => d.kind !== "needle");
}
