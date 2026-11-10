// 이벤트 '레이드' 화면 차례: 보스 목록 → 준비하기(같이 하기 · AI와 바로 시작) → 같이 하기는 협동 방(레이드) · AI는 캐릭터 고르기 → 판
import { RAID_EVENT_BOSSES, type CharacterId, type RaidEventBoss } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { CharacterSelect } from "../CharacterSelect";
import { CoopScreen } from "../coop/CoopScreen";
import type { Lang, TextKey } from "../i18n";
import { RaidSolo } from "./RaidSolo";
import { AccWindow } from "./acc/AccWindow";
import { RaidRank } from "./RaidRank";

type Step =
  | { name: "list" }
  | { name: "ready"; boss: RaidEventBoss }
  | { name: "multi"; boss: RaidEventBoss }
  | { name: "select"; boss: RaidEventBoss }
  | { name: "solo"; boss: RaidEventBoss; characterId: CharacterId; key: number };

/** 보스 그림 (public/raid/{보스}/portrait.png) */
export const raidPortrait = (boss: RaidEventBoss) => `${import.meta.env.BASE_URL}raid/${boss}/portrait.png`;

export function RaidFlow({ lang, setLang, t, onExit }: { lang: Lang; setLang: (l: Lang) => void; t: (key: TextKey) => string; onExit: () => void }) {
  const [step, setStep] = useState<Step>({ name: "list" });
  const [gear, setGear] = useState(false);
  const [rank, setRank] = useState(false);
  const list = () => setStep({ name: "list" });
  if (step.name === "multi") return <CoopScreen raid={step.boss} lang={lang} setLang={setLang} t={t} onExit={() => setStep({ name: "ready", boss: step.boss })} />;
  if (step.name === "select") return <CharacterSelect t={t} showSeed={false} noLimited onBack={() => setStep({ name: "ready", boss: step.boss })} onSelect={(characterId) => setStep({ name: "solo", boss: step.boss, characterId, key: 0 })} />;
  if (step.name === "solo") return <RaidSolo key={step.key} boss={step.boss} characterId={step.characterId} lang={lang} t={t} onExit={list} onRetry={() => setStep({ ...step, key: step.key + 1 })} />;
  const gearWin = (
    <>
      {gear && <AccWindow t={t} onClose={() => setGear(false)} />}
      {rank && <RaidRank t={t} {...(step.name === "ready" ? { boss: step.boss } : {})} onClose={() => setRank(false)} />}
    </>
  );
  if (step.name === "ready")
    return (
      <>
        <RaidReady boss={step.boss} t={t} onBack={list} onMulti={() => setStep({ name: "multi", boss: step.boss })} onAi={() => setStep({ name: "select", boss: step.boss })} onGear={() => setGear(true)} onRank={() => setRank(true)} />
        {gearWin}
      </>
    );
  return (
    <>
      <RaidList t={t} onBack={onExit} onPick={(boss) => setStep({ name: "ready", boss })} onGear={() => setGear(true)} onRank={() => setRank(true)} />
      {gearWin}
    </>
  );
}

/** Esc = 뒤로 */
function useEsc(onBack: () => void): void {
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && onBack();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onBack]);
}

/** 보스 목록 (지금은 루시퍼 하나 + 준비 중 자리) */
function RaidList({ t, onBack, onPick, onGear, onRank }: { t: (key: TextKey) => string; onBack: () => void; onPick: (boss: RaidEventBoss) => void; onGear: () => void; onRank: () => void }) {
  useEsc(onBack);
  return (
    <div className="raid-screen">
      <h2>{t("raidListTitle")}</h2>
      <GearButton t={t} onGear={onGear} onRank={onRank} />
      <div className="raid-list">
        {RAID_EVENT_BOSSES.map((b) => (
          <button key={b} type="button" className={`raid-card ${b}`} onClick={() => onPick(b)}>
            <img src={raidPortrait(b)} alt="" />
            <strong>{t(`raid_${b}` as TextKey)}</strong>
          </button>
        ))}
        <div className="raid-card soon" aria-disabled="true">
          <span>?</span>
          <strong>{t("raidSoon")}</strong>
        </div>
      </div>
      <button type="button" className="ghost" onClick={onBack}>
        {t("back")}
      </button>
    </div>
  );
}

/** 준비하기: 보스 그림·설명 + 같이 하기 / AI와 바로 시작 */
function RaidReady({ boss, t, onBack, onMulti, onAi, onGear, onRank }: { boss: RaidEventBoss; t: (key: TextKey) => string; onBack: () => void; onMulti: () => void; onAi: () => void; onGear: () => void; onRank: () => void }) {
  useEsc(onBack);
  return (
    <div className={`raid-screen raid-ready ${boss}`}>
      <img className="raid-hero" src={raidPortrait(boss)} alt="" />
      <h2>{t(`raid_${boss}` as TextKey)}</h2>
      <p className="raid-desc">{t("raidLuciferDesc")}</p>
      <GearButton t={t} onGear={onGear} onRank={onRank} />
      <div className="raid-actions">
        <button type="button" className="primary" onClick={onMulti}>
          <strong>{t("raidWithFriends")}</strong>
          <small>{t("raidWithFriendsDesc")}</small>
        </button>
        <button type="button" onClick={onAi}>
          <strong>{t("raidAiStart")}</strong>
          <small>{t("raidAiStartDesc")}</small>
        </button>
      </div>
      <button type="button" className="ghost" onClick={onBack}>
        {t("back")}
      </button>
    </div>
  );
}

/** 장비창 열기 (장신구, 레이드에서만 효과) · 레이드 랭킹 */
function GearButton({ t, onGear, onRank }: { t: (key: TextKey) => string; onGear: () => void; onRank: () => void }) {
  return (
    <div className="raid-gear-row">
      <button type="button" className="raid-gear-btn" onClick={onGear}>
        <span>💍</span>
        <strong>{t("accGear")}</strong>
        <small>{t("accGearSub")}</small>
      </button>
      <button type="button" className="raid-gear-btn" onClick={onRank}>
        <span>🏆</span>
        <strong>{t("accRank")}</strong>
      </button>
    </div>
  );
}
