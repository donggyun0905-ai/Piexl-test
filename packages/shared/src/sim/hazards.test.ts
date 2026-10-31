import { describe, expect, it } from "vitest";
import { createRun, EMPTY_INPUT, stepSim } from "./index";
import { addGold } from "./combat";
import { addHazard, HAZARD_WARN_TICKS } from "./hazards";
import { makeEnemy } from "./util";

describe("위험 표시 (포격수)", () => {
  it("표시된 자리에 서 있으면 터질 때 피해, 벗어나면 피해 없음", () => {
    const stay = createRun(5, "warden");
    stay.enemies = [makeEnemy(stay, "crawler", 20, 20, 99, 9999)];
    addHazard(stay, stay.player.x, stay.player.y, 14);
    for (let i = 0; i < HAZARD_WARN_TICKS + 2; i++) stepSim(stay, EMPTY_INPUT);
    expect(stay.player.hp).toBe(stay.player.stats.maxHp - 14);
    expect(stay.hazards).toHaveLength(0);

    const dodge = createRun(5, "warden");
    dodge.enemies = [makeEnemy(dodge, "crawler", 20, 20, 99, 9999)];
    addHazard(dodge, dodge.player.x + 80, dodge.player.y, 14);
    for (let i = 0; i < HAZARD_WARN_TICKS + 2; i++) stepSim(dodge, EMPTY_INPUT);
    expect(dodge.player.hp).toBe(dodge.player.stats.maxHp);
  });

  it("포격수는 플레이어 자리에 표시를 남김", () => {
    const s = createRun(5, "warden");
    s.enemies = [makeEnemy(s, "mortar", s.player.x + 90, s.player.y, 1, 1)];
    stepSim(s, EMPTY_INPUT);
    expect(s.hazards).toHaveLength(1);
  });
});

describe("공통 아이템", () => {
  const withPerk = (id: "secondWind" | "regenCharm" | "goldPouch" | "dashCloak") => {
    const s = createRun(7, "warden");
    s.player.passives.push(id);
    s.enemies = [makeEnemy(s, "crawler", 20, 20, 99, 9999)];
    return s;
  };

  it("두 번째 숨: 쓰러질 때 한 번 되살아나고 사라짐", () => {
    const s = withPerk("secondWind");
    s.player.hp = 0.5;
    s.player.invulnTicks = 0;
    s.projectiles.push({ id: 99, fromPlayer: false, x: s.player.x, y: s.player.y, prevX: s.player.x, prevY: s.player.y, r: 3, vx: 0, vy: 0, damage: 50, ticksLeft: 5 });
    stepSim(s, EMPTY_INPUT);
    expect(s.over).toBe(false);
    expect(s.player.hp).toBe(Math.ceil(s.player.stats.maxHp * 0.3));
    expect(s.player.passives).not.toContain("secondWind");
  });

  it("돈 주머니: 얻는 돈 +50%", () => {
    const s = withPerk("goldPouch");
    addGold(s, 10);
    expect(s.goldEarned).toBe(15);
  });

  it("회피 망토: 대시 대기 시간 감소", () => {
    const a = createRun(7, "warden");
    const b = withPerk("dashCloak");
    a.enemies = [makeEnemy(a, "crawler", 20, 20, 99, 9999)];
    stepSim(a, { ...EMPTY_INPUT, dash: true });
    stepSim(b, { ...EMPTY_INPUT, dash: true });
    expect(b.player.dashCooldown).toBeLessThan(a.player.dashCooldown);
  });

  it("재생 부적: 방을 정리하면 체력 회복", () => {
    const s = withPerk("regenCharm");
    s.player.hp = 10;
    s.enemies.length = 0;
    s.map.rooms[s.roomId]!.type = "combat";
    s.rooms[s.roomId]!.cleared = false;
    stepSim(s, EMPTY_INPUT);
    expect(s.player.hp).toBeGreaterThan(10);
  });
});
