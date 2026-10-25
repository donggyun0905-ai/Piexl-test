import { describe, expect, it } from "vitest";
import { EXIT_X, ROOM_COLS, ROOM_MIN_Y, ROOM_ROWS } from "../constants";
import { createRng } from "../rng";
import { ROOM_SHAPES, shapeGrid, TILE_FLOOR, tileAt } from "./layout";
import { createParty, stepParty } from "./partyRun";
import { allPlayers, isAlive, useSeat } from "./party";
import { goThrough } from "./rooms";
import { createRun } from "./run";
import { makeEnemy } from "./util";
import { EMPTY_INPUT, type PlayerState, type RunState, type TickInput } from "./types";

const members = [
  { characterId: "warden" as const, unlocks: [] },
  { characterId: "drifter" as const, unlocks: [] },
  { characterId: "mage" as const, unlocks: [] },
];

/** 정해진 시드로 흔드는 입력 (사람마다 다름) */
function play(s: RunState, ticks: number, salt = 1): void {
  const r = createRng(salt);
  let inputs: TickInput[] = [];
  for (let t = 0; t < ticks && !s.over; t++) {
    if (t % 15 === 0) inputs = allPlayers(s).map(() => ({ ...EMPTY_INPUT, moveX: r.int(-100, 100), moveY: r.int(-100, 40), attack: true, autoAim: true, interact: r.int(0, 4) === 0 }));
    stepParty(s, inputs);
  }
}

describe("협동", () => {
  it("모두 시작 방 아래쪽에 나란히 서고, 자리마다 따로 값이 있음", () => {
    const s = createParty(5, members);
    const ps = allPlayers(s);
    expect(ps.map((p) => p.characterId)).toEqual(["warden", "drifter", "mage"]);
    expect(new Set(ps.map((p) => p.x)).size).toBe(3);
    expect(ps.every((p) => p.y === ps[0]!.y)).toBe(true);
  });

  it("같은 시드·입력이면 결과가 같고, 중간에 JSON으로 옮겨도 이어서 같음 (방장 → 손님 상태 보내기)", () => {
    const a = createParty(11, members);
    const b = createParty(11, members);
    play(a, 3000);
    play(b, 3000);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    const c = JSON.parse(JSON.stringify(a)) as RunState;
    play(a, 3000, 2);
    play(c, 3000, 2);
    useSeat(c, a.seat ?? 0);
    expect(JSON.stringify(c)).toBe(JSON.stringify(a));
  });

  it("화면마다 보는 자리(내 자리)가 달라도 결과가 같음", () => {
    const a = createParty(13, members);
    const b = JSON.parse(JSON.stringify(a)) as RunState;
    useSeat(b, 2);
    play(a, 4000, 4);
    play(b, 4000, 4);
    useSeat(b, 0);
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    // 상태 보내기 크기 (직접 연결 한 메시지에 담을 수 있게)
    expect(JSON.stringify(a).length).toBeLessThan(60_000);
  });

  it("적은 가까운 사람을 쫓고, 쓰러진 사람은 움직이지 않음, 모두 쓰러지면 끝", () => {
    const s = createParty(3, members);
    const [p0, p1] = [allPlayers(s)[0]!, allPlayers(s)[1]!];
    p1.hp = 0;
    const x = p1.x;
    for (let t = 0; t < 30; t++) stepParty(s, [EMPTY_INPUT, { ...EMPTY_INPUT, moveX: 100 }]);
    expect(allPlayers(s)[1]!.x).toBe(x);
    expect(isAlive(p0)).toBe(true);
    for (const p of allPlayers(s)) p.hp = 0;
    stepParty(s, []);
    expect(s.over).toBe(true);
  });

  it("출구는 살아 있는 모두가 같은 출구에 서야 열리고, 그 전엔 몇 명 모였는지 안내", () => {
    const s = createParty(8, members.slice(0, 2));
    s.enemies = [];
    s.rooms[s.roomId]!.enemies = [];
    const lane = s.map.rooms[s.roomId]!.exits.findIndex((x) => x >= 0);
    const [a, b] = allPlayers(s);
    a!.x = EXIT_X[lane]!;
    a!.y = ROOM_MIN_Y + a!.r;
    const up = { ...EMPTY_INPUT, moveY: -100 };
    const room = s.roomId;
    stepParty(s, [up, EMPTY_INPUT]);
    expect(s.roomId).toBe(room);
    useSeat(s, 0);
    expect(s.prompt).toEqual({ kind: "gather", have: 1, need: 2 });
    b!.x = EXIT_X[lane]!;
    b!.y = ROOM_MIN_Y + b!.r;
    stepParty(s, [up, up]);
    expect(s.roomId).not.toBe(room);
  });

  it("방 정리 보상은 사람마다 따로 (돈은 각자 바로 얻음)", () => {
    const s = createParty(21, members);
    s.rooms[s.roomId]!.cleared = true;
    const exits = s.map.rooms[s.roomId]!.exits;
    goThrough(s, exits.findIndex((x) => x >= 0 && s.map.rooms[x]!.type === "combat"));
    expect(s.enemies.length).toBeGreaterThan(0);
    for (const e of s.enemies) e.hp = 0;
    stepParty(s, []);
    stepParty(s, []);
    // 사람마다 자기 돈이 늘고, 돈 효과도 사람마다 하나씩
    for (let i = 0; i < 3; i++) {
      useSeat(s, i);
      expect(s.gold).toBeGreaterThan(0);
    }
    useSeat(s, 0);
    expect(new Set(s.effects.filter((f) => f.kind === "coinGet").map((f) => f.seat))).toEqual(new Set([0, 1, 2]));
  });

  it("사람이 많으면 일반 적은 조금 더, 체력도 조금 더 (1:1로 늘지 않음)", () => {
    const solo = createRun(30, "warden");
    const duo = createParty(30, members.slice(0, 2));
    const trio = createParty(30, members);
    const room = (s: RunState) => {
      s.rooms[s.roomId]!.cleared = true;
      goThrough(s, s.map.rooms[s.roomId]!.exits.findIndex((x) => x >= 0 && s.map.rooms[x]!.type === "combat"));
      return s.enemies;
    };
    const [a, b, c] = [room(solo), room(duo), room(trio)];
    expect(b.length).toBeGreaterThanOrEqual(a.length);
    expect(c.length).toBeGreaterThan(a.length);
    expect(c.length).toBeLessThan(a.length * 2);
    // 체력은 반올림되므로 소수 첫째 자리까지
    expect(c[0]!.maxHp / a[0]!.maxHp).toBeCloseTo(1.4, 1);
  });

  it("쓰러진 친구는 전투가 끝난 뒤 옆에서 회복약을 쓰면 회복약만큼 체력으로 일어남", () => {
    const s = createParty(4, members.slice(0, 2));
    const [a, b] = allPlayers(s) as [PlayerState, PlayerState];
    b.hp = 0;
    b.x = a.x + 8;
    b.y = a.y;
    a.useSlots = ["potion", null];
    s.rooms[s.roomId]!.cleared = false;
    s.enemies = [makeEnemy(s, "dummy", 200, 30, 1, 0)];
    stepParty(s, [{ ...EMPTY_INPUT, useSlot: 1 }, EMPTY_INPUT]);
    useSeat(s, 0);
    expect(s.prompt).toEqual({ kind: "revive", ready: false });
    expect(b.hp).toBe(0);
    a.useSlots = ["potion", null];
    s.enemies = [];
    stepParty(s, [{ ...EMPTY_INPUT, useSlot: 1 }, EMPTY_INPUT]);
    expect(b.hp).toBeCloseTo(b.stats.maxHp * 0.35);
    expect(a.useSlots[0]).toBe(null);
  });

  it("3명부터 방이 넓어지고 (방 모양 틀은 가운데, 둘레는 바닥), 혼자 하기는 원래 크기", () => {
    createParty(3, members.slice(0, 2));
    expect([ROOM_COLS, ROOM_ROWS]).toEqual([21, 13]);
    const s = createParty(3, members);
    expect(s.big).toBe(true);
    expect([ROOM_COLS, ROOM_ROWS]).toEqual([25, 15]);
    for (let id = 0; id < ROOM_SHAPES.length; id++) {
      const g = shapeGrid({ id, flip: id % 2 === 1 })!;
      // 둘레 바닥 · 출구 아래 · 입구 위(가운데) 막히지 않음
      for (let c = 1; c < ROOM_COLS - 1; c++) expect(tileAt(g, c, 1)).toBe(TILE_FLOOR);
      for (const x of EXIT_X) expect(tileAt(g, Math.floor(x / 16), 2)).toBe(TILE_FLOOR);
      expect(tileAt(g, Math.floor(ROOM_COLS / 2), ROOM_ROWS - 2)).toBe(TILE_FLOOR);
    }
    play(s, 2000);
    for (const p of allPlayers(s)) expect(p.x).toBeLessThan((ROOM_COLS - 1) * 16);
    createRun(1, "warden");
    expect([ROOM_COLS, ROOM_ROWS]).toEqual([21, 13]);
  });
});
