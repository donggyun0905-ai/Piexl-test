import { describe, expect, it } from "vitest";
import { PW_ARENAS } from "../paewangMaps";
import { PW_WAR } from "../pwRules";
import { PW } from "../paewangDefs";
import { distanceField } from "./layout";
import { fogAt, spotXY } from "./paewangGrid";
import { allPlayers } from "./party";
import { createPvp, stepPvp } from "./pvp";
import { GROW_MENU, growMenu, homeOf } from "./pwGrow";
import { warRole } from "./pwWarBot";
import { makeUnit } from "./pwLane";
import { pingCode } from "./pwPing";
import { EMPTY_INPUT } from "./types";
import { roomGrid } from "./util";

describe("패왕전 전쟁의 서막", () => {
  const a = PW_ARENAS.gWar;
  it("맵: 길 셋·편마다 포탑 여덟(위·아래 셋, 가운데 둘)·체크포인트 셋·안개 넷 · 집·체크포인트·정글 자리에 걸어서 닿음 · 정글 자리는 안개 안", () => {
    const s = createPvp(1, "war", [{ characterId: "warden" }], "gWar");
    expect(a.lanes).toHaveLength(3);
    expect(s.pvp!.grow!.units.filter((u) => u.kind === "tower" && u.team === 0)).toHaveLength(8);
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
        // 상대 AI가 걸어와 겹치지 않게 집에 묶어 둠
        allPlayers(s).forEach((q, j) => s.pvp!.seats[j]!.team === 1 && ([q.x, q.y] = homeOf(s, 1)));
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

  it("정글이 나오고 (큰 보스는 늦게), AI끼리 한동안 돌려도 같은 시드는 같은 결과", () => {
    const first = createPvp(4, "war", [{ characterId: "warden", ai: true }], "gWar");
    for (let i = 0; i < 200; i++) stepPvp(first, [EMPTY_INPUT]);
    // 큰 보스 둘은 10·15분부터
    expect(first.pvp!.grow!.units.filter((u) => u.team === 2).length).toBe(a.camps!.length - 2);
    expect(first.pvp!.grow!.units.some((u) => u.kind === "dragon" || u.kind === "godeater")).toBe(false);
    const play = () => {
      const s = createPvp(4, "war", [{ characterId: "warden", ai: true }], "gWar");
      for (let i = 0; i < 40 * 60; i++) stepPvp(s, [EMPTY_INPUT]);
      return s;
    };
    const s = play();
    expect(allPlayers(play()).map((p) => [p.x, p.pwXp])).toEqual(allPlayers(s).map((p) => [p.x, p.pwXp]));
  }, 60000);

  it("AI 역할: 편마다 위 1·가운데 1·아래 2·정글 1 · 2분이면 위·아래가 제 길에", () => {
    const s = createPvp(7, "war", [{ characterId: "warden", ai: true }], "gWar");
    for (const team of [0, 1]) {
      const roles = s.pvp!.seats.map((x, i) => (x.team === team ? warRole(s, i) : "")).filter(Boolean).sort();
      expect(roles).toEqual(["bot", "bot", "jungle", "mid", "top"]);
    }
    for (let i = 0; i < 2 * 60 * 60; i++) stepPvp(s, [EMPTY_INPUT]);
    allPlayers(s).forEach((p, i) => {
      const [c, r] = [p.x / 16, p.y / 16];
      if (warRole(s, i) === "top" && s.pvp!.seats[i]!.on) expect(c < 22 || r < 22, `top ${i} ${c},${r}`).toBe(true);
      if (warRole(s, i) === "bot" && s.pvp!.seats[i]!.on) expect(c > 60 || r > 60, `bot ${i} ${c},${r}`).toBe(true);
    });
  }, 60000);

  it("핑: T 자리 → 모여 · 위험(Alt) · 큰 보스 둘레면 '잡겠습니다' 핑 · 같은 편만 따름", () => {
    const s = createPvp(5, "war", [{ characterId: "warden" }], "gWar");
    while (s.tick <= (s.pvp!.readyAt ?? PW.ready) + 2) stepPvp(s, [EMPTY_INPUT]);
    const p = s.player;
    stepPvp(s, [{ ...EMPTY_INPUT, menu: pingCode(p.x + 40, p.y, false) }]);
    expect(s.pvp!.grow!.pings!.at(-1)).toMatchObject({ team: 0, kind: "go" });
    for (let i = 0; i < 70; i++) stepPvp(s, [EMPTY_INPUT]);
    stepPvp(s, [{ ...EMPTY_INPUT, menu: pingCode(p.x, p.y, true) }]);
    expect(s.pvp!.grow!.pings!.at(-1)!.kind).toBe("danger");
    const u = makeUnit(s, "dragon", 2, p.x + 100, p.y);
    s.pvp!.grow!.units.push(u);
    for (let i = 0; i < 70; i++) stepPvp(s, [EMPTY_INPUT]);
    stepPvp(s, [{ ...EMPTY_INPUT, menu: pingCode(u.body.x + 8, u.body.y, false) }]);
    expect(s.pvp!.grow!.pings!.at(-1)).toMatchObject({ kind: "boss", boss: "dragon" });
  });
});
