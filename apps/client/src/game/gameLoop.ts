// 게임 진행: 고정 간격 계산 + 화면 주사율에 맞춘 그리기 + HUD 갱신 (React 밖에서 돌림)
import { noteExhibits, noteRecords } from "../lobby/exhibits";
import { itemName } from "../i18n/items";
import { fateParts } from "../i18n/items/voyagerAbilities";
import { applyRoom, ARENA_LEVELS, inPlay, FLOOR_COUNT, HERO_FLOORS, LEGENDS, tabooPoints, stepSim, TICK_MS, type RunState, type TickInput } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { LEGEND_NAMES } from "../i18n/items/general";
import { SPECIAL_NAMES } from "../i18n/items/abandoned";
import type { Controls } from "./controls";
import { formatTime, pickupText, promptText } from "./hudText";
import { loadoutKey, type LoadoutView } from "./Loadout";
import { loadoutView } from "./loadoutView";
import { drawMinimap } from "./minimap";
import { viewH, viewW } from "./viewSize";
import { drawFrame, type DrawOverlay } from "./render";
import { getSettings } from "../settings";
import { statRows, type StatRow } from "./statsView";
import { DamageTracker } from "./damageNumbers";
import { PwInfoNumbers } from "./pwInfoNumbers";
import { wornLimited, wornVictory } from "./limited/limited";
import { drawTigerOver, drawTigerUnder, tigerResting } from "./limited/tigerDraw";
import { TigerFx } from "./limited/tigerFx";
import { drawThemeOver, drawThemeUnder } from "./limited/themeDraw";
import { ThemeFx } from "./limited/themeFx";
import { SummerFx } from "./limited/summerFx";
import { drawSummerOver, drawSummerUnder, summerResting } from "./limited/summerDraw";
import { splash } from "../audio/summerSound";
import { roar } from "../audio/tigerSound";
import { fanfare } from "../audio/victorySound";
import { activeFx } from "../shop/effects";

/** 머리 위 히든 글자 (효과 hdText 번호): 0~3 저주받은 주사위 저주 (sim/hiddenDice 순서) · 4~13 떨어진 신의 파편으로 얻은 힘 (sim/hiddenPerks 순서) */
const HIDDEN_TEXT = ["curseSummon", "curseHp", "cursePassives", "curseBare", "shard0", "shard1", "shard2", "shard3", "shard4", "shard5", "shard6", "shard7", "shard8", "shard9"] as const;

/** 한 번에 따라잡는 최대 틱 수 (탭을 오래 비웠다 돌아올 때 멈춤 방지) */
const MAX_CATCH_UP = 10;
/** 검은 잔영 대사 */
const UMBRA_LINES: readonly TextKey[] = ["umbraSay0", "umbraSay1", "umbraSay2", "umbraSay3", "umbraSay4", "umbraSay5", "umbraSay6"];

export interface LoopOptions {
  run: RunState;
  ctx: CanvasRenderingContext2D;
  miniCtx: CanvasRenderingContext2D | null;
  controls: Controls;
  lang: Lang;
  t: (key: TextKey) => string;
  hp: { fill: HTMLElement | null; text: HTMLElement | null };
  info: HTMLElement | null;
  /** 모바일 대시 버튼: 다시 쓸 수 있을 때까지 남은 양(1→0)을 CSS --cd로 */
  dashButton?: () => HTMLElement | null;
  /** 연습장: 죽어도 체력을 채워 계속함 */
  practice?: boolean;
  /** 지금 멈춰 있는지 (혼자 하기의 일시정지·창) */
  paused: () => boolean;
  setPrompt: (p: { text: string; interact: boolean }) => void;
  setLoadout: (v: LoadoutView) => void;
  /** 능력치 보기가 켜져 있으면 지금 수치, 꺼져 있으면 null */
  setStats: (rows: StatRow[] | null) => void;
  /** 매 틱 입력 (일일 도전 입력 기록) */
  onInput?: (input: TickInput) => void;
  /** 틱을 진행한 프레임마다 (저장·업적·배틀 상태) */
  onAdvance?: (run: RunState) => void;
  /** 판이 끝난 순간 한 번 */
  /** 판이 끝남 (damage: 이 판에 준 피해 기록, 한 판 요약용) */
  onOver: (run: RunState, damage: DamageTracker) => void;
  /** 배틀: 남은 시간 표시용 (없으면 걸린 시간) */
  timeText?: () => string;
  /** 협동: 틱 진행을 바깥에 맡김 (진행할 틱이 아직 없으면 false) */
  step?: (run: RunState, input: TickInput) => boolean;
  overlay?: DrawOverlay | undefined;
  /** 협동: 틱을 진행한 프레임마다 화면용 상태를 만듦 (확정 + 짐작) */
  show?: ((run: RunState) => void) | undefined;
}

export function startGameLoop(o: LoopOptions): () => void {
  const { run, ctx, controls, t, lang } = o;
  // 추적자는 숫자 1·2·3이 스킬 (아이템은 Q·E)
  // 패왕전은 숫자 1~4가 스킬 (조준 모드)
  controls.skillKeys = run.player.characterId === "tracker" || !!run.pvp;
  controls.arm.on = !!run.pvp;
  // 패왕전은 자동 공격 없이 직접 조준만
  if (run.pvp) {
    controls.manualOnly = true;
    controls.setAutoAim(false);
  }
  /** 추적자 암습 저격 동안 자동 공격을 잠깐 끔 (끝나면 다시 켬) */
  let autoBack = false;
  let acc = 0;
  let last = performance.now();
  let frame = 0;
  let shownHp = "";
  let shownInfo = "";
  let shownPrompt = "";
  let shownMap = "";
  let shownLoadout = "";
  let shownStats = "";
  let overShown = false;
  let shownCd = -1;
  let cdMax = 1;
  const damage = new DamageTracker();
  // 패왕전: 회복·보호막·받은 피해·상태이상·버프 글자
  const pwInfo = run.pvp ? new PwInfoNumbers(t) : null;
  // 한정 스킨(범 풍류) 효과: 입었을 때만
  // 범 풍류: 한정 스킨이면 전부, 아니면 이벤트 상점에서 장착한 효과만 (울음소리는 한정 스킨만)
  const summer = wornLimited(run.player.characterId) === "summer";
  const fx = activeFx(wornLimited(run.player.characterId) ?? (wornVictory(run.player.characterId) ? "victory" : null));
  const victory = !wornLimited(run.player.characterId) && wornVictory(run.player.characterId);
  const hooks = { powerText: t(victory ? "victoryPower" : summer ? "summerPower" : "tigerPower"), roar: fx.rest ? (summer ? splash : roar) : () => {}, on: fx };
  const tiger = fx.hit || fx.idle || fx.walk ? (summer ? new SummerFx(hooks) : new TigerFx(hooks)) : null;
  // 이벤트 상점 테마 효과 (칸마다 다른 세트, 범 효과와 같이 씀)
  const th = fx.themes;
  const theme = th.hit || th.idle || th.walk ? new ThemeFx({ ...hooks, roar: victory ? fanfare : () => {}, on: { hit: !!th.hit, idle: !!th.idle, walk: !!th.walk, rest: false } }, th) : null;
  // 내 자리에서만 (관전으로 다른 사람을 볼 때는 내 스킨 효과를 그리지 않음). 손님은 상태를 처음 받을 때 자리가 정해짐
  let mySeat: number | undefined;
  // 패왕전에서 쓰러져 관전 중이면 내 스킨 효과(대기 장면 포함)를 아예 그리지 않음
  const onMe = () => ((mySeat ??= run.seat) === undefined || run.seat === mySeat) && (!run.pvp || inPlay(run, run.seat ?? 0));
  const [under, over, resting] = summer ? [drawSummerUnder, drawSummerOver, summerResting] : [drawTigerUnder, drawTigerOver, tigerResting];
  damage.style = fx.dmg;
  const dummyLabels = [t("dummyAvg"), t("dummyDps"), t("dummyLast"), t("dummyTotal")];

  const updateHud = () => {
    const p = run.player;
    // 서든데스: 한 대면 끝이라 체력을 1로 보여 줌
    const life = p.hp > 0 ? 1 : 0;
    // 보호막(에너지 회수)이 있으면 뒤에 +로 보여 줌
    const barrier = (p.shieldPts ?? 0) >= 1 ? ` +${Math.floor(p.shieldPts ?? 0)}` : "";
    const hp = run.sudden ? `${life} / 1` : `${Math.ceil(p.hp)} / ${Math.round(p.stats.maxHp)}${barrier}`;
    if (hp !== shownHp) {
      shownHp = hp;
      if (o.hp.text) o.hp.text.textContent = hp;
      if (o.hp.fill) o.hp.fill.style.width = `${run.sudden ? 100 * life : (100 * Math.max(0, p.hp)) / p.stats.maxHp}%`;
    }
    const dashEl = o.dashButton?.();
    if (dashEl) {
      // 대시를 쓴 순간의 남은 시간을 최대로 (패시브로 짧아져도 맞게)
      if (p.dashCooldown > cdMax || shownCd === 0) cdMax = Math.max(1, p.dashCooldown);
      const cd = Math.round((20 * p.dashCooldown) / cdMax) / 20;
      if (cd !== shownCd) {
        shownCd = cd;
        dashEl.style.setProperty("--cd", String(cd));
        dashEl.classList.toggle("cooling", cd > 0);
      }
    }
    const time = o.timeText ? o.timeText() : formatTime(run.tick);
    const where = run.swarm
      ? t("swarm")
      : run.pvp
      ? t("paewang")
      : run.arenaLv
      ? `${t("arenaRun")} Lv ${run.arenaLv}/${ARENA_LEVELS}`
      : run.hero
        ? `${t("heroRun")} ${run.floor}/${HERO_FLOORS}${run.lastBoss ? ` · ${t("lastFloorTag")}` : ""}`
        : `${t("floor")} ${run.endless ? `${run.floor} · ∞` : run.lastBoss || run.floor > FLOOR_COUNT ? `${run.floor} · ${t("lastFloorTag")}` : `${run.floor}/${FLOOR_COUNT}`}`;
    const taboo = run.taboo ? ` · 📕${t("tabooHud").replace("{n}", String(tabooPoints(run.taboo)))}` : "";
    const info = `${where}${taboo} · ${t("gold")} ${run.gold} · ${t("kills")} ${run.kills} · ${time}`;
    if (info !== shownInfo && o.info) {
      shownInfo = info;
      o.info.textContent = info;
    }
    const action = promptText(run, lang, t);
    const text = action || pickupText(run, lang, t);
    if (text !== shownPrompt) {
      shownPrompt = text;
      // 협동의 모이기·쓰러짐 안내는 누를 것이 아님
      const passive = run.prompt.kind === "gather" || run.prompt.kind === "revive" || (!!run.party && p.hp <= 0);
      o.setPrompt({ text, interact: action !== "" && !passive });
    }
    const ambush = !!p.trAmbush;
    controls.fineAim = ambush || !!run.pvp;
    if (ambush && controls.autoAim) {
      controls.setAutoAim(false);
      autoBack = true;
    } else if (!ambush && autoBack) {
      controls.setAutoAim(true);
      autoBack = false;
    }
    noteRecords(run, { souls: p.apEaten ?? 0, pilgrims: run.pilgrimMet ?? 0 }, !!o.practice);
    const view = loadoutView(run, controls.arm.armed);
    const lk = loadoutKey(view);
    if (lk !== shownLoadout) {
      shownLoadout = lk;
      noteExhibits(run, p.useSlots, !!o.practice);
      o.setLoadout(view);
    }
    const rows = getSettings().showStats ? statRows(run, t) : null;
    const sk = rows ? rows.map((r) => r.value).join("|") : "";
    if (sk !== shownStats) {
      shownStats = sk;
      o.setStats(rows);
    }

    // 노선도는 방이 바뀌거나 정리됐을 때만 다시 그림 (튜토리얼은 출구가 열리기도 함)
    const exits = run.map.rooms[run.roomId]?.exits;
    const mapKey = `${run.floor}/${run.roomId}/${run.rooms[run.roomId]?.cleared}/${exits ? exits.join() : ""}`;
    if (mapKey !== shownMap && o.miniCtx) {
      shownMap = mapKey;
      drawMinimap(o.miniCtx, run);
    }
  };

  const loop = (now: number) => {
    // 방 크기는 판·방마다 다름 (라스트 보스방·협동 3~5명은 큰 방)
    applyRoom(run);
    const stopped = run.over || o.paused();
    acc = stopped ? 0 : acc + (now - last);
    last = now;
    let steps = 0;
    while (acc >= TICK_MS && steps < MAX_CATCH_UP) {
      const input = controls.read();
      o.onInput?.(input);
      if (!o.step) stepSim(run, input);
      else if (!o.step(run, input)) {
        acc = Math.min(acc, TICK_MS);
        break;
      }
      damage.observe(run);
      pwInfo?.observe(run, mySeat ?? run.seat ?? 0);
      if (onMe()) tiger?.observe(run);
      if (onMe()) theme?.observe(run);
      if (o.practice && run.over) {
        run.over = false;
        run.player.hp = run.player.stats.maxHp;
        run.player.invulnTicks = 60;
      }
      acc -= TICK_MS;
      steps++;
      if (run.over) break;
    }
    if (steps === MAX_CATCH_UP) acc = 0;
    if (steps > 0) o.show?.(run);
    if (steps > 0) o.onAdvance?.(run);
    drawFrame(ctx, run, {
      alpha: stopped || run.over ? 1 : acc / TICK_MS,
      showReticle: controls.touchAiming,
      showHitbox: controls.hitboxHeld || getSettings().showHitbox,
      showRange: getSettings().showRange,
      pilgrimLine: t("pilgrimHello"),
      curseNames: HIDDEN_TEXT.map((k) => t(k)),
      ...(run.pvp && getSettings().showNames ? { charName: (id: string) => t(id as TextKey) } : {}),
      skillAim: controls.arm.armed,
      pixelScale: ctx.canvas.width / viewW(),
      zoom: controls.zoom,
      cursor: () => controls.mouse,
      legendName: (i) => LEGEND_NAMES[LEGENDS[i] ?? "charge"][lang],
      passiveName: (id) => itemName("passive", id as never, lang),
      fateName: (part, i) => fateParts(i, lang)[part]!.name,
      tagName: (kind) => SPECIAL_NAMES[kind][lang],
      oniUp: (k) => t(k === "hp" ? "oniUpHp" : k === "regen" ? "oniUpRegen" : "oniUpReach"),
      umbraLine: (i) => t(UMBRA_LINES[i] ?? "umbraSay0"),
      sageText: t("sageMaxStaff"),
      bossName: (k) => t(k === "dragon" ? "bossDragon" : k === "godeater" ? "bossGodEater" : "bossPrimeval"),
      hidePlayer: tiger ? () => onMe() && resting(tiger) : undefined,
      under: tiger || theme ? (c, snap) => {
        if (!onMe()) return;
        if (theme) drawThemeUnder(c, theme, run, acc / TICK_MS, snap);
        if (tiger) under(c, tiger, run, acc / TICK_MS, snap, run.tick);
      } : undefined,
      overlay: (c, snap) => {
        if (tiger && onMe()) over(c, tiger, run, acc / TICK_MS, snap, run.tick);
        if (theme && onMe()) drawThemeOver(c, theme, run, acc / TICK_MS, snap);
        if (getSettings().showDamage) damage.draw(c, run.tick, snap);
        if (getSettings().showDamage) pwInfo?.draw(c, run, snap);
        damage.drawDummy(c, run, dummyLabels, snap);
      },
      modeOverlay: o.overlay,
    });
    updateHud();
    // 라스트 보스 도전으로 판이 다시 이어지면 끝 처리도 다시
    if (!run.over) overShown = false;
    if (run.over && !overShown) {
      overShown = true;
      controls.releaseAll();
      o.onOver(run, damage);
    }
    frame = requestAnimationFrame(loop);
  };
  frame = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(frame);
}

/** 캔버스 위 플레이어 화면 위치와 게임 1픽셀의 화면 크기 (마우스 조준 계산용) */
export function playerScreenPos(canvas: HTMLCanvasElement, run: RunState, zoom: number, cam: { x: number; y: number }) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: rect.left + (((run.player.x - cam.x) * zoom) / viewW()) * rect.width,
    y: rect.top + (((run.player.y - cam.y) * zoom) / viewH()) * rect.height,
    scale: (zoom * rect.width) / viewW(),
  };
}
