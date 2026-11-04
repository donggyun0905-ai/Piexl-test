// 펜리르 효과음: 새로 생긴 펜리르 효과마다 (베기 쉭 · 지면 검기 쏴아 · 뛰어오름 바람 · 내려찍기 쿵 + 크게 흔들림)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { fnBite: "pwSlash", fnCut: "pwSlash", fnWaveGo: "pwWave", fnJump: "pwDash", fnLand: "pwMeteor", fnHalo: "pwUlt" };

export function fenrirSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "fenrir") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    if (e.kind === "fnLand") onShake(6);
  }
}
