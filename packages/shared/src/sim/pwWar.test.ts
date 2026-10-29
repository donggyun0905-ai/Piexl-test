import { describe, expect, it } from "vitest";
import { PW_ARENAS } from "../paewangMaps";
import { PW_WAR } from "../pwRules";
import { distanceField } from "./layout";
import { fogAt, spotXY } from "./paewangGrid";
import { allPlayers } from "./party";
import { createPvp, stepPvp } from "./pvp";
import { GROW_MENU, growMenu, homeOf } from "./pwGrow";
import { EMPTY_INPUT } from "./types";
import { roomGrid } from "./util";

describe("패왕전 전쟁의 서막", () => {
  const a = PW_ARENAS.gWar;
  it("맵: 길 셋·편마다 포탑 여섯·체크포인트 셋·안개 넷 · 집·체크포인트·정글 자리에 걸어서 닿음 · 정글 자리는 안개 안", () => {
    const s = createPvp(1, "war", [{ characterId: "warden" }], "gWar");
    expect(a.lanes).toHaveLength(3);
    expect(s.pvp!.grow!.units.filter((u) => u.kind === "tower" && u.team === 0)).toHaveLength(6);
    const field = distanceField(roomGrid(s)!, ...homeOf(s, 0));
    const cell = ([c, r]: readonly number[]) => r! * a.cols + c!;
    for (const sp of [...(a.points ?? []).map((p) => p.at), ...(a.camps ?? []).map((c) => c.at), a.homes![1]]) expect(field[cell(sp)], String(sp)).toBeGreaterThanOrEqual(0);
    for (const c of a.camps ?? []) expect(fogAt("gWar", ...spotXY(c.at)), String(c.at)).toBeGreaterThanOrEqual(0);
  });

  it("체크포인트: 그 길 상대 맨 앞 포탑이 부서져야 점령 · 점령하면 집에서 순간이동", () => {
    const s = createPvp(2, "war", [{ characterId: "warden" }], "gWar");
    for (let i = 0; i < 200; i++) stepPvp(s, [EMPTY_INPUT]);
    const p = s.player;
    const pt = spotXY(a.points![0]!.at);
    const hold = () => {
      for (let i = 0; i < (PW_WAR.pointSec + 1) * 60; i++) {
        [p.x, p.y] = pt;
        p.hp = p.stats.maxHp;
        stepPvp(s, [EMPTY_INPUT]);
      }
    };
    hold();
    expect(s.pvp!.grow!.points![0]!.owner).toBe(-1);
    for (const u of s.pvp!.grow!.units) if (u.kind === "tower" && u.team === 1 && u.lane === 0 && u.order === 0) u.body.hp = 0;
    hold();
    expect(s.pvp!.grow!.points![0]!.owner).toBe(0);
    [p.x, p.y] = homeOf(s, 0);
    growMenu(s, GROW_MENU.tp);
    expect(Math.hypot(p.x - pt[0], p.y - pt[1])).toBeLessThan(2);
  }, 30000);

  it("정글·큰 보스가 나오고, AI끼리 한동안 돌려도 같은 시드는 같은 결과", () => {
    const first = createPvp(4, "war", [{ characterId: "warden", ai: true }], "gWar");
    for (let i = 0; i < 200; i++) stepPvp(first, [EMPTY_INPUT]);
    expect(first.pvp!.grow!.units.filter((u) => u.team === 2).length).toBe(a.camps!.length);
    const play = () => {
      const s = createPvp(4, "war", [{ characterId: "warden", ai: true }], "gWar");
      for (let i = 0; i < 40 * 60; i++) stepPvp(s, [EMPTY_INPUT]);
      return s;
    };
    const s = play();
    expect(allPlayers(play()).map((p) => [p.x, p.pwXp])).toEqual(allPlayers(s).map((p) => [p.x, p.pwXp]));
  }, 60000);
});
