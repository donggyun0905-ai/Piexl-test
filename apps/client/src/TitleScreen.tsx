import { GAME_VERSION } from "@pixel-rogue/shared";
import { CodexPanel } from "./codex/CodexPanel";
import { LobbyMode } from "./lobby/LobbyMode";
import { LobbyStage } from "./lobby/LobbyStage";
import { useState } from "react";
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
import { PATCH_NOTES } from "./patchNotes";
import { loadBest, loadSavedRun } from "./records";
import { useServerStatus } from "./serverStatus";

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
  /** 스토리 (진영·최종 보스·아카식 레코드) */
  onStory: () => void;
  /** 티어표 (아카이브 메뉴) */
  onTierList: () => void;
}

type Popup = "none" | "solo" | "events" | "archive" | "notes" | "achievements" | "records" | "codex";

/** 메인 화면: 로고 · 닉네임 · 큰 버튼 3개(혼자 하기 · 일일 도전 · 함께 하기) · 아래 링크 · 위쪽 설정 */
export function TitleScreen({ lang, setLang, t, onStartSolo, onContinue, onDaily, onBattle, onCoop, onPractice, onTutorial, onTowerDefense, onProfile, onShop, onSwarm, onPaewang, onStory, onTierList }: Props) {
  const [popup, setPopup] = useState<Popup>("none");
  const [saved] = useState(loadSavedRun);
  const [best] = useState(loadBest);
  const status = useServerStatus();
  const [lobby, setLobby] = useState(false);
  const close = () => setPopup("none");

  const startNew = (endless = false, arena = false, hero = false) => {
    // 이어할 판이 있으면 지워진다고 확인
    if (saved && !window.confirm(t("newRunConfirm"))) return;
    onStartSolo(endless, arena, hero);
  };

  // 로비: 메인 글자·목록을 감추고 파수꾼으로 돌아다님
  if (lobby) return <LobbyMode t={t} onExit={() => setLobby(false)} />;

  return (
    <>
      <LobbyStage play={false} />
      <button type="button" className="secondary lobby-button" onClick={() => setLobby(true)}>
        <Icon name="users" /> {t("lobby")}
      </button>
      <TopBar lang={lang} setLang={setLang} t={t} />
      <InstallButton t={t} />
      <main className="title-screen">
        <div className="menu-card">
          <h1 className="title-logo">pixel-rogue</h1>
          <p className="title-subtitle">{t("menuSubtitle")}</p>
          {best && (
            <p className="title-best">
              {t("bestScore")} {best.score.toLocaleString()} · {t("floor")} {best.floor}
            </p>
          )}
          <div className="menu-buttons">
            <NicknameBar t={t} />
            <button type="button" className="primary big" onClick={() => setPopup("solo")}>
              <Icon name="user" />
              {t("playSolo")}
              {saved && <span className="menu-badge">{t("continueRun")}</span>}
            </button>
            <button type="button" className="secondary big" onClick={onDaily}>
              <Icon name="crown" />
              {t("daily")}
            </button>
            <button type="button" className="secondary big" onClick={onBattle}>
              <Icon name="users" />
              {t("playTogether")}
            </button>
            <button type="button" className="secondary big" onClick={onCoop}>
              <Icon name="users" />
              {t("coop")}
            </button>
            <button type="button" className="secondary big" onClick={() => setPopup("events")}>
              <Icon name="star" />
              {t("events")}
            </button>
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

        <nav className="menu-links">
          <button type="button" className="link-button" onClick={() => setPopup("records")}>
            <Icon name="trophy" /> {t("records")}
          </button>
          <button type="button" className="link-button" onClick={() => setPopup("achievements")}>
            <Icon name="star" /> {t("achievements")}
          </button>
          <button type="button" className="link-button" onClick={() => setPopup("codex")}>
            <Icon name="book" /> {t("codex")}
          </button>
          <button type="button" className="link-button" onClick={() => setPopup("notes")}>
            <Icon name="note" /> {t("patchNotes")} <small>{GAME_VERSION}</small>
          </button>
          <button type="button" className="link-button" onClick={onProfile}>
            <Icon name="link" /> {t("linkTitle")}
          </button>
        </nav>

        <footer className="title-footer">
          <span className={`status ${status}`}>
            {t("server")}: {t(status)}
          </span>
        </footer>
      </main>

      {popup === "solo" && (
        <SoloChooser
          t={t}
          saved={saved}
          onContinue={onContinue}
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
          onPractice={onPractice}
          onTutorial={onTutorial}
          onClose={close}
        />
      )}
      {popup === "events" && <EventChooser t={t} onSwarm={onSwarm} onPaewang={onPaewang} onClose={close} />}
      {popup === "archive" && <ArchiveChooser t={t} onStory={onStory} onTierList={onTierList} onClose={close} />}
      {popup === "notes" && (
        <Modal title={t("patchNotes")} t={t} onClose={close}>
          {PATCH_NOTES.map((note) => (
            <section key={note.version}>
              <h3>
                {note.version} <small>{note.date}</small>
              </h3>
              <ul>
                {note.items[lang].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
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
