import { uiVoice } from "./audio/uiSounds";
import { ALL_CHARACTER_IDS, CHARACTER_IDS, HIDDEN_CHARACTERS, LIMITED_CHARACTERS, type CharacterId } from "@pixel-rogue/shared";
import { charDifficulty, diffStars, recommended, recommendedFirst } from "./charDifficulty";
import { ownedLimited } from "./shop/limitedChars";
import { useState } from "react";
import { useLang, type TextKey } from "./i18n";
import { characterOpen } from "./characterGoals";
import { cleanSeed } from "./records";
import { SkinPreview } from "./shop/SkinPreview";
import { SkinChooser } from "./shop/SkinChooser";
import { equippedSkin } from "./shop/wallet";
import { CardMedals } from "./medals/CardMedals";
import { TabooButton } from "./taboo/TabooButton";
import { charInStory, factionOpen, featureOpen } from "./progress/storyStage";
import { setRandomKit } from "./taboo/tabooStore";
import { TEST_OPEN } from "./testFlags";
import { hallUnlocked } from "./lobby/exhibits";
import { CharPickDialog, skinName } from "./select/CharPickDialog";
import { charCardSrc } from "./select/charArt";
import { FACTION_TRAIT, factionOf, SELECT_TABS } from "./select/factions";
import type { FactionId } from "./story/storyData";
import { addPlay, cardOf, frameOf, masteryLevel, playsOf } from "./mastery/mastery";

interface Props {
  t: (key: TextKey) => string;
  /** 시드 입력 칸을 보여 줌 (혼자 하기만) */
  showSeed?: boolean;
  initialSeed?: string;
  /** 금기의 서 버튼·무작위 캐릭터로 숨은 캐릭터가 나올 수 있음 (보통 혼자 하기만) */
  taboo?: boolean;
  /** 숨은 캐릭터도 목록에 보임 (연습장) */
  showHidden?: boolean;
  /** 연습·튜토리얼: 숙련도가 오르지 않음 */
  practice?: boolean;
  /** 한정 캐릭터(서고의 감시자)를 빼고 보임: 패왕전·일일 도전 (기록이 남는 곳) */
  noLimited?: boolean;
  /** seedText: 입력한 시드 (비우면 빈 글자) */
  onSelect: (id: CharacterId, seedText: string) => void;
  onBack: () => void;
}

/** 무작위 캐릭터로 숨은 캐릭터가 나올 확률 (숨은 캐릭터 묶음 전체 2%) · 걸리면 이 목록에서 같은 확률로 하나 */
const HIDDEN_CHANCE = 0.02;
const HIDDEN_ROLL: readonly CharacterId[] = ["stargazer", "duck", "scribe", "miner", "voyager", "zeus", "pilgrim"];

/** 무작위 캐릭터 고르기 (꾸밈 선택이라 브라우저 랜덤). withHidden이면 낮은 확률로 숨은 캐릭터 */
function rollCharacter(withHidden: boolean): { id: CharacterId; hidden: boolean } | null {
  const pool = HIDDEN_ROLL.filter((c) => HIDDEN_CHARACTERS.includes(c) && charInStory(c));
  if (withHidden && pool.length && Math.random() < HIDDEN_CHANCE) return { id: pool[Math.floor(Math.random() * pool.length)]!, hidden: true };
  const open = CHARACTER_IDS.filter((c) => characterOpen(c));
  const id = open[Math.floor(Math.random() * open.length)];
  return id ? { id, hidden: false } : null;
}
export function CharacterSelect({ t, onSelect, onBack, showSeed = true, initialSeed = "", taboo = false, showHidden = false, practice = false, noLimited = false }: Props) {
  const [seed, setSeed] = useState(initialSeed);
  const { lang } = useLang();
  /** 스킨 고르기 창을 연 캐릭터 */
  const [choosing, setChoosing] = useState<CharacterId | null>(null);
  /** 눌러서 설명 창을 연 캐릭터 */
  const [picking, setPicking] = useState<CharacterId | null>(null);
  /** 진영 탭 (null = 전체) · 검색 */
  const [tab, setTab] = useState<FactionId | null>(null);
  const [find, setFind] = useState("");
  /** 숨은 캐릭터가 나왔을 때 잠깐 보여 주는 글 */
  const [hidden, setHidden] = useState<CharacterId | null>(null);
  /** 열린 캐릭터 중 하나를 무작위로. 혼자 하기면 낮은 확률로 숨은 캐릭터 (잠깐 등장 화면 뒤 시작) */
  const pickRandom = () => {
    if (hidden) return;
    const r = rollCharacter(taboo);
    if (!r) return;
    if (!r.hidden) return pick(r.id, true);
    setHidden(r.id);
    setTimeout(() => pick(r.id, true), 1600);
  };
  /** random: 무작위로 골랐으면 시작 장비도 무작위 */
  const pick = (c: CharacterId, random = false) => {
    setRandomKit(random);
    if (!practice) addPlay(c);
    onSelect(c, seed);
  };
  // 연습장은 숨은 캐릭터 전부 · 혼자 하기는 테스트 중에만 숨은 캐릭터 전부 (아카식 레코드 탭) · 그 밖에는 전시장에서 연 숨은 캐릭터
  // 한정 캐릭터(서고의 감시자): 가졌으면 기록이 남지 않는 곳에서 마음껏 (패왕전·일일 도전은 빼고)
  const all = [...new Set<CharacterId>(showHidden || (taboo && TEST_OPEN) ? ALL_CHARACTER_IDS : [...CHARACTER_IDS, ...hallUnlocked(), ...ownedLimited()])].filter((c) => (!noLimited || !LIMITED_CHARACTERS.includes(c)) && charInStory(c));
  const q = find.trim().toLowerCase();
  const found = all.filter((c) => (!tab || factionOf(c) === tab) && (!q || t(c as TextKey).toLowerCase().includes(q)));
  const list = !tab && !q ? recommendedFirst(found) : found;
  // 서고의 감시자(한정 캐릭터) 탭은 아직 비어 있어도 늘 보임
  const tabs = SELECT_TABS.filter((x) => (x.id === "archive" && factionOpen("archive")) || all.some((c) => factionOf(c) === x.id));
  return (
    <div className="select-screen">
      <h2>{t("chooseCharacter")}</h2>
      <div className="select-top">
        <button type="button" className="primary random-char" onClick={pickRandom}>
          🎲 {t("randomCharacter")}
        </button>
        {taboo && featureOpen("taboo") && <TabooButton t={t} lang={lang} />}
      </div>
      <div className="cs-tabs">
        <button type="button" className={!tab ? "on" : ""} onClick={() => setTab(null)}>
          {t("csAll")}
        </button>
        {tabs.map((x) => (
          <button key={x.id} type="button" className={`${x.id}${tab === x.id ? " on" : ""}`} onClick={() => setTab(x.id)}>
            {t(x.label)}
            {x.id === "akashic" && TEST_OPEN && <small>{t("csAkashicTest")}</small>}
          </button>
        ))}
        <input type="search" value={find} placeholder={t("csSearch")} onChange={(e) => setFind(e.target.value)} />
      </div>
      {tab && FACTION_TRAIT[tab] && (
        <p className={`cs-trait ${tab}`}>
          <b>{t(FACTION_TRAIT[tab]!.name)}</b> {t(FACTION_TRAIT[tab]!.tip)}
        </p>
      )}
      <div className="select-list">
        {list.length === 0 && <p className="cs-empty">{t(tab === "archive" && !q ? "csArchiveSoon" : "csEmpty")}</p>}
        {list.map((id) => {
          const open = characterOpen(id);
          const card = cardOf(id);
          const lv = masteryLevel(playsOf(id));
          const art = charCardSrc(id);
          return (
            <div key={id} className="character-item">
              <div className={`cs-frame frame-${frameOf(id)}`}>
                <button type="button" className={`character-card ${id}${card ? ` card-skin-${card}` : ""}${open ? "" : " locked"}`} data-sfx="none" onClick={() => {
                  setPicking(id);
                  uiVoice(id, factionOf(id));
                }}>
                  {art ? (
                    <span className="character-look art">
                      <img src={art} alt="" loading="lazy" draggable={false} />
                    </span>
                  ) : (
                    <span className="character-look">
                      <SkinPreview sheet={equippedSkin(id) ?? id} size={112} still />
                    </span>
                  )}
                  <strong>{t(id as TextKey)}</strong>
                  <small className="cs-skin">{skinName(t, id)}</small>
                  {lv > 0 && <span className={`cs-lv-badge lv-${lv}`}>Lv.{lv}</span>}
                  <span className={`cs-diff d${charDifficulty(id)}`} title={t("csDiff")}>
                    {recommended(id) && <b>{t("csRecommend")}</b>}
                    {diffStars(id)}
                  </span>
                  {!open && <span className="character-lock">🔒</span>}
                </button>
                {open && <CardMedals t={t} lang={lang} character={id} />}
              </div>
              <button type="button" className="secondary skin-switch" onClick={() => setChoosing(id)}>
                👕 {t("skinSwitch")}
              </button>
            </div>
          );
        })}
      </div>
      {showSeed && (
        <label className="seed-input">
          {t("seed")}
          <input
            value={seed}
            placeholder={t("seedPlaceholder")}
            maxLength={16}
            autoCapitalize="characters"
            spellCheck={false}
            onChange={(e) => setSeed(cleanSeed(e.target.value))}
          />
        </label>
      )}
      <button type="button" className="secondary" onClick={onBack}>
        {t("back")}
      </button>
      {hidden && (
        <div className="hidden-found" role="status">
          <strong>{t("hiddenFound")}</strong>
          <SkinPreview sheet={hidden} size={96} still />
          <span>{t(hidden as TextKey)}</span>
        </div>
      )}
      {picking && <CharPickDialog t={t} lang={lang} c={picking} onClose={() => setPicking(null)} onGo={() => pick(picking)} />}
      {choosing && <SkinChooser char={choosing} t={t} onClose={() => setChoosing(null)} />}
    </div>
  );
}
