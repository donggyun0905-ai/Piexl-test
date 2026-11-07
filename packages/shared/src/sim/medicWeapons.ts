// 의사 무기마다 공격 방식: 무기를 바꾸면 공격이 그 무기의 공격으로 바뀜 (틱 피해는 기계공학자 레이저와 같은 방식).
// 직접 피해의 일부만큼 회복 (sim/heal). 날아가는 탄·장판·바늘·알약·구급차의 틱마다 처리는 medicGear
import { ENEMIES } from "../content";
import { removeDead } from "./combat";
import { devilMul } from "./devilPerks";
import { leechHeal, leechRate } from "./heal";
import { tickDamage, traceBeam } from "./laser";
import { aimPoint, FLY_TICKS } from "./laserWeapons";
import type { Device, EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, normalize, roomGrid, weaponOf } from "./util";
import { factionHit } from "./faction";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  CHECKUP_MUL: 3,
  /** 건강 체질: 보호막이 있는 동안 피해 배율 · 수술 집도: 범위·사거리 배율 */
  ROBUST_MUL: 1.2,
  SURGERY_AREA: 1.25,
  SURGERY_REACH: 1.2,
  /** 메스·수혈 튜브 회복률 배율 */
  SCALPEL_LEECH: 3,
  TUBE_LEECH: 4,
  /** 제세동기 기절 틱 (보스는 짧게) · 붕대 채찍 속박 틱 */
  DEFIB_STUN: 60,
  DEFIB_BOSS_STUN: 20,
  WHIP_ROOT: 90,
  WHIP_BOSS_ROOT: 24,
  /** 링거 폴대 밀어내기 */
  POLE_PUSH: 14,
  /** 알약 산탄: 알약 수, 한 알 피해 비율, 알약 사이 각도 10도의 [cos, sin] */
  PILL_COUNT: 7,
  PILL_MUL: 0.25,
  /** 구급 키트 폭발 피해 배율 */
  MEDKIT_MUL: 1.2,
  /** 구급차: 출발 거리(화면 밖), 속력, 한 번 달리는 틱, 왕복에 드는 보호막 */
  AMB_START: 300,
  AMB_SPEED: 6,
  AMB_SHIELD: 6,
};
export { R as MEDIC_WEAPONS_RULES };

/** 무기마다 한 번 쓰는 간격 (공격 속도 2일 때, 틱). 없으면 매 틱 공격 */
const PERIODS: Partial<Record<string, number>> = { defib: 66, suture: 36, gas: 108, ivpole: 48, pills: 36, medkit: 96, whip: 72, ambulance: 120 };
/** 건강 검진: 체력이 가득 찬 채로 이만큼(5초) 있으면 다음 공격 피해 배율 */
export const CHECKUP_TICKS = 180;
/** 봉합 바늘: 꽂힌 뒤 봉합까지 틱 (3초) */
export const SUTURE_TICKS = 180;
/** 마취 가스 장판이 남는 틱 (3초) */
export const GAS_LIFE = 240;
const PILL_SPREAD: readonly [number, number] = [0.9848, 0.1736];
export const AMB_TICKS = 100;

export const areaMul = (p: PlayerState) => (hasPerk(p, "surgery") ? R.SURGERY_AREA : 1);
export const reachMul = (p: PlayerState) => (hasPerk(p, "surgery") ? R.SURGERY_REACH : 1);

/** 간격이 있는 무기의 간격 (틱, 공격 속도에 따라 짧아짐). 0이면 매 틱 */
export function medicPeriod(p: PlayerState): number {
  const w = weaponOf(p);
  const base = PERIODS[w.medic ?? ""];
  return base ? (base * w.attackSpeed) / p.stats.attackSpeed : 0;
}

/** 의사 공격 한 번의 피해 + 공격 회복. flash: 맞은 적이 반짝임 (장판처럼 매 틱 맞으면 가끔만) */
export function medicHit(s: RunState, e: EnemyState, dmg: number, leechMul = 1, flash = true): void {
  const p = s.player;
  if (e.immune) return;
  if ((p.shieldPts ?? 0) > 0 && hasPerk(p, "robust")) dmg *= R.ROBUST_MUL;
  e.hp -= dmg * devilMul(s, e); // 그림 리퍼 등 (combat.damageEnemy와 같게)
  if (flash) e.hitFlash = Math.max(e.hitFlash, 2);
  factionHit(s, e); // 테라코어 에너지
  leechHeal(s, dmg * leechRate(p, leechMul));
}

/** 의사의 공격 한 번 (attack 대신) */
export function fireMedic(s: RunState, speed: number, interval: number): void {
  const p = s.player;
  const period = medicPeriod(p);
  if (period > 0) {
    // 간격이 있는 무기는 준비됐을 때만 (준비는 medicGear에서 틱마다 참, 처음엔 바로)
    if ((p.gearTicks ?? period) < period) return;
    p.gearTicks = 0;
  }
  const ticks = period || interval;
  let dmg = tickDamage(p, speed, ticks);
  if (hasPerk(p, "checkup") && (p.fullTicks ?? 0) >= CHECKUP_TICKS) {
    dmg *= R.CHECKUP_MUL;
    p.fullTicks = 0;
  }
  const gear = weaponOf(p).medic;
  if (gear === "scalpel") cone(s, dmg, R.SCALPEL_LEECH);
  else if (gear === "transfusion") tube(s, dmg);
  else if (gear === "defib") {
    for (const e of cone(s, dmg, 1)) if (e.kind !== "dummy") e.stunTicks = Math.max(e.stunTicks ?? 0, ENEMIES[e.kind].boss ? R.DEFIB_BOSS_STUN : R.DEFIB_STUN);
  } else if (gear === "suture") fireShot(s, "needle", p.faceX, p.faceY, dmg);
  else if (gear === "gas") throwIt(s, "gas", { life: GAS_LIFE });
  else if (gear === "ivpole") pole(s, dmg);
  else if (gear === "pills") pills(s, dmg);
  else if (gear === "medkit") throwIt(s, "medkit", { dmg: dmg * R.MEDKIT_MUL });
  else if (gear === "whip") whip(s, dmg);
  else if (gear === "ambulance") callAmbulance(s, dmg);
  else fireShot(s, "syringe", p.faceX, p.faceY, dmg);
  removeDead(s);
}

/** 탄 속력 (픽셀/틱): 주사기·봉합 바늘·알약 */
const SHOT_SPEED = { syringe: 6, needle: 4.5, pill: 3.5 } as const;

/** 탄 한 발: 날아가다 첫 적에 맞음 (사거리만큼 날아감, 맞히기는 medicGear) */
function fireShot(s: RunState, shot: keyof typeof SHOT_SPEED, dx: number, dy: number, dmg: number): void {
  const p = s.player;
  const speed = SHOT_SPEED[shot];
  (s.devices ??= []).push({
    id: s.nextId++,
    kind: "shot",
    shot,
    x: p.x + dx * (p.r + 2),
    y: p.y + dy * (p.r + 2),
    timer: 0,
    life: Math.ceil((p.stats.range * reachMul(p)) / speed),
    vx: dx * speed,
    vy: dy * speed,
    dmg,
  });
}

/** 앞쪽 부채꼴 안 적 모두 (메스·제세동기). 맞은 적을 돌려줌 */
function cone(s: RunState, dmg: number, leech: number): EnemyState[] {
  const p = s.player;
  const w = weaponOf(p);
  const radius = p.stats.range * areaMul(p);
  const arc = w.arcCos ?? 0.5;
  const hits = s.enemies.filter((e) => {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    return e.hp > 0 && d <= radius + e.r && (d <= p.r + e.r || (dx * p.faceX + dy * p.faceY) / d >= arc);
  });
  const defib = w.medic === "defib";
  for (const e of hits) {
    medicHit(s, e, dmg, leech);
    // 메스: 베인 자국 · 제세동기: 전기 불꽃
    addEffect(s, { kind: defib ? "zap" : "cut", x: e.x, y: e.y, dirX: p.faceX, dirY: p.faceY, size: e.r, maxTicks: defib ? 12 : 8 });
  }
  // 메스: 은빛 초승달 · 제세동기: 앞으로 뻗는 심전도
  addEffect(s, { kind: defib ? "ecg" : "slash", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: radius, maxTicks: defib ? 14 : 6, width: arc, follow: true });
  return hits;
}

/** 수혈 튜브: 꽂은 적에게 계속 (멀어지거나 쓰러지면 조준 방향 첫 적에게 새로) */
function tube(s: RunState, dmg: number): void {
  const p = s.player;
  const range = p.stats.range * reachMul(p);
  let e = s.enemies.find((x) => x.id === p.tubeTargetId && x.hp > 0) ?? null;
  if (e) {
    const d = Math.sqrt((e.x - p.x) * (e.x - p.x) + (e.y - p.y) * (e.y - p.y));
    if (d > range + e.r) e = null;
  }
  e ??= traceBeam(s, p.x, p.y, p.faceX, p.faceY, range, 3, false, false).hits[0] ?? null;
  p.tubeTargetId = e?.id;
  if (!e) return;
  medicHit(s, e, dmg, R.TUBE_LEECH);
  addEffect(s, { kind: "tube", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 0, maxTicks: 10, toX: e.x, toY: e.y, follow: true });
}

/** 마취 가스통·구급 키트: 조준한 곳으로 던짐 (날아가기는 laserGear, 떨어진 뒤는 medicGear) */
function throwIt(s: RunState, kind: "gas" | "medkit", more: Partial<Device>): void {
  const p = s.player;
  const [x, y] = aimPoint(s);
  (s.devices ??= []).push({ id: s.nextId++, kind, x: p.x, y: p.y, timer: 0, toX: x, toY: y, fly: FLY_TICKS, ...more });
}

/** 링거 폴대: 한 바퀴 휘둘러 밀어냄 */
function pole(s: RunState, dmg: number): void {
  const p = s.player;
  const radius = p.stats.range * areaMul(p);
  const g = roomGrid(s);
  for (const e of s.enemies) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (e.hp <= 0 || d > radius + e.r) continue;
    medicHit(s, e, dmg);
    if (d > 0 && !ENEMIES[e.kind].boss && e.kind !== "dummy") {
      e.x += (dx / d) * R.POLE_PUSH;
      e.y += (dy / d) * R.POLE_PUSH;
      keepInRoom(e, g);
    }
  }
  addEffect(s, { kind: "pole", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: radius, maxTicks: 12, follow: true });
}

/** 알약 산탄: 부채꼴로 다섯 알 (가까우면 많이 맞음) */
function pills(s: RunState, dmg: number): void {
  const p = s.player;
  const [c, sn] = PILL_SPREAD;
  let lx = p.faceX, ly = p.faceY, rx = p.faceX, ry = p.faceY;
  const dirs: [number, number][] = [[lx, ly]];
  for (let i = 0; i < (R.PILL_COUNT - 1) / 2; i++) {
    [lx, ly] = [lx * c - ly * sn, lx * sn + ly * c];
    [rx, ry] = [rx * c + ry * sn, -rx * sn + ry * c];
    dirs.push([lx, ly], [rx, ry]);
  }
  for (const [dx, dy] of dirs) fireShot(s, "pill", dx, dy, dmg * R.PILL_MUL);
}

/** 붕대 채찍: 앞으로 곧게 휘둘러 닿은 적 모두 속박 */
function whip(s: RunState, dmg: number): void {
  const p = s.player;
  const len = p.stats.range * areaMul(p);
  for (const e of s.enemies) {
    const ex = e.x - p.x;
    const ey = e.y - p.y;
    const t = ex * p.faceX + ey * p.faceY;
    if (e.hp <= 0 || t < -e.r || t > len + e.r || Math.abs(ex * p.faceY - ey * p.faceX) > e.r + 4) continue;
    medicHit(s, e, dmg);
    if (e.kind !== "dummy") e.rootTicks = ENEMIES[e.kind].boss ? R.WHIP_BOSS_ROOT : R.WHIP_ROOT;
  }
  addEffect(s, { kind: "lash", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: len, maxTicks: 22, follow: true });
}

/** 구급차 호출: 조준 방향 화면 밖에서 플레이어 쪽으로 곧게 달려옴. 보호막 10이 있으면 써서 왕복 */
function callAmbulance(s: RunState, dmg: number): void {
  const p = s.player;
  const back = (p.shieldPts ?? 0) >= R.AMB_SHIELD;
  if (back) p.shieldPts = (p.shieldPts ?? 0) - R.AMB_SHIELD;
  const dir = normalize(p.faceX, p.faceY) ?? [1, 0];
  (s.devices ??= []).push({
    id: s.nextId++,
    kind: "ambulance",
    x: p.x + dir[0] * R.AMB_START,
    y: p.y + dir[1] * R.AMB_START,
    timer: AMB_TICKS,
    dmg,
    vx: -dir[0] * R.AMB_SPEED,
    vy: -dir[1] * R.AMB_SPEED,
    hitIds: [],
    back,
  });
}
