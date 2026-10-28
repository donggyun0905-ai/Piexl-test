// 시즌 2 마지막 라스트 보스 제천대성: 근두운을 탄 반신. 몸 하나지만 공격은 두 갈래가 따로 돎 (2대1 느낌)
// 몸 갈래: 꼬리·주먹 10(sageBody) + 여의봉 10(sageStaff) 중 무작위 · 근두운 갈래: 번개·속도 10(sageCloud) 중 무작위
// 체력 10%가 되면 무적으로 근두운에서 내려와 체력 70%로 강해짐 (범위·피해 증가, 모든 공격이 터지기 직전 깜박여 대시 시점을 알려 줌). 내린 뒤 근두운은 따로 떠다니며 공격
import { keepAway } from "./bossKit";
import { updateWaves } from "./bossWaves";
import { ultReady } from "./bossUlts";
import type { EnemyState, RunState } from "./types";
import { addEffect, keepInRoom } from "./util";
import { BODY_MOVES, bodyTick } from "./sageBody";
import { STAFF_MOVES, staffTick } from "./sageStaff";
import { CLOUD_MOVES, cloudTick } from "./sageCloud";
import { ENEMIES } from "../content";
import { sageRng } from "./sageKit";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 거리 두기 · 몸 공격 사이 · 근두운 공격 사이 · 내려선 뒤 빨라지는 배율 */
  WANT: 90,
  BODY_GAP: 70,
  CLOUD_GAP: 95,
  FOOT_FAST: 0.8,
  /** 내려오는 틱 · 되찾는 체력 */
  DISMOUNT: 120,
  FOOT_HP: 0.7,
  /** 여의봉 벽 굵기(반) */
  WALL_W: 6,
};
export { R as BOSS_SAGE_RULES };

export const SAGE_DISMOUNT = R.DISMOUNT;

type Move = (s: RunState, e: EnemyState) => number;
/** 몸 갈래 20개 (앞 10 꼬리·주먹 · 뒤 10 여의봉): 시작하고 다음까지 기다릴 틱을 돌려줌 */
const BODY: readonly Move[] = [...BODY_MOVES, ...STAFF_MOVES];

/** 무작위로 하나 고르기 (바로 앞과 같은 것은 피함) */
function pick(s: RunState, e: EnemyState, tag: string, n: number, last: number | undefined, ok: (i: number) => boolean): number {
  const rng = sageRng(s, e, tag);
  for (let k = 0; k < 20; k++) {
    const i = rng.int(0, n - 1);
    if (i !== last && ok(i)) return i;
  }
  return (last ?? 0) === 0 ? 1 : 0;
}

export function updateSage(s: RunState, e: EnemyState, toP: readonly [number, number], go: readonly [number, number]): void {
  const g = (e.sage ??= { cx: e.x, cy: e.y, ct: 60, cn: 0, walls: [] });
  walls(s, g);
  updateWaves(s, e);
  // 체력 10%: 근두운에서 내려옴 (무적) → 체력 70%로 강해짐
  if (ultReady(e)) {
    e.ultAt = s.tick;
    delete g.bAct;
    delete g.cAct;
    g.walls = [];
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 40, maxTicks: 24 });
  }
  if (e.ultAt !== undefined) {
    if (s.tick - e.ultAt < R.DISMOUNT) return;
    e.ultAt = undefined;
    e.immune = false;
    g.foot = true;
    g.cx = e.x + 40;
    g.cy = e.y - 30;
    e.hp = Math.round(e.maxHp * R.FOOT_HP);
    e.timer = 40;
    g.ct = 60;
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: 60, maxTicks: 24 });
    return;
  }
  const fast = g.foot ? R.FOOT_FAST : 1;
  // 몸 갈래
  if (g.bAct) {
    if (!bodyTick(s, e)) staffTick(s, e);
  } else {
    keepAway(s, e, toP, go, R.WANT, ENEMIES.sage.speed * (g.foot ? 1 : 1.2));
    e.dirX = toP[0];
    e.dirY = toP[1];
  }
  if (e.timer <= 0 && !g.bAct) {
    // 즉사기(여의봉 최대로)는 드물게: 6번째 공격부터, 지난번 뒤로 12번 넘게 지나야
    const i = pick(s, e, "body", BODY.length, g.lastB, (j) => j !== BODY.length - 1 || (e.count >= 6 && e.count - (g.maxN ?? -99) > 12));
    g.lastB = i;
    if (i === BODY.length - 1) g.maxN = e.count;
    e.count++;
    e.timer = Math.round(BODY[i]!(s, e) + R.BODY_GAP * fast);
  }
  // 근두운 갈래 (타고 있으면 몸도 같이 움직임)
  if (!g.foot) {
    g.cx = e.x;
    g.cy = e.y;
  }
  if (--g.ct <= 0 && !g.cAct) {
    const i = pick(s, e, "cloud", CLOUD_MOVES.length, g.lastC, () => true);
    g.lastC = i;
    g.cn++;
    g.ct = Math.round(CLOUD_MOVES[i]!(s, e) + R.CLOUD_GAP * fast);
  }
  if (g.cAct) cloudTick(s, e);
  if (!g.foot) {
    e.x = g.cx;
    e.y = g.cy;
    keepInRoom(e);
  }
}

/** 여의봉 벽: 지나갈 수 없음 (플레이어를 벽 밖으로 밀어냄), 시간이 지나면 사라짐 */
function walls(s: RunState, g: NonNullable<EnemyState["sage"]>): void {
  g.walls = g.walls.filter((w) => w[4]! > s.tick);
  const p = s.player;
  for (const [x0, y0, x1, y1] of g.walls) {
    const vx = x1! - x0!;
    const vy = y1! - y0!;
    const len2 = vx * vx + vy * vy || 1;
    const t = Math.max(0, Math.min(1, ((p.x - x0!) * vx + (p.y - y0!) * vy) / len2));
    const dx = p.x - (x0! + vx * t);
    const dy = p.y - (y0! + vy * t);
    const d = Math.hypot(dx, dy);
    const min = R.WALL_W + p.r;
    if (d >= min) continue;
    const n = d > 0.01 ? [dx / d, dy / d] : [-vy / Math.sqrt(len2), vx / Math.sqrt(len2)];
    p.x += n[0]! * (min - d);
    p.y += n[1]! * (min - d);
  }
}
