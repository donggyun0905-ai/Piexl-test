// 이클립스 태양 검격 모양 (계산·그리기가 같이 씀, 사용자 시안 2026-11-05)
// 1~3타: 불꽃 도끼 궤적 — 몸 앞을 크게 휘두르는 호, 가는 꼬리 조금 앞에서 몸 쪽으로 살짝 꺾임, 휘두른 끝이 도끼 머리
//   1 위 → 아래 · 2 아래 → 위 · 3 옆으로 크게 · 4타: 앞에서 X자로 엇갈리는 두 도끼 궤적 · 5타: 앞으로 내리찍어 태양 낙인이 터짐
// 거리는 검격 크기 배율 (앞·옆 — 옆이 음수면 위쪽, 왼쪽을 볼 때도 화면 위가 위) · 각도 계산은 orbit.rot (기기마다 같은 결과)
import { rot } from "./orbit";

/** 1~3타 호: [꼬리 쪽 각, 머리 쪽 각(라디안, 바라보는 쪽 기준)] · 반지름 · 옆으로 눌림 */
const ARCS: readonly (readonly [number, number, number])[] = [
  [-1.5, 1.1, 0.75],
  [1.5, -1.1, 0.75],
  [-2, 1.9, 0.85],
];
const SQUASH = 0.8;
/** 꼬리 꺾임: 호의 이 비율에서 꺾임 · 꺾인 꼬리 길이(반지름 배율) · 몸 쪽으로 꺾는 각 */
const HOOK_AT = 0.16;
const HOOK_LEN = 0.3;
const HOOK_TURN = 0.6;
/** 4타 X자 두 날: [꼬리, 머리] (앞, 옆) · 바깥으로 휘는 정도 */
const CROSS: readonly (readonly [Pt, Pt])[] = [
  [[0.35, -0.75], [1.65, 0.7]],
  [[0.35, 0.75], [1.65, -0.7]],
];
const BOW = 0.08;
/** 5타 내리찍는 자리(앞) · 길 끝 태양 낙인 반지름 (크기 배율, 타마다) */
const STAMP_AT = 1.15;
export const SUN_BURST = [0, 0, 0, 0, 0.72];

/** 한 점 (앞 a, 옆 b) → 화면 자리 */
type Pt = [number, number];

/**
 * i번째 검격(0~4)의 날 길들: 날마다 꼬리(가는 끝)부터 머리(도끼 머리)까지 점들 · (x,y) 몸 · (fx,fy) 바라보는 쪽 · r 크기
 * 5타는 몸 → 내리찍는 자리 한 줄 (끝에서 SUN_BURST 반지름으로 터짐)
 */
export function sunCutPaths(x: number, y: number, fx: number, fy: number, r: number, i: number): Pt[][] {
  const up = fx < 0 ? -1 : 1;
  const at = ([a, b]: Pt): Pt => [x + (fx * a - fy * b * up) * r, y + (fy * a + fx * b * up) * r];
  if (i >= 4) return [[at([0.15, 0]), at([STAMP_AT, 0])]];
  if (i === 3) return CROSS.map(([p0, p1]) => bow(p0, p1).map(at));
  return [arcPath(i).map(at)];
}

/** 두 점 사이를 바깥(앞)으로 살짝 휜 길 */
function bow(p0: Pt, p1: Pt): Pt[] {
  const [dx, dy] = [p1[0] - p0[0], p1[1] - p0[1]];
  const [nx, ny] = dy > 0 ? [dy, -dx] : [-dy, dx];
  const out: Pt[] = [];
  for (let k = 0; k <= 12; k++) {
    const t = k / 12;
    const b = 4 * t * (1 - t) * BOW;
    out.push([p0[0] + dx * t + nx * b, p0[1] + dy * t + ny * b]);
  }
  return out;
}

/** 1~3타 도끼 궤적 (몸 기준 앞·옆) */
function arcPath(i: number): Pt[] {
  const [t0, t1, R] = ARCS[Math.max(0, i)]!;
  const on = (t: number): Pt => {
    const [c0, s0] = rot(t);
    return [c0 * R, s0 * R * SQUASH];
  };
  const tc = t0 + (t1 - t0) * HOOK_AT;
  const c = on(tc);
  // 꼬리: 꺾이는 점에서 호를 거슬러 가는 쪽을 몸 쪽으로 HOOK_TURN만큼 돌린 방향
  const back = on(tc - (t1 - t0) * 0.02);
  let dx = back[0] - c[0];
  let dy = back[1] - c[1];
  const l = Math.hypot(dx, dy) || 1;
  [dx, dy] = [dx / l, dy / l];
  // 두 쪽으로 돌려 보고 몸(가운데) 쪽에 더 가까운 쪽을 고름
  const [cs, sn] = rot(HOOK_TURN);
  const turn = (k: number): Pt => [dx * cs - dy * sn * k, dx * sn * k + dy * cs];
  const [ta, tb] = [turn(1), turn(-1)];
  const [tx, ty] = ta[0] * -c[0] + ta[1] * -c[1] > tb[0] * -c[0] + tb[1] * -c[1] ? ta : tb;
  const tail: Pt = [c[0] + tx * R * HOOK_LEN, c[1] + ty * R * HOOK_LEN];
  const pts: Pt[] = [tail, c];
  for (let k = 1; k <= 16; k++) pts.push(on(tc + ((t1 - tc) * k) / 16));
  return pts;
}
