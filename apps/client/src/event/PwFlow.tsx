// 이벤트 '패왕전' 화면 차례: 대결 고르기 → 경기장 고르기(무작위 가능) → 편 대결은 밴픽, 난투는 캐릭터 고르기 → 준비방 → 대결 (데스매치는 경기장만 고르고 바로 대결)
import { PW_MODE, pwHasDraft, type CharacterId, type PwLoadout, type PwMode, type RankQueue, type RunState } from "@pixel-rogue/shared";
import { useState } from "react";
import { CharacterSelect } from "../CharacterSelect";
import { CoopScreen } from "../coop/CoopScreen";
import type { Lang, TextKey } from "../i18n";
import { PwDraftSolo } from "./PwDraftSolo";
import { PwGame } from "./PwGame";
import { type PwMapPick, PwMaps } from "./PwMaps";
import { PwModes } from "./PwModes";
import { PwBrowse } from "./PwBrowse";
import { PwPracticeGame } from "./PwPractice";
import { PwPrep } from "./PwPrep";
import { PwLeague } from "./PwLeague";
import { clearGiga, loadGiga } from "./pwGigaStore";

type Step =
  | { name: "modes" }
  | { name: "multi" }
  /** 월드 워 리그 (8팀 대회) */
  | { name: "league" }
  /** 기간토마키아: 저장된 판 이어하기 · 이어하는 판 */
  | { name: "gigaResume"; saved: RunState }
  | { name: "gigaGame"; saved: RunState }
  | { name: "rank"; queue: RankQueue; key: number }
  | { name: "maps"; mode: PwMode }
  /** 연습장: 캐릭터 고르기 → 허수아비와 연습 */
  | { name: "practice"; characterId?: CharacterId; key: number }
  /** 모든 캐릭터 둘러보기 (카드를 누르면 스킬 설명) */
  | { name: "browse" }
  | { name: "select"; mode: PwMode; map: PwMapPick }
  | { name: "draft"; mode: PwMode; map: PwMapPick; key: number }
  /** picks: 밴픽으로 정한 자리마다 캐릭터 (0번 = 나) */
  | { name: "prep"; mode: PwMode; map: PwMapPick; characterId: CharacterId; picks?: CharacterId[]; bans?: CharacterId[] }
  | { name: "game"; mode: PwMode; map: PwMapPick; characterId: CharacterId; picks?: CharacterId[]; bans?: CharacterId[]; loadout?: PwLoadout; key: number };

export function PwFlow({ lang, setLang, t, onExit }: { lang: Lang; setLang: (l: Lang) => void; t: (key: TextKey) => string; onExit: () => void }) {
  const [step, setStep] = useState<Step>({ name: "modes" });
  const modes = () => setStep({ name: "modes" });
  /** 뒤로: 경기장 고르기 (경기장이 하나뿐이면 대결 고르기로) */
  const toMaps = (mode: PwMode) => setStep(PW_MODE[mode].maps.length === 1 ? { name: "modes" } : { name: "maps", mode });
  // 같이 하기: 협동 방(직접 연결·진행 맞추기)을 그대로 씀
  if (step.name === "multi") return <CoopScreen pw lang={lang} setLang={setLang} t={t} onExit={modes} />;
  // 랭크전: 같은 방 구조로 빠른 매칭 (끝나면 다시 찾기 또는 나가기)
  if (step.name === "rank") return <CoopScreen key={step.key} pw rank={step.queue} lang={lang} setLang={setLang} t={t} onExit={modes} onAgain={() => setStep({ ...step, key: step.key + 1 })} />;
  if (step.name === "league") return <PwLeague lang={lang} t={t} onExit={modes} />;
  if (step.name === "gigaGame") {
    const c = step.saved.player.characterId;
    return <PwGame mode="giganto" map={null} characterId={c} resume={step.saved} lang={lang} t={t} onExit={modes} />;
  }
  if (step.name === "gigaResume") {
    const { saved } = step;
    return (
      <div className="td-maps">
        <h2>{t("pwGiga")}</h2>
        <p className="hint">{t("pwGigaSaved")}</p>
        <button type="button" className="primary" onClick={() => setStep({ name: "gigaGame", saved })}>
          {t("pwGigaResume")}
        </button>
        <button type="button" onClick={() => (clearGiga(), setStep({ name: "select", mode: "giganto", map: null }))}>
          {t("pwGigaNew")}
        </button>
        <button type="button" className="ghost" onClick={modes}>
          {t("back")}
        </button>
      </div>
    );
  }
  if (step.name === "browse") return <PwBrowse lang={lang} t={t} onBack={modes} onTry={(characterId) => setStep({ name: "practice", characterId, key: 1 })} />;
  if (step.name === "practice") {
    if (!step.characterId) return <CharacterSelect t={t} showSeed={false} onBack={modes} onSelect={(characterId) => setStep({ name: "practice", characterId, key: step.key + 1 })} />;
    return <PwPracticeGame key={step.key} characterId={step.characterId} lang={lang} t={t} onChange={() => setStep({ name: "practice", key: step.key })} onExit={modes} />;
  }
  /** 경기장을 정한 다음: 데스매치는 바로 대결, 편 대결·기간토마키아는 밴픽, 난투는 캐릭터 고르기 */
  const afterMap = (mode: PwMode, map: PwMapPick): Step => (mode === "gungame" ? { name: "game", mode, map, characterId: "warden", key: 0 } : pwHasDraft(mode) ? { name: "draft", mode, map, key: 0 } : { name: "select", mode, map });
  if (step.name === "maps") {
    const { mode } = step;
    return <PwMaps mode={mode} t={t} onBack={modes} onPick={(map) => setStep(afterMap(mode, map))} />;
  }
  if (step.name === "select") {
    const { mode, map } = step;
    return <CharacterSelect t={t} showSeed={false} onBack={() => toMaps(mode)} onSelect={(characterId) => setStep({ name: "prep", mode, map, characterId })} />;
  }
  if (step.name === "draft") {
    const { mode, map } = step;
    // 기간토마키아: 1대1처럼 밴 하나씩 · 내 캐릭터 고르기 (나머지 AI 29명은 밴을 빼고 무작위)
    const giga = mode === "giganto";
    return <PwDraftSolo key={step.key} mode={giga ? "duel" : mode} t={t} onBack={() => toMaps(mode)} onDone={(picks, bans) => setStep({ name: "prep", mode, map, characterId: picks[0]!, picks: giga ? [picks[0]!] : picks, bans })} />;
  }
  if (step.name === "prep") {
    const { mode, map, characterId, picks, bans } = step;
    const back = () => setStep(picks ? { name: "draft", mode, map, key: Date.now() } : { name: "select", mode, map });
    return <PwPrep characterId={characterId} lang={lang} t={t} onBack={back} onStart={(loadout) => setStep({ name: "game", mode, map, characterId, picks, bans, loadout, key: 0 })} />;
  }
  if (step.name === "game") {
    return <PwGame key={step.key} mode={step.mode} map={step.map} characterId={step.characterId} picks={step.picks} bans={step.bans} loadout={step.loadout} lang={lang} t={t} onExit={modes} onRetry={() => setStep({ ...step, key: step.key + 1 })} />;
  }
  return <PwModes t={t} onBack={onExit} onMulti={() => setStep({ name: "multi" })} onLeague={() => setStep({ name: "league" })} onPractice={() => setStep({ name: "practice", key: 0 })} onBrowse={() => setStep({ name: "browse" })} onRank={(queue) => setStep({ name: "rank", queue, key: 0 })} onPick={(mode) => {
        const saved = mode === "giganto" ? loadGiga() : null;
        // 경기장이 하나뿐인 대결(쟁탈전·전쟁의 서막·기간토마키아)은 경기장 고르기 없이
        setStep(saved ? { name: "gigaResume", saved } : PW_MODE[mode].maps.length === 1 ? afterMap(mode, PW_MODE[mode].maps[0]!) : { name: "maps", mode });
      }} />;
}
