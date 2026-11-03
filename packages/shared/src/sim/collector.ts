// 수집가(테라코어, 시즌 3): 기본 검 + 수집 무기(패시브 30, itemsCollector)로 이어지는 콤보
// 공격마다 콤보 한 칸: 기본 검 → 얻은 차례대로 등 뒤 수집 무기의 기술 → 다시 기본 검 …
// 기본 패시브: 콤보에 쓴 수집 무기는 등 뒤에서 사라져 방 어딘가(벽·기둥 위 빼고)에 박힘 → 몸이 닿으면 그 자리에서 그 기술이 바로 발동(공격 주기와 따로)하고 등 뒤로 돌아옴
// 방을 나가면 박힌 무기는 저절로 돌아옴 · 기본 검은 박히지 않음 · 수치는 weaponsCollector.COLLECTOR · 기술 표는 itemsCollector.CL_ARMS
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, TICK_RATE } from "../constants";
import { CL_ARMS, type ClArm, type ClArmId } from "../itemsCollector";
import { createRng, deriveSeed } from "../rng";
import { COLLECTOR as R } from "../weaponsCollector";
import { nearest } from "./brawlMoves";
import { healPlayer } from "./combat";
import { applyBleed } from "./gunExtras";
import { bodyFits } from "./layout";
import { inCircle, inCone, inLine, isBoss, onSegment, root, strike, stun } from "./s2Kit";
import { ignite } from "./status";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, keepInRoom, normalize, roomGrid } from "./util";

const roomOf = (s: RunState) => s.floor * 1000 + s.roomId;
export const isCollector = (p: PlayerState) => p.characterId === "collector";
const isArm = (id: string): id is ClArmId => id in CL_ARMS;

/** 얻은 수집 무기 (얻은 차례) */
export function collected(p: PlayerState): ClArmId[] {
  const out: ClArmId[] = [];
  for (const id of p.passives) if (isArm(id) && !out.includes(id)) out.push(id);
  return out;
}

/** 등 뒤에 떠 있는 수집 무기 (박힌 것 빼고) */
export function armsOnBack(p: PlayerState): ClArmId[] {
  const stuck = new Set((p.clStuck ?? []).map((w) => w.id));
  return collected(p).filter((id) => !stuck.has(id));
}

/** 노린 적 쪽으로 돌아섬 */
function aim(s: RunState): EnemyState | null {
  const p = s.player;
  const e = nearest(s, p.stats.range * R.aim);
  const d = e && normalize(e.x - p.x, e.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
  return e;
}

/** 맞힌 적에게 추가 효과 · 준 피해 합 */
function hitAll(s: RunState, list: EnemyState[], dmg: number, arm: ClArm, cx: number, cy: number): number {
  let sum = 0;
  for (const e of list) {
    strike(s, e, dmg, arm.fx === "push" ? (arm.val ?? 0) : 0);
    sum += dmg;
    const v = arm.val ?? 0;
    if (arm.fx === "slow") e.slowTicks = Math.max(e.slowTicks ?? 0, v);
    else if (arm.fx === "burn") ignite(e, dmg * v);
    else if (arm.fx === "stun") stun(e, v);
    else if (arm.fx === "root") root(e, v);
    else if (arm.fx === "bleed" && e.hp > 0) applyBleed(e);
    else if (arm.fx === "pull" && !isBoss(e)) {
      const d = normalize(cx - e.x, cy - e.y);
      if (d && Math.hypot(cx - e.x, cy - e.y) > v) {
        e.x += d[0] * v;
        e.y += d[1] * v;
      }
    }
  }
  return sum;
}

/** 수집 무기 기술 하나 (지금 내 자리에서) */
export function useArm(s: RunState, id: ClArmId, mul: number): void {
  const p = s.player;
  const arm: ClArm = CL_ARMS[id];
  const t = aim(s);
  const dmg = p.stats.damage * arm.mul * mul;
  const [fx, fy] = [p.faceX, p.faceY];
  const reach = arm.reach;
  let sum = 0;
  let [cx, cy] = [p.x, p.y];
  let to: { toX: number; toY: number } | undefined;
  switch (arm.style) {
    case "slash":
      for (let i = 0; i < (arm.n ?? 1); i++) sum += hitAll(s, inCone(s, reach, arm.arc ?? 0), dmg, arm, p.x, p.y);
      break;
    case "dash": {
      // 앞으로 내달리며 지나간 길의 적을 벰 (벽에서 멈춤)
      const [sx, sy] = [p.x, p.y];
      p.x += fx * reach;
      p.y += fy * reach;
      keepInRoom(p, roomGrid(s));
      p.prevX = p.x;
      p.prevY = p.y;
      p.invulnTicks = Math.max(p.invulnTicks, 10);
      sum += hitAll(s, onSegment(s, sx, sy, p.x, p.y, arm.width ?? 8), dmg, arm, p.x, p.y);
      [cx, cy] = [sx, sy];
      to = { toX: p.x, toY: p.y };
      break;
    }
    case "nova":
      sum += hitAll(s, inCircle(s, p.x, p.y, reach), dmg, arm, p.x, p.y);
      break;
    case "orb": {
      [cx, cy] = t ? [t.x, t.y] : [p.x + fx * 50, p.y + fy * 50];
      sum += hitAll(s, inCircle(s, cx, cy, reach), dmg, arm, cx, cy);
      break;
    }
    case "spin":
      for (let i = 0; i < (arm.n ?? 1); i++) sum += hitAll(s, inCircle(s, p.x, p.y, reach), dmg, arm, p.x, p.y);
      break;
    case "rain": {
      // 둘레 적 n마리 위로 별이 떨어짐
      const foes = s.enemies.filter((e) => e.hp > 0 && !e.immune && Math.hypot(e.x - p.x, e.y - p.y) < p.stats.range * R.aim).slice(0, arm.n ?? 3);
      for (const e of foes) {
        sum += hitAll(s, inCircle(s, e.x, e.y, reach), dmg, arm, e.x, e.y);
        addEffect(s, { kind: "clArm", x: e.x, y: e.y, dirX: 0, dirY: 1, size: reach, maxTicks: 18, from: id });
      }
      if (foes.length > 0) [cx, cy] = [foes[0]!.x, foes[0]!.y];
      break;
    }
    default: {
      // 화살·석궁·총·빛줄기·창: 앞으로 뻗은 줄 (화살은 부채꼴로 여러 줄, 총은 두 번)
      const n = arm.style === "arrows" ? (arm.n ?? 3) : 1;
      const times = arm.style === "shots" ? (arm.n ?? 2) : 1;
      for (let i = 0; i < n; i++) {
        const a = (i - (n - 1) / 2) * 0.16;
        const dx = fx * Math.cos(a) - fy * Math.sin(a);
        const dy = fx * Math.sin(a) + fy * Math.cos(a);
        for (let k = 0; k < times; k++) sum += hitAll(s, inLine(s, reach, arm.width ?? 4, dx, dy), dmg, arm, p.x, p.y);
      }
      to = { toX: p.x + fx * reach, toY: p.y + fy * reach };
    }
  }
  if (arm.fx === "heal" && sum > 0) healPlayer(s, arm.val ?? 1);
  if (arm.fx === "leech" && sum > 0) healPlayer(s, sum * (arm.val ?? 0));
  if (arm.style !== "rain") addEffect(s, { kind: "clArm", x: cx, y: cy, dirX: fx, dirY: fy, size: reach, maxTicks: 18, from: id, width: arm.n ?? arm.width, ...to });
}

/** 쓴 수집 무기를 방 어딘가에 박음 (벽·기둥·구덩이 위 빼고, 나와 조금 떨어진 곳) */
function stick(s: RunState, id: ClArmId): boolean {
  const p = s.player;
  const g = roomGrid(s);
  const rng = createRng(deriveSeed(s.seed, "clStick", s.floor, s.roomId, s.tick, id));
  let spot: [number, number] | null = null;
  for (let i = 0; i < 30 && !spot; i++) {
    const x = rng.int(ROOM_MIN_X + 14, ROOM_MAX_X - 14);
    const y = rng.int(ROOM_MIN_Y + 14, ROOM_MAX_Y - 14);
    const d = Math.hypot(x - p.x, y - p.y);
    if (d >= R.stickMin && d <= R.stickMax && (!g || bodyFits(g, x, y, 5))) spot = [x, y];
  }
  if (!spot) return false;
  (p.clStuck ??= []).push({ id, x: spot[0], y: spot[1], room: roomOf(s), at: s.tick });
  addEffect(s, { kind: "clFly", x: p.x, y: p.y - 14, toX: spot[0], toY: spot[1], dirX: 0, dirY: 0, size: 8, maxTicks: 16, from: id });
  return true;
}

/** 기본 검: 앞을 반원으로 벰 */
function baseSlash(s: RunState): void {
  const p = s.player;
  aim(s);
  for (const e of inCone(s, R.baseReach, R.baseArc)) strike(s, e, p.stats.damage);
  addEffect(s, { kind: "clArm", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: R.baseReach, maxTicks: 12, from: "clBlade" });
}

/** 박힌 무기: 방을 나가면 돌아옴 · 몸이 닿으면 그 자리에서 기술 발동 → 등 뒤로 */
function touchStuck(s: RunState): void {
  const p = s.player;
  const list = p.clStuck;
  if (!list?.length) return;
  const room = roomOf(s);
  const left: NonNullable<PlayerState["clStuck"]> = [];
  for (const w of list) {
    if (w.room !== room) continue;
    if (s.tick - w.at >= R.rest && Math.hypot(w.x - p.x, w.y - p.y) <= p.r + R.touch && isArm(w.id)) {
      useArm(s, w.id, R.touchMul);
      addEffect(s, { kind: "clFly", x: w.x, y: w.y, toX: p.x, toY: p.y - 14, dirX: 0, dirY: 0, size: 12, maxTicks: 14, from: w.id, follow: true });
      continue;
    }
    left.push(w);
  }
  p.clStuck = left;
}

/** 틱마다 (수집가의 검을 들었을 때 player에서) */
export function collectorTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  touchStuck(s);
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  const chain = armsOnBack(p);
  const i = (p.clStep ?? 0) % (chain.length + 1);
  p.clStep = i + 1;
  if (i === 0) return baseSlash(s);
  const id = chain[i - 1]!;
  useArm(s, id, 1);
  // 타워 디펜스 타워(fixedStats 판)는 움직이지 못하니 박지 않음 · 박히면 콤보에서 빠지니 다음 칸이 이 자리로 당겨짐
  if (!s.fixedStats && stick(s, id)) p.clStep = i;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetCollector(p: PlayerState): void {
  delete p.clStep;
  delete p.clStuck;
}
