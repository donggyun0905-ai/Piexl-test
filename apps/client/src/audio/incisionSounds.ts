// 인시전 효과음: 새로 생긴 인시전 효과마다 (베기 · 교차 · 회오리 + 흔들림 · 돌진 연참 · 도약 뜀 · 착지 + 크게 흔들림 · 광란 각성 + 크게 흔들림 · 도륙 폭발 · 피의 길 · 학살 · 콤보 단계)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { icSlashFx: "slice", icCrossFx: "kgCleave", icWhirlFx: "swing", icRushFx: "swing", icJumpFx: "blink", icLandFx: "rumble", icAwakeFx: "awaken", icBurstFx: "kgPyre", icTrailFx: "slice", icCarnageFx: "hit", icTierFx: "ting" };
/** 화면이 흔들리는 큰 효과 */
const SHAKE: Partial<Record<string, number>> = { icWhirlFx: 0.6, icLandFx: 2.5, icAwakeFx: 3, icBurstFx: 1 };

export function incisionSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "incision") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
