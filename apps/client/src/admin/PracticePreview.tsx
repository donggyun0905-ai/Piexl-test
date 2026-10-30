// 관리자 페이지 오른쪽 연습장: 저장하기 전에 고친 수치로 바로 해 봄 (실제 게임에는 저장해야 반영)
import { ALL_CHARACTER_IDS, HIDDEN_CHARACTERS, LIMITED_CHARACTERS, type BalanceValues } from "@pixel-rogue/shared";
import { useState } from "react";
import { ADMIN_PREVIEW_KEY } from "../balance";
import { rowLabel } from "./labels";

function putDraft(values: BalanceValues): void {
  try {
    sessionStorage.setItem(ADMIN_PREVIEW_KEY, JSON.stringify(values));
  } catch {
    // 저장이 막힌 브라우저면 처음 값으로 열림
  }
}

export function PracticePreview({ draft }: { draft: BalanceValues }) {
  const [character, setCharacter] = useState<string>(ALL_CHARACTER_IDS[0]!);
  // 늘리면 연습장을 새로 염 (수치는 판을 시작할 때 들어감)
  const [round, setRound] = useState(() => {
    putDraft(draft);
    return 0;
  });

  const restart = (id = character) => {
    putDraft(draft);
    setCharacter(id);
    setRound((n) => n + 1);
  };

  return (
    <aside className="admin-practice">
      <div className="admin-practice-bar">
        <select value={character} onChange={(e) => restart(e.target.value)}>
          {/* 숨은·한정 캐릭터까지 모두 (뒤에 표시) */}
          {ALL_CHARACTER_IDS.map((id) => (
            <option key={id} value={id}>
              {rowLabel("characters", id)}
              {LIMITED_CHARACTERS.includes(id) ? " (한정)" : HIDDEN_CHARACTERS.includes(id) ? " (히든)" : ""}
            </option>
          ))}
        </select>
        <button type="button" className="primary" onClick={() => restart()}>
          지금 수치로 다시 시작
        </button>
      </div>
      <p className="admin-hint">저장 안 한 값도 여기서는 바로 적용됩니다. 실제 게임에는 저장해야 반영됩니다.</p>
      <iframe key={round} title="연습장" src={`/?adminPractice=${character}`} />
    </aside>
  );
}
