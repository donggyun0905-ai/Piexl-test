// 로그 왼쪽 칸 빌드 세트 칸: 가진 꼬리표마다 칩·가진 수·단계 별(★)·다음 단계까지 · 마우스를 올리거나 누르면 패시브 설명과 같은 말풍선(ItemTip)에 단계 효과 (0.3초마다 새로)
// 단계가 오르면 화면 위쪽에 잠깐 알림 (꼬리표 색·새로 생긴 효과)
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ITEM_TAGS, SET_STEPS, setsOn, tagCounts, tierOf, type ItemTag, type RunState } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../../i18n";
import { awakenLine } from "../../i18n/awakenLines";
import { setLines } from "../../i18n/buildSetLines";
import { ItemTip } from "../ItemTip";
import { TagChip } from "./TagChip";
import { TAG_COLORS } from "./tagColors";

const STEPS = [SET_STEPS.one, SET_STEPS.two, SET_STEPS.three, SET_STEPS.four];
type Row = { tag: ItemTag; n: number; tier: number };

export function SetPanel({ run, t, lang }: { run: () => RunState | null; t: (k: TextKey) => string; lang: Lang }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [toast, setToast] = useState<{ tag: ItemTag; tier: number; key: number } | null>(null);
  const was = useRef<Map<ItemTag, number> | null>(null);
  const [hover, setHover] = useState<{ tag: ItemTag; x: number; y: number } | null>(null);
  useEffect(() => {
    const id = window.setInterval(() => {
      const r = run();
      if (!r || !setsOn(r)) return setRows((x) => (x.length ? [] : x));
      const n = tagCounts(r.player);
      const next = ITEM_TAGS.filter((tag) => n[tag] > 0).map((tag) => ({ tag, n: n[tag], tier: tierOf(n[tag]) }));
      next.sort((a, b) => b.n - a.n || ITEM_TAGS.indexOf(a.tag) - ITEM_TAGS.indexOf(b.tag));
      // 단계가 오른 꼬리표 알림 (처음 읽을 때는 알리지 않음: 이어하기)
      if (was.current) for (const row of next) if (row.tier > (was.current.get(row.tag) ?? 0)) setToast({ tag: row.tag, tier: row.tier, key: Date.now() });
      was.current = new Map(next.map((x) => [x.tag, x.tier]));
      setRows((old) => (JSON.stringify(old) === JSON.stringify(next) ? old : next));
    }, 300);
    return () => window.clearInterval(id);
  }, [run]);
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);
  if (!rows.length && !toast) return null;
  return (
    <div className="set-panel">
      {rows.length > 0 && <b>{t("bsTitle")}</b>}
      {rows.map((row) => {
        const need = STEPS.find((s) => s > row.n);
        const at = (el: HTMLElement) => {
          const b = el.getBoundingClientRect();
          return { tag: row.tag, x: Math.min(b.right + 136, window.innerWidth - 132), y: Math.max(4, Math.min(b.top - 4, window.innerHeight - 250)) };
        };
        return (
          <div
            key={row.tag}
            className="set-row"
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(at(e.currentTarget))}
            onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
            onClick={(e) => setHover((h) => (h?.tag === row.tag ? null : at(e.currentTarget)))}
          >
            <TagChip tag={row.tag} />
            <span className="set-stars" style={{ color: TAG_COLORS[row.tag] }}>
              {"★".repeat(Math.min(3, row.tier))}
              <i>{"☆".repeat(Math.max(0, 3 - row.tier))}</i>
              {row.tier >= 4 && <b className="set-awake">✦</b>}
            </span>
            <em>{need ? `${row.n}/${need}` : row.n}</em>
          </div>
        );
      })}
      {hover && rows.some((r) => r.tag === hover.tag) && <SetTip row={rows.find((r) => r.tag === hover.tag)!} pos={hover} t={t} lang={lang} />}
      {toast &&
        createPortal(
          <div key={toast.key} className="set-toast" style={{ borderColor: TAG_COLORS[toast.tag] }}>
            <strong style={{ color: TAG_COLORS[toast.tag] }}>
              {t(toast.tier >= 4 ? "bsAwake" : "bsUp").replace("{tag}", t(`bt_${toast.tag}` as TextKey)).replace("{n}", String(toast.tier))}
            </strong>
            <span>{toast.tier >= 4 ? awakenLine(toast.tag, lang) : setLines(toast.tag, lang)[toast.tier - 1]}</span>
          </div>,
          document.body,
        )}
    </div>
  );
}

/** 빌드 세트 말풍선: 꼬리표 칩 · 단계마다 필요한 수·효과 (켜진 단계는 꼬리표 색, 아직은 흐리게) · 지금 수와 다음 단계까지 */
function SetTip({ row, pos, t, lang }: { row: Row; pos: { x: number; y: number }; t: (k: TextKey) => string; lang: Lang }) {
  const lines = [...setLines(row.tag, lang), awakenLine(row.tag, lang)];
  const need = STEPS.find((s) => s > row.n);
  const c = TAG_COLORS[row.tag];
  return (
    <ItemTip pos={{ ...pos, below: true }} icon={null} name={t("bsTipName").replace("{tag}", t(`bt_${row.tag}` as TextKey))} desc="" tag={row.tag}>
      <div className="set-tip" style={{ borderColor: c }}>
        {lines.map((l, i) => (
          <div key={i} className={row.tier > i ? "set-tip-line on" : "set-tip-line"} style={row.tier > i ? { borderColor: c } : undefined}>
            <span className="set-tip-step" style={row.tier > i ? { color: c } : undefined}>
              {i === 3 ? "✦" : "★".repeat(i + 1)} <em>{t("bsTipNeed").replace("{n}", String(STEPS[i]))}</em>
            </span>
            <span>{l}</span>
          </div>
        ))}
        <div className="item-tip-hint">{t(need ? "bsTipNow" : "bsTipMax").replace("{n}", String(row.n)).replace("{k}", String((need ?? 0) - row.n))}</div>
      </div>
    </ItemTip>
  );
}
