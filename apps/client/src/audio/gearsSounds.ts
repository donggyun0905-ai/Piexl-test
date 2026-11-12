// 기어스 효과음: 쌍방패 강타 쾅 · 쌍성 방패 큰 쾅 · 연속 방패타 탕탕 · 구체 부딪힘 퉁! · 충격파 우웅 · 보호막·육각 방벽 위잉 · 거울 반격 챙 · 대지 분쇄 쿵 · 방패 던지기 · 천상의 수호자 · 청뢰 폭풍 지직
import type { RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";

export const GEARS_SOUNDS = {
  geSlam: () => {
    noise(0.05, 0.18, 1800);
    tone({ type: "square", from: 520, to: 260, dur: 0.06, vol: 0.05 });
  },
  geTwin: () => {
    noise(0.08, 0.22, 1600);
    tone({ type: "triangle", from: 880, to: 440, dur: 0.12, vol: 0.08 });
  },
  geBarrage: () => [0, 0.05, 0.1, 0.15].forEach((d) => tone({ type: "square", from: 600, to: 300, dur: 0.04, vol: 0.04, delay: d })),
  geBump: () => {
    tone({ type: "sine", from: 260, to: 120, dur: 0.09, vol: 0.14 });
    noise(0.03, 0.1, 2400);
  },
  geWave: () => {
    tone({ type: "sine", from: 160, to: 360, dur: 0.16, vol: 0.08 });
    noise(0.08, 0.08, 1500);
  },
  geGuard: () => {
    tone({ type: "triangle", from: 440, to: 880, dur: 0.4, vol: 0.07 });
    tone({ type: "sine", from: 660, to: 1320, dur: 0.5, vol: 0.05, delay: 0.1 });
  },
  geMirror: () => tone({ type: "triangle", from: 1400, to: 2200, dur: 0.12, vol: 0.07 }),
  geQuake: () => {
    tone({ type: "sine", from: 120, to: 40, dur: 0.25, vol: 0.22 });
    noise(0.12, 0.2, 900);
  },
  geStorm: () => {
    noise(0.3, 0.14, 3800);
    tone({ type: "sawtooth", from: 300, to: 900, dur: 0.3, vol: 0.04 });
  },
  geBoom: () => {
    noise(0.1, 0.16, 2000);
    tone({ type: "sine", from: 300, to: 100, dur: 0.12, vol: 0.1 });
  },
};

export type GearsSfx = keyof typeof GEARS_SOUNDS;

const SFX: Record<string, GearsSfx> = { geSlam: "geSlam", geTwin: "geTwin", geBarrage: "geBarrage", geBump: "geBump", geWave: "geWave", geDome: "geGuard", geHex: "geGuard", geMirror: "geMirror", geQuake: "geQuake", geStorm: "geStorm", geBoom: "geBoom", geRebound: "geBump", geCrystal: "geMirror" };

export function gearsSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  const p = run.player;
  if (p.characterId !== "gears") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "geQuake") onShake(0.3);
    else if (e.kind === "geStorm") onShake(0.4);
  }
  if ((p.geGuardAt ?? -1) === run.tick && !out.includes("geGuard")) out.push("geGuard");
}
