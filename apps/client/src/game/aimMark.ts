// 바라보는 방향 표시: 발밑 둘레(위에서 본 납작한 원)에 방향을 가리키는 작은 도트 화살촉.
// 다른 그림처럼 게임 픽셀 단위로 칸을 채워서 그림 (8방향)

/** 오른쪽을 가리키는 모양 (1 = 칠함) */
const RIGHT = ["100", "110", "111", "110", "100"];
/** 오른쪽 아래를 가리키는 모양 */
const DOWN_RIGHT = ["0001", "0011", "0111", "1111"];

type Cells = [number, number][];

function cellsOf(rows: string[]): Cells {
  const out: Cells = [];
  rows.forEach((row, y) => [...row].forEach((c, x) => c === "1" && out.push([x, y])));
  return out;
}

const BASE_RIGHT = cellsOf(RIGHT);
const BASE_DIAG = cellsOf(DOWN_RIGHT);

/** 8방향 모양: 가운데를 (0,0)으로 옮기고 뒤집기·바꾸기로 만듦 */
function shapeFor(dx: number, dy: number): Cells {
  const diag = dx !== 0 && dy !== 0;
  const base = diag ? BASE_DIAG : BASE_RIGHT;
  const w = diag ? 4 : 3;
  const h = diag ? 4 : 5;
  return base.map(([x, y]) => {
    let cx = x - Math.floor(w / 2);
    let cy = y - Math.floor(h / 2);
    if (!diag && dx === 0) [cx, cy] = [cy, cx]; // 위·아래: 가로세로 바꿈
    if (dx < 0) cx = -cx;
    if (dy < 0) cy = -cy;
    return [cx, cy];
  });
}

const SHAPES = new Map<string, Cells>();
for (const [dx, dy] of [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const) {
  SHAPES.set(`${dx},${dy}`, shapeFor(dx, dy));
}

export function drawAimMark(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, faceX: number, faceY: number): void {
  // 가까운 8방향으로 맞춤
  const a = Math.round(Math.atan2(faceY, faceX) / (Math.PI / 4));
  const dx = Math.round(Math.cos((a * Math.PI) / 4));
  const dy = Math.round(Math.sin((a * Math.PI) / 4));
  const cells = SHAPES.get(`${dx},${dy}`);
  if (!cells) return;
  const cx = Math.round(x + faceX * (r + 6));
  const cy = Math.round(y + r - 1 + faceY * (r + 2));
  // 어두운 테두리 1칸 → 크림색 몸통
  ctx.fillStyle = "#1a1424";
  for (const [px, py] of cells) ctx.fillRect(cx + px - 1, cy + py - 1, 3, 3);
  ctx.fillStyle = "#ffecbe";
  for (const [px, py] of cells) ctx.fillRect(cx + px, cy + py, 1, 1);
}

// 맞는 범위 표시: 캐릭터 그림이 실제 몸(원)보다 커서, 그림 위에 몸 둘레를 도트 고리로 겹쳐 그림
const ringCache = new Map<number, Cells>();

export function ringCells(r: number): Cells {
  let cells = ringCache.get(r);
  if (!cells) {
    cells = [];
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(Math.hypot(dx + 0.5, dy + 0.5) - r) < 0.5) cells.push([dx, dy]);
      }
    }
    ringCache.set(r, cells);
  }
  return cells;
}

export function drawHitRing(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  const cx = Math.round(x);
  const cy = Math.round(y);
  const cells = ringCells(r);
  // 어두운 테두리 → 밝은 고리 (그림 색과 섞이지 않게)
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#1a1424";
  for (const [px, py] of ringCells(r + 1)) ctx.fillRect(cx + px, cy + py, 1, 1);
  for (const [px, py] of ringCells(r - 1)) ctx.fillRect(cx + px, cy + py, 1, 1);
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "#ffecbe";
  for (const [px, py] of cells) ctx.fillRect(cx + px, cy + py, 1, 1);
  ctx.globalAlpha = 1;
}
