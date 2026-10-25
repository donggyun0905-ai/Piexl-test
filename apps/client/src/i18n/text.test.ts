import { describe, expect, it } from "vitest";
import { TEXT, TEXT_PARTS } from "./text";

describe("화면 글자", () => {
  it("파일끼리 키가 겹치지 않음", () => {
    const total = TEXT_PARTS.reduce((n, part) => n + Object.keys(part).length, 0);
    expect(Object.keys(TEXT).length).toBe(total);
  });
  it("모든 글자에 한·영·일이 있음", () => {
    for (const v of Object.values(TEXT)) for (const l of ["ko", "en", "ja"] as const) expect(v[l]).toBeTruthy();
  });
});
