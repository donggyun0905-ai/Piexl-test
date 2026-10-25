import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS, HIDDEN_CHARACTERS, WEAPONS, type WeaponId } from "../content";
import { PASSIVES, type PassiveId } from "../items";
import { STAR } from "../weaponsStar";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { starLinks, starMax } from "./star";
import { enemy, FIRE } from "./perkTestUtil";

/** 별지기로 시작해 무기·아이템을 가진 채, 적 없는 방 */
function gazer(weapon: WeaponId = "starStaff", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "stargazer");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  return s;
}
const attackOnce = (s: RunState) => {
  const n = s.player.attackCount;
  for (let i = 0; i < 300 && s.player.attackCount === n; i++) stepSim(s, FIRE);
};
const held = (id: number, x: number, y: number, hp?: number) => ({ ...enemy(id, x, y, hp), rootTicks: 99999 });
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("별지기 (히든)", () => {
  it("숨은 캐릭터 · 별자리 지팡이로 시작 · 무기 10개 · 전용 아이템 10개", () => {
    expect(HIDDEN_CHARACTERS).toContain("stargazer");
    expect(CHARACTER_IDS).not.toContain("stargazer");
    expect(CHARACTERS.stargazer.startWeapon).toBe("starStaff");
    expect(characterWeapons("stargazer")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((d) => "exclusive" in d && d.exclusive === "stargazer")).toHaveLength(10);
    for (const id of characterWeapons("stargazer")) expect(WEAPONS[id].kind).toBe("star");
  });

  it("공격하면 적 자리에 별이 박혀 때리고, 가까운 별끼리 빛줄기가 이어져 닿은 적을 태움", () => {
    const s = gazer();
    s.enemies = [held(1, 120, 72, 100000)];
    attackOnce(s);
    expect(s.player.stStars).toHaveLength(1);
    expect(lost(s)).toBeGreaterThan(0);
    // 별 둘을 직접 놓아 빛줄기 위에 다른 적
    s.player.stStars = [
      { x: 100, y: 40, left: 999 },
      { x: 150, y: 40, left: 999 },
    ];
    s.enemies.push(held(2, 125, 40, 100000));
    expect(starLinks(s.player)).toHaveLength(1);
    const before = s.enemies[1]!.hp;
    for (let i = 0; i < STAR.lineEvery * 3; i++) stepSim(s, EMPTY_INPUT);
    expect(s.enemies[1]!.hp).toBeLessThan(before);
  });

  it("별이 가득 차면 별자리 완성: 모든 별이 터지고 사라짐 · 초신성은 3개", () => {
    const s = gazer();
    s.enemies = [held(1, 120, 72, 1000000)];
    for (let i = 0; i < starMax(s.player) - 1; i++) attackOnce(s);
    expect(s.player.stStars).toHaveLength(starMax(s.player) - 1);
    const hp = s.enemies[0]!.hp;
    attackOnce(s);
    expect(s.player.stStars).toHaveLength(0);
    expect(hp - s.enemies[0]!.hp).toBeGreaterThan(s.player.stats.damage * STAR.burstMul);
    expect(starMax(gazer("novaHeart").player)).toBe(3);
    expect(starMax(gazer("milkyWay", "extraStar").player)).toBe(8);
  });

  it("쌍둥이 별은 두 개씩 · 별가루는 완성 때 회복 · 방을 옮기면 별이 사라짐", () => {
    const s = gazer("twinStars", "stardust");
    s.enemies = [held(1, 120, 72, 1000000)];
    attackOnce(s);
    expect(s.player.stStars).toHaveLength(2);
    s.player.hp = 10;
    attackOnce(s);
    attackOnce(s);
    expect(s.player.hp).toBeGreaterThan(10);
    attackOnce(s);
    s.player.stWhere = "other";
    stepSim(s, EMPTY_INPUT);
    expect(s.player.stStars).toHaveLength(0);
  });

  it("같은 입력이면 결과가 같음", () => {
    const run = () => {
      const s = createRun(7, "stargazer");
      s.player.weaponId = "meteorShower";
      s.player.passives.push("starfall", "zodiac", "eclipse");
      recalcStats(s);
      for (let i = 0; i < 1200; i++) stepSim(s, { ...EMPTY_INPUT, attack: true, autoAim: true, moveY: i % 200 < 100 ? -100 : 50 });
      return JSON.stringify(s);
    };
    expect(run()).toBe(run());
  });
});
