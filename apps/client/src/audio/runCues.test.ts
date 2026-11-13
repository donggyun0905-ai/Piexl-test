// 게임 중 알림 소리를 언제 내는지: 문 잠김 · 상자·동전 · 벽에 맞은 탄 · 버프 끝·보호막 깨짐 · 체력 꽉 참 · 스킬 준비 · 적 방패
import { createRun, ROOM_MIN_X, type EnemyState, type RunState } from "@pixel-rogue/shared";
import { describe, expect, it } from "vitest";
import { runCues } from "./runCues";
import type { Sfx } from "./sound";

const foe = (id: number): EnemyState => ({ id, kind: "crawler", x: 100, y: 100, prevX: 100, prevY: 100, r: 5, hp: 10, maxHp: 10, timer: 0, phase: "walk", dirX: 0, dirY: 0, hitFlash: 0, count: 0, noGold: false });
const start = () => {
  const run = createRun(3, "drifter");
  run.enemies = [];
  run.projectiles = [];
  run.rooms[run.roomId]!.pickups = [];
  runCues(run, []);
  return run;
};
const step = (run: RunState, n = 20): Sfx[] => {
  run.tick += n;
  const fx: Sfx[] = [];
  runCues(run, fx);
  return fx;
};
const pick = (id: number, kind: "coin" | "weapon") => ({ id, kind, itemId: "x", x: 100, y: 100, group: 0, armed: true, price: 0 });

describe("게임 중 알림 소리", () => {
  it("바닥 아이템: 하나면 종류별, 한꺼번에 둘 이상이면 상자 열림", () => {
    const run = start();
    run.rooms[run.roomId]!.pickups.push(pick(1, "coin"));
    expect(step(run)).toContain("dropCoin");
    run.rooms[run.roomId]!.pickups.push(pick(2, "weapon"), pick(3, "coin"));
    expect(step(run)).toContain("chestOpen");
  });
  it("안 깬 방에 적이 나타나면 문 잠김, 이미 적이 있으면 적 나타남", () => {
    const run = start();
    run.rooms[run.roomId]!.cleared = false;
    run.enemies.push(foe(1));
    expect(step(run)).toContain("doorLock");
    run.enemies.push(foe(2));
    expect(step(run)).toContain("foeSpawn");
  });
  it("방 밖으로 나가 사라진 내 탄은 벽 소리", () => {
    const run = start();
    run.projectiles.push({ id: 7, fromPlayer: true, x: ROOM_MIN_X + 1, y: 100, vx: -3, vy: 0, damage: 1, ticksLeft: 30, r: 2, prevX: 0, prevY: 0 } as never);
    step(run, 1);
    run.projectiles = [];
    expect(step(run, 1)).toContain("wallHit");
  });
  it("버프 끝 · 보호막이 남은 채 꺼지면 깨짐 · 체력 꽉 참 · 3초 넘는 스킬 준비", () => {
    const run = start();
    const p = run.player as unknown as Record<string, number>;
    p.hasteTicks = 120;
    p.shieldTicks = 100;
    p.hp = run.player.hp - 5;
    p.nrSkillCd = 300;
    step(run);
    p.hasteTicks = 0;
    p.shieldTicks = 0;
    p.hp = run.player.stats.maxHp;
    p.nrSkillCd = 0;
    expect(step(run)).toEqual(expect.arrayContaining(["buffEnd", "shieldBreak", "hpFull", "cdReady"]));
  });
  it("방패를 때리면 보호막 소리 · 다 깨지면 깨짐 · 무적인 적은 막힌 소리", () => {
    const run = start();
    const e = { ...foe(1), shield: 2 };
    run.enemies.push(e);
    step(run);
    e.shield = 1;
    expect(step(run)).toContain("hitShield");
    e.shield = 0;
    expect(step(run)).toContain("shieldBreak");
    e.blockTick = run.tick;
    expect(step(run)).toContain("hitImmune");
  });
});
