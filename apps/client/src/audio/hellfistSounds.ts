// 헬피스트 효과음: 새로 생긴 헬피스트 효과마다 (찌르기 · 내려찍기 + 흔들림 · 허공 검격 · 적혈 각성 + 크게 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { hfJabFx: "swing", hfSmashFx: "rumble", hfClawFx: "slice", hfAwakeFx: "awaken" };
/** 화면이 흔들리는 큰 효과 */
const SHAKE: Partial<Record<string, number>> = { hfSmashFx: 1.5, hfClawFx: 0.5, hfAwakeFx: 3 };

export function hellfistSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "hellfist") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
