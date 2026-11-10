// 조커 효과음: 카드가 벽에 튕김 · 폭죽 · 뽑은 카드가 뒤집힘(달·붉은 일식·세계수) · 달의 힘 · 차원 균열
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { jkBounce: "slice", jkFirework: "power", jkTree: "chime", jkMoon: "blink", jkRift: "katana" };
/** 뒤집힌 카드마다 (0 달 · 1 붉은 일식 · 2 세계수) */
const REVEAL: Sfx[] = ["awaken", "power", "chime"];

export function jokerSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "joker") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = e.kind === "jkReveal" ? REVEAL[e.style ?? 0] : SFX[e.kind];
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "jkReveal" || e.kind === "jkFirework") onShake(e.kind === "jkReveal" ? 1.5 : 0.8);
  }
}
