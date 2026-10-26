import { afterEach, describe, expect, it } from "vitest";
import {
  applyBalance,
  balanceDiff,
  balanceHash,
  cleanBalance,
  currentBalance,
  DEFAULT_BALANCE_HASH,
  mergeBalance,
  withBalance,
} from "./balance";
import { CHARACTERS, ENEMIES, WEAPONS } from "./content";
import { PASSIVES, USE_ITEMS } from "./items";
import { PERKS, SHOP_PRICES } from "./perks";
import { createRun } from "./sim/run";

afterEach(() => {
  applyBalance({});
});

describe("수치 바꾸기", () => {
  it("모르는 값은 버리고 범위 안으로, 기본값과 같으면 뺌", () => {
    const v = cleanBalance({
      characters: { warden: { maxHp: 150.6, damage: 10, bogus: 3 }, nobody: { maxHp: 1 } },
      weapons: { greatblade: { projectileSpeed: 5, arcCos: 3 }, crossbow: { projectileSpeed: 9 } },
      zzz: {},
    });
    expect(v).toEqual({
      characters: { warden: { maxHp: 151 } },
      weapons: { greatblade: { arcCos: 1 }, crossbow: { projectileSpeed: 9 } },
    });
  });

  it("넣으면 게임 표가 바뀌고, 빈 값을 넣으면 처음 값으로", () => {
    const hash = applyBalance({ characters: { warden: { maxHp: 200 } }, bosses: { hulk: { hp: 999 } } });
    expect(CHARACTERS.warden.maxHp).toBe(200);
    expect(ENEMIES.hulk.hp).toBe(999);
    expect(createRun(1, "warden").player.hp).toBe(200);
    expect(currentBalance().hash).toBe(hash);
    expect(applyBalance({})).toBe(DEFAULT_BALANCE_HASH);
    expect(CHARACTERS.warden.maxHp).toBe(120);
    expect(ENEMIES.hulk.hp).toBe(420);
  });

  it("지문은 순서와 상관없이 같음", () => {
    const a = { characters: { warden: { maxHp: 130, luck: 2 } }, weapons: { spear: { range: 40 } } };
    const b = { weapons: { spear: { range: 40 } }, characters: { warden: { luck: 2, maxHp: 130 } } };
    expect(balanceHash(a)).toBe(balanceHash(b));
    expect(balanceHash(a)).not.toBe(balanceHash({ characters: { warden: { maxHp: 131, luck: 2 } } }));
    expect(balanceHash({})).toBe(DEFAULT_BALANCE_HASH);
  });

  it("잠깐 다른 수치로 계산하고 되돌림", () => {
    applyBalance({ weapons: { spear: { range: 50 } } });
    const hp = withBalance({ characters: { mage: { maxHp: 10 } } }, () => createRun(1, "mage").player.hp);
    expect(hp).toBe(10);
    expect(WEAPONS.spear.range).toBe(50);
    expect(CHARACTERS.mage.maxHp).toBe(75);
  });

  it("두 수치 비교 → 고른 것만 옮기기", () => {
    const live = { characters: { warden: { maxHp: 130 } } };
    const beta = { characters: { warden: { maxHp: 140 }, mage: { luck: 3 } } };
    const diff = balanceDiff(live, beta);
    expect(diff).toEqual([
      { group: "characters", id: "warden", key: "maxHp", from: 130, to: 140 },
      { group: "characters", id: "mage", key: "luck", from: 1, to: 3 },
    ]);
    expect(mergeBalance(live, [diff[1]!])).toEqual({ characters: { warden: { maxHp: 130 }, mage: { luck: 3 } } });
    expect(mergeBalance(live, diff)).toEqual(beta);
  });

  it("패시브 능력치·아이템 효과 수치, 사용 아이템, 상점 가격도 넣고 되돌림", () => {
    const v = cleanBalance({
      passives: { sturdyHeart: { "maxHp.add": 35, "maxHp.mul": 2 } },
      effects: { goldPouch: { gold: 2 }, spinCleave: { every: 0 } },
      useItems: { potion: { healRatio: 0.5 }, bomb: { damage: 60 } },
      shop: { price: { passive: 40 } },
    });
    // 없는 값(곱하기가 없는 아이템)은 버리고, 횟수는 1 이상
    expect(v.passives).toEqual({ sturdyHeart: { "maxHp.add": 35 } });
    expect(v.effects).toEqual({ goldPouch: { gold: 2 }, spinCleave: { every: 1 } });
    applyBalance(v);
    expect(PASSIVES.sturdyHeart.mods[0]!.add).toBe(35);
    expect(PERKS.goldPouch.gold).toBe(2);
    expect(PERKS.spinCleave.every).toBe(1);
    expect(USE_ITEMS.potion.healRatio).toBe(0.5);
    expect(SHOP_PRICES.price.passive).toBe(40);
    applyBalance({});
    expect(PASSIVES.sturdyHeart.mods[0]!.add).toBe(20);
    expect(PERKS.goldPouch.gold).toBe(1.5);
    expect(USE_ITEMS.bomb.damage).toBe(45);
    expect(SHOP_PRICES.price.passive).toBe(30);
  });
});
