// 레이저 (기계공학자) 핵심: 조사 간격·피해 · 빔 따라가기(벽·첫 적에서 멈춤) · 맞히기 · 전용 아이템 효과.
// 무기마다 공격 방식은 laserWeapons, 틱마다 장치(포탑·지뢰 등) 처리는 laserGear
import { TICK_RATE } from "../constants";
import { ENEMIES } from "../content";
import { blastAt, COMBAT_RULES } from "./combat";
import { blocksShot } from "./layout";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, markDot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid, weaponOf } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 고출력 렌즈: 굵기 증가, 틱 피해, 첫 대상 뒤 이 거리 안의 적도 같이 맞음 */
  LENS_WIDTH: 2.5,
  LENS_MUL: 1.1,
  LENS_DEPTH: 12,
  /** 오버클럭: 체력 절반 이하일 때 */
  OVERCLOCK_WIDTH: 1.5,
  OVERCLOCK_MUL: 1.2,
  /** 과부하 리액터 두 배 동안 굵기 */
  BOOST_WIDTH: 4,
  /** 빔 스플리터: 갈라진 빔 수, 모든 빔 피해 배율. 한 번에 맞는 대상은 모두 합쳐 최대 MAX_TARGETS */
  SPLIT_BEAMS: 1,
  SPLIT_MUL: 0.9,
  /** 레이저가 아닌 무기: 고출력 렌즈면 공격 범위 배율, 굴절 프리즘이면 범위 공격 피해 배율 */
  LENS_AREA: 1.15,
  PRISM_AREA_MUL: 1.15,
  /** 굴절 프리즘: 뒤쪽 적 피해 */
  PRISM_MUL: 0.5,
  /** 열 축적: 이만큼(틱) 맞으면 열폭발 (2초), 범위, 공격력 배율 */
  HEAT_FULL: 120,
  HEAT_RADIUS: 30,
  HEAT_MUL: 1.2,
  /** 집속 코일: 이 틱마다 +10%, 최대 +50% */
  COIL_STEP: 30,
  COIL_ADD: 0.1,
  COIL_MAX: 0.5,
  /** 과부하 방출: 같은 적을 이만큼 공격할 때마다 폭발 (2초) */
  OVERLOAD_TICKS: 120,
  OVERLOAD_RADIUS: 26,
  OVERLOAD_MUL: 2,
  MELT_MAX: 10,
  /** 유압 해머로 기절한 적이 받는 피해 */
  STUN_MUL: 1.4,
  /** 플라즈마 커터: 열이 두 배로 쌓임 */
  CUTTER_HEAT: 2,
  /** 빔 스플리터 보조 레이저 (주 공격이 레이저가 아닌 무기): 틱 피해 비율, 사거리가 짧은 무기의 최소 거리 */
  SUPPORT_MUL: 0.4,
  SUPPORT_REACH: 80,
};
export { R as LASER_RULES };

/** 공격 속도 1당 초당 조사 횟수 (공격 속도 2 = 0.15초마다) */
export const BEAM_RATE = 10 / 3;
/** 가장 짧은 조사 간격 (2틱 ≈ 0.03초). 더 빨라지면 간격 대신 한 번의 피해가 커짐 */
export const MIN_BEAM_TICKS = 2;
/** 빔 굵기 (절반, 픽셀) */
export const BASE_WIDTH = 1.5;
export const MAX_TARGETS = 6;
/** 과부하 리액터: 열 게이지 가득(4초 조사) → 두 배 5초 → 과열 2초 */
export const REACTOR_FULL = 240;
export const REACTOR_BOOST = 300;
export const REACTOR_OVERHEAT = 120;

/** 고출력 렌즈: 레이저가 아닌 공격(해머·지뢰·위성 포·테슬라 번개)의 범위 배율 */
export function lensArea(p: PlayerState): number {
  return hasPerk(p, "highLens") ? R.LENS_AREA : 1;
}

/** 굴절 프리즘: 범위 공격(커터·자기장·해머·지뢰·위성 포) 피해 배율 */
export function prismArea(p: PlayerState): number {
  return hasPerk(p, "refractPrism") ? R.PRISM_AREA_MUL : 1;
}

/** 조사 간격 (틱) */
export function beamInterval(speed: number): number {
  return Math.max(MIN_BEAM_TICKS, Math.round(TICK_RATE / (speed * BEAM_RATE)));
}

function overclocked(p: PlayerState): boolean {
  return hasPerk(p, "overclock") && p.hp <= p.stats.maxHp * 0.5;
}

/** 빔 굵기 (절반) */
export function beamWidth(p: PlayerState): number {
  let w = BASE_WIDTH;
  if (hasPerk(p, "highLens")) w += R.LENS_WIDTH;
  if (overclocked(p)) w += R.OVERCLOCK_WIDTH;
  if ((p.boostTicks ?? 0) > 0) w += R.BOOST_WIDTH;
  return w;
}

/** ticks 동안의 공격을 한 번에 주는 피해. 초당 피해 = 공격력 × 공격 속도 (다른 무기와 같은 기준) */
export function tickDamage(p: PlayerState, speed: number, ticks: number): number {
  let d = (p.stats.damage * speed * ticks) / TICK_RATE;
  if (hasPerk(p, "highLens")) d *= R.LENS_MUL;
  if (overclocked(p)) d *= R.OVERCLOCK_MUL;
  if ((p.boostTicks ?? 0) > 0) d *= 2;
  return d;
}

/** 벽(방 테두리·방 안 벽·기둥)까지 거리. 없으면 range */
export function wallDistance(s: RunState, x: number, y: number, dx: number, dy: number, range: number): number {
  const g = roomGrid(s);
  for (let t = 0; t < range; t += 3) {
    const px = x + dx * t;
    const py = y + dy * t;
    if (px < ROOM_MIN_X || px > ROOM_MAX_X || py < ROOM_MIN_Y || py > ROOM_MAX_Y || (g !== null && blocksShot(g, px, py))) return t;
  }
  return range;
}

interface Trace {
  endX: number;
  endY: number;
  /** 맞은 적 (가까운 순서) */
  hits: EnemyState[];
  /** 굴절 프리즘으로 더 맞는 뒤쪽 적 */
  extra: EnemyState | null;
}

/** 빔 따라가기: 벽이나 첫 적에서 멈춤. 렌즈면 첫 적 바로 뒤까지 같이, 프리즘이면 그 뒤 한 명 더 */
export function traceBeam(s: RunState, x: number, y: number, dx: number, dy: number, range: number, width: number, lens: boolean, prism: boolean): Trace {
  const wallT = wallDistance(s, x, y, dx, dy, range);
  const cands: { e: EnemyState; i: number; t: number }[] = [];
  s.enemies.forEach((e, i) => {
    if (e.hp <= 0) return;
    const ex = e.x - x;
    const ey = e.y - y;
    const t = ex * dx + ey * dy;
    if (t < 0 || t - e.r > wallT) return;
    if (Math.abs(ex * dy - ey * dx) > e.r + width) return;
    cands.push({ e, i, t });
  });
  // 같은 거리면 먼저 나온 적 (순서가 항상 같게)
  cands.sort((a, b) => a.t - b.t || a.i - b.i);
  const first = cands[0];
  if (!first) return { endX: x + dx * wallT, endY: y + dy * wallT, hits: [], extra: null };
  const stop = lens ? first.t + R.LENS_DEPTH : first.t;
  const hits = cands.filter((c) => c.t <= stop);
  const behind = prism ? cands[hits.length] : undefined;
  const endT = Math.min(wallT, (behind ?? hits[hits.length - 1]!).t);
  return { endX: x + dx * endT, endY: y + dy * endT, hits: hits.map((c) => c.e), extra: behind?.e ?? null };
}

/** 기계공학자 공격 한 번의 피해 + 장갑 용해·열 축적. ticks: 이 공격이 맡은 틱 수 (열이 쌓이는 양) */
export function beamHit(s: RunState, e: EnemyState, dmg: number, ticks: number): void {
  const p = s.player;
  if (e.immune) return;
  if ((e.stunTicks ?? 0) > 0) dmg *= R.STUN_MUL;
  // 장갑 용해로 더 들어간 몫은 부식 피해 (부식 색 숫자)
  const melt = dmg * COMBAT_RULES.MELT_ADD * (e.melt ?? 0);
  e.hp -= dmg + melt;
  markDot(s, e, "rot", melt);
  e.hitFlash = Math.max(e.hitFlash, 2);
  if (hasPerk(p, "armorMelt")) e.melt = Math.min(R.MELT_MAX, (e.melt ?? 0) + 1);
  if (hasPerk(p, "heatBuildup")) {
    e.heat = (e.heat ?? 0) + ticks * (weaponOf(p).gear === "cutter" ? R.CUTTER_HEAT : 1);
    if (e.heat >= R.HEAT_FULL) {
      e.heat = 0;
      blastAt(s, e.x, e.y, R.HEAT_RADIUS, p.stats.damage * R.HEAT_MUL);
    }
  }
}

export function beamFx(s: RunState, x: number, y: number, toX: number, toY: number, width: number, ticks: number, follow = false): void {
  addEffect(s, { kind: "beam", x, y, dirX: 0, dirY: 0, size: 0, maxTicks: ticks, toX, toY, width, ...(follow ? { follow } : {}) });
}

/** 계속 공격 중인 적 기록: 집속 코일 배율을 돌려줌, 과부하 방출 */
export function trackTarget(s: RunState, e: EnemyState, ticks: number): number {
  const p = s.player;
  const same = p.beamTargetId === e.id && s.tick - (p.beamLast ?? -1000) <= ticks + 6;
  p.beamTicks = same ? (p.beamTicks ?? 0) + ticks : ticks;
  if (!same) {
    p.beamTargetId = e.id;
    p.overloadCount = 0;
  }
  p.beamLast = s.tick;
  if (hasPerk(p, "overloadBurst") && Math.floor(p.beamTicks / R.OVERLOAD_TICKS) > (p.overloadCount ?? 0)) {
    p.overloadCount = (p.overloadCount ?? 0) + 1;
    blastAt(s, e.x, e.y, R.OVERLOAD_RADIUS, p.stats.damage * R.OVERLOAD_MUL);
  }
  return hasPerk(p, "focusCoil") ? 1 + Math.min(R.COIL_MAX, R.COIL_ADD * Math.floor(p.beamTicks / R.COIL_STEP)) : 1;
}

/** (x, y)에서 가까운 적 n명 (exclude 제외, reach 안, 벽에 막히지 않은) */
export function nearestOthers(s: RunState, x: number, y: number, reach: number, exclude: readonly EnemyState[], n: number): EnemyState[] {
  if (n <= 0) return [];
  return s.enemies
    .map((e, i) => ({ e, i, d: Math.sqrt((e.x - x) * (e.x - x) + (e.y - y) * (e.y - y)) }))
    .filter(({ e, d }) => {
      if (e.hp <= 0 || exclude.includes(e) || d > reach + e.r) return false;
      const dir = normalize(e.x - x, e.y - y);
      return !dir || wallDistance(s, x, y, dir[0], dir[1], d) >= d - e.r;
    })
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .slice(0, n)
    .map((c) => c.e);
}

export interface BeamOpt {
  /** 이번 공격에서 이미 맞은 적 (대상 최대 수 계산용, 맞힌 적을 더해 넣음) */
  hit: EnemyState[];
  /** 첫 대상을 집속 코일·과부하 방출로 기록 */
  track?: boolean;
  /** 그림이 플레이어를 따라감 */
  follow?: boolean;
  /** 한 대상만 (렌즈의 같이 맞히기·프리즘·스플리터 없음) */
  single?: boolean;
}

/** 빔 한 줄기 (+ 렌즈·프리즘·스플리터). 첫 대상을 돌려줌 */
export function emitBeam(s: RunState, x: number, y: number, dx: number, dy: number, range: number, dmg: number, ticks: number, opt: BeamOpt): EnemyState | null {
  const p = s.player;
  const split = hasPerk(p, "beamSplitter") && !opt.single;
  const mul = split ? R.SPLIT_MUL : 1;
  const width = beamWidth(p);
  const tr = traceBeam(s, x, y, dx, dy, range, width, hasPerk(p, "highLens") && !opt.single, hasPerk(p, "refractPrism") && !opt.single);
  beamFx(s, x, y, tr.endX, tr.endY, width, ticks, opt.follow);
  const first = tr.hits[0] ?? null;
  const coil = first && opt.track ? trackTarget(s, first, ticks) : 1;
  for (const e of tr.hits) {
    if (opt.hit.length >= MAX_TARGETS) break;
    beamHit(s, e, dmg * mul * (e === first ? coil : 1), ticks);
    opt.hit.push(e);
  }
  if (tr.extra && opt.hit.length < MAX_TARGETS) {
    beamHit(s, tr.extra, dmg * mul * R.PRISM_MUL, ticks);
    opt.hit.push(tr.extra);
  }
  // 빔 스플리터: 가까운 다른 적에게도 빔
  if (split) {
    for (const e of nearestOthers(s, x, y, range, opt.hit, Math.min(R.SPLIT_BEAMS, MAX_TARGETS - opt.hit.length))) {
      beamFx(s, x, y, e.x, e.y, width, ticks, opt.follow);
      beamHit(s, e, dmg * mul, ticks);
      opt.hit.push(e);
    }
  }
  return first;
}

/** 범위 안 적 모두에게 공격 (밀어내기 선택). 가장 가까운 적은 집속 코일·과부하 방출로 기록. 맞은 적을 돌려줌 */
export function zapArea(s: RunState, x: number, y: number, radius: number, dmg: number, ticks: number, push = 0): EnemyState[] {
  dmg *= prismArea(s.player);
  const hits: { e: EnemyState; d: number }[] = [];
  for (const e of s.enemies) {
    if (e.hp <= 0) continue;
    const d = Math.sqrt((e.x - x) * (e.x - x) + (e.y - y) * (e.y - y));
    if (d <= radius + e.r) hits.push({ e, d });
  }
  let near: { e: EnemyState; d: number } | null = null;
  for (const h of hits) if (!near || h.d < near.d) near = h;
  const coil = near ? trackTarget(s, near.e, ticks) : 1;
  const g = roomGrid(s);
  for (const { e, d } of hits) {
    beamHit(s, e, dmg * (e === near?.e ? coil : 1), ticks);
    if (push > 0 && d > 0 && !ENEMIES[e.kind].boss && e.kind !== "dummy") {
      e.x += ((e.x - x) / d) * push;
      e.y += ((e.y - y) / d) * push;
      keepInRoom(e, g);
    }
  }
  return hits.map((h) => h.e);
}

/** 빔 스플리터 보조 레이저: 사거리(짧으면 R.SUPPORT_REACH) 안 가장 가까운 적에게 */
export function supportBeam(s: RunState, dmg: number, ticks: number): void {
  const p = s.player;
  dmg *= R.SUPPORT_MUL;
  const reach = Math.max(p.stats.range, R.SUPPORT_REACH);
  const [e] = nearestOthers(s, p.x, p.y, reach, [], 1);
  const dir = e ? normalize(e.x - p.x, e.y - p.y) : null;
  if (e && dir) emitBeam(s, p.x, p.y, dir[0], dir[1], reach + e.r, dmg, ticks, { hit: [], follow: true, single: true });
}
