// 루나틱 효과음: 새로 생긴 루나틱 효과마다 (찌르기 · 달빛 베기 + 흔들림 · 대시 찌르기 · 만월 각성 + 크게 흔들림 · 초승달 회전 베기 · 초승달 비 · 잔상 찌르기 · 표적 생김)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { lnThrustFx: "slice", lnSlashFx: "gbBell", lnDashFx: "swing", lnAwakeFx: "awaken", lnCrescentFx: "swing", lnRainFx: "chime", lnAfterFx: "slice", lnMarkFx: "string" };
/** 화면이 흔들리는 큰 효과 */
const SHAKE: Partial<Record<string, number>> = { lnSlashFx: 0.8, lnAwakeFx: 3 };

export function lunaticSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "lunatic") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
