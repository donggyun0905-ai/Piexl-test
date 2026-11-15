// 메인의 '플레이'를 누르면 뜨는 선택 창: 이어하기 · 새 모험 · 영웅의 길 · 무한 모드 · 레이드 아레나 · 타워 디펜스 · 일일 도전 · 함께 하기 · 협동 · 이벤트 · 로비 · 튜토리얼 · 연습장
// (일일·함께·협동·이벤트·로비는 지도 장소가 생길 때까지 여기에 임시로, docs/QUEST.md Q1)
import { useEffect, useRef } from "react";
import type { TextKey } from "../i18n";
import { isTutorialDone, loadFloorBest, type SavedRun } from "../records";
import { Icon, type IconName } from "./Icon";
import { featureOpen } from "../progress/storyStage";
import { questMode } from "../progress/quest";
import { TEST_OPEN } from "../testFlags";

interface Props {
  t: (key: TextKey) => string;
  saved: SavedRun | null;
  onContinue: () => void;
  onNewRun: () => void;
  onHero: () => void;
  onEndless: () => void;
  onArena: () => void;
  onTowerDefense: () => void;
  onPractice: () => void;
  onTutorial: () => void;
  /** 세계 지도 (시험 서버·내 컴퓨터에서만, docs/WORLD_MAP.md W2~) */
  onWorld: () => void;
  onDaily: () => void;
  onBattle: () => void;
  onCoop: () => void;
  onEvents: () => void;
  onLobby: () => void;
  onClose: () => void;
}

export function Choice({ icon, title, desc, onClick }: { icon: IconName; title: string; desc: string; onClick: () => void }) {
  return (
    <button type="button" className={`choice-row ${icon}`} onClick={onClick}>
      <span className="choice-icon">
        <Icon name={icon} />
      </span>
      <span className="choice-text">
        <strong>{title}</strong>
        <small>{desc}</small>
      </span>
      <Icon name="chevron" />
    </button>
  );
}

export function SoloChooser({ t, saved, onContinue, onNewRun, onHero, onEndless, onArena, onTowerDefense, onPractice, onTutorial, onWorld, onDaily, onBattle, onCoop, onEvents, onLobby, onClose }: Props) {
  const endlessBest = loadFloorBest("endlessBest");
  // 지도가 있는 곳(퀘스트)은 일일·함께·협동·이벤트가 게시판·모험가 집합소, 로비는 아지트 오락실 문
  const inMenu = !questMode();
  const heroBest = loadFloorBest("heroBest");
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);

  return (
    <div className="modal-backdrop" onClick={onClose} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="modal chooser" role="dialog" aria-modal="true" aria-label={t("mainPlay")} onClick={(e) => e.stopPropagation()}>
        <h2>{t("soloTitle")}</h2>
        <div className="choices">
          {saved && (
            <Choice
              icon="resume"
              title={t("continueRun")}
              desc={`${saved.run.arenaLv ? `${t("arenaRun")} Lv ${saved.run.arenaLv}` : saved.run.hero ? `${t("heroRun")} ${t("heroStage").replace("{n}", String(saved.run.floor))}` : `${t("floor")} ${saved.run.floor}`} · ${saved.seedText}`}
              onClick={onContinue}
            />
          )}
          {featureOpen("solo") && <Choice icon="sword" title={t("soloRun")} desc={t("newRunDesc")} onClick={onNewRun} />}
          {TEST_OPEN && <Choice icon="book" title={t("worldMap")} desc={t("worldMapDesc")} onClick={onWorld} />}
          {featureOpen("hero") && <Choice
            icon="crown"
            title={t("heroRun")}
            desc={heroBest > 0 ? `${t("heroDesc")} · ${t("heroBest").replace("{n}", String(heroBest))}` : t("heroDesc")}
            onClick={onHero}
          />}
          {featureOpen("endless") && <Choice
            icon="infinity"
            title={t("endlessRun")}
            desc={endlessBest > 0 ? `${t("endlessDesc")} · ${t("endlessBest").replace("{floor}", String(endlessBest))}` : t("endlessDesc")}
            onClick={onEndless}
          />}
          {featureOpen("arena") && <Choice icon="trophy" title={t("arenaRun")} desc={t("arenaDesc")} onClick={onArena} />}
          {featureOpen("td") && <Choice icon="castle" title={t("tdRun")} desc={t("tdDesc")} onClick={onTowerDefense} />}
          {inMenu && featureOpen("daily") && <Choice icon="crown" title={t("daily")} desc={t("playDailyDesc")} onClick={onDaily} />}
          {inMenu && featureOpen("battle") && <Choice icon="users" title={t("playTogether")} desc={t("playTogetherDesc")} onClick={onBattle} />}
          {inMenu && featureOpen("coop") && <Choice icon="users" title={t("coop")} desc={t("playCoopDesc")} onClick={onCoop} />}
          {inMenu && featureOpen("events") && <Choice icon="star" title={t("events")} desc={t("eventsDesc")} onClick={onEvents} />}
          {inMenu && featureOpen("lobby") && <Choice icon="users" title={t("lobby")} desc={t("playLobbyDesc")} onClick={onLobby} />}
          <Choice
            icon="book"
            title={t("tutorial")}
            desc={isTutorialDone() ? t("tutorialDesc") : `${t("tutorialRecommend")} · ${t("tutorialDesc")}`}
            onClick={onTutorial}
          />
          <Choice icon="target" title={t("practice")} desc={t("practiceDesc")} onClick={onPractice} />
        </div>
        <button ref={closeRef} type="button" className="ghost" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
