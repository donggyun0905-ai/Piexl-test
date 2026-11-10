// 진영 특징 게이지 (로그만, 스킬 칸 자리): 진영 색 막대 + 숫자 · 켜짐(폭주·과부하·각성)이면 빛남 · 아스칼론은 이번 방 맹세(지킴 초록·깨짐 빨강) · 비르디아는 정령 단계 · 마우스를 올리면 설명
import type { FactionGauge as View, OathKind } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

const NAME: Record<View["trait"], TextKey> = { thalassia: "ftThalassia", helios: "ftHelios", terracore: "ftTerracore", ascalon: "ftAscalon", virdia: "ftVirdia", seongguk: "ftSeongguk", silber: "ftSilber" };
const ON: Partial<Record<View["trait"], TextKey>> = { helios: "ftHeliosOn", terracore: "ftTerracoreOn", seongguk: "ftSeonggukOn" };
const TIP: Record<View["trait"], TextKey> = { thalassia: "ftThalassiaTip", helios: "ftHeliosTip", terracore: "ftTerracoreTip", ascalon: "ftAscalonTip", virdia: "ftVirdiaTip", seongguk: "ftSeonggukTip", silber: "ftSilberTip" };
const STAGE: TextKey[] = ["ftVirdiaStage0", "ftVirdiaStage1", "ftVirdiaStage2", "ftVirdiaStage3"];

export function FactionGauge({ view, t }: { view: View; t: (k: TextKey) => string }) {
  const on = view.on && ON[view.trait];
  const label = on ? t(ON[view.trait]!) : view.spirit ? t(`sp_${view.spirit}` as TextKey) : t(NAME[view.trait]);
  return (
    <span className={`faction-gauge ft-${view.trait}${view.on ? " on" : ""}`} title={t(TIP[view.trait])}>
      <b>{label}</b>
      <span className="faction-bar">
        <i style={{ width: `${Math.round(view.v * 100)}%` }} />
      </span>
      <em>{view.trait === "virdia" ? `${t(STAGE[view.stage ?? 0]!)}${view.extra ? ` · ${view.extra}` : ""}` : view.n}</em>
      {view.oath && (
        <span className={`faction-oath ${view.oathState ?? "keep"}`}>
          {view.oathState === "kept" ? t("oathKept") : view.oathState === "broken" ? t("oathBroken") : t(`oath_${view.oath as OathKind}` as TextKey)}
        </span>
      )}
    </span>
  );
}
