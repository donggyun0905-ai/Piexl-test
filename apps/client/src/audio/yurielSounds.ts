// 유리엘 효과음: 새로 생긴 유리엘 효과마다 (철퇴 · 사슬 한 바퀴 · 정화 · 정화의 빛 · 철퇴 던지기·떨어짐 · 결계 · 기도 · 빛의 철퇴 + 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  yrSwingFx: "pwSlash", yrSpinFx: "pwDash", yrPurgeFx: "gbBell", yrLightFx: "chime", yrMaceFx: "pwSlash", yrSlamFx: "gbQuake", yrWardFx: "chime", yrUltFx: "gbGrav", yrHolyFx: "gbBell",
};
/** 화면이 흔들리는 큰 기술 */
const SHAKE: Partial<Record<string, number>> = { yrSlamFx: 2, yrHolyFx: 4 };

export function yurielSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "yuriel") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
