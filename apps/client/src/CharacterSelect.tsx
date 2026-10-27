import { ALL_CHARACTER_IDS, baseStats, CHARACTER_IDS, CHARACTERS, HIDDEN_CHARACTERS, type CharacterId } from "@pixel-rogue/shared";
import { useState } from "react";
import { useLang, type TextKey } from "./i18n";
import { achievementName } from "./i18n/achievements";
import { CHARACTER_GOALS, characterOpen } from "./characterGoals";
import { cleanSeed } from "./records";
import { SkinPreview } from "./shop/SkinPreview";
import { SkinChooser, wearable } from "./shop/SkinChooser";
import { parseSkin } from "./shop/skins";
import { THEME_KEY } from "./shop/SkinTab";
import { equippedSkin } from "./shop/wallet";
import { CardMedals } from "./medals/CardMedals";
import { TabooButton } from "./taboo/TabooButton";
import { setRandomKit } from "./taboo/tabooStore";
import { TEST_OPEN } from "./testFlags";

interface Props {
  t: (key: TextKey) => string;
  /** 시드 입력 칸을 보여 줌 (혼자 하기만) */
  showSeed?: boolean;
  initialSeed?: string;
  /** 금기의 서 버튼·무작위 캐릭터로 숨은 캐릭터가 나올 수 있음 (보통 혼자 하기만) */
  taboo?: boolean;
  /** 숨은 캐릭터도 목록에 보임 (연습장) */
  showHidden?: boolean;
  /** seedText: 입력한 시드 (비우면 빈 글자) */
  onSelect: (id: CharacterId, seedText: string) => void;
  onBack: () => void;
}

/** 무작위 캐릭터로 숨은 캐릭터가 나올 확률 (별지기 10% · 오리 5%) */
const HIDDEN_CHANCE: Partial<Record<CharacterId, number>> = { stargazer: 0.1, duck: 0.05, scribe: 0.05, miner: 0.05, voyager: 0.05 };

/** 무작위 캐릭터 고르기 (꾸밈 선택이라 브라우저 랜덤). withHidden이면 낮은 확률로 숨은 캐릭터 */
function rollCharacter(withHidden: boolean): { id: CharacterId; hidden: boolean } | null {
  if (withHidden) {
    let r = Math.random();
    for (const id of HIDDEN_CHARACTERS) {
      const c = HIDDEN_CHANCE[id] ?? 0;
      if (r < c) return { id, hidden: true };
      r -= c;
    }
  }
  const open = CHARACTER_IDS.filter((c) => characterOpen(c));
  const id = open[Math.floor(Math.random() * open.length)];
  return id ? { id, hidden: false } : null;
}
const NAME: Record<CharacterId, TextKey> = { warden: "warden", drifter: "drifter", mage: "mage", mystic: "mystic", engineer: "engineer", elementalist: "elementalist", brawler: "brawler", doctor: "doctor", gunner: "gunner", beast: "beast", ninja: "ninja", chronomancer: "chronomancer", summoner: "summoner", novice: "novice", bedouin: "bedouin", general: "general", imugi: "imugi", apostle: "apostle", stargazer: "stargazer", duck: "duck", abandoned: "abandoned", titan: "titan", oni: "oni", scribe: "scribe", idra: "idra", byeonhui: "byeonhui", fly: "fly", elder: "elder", ren: "ren", spiritist: "spiritist", plague: "plague", slayer: "slayer", eater: "eater", mukin: "mukin", samyeol: "samyeol", automata: "automata", rider: "rider", bomber: "bomber", artifacter: "artifacter", punk: "punk", tracker: "tracker", forgotten: "forgotten", remnant: "remnant", wanderer: "wanderer", silk: "silk", miner: "miner", voyager: "voyager" };
const DESC: Record<CharacterId, TextKey> = { warden: "wardenDesc", drifter: "drifterDesc", mage: "mageDesc", mystic: "mysticDesc", engineer: "engineerDesc", elementalist: "elementalistDesc", brawler: "brawlerDesc", doctor: "doctorDesc", gunner: "gunnerDesc", beast: "beastDesc", ninja: "ninjaDesc", chronomancer: "chronomancerDesc", summoner: "summonerDesc", novice: "noviceDesc", bedouin: "bedouinDesc", general: "generalDesc", imugi: "imugiDesc", apostle: "apostleDesc", stargazer: "stargazerDesc", duck: "duckDesc", abandoned: "abandonedDesc", titan: "titanDesc", oni: "oniDesc", scribe: "scribeDesc", idra: "idraDesc", byeonhui: "byeonhuiDesc", fly: "flyDesc", elder: "elderDesc", ren: "renDesc", spiritist: "spiritistDesc", plague: "plagueDesc", slayer: "slayerDesc", eater: "eaterDesc", mukin: "mukinDesc", samyeol: "samyeolDesc", automata: "automataDesc", rider: "riderDesc", bomber: "bomberDesc", artifacter: "artifacterDesc", punk: "punkDesc", tracker: "trackerDesc", forgotten: "forgottenDesc", remnant: "remnantDesc", wanderer: "wandererDesc", silk: "silkDesc", miner: "minerDesc", voyager: "voyagerDesc" };

export function CharacterSelect({ t, onSelect, onBack, showSeed = true, initialSeed = "", taboo = false, showHidden = false }: Props) {
  const [seed, setSeed] = useState(initialSeed);
  const { lang } = useLang();
  /** 스킨 고르기 창을 연 캐릭터 */
  const [choosing, setChoosing] = useState<CharacterId | null>(null);
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
    onSelect(c, seed);
  };
  return (
    <div className="select-screen">
      <h2>{t("chooseCharacter")}</h2>
      <div className="select-top">
        <button type="button" className="primary random-char" onClick={pickRandom}>
          🎲 {t("randomCharacter")}
        </button>
        {taboo && <TabooButton t={t} lang={lang} />}
        {/* 테스트 중에만: 숨은 캐릭터를 바로 골라 써 보기 */}
        {taboo &&
          TEST_OPEN &&
          HIDDEN_CHARACTERS.map((h) => (
            <button key={h} type="button" className="secondary hidden-pick" onClick={() => pick(h)}>
              ★ {t(NAME[h])} <small>{t("hiddenTest")}</small>
            </button>
          ))}
      </div>
      <div className="select-list">
        {(showHidden ? ALL_CHARACTER_IDS : CHARACTER_IDS).map((id) => {
          const s = baseStats(id, CHARACTERS[id].startWeapon);
          const worn = equippedSkin(id);
          const skins = wearable(id).length;
          const open = characterOpen(id);
          const goal = CHARACTER_GOALS[id];
          return (
            <div key={id} className="character-item">
              <button type="button" className={`character-card ${id}${open ? "" : " locked"}`} disabled={!open} onClick={() => pick(id)}>
                <span className="character-look">
                  <SkinPreview sheet={worn ?? id} size={64} />
                  <small>{worn ? t(THEME_KEY[parseSkin(worn).theme]) : t("shopDefault")}</small>
                </span>
                <strong>
                  {t(NAME[id])}
                </strong>
                <span className="character-desc">{t(DESC[id])}</span>
                {!open && goal && <span className="character-lock">🔒 {t("charGoalLock").replace("{name}", achievementName(goal, lang))}</span>}
                <dl>
                  <dt>{t("statHp")}</dt>
                  <dd>{s.maxHp}</dd>
                  <dt>{t("statDamage")}</dt>
                  <dd>{Math.round(s.damage)}</dd>
                  <dt>{t("statAttackSpeed")}</dt>
                  <dd>{Math.round(s.attackSpeed * 100) / 100}</dd>
                  <dt>{t("statRange")}</dt>
                  <dd>{s.range}</dd>
                  <dt>{t("statMoveSpeed")}</dt>
                  <dd>{Math.round(s.moveSpeed * 100) / 100}</dd>
                </dl>
              </button>
              {open && <CardMedals t={t} lang={lang} character={id} />}
              <button type="button" className="secondary skin-switch" disabled={skins < 2} title={skins < 2 ? t("skinSwitchNone") : undefined} onClick={() => setChoosing(id)}>
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
          <SkinPreview sheet={hidden} size={96} />
          <span>{t(NAME[hidden])}</span>
        </div>
      )}
      {choosing && <SkinChooser char={choosing} t={t} onClose={() => setChoosing(null)} />}
    </div>
  );
}
