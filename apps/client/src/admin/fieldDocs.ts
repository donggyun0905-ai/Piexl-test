// 관리자 값 설명 찾기: 코드 주석에서 모은 설명(virtual:balance-docs)에서 묶음·항목·값 이름에 맞는 한국어 설명
// 규칙·적·보스 = 그 표 · 패왕전 스킬 = PW_KITS · 패왕전 규칙 = PW 등 · 그 밖(아이템 효과·무기·타워 디펜스 등)은 모든 표에서 "항목.값" → "항목"
import type { BalanceGroupId } from "@pixel-rogue/shared";
import DOCS from "virtual:balance-docs";

/** 모든 표의 "경로 → 설명" (먼저 나온 것) */
const INDEX: Record<string, string> = {};
for (const t of Object.values(DOCS)) for (const [k, v] of Object.entries(t)) if (k && !(k in INDEX)) INDEX[k] = v;

const PW_RULE_TABLE: Record<string, string> = { rules: "PW", basic: "PW_BASIC_RULES", passive: "PW_PASSIVE", modes: "PW_MODE" };

/** 경로를 위로 올라가며 찾음 ("a.b.c" → "a.b" → "a") */
function up(table: Record<string, string> | undefined, path: string): string | undefined {
  if (!table) return undefined;
  for (let p = path; p; p = p.includes(".") ? p.slice(0, p.lastIndexOf(".")) : "") if (table[p]) return table[p];
  return undefined;
}

/** 값 하나의 설명 (없으면 undefined) */
export function fieldDoc(group: BalanceGroupId, id: string, key: string): string | undefined {
  if (DOCS[id]) return up(DOCS[id], key);
  if (group === "pwSkills") return up(DOCS.PW_KITS, `${id}.${key}`);
  if (group === "pwRules") return up(DOCS[PW_RULE_TABLE[id] ?? ""], key);
  if (group === "pwItems") return up(DOCS.PW_ITEMS, `${id}.${key}`);
  if (group === "pwUnits") return up(DOCS.PW_UNIT, id === "etc" ? key : `${id}.${key}`);
  if (id.startsWith("aug_")) return up(DOCS.PW_AUGS, `${id.slice(4)}.${key}`);
  if (id.startsWith("fx_")) return up(DOCS.PW_GEAR_FX, id.slice(3)) ?? INDEX[`${id.slice(3)}.${key}`];
  // 캐릭터: 표 줄의 설명(근접 중심 등)은 항목 설명으로만 (칸마다 붙이지 않음)
  if (group === "characters") return undefined;
  return INDEX[`${id}.${key}`] ?? (group === "effects" || group === "useItems" ? INDEX[id] : undefined);
}

/** 항목(표) 하나의 설명 */
export function rowDoc(group: BalanceGroupId, id: string): string | undefined {
  if (DOCS[id]?.[""]) return DOCS[id][""];
  if (group === "pwRules") return DOCS[PW_RULE_TABLE[id] ?? ""]?.[""];
  return group === "rules" || group === "enemies" || group === "bosses" ? undefined : INDEX[id];
}
