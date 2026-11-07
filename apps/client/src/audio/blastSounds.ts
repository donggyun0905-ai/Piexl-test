// 블래스트 효과음: 새로 생긴 블래스트 효과마다 (산탄 · 폭멸 + 흔들림 · 달빛 각성 + 크게 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { blShotFx: "pwDash", blBurstFx: "gbQuake", blAwakeFx: "gbBell" };
/** 화면이 흔들리는 큰 효과 */
const SHAKE: Partial<Record<string, number>> = { blShotFx: 0.5, blBurstFx: 1, blAwakeFx: 3 };

export function blastSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "blast") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
