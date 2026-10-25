// 기계공학자 무기마다 공격 방식: 무기를 바꾸면 공격이 그 무기의 공격으로 바뀜 (전용 아이템 효과는 모든 공격에 적용).
// 레이저 발사기·집속 렌즈 캐논·과부하 리액터는 레이저, 나머지는 각자 다른 공격
import { ENEMIES } from "../content";
import { removeDead } from "./combat";
import { beamHit, beamWidth, emitBeam, lensArea, nearestOthers, prismArea, supportBeam, REACTOR_BOOST, REACTOR_FULL, tickDamage, trackTarget, traceBeam, wallDistance, zapArea } from "./laser";
import type { Device, PlayerState, RunState } from "./types";
import { addEffect, DIR16, hasPerk, normalize, weaponOf } from "./util";

/** 주 공격이 레이저가 아닌 무기 (빔 스플리터는 보조 레이저, 렌즈는 범위, 프리즘은 범위 피해) */
const NON_BEAM: ReadonlySet<string> = new Set(["cutter", "tesla", "magnet", "hammer", "mines", "orbital"]);
/** 던지는 장치(포탑·지뢰)가 날아가는 틱 */
export const FLY_TICKS = 18;
/** 레이저 포탑: 던지는 간격(1.8초), 최대 수, 버티는 틱(6초), 사거리, 한 기의 피해 */
const TURRET_PERIOD = 108;
const TURRET_MAX = 3;
export const TURRET_LIFE = 360;
const TURRET_RANGE = 75;
const TURRET_MUL = 0.45;
/** 반사 거울 드론: 드론 수, 도는 반지름, 한 기의 피해 */
const DRONE_COUNT = 3;
const DRONE_ORBIT = 11;
const DRONE_MUL = 0.4;
/** 테슬라 코일: 첫 대상 찾는 굵기 추가, 한 번에 맞는 최대 수, 번개가 건너가는 거리, 건너간 번개 피해 */
const TESLA_WIDTH = 3;
const TESLA_MAX = 5;
const TESLA_HOP = 50;
const TESLA_HOP_MUL = 0.45;
/** 자기장 발생기: 펄스 간격(2.25초), 펄스 피해 배율, 밀어내기, 렌즈면 범위 증가 */
const PULSE_PERIOD = 135;
const PULSE_MUL = 0.8;
const PULSE_PUSH = 16;
const FIELD_LENS = 1.15;
/** 유압 해머: 내려찍기 간격(공격 속도 2일 때 1.2초), 밀어내기, 기절 틱 (보스는 짧게) */
const HAMMER_PERIOD = 72;
const HAMMER_PUSH = 8;
const HAMMER_STUN = 60;
const HAMMER_BOSS_STUN = 20;
/** 지뢰 투척기: 던지는 간격(0.75초), 최대 수, 땅에 떨어진 뒤 준비 틱, 터지는 범위(넘쳐서 터질 때 더 넓게), 피해 배율 */
const MINE_PERIOD = 45;
const MINE_MAX = 6;
const MINE_ARM = 15;
export const MINE_RADIUS = 24;
const MINE_BIG_RADIUS = 34;
const MINE_MUL = 1.2;
/** 궤도 위성 포: 낙하 간격(1.5초, 공격 속도 증가는 절반만), 떨어지기까지 틱, 범위, 피해 배율 */
const ORBITAL_PERIOD = 90;
const ORBITAL_DELAY = 30;
export const ORBITAL_RADIUS = 24;
const ORBITAL_MUL = 1.15;

/** 드론 자리 (16방향 고정 값으로 돌림. 화면도 이 자리에 그림) */
export function droneSpots(p: { x: number; y: number }, tick: number): [number, number][] {
  const out: [number, number][] = [];
  for (let k = 0; k < DRONE_COUNT; k++) {
    const d = DIR16[(Math.floor(tick / 8) + k * 5) % 16]!;
    out.push([p.x + d[0] * DRONE_ORBIT, p.y + d[1] * DRONE_ORBIT]);
  }
  return out;
}

/** 포탑·해머·지뢰·위성 포·자기장 펄스: 한 번 쓰는 간격 (틱). 0이면 간격 없음 */
export function gearPeriod(p: PlayerState): number {
  const w = weaponOf(p);
  const base = w.attackSpeed;
  const speed = p.stats.attackSpeed;
  const scaled = { turret: TURRET_PERIOD, hammer: HAMMER_PERIOD, mines: MINE_PERIOD, magnet: PULSE_PERIOD } as Record<string, number>;
  if (w.gear && scaled[w.gear]) return (scaled[w.gear]! * base) / speed;
  if (w.gear === "orbital") return (ORBITAL_PERIOD * base) / (base + (speed - base) * 0.5);
  return 0;
}

/** 플레이어의 공격 한 번 (attack 대신). interval: 다음 공격까지 틱 */
export function fireLaser(s: RunState, speed: number, interval: number): void {
  const p = s.player;
  const w = weaponOf(p);
  if ((p.overheatTicks ?? 0) > 0) return;
  // 과부하 리액터: 쏘는 동안 열 게이지가 차고, 가득 차면 잠시 두 배
  if (w.gear === "reactor" && (p.boostTicks ?? 0) === 0) {
    p.heat = (p.heat ?? 0) + interval;
    if (p.heat >= REACTOR_FULL) {
      p.heat = 0;
      p.boostTicks = REACTOR_BOOST;
    }
  }
  const dmg = tickDamage(p, speed, interval);
  const period = gearPeriod(p);
  // 간격이 있는 무기는 준비됐을 때만 (준비는 laserGear에서 틱마다 참. 자기장은 누르고 있는 동안만 참)
  const ready = period > 0 && w.gear !== "magnet" && (p.gearTicks ?? period) >= period;
  if (ready) p.gearTicks = 0;
  if (w.gear === "cutter") plasmaCone(s, dmg, interval);
  else if (w.gear === "drone") droneBeams(s, dmg, interval);
  else if (w.gear === "tesla") teslaChain(s, dmg, interval);
  else if (w.gear === "magnet") magnetPulse(s, speed, interval, period);
  else if (w.gear === "turret") {
    if (ready) throwTurret(s);
  } else if (w.gear === "hammer") {
    if (ready) hammerSlam(s, tickDamage(p, speed, period), period);
  } else if (w.gear === "mines") {
    if (ready) throwMine(s, tickDamage(p, speed, period) * MINE_MUL);
  } else if (w.gear === "orbital") {
    if (ready) callStrike(s, tickDamage(p, w.attackSpeed, ORBITAL_PERIOD) * ORBITAL_MUL);
  } else {
    // 레이저 (집속 렌즈 캐논은 한 대상만)
    emitBeam(s, p.x, p.y, p.faceX, p.faceY, p.stats.range, dmg, interval, { hit: [], track: true, follow: true, single: w.gear === "focus" });
  }
  // 빔 스플리터: 주 공격이 레이저가 아닌 무기는 가까운 적에게 보조 레이저
  if (hasPerk(p, "beamSplitter") && w.gear && NON_BEAM.has(w.gear)) supportBeam(s, dmg, interval);
  removeDead(s);
}

/** 플라즈마 커터: 앞쪽 부채꼴 안 적 모두 (가까우면 방향 상관없이). 렌즈·오버클럭·리액터의 굵기 증가는 부채꼴을 넓힘 */
function plasmaCone(s: RunState, dmg: number, ticks: number): void {
  const p = s.player;
  const range = p.stats.range;
  const arc = (weaponOf(p).arcCos ?? 0.6) - (beamWidth(p) - 1.5) * 0.05;
  const hits = s.enemies
    .map((e) => ({ e, dx: e.x - p.x, dy: e.y - p.y }))
    .map((h) => ({ ...h, d: Math.sqrt(h.dx * h.dx + h.dy * h.dy) }))
    .filter(({ e, dx, dy, d }) => e.hp > 0 && d <= range + e.r && (d <= p.r + e.r || (dx * p.faceX + dy * p.faceY) / d >= arc));
  let near = hits[0];
  for (const h of hits) if (h.d < near!.d) near = h;
  const coil = near ? trackTarget(s, near.e, ticks) : 1;
  for (const { e } of hits) beamHit(s, e, dmg * prismArea(p) * (e === near?.e ? coil : 1), ticks);
  addEffect(s, { kind: "flame", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: range, maxTicks: ticks, width: arc, follow: true });
}

/** 포탑·지뢰 던지기: 플레이어 자리에서 (x, y)로 날아감 (laserGear가 옮김) */
function throwDevice(s: RunState, kind: "turret" | "mine", x: number, y: number, more: Partial<Device>): void {
  const p = s.player;
  (s.devices ??= []).push({ id: s.nextId++, kind, x: p.x, y: p.y, timer: 0, toX: x, toY: y, fly: FLY_TICKS, ...more });
}

/** 레이저 포탑: 조준한 곳 조금 앞에 소형 포탑을 던져 설치 (최대 3기, 6초 뒤 사라짐). 본체는 쏘지 않음 */
function throwTurret(s: RunState): void {
  const turrets = (s.devices ?? []).filter((d) => d.kind === "turret");
  if (turrets.length >= TURRET_MAX) s.devices = (s.devices ?? []).filter((d) => d !== turrets[0]);
  const [x, y] = aimPoint(s, 20);
  throwDevice(s, "turret", x, y, { life: TURRET_LIFE });
}

/** 포탑 한 기의 조사: 사거리 안 가까운 적에게 */
export function turretShot(s: RunState, t: Device, speed: number, interval: number, track: boolean): void {
  const p = s.player;
  const [target] = nearestOthers(s, t.x, t.y, TURRET_RANGE, [], 1);
  const dir = target ? normalize(target.x - t.x, target.y - t.y) : null;
  if (!target || !dir) return;
  emitBeam(s, t.x, t.y, dir[0], dir[1], TURRET_RANGE + target.r, tickDamage(p, speed, interval) * TURRET_MUL, interval, { hit: [], track });
}

/** 반사 거울 드론: 드론 3기가 각자 다른 적에게 빔 (적이 적으면 같은 적에게 겹쳐 쏨) */
function droneBeams(s: RunState, dmg: number, ticks: number): void {
  const p = s.player;
  const targets = nearestOthers(s, p.x, p.y, p.stats.range, [], DRONE_COUNT);
  if (targets.length === 0) return;
  droneSpots(p, s.tick).forEach(([x, y], k) => {
    const e = targets[k % targets.length]!;
    const dir = normalize(e.x - x, e.y - y);
    if (dir) emitBeam(s, x, y, dir[0], dir[1], p.stats.range + 20, dmg * DRONE_MUL, ticks, { hit: targets.filter((h) => h !== e), track: k === 0 });
  });
}

/** 테슬라 코일: 조준한 첫 적에게 번개, 가까운 적으로 건너감 (최대 5명, 프리즘이면 1명 더) */
function teslaChain(s: RunState, dmg: number, ticks: number): void {
  const p = s.player;
  const tr = traceBeam(s, p.x, p.y, p.faceX, p.faceY, p.stats.range, beamWidth(p) + TESLA_WIDTH, false, false);
  const first = tr.hits[0];
  const bolt = (x: number, y: number, toX: number, toY: number, follow: boolean) =>
    addEffect(s, { kind: "bolt", x, y, dirX: 0, dirY: 0, size: 0, maxTicks: ticks, toX, toY, ...(follow ? { follow } : {}) });
  if (!first) return;
  bolt(p.x, p.y, first.x, first.y, true);
  beamHit(s, first, dmg * trackTarget(s, first, ticks), ticks);
  const hit = [first];
  const max = TESLA_MAX + (hasPerk(p, "refractPrism") ? 1 : 0);
  let from = first;
  while (hit.length < max) {
    const [next] = nearestOthers(s, from.x, from.y, TESLA_HOP * lensArea(p), hit, 1);
    if (!next) break;
    bolt(from.x, from.y, next.x, next.y, false);
    beamHit(s, next, dmg * TESLA_HOP_MUL, ticks);
    hit.push(next);
    from = next;
  }
}

/** 자기장 범위 (렌즈면 더 넓게) */
export function fieldRadius(p: PlayerState): number {
  return p.stats.range * (hasPerk(p, "highLens") ? FIELD_LENS : 1);
}

/** 자기장 발생기: 누르고 있는 동안 주변 적을 끌어당기고(laserGear) 둔화, 1.5초 모이면 펄스로 한꺼번에 피해·밀어내기 */
function magnetPulse(s: RunState, speed: number, interval: number, period: number): void {
  const p = s.player;
  const radius = fieldRadius(p);
  for (const e of s.enemies) {
    const rr = radius + e.r;
    if (e.hp > 0 && (e.x - p.x) * (e.x - p.x) + (e.y - p.y) * (e.y - p.y) <= rr * rr) e.slowTicks = interval + 2;
  }
  p.gearTicks = (p.gearTicks ?? 0) + interval;
  addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: radius, maxTicks: interval, follow: true });
  if (p.gearTicks < period) return;
  p.gearTicks = 0;
  zapArea(s, p.x, p.y, radius, tickDamage(p, speed, period) * PULSE_MUL, period, PULSE_PUSH);
  addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: radius, maxTicks: 16, width: 2 });
}

/** 유압 해머: 주변을 내려찍어 밀어내고 기절 (기절한 적은 받는 피해 +40%) */
function hammerSlam(s: RunState, dmg: number, ticks: number): void {
  const p = s.player;
  const radius = p.stats.range * lensArea(p);
  for (const e of zapArea(s, p.x, p.y, radius, dmg, ticks, HAMMER_PUSH)) {
    if (e.kind !== "dummy") e.stunTicks = ENEMIES[e.kind].boss ? HAMMER_BOSS_STUN : HAMMER_STUN;
  }
  addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: radius, maxTicks: 14, width: 1 });
}

/**
 * 던지거나 떨어뜨릴 자리: 사거리 안을 마우스로 눌렀으면 누른 곳 (벽 앞까지).
 * 아니면 (자동 조준·조이스틱·사거리 밖) 조준한 방향의 첫 적 자리(back만큼 앞), 없으면 사거리(벽 앞) 끝
 */
export function aimPoint(s: RunState, back = 0): [number, number] {
  const p = s.player;
  // 벽이 있으면 벽 조금 앞까지
  const hit = wallDistance(s, p.x, p.y, p.faceX, p.faceY, p.stats.range);
  const wall = hit < p.stats.range ? Math.max(0, hit - 6) : hit;
  if (p.aimDist !== undefined && p.aimDist <= p.stats.range) {
    const d = Math.min(p.aimDist, wall);
    return [p.x + p.faceX * d, p.y + p.faceY * d];
  }
  const tr = traceBeam(s, p.x, p.y, p.faceX, p.faceY, p.stats.range, 6, false, false);
  const e = tr.hits[0];
  if (e && back === 0) return [e.x, e.y];
  const d = e ? Math.max(8, Math.min(wall, (e.x - p.x) * p.faceX + (e.y - p.y) * p.faceY - back)) : wall;
  return [p.x + p.faceX * d, p.y + p.faceY * d];
}

/** 지뢰 투척기: 조준한 곳으로 지뢰를 던짐 (떨어진 뒤 잠깐 있다 준비). 6개가 넘으면 가장 오래된 지뢰가 더 넓게 터짐 */
function throwMine(s: RunState, dmg: number): void {
  const mines = (s.devices ?? []).filter((d) => d.kind === "mine");
  if (mines.length >= MINE_MAX) mineBlast(s, mines[0]!, true);
  const [x, y] = aimPoint(s);
  throwDevice(s, "mine", x, y, { timer: MINE_ARM, dmg });
}

/** 지뢰 터뜨리기 */
export function mineBlast(s: RunState, m: Device, big: boolean): void {
  s.devices = (s.devices ?? []).filter((d) => d !== m);
  const radius = (big ? MINE_BIG_RADIUS : MINE_RADIUS) * lensArea(s.player);
  zapArea(s, m.x, m.y, radius, m.dmg ?? 0, MINE_PERIOD);
  addEffect(s, { kind: "ring", x: m.x, y: m.y, dirX: 0, dirY: 0, size: radius, maxTicks: 12, width: 1 });
  addEffect(s, { kind: "burst", x: m.x, y: m.y, dirX: 0, dirY: 0, size: 6, maxTicks: 10 });
}

/** 궤도 위성 포: 조준한 자리에 표시 → 잠시 뒤 큰 레이저 낙하 (laserGear에서 터짐) */
function callStrike(s: RunState, dmg: number): void {
  const [x, y] = aimPoint(s);
  (s.devices ??= []).push({ id: s.nextId++, kind: "strike", x, y, timer: ORBITAL_DELAY, dmg });
  addEffect(s, { kind: "mark", x, y, dirX: 0, dirY: 0, size: ORBITAL_RADIUS * lensArea(s.player), maxTicks: ORBITAL_DELAY });
}
