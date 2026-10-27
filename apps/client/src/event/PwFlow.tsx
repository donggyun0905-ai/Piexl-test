// 이벤트 '패왕전' 화면 차례: 대결 고르기 → 캐릭터 고르기 → 준비방 → 대결 (데스매치는 고르기 없이 바로 대결)
import type { CharacterId, PwLoadout, PwMode } from "@pixel-rogue/shared";
import { useState } from "react";
import { CharacterSelect } from "../CharacterSelect";
import type { Lang, TextKey } from "../i18n";
import { PwGame } from "./PwGame";
import { PwModes } from "./PwModes";
import { PwPrep } from "./PwPrep";

type Step =
  | { name: "modes" }
  | { name: "select"; mode: PwMode }
  | { name: "prep"; mode: PwMode; characterId: CharacterId }
  | { name: "game"; mode: PwMode; characterId: CharacterId; loadout?: PwLoadout; key: number };

export function PwFlow({ lang, t, onExit }: { lang: Lang; t: (key: TextKey) => string; onExit: () => void }) {
  const [step, setStep] = useState<Step>({ name: "modes" });
  const modes = () => setStep({ name: "modes" });
  if (step.name === "select") {
    const { mode } = step;
    return <CharacterSelect t={t} showSeed={false} onBack={modes} onSelect={(characterId) => setStep({ name: "prep", mode, characterId })} />;
  }
  if (step.name === "prep") {
    const { mode, characterId } = step;
    return <PwPrep characterId={characterId} lang={lang} t={t} onBack={() => setStep({ name: "select", mode })} onStart={(loadout) => setStep({ name: "game", mode, characterId, loadout, key: 0 })} />;
  }
  if (step.name === "game") {
    return <PwGame key={step.key} mode={step.mode} characterId={step.characterId} loadout={step.loadout} lang={lang} t={t} onExit={modes} onRetry={() => setStep({ ...step, key: step.key + 1 })} />;
  }
  return <PwModes t={t} onBack={onExit} onPick={(mode) => setStep(mode === "gungame" ? { name: "game", mode, characterId: "warden", key: 0 } : { name: "select", mode })} />;
}
