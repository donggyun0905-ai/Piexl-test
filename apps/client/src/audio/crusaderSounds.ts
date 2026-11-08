// 크루세이더 효과음: 새로 생긴 크루세이더 효과마다 (들어 올림 · 내려찍기 쿵 + 흔들림 · 돌판 · 돌기둥 · 여진 · 심판의 십자가 + 크게 흔들림 · 성묘 · 돌진 · 들이받기 · 벽 충돌 · 가시 · 발걸음 · 강림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { crLiftFx: "power", crSlamFx: "rumble", crSpikeFx: "clank", crPillarFx: "clank", crAfterFx: "rumble", crJudgeFx: "lxCross", crGraveFx: "chime", crRamFx: "swing", crRamEndFx: "clank", crWallFx: "rumble", crThornFx: "sharp", crAwakeFx: "awaken" };
/** 화면이 흔들리는 큰 효과 (무겁게) */
const SHAKE: Partial<Record<string, number>> = { crSlamFx: 1.8, crPillarFx: 1, crAfterFx: 1.2, crJudgeFx: 3, crRamEndFx: 1.2, crWallFx: 2.2, crStepFx: 0.6, crAwakeFx: 3.5 };

export function crusaderSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "crusader") return;
  let shake = 0;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    shake = Math.max(shake, SHAKE[e.kind] ?? 0);
    const sfx = SFX[e.kind];
    if (sfx && !out.includes(sfx)) out.push(sfx);
  }
  if (shake) onShake(shake);
}
