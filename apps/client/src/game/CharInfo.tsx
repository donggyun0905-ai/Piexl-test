// 로그 '캐릭터 설명' 큰 창 (왼쪽 칸 버튼·I): 게임을 멈추고 왼쪽에 설명·모든 무기·전용 아이템(누르면 연습장에서 들어 봄), 오른쪽에 직접 움직이는 작은 연습장 · Esc·I·닫기로 닫음
import { characterWeapons, createPracticeRun, PASSIVE_IDS, PASSIVES, practiceGive, type CharacterId, type PassiveDef, type PracticeItem } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { charGuide } from "../i18n/guides";
import { itemDesc, itemName } from "../i18n/items";
import { GameScreen } from "./GameScreen";
import { ItemIcon } from "./itemIcon";
import { RichText } from "./RichText";
import { charArtSrc } from "../select/charArt";

interface Props {
  character: CharacterId;
  lang: Lang;
  t: (k: TextKey) => string;
  onClose: () => void;
}

export default function CharInfo({ character, lang, t, onClose }: Props) {
  const [run] = useState(() => createPracticeRun(character));
  const [held, setHeld] = useState<string>(run.player.weaponId);
  const weapons = characterWeapons(character);
  const passives = PASSIVE_IDS.filter((id) => (PASSIVES[id] as PassiveDef).exclusive === character);
  const give = (item: PracticeItem) => {
    practiceGive(run, item);
    if (item.kind === "weapon") setHeld(item.id);
  };
  const card = (item: PracticeItem) => (
    <button key={item.id} type="button" className={`ci-item${item.kind === "weapon" && held === item.id ? " on" : ""}`} onClick={() => give(item)}>
      <ItemIcon item={item} size={32} />
      <span>
        <b>{itemName(item.kind, item.id, lang)}</b>
        <small>{itemDesc(item.kind, item.id, lang, t)}</small>
      </span>
    </button>
  );
  return (
    <div className="char-info" role="dialog" aria-label={t("ciTitle")}>
      <header>
        <b>
          {t("ciTitle")} · {t(character as TextKey)}
        </b>
        <small>{t("ciPaused")}</small>
        <button type="button" onClick={onClose}>
          {t("ciClose")}
        </button>
      </header>
      <div className="ci-body">
        <section className="ci-left">
          {charArtSrc(character) && <img className="ci-art" src={charArtSrc(character)!} alt="" draggable={false} />}
          <ul className="ci-guide">
            {charGuide(character, lang).map((line) => (
              <li key={line}>
                <RichText text={line} />
              </li>
            ))}
          </ul>
          <h4>{t("ciWeapons")}</h4>
          <div className="ci-list">{weapons.map((id) => card({ kind: "weapon", id }))}</div>
          {passives.length > 0 && <h4>{t("ciPassives")}</h4>}
          <div className="ci-list">{passives.map((id) => card({ kind: "passive", id }))}</div>
        </section>
        <section className="ci-right">
          <small>{t("ciPractice")}</small>
          <div className="ci-practice">
            <GameScreen mode="practice" embedded characterId={character} seedText="" initialRun={run} unlocks={[]} lang={lang} t={t} onExit={onClose} />
          </div>
        </section>
      </div>
    </div>
  );
}
