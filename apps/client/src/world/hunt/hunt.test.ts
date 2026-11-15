// 지도 사냥: 몬스터가 나고 · 휘두르면 맞고 · 잡으면 onKill · 시간이 지나면 다시 남 · 장신구가 능력치에 들어감
import { describe, expect, it } from "vitest";
import { createWalker } from "../../lobby/walker";
import { WTILE } from "../worldMap";
import { groundById, HUNT_GROUNDS } from "./huntGrounds";
import { createHunt, stepHunt, swing } from "./huntSim";
import { huntStats } from "./huntStats";

describe("지도 사냥", () => {
  it("사냥터 지역에 몬스터가 나고, 잡으면 세고, 다시 남", () => {
    const g = groundById("slimeMeadow")!;
    const h = createHunt("ascalon", "warden");
    const me = createWalker((g.tx + 0.5) * WTILE, (g.ty + 0.5) * WTILE);
    const kills: string[] = [];
    stepHunt(h, me, 0.016, () => true, (k) => kills.push(k));
    expect(h.mobs.filter((m) => m.st !== "dead")).toHaveLength(g.count);
    // 한 마리를 내 앞에 두고 잡을 때까지 휘두름
    const m = h.mobs[0]!;
    [m.x, m.y] = [me.x, me.y + 8];
    [me.fx, me.fy] = [0, 1];
    for (let k = 0; k < 40 && m.hp > 0; k++) {
      h.me.swingCd = 0;
      [m.x, m.y] = [me.x, me.y + 8];
      swing(h, me);
    }
    stepHunt(h, me, 0.016, () => true, (k) => kills.push(k));
    expect(kills).toEqual(["slimeMeadow"]);
    expect(m.st).toBe("dead");
    for (let k = 0; k < (g.respawn + 1) * 10; k++) stepHunt(h, me, 0.1, () => true, () => {});
    expect(m.st).not.toBe("dead");
  });
  it("사냥터 없는 지역은 몬스터 없음 · 표 id는 겹치지 않음", () => {
    expect(createHunt("virdia", "warden").mobs).toHaveLength(0);
    expect(new Set(HUNT_GROUNDS.map((g) => g.id)).size).toBe(HUNT_GROUNDS.length);
  });
  it("장신구 능력치가 지도 전투에 들어감", () => {
    const base = huntStats("warden", undefined);
    const geared = huntStats("warden", { atk: 10, hp: 50, def: 100, aspd: 0.5 });
    expect(geared.dmg).toBeGreaterThan(base.dmg);
    expect(geared.maxHp).toBe(base.maxHp + 50);
    expect(geared.taken).toBeCloseTo(base.taken / 2);
    expect(geared.gapMul).toBeLessThan(base.gapMul);
  });
});
