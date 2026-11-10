import { describe, expect, it } from "vitest";
import { CHARACTERS, HIDDEN_CHARACTERS } from "../content";
import { laurelPlayer } from "./allyKit";
import { hiddenUse } from "./hiddenUse";
import { createRun, stepSim } from "./run";
import { makeEnemy } from "./util";
import { EMPTY_INPUT } from "./types";

describe("순례자의 월계선 동료 = 진짜 히든 캐릭터 (sim/allyKit)", () => {
  it.each(HIDDEN_CHARACTERS)("%s 동료: 그 캐릭터 공격으로 적을 때리고, 내 캐릭터·자동 조준은 그대로", (c) => {
    const s = createRun(11, "warden");
    hiddenUse(s, "laurelShip", 0);
    const a = s.player.allies![0]!;
    a.char = c;
    a.weapon = CHARACTERS[c].startWeapon;
    a.pl = laurelPlayer(c, a.weapon, a.x, a.y, 1.5, 1);
    a.hp = a.maxHp = a.pl.stats.maxHp;
    s.rooms[s.roomId]!.cleared = false;
    // 내 캐릭터는 멀리 · 적은 동료 앞에 (체력이 많아 쓰러지지 않게)
    s.player.x = 30;
    s.player.y = 30;
    const e = makeEnemy(s, "slime", a.x + 20, a.y, 200, 999);
    s.enemies = [e];
    const hp = e.hp;
    for (let i = 0; i < 240; i++) {
      stepSim(s, EMPTY_INPUT);
      a.hp = a.maxHp;
      e.x = a.x + 20;
      e.y = a.y;
    }
    expect(e.hp).toBeLessThan(hp);
    expect(s.player.characterId).toBe("warden");
    expect(s.player.allies).toHaveLength(1);
  });

  it("같은 시드면 같은 결과", () => {
    const go = () => {
      const s = createRun(4, "warden");
      hiddenUse(s, "laurelShip", 0);
      s.rooms[s.roomId]!.cleared = false;
      s.enemies = [makeEnemy(s, "slime", s.player.x + 40, s.player.y, 50, 999)];
      for (let i = 0; i < 200; i++) stepSim(s, EMPTY_INPUT);
      const a = s.player.allies![0]!;
      return [a.x, a.y, a.hp, s.enemies[0]?.hp ?? 0];
    };
    expect(go()).toEqual(go());
  });
});
