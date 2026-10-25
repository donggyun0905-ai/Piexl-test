import { CHARACTER_IDS, TD_MAPS, type CharacterId, type RunState, type SwarmMapId, type TdMapId } from "@pixel-rogue/shared";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProfileScreen } from "./ProfileScreen";
import { BattleScreen } from "./battle/BattleScreen";
import { takeRoomFromUrl } from "./battle/invite";
import { CoopScreen } from "./coop/CoopScreen";
import { CharacterSelect } from "./CharacterSelect";
import { DailyGame } from "./daily/DailyGame";
import { HallOfFame } from "./daily/HallOfFame";
import { ArenaBoard } from "./daily/ArenaBoard";
import { DailyScreen, type DailyMode, type DailyStart } from "./daily/DailyScreen";
import { GameScreen } from "./game/GameScreen";
import { SoloGame } from "./game/SoloGame";
import { ADMIN_PRACTICE, ADMIN_TD } from "./balance";
import { useLang } from "./i18n";
import { loadAchievements, loadSavedRun, newSeedText, seedFromUrl } from "./records";
import { TitleScreen } from "./TitleScreen";
import { TdGame } from "./td/TdGame";
import { TdScreen } from "./td/TdScreen";
import { ShopScreen } from "./shop/ShopScreen";
import { SwarmGame } from "./event/SwarmGame";
import { SwarmMaps } from "./event/SwarmMaps";
import { StoryScreen } from "./story/StoryScreen";

type Screen =
  | { name: "title" }
  | { name: "select"; endless?: boolean; arena?: boolean; hero?: boolean }
  | { name: "profile"; back: "title" | "daily" }
  | { name: "daily"; mode?: DailyMode }
  | { name: "hall" }
  | { name: "arenaBoard" }
  | { name: "tdMaps" }
  | { name: "shop" }
  | { name: "story" }
  | { name: "swarmSelect" }
  | { name: "swarmMap"; characterId: CharacterId }
  | { name: "swarm"; characterId: CharacterId; map: SwarmMapId; level: number; runKey: number }
  | { name: "td"; mapId: TdMapId; runKey: number }
  | { name: "battle" }
  | { name: "coop" }
  | { name: "practiceSelect" }
  | { name: "tutorialSelect" }
  | { name: "tutorial"; characterId: CharacterId }
  | { name: "practice"; characterId: CharacterId; runKey: number }
  | { name: "dailySelect"; start: DailyStart }
  | { name: "dailyGame"; start: DailyStart; characterId: CharacterId }
  | { name: "game"; characterId: CharacterId; seedText: string; initialRun?: RunState; runKey: number; endless?: boolean; arena?: boolean; hero?: boolean };

// 초대 링크(?room=)로 들어오면 메뉴를 건너뛰고 그 방으로
const inviteCode = takeRoomFromUrl();
const coopCode = takeRoomFromUrl("coop");

const isCharacterId = (id: string): id is CharacterId => CHARACTER_IDS.includes(id as CharacterId);

/** 브라우저 뒤로가기로 돌아갈 화면 (null = 게임 중이라 무시, 게임 안 메뉴로 나감) */
function parentOf(screen: Screen): Screen | null {
  switch (screen.name) {
    case "game":
    case "swarm":
    case "td":
    case "practice":
    case "tutorial":
    case "dailyGame":
      return null;
    case "dailySelect":
      return { name: "daily", mode: screen.start.mode };
    case "swarmMap":
      return { name: "swarmSelect" };
    case "hall":
    case "arenaBoard":
      return { name: "daily" };
    case "profile":
      return screen.back === "daily" ? { name: "daily" } : { name: "title" };
    default:
      return { name: "title" };
  }
}

export function App() {
  const lang = useLang();
  // 주소에 ?seed=가 있으면 바로 캐릭터 선택 (공유받은 시드)
  const [screen, setScreenState] = useState<Screen>(() =>
    // 관리자 페이지 오른쪽 연습장은 바로 연습장으로
    ADMIN_PRACTICE && isCharacterId(ADMIN_PRACTICE)
      ? { name: "practice", characterId: ADMIN_PRACTICE, runKey: 0 }
      : ADMIN_TD && TD_MAPS.some((m) => m.id === ADMIN_TD)
      ? { name: "td", mapId: ADMIN_TD as TdMapId, runKey: 0 }
      : inviteCode ? { name: "battle" } : coopCode ? { name: "coop" } : seedFromUrl() ? { name: "select" } : { name: "title" },
  );
  // 메인에서 다른 화면으로 갈 때 기록을 하나 쌓아, 폰 뒤로가기가 사이트를 나가지 않고 메인으로 오게 한다
  const setScreen = useCallback((next: Screen) => {
    if (next.name !== "title" && !(history.state as { pr?: number } | null)?.pr) history.pushState({ pr: 1 }, "");
    setScreenState(next);
  }, []);
  const toTitle = useCallback(() => setScreenState({ name: "title" }), []);

  const screenRef = useRef(screen);
  screenRef.current = screen;
  useEffect(() => {
    if (screen.name !== "title") setScreen(screen);
    // 처음 한 번만 (초대 링크·시드 링크로 바로 들어온 경우)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const onPop = () => {
      const cur = screenRef.current;
      // 함께 하기는 화면 안에서 직접 처리 (방 나가기 등)
      if (cur.name === "title" || cur.name === "battle" || cur.name === "coop") return;
      const parent = parentOf(cur);
      if (parent === null || parent.name !== "title") history.pushState({ pr: 1 }, "");
      if (parent) setScreenState(parent);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (screen.name === "game") {
    return (
      <SoloGame
        key={screen.runKey}
        characterId={screen.characterId}
        seedText={screen.seedText}
        initialRun={screen.initialRun}
        endless={screen.endless}
        arena={screen.arena}
        hero={screen.hero}
        unlocks={loadAchievements()}
        lang={lang.lang}
        t={lang.t}
        onExit={toTitle}
        onRetry={(same) =>
          setScreen({
            name: "game",
            characterId: screen.characterId,
            seedText: same ? screen.seedText : newSeedText(),
            runKey: screen.runKey + 1,
            endless: screen.endless || screen.initialRun?.endless,
            arena: screen.arena || screen.initialRun?.arenaLv !== undefined,
            hero: screen.hero || screen.initialRun?.hero,
          })
        }
      />
    );
  }
  if (screen.name === "td") {
    return (
      <TdGame
        key={screen.runKey}
        mapId={screen.mapId}
        lang={lang.lang}
        t={lang.t}
        onRetry={() => setScreen({ name: "td", mapId: screen.mapId, runKey: screen.runKey + 1 })}
        onExit={() => setScreen({ name: "tdMaps" })}
      />
    );
  }
  if (screen.name === "swarmSelect") {
    return <CharacterSelect t={lang.t} showSeed={false} onBack={toTitle} onSelect={(characterId) => setScreen({ name: "swarmMap", characterId })} />;
  }
  if (screen.name === "swarmMap") {
    const { characterId } = screen;
    return <SwarmMaps t={lang.t} onPick={(map, level) => setScreen({ name: "swarm", characterId, map, level, runKey: 0 })} onBack={() => setScreen({ name: "swarmSelect" })} />;
  }
  if (screen.name === "swarm") {
    const retry = () => setScreen({ ...screen, runKey: screen.runKey + 1 });
    const exit = () => setScreen({ name: "swarmMap", characterId: screen.characterId });
    return <SwarmGame key={screen.runKey} characterId={screen.characterId} map={screen.map} level={screen.level} lang={lang.lang} t={lang.t} onExit={exit} onRetry={retry} />;
  }
  if (screen.name === "shop") return <ShopScreen t={lang.t} onBack={toTitle} />;
  if (screen.name === "story") return <StoryScreen lang={lang.lang} t={lang.t} onBack={toTitle} />;
  if (screen.name === "tdMaps") return <TdScreen t={lang.t} onPick={(mapId) => setScreen({ name: "td", mapId, runKey: 0 })} onBack={toTitle} />;
  if (screen.name === "practice") {
    return (
      <GameScreen
        key={screen.runKey}
        mode="practice"
        characterId={screen.characterId}
        seedText=""
        unlocks={[]}
        lang={lang.lang}
        t={lang.t}
        onExit={toTitle}
        onPracticeCharacter={(characterId) => setScreen({ name: "practice", characterId, runKey: screen.runKey + 1 })}
      />
    );
  }
  if (screen.name === "tutorial") {
    return (
      <GameScreen
        mode="tutorial"
        characterId={screen.characterId}
        seedText=""
        unlocks={[]}
        lang={lang.lang}
        t={lang.t}
        onExit={toTitle}
      />
    );
  }
  if (screen.name === "tutorialSelect") {
    return (
      <CharacterSelect
        t={lang.t}
        showSeed={false}
        onBack={toTitle}
        onSelect={(characterId) => setScreen({ name: "tutorial", characterId })}
      />
    );
  }
  if (screen.name === "practiceSelect") {
    return (
      <CharacterSelect
        t={lang.t}
        showSeed={false}
        showHidden
        onBack={toTitle}
        onSelect={(characterId) => setScreen({ name: "practice", characterId, runKey: 0 })}
      />
    );
  }
  if (screen.name === "profile") {
    return <ProfileScreen t={lang.t} onBack={() => setScreen(screen.back === "daily" ? { name: "daily" } : { name: "title" })} />;
  }
  if (screen.name === "coop") {
    return <CoopScreen lang={lang.lang} setLang={lang.setLang} t={lang.t} initialCode={coopCode} onExit={toTitle} />;
  }
  if (screen.name === "battle") {
    return <BattleScreen lang={lang.lang} setLang={lang.setLang} t={lang.t} initialCode={inviteCode} onExit={toTitle} />;
  }
  if (screen.name === "daily") {
    return (
      <DailyScreen
        initialMode={screen.mode}
        t={lang.t}
        onBack={toTitle}
        onStart={(start) => setScreen({ name: "dailySelect", start })}
        onHall={() => setScreen({ name: "hall" })}
        onArena={() => setScreen({ name: "arenaBoard" })}
      />
    );
  }
  if (screen.name === "hall") return <HallOfFame t={lang.t} onBack={() => setScreen({ name: "daily" })} />;
  if (screen.name === "arenaBoard") return <ArenaBoard t={lang.t} onBack={() => setScreen({ name: "daily" })} />;
  if (screen.name === "dailySelect") {
    return (
      <CharacterSelect
        t={lang.t}
        showSeed={false}
        onBack={() => setScreen({ name: "daily", mode: screen.start.mode })}
        onSelect={(characterId) => setScreen({ name: "dailyGame", start: screen.start, characterId })}
      />
    );
  }
  if (screen.name === "dailyGame") {
    return (
      <DailyGame
        start={screen.start}
        characterId={screen.characterId}
        lang={lang.lang}
        t={lang.t}
        onExit={() => setScreen({ name: "daily", mode: screen.start.mode })}
      />
    );
  }
  if (screen.name === "select") {
    return (
      <CharacterSelect
        t={lang.t}
        initialSeed={seedFromUrl()}
        taboo={!screen.endless && !screen.arena && !screen.hero}
        onBack={toTitle}
        onSelect={(characterId, seedText) => setScreen({ name: "game", characterId, seedText: seedText || newSeedText(), runKey: 0, endless: screen.endless, arena: screen.arena, hero: screen.hero })}
      />
    );
  }
  return (
    <TitleScreen
      {...lang}
      onStartSolo={(endless, arena, hero) => setScreen({ name: "select", endless, arena, hero })}
      onDaily={() => setScreen({ name: "daily" })}
      onBattle={() => setScreen({ name: "battle" })}
      onCoop={() => setScreen({ name: "coop" })}
      onPractice={() => setScreen({ name: "practiceSelect" })}
      onTutorial={() => setScreen({ name: "tutorialSelect" })}
      onTowerDefense={() => setScreen({ name: "tdMaps" })}
      onShop={() => setScreen({ name: "shop" })}
      onStory={() => setScreen({ name: "story" })}
      onSwarm={() => setScreen({ name: "swarmSelect" })}
      onProfile={() => setScreen({ name: "profile", back: "title" })}
      onContinue={() => {
        const saved = loadSavedRun();
        if (saved) setScreen({ name: "game", characterId: saved.characterId, seedText: saved.seedText, initialRun: saved.run, runKey: 0 });
      }}
    />
  );
}
