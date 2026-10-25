import { describe, expect, it } from "vitest";
import { ALL_CHARACTER_IDS } from "../characters";
import { createSwarm } from "./swarm";
import { characterWeapons } from "./loot";
import { evoNova, evoSkill, type SwarmSkill } from "./swarmEvo";
import { makeEnemy } from "./util";

/** 쏘는 기술 (탄이 나가면 됨) */
const SHOTS: readonly SwarmSkill[] = ["barrage", "wave", "bounce", "lance", "fan", "boomerang"];

describe("광야의 새벽 각성 기술", () => {
  it("한 캐릭터의 무기끼리는 각성 기술이 겹치지 않음", () => {
    for (const c of ALL_CHARACTER_IDS) {
      const skills = characterWeapons(c).map((w) => evoSkill(w, c));
      expect(new Set(skills).size, c).toBe(skills.length);
    }
  });

  it("기술 16가지 모두 적에게 피해 (쏘는 기술은 탄이 나감)", () => {
    const seen = new Set<SwarmSkill>();
    for (const c of ALL_CHARACTER_IDS) {
      for (const id of characterWeapons(c)) {
        const skill = evoSkill(id, c);
        if (seen.has(skill)) continue;
        seen.add(skill);
        const s = createSwarm(9, c);
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
        if (SHOTS.includes(skill)) expect(s.projectiles.length, skill).toBeGreaterThan(0);
        else expect(left, skill).toBeLessThan(hp);
      }
    }
    expect(seen.size).toBe(16);
  });
});
