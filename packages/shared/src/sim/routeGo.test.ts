import { describe, expect, it } from "vitest";
import "../balanceTables";
import { ROUTE_GO_RULES, ROUTE_OP } from "./routeGo";
import { createRun, stepSim } from "./run";
import { menuCode } from "./station";
import { makeEnemy } from "./util";
import { EMPTY_INPUT, type RunState } from "./types";

/** 정리된 방 하나와 이어진 다음 방 */
function cleared(): { s: RunState; lane: number; to: number } {
  const s = createRun(5, "warden");
  const room = s.map.rooms[s.roomId]!;
  const lane = room.exits.findIndex((n) => n >= 0);
  s.rooms[s.roomId]!.cleared = true;
  s.enemies = [];
  return { s, lane, to: room.exits[lane]! };
}

describe("미리 정한 길로 가기", () => {
  it("메뉴로 시작하면 1.5초 빛기둥 뒤 다음 방으로", () => {
    const { s, lane, to } = cleared();
    stepSim(s, { ...EMPTY_INPUT, menu: menuCode(ROUTE_OP, lane) });
    expect(s.player.routeGo).toBeDefined();
    for (let i = 0; i < ROUTE_GO_RULES.TICKS + 2 && s.roomId !== to; i++) stepSim(s, EMPTY_INPUT);
    expect(s.roomId).toBe(to);
    expect(s.player.routeGo).toBeUndefined();
  });

  it("움직이면 취소 · 정리 안 된 방에서는 시작 안 됨", () => {
    const { s, lane } = cleared();
    const here = s.roomId;
    stepSim(s, { ...EMPTY_INPUT, menu: menuCode(ROUTE_OP, lane) });
    for (let i = 0; i < 20; i++) stepSim(s, { ...EMPTY_INPUT, moveX: 100 });
    expect(s.player.routeGo).toBeUndefined();
    for (let i = 0; i < ROUTE_GO_RULES.TICKS; i++) stepSim(s, EMPTY_INPUT);
    expect(s.roomId).toBe(here);
    s.rooms[here]!.cleared = false;
    s.enemies = [Object.assign(makeEnemy(s, "crawler", 60, 60, 1, 30), { rootTicks: 9999 })];
    stepSim(s, { ...EMPTY_INPUT, menu: menuCode(ROUTE_OP, lane) });
    expect(s.player.routeGo).toBeUndefined();
  });
});
