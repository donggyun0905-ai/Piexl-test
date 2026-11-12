// 처음 화면에 필요 없는 화면은 들어갈 때 받음 (첫 접속 파일 크기 줄이기). 감싸는 Suspense는 main.tsx
import { lazy } from "react";

// 게임 화면 (그리기·게임 계산이 커서 판에 들어갈 때 받음)
export const GameScreen = lazy(() => import("./game/GameScreen").then((m) => ({ default: m.GameScreen })));
export const SoloGame = lazy(() => import("./game/SoloGame").then((m) => ({ default: m.SoloGame })));
export const DailyGame = lazy(() => import("./daily/DailyGame").then((m) => ({ default: m.DailyGame })));

export const BattleScreen = lazy(() => import("./battle/BattleScreen").then((m) => ({ default: m.BattleScreen })));
export const CoopScreen = lazy(() => import("./coop/CoopScreen").then((m) => ({ default: m.CoopScreen })));
export const HallOfFame = lazy(() => import("./daily/HallOfFame").then((m) => ({ default: m.HallOfFame })));
export const ArenaBoard = lazy(() => import("./daily/ArenaBoard").then((m) => ({ default: m.ArenaBoard })));
export const TdGame = lazy(() => import("./td/TdGame").then((m) => ({ default: m.TdGame })));
export const TdScreen = lazy(() => import("./td/TdScreen").then((m) => ({ default: m.TdScreen })));
export const ShopScreen = lazy(() => import("./shop/ShopScreen").then((m) => ({ default: m.ShopScreen })));
export const SwarmGame = lazy(() => import("./event/SwarmGame").then((m) => ({ default: m.SwarmGame })));
export const SwarmMaps = lazy(() => import("./event/SwarmMaps").then((m) => ({ default: m.SwarmMaps })));
export const PwFlow = lazy(() => import("./event/PwFlow").then((m) => ({ default: m.PwFlow })));
export const RaidFlow = lazy(() => import("./event/RaidFlow").then((m) => ({ default: m.RaidFlow })));
export const StoryScreen = lazy(() => import("./story/StoryScreen").then((m) => ({ default: m.StoryScreen })));
export const BuildScreen = lazy(() => import("./archive/BuildScreen").then((m) => ({ default: m.BuildScreen })));
export const TierScreen = lazy(() => import("./archive/TierScreen").then((m) => ({ default: m.TierScreen })));
export const LobbyMode = lazy(() => import("./lobby/LobbyMode").then((m) => ({ default: m.LobbyMode })));
export const PatchNotesList = lazy(() => import("./menu/PatchNotesList").then((m) => ({ default: m.PatchNotesList })));
