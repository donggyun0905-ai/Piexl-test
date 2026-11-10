import { describe, expect, it } from "vitest";
import { hasNumbers, hideNumbers } from "./RichText";

describe("설명 수치 숨기기 (Shift를 누를 때만 수치)", () => {
  it("괄호 수치는 빠지고 · +/×는 ↑ · 단위 수치는 빠짐 · 그냥 숫자는 그대로", () => {
    expect(hideNumbers("만월 각성 8초: 공격 속도 ×1.35 · 모든 적이 표적 (약점마다 달빛 베기 2스택)")).toBe("만월 각성 ◇: 공격 속도 ↑ · 모든 적이 표적");
    expect(hideNumbers("기본 약점 공격 확률 +5%p")).toBe("기본 약점 공격 확률 ↑");
    expect(hideNumbers("받은 피해의 50% 더")).toBe("받은 피해의 ◇ 더");
    expect(hideNumbers("스킬 1 · 시즌 2")).toBe("스킬 1 · 시즌 2");
    expect(hasNumbers("스킬 1")).toBe(false);
    expect(hasNumbers("피해 30%")).toBe(true);
  });
});
