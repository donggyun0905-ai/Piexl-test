// 시저스 효과음: 새로 생긴 시저스 효과마다 (열기 휘두름 · 닫기 쇳소리 · 실 끊김 · 단죄 + 흔들림 · 달빛 각성 + 크게 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { sxOpenFx: "swing", sxCloseFx: "slice", sxCutFx: "katana", sxExecFx: "crit", sxTieFx: "iaStab", blAwakeFx: "gbBell" };
/** 화면이 흔들리는 큰 효과 */
const SHAKE: Partial<Record<string, number>> = { sxCloseFx: 0.5, sxCutFx: 1, sxExecFx: 2, blAwakeFx: 3 };

export function scissorsSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "scissors") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
