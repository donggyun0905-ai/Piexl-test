// 레이드 장신구 규칙 (수치 accDefs): 보상 상자 뽑기 · 장착 · 승급 · 강화 · 재설정 · 능력치 합계
// 굴림은 밖에서 받은 rnd(0~1)로만 (화면이 기기 시드로 줌). 칩(로비 돈)은 화면이 셈
import { ACC_BASE, ACC_KINDS, ACC_LEGENDS, ACC_OPTIONS, ACC_RULES as R, ACC_SET_BONUS, ACC_SET_COUNT, ACC_SLOTS, RING_BASES, type AccBag, type AccItem, type AccStat } from "./accDefs";

type Rnd = () => number;
export type AccTotals = Partial<Record<AccStat, number>>;

const pickIndex = (rnd: Rnd, ws: readonly number[]) => {
  const sum = ws.reduce((a, b) => a + b, 0);
  let r = rnd() * sum;
  for (let i = 0; i < ws.length; i++) if ((r -= ws[i]!) < 0) return i;
  return ws.length - 1;
};

/** 같은 장신구인지 (같은 세트·종류, 또는 같은 전설) */
export const accKey = (it: AccItem) => (it.legend !== undefined ? `lg${it.legend}` : `${it.kind}${it.set}`);

/** 추가 능력치 3줄 굴리기 */
export const rollOpts = (rnd: Rnd): [number, number][] =>
  Array.from({ length: 3 }, () => [pickIndex(rnd, ACC_OPTIONS.map((o) => o.w)), Math.round(rnd() * 100) / 100] as [number, number]);

/** 보상 상자 카드 하나 (uid는 넣을 때) */
export function rollAcc(rnd: Rnd): Omit<AccItem, "uid"> {
  if (rnd() < R.legend) {
    const legend = Math.floor(rnd() * ACC_LEGENDS.length);
    return { kind: ACC_LEGENDS[legend]!.kind, set: -1, legend, star: 5, lv: 0, opts: rollOpts(rnd) };
  }
  const r = rnd();
  const star = r < R.star1 ? 1 : r < R.star1 + R.star2 ? 2 : 3;
  const kind = ACC_KINDS[Math.floor(rnd() * ACC_KINDS.length)]!;
  const set = Math.floor(rnd() * ACC_SET_COUNT);
  return { kind, set, star, lv: 0, opts: rollOpts(rnd), ...(kind === "ring" ? { ringBase: Math.floor(rnd() * RING_BASES.length) } : {}) };
}

/** 보상 상자: 카드 10장 */
export const rollCards = (rnd: Rnd) => Array.from({ length: R.cards }, () => rollAcc(rnd));

/** 가방에 넣기 (번호 붙임) */
export function addAcc(bag: AccBag, items: readonly Omit<AccItem, "uid">[]): AccItem[] {
  const out = items.map((it) => ({ ...it, uid: bag.next++ }));
  bag.items.push(...out);
  return out;
}

export const emptyBag = (): AccBag => ({ items: [], slots: ACC_SLOTS.map(() => null), next: 1 });
export const accOf = (bag: AccBag, uid: number | null | undefined) => (uid == null ? undefined : bag.items.find((i) => i.uid === uid));
export const equipped = (bag: AccBag): AccItem[] => bag.slots.map((u) => accOf(bag, u)).filter((x): x is AccItem => !!x);
export const isEquipped = (bag: AccBag, uid: number) => bag.slots.includes(uid);

/** 이 칸에 낄 수 있는지: 종류가 맞고, 같은 장신구가 다른 칸에 없어야 함 */
export function canEquip(bag: AccBag, slot: number, uid: number): boolean {
  const it = accOf(bag, uid);
  if (!it || ACC_SLOTS[slot] !== it.kind) return false;
  return !bag.slots.some((u, i) => i !== slot && u !== null && accOf(bag, u) && accKey(accOf(bag, u)!) === accKey(it));
}

export function equip(bag: AccBag, slot: number, uid: number | null): boolean {
  if (uid !== null && !canEquip(bag, slot, uid)) return false;
  if (uid !== null) bag.slots = bag.slots.map((u) => (u === uid ? null : u));
  bag.slots[slot] = uid;
  return true;
}

/** 기본 능력치 (별·강화) */
export function accBase(it: AccItem): AccTotals {
  if (it.legend !== undefined) {
    const L = ACC_LEGENDS[it.legend]!;
    const out: AccTotals = { ...L.base };
    for (const [k, v] of Object.entries(L.per) as [AccStat, number][]) out[k] = (out[k] ?? 0) + v * it.lv;
    return out;
  }
  const b = ACC_BASE[it.kind === "ring" ? (RING_BASES[it.ringBase ?? 0] ?? "ringAtk") : it.kind]!;
  return { [b.stat]: (b.star[it.star - 1] ?? 0) + b.per * it.lv };
}

/** 추가 능력치 한 줄의 실제 값 */
export function optValue(o: [number, number]): AccTotals {
  const d = ACC_OPTIONS[o[0]];
  if (!d) return {};
  const v = (lo: number, hi: number) => round(lo + (hi - lo) * o[1]);
  return { [d.stat]: v(d.lo, d.hi), ...(d.stat2 ? { [d.stat2]: v(d.lo2!, d.hi2!) } : {}) };
}
const round = (v: number) => (Math.abs(v) < 1 ? Math.round(v * 1000) / 1000 : Math.round(v * 100) / 100);

/** 장착한 장신구의 세트 수 (전설은 고른 세트로, 그 세트를 1개 이상 꼈을 때만) */
export function setCounts(items: readonly AccItem[]): number[] {
  const n = Array.from({ length: ACC_SET_COUNT }, () => 0);
  for (const it of items) if (it.set >= 0) n[it.set]!++;
  for (const it of items) if (it.legend !== undefined && it.legSet !== undefined && n[it.legSet]! > 0) n[it.legSet]!++;
  return n;
}

/** 장착한 장신구 능력치 합계 (기본 + 추가 + 세트). 부활은 큰 값 하나만 */
export function accTotals(items: readonly AccItem[]): AccTotals {
  const out: AccTotals = {};
  const add = (t: AccTotals) => {
    for (const [k, v] of Object.entries(t) as [AccStat, number][]) out[k] = k === "revive" ? Math.max(out[k] ?? 0, v) : (out[k] ?? 0) + v;
  };
  for (const it of items) {
    add(accBase(it));
    for (const o of it.opts) add(optValue(o));
  }
  setCounts(items).forEach((c, set) => {
    for (let k = 2; k <= Math.min(4, c); k++) add(ACC_SET_BONUS[set]![k - 2]!);
  });
  return out;
}

/** 승급에 필요한 것: 재료 수와 재료 조건 (2·3·4성: 같은 종류의 한 단계 아래와 같은 별 · 5성: 같은 장신구 4성). 할 수 없으면 null */
export function promoNeed(it: AccItem): { count: number; ok: (m: AccItem) => boolean } | null {
  if (it.legend !== undefined || it.star < 1 || it.star >= 5) return null;
  if (it.star <= 3) {
    const count = it.star === 1 ? R.promo2 : it.star === 2 ? R.promo3 : R.promo4;
    return { count, ok: (m) => m.uid !== it.uid && m.legend === undefined && m.star === it.star && m.kind === it.kind };
  }
  return { count: R.promo5, ok: (m) => m.uid !== it.uid && m.star === 4 && accKey(m) === accKey(it) };
}

/** 승급: 재료는 사라지고 별 +1 (장착한 것은 재료로 못 씀) */
export function promote(bag: AccBag, uid: number, mats: readonly number[]): boolean {
  const it = accOf(bag, uid);
  const need = it && promoNeed(it);
  if (!it || !need || new Set(mats).size !== need.count) return false;
  const list = mats.map((m) => accOf(bag, m));
  if (list.some((m) => !m || !need.ok(m) || isEquipped(bag, m.uid))) return false;
  bag.items = bag.items.filter((m) => !mats.includes(m.uid));
  it.star++;
  return true;
}

/** 강화 비용 (지금 단계 → 다음) · 확률 */
export const enhanceCost = (lv: number) => (lv === 0 ? R.cost1 : lv === 1 ? R.cost2 : R.cost3 + (lv - 2) * R.costStep);
export const enhanceRate = (lv: number) => [R.rate1, R.rate2, R.rate3, R.rate4, R.rate5, R.rate6][lv] ?? R.rateMin;
export const canEnhance = (it: AccItem) => it.star >= R.enhanceFrom && it.lv < R.enhanceMax;

/** 강화 한 번: 성공 +1 · 실패 -1 */
export function enhance(it: AccItem, rnd: Rnd): boolean {
  if (!canEnhance(it)) return false;
  const ok = rnd() < enhanceRate(it.lv);
  it.lv = Math.max(0, it.lv + (ok ? 1 : -1));
  return ok;
}

/** 재설정: 추가 능력치 3줄을 모두 다시 */
export function reroll(it: AccItem, rnd: Rnd): void {
  it.opts = rollOpts(rnd);
}

/** 저장본 고치기 (빠진 칸·없는 장신구 정리) */
export function fixBag(raw: Partial<AccBag> | null | undefined): AccBag {
  const bag = emptyBag();
  if (!raw || !Array.isArray(raw.items)) return bag;
  bag.items = raw.items.filter((i) => i && ACC_KINDS.includes(i.kind) && Array.isArray(i.opts));
  bag.next = Math.max(raw.next ?? 1, ...bag.items.map((i) => i.uid + 1));
  bag.slots = ACC_SLOTS.map((_, i) => {
    const u = raw.slots?.[i] ?? null;
    return u !== null && bag.items.some((x) => x.uid === u) ? u : null;
  });
  return bag;
}

/** 다른 사람이 보낸 합계 정리 (아는 능력치만 · 말이 안 되는 큰 값은 자름) */
export function accClamp(raw: Record<string, unknown>): AccTotals {
  const out: AccTotals = {};
  for (const k of ACC_STAT_KEYS) {
    const v = raw[k];
    if (typeof v === "number" && Number.isFinite(v)) out[k] = Math.max(-1, Math.min(k === "hp" ? 1000 : 100, v));
  }
  return out;
}
const ACC_STAT_KEYS: readonly AccStat[] = ["atk", "atkPct", "aspd", "def", "hp", "range", "rangePct", "move", "regen", "lifesteal", "sharp", "crit", "critDmg", "dmg", "taken", "dash", "itemReset", "half", "weak", "cleanse", "extra", "extra15", "revive", "undying", "heal5"];
