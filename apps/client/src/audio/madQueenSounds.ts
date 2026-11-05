// 매드퀸 효과음: 새로 생긴 매드퀸 효과마다 (대포 쾅 · 폭발 · 날개 레이저 · 터렛 내려앉음 · 날개 펼침 · 일제사격 + 흔들림 · 번개)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { mqMuzzle: "mqCannon", mqBoom: "pwBurst", mqBeam: "mqLaser", mqDrop: "pwBlink", mqWing: "pwBlink", mqSalvo: "mqSalvo", mqBolt: "zap" };

export function madQueenSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "madQueen") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    if (e.kind === "mqSalvo") onShake(6);
    else if (e.kind === "mqBoom" && e.size >= 28) onShake(3);
  }
}
