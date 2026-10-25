import { describe, expect, it } from "vitest";
import { createRng, deriveSeed, parseSeed } from "./rng";

describe("시드 랜덤", () => {
  it("같은 시드면 같은 수열", () => {
    const a = createRng(1234);
    const b = createRng(1234);
    for (let i = 0; i < 100; i++) expect(a.nextU32()).toBe(b.nextU32());
  });

  it("다른 시드면 다른 수열", () => {
    const a = createRng(1);
    const b = createRng(2);
    const same = Array.from({ length: 20 }, () => a.nextU32() === b.nextU32());
    expect(same.every(Boolean)).toBe(false);
  });

  it("고정 값 (화면·서버·브라우저가 달라도 같아야 함)", () => {
    const rng = createRng(42);
    expect([rng.nextU32(), rng.nextU32(), rng.nextU32()]).toEqual([1097915203, 1827515267, 13503946]);
  });

  it("int는 범위 안", () => {
    const rng = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = rng.int(3, 6);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(6);
    }
  });

  it("용도별 시드는 서로 독립", () => {
    const seed = 99;
    const reward = createRng(deriveSeed(seed, "floor", 1, "reward"));
    const enemy = createRng(deriveSeed(seed, "floor", 1, "enemy"));
    // 적 쪽에서 랜덤을 많이 써도 보상 쪽 결과는 그대로
    const before = createRng(deriveSeed(seed, "floor", 1, "reward")).nextU32();
    for (let i = 0; i < 500; i++) enemy.nextU32();
    expect(reward.nextU32()).toBe(before);
    expect(deriveSeed(seed, "a")).not.toBe(deriveSeed(seed, "b"));
  });

  it("시드 문자열은 대소문자·공백 무시", () => {
    expect(parseSeed(" abcd1234 ")).toBe(parseSeed("ABCD1234"));
  });
});
