// 게임 수치 바꾸기 (관리자 페이지). 기본값과 다른 값만 { 묶음: { 항목: { 값 이름: 숫자 } } }로 주고받고,
// 게임이 읽는 표(CHARACTERS·WEAPONS·ENEMIES 등)에 그대로 넣음 → 게임 계산 코드는 그대로.
// 같은 수치 = 같은 지문(hash). 일일 도전 기록·배틀·협동 방은 지문으로 어떤 수치로 했는지 맞춤
// 수치 세트는 둘: 던전(BALANCE_GROUPS) · 타워 디펜스(TD_BALANCE_GROUPS). 서로 섞이지 않고 서버에도 따로 저장
import { BALANCE_GROUPS, type BalanceField, type BalanceGroup } from "./balanceFields";
import { TD_BALANCE_GROUPS } from "./tdBalanceFields";

export * from "./balanceFields";
export { TD_BALANCE_GROUPS } from "./tdBalanceFields";

export type BalanceValues = Record<string, Record<string, Record<string, number>>>;

/** 수치를 하나도 안 바꿨을 때의 지문 */
export const DEFAULT_BALANCE_HASH = "default";

export interface BalanceChange {
  group: string;
  id: string;
  key: string;
  /** 바꾸기 전 / 뒤 (기본값 포함한 실제 값) */
  from: number;
  to: number;
}

/** 수치 세트 하나 (묶음 목록 + 처음 값 + 넣기·다듬기·비교) */
export interface BalanceSet {
  groups: readonly BalanceGroup[];
  balanceDefault: (group: string, id: string, key: string) => number | undefined;
  balanceFields: (g: BalanceGroup, id: string) => BalanceField[];
  cleanBalance: (raw: unknown) => BalanceValues;
  balanceHash: (values: BalanceValues) => string;
  currentBalance: () => { values: BalanceValues; hash: string };
  applyBalance: (raw: unknown) => string;
  withBalance: <T>(values: BalanceValues, fn: () => T) => T;
  balanceDiff: (from: BalanceValues, to: BalanceValues) => BalanceChange[];
  mergeBalance: (base: BalanceValues, changes: readonly BalanceChange[]) => BalanceValues;
}

/** 게임 표에 들어 있는 값 */
function read(g: BalanceGroup, id: string, key: string): unknown {
  return g.get ? g.get(id, key) : g.table[id]?.[key];
}

function clampField(f: BalanceField, v: number): number {
  const n = f.int ? Math.round(v) : Math.round(v * 10000) / 10000;
  return n < f.min ? f.min : n > f.max ? f.max : n;
}

/** 순서와 상관없이 같은 값이면 같은 글자 */
function canonical(values: BalanceValues): string {
  const parts: string[] = [];
  for (const g of Object.keys(values).sort()) {
    for (const id of Object.keys(values[g]!).sort()) {
      for (const k of Object.keys(values[g]![id]!).sort()) parts.push(`${g}/${id}/${k}=${values[g]![id]![k]}`);
    }
  }
  return parts.join(";");
}

/** 수치 지문 (8글자). 바꾼 값이 없으면 "default" */
function hashOf(values: BalanceValues): string {
  const text = canonical(values);
  if (!text) return DEFAULT_BALANCE_HASH;
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

/** 묶음 목록으로 수치 세트 만들기 (처음 값은 지금 표에 적힌 값) */
export function createBalanceSet(groups: readonly BalanceGroup[]): BalanceSet {
  const DEFAULTS = new Map<string, number>();
  for (const g of groups) {
    for (const id of g.ids) {
      for (const f of g.rowFields ? g.rowFields(id) : g.fields) {
        const v = read(g, id, f.key);
        if (typeof v === "number") DEFAULTS.set(`${g.id}/${id}/${f.key}`, v);
      }
    }
  }
  const balanceDefault = (group: string, id: string, key: string) => DEFAULTS.get(`${group}/${id}/${key}`);
  const balanceFields = (g: BalanceGroup, id: string): BalanceField[] => {
    const row = g.table[id];
    if (!row) return [];
    if (g.rowFields) return g.rowFields(id);
    return g.fields.filter((f) => DEFAULTS.has(`${g.id}/${id}/${f.key}`) && (!f.when || f.when(row)));
  };
  /** 받은 값 다듬기: 모르는 항목은 버리고, 범위 안으로, 기본값과 같은 값은 뺌 */
  const cleanBalance = (raw: unknown): BalanceValues => {
    const out: BalanceValues = {};
    if (!raw || typeof raw !== "object") return out;
    const src = raw as Record<string, Record<string, Record<string, unknown>> | undefined>;
    for (const g of groups) {
      for (const id of g.ids) {
        const row = src[g.id]?.[id];
        if (!row || typeof row !== "object") continue;
        for (const f of balanceFields(g, id)) {
          const v = row[f.key];
          if (typeof v !== "number" || !Number.isFinite(v)) continue;
          const n = clampField(f, v);
          if (n === balanceDefault(g.id, id, f.key)) continue;
          ((out[g.id] ??= {})[id] ??= {})[f.key] = n;
        }
      }
    }
    return out;
  };
  let current: { values: BalanceValues; hash: string } = { values: {}, hash: DEFAULT_BALANCE_HASH };
  /** 수치를 게임 표에 넣음 (없는 값은 처음 값으로 되돌림). 판 도중에는 부르지 않기 */
  const applyBalance = (raw: unknown): string => {
    const values = cleanBalance(raw);
    for (const g of groups) {
      for (const id of g.ids) {
        for (const f of balanceFields(g, id)) {
          const v = values[g.id]?.[id]?.[f.key] ?? balanceDefault(g.id, id, f.key)!;
          if (g.set) g.set(id, f.key, v);
          else g.table[id]![f.key] = v;
        }
      }
    }
    current = { values, hash: hashOf(values) };
    return current.hash;
  };
  /** 두 수치에서 다른 값 목록 (from → to) */
  const balanceDiff = (from: BalanceValues, to: BalanceValues): BalanceChange[] => {
    const out: BalanceChange[] = [];
    for (const g of groups) {
      for (const id of g.ids) {
        for (const f of balanceFields(g, id)) {
          const d = balanceDefault(g.id, id, f.key)!;
          const a = from[g.id]?.[id]?.[f.key] ?? d;
          const b = to[g.id]?.[id]?.[f.key] ?? d;
          if (a !== b) out.push({ group: g.id, id, key: f.key, from: a, to: b });
        }
      }
    }
    return out;
  };
  return {
    groups,
    balanceDefault,
    balanceFields,
    cleanBalance,
    balanceHash: hashOf,
    currentBalance: () => current,
    applyBalance,
    /** 잠깐 다른 수치로 계산하고 원래대로 (서버의 기록 다시 돌리기) */
    withBalance: (values, fn) => {
      const prev = current.values;
      applyBalance(values);
      try {
        return fn();
      } finally {
        applyBalance(prev);
      }
    },
    balanceDiff,
    /** 바뀐 값 중 고른 것만 base에 덮어씀 */
    mergeBalance: (base, changes) => {
      const out: BalanceValues = JSON.parse(JSON.stringify(base));
      for (const c of changes) ((out[c.group] ??= {})[c.id] ??= {})[c.key] = c.to;
      return cleanBalance(out);
    },
  };
}

/** 던전 수치 (캐릭터·무기·적·보스·패시브·사용 아이템·상점) */
export const DUNGEON_BALANCE = createBalanceSet(BALANCE_GROUPS);
/** 타워 디펜스 수치 (규칙·타워·적·보스·보스 라운드) */
export const TD_BALANCE = createBalanceSet(TD_BALANCE_GROUPS);

export const { balanceDefault, balanceFields, cleanBalance, balanceHash, currentBalance, applyBalance, withBalance, balanceDiff, mergeBalance } = DUNGEON_BALANCE;
