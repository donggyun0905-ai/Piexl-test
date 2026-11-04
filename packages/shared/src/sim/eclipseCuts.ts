// 이클립스 태양 검격 모양 (계산·그리기가 같이 씀): 몸 양옆에서 시작해 앞쪽 꼭짓점으로 모이는 '^' 모양 (사용자 그림 2026-11-05)
// 1 위에서 꺾임(위쪽 날 짧고 아래쪽 날 길게) · 2 가운데에서 꺾여 앞으로 길게 · 3 아래에서 꺾임(아래쪽 날 짧고 위쪽 날 길게)
// · 4 가늘고 길게 찌름 · 5 더 길게 깊게 찌름 (거리는 검격 크기 배율, 앞·옆 — 옆이 음수면 위쪽)

/** [한쪽 끝, 꼭짓점, 다른 쪽 끝] (앞, 옆) */
const SHAPES: readonly (readonly [readonly [number, number], readonly [number, number], readonly [number, number]])[] = [
  [[0.12, -0.8], [1, -0.48], [0.12, 0.98]],
  [[0.1, -0.6], [1.9, 0.05], [0.1, 0.6]],
  [[0.12, -0.98], [1, 0.48], [0.12, 0.8]],
  [[0.1, -0.3], [2.3, 0], [0.1, 0.3]],
  [[0.1, -0.34], [3.1, 0], [0.1, 0.34]],
];

/** i번째 검격(0~4)의 세 점 [한쪽 끝, 꼭짓점, 다른 쪽 끝] · (x,y) 몸 · (fx,fy) 바라보는 쪽 · r 크기 */
export function sunCutPoints(x: number, y: number, fx: number, fy: number, r: number, i: number): [number, number][] {
  const sh = SHAPES[Math.min(SHAPES.length - 1, Math.max(0, i))]!;
  // 왼쪽을 볼 때도 '위쪽'이 화면 위가 되게 옆 방향을 뒤집음
  const up = fx < 0 ? -1 : 1;
  return sh.map(([a, b]) => [x + (fx * a - fy * b * up) * r, y + (fy * a + fx * b * up) * r] as [number, number]);
}
