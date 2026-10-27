// 도감 기록: 만난 적·보스 · 가져 본 무기·패시브·사용 아이템 (이 기기에 저장). 판 진행 중 runTracker가 부름
import type { RunState } from "@pixel-rogue/shared";
import { loadText, saveText } from "../storage";
import { TEST_OPEN } from "../testFlags";

export type CodexKind = "enemy" | "weapon" | "passive" | "use";
type Book = Record<CodexKind, string[]>;

let book: Book | null = null;
let sets: Record<CodexKind, Set<string>> | null = null;

function load(): Record<CodexKind, Set<string>> {
  if (sets) return sets;
  try {
    const raw = JSON.parse(loadText("codex") ?? "{}") as Partial<Book>;
    book = { enemy: raw.enemy ?? [], weapon: raw.weapon ?? [], passive: raw.passive ?? [], use: raw.use ?? [] };
  } catch {
    book = { enemy: [], weapon: [], passive: [], use: [] };
  }
  sets = { enemy: new Set(book.enemy), weapon: new Set(book.weapon), passive: new Set(book.passive), use: new Set(book.use) };
  return sets;
}

/** 도감에 보이는지 (테스트 중에는 전부) */
export const codexSeen = (kind: CodexKind, id: string): boolean => TEST_OPEN || load()[kind].has(id);

/** 지금 판에서 새로 만난 것을 적어 둠 (새로 생겼을 때만 저장) */
export function noteRun(s: RunState): void {
  const st = load();
  let changed = false;
  const add = (kind: CodexKind, id: string | null | undefined) => {
    if (!id || st[kind].has(id)) return;
    st[kind].add(id);
    changed = true;
  };
  for (const e of s.enemies) if (e.kind !== "dummy" && e.kind !== "fighter") add("enemy", e.kind);
  add("weapon", s.player.weaponId);
  for (const id of s.player.passives) add("passive", id);
  for (const id of s.player.useSlots) add("use", id);
  if (changed) saveText("codex", JSON.stringify({ enemy: [...st.enemy], weapon: [...st.weapon], passive: [...st.passive], use: [...st.use] }));
}
