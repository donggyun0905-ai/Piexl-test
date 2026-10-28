import { describe, expect, it } from "vitest";
import { damagePlayer } from "./combat";
import { createRun, EMPTY_INPUT, stepSim } from "./index";
import { ambushCut } from "./origin";
import { FIRE, enemy, drifter, hero, run } from "./perkTestUtil";

describe("처음 두 캐릭터 특징", () => {
  it("떠돌이 기습: 패시브 없이도 대시 직후 첫 공격만 2배", () => {
    const s = drifter();
    stepSim(s, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    run(s, 12);
    stepSim(s, FIRE);
    expect(s.projectiles[0]!.damage).toBeCloseTo(s.player.stats.damage * 2);
    expect(s.projectiles[0]!.hpCut).toBeUndefined();
    // 다른 캐릭터는 대시해도 그대로
    const w = createRun(1, "warden");
    stepSim(w, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    run(w, 12);
    expect(w.player.ambushTicks).toBe(0);
  });

  it("기습 패시브의 체력 비례 피해: 보스는 덜, 공격력의 4배까지", () => {
    const s = drifter("ambush");
    const small = enemy(1, 0, 0, 100);
    expect(ambushCut(s.player, small, 0.06)).toBeCloseTo(6);
    expect(ambushCut(s.player, enemy(2, 0, 0, 99999), 0.06)).toBeCloseTo(s.player.stats.damage * 4);
    expect(ambushCut(s.player, small, undefined)).toBe(0);
  });

  it("파수꾼 반격: 맞은 뒤 첫 휘두르기는 한 바퀴 베기 + 1.5배, 패시브면 2배", () => {
    for (const [perks, mul] of [[[], 1.5], [["counterGuard"], 2]] as const) {
      const s = hero("warden", ...perks);
      damagePlayer(s, 5);
      s.player.invulnTicks = 0;
      // 뒤에 있는 적도 맞음 (반격의 방패 충격파 거리 밖)
      s.enemies = [enemy(1, s.player.x - 18, s.player.y)];
      const hp = s.enemies[0]!.hp;
      stepSim(s, FIRE);
      expect(hp - s.enemies[0]!.hp).toBeCloseTo(s.player.stats.damage * mul);
      expect(s.player.counterTicks).toBe(0);
    }
  });
});
