// 패왕전 성장 대결(쟁탈전·전쟁의 서막) 진영 꾸밈: A 편(왼쪽 아래 집) = 현대 무기 진영(강철 판 바닥·격벽·경고 줄무늬),
// B 편(오른쪽 위 집) = 대정령의 세계수 진영(풀밭·꽃·우거진 숲 벽) · 가운데는 그대로 · 포탑도 진영마다 (강력한 포탑 / 세계수 포탑)
// 화면에 보이는 칸만 그림 (그림 전용이라 무작위 대신 칸마다 정해진 값)
import { PW_ARENAS, pwGrid, spotXY, TILE_SIZE, TILE_WALL, tileAt, type PwArenaId, type PwUnit, type RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;
const T = TILE_SIZE;
const hash = (a: number, b: number) => {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const sides = new Map<PwArenaId, Int8Array>();
/** 칸마다 진영: 0 = A(현대) · 1 = B(세계수) · -1 = 가운데 */
function sideMap(id: PwArenaId): Int8Array | null {
  const a = PW_ARENAS[id];
  if (!a.homes) return null;
  let m = sides.get(id);
  if (m) return m;
  m = new Int8Array(a.cols * a.rows);
  const [ha, hb] = a.homes;
  for (let r = 0; r < a.rows; r++) {
    for (let c = 0; c < a.cols; c++) {
      const da = Math.hypot(c - ha[0], r - ha[1]);
      const db = Math.hypot(c - hb[0], r - hb[1]);
      m[r * a.cols + c] = da < db * 0.78 ? 0 : db < da * 0.78 ? 1 : -1;
    }
  }
  sides.set(id, m);
  return m;
}

/** 진영 바닥·벽 (방 그림 위, 지형 칸은 건너뜀) */
export function drawGrowTheme(ctx: Ctx, s: RunState): void {
  const id = s.pvp?.arena;
  const m = id && sideMap(id);
  if (!id || !m) return;
  const a = PW_ARENAS[id];
  const g = pwGrid(id);
  const tf = ctx.getTransform();
  const x0 = Math.max(0, Math.floor(-tf.e / tf.a / T) - 1);
  const y0 = Math.max(0, Math.floor(-tf.f / tf.d / T) - 1);
  const x1 = Math.min(a.cols, x0 + Math.ceil(ctx.canvas.width / tf.a / T) + 3);
  const y1 = Math.min(a.rows, y0 + Math.ceil(ctx.canvas.height / tf.d / T) + 3);
  const ter = s.terrain;
  const wet = (x: number, y: number) => !!ter && [...ter.water, ...ter.mud, ...ter.lava].some((q) => x >= q[0] && x < q[0] + q[2] && y >= q[1] && y < q[1] + q[3]);
  for (let r = y0; r < y1; r++) {
    for (let c = x0; c < x1; c++) {
      const side = m[r * a.cols + c]!;
      if (side < 0) continue;
      const x = c * T;
      const y = r * T;
      const k = hash(c, r);
      const wall = tileAt(g, c, r) === TILE_WALL;
      if (!wall && wet(x + 8, y + 8)) continue;
      const edge = wall && tileAt(g, c, r + 1) !== TILE_WALL;
      if (side === 0) (wall ? steelWall : steelFloor)(ctx, x, y, c, r, k, edge);
      else (wall ? forestWall : grassFloor)(ctx, x, y, c, r, k, edge);
    }
  }
}

function steelFloor(ctx: Ctx, x: number, y: number, c: number, r: number, k: number): void {
  ctx.fillStyle = (c + r) % 2 ? "#454c5a" : "#4c5462";
  ctx.fillRect(x, y, T, T);
  ctx.fillStyle = "rgba(20, 24, 32, 0.5)";
  if (c % 2 === 0) ctx.fillRect(x, y, 1, T);
  if (r % 2 === 0) ctx.fillRect(x, y, T, 1);
  ctx.fillStyle = "#7a8496";
  if (c % 2 === 0 && r % 2 === 0) {
    ctx.fillRect(x + 2, y + 2, 1, 1);
    ctx.fillRect(x + T - 3, y + 2, 1, 1);
  }
  if (k < 0.012) {
    // 노란 길 표시 화살
    ctx.fillStyle = "#c8a030";
    ctx.fillRect(x + 6, y + 5, 4, 6);
    ctx.fillRect(x + 4, y + 9, 8, 2);
  }
}

function steelWall(ctx: Ctx, x: number, y: number, _c: number, _r: number, k: number, edge: boolean): void {
  ctx.fillStyle = "#2a303c";
  ctx.fillRect(x, y, T, T);
  ctx.fillStyle = "#3a4252";
  ctx.fillRect(x + 1, y + 1, T - 2, T - 2);
  ctx.fillStyle = "#5a6478";
  ctx.fillRect(x + 1, y + 1, T - 2, 1);
  ctx.fillStyle = "#8a94a8";
  ctx.fillRect(x + 3, y + 3, 1, 1);
  ctx.fillRect(x + T - 4, y + 3, 1, 1);
  if (k < 0.12) {
    // 파란 표시등
    ctx.fillStyle = "#5ab0ff";
    ctx.fillRect(x + 7, y + 6, 2, 2);
  }
  if (edge) {
    // 바닥과 닿는 아래 모서리: 노랑·검정 경고 줄무늬
    for (let i = 0; i < T; i += 4) {
      ctx.fillStyle = "#e8b828";
      ctx.fillRect(x + i, y + T - 4, 2, 4);
      ctx.fillStyle = "#1a1a20";
      ctx.fillRect(x + i + 2, y + T - 4, 2, 4);
    }
  }
}

function grassFloor(ctx: Ctx, x: number, y: number, c: number, r: number, k: number): void {
  ctx.fillStyle = (c + r) % 2 ? "#3c6a32" : "#427238";
  ctx.fillRect(x, y, T, T);
  ctx.fillStyle = "#5a8a44";
  ctx.fillRect(x + Math.floor(k * 12), y + 4 + Math.floor(k * 7), 1, 2);
  ctx.fillRect(x + Math.floor(k * 9) + 4, y + 10, 1, 2);
  if (k > 0.9) {
    // 작은 꽃
    ctx.fillStyle = k > 0.95 ? "#ffd0e8" : "#fff27a";
    ctx.fillRect(x + 7, y + 7, 2, 2);
    ctx.fillStyle = "#ff8ac0";
    ctx.fillRect(x + 7, y + 7, 1, 1);
  } else if (k < 0.05) {
    // 세계수 뿌리
    ctx.fillStyle = "#6a4a2a";
    ctx.fillRect(x, y + 8, 10, 2);
    ctx.fillRect(x + 8, y + 9, 6, 2);
  }
}

function forestWall(ctx: Ctx, x: number, y: number, _c: number, _r: number, k: number, edge: boolean): void {
  ctx.fillStyle = "#1a3a1e";
  ctx.fillRect(x, y, T, T);
  const blob = (bx: number, by: number, rr: number, col: string) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x + bx, y + by, rr, 0, Math.PI * 2);
    ctx.fill();
  };
  blob(5 + k * 4, 6, 6, "#245a28");
  blob(11 - k * 3, 9, 5, "#2e6a30");
  blob(8, 4 + k * 3, 3, "#4a8a3a");
  if (k > 0.85) blob(6 + k * 4, 5, 1.2, "#9af07a");
  if (edge) {
    // 아래 모서리: 나무 줄기
    ctx.fillStyle = "#5a3a20";
    ctx.fillRect(x + 6, y + T - 5, 4, 5);
    ctx.fillStyle = "#7a5230";
    ctx.fillRect(x + 6, y + T - 5, 1, 5);
  }
}

/** 포탑: A 편 = 강철 받침·쌍열 포신·파란 감지등 · B 편 = 뿌리 내린 세계수·빛나는 정령 열매 · 포신은 마지막으로 쏜 쪽을 봄 */
export function drawTurret(ctx: Ctx, s: RunState, u: PwUnit): void {
  const { x, y } = u.body;
  const shot = u.shot;
  const fire = !!shot && s.tick - shot.at < 6;
  const [tx, ty] = shot ? [shot.x, shot.y] : spotXY(PW_ARENAS[s.pvp!.arena].homes?.[1 - u.team] ?? [0, 0]);
  const ang = Math.atan2(ty - y, tx - x);
  ctx.save();
  if (u.team === 0) {
    // 받침: 팔각 강철판 + 경고 줄무늬
    ctx.fillStyle = "#1a1e26";
    ctx.fillRect(x - 13, y + 2, 26, 9);
    ctx.fillStyle = "#4a5466";
    ctx.fillRect(x - 12, y + 2, 24, 7);
    for (let i = -12; i < 12; i += 4) {
      ctx.fillStyle = "#e8b828";
      ctx.fillRect(x + i, y + 7, 2, 2);
    }
    // 몸통
    ctx.fillStyle = "#2a303c";
    ctx.fillRect(x - 9, y - 10, 18, 14);
    ctx.fillStyle = "#6a7890";
    ctx.fillRect(x - 8, y - 9, 16, 4);
    ctx.fillStyle = s.tick % 40 < 20 ? "#6ae8ff" : "#2a8ab0";
    ctx.fillRect(x - 2, y - 4, 4, 3);
    // 쌍열 포신
    ctx.translate(x, y - 6);
    ctx.rotate(ang);
    ctx.fillStyle = "#1a1e26";
    ctx.fillRect(2, -4, 15, 3);
    ctx.fillRect(2, 1, 15, 3);
    ctx.fillStyle = "#8a96aa";
    ctx.fillRect(3, -3, 13, 1);
    ctx.fillRect(3, 2, 13, 1);
    if (fire) {
      ctx.fillStyle = "#fff0a0";
      ctx.fillRect(17, -5, 4, 10);
      ctx.fillStyle = "#ff9a3a";
      ctx.fillRect(20, -3, 3, 6);
    }
  } else {
    // 뿌리 · 줄기
    ctx.fillStyle = "#4a301a";
    ctx.fillRect(x - 12, y + 6, 8, 3);
    ctx.fillRect(x + 4, y + 6, 8, 3);
    ctx.fillStyle = "#6a4426";
    ctx.fillRect(x - 4, y - 6, 8, 15);
    ctx.fillStyle = "#8a5a32";
    ctx.fillRect(x - 3, y - 6, 2, 15);
    // 잎 덮개
    const leaf = (lx: number, ly: number, r: number, col: string) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x + lx, y + ly, r, 0, Math.PI * 2);
      ctx.fill();
    };
    leaf(0, -12, 11, "#1e5a26");
    leaf(-6, -14, 7, "#2e7a34");
    leaf(6, -15, 6, "#3a8a3c");
    leaf(0, -18, 5, "#5aa84a");
    // 정령 열매 (쏠 때 밝게) · 가운데 수정 눈
    const glow = fire ? "#eaffc0" : "#9af07a";
    for (const [ox, oy] of [[-7, -10], [7, -11], [0, -19]]) leaf(ox!, oy!, 1.8, glow);
    ctx.translate(x, y - 12);
    ctx.rotate(ang);
    ctx.fillStyle = "#c8f0ff";
    ctx.fillRect(2, -2, 4, 4);
    ctx.fillStyle = fire ? "#ffffff" : "#6ae8ff";
    ctx.fillRect(3, -1, 2, 2);
  }
  ctx.restore();
}
