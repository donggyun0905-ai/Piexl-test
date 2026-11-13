// 백인장 효과음: 쌍검 베기 · 난무 · 회전참 · 돌진베기 · 날개 폭우 · 드릴 침 · 나선창 · 충격파 · 표식 · 감옥 · 팔연참 · 종언(날개 펼침) · 붉은 십자
import { hiss } from "./synth";
import type { RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";

const slash = (hz: number, vol = 0.14) => {
  noise(0.06, vol, hz);
  tone({ type: "triangle", from: 900, to: 300, dur: 0.07, vol: 0.05 });
};

export const BAEKINJANG_SOUNDS = {
  bjSlash: () => [0, 0.05].forEach((d) => setTimeout(() => slash(3200), d * 1000)),
  bjFlurry: () => [0, 0.04, 0.08, 0.12].forEach((d) => setTimeout(() => slash(3600, 0.1), d * 1000)),
  bjSpin: () => {
    noise(0.22, 0.14, 2400);
    tone({ type: "sine", from: 300, to: 700, dur: 0.22, vol: 0.06 });
  },
  bjDash: () => {
    noise(0.16, 0.2, 4200);
    tone({ type: "sawtooth", from: 1200, to: 200, dur: 0.16, vol: 0.06 });
  },
  bjRain: () => [0, 0.05, 0.1, 0.15, 0.2, 0.25].forEach((d) => setTimeout(() => noise(0.04, 0.1, 4000 + d * 4000), d * 1000)),
  bjNeedle: () => { hiss(0.03, 0.08, { type: "highpass", freq: 6000, attack: 0.002 }); tone({ type: "triangle", from: 1500, to: 900, dur: 0.05, vol: 0.04 }); },
  bjSpear: () => {
    tone({ type: "sawtooth", from: 200, to: 1400, dur: 0.2, vol: 0.08 });
    setTimeout(() => noise(0.18, 0.22, 3000), 80);
  },
  bjShock: () => {
    tone({ type: "sine", from: 180, to: 50, dur: 0.3, vol: 0.24 });
    noise(0.2, 0.2, 1500);
  },
  bjEye: () => {
    tone({ type: "sine", from: 1400, to: 700, dur: 0.12, vol: 0.08 });
    tone({ type: "sine", from: 700, to: 1400, dur: 0.1, vol: 0.06, delay: 0.1 });
  },
  bjPrison: () => {
    [0, 0.06, 0.12].forEach((d) => tone({ type: "square", from: 500, to: 180, dur: 0.08, vol: 0.06, delay: d }));
    setTimeout(() => noise(0.15, 0.14, 1800), 100);
  },
  bjReaper: () => [0, 0.06, 0.12, 0.18, 0.24, 0.3, 0.36, 0.42].forEach((d) => setTimeout(() => noise(0.05, 0.14, 2800 + d * 3000), d * 1000)),
  bjEnd: () => {
    tone({ type: "sawtooth", from: 80, to: 240, dur: 0.8, vol: 0.09 });
    tone({ type: "sine", from: 500, to: 1200, dur: 0.7, vol: 0.06, delay: 0.1 });
  },
  bjCross: () => {
    tone({ type: "sine", from: 200, to: 40, dur: 0.4, vol: 0.28 });
    noise(0.25, 0.26, 2200);
    tone({ type: "triangle", from: 1600, to: 400, dur: 0.3, vol: 0.07 });
  },
};

export type BaekinjangSfx = keyof typeof BAEKINJANG_SOUNDS;

/** 효과가 처음 나온 틱에 소리 (bjLine은 3틱에 한 번만 드릴 소리) */
export function baekinjangSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (run.player.characterId !== "baekinjang") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = (e.kind === "bjLine" || e.kind === "bjDroneHit" ? (run.tick % 3 === 0 ? "bjNeedle" : undefined) : e.kind in BAEKINJANG_SOUNDS ? e.kind : undefined) as BaekinjangSfx | undefined;
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "bjShock" || e.kind === "bjSpear") onShake(0.4);
    else if (e.kind === "bjCross" || e.kind === "bjEnd") onShake(0.6);
  }
}
