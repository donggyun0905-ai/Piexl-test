// 게임 화면 빛 층: 게임 캔버스(Canvas 2D) 바로 위에 GlowCanvas를 겹치고, 게임 카메라에 맞춰 효과를 그림
// 상태 보기: 기본(glowWatch: 맞힘·처치·탄·큰 공격) + 각성·궁극기·지형·아이템(glowSkills) + 스킨 효과(glowSkin, addWatch로 붙임)
import type { RunState } from "@pixel-rogue/shared";
import { cameraFor } from "../camera";
import { viewW } from "../viewSize";
import { GlowCanvas, type GlowCues } from "./glowCanvas";
import { setGlowActive, takeGlowHints } from "./glowHints";
import { hexColor } from "./glowParts";
import type { GlowParts } from "./glowParts";
import { GlowSkills } from "./glowSkills";
import { GlowWatch } from "./glowWatch";

/** 한 화면마다 상태를 보고 효과를 만드는 것 */
export type GlowWatcher = (s: RunState, parts: GlowParts, cues: GlowCues) => void;

export interface GlowLayer {
  /** 한 화면 그리기 (게임 화면을 그린 바로 뒤). stopped: 멈춤 중이면 효과도 멈춤 */
  frame(view: RunState, zoom: number, alpha: number, stopped: boolean): void;
  /** 상태 보기 더하기 (한정 스킨·상점 효과) */
  addWatch(w: GlowWatcher): void;
  destroy(): void;
}

export function createGlowLayer(game: HTMLCanvasElement): GlowLayer {
  const glow = new GlowCanvas(game);
  const watch = new GlowWatch();
  const skills = new GlowSkills();
  const extra: GlowWatcher[] = [];
  return {
    frame(view, zoom, alpha, stopped) {
      const dt = glow.tick(stopped);
      const on = glow.ready() && !!glow.parts;
      setGlowActive(on);
      if (!on || !glow.parts) return;
      const { w } = glow.size();
      if (!stopped) {
        watch.observe(view, glow.parts, glow.cues);
        skills.observe(view, glow.parts, glow.cues);
        for (const x of extra) x(view, glow.parts, glow.cues);
      }
      const cam = cameraFor(view, zoom, alpha);
      const f = (zoom * w) / viewW();
      // 그리는 쪽이 남긴 빛 (shadowBlur 대신, glowHints): 캔버스 픽셀 → 게임 좌표
      const k = f * (game.width / Math.max(1, w));
      // 멈춤 중에는 조각이 줄지 않으니 새로 놓지 않음 (지난 빛이 그대로 남아 보임)
      const hints = takeGlowHints();
      if (!stopped) for (const h of hints) glow.parts.steady(h.x / k + cam.x, h.y / k + cam.y, h.d / k, hexColor(h.color, 0xffffff), 0.6);
      glow.render(dt, f, cam.x, cam.y);
    },
    addWatch: (w) => void extra.push(w),
    destroy: () => {
      setGlowActive(false);
      glow.destroy();
    },
  };
}
