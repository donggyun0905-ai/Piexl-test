// 이벤트 '패왕전' 화면 차례: 대결 고르기 → 경기장 고르기(무작위 가능) → 캐릭터 고르기 → 준비방 → 대결 (데스매치는 경기장만 고르고 바로 대결)
import type { CharacterId, PwLoadout, PwMode, RankQueue } from "@pixel-rogue/shared";
import { useState } from "react";
import { CharacterSelect } from "../CharacterSelect";
import { CoopScreen } from "../coop/CoopScreen";
import type { Lang, TextKey } from "../i18n";
import { PwGame } from "./PwGame";
import { type PwMapPick, PwMaps } from "./PwMaps";
import { PwModes } from "./PwModes";
import { PwPrep } from "./PwPrep";

type Step =
  | { name: "modes" }
  | { name: "multi" }
  | { name: "rank"; queue: RankQueue; key: number }
  | { name: "maps"; mode: PwMode }
  | { name: "select"; mode: PwMode; map: PwMapPick }
  | { name: "prep"; mode: PwMode; map: PwMapPick; characterId: CharacterId }
  | { name: "game"; mode: PwMode; map: PwMapPick; characterId: CharacterId; loadout?: PwLoadout; key: number };

export function PwFlow({ lang, setLang, t, onExit }: { lang: Lang; setLang: (l: Lang) => void; t: (key: TextKey) => string; onExit: () => void }) {
  const [step, setStep] = useState<Step>({ name: "modes" });
  const modes = () => setStep({ name: "modes" });
  // 같이 하기: 협동 방(직접 연결·진행 맞추기)을 그대로 씀
  if (step.name === "multi") return <CoopScreen pw lang={lang} setLang={setLang} t={t} onExit={modes} />;
  // 랭크전: 같은 방 구조로 빠른 매칭 (끝나면 다시 찾기 또는 나가기)
  if (step.name === "rank") return <CoopScreen key={step.key} pw rank={step.queue} lang={lang} setLang={setLang} t={t} onExit={modes} onAgain={() => setStep({ ...step, key: step.key + 1 })} />;
  if (step.name === "maps") {
    const { mode } = step;
    return <PwMaps mode={mode} t={t} onBack={modes} onPick={(map) => setStep(mode === "gungame" ? { name: "game", mode, map, characterId: "warden", key: 0 } : { name: "select", mode, map })} />;
  }
  if (step.name === "select") {
    const { mode, map } = step;
    return <CharacterSelect t={t} showSeed={false} onBack={() => setStep({ name: "maps", mode })} onSelect={(characterId) => setStep({ name: "prep", mode, map, characterId })} />;
  }
  if (step.name === "prep") {
    const { mode, map, characterId } = step;
    return <PwPrep characterId={characterId} lang={lang} t={t} onBack={() => setStep({ name: "select", mode, map })} onStart={(loadout) => setStep({ name: "game", mode, map, characterId, loadout, key: 0 })} />;
  }
  if (step.name === "game") {
    return <PwGame key={step.key} mode={step.mode} map={step.map} characterId={step.characterId} loadout={step.loadout} lang={lang} t={t} onExit={modes} onRetry={() => setStep({ ...step, key: step.key + 1 })} />;
  }
  return <PwModes t={t} onBack={onExit} onMulti={() => setStep({ name: "multi" })} onRank={(queue) => setStep({ name: "rank", queue, key: 0 })} onPick={(mode) => setStep({ name: "maps", mode })} />;
}
