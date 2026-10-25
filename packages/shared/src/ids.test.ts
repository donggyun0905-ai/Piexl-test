/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";

// 무기·아이템 표가 여러 파일에 나뉘어 있어, 같은 id가 있으면 펼칠 때 뒤의 것이 앞의 것을 조용히 덮어씀 → 파일끼리 겹치지 않는지 확인
const modules = import.meta.glob<Record<string, unknown>>(["./weapons*.ts", "./items*.ts", "!./**/*.test.ts", "!./itemsSeason2.ts"], { eager: true });

function tablesEndingWith(suffix: string): Map<string, string> {
  const seen = new Map<string, string>();
  const dup: string[] = [];
  for (const [file, mod] of Object.entries(modules)) {
    for (const [name, table] of Object.entries(mod)) {
      if (!name.endsWith(suffix) || !table || typeof table !== "object") continue;
      for (const id of Object.keys(table)) {
        const where = `${file}:${name}`;
        if (seen.has(id) && seen.get(id) !== where) dup.push(`${id} (${seen.get(id)} · ${where})`);
        seen.set(id, where);
      }
    }
  }
  expect(dup).toEqual([]);
  return seen;
}

describe("무기·아이템 id", () => {
  it("무기 id가 파일끼리 겹치지 않음", () => {
    expect(tablesEndingWith("_WEAPONS").size).toBeGreaterThan(100);
  });
  it("아이템 id가 파일끼리 겹치지 않음", () => {
    expect(tablesEndingWith("_PASSIVES").size).toBeGreaterThan(100);
  });
});
