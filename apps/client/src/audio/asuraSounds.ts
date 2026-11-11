// 아수라 효과음: 주먹 퍽 · 연속 펀치 따다닥 · 파동 우웅 · 악귀 붉게 터짐 · 각성(낮게 울리는 기합) · 각성 1·2타 · 3타 바닥 강타 쿵 · 4타 큰 쿵
import type { RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";

export const ASURA_SOUNDS = {
  asPunch: () => {
    noise(0.05, 0.2, 2200);
    tone({ type: "sine", from: 220, to: 110, dur: 0.07, vol: 0.12 });
  },
  asRapid: () => [0, 0.04, 0.08, 0.12].forEach((d) => noise(0.03, 0.12, 2600 + d * 4000)),
  asWave: () => {
    tone({ type: "sine", from: 140, to: 320, dur: 0.18, vol: 0.08 });
    noise(0.1, 0.1, 1400);
  },
  asDemon: () => {
    noise(0.07, 0.14, 3400);
    tone({ type: "sawtooth", from: 300, to: 120, dur: 0.08, vol: 0.04 });
  },
  asAwake: () => {
    tone({ type: "sawtooth", from: 90, to: 180, dur: 0.6, vol: 0.08 });
    tone({ type: "sine", from: 440, to: 880, dur: 0.5, vol: 0.06, delay: 0.1 });
  },
  asAwk12: () => {
    noise(0.07, 0.24, 2000);
    tone({ type: "sine", from: 260, to: 90, dur: 0.1, vol: 0.15 });
  },
  asAwk3: () => {
    tone({ type: "sine", from: 120, to: 45, dur: 0.14, vol: 0.22 });
    noise(0.08, 0.2, 1200);
  },
  asAwk4: () => {
    tone({ type: "sine", from: 160, to: 35, dur: 0.35, vol: 0.3 });
    noise(0.2, 0.3, 1600);
  },
};

export type AsuraSfx = keyof typeof ASURA_SOUNDS;

const SFX: Record<string, AsuraSfx> = { asPunch: "asPunch", asRapid: "asRapid", asWave: "asWave", asDemon: "asDemon", asAwk12: "asAwk12", asAwk3: "asAwk3", asAwk4: "asAwk4", asFistHit: "asPunch" };

export function asuraSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  const p = run.player;
  if (p.characterId !== "asura") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "asAwk3") onShake(0.3);
    else if (e.kind === "asAwk4") onShake(0.6);
  }
  if ((p.asAwakeAt ?? -1) === run.tick && !out.includes("asAwake")) out.push("asAwake");
}
