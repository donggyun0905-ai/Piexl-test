import { describe, expect, it } from "vitest";
import { WEAPONS, type WeaponDef, type WeaponId } from "../content";
import { PASSIVE_IDS } from "../items";
import { removeDead } from "./combat";
import { onRoomCleared, spawnTreasure } from "./loot";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { ROOM_MAX_X } from "./util";
import { def, FIRE, enemy, drifter, run } from "./perkTestUtil";

describe("전용 공격 방식 아이템", () => {
  it("캐릭터마다 전용 아이템이 10개이고 모두 공격 방식 아이템", () => {
    for (const c of ["warden", "drifter", "mage"] as const) {
      const perks = PASSIVE_IDS.filter((id) => def(id).exclusive === c);
      expect(perks, c).toHaveLength(10);
      expect(perks.every((id) => def(id).effect === true)).toBe(true);
    }
  });

  it("층 보상에는 자기 전용만 나오고, 이미 가진 것은 다시 안 나옴", () => {
    const rewardIds = (s: RunState): string[] => {
      const exit = s.map.exitId;
      onRoomCleared(s, exit);
      return s.rooms[exit]!.pickups.filter((pk) => pk.kind === "passive").map((pk) => pk.itemId);
    };
    for (const c of ["warden", "drifter", "mage"] as const) {
      let own = 0;
      for (let seed = 1; seed <= 30; seed++) {
        for (const id of rewardIds(createRun(seed, c))) {
          const ex = def(id).exclusive;
          expect(ex === undefined || ex === c, `${c} got ${id}`).toBe(true);
          if (ex === c) own++;
        }
      }
      expect(own, c).toBeGreaterThan(0);
      const all = createRun(5, c);
      all.player.passives.push(...PASSIVE_IDS.filter((id) => def(id).effect));
      expect(rewardIds(all).some((id) => def(id).effect)).toBe(false);
    }
  });

  it("무기는 자기 전용 + 자기 공격 방식(근접/원거리)의 공용만 나옴", () => {
    for (const c of ["warden", "drifter", "mage"] as const) {
      const kinds = new Set<string>();
      for (let seed = 1; seed <= 60; seed++) {
        const s = createRun(seed, c, ["firstBoss", "floor4", "rich", "shopper", "hunter", "flawlessBoss", "clearRun", "fastClear"]);
        const exit = s.map.rooms.findIndex((r) => r.type === "treasure");
        s.roomId = exit;
        spawnTreasure(s, exit);
        for (const pk of s.rooms[exit]!.pickups.filter((x) => x.kind === "weapon")) {
          const w: WeaponDef = WEAPONS[pk.itemId as WeaponId];
          if (w.exclusive === undefined) kinds.add(w.kind);
          expect(w.exclusive === undefined || w.exclusive === c).toBe(true);
        }
      }
      expect([...kinds], c).toEqual([c === "warden" ? "melee" : "ranged"]);
    }
  });

  it("튕기는 화살촉: 벽에 맞으면 반대로 날아감 (최대 2번)", () => {
    const s = drifter("ricochet");
    s.player.x = ROOM_MAX_X - 25;
    stepSim(s, FIRE);
    let bounced = false;
    for (let i = 0; i < 20 && !bounced; i++) {
      stepSim(s, EMPTY_INPUT);
      bounced = s.projectiles.some((pr) => pr.vx < 0);
    }
    expect(bounced).toBe(true);
    expect(s.projectiles[0]!.bounces).toBe(1);
  });

  it("갈라지는 촉: 적에게 맞으면 양옆 대각선 두 탄이 생김", () => {
    const s = drifter("splitHead");
    s.enemies = [enemy(1, s.player.x + 30, s.player.y)];
    stepSim(s, FIRE);
    for (let i = 0; i < 20 && s.projectiles.every((pr) => pr.ticksLeft > 30); i++) stepSim(s, EMPTY_INPUT);
    const kids = s.projectiles.filter((pr) => pr.hitIds?.includes(1));
    expect(kids).toHaveLength(2);
    expect(kids[0]!.vy * kids[1]!.vy).toBeLessThan(0);
    expect(kids.every((pr) => pr.vx > 0)).toBe(true);
  });

  it("추적 깃털: 비스듬히 있는 적 쪽으로 휘어짐", () => {
    const s = drifter("seekerFeather");
    s.enemies = [enemy(1, s.player.x + 70, s.player.y + 25)];
    stepSim(s, FIRE);
    run(s, 12);
    expect(s.projectiles[0]!.vy).toBeGreaterThan(0.1);
  });

  it("등뒤 화살통: 공격하면 뒤쪽으로도 한 발 (60% 피해)", () => {
    const s = drifter("backQuiver");
    stepSim(s, FIRE);
    expect(s.projectiles).toHaveLength(2);
    const back = s.projectiles.find((pr) => pr.vx < 0)!;
    const front = s.projectiles.find((pr) => pr.vx > 0)!;
    expect(back.damage).toBeCloseTo(front.damage * 0.6);
  });

  it("되돌이 깃: 빗나가면 사거리 끝에서 한 번 되돌아옴", () => {
    const s = drifter("returnFletch");
    s.player.x = 30; // 오른쪽으로 사거리만큼 날아갈 자리가 있게
    stepSim(s, FIRE);
    const span = s.projectiles[0]!.span!;
    run(s, span + 2);
    expect(s.projectiles[0]!.vx).toBeLessThan(0);
    run(s, span + 5);
    expect(s.projectiles).toHaveLength(0);
  });

  it("사냥의 흥분: 연속 처치할수록 공격이 빨라지고, 3초 뒤 사라짐", () => {
    const s = drifter("huntFrenzy");
    for (let i = 0; i < 6; i++) {
      s.enemies = [enemy(10 + i, 50, 50, 0)];
      removeDead(s);
    }
    expect(s.player.streak).toBe(5);
    s.enemies = [enemy(1, s.player.x + 200, s.player.y)];
    stepSim(s, FIRE);
    // 기본 공격 속도 3/초 → 20틱, +50% → 13틱
    expect(s.player.attackCooldown).toBeLessThan(14);
    run(s, 185);
    expect(s.player.streak).toBe(0);
  });

  it("숨 고르기: 0.5초 이상 가만히 있으면 공격력 +50%", () => {
    const s = drifter("steadyBreath");
    run(s, 40);
    stepSim(s, FIRE);
    expect(s.projectiles[0]!.damage).toBeCloseTo(s.player.stats.damage * 1.5);
    const t = drifter("steadyBreath");
    run(t, 40, { ...EMPTY_INPUT, moveX: -100 });
    stepSim(t, FIRE);
    expect(t.projectiles[0]!.damage).toBeCloseTo(t.player.stats.damage);
  });

  it("기습 패시브: 대시 직후 첫 공격만 2.5배 + 맞힌 적 체력 비례 피해", () => {
    const s = drifter("ambush");
    stepSim(s, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    run(s, 12);
    expect(s.player.ambushTicks).toBeGreaterThan(0);
    stepSim(s, FIRE);
    expect(s.projectiles[0]!.damage).toBeCloseTo(s.player.stats.damage * 2.5);
    expect(s.projectiles[0]!.hpCut).toBe(0.06);
    run(s, 25);
    stepSim(s, FIRE);
    expect(s.projectiles[s.projectiles.length - 1]!.damage).toBeCloseTo(s.player.stats.damage);
  });

  it("일제 사격 부적: 4번째 공격마다 발 수 +2", () => {
    const s = drifter("volleyCharm");
    const counts: number[] = [];
    for (let k = 0; k < 4; k++) {
      s.player.attackCooldown = 0;
      const before = s.nextId;
      stepSim(s, FIRE);
      counts.push(s.nextId - before);
    }
    expect(counts).toEqual([1, 1, 1, 3]);
  });

  it("질주의 발자국: 처치할 때마다 대시 대기 시간이 줄어듦", () => {
    const s = drifter("chaseSteps");
    s.player.dashCooldown = 40;
    s.enemies = [enemy(1, 50, 50, 0)];
    removeDead(s);
    expect(s.player.dashCooldown).toBe(25);
  });
});
