import { ROOM_CX, ROOM_CY } from "../constants";
import { describe, expect, it } from "vitest";
import { BOSS_TIERS, bossForFloor, ENEMIES } from "../content";
import { generateFloor } from "./floor";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { spawnShop } from "./shop";
import { LOOT_RULES } from "./loot";
import { startFloor } from "./rooms";
import { EXIT_X } from "./util";

describe("층 구성", () => {
  it("층마다 상점방·보스방이 하나씩", () => {
    for (let seed = 1; seed <= 40; seed++) {
      for (const f of [1, 3, 6]) {
        const map = generateFloor(seed, f);
        expect(map.rooms.filter((r) => r.type === "shop")).toHaveLength(1);
        expect(map.rooms.filter((r) => r.type === "exit")).toHaveLength(1);
      }
    }
  });
});

describe("돈·상점", () => {
  it("처음 자금 50 · 던전에서는 몬스터 하나에 1 (확률 · 정예 10 · 날벌레 무리는 다 잡아야 1)", () => {
    const chance = LOOT_RULES.GOLD_CHANCE;
    LOOT_RULES.GOLD_CHANCE = 1;
    const run = createRun(3, "drifter");
    expect(run.gold).toBe(50);
    run.enemies = [{ ...base(run), hp: 1 }];
    stepSim(run, { ...EMPTY_INPUT, aimX: 1000, attack: true });
    for (let i = 0; i < 30; i++) stepSim(run, EMPTY_INPUT);
    expect(run.kills).toBe(1);
    expect(run.goldEarned).toBe(1);
    LOOT_RULES.GOLD_CHANCE = chance;
  });

  it("상점 물건은 서 있기로는 안 사지고, F로 사면 돈이 줄고 가짐. 돈이 모자라면 못 삼", () => {
    const run = createRun(3, "warden");
    const p = run.player;
    run.gold = 0;
    run.rooms[run.roomId]!.pickups.push({ id: 999, kind: "passive", itemId: "whetstone", x: p.x, y: p.y, group: 0, armed: true, price: 20 });
    for (let i = 0; i < 60; i++) stepSim(run, EMPTY_INPUT);
    expect(p.passives).toEqual([]);
    expect(run.prompt.kind).toBe("buy");
    stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(p.passives).toEqual([]);
    run.gold = 25;
    stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(p.passives).toEqual(["whetstone"]);
    expect(run.gold).toBe(5);
    expect(run.goldSpent).toBe(20);
    expect(run.purchases).toBe(1);
  });

  it("명약은 회복약보다 비쌈", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const run = createRun(seed, "warden", ["floor4"]);
      spawnShop(run, run.roomId);
      const shop = run.rooms[run.roomId]!.pickups;
      const elixir = shop.find((x) => x.itemId === "elixir");
      if (!elixir) continue;
      const potion = shop.find((x) => x.itemId === "potion")!;
      expect(elixir.price).toBeGreaterThan(potion.price);
      return;
    }
    throw new Error("명약이 나오는 상점을 못 찾음");
  });

  it("새로고침: 안 산 물건만 다시 뽑고(회복약 자리는 그대로), 누를 때마다 비싸지며 같은 시드면 같은 결과", () => {
    const play = () => {
      const run = createRun(5, "warden");
      const p = run.player;
      run.rooms[run.roomId]!.pickups = [];
      spawnShop(run, run.roomId);
      const shop = run.rooms[run.roomId]!.pickups;
      const [passive, weapon, use, potion, reroll] = shop;
      expect(reroll!.kind).toBe("reroll");
      run.gold = 200;
      const passivePrice = passive!.price;
      // 패시브를 삼
      p.x = passive!.x;
      p.y = passive!.y;
      stepSim(run, { ...EMPTY_INPUT, interact: true });
      expect(run.rooms[run.roomId]!.pickups.includes(passive!)).toBe(false);
      const weaponBefore = weapon!.itemId;
      const firstPrice = reroll!.price;
      p.x = reroll!.x;
      p.y = reroll!.y;
      stepSim(run, { ...EMPTY_INPUT, interact: true });
      const pickups = run.rooms[run.roomId]!.pickups;
      // 산 자리는 비어 있는 그대로, 물건 수도 그대로
      expect(pickups.filter((x) => x.kind === "passive")).toHaveLength(0);
      expect(pickups).toHaveLength(5);
      expect(weapon!.itemId).not.toBe(weaponBefore);
      expect(potion!.itemId).toBe("potion");
      expect(run.gold).toBe(200 - passivePrice - firstPrice);
      expect(reroll!.price).toBeGreaterThan(firstPrice);
      expect(run.purchases).toBe(1);
      stepSim(run, { ...EMPTY_INPUT, interact: true });
      expect(reroll!.itemId).toBe("2");
      return pickups.map((x) => `${x.kind}:${x.itemId}:${x.price}`).join(",") + `|${use!.itemId}|${run.gold}`;
    };
    expect(play()).toBe(play());
  });

  it("산 무기와 바꾼 옛 무기는 공짜로 다시 가질 수 있음", () => {
    const run = createRun(3, "warden");
    const p = run.player;
    run.gold = 100;
    run.rooms[run.roomId]!.pickups.push({ id: 999, kind: "weapon", itemId: "spear", x: p.x, y: p.y, group: 0, armed: true, price: 30 });
    stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(p.weaponId).toBe("spear");
    const left = run.rooms[run.roomId]!.pickups.find((x) => x.id === 999)!;
    expect(left.itemId).toBe("greatblade");
    expect(left.price).toBe(0);
  });

  it("전투방을 정리하면 돈을 바로 얻음 (바닥에 두지 않고 그 자리에 얻는 효과만)", () => {
    const run = createRun(8, "warden");
    const id = run.map.rooms.find((r) => r.type === "combat")!.id;
    run.roomId = id;
    run.rooms[id] = { visited: true, cleared: false, pickups: [], enemies: [] };
    run.enemies = [];
    stepSim(run, EMPTY_INPUT);
    expect(run.rooms[id]!.pickups.some((x) => x.kind === "coin")).toBe(false);
    expect(run.goldEarned).toBe(3);
    const fx = run.effects.find((f) => f.kind === "coinGet")!;
    expect(fx.size).toBe(3);
  });
});

describe("보스", () => {
  it("보스방에 들어가면 그 층의 보스가 나오고, 잡으면 층 보상·계단", () => {
    for (const [floor, tier] of [[1, 0], [3, 1], [5, 2]] as const) {
      const run = createRun(21, "warden");
      startFloor(run, floor);
      const kind = bossForFloor(floor, run.seed);
      expect(BOSS_TIERS[tier]).toContain(kind);
      // 보스 바로 앞 칸 방에서 출구를 밀고 들어감
      const exit = run.map.rooms[run.map.exitId]!;
      enterFrom(run, beforeBoss(run)[0]!);
      expect(run.roomId).toBe(exit.id);
      // 그 층 보스가 나옴 (천사장은 탑을 같이 데리고 나옴)
      const boss = run.enemies.find((e) => e.kind === kind)!;
      expect(boss).toBeDefined();
      // 보스를 쓰러뜨림 (함께 나온 것도)
      run.player.invulnTicks = 99999;
      for (const e of run.enemies) e.hp = 0;
      const gold = run.gold;
      stepSim(run, EMPTY_INPUT);
      stepSim(run, EMPTY_INPUT);
      expect(run.bossKills).toBe(1);
      expect(run.gold).toBeGreaterThan(gold);
      expect(run.rooms[exit.id]!.cleared).toBe(true);
      expect(run.rooms[exit.id]!.pickups.filter((x) => x.kind === "passive")).toHaveLength(3);
    }
  });

  it("보스방은 어느 출구로 들어가도 플레이어·보스가 같은 자리에서 시작하고, 들어가자마자 맞지 않음", () => {
    for (let seed = 1; seed <= 12; seed++) {
      for (const floor of [1, 3, 5]) {
        const starts = new Set<string>();
        const base0 = createRun(seed, "warden");
        startFloor(base0, floor);
        const exit = base0.map.rooms[base0.map.exitId]!;
        for (const from of beforeBoss(base0)) {
          const run = createRun(seed, "warden");
          startFloor(run, floor);
          enterFrom(run, from);
          expect(run.roomId).toBe(exit.id);
          const b = run.enemies[0]!;
          starts.add(`${run.player.x},${run.player.y},${b.x},${b.y}`);
          const hp = run.player.hp;
          for (let i = 0; i < 60; i++) stepSim(run, EMPTY_INPUT);
          expect(run.player.hp).toBe(hp);
        }
        expect(starts.size).toBe(1);
      }
    }
  });

  it("보스방에서 도망쳤다 다시 들어가도 보스는 처음 자리로, 부른 졸개는 사라짐", () => {
    const run = createRun(21, "warden");
    startFloor(run, 3);
    const exit = run.map.rooms[run.map.exitId]!;
    enterFrom(run, beforeBoss(run)[0]!);
    const bx = run.enemies[0]!.x;
    const by = run.enemies[0]!.y;
    const px = run.player.x;
    run.enemies[0]!.x = 100;
    run.enemies[0]!.timer = 1;
    run.enemies.push({ ...base(run), noGold: true });
    // 나갔다가 다시 들어옴
    run.rooms[exit.id]!.enemies = run.enemies;
    enterFrom(run, beforeBoss(run)[0]!);
    expect(run.enemies).toHaveLength(1);
    expect(run.enemies[0]!.x).toBe(bx);
    expect(run.enemies[0]!.y).toBe(by);
    expect(run.enemies[0]!.timer).toBeGreaterThanOrEqual(89);
    expect(run.player.x).toBe(px);
  });

  it("보스는 시간이 지나면 탄을 쏘고, 무리 여왕은 적을 부름 (부른 적은 보스와 같이 사라짐)", () => {
    for (const kind of ["hulk", "brood", "seer"] as const) {
      const run = createRun(4, "warden");
      run.player.invulnTicks = 99999;
      run.enemies = [{ ...base(run), kind, r: ENEMIES[kind].radius, hp: 5000, maxHp: 5000, timer: 10, x: 60, y: 40 }];
      let shots = 0;
      for (let i = 0; i < 400; i++) {
        stepSim(run, EMPTY_INPUT);
        shots = Math.max(shots, run.projectiles.filter((p) => !p.fromPlayer).length);
      }
      expect(shots).toBeGreaterThan(0);
      if (kind === "brood") {
        expect(run.enemies.filter((e) => e.noGold).length).toBeGreaterThan(0);
        run.enemies[0]!.hp = 0;
        stepSim(run, EMPTY_INPUT);
        expect(run.enemies).toHaveLength(0);
      }
    }
  });

  it("무한 모드: 6층 계단을 내려가면 끝나지 않고 7층, 7층부터는 모든 보스 중 하나", () => {
    for (const endless of [false, true]) {
      const run = createRun(21, "warden", [], false, endless);
      startFloor(run, 6);
      enterFrom(run, beforeBoss(run)[0]!);
      run.player.invulnTicks = 99999;
      run.enemies[0]!.hp = 0;
      stepSim(run, EMPTY_INPUT);
      run.rooms[run.roomId]!.pickups = [];
      run.player.x = run.player.prevX = ROOM_CX;
      run.player.y = run.player.prevY = ROOM_CY;
      stepSim(run, { ...EMPTY_INPUT, interact: true });
      expect(run.won).toBe(!endless);
      expect(run.floor).toBe(endless ? 7 : 6);
    }
    const all = new Set<string>();
    for (let seed = 1; seed < 300; seed++) all.add(bossForFloor(9, seed));
    expect(all.size).toBe(BOSS_TIERS.flat().length);
  });

  it("보스 행동도 같은 시드·입력이면 같은 결과", () => {
    const go = () => {
      const run = createRun(77, "drifter");
      run.player.invulnTicks = 99999;
      run.enemies = [{ ...base(run), kind: "seer", r: 9, hp: 5000, maxHp: 5000, timer: 10, x: 60, y: 40 }];
      for (let i = 0; i < 900; i++) stepSim(run, { ...EMPTY_INPUT, autoAim: true, moveX: i % 200 < 100 ? 100 : -100 });
      return JSON.stringify(run);
    };
    expect(go()).toBe(go());
  });
});

/** 보스방으로 출구가 이어진 방들 */
function beforeBoss(run: RunState): number[] {
  return run.map.rooms.filter((r) => r.exits.includes(run.map.exitId)).map((r) => r.id);
}

/** 보스 앞 칸 방(from)에서 보스방 쪽 출구를 밀고 들어감 */
function enterFrom(run: RunState, from: number) {
  run.roomId = from;
  run.rooms[from] = { visited: true, cleared: true, pickups: [], enemies: [] };
  run.enemies = [];
  const lane = run.map.rooms[from]!.exits.indexOf(run.map.exitId);
  run.player.x = EXIT_X[lane]!;
  run.player.y = 40;
  for (let i = 0; i < 300 && run.roomId !== run.map.exitId; i++) stepSim(run, { ...EMPTY_INPUT, moveY: -100 });
}

function base(run: RunState) {
  const p = run.player;
  return {
    id: 500,
    kind: "crawler" as const,
    x: p.x + 30,
    y: p.y,
    prevX: p.x + 30,
    prevY: p.y,
    r: 5,
    hp: 30,
    maxHp: 30,
    timer: 0,
    phase: "walk" as const,
    dirX: 0,
    dirY: 0,
    hitFlash: 0,
    count: 0,
    noGold: false,
  };
}
