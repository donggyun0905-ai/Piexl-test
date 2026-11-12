// 피해 출처 이름: sim에서 쓰는 "k:글자키"·"n:이름" 출처가 모두 화면에 이름이 있는지
import { describe, expect, it } from "vitest";
import { TEXT } from "../i18n/text";
import { srcFileName } from "./srcNames";

const SIM = import.meta.glob("../../../../packages/shared/src/sim/*.ts", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

describe("피해 출처 이름", () => {
  it("k:·n: 출처마다 이름이 있음", () => {
    const keys = new Set<string>();
    for (const [f, text] of Object.entries(SIM)) {
      if (f.endsWith(".test.ts")) continue;
      for (const m of text.matchAll(/["`]([kn]):([A-Za-z0-9]+)(\$\{[^}]+\})?["`]/g)) {
        if (m[3]) for (let i = 1; i <= 4; i++) keys.add(`${m[1]}:${m[2]}${i}`);
        else keys.add(`${m[1]}:${m[2]}`);
      }
    }
    expect(keys.size).toBeGreaterThan(20);
    const missing = [...keys].filter((k) => (k.startsWith("k:") ? !(k.slice(2) in TEXT) : srcFileName(k, "ko") === null));
    expect(missing).toEqual([]);
  });
});
