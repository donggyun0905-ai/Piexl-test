// 수집가(테라코어, 시즌 3): 기본 검 + 수집 무기(패시브 30, itemsCollector)로 이어지는 콤보
// 공격 한 번 = 콤보 전체: 기본 검 → 얻은 차례대로 등 뒤 수집 무기가 하나씩 날아 나와 자기 기술 (COLLECTOR.gap 틱 간격) → 다 끝나면 공격 대기
// 수집 무기를 얻을 때마다 콤보가 한 칸 늘어남 · 수치는 weaponsCollector.COLLECTOR · 기술 표는 itemsCollector.CL_ARMS
// 그리기(render/collector)는 효과 clMove(from = 무기 id, 무기마다 모양이 다름)를 봄
import { TICK_RATE } from "../constants";
import { CL_ARMS, type ClArm, type ClArmId } from "../itemsCollector";
import { COLLECTOR as R } from "../weaponsCollector";
import { nearest } from "./brawlMoves";
import { healPlayer } from "./combat";
import { applyBleed } from "./gunExtras";
import { inCircle, inCone, inLine, isBoss, onSegment, root, strike, stun } from "./s2Kit";
import { ignite } from "./status";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, keepInRoom, normalize, roomGrid } from "./util";

export const isCollector = (p: PlayerState) => p.characterId === "collector";
const isArm = (id: string): id is ClArmId => id in CL_ARMS;

/** 얻은 수집 무기 (얻은 차례) */
export function collected(p: PlayerState): ClArmId[] {
  const out: ClArmId[] = [];
  for (const id of p.passives) if (isArm(id) && !out.includes(id)) out.push(id);
  return out;
}

/** 등 뒤에 떠 있는 수집 무기 (콤보에서 날아 나가 있는 동안의 무기는 빼고) */
export function armsOnBack(p: PlayerState): ClArmId[] {
  const c = p.clCombo;
  const out = c && c.i > 0 ? c.list[c.i - 1] : undefined;
  return collected(p).filter((id) => id !== out);
}

/** 노린 적 쪽으로 돌아섬 */
function aim(s: RunState): EnemyState | null {
  const p = s.player;
  const e = nearest(s, p.stats.range * R.aim);
  const d = e && normalize(e.x - p.x, e.y - p.y);
  if (d) [p.faceX, p.faceY] = d;
  return e;
}

/** 맞힌 적에게 피해·추가 효과 · 준 피해 합 */
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

/** 방향 (dx,dy)를 a만큼 돌림 */
const turn = (dx: number, dy: number, a: number): [number, number] => [dx * Math.cos(a) - dy * Math.sin(a), dx * Math.sin(a) + dy * Math.cos(a)];

/** 수집 무기 기술 하나 (지금 내 자리에서) */
export function useArm(s: RunState, id: ClArmId, mul = 1): void {
  const p = s.player;
  const arm: ClArm = CL_ARMS[id];
  const t = aim(s);
  const dmg = p.stats.damage * arm.mul * mul;
  const [fx, fy] = [p.faceX, p.faceY];
  const r = arm.reach;
  // 노린 자리 (적이 없으면 앞쪽)
  const [tx, ty] = t ? [t.x, t.y] : [p.x + fx * 50, p.y + fy * 50];
  let sum = 0;
  let to = { toX: tx, toY: ty };
  switch (arm.style) {
    case "sweep":
    case "whirl":
      for (let i = 0; i < (arm.n ?? 1); i++) sum += hitAll(s, inCircle(s, p.x, p.y, r), dmg, arm, p.x, p.y);
      break;
    case "reap":
      sum += hitAll(s, inCone(s, r, -0.5), dmg, arm, p.x, p.y);
      break;
    case "punch":
      sum += hitAll(s, inCone(s, r, 0.5), dmg, arm, p.x, p.y);
      break;
    case "chop":
    case "cast":
      sum += hitAll(s, inCircle(s, tx, ty, r), dmg, arm, tx, ty);
      break;
    case "claw":
      for (let i = 0; i < (arm.n ?? 1); i++) sum += hitAll(s, inCircle(s, tx, ty, r), dmg, arm, tx, ty);
      break;
    case "iai": {
      // 앞으로 내달리며 지나간 길의 적을 벰 (벽에서 멈춤)
      const [sx, sy] = [p.x, p.y];
      p.x += fx * r;
      p.y += fy * r;
      keepInRoom(p, roomGrid(s));
      p.prevX = p.x;
      p.prevY = p.y;
      p.invulnTicks = Math.max(p.invulnTicks, 8);
      sum += hitAll(s, onSegment(s, sx, sy, p.x, p.y, arm.width ?? 8), dmg, arm, p.x, p.y);
      addEffect(s, { kind: "clMove", x: sx, y: sy, toX: p.x, toY: p.y, dirX: fx, dirY: fy, size: r, maxTicks: 16, from: id });
      return finish(s, arm, sum);
    }
    case "stars": {
      // 둘레 적 n마리 위로 별이 하나씩 떨어짐
      const foes = s.enemies.filter((e) => e.hp > 0 && !e.immune && Math.hypot(e.x - p.x, e.y - p.y) < p.stats.range * R.aim).slice(0, arm.n ?? 3);
      foes.forEach((e, k) => {
        sum += hitAll(s, inCircle(s, e.x, e.y, r), dmg, arm, e.x, e.y);
        addEffect(s, { kind: "clMove", x: e.x, y: e.y, dirX: 0, dirY: 1, size: r, maxTicks: 18 + k * 2, from: id });
      });
      if (foes.length === 0) addEffect(s, { kind: "clMove", x: tx, y: ty, dirX: 0, dirY: 1, size: r, maxTicks: 18, from: id });
      return finish(s, arm, sum);
    }
    default: {
      // volley 활·석궁·총 (부채꼴 여러 발) · throw 창·쌍월 (꿰뚫는 한 줄, n번) · beam 빛줄기: 앞으로 뻗은 줄
      const n = arm.style === "volley" ? (arm.n ?? 1) : 1;
      const times = arm.style === "throw" ? (arm.n ?? 1) : 1;
      const spread = arm.style === "volley" && id === "clPistol" ? 0.06 : 0.16;
      for (let i = 0; i < n; i++) {
        const [dx, dy] = turn(fx, fy, (i - (n - 1) / 2) * spread);
        for (let k = 0; k < times; k++) sum += hitAll(s, inLine(s, r, arm.width ?? 4, dx, dy), dmg, arm, p.x, p.y);
      }
      to = { toX: p.x + fx * r, toY: p.y + fy * r };
    }
  }
  addEffect(s, { kind: "clMove", x: p.x, y: p.y, dirX: fx, dirY: fy, size: r, maxTicks: 18, from: id, ...to });
  finish(s, arm, sum);
}

/** 맞힌 뒤 회복 (빛·흡혈) */
function finish(s: RunState, arm: ClArm, sum: number): void {
  if (arm.fx === "heal" && sum > 0) healPlayer(s, arm.val ?? 1);
  if (arm.fx === "leech" && sum > 0) healPlayer(s, sum * (arm.val ?? 0));
}

/** 기본 검: 앞을 반원으로 벰 */
function baseSlash(s: RunState): void {
  const p = s.player;
  aim(s);
  for (const e of inCone(s, R.baseReach, R.baseArc)) strike(s, e, p.stats.damage);
  addEffect(s, { kind: "clMove", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: R.baseReach, maxTicks: 10, from: "clBlade" });
}

/** 콤보 한 칸 */
function step(s: RunState, id: string): void {
  if (isArm(id)) useArm(s, id);
  else baseSlash(s);
}

/** 틱마다 (수집가의 검을 들었을 때 player에서) */
export function collectorTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  const c = p.clCombo;
  if (c) {
    // 이어지는 콤보: 간격마다 다음 무기
    if (--c.t > 0) return;
    if (c.i >= c.list.length) {
      delete p.clCombo;
      p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
      return;
    }
    step(s, c.list[c.i]!);
    c.i++;
    c.t = R.gap;
    return;
  }
  if (!want || p.attackCooldown > 0) return;
  p.attackCount++;
  const list = ["clBlade", ...collected(p)];
  step(s, list[0]!);
  p.clCombo = { list, i: 1, t: R.gap };
}

/** 연습장 등에서 다시 시작할 때 */
export function resetCollector(p: PlayerState): void {
  delete p.clCombo;
}
