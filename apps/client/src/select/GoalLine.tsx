// 캐릭터 고르기 창의 잠금 줄: 여는 조건(글자 i18n/text/charGoals) · 진행도 · 로비 칩으로 사는 캐릭터는 '칩으로 열기' 버튼
import type { CharacterId } from "@pixel-rogue/shared";
import { useState } from "react";
import { CHARACTER_GOALS, goalProgress } from "../characterGoals";
import type { TextKey } from "../i18n";
import { addChips, loadChips } from "../lobby/chips";
import { addBought } from "../unlock/unlockStats";

const fmt = (v: number) => (Number.isInteger(v) ? v.toLocaleString() : String(Math.round(v * 100) / 100));

export function GoalLine({ t, c, onOpen }: { t: (k: TextKey) => string; c: CharacterId; onOpen: () => void }) {
  const [err, setErr] = useState("");
  const goal = CHARACTER_GOALS[c];
  if (!goal) return null;
  const p = goalProgress(c, goal);
  const n = "buy" in goal ? goal.buy : p.n;
  const text = t(`cg_${c}` as TextKey).replace("{n}", fmt(n)).replace("{t}", "taboo" in goal ? fmt(goal.taboo) : "");
  const buy = () => {
    if (!("buy" in goal)) return;
    const chips = loadChips();
    if (chips < goal.buy) return setErr(t("cgNoChips").replace("{n}", fmt(chips)));
    addChips(-goal.buy);
    addBought(c);
    onOpen();
  };
  return (
    <div className="character-lock cs-goal">
      🔒 {text}
      {p.n > 1 && <small> ({fmt(Math.min(p.v, p.n))} / {fmt(p.n)})</small>}
      {"buy" in goal && (
        <button type="button" className="primary small" onClick={buy}>
          🪙 {t("cgBuy").replace("{n}", fmt(goal.buy))}
        </button>
      )}
      {err && <small className="cs-goal-err">{err}</small>}
    </div>
  );
}
