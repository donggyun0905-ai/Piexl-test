import { describe, expect, it } from "vitest";
import { TICK_RATE } from "../constants";
import { SWARM } from "../swarmDefs";
import { SWARM_MAP_IDS, swarmCoins } from "../swarmMaps";
import { createSwarm, continueSwarm, stepSwarm } from "./swarm";
import { chooseSwarm } from "./swarmLevel";
import { tileAt, TILE_WALL } from "./layout";
import { EMPTY_INPUT, type RunState } from "./types";
import { makeEnemy, roomGrid } from "./util";

function play(s: RunState, n: number): void {
  for (let i = 0; i < n && !s.over; i++) {
    s.player.hp = s.player.stats.maxHp;
    if (!stepSwarm(s, { ...EMPTY_INPUT, autoAim: true, moveX: i % 200 < 100 ? 40 : -40 })) {
      if (s.swarm!.ask) continueSwarm(s, true);
      else chooseSwarm(s, 0);
    }
  }
}

describe("광야의 새벽 맵·난이도·이벤트", () => {
  it("맵마다 건물·바위·물웅덩이 칸 (들판은 없음) · 모든 맵·난이도가 1분 동안 문제없이", () => {
    expect(roomGrid(createSwarm(1, "warden", "plains"))).toBeNull();
    const ruins = createSwarm(1, "warden", "ruins");
    expect(tileAt(roomGrid(ruins)!, 7, 6)).toBe(TILE_WALL);
    for (const map of SWARM_MAP_IDS) {
      for (const level of [0, 2]) {
        const s = createSwarm(5, "drifter", map, level);
        play(s, TICK_RATE * 60);
        expect(s.swarm!.kills, `${map} ${level}`).toBeGreaterThan(0);
      }
    }
  }, 60000);

  it("요새: 나를 돕는 미사일 타워가 가까운 적을 쏨", () => {
    const s = createSwarm(2, "warden", "fort");
    const tw = s.swarm!.towers![0]!;
    s.enemies.push(makeEnemy(s, "slime", tw.x + 40, tw.y, 50, 0));
    let shot = false;
    for (let i = 0; i < 90 && !shot; i++) {
      stepSwarm(s, EMPTY_INPUT);
      shot = s.projectiles.some((p) => p.spirit === "fireball");
    }
    expect(shot).toBe(true);
  });

  it("어려운 난이도일수록 적이 세고, 깨면 이벤트 코인 (처음이 더 많음)", () => {
    expect(swarmCoins("volcano", 2, true)).toBeGreaterThan(swarmCoins("plains", 0, true));
    expect(swarmCoins("plains", 0, true)).toBeGreaterThan(swarmCoins("plains", 0, false));
  });

  it("보스: 1·2·3단계 둘씩 + 최종 보스, 최종을 잡으면 계속할지 묻고 멈춤 · 계속하면 끝없이", () => {
    expect(SWARM.bossSec).toHaveLength(7);
    const s = createSwarm(9, "warden");
    s.tick = SWARM.bossSec[6]! * TICK_RATE - 1;
    s.swarm!.bosses = 6;
    stepSwarm(s, EMPTY_INPUT);
    const fin = s.enemies.find((e) => e.id === s.swarm!.finalId)!;
    expect(fin).toBeDefined();
    fin.hp = 0;
    stepSwarm(s, EMPTY_INPUT);
    expect(s.won).toBe(true);
    expect(s.swarm!.ask).toBe(true);
    expect(stepSwarm(s, EMPTY_INPUT)).toBe(false);
    continueSwarm(s, true);
    expect(s.swarm!.endless).toBe(true);
    s.tick += SWARM.endlessEvery * TICK_RATE + 10;
    stepSwarm(s, EMPTY_INPUT);
    expect(s.swarm!.more).toBe(1);
  });

  it("특수 이벤트: 구출 — 아이에게 닿으면 성공하고 내 앞에 아이템 셋", () => {
    const s = createSwarm(4, "warden");
    s.tick = SWARM.events.first * TICK_RATE;
    for (let i = 0; i < 400 && s.swarm!.event?.kind !== "rescue"; i++) {
      s.swarm!.event = undefined;
      s.swarm!.nextEvent = s.tick;
      s.tick += SWARM.events.every * TICK_RATE;
      stepSwarm(s, EMPTY_INPUT);
    }
    const ev = s.swarm!.event!;
    expect(ev.kind).toBe("rescue");
    const drops = s.swarm!.drops.length;
    s.player.x = s.player.prevX = ev.x;
    s.player.y = s.player.prevY = ev.y;
    stepSwarm(s, EMPTY_INPUT);
    expect(s.swarm!.eventEnd?.ok).toBe(true);
    expect(s.swarm!.drops.length).toBe(drops + SWARM.events.rewards);
  });

  it("악의 사도: 고기를 먹으면 체력이 깎이고, 영혼은 적을 쓰러뜨려도 가끔만", () => {
    const s = createSwarm(6, "apostle");
    s.player.hp = 50;
    s.swarm!.drops.push({ id: 999, x: s.player.x, y: s.player.y, kind: "heal" });
    stepSwarm(s, EMPTY_INPUT);
    expect(s.player.hp).toBeLessThan(50);
    play(s, TICK_RATE * 40);
    expect(s.swarm!.kills).toBeGreaterThan(20);
    expect((s.player.apSouls ?? []).length + (s.player.apEaten ?? 0)).toBeLessThan(s.swarm!.kills * 0.5);
  });
});

