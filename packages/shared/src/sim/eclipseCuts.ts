// 이클립스 태양 직각 검격 모양 (계산·그리기가 같이 씀): 꺾이는 점 하나 + 두 팔 (바라보는 쪽 기준, 거리는 검격 반지름 배율)
// 1 위에서 꺾임(위 팔 짧고 아래 팔 긺) · 2 가운데서 꺾인 > · 3 아래에서 꺾임(위 팔 길고 아래 팔 짧음) · 4 앞으로 깊게 찌르는 가는 > (꺾이는 점은 모두 앞으로 길게) · 5타는 4타와 같음
import { rot } from "./orbit";

/** 꺾이는 점(앞·옆) · 두 팔 방향(뒤쪽 기준 도, 위 팔·아래 팔) · 두 팔 길이 */
const SHAPES: readonly { v: readonly [number, number]; d: readonly [number, number]; l: readonly [number, number] }[] = [
  { v: [1.9, -0.45], d: [190, 100], l: [0.9, 1.9] },
  { v: [2.1, 0], d: [225, 135], l: [1.6, 1.6] },
  { v: [1.9, 0.45], d: [260, 170], l: [1.9, 0.9] },
  { v: [2.8, 0], d: [200, 160], l: [2.4, 2.4] },
];
const DEG = Math.PI / 180;

/** i번째 검격(0~3)의 세 점 [위 팔 끝, 꺾이는 점, 아래 팔 끝] · (x,y) 몸 · (fx,fy) 바라보는 쪽 · r 반지름 */
export function sunCutPoints(x: number, y: number, fx: number, fy: number, r: number, i: number): [number, number][] {
  const sh = SHAPES[Math.min(SHAPES.length - 1, Math.max(0, i))]!;
  const at = (a: number, b: number): [number, number] => [x + (fx * a - fy * b) * r, y + (fy * a + fx * b) * r];
  const v = at(sh.v[0], sh.v[1]);
  const arm = (deg: number, len: number): [number, number] => {
    const [c, s] = rot(deg * DEG);
    return at(sh.v[0] + c * len, sh.v[1] + s * len);
  };
  return [arm(sh.d[0], sh.l[0]), v, arm(sh.d[1], sh.l[1])];
}

