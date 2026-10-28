// 패왕전 관리자 페이지에서 바꿀 수 있는 수치 (던전·타워 디펜스와 따로 저장, 주소 /admin/?pw): 역할군 · 캐릭터 능력치 배율 · 스킬 1~4(재사용 대기·피해·범위 등 모든 숫자) · 규칙
import { autoGroup } from "./balanceAuto";
import type { BalanceGroup } from "./balanceFields";
import { CHARACTER_IDS } from "./characters";
import { PW_CHAR } from "./paewangBalance";
import { PW } from "./paewangDefs";
import { PW_KITS } from "./pwKits";
import { PW_ROLE_IDS, PW_ROLE_TABLE } from "./pwRoles";
import { PW_BASIC_RULES } from "./sim/pwBasic";
import { PW_PASSIVE } from "./paewangPassive";

const table = (t: object) => t as Record<string, Record<string, unknown>>;
const mul = (key: string) => ({ key, min: 0.05, max: 5 });

export const PW_BALANCE_GROUPS: readonly BalanceGroup[] = [
  { id: "pwRoles", table: table(PW_ROLE_TABLE), ids: [...CHARACTER_IDS], fields: [{ key: "role", min: 0, max: PW_ROLE_IDS.length - 1, int: true }] },
  { id: "pwChars", table: table(PW_CHAR), ids: [...CHARACTER_IDS], fields: ["hp", "dmg", "taken", "skill", "rate", "range", "move"].map(mul) },
  autoGroup("pwSkills", PW_KITS as Record<string, unknown>, { ids: CHARACTER_IDS.filter((c) => PW_KITS[c]) }),
  autoGroup("pwRules", { rules: PW, basic: PW_BASIC_RULES, passive: PW_PASSIVE }),
];
