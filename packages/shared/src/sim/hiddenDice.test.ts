import { describe, expect, it } from "vitest";
import { menuCode, stationMenu } from "./station";
import { recalcStats } from "./items";
import { hiddenUse } from "./hiddenUse";
import { PICK_OP, TERRA_BOSSES, terraBoss } from "./hiddenDice";
import { petMods } from "./lobbyPet";
import { createRun } from "./run";
import { startFloor } from "./rooms";

describe("히든 아이템 둘째 묶음", () => {
  it("운명의 주사위: 시드가 같으면 같은 눈, 여러 번 굴리면 여러 눈이 나옴", () => {
    const faces = new Set<number>();
    for (let seed = 1; seed <= 40; seed++) {
      const a = createRun(seed, "warden");
      const b = createRun(seed, "warden");
      hiddenUse(a, "fateDice", 0);
      hiddenUse(b, "fateDice", 0);
      const fa = a.effects.find((e) => e.kind === "hdDice")!.size;
      expect(b.effects.find((e) => e.kind === "hdDice")!.size).toBe(fa);
      faces.add(fa);
    }
    expect(faces.size).toBeGreaterThan(3);
  });

  it("저주받은 주사위: 창이 열리고, 고르면 닫히며 맞히면 보상 · 틀리면 저주", () => {
    let win = 0;
    let lose = 0;
    for (let seed = 1; seed <= 60; seed++) {
      const s = createRun(seed, "warden");
      hiddenUse(s, "cursedDice", 0);
      expect(s.player.hdPick).toBe("curse");
      stationMenu(s, menuCode(PICK_OP.curse, 3));
      expect(s.player.hdPick).toBeUndefined();
      if (s.player.curseWin) {
        win++;
        expect(s.player.passives.length).toBeGreaterThanOrEqual(10);
      } else lose++;
    }
    expect(win).toBeGreaterThan(0);
    expect(lose).toBeGreaterThan(win);
  });

  it("테라포밍: 고른 보스가 이 층 보스가 됨 (다음 층은 원래대로)", () => {
    const s = createRun(1, "warden");
    hiddenUse(s, "terraform", 0);
    stationMenu(s, menuCode(PICK_OP.terra, 2));
    expect(terraBoss(s)).toBe(TERRA_BOSSES[2]);
    startFloor(s, 2);
    expect(terraBoss(s)).toBeUndefined();
  });

  it("포탈건: 처음엔 방을 기억하고 아이템이 남음 · 다시 쓰면 그 방으로", () => {
    const s = createRun(1, "warden");
    const home = s.roomId;
    hiddenUse(s, "portalGun", 0);
    expect(s.player.useSlots[0]).toBe("portalGun");
    expect(s.portalMark?.room).toBe(home);
    const other = s.map.rooms.find((r) => r.id !== home)!.id;
    s.roomId = other;
    hiddenUse(s, "portalGun", 0);
    expect(s.roomId).toBe(home);
    expect(s.portalMark).toBeUndefined();
  });

  it("떨어진 신의 날개는 이동 속도 · 피리는 로비 동물 효과를 모두 받음", () => {
    const s = createRun(1, "warden");
    const sp = s.player.stats.moveSpeed;
    s.player.passives = ["fallenWings"];
    recalcStats(s);
    expect(s.player.stats.moveSpeed).toBeGreaterThan(sp);
    const none = petMods(s).length;
    s.player.passives.push("petFlute");
    expect(petMods(s).length).toBeGreaterThan(none);
  });
});
