// 이클립스 효과음: 새로 생긴 이클립스 효과마다 (태양 베기 쉭 · 태양 십자 · 일식 베기·회전·돌진 · 뛰어오름 · 내려찍기 쿵 + 크게 흔들림 · 바뀜 외침)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { ecSlash: "pwSlash", ecCross: "pwBurst", ecHew: "pwSlash", ecSpin: "pwWave", ecDash: "pwDash", ecJump: "pwDash", ecSlam: "pwMeteor", ecShift: "pwUlt", ecTotal: "pwBurst" };

export function eclipseSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "eclipse") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    if (e.kind === "ecSlam") onShake(8);
    else if (e.kind === "ecHew" || e.kind === "ecSpin") onShake(2);
  }
}
