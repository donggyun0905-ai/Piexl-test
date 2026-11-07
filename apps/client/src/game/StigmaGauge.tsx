// 새벽의 성흔 캐릭터의 성흔(달빛의 힘) 게이지: 흰 막대 (스킬 칸 자리) · 가득 차 각성 중이면 달빛으로 빛나며 줄어듦 · 마우스를 올리면 설명
import type { TextKey } from "../i18n";

export function StigmaGauge({ v, awake, t }: { v: number; awake: boolean; t: (k: TextKey) => string }) {
  return (
    <span className={`stigma-gauge${awake ? " awake" : ""}`} title={t("sgGaugeTip")}>
      <b>{t("sgGauge")}</b>
      <span className="stigma-bar">
        <i style={{ width: `${Math.round(v * 100)}%` }} />
      </span>
    </span>
  );
}
