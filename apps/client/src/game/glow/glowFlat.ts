// 카메라 없이 판 전체를 그리는 화면의 빛 층 (타워 디펜스): 게임 좌표 (0,0)이 캔버스 왼쪽 위, 판 너비 worldW가 캔버스 너비
// 효과는 게임 화면과 같은 glowWatch·glowSkills (내 체력 빛은 끔)
import type { RunState } from "@pixel-rogue/shared";
import { GlowCanvas } from "./glowCanvas";
import { GlowSkills } from "./glowSkills";
import { GlowWatch } from "./glowWatch";

export interface FlatGlow {
  frame(run: RunState, paused: boolean): void;
  destroy(): void;
}

export function createFlatGlow(canvas: HTMLCanvasElement, worldW: number): FlatGlow {
  const glow = new GlowCanvas(canvas);
  const watch = new GlowWatch(true);
  const skills = new GlowSkills(true);
  return {
    frame(run, paused) {
      const dt = glow.tick(paused);
      if (!glow.ready() || !glow.parts) return;
      if (!paused) {
        watch.observe(run, glow.parts, glow.cues);
        skills.observe(run, glow.parts, glow.cues);
      }
      glow.render(dt, glow.size().w / worldW, 0, 0);
    },
    destroy: () => glow.destroy(),
  };
}
