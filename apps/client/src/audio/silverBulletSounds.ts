// 실버불렛 효과음: 새로 생긴 실버불렛 효과마다 (총구 불꽃 · 성수 폭탄 + 흔들림 · 연사 시작 · 각성 + 크게 흔들림 · 장애물 넘기 · 은빛 파열)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { sbMuzzleFx: "shot", sbBombFx: "lxShard", sbBarrageFx: "slice", sbAwakeFx: "gbBell", sbVaultFx: "swing", sbBurstFx: "rumble" };
/** 화면이 흔들리는 큰 효과 */
const SHAKE: Partial<Record<string, number>> = { sbBombFx: 1, sbBurstFx: 1.5, sbAwakeFx: 3 };

export function silverBulletSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "silverBullet") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
