// 백령 효과음: 대태도 베기 쉭 · 유령팔 참격 휘잉 · 망령 우우 · 소용돌이 · 대태도 쾅 · 번개 · 혼불 · 영혼 게이지 한 칸 참(맑은 종)
import type { RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";

/** 마지막으로 소리를 낸 유령팔 베기 틱 */
let armAt = -1;

export const BAEK_SOUNDS = {
  bySlash: () => {
    noise(0.07, 0.22, 5200);
    tone({ type: "triangle", from: 1600, to: 500, dur: 0.07, vol: 0.06 });
  },
  byArm: () => {
    noise(0.16, 0.2, 2600);
    tone({ type: "sine", from: 420, to: 1100, dur: 0.18, vol: 0.08 });
    tone({ type: "sine", from: 880, to: 1320, dur: 0.22, vol: 0.04, delay: 0.04 });
  },
  byWhirl: () => {
    noise(0.05, 0.16, 6400);
    tone({ type: "triangle", from: 2200, to: 1400, dur: 0.05, vol: 0.05 });
  },
  byGreat: () => {
    tone({ type: "sine", from: 120, to: 40, dur: 0.3, vol: 0.4 });
    noise(0.25, 0.32, 1200);
    tone({ type: "triangle", from: 1800, to: 900, dur: 0.12, vol: 0.06 });
  },
  byBolt: () => {
    noise(0.08, 0.25, 7000);
    tone({ type: "square", from: 1200, to: 300, dur: 0.06, vol: 0.06 });
  },
  byStep: () => {
    tone({ type: "sine", from: 300, to: 900, dur: 0.12, vol: 0.12 });
    noise(0.12, 0.2, 2000);
  },
  byWisp: () => tone({ type: "sine", from: 900, to: 1500, dur: 0.1, vol: 0.06 }),
  byLevel: () => {
    [988, 1319, 1976].forEach((f, i) => tone({ type: "sine", from: f, dur: 0.35, vol: 0.1, delay: i * 0.06 }));
  },
};

export type BaekSfx = keyof typeof BAEK_SOUNDS;

const SFX: Record<string, BaekSfx> = { bySlash: "bySlash", byWhirl: "byWhirl", byGreat: "byGreat", byBolt: "byBolt", byStep: "byStep", byWisp: "byWisp", byLevel: "byLevel" };

export function baekSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  const p = run.player;
  if (p.characterId !== "baekryeong") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "byGreat" && e.style !== 1) onShake(0.8);
    else if (e.kind === "byStep") onShake(0.4);
  }
  if (p.byArmAt !== undefined && p.byArmAt === run.tick && armAt !== run.tick) {
    armAt = run.tick;
    if (!out.includes("byArm")) out.push("byArm");
  }
}
