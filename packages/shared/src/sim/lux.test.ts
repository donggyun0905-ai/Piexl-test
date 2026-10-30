import { describe, expect, it } from "vitest";
import { HIDDEN_CHARACTERS } from "../characters";
import { LIMITED_CHARACTERS } from "../limitedChars";
import { LUX_PASSIVES } from "../itemsLux";
import { createRun, stepSim, type RunState } from "./index";
import { extraOf } from "./baseStats";
import { recalcStats } from "./items";
import { luxShards, luxStage } from "./lux";
import { luxKill, luxRoom, luxRooms } from "./luxFoes";
import { enemy, FIRE } from "./perkTestUtil";

function lux(shards = 0): RunState {
  const s = createRun(9, "lux");
  for (let i = 0; i < shards; i++) s.player.passives.push("lxShard");
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [
    { ...enemy(1, 90, 72, 999999), rootTicks: 999999 },
    { ...enemy(2, 120, 100, 999999), rootTicks: 999999 },
  ];
  return s;
}

describe("빛의 사도", () => {
  it("한정 캐릭터 (숨은 캐릭터처럼 패왕전·순위표에는 없음) · 빛의 검 · 전용 아이템 10 + 빛의 조각", () => {
    expect(LIMITED_CHARACTERS).toContain("lux");
    expect(HIDDEN_CHARACTERS).toContain("lux");
    expect(createRun(1, "lux").player.weaponId).toBe("luxBlade");
    expect(Object.keys(LUX_PASSIVES)).toHaveLength(11);
  });

  it("평타는 사거리 안 적 자리에 작은 빛, 세 번째 공격마다 적 자리에 '+' 빛의 검이 여러 번 생겨 벰", () => {
    const s = lux();
    const hp = s.enemies[1]!.hp;
    const seen = new Set<object>();
    for (let i = 0; i < 120; i++) {
      stepSim(s, FIRE);
      for (const f of s.effects) if (f.kind === "lxCross") seen.add(f);
    }
    const crosses = seen.size;
    expect(s.projectiles.length).toBe(0);
    expect([...seen].some((f) => (f as { dirX: number }).dirX >= 4)).toBe(true);
    expect(crosses).toBeGreaterThanOrEqual(4);
    // 멀리 있는 둘째 적도 빛의 검에 맞음
    expect(s.enemies[1]!.hp).toBeLessThan(hp);
  });

  it("은총의 옷자락: 빛의 검 5개 더 · 꿰뚫는 빛: 붉은 빛의 검이 한 번 더", () => {
    const count = (perk?: "lxGrace" | "lxPierce"): [number, number] => {
      const s = lux();
      if (perk) s.player.passives.push(perk);
      const seen = new Set<object>();
      for (let i = 0; i < 120; i++) {
        stepSim(s, FIRE);
        for (const f of s.effects) if (f.kind === "lxCross") seen.add(f);
      }
      const all = [...seen] as { dirX: number }[];
      return [all.filter((f) => f.dirX < 4).length, all.filter((f) => f.dirX === 2 || f.dirX === 3).length];
    };
    const [base, red0] = count();
    expect(red0).toBe(0);
    expect(count("lxGrace")[0]).toBeGreaterThanOrEqual(base + 5);
    const [, red] = count("lxPierce");
    expect(red).toBeGreaterThanOrEqual(base - 2);
  });

  it("빛의 조각: 치명타·예리함이 오르고 6개마다 성장 (최대 3단계)", () => {
    const s = lux(7);
    expect(luxShards(s.player)).toBe(7);
    expect(luxStage(s.player)).toBe(1);
    expect(extraOf(s.player).critChance).toBeGreaterThan(extraOf(lux().player).critChance);
    expect(luxStage(lux(30).player)).toBe(3);
  });

  it("빛의 적: 층마다 전투방 셋 · 빛을 입은 적이 쓰러지면 빛의 조각 · 다른 캐릭터 판에는 없음", () => {
    const s = createRun(4, "lux");
    const rooms = luxRooms(s);
    expect(rooms.length).toBe(Math.min(3, s.map.rooms.filter((r) => r.type === "combat").length));
    expect(luxRooms(createRun(4, "warden"))).toEqual([]);
    const list = luxRoom(s, rooms[0]!, [enemy(5, 60, 60, 30), enemy(6, 80, 60, 50)]);
    const lit = list.filter((e) => e.lux);
    expect(lit).toHaveLength(1);
    luxKill(s, lit[0]!);
    expect(s.rooms[s.roomId]!.pickups.some((p) => p.itemId === "lxShard")).toBe(true);
  });
});
