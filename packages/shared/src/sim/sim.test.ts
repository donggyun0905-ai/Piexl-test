import { ROOM_CX, ROOM_CY } from "../constants";
import { describe, expect, it } from "vitest";
import { createRng } from "../rng";
import { FLOOR_COUNT, generateFloor, LANES, middleLayersFor } from "./floor";
import { EXIT_X } from "./util";
import { WEAPONS } from "../content";
import { createRun, EMPTY_INPUT, stepSim, type EnemyState, type RunState, type TickInput } from "./index";

/** 시드로 만든 무작위 입력 기록 */
function randomInputs(seed: number, ticks: number): TickInput[] {
  const rng = createRng(seed);
  const out: TickInput[] = [];
  let cur: TickInput = EMPTY_INPUT;
  for (let i = 0; i < ticks; i++) {
    if (i % 20 === 0) {
      cur = {
        statPick: 0,
        moveX: rng.int(-100, 100),
        moveY: rng.int(-100, 100),
        aimX: rng.int(-1000, 1000),
        aimY: rng.int(-1000, 1000),
        attack: rng.nextFloat() < 0.8,
        dash: false,
        interact: false,
        useSlot: 0,
        pickChoice: 0,
        autoAim: rng.nextFloat() < 0.5,
      };
    }
    out.push({
      ...cur,
      dash: rng.nextFloat() < 0.02,
      interact: rng.nextFloat() < 0.05,
      useSlot: rng.nextFloat() < 0.02 ? rng.int(1, 2) : 0,
      pickChoice: rng.nextFloat() < 0.01 ? rng.int(1, 3) : 0,
    });
  }
  return out;
}

function play(run: RunState, inputs: TickInput[]): RunState {
  for (const input of inputs) stepSim(run, input);
  return run;
}

function enemy(id: number, x: number, y: number, hp = 100): EnemyState {
  return { id, kind: "crawler", x, y, prevX: x, prevY: y, r: 5, hp, maxHp: hp, timer: 0, phase: "walk", dirX: 0, dirY: 0, hitFlash: 0, count: 0, noGold: false };
}

/** 지금 방의 첫 번째 출구 줄로 가서 위로 밀고 다음 방으로 들어감 */
function walkToNeighbor(run: RunState): void {
  const lane = run.map.rooms[run.roomId]!.exits.findIndex((n) => n >= 0);
  run.player.x = EXIT_X[lane]!;
  run.player.y = 40;
  const from = run.roomId;
  for (let i = 0; i < 300 && run.roomId === from; i++) stepSim(run, { ...EMPTY_INPUT, moveY: -100 });
}

/** 지금 방의 출구 줄 쪽으로 위쪽 벽에 붙음 (나가지는 않음) */
function pushExit(run: RunState, extra: Partial<TickInput> = {}, ticks = 120): void {
  const lane = run.map.rooms[run.roomId]!.exits.findIndex((n) => n >= 0);
  run.player.x = EXIT_X[lane]!;
  run.player.y = 40;
  for (let i = 0; i < ticks; i++) stepSim(run, { ...EMPTY_INPUT, moveY: -100, ...extra, interact: (extra.interact ?? false) && i % 2 === 0 });
}

describe("층 지도", () => {
  it("같은 시드·층이면 같은 지도, 층마다 칸 수", () => {
    for (let f = 1; f <= FLOOR_COUNT; f++) {
      const a = generateFloor(77, f);
      expect(a).toEqual(generateFloor(77, f));
      expect(a.layers).toBe(middleLayersFor(f) + 2);
    }
  });

  it("갈림길: 모든 방에 들어오는 길·나가는 길이 있고, 출구는 다음 칸의 가까운 줄로만", () => {
    for (let seed = 1; seed <= 50; seed++) {
      for (let f = 1; f <= FLOOR_COUNT; f++) {
        const map = generateFloor(seed, f);
        const entered = new Set<number>([map.startId]);
        for (const r of map.rooms) {
          const exits = r.exits.filter((n) => n >= 0);
          if (r.id === map.exitId) expect(exits).toHaveLength(0);
          else expect(exits.length).toBeGreaterThan(0);
          for (let lane = 0; lane < LANES; lane++) {
            const n = r.exits[lane]!;
            if (n < 0) continue;
            const next = map.rooms[n]!;
            expect(next.layer).toBe(r.layer + 1);
            expect(next.lane).toBe(lane);
            expect(Math.abs(next.lane - r.lane)).toBeLessThanOrEqual(1);
            entered.add(n);
          }
        }
        expect(entered.size).toBe(map.rooms.length);
        expect(map.rooms.filter((r) => r.type === "exit")).toHaveLength(1);
        expect(map.rooms.filter((r) => r.type === "treasure")).toHaveLength(1);
        expect(map.rooms.filter((r) => r.type === "shop")).toHaveLength(1);
        expect(map.rooms.filter((r) => r.type === "rest")).toHaveLength(1);
        // 시작·보스 사이 칸은 방이 2~3개
        for (let l = 1; l <= middleLayersFor(f); l++) {
          const n = map.rooms.filter((r) => r.layer === l).length;
          expect(n).toBeGreaterThanOrEqual(2);
          expect(n).toBeLessThanOrEqual(3);
        }
      }
    }
  });
});

describe("게임 계산", () => {
  it("같은 시드 + 같은 입력이면 완전히 같은 결과 (다시 돌리기 검증의 기본)", () => {
    for (const character of ["warden", "drifter", "mage"] as const) {
      const inputs = randomInputs(5, 3600);
      const a = play(createRun(123, character), inputs);
      const b = play(createRun(123, character), inputs);
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    }
  });

  it("시작 방은 적이 없고 출구가 열려 있음, 다음 칸 방으로 이동 가능", () => {
    const run = createRun(11, "warden");
    expect(run.enemies).toHaveLength(0);
    expect(run.rooms[0]!.cleared).toBe(true);
    walkToNeighbor(run);
    expect(run.roomId).not.toBe(0);
    expect(run.map.rooms[run.roomId]!.layer).toBe(1);
    expect(run.rooms[run.roomId]!.visited).toBe(true);
  });

  it("적이 있는 방은 출구가 잠기고, 상호작용하면 최대 체력 20%를 내고 다음 방으로 나감", () => {
    const run = createRun(11, "warden");
    walkToNeighbor(run);
    const room = run.roomId;
    expect(run.map.rooms[room]!.type).not.toBe("start");
    run.enemies = [enemy(900, 30, 120, 9999)];
    run.rooms[room]!.cleared = false;
    run.player.invulnTicks = 9999;
    pushExit(run);
    expect(run.roomId).toBe(room);
    expect(run.prompt.kind).toBe("flee");
    const hp = run.player.hp;
    const lane = run.map.rooms[room]!.exits.findIndex((n) => n >= 0);
    stepSim(run, { ...EMPTY_INPUT, moveY: -100, interact: true });
    expect(run.roomId).toBe(run.map.rooms[room]!.exits[lane]);
    expect(run.player.hp).toBe(hp - Math.ceil(run.player.stats.maxHp * 0.2));
    // 나간 방의 적은 그대로 남아 있음
    expect(run.rooms[room]!.enemies).toHaveLength(1);
  });

  it("체력이 모자라면 억지로 나갈 수 없음", () => {
    const run = createRun(11, "warden");
    walkToNeighbor(run);
    const room = run.roomId;
    run.enemies = [enemy(900, 40, 120, 9999)];
    run.rooms[room]!.cleared = false;
    run.player.hp = 10;
    run.player.invulnTicks = 9999;
    pushExit(run, { interact: true });
    expect(run.roomId).toBe(room);
  });

  it("아래쪽 벽(들어온 쪽)으로는 되돌아갈 수 없음", () => {
    const run = createRun(11, "warden");
    walkToNeighbor(run);
    const room = run.roomId;
    run.enemies = [];
    for (let i = 0; i < 200; i++) stepSim(run, { ...EMPTY_INPUT, moveY: 100, dash: i % 50 === 0 });
    expect(run.roomId).toBe(room);
  });

  it("계단방을 정리하고 계단에서 상호작용하면 다음 층, 마지막 층이면 클리어", () => {
    const run = createRun(5, "drifter");
    const toStairs = () => {
      run.roomId = run.map.exitId;
      run.enemies = [];
      run.player.x = ROOM_CX;
      run.player.y = ROOM_CY;
    };
    toStairs();
    stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(run.floor).toBe(2);
    expect(run.roomId).toBe(run.map.startId);
    run.floor = FLOOR_COUNT;
    toStairs();
    stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(run.won).toBe(true);
    expect(run.over).toBe(true);
  });

  it("벽 밖으로 나가지 않음 (문이 없는 모서리)", () => {
    const run = createRun(1, "drifter");
    play(run, Array(600).fill({ ...EMPTY_INPUT, moveX: -100, moveY: -100 }));
    expect(run.player.x).toBe(16 + run.player.r);
    expect(run.player.y).toBe(16 + run.player.r);
  });

  it("쓰러진 뒤에는 진행하지 않음", () => {
    const run = createRun(9, "drifter");
    run.player.hp = 1;
    run.enemies = [enemy(900, run.player.x + 3, run.player.y)];
    run.player.invulnTicks = 0;
    stepSim(run, EMPTY_INPUT);
    expect(run.over).toBe(true);
    const tick = run.tick;
    stepSim(run, EMPTY_INPUT);
    expect(run.tick).toBe(tick);
  });

  it("대시 중에는 피해를 받지 않음", () => {
    const run = createRun(3, "warden");
    run.player.invulnTicks = 0;
    run.enemies = [enemy(999, run.player.x + 4, run.player.y, 999)];
    stepSim(run, { ...EMPTY_INPUT, dash: true, moveX: -100 });
    expect(run.player.hp).toBe(run.player.stats.maxHp);
  });

  it("근접 공격은 앞쪽 적만 맞힘", () => {
    const run = createRun(3, "warden");
    run.enemies = [enemy(1, run.player.x + 20, run.player.y), enemy(2, run.player.x - 20, run.player.y)];
    stepSim(run, { ...EMPTY_INPUT, aimX: 1000, attack: true });
    expect(run.enemies.find((e) => e.id === 1)!.hp).toBeLessThan(100);
    expect(run.enemies.find((e) => e.id === 2)!.hp).toBe(100);
  });

  it("자동 공격은 누르지 않아도 사거리 안의 적만 공격", () => {
    const run = createRun(3, "warden");
    run.enemies = [enemy(1, run.player.x + 80, run.player.y)];
    stepSim(run, { ...EMPTY_INPUT, autoAim: true });
    expect(run.enemies[0]!.hp).toBe(100);
    run.enemies[0]!.x = run.player.x + 20;
    stepSim(run, { ...EMPTY_INPUT, autoAim: true });
    expect(run.enemies[0]!.hp).toBeLessThan(100);
  });

  it("원거리 공격은 투사체를 만들고 적을 맞히면 처치 수가 오름", () => {
    const run = createRun(3, "drifter");
    run.enemies = [enemy(50, run.player.x + 40, run.player.y, 1)];
    stepSim(run, { ...EMPTY_INPUT, aimX: 1000, attack: true });
    expect(run.projectiles.length).toBe(1);
    play(run, Array(30).fill(EMPTY_INPUT));
    expect(run.kills).toBe(1);
  });

  it("마법사 마법탄은 맞은 자리에서 터져 주변 적에게 절반 피해", () => {
    const run = createRun(3, "mage");
    run.player.weaponId = "stormstaff";
    const hit = enemy(1, run.player.x + 40, run.player.y);
    const near = enemy(2, run.player.x + 44, run.player.y + 12);
    const far = enemy(3, run.player.x - 60, run.player.y);
    run.enemies = [hit, near, far];
    stepSim(run, { ...EMPTY_INPUT, aimX: 1000, attack: true });
    expect(run.projectiles[0]!.blast).toBeGreaterThan(0);
    play(run, Array(30).fill(EMPTY_INPUT));
    const dmg = run.player.stats.damage;
    expect(hit.hp).toBeCloseTo(100 - dmg);
    expect(near.hp).toBeCloseTo(100 - dmg / 2);
    expect(far.hp).toBe(100);
  });

  it("여러 발 무기는 부채꼴로 쏘고, 관통 무기는 적을 뚫고 지나감", () => {
    const run = createRun(3, "drifter");
    run.player.weaponId = "volleybow";
    run.enemies = [enemy(1, run.player.x + 60, run.player.y)];
    stepSim(run, { ...EMPTY_INPUT, aimX: 1000, attack: true });
    expect(run.projectiles.length).toBe(5);
    expect(new Set(run.projectiles.map((pr) => Math.round(pr.vy * 100))).size).toBe(5);

    const run2 = createRun(3, "drifter");
    run2.player.weaponId = "arbalest";
    const a = enemy(1, run2.player.x + 30, run2.player.y);
    const b = enemy(2, run2.player.x + 50, run2.player.y);
    run2.enemies = [a, b];
    stepSim(run2, { ...EMPTY_INPUT, aimX: 1000, attack: true });
    play(run2, Array(20).fill(EMPTY_INPUT));
    expect(a.hp).toBeLessThan(100);
    expect(b.hp).toBeLessThan(100);
  });

  it("전용 무기는 캐릭터마다 10개", () => {
    for (const c of ["warden", "drifter", "mage"] as const) {
      expect(Object.values(WEAPONS).filter((w) => "exclusive" in w && w.exclusive === c).length).toBe(10);
    }
  });
});
