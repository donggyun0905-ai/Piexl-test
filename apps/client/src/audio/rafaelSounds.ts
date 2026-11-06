// 라파엘 효과음: 새로 생긴 라파엘 효과마다 (화살 · 저격 · 돌풍 · 화살비 · 스코프 · 모으기 · 천공의 빛 화살 · 폭발 + 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  rfGustFx: "pwDash", rfStormFx: "pwSlash", rfScopeFx: "chime", rfChargeFx: "gbGrav", rfHeavenFx: "gbBell", rfBlastFx: "gbQuake", rfMarkFx: "iaStab",
};
/** 화면이 흔들리는 큰 기술 */
const SHAKE: Partial<Record<string, number>> = { rfHeavenFx: 4, rfBlastFx: 3 };

export function rafaelSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "rafael") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    // 화살: 1·2타 가벼운 시위 소리 · 저격 무거운 소리
    const sfx = e.kind === "rfArrowFx" ? (e.style === 1 ? "pwSlash" : "iaStab") : SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
