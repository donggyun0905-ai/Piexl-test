import { describe, expect, it } from "vitest";
import { damageEnemy, dotDamage } from "./combat";
import { srcRun } from "./dmgSrc";
import { drifter, enemy, FIRE, run } from "./perkTestUtil";
import { statusHit } from "./statusHit";

const sum = (by: Record<string, number> = {}) => Object.values(by).reduce((a, b) => a + b, 0);

describe("피해 출처 기록", () => {
  it("감싸지 않은 피해는 기본(무기), 구간 안 피해는 그 패시브, 상태이상은 종류별", () => {
    const s = drifter();
    const e = enemy(1, s.player.x + 20, s.player.y);
    s.enemies = [e];
    damageEnemy(s, e, 10, 1, 0);
    srcRun(s, "echo", () => damageEnemy(s, e, 7, 1, 0));
    dotDamage(s, e, "burn", 3);
    const by = s.player.dmgBy!;
    expect(by[""]).toBeGreaterThan(0);
    expect(by.echo).toBeGreaterThan(0);
    expect(by["d:burn"]).toBeGreaterThan(0);
    expect(sum(by)).toBeCloseTo(9999 - e.hp, 5);
  });
  it("색만 입힌 직접 타격(statusHit)은 한 번만 셈 · 허수아비는 안 셈", () => {
    const s = drifter();
    const e = enemy(1, s.player.x + 20, s.player.y);
    const d = { ...enemy(2, s.player.x + 20, s.player.y), kind: "dummy" as const };
    s.enemies = [e, d];
    statusHit(s, e, "shock", 5);
    damageEnemy(s, d, 5, 1, 0);
    expect(sum(s.player.dmgBy)).toBeCloseTo(9999 - e.hp, 5);
  });
  it("구간 안에서 쏜 내 탄은 출처를 달고 가서 맞을 때 그 출처로 셈", () => {
    const s = drifter();
    const e = enemy(1, s.player.x + 40, s.player.y);
    s.enemies = [e];
    srcRun(s, "echo", () => s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: s.player.x, y: s.player.y, prevX: s.player.x, prevY: s.player.y, r: 3, vx: 4, vy: 0, damage: 5, ticksLeft: 60 }));
    expect(s.projectiles.at(-1)!.src).toBe("echo");
    run(s, 30);
    expect(s.player.dmgBy?.echo).toBeGreaterThan(0);
  });
  it("그냥 공격하면 기본(무기)에 쌓임", () => {
    const s = drifter();
    s.enemies = [enemy(1, s.player.x + 20, s.player.y)];
    run(s, 60, FIRE);
    expect(s.player.dmgBy?.[""]).toBeGreaterThan(0);
  });
});
