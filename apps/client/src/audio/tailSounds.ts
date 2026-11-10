// 테일 효과음: 새로 생긴 테일 효과마다 (꼬리 쉭 · 내려치기 쿵 · 상어 첨벙 · 삼키기·씹기 콱 · 낙하 쿵 + 흔들림 · 번개 · 변신 돌진 바람)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { tlDown: "pwSlash", tlUp: "pwSlash", tlSmash: "pwBurst", tlLeap: "tlSplash", tlSplash: "pwWave", tlMaw: "tlChomp", tlSlam: "pwMeteor", tlBolt: "zap", tlMorph: "pwDash", tlChomp: "tlChomp" };

export function tailSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "tail") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    if (!sfx || e.ticks < e.maxTicks - 1 || out.includes(sfx)) continue;
    out.push(sfx);
    if (e.kind === "tlSlam") onShake(5);
    else if (e.kind === "tlChomp") onShake(4);
    else if (e.kind === "tlSmash" || e.kind === "tlMaw") onShake(2);
  }
}
