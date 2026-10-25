// 관리자 페이지(타워 디펜스 수치) 오른쪽 연습장: 저장하기 전에 고친 수치로 타워 디펜스를 바로 해 봄
import { TD_MAPS, type BalanceValues } from "@pixel-rogue/shared";
import { useState } from "react";
import { ADMIN_TD_PREVIEW_KEY } from "../balance";
import { TEXT } from "../i18n/text";

function putDraft(values: BalanceValues): void {
  try {
    sessionStorage.setItem(ADMIN_TD_PREVIEW_KEY, JSON.stringify(values));
  } catch {
    // 저장이 막힌 브라우저면 처음 값으로 열림
  }
}

export function TdPreview({ draft }: { draft: BalanceValues }) {
  const [map, setMap] = useState<string>(TD_MAPS[0]!.id);
  // 늘리면 새로 염 (수치는 판을 시작할 때 들어감)
  const [round, setRound] = useState(() => {
    putDraft(draft);
    return 0;
  });
  const restart = (id = map) => {
    putDraft(draft);
    setMap(id);
    setRound((n) => n + 1);
  };
  return (
    <aside className="admin-practice">
      <div className="admin-practice-bar">
        <select value={map} onChange={(e) => restart(e.target.value)}>
          {TD_MAPS.map((m) => (
            <option key={m.id} value={m.id}>
              {(TEXT as Record<string, { ko: string }>)[`tdMap_${m.id}`]?.ko ?? m.id}
            </option>
          ))}
        </select>
        <button type="button" className="primary" onClick={() => restart()}>
          지금 수치로 다시 시작
        </button>
      </div>
      <p className="admin-hint">저장 안 한 값도 여기서는 바로 적용됩니다. 실제 게임에는 저장해야 반영됩니다.</p>
      <iframe key={round} title="타워 디펜스 연습" src={`/?adminTd=${map}`} />
    </aside>
  );
}
