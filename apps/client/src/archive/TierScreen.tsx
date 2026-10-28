// 티어표 (아카이브): 단계마다 캐릭터 얼굴 · 마우스를 올리면 이유 · 누르면 아래에서 허수아비 미리보기
import type { CharacterId } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { tierReason } from "../i18n/tier";
import { StoryFace } from "../story/StoryFace";
import { TIERS, tierChars, type TierId, type TierView } from "./tierData";
import { TierPreview } from "./TierPreview";

const TIER_LABEL: Record<TierId, TextKey> = { god: "tierGod", meal: "tierMeal", mid: "tierMid", meh: "tierMeh", trash: "tierTrash" };
const VIEWS: { id: TierView; label: TextKey }[] = [
  { id: "all", label: "tierAll" },
  { id: "s1", label: "tierS1" },
  { id: "s2", label: "tierS2" },
];

interface Props {
  lang: Lang;
  t: (k: TextKey) => string;
  onBack: () => void;
}

export function TierScreen({ lang, t, onBack }: Props) {
  const [view, setView] = useState<TierView>("all");
  const [picked, setPicked] = useState<CharacterId | null>(null);
  const previewRef = useRef<HTMLElement>(null);
  // 고르면 아래 미리보기가 보이게 내려감
  useEffect(() => {
    if (picked) previewRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [picked]);
  return (
    <main className="story-screen tier-screen">
      <header className="story-head">
        <h2>{t("tierList")}</h2>
        <span>{t("archive")}</span>
      </header>
      <p className="tier-note">{t("tierNote")}</p>
      <nav className="shop-tabs">
        {VIEWS.map((v) => (
          <button key={v.id} type="button" className={view === v.id ? "active" : ""} onClick={() => setView(v.id)}>
            {t(v.label)}
          </button>
        ))}
      </nav>
      <div className="tier-table">
        {TIERS.map((tier) => {
          const chars = tierChars(tier.chars, view);
          if (!chars.length) return null;
          return (
            <section key={tier.id} className="tier-row" style={{ ["--tc" as string]: tier.color }}>
              <h3 className="tier-label">{t(TIER_LABEL[tier.id])}</h3>
              <div className="tier-faces">
                {chars.map((c, i) => (
                  <button key={c} type="button" className={`tier-face${picked === c ? " active" : ""}`} onClick={() => setPicked(c)}>
                    <StoryFace who={c} size={44} />
                    <small>
                      {i + 1}. {t(c as TextKey)}
                    </small>
                    <span className="tier-tip" role="tooltip">
                      <strong>{t(c as TextKey)}</strong>
                      {tierReason(c, lang)}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <section ref={previewRef} className="tier-preview">
        {picked ? (
          <>
            <h3>
              {t(picked as TextKey)} <small>{t("tierPreviewNote")}</small>
            </h3>
            <TierPreview key={picked} id={picked} t={t} />
            <p>{tierReason(picked, lang)}</p>
          </>
        ) : (
          <p className="tier-pick">{t("tierPick")}</p>
        )}
      </section>
      <button type="button" className="secondary" onClick={onBack}>
        {t("back")}
      </button>
    </main>
  );
}
