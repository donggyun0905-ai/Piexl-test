// 처음 장비: 한 번만 6개를 주고 6칸에 모두 낌 · 투력이 오름
import { describe, expect, it, vi } from "vitest";
import { loadBag } from "../event/acc/accStore";
import { myPower } from "../world/worldPlayer";
import { grantStarterKit } from "./starterKit";

// 브라우저 저장소 대신 메모리
const mem = new Map<string, string>();
vi.stubGlobal("localStorage", { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) });

describe("처음 장비", () => {
  it("1성 6개를 주고 모두 낌 · 두 번은 안 줌", () => {
    const before = myPower();
    expect(grantStarterKit()).toBe(true);
    const bag = loadBag();
    expect(bag.items.filter((i) => i.star === 1)).toHaveLength(6);
    expect(bag.slots.every((u) => u !== null)).toBe(true);
    expect(myPower()).toBeGreaterThan(before);
    console.log("처음 장비 투력", before, "→", myPower());
    expect(grantStarterKit()).toBe(false);
    expect(loadBag().items).toHaveLength(6);
  });
});
