// 지도 사냥을 WorldStage에 붙이는 층 (시험 사냥터는 본편 판으로 싸움 battle/battleLayer): 사냥터가 있는 지역 + 바깥 필드(몬스터 없이 휘두르기·대시만) · J·좌클릭 휘두르기 · K·우클릭 대시 (Shift는 달리기) (마우스는 그쪽으로) · 1초마다 능력치 다시 읽기(장비·캐릭터 바꿈) · 쓰러지면 걷기 멈춤
import type { CharacterId } from "@pixel-rogue/shared";
import type { PointHook, View, Walker } from "../../lobby/walker";
import type { TextKey } from "../../i18n";
import type { WorldMap } from "../worldMap";
import { createBattleLayer } from "../battle/battleLayer";
import type { Drawable } from "../worldTrees";
import { groundsIn } from "./huntGrounds";
import { drawDashTrail, drawHuntHud, drawHuntTop, drawMobTip, pushMobs } from "./huntDraw";
import { createHunt, dash, mobsOf, stepHunt, swing, type Mob } from "./huntSim";
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
export function createHuntLayer(region: string, outdoor: boolean, me: Walker, keys: ReadonlySet<string>, who: () => CharacterId, on: () => boolean, onKill: (g: string) => void, mouse: () => readonly [number, number]): HuntLayer | null {
  if (!outdoor && !groundsIn(region).length) return null;
  const h = createHunt(region, who());
  const fight = createBattleLayer(region, h, keys, who, mouse, onKill);
  let refresh = 0;
  // 들판 떠돌이 무리는 지도를 받은 뒤 (첫 장면)
  let packed = false;
  const key = (e: KeyboardEvent) => {
    if (!on() || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (fight.key(e.code)) return;
    if (e.code === "KeyJ") swing(h, me);
    else if (e.code === "KeyK") dash(h, me, keys);
  };
  // 판 안 좌클릭은 누르고 있는 동안 공격
  const up = (e: PointerEvent) => fight.press(e.button, false);
  window.addEventListener("keydown", key);
  window.addEventListener("pointerup", up);
  return {
    down: () => h.me.down > 0,
    fighting: fight.active,
    battle: (ctx, view, k, t, now) => fight.draw(ctx, view, k, t, now),
    step: (w, dt, stand, map) => {
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
      const woke = stepHunt(h, w, dt, stand, onKill);
      fight.tryStart(map, w, dt);
      return woke;
    },
    push: (ctx, t, items, near) => pushMobs(ctx, h, t, items, near),
    under: (ctx, w) => !fight.active() && drawDashTrail(ctx, h, w),
    top: (ctx, w) => !fight.active() && drawHuntTop(ctx, h, w),
    hud: (ctx, w, hh, k, dl, dt) => drawHuntHud(ctx, h, w, hh, k, dl, dt),
    tip: (ctx, x, y, text) => drawMobTip(ctx, h, x, y, text),
    point: (button, x, y, touch) => {
      if (touch || !on()) return false;
      if (fight.press(button, true)) return true;
      const aim = [x - me.x, y - (me.y - 4)] as const;
      if (button === 0) swing(h, me, aim);
      else if (button === 2) dash(h, me, keys, aim);
      else return false;
      return true;
    },
    dispose: () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerup", up);
      fight.dispose();
    },
  };
}
