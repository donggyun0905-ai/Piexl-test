// 이안 효과음: 새로 생긴 이안 효과마다 (펜 찌르기 · 실 휘감기·인과의 실 · 급소·집행 · 인과율 속박 + 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  iaThrust: "iaStab", iaStab: "iaStab", iaWhip: "iaLash", iaThread: "iaLash", iaVital: "btBurst", iaWrit: "mrShing",
  iaBind: "chime", iaLaw: "iaLaw", iaRebound: "btBurst",
};
/** 화면이 흔들리는 큰 기술 */
const SHAKE: Partial<Record<string, number>> = { iaLaw: 4, iaRebound: 2, iaVital: 1 };

export function ianSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "ian") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
