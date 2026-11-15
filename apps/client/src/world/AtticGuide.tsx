// 아지트 서기관 안내 (docs/QUEST.md 3절): 처음 들어오면 인사 → 거울 · 장비 상자 · 기록서 · 오락실 문 · 나가는 문 차례로 화살표(WorldStage mark)
// 그 물건에 다가가면 서기관이 설명 (대사 상자, 누르기·Enter·Esc·알겠어로 닫힘) · 어디까지 봤는지 저장 (다 보면 안내 끝)
import { useEffect, useState } from "react";
import type { TextKey } from "../i18n";
import { loadText, saveText } from "../storage";
import { hasFlag, setFlag } from "../progress/quest";
import { StoryFace } from "../story/StoryFace";
import type { Place } from "./worldPlaces";

const KEY = "atticGuide";
/** 차례마다 가야 할 물건 (0 = 들어오자마자 인사) */
const STEPS: readonly (string | null)[] = [null, "atticMirror", "atticChest", "atticDesk", "atticArcade", "atticDoor"];

export interface AtticGuideState {
  /** 화살표를 띄울 장소 id */
  mark: string | null;
  /** 서기관이 말하는 중인 차례 (null이면 아님) */
  talk: number | null;
  step: number;
  close: () => void;
}

export function useAtticGuide(active: boolean, near: Place | null): AtticGuideState {
  const [step, setStep] = useState(() => (hasFlag("attic") ? STEPS.length : Number(loadText(KEY) ?? 0) || 0));
  const live = active && step < STEPS.length;
  // 들어오자마자(0) 또는 가야 할 물건 앞에 오면 말함
  const talk = live && (step === 0 || near?.id === STEPS[step]) ? step : null;
  const close = () => {
    const n = step + 1;
    setStep(n);
    saveText(KEY, String(n));
    if (n >= STEPS.length) setFlag("attic");
  };
  return { mark: live && step > 0 ? STEPS[step]! : null, talk, step, close };
}

export function AtticGuide({ t, g }: { t: (k: TextKey) => string; g: AtticGuideState }) {
  useEffect(() => {
    if (g.talk === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        g.close();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  if (g.talk !== null)
    return (
      <div className="attic-talk" onClick={g.close}>
        <div className="scene-box">
          <StoryFace who="scribe" size={72} art />
          <div>
            <b>{t("scribe")}</b>
            <p>{t(`agTalk${g.talk}` as TextKey)}</p>
            <button type="button" className="primary small">
              {t("agOk")}
            </button>
          </div>
        </div>
      </div>
    );
  if (!g.mark) return null;
  return <p className="attic-hint">✒ {t(`agHint${g.step}` as TextKey)}</p>;
}
