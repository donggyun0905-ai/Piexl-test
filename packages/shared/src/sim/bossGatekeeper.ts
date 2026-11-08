// 시즌 3 1단계 보스 지옥문 수문장: 방 곳곳에 지옥문(맞힐 수 있는 적)을 열고, 열린 문에서 임프가 나옴
// 차례로 ① 문 넘기(나올 문에 원 예고 → 튀어나오며 내려찍기) ② 쇠문짝 돌진(선 예고) ③ 사슬 던지기(맞으면 끌려옴)
// 문을 하나 부술 때마다 경직 + 받는 피해 증가 · 다 부수면 무릎 꿇기(크게 때릴 기회) 뒤 다시 엶 · 체력 절반 아래면 문 넷·불붙은 임프
import { ENEMIES } from "../enemyDefs";
import { createRng, deriveSeed } from "../rng";
import { half, hitDamage } from "./bossKit";
import { addShape, inHazard } from "./hazards";
import { eachSeat } from "./party";
import { dashDodged } from "./remnant";
import type { EnemyState, RunState } from "./types";
import { addEffect, keepInRoom, makeEnemy, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 지옥문 수: 처음 · 체력 절반 아래 */
  GATES: 3,
  GATES_HALF: 4,
  /** 문 체력 배율 (수문장 체력이 늘면 같이) */
  GATE_HP: 1,
  /** 임프: 문마다 나오는 간격 틱 · 방에 최대 몇 마리 · 체력 배율 */
  IMP_EVERY: 240,
  IMP_MAX: 6,
  IMP_HP: 1,
  /** 불붙은 임프: 붙으면 터지기까지 틱 · 범위 · 피해 배율 (보스 한 방 기준) */
  FIRE_FUSE: 30,
  FIRE_R: 16,
  FIRE_MUL: 0.5,
  /** 문 넘기: 나올 문 예고 틱 · 내려찍기 범위 · 체력 절반 아래 이어서 넘는 횟수 */
  WARP_WARN: 48,
  SLAM_R: 30,
  WARP_HALF: 2,
  /** 쇠문짝 돌진: 예고 틱 · 돌진 틱 · 빠르기 · 예고 선 굵기 */
  RUSH_WARN: 34,
  RUSH_TICKS: 34,
  RUSH_SPEED: 2.4,
  RUSH_W: 9,
  /** 사슬: 길이 · 굵기 · 예고 틱 · 끌려오는 거리 · 피해 배율 */
  CHAIN_LEN: 130,
  CHAIN_W: 5,
  CHAIN_WARN: 36,
  PULL: 50,
  CHAIN_MUL: 0.6,
  /** 문이 부서질 때: 수문장 경직 틱 · 부서진 문 하나마다 받는 피해 + */
  BREAK_STUN: 60,
  BREAK_TAKEN: 0.15,
  /** 문이 다 부서지면 무릎 꿇는 틱 (그동안 공격 안 함) */
  KNEEL: 240,
  /** 공격 사이 쉬는 틱 (체력 절반 아래는 이만큼 줄임) */
  REST: 80,
  REST_HALF: 25,
};
export { R as BOSS_GATEKEEPER_RULES };

type Vec = readonly [number, number];
const alive = (s: RunState, id: number) => s.enemies.find((x) => x.id === id && x.hp > 0);

/** 수문장 받는 피해 배율 (부서진 문 수만큼, sim/classTaken) */
export const gateTaken = (e: EnemyState) => (e.kind === "gatekeeper" ? 1 + (e.gkBroken ?? 0) * R.BREAK_TAKEN : 1);

/** 문 자리: 왼쪽·오른쪽·위·아래 가운데 (시드로 조금 흔듦) */
function gateSpots(s: RunState, e: EnemyState, n: number): Vec[] {
  const rng = createRng(deriveSeed(s.seed, "gkGate", s.floor, e.count));
  const mx = (ROOM_MIN_X + ROOM_MAX_X) / 2;
  const my = (ROOM_MIN_Y + ROOM_MAX_Y) / 2;
  const j = () => rng.int(-14, 14);
  const all: Vec[] = [
    [ROOM_MIN_X + 26, my + j()],
    [ROOM_MAX_X - 26, my + j()],
    [mx + j(), ROOM_MIN_Y + 26],
    [mx + j(), ROOM_MAX_Y - 26],
  ];
  return all.slice(0, n);
}

/** 문 열기 (지금 있는 문은 그대로 · 부서진 문 수는 처음부터) */
function openGates(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  const n = half(e) ? R.GATES_HALF : R.GATES;
  const mul = (e.maxHp / ENEMIES.gatekeeper.hp) * R.GATE_HP;
  e.gkGates = gateSpots(s, e, n).map(([x, y]) => {
    const g = makeEnemy(s, "hellgate", x, y, mul, 0);
    keepInRoom(g, roomGrid(s));
    g.noGold = true;
    g.fixAt = [g.x, g.y];
    spawned.push(g);
    addEffect(s, { kind: "burst", x: g.x, y: g.y, dirX: 0, dirY: 0, size: 14, maxTicks: 18, foe: true });
    return { x: g.x, y: g.y, id: g.id };
  });
  e.gkBroken = 0;
  e.gkImp = R.IMP_EVERY / 2;
}

/** 문 · 임프 (bosses BOSS_AI): 문은 제자리 · 임프는 쫓아옴, 불붙은 임프는 붙으면 터짐 */
export function updateGateProp(s: RunState, e: EnemyState, go: Vec): void {
  if (e.kind === "hellgate") {
    if (e.fixAt) [e.x, e.y] = e.fixAt;
    return;
  }
  const p = s.player;
  if (e.phase === "windup") {
    if (e.timer > 0) return;
    e.hp = 0;
    return;
  }
  e.x += go[0] * ENEMIES.imp.speed;
  e.y += go[1] * ENEMIES.imp.speed;
  const rr = e.r + p.r + 4;
  if (e.fire && (e.x - p.x) ** 2 + (e.y - p.y) ** 2 < rr * rr) {
    e.phase = "windup";
    e.timer = R.FIRE_FUSE;
    addShape(s, R.FIRE_FUSE, { x: e.x, y: e.y, radius: R.FIRE_R, damage: Math.round(hitDamage(s) * R.FIRE_MUL), by: "bombbug" });
  }
}

/** 열린 문에서 임프 · 부서진 문 세기 (부서질 때마다 경직) */
function gateTick(s: RunState, e: EnemyState, spawned: EnemyState[]): void {
  const gates = e.gkGates ?? [];
  const open = gates.filter((g) => alive(s, g.id));
  const broken = gates.length - open.length;
  if (broken > (e.gkBroken ?? 0)) {
    e.gkBroken = broken;
    e.stunTicks = Math.max(e.stunTicks ?? 0, R.BREAK_STUN);
    addEffect(s, { kind: "burst", x: e.x, y: e.y - 8, dirX: 0, dirY: 0, size: 18, maxTicks: 18, foe: true });
  }
  if (!open.length || --e.gkImp! > 0) return;
  e.gkImp = R.IMP_EVERY;
  const imps = s.enemies.filter((m) => m.kind === "imp" && m.hp > 0).length + spawned.filter((m) => m.kind === "imp").length;
  const mul = (e.maxHp / ENEMIES.gatekeeper.hp) * R.IMP_HP;
  open.slice(0, Math.max(0, R.IMP_MAX - imps)).forEach((g) => {
    const m = makeEnemy(s, "imp", g.x, g.y + 8, mul, 0);
    m.noGold = true;
    if (half(e)) m.fire = true;
    spawned.push(m);
  });
}

export function updateGatekeeper(s: RunState, e: EnemyState, toP: Vec, go: Vec, spawned: EnemyState[]): void {
  const h = half(e);
  const rest = h ? R.REST - R.REST_HALF : R.REST;
  // 처음 · 무릎에서 일어나면 문을 엶
  if (!e.gkGates) openGates(s, e, spawned);
  gateTick(s, e, spawned);
  const open = (e.gkGates ?? []).filter((g) => alive(s, g.id));
  // 문이 다 부서지면 무릎 (공격 안 함)
  if (e.phase !== "act" && !open.length && (e.gkGates?.length ?? 0) > 0 && e.phase !== "blink") {
    e.phase = "act";
    e.timer = R.KNEEL;
    e.air = false;
    return;
  }
  if (e.phase === "act") {
    if (e.timer > 0) return;
    e.count++;
    openGates(s, e, spawned);
    e.phase = "walk";
    e.timer = rest;
    return;
  }
  if (e.phase === "walk") {
    e.x += go[0] * ENEMIES.gatekeeper.speed;
    e.y += go[1] * ENEMIES.gatekeeper.speed;
    e.dirX = toP[0];
    e.dirY = toP[1];
    if (e.timer > 0) return;
    e.count++;
    const pick = e.count % 3;
    if (pick === 1 && open.length) return warp(s, e, open, h ? R.WARP_HALF : 1);
    if (pick === 2 || !open.length) {
      // 쇠문짝 돌진: 지금 사람 쪽으로 선 예고 → 돌진 (몸에 닿으면 피해)
      e.phase = "windup";
      e.timer = R.RUSH_WARN;
      e.dirX = toP[0];
      e.dirY = toP[1];
      const len = R.RUSH_TICKS * R.RUSH_SPEED;
      addShape(s, R.RUSH_WARN, { x: e.x, y: e.y, radius: 0, damage: 0, toX: e.x + toP[0] * len, toY: e.y + toP[1] * len, width: R.RUSH_W });
      e.step = 0;
      return;
    }
    // 사슬 던지기: 선 예고 → 맞으면 끌려옴
    e.phase = "swing";
    e.timer = R.CHAIN_WARN;
    e.dirX = toP[0];
    e.dirY = toP[1];
    addShape(s, R.CHAIN_WARN, { x: e.x, y: e.y, radius: 0, damage: Math.round(hitDamage(s) * R.CHAIN_MUL), toX: e.x + toP[0] * R.CHAIN_LEN, toY: e.y + toP[1] * R.CHAIN_LEN, width: R.CHAIN_W, fx: "stab" });
    return;
  }
  if (e.phase === "blink") {
    // 문 속: 맞지 않음 · 나올 문으로 (예고가 끝나면 튀어나오며 내려찍기)
    if (e.timer > 0) return;
    e.x = e.prevX = e.auxX ?? e.x;
    e.y = e.prevY = e.auxY ?? e.y;
    e.immune = false;
    e.air = false;
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: R.SLAM_R, maxTicks: 16, foe: true });
    if ((e.step ?? 0) > 1 && open.length) return warp(s, e, open, (e.step ?? 1) - 1);
    e.phase = "walk";
    e.timer = rest;
    return;
  }
  if (e.phase === "windup") {
    if (e.timer > 0) return;
    e.phase = "charge";
    e.timer = R.RUSH_TICKS;
    return;
  }
  if (e.phase === "charge") {
    e.x += e.dirX * R.RUSH_SPEED;
    e.y += e.dirY * R.RUSH_SPEED;
    if (e.timer > 0) return;
    e.phase = "walk";
    e.timer = rest;
    return;
  }
  if (e.phase === "swing") {
    if (e.timer > 0) return;
    const line = { tick: 0, start: 0, x: e.x, y: e.y, radius: 0, damage: 0, toX: e.x + e.dirX * R.CHAIN_LEN, toY: e.y + e.dirY * R.CHAIN_LEN, width: R.CHAIN_W };
    eachSeat(
      s,
      () => {
        const p = s.player;
        if (!inHazard(line, p.x, p.y, p.r) || dashDodged(s)) return;
        p.x -= e.dirX * R.PULL;
        p.y -= e.dirY * R.PULL;
        keepInRoom(p, roomGrid(s));
      },
      !!s.party,
    );
    e.phase = "walk";
    e.timer = rest;
  }
}

/** 문 넘기: 사람에게 가장 가까운 열린 문에서 나옴 (그 문에 원 예고) · left번 이어서 */
function warp(s: RunState, e: EnemyState, open: { x: number; y: number }[], left: number): void {
  const p = s.player;
  const to = open.reduce((a, b) => ((b.x - p.x) ** 2 + (b.y - p.y) ** 2 < (a.x - p.x) ** 2 + (a.y - p.y) ** 2 ? b : a));
  const d = normalize(p.x - to.x, p.y - to.y) ?? [0, 1];
  e.auxX = to.x + d[0] * 12;
  e.auxY = to.y + d[1] * 12;
  e.phase = "blink";
  e.timer = R.WARP_WARN;
  e.step = left;
  e.immune = true;
  e.air = true;
  addShape(s, R.WARP_WARN, { x: e.auxX, y: e.auxY, radius: R.SLAM_R, damage: hitDamage(s), owner: e.id });
}
