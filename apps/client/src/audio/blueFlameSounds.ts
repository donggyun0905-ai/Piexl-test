// 블루 플레임 효과음: 새로 생긴 블루 플레임 효과마다 (활 쏘기 · 불꽃 감옥 · 불꽃 기둥 · 화살 박힘 · 각성 폭격 + 흔들림 · 각성 시작 + 크게 흔들림 · 날개 · 화살비)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { bzBowFx: "twang", bzPrisonFx: "power", bzPillarFx: "zap", bzArrowFx: "hit", bzBombFx: "rumble", bzAwakeFx: "awaken", bzWingFx: "chime", bzRainFx: "string" };
/** 화면이 흔들리는 큰 효과 */
const SHAKE: Partial<Record<string, number>> = { bzPillarFx: 0.6, bzBombFx: 2, bzAwakeFx: 3 };

export function blueFlameSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "blueFlame") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
