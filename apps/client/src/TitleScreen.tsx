import { uiSfxSoon } from "./audio/uiSounds";
import { GAME_VERSION } from "@pixel-rogue/shared";
import { CodexPanel } from "./codex/CodexPanel";
import { LobbyStage } from "./lobby/LobbyStage";
import { Suspense, useEffect, useState } from "react";
import { setMenuMusic } from "./audio/calmMusic";
import { AchievementList } from "./AchievementList";
import { RecordsPanel } from "./RecordsPanel";
import type { Lang, TextKey } from "./i18n";
import { Icon } from "./menu/Icon";
import { InstallButton } from "./menu/InstallButton";
import { Modal } from "./menu/Modal";
import { NicknameBar } from "./menu/NicknameBar";
import { SoloChooser } from "./menu/SoloChooser";
import { EventChooser } from "./menu/EventChooser";
import { ArchiveChooser } from "./menu/ArchiveChooser";
import { TopBar } from "./menu/TopBar";
import { LobbyMode, PatchNotesList, WorldMode } from "./lazyScreens";
import { loadBest, loadSavedRun } from "./records";
import { useServerStatus } from "./serverStatus";
import { storyStage } from "./progress/storyStage";
import { StageNotice } from "./progress/StageNotice";
import { markWorldReturn, takeWorldReturn } from "./world/worldReturn";
import { Prologue } from "./prologue/Prologue";
import { prologueSeen } from "./progress/prologue";
import { TEST_OPEN } from "./testFlags";

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TextKey) => string;
  onStartSolo: (endless?: boolean, arena?: boolean, hero?: boolean) => void;
  onContinue: () => void;
  onDaily: () => void;
  onBattle: () => void;
  onCoop: () => void;
  onPractice: () => void;
  onTutorial: () => void;
  onTowerDefense: () => void;
  onProfile: () => void;
  onShop: () => void;
  /** 이벤트 '광야의 새벽' */
  onSwarm: () => void;
  onPaewang: () => void;
  onRaid: () => void;
  /** 스토리 (진영·최종 보스·아카식 레코드) */
  onStory: () => void;
  /** 티어표 (아카이브 메뉴) */
  onTierList: () => void;
  onBuilds: () => void;
}

type Popup = "none" | "solo" | "events" | "archive" | "notes" | "achievements" | "records" | "codex";

/** 메인 화면: 로고 · 닉네임 · 버튼 3개(플레이 · 아카이브 · 상점) · 위쪽 설정 · 기록·업적·도감·패치 노트·기기 연동은 아카이브 창 */
export function TitleScreen({ lang, setLang, t, onStartSolo, onContinue, onDaily, onBattle, onCoop, onPractice, onTutorial, onTowerDefense, onProfile, onShop, onSwarm, onPaewang, onRaid, onStory, onTierList, onBuilds }: Props) {
  const [popup, setPopup] = useState<Popup>("none");
  const [saved] = useState(loadSavedRun);
  const [best] = useState(loadBest);
  const status = useServerStatus();
  const [lobby, setLobby] = useState(false);
  // 지도에서 던전으로 갔다 오면 다시 지도 (worldReturn)
  const [world, setWorld] = useState(takeWorldReturn);
  // 처음 '플레이' → 프롤로그(서기관·이름) → 지도 (지도가 아직 시험 중인 라이브는 플레이 창)
  const [prologue, setPrologue] = useState(false);
  // 프롤로그를 막 끝냄 → 지도는 아지트에서 시작
  const [fresh, setFresh] = useState(false);
  const close = () => setPopup("none");
  // 메인 화면 곡 (나가면 끔)
  useEffect(() => (setMenuMusic(true), () => setMenuMusic(false)), []);
  // 메인 로고 소리 (첫 터치 전이면 첫 입력 때)
  useEffect(() => uiSfxSoon("uiLogo"), []);

  const startNew = (endless = false, arena = false, hero = false) => {
    // 이어할 판이 있으면 지워진다고 확인
    if (saved && !window.confirm(t("newRunConfirm"))) return;
    onStartSolo(endless, arena, hero);
  };

  const stage = storyStage();
  if (prologue) return <Prologue t={t} onDone={() => (setPrologue(false), setFresh(true), TEST_OPEN ? setWorld(true) : setPopup("solo"))} />;
  // 로비: 메인 글자·목록을 감추고 파수꾼으로 돌아다님
  if (lobby) return <LobbyMode t={t} onExit={() => setLobby(false)} />;
  // 세계 지도 (시험 중): 던전 입구 → 혼자 하기
  if (world)
    return (
      <Suspense fallback={null}>
        <WorldMode t={t} lang={lang} fresh={fresh} onLobby={() => (setWorld(false), setLobby(true))} onExit={() => setWorld(false)} onDungeon={(m) => (markWorldReturn(), setWorld(false), m === "paewang" ? onPaewang() : m === "swarm" ? onSwarm() : m === "td" ? onTowerDefense() : startNew(m === "endless", m === "arena", m === "hero"))} />
      </Suspense>
    );

  return (
    <>
      <LobbyStage play={false} />
      <TopBar lang={lang} setLang={setLang} t={t} />
      <InstallButton t={t} />
      <main className="title-screen">
        <div className="menu-card">
          <h1 className="title-logo">Pixel Toybox</h1>
          <p className="title-subtitle">{t("menuSubtitle")}</p>
          {best && (
            <p className="title-best">
              {t("bestScore")} {best.score.toLocaleString()} · {t("floor")} {best.floor}
            </p>
          )}
          {/* 메인 버튼은 플레이 · 아카이브 · 상점 셋만 (docs/QUEST.md Q1) */}
          <div className="menu-buttons">
            <NicknameBar t={t} />
            <button type="button" className="primary big" onClick={() => (prologueSeen() ? setPopup("solo") : setPrologue(true))}>
              <Icon name="sword" />
              {t("mainPlay")}
              {saved && <span className="menu-badge">{t("continueRun")}</span>}
            </button>
            <div className="menu-pair">
              <button type="button" className="secondary big" onClick={() => setPopup("archive")}>
                <Icon name="book" />
                {t("archive")}
              </button>
              <button type="button" className="secondary big" onClick={onShop}>
                <Icon name="bag" />
                {t("shop")}
              </button>
            </div>
          </div>
          <StageNotice t={t} lang={lang} stage={stage} />
        </div>

        <footer className="title-footer">
          <span className={`status ${status}`}>
            {t("server")}: {t(status)}
          </span>
          <small className="title-version">v{GAME_VERSION}</small>
        </footer>
      </main>

      {popup === "solo" && (
        <SoloChooser
          t={t}
          saved={saved}
          onContinue={onContinue}
          onWorld={() => {
            close();
            setWorld(true);
          }}
          onNewRun={() => {
            close();
            startNew();
          }}
          onHero={() => {
            close();
            startNew(false, false, true);
          }}
          onEndless={() => {
            close();
            startNew(true);
          }}
          onArena={() => {
            close();
            startNew(false, true);
          }}
          onTowerDefense={onTowerDefense}
          onDaily={onDaily}
          onBattle={onBattle}
          onCoop={onCoop}
          onEvents={() => setPopup("events")}
          onLobby={() => (close(), setLobby(true))}
          onPractice={onPractice}
          onTutorial={onTutorial}
          onClose={close}
        />
      )}
      {popup === "events" && <EventChooser t={t} onSwarm={onSwarm} onPaewang={onPaewang} onRaid={onRaid} onClose={close} />}
      {popup === "archive" && <ArchiveChooser t={t} onStory={onStory} onTierList={onTierList} onBuilds={onBuilds} onPanel={setPopup} onProfile={onProfile} onClose={close} />}
      {popup === "notes" && (
        <Modal title={t("patchNotes")} t={t} onClose={close}>
          <Suspense fallback={null}>
            <PatchNotesList lang={lang} />
          </Suspense>
        </Modal>
      )}
      {popup === "records" && (
        <Modal title={t("records")} t={t} onClose={close}>
          <RecordsPanel t={t} />
        </Modal>
      )}
      {popup === "codex" && (
        <Modal title={t("codex")} t={t} onClose={close} className="codex-modal">
          <CodexPanel lang={lang} t={t} />
        </Modal>
      )}
      {popup === "achievements" && (
        <Modal title={t("achievements")} t={t} onClose={close} className="achievements-modal">
          <AchievementList lang={lang} t={t} />
        </Modal>
      )}
    </>
  );
}
