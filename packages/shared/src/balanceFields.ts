// 관리자 페이지에서 바꿀 수 있는 수치 목록 (묶음 → 항목 → 값). 규칙은 balance.ts
import { CHARACTERS, ENEMIES, WEAPONS } from "./content";
import { PASSIVES, USE_ITEMS } from "./items";
import { SHOP_PRICES } from "./perks";
import { autoGroup } from "./balanceAuto";
import { BOSS_RULE_TABLES, EFFECT_TABLES, ENEMY_RULE_TABLES, RULE_TABLES } from "./balanceTables";
import type { StatKey, StatMod } from "./stats";

export type BalanceGroupId = "characters" | "weapons" | "rules" | "effects" | "enemies" | "bosses" | "passives" | "useItems" | "shop" | TdBalanceGroupId | PwBalanceGroupId;
/** 타워 디펜스 수치 묶음 (tdBalanceFields) */
export type TdBalanceGroupId = "tdRules" | "tdTowers" | "tdEnemies" | "tdBosses" | "tdRounds";
/** 패왕전 수치 묶음 (pwBalanceFields) */
export type PwBalanceGroupId = "pwRoles" | "pwChars" | "pwSkills" | "pwRules";

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
  /** 항목마다 값 목록이 다른 자동 묶음 (balanceAuto.autoGroup). 있으면 fields 대신 */
  rowFields?: (id: string) => BalanceField[];
}

const table = (t: object) => t as Record<string, Record<string, unknown>>;

const TD_ONLY = new Set<string>(["slime", "runner", "bat", "beetle", "golem", "shaman", "eggsac", "wisp"]);
const enemyIds = (boss: boolean) =>
  Object.values(ENEMIES)
    // 타워 디펜스 전용 적은 타워 디펜스 수치에서 따로
    .filter((e) => e.kind !== "dummy" && !TD_ONLY.has(e.kind) && !!e.boss === boss)
    .map((e) => e.kind);

/** 적·보스 묶음: 적 표의 줄 + 기술 수치 표 (같은 객체를 가리켜 바꾸면 바로 게임에) */
function enemyGroup(id: "enemies" | "bosses", kinds: string[], rules: Record<string, unknown>): BalanceGroup {
  const rows: Record<string, unknown> = { ...rules };
  for (const k of kinds) rows[k] = (ENEMIES as Record<string, unknown>)[k];
  return autoGroup(id, rows, { ids: [...kinds, ...Object.keys(rules)] });
}

// 패시브: 능력치 변화는 "능력치.add"·"능력치.mul", 효과 수치는 PERKS의 값 이름 그대로
const STATS: StatKey[] = ["maxHp", "damage", "attackSpeed", "range", "moveSpeed", "projectileSpeed", "luck"];
const modOf = (id: string, key: string): StatMod | undefined => {
  const [stat, how] = key.split(".") as [StatKey, "add" | "mul"];
  const mods = (PASSIVES as Record<string, { mods: readonly StatMod[] }>)[id]?.mods ?? [];
  return mods.find((m) => m.stat === stat && m[how] !== undefined);
};
const passiveGroup: BalanceGroup = {
  id: "passives",
  table: table(PASSIVES),
  ids: Object.keys(PASSIVES),
  list: true,
  fields: [
    // 효과 수치(PERKS)는 '아이템 효과' 묶음에서 (같은 값을 두 곳에서 넣지 않게)
    ...STATS.flatMap((st) => [
      { key: `${st}.add`, min: -999, max: 999, int: st === "maxHp" || st === "luck" },
      { key: `${st}.mul`, min: 0, max: 20 },
    ]),
  ],
  get: (id, key) => {
    const m = modOf(id, key);
    return key.endsWith(".add") ? m?.add : m?.mul;
  },
  set: (id, key, v) => {
    const m = modOf(id, key) as { add?: number; mul?: number } | undefined;
    if (m) m[key.endsWith(".add") ? "add" : "mul"] = v;
  },
};

export const BALANCE_GROUPS: readonly BalanceGroup[] = [
  // 캐릭터·무기: 표 안의 숫자를 모두 (무기 모양 안의 미사일 수·확률 같은 값까지)
  autoGroup("characters", table(CHARACTERS)),
  // 탄을 쏘지 않는 무기(탄 속도 0)는 탄 속도 칸 없음
  autoGroup("weapons", table(WEAPONS), { skip: (k, v) => k === "projectileSpeed" && v === 0 }),
  // 캐릭터마다 규칙 수치(무기·아이템 파일의 표 + 계산 파일의 수치 묶음) · 아이템 효과 수치
  autoGroup("rules", RULE_TABLES),
  autoGroup("effects", EFFECT_TABLES),
  // 적·보스: 표의 숫자 모두 + 기술 수치(계산 파일의 수치 묶음: 보스 BOSS_*, 적 ENEMIES·MINIONS·CRITTERS·HAZARDS)
  enemyGroup("enemies", enemyIds(false), ENEMY_RULE_TABLES),
  enemyGroup("bosses", enemyIds(true), BOSS_RULE_TABLES),
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
