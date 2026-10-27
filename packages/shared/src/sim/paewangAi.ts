// 패왕전 AI 머리: 보이는 가장 가까운 적을 노림 → 근접은 붙고, 원거리는 거리를 두고 옆걸음 → 공격 · 가끔 기술 · 날아오는 탄은 대시로 피함
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { PW, PW_MODE } from "../paewangDefs";
import { createRng, deriveSeed } from "../rng";
import type { TileGrid } from "./layout";
import { inBush, onDeck } from "./paewangGrid";
import type { PwBrain } from "./paewangTypes";
import { fireShot, hurt, resolveShots, units, type Unit } from "./paewangUnits";
import type { EnemyState, RunState } from "./types";
import { dist2, keepInRoom, normalize, roomGrid } from "./util";
import { rot } from "./orbit";

const SLOW_MUL = 0.6;

/** (x, y)를 a 라디안 돌림 (rot: 기기마다 같은 cos·sin) */
function turn(x: number, y: number, a: number): [number, number] {
  const [c, sn] = rot(a);
  return [x * c - y * sn, x * sn + y * c];
}

const rand = (s: RunState, id: number, what: string) => createRng(deriveSeed(s.seed, "pw", what, id, s.tick)).nextFloat();

/** 모든 AI가 한 틱: 움직이고 공격 → AI 탄이 내 편·다른 AI에 닿음 */
export function thinkAll(s: RunState): void {
  const g = roomGrid(s);
  const list = units(s);
  for (const u of list) if (u.brain && u.b.hp > 0) think(s, u, list, g);
  resolveShots(s, list);
}

/** 보이는지: 수풀에 숨으면 가까이서만 · 너무 멀면 안 보임 (2층 위에서는 더 멀리 봄) */
function sees(s: RunState, from: Unit, to: Unit): boolean {
  const arena = s.pw!.arena;
  const d2 = dist2(from.b, to.b);
  if (inBush(arena, to.b.x, to.b.y) && d2 > PW.hideNear * PW.hideNear) return false;
  const sight = PW.sight * (onDeck(arena, from.b.x, from.b.y) ? 1.4 : 1);
  return d2 <= sight * sight;
}

function target(s: RunState, u: Unit, list: Unit[]): Unit | null {
  let best: Unit | null = null;
  let bd = Infinity;
  for (const o of list) {
    if (o.team === u.team || o.b.hp <= 0 || !sees(s, u, o)) continue;
    const d = dist2(u.b, o.b);
    if (d < bd) {
      bd = d;
      best = o;
    }
  }
  return best;
}

function think(s: RunState, u: Unit, list: Unit[], g: TileGrid | null): void {
  const br = u.brain!;
  const e = u.kind === "foe" ? (u.b as EnemyState) : null;
  if (br.cd > 0) br.cd--;
  if (br.skill > 0) br.skill--;
  if (br.dashCd > 0) br.dashCd--;
  if (br.swing > 0) br.swing--;
  if (br.stuck > 0) br.stuck--;
  // 기절·위압 중이면 아무것도 못 함 · 느려짐이면 두 틱에 한 번
  if (e && ((e.stunTicks ?? 0) > 0 || (e.fearTicks ?? 0) > 0 || s.freezeTicks > 0)) return;
  if (e && (e.sluggish ?? 0) > 0 && s.tick % 2 === 0) return;
  const t = target(s, u, list);
  const x0 = u.b.x;
  const y0 = u.b.y;
  let mx = 0;
  let my = 0;
  if (br.dash > 0) {
    br.dash--;
    mx = br.dashX * PW.dashSpeed;
    my = br.dashY * PW.dashSpeed;
  } else if (t) {
    const to = normalize(t.b.x - u.b.x, t.b.y - u.b.y) ?? [br.faceX, 0];
    const d = Math.sqrt(dist2(u.b, t.b));
    br.faceX = to[0];
    br.faceY = to[1];
    const want = br.melee ? br.range * 0.6 : br.range * 0.75;
    const go = d > want + 6 ? 1 : !br.melee && d < want - 14 ? -1 : 0;
    // 원거리는 옆걸음 (가끔 방향을 바꿈)
    if (--br.sideT <= 0) {
      br.side = -br.side;
      br.sideT = 50 + Math.floor(rand(s, u.id, "side") * 80);
    }
    const strafe = br.melee ? 0 : 0.6;
    mx = (to[0] * go - to[1] * br.side * strafe) * br.speed;
    my = (to[1] * go + to[0] * br.side * strafe) * br.speed;
    dodge(s, u, br);
    attack(s, u, br, t, d, list);
  } else {
    wander(s, u, br);
    const to = normalize(br.goalX - u.b.x, br.goalY - u.b.y) ?? [0, 0];
    mx = to[0] * br.speed * 0.7;
    my = to[1] * br.speed * 0.7;
  }
  // 막혔으면 옆으로 비켜 감
  if (br.stuck > 0) {
    const m = Math.hypot(mx, my) || br.speed;
    [mx, my] = [-br.faceY * br.side * m, br.faceX * br.side * m];
  }
  if (e && (e.rootTicks ?? 0) > 0) mx = my = 0;
  const slow = e && (e.slowTicks ?? 0) > 0 ? SLOW_MUL : 1;
  u.b.x += mx * slow;
  u.b.y += my * slow;
  keepInRoom(u.b, g);
  if (e) e.dirX = br.faceX;
  // 거의 못 움직였으면 막힌 것
  const want2 = (mx * mx + my * my) * slow * slow;
  if (want2 > 0.1 && dist2(u.b, { x: x0, y: y0 }) < want2 * 0.1 && br.stuck === 0) {
    br.side = -br.side;
    br.stuck = 30;
  }
}

/** 목표가 없으면 맵 안 아무 곳으로 걸어감 (닿으면 새로) */
function wander(s: RunState, u: Unit, br: PwBrain): void {
  if (br.goalX === 0 || dist2(u.b, { x: br.goalX, y: br.goalY }) < 20 * 20 || s.tick % 300 === u.id % 300) {
    br.goalX = ROOM_MIN_X + 24 + rand(s, u.id, "gx") * (ROOM_MAX_X - ROOM_MIN_X - 48);
    br.goalY = ROOM_MIN_Y + 24 + rand(s, u.id, "gy") * (ROOM_MAX_Y - ROOM_MIN_Y - 48);
  }
}

/** 날아오는 적 탄이 가까우면 확률로 옆으로 대시 (네 틱에 한 번 살핌) */
function dodge(s: RunState, u: Unit, br: PwBrain): void {
  if (br.dashCd > 0 || (s.tick + u.id) % 4 !== 0) return;
  for (const pr of s.projectiles) {
    const hostile = pr.fromPlayer ? u.kind === "foe" : pr.pwTeam !== undefined && pr.pwTeam !== u.team;
    if (!hostile || dist2(pr, u.b) > 30 * 30) continue;
    // 나를 향해 오는 탄만
    if ((u.b.x - pr.x) * pr.vx + (u.b.y - pr.y) * pr.vy <= 0) continue;
    br.dashCd = PW.dashEvery;
    if (rand(s, u.id, "dodge") >= PW_MODE[s.pw!.mode].diff.dodge) return;
    const n = normalize(-pr.vy, pr.vx) ?? [1, 0];
    br.dash = PW.dashTicks;
    br.dashX = n[0] * br.side;
    br.dashY = n[1] * br.side;
    return;
  }
}

function attack(s: RunState, u: Unit, br: PwBrain, t: Unit, d: number, list: Unit[]): void {
  const reach = br.range + t.b.r;
  // 기술: 원거리는 부채꼴 5발 · 근접은 둘레를 크게 한 바퀴 베기
  if (br.skill <= 0 && d <= reach * 1.2) {
    br.skill = PW.skillEvery;
    br.cd = Math.max(br.cd, 20);
    if (br.melee) {
      br.swing = 16;
      for (const o of list) if (o.team !== u.team && o.b.hp > 0 && canMelee(s, u, o) && dist2(u.b, o.b) <= (reach * 1.5) ** 2) hurt(s, u.id, o, br.dmg * 1.6);
    } else for (let i = -2; i <= 2; i++) {
      const [dx, dy] = turn(br.faceX, br.faceY, i * 0.22);
      fireShot(s, u, dx, dy, br.dmg);
    }
    return;
  }
  if (br.cd > 0 || d > reach) return;
  br.cd = br.every;
  if (br.melee) {
    br.swing = 10;
    for (const o of list) {
      if (o.team === u.team || o.b.hp <= 0 || !canMelee(s, u, o)) continue;
      const dd = Math.sqrt(dist2(u.b, o.b));
      if (dd > br.range + o.b.r) continue;
      // 바라보는 쪽 부채꼴 안
      if (dd > 0 && ((o.b.x - u.b.x) * br.faceX + (o.b.y - u.b.y) * br.faceY) / dd < br.arc - 0.4) continue;
      if (o.kind === "me" && s.player.dashTicks > 0) continue;
      hurt(s, u.id, o, br.dmg);
    }
    return;
  }
  // 조준이 덜 정확할수록 빗나감
  const miss = (rand(s, u.id, "aim") - 0.5) * (1 - PW_MODE[s.pw!.mode].diff.aim) * 1.2;
  const [ax, ay] = turn(br.faceX, br.faceY, miss);
  for (let i = 0; i < br.shots; i++) {
    const [dx, dy] = turn(ax, ay, (i - (br.shots - 1) / 2) * 0.18);
    fireShot(s, u, dx, dy, br.dmg);
  }
}

/** 2층 발판 위와 아래는 근접 공격이 닿지 않음 (높이 차) */
function canMelee(s: RunState, u: Unit, o: Unit): boolean {
  const arena = s.pw!.arena;
  return onDeck(arena, u.b.x, u.b.y) === onDeck(arena, o.b.x, o.b.y);
}
