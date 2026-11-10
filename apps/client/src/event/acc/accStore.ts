// 레이드 장신구 기억 (이 기기) · 굴림 · 글자 도우미 · 창 Esc 차례 (규칙은 shared/accRules)
import { accTotals, createRng, equipped, fixBag, type AccBag, type AccItem, type AccStat, type AccTotals } from "@pixel-rogue/shared";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { TextKey } from "../../i18n";
import { loadText, saveText } from "../../storage";

type T = (key: TextKey) => string;
const KEY = "raidAcc";

export function loadBag(): AccBag {
  try {
    return fixBag(JSON.parse(loadText(KEY) ?? "null") as Partial<AccBag> | null);
  } catch {
    return fixBag(null);
  }
}
export const saveBag = (b: AccBag) => saveText(KEY, JSON.stringify(b));

/** 장신구 굴림 (기기마다 시드, 게임 판 결과와 상관없음) */
const rng = createRng((Date.now() ^ Math.floor(performance.now() * 1000)) >>> 0);
export const accRnd = () => rng.nextFloat();

/** 레이드 시작 때 내 장비 능력치 합계 (없으면 undefined) */
export function myAccTotals(): AccTotals | undefined {
  const list = equipped(loadBag());
  return list.length ? accTotals(list) : undefined;
}

/** 가방 상태 + 바꾸기 (바꾸면 바로 저장) */
export function useBag(): [AccBag, (fn: (b: AccBag) => void) => void] {
  const [bag, setBag] = useState(loadBag);
  const change = (fn: (b: AccBag) => void) => {
    const b = loadBag();
    fn(b);
    saveBag(b);
    setBag({ ...b, items: [...b.items], slots: [...b.slots] });
  };
  return [bag, change];
}

/** 장신구 이름 */
export const accName = (t: T, it: AccItem) => (it.legend !== undefined ? t(`accLeg${it.legend}` as TextKey) : `${t(`accSet${it.set}` as TextKey)} ${t(`accKind_${it.kind}` as TextKey)}`);

/** %로 보이는 능력치 */
const PCT = new Set<AccStat>(["atkPct", "aspd", "lifesteal", "sharp", "crit", "critDmg", "dmg", "taken", "dash", "rangePct", "itemReset", "half", "weak", "cleanse", "extra", "extra15", "revive", "heal5"]);
/** 늘 보이는 순서 */
const ORDER: AccStat[] = ["atk", "atkPct", "dmg", "aspd", "crit", "critDmg", "hp", "def", "regen", "lifesteal", "sharp", "range", "rangePct", "move", "dash", "taken", "half", "weak", "extra", "extra15", "itemReset", "cleanse", "heal5", "revive", "undying"];

/** 능력치 한 줄 글자 */
export function statLine(t: T, k: AccStat, v: number): string {
  const n = PCT.has(k) ? Math.round(v * 1000) / 10 : Math.round(v * 100) / 100;
  const s = k === "taken" && n > 0 ? `+${n}` : String(n);
  return t(`accStat_${k}` as TextKey).replace("{v}", s);
}

/** 능력치 묶음 → 글자 줄 (0은 빼고) */
export const totalsLines = (t: T, tot: AccTotals) =>
  ORDER.filter((k) => (tot[k] ?? 0) !== 0).map((k) => ({ k, text: statLine(t, k, tot[k]!), bad: k === "taken" && tot[k]! > 0 }));

/** 아이콘 칸 (public/raid/acc/acc.png: 줄 = 반지·목걸이·귀걸이·브로치·전설, 칸 = 세트 또는 전설 번호) */
const ROW = { ring: 0, necklace: 1, earring: 2, brooch: 3 } as const;
export function iconStyle(it: Pick<AccItem, "kind" | "set" | "legend">): CSSProperties {
  const col = it.legend ?? it.set;
  const row = it.legend !== undefined ? 4 : ROW[it.kind];
  return { backgroundImage: `url(${import.meta.env.BASE_URL}raid/acc/acc.png)`, backgroundSize: "1000% 500%", backgroundPosition: `${(col * 100) / 9}% ${(row * 100) / 4}%` };
}

/** 겹친 창에서 Esc는 맨 위 창만 닫음 (뒤 화면의 Esc '뒤로'도 막음) */
const stack: object[] = [];
export function useAccEsc(onClose: () => void): void {
  const ref = useRef(onClose);
  useEffect(() => {
    ref.current = onClose;
  });
  useEffect(() => {
    const me = {};
    stack.push(me);
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || stack[stack.length - 1] !== me) return;
      e.stopImmediatePropagation();
      ref.current();
    };
    window.addEventListener("keydown", key, true);
    return () => {
      window.removeEventListener("keydown", key, true);
      stack.splice(stack.indexOf(me), 1);
    };
  }, []);
}
