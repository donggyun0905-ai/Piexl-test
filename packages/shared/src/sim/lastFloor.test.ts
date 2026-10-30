import { describe, expect, it } from "vitest";
import { ROOM_COLS, ROOM_CX, ROOM_CY } from "../constants";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { continueToLastFloor } from "./rooms";
import { updateWaves } from "./bossWaves";
import { createPracticeRun, practiceClearEnemies, practiceSpawn } from "./practice";
import { DASH_COOLDOWN, EXIT_X, makeEnemy } from "./util";
import { passivePool } from "./loot";

/** 지금 방에서 다음 방(가운데 출구)으로 걸어 들어감 */
function nextRoom(run: RunState): void {
  const from = run.roomId;
  run.rooms[from]!.cleared = true;
  run.enemies = [];
  run.rooms[from]!.enemies = [];
  run.player.x = EXIT_X[1]!;
  run.player.y = 40;
  for (let i = 0; i < 300 && run.roomId === from; i++) stepSim(run, { ...EMPTY_INPUT, moveY: -100 });
}

describe("라스트 보스 층 (7층)", () => {
  it("6층을 깬 뒤 도전하면 7층: 시작 방 → 황금방 → 상점 → 아주 큰 보스방, 고른 보스가 나옴", () => {
    const run = createRun(5, "warden");
    run.won = true;
    run.over = true;
    continueToLastFloor(run, "dragon");
    expect(run.over).toBe(false);
    expect(run.floor).toBe(7);
    expect(run.map.rooms.map((r) => r.type)).toEqual(["start", "golden", "shop", "exit"]);
    nextRoom(run);
    expect(run.map.rooms[run.roomId]!.type).toBe("golden");
    nextRoom(run);
    expect(run.map.rooms[run.roomId]!.type).toBe("shop");
    expect(ROOM_COLS).toBe(21);
    nextRoom(run);
    expect(run.map.rooms[run.roomId]!.type).toBe("exit");
    expect(ROOM_COLS).toBeGreaterThan(15);
    expect(run.enemies[0]!.kind).toBe("dragon");
    // 보스를 잡고 계단으로 나가면 클리어
    run.player.invulnTicks = 99999;
    // 궁극기를 쓴 뒤라고 치고 잡음 (궁극기 전에는 쓰러지지 않음)
    run.enemies[0]!.ultDone = true;
    run.enemies[0]!.hp = 0;
    stepSim(run, EMPTY_INPUT);
    run.rooms[run.roomId]!.pickups = [];
    run.player.x = run.player.prevX = ROOM_CX;
    run.player.y = run.player.prevY = ROOM_CY;
    for (let i = 0; i < 3; i++) stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(run.won).toBe(true);
    expect(run.over).toBe(true);
  });

  it("라스트 보스방에 처음 들어가면 체력 가득", () => {
    const run = createRun(5, "warden");
    continueToLastFloor(run, "dragon");
    nextRoom(run);
    nextRoom(run);
    run.player.hp = 10;
    nextRoom(run);
    expect(run.map.rooms[run.roomId]!.type).toBe("exit");
    expect(run.player.hp).toBe(run.player.stats.maxHp);
  });

  it("레이드 시간: 보스방에 처음 들어간 때부터 보스를 다 잡기까지 (명예의 전당)", () => {
    const run = createRun(5, "warden");
    continueToLastFloor(run, "godeater");
    nextRoom(run);
    nextRoom(run);
    expect(run.raidStart).toBeUndefined();
    nextRoom(run);
    const start = run.raidStart!;
    expect(start).toBe(run.tick);
    run.player.invulnTicks = 99999;
    for (let i = 0; i < 100; i++) stepSim(run, EMPTY_INPUT);
    expect(run.raidTicks).toBeUndefined();
    run.enemies.forEach((e) => ((e.ultDone = true), (e.hp = 0)));
    stepSim(run, EMPTY_INPUT);
    stepSim(run, EMPTY_INPUT);
    expect(run.raidTicks).toBeGreaterThanOrEqual(100);
    expect(run.raidTicks).toBeLessThan(110);
  });

  it("시작 방 여신상 앞 여신의 축복: 대시 대기 시간 절반 · 이동 속도 +0.3 · 한 번 되살아남, 다른 곳에는 안 나옴", () => {
    const run = createRun(5, "warden");
    expect(passivePool(run)).not.toContain("goddessBlessing");
    const speed = run.player.stats.moveSpeed;
    continueToLastFloor(run, "dragon");
    const room = run.rooms[run.roomId]!;
    const pk = room.pickups.find((p) => p.itemId === "goddessBlessing")!;
    expect(pk.price).toBe(0);
    run.player.x = run.player.prevX = pk.x;
    run.player.y = run.player.prevY = pk.y;
    stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(run.player.passives).toContain("goddessBlessing");
    expect(run.player.stats.moveSpeed).toBeCloseTo(speed + 0.3);
    stepSim(run, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    expect(run.player.dashCooldown).toBeLessThan(DASH_COOLDOWN * 0.6);
    run.player.hp = 0;
    stepSim(run, EMPTY_INPUT);
    expect(run.over).toBe(false);
    expect(run.player.hp).toBe(Math.ceil(run.player.stats.maxHp * 0.5));
    run.player.invulnTicks = 0;
    run.player.hp = 0;
    stepSim(run, EMPTY_INPUT);
    expect(run.over).toBe(true);
  });

  it("황금방: 돈 300 + 공짜 아이템 9개 중 3개만 가질 수 있음", () => {
    const run = createRun(5, "warden");
    continueToLastFloor(run, "dragon");
    nextRoom(run);
    const room = run.rooms[run.roomId]!;
    expect(room.pickups.find((p) => p.kind === "coin")!.price).toBe(300);
    expect(room.pickups.filter((p) => p.kind === "passive")).toHaveLength(9);
    const before = run.player.passives.length;
    for (let k = 0; k < 3; k++) {
      const pk = room.pickups.find((p) => p.kind === "passive")!;
      run.player.x = run.player.prevX = pk.x;
      run.player.y = run.player.prevY = pk.y;
      stepSim(run, { ...EMPTY_INPUT, interact: true });
      stepSim(run, EMPTY_INPUT);
    }
    expect(run.player.passives.length - before).toBe(3);
    expect(run.rooms[run.roomId]!.pickups.filter((p) => p.kind === "passive")).toHaveLength(0);
  });

  it("라스트 보스 층 상점은 새로고침하면 산 자리도 다시 채움", () => {
    const run = createRun(5, "warden");
    continueToLastFloor(run, "dragon");
    nextRoom(run);
    nextRoom(run);
    const room = run.rooms[run.roomId]!;
    const passive = room.pickups.find((p) => p.kind === "passive" && p.price > 0)!;
    room.pickups = room.pickups.filter((p) => p !== passive);
    const reroll = room.pickups.find((p) => p.kind === "reroll")!;
    run.gold = 999;
    run.player.x = run.player.prevX = reroll.x;
    run.player.y = run.player.prevY = reroll.y;
    stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(run.rooms[run.roomId]!.pickups.some((p) => p.kind === "passive" && p.price > 0)).toBe(true);
  });
});

describe("멸망의 용", () => {
  function dragon(hp: number): RunState {
    const run = createRun(6, "warden");
    continueToLastFloor(run, "dragon");
    const e = makeEnemy(run, "dragon", 160, 60, 1, 10);
    e.maxHp = 5000;
    e.hp = hp;
    run.enemies = [e];
    return run;
  }

  it("숨결 · 벽 불기둥 · 무적(그동안 피해를 받지 않음)을 차례로 씀", () => {
    const run = dragon(5000);
    let fire = 0;
    let pillars = 0;
    let immune = false;
    for (let i = 0; i < 700; i++) {
      stepSim(run, EMPTY_INPUT);
      run.player.invulnTicks = 99999;
      fire = Math.max(fire, run.projectiles.filter((p) => p.look === "fire").length);
      pillars = Math.max(pillars, (run.hazards ?? []).filter((h) => h.fx === "pillar").length);
      immune ||= run.enemies[0]!.immune === true;
    }
    expect(fire).toBeGreaterThan(10);
    expect(pillars).toBeGreaterThanOrEqual(8);
    expect(immune).toBe(true);
  });

  it("체력 절반 아래면 메테오와 하늘로 날아올라 내려찍기가 더해짐", () => {
    const run = dragon(2000);
    let meteors = 0;
    let air = false;
    for (let i = 0; i < 900; i++) {
      stepSim(run, EMPTY_INPUT);
      run.player.invulnTicks = 99999;
      meteors = Math.max(meteors, (run.hazards ?? []).filter((h) => h.fx === "meteor").length);
      air ||= run.enemies[0]!.air === true;
    }
    expect(meteors).toBeGreaterThanOrEqual(4);
    expect(air).toBe(true);
  });

  it("꼬리로 바닥을 쳐 원형 파동 (대시면 넘어감) · 내려찍으면 사방으로 바위 파편 · 절반 아래 숨결은 세 갈래", () => {
    const run = dragon(2000);
    let waves = 0;
    let rocks = 0;
    let fire = 0;
    for (let i = 0; i < 1400; i++) {
      stepSim(run, EMPTY_INPUT);
      run.player.invulnTicks = 99999;
      waves = Math.max(waves, run.enemies[0]!.waves?.length ?? 0);
      rocks = Math.max(rocks, run.projectiles.filter((p) => p.look === "rock").length);
      fire = Math.max(fire, run.projectiles.filter((p) => p.look === "fire").length);
    }
    expect(waves).toBeGreaterThanOrEqual(2);
    expect(rocks).toBeGreaterThan(8);
    expect(fire).toBeGreaterThan(25);
    // 파동 고리에 닿으면 맞고, 대시 중이면 안 맞음
    for (const dash of [false, true]) {
      const r = dragon(5000);
      const e = r.enemies[0]!;
      e.waves = [{ x: r.player.x - 30, y: r.player.y, r: 29, max: 200, wait: 0, speed: 1, damage: 20 }];
      r.player.invulnTicks = 0;
      r.player.dashTicks = dash ? 5 : 0;
      const hp = r.player.hp;
      updateWaves(r, e);
      expect(r.player.hp < hp).toBe(!dash);
    }
  });

  it("무적 중 불덩이: 빠르게 벽에 3번 튕긴 뒤 한 번 더 닿으면 작은 불꽃으로 퍼짐", () => {
    const run = dragon(5000);
    let bouncing = 0;
    let shards = 0;
    for (let i = 0; i < 900; i++) {
      stepSim(run, EMPTY_INPUT);
      run.player.invulnTicks = 99999;
      bouncing = Math.max(bouncing, run.projectiles.filter((p) => p.shatter).length);
      shards = Math.max(shards, run.projectiles.filter((p) => p.look === "fire" && p.r === 2).length);
    }
    expect(bouncing).toBeGreaterThanOrEqual(8);
    expect(shards).toBeGreaterThanOrEqual(6);
  });

  it("연습장: 라스트 보스는 큰 방에서 (태초의 빛과 어둠은 상자 벽 방에 둘이), 적을 치우면 보통 방으로", () => {
    const run = createPracticeRun("warden");
    practiceSpawn(run, "dragon");
    expect(run.roomCols).toBe(29);
    expect(ROOM_COLS).toBe(29);
    practiceSpawn(run, "plight");
    expect(run.enemies.map((e) => e.kind).filter((k) => k !== "dummy").sort()).toEqual(["pdark", "plight"]);
    expect(run.arena?.length).toBe(12);
    practiceClearEnemies(run);
    expect(ROOM_COLS).toBe(21);
    expect(run.arena).toBeUndefined();
  });

  it("같은 시드·입력이면 같은 결과", () => {
    const go = () => {
      const run = dragon(2000);
      for (let i = 0; i < 600; i++) {
        stepSim(run, { ...EMPTY_INPUT, moveX: i % 120 < 60 ? 100 : -100 });
        run.player.invulnTicks = 99999;
      }
      return JSON.stringify(run);
    };
    expect(go()).toBe(go());
  });
});
