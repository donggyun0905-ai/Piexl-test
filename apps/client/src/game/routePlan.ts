// 미리 정한 길 (Tab 큰 지도에서 방을 눌러 정함): 파란 테두리 · 싸운 방을 정리하면 다음 방 출구로 알아서 걸어감
// 걷기는 입력(moveX·moveY)으로만 만들어 시드 결정성·기록 다시 돌리기가 그대로 (게임 계산은 바꾸지 않음)
import { distanceField, EXIT_X, ROOM_MIN_Y, roomGrid, walkToward, type RunState, type TickInput } from "@pixel-rogue/shared";
import { drawMinimap } from "./minimap";

/** 이 층에서 정한 길 (방 번호 차례) */
let plan: number[] = [];
let planKey = "";
/** 방을 정리한 뒤 걷기 시작까지 틱 (보상 볼 틈) · 정리된 걸 처음 본 틱 */
const WAIT = 40;
let clearedAt = -1;
let clearedRoom = -1;

/** 지금 정한 길 (층이 바뀌면 비움 · 이미 들어간 방은 뺌) */
export function routePlan(s: RunState): number[] {
  const key = `${s.seed}/${s.floor}`;
  if (key !== planKey) {
    planKey = key;
    plan = [];
  }
  const at = plan.indexOf(s.roomId);
  if (at >= 0) plan = plan.slice(at + 1);
  return plan;
}

/** 이 방을 길에 넣을 수 있는지: 길 끝 방(없으면 지금 방)에서 출구로 바로 이어진 방만 */
export function canPlan(s: RunState, id: number): boolean {
  const p = routePlan(s);
  const from = p.length ? p[p.length - 1]! : s.roomId;
  return s.map.rooms[from]?.exits.includes(id) ?? false;
}

/** 방 누름: 이어진 방이면 길 끝에 붙임 · 이미 길에 있는 방이면 거기부터 뒤를 지움. 바뀌었으면 true */
export function pickRoute(s: RunState, id: number): boolean {
  const p = routePlan(s);
  const at = p.indexOf(id);
  if (at >= 0) {
    plan = p.slice(0, at);
    return true;
  }
  if (!canPlan(s, id)) return false;
  plan = [...p, id];
  return true;
}

/** 싸움이 있던 방 (보스방·상점·쉼터 등은 알아서 걷지 않음) */
const fightRoom = (s: RunState) => {
  const t = s.map.rooms[s.roomId]?.type;
  return t === "combat" || t === "elite";
};

/** 입력 다듬기 (gameLoop): 길이 있고, 싸운 방을 정리했고, 직접 움직이지 않으면 다음 방 출구 쪽으로 걸음 */
export function autoRoute(s: RunState, input: TickInput): TickInput {
  const p = routePlan(s);
  if (!p.length || s.party || s.pvp || s.swarm || !fightRoom(s) || !s.rooms[s.roomId]?.cleared) return input;
  if (clearedRoom !== s.roomId) {
    clearedRoom = s.roomId;
    clearedAt = s.tick;
  }
  // 직접 움직이거나 대시하면 그 틱은 내 입력대로 · 고를 패시브가 바닥에 있으면 기다림
  if (input.moveX || input.moveY || input.dash || s.tick - clearedAt < WAIT) return input;
  if (s.rooms[s.roomId]!.pickups.some((k) => k.kind === "passive" && k.group)) return input;
  const lane = s.map.rooms[s.roomId]!.exits.indexOf(p[0]!);
  if (lane < 0) {
    plan = [];
    return input;
  }
  const me = s.player;
  const tx = EXIT_X[lane]!;
  const ty = ROOM_MIN_Y;
  const g = roomGrid(s);
  const dir = g ? walkToward(g, distanceField(g, tx, ty + 8), me, tx, ty) : null;
  const dx = dir ? dir[0] : tx - me.x;
  const dy = dir ? dir[1] : ty - me.y;
  const len = Math.hypot(dx, dy) || 1;
  // 출구 앞에서는 위로 밀어 나감
  const near = Math.abs(me.x - tx) < 4 && me.y < ty + 24;
  return { ...input, moveX: near ? 0 : Math.round((dx / len) * 100), moveY: near ? -100 : Math.round((dy / len) * 100) };
}

/** 노선도 창마다 마지막으로 그린 상태 */
const shown = new WeakMap<CanvasRenderingContext2D, string>();
/** 노선도는 방이 바뀌거나 정리됐을 때·정한 길이 바뀌었을 때만 다시 그림 (튜토리얼은 출구가 열리기도 함, gameLoop) */
export function redrawMini(ctx: CanvasRenderingContext2D, s: RunState): void {
  const exits = s.map.rooms[s.roomId]?.exits;
  const key = `${s.floor}/${s.roomId}/${s.rooms[s.roomId]?.cleared}/${exits ? exits.join() : ""}/${routePlan(s)}`;
  if (shown.get(ctx) === key) return;
  shown.set(ctx, key);
  drawMinimap(ctx, s, routePlan(s));
}
