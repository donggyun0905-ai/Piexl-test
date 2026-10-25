// 한 묶음(캐릭터·무기·적·보스·패시브…)의 수치 표. 처음 값과 다르면 노란색, 저장 전 고친 값은 테두리 표시
// 항목마다 값이 다른 묶음(패시브·상점)은 항목별 목록으로
import type { BalanceField, BalanceGroup, BalanceSet, BalanceValues } from "@pixel-rogue/shared";
import { useState, type ReactNode } from "react";
import { FIELD_HINT, fieldLabel, rowDesc, rowLabel } from "./labels";

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
  const cell = (id: string, f: BalanceField) => (
    <Cell
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

/** 항목별 목록: 항목 이름·설명 옆에 그 항목에 있는 값만 */
function BalanceList({ set, group, cell }: { set: BalanceSet; group: BalanceGroup; cell: (id: string, f: BalanceField) => ReactNode }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table admin-list">
        <tbody>
          {group.ids.map((id) => {
            const fields = set.balanceFields(group, id);
            const desc = rowDesc(group.id, id);
            return (
              <tr key={id}>
                <th>
                  {rowLabel(group.id, id)}
                  <small>{id}</small>
                  {desc && <span className="admin-desc">{desc}</span>}
                </th>
                <td>
                  {fields.length === 0 ? (
                    <span className="admin-na">바꿀 수치 없음</span>
                  ) : (
                    <table className="admin-mini">
                      <thead>
                        <tr>
                          {fields.map((f) => (
                            <th key={f.key} title={FIELD_HINT[f.key]}>
                              {fieldLabel(f.key, group.id)}
                              {FIELD_HINT[f.key] && <small>{FIELD_HINT[f.key]}</small>}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>{fields.map((f) => cell(id, f))}</tr>
                      </tbody>
                    </table>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface CellProps {
  field: BalanceField;
  /** 처음(코드에 적힌) 값 */
  base: number;
  /** 바꾼 값 (없으면 처음 값) */
  value: number | undefined;
  /** 서버에 저장된 값 */
  saved: number | undefined;
  onChange: (v: number | undefined) => void;
}

function Cell({ field, base, value, saved, onChange }: CellProps) {
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
  return (
    <td className={cls}>
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
    </td>
  );
}
