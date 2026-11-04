// 로그 왼쪽 칸 빌드 세트 칸: 가진 꼬리표마다 칩·가진 수·단계 별(★)·다음 단계까지 · 마우스를 올리면 세 단계 효과 (0.3초마다 새로)
// 단계가 오르면 화면 위쪽에 잠깐 알림 (꼬리표 색·새로 생긴 효과)
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ITEM_TAGS, SET_STEPS, setsOn, tagCounts, tierOf, type ItemTag, type RunState } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../../i18n";
import { setLines } from "../../i18n/buildSetLines";
import { TagChip } from "./TagChip";
import { TAG_COLORS } from "./tagColors";

const STEPS = [SET_STEPS.one, SET_STEPS.two, SET_STEPS.three];
type Row = { tag: ItemTag; n: number; tier: number };

export function SetPanel({ run, t, lang }: { run: () => RunState | null; t: (k: TextKey) => string; lang: Lang }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [toast, setToast] = useState<{ tag: ItemTag; tier: number; key: number } | null>(null);
  const was = useRef<Map<ItemTag, number> | null>(null);
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
        const lines = setLines(row.tag, lang);
        const need = STEPS.find((s) => s > row.n);
        const tip = lines.map((l, i) => `${row.tier > i ? "★" : "☆"} ${STEPS[i]}: ${l}`).join("\n");
        return (
          <div key={row.tag} className="set-row" title={tip}>
            <TagChip tag={row.tag} />
            <span className="set-stars" style={{ color: TAG_COLORS[row.tag] }}>
              {"★".repeat(row.tier)}
              <i>{"☆".repeat(3 - row.tier)}</i>
            </span>
            <em>{need ? `${row.n}/${need}` : row.n}</em>
          </div>
        );
      })}
      {toast &&
        createPortal(
          <div key={toast.key} className="set-toast" style={{ borderColor: TAG_COLORS[toast.tag] }}>
            <strong style={{ color: TAG_COLORS[toast.tag] }}>
              {t("bsUp").replace("{tag}", t(`bt_${toast.tag}` as TextKey)).replace("{n}", String(toast.tier))}
            </strong>
            <span>{setLines(toast.tag, lang)[toast.tier - 1]}</span>
          </div>,
          document.body,
        )}
    </div>
  );
}
