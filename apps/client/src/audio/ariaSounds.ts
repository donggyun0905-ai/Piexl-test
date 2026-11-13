// 아리아 효과음: 음표 한 음(종류마다 다른 높이 · 도레미파솔라시도) · 여덟 음표 터짐(화음 + 펑) · 폭죽 · 앙코르 · 작은 북 · 바이올린 활 · 악기 놓임 · 악보 완성 팡파르
import { bell } from "./synth";
import type { RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";

/** 음표 종류마다 음 높이 (도부터 한 옥타브) */
const SCALE = [523, 587, 659, 698, 784, 880, 988, 1047];
const note = (k: number, vol = 0.05, delay = 0) => tone({ type: "triangle", from: SCALE[k & 7]!, to: SCALE[k & 7]!, dur: 0.16, vol, delay });

export const ARIA_SOUNDS = {
  arNote0: () => note(0),
  arNote1: () => note(1),
  arNote2: () => note(2),
  arNote3: () => note(3),
  arNote4: () => note(4),
  arNote5: () => note(5),
  arNote6: () => note(6),
  arNote7: () => note(7),
  arBurst: () => {
    [0, 2, 4, 7].forEach((k, i) => note(k, 0.07, i * 0.04));
    tone({ type: "sine", from: 180, to: 60, dur: 0.3, vol: 0.2 });
    noise(0.35, 0.22, 2200);
  },
  arBoom: () => {
    tone({ type: "sine", from: 140, to: 50, dur: 0.18, vol: 0.12 });
    noise(0.2, 0.16, 3000);
  },
  arEncore: () => {
    [4, 7].forEach((k, i) => note(k, 0.05, i * 0.05));
    noise(0.2, 0.12, 2600);
  },
  arEcho: () => { tone({ type: "sine", from: 120, to: 70, dur: 0.12, vol: 0.14 }); bell(240, 0.25, 0.04, 1.5, 1); },
  arSweep: () => {
    tone({ type: "sawtooth", from: 440, to: 660, dur: 0.22, vol: 0.04 });
    tone({ type: "triangle", from: 880, to: 990, dur: 0.22, vol: 0.03 });
  },
  arPlace: () => [0, 4, 7].forEach((k, i) => note(k, 0.05, i * 0.07)),
  arFinale: () => {
    [0, 2, 4, 7, 4, 7].forEach((k, i) => tone({ type: "square", from: SCALE[k]! / 2, to: SCALE[k]! / 2, dur: 0.18, vol: 0.06, delay: i * 0.11 }));
    tone({ type: "sawtooth", from: 262, to: 262, dur: 0.8, vol: 0.05, delay: 0.66 });
    tone({ type: "triangle", from: 523, to: 523, dur: 0.8, vol: 0.05, delay: 0.66 });
  },
};

export type AriaSfx = keyof typeof ARIA_SOUNDS;

const SFX: Record<string, AriaSfx> = { arBurst: "arBurst", arEncore: "arEncore", arEcho: "arEcho", arSweep: "arSweep", arPlace: "arPlace", arFinale: "arFinale" };

export function ariaSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  const p = run.player;
  if (p.characterId !== "aria") return;
  // 음표를 날린 틱: 마지막 음표 종류의 음
  if (p.arAtkAt === run.tick && p.arNotes?.length) {
    const k = `arNote${p.arNotes[p.arNotes.length - 1]!.kind & 7}` as AriaSfx;
    if (!out.includes(k)) out.push(k);
  }
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "arBurst") onShake(0.5);
    if (e.kind === "arFinale") onShake(0.8);
  }
  // 악보 완성 폭죽: 몇 번에 한 번만 (소리가 너무 겹치지 않게)
  if (p.arBoomAt === run.tick && (p.arFinale ?? 0) % 12 === 0 && !out.includes("arBoom")) {
    out.push("arBoom");
    onShake(0.25);
  }
}
