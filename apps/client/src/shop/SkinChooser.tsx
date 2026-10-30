// 캐릭터 선택창의 스킨 바꾸기 창: 스킨 · 숙련도 테두리 · 카드 꾸밈을 눌러서 바꿈 (Esc·바깥으로 닫음)
import type { CharacterId } from "@pixel-rogue/shared";
import { useState } from "react";
import type { TextKey } from "../i18n";
import { Modal } from "../menu/Modal";
import { CARD_SKINS, cardOf, frameOf, masteryLevel, MASTERY_AT, MASTERY_MAX, ownedCards, playsOf, setCard, setFrame, type CardSkin } from "../mastery/mastery";
import { MasteryLine } from "../select/CharPickDialog";
import { TEST_OPEN } from "../testFlags";
import { SkinPreview } from "./SkinPreview";
import { LIMITED_THEMES, MY_THEME, VICTORY_THEME, parseSkin, SKIN_THEMES, skinId } from "./skins";
import { THEME_KEY } from "./SkinTab";
import { equippedSkin, equipSkin, ownedSkins } from "./wallet";

/** 이 캐릭터가 입을 수 있는 스킨 (기본 = null, 나만의 스킨 → 한정 → 상점 순서) */
export function wearable(c: CharacterId): (string | null)[] {
  const owned = ownedSkins();
  return [null, ...[MY_THEME, ...LIMITED_THEMES, VICTORY_THEME, ...SKIN_THEMES].map((th) => skinId(c, th)).filter((id) => owned.includes(id))];
}

const TABS = [
  ["skin", "chooseSkin"],
  ["frame", "chooseFrame"],
  ["card", "chooseCard"],
] as const;
const FRAMES = Array.from({ length: MASTERY_MAX + 1 }, (_, i) => i);

export function SkinChooser({ char, t, onClose }: { char: CharacterId; t: (k: TextKey) => string; onClose: () => void }) {
  // 고를 때마다 다시 그림 (저장소 값을 읽어 표시)
  const [, redraw] = useState(0);
  const [tab, setTab] = useState<"skin" | "frame" | "card">("skin");
  const worn = equippedSkin(char) ?? null;
  const lv = masteryLevel(playsOf(char));
  const frame = frameOf(char);
  const card = cardOf(char);
  const owned = ownedCards();
  const sheet = worn ?? char;
  const sample = (f: number, c: CardSkin | null, size = 64) => (
    <span className={`cs-frame mastery-sample frame-${f}${size > 64 ? " big" : ""}`}>
      <span className={`character-card ${char}${c ? ` card-skin-${c}` : ""}`}>
        <SkinPreview sheet={sheet} size={size} />
      </span>
    </span>
  );
  const then = (fn: () => void) => () => (fn(), redraw((n) => n + 1));
  return (
    <Modal title={`${t(char as TextKey)} · ${t("skinSwitch")}`} t={t} onClose={onClose} className="skin-chooser">
      <div className="cs-tabs">
        {TABS.map(([id, key]) => (
          <button key={id} type="button" className={tab === id ? "on" : ""} onClick={() => setTab(id)}>
            {t(key)}
          </button>
        ))}
      </div>
      {tab === "skin" && (
        <section className="chooser-section">
          <div className="skin-chooser-grid">
            {wearable(char).map((id) => (
              <button key={id ?? "default"} type="button" className={`skin-choice${worn === id ? " wearing" : ""}`} onClick={then(() => equipSkin(char, id))}>
                <SkinPreview sheet={id ?? char} size={96} />
                <strong>{id ? t(THEME_KEY[parseSkin(id).theme]) : t("shopDefault")}</strong>
                {worn === id && <small>{t("shopEquipped")}</small>}
              </button>
            ))}
          </div>
        </section>
      )}
      {tab === "frame" && (
        <section className="chooser-section">
          <MasteryLine t={t} c={char} />
          <div className="skin-chooser-grid">
            {FRAMES.map((f) => (
              <button key={f} type="button" disabled={f > lv} className={`skin-choice${frame === f ? " wearing" : ""}${f > lv ? " lockedChoice" : ""}`} onClick={then(() => setFrame(char, f))}>
                {sample(f, card)}
                <strong>{f === 0 ? t("frameNone") : t(`frame${f}` as TextKey)}</strong>
                {f > lv ? (
                  <small>
                    {t("frameLock").replace("{n}", String(f))} · {MASTERY_AT[f - 1]}
                  </small>
                ) : (
                  frame === f && <small>{t("shopEquipped")}</small>
                )}
              </button>
            ))}
          </div>
        </section>
      )}
      {tab === "card" && (
        <section className="chooser-section">
          <p>
            {t("cardRaidNote")}
            {TEST_OPEN && ` · ${t("cardTestNote")}`}
          </p>
          <div className="skin-chooser-grid">
            {[null, ...CARD_SKINS].map((c) => {
              const has = c === null || owned.includes(c);
              return (
                <button key={c ?? "none"} type="button" disabled={!has} className={`skin-choice${card === c ? " wearing" : ""}${has ? "" : " lockedChoice"}`} onClick={then(() => setCard(char, c))}>
                  {sample(0, c, 88)}
                  <strong>{c ? t(`card_${c}` as TextKey) : t("cardDefault")}</strong>
                  {!has ? <small>🔒 {t("cardLocked")}</small> : card === c && <small>{t("shopEquipped")}</small>}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </Modal>
  );
}
