import { describe, expect, it } from "vitest";
import { ACC_RULES, type AccItem } from "./accDefs";
import { accBase, accTotals, addAcc, canEquip, emptyBag, enhance, enhanceCost, enhanceRate, equip, fixBag, promote, rollCards, setCounts } from "./accRules";
import { createRng } from "./rng";
import { createRaid } from "./sim/raid";
import { allPlayers } from "./sim/party";

const item = (o: Partial<AccItem>): Omit<AccItem, "uid"> => ({ kind: "ring", set: 0, star: 1, lv: 0, opts: [], ringBase: 0, ...o });

describe("레이드 장신구", () => {
  it("보상 상자: 카드 10장 · 1~3성(전설은 5성) · 확률이 대략 63/32/5%", () => {
    const rng = createRng(5);
    const n = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 2000; i++) for (const c of rollCards(() => rng.nextFloat())) n[c.star]!++;
    expect(rollCards(() => rng.nextFloat())).toHaveLength(10);
    expect(n[4]).toBe(0);
    expect(n[1]! / 20000).toBeGreaterThan(0.58);
    expect(n[3]! / 20000).toBeLessThan(0.07);
    expect(n[5]! / 20000).toBeLessThan(0.01);
  });

  it("장착: 종류가 맞아야 함 · 같은 장신구는 두 칸에 못 낌", () => {
    const bag = emptyBag();
    const [a, b, c] = addAcc(bag, [item({}), item({}), item({ set: 1 })]);
    expect(equip(bag, 0, a!.uid)).toBe(true);
    expect(canEquip(bag, 1, b!.uid)).toBe(false);
    expect(canEquip(bag, 1, c!.uid)).toBe(true);
    expect(canEquip(bag, 3, c!.uid)).toBe(false);
  });

  it("승급: 3성 + 같은 종류 3성 4개 → 4성 · 4성 + 같은 장신구 4성 3개 → 5성", () => {
    const bag = emptyBag();
    const [t, ...m] = addAcc(bag, [item({ star: 3 }), ...[1, 2, 3, 4].map((s) => item({ star: 3, set: s }))]);
    expect(promote(bag, t!.uid, m.slice(0, 3).map((x) => x.uid))).toBe(false);
    expect(promote(bag, t!.uid, m.map((x) => x.uid))).toBe(true);
    expect(t!.star).toBe(4);
    expect(bag.items).toHaveLength(1);
    const four = addAcc(bag, [item({ star: 4, set: 0 }), item({ star: 4, set: 0 }), item({ star: 4, set: 2 })]);
    expect(promote(bag, t!.uid, four.map((x) => x.uid))).toBe(false);
    four.push(...addAcc(bag, [item({ star: 4, set: 0 })]));
    expect(promote(bag, t!.uid, [four[0]!.uid, four[1]!.uid, four[3]!.uid])).toBe(true);
    expect(t!.star).toBe(5);
  });

  it("강화: 5성만 · 비용 1만→5만→10만→15만 · 확률 100·85·…·20% 고정 · 실패하면 단계 하락 · 브로치 10강 40%", () => {
    expect([0, 1, 2, 3, 4].map(enhanceCost)).toEqual([10000, 50000, 100000, 150000, 200000]);
    expect([0, 5, 6, 9].map(enhanceRate)).toEqual([1, 0.25, 0.2, 0.2]);
    const it4 = { ...item({ star: 4 }), uid: 1 };
    expect(enhance(it4, () => 0)).toBe(false);
    const it5 = { ...item({ star: 5, lv: 3 }), uid: 2 };
    enhance(it5, () => 0.99);
    expect(it5.lv).toBe(2);
    expect(accBase({ ...item({ kind: "brooch", star: 5, lv: ACC_RULES.enhanceMax }), uid: 3 }).dash).toBeCloseTo(0.4);
  });

  it("세트: 같은 세트 2·3·4개 효과가 쌓임 · 전설은 고른 세트로 셈", () => {
    const list = [item({ kind: "ring", set: 4 }), item({ kind: "necklace", set: 4 }), item({ kind: "earring", set: 4 }), { ...item({ kind: "brooch", set: -1, legend: 4, star: 5 }), legSet: 4 }].map((x, i) => ({ ...x, uid: i }));
    expect(setCounts(list)[4]).toBe(4);
    const t = accTotals(list);
    expect(t.def).toBeCloseTo(5);
    expect(t.atk).toBeCloseTo(1);
    expect(t.taken).toBeCloseTo(-0.1);
    expect(t.undying).toBe(1);
  });

  it("레이드: 장신구 능력치가 그 사람에게만 들어감 (공격력·체력)", () => {
    const plain = createRaid(3, "lucifer", [{ characterId: "warden", unlocks: [] }]);
    const geared = createRaid(3, "lucifer", [{ characterId: "warden", unlocks: [], acc: { atk: 5, hp: 40 } }]);
    expect(allPlayers(geared)[0]!.stats.damage).toBeCloseTo(allPlayers(plain)[0]!.stats.damage + 5);
    expect(allPlayers(geared)[0]!.stats.maxHp).toBe(allPlayers(plain)[0]!.stats.maxHp + 40);
    expect(allPlayers(geared)[1]!.acc).toBeUndefined();
  });

  it("저장본 고치기: 없는 장신구를 낀 칸은 비움", () => {
    const bag = fixBag({ items: [{ ...item({}), uid: 4 }], slots: [4, 9, null, null, null, null], next: 1 });
    expect(bag.slots).toEqual([4, null, null, null, null, null]);
    expect(bag.next).toBe(5);
  });
});
