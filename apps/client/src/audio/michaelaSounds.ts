// 미카엘라 효과음: 새로 생긴 미카엘라 효과마다 (베기 · 찌르기 · 투척 · 폭발 · 포탈 · 바꿔 듦 · 순간 이동 · 무기고 + 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  mcSlashFx: "pwSlash", mcThrustFx: "iaStab", mcThrowFx: "pwDash", mcBlastFx: "gbQuake", mcPortalFx: "gbGrav", mcSwapFx: "chime", mcBlinkFx: "pwDash", mcUltFx: "gbBell",
};
/** 화면이 흔들리는 큰 기술 */
const SHAKE: Partial<Record<string, number>> = { mcBlastFx: 1, mcUltFx: 3 };

export function michaelaSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "michaela") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
