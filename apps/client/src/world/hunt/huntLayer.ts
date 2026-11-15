// 지도 사냥을 WorldStage에 붙이는 층: 사냥터·들판 무리 몬스터(huntSim) + 싸움은 본편 판(battle/battleLayer) · 좌클릭·J 공격 · 우클릭·K 대시 · 1~4 스킬 (판이 없으면 그 자리에 엶) · Shift 달리기 · 1초마다 체력 다시 읽기(장비·캐릭터 바꿈) · 쓰러지면 걷기 멈춤
import type { CharacterId } from "@pixel-rogue/shared";
import type { PointHook, View, Walker } from "../../lobby/walker";
import type { TextKey } from "../../i18n";
import type { WorldMap } from "../worldMap";
import { createBattleLayer } from "../battle/battleLayer";
import type { Drawable } from "../worldTrees";
import { groundsIn } from "./huntGrounds";
import { drawHuntHud, drawHuntTop, drawMobTip, pushMobs } from "./huntDraw";
import { createHunt, mobsOf, stepHunt, type Mob } from "./huntSim";
import { wanderPacks } from "./huntWander";
import { REGIONS } from "../worldPlaces";
import { huntStats } from "./huntStats";

type Ctx = CanvasRenderingContext2D;

export interface HuntLayer {
  /** 쓰러져 있는 동안 true (걷기 멈춤) */
  down: () => boolean;
  /** 한 장면 · 쓰러졌다 일어나면 true */
  step: (me: Walker, dt: number, stand: (x: number, y: number) => boolean, map: WorldMap) => boolean;
  /** 지도 전투(본편 판) 중 (걷기·내 몸 그리기는 판이 함) */
  fighting: () => boolean;
  /** 지도 전투 그리기 (k = 지도 1픽셀의 캔버스 픽셀) */
  battle: (ctx: Ctx, view: View, k: number, t: (key: TextKey) => string, now: number) => void;
  push: (ctx: Ctx, t: number, items: Drawable[], near: (x: number, y: number) => boolean) => void;
  under: (ctx: Ctx, me: Walker) => void;
  top: (ctx: Ctx, me: Walker) => void;
  /** 화면 아래 체력·대시 줄 (화면 픽셀, k = 글자 배율) */
  hud: (ctx: Ctx, w: number, h: number, k: number, dashLabel: string, downText: (n: number) => string) => void;
  /** 마우스를 올린 몬스터 이름표 (지도 좌표) */
  tip: (ctx: Ctx, x: number, y: number, text: (m: Mob) => string) => void;
  /** 마우스 누름 (터치는 걷기 그대로) */
  point: PointHook;
  dispose: () => void;
}

/** 사냥터가 없는 건물 안이면 null */
export function createHuntLayer(region: string, outdoor: boolean, me: Walker, keys: ReadonlySet<string>, who: () => CharacterId, on: () => boolean, onKill: (g: string) => void, mouse: () => readonly [number, number], shake: (power: number) => void): HuntLayer | null {
  if (!outdoor && !groundsIn(region).length) return null;
  const h = createHunt(region, who());
  const fight = createBattleLayer(region, h, keys, who, mouse, onKill, shake);
  let refresh = 0;
  // 들판 떠돌이 무리는 지도를 받은 뒤 (첫 장면) · 공격 키를 누르면 판을 열 지도
  let packed = false;
  let lastMap: WorldMap | null = null;
  // J(꾹 = 공격)·K 대시·스킬 키: 판이 없으면 그 자리에 열고 본편 입력으로
  const key = (e: KeyboardEvent) => {
    if (!on() || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (fight.wants(e.code) && fight.act(lastMap, me)) fight.key(e.code, true);
  };
  const keyUp = (e: KeyboardEvent) => fight.key(e.code, false);
  // 좌클릭은 누르고 있는 동안 공격
  const up = (e: PointerEvent) => fight.press(e.button, false);
  window.addEventListener("keydown", key);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("pointerup", up);
  return {
    down: () => h.me.down > 0,
    fighting: fight.active,
    battle: (ctx, view, k, t, now) => fight.draw(ctx, view, k, t, now),
    step: (w, dt, stand, map) => {
      lastMap = map;
      if (!packed) {
        packed = true;
        const r = REGIONS[region];
        if (r && outdoor) h.mobs.push(...mobsOf(wanderPacks(region, r, map)));
      }
      refresh -= dt;
      if (refresh <= 0) {
        refresh = 1;
        h.me.st = huntStats(who());
        h.me.hp = Math.min(h.me.hp, h.me.st.maxHp);
      }
      if (fight.active()) {
        fight.step(w, dt);
        return false;
      }
      const woke = stepHunt(h, w, dt, stand);
      fight.tryStart(map, w, dt);
      return woke;
    },
    push: (ctx, t, items, near) => pushMobs(ctx, h, t, items, near),
    under: () => {},
    top: (ctx, w) => !fight.active() && drawHuntTop(ctx, h, w),
    hud: (ctx, w, hh, k, dl, dt) => drawHuntHud(ctx, h, w, hh, k, dl, dt),
    tip: (ctx, x, y, text) => drawMobTip(ctx, h, x, y, text),
    point: (button, x, y, touch) => {
      if (touch) return on() && fight.tap();
      if (!on()) return false;
      // 좌클릭 공격·우클릭 대시: 판이 없으면 그 자리에 엶 (마우스 쪽 조준은 판이 읽음)
      if (button !== 0 && button !== 2) return false;
      return fight.act(lastMap, me) && fight.press(button, true);
    },
    dispose: () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("pointerup", up);
      fight.dispose();
    },
  };
}
