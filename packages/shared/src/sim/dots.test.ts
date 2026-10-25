import { describe, expect, it } from "vitest";
import { ignite, updateDelayed } from "./combat";
import { applyBleed, updateBleed } from "./gunExtras";
import { createRun } from "./index";
import { enemy } from "./perkTestUtil";
import { starHit } from "./ninja";
import { updateSeals } from "./talisman";
import type { ProjectileState } from "./types";

describe("상태이상 피해 표시 (화면 숫자 색용)", () => {
  it("출혈·화상·저주 피해는 종류와 양이 적에게 기록됨", () => {
    const s = createRun(3, "gunner");
    const e = enemy(1, 100, 72, 1000);
    s.enemies = [e];
    s.tick = 30;
    applyBleed(e);
    updateBleed(s);
    expect(e.dotTick).toBe(30);
    expect(e.dotAmt?.bleed).toBeCloseTo(1000 - e.hp, 5);
    s.tick = 60;
    ignite(e, 10);
    const hp = e.hp;
    updateDelayed(s);
    expect(e.dotAmt?.burn).toBeCloseTo(hp - e.hp - (e.dotAmt?.bleed ?? 0), 5);
    s.tick = 90;
    e.seal = 2;
    e.sealDmg = 3;
    e.sealTicks = 10;
    updateSeals(s);
    expect(e.dotAmt).toEqual({ curse: 6 });
  });

  it("연습장 허수아비도 출혈이 걸려 숫자가 뜸 (체력 100짜리처럼)", () => {
    const s = createRun(3, "gunner");
    const e = { ...enemy(1, 100, 72, 99999), kind: "dummy" as const };
    s.enemies = [e];
    s.tick = 30;
    applyBleed(e);
    updateBleed(s);
    expect(e.dotAmt?.bleed).toBeCloseTo(1, 5);
  });

  it("닌자 독 수리검은 화상이 아니라 독으로 피해·표시", () => {
    const s = createRun(3, "ninja");
    const e = enemy(1, 100, 72, 1000);
    s.enemies = [e];
    starHit(s, { venom: 5 } as ProjectileState, e);
    expect(e.burnTicks ?? 0).toBe(0);
    s.tick = 30;
    updateDelayed(s);
    expect(e.dotAmt).toEqual({ poison: 5 });
  });
});
