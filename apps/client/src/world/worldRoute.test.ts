import { describe, expect, it } from "vitest";
import { REGIONS } from "./worldPlaces";
import { regionOfPlace, wayTo } from "./worldRoute";

describe("worldRoute", () => {
  it("다른 나라에서 기억의 탑(아스칼론) 쪽 길을 찾음", () => {
    expect(regionOfPlace("memoryTower")).toBe("ascalon");
    for (const from of ["silber", "helios", "desert", "terracore"]) {
      const way = wayTo(from, "ascalon");
      expect(REGIONS[from]!.places.find((p) => p.id === way)?.kind).toBe("pass");
    }
  });
  it("건물 안에서는 나가는 문 · 성채로는 문", () => {
    expect(wayTo("ascalonKeep", "ascalon")).toBe("keepExit");
    const door = wayTo("ascalon", "ascalonKeep");
    expect(REGIONS.ascalon!.places.find((p) => p.id === door)?.to).toBe("ascalonKeep");
  });
});
