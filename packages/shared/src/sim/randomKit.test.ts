import { describe, expect, it } from "vitest";
import { CHARACTERS, WEAPONS, type WeaponDef } from "../content";
import { PASSIVES, type PassiveDef } from "../items";
import { createRun } from "./index";
import { raidCleared } from "../raid";

describe("무작위 캐릭터 시작 장비", () => {
  it("직업 무기 · 전용 패시브 하나 · 사용 아이템 2개 · 같은 시드면 같음 · 레이드 제외", () => {
    for (const c of ["warden", "imugi", "apostle", "gunner"] as const) {
      const s = createRun(11, c, [], false, false, false, false, undefined, true);
      const w: WeaponDef = WEAPONS[s.player.weaponId];
      expect(s.player.weaponId).not.toBe(CHARACTERS[c].startWeapon);
      expect(w.exclusive === c || w.exclusive === undefined).toBe(true);
      expect(s.player.passives).toHaveLength(1);
      const def: PassiveDef = PASSIVES[s.player.passives[0]!];
      expect(def.exclusive === c || def.exclusive === undefined).toBe(true);
      expect(s.player.useSlots.every((u) => u !== null)).toBe(true);
      expect(s.player.hp).toBe(s.player.stats.maxHp);
      const t = createRun(11, c, [], false, false, false, false, undefined, true);
      expect(JSON.stringify(t)).toBe(JSON.stringify(s));
      s.won = true;
      s.lastBoss = "dragon";
      s.raidTicks = 100;
      expect(raidCleared(s)).toBe(false);
    }
  });
});
