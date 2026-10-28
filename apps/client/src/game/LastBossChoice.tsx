// 6층 클리어 결과 창에 붙는 라스트 보스 도전: "최강자에게 도전하시겠습니까?" + 보스 고르기 (아직 없는 보스는 준비 중)
import { LAST_BOSSES, S2_LAST_BOSSES, type LastBossKind } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

const BOSSES: { kind: string; label: TextKey }[] = [
  { kind: "dragon", label: "bossDragon" },
  { kind: "godeater", label: "bossGodEater" },
  { kind: "plight", label: "bossPrimeval" },
  { kind: "umbra", label: "bossUmbra" },
  { kind: "demigod", label: "bossDemigod" },
];

export function LastBossChoice({ t, onChoose }: { t: (key: TextKey) => string; onChoose: (boss: LastBossKind) => void }) {
  return (
    <div className="last-boss-choice">
      <h3>{t("challengeTitle")}</h3>
      <p>{t("challengeDesc")}</p>
      <div className="last-boss-buttons">
        {BOSSES.map((b) => {
          const ready = ([...LAST_BOSSES, ...S2_LAST_BOSSES] as readonly string[]).includes(b.kind);
          return (
            <button key={b.kind} type="button" className={ready ? "primary" : ""} disabled={!ready} onClick={() => ready && onChoose(b.kind as LastBossKind)}>
              {t(b.label)}
              {!ready && <small> ({t("comingSoon")})</small>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
