// 나무 베기 (긴급 퀘스트 '나무 조달', 2026-11-15 사용자): 나라 필드에서 장소가 가깝지 않을 때 F → 앞(또는 곁)의 나무를 침 · 3번이면 나무 1개
// 벤 나무는 잠시 그루터기 (지역마다 이 화면에서만 기억, 다시 들어오면 다시 자람) · 나무 칸은 늘 막힌 칸이라 걷기와 상관없음
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { WT } from "./worldTiles";

export const WOOD_RULES = {
  /** 몇 번 쳐야 쓰러지는지 · 다시 자라는 시간(초) · 칠 수 있는 거리(픽셀) · 다시 치기(초) */
  hits: 3,
  regrow: 120,
  reach: 22,
  gap: 0.35,
};

const isTree = (m: WorldMap, cx: number, cy: number) => {
  const t = tileAt(m, cx, cy);
  return t === WT.tree || t === WT.snowPine;
};

export interface Woodcut {
  /** 칠 수 있는 나무 칸 (없으면 null) */
  near: (m: WorldMap, x: number, y: number, fx: number, fy: number) => readonly [number, number] | null;
  /** F: 치기 → "hit" 쳤음 · "got" 나무 얻음 · null 칠 나무 없음 */
  chop: (m: WorldMap, x: number, y: number, fx: number, fy: number, now: number) => "hit" | "got" | null;
  stump: (cx: number, cy: number, now: number) => boolean;
  /** 맞은 나무 흔들림 (칸 → 남은 초) */
  shake: (cx: number, cy: number, now: number) => number;
  /** 위에 겹쳐 그리기: 칠 수 있는 나무 위 '🪓 F' (hint) · 얻은 '+1' 글자 */
  top: (ctx: CanvasRenderingContext2D, m: WorldMap, x: number, y: number, fx: number, fy: number, now: number, hint: boolean) => void;
}

export function createWoodcut(): Woodcut {
  const down = new Map<number, number>();
  const hits = new Map<number, number>();
  const hitAt = new Map<number, number>();
  let last = 0;
  const pops: { x: number; y: number; until: number }[] = [];
  const key = (cx: number, cy: number) => cy * 10000 + cx;
  const stump = (cx: number, cy: number, now: number) => (down.get(key(cx, cy)) ?? 0) > now;
  const near: Woodcut["near"] = (m, x, y, fx, fy) => {
    let best: [number, number] | null = null;
    let bd = WOOD_RULES.reach;
    // 바라보는 쪽을 조금 앞당겨 봄
    const px = x + fx * 6;
    const py = y + fy * 6;
    for (let cy = Math.floor(py / WTILE) - 2; cy <= Math.floor(py / WTILE) + 2; cy++)
      for (let cx = Math.floor(px / WTILE) - 2; cx <= Math.floor(px / WTILE) + 2; cx++) {
        if (!isTree(m, cx, cy) || stump(cx, cy, performance.now())) continue;
        const d = Math.hypot((cx + 0.5) * WTILE - px, (cy + 0.7) * WTILE - py);
        if (d < bd) [best, bd] = [[cx, cy], d];
      }
    return best;
  };
  return {
    near,
    stump,
    shake: (cx, cy, now) => Math.max(0, 0.25 - (now - (hitAt.get(key(cx, cy)) ?? -1e9)) / 1000),
    chop: (m, x, y, fx, fy, now) => {
      if (now - last < WOOD_RULES.gap * 1000) return null;
      const n = near(m, x, y, fx, fy);
      if (!n) return null;
      last = now;
      const k = key(n[0], n[1]);
      hitAt.set(k, now);
      const h = (hits.get(k) ?? 0) + 1;
      if (h < WOOD_RULES.hits) {
        hits.set(k, h);
        return "hit";
      }
      hits.delete(k);
      down.set(k, now + WOOD_RULES.regrow * 1000);
      pops.push({ x: (n[0] + 0.5) * WTILE, y: n[1] * WTILE, until: now + 900 });
      return "got";
    },
    top: (ctx, m, x, y, fx, fy, now, hint) => {
      ctx.font = "bold 7px sans-serif";
      ctx.textAlign = "center";
      const n = hint ? near(m, x, y, fx, fy) : null;
      const text = (s: string, px: number, py: number, c: string) => {
        ctx.fillStyle = "#000";
        ctx.fillText(s, px + 0.5, py + 0.5);
        ctx.fillStyle = c;
        ctx.fillText(s, px, py);
      };
      if (n) text("🪓 F", (n[0] + 0.5) * WTILE, n[1] * WTILE - 6, "#ffe9a8");
      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i]!;
        if (p.until < now) pops.splice(i, 1);
        else text("+1 🪵", p.x, p.y - 8 - (900 - (p.until - now)) / 60, "#c9f08a");
      }
    },
  };
}
