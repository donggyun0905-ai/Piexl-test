// 지도 사냥: 몬스터가 나고 · 휘두르면 맞고 · 잡으면 onKill · 시간이 지나면 다시 남 · 장신구가 능력치에 들어감
import { describe, expect, it } from "vitest";
import { createWalker } from "../../lobby/walker";
import { WTILE } from "../worldMap";
import { groundById, HUNT_GROUNDS } from "./huntGrounds";
import { createHunt, stepHunt, swing } from "./huntSim";
import { huntStats } from "./huntStats";
import { TEXT } from "../../i18n/text";
import { BOSS_GATES } from "../bossGates";
import { REGIONS } from "../worldPlaces";
import { SUB_QUESTS } from "../../progress/subQuests";
import { dailyList } from "../../progress/dailyQuests";

describe("지도 사냥", () => {
  it("사냥터 지역에 몬스터가 나고, 잡으면 세고, 다시 남", () => {
    const g = groundById("slimeMeadow")!;
    const h = createHunt("ascalon", "warden");
    const me = createWalker((g.tx + 0.5) * WTILE, (g.ty + 0.5) * WTILE);
    const kills: string[] = [];
    stepHunt(h, me, 0.016, () => true, (k) => kills.push(k));
    expect(h.mobs.filter((m) => m.st !== "dead" && m.g === g)).toHaveLength(g.count);
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
    expect(createHunt("ascalonKeep", "warden").mobs).toHaveLength(0);
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
  it("사냥터·필드 보스·최종보스 입구: 나라 필드에 있고, 표지판·입구 장소가 생기고, 이름 글자가 있음 · 몬스터 종류는 사냥터마다 다름", () => {
    const text = TEXT as Record<string, unknown>;
    for (const g of HUNT_GROUNDS) {
      expect(REGIONS[g.region]?.places.some((p) => p.id === g.id), g.id).toBe(true);
      expect(text[g.name], g.name).toBeTruthy();
      expect(g.hp > 0 && g.dmg > 0 && g.speed > 0, g.id).toBe(true);
    }
    const kinds = HUNT_GROUNDS.filter((g) => !g.boss).map((g) => g.kind);
    expect(new Set(kinds).size).toBe(kinds.length);
    expect(HUNT_GROUNDS.filter((g) => g.boss).length).toBe(12);
    for (const b of BOSS_GATES) expect(REGIONS[b.region]?.places.some((p) => p.id === `boss_${b.boss}` && p.gate === "boss"), b.boss).toBe(true);
  });
  it("서브 퀘스트 id가 겹치지 않음 · 긴급 퀘스트는 날마다 3개 (같은 날은 같은 목록)", () => {
    expect(new Set(SUB_QUESTS.map((q) => q.id)).size).toBe(SUB_QUESTS.length);
    expect(dailyList("2026-11-15")).toHaveLength(3);
    expect(dailyList("2026-11-15")).toEqual(dailyList("2026-11-15"));
  });
});
