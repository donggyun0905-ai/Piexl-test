// 관리자 페이지에서 바꿀 수 있는 수치 목록 (묶음 → 항목 → 값). 규칙은 balance.ts
import { CHARACTERS, ENEMIES, WEAPONS } from "./content";
import { PASSIVES, USE_ITEMS } from "./items";
import { PERKS, SHOP_PRICES } from "./perks";
import type { StatKey, StatMod } from "./stats";

export type BalanceGroupId = "characters" | "weapons" | "enemies" | "bosses" | "passives" | "useItems" | "shop" | TdBalanceGroupId;
/** 타워 디펜스 수치 묶음 (tdBalanceFields) */
export type TdBalanceGroupId = "tdRules" | "tdTowers" | "tdEnemies" | "tdBosses" | "tdRounds";

export interface BalanceField {
  key: string;
  min: number;
  max: number;
  /** 정수만 */
  int?: boolean;
  /** 이 항목에만 있는 값 (없으면 기본값이 숫자인 항목 모두) */
  when?: (row: Record<string, unknown>) => boolean;
}

export interface BalanceGroup {
  id: BalanceGroupId;
  /** 실제 게임이 읽는 표 (값을 이 표에 바로 넣음) */
  table: Record<string, Record<string, unknown>>;
  ids: string[];
  fields: BalanceField[];
  /** 항목마다 값이 달라 표 대신 항목별 목록으로 보여 줌 */
  list?: true;
  /** 표가 아닌 곳에 있는 값 읽기·넣기 (패시브 능력치처럼). 없으면 table[id][key] */
  get?: (id: string, key: string) => number | undefined;
  set?: (id: string, key: string, v: number) => void;
}

const table = (t: object) => t as Record<string, Record<string, unknown>>;
/** 탄을 쏘는 무기만 (근접 등은 0) */
const shoots = (r: Record<string, unknown>) => typeof r.projectileSpeed === "number" && r.projectileSpeed > 0;

const enemyFields: BalanceField[] = [
  { key: "hp", min: 1, max: 99999, int: true },
  { key: "speed", min: 0, max: 5 },
  { key: "contactDamage", min: 0, max: 999, int: true },
  { key: "gold", min: 0, max: 999, int: true },
  { key: "radius", min: 2, max: 30 },
  { key: "shield", min: 0, max: 99, int: true },
  { key: "parry", min: 0, max: 1 },
];

const TD_ONLY = new Set<string>(["slime", "runner", "bat", "beetle", "golem", "shaman", "eggsac", "wisp"]);
const enemyIds = (boss: boolean) =>
  Object.values(ENEMIES)
    // 타워 디펜스 전용 적은 타워 디펜스 수치에서 따로
    .filter((e) => e.kind !== "dummy" && !TD_ONLY.has(e.kind) && !!e.boss === boss)
    .map((e) => e.kind);

// 패시브: 능력치 변화는 "능력치.add"·"능력치.mul", 효과 수치는 PERKS의 값 이름 그대로
const STATS: StatKey[] = ["maxHp", "damage", "attackSpeed", "range", "moveSpeed", "projectileSpeed", "luck"];
const modOf = (id: string, key: string): StatMod | undefined => {
  const [stat, how] = key.split(".") as [StatKey, "add" | "mul"];
  const mods = (PASSIVES as Record<string, { mods: readonly StatMod[] }>)[id]?.mods ?? [];
  return mods.find((m) => m.stat === stat && m[how] !== undefined);
};
const perkOf = (id: string) => (PERKS as Record<string, Record<string, number>>)[id];

/** 효과 수치 이름과 범위 (정수 = 횟수·틱) */
const PERK_FIELDS: BalanceField[] = [
  ...["hp", "heal", "gold", "cooldown", "damage", "turn", "speed", "below", "invuln", "taken", "blast", "splash"].map((key) => ({ key, min: 0, max: 100 })),
  ...["reach", "radius", "push"].map((key) => ({ key, min: 0, max: 400 })),
  { key: "chance", min: 0, max: 1 },
  { key: "mul", min: 0, max: 20 },
  ...["bounces", "pierce", "stacks"].map((key) => ({ key, min: 0, max: 50, int: true })),
  ...["every", "hits"].map((key) => ({ key, min: 1, max: 50, int: true })),
  { key: "ticks", min: 0, max: 3600, int: true },
];

const passiveGroup: BalanceGroup = {
  id: "passives",
  table: table(PASSIVES),
  ids: Object.keys(PASSIVES),
  list: true,
  fields: [
    ...STATS.flatMap((st) => [
      { key: `${st}.add`, min: -999, max: 999, int: st === "maxHp" || st === "luck" },
      { key: `${st}.mul`, min: 0, max: 20 },
    ]),
    ...PERK_FIELDS,
  ],
  get: (id, key) => {
    if (key.includes(".")) {
      const m = modOf(id, key);
      return key.endsWith(".add") ? m?.add : m?.mul;
    }
    return perkOf(id)?.[key];
  },
  set: (id, key, v) => {
    if (!key.includes(".")) {
      const row = perkOf(id);
      if (row) row[key] = v;
      return;
    }
    const m = modOf(id, key) as { add?: number; mul?: number } | undefined;
    if (m) m[key.endsWith(".add") ? "add" : "mul"] = v;
  },
};

export const BALANCE_GROUPS: readonly BalanceGroup[] = [
  {
    id: "characters",
    table: table(CHARACTERS),
    ids: Object.keys(CHARACTERS),
    fields: [
      { key: "maxHp", min: 1, max: 999, int: true },
      { key: "damage", min: 0.1, max: 999 },
      { key: "moveSpeed", min: 0.1, max: 5 },
      { key: "luck", min: -10, max: 20, int: true },
    ],
  },
  {
    id: "weapons",
    table: table(WEAPONS),
    ids: Object.keys(WEAPONS),
    fields: [
      { key: "damageMul", min: 0, max: 20 },
      { key: "attackSpeed", min: 0.1, max: 20 },
      { key: "range", min: 4, max: 400 },
      { key: "projectileSpeed", min: 0.3, max: 20, when: shoots },
      { key: "arcCos", min: -1, max: 1 },
      { key: "blast", min: 0, max: 200 },
      { key: "pierce", min: 0, max: 20, int: true },
    ],
  },
  { id: "enemies", table: table(ENEMIES), ids: enemyIds(false), fields: enemyFields },
  { id: "bosses", table: table(ENEMIES), ids: enemyIds(true), fields: enemyFields },
  passiveGroup,
  {
    id: "useItems",
    table: table(USE_ITEMS),
    ids: Object.keys(USE_ITEMS),
    fields: [
      { key: "healRatio", min: 0, max: 1 },
      { key: "damage", min: 0, max: 9999 },
      { key: "radius", min: 0, max: 400 },
      { key: "ticks", min: 0, max: 3600, int: true },
    ],
  },
  {
    id: "shop",
    table: table(SHOP_PRICES),
    ids: ["price"],
    list: true,
    fields: [
      ...["passive", "weapon", "use", "potion", "elixir", "reroll", "rerollStep", "perFloor"].map((key) => ({ key, min: 0, max: 999, int: true })),
      { key: "luckDiscount", min: 0, max: 1 },
      { key: "maxDiscount", min: 0, max: 0.95 },
    ],
  },
];
