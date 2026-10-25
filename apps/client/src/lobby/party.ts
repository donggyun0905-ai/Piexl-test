// 파티 꾸밈: 바닥을 도는 무대 조명 · 위 벽 깃발 줄 · 구석 풍선 · 천천히 떨어지는 색종이 · 가운데 미러볼
import { LOBBY_H, LOBBY_W, TILE, WALL_TOP } from "./lobbyMap";
import { ell, r } from "./lobbyItems";

type Ctx = CanvasRenderingContext2D;
const COLORS = ["#ff5a8a", "#ffd040", "#5ad0ff", "#7aff8a", "#c88aff", "#ff9a3a"];

/** 바닥 조명 (꾸밈·사람보다 먼저) */
export function drawFloorLights(ctx: Ctx, t: number): void {
  ctx.save();
  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 4; i++) {
    const a = t * 0.5 + (i * Math.PI) / 2;
    const x = LOBBY_W / 2 + Math.cos(a) * 90;
    const y = LOBBY_H / 2 + 20 + Math.sin(a * 1.3) * 40;
    ell(ctx, x, y, 22, 10, COLORS[(i + Math.floor(t / 2)) % COLORS.length]!);
  }
  ctx.restore();
}

function balloon(ctx: Ctx, x: number, y: number, c: string, t: number): void {
  const b = Math.round(Math.sin(t * 1.5 + x) * 1.5);
  for (let i = 0; i < 10; i++) r(ctx, x + Math.round(Math.sin(i / 2 + t) * 0.6), y + 5 + b + i, 1, 1, "#d8d8e0");
  ell(ctx, x, y + b, 3, 4, c);
  r(ctx, x - 1, y - 2 + b, 1, 1, "#ffffff");
  r(ctx, x, y + 4 + b, 1, 1, c);
}

/** 위 벽 깃발 줄 · 풍선 · 색종이 · 미러볼 (맨 위에) */
export function drawPartyTop(ctx: Ctx, t: number): void {
  // 깃발 줄 두 줄 (늘어진 곡선)
  for (const [y0, sag] of [[6, 6], [14, 5]] as const) {
    for (let x = TILE; x < LOBBY_W - TILE; x += 6) {
      const k = ((x - TILE) % 84) / 84;
      const y = y0 + Math.round(Math.sin(k * Math.PI) * sag);
      r(ctx, x, y, 6, 1, "#f4f0e8");
      const c = COLORS[(x / 6 + y0) % COLORS.length]!;
      r(ctx, x + 1, y + 1, 4, 2, c);
      r(ctx, x + 2, y + 3, 2, 1, c);
    }
  }
  // 구석 풍선 묶음
  for (const [bx, by] of [[22, 44], [LOBBY_W - 24, 44], [24, LOBBY_H - 34], [LOBBY_W - 26, LOBBY_H - 40]] as const) {
    balloon(ctx, bx - 4, by, COLORS[0]!, t);
    balloon(ctx, bx + 3, by - 3, COLORS[2]!, t + 1);
    balloon(ctx, bx, by - 7, COLORS[1]!, t + 2);
  }
  // 미러볼 (위 가운데, 반짝임)
  const mx = LOBBY_W / 2;
  r(ctx, mx, WALL_TOP - 12, 1, 6, "#c8c8d0");
  ell(ctx, mx, WALL_TOP - 3, 4, 4, "#c8d0e0");
  for (let i = 0; i < 3; i++) r(ctx, mx - 2 + ((i * 2 + Math.floor(t * 4)) % 5), WALL_TOP - 5 + i, 1, 1, "#ffffff");
  // 색종이: 위에서 천천히 흔들리며 떨어짐
  for (let i = 0; i < 40; i++) {
    const speed = 8 + (i % 5) * 3;
    const y = ((t * speed + i * 37) % (LOBBY_H - WALL_TOP)) + WALL_TOP;
    const x = ((i * 53) % (LOBBY_W - 2 * TILE)) + TILE + Math.sin(t * 2 + i) * 4;
    r(ctx, x, y, (i + Math.floor(t * 4)) % 3 === 0 ? 1 : 2, 1, COLORS[i % COLORS.length]!);
  }
}
