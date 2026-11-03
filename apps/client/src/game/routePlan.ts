// 미리 정한 길 (Tab 큰 지도에서 방을 눌러 정함): 파란 테두리 · 지도 창을 닫거나 싸운 방을 정리하면 "이동합니다" + 귀환 빛기둥 뒤 다음 방으로
// 이동은 입력(menu ROUTE_OP)으로만 보내 시드 결정성·기록 다시 돌리기가 그대로 (sim/routeGo)
import { menuCode, ROUTE_OP, type RunState, type TickInput } from "@pixel-rogue/shared";
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

/** 싸움이 있던 방 (보스방·상점·쉼터 등은 지도 창을 닫을 때만 감) */
const fightRoom = (s: RunState) => {
  const t = s.map.rooms[s.roomId]?.type;
  return t === "combat" || t === "elite";
};

/** 큰 지도 창이 열려 있는지 · 창을 닫은 방 (그 방에서는 바로 감) · 이동을 이미 보낸 방 (움직여 취소하면 창을 다시 닫을 때까지 안 보냄) */
let mapOpen = false;
let armKey = "";
let sentKey = "";
const roomKey = (s: RunState) => `${s.seed}/${s.floor}/${s.roomId}`;

/** 큰 지도 창 열고 닫음 (RouteMap): 닫으면 지금 방에서 바로 갈 수 있게 */
export function setRouteMapOpen(s: RunState | null, open: boolean): void {
  mapOpen = open;
  if (!open && s) {
    armKey = roomKey(s);
    sentKey = "";
  }
}

/** 입력 다듬기 (gameLoop): 길이 있고 방이 정리됐고 지도 창이 닫혀 있으면, 다음 방으로 가기를 보냄 (sim/routeGo: 이동합니다 · 귀환 빛기둥 1.5초 뒤 이동) */
export function autoRoute(s: RunState, input: TickInput): TickInput {
  const p = routePlan(s);
  if (!p.length || mapOpen || s.party || s.pvp || s.swarm || !s.rooms[s.roomId]?.cleared || s.player.routeGo || input.menu) return input;
  const key = roomKey(s);
  if (clearedRoom !== s.roomId) {
    clearedRoom = s.roomId;
    clearedAt = s.tick;
  }
  // 싸운 방은 정리 뒤 잠깐(보상 볼 틈) · 다른 방은 지도 창을 닫았을 때만 · 고를 패시브가 바닥에 있으면 기다림
  if (sentKey === key || (armKey !== key && (!fightRoom(s) || s.tick - clearedAt < WAIT))) return input;
  if (s.rooms[s.roomId]!.pickups.some((k) => k.kind === "passive" && k.group)) return input;
  const lane = s.map.rooms[s.roomId]!.exits.indexOf(p[0]!);
  if (lane < 0) {
    plan = [];
    return input;
  }
  sentKey = key;
  return { ...input, menu: menuCode(ROUTE_OP, lane) };
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
