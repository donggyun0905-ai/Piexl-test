import { describe, expect, it } from "vitest";
import { WEAPONS, type WeaponId } from "../content";
import { TIGER } from "../weaponsBeast";
import type { PassiveId } from "../items";
import { beastTick } from "./beast";
import { damagePlayer, removeDead, updateDelayed } from "./combat";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { weaponPool } from "./loot";
import { beastSpeedMul, updatePets } from "./pets";
import { enemy, FIRE } from "./perkTestUtil";

/** 야수로 시작해 무기·아이템을 가진 채, 적 없는 방 가운데 (오른쪽을 봄) */
function beast(weapon: WeaponId = "claws", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "beast");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 120;
  s.player.y = s.player.prevY = 72;
  return s;
}

function hold(s: RunState, n: number, want = true): void {
  for (let i = 0; i < n; i++) {
    s.tick++;
    if (s.player.attackCooldown > 0) s.player.attackCooldown--;
    beastTick(s, want, s.player.stats.attackSpeed);
  }
}

const lost = (s: RunState, id = 1) => {
  const e = s.enemies.find((x) => x.id === id)!;
  return e.maxHp - e.hp;
};

describe("야수와 고양이", () => {
  it("야수는 전용 무기만 얻음", () => {
    for (const id of weaponPool(beast())) expect(WEAPONS[id]).toMatchObject({ exclusive: "beast" });
  });

  it("고양이가 따라오다 적에게 달려가 할큄 (본인이 공격하지 않아도)", () => {
    const s = beast();
    updatePets(s);
    expect(s.player.pets).toHaveLength(1);
    s.enemies = [enemy(1, 190, 72)];
    for (let i = 0; i < 120; i++) {
      s.tick++;
      updatePets(s);
    }
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("무기마다 고양이 수·종류: 고양이 무리 3마리, 사자, 그림자 고양이 2마리 · 한 마리 더", () => {
    const kinds = (w: WeaponId, ...perks: PassiveId[]) => {
      const s = beast(w, ...perks);
      updatePets(s);
      return s.player.pets!.map((p) => p.kind);
    };
    expect(kinds("catpack")).toEqual(["cat", "cat", "cat"]);
    expect(kinds("lionheart")).toEqual(["lion"]);
    expect(kinds("shadowpaw")).toEqual(["shadow", "shadow"]);
    expect(kinds("claws", "extraCat", "extraCat")).toEqual(["cat", "cat", "cat"]);
  });

  it("한 마리 더 + 그림자 발로 바꿔도 고양이가 사라지지 않고 그대로 있음", () => {
    const s = beast("catpack", "extraCat");
    updatePets(s);
    s.player.weaponId = "shadowpaw";
    recalcStats(s);
    updatePets(s);
    const first = [...s.player.pets!];
    for (let i = 0; i < 5; i++) updatePets(s);
    expect(s.player.pets!.map((p) => p.kind)).toEqual(["shadow", "shadow", "cat"]);
    expect(s.player.pets).toEqual(first);
    s.player.passives.push("extraCat");
    updatePets(s);
    expect(s.player.pets).toHaveLength(4);
  });

  it("할퀴기·덮치기: 덮치기는 가까운 적에게 뛰어듦", () => {
    const s = beast();
    s.enemies = [enemy(1, 135, 72)];
    hold(s, 1);
    expect(lost(s)).toBeGreaterThan(0);
    const p = beast("pouncers");
    p.enemies = [enemy(1, 165, 72)];
    hold(p, 1);
    expect(p.player.x).toBeGreaterThan(140);
    expect(lost(p)).toBeGreaterThan(0);
    // 덮쳐도 보호막은 없음
    expect(p.player.shieldPts ?? 0).toBe(0);
  });

  it("덮치기 게이지: 맞힐 때마다 차고, 다 차면 10초 동안 거대한 호랑이 (추가 체력 50이 먼저 깎임)", () => {
    const tiger = () => {
      const s = beast("pouncers");
      s.enemies = [{ ...enemy(1, 140, 72, 99999), kind: "dummy" as const }];
      for (let i = 0; i < TIGER.full / TIGER.perHit - 1; i++) hold(s, s.player.attackCooldown + 1);
      expect(s.player.tigerTicks ?? 0).toBe(0);
      hold(s, s.player.attackCooldown + 1);
      expect(s.player.tigerTicks).toBeGreaterThan(TIGER.ticks - 5);
      expect(s.player.shieldPts).toBe(TIGER.hp);
      s.player.hp = s.player.stats.maxHp - 40;
      s.player.invulnTicks = 0;
      return s;
    };
    // 추가 체력이 남은 채 끝나면 체력 가득
    const a = tiger();
    damagePlayer(a, 30);
    expect(a.player.hp).toBe(a.player.stats.maxHp - 40);
    a.enemies = [];
    hold(a, TIGER.ticks, false);
    expect(a.player.tigerTicks).toBe(0);
    expect(a.player.shieldPts).toBe(0);
    expect(a.player.hp).toBe(a.player.stats.maxHp);
    // 추가 체력을 넘게 맞으면 원래 체력도 깎이고 그대로
    const b = tiger();
    damagePlayer(b, TIGER.hp + 20);
    b.enemies = [];
    hold(b, TIGER.ticks, false);
    expect(b.player.hp).toBeLessThan(b.player.stats.maxHp - 40);
  });

  it("털실은 벽에 튕기고, 헤어볼은 맞은 적을 느리게 하고 불태움", () => {
    const s = beast("yarnball");
    hold(s, 1);
    expect(s.projectiles[0]).toMatchObject({ bounces: 3, spirit: "yarn" });
    const h = beast("hairball");
    h.enemies = [enemy(1, 150, 72)];
    for (let i = 0; i < 30; i++) stepSim(h, FIRE);
    const e = h.enemies.find((x) => x.id === 1)!;
    expect(e.slowTicks).toBeGreaterThan(0);
    expect(e.burnTicks).toBeGreaterThan(0);
  });

  it("캣닢 구름: 3초 동안 여러 번 피해 · 방울: 둘레 적 기절", () => {
    const s = beast("catnip");
    s.enemies = [enemy(1, 180, 72)];
    hold(s, 1);
    expect(s.pendingBlasts).toHaveLength(6);
    for (let i = 0; i < 200; i++) {
      s.tick++;
      updateDelayed(s);
    }
    expect(lost(s)).toBeGreaterThan(s.player.stats.damage * 5);
    const b = beast("catbell");
    b.enemies = [enemy(1, 140, 72)];
    hold(b, 1);
    expect(b.enemies[0]!.stunTicks).toBeGreaterThan(0);
  });

  it("같은 시드·입력이면 결과가 같음", () => {
    const play = () => {
      const s = createRun(31, "beast");
      for (let i = 0; i < 600; i++) stepSim(s, { ...FIRE, autoAim: true, moveX: i % 200 < 100 ? 60 : -60 });
      return [s.player.x, s.player.pets?.map((p) => [p.x, p.y]), s.kills, s.enemies.map((e) => e.hp)];
    };
    expect(play()).toEqual(play());
  });
});

describe("야수 전용 아이템", () => {
  it("능력치: 날카로운 발톱·고양이 몸놀림", () => {
    const base = beast().player.stats;
    expect(beast("claws", "sharpClaws").player.stats.damage).toBe(base.damage + 3);
    const a = beast("claws", "agility");
    expect(a.player.stats.moveSpeed).toBeCloseTo(base.moveSpeed + 0.15);
    stepSim(a, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    expect(a.player.dashCooldown).toBeLessThan(45 * 0.75);
  });

  it("고양이 낮잠: 가만히 있으면 회복 · 아홉 목숨: 층마다 한 번 버팀", () => {
    const s = beast("claws", "catNap");
    s.player.hp = 50;
    for (let i = 0; i < 180; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.hp).toBeGreaterThan(51);
    const n = beast("claws", "nineLives");
    n.player.hp = 1;
    damagePlayer(n, 50);
    stepSim(n, EMPTY_INPUT);
    expect(n.over).toBe(false);
    expect(n.player.hp).toBe(1);
    n.player.invulnTicks = 0;
    damagePlayer(n, 50);
    stepSim(n, EMPTY_INPUT);
    expect(n.over).toBe(true);
  });

  it("무리의 우두머리: 고양이 수만큼 공격 속도 · 생선 간식: 처치하면 고양이가 빨라짐 · 포효: 맞으면 고양이 피해 증가", () => {
    const s = beast("catpack", "packLeader");
    updatePets(s);
    expect(beastSpeedMul(s.player)).toBeCloseTo(1.15);
    const f = beast("claws", "fishTreat");
    f.enemies = [enemy(1, 140, 72, 0)];
    removeDead(f);
    expect(f.player.frenzyTicks).toBeGreaterThan(0);
    const r = beast("claws", "wildRoar");
    damagePlayer(r, 5);
    expect(r.player.roarTicks).toBeGreaterThan(0);
  });

  it("골골송: 고양이가 할퀼 때마다 회복 · 사냥 본능: 체력 절반 이하 적에게 더 아픔", () => {
    const s = beast("claws", "purr");
    s.player.hp = 50;
    s.enemies = [enemy(1, 150, 72)];
    for (let i = 0; i < 120; i++) {
      s.tick++;
      updatePets(s);
    }
    expect(s.player.hp).toBeGreaterThan(50);
    const hit = (hp: number) => {
      const t = beast("claws", "hunterInstinct");
      t.enemies = [enemy(1, 135, 72, 1000)];
      t.enemies[0]!.hp = hp;
      hold(t, 1);
      return hp - t.enemies[0]!.hp;
    };
    expect(hit(400)).toBeCloseTo(hit(900) * 1.3);
  });
});
