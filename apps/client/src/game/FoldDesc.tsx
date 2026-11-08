// 긴 설명 정리: " · "(일본어 "・")로 나뉜 항목을 줄마다 보여 줌 (괄호 안의 · 는 나누지 않음) · 항목이 많으면 핵심 앞 몇 줄만 보이고 나머지는 접음
// FoldDesc: 누르는 '자세히/접기' (선택창 설명 창) · TipDesc: 말풍선용, Shift를 누르고 있으면 전체 (마우스가 말풍선으로 못 가서)
import { useState } from "react";
import { useLang } from "../i18n";
import { hasNumbers, isTouch, RichText, useShift } from "./RichText";

/** 괄호 밖의 구분자로만 나눔 */
export function descParts(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (ch === "(" || ch === "（" || ch === "[") depth++;
    else if (ch === ")" || ch === "）" || ch === "]") depth = Math.max(0, depth - 1);
    if (depth === 0 && (text.startsWith(" · ", i) || ch === "・")) {
      out.push(cur.trim());
      cur = "";
      i += ch === "・" ? 0 : 2;
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}

/** 이 줄 수보다 많으면 접음 */
const KEEP = 3;

function Lines({ parts, nums }: { parts: string[]; nums?: boolean }) {
  return (
    <ul className="fold-lines">
      {parts.map((p, i) => (
        <li key={i} className={/^(요령|Tip|コツ)[:：]/.test(p) ? "fold-tip" : undefined}>
          <RichText text={p} nums={nums} />
        </li>
      ))}
    </ul>
  );
}

/** 누르면 펼치는 설명 (짧으면 그대로 줄마다) */
export function FoldDesc({ text, className, nums }: { text: string; className?: string; nums?: boolean }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const parts = descParts(text);
  const fold = parts.length > KEEP + 1;
  return (
    <div className={`fold-desc ${className ?? ""}`}>
      <Lines parts={fold && !open ? parts.slice(0, KEEP) : parts} nums={nums} />
      <NumHint text={text} nums={nums} />
      {fold && (
        <button type="button" className="fold-more" onClick={() => setOpen((o) => !o)}>
          {open ? t("descLess") : t("descMore").replace("{n}", String(parts.length - KEEP))}
        </button>
      )}
    </div>
  );
}

/** 수치가 숨어 있으면 "Shift: 수치 보기" */
export function NumHint({ text, nums }: { text: string; nums?: boolean }) {
  const { t } = useLang();
  const shift = useShift();
  if (nums || shift || isTouch() || !hasNumbers(text)) return null;
  return <small className="desc-num-hint">{t("descNumShift")}</small>;
}

/** 말풍선 설명: 길면 앞 몇 줄 + "Shift: 전체" · Shift를 누르는 동안 전체 (수치도 그때 보임) · nums: 수치를 늘 보여 줌 (단련의 방) */
export function TipDesc({ text, nums }: { text: string; nums?: boolean }) {
  const { t } = useLang();
  const shift = useShift();
  const parts = descParts(text);
  if (parts.length <= 1)
    return (
      <div>
        <RichText text={text} nums={nums} />
        <NumHint text={text} nums={nums} />
      </div>
    );
  // 터치 기기는 Shift가 없어 전체
  const fold = parts.length > KEEP + 2 && !shift && !isTouch();
  return (
    <div className="fold-desc">
      <Lines parts={fold ? parts.slice(0, KEEP + 1) : parts} nums={nums} />
      {fold ? <small className="fold-hint">{t("descShift").replace("{n}", String(parts.length - KEEP - 1))}</small> : <NumHint text={text} nums={nums} />}
    </div>
  );
}
