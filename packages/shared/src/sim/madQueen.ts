// 매드퀸(탈라시아, 해방의 제독): 누를 때마다 머리 위 대포(1~4문)가 터지는 포탄을 한 발씩 (sim/madQueenArms)
// 쏠 때마다 확률로 맵 아무 곳에 네온 터렛(최대 4, 움직이지 않고 사거리 안 적을 쏨) · 몸 양옆에 날개 무기(최대 4, 같이 레이저)
// 터렛 4 + 날개 4가 모두 모이면 '전탄 일제사격'으로 맵 전체에 포탄이 떨어지고, 터렛·날개는 사라져 대포부터 다시 시작
import { TICK_RATE } from "../constants";
import { MADQUEEN_PERKS as K } from "../itemsMadQueen";
import { createRng, deriveSeed } from "../rng";
import { MADQUEEN as Q } from "../weaponsMadQueen";
import { bodyFits } from "./layout";
import { armsTick, fireShell, startSalvo } from "./madQueenArms";
import { boomR, cannonCount, cannonPos, fleetOf, mqHit, turretChance, wingChance, wingPos } from "./madQueenKit";
import { alive, roomKey } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";

/** 머리 위 대포마다 한 발: 바라보는 쪽으로 나란히 (땅 위 자리는 대포 줄을 옆으로 조금 벌림) · 둘째 대포부터 조금 약함 */
function volley(s: RunState): void {
  const p = s.player;
  const n = cannonCount(p);
  for (let i = 0; i < n; i++) {
    const [x, y] = cannonPos(p, i, n);
    const off = (i - (n - 1) / 2) * Q.cannonGap * Q.shellSpread;
    const gx = p.x - p.faceY * off + p.faceX * 8;
    const gy = p.y + p.faceX * off + p.faceY * 8;
    const dmg = p.stats.damage * Q.shellMul * (i === 0 ? 1 : Q.extraMul);
    fireShell(s, gx, gy, p.faceX, p.faceY, { sp: Q.shellSpeed, range: Q.shellRange, r: Q.shellR, boom: boomR(p, Q.boomR), dmg, src: 0, h: p.y - y });
    addEffect(s, { kind: "mqMuzzle", x: x + p.faceX * 12, y: y + p.faceY * 6, dirX: p.faceX, dirY: p.faceY, size: 9, maxTicks: 10, style: fleetOf(p).color });
  }
}

/** 날개마다 바라보는 쪽으로 레이저 (꿰뚫음) */
function wingBeams(s: RunState): void {
  const p = s.player;
  const prism = hasPerk(p, "mqPrism");
  const w = Q.beamW * (prism ? K.mqPrism.width : 1);
  const dmg = p.stats.damage * Q.beamMul * (prism ? K.mqPrism.mul : 1);
  for (let i = 0; i < (p.mqWings ?? 0); i++) {
    const [x, y] = wingPos(p, i);
    for (const e of alive(s)) {
      const t = (e.x - x) * p.faceX + (e.y - y) * p.faceY;
      const off = Math.abs((e.x - x) * p.faceY - (e.y - y) * p.faceX);
      if (t > -e.r && t < Q.beamLen + e.r && off < w + e.r) mqHit(s, e, dmg, x, y);
    }
    addEffect(s, { kind: "mqBeam", x, y, toX: x + p.faceX * Q.beamLen, toY: y + p.faceY * Q.beamLen, dirX: p.faceX, dirY: p.faceY, size: w, width: w, maxTicks: 12, style: fleetOf(p).color });
  }
}

/** 맵 아무 곳(빈 바닥, 나·다른 터렛과 조금 떨어진 곳)에 터렛을 놓음 */
function placeTurret(s: RunState, rnd: () => number): void {
  const p = s.player;
  const g = roomGrid(s);
  const list = (p.mqTurrets ??= []);
  for (let k = 0; k < 16; k++) {
    const x = ROOM_MIN_X + 16 + rnd() * (ROOM_MAX_X - ROOM_MIN_X - 32);
    const y = ROOM_MIN_Y + 20 + rnd() * (ROOM_MAX_Y - ROOM_MIN_Y - 36);
    if (g && !bodyFits(g, x, y, 9)) continue;
    if (dist2(p, { x, y }) < Q.turretGap ** 2 || list.some((u) => dist2(u, { x, y }) < Q.turretGap ** 2)) continue;
    list.push({ x, y, cd: 0, a: Math.PI, age: 0 });
    addEffect(s, { kind: "mqDrop", x, y, dirX: 0, dirY: 0, size: 14, maxTicks: 20, style: fleetOf(p).color });
    return;
  }
}

/** 쏠 때마다: 확률로 터렛·날개 · 둘 다 가득이면 전탄 일제사격 */
function deploy(s: RunState): void {
  const p = s.player;
  if (p.mqSalvo) return;
  const rng = createRng(deriveSeed(s.seed, "mqArm", s.tick));
  const rnd = () => rng.nextFloat();
  if ((p.mqTurrets?.length ?? 0) < Q.turretMax && rnd() < turretChance(p)) placeTurret(s, rnd);
  if ((p.mqWings ?? 0) < Q.wingMax && rnd() < wingChance(p)) {
    p.mqWings = (p.mqWings ?? 0) + 1;
    const [x, y] = wingPos(p, p.mqWings - 1);
    addEffect(s, { kind: "mqWing", x, y, dirX: p.mqWings % 2 === 0 ? 1 : -1, dirY: 0, size: 14, maxTicks: 18, style: fleetOf(p).color });
  }
  if ((p.mqTurrets?.length ?? 0) < Q.turretMax || (p.mqWings ?? 0) < Q.wingMax) return;
  for (const u of p.mqTurrets ?? []) addEffect(s, { kind: "mqDrop", x: u.x, y: u.y, dirX: 0, dirY: -1, size: 18, maxTicks: 24, style: fleetOf(p).color });
  delete p.mqTurrets;
  delete p.mqWings;
  startSalvo(s, rnd);
}

/** 방이 바뀌면 터렛·날개·포탄을 비움 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.mqRoom === key) return;
  p.mqRoom = key;
  resetMadQueen(p, true);
}

/** 틱마다 (함대 무기를 들었을 때 player에서) */
export function madQueenTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  armsTick(s, speed);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  p.mqShot = s.tick;
  volley(s);
  wingBeams(s);
  deploy(s);
}

/** 연습장 등에서 다시 시작할 때 (keepRoom: 방 이름은 남김) */
export function resetMadQueen(p: PlayerState, keepRoom = false): void {
  for (const k of ["mqShells", "mqTurrets", "mqWings", "mqShot", "mqSalvo"] as const) delete p[k];
  if (!keepRoom) delete p.mqRoom;
}

export { cannonCount, cannonPos, isMadQueen, wingPos } from "./madQueenKit";
