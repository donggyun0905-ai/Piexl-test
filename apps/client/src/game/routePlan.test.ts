import { describe, expect, it } from "vitest";
import { createRun, EMPTY_INPUT, stepSim } from "@pixel-rogue/shared";
import { autoRoute, canPlan, pickRoute, routePlan, setRouteMapOpen } from "./routePlan";

describe("미리 정한 길", () => {
  it("지금 방·길 끝 방에서 이어진 방만 고를 수 있고, 다시 누르면 거기부터 지움", () => {
    const s = createRun(5, "warden");
    const start = s.map.rooms[s.map.startId]!;
    const next = start.exits.find((n) => n >= 0)!;
    const far = s.map.rooms.find((r) => r.layer >= 2)!.id;
    expect(canPlan(s, far)).toBe(false);
    expect(pickRoute(s, far)).toBe(false);
    expect(pickRoute(s, next)).toBe(true);
    const after = s.map.rooms[next]!.exits.find((n) => n >= 0)!;
    expect(pickRoute(s, after)).toBe(true);
    expect(routePlan(s)).toEqual([next, after]);
    pickRoute(s, next);
    expect(routePlan(s)).toEqual([]);
  });

  it("지도를 보는 동안은 안 감 · 닫으면 이동 요청 → 귀환 빛기둥 뒤 다음 방", () => {
    const s = createRun(5, "warden");
    const fight = s.map.rooms.find((r) => r.type === "combat" && r.exits.some((n) => n >= 0))!;
    const to = fight.exits.find((n) => n >= 0)!;
    s.roomId = fight.id;
    s.rooms[fight.id] = { visited: true, cleared: true, pickups: [], enemies: [] };
    s.enemies = [];
    pickRoute(s, to);
    setRouteMapOpen(s, true);
    for (let i = 0; i < 200; i++) stepSim(s, autoRoute(s, EMPTY_INPUT));
    expect(s.roomId).toBe(fight.id);
    expect(s.player.routeGo).toBeUndefined();
    setRouteMapOpen(s, false);
    stepSim(s, autoRoute(s, EMPTY_INPUT));
    expect(s.player.routeGo).toBeDefined();
    for (let i = 0; i < 200 && s.roomId === fight.id; i++) stepSim(s, autoRoute(s, EMPTY_INPUT));
    expect(s.roomId).toBe(to);
    expect(routePlan(s)).toEqual([]);
  });
});
