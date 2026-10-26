// 관리자 수치 자동 찾기: 표 안의 숫자를 모두(겹친 객체·배열 안까지) 찾아 "a.b.0" 같은 길로 읽고 쓰고, 범위는 처음 값으로 정함
import type { BalanceField, BalanceGroup, BalanceGroupId } from "./balanceFields";

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null;

/** 객체 안 숫자의 길 목록 ("missiles.chance", "crits.0") */
export function numericPaths(obj: unknown, prefix = "", depth = 0): string[] {
  if (!isObj(obj) || depth > 4) return [];
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "number" && Number.isFinite(v)) out.push(p);
    else if (isObj(v)) out.push(...numericPaths(v, p, depth + 1));
  }
  return out;
}

export function getPath(obj: unknown, path: string): number | undefined {
  let cur: unknown = obj;
  for (const k of path.split(".")) {
    if (!isObj(cur)) return undefined;
    cur = cur[k];
  }
  return typeof cur === "number" ? cur : undefined;
}

export function setPath(obj: unknown, path: string, v: number): void {
  const keys = path.split(".");
  let cur: unknown = obj;
  for (const k of keys.slice(0, -1)) {
    if (!isObj(cur)) return;
    cur = cur[k];
  }
  if (isObj(cur)) cur[keys[keys.length - 1]!] = v;
}

/** 뜻이 정해진 값은 원래 범위 그대로 (휘두르는 폭은 cos라 -1~1 등) */
const KNOWN: Record<string, Omit<BalanceField, "key">> = {
  arcCos: { min: -1, max: 1 },
  maxHp: { min: 1, max: 999, int: true },
  damageMul: { min: 0, max: 20 },
  attackSpeed: { min: 0.1, max: 20 },
  range: { min: 4, max: 400 },
  luck: { min: -10, max: 20, int: true },
  // 추가 기본 스탯 (처음 값이 0이라 범위를 따로)
  critChance: { min: 0, max: 1 },
  critDamage: { min: 1, max: 10 },
  defense: { min: 0, max: 500, int: true },
  reduction: { min: 0, max: 0.9 },
  dodge: { min: 0, max: 0.9 },
  regen: { min: 0, max: 500 },
  lifesteal: { min: 0, max: 1 },
  sharpness: { min: 0, max: 1 },
  statusPower: { min: 0, max: 10 },
  goldGain: { min: 0, max: 10 },
};

/** 처음 값과 이름으로 범위 정하기: 확률은 0~1, 배율·속도는 소수, 그 밖의 정수는 정수 · 처음 값의 5배까지 */
export function autoField(key: string, v: number): BalanceField {
  const last = key.split(".").pop() ?? key;
  if (!key.includes(".") && KNOWN[key]) return { key, ...KNOWN[key] };
  if (/chance|Chance|odds|Odds/.test(last) && v >= 0 && v <= 1) return { key, min: 0, max: 1 };
  const decimal = /mul|Mul|ratio|Ratio|speed|Speed|scale|Scale|rate|Rate|slow|Slow|turn|Turn|taken|Taken/.test(last);
  const int = Number.isInteger(v) && !decimal;
  const big = Math.max(Math.abs(v) * 5, int ? 10 : 2);
  const min = v < 0 ? -big : int ? (v >= 1 && /every|Every|max|Max|gap|Gap/.test(last) ? 1 : 0) : /speed|Speed/.test(last) && v > 0 ? 0.05 : 0;
  return { key, min, max: int ? Math.ceil(big) : Math.round(big * 1000) / 1000, ...(int ? { int: true } : {}) };
}

/** 표 하나를 자동 묶음으로 (항목마다 그 항목에 있는 숫자만) */
export function autoGroup(id: BalanceGroupId, table: Record<string, unknown>, opts: { ids?: string[]; skip?: (key: string, v: number) => boolean } = {}): BalanceGroup {
  const ids = opts.ids ?? Object.keys(table);
  const fields = new Map<string, BalanceField[]>();
  for (const rid of ids) {
    const row = table[rid];
    fields.set(
      rid,
      numericPaths(row)
        .filter((k) => !opts.skip?.(k, getPath(row, k)!))
        .map((k) => autoField(k, getPath(row, k)!)),
    );
  }
  return {
    id,
    table: table as Record<string, Record<string, unknown>>,
    ids,
    fields: [],
    list: true,
    rowFields: (rid) => fields.get(rid) ?? [],
    get: (rid, key) => getPath(table[rid], key),
    set: (rid, key, v) => setPath(table[rid], key, v),
  };
}
