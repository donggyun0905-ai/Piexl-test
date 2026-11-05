// 훅 효과음: 새로 생긴 훅 효과마다 (산탄 쾅 · 둘째 총열 · 갈고리 걸림 철컥 · 난파 쿵 + 흔들림 · 밧줄 착지 첨벙 · 번개)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { hkBlast: "hkShotgun", hkTap: "hkShotgun", hkGrab: "hkClank", hkWreck: "pwBurst", hkLand: "tlSplash", hkBolt: "zap" };

export function hookSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "hook") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    if (e.kind === "hkBlast") onShake(4);
    else if (e.kind === "hkWreck") onShake(3);
  }
}
