// 네일러 효과음: 새로 생긴 네일러 효과마다 (망치 쇳소리 · 못 박힘 · 붉은 실 바닥 못·고정 · 망치 원 + 흔들림 · 도화선 박기 · 저주 터짐 + 흔들림 · 못비 망치질 · 달빛 각성 + 크게 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  nlSwingFx: "clank", nlStickFx: "iaStab", nlAnchorFx: "clank", nlPinFx: "iaStab", nlSmashFx: "gbQuake", kgPlant: "gbGrav", nlCurseFx: "gbQuake", nlUltFx: "clank", blAwakeFx: "gbBell",
};
/** 화면이 흔들리는 큰 효과 */
const SHAKE: Partial<Record<string, number>> = { nlSwingFx: 0.5, nlPinFx: 1, nlSmashFx: 2, nlCurseFx: 2, nlUltFx: 0.5, blAwakeFx: 3 };

export function nailerSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "nailer") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
