// 가브리엘 효과음: 새로 생긴 가브리엘 효과마다 (망치 휘두르기 · 대지 강타·빛의 망치 · 방패 돌진 · 중력 붕괴 · 성벽 · 불멸의 성벽 + 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  gbSwing: "pwSpin", gbSlam: "gbQuake", gbBash: "pwDash", gbWell: "gbGrav", gbWall: "gbQuake", gbUlt: "gbBell", gbThorn: "chime",
};
/** 화면이 흔들리는 큰 기술 */
const SHAKE: Partial<Record<string, number>> = { gbSlam: 2, gbWall: 2, gbUlt: 5 };

export function gabrielSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "gabriel") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
