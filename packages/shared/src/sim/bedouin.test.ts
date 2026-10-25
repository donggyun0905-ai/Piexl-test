import { describe, expect, it } from "vitest";
import { CHARACTERS, WEAPONS } from "../content";
import type { PassiveId } from "../items";
import { PASSIVES } from "../items";
import { BEDOUIN } from "../weaponsBedouin";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { characterWeapons, spawnTreasure } from "./loot";
import { dashMax } from "./bedouin";
import { damageEnemy } from "./combat";
import { DASH_TICKS } from "./util";
import { enemy, FIRE } from "./perkTestUtil";

/** 베두인으로 시작해 아이템을 가진 채, 적 없는 방 가운데 (오른쪽을 봄) */
function bedouin(...perks: PassiveId[]): RunState {
  const s = createRun(3, "bedouin");
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  return s;
}
const step = (s: RunState, n: number, input = FIRE) => {
  for (let i = 0; i < n; i++) stepSim(s, input);
};
/** 공격 한 번 할 때까지 */
const attackOnce = (s: RunState) => {
  const n = s.player.attackCount;
  for (let i = 0; i < 200 && s.player.attackCount === n; i++) stepSim(s, FIRE);
};
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("베두인", () => {
  it("무기는 대형 차크람 하나뿐, 전용 아이템 20개", () => {
    expect(CHARACTERS.bedouin.startWeapon).toBe("sandChakram");
    expect(characterWeapons("bedouin")).toEqual(["sandChakram"]);
    expect(Object.values(PASSIVES).filter((d) => "exclusive" in d && d.exclusive === "bedouin")).toHaveLength(20);
    expect(WEAPONS.sandChakram.kind).toBe("chakram");
  });

  it("처음엔 한 바퀴 회전 베기, 다음엔 멀리 던지고, 손이 비면 공격하지 못함", () => {
    const s = bedouin();
    s.enemies = [enemy(1, 60, 72 - BEDOUIN.spinR + 2)];
    attackOnce(s);
    expect(lost(s)).toBeGreaterThan(0);
    expect(s.player.ckHeld).not.toBe(false);
    attackOnce(s);
    expect(s.player.ckHeld).toBe(false);
    expect(s.player.ck?.mode).toBe("fly");
    // 튕겨 돌아오는 길에서 비켜 섬 (닿으면 잡으니까)
    s.player.y = s.player.prevY = 120;
    const count = s.player.attackCount;
    step(s, 300);
    expect(s.player.attackCount).toBe(count);
    expect(s.player.ck?.mode).toBe("ground");
  });

  it("멀리 던진 차크람이 지나간 적을 베고, 대시로 지나가며 주우면 크게 한 바퀴 벰", () => {
    const s = bedouin();
    attackOnce(s);
    attackOnce(s);
    s.enemies = [enemy(1, s.player.x + 60, 72)];
    s.player.y = s.player.prevY = 120;
    step(s, 40, EMPTY_INPUT);
    expect(lost(s)).toBeGreaterThan(0);
    step(s, 200, EMPTY_INPUT);
    const c = s.player.ck!;
    expect(c.mode).toBe("ground");
    // 차크람 바로 옆으로 옮겨 대시
    s.player.x = s.player.prevX = c.x - 14;
    s.player.y = s.player.prevY = c.y;
    s.enemies = [enemy(2, c.x, c.y - 30, 1000)];
    stepSim(s, { ...EMPTY_INPUT, moveX: 100, dash: true });
    step(s, 6, EMPTY_INPUT);
    expect(s.player.ckHeld).toBe(true);
    expect(s.player.ck).toBeUndefined();
    expect(s.enemies[0]!.hp).toBeLessThan(1000);
    expect(s.effects.some((e) => e.kind === "sandspin")).toBe(true);
  });

  it("대시로 지나간 적에게 공격력 30% · 무희의 춤이면 20%씩 연달아 세 번", () => {
    const dashThrough = (...perks: PassiveId[]) => {
      const s = bedouin(...perks);
      s.enemies = [enemy(1, s.player.x + 16, 72)];
      stepSim(s, { ...EMPTY_INPUT, moveX: 100, dash: true });
      step(s, DASH_TICKS + 20, EMPTY_INPUT);
      return lost(s) / s.player.stats.damage;
    };
    expect(dashThrough()).toBeCloseTo(0.3, 2);
    expect(dashThrough("duneRush")).toBeCloseTo(0.6, 2);
  });

  it("대시 거리는 다른 캐릭터의 1.4배", () => {
    const s = bedouin();
    const x0 = s.player.x;
    stepSim(s, { ...EMPTY_INPUT, moveX: 100, dash: true });
    step(s, DASH_TICKS, EMPTY_INPUT);
    const moved = s.player.x - x0;
    expect(moved).toBeGreaterThan(s.player.stats.moveSpeed * 3.2 * DASH_TICKS * 1.3);
  });

  it("차크람을 던져 손이 비면 이동 속도 +0.2", () => {
    const walk = (thrown: boolean) => {
      const s = bedouin();
      if (thrown) s.player.ckHeld = false;
      const x0 = s.player.x;
      step(s, 10, { ...EMPTY_INPUT, moveX: 100 });
      return (s.player.x - x0) / 10;
    };
    expect(walk(true) - walk(false)).toBeCloseTo(BEDOUIN.emptySpeed, 5);
  });

  it("튕긴 차크람은 같은 적도 다시 벰", () => {
    const s = bedouin("reboundRing");
    s.player.x = s.player.prevX = 40;
    attackOnce(s);
    attackOnce(s);
    const c = s.player.ck!;
    c.hit.push(7);
    c.x = 9999;
    stepSim(s, EMPTY_INPUT);
    expect(c.bounced).toBe(true);
    expect(c.hit).not.toContain(7);
  });

  it("첫 벽에 닿을 때까지는 멈추지 않고, 튕긴 뒤 사거리만큼 더 날아감", () => {
    const s = bedouin();
    s.player.stats.range = 10;
    attackOnce(s);
    attackOnce(s);
    s.player.y = s.player.prevY = 120;
    const c = s.player.ck!;
    step(s, 20, EMPTY_INPUT);
    expect(c.mode).toBe("fly");
    for (let i = 0; i < 400 && !c.bounced; i++) stepSim(s, EMPTY_INPUT);
    expect(c.bounced).toBe(true);
    step(s, c.left + 1, EMPTY_INPUT);
    expect(c.mode).toBe("ground");
  });

  it("잔상 고리: 날아가는 차크람이 잔상을 남기고, 잔상은 3초 동안 닿은 적을 벰", () => {
    const s = bedouin("whirlRing");
    attackOnce(s);
    attackOnce(s);
    s.player.y = s.player.prevY = 120;
    step(s, 12, EMPTY_INPUT);
    const g = s.player.ghosts!;
    expect(g.length).toBeGreaterThan(1);
    s.enemies = [enemy(5, g[0]!.x, g[0]!.y - 40)];
    s.player.ck = undefined;
    s.player.ghosts = [{ ...g[0]!, y: g[0]!.y - 40, left: 31 }];
    step(s, 2, EMPTY_INPUT);
    expect(lost(s) / s.player.stats.damage).toBeCloseTo(0.3, 2);
    step(s, 40, EMPTY_INPUT);
    expect(s.player.ghosts).toBeUndefined();
  });

  it("풍뎅이 부적: 보스에게 주는 피해 +30%", () => {
    const hit = (...perks: PassiveId[]) => {
      const s = bedouin(...perks);
      const e = { ...enemy(9, 200, 72), kind: "dragon" as const };
      s.enemies = [e];
      damageEnemy(s, e, 10, 0, 0);
      return e.maxHp - e.hp;
    };
    expect(hit("scarabCharm") / hit()).toBeCloseTo(1.3, 5);
  });

  it("공격력 24 · 되튕김은 벽에 계속 튕김", () => {
    expect(bedouin().player.stats.damage).toBe(24);
    const s = bedouin("reboundRing");
    attackOnce(s);
    attackOnce(s);
    expect(s.player.ck!.bounces).toBeGreaterThan(10);
    // 벽에 튕긴 뒤 날아오는 차크람에 닿으면 잡음
    for (let i = 0; i < 300 && !s.player.ck!.bounced; i++) stepSim(s, EMPTY_INPUT);
    const c = s.player.ck!;
    expect(c.mode).toBe("fly");
    s.player.x = s.player.prevX = c.x + c.vx * 3;
    s.player.y = s.player.prevY = c.y + c.vy * 3;
    step(s, 3, EMPTY_INPUT);
    expect(s.player.ckHeld).toBe(true);
  });

  it("신기루 걸음은 대시 3번 연속, 축적은 겹칠수록 +1", () => {
    const s = bedouin("mirageStep");
    expect(dashMax(s.player)).toBe(3);
    let dashes = 0;
    for (let i = 0; i < DASH_TICKS * 3; i++) {
      const before = s.player.dashTicks;
      stepSim(s, { ...EMPTY_INPUT, moveX: 100, dash: true });
      if (before === 0 && s.player.dashTicks > 0) dashes++;
    }
    expect(dashes).toBe(3);
    expect(s.player.dashCharges).toBe(0);
    s.player.passives.push("accumulate", "accumulate");
    expect(dashMax(s.player)).toBe(5);
    expect(dashMax(bedouin("accumulate").player)).toBe(2);
  });

  it("사막 환영은 환영 차크람 둘을 같이 던짐 · 태양 전사는 맵 끝까지", () => {
    const s = bedouin("desertMirage", "sunWarrior");
    expect(s.player.stats.range).toBe(400);
    attackOnce(s);
    attackOnce(s);
    expect(s.projectiles.filter((p) => p.spirit === "chakram")).toHaveLength(2);
  });

  it("보물방 무기 자리에는 무기 대신 패시브", () => {
    const s = bedouin();
    spawnTreasure(s, s.roomId);
    const picks = s.rooms[s.roomId]!.pickups;
    expect(picks.some((p) => p.kind === "weapon")).toBe(false);
    expect(picks.some((p) => p.kind === "passive")).toBe(true);
  });
});
