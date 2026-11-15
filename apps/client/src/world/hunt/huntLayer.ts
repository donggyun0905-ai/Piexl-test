// 지도 사냥을 WorldStage에 붙이는 층: 사냥터가 있는 지역만 · J 휘두르기 · Shift·K 대시 · 1초마다 능력치 다시 읽기(장비·캐릭터 바꿈) · 쓰러지면 걷기 멈춤
import type { CharacterId } from "@pixel-rogue/shared";
import type { Walker } from "../../lobby/walker";
import type { Drawable } from "../worldTrees";
import { groundsIn } from "./huntGrounds";
import { drawDashTrail, drawHuntTop, pushMobs } from "./huntDraw";
import { createHunt, dash, stepHunt, swing } from "./huntSim";
import { huntStats } from "./huntStats";

type Ctx = CanvasRenderingContext2D;

export interface HuntLayer {
  /** 쓰러져 있는 동안 true (걷기 멈춤) */
  down: () => boolean;
  /** 한 장면 · 쓰러졌다 일어나면 true */
  step: (me: Walker, dt: number, stand: (x: number, y: number) => boolean) => boolean;
  push: (ctx: Ctx, t: number, items: Drawable[], near: (x: number, y: number) => boolean) => void;
  under: (ctx: Ctx, me: Walker) => void;
  top: (ctx: Ctx, me: Walker) => void;
  dispose: () => void;
}

/** 사냥터가 없는 지역이면 null */
export function createHuntLayer(region: string, me: Walker, keys: ReadonlySet<string>, who: () => CharacterId, on: () => boolean, onKill: (g: string) => void): HuntLayer | null {
  if (!groundsIn(region).length) return null;
  const h = createHunt(region, who());
  let refresh = 0;
  const key = (e: KeyboardEvent) => {
    if (!on() || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code === "KeyJ") swing(h, me);
    else if (e.code === "KeyK" || e.code === "ShiftLeft" || e.code === "ShiftRight") dash(h, me, keys);
  };
  window.addEventListener("keydown", key);
  return {
    down: () => h.me.down > 0,
    step: (w, dt, stand) => {
      refresh -= dt;
      if (refresh <= 0) {
        refresh = 1;
        h.me.st = huntStats(who());
        h.me.hp = Math.min(h.me.hp, h.me.st.maxHp);
      }
      return stepHunt(h, w, dt, stand, onKill);
    },
    push: (ctx, t, items, near) => pushMobs(ctx, h, t, items, near),
    under: (ctx, w) => drawDashTrail(ctx, h, w),
    top: (ctx, w) => drawHuntTop(ctx, h, w),
    dispose: () => window.removeEventListener("keydown", key),
  };
}
