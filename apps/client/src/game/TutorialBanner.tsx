// 튜토리얼 안내: 지금 단계 설명 + 건너뛰기
import type { TextKey } from "../i18n";
import { TUTORIAL_STEPS, type TutorialStepId } from "./tutorial";

/** 마지막 단계: 진영마다 공통 특징 한 줄 (로그) */
const FACTION_LINES: [TextKey, TextKey][] = [
  ["csAscalon", "tfAscalon"],
  ["csTerracore", "tfTerracore"],
  ["csVirdia", "tfVirdia"],
  ["csHelios", "tfHelios"],
  ["csThalassia", "tfThalassia"],
  ["csSilber", "tfSilber"],
  ["csSeongguk", "tfSeongguk"],
  ["csDawn", "tfDawn"],
];

const TEXT: Record<TutorialStepId, TextKey> = {
  move: "tutorialMove",
  attack: "tutorialAttack",
  dash: "tutorialDash",
  dodge: "tutorialDodge",
  weapon: "tutorialWeapon",
  reward: "tutorialReward",
  item: "tutorialItem",
  map: "tutorialMap",
  end: "tutorialEnd",
};

interface Props {
  step: TutorialStepId;
  t: (key: TextKey) => string;
  touchMode: boolean;
  onSkip: () => void;
  onExit: () => void;
}

export function TutorialBanner({ step, t, touchMode, onSkip, onExit }: Props) {
  const last = step === "end";
  return (
    <div className="tutorial-banner" role="status">
      <small>
        {t("tutorial")} {TUTORIAL_STEPS.indexOf(step) + 1}/{TUTORIAL_STEPS.length}
      </small>
      <p>{t(TEXT[step])}</p>
      {step === "item" && touchMode && <p className="tutorial-sub">{t("tutorialItemTouch")}</p>}
      {last && (
        <div className="tutorial-factions">
          <b>{t("tutorialFactions")}</b>
          <ul>
            {FACTION_LINES.map(([name, line]) => (
              <li key={name}>
                <strong>{t(name)}</strong> {t(line)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="tutorial-actions">
        {!last && (
          <button type="button" onClick={onSkip}>
            {t("tutorialSkip")}
          </button>
        )}
        <button type="button" className={last ? "primary" : ""} onClick={onExit}>
          {last ? t("tutorialFinish") : t("tutorialQuit")}
        </button>
      </div>
    </div>
  );
}
