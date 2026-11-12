// 피해 출처 표 (sim/dmgSrc): 결과 창 요약(RunSummary) · 게임 중 능력치 칸의 '피해 출처'(SrcPanel, 눌러서 펼침 · 1초마다 갱신)
import type { PassiveId, RunState, WeaponId } from "@pixel-rogue/shared";
import { useEffect, useState, type ReactNode } from "react";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";
import { DOT_COLOR } from "./damageNumbers";
import { ItemIcon } from "./itemIcon";
import { DOT_TEXT } from "./RunSummary";
import { srcFileName, srcRows } from "./srcNames";

const num = (v: number) => Math.round(v).toLocaleString();
type T = (k: TextKey) => string;

/** 막대 표: 이름(아이콘) · 막대(가장 큰 줄 기준) · 피해량 · 비율(이 표 합계 기준) */
export function DamageBars({ title, note, rows }: { title?: string; note?: string; rows: { key: string; name: string; color: string; v: number; icon?: ReactNode }[] }) {
  const sum = rows.reduce((a, r) => a + r.v, 0);
  if (rows.length === 0 || sum <= 0) return null;
  return (
    <div className="sum-detail">
      {title && <small>{title}</small>}
      {rows.map((r) => (
        <div key={r.key} className="sum-bar" title={r.name}>
          <span style={{ color: r.color }}>
            {r.icon}
            {r.name}
          </span>
          <i>
            <b style={{ width: `${(r.v / (rows[0]?.v || 1)) * 100}%`, background: r.color }} />
          </i>
          <span>{num(r.v)}</span>
          <span>{Math.round((r.v / sum) * 1000) / 10}%</span>
        </div>
      ))}
      {note && <small className="sum-note">{note}</small>}
    </div>
  );
}

/** 출처 줄: 상태이상(색) · 무기·기본 공격 · 캐릭터 기술(이름표) · 패시브(아이콘) */
export function SourceBars({ rows, weapon, lang, t, title, note, max }: { rows: [string, number][]; weapon: WeaponId; lang: Lang; t: T; title?: string; note?: string; max: number }) {
  return (
    <DamageBars
      title={title}
      note={note}
      rows={rows.slice(0, max).map(([k, v]) => {
        if (k.startsWith("d:")) return { key: k, name: t(DOT_TEXT[k.slice(2) as keyof typeof DOT_TEXT]), color: DOT_COLOR[k.slice(2) as keyof typeof DOT_COLOR], v };
        if (k === "") return { key: k, name: `${itemName("weapon", weapon, lang)} · ${t("sumSrcBase")}`, color: "#e8e4f0", v, icon: <ItemIcon item={{ kind: "weapon", id: weapon }} size={16} /> };
        if (k.startsWith("k:")) return { key: k, name: t(k.slice(2) as TextKey), color: "#c8a0ff", v };
        const file = srcFileName(k, lang);
        if (file) return { key: k, name: file, color: "#c8a0ff", v };
        return { key: k, name: itemName("passive", k as PassiveId, lang), color: "#7ad0ff", v, icon: <ItemIcon item={{ kind: "passive", id: k as PassiveId }} size={16} /> };
      })}
    />
  );
}

/** 능력치 칸: '피해 출처'를 누르면 지금까지의 출처 표가 펼쳐짐 (열려 있을 때만 1초마다 갱신) */
export function SrcPanel({ run, t, lang }: { run: () => RunState | null; t: T; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<[string, number][]>([]);
  useEffect(() => {
    if (!open) return;
    const read = () => setRows(srcRows(run()?.player.dmgBy));
    const first = window.setTimeout(read, 0);
    const id = window.setInterval(read, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [open, run]);
  const r = run();
  return (
    <div className="src-panel">
      <button type="button" className="stats-guide-btn" onClick={() => setOpen(!open)}>
        {t("sumSrcOpen")} {open ? "▲" : "▼"}
      </button>
      {open && (rows.length > 0 && r ? <SourceBars rows={rows} weapon={r.player.weaponId} lang={lang} t={t} max={8} /> : <small>{t("sumSrcEmpty")}</small>)}
    </div>
  );
}
