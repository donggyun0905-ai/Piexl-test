// 퀘스트 목적지까지 자동 걷기 (화면 전용): 칸 단위 너비 우선 찾기 → 갈 칸 목록 · 목적지 칸이 건물·막힌 칸이어도 2칸 안까지 가면 도착
import type { Walker } from "../lobby/walker";
import { WTILE, type WorldMap } from "./worldMap";
import type { Place } from "./worldPlaces";

/** 칸 가운데에 설 수 있는지 (WorldStage의 stand를 칸 가운데로) */
type StandTile = (tx: number, ty: number) => boolean;

/** 내 칸 → 목적지 근처 칸까지 칸 가운데(픽셀) 목록 · 못 찾으면 null · 너무 멀면(칸 limit개 넘게 찾음) null */
export function findPath(cols: number, rows: number, stand: StandTile, from: readonly [number, number], goal: readonly [number, number], limit = 60000): [number, number][] | null {
  const [sx, sy] = from;
  const [gx, gy] = goal;
  const near = (x: number, y: number) => Math.abs(x - gx) + Math.abs(y - gy) <= 2;
  const prev = new Int32Array(cols * rows).fill(-1);
  const start = sy * cols + sx;
  prev[start] = start;
  const queue = [start];
  for (let q = 0; q < queue.length && q < limit; q++) {
    const i = queue[q]!;
    const x = i % cols;
    const y = (i - x) / cols;
    if (near(x, y)) {
      const out: [number, number][] = [];
      for (let k = i; k !== start; k = prev[k]!) out.push([((k % cols) + 0.5) * WTILE, (Math.floor(k / cols) + 0.5) * WTILE]);
      return out.reverse();
    }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const j = ny * cols + nx;
      if (prev[j] !== -1 || !stand(nx, ny)) continue;
      prev[j] = i;
      queue.push(j);
    }
  }
  return null;
}

/** 꺾이지 않는 칸은 건너뜀 (같은 방향이 이어지면 마지막 칸만) */
export function simplify(path: [number, number][], from: readonly [number, number]): [number, number][] {
  const out: [number, number][] = [];
  let [px, py] = from;
  for (let k = 0; k < path.length; k++) {
    const [x, y] = path[k]!;
    const nxt = path[k + 1];
    if (nxt && Math.sign(nxt[0] - x) === Math.sign(x - px) && Math.sign(nxt[1] - y) === Math.sign(y - py)) {
      [px, py] = [x, y];
      continue;
    }
    out.push([x, y]);
    [px, py] = [x, y];
  }
  return out;
}

export type AutoState = "go" | "done" | "stop" | "fail";

/** WorldStage가 쓰는 자동 걷기: start로 길을 찾고, 매 장면 step으로 다음 칸 (이동 키를 누르면 walker가 tx를 지워 멈춤) */
export function createAutoWalk() {
  let route: [number, number][] = [];
  return {
    start(m: WorldMap, stand: (x: number, y: number) => boolean, me: Walker, goal: Place | undefined): AutoState {
      const path = goal && findPath(m.cols, m.rows, (tx, ty) => stand((tx + 0.5) * WTILE, (ty + 0.5) * WTILE), [Math.floor(me.x / WTILE), Math.floor(me.y / WTILE)], [goal.tx, goal.ty]);
      route = path ? simplify(path, [me.x, me.y]) : [];
      if (route[0]) [me.tx, me.ty] = route[0];
      return path ? (route.length ? "go" : "done") : "fail";
    },
    /** 끝났으면 done(닿음)·stop(멈춤) · 아직이면 null */
    step(me: Walker): AutoState | null {
      if (!route.length || me.tx >= 0) return null;
      const reached = Math.hypot(me.x - route[0]![0], me.y - route[0]![1]) < 4;
      if (reached) route.shift();
      else route = [];
      if (route[0]) [me.tx, me.ty] = route[0];
      return route.length ? null : reached ? "done" : "stop";
    },
  };
}
