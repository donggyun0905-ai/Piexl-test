// 세레나 효과음: 새로 생긴 세레나 효과마다 (채찍 휘두르기 · 환혹의 회오리 · 스텝 · 가시 정원 · 맹독 비수 · 환혹의 무도 · 마비 + 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  snWhipFx: "pwSlash", snWhirlFx: "pwSpin", snDashFx: "pwDash", snFieldFx: "chime", snKnifeFx: "iaStab", snUltFx: "gbBell", snNumbFx: "chime", snBloomFx: "btBurst",
};
/** 화면이 흔들리는 큰 기술 */
const SHAKE: Partial<Record<string, number>> = { snUltFx: 3, snBloomFx: 1 };

export function serenaSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "serena") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
