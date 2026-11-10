import { continueToLastFloor, createPracticeRun, createRun, FLOOR_COUNT, parseSeed, VIEW_HEIGHT, VIEW_WIDTH, type LastBossKind, type RunState } from "@pixel-rogue/shared";
import { useRaidFull } from "./raidFull";
import { LastBossChoice } from "./LastBossChoice";
import { beginRun, endRun } from "../balance";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AchievementToast } from "./AchievementToast";
import { cameraFor, zoomFor } from "./camera";
import { clickTargetAt } from "./clickTargets";
import type { StatRow } from "./statsView";
import { Controls } from "./controls";
import { playerScreenPos, startGameLoop } from "./gameLoop";
import { createRunTracker, withPet } from "./runTracker";
import { createRunSounds } from "../audio/runSounds";
import { play } from "../audio/sound";
import { getSettings, setSettings } from "../settings";
import { GameOverlays, isInfo, type Overlay, type Result } from "./GameOverlays";
import { formatTime } from "./hudText";
import { gymPlaying, Loadout, type LoadoutView } from "./Loadout";
import { RouteMap } from "./RouteMap";
import { floorTipAt, PickupTip, type FloorTip } from "./PickupTip";
import { CharInfoHost, GameHud, infoNext, PanHint, StatsPanel, WithControls } from "./GameHud";
import { createShaker, useBackButton, useFitScale } from "./screenHooks";
import { PracticePanel } from "./PracticePanel";
import { createTutorial, type Tutorial, type TutorialStepId } from "./tutorial";
import { TutorialBanner } from "./TutorialBanner";
import { markTutorialDone } from "../records";
import { TouchButtons } from "./TouchButtons";
import type { GameScreenProps } from "./gameScreenProps";
import { loadTaboo, randomKitOn } from "../taboo/tabooStore";
export type { GameMode } from "./gameScreenProps";
export function GameScreen(props: GameScreenProps) {
  const { mode, characterId, seedText, sudden = false, endless = false, arena = false, hero = false, lang, t, onExit } = props;
  const sandbox = mode === "practice" || mode === "tutorial";
  const canPause = mode === "solo" || mode === "swarm" || mode === "paewang" || sandbox;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const moveBaseRef = useRef<HTMLDivElement>(null);
  const moveKnobRef = useRef<HTMLDivElement>(null);
  const aimBaseRef = useRef<HTMLDivElement>(null);
  const aimKnobRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLButtonElement>(null);
  const hpFillRef = useRef<HTMLDivElement>(null);
  const hpTextRef = useRef<HTMLSpanElement>(null);
  const infoRef = useRef<HTMLSpanElement>(null);
  const miniRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<Controls | null>(null);
  const getControls = useCallback(() => controlsRef.current, []);
  const runRef = useRef<RunState | null>(null);
  const getRun = useCallback(() => runRef.current, []);
  const cb = useRef(props);
  useLayoutEffect(() => {
    cb.current = props;
  });
  const pvp = mode === "paewang" || !!props.initialRun?.pvp; // 패왕전: 화면 꽉 채움
  const full = useRaidFull(getRun) || pvp; // 레이드 방도 꽉 채움
  const [scale, wide] = useFitScale(wrapRef, full);
  const dpr = window.devicePixelRatio || 1;
  const [overlay, setOverlay] = useState<Overlay>("none");
  const overlayRef = useRef<Overlay>("none");
  const [touchMode, setTouchMode] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  const [autoAim, setAutoAim] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  const [result, setResult] = useState<Result | null>(null);
  /** 혼자 하기에서 6층을 깨면 라스트 보스 도전 (무한 모드·이미 도전한 판은 제외) */
  const [canChallenge, setCanChallenge] = useState(false);
  const challenge = (boss: LastBossKind) => {
    if (!runRef.current) return;
    continueToLastFloor(runRef.current, boss); setCanChallenge(false); setResult(null);
  };
  /** 안내 글: 상호작용(F·버튼)이거나 가까운 아이템 설명 */
  const [prompt, setPrompt] = useState<{ text: string; interact: boolean }>({ text: "", interact: false });
  const [loadout, setLoadout] = useState<LoadoutView | null>(null);
  /** 마우스를 올린 바닥 아이템 설명 (마우스 옆에 뜸) */
  const [tip, setTip] = useState<FloorTip | null>(null);
  const tutorialRef = useRef<Tutorial | null>(null);
  const [tutorialStep, setTutorialStep] = useState<TutorialStepId | null>(null);
  const [stats, setStats] = useState<StatRow[] | null>(null);
  const [toasts, setToasts] = useState<{ key: number; id: string }[]>([]);
  useEffect(() => {
    overlayRef.current = overlay;
    // 창이 뜨면 누르던 입력을 놓음 (공격이 계속 안 나가게)
    if (overlay !== "none") controlsRef.current?.releaseAll();
  }, [overlay]);
  // 모바일 뒤로가기 → 나가기 확인
  const toggleExit = useCallback(() => setOverlay((o) => (o === "exit" || isInfo(o) ? "none" : "exit")), []);
  useBackButton(toggleExit);
  // 배틀 시간 끝: 바깥에서 판을 끝냄
  useEffect(() => {
    const run = runRef.current;
    if (props.forceEnd && run && !run.over) run.over = true;
  }, [props.forceEnd]);
  // 게임 진행
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const zone = zoneRef.current;
    const sticks = {
      moveBase: moveBaseRef.current,
      moveKnob: moveKnobRef.current,
      aimBase: aimBaseRef.current,
      aimKnob: aimKnobRef.current,
    };
    if (!canvas || !ctx || !zone || !sticks.moveBase || !sticks.moveKnob || !sticks.aimBase || !sticks.aimKnob) return;
    ctx.imageSmoothingEnabled = false;
    const start = cb.current;
    beginRun(start.balance);
    const run: RunState =
      withPet(sandbox ? (start.initialRun ?? createPracticeRun(characterId, mode === "practice" ? Date.now() % 1e6 : 1)) : (start.initialRun ?? createRun(parseSeed(seedText), characterId, start.unlocks, sudden, endless, arena, hero, mode === "solo" && !endless && !arena && !hero ? loadTaboo() : undefined, mode === "solo" && randomKitOn())), mode, !!arena);
    runRef.current = run;
    if (import.meta.env.DEV) (window as unknown as { pixelRogueRun: RunState }).pixelRogueRun = run;
    const controls: Controls = new Controls({
      zone,
      sticks: sticks as { moveBase: HTMLElement; moveKnob: HTMLElement; aimBase: HTMLElement; aimKnob: HTMLElement },
      playerScreenPos: () => playerScreenPos(canvas, run, controls.zoom, cameraFor(run, controls.zoom)),
      onEscape: () => (start.embedded ? undefined : run.prompt.kind === "station" && run.prompt.open ? controls.queueInteract() : toggleExit()),
      onPause: () => setOverlay((o) => (o === "pause" ? "none" : o === "none" ? "pause" : o)),
      onAutoAimChange: setAutoAim,
      onToggleStats: () => setSettings({ showStats: !getSettings().showStats }),
      onToggleHitbox: () => setSettings({ showHitbox: !getSettings().showHitbox }),
      onToggleRange: () => setSettings({ showRange: !getSettings().showRange }),
      onToggleNames: () => setSettings({ showNames: !getSettings().showNames }),
      onTouch: () => setTouchMode(true),
      zoom: zoomFor(run), pan: !!run.raidBoss,
      clickTarget: (x, y) => clickTargetAt(run, canvas, controls.zoom, x, y),
    });
    controlsRef.current = controls;

    // 맞으면 화면 흔들림 (설정에서 끔)
    const shake = createShaker(canvas);
    const sounds = createRunSounds(run, (power) => {
      if (getSettings().shake) shake(power);
    });

    let toastKey = 0;
    const tracker = createRunTracker(mode === "solo" && !run.tierPlay, seedText, run, (id) => {
      play("achievement");
      const key = ++toastKey;
      setToasts((list) => [...list, { key, id }]);
      setTimeout(() => setToasts((list) => list.filter((x) => x.key !== key)), 3500);
    }, run.party?.length ?? 0);
    const save = tracker.save;
    const tutorial = mode === "tutorial" ? createTutorial(run) : null;
    tutorialRef.current = tutorial;
    setTutorialStep(tutorial ? tutorial.step : null);

    const stop = startGameLoop({
      run,
      ctx,
      miniCtx: miniRef.current?.getContext("2d") ?? null,
      controls,
      lang,
      t,
      hp: { fill: hpFillRef.current, text: hpTextRef.current },
      info: infoRef.current,
      dashButton: () => dashRef.current,
      practice: sandbox,
      paused: () => canPause && (overlayRef.current !== "none" || gymPlaying()),
      setPrompt,
      setLoadout,
      setStats,
      timeText: () => cb.current.timeText?.() ?? formatTime(run.tick),
      ...(start.step ? { step: start.step, overlay: start.overlay, show: start.show } : {}),
      onInput: (input) => tracker.record(input, cb.current.onInput),
      onAdvance: (r) => {
        if (!sandbox) tracker.advance();
        if (tutorial?.update()) {
          setTutorialStep(tutorial.step);
          // 단계가 바뀌면 떠 있던 설명은 닫음
          setTip(null);
          if (tutorial.step === "end") markTutorialDone();
        }
        sounds.update();
        cb.current.onAdvance?.(r);
      },
      onOver: (r, dmg) => {
        setResult({ ...tracker.finish(dmg), hurt: r.won || r.player.hp > 0 ? undefined : r.player.hurtLog });
        const can = mode === "solo" && r.won && r.floor === FLOOR_COUNT && !r.endless && !r.hero && !r.lastBoss;
        const auto = can ? cb.current.autoLastBoss?.() : undefined;
        if (auto) challenge(auto);
        else setCanChallenge(can);
        cb.current.onRunEnd?.(r);
      },
    });

    // 아이템에 마우스를 올리면 이름·설명
    const onMove = (e: MouseEvent) => {
      setTip(floorTipAt(run, canvas, controls.zoom, e.clientX, e.clientY, lang, t));
    };
    window.addEventListener("mousemove", onMove);
    // 탭을 닫거나 앱을 바꿔도 저장
    const onHide = () => {
      if (document.visibilityState === "hidden") save();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", save);
    return () => {
      save();
      stop();
      sounds.dispose();
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", save);
      controls.dispose();
      controlsRef.current = null;
      endRun();
    };
  }, [characterId, canPause, sandbox, t, lang, mode, seedText, sudden, endless, arena, hero, toggleExit]);

  return (
    <div className="game-screen">
      <GameHud
        t={t}
        touchMode={touchMode}
        autoAim={autoAim} manualOnly={pvp} pvp={pvp}
        onPause={() => setOverlay("pause")}
        live={!canPause}
        onAutoAim={(on) => controlsRef.current?.setAutoAim(on)}
        hpFillRef={hpFillRef}
        hpTextRef={hpTextRef}
        infoRef={infoRef}
      />

      {tutorialStep && (
        <TutorialBanner
          step={tutorialStep}
          t={t}
          touchMode={touchMode}
          onSkip={() => {
            tutorialRef.current?.skip();
            const next = tutorialRef.current?.step ?? null;
            setTutorialStep(next);
            setTip(null);
            if (next === "end") markTutorialDone();
          }}
          onExit={onExit}
        />
      )}

      <div ref={wrapRef} className="game-canvas-wrap">
        {/* 실제 해상도 크기 */}
        <canvas
          ref={canvasRef}
          width={Math.round(VIEW_WIDTH * wide * scale * dpr)}
          height={Math.round(VIEW_HEIGHT * scale * dpr)}
          style={{ width: VIEW_WIDTH * wide * scale, height: VIEW_HEIGHT * scale }}
        />
        {stats && !pvp && <StatsPanel rows={stats} t={t} lang={lang} onInfo={props.embedded ? undefined : setOverlay} run={getRun} />}
        {!pvp && !props.embedded && <CharInfoHost run={getRun} character={characterId} lang={lang} t={t} open={overlay} onInfo={(k) => setOverlay((o) => infoNext(o, k))} />}
        {mode !== "practice" && mode !== "swarm" && !full && (
          <RouteMap miniRef={miniRef} run={getRun} t={t} />
        )}
        {prompt.text && (!touchMode || !prompt.interact) && (
          <div className="prompt">{prompt.interact ? `F · ${prompt.text}` : prompt.text}</div>
        )}
      </div>
      {mode === "practice" && props.onPracticeCharacter && (
        <PracticePanel run={getRun} loadout={loadout} characterId={characterId} lang={lang} t={t} onCharacter={props.onPracticeCharacter} />
      )}
      {loadout && <Loadout view={loadout} character={characterId} lang={lang} t={t} touchMode={touchMode} controls={() => controlsRef.current} />}
      {pvp || props.initialRun?.raidBoss ? <PanHint t={t} touchMode={touchMode} /> : <p className={`game-hint ${touchMode ? "touch" : ""}`}>{t(touchMode ? "hintRotate" : "hintPc")}</p>}

      {/* 터치·마우스 입력 영역 */}
      <div ref={zoneRef} className="input-zone" />
      <div ref={moveBaseRef} className="stick-base" />
      <div ref={moveKnobRef} className="stick-knob" />
      <div ref={aimBaseRef} className="stick-base aim" />
      <div ref={aimKnobRef} className="stick-knob aim" />
      {touchMode && loadout && (
        <TouchButtons
          slots={loadout.slots} useOff={loadout.useOff} cds={loadout.cds}
          lang={lang}
          t={t}
          controls={getControls}
          interact={prompt.interact ? prompt.text : ""}
          dashRef={dashRef}
        />
      )}
      {tip && <PickupTip tip={tip} t={t} />}<AchievementToast toasts={toasts} lang={lang} t={t} />{props.withControls && <WithControls render={props.withControls} controls={getControls} />}
      {result && props.afterRun ? (
        props.afterRun
      ) : (
        <GameOverlays
          overlay={overlay}
          result={result}
          seedText={mode === "solo" ? seedText : ""}
          lang={lang}
          t={t}
          onClose={() => setOverlay("none")}
          onExit={onExit}
          onRetry={props.onRetry}
          extra={canChallenge ? <LastBossChoice t={t} onChoose={challenge} /> : props.resultExtra}
          time={result ? formatTime(result.ticks) : ""}
          live={!canPause}
        />
      )}
    </div>
  );
}
