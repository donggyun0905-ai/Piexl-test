// 작업대 창 (작업대 앞에서 F): 아티팩터 거대한 제작대(BenchPanel) · 추적자 튜닝소(TunePanel). 결과가 나오면 가운데에 성공·실패·파괴 연출 (StationResultFx)
// 누른 것은 controls.queueMenu → 입력 menu → sim/station (기록·협동에서도 같은 결과)
import type { Lang, TextKey } from "../i18n";
import { BenchPanel } from "./BenchPanel";
import { GymPanel } from "./gym/GymPanel";
import type { Controls } from "./controls";
import { StationResultFx } from "./StationResultFx";
import type { StationView } from "./stationView";
import { TunePanel } from "./TunePanel";
import { TrialPanel } from "./trial/TrialPanel";
import { AltarPanel } from "./altar/AltarPanel";
import { ForgePanel } from "./forge/ForgePanel";
import { AuctionPanel, GamblePanel } from "./vault/VaultPanels";

interface Props {
  view: StationView;
  lang: Lang;
  t: (key: TextKey) => string;
  controls: () => Controls | null;
}

export function StationWindow({ view, lang, t, controls }: Props) {
  const send = (code: number) => controls()?.queueMenu(code);
  const bench = view.kind === "bench";
  // 시련의 방: 비석 YES/NO · 보상 상자 고르기 (game/trial)
  if (view.trial || view.chest) return <TrialPanel view={view} lang={lang} t={t} send={send} />;
  // 제단의 방: 성좌의 카드 셋 (game/altar)
  if (view.altar) return <AltarPanel altar={view.altar} t={t} send={send} />;
  // 대장간: 강화·꼬리표 변환·암흑 강화 (game/forge)
  if (view.forge) return <ForgePanel view={view} forge={view.forge} lang={lang} t={t} send={send} />;
  // 비밀의 방: 야바위 · 경매 (game/vault)
  if (view.gamble) return <GamblePanel gamble={view.gamble} t={t} send={send} />;
  if (view.auction) return <AuctionPanel view={view.auction} gold={view.gold} lang={lang} t={t} send={send} />;
  // 단련의 방: 미니게임·강화 (game/gym)
  if (view.gym) {
    return (
      <div className="station-window gym" role="dialog" aria-label={t("gymTitle")}>
        <header className="station-head">
          <b>{t("gymTitle")}</b>
          <small>{t("stationClose")}</small>
        </header>
        <GymPanel gym={view.gym} lang={lang} t={t} send={send} />
      </div>
    );
  }
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
