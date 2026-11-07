// 연습장 진영 탭 (sim/practiceFaction): 스킬 대기 초기화 · 진영 게이지 가득 · 바닥에 아이템 놓기 · 비르디아는 공생 정령 카드 다시 뽑기·바로 고르기·자람 단계
import { factionOfCharacter, practiceDropItems, practiceFactionFill, practiceSkillReset, practiceSpirit, practiceSpiritCards, practiceSpiritStage, SPIRIT_IDS, type CharacterId, type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../../i18n";

interface Props {
  run: () => RunState | null;
  characterId: CharacterId;
  t: (key: TextKey) => string;
}

const STAGES: TextKey[] = ["ftVirdiaStage0", "ftVirdiaStage1", "ftVirdiaStage2", "ftVirdiaStage3"];

export function PracticeFaction({ run, characterId, t }: Props) {
  const go = (f: (r: RunState) => void) => () => {
    const r = run();
    if (r) f(r);
  };
  const faction = factionOfCharacter(characterId);
  return (
    <div className="practice-faction">
      <div className="practice-row">
        <button type="button" onClick={go(practiceSkillReset)}>
          {t("pfSkillReset")}
        </button>
        <button type="button" title={t("pfFillTip")} onClick={go(practiceFactionFill)}>
          {t("pfFill")}
        </button>
        <button type="button" onClick={go(practiceDropItems)}>
          {t("pfDrop")}
        </button>
      </div>
      {!faction && characterId !== "blast" && characterId !== "nailer" && characterId !== "scissors" && characterId !== "hellfist" && <small>{t("pfNoFaction")}</small>}
      {faction === "virdia" && (
        <>
          <b>{t("pfSpirit")}</b>
          <div className="practice-row">
            <button type="button" onClick={go(practiceSpiritCards)}>
              {t("pfCards")}
            </button>
          </div>
          <div className="practice-row wrap">
            {SPIRIT_IDS.map((id) => (
              <button key={id} type="button" onClick={go((r) => practiceSpirit(r, id))}>
                {t(`sp_${id}` as TextKey)}
              </button>
            ))}
          </div>
          <b>{t("pfStage")}</b>
          <div className="practice-row">
            {STAGES.map((k, i) => (
              <button key={k} type="button" onClick={go((r) => practiceSpiritStage(r, i))}>
                {t(k)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
