// 게임 화면 빛 층: 게임 캔버스(Canvas 2D) 바로 위에 GlowCanvas를 겹치고, 게임 카메라에 맞춰 효과를 그림
// 상태 보기: 기본(glowWatch: 맞힘·처치·탄·큰 공격) + 각성·궁극기·지형·아이템(glowSkills) + 스킨 효과(glowSkin, addWatch로 붙임)
import type { RunState } from "@pixel-rogue/shared";
import { cameraFor } from "../camera";
import { viewW } from "../viewSize";
import { GlowCanvas, type GlowCues } from "./glowCanvas";
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
      if (!glow.ready() || !glow.parts) return;
      const { w } = glow.size();
      if (!stopped) {
        watch.observe(view, glow.parts, glow.cues);
        skills.observe(view, glow.parts, glow.cues);
        for (const x of extra) x(view, glow.parts, glow.cues);
      }
      const cam = cameraFor(view, zoom, alpha);
      glow.render(dt, (zoom * w) / viewW(), cam.x, cam.y);
    },
    addWatch: (w) => void extra.push(w),
    destroy: () => glow.destroy(),
  };
}
