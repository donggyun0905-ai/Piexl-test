import { describe, expect, it } from "vitest";
import { WEAPON_IDS } from "../content";
import { createSwarm } from "./swarm";
import { evoNova, evoSkill, type SwarmSkill } from "./swarmEvo";
import { makeEnemy } from "./util";

describe("광야의 새벽 각성 기술", () => {
  it("무기마다 기술이 정해지고 여섯 기술 모두 적에게 피해", () => {
    const seen = new Set<SwarmSkill>();
    for (const id of WEAPON_IDS) {
      const skill = evoSkill(id);
      if (seen.has(skill)) continue;
      seen.add(skill);
      const s = createSwarm(9, "warden");
      s.player.weaponId = id;
      s.player.svEvo = true;
      s.enemies = [];
      for (let i = 0; i < 6; i++) s.enemies.push(makeEnemy(s, "slime", s.player.x + 20 + i * 4, s.player.y + (i % 2 ? 6 : -6), 50, 0));
      const hp = s.enemies.reduce((a, e) => a + e.hp, 0);
      for (let t = 0; t < 300; t++) {
        s.tick++;
        evoNova(s);
      }
      const left = s.enemies.reduce((a, e) => a + e.hp, 0);
      if (skill === "barrage") expect(s.projectiles.length, skill).toBeGreaterThan(0);
      else expect(left, skill).toBeLessThan(hp);
    }
    expect(seen.size).toBe(6);
  });
});
