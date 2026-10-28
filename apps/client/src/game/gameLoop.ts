// 게임 진행: 고정 간격 계산 + 화면 주사율에 맞춘 그리기 + HUD 갱신 (React 밖에서 돌림)
import { itemName } from "../i18n/items";
import { fateParts } from "../i18n/items/voyagerAbilities";
import { sellCodes } from "./SellBar";
import { applyRoom, ARENA_LEVELS, expToNext, FLOOR_COUNT, HERO_FLOORS, LEGENDS, sellPrice, tabooPoints, trackerSkills, VIEW_HEIGHT, VIEW_WIDTH, stepSim, TICK_MS, type RunState, type TickInput } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { LEGEND_NAMES } from "../i18n/items/general";
import { SPECIAL_NAMES } from "../i18n/items/abandoned";
import type { Controls } from "./controls";
import { formatTime, pickupText, promptText } from "./hudText";
import { loadoutKey, type LoadoutView } from "./Loadout";
import { drawMinimap } from "./minimap";
import { drawFrame, type DrawOverlay } from "./render";
import { getSettings } from "../settings";
import { statRows, type StatRow } from "./statsView";
import { DamageTracker } from "./damageNumbers";
import { wornLimited } from "./limited/limited";
import { drawTigerOver, drawTigerUnder, tigerResting } from "./limited/tigerDraw";
import { TigerFx } from "./limited/tigerFx";
import { SummerFx } from "./limited/summerFx";
import { drawSummerOver, drawSummerUnder, summerResting } from "./limited/summerDraw";
import { splash } from "../audio/summerSound";
import { roar } from "../audio/tigerSound";
import { activeFx } from "../shop/effects";

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
  controls.skillKeys = run.player.characterId === "tracker";
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
  // 한정 스킨(범 풍류) 효과: 입었을 때만
  // 범 풍류: 한정 스킨이면 전부, 아니면 이벤트 상점에서 장착한 효과만 (울음소리는 한정 스킨만)
  const summer = wornLimited(run.player.characterId) === "summer";
  const fx = activeFx(wornLimited(run.player.characterId));
  const hooks = { powerText: t(summer ? "summerPower" : "tigerPower"), roar: fx.rest ? (summer ? splash : roar) : () => {}, on: fx };
  const tiger = fx.hit || fx.idle || fx.walk ? (summer ? new SummerFx(hooks) : new TigerFx(hooks)) : null;
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
    controls.fineAim = ambush;
    if (ambush && controls.autoAim) {
      controls.setAutoAim(false);
      autoBack = true;
    } else if (!ambush && autoBack) {
      controls.setAutoAim(true);
      autoBack = false;
    }
    const view: LoadoutView = {
      weaponId: p.weaponId,
      slots: [...p.useSlots],
      passives: [...p.passives],
      ...(p.characterId === "novice" ? { novice: { lv: p.lv ?? 1, exp: p.exp ?? 0, need: expToNext(p.lv ?? 1), points: p.points ?? 0 } } : {}),
      // 추적자 스킬 대기 (5% 단위로만 바뀌게)
      ...(p.characterId === "tracker" ? { skills: trackerSkills(p).map((v) => Math.ceil(v * 20) / 20) } : {}),
      // 상점 휴지통에서 F로 판매 창을 열었을 때: 팔 수 있는 값 (무기 + 사용 아이템 2칸 + 패시브 순서, 0 = 못 팜)
      ...(run.prompt.kind === "trash" && run.prompt.confirm && !run.party ? { sell: sellCodes(p.passives.length).map((n) => sellPrice(run, n)) } : {}),
    };
    const lk = loadoutKey(view);
    if (lk !== shownLoadout) {
      shownLoadout = lk;
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
      tiger?.observe(run);
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
      pixelScale: ctx.canvas.width / VIEW_WIDTH,
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
      hidePlayer: tiger ? () => resting(tiger) : undefined,
      under: tiger ? (c, snap) => under(c, tiger, run, acc / TICK_MS, snap, run.tick) : undefined,
      overlay: (c, snap) => {
        if (tiger) over(c, tiger, run, acc / TICK_MS, snap, run.tick);
        if (getSettings().showDamage) damage.draw(c, run.tick, snap);
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
    x: rect.left + (((run.player.x - cam.x) * zoom) / VIEW_WIDTH) * rect.width,
    y: rect.top + (((run.player.y - cam.y) * zoom) / VIEW_HEIGHT) * rect.height,
    scale: (zoom * rect.width) / VIEW_WIDTH,
  };
}
