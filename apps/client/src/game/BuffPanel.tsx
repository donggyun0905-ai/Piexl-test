// 로그 왼쪽 칸 맨 아래 버프 창: 지금 켜진 버프(초록)·다시 쓰기까지 대기(회색)와 남은 초·막대 (buffView, 0.2초마다 새로)
import type { RunState } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../i18n";
import { buffRows, type BuffRow } from "./buffView";

export function BuffPanel({ run, t }: { run: () => RunState | null; t: (k: TextKey) => string }) {
  const [rows, setRows] = useState<BuffRow[]>([]);
  const max = useRef(new Map<string, number>());
  useEffect(() => {
    const id = window.setInterval(() => {
      const r = run();
      if (r) setRows(buffRows(r.player, max.current));
    }, 200);
    return () => window.clearInterval(id);
  }, [run]);
  return (
    <div className="buff-panel">
      <b>{t("bfTitle")}</b>
      {rows.length === 0 && <small>{t("bfNone")}</small>}
      {rows.map((r) => (
        <div key={r.key} className={`buff-row ${r.kind}`}>
          <span>{t(r.key)}</span>
          <em>{r.sec}s</em>
          <i style={{ width: `${Math.round(r.ratio * 100)}%` }} />
        </div>
      ))}
    </div>
  );
}
