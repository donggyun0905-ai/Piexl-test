// 대기실 캐릭터 고르기: 고른 캐릭터 크게(움직이는 그림 + 진영 + 설명) · 진영 탭 · 이름 찾기 · 그림 카드 목록(넘치면 스크롤)
// 탭·카드 모양은 혼자 하기 캐릭터 고르기(CharacterSelect)와 같은 진영 표(select/factions)를 씀
import { CHARACTER_IDS, type CharacterId } from "@pixel-rogue/shared";
import { useState } from "react";
import { characterOpen } from "../characterGoals";
import type { TextKey } from "../i18n";
import { factionOf, SELECT_TABS } from "../select/factions";
import { SkinPreview } from "../shop/SkinPreview";
import type { FactionId } from "../story/storyData";

interface Props {
  t: (key: TextKey) => string;
  picked?: CharacterId;
  onPick: (id: CharacterId) => void;
}

export function LobbyCharPicker({ t, picked, onPick }: Props) {
  const [find, setFind] = useState("");
  const [tab, setTab] = useState<FactionId | null>(null);
  const q = find.trim().toLowerCase();
  const list = CHARACTER_IDS.filter((c) => (!tab || factionOf(c) === tab) && (!q || t(c).toLowerCase().includes(q) || c.includes(q)));
  const tabs = SELECT_TABS.filter((x) => CHARACTER_IDS.some((c) => factionOf(c) === x.id));
  const pickedTab = picked ? SELECT_TABS.find((x) => x.id === factionOf(picked)) : undefined;
  return (
    <section className="room-pick">
      {picked && (
        <div className={`room-picked ${factionOf(picked)}`}>
          <span className="room-picked-art">
            <SkinPreview sheet={picked} size={88} />
          </span>
          <div>
            {pickedTab && <small className="room-picked-faction">{t(pickedTab.label)}</small>}
            <strong>{t(picked)}</strong>
            <p>{t(`${picked}Desc` as TextKey)}</p>
          </div>
        </div>
      )}
      <div className="room-pick-tools">
        <div className="room-tabs" role="tablist" aria-label={t("chooseCharacter")}>
          <button type="button" role="tab" aria-selected={!tab} className={!tab ? "on" : ""} onClick={() => setTab(null)}>
            {t("csAll")}
          </button>
          {tabs.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} className={`${x.id}${tab === x.id ? " on" : ""}`} onClick={() => setTab(x.id)}>
              {t(x.label)}
            </button>
          ))}
        </div>
        <input className="room-find" type="search" value={find} placeholder={t("lobbyFind")} aria-label={t("lobbyFind")} onChange={(e) => setFind(e.target.value)} />
      </div>
      <div className="room-char-grid" role="radiogroup" aria-label={t("chooseCharacter")}>
        {list.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={picked === c}
            title={t(c)}
            className={`room-char ${factionOf(c)}${picked === c ? " on" : ""}`}
            disabled={!characterOpen(c)}
            onClick={() => onPick(c)}
          >
            <SkinPreview sheet={c} size={52} still />
            <span>{t(c)}</span>
            {!characterOpen(c) && <i className="room-char-lock">🔒</i>}
          </button>
        ))}
        {list.length === 0 && <p className="hint">{t("lobbyNoChar")}</p>}
      </div>
    </section>
  );
}
