// 지도 최종보스 입구 창 (F): 보스 이름 · 설명 · 권장 투력과 내 투력 · 보상 · 도전 → 보스방 (world/BossTry) · Esc로 닫힘
import type { LastBossKind } from "@pixel-rogue/shared";
import { useEffect } from "react";
import type { TextKey } from "../i18n";
import { BOSS_TEXT } from "../i18n/enemies";
import { bossWon } from "../progress/subQuests";
import { gateOf } from "./bossGates";
import { myPower } from "./worldPlayer";

export function BossPanel({ t, boss, onClose, onGo }: { t: (k: TextKey) => string; boss: LastBossKind; onClose: () => void; onGo: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  });
  const power = myPower();
  const need = gateOf(boss)?.power ?? 0;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal world-note boss-gate" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>💀 {t(BOSS_TEXT[boss] as TextKey)}</h2>
        <p>{t("bgText")}</p>
        <p className={power >= need ? "ok" : "bad"}>{t("bgPower").replace("{n}", need.toLocaleString()).replace("{m}", power.toLocaleString())}</p>
        <p>{t("bgReward")}</p>
        {bossWon(boss) && <p className="ok">{t("bgCleared")}</p>}
        <button type="button" className="primary" onClick={onGo}>
          ⚔ {t("bgChallenge")}
        </button>
        <button type="button" className="ghost" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
