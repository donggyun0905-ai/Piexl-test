// 진영 특징 효과음: 새로 생긴 진영 효과마다 (물결 콤보 단계 · 폭주 · 에너지 폭발 · 맹세 지킴·깨짐 · 정령 자람 · 핵심 스킬 각성·빛기둥) · 큰 효과는 화면 흔들림
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = {
  fcTideUp: "twinkle", fcRampage: "power", fcVent: "rumble", fcOathKept: "chime", fcOathBroken: "sharp", fcSpGrow: "rustle", fcSpThorn: "sharp", fcSpBite: "slice", fcSpDive: "power", fcSpStomp: "rumble", fcSpFox: "twinkle", fcSpEat: "pickup", fcSpBox: "coin", fcSpFeather: "slice", fcCoreOn: "awaken", fcCorePillar: "descend",
};
const SHAKE: Partial<Record<string, number>> = { fcRampage: 2, fcVent: 2, fcCorePillar: 2 };

export function factionSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1 || !e.kind.startsWith("fc")) continue;
    const sfx = SFX[e.kind];
    if (!sfx || out.includes(sfx)) continue;
    out.push(sfx);
    const sh = SHAKE[e.kind];
    if (sh) onShake(sh);
  }
}
