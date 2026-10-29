// 한 묶음(캐릭터·무기·적·보스·패시브…)의 수치 표. 처음 값과 다르면 노란색, 저장 전 고친 값은 테두리 표시
// 항목마다 값이 다른 묶음(패시브·상점)은 항목별 목록으로
import type { BalanceField, BalanceGroup, BalanceSet, BalanceValues } from "@pixel-rogue/shared";
import { useState, type ReactNode } from "react";
import { FIELD_HINT, fieldLabel, rowCategory, rowDesc, rowLabel } from "./labels";
import { fieldDoc, rowDoc } from "./fieldDocs";

interface Props {
  /** 수치 세트 (던전·타워 디펜스) */
  set: BalanceSet;
  group: BalanceGroup;
  draft: BalanceValues;
  saved: BalanceValues;
  /** value가 undefined면 처음 값으로 */
  onChange: (id: string, key: string, value: number | undefined) => void;
}

export function BalanceEditor({ set, group, draft, saved, onChange }: Props) {
  const cell = (id: string, f: BalanceField, grid?: boolean) => (
    <Cell
      grid={grid}
      label={grid ? fieldLabel(f.key, group.id) : undefined}
      doc={grid ? fieldDoc(group.id, id, f.key) : undefined}
      // 값이 바깥에서 바뀌면 (저장·되돌리기·옮기기) 새로 그림
      key={`${f.key}:${draft[group.id]?.[id]?.[f.key] ?? ""}`}
      field={f}
      base={set.balanceDefault(group.id, id, f.key)!}
      value={draft[group.id]?.[id]?.[f.key]}
      saved={saved[group.id]?.[id]?.[f.key]}
      onChange={(v) => onChange(id, f.key, v)}
    />
  );
  if (group.list) return <BalanceList set={set} group={group} cell={cell} />;
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>항목</th>
            {group.fields.map((f) => (
              <th key={f.key} title={FIELD_HINT[f.key]}>
                {fieldLabel(f.key, group.id)}
                {FIELD_HINT[f.key] && <small>{FIELD_HINT[f.key]}</small>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {group.ids.map((id) => {
            const usable = new Set(set.balanceFields(group, id).map((f) => f.key));
            return (
              <tr key={id}>
                <th>
                  {rowLabel(group.id, id)}
                  <small>{id}</small>
                </th>
                {group.fields.map((f) =>
                  usable.has(f.key) ? (
                    cell(id, f)
                  ) : (
                    <td key={f.key} className="admin-na">
                      —
                    </td>
                  ),
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** 항목별 목록: 위쪽 찾기 칸·분류(캐릭터) 고르기 · 항목 이름·설명 아래에 그 항목에 있는 값을 칸으로 */
function BalanceList({ set, group, cell }: { set: BalanceSet; group: BalanceGroup; cell: (id: string, f: BalanceField, grid?: boolean) => ReactNode }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const cats = [...new Set(group.ids.map((id) => rowCategory(group.id, id)).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ko"));
  const q = query.trim().toLowerCase();
  const rows = group.ids.filter((id) => {
    if (cat && rowCategory(group.id, id) !== cat) return false;
    if (!q) return true;
    const text = `${id} ${rowLabel(group.id, id)} ${rowDoc(group.id, id) ?? ""} ${set.balanceFields(group, id).map((f) => `${f.key} ${fieldLabel(f.key, group.id)} ${fieldDoc(group.id, id, f.key) ?? ""}`).join(" ")}`.toLowerCase();
    return text.includes(q);
  });
  return (
    <div className="admin-table-wrap">
      <div className="admin-filter">
        <input value={query} placeholder="찾기 (한글 이름·설명·값 이름, 예: 미사일, 폭탄, 확률)" onChange={(e) => setQuery(e.target.value)} />
        {cats.length > 1 && (
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">모든 분류 ({group.ids.length})</option>
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
        <span className="admin-hint">{rows.length}개</span>
      </div>
      {rows.slice(0, LIST_LIMIT).map((id) => {
        const fields = set.balanceFields(group, id);
        const desc = rowDesc(group.id, id) || rowDoc(group.id, id);
        return (
          <section key={id} className="admin-row">
            <h4>
              {rowLabel(group.id, id)} <small>{id}</small>
            </h4>
            {desc && <p className="admin-desc">{desc}</p>}
            {fields.length === 0 ? <span className="admin-na">바꿀 수치 없음</span> : <div className="admin-grid">{fields.map((f) => cell(id, f, true))}</div>}
          </section>
        );
      })}
      {rows.length > LIST_LIMIT && <p className="admin-hint">처음 {LIST_LIMIT}개만 보입니다. 찾기나 분류로 좁혀 주세요.</p>}
    </div>
  );
}

/** 한 번에 그리는 항목 수 (값이 수천 개라 느려지지 않게) */
const LIST_LIMIT = 60;

interface CellProps {
  field: BalanceField;
  /** 목록 칸 (이름을 칸 위에) */
  grid?: boolean;
  label?: string;
  /** 코드 주석에서 가져온 한국어 설명 */
  doc?: string;
  /** 처음(코드에 적힌) 값 */
  base: number;
  /** 바꾼 값 (없으면 처음 값) */
  value: number | undefined;
  /** 서버에 저장된 값 */
  saved: number | undefined;
  onChange: (v: number | undefined) => void;
}

export function Cell({ field, base, value, saved, onChange, grid, label, doc }: CellProps) {
  const shown = value ?? base;
  const [text, setText] = useState(String(shown));

  const commit = (raw: string) => {
    const n = Number(raw);
    if (raw.trim() === "" || !Number.isFinite(n)) return setText(String(shown));
    const v = Math.min(field.max, Math.max(field.min, field.int ? Math.round(n) : n));
    setText(String(v));
    onChange(v === base ? undefined : v);
  };

  const cls = ["admin-cell", value !== undefined && "changed", value !== saved && "dirty"].filter(Boolean).join(" ");
  const Tag = grid ? "div" : "td";
  return (
    <Tag className={cls}>
      {label && (
        <span className="admin-cell-label" title={`${doc ?? label}\n(${field.key})`}>
          <b>{doc ?? label}</b>
          <small>
            {doc ? `${label} · ` : ""}
            <code>{field.key}</code>
          </small>
        </span>
      )}
      <input
        inputMode="decimal"
        value={text}
        title={`처음 값 ${base} · 범위 ${field.min}~${field.max}${field.int ? " (정수)" : ""}`}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
      />
      {value !== undefined && (
        <button type="button" className="admin-reset" title={`처음 값(${base})으로`} onClick={() => onChange(undefined)}>
          ↺
        </button>
      )}
    </Tag>
  );
}
