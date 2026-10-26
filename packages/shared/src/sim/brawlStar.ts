// 쌍광연격 찌르기: 3타 관통 돌진(내 공격 범위 끝까지) · 5번 연속 콤보를 마치면 공격 범위 원 위 다섯 점을 찌르기로 이어 별을 그림 (공격 범위가 넓을수록 큼)
import type { ComboMove } from "../combos";
import { hit, lunge, nearest, STOP_GAP } from "./brawlMoves";
import { segDist2 } from "./orbit";
import type { RunState } from "./types";
import { addEffect, dist2, normalize } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  STAR_GAP: 5,
};
export { R as BRAWL_STAR_RULES };

/** 별: 몇 번째 연속 콤보마다 · 찌르기 사이 틱 · 다섯 점을 잇는 차례 (꼭짓점 하나 건너뛰며) */
export const STAR_RUNS = 5;
const STAR_ORDER = [2, 4, 1, 3, 0];
/** 72도씩 돌리는 [cos, sin] (삼각함수 없이 정해 둔 값) */
const TURN72: readonly [number, number] = [0.30901699, 0.95105652];

/** 관통 돌진: 가까운 적 쪽으로(없으면 바라보는 쪽) 꿰뚫고 내 공격 범위(능력치) 끝까지 나감 (적이 그보다 멀면 적 바로 뒤까지), 지나간 자리의 적 모두 맞음.
 * 공격 범위가 넓어질수록 찌르기·별이 커짐 */
export function pierce(s: RunState, dmg: number, m: ComboMove): void {
  const p = s.player;
  const t = nearest(s, m.range);
  const dir: [number, number] = t ? (normalize(t.x - p.x, t.y - p.y) ?? [p.faceX, p.faceY]) : [p.faceX, p.faceY];
  const reach = p.stats.range;
  const through = t ? Math.sqrt(dist2(t, p)) + t.r + p.r + STOP_GAP : 0;
  p.starCx = p.x;
  p.starCy = p.y;
  p.starDx = dir[0] * reach;
  p.starDy = dir[1] * reach;
  stab(s, dmg, m, dir, Math.min(m.dash ?? m.range, Math.max(reach, through)));
}

/** 한 줄 찌르기 돌진: dir 쪽으로 dist만큼 나가며 지나간 자리의 적 모두 맞음 */
export function stab(s: RunState, dmg: number, m: ComboMove, dir: readonly [number, number], dist: number): void {
  const p = s.player;
  const x0 = p.x;
  const y0 = p.y;
  p.faceX = dir[0];
  p.faceY = dir[1];
  lunge(s, dist, dir[0], dir[1]);
  for (const e of s.enemies) {
    const rr = e.r + p.r + STOP_GAP;
    if (e.hp > 0 && segDist2(e, { x: x0, y: y0 }, p) < rr * rr) hit(s, e, dmg, m, dir[0], dir[1]);
  }
  addEffect(s, { kind: "stab", x: x0, y: y0, dirX: dir[0], dirY: dir[1], size: dist, maxTicks: 12, toX: p.x, toY: p.y, width: 3 });
}

/** 별 그리기 시작: 방금 찌른 원(시작 자리 둘레, 반지름 = 공격 범위) 위 다섯 점을 차례로 (찌른 방향의 점이 첫 점) */
export function startStar(s: RunState, dmg: number): void {
  const p = s.player;
  if (p.starCx === undefined) return;
  p.starLeft = STAR_ORDER.length;
  p.starTimer = R.STAR_GAP;
  p.starDmg = dmg;
}

/** 원 위 k번째 점 (첫 점에서 72도씩) */
function corner(p: RunState["player"], k: number): [number, number] {
  let x = p.starDx ?? 0;
  let y = p.starDy ?? 0;
  for (let i = 0; i < k; i++) [x, y] = [x * TURN72[0] - y * TURN72[1], x * TURN72[1] + y * TURN72[0]];
  return [(p.starCx ?? 0) + x, (p.starCy ?? 0) + y];
}

/** 틱마다 (별을 그리는 중이면 true: 그동안 다른 기술 없음, 무적) */
export function starTick(s: RunState, m: ComboMove): boolean {
  const p = s.player;
  if ((p.starLeft ?? 0) <= 0) return false;
  p.invulnTicks = Math.max(p.invulnTicks, 2);
  if ((p.starTimer = (p.starTimer ?? 0) - 1) > 0) return true;
  const k = STAR_ORDER[STAR_ORDER.length - (p.starLeft ?? 0)]!;
  const [tx, ty] = corner(p, k);
  const dir = normalize(tx - p.x, ty - p.y) ?? [p.faceX, p.faceY];
  stab(s, p.starDmg ?? 0, m, dir, Math.hypot(tx - p.x, ty - p.y));
  p.starLeft = (p.starLeft ?? 0) - 1;
  p.starTimer = R.STAR_GAP;
  return true;
}
