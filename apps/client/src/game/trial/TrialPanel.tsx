// 시련의 방 창: 비석 "시련을 시작하겠습니까?" YES/NO · 보상 상자에서 하나 고르기 (능력치·패시브·사용 아이템)
// 누른 것은 입력 menu → sim/trial (기록·다시 돌리기에서도 같은 결과)
import { menuCode, TRIAL_OP } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../../i18n";
import { itemDesc, itemName } from "../../i18n/items";
import { ItemIcon, type IconItem } from "../itemIcon";
import type { StationView } from "../stationView";

interface Props {
  view: StationView;
  lang: Lang;
  t: (key: TextKey) => string;
  send: (code: number) => void;
}

export function TrialPanel({ view, lang, t, send }: Props) {
  if (view.trial) {
    return (
      <div className="station-window trial" role="dialog" aria-label={t("trialTitle")}>
        <div className="trial-ask">
          <b className="trial-ask-title">{t(view.trial.used ? "trialUsed" : "trialAsk")}</b>
          {!view.trial.used && (
            <>
              <p>{t("trialAskHint")}</p>
              <div className="trial-ask-buttons">
                <button type="button" className="trial-yes" onClick={() => send(menuCode(TRIAL_OP.answer, 1))}>
                  {t("trialYes")}
                </button>
                <button type="button" className="trial-no" onClick={() => send(menuCode(TRIAL_OP.answer, 0))}>
                  {t("trialNo")}
                </button>
              </div>
            </>
          )}
          <small>{t("stationClose")}</small>
        </div>
      </div>
    );
  }
  const chest = view.chest!;
  const kind = chest.code === "ps" ? "stat" : chest.code === "sr" ? "room" : chest.code.startsWith("pp:") ? "passive" : "use";
  const head = kind === "stat" ? "trialChestStat" : kind === "room" ? "vaultChestRoom" : kind === "passive" ? "trialChestPassive" : "trialChestUse";
  return (
    <div className="station-window trial-chest" role="dialog" aria-label={t(head)}>
      <header className="station-head">
        <b>{t(head)}</b>
        <small>{t("stationClose")}</small>
      </header>
      <div className="trial-options">
        {chest.options.map((id, i) => (
          <button key={`${id}${i}`} type="button" className="trial-option" onClick={() => send(menuCode(TRIAL_OP.chest, i))}>
            {kind === "stat" ? (
              <b>{t(`gymStat_${id}` as TextKey)} +10%</b>
            ) : kind === "room" ? (
              <span>
                <b>{t(`vaultRoom_${id}` as TextKey)}</b>
                <small>{t(`vaultRoomDesc_${id}` as TextKey)}</small>
              </span>
            ) : (
              <>
                <ItemIcon item={{ kind, id } as IconItem} size={40} />
                <span>
                  <b>{itemName(kind, id, lang)}</b>
                  <small>{itemDesc(kind, id, lang, t)}</small>
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
