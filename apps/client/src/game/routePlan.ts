// 미리 정한 길 (Tab 큰 지도에서 방을 눌러 정함): 파란 테두리 · 방을 정리하면 "다음 방으로 이동할까요?" 안내 → F를 누르면 "이동합니다" + 귀환 빛기둥 뒤 다음 방으로
// 이동은 입력(menu ROUTE_OP)으로만 보내 시드 결정성·기록 다시 돌리기가 그대로 (sim/routeGo)
import { menuCode, ROUTE_OP, type RunState, type TickInput } from "@pixel-rogue/shared";
import { drawMinimap } from "./minimap";

/** 이 층에서 정한 길 (방 번호 차례) */
let plan: number[] = [];
let planKey = "";

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

/** 큰 지도 창이 열려 있는지 */
let mapOpen = false;

/** 큰 지도 창 열고 닫음 (RouteMap) */
export function setRouteMapOpen(_s: RunState | null, open: boolean): void {
  mapOpen = open;
}

/** "다음 방으로 이동할까요?" 를 띄울 때: 정한 길이 있고 · 지도 창이 닫혔고 · 방이 정리돼 싸우는 적이 없고 · 이동 중이 아니고
 *  · 아이템·작업대·계단 등 다른 F 안내가 없을 때 (아이템을 줍거나 싸우는 동안은 방해하지 않음) */
export function routeAsk(s: RunState): boolean {
  if (!routePlan(s).length || mapOpen || s.party || s.pvp || s.swarm || s.player.routeGo) return false;
  if (!s.rooms[s.roomId]?.cleared || s.enemies.some((e) => e.hp > 0)) return false;
  return s.prompt.kind === "none";
}

/** 입력 다듬기 (gameLoop): 안내가 떠 있을 때 F를 누르면 다음 방으로 가기를 보냄 (sim/routeGo: 이동합니다 · 귀환 빛기둥 1.5초 뒤 이동, 움직이면 취소) */
export function autoRoute(s: RunState, input: TickInput): TickInput {
  if (!input.interact || input.menu || !routeAsk(s)) return input;
  const lane = s.map.rooms[s.roomId]!.exits.indexOf(routePlan(s)[0]!);
  if (lane < 0) {
    plan = [];
    return input;
  }
  return { ...input, interact: false, menu: menuCode(ROUTE_OP, lane) };
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
