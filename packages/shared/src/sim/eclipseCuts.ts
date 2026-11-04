// 이클립스 태양 검격 모양 (계산·그리기가 같이 씀, 사용자 시안 2026-11-05)
// 1~3타: 불꽃 도끼 궤적 — 몸 앞을 크게 휘두르는 호, 가는 꼬리 조금 앞에서 몸 쪽으로 살짝 꺾임, 휘두른 끝이 도끼 머리
//   1 위 → 아래 · 2 아래 → 위 · 3 옆으로 크게 · 4·5타: 가늘고 길게 찌르고 끝에서 작은 태양이 터짐
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
/** 4·5타 찌르기 길이 · 끝 태양 터짐 반지름 (크기 배율) */
const STAB = [2.3, 3.1];
export const SUN_BURST = [0, 0, 0, 0.32, 0.42];

/** 한 점 (앞 a, 옆 b) → 화면 자리 */
type Pt = [number, number];

/** i번째 검격(0~4)의 길: 꼬리(가는 끝)부터 머리(도끼 머리·찌른 끝)까지 점들 · (x,y) 몸 · (fx,fy) 바라보는 쪽 · r 크기 */
export function sunCutPath(x: number, y: number, fx: number, fy: number, r: number, i: number): Pt[] {
  const up = fx < 0 ? -1 : 1;
  const at = ([a, b]: Pt): Pt => [x + (fx * a - fy * b * up) * r, y + (fy * a + fx * b * up) * r];
  if (i >= 3) return [at([0.15, 0]), at([STAB[Math.min(1, i - 3)]!, 0])];
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
  return pts.map(at);
}
