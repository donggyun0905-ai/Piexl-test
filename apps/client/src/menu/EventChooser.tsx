// 메인의 '이벤트'를 누르면 뜨는 선택 창 (앞으로 새로 만드는 놀이는 모두 여기)
import { useEffect, useRef } from "react";
import { formatTime } from "../game/hudText";
import type { TextKey } from "../i18n";
import { loadSwarmBest } from "../event/swarmRecords";
import { Choice } from "./SoloChooser";

interface Props {
  t: (key: TextKey) => string;
  onSwarm: () => void;
  onClose: () => void;
}

export function EventChooser({ t, onSwarm, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);
  const best = loadSwarmBest();
  return (
    <div className="modal-backdrop" onClick={onClose} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="modal chooser" role="dialog" aria-modal="true" aria-label={t("events")} onClick={(e) => e.stopPropagation()}>
        <h2>{t("events")}</h2>
        <div className="choices">
          <Choice
            icon="dawn"
            title={t("swarm")}
            desc={best ? `${t("swarmDesc")} · ${t("swarmBest").replace("{time}", formatTime(best.ticks)).replace("{lv}", String(best.lv))}` : t("swarmDesc")}
            onClick={onSwarm}
          />
        </div>
        <button ref={closeRef} type="button" className="ghost" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
