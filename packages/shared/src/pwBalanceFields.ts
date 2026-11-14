// 패왕전 관리자 페이지에서 바꿀 수 있는 수치 (던전·타워 디펜스와 따로 저장, 주소 /admin/?pw): 역할군 · 캐릭터 능력치 배율 · 스킬 1~4(재사용 대기·피해·범위 등 모든 숫자) · 규칙
// · 새 대결(pwRules·pwShop): 병사·포탑·집 보스·몬스터 · 성장(쟁탈전·전쟁의 서막·증강) · 점령전 · 기간토마키아 · 집 상점 장비
import { autoGroup } from "./balanceAuto";
import type { BalanceGroup } from "./balanceFields";
import { CHARACTER_IDS } from "./characters";
import { PW_CHAR } from "./paewangBalance";
import { PW, PW_MODE } from "./paewangDefs";
import { PW_KITS } from "./pwKits";
import { PW_ROLE_IDS, PW_ROLE_TABLE } from "./pwRoles";
import { PW_BASIC_RULES } from "./sim/pwBasic";
import { PW_PASSIVE } from "./paewangPassive";
import { PW_ITEMS } from "./pwItems";
import { PW_AUGS, PW_CAP, PW_CONTEST, PW_GROW, PW_UNIT, PW_WAR } from "./pwRules";
import { PW_BASIC, PW_GEAR_FX, PW_LEGEND, PW_SHOP_USES } from "./pwShop";

const table = (t: object) => t as Record<string, Record<string, unknown>>;
const mul = (key: string) => ({ key, min: 0.05, max: 5 });
type Obj = Record<string, unknown>;
const prefixed = (pre: string, t: object): Obj => Object.fromEntries(Object.entries(t).map(([k, v]) => [pre + k, v]));

/** 표의 묶음은 항목 하나씩 + 맨 위 숫자는 'etc' 항목 하나로 (읽고 쓰면 원래 표가 바뀜) */
function rowsOf(t: Obj): Obj {
  const etc: Obj = {};
  for (const k of Object.keys(t)) if (typeof t[k] === "number") Object.defineProperty(etc, k, { enumerable: true, get: () => t[k], set: (v) => (t[k] = v) });
  return { ...Object.fromEntries(Object.entries(t).filter(([, v]) => typeof v === "object")), etc };
}

/** 바꾸면 맵·화면 모양이 어긋나는 값 (기간토 맵 크기·배낭 칸·장비 칸) · 우승 칩은 규칙의 대결 방식 보상에서 */
const FIXED = new Set(["cols", "rows", "inW", "winChips", "bag", "slots"]);

export const PW_BALANCE_GROUPS: readonly BalanceGroup[] = [
  { id: "pwRoles", table: table(PW_ROLE_TABLE), ids: [...CHARACTER_IDS], fields: [{ key: "role", min: 0, max: PW_ROLE_IDS.length - 1, int: true }] },
  { id: "pwChars", table: table(PW_CHAR), ids: [...CHARACTER_IDS], fields: ["hp", "dmg", "taken", "skill", "rate", "range", "move"].map(mul) },
  autoGroup("pwSkills", PW_KITS as Record<string, unknown>, { ids: CHARACTER_IDS.filter((c) => PW_KITS[c]) }),
  autoGroup("pwItems", PW_ITEMS as Record<string, unknown>),
  autoGroup("pwRules", { rules: PW, basic: PW_BASIC_RULES, passive: PW_PASSIVE, modes: PW_MODE }),
  autoGroup("pwUnits", rowsOf(PW_UNIT)),
  autoGroup("pwGrow", { PW_GROW, PW_CONTEST, PW_WAR, ...prefixed("aug_", PW_AUGS) }, { skip: (k) => FIXED.has(k) }),
  autoGroup("pwCapture", { PW_CAP }),
  autoGroup("pwShop", { PW_SHOP_USES, ...PW_BASIC, ...PW_LEGEND, ...prefixed("fx_", PW_GEAR_FX) }),
];
