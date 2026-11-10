// 설명 글 꾸미기 (캐릭터·스킬·아이템 설명이 같이 씀): 중요 낱말은 색·굵게 · 수치(30%·×1.35·2.5초·+10 등)는 Shift를 누르는 동안만
// 수치를 숨기면: 숫자가 든 괄호는 통째로 빠지고 · +/× 수치는 ↑, -는 ↓ · 나머지 단위 수치는 작은 ◇ → 설명이 짧아짐
// 단련의 방처럼 수치를 늘 보여 줘야 하는 곳은 nums를 켬 · 터치 기기는 Shift가 없어 늘 수치를 보여 줌
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { DESC_KEYWORDS } from "../i18n/descKeywords";

/** Shift를 누르고 있는지 (창마다 따로 듣지 않게 하나로 모음) */
let shiftDown = false;
const subs = new Set<(v: boolean) => void>();
function onKey(e: KeyboardEvent): void {
  if (e.key !== "Shift" || shiftDown === (e.type === "keydown")) return;
  shiftDown = e.type === "keydown";
  subs.forEach((f) => f(shiftDown));
}
function onBlur(): void {
  if (!shiftDown) return;
  shiftDown = false;
  subs.forEach((f) => f(false));
}

export function useShift(): boolean {
  const [v, setV] = useState(shiftDown);
  useEffect(() => {
    if (subs.size === 0) {
      window.addEventListener("keydown", onKey);
      window.addEventListener("keyup", onKey);
      window.addEventListener("blur", onBlur);
    }
    subs.add(setV);
    return () => {
      subs.delete(setV);
      if (subs.size > 0) return;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("blur", onBlur);
    };
  }, []);
  return v;
}

export const isTouch = () => typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;

/** 수치: 앞에 +·-·× 가 있거나, 뒤에 단위·%가 붙은 숫자 (범위 5~50%, {s}초 같은 채운 값 포함) */
const UNIT = "%p|%|배|초|틱|스택|칸|번째|번|개|마리|명|회|픽셀|px|레벨|층|줄|발|타|s|x|秒|倍|回|個|体|層|段|発";
const NUM = new RegExp(`([+\\-−×x]?)(\\d+(?:\\.\\d+)?)(?:\\s?[~〜–-]\\s?[+\\-]?\\d+(?:\\.\\d+)?)?(${UNIT})?`, "g");
/** 숨긴 수치 자리 */
const HID = "◇";
/** 숫자가 든 괄호 */
const PAREN = /\s?[(（][^()（）]*\d[^()（）]*[)）]/g;

/** 수치가 있는 글인지 (Shift 안내를 띄울지) */
export const hasNumbers = (text: string) => hideNumbers(text) !== text;

/** 수치 숨기기: 괄호 빼기 · +/×는 ↑, -는 ↓, 단위가 붙은 수치는 ◇ (그냥 숫자는 그대로: 스킬 1, 시즌 2) */
export function hideNumbers(text: string): string {
  return text
    .replace(PAREN, "")
    .replace(NUM, (m, sign: string, n: string, unit: string | undefined) => {
      if (sign === "×" || sign === "x") return Number(n) >= 1 ? "↑" : "↓";
      if (sign === "+") return "↑";
      if (sign === "-" || sign === "−") return unit ? "↓" : m;
      return unit ? HID : m;
    })
    .replace(/↑\s*↑/g, "↑")
    .replace(/\s+([,.:、。])/g, "$1")
    .replace(/[:：]\s*(?=[·,]|$)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** 낱말 찾기 (긴 낱말부터 · '작은따옴표 이름'·★ 새 공격 방식도) */
const KW = new RegExp(
  `('[^']{1,24}'|‘[^’]{1,24}’|「[^」]{1,24}」|★[^\\s·,()]*|${[...DESC_KEYWORDS].sort((a, b) => b.length - a.length).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "g",
);
/** 수치 (Shift를 누르면 보이는 것) */
const NUM_PART = new RegExp(`${PAREN.source}|${NUM.source}`, "g");

function keywords(text: string, key: string): ReactNode[] {
  return text.split(KW).flatMap((part, i) =>
    i % 2
      ? [<b key={`${key}k${i}`} className="desc-kw">{part}</b>]
      : part.split(HID).flatMap((t, j) => (j ? [<span key={`${key}h${i}.${j}`} className="desc-hid">{HID}</span>, t] : [t])),
  );
}

/** 꾸민 설명 한 줄. nums: 수치를 늘 보여 줌 (아니면 Shift를 누를 때만, 터치 기기는 늘) */
export function RichText({ text, nums = false }: { text: string; nums?: boolean }) {
  const shift = useShift();
  const show = nums || shift || isTouch();
  if (!show) return <>{keywords(hideNumbers(text), "h")}</>;
  // 수치는 따로 색 (Shift로 보이는 값)
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(NUM_PART)) {
    if (!/\d/.test(m[0])) continue;
    out.push(<Fragment key={i++}>{keywords(text.slice(last, m.index), `t${i}`)}</Fragment>);
    out.push(<span key={i++} className="desc-num">{m[0]}</span>);
    last = m.index + m[0].length;
  }
  out.push(<Fragment key={i}>{keywords(text.slice(last), "end")}</Fragment>);
  return <>{out}</>;
}
