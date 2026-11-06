// 미류 효과음: 새로 생긴 미류 효과마다 (물 휩쓸기 쏴아 · 일섬 챙+물 · 흘림 똑 · 해룡 울림 · 폭포 쾅 + 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  mrCut: "mrSwish", mrFlash: "mrShing", mrWhirl: "ocSwirl", mrBend: "wvPlip", mrCatch: "wvPop", mrLoose: "mrShing", mrSlice: "wvPlip",
  mrReady: "wvSparkle", mrRelease: "mrRoar", mrFall: "wvDeep", mrBurst: "tlSplash", mrShatter: "chime",
};
/** 화면이 흔들리는 큰 기술 */
const SHAKE: Partial<Record<string, number>> = { mrFall: 6, mrRelease: 3, mrFlash: 1 };

export function miryuSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "miryu") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
