import { describe, expect, it } from "vitest";
import { TILE_SIZE } from "../constants";
import { PW_MODE } from "../paewangDefs";
import { PW_ARENAS } from "../paewangMaps";
import { PW_CAP } from "../pwRules";
import { distanceField } from "./layout";
import { spotXY } from "./paewangGrid";
import { allPlayers, useSeat } from "./party";
import { createPvp, stepPvp } from "./pvp";
import { capCenter, inCapZone } from "./pwCapture";
import { EMPTY_INPUT, type RunState } from "./types";
import { roomGrid } from "./util";

const run = (s: RunState, ticks: number) => {
  for (let i = 0; i < ticks && !s.over; i++) stepPvp(s, [EMPTY_INPUT]);
};

describe("패왕전 점령전", () => {
  it("맵 3종: 점령 구역·버프 자리가 시작 자리에서 걸어서 닿음 (낭떠러지 맵은 점프대까지)", () => {
    for (const id of PW_MODE.capture.maps) {
      const a = PW_ARENAS[id];
      const s = createPvp(1, "capture", [{ characterId: "warden" }], id);
      const g = roomGrid(s)!;
      const field = distanceField(g, ...spotXY(a.teamA[0]!));
      const cell = ([x, y]: readonly number[]) => Math.floor(y! / TILE_SIZE) * a.cols + Math.floor(x! / TILE_SIZE);
      for (const b of a.buffs ?? []) expect(field[cell(spotXY(b))], `${id} 버프`).toBeGreaterThanOrEqual(0);
      for (const sp of a.teamB) expect(field[cell(spotXY(sp))], `${id} 상대 집`).toBeGreaterThanOrEqual(0);
      expect(inCapZone(a, ...capCenter(a)), id).toBe(true);
      for (const j of a.jumps ?? []) expect(a.cliffs!.some(([c, r, w, h]) => j.to[0] >= c && j.to[0] < c + w && j.to[1] >= r && j.to[1] < r + h), `${id} 점프 착지`).toBe(false);
    }
  });

  it("AI끼리 끝까지: 점령도 100%인 편이 이김 · 같은 시드는 같은 결과", () => {
    const s = createPvp(7, "capture", [{ characterId: "warden", ai: true }], "cHall");
    run(s, (PW_MODE.capture.timeSec + 10) * 60);
    expect(s.over).toBe(true);
    const prog = s.pvp!.cap!.prog;
    expect(Math.max(prog[0] ?? 0, prog[1] ?? 0)).toBe(100);
    const play = () => {
      const t = createPvp(3, "capture", [{ characterId: "warden", ai: true }], "cCliff");
      run(t, 40 * 60);
      return [t.pvp!.cap, t.pvp!.seats.map((x) => x.deaths)];
    };
    expect(play()).toEqual(play());
  }, 60000);

  it("버프 자리: F를 누르고 3초 가만히 → 버프 · 1분 동안 다시 못 먹음 · 낭떠러지에 서면 쓰러지고 집에서 다시", () => {
    const s = createPvp(2, "capture", [{ characterId: "warden" }], "cCliff");
    const a = PW_ARENAS.cCliff;
    run(s, 200);
    useSeat(s, 0);
    const p = allPlayers(s)[0]!;
    [p.x, p.y] = spotXY(a.buffs![0]!);
    stepPvp(s, [{ ...EMPTY_INPUT, interact: true }]);
    for (let i = 0; i < PW_CAP.buffHold + 2; i++) {
      [p.x, p.y] = spotXY(a.buffs![0]!);
      stepPvp(s, [EMPTY_INPUT]);
    }
    expect(p.pwBuffs?.some((b) => b.dmg === PW_CAP.buff.dmg)).toBe(true);
    expect(s.pvp!.cap!.buffAt[0]).toBeGreaterThan(s.tick + PW_CAP.buffBack - 10);
    [p.x, p.y] = spotXY([18, 15]);
    p.invulnTicks = 0;
    stepPvp(s, [EMPTY_INPUT]);
    expect(s.pvp!.seats[0]!.deaths).toBe(1);
    expect(s.pvp!.seats[0]!.back).toBeDefined();
  });
});
