import { describe, expect, it } from "vitest";
import { BOSS_TIERS, LAST_BOSSES } from "../content";
import { ARENA_LEVELS, arenaCleared } from "./arena";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { ROOM_CX, ROOM_CY } from "../constants";
import { EXIT_X } from "./util";

const arena = () => createRun(4, "warden", [], false, false, true);
const bossesHere = (s: RunState) => s.enemies.filter((e) => !e.noGold).map((e) => e.kind);

/** 보상 방 출구(줄 lane)로 나감 */
function leave(s: RunState, lane = 1): void {
  const from = s.roomId;
  s.player.x = s.player.prevX = EXIT_X[lane]!;
  s.player.y = s.player.prevY = 40;
  for (let i = 0; i < 300 && s.roomId === from; i++) stepSim(s, { ...EMPTY_INPUT, moveY: -100 });
}

/** 방의 보스를 모두 잡음 (궁극기는 쓴 셈) */
function killAll(s: RunState): void {
  for (const e of s.enemies) {
    e.ultDone = true;
    e.hp = 0;
  }
  s.player.invulnTicks = 99999;
  stepSim(s, EMPTY_INPUT);
  stepSim(s, EMPTY_INPUT);
}

/** 계단으로 다음 레벨 */
function stairs(s: RunState): void {
  s.player.x = s.player.prevX = ROOM_CX;
  s.player.y = s.player.prevY = ROOM_CY;
  stepSim(s, { ...EMPTY_INPUT, interact: true });
}

describe("레이드 아레나", () => {
  it("보상 방: 체력 가득 · 이 캐릭터 무기 전부 · 패시브 3개 중 1 · 사용 아이템 3개 중 2, 다른 곳에선 보상 없음", () => {
    const s = arena();
    expect(s.arenaLv).toBe(1);
    const room = s.rooms[s.roomId]!;
    expect(room.pickups.filter((p) => p.kind === "weapon").length).toBeGreaterThan(3);
    const passives = room.pickups.filter((p) => p.kind === "passive");
    expect(passives).toHaveLength(3);
    const uses = room.pickups.filter((p) => p.kind === "use");
    expect(uses).toHaveLength(3);
    // 사용 아이템 두 개를 가지면 남은 하나는 사라짐
    // 지나가기만 해서는 줍지 않음 (F·버튼으로)
    s.player.x = s.player.prevX = uses[0]!.x;
    s.player.y = s.player.prevY = uses[0]!.y;
    stepSim(s, EMPTY_INPUT);
    expect(s.player.useSlots.filter(Boolean)).toHaveLength(0);
    for (const u of uses.slice(0, 2)) {
      s.player.x = s.player.prevX = u.x;
      s.player.y = s.player.prevY = u.y;
      stepSim(s, { ...EMPTY_INPUT, interact: true });
      stepSim(s, EMPTY_INPUT);
    }
    expect(s.player.useSlots.filter(Boolean)).toHaveLength(2);
    expect(room.pickups.filter((p) => p.kind === "use")).toHaveLength(0);
  });

  it("단계마다 1마리 → 2마리 → 3마리 동시 → 승급전(차례로, 사이 보상 없이) · 최종 보스는 골라서 하나씩 · 다 깨면 완료", () => {
    const s = arena();
    for (let stage = 0; stage < 3; stage++) {
      const tier = BOSS_TIERS[stage]!;
      for (let k = 1; k <= 3; k++) {
        leave(s);
        const here = bossesHere(s);
        expect(here, `stage ${stage} lv ${s.arenaLv}`).toHaveLength(k);
        expect(here.every((b) => (tier as readonly string[]).includes(b))).toBe(true);
        killAll(s);
        stairs(s);
      }
      // 승급전: 모든 보스가 한 방에 하나씩, 방 사이 보상 없음
      const seen: string[] = [];
      leave(s);
      for (let i = 0; i < tier.length; i++) {
        seen.push(...bossesHere(s));
        killAll(s);
        expect(s.rooms[s.roomId]!.pickups).toHaveLength(0);
        if (i < tier.length - 1) leave(s);
      }
      expect(seen.sort()).toEqual([...tier].sort());
      stairs(s);
    }
    expect(s.arenaLv).toBe(13);
    expect(arenaCleared(s)).toBe(12);
    // 최종: 출구마다 남은 최종 보스, 고른 보스만 큰 방에
    for (let k = 0; k < 3; k++) {
      const exits = s.map.rooms[s.roomId]!.exits.filter((x) => x >= 0);
      expect(exits).toHaveLength(3 - k);
      const lane = s.map.rooms[s.roomId]!.exits.findIndex((x) => x >= 0);
      leave(s, lane);
      expect(s.roomCols).toBe(29);
      const kind = bossesHere(s)[0]!;
      expect(LAST_BOSSES.includes(kind as never) || kind === "pdark").toBe(true);
      killAll(s);
      stairs(s);
    }
    expect(s.won).toBe(true);
    expect(arenaCleared(s)).toBe(ARENA_LEVELS);
    expect([...(s.arenaDone ?? [])].sort()).toEqual([...LAST_BOSSES].sort());
  });

  it("보스방 출구는 잠기고 체력으로 나갈 수 없음 · 레벨마다 체력 가득", () => {
    const s = arena();
    leave(s);
    s.player.hp = 5;
    s.player.invulnTicks = 99999;
    s.player.x = s.player.prevX = EXIT_X[1]!;
    s.player.y = s.player.prevY = 20;
    stepSim(s, { ...EMPTY_INPUT, moveY: -100, interact: true });
    expect(s.prompt.kind).not.toBe("flee");
    killAll(s);
    stairs(s);
    expect(s.player.hp).toBe(s.player.stats.maxHp);
  });

  it("같은 시드·입력이면 같은 결과", () => {
    const go = () => {
      const s = arena();
      leave(s);
      for (let i = 0; i < 400; i++) stepSim(s, { ...EMPTY_INPUT, attack: true, moveX: i % 80 < 40 ? 100 : -100 });
      return JSON.stringify(s);
    };
    expect(go()).toBe(go());
  });
});
