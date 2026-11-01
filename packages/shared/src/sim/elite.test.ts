import { describe, expect, it } from "vitest";
import { champFade, ELITE_RULES as R, fishDmgMul, makeChamps } from "./elite";
import { createRun } from "./run";
import { makeEnemy } from "./util";

describe("정예 몬스터", () => {
  it("가장 센 몇 마리가 정예 · 땅 물고기 정예는 체력은 조금·피해는 많이", () => {
    const s = createRun(4, "warden");
    const out = [makeEnemy(s, "golem", 50, 50, 1, 30), makeEnemy(s, "crawler", 60, 50, 1, 30), makeEnemy(s, "landfish", 70, 50, 1, 30), makeEnemy(s, "slime", 80, 50, 1, 30)];
    const fishHp = out[2]!.maxHp;
    makeChamps(out, 1);
    expect(out.filter((e) => e.champ)).toHaveLength(R.CHAMPS);
    const fish = out[2]!;
    if (fish.champ) {
      expect(fish.maxHp).toBe(Math.round(fishHp * R.FISH_HP));
      expect(fishDmgMul(fish)).toBe(R.FISH_DMG);
    }
  });

  it("정예만 남으면 풀려서 보통 체력으로 (남은 비율은 그대로)", () => {
    const s = createRun(4, "warden");
    const champ = makeEnemy(s, "golem", 50, 50, 1, 30);
    const base = champ.maxHp;
    makeChamps([champ], 1);
    champ.hp = champ.maxHp / 2;
    const minion = makeEnemy(s, "crawler", 60, 50, 1, 30);
    s.enemies = [champ, minion];
    champFade(s);
    expect(champ.champ).toBe(true);
    s.enemies = [champ];
    champFade(s);
    expect(champ.champ).toBe(false);
    expect(champ.maxHp).toBe(base);
    expect(champ.hp).toBe(Math.round(base / 2));
  });
});
