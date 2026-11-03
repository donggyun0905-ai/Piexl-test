import { describe, expect, it } from "vitest";
import { USE_ITEMS } from "./items";
import { itemVal, PW_ITEMS } from "./pwItems";

describe("패왕전 사용 아이템", () => {
  it("패왕전은 따로 (폭탄 20), 던전은 USE_ITEMS", () => {
    expect(itemVal(true, "bomb").damage).toBe(PW_ITEMS.bomb.damage);
    expect(itemVal(true, "bomb").damage).toBe(20);
    expect(itemVal(false, "bomb").damage).toBe(USE_ITEMS.bomb.damage);
    expect(itemVal(false, "potion").heal).toBe(USE_ITEMS.potion.heal);
  });
});
