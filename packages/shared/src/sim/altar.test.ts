import { describe, expect, it } from "vitest";
import "../balanceTables";
import { ALTARS, ALTAR_IDS } from "../altarDefs";
import { ALTAR_OP, altarOf, altarPending, altarUsed } from "./altar";
import { extraOf } from "./baseStats";
import { recalcStats } from "./items";
import { generateFloor } from "./floor";
import { enemy } from "./perkTestUtil";
import { goThrough, startFloor, updateRoom } from "./rooms";
import { menuCode } from "./station";
import { createRun, stepSim } from "./run";
import { statusImmune } from "./remnant";
import { EMPTY_INPUT, type RunState } from "./types";

const menu = (s: RunState, code: number) => stepSim(s, { ...EMPTY_INPUT, menu: code });

/** 3층 제단의 방에 들어간 판 (패시브 넷) */
function inAltar(seed = 5): RunState {
  const s = createRun(seed, "warden");
  s.player.passives.push("sturdyHeart", "ironSkin", "whetstone", "lightGloves");
  startFloor(s, 3);
  const room = s.map.rooms.find((r) => r.type === "altar")!;
  const from = s.map.rooms.find((r) => r.exits.includes(room.id))!;
  s.roomId = from.id;
  s.rooms[from.id]!.cleared = true;
  goThrough(s, from.exits.indexOf(room.id));
  return s;
}

describe("제단의 방", () => {
  it("3층부터 층마다 하나 · 시련의 방과 겹치지 않음 · 성좌 8 모두 나옴", () => {
    const seen = new Set<string>();
    for (let seed = 1; seed < 40; seed++) {
      for (const f of [1, 2]) expect(generateFloor(seed, f).rooms.filter((r) => r.type === "altar")).toHaveLength(0);
      for (const f of [3, 4, 6]) {
        const m = generateFloor(seed, f);
        expect(m.rooms.filter((r) => r.type === "altar")).toHaveLength(1);
        if (f >= 4) expect(m.rooms.filter((r) => r.type === "trial")).toHaveLength(1);
      }
      const s = createRun(seed, "warden");
      startFloor(s, 3);
      seen.add(altarOf(s, s.map.rooms.find((r) => r.type === "altar")!.id));
    }
    expect(seen.size).toBe(ALTAR_IDS.length);
  });

  it("고르기 전에는 나갈 수 없고 (잠긴 출구도 못 지남), 고르면 열림", () => {
    const s = inAltar();
    stepSim(s, EMPTY_INPUT);
    expect(altarPending(s)).toBe(true);
    expect(s.rooms[s.roomId]!.cleared).toBe(false);
    updateRoom(s, EMPTY_INPUT);
    expect(s.prompt.kind).not.toBe("flee");
    menu(s, menuCode(ALTAR_OP, 2));
    stepSim(s, EMPTY_INPUT);
    expect(altarUsed(s)).toBe(true);
    expect(s.rooms[s.roomId]!.cleared).toBe(true);
  });

  it("카드 1 거래: 성좌마다 주고 받음", () => {
    for (let seed = 1; seed < 30; seed++) {
      const s = inAltar(seed);
      const id = altarOf(s);
      const before = { ...s.player.stats, ...extraOf(s.player) };
      recalcStats(s);
      const hp0 = s.player.stats.maxHp;
      menu(s, menuCode(ALTAR_OP, 0));
      const after = { ...s.player.stats, ...extraOf(s.player) };
      if (id === "whale") expect([after.regen > before.regen, s.player.stats.maxHp]).toEqual([true, hp0 - 20]);
      if (id === "hawk") expect(s.player.stats.attackSpeed).toBeGreaterThan(before.attackSpeed);
      if (id === "sion") expect(s.player.stats.moveSpeed).toBeGreaterThan(before.moveSpeed + 0.5);
      if (id === "sylvester") expect(after.critChance).toBeCloseTo(before.critChance + 0.3);
      if (id === "witch") expect(statusImmune(s.player)).toBe(true);
      if (id === "unknown") expect(s.player.passives).toHaveLength(4);
    }
  });

  it("카드 2 증강: 패시브 둘을 바치고 남은 하나에 기술 둘 → 그 기술이 적을 침", () => {
    const s = inAltar(7);
    const id = altarOf(s);
    menu(s, menuCode(ALTAR_OP, 1));
    expect(s.player.passives).toHaveLength(2);
    expect(s.player.augments).toEqual([{ passive: expect.any(String), skills: [...ALTARS[id].skills] }]);
    s.enemies = [{ ...enemy(1, s.player.x + 30, s.player.y, 99999), rootTicks: 99999 }];
    for (let i = 0; i < 400; i++) stepSim(s, EMPTY_INPUT);
    expect(s.enemies[0]!.hp).toBeLessThan(99999);
  });

  it("증강이 새겨진 패시브는 다시 와도 빼앗기지 않음 · 패시브가 둘 미만이면 카드 2를 못 고름", () => {
    const s = inAltar(7);
    s.player.augments = [{ passive: "ironSkin", skills: ["nova", "frost"] }];
    for (let k = 0; k < 3; k++) {
      // 같은 제단을 다시 쓰게 (방 기록 지움)
      (s.player.altar ??= { rooms: [] }).rooms = [];
      s.player.passives.push("whetstone", "lightGloves");
      menu(s, menuCode(ALTAR_OP, k === 0 ? 1 : 2));
      expect(s.player.passives).toContain("ironSkin");
    }
    const one = inAltar(8);
    one.player.passives = ["whetstone"];
    menu(one, menuCode(ALTAR_OP, 1));
    expect(altarUsed(one)).toBe(false);
  });

  it("제단 증강은 한 판에 하나: 다시 고르면 최대 체력 20을 내고 바꿈 (패시브는 안 바침) · 결과 기록", () => {
    const s = inAltar(7);
    menu(s, menuCode(ALTAR_OP, 1));
    expect(s.player.augments).toHaveLength(1);
    expect(s.player.altar!.last!.taken).toHaveLength(2);
    s.player.altar!.rooms = [];
    s.player.augments![0]!.skills = ["fan", "curse"];
    const hp = s.player.stats.maxHp;
    const n = s.player.passives.length;
    menu(s, menuCode(ALTAR_OP, 1));
    expect(s.player.augments).toHaveLength(1);
    expect(s.player.augments![0]!.skills).toEqual([...ALTARS[altarOf(s)].skills]);
    expect(s.player.stats.maxHp).toBe(hp - 20);
    expect(s.player.passives).toHaveLength(n);
    expect(s.player.altar!.last!.swap).toBe(true);
  });
});
