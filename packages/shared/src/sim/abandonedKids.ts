// 버려진 자들: 나와 있지 않은 두 아이도 곁에서 따로 싸움 (낮은 피해). 방패·검은 다가가 치고 물러났다가 다시, 총은 떨어져서 탕탕 두 발씩
// 탭하면 들어오는 아이와 자리를 바꿈. 특수기 연출 중에는 abandonedShow가 움직임
import { ABANDONED as A } from "../weaponsAbandoned";
import { bullet } from "./abandonedMoves";
import { damageEnemy } from "./combat";
import type { TagKid } from "./abandonedTypes";
import type { EnemyState, RunState } from "./types";
import { dist2, keepInRoom, normalize, roomGrid } from "./util";

/** 아이 몸 크기 · 주인에게서 너무 멀어지면 곁으로 · 주인 곁 자리 */
const KID_R = 4;
const LEASH = 200;
const HOME: readonly (readonly [number, number])[] = [[-14, 6], [14, 6]];
/** 다가가다 포기하는 틱 */
const GO_MAX = 70;

function newKid(m: number, x: number, y: number): TagKid {
  return { m, x, y, prevX: x, prevY: y, face: 1, act: "go", t: GO_MAX, cd: 20 + m * 9, pair: 0, swing: 0 };
}

/** 지금 나와 있는 아이를 뺀 두 아이 (없거나 맞지 않으면 주인 곁에 새로) */
export function kidsOf(s: RunState): TagKid[] {
  const p = s.player;
  const want = [0, 1, 2].filter((m) => m !== (p.abM ?? 0));
  const kids = p.abKids ?? [];
  if (kids.length !== 2 || !want.every((m) => kids.some((k) => k.m === m))) {
    p.abKids = want.map((m, i) => kids.find((k) => k.m === m) ?? newKid(m, p.x + HOME[i]![0], p.y + HOME[i]![1]));
  }
  return p.abKids!;
}

/** 탭: 들어오는 아이(to)가 내 자리로, 나가는 아이는 들어온 아이가 있던 자리로 (내 자리·화면은 그대로) */
export function swapKid(s: RunState, to: number): void {
  const p = s.player;
  const from = p.abM ?? 0;
  if (from === to) return;
  const kid = kidsOf(s).find((k) => k.m === to)!;
  kid.m = from;
  if (p.abAuto || p.abShow) return;
  kid.act = "back";
  kid.t = A.kidBack;
}

/** 아이 기준 가장 가까운 적 (주인에게서 kidSeek 안) */
function nearest(s: RunState, kid: TagKid): EnemyState | null {
  const p = s.player;
  let best: EnemyState | null = null;
  let bd = Infinity;
  for (const e of s.enemies) {
    if (e.hp <= 0 || e.svBox || e.immune || dist2(e, p) > A.kidSeek * A.kidSeek) continue;
    const d = dist2(e, kid);
    if (d < bd) {
      bd = d;
      best = e;
    }
  }
  return best;
}

/** (tx, ty) 쪽으로 sp만큼 (sp < 0이면 멀어짐) */
function step(s: RunState, kid: TagKid, tx: number, ty: number, sp: number): void {
  const d = normalize(tx - kid.x, ty - kid.y);
  if (!d) return;
  const body = { x: kid.x + d[0] * sp, y: kid.y + d[1] * sp, prevX: kid.x, prevY: kid.y, r: KID_R };
  keepInRoom(body, roomGrid(s));
  kid.x = body.x;
  kid.y = body.y;
}

/** 근접(방패·검): 다가감 → 짧게 준비해 휘두름 → 물러남 → 다시 */
function melee(s: RunState, kid: TagKid, e: EnemyState, sp: number, dmg: number): void {
  const reach = e.r + A.kidReach;
  kid.t--;
  if (kid.act === "go") {
    if (dist2(kid, e) <= reach * reach) {
      kid.act = "hit";
      kid.t = A.kidWind;
    } else if (kid.t <= 0) {
      kid.act = "back";
      kid.t = A.kidBack;
    } else step(s, kid, e.x, e.y, sp);
    return;
  }
  if (kid.act === "hit") {
    if (kid.t > 0) return;
    const d = normalize(e.x - kid.x, e.y - kid.y) ?? [kid.face, 0];
    if (dist2(kid, e) <= (reach + 4) ** 2) damageEnemy(s, e, dmg, d[0], d[1], kid.m === 0);
    kid.swing = 8;
    kid.act = "back";
    kid.t = A.kidBack;
    return;
  }
  // 물러남: 적 반대쪽으로 (조금 비스듬히, 사람처럼)
  const away = normalize(kid.x - e.x, kid.y - e.y) ?? [-kid.face, 0];
  const side = kid.m === 0 ? 0.4 : -0.4;
  step(s, kid, kid.x + away[0] - away[1] * side, kid.y + away[1] + away[0] * side, sp * 0.8);
  if (kid.t <= 0) {
    kid.act = "go";
    kid.t = GO_MAX;
  }
}

/** 총: 거리를 두고 옆으로 조금씩 움직이며 두 발씩 쏨 */
function gunner(s: RunState, kid: TagKid, e: EnemyState, sp: number, dmg: number): void {
  const d = Math.sqrt(dist2(kid, e));
  if (d > A.gunKeep + 10) step(s, kid, e.x, e.y, sp);
  else if (d < A.gunKeep - 14) step(s, kid, e.x, e.y, -sp);
  else {
    const way = (s.tick >> 6) % 2 === 0 ? 1 : -1;
    const n = normalize(e.x - kid.x, e.y - kid.y)!;
    step(s, kid, kid.x - n[1] * way, kid.y + n[0] * way, sp * 0.35);
  }
  if (--kid.cd > 0) return;
  const n = normalize(e.x - kid.x, e.y - kid.y) ?? [kid.face, 0];
  bullet(s, kid.x, kid.y - 3, n[0], n[1], dmg);
  kid.swing = 5;
  kid.pair = (kid.pair + 1) % 2;
  kid.cd = kid.pair === 1 ? A.gunPair : A.gunRest;
}

/** 틱마다 (버려진 자들 무기를 들었을 때). 탭을 못 누르는 공격자(타워 등)는 아이들이 따로 움직이지 않음 */
export function updateKids(s: RunState): void {
  const p = s.player;
  if (p.abAuto) {
    if (!p.abShow) delete p.abKids;
    return;
  }
  const kids = kidsOf(s);
  const sp = p.stats.moveSpeed * A.kidSpeed;
  const dmg = p.stats.damage * A.kidMul;
  kids.forEach((kid, i) => {
    kid.prevX = kid.x;
    kid.prevY = kid.y;
    if (kid.swing > 0) kid.swing--;
    if (dist2(kid, p) > LEASH * LEASH) {
      kid.x = kid.prevX = p.x + HOME[i]![0];
      kid.y = kid.prevY = p.y + HOME[i]![1];
    }
    if (p.abShow) return;
    const e = nearest(s, kid);
    if (!e) {
      // 적이 없으면 주인 곁을 따라다님
      const hx = p.x + HOME[i]![0];
      const hy = p.y + HOME[i]![1];
      if (dist2(kid, { x: hx, y: hy }) > 9) step(s, kid, hx, hy, sp);
      kid.face = p.x >= kid.x ? 1 : -1;
      kid.act = "go";
      kid.t = GO_MAX;
      return;
    }
    kid.face = e.x >= kid.x ? 1 : -1;
    if (kid.m === 1) gunner(s, kid, e, sp, dmg);
    else melee(s, kid, e, sp, dmg);
  });
}
