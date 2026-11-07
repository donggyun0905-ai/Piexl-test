// 새벽의 성흔 캐릭터의 성흔(달빛의 힘) 게이지: 흰 막대 (스킬 칸 자리) · 가득 차 각성 중이면 달빛으로 빛나며 줄어듦 · 마우스를 올리면 설명
// 블래스트(로그): 옆에 대시 슬라이딩 칸 (남은 대기 덮개·남은 초 · 미끄러지는 중이면 파랗게 빛남)
import type { TextKey } from "../i18n";

type Slide = { cd: number; s: number; on: boolean };

export function StigmaGauge({ v, awake, slide, t }: { v: number; awake: boolean; slide?: Slide; t: (k: TextKey) => string }) {
  return (
    <span className="stigma-wrap">
      {slide && (
        <span className="skill-slot">
          <span className={`skill-btn blast-slide ${slide.on ? "on" : slide.cd > 0 ? "cooling" : "ready"}`} style={{ "--cd": slide.on ? 0 : slide.cd } as React.CSSProperties}>
            <b aria-hidden>{slide.cd > 0 && !slide.on ? slide.s : "⇉"}</b>
            <small>{t("blSlide")}</small>
          </span>
          <span className="skill-tip">
            <b>{t("blSlide")}</b> {t("blSlideTip")}
          </span>
        </span>
      )}
      <span className={`stigma-gauge${awake ? " awake" : ""}`} title={t("sgGaugeTip")}>
        <b>{t("sgGauge")}</b>
        <span className="stigma-bar">
          <i style={{ width: `${Math.round(v * 100)}%` }} />
        </span>
      </span>
    </span>
  );
}
