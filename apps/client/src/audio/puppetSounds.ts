// 인형술사 효과음: 실 내리치기 · 왕관 씌움 · 미니 인형 터짐 · 시체 인형·검은 실 터짐(흔들림) · 분신 · 인형 친구 내려찍기
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Record<string, Sfx> = { ppStrike: "blink", ppCrown: "chime", ppDollPop: "blink", ppCorpsePop: "power", ppBlackPop: "power", ppClone: "chime", ppSlam: "power" };

export function puppetSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "puppeteer") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "ppCorpsePop" || e.kind === "ppBlackPop") onShake(0.8);
  }
}
