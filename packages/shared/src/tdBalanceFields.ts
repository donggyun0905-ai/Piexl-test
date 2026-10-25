// 타워 디펜스 관리자 페이지에서 바꿀 수 있는 수치 목록 (던전 수치와 따로 저장). 규칙은 balance.ts
import type { BalanceField, BalanceGroup } from "./balanceFields";
import { TD_BOSSES, TD_MINIONS, TD_RULES, TD_TOWERS, TD_WAVES } from "./tdDefs";

const table = (t: object) => t as Record<string, Record<string, unknown>>;
const n = (key: string, max: number, int = false, min = 0): BalanceField => ({ key, min, max, int });

/** 규칙 값마다 범위 */
const RULE_FIELDS: BalanceField[] = [
  n("lives", 999, true, 1),
  n("startGold", 99999, true),
  n("towerCost", 9999, true),
  n("towerCostStep", 999, true),
  n("levelCost", 9999, true),
  n("levelCostStep", 999, true),
  n("levelDamage", 2),
  n("sellRate", 1),
  n("breakSec", 120, true),
  n("earlyGold", 99, true),
  n("roundGold", 9999, true),
  n("roundGoldStep", 999, true),
  n("hpLinear", 5),
  n("hpCurve", 2),
  { key: "minionCount", min: 0.1, max: 10 },
  n("leakMinion", 99, true),
  n("leakGolem", 99, true),
  n("leakBoss", 99, true),
  { key: "finalSpeed", min: 0.05, max: 5 },
];

const UNIT_FIELDS: BalanceField[] = [n("hp", 999999, true, 1), n("speed", 5), n("gold", 9999, true), { key: "radius", min: 2, max: 24 }, n("shield", 99, true)];

/** 보스 라운드 (5·10·13·15·17·19): 보스 체력 배율 · 보스 사이 간격 */
const BOSS_ROUNDS = Object.fromEntries(TD_WAVES.flatMap((w, i) => (w.bosses ? [[`r${i + 1}`, w.bosses]] : [])));

export const TD_BALANCE_GROUPS: readonly BalanceGroup[] = [
  { id: "tdRules", table: table({ rules: TD_RULES }), ids: ["rules"], list: true, fields: RULE_FIELDS },
  {
    id: "tdTowers",
    table: table(TD_TOWERS),
    ids: Object.keys(TD_TOWERS),
    fields: [
      { key: "damage", min: 0.05, max: 20 },
      { key: "attackSpeed", min: 0.05, max: 20 },
      { key: "range", min: 0.1, max: 10 },
    ],
  },
  { id: "tdEnemies", table: table(TD_MINIONS), ids: Object.keys(TD_MINIONS), fields: UNIT_FIELDS },
  { id: "tdBosses", table: table(TD_BOSSES), ids: Object.keys(TD_BOSSES), fields: UNIT_FIELDS },
  {
    id: "tdRounds",
    table: table(BOSS_ROUNDS),
    ids: Object.keys(BOSS_ROUNDS),
    fields: [
      { key: "hpMul", min: 0.05, max: 200 },
      { key: "gap", min: 1, max: 3600, int: true },
    ],
  },
];
