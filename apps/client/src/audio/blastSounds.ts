// 블래스트 효과음: 새로 생긴 블래스트 효과마다 (산탄 · 치명타 탄은 더 · 한 발 장전 철컥 · 폭멸 + 흔들림 · 달빛 각성·슬로우모션 + 크게 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { blShotFx: "rifle", blLoadFx: "clank", blBurstFx: "gbQuake", blAwakeFx: "gbBell", blSlowFx: "descend" };
/** 화면이 흔들리는 큰 효과 */
const SHAKE: Partial<Record<string, number>> = { blShotFx: 0.5, blBurstFx: 1, blAwakeFx: 3, blSlowFx: 1 };

export function blastSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "blast") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    // 치명타 탄: 치명타 소리 + 더 크게 흔들림
    if (e.kind === "blShotFx" && ((e.style ?? 0) & 2) && !out.includes("crit")) {
      out.push("crit");
      onShake(2);
    }
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
