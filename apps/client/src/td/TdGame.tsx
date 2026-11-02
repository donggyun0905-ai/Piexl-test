// 타워 디펜스 게임 화면: 위쪽 줄(라운드·목숨·돈·빠르기) · 맵(누르면 세우기·고르기) · 옆 칸(TdPanel) · 일시정지·결과 창
import {
  CHARACTERS,
  baseStats,
  canBuild,
  createTd,
  placeTower,
  repairTower,
  sellTower,
  startRound,
  stepTd,
  TD_ROUNDS,
  TD_RULES,
  TD_WAVES,
  TICK_MS,
  towerAt,
  upgradeTower,
  type CharacterId,
  tdThemeOf,
  type TdMapId,
  type TdState,
} from "@pixel-rogue/shared";
import { useCallback, useEffect, useRef, useState } from "react";
import { TdStats } from "./TdStats";
import { play, startMusic, stopMusic, unlockAudio } from "../audio/sound";
import type { Lang, TextKey } from "../i18n";
import { useBackButton } from "../game/screenHooks";
import { drawTd, MAP_H, MAP_W, type TdView } from "./tdDraw";
import { TdPanel } from "./TdPanel";
import { TdOverlay } from "./TdOverlay";
import { recordTd } from "../shop/missions";
import { saveTdResult } from "./tdRecords";
import { recordTdMedal } from "../medals/modeMedals";
import { tdBalance } from "../balance";

interface Props {
  mapId: TdMapId;
  lang: Lang;
  t: (key: TextKey) => string;
  onRetry: () => void;
  onExit: () => void;
}

/** 한 프레임에 최대 계산 틱 (느린 기기에서 밀리지 않게) */
const MAX_STEPS = 12;

export function TdGame({ mapId, lang, t, onRetry, onExit }: Props) {
  // 판을 시작할 때 타워 디펜스 수치를 넣음 (판 도중에는 바꾸지 않음)
  const [td] = useState<TdState>(() => {
    tdBalance.begin();
    return createTd(Math.floor(Math.random() * 0x7fffffff), mapId);
  });
  useEffect(() => () => tdBalance.end(), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [, setHud] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [placing, setPlacing] = useState<CharacterId | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const hover = useRef<{ col: number; row: number } | null>(null);
  const ui = useRef({ speed, paused, placing, selectedId });
  useEffect(() => {
    ui.current = { speed, paused, placing, selectedId };
  }, [speed, paused, placing, selectedId]);

  useBackButton(useCallback(() => setPaused((p) => !p), []));

  // 진행·그리기 루프
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let hudAt = 0;
    let prev = { round: td.round, lives: td.lives, boss: td.run.bossKills, phase: td.phase };
    const frame = (now: number) => {
      const { speed: sp, paused: ps } = ui.current;
      acc += Math.min(250, now - last) * (ps ? 0 : sp);
      last = now;
      let steps = 0;
      while (acc >= TICK_MS && steps < MAX_STEPS * sp) {
        stepTd(td);
        acc -= TICK_MS;
        steps++;
      }
      if (steps >= MAX_STEPS * sp) acc = 0;
      prev = events(td, prev, t, setBanner);
      draw(now, ps ? 1 : acc / TICK_MS);
      if (now - hudAt > 120) {
        hudAt = now;
        setHud((n) => n + 1);
      }
      raf = requestAnimationFrame(frame);
    };
    const draw = (now: number, alpha: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const { placing: pl, selectedId: sel } = ui.current;
      const h = hover.current;
      const v: TdView = {
        alpha,
        scale: canvas.width / MAP_W,
        selected: sel,
        hover: pl && h ? { ...h, ok: canBuild(td, h.col, h.row), character: pl, range: baseStats(pl, CHARACTERS[pl].startWeapon).range } : null,
        time: now / 1000,
      };
      drawTd(ctx, td, v);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [td, t]);

  // 캔버스 크기: 감싼 칸에 맞춤 (0.25배 단위)
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const fit = () => {
      // 감싼 칸 안쪽 크기 (여백 빼고)
      const s0 = Math.min((wrap.clientWidth - 12) / MAP_W, (wrap.clientHeight - 12) / MAP_H);
      const s = Math.max(0.5, Math.floor(s0 * 4) / 4);
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${Math.floor(MAP_W * s)}px`;
      canvas.style.height = `${Math.floor(MAP_H * s)}px`;
      canvas.width = Math.round(MAP_W * s * dpr);
      canvas.height = Math.round(MAP_H * s * dpr);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    fit();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    startMusic(1, false);
    return () => stopMusic();
  }, []);

  // 끝나면 기록 저장 (한 번)
  const over = td.phase === "won" || td.phase === "lost";
  useEffect(() => {
    if (!over) return;
    saveTdResult(td);
    recordTdMedal(td);
    recordTd(td.round);
  }, [over, td]);

  const tileOf = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * MAP_W;
    const y = ((e.clientY - r.top) / r.height) * MAP_H;
    return { col: Math.floor(x / 16), row: Math.floor(y / 16) };
  };

  const onTap = (e: React.PointerEvent<HTMLCanvasElement>) => {
    unlockAudio();
    const { col, row } = tileOf(e);
    const tower = towerAt(td, col, row);
    if (placing) {
      if (placeTower(td, placing, col, row)) {
        play("buy");
        setPlacing(null);
      } else if (tower) {
        setPlacing(null);
        setSelectedId(tower.id);
      }
    } else setSelectedId(tower ? tower.id : null);
    setHud((n) => n + 1);
  };

  // 키: 스페이스 라운드 시작 · 1~3 빠르기 · Esc 취소/일시정지
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        startRound(td);
      } else if (e.key >= "1" && e.key <= "3") setSpeed(Number(e.key));
      else if (e.key === "Escape") {
        if (ui.current.placing) setPlacing(null);
        else if (ui.current.selectedId !== null) setSelectedId(null);
        else setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [td]);

  const selected = td.towers.find((x) => x.id === selectedId) ?? null;
  const canStart = td.phase === "build" || td.phase === "break";
  const startLabel =
    td.phase === "break"
      ? t("tdNextIn").replace("{s}", String(Math.ceil(td.breakTicks / 60))).replace("{g}", String(Math.floor(td.breakTicks / 60) * TD_RULES.earlyGold))
      : t("tdStart");

  return (
    <div className={`td-game theme-${tdThemeOf(mapId)}`}>
      <header className="td-hud">
        <span className="td-round">
          {t("tdRound")} <b>{Math.max(1, td.round)}</b>/{TD_ROUNDS}
          {nextBoss(td.round) && <em> ★</em>}
        </span>
        <span className="td-lives">♥ {td.lives}</span>
        <span className="td-gold">● {td.run.gold}</span>
        <span className="td-speed">
          {[1, 2, 3].map((n) => (
            <button key={n} type="button" className={speed === n ? "selected" : ""} onClick={() => setSpeed(n)}>
              {n}x
            </button>
          ))}
          <button type="button" onClick={() => setPaused(true)} aria-label={t("tdPause")}>
            ❚❚
          </button>
        </span>
      </header>
      <div className="td-body">
        <div className="td-field" ref={wrapRef}>
          <canvas
            ref={canvasRef}
            onPointerDown={onTap}
            onPointerMove={(e) => {
              if (e.pointerType === "mouse") hover.current = tileOf(e);
            }}
            onPointerLeave={() => (hover.current = null)}
          />
          {banner && <div className="td-banner">{banner}</div>}
        </div>
        <TdStats td={td} t={t} />
        <aside className="td-side">
          {canStart && (
            <button type="button" className="td-start primary" onClick={() => (unlockAudio(), startRound(td), setHud((n) => n + 1))}>
              {startLabel}
            </button>
          )}
          <TdPanel
            td={td}
            lang={lang}
            t={t}
            placing={placing}
            selected={selected}
            onPlacing={(id) => {
              setPlacing(id);
              setSelectedId(null);
            }}
            onClose={() => setSelectedId(null)}
            onUpgrade={(choice) => {
              if (selected && upgradeTower(td, selected.id, choice)) play("pickup");
              setHud((n) => n + 1);
            }}
            onRepair={() => {
              if (selected && repairTower(td, selected.id)) play("pickup");
              setHud((n) => n + 1);
            }}
            onSell={() => {
              if (selected) sellTower(td, selected.id);
              play("coin");
              setSelectedId(null);
            }}
          />
        </aside>
      </div>
      <TdOverlay td={td} t={t} paused={paused && !over} onResume={() => setPaused(false)} onRetry={onRetry} onExit={onExit} />
    </div>
  );
}

/** 이 라운드가 보스 라운드인지 (위쪽 줄 ★) */
function nextBoss(round: number): boolean {
  const w = TD_WAVES[Math.max(0, round - 1)];
  return !!(w?.bosses || w?.final);
}

/** 상태 변화 → 소리·알림 띠 */
function events(td: TdState, prev: { round: number; lives: number; boss: number; phase: string }, t: (k: TextKey) => string, setBanner: (s: string | null) => void) {
  if (td.round !== prev.round) {
    const w = TD_WAVES[td.round - 1];
    const text = w?.final ? t("tdFinalWave") : w?.bosses ? t("tdBossWave") : `${t("tdRound")} ${td.round}`;
    setBanner(text);
    setTimeout(() => setBanner(null), 2200);
    if (w?.final || w?.bosses) play("boss");
    startMusic(Math.min(6, 1 + Math.floor(td.round / 4)), !!(w?.final || w?.bosses));
  }
  if (td.lives < prev.lives) play("hurt");
  if (td.run.bossKills > prev.boss) play("bossDown");
  if (td.phase !== prev.phase) {
    if (td.phase === "break") play("stairs");
    else if (td.phase === "won") play("clear");
    else if (td.phase === "lost") play("fall");
  }
  return { round: td.round, lives: td.lives, boss: td.run.bossKills, phase: td.phase };
}
