import { describe, expect, it } from "vitest";
import { damageEnemy, damagePlayer } from "./combat";
import { createRun } from "./index";
import { applyMoon, chance, MOON_RULES as M, moonTick, setActingFoe } from "./moonlight";
import { enemy } from "./perkTestUtil";

describe("달빛 상태이상", () => {
  it("성흔 각성 중 공격은 확정으로 달빛 · 5스택까지 · 5초 뒤 풀림", () => {
    const s = createRun(3, "blast");
    const e = enemy(1, 120, 100, 99999);
    s.enemies = [e];
    damageEnemy(s, e, 1, 1, 0, false);
    expect(e.moon).toBeUndefined();
    s.player.sgAwake = s.player.sgAwakeMax = 100;
    for (let i = 0; i < 8; i++) damageEnemy(s, e, 1, 1, 0, false);
    expect(e.moon).toBe(M.MAX);
    for (let i = 0; i < M.TICKS; i++) moonTick(e);
    expect(e.moon).toBeUndefined();
  });

  it("스택이 높을수록 약점 공격(달빛 피해)이 자주 · 걸린 적이 주는 피해는 약함", () => {
    expect(chance(1)).toBe(M.CHANCE_1);
    expect(chance(5)).toBe(M.CHANCE_5);
    const s = createRun(3, "blast");
    const e = enemy(1, 120, 100, 99999);
    s.enemies = [e];
    applyMoon(e, 5);
    let moon = 0;
    for (let i = 0; i < 200; i++) {
      s.tick++;
      damageEnemy(s, e, 10, 1, 0, false);
      if (e.dotTick === s.tick && (e.dotAmt?.moon ?? 0) > 0) moon++;
    }
    expect(moon).toBeGreaterThan(60);
    expect(moon).toBeLessThan(140);
    const hp = s.player.hp;
    s.player.invulnTicks = 0;
    setActingFoe(e);
    damagePlayer(s, 10);
    setActingFoe(null);
    const weak = hp - s.player.hp;
    s.player.hp = hp;
    s.tick += 200;
    s.player.invulnTicks = 0;
    damagePlayer(s, 10);
    expect(weak).toBeLessThan(hp - s.player.hp);
  });
});
