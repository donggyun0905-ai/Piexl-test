import { describe, expect, it } from "vitest";
import { RUNE_RULES, runeFill } from "./rune";
import { stepSim } from "./index";
import { enemy, FIRE, hero } from "./perkTestUtil";

describe("마법사 마법 문양", () => {
  it("공격마다 마법진에 한 획, 다 새기면 무기에 맞는 큰 마법이 가까운 적에게", () => {
    const s = hero("mage");
    s.player.x = s.player.prevX = 60;
    s.enemies = [enemy(1, 120, 72, 99999)];
    let casts = 0;
    let seen = 0;
    for (let i = 0; i < 600 && casts === 0; i++) {
      stepSim(s, FIRE);
      seen = Math.max(seen, runeFill(s.player));
      casts = s.effects.filter((f) => f.kind === "mgSpell" && f.tint === "nova").length;
    }
    expect(seen).toBeCloseTo((RUNE_RULES.STROKES - 1) / RUNE_RULES.STROKES);
    expect(casts).toBe(1);
    expect(s.player.mgRune).toBe(0);
    // 불꽃 마법은 불태움
    expect(s.enemies[0]!.burnTicks ?? 0).toBeGreaterThan(0);
  });

  it("일반 공격은 약해짐 (다른 캐릭터는 그대로)", () => {
    const s = hero("mage");
    s.enemies = [];
    stepSim(s, FIRE);
    const shot = s.projectiles.find((p) => p.fromPlayer)!;
    expect(shot.damage).toBeCloseTo(s.player.stats.damage * RUNE_RULES.NORMAL_MUL);
    const w = hero("warden");
    expect(w.player.mgRune).toBeUndefined();
  });
});
