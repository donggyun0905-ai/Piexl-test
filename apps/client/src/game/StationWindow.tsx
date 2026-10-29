// 작업대 창 (작업대 앞에서 F): 아티팩터 거대한 제작대(BenchPanel) · 추적자 튜닝소(TunePanel). 결과가 나오면 가운데에 성공·실패·파괴 연출 (StationResultFx)
// 누른 것은 controls.queueMenu → 입력 menu → sim/station (기록·협동에서도 같은 결과)
import type { Lang, TextKey } from "../i18n";
import { BenchPanel } from "./BenchPanel";
import type { Controls } from "./controls";
import { StationResultFx } from "./StationResultFx";
import type { StationView } from "./stationView";
import { TunePanel } from "./TunePanel";

interface Props {
  view: StationView;
  lang: Lang;
  t: (key: TextKey) => string;
  controls: () => Controls | null;
}

export function StationWindow({ view, lang, t, controls }: Props) {
  const send = (code: number) => controls()?.queueMenu(code);
  const bench = view.kind === "bench";
  return (
    <div className={`station-window ${view.kind}`} role="dialog" aria-label={t(bench ? "benchTitle" : "tuneTitle")}>
      <header className="station-head">
        <b>{t(bench ? "benchTitle" : "tuneTitle")}</b>
        <span className="station-gold">
          {t("stationGold")} <strong>{view.gold}G</strong>
        </span>
        <small>{t("stationClose")}</small>
      </header>
      {bench ? <BenchPanel view={view} lang={lang} t={t} send={send} /> : <TunePanel view={view} lang={lang} t={t} send={send} />}
      <StationResultFx last={view.last} lang={lang} t={t} />
    </div>
  );
}
