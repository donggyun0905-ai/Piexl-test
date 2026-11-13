// 화면 표시용 막힘 기록: 무적이면 blockTick (피해·결과는 그대로)
import { describe, expect, it } from "vitest";
import { damageEnemy } from "./combat";
import { drifter, enemy } from "./perkTestUtil";

describe("막힘 기록", () => {
  it("무적인 적: 피해 없이 blockTick만", () => {
    const s = drifter();
    const e = { ...enemy(1, 100, 100, 50), immune: true };
    s.tick = 42;
    damageEnemy(s, e, 10, 1, 0);
    expect(e.hp).toBe(50);
    expect(e.blockTick).toBe(42);
  });
});
