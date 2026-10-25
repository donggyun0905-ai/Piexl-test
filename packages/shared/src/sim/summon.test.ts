import { describe, expect, it } from "vitest";
import { CHARACTERS, WEAPONS, type WeaponId } from "../content";
import type { PassiveId } from "../items";
import { SUMMON_STATS } from "../weaponsSummon";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { weaponPool } from "./loot";
import { enemy, FIRE } from "./perkTestUtil";
import { SUMMON_LIFE } from "./summon";

/** 소환술사로 시작해 무기·아이템을 가진 채, 적 없는 방 (오른쪽을 봄) */
function summoner(weapon: WeaponId = "leatherwhip", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "summoner");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 80;
  s.player.y = s.player.prevY = 72;
  return s;
}

function dummies(s: RunState, ...xy: [number, number][]): void {
  s.enemies = xy.map(([x, y], i) => ({ ...enemy(i + 1, x, y, 99999), kind: "dummy" as const }));
}
function step(s: RunState, n: number, input = FIRE): void {
  const home = s.enemies.map((e) => [e.x, e.y] as const);
  for (let i = 0; i < n; i++) {
    stepSim(s, input);
    s.enemies.forEach((e, k) => ([e.x, e.y] = home[k] ?? [e.x, e.y]));
  }
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("소환술사", () => {
  it("소환수 탄은 적을 밀지 않고 피해만", () => {
    const s = summoner();
    s.enemies = [{ ...enemy(1, 120, 72, 999), rootTicks: 99999 }];
    s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: 112, y: 72, prevX: 112, prevY: 72, r: 2, vx: 3, vy: 0, damage: 5, ticksLeft: 20, spirit: "bone" });
    for (let i = 0; i < 5; i++) stepSim(s, EMPTY_INPUT);
    expect(s.enemies[0]!.hp).toBeLessThan(999);
    expect(s.enemies[0]!.x).toBe(120);
  });

  it("전용 채찍 10개만 얻고, 가죽 채찍으로 시작", () => {
    expect(CHARACTERS.summoner.startWeapon).toBe("leatherwhip");
    const all = weaponPool(summoner(), true);
    expect(all).toHaveLength(9);
    for (const id of all) expect(WEAPONS[id]).toMatchObject({ exclusive: "summoner", kind: "summon" });
  });

  it("채찍으로 맞힌 수가 쌓이면 소환, 최대 수까지 · 시간이 지나면 사라짐", () => {
    const s = summoner();
    dummies(s, [110, 72]);
    step(s, 31 * 3);
    expect(s.player.summons?.length).toBe(1);
    step(s, 60 * 6);
    expect(s.player.summons?.length).toBe(3);
    // 공격을 멈추면 시간이 지나 사라짐
    step(s, SUMMON_LIFE + 10, EMPTY_INPUT);
    expect(s.player.summons?.length ?? 0).toBe(0);
  });

  it("늑대는 둘씩 · 박쥐는 셋씩 나옴", () => {
    for (const [w, n] of [["shadowwhip", 2], ["stormwhip", 3]] as const) {
      const s = summoner(w);
      dummies(s, [110, 72]);
      step(s, 31 * 4);
      expect(s.player.summons?.length, w).toBe(n);
      expect(SUMMON_STATS[s.player.summons![0]!.kind].count).toBe(n);
    }
  });

  it("소환수가 스스로 적을 때림 (채찍질을 멈춰도)", () => {
    const s = summoner("thornwhip");
    dummies(s, [110, 72]);
    step(s, 31 * 3);
    const before = lost(s);
    step(s, 120, EMPTY_INPUT);
    expect(lost(s)).toBeGreaterThan(before);
  });

  it("군단: 최대 수 +2", () => {
    const s = summoner("leatherwhip", "horde");
    dummies(s, [110, 72]);
    step(s, 60 * 12);
    expect(s.player.summons?.length).toBe(5);
  });

  it("채찍마다 피해 차이가 크지 않음 (적 1명 · 뭉친 적 3명, 소환수 포함 20초)", () => {
    const measure = (id: WeaponId, n: number) => {
      const s = summoner(id);
      dummies(s, ...([[110, 72], [116, 60], [116, 84]] as [number, number][]).slice(0, n));
      step(s, 1200);
      return lost(s) / 20;
    };
    const ids = weaponPool(summoner(), true).concat("leatherwhip");
    const one = ids.map((id) => measure(id, 1));
    const three = ids.map((id) => measure(id, 3));
    expect(Math.min(...one)).toBeGreaterThan(Math.max(...one) / 2);
    const both = ids.map((_, i) => one[i]! + three[i]! / 2);
    expect(Math.min(...both)).toBeGreaterThan(Math.max(...both) / 2);
  });

  it("소환수끼리 겹치지 않음 (같은 적을 쫓아도 둘레에 나란히)", () => {
    const s = summoner("shadowwhip");
    dummies(s, [130, 72]);
    s.player.summons = [0, 1, 2, 3, 4].map((i) => ({ id: 100 + i, kind: "wolf" as const, x: 80, y: 72, prevX: 80, prevY: 72, r: 4, cd: 0, life: 600, face: 1, slot: i }));
    step(s, 90, { ...EMPTY_INPUT });
    const list = s.player.summons!;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) expect(Math.hypot(list[i]!.x - list[j]!.x, list[i]!.y - list[j]!.y)).toBeGreaterThan(list[i]!.r + list[j]!.r);
    }
  });
});
