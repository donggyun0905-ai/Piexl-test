import { describe, expect, it } from "vitest";
import { merge3 } from "./cloudMerge";

describe("상점 저장 합치기", () => {
  it("두 기기에서 한 일이 다 남음: 목록은 합치고 숫자는 늘거나 준 만큼 더함", () => {
    const base = { wallet: { spent: 10, owned: ["a"], equipped: { mage: "a" } }, chips: { n: 100, day: "d1" } };
    const local = { wallet: { spent: 15, owned: ["a", "b"], equipped: { mage: "b" } }, chips: { n: 80, day: "d1" } };
    const server = { wallet: { spent: 30, owned: ["a", "c"], equipped: { mage: "a" } }, chips: { n: 150, day: "d2" } };
    expect(merge3(base, local, server)).toEqual({
      wallet: { spent: 35, owned: ["a", "c", "b"], equipped: { mage: "b" } },
      chips: { n: 130, day: "d2" },
    });
  });

  it("처음 합칠 때(기기 연동)는 두 기기 것을 모두 더함, 음수는 0", () => {
    expect(merge3({}, { wallet: { mission: 4 } }, { wallet: { mission: 6 }, fxShop: { owned: ["x"] } })).toEqual({ wallet: { mission: 10 }, fxShop: { owned: ["x"] } });
    expect(merge3({ c: 10 }, { c: 0 }, { c: 5 })).toEqual({ c: 0 });
  });
});
