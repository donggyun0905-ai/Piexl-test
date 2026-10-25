// 바꾼 기록 (최근 30개). 예전 수치로 되돌리기
import type { BalanceValues } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { adminApi, errorText, type LogEntry, type ServerInfo, type SetKind } from "./adminApi";
import { formatTime } from "./labels";

interface Props {
  server: ServerInfo;
  kind: SetKind;
  /** 지금 수치의 지문 (바뀌면 기록 다시 받기) */
  current: string;
  busy: boolean;
  onApply: (values: BalanceValues, note: string) => void;
}

export function HistoryView({ server, kind, current, busy, onApply }: Props) {
  const [entries, setEntries] = useState<LogEntry[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    void adminApi.history(server, kind).then((res) => {
      if (!alive) return;
      if (res.ok && res.data) setEntries(res.data.entries);
      else setError(errorText(res.error));
    });
    return () => {
      alive = false;
    };
    // 지금 수치가 바뀌면(저장) 기록을 다시 받음
  }, [server, kind, current]);

  const restore = async (e: LogEntry) => {
    if (!window.confirm(`${formatTime(e.at)} 수치로 되돌릴까요? 저장하면 바로 게임에 적용됩니다 (다음 판부터).`)) return;
    const res = await adminApi.version(server, kind, e.hash);
    if (res.ok && res.data) onApply(res.data.values, `${formatTime(e.at)} 수치로 되돌림`);
    else setError(errorText(res.error));
  };

  if (error) return <p className="admin-error">{error}</p>;
  if (!entries) return <p className="admin-hint">불러오는 중…</p>;
  if (entries.length === 0) return <p className="admin-hint">아직 바꾼 기록이 없습니다 (모두 처음 값).</p>;
  return (
    <table className="admin-table admin-history">
      <thead>
        <tr>
          <th>바꾼 시각 (한국)</th>
          <th>메모</th>
          <th>지문</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {entries.map((e, i) => (
          <tr key={`${e.at}-${i}`}>
            <td>{formatTime(e.at)}</td>
            <td>{e.note || "—"}</td>
            <td>
              <code>{e.hash}</code>
            </td>
            <td>
              {e.hash === current ? (
                <span className="admin-ok">지금 수치</span>
              ) : (
                <button type="button" disabled={busy} onClick={() => void restore(e)}>
                  되돌리기
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
