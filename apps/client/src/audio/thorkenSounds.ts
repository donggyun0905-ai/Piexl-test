// 토르켄 효과음: 새로 생긴 토르켄 효과마다 (닻 휘두르기 물살 · 던지기 쇠사슬 · 천둥 번쩍 + 흔들림 · 태풍 바람 · 물결 · 물기둥 · 종)
import type { RunState } from "@pixel-rogue/shared";
import type { Sfx } from "./sound";

const SFX: Partial<Record<string, Sfx>> = { tkAnchor: "pwWave", tkThrow: "clank", tkClap: "zap", tkStormCall: "tempest", tkBolt: "zap", tkTide: "pwWave", tkGeyser: "pwBurst", tkBell: "chime", tkReel: "spool" };

export function thorkenSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "thorken") return;
  for (const e of run.effects) {
    const sfx = SFX[e.kind];
    // 하늘 번개는 내리꽂히는 순간 (예고 뒤)
    const born = e.kind === "tkBolt" ? e.ticks === 16 : e.ticks >= e.maxTicks - 1;
    if (!sfx || !born || out.includes(sfx)) continue;
    out.push(sfx);
    if (e.kind === "tkClap" || e.kind === "tkBolt") onShake(4);
    else if (e.kind === "tkStormCall") onShake(7);
    else if (e.kind === "tkAnchor") onShake(1.5);
  }
}
