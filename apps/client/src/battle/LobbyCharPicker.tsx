// 대기실 캐릭터 고르기: 이름으로 찾기 · 얼굴 칸 목록(넘치면 스크롤) · 고른 캐릭터 크게 + 설명 (캐릭터가 많아도 한눈에)
import { CHARACTER_IDS, type CharacterId } from "@pixel-rogue/shared";
import { useState } from "react";
import { characterOpen } from "../characterGoals";
import type { TextKey } from "../i18n";
import { TdPortrait } from "../td/TdScreen";

interface Props {
  t: (key: TextKey) => string;
  picked?: CharacterId;
  onPick: (id: CharacterId) => void;
}

export function LobbyCharPicker({ t, picked, onPick }: Props) {
  const [find, setFind] = useState("");
  const q = find.trim().toLowerCase();
  const list = CHARACTER_IDS.filter((c) => !q || t(c).toLowerCase().includes(q) || c.includes(q));
  return (
    <section className="lobby-characters">
      <span className="field-label">{t("chooseCharacter")}</span>
      {picked && (
        <div className="lobby-picked">
          <TdPortrait id={picked} size={56} />
          <div>
            <strong>{t(picked)}</strong>
            <p className="hint">{t(`${picked}Desc` as TextKey)}</p>
          </div>
        </div>
      )}
      <input className="lobby-find" type="search" value={find} placeholder={t("lobbyFind")} aria-label={t("lobbyFind")} onChange={(e) => setFind(e.target.value)} />
      <div className="lobby-char-grid" role="radiogroup" aria-label={t("chooseCharacter")}>
        {list.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={picked === c}
            title={t(c)}
            className={picked === c ? "lobby-char selected" : "lobby-char"}
            disabled={!characterOpen(c)}
            onClick={() => onPick(c)}
          >
            <TdPortrait id={c} size={36} />
            <span>{t(c)}</span>
          </button>
        ))}
        {list.length === 0 && <p className="hint">{t("lobbyNoChar")}</p>}
      </div>
    </section>
  );
}
