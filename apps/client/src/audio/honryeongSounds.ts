// 혼령 효과음: 연기용 내뿜기 후우 · 소환 연기 · 늑대 물기 · 범 할퀴기 · 부엉이 낙하 · 분신 터짐 · 공포 · 혼-룡(낮은 울음 · 지나가며 짧은 타격음)
import type { RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";

export const HONRYEONG_SOUNDS = {
  hrBreath: () => {
    noise(0.18, 0.14, 1400);
    tone({ type: "sine", from: 420, to: 260, dur: 0.16, vol: 0.05 });
  },
  hrSummon: () => {
    noise(0.2, 0.12, 900);
    [330, 494].forEach((f, i) => tone({ type: "sine", from: f, to: f * 1.2, dur: 0.2, vol: 0.06, delay: i * 0.06 }));
  },
  hrBite: () => {
    noise(0.05, 0.2, 3200);
    tone({ type: "square", from: 300, to: 140, dur: 0.06, vol: 0.05 });
  },
  hrClaw: () => {
    noise(0.1, 0.26, 2400);
    tone({ type: "sawtooth", from: 220, to: 90, dur: 0.12, vol: 0.07 });
  },
  hrDive: () => {
    tone({ type: "sine", from: 900, to: 200, dur: 0.14, vol: 0.08 });
    noise(0.1, 0.22, 1800);
  },
  hrPop: () => {
    tone({ type: "sine", from: 160, to: 50, dur: 0.22, vol: 0.22 });
    noise(0.22, 0.26, 1200);
  },
  hrFear: () => tone({ type: "triangle", from: 700, to: 1100, dur: 0.1, vol: 0.04 }),
  hrDragon: () => {
    tone({ type: "sawtooth", from: 70, to: 150, dur: 1.4, vol: 0.14 });
    tone({ type: "sine", from: 220, to: 440, dur: 1.4, vol: 0.06, delay: 0.1 });
    noise(1.6, 0.16, 700);
  },
  hrDragonHit: () => {
    noise(0.03, 0.1, 2600);
    tone({ type: "triangle", from: 520, to: 380, dur: 0.03, vol: 0.03 });
  },
};

export type HonryeongSfx = keyof typeof HONRYEONG_SOUNDS;

const SFX: Record<string, HonryeongSfx> = { hrBreath: "hrBreath", hrBite: "hrBite", hrClaw: "hrClaw", hrDive: "hrDive", hrPop: "hrPop", hrFear: "hrFear", hrDragonHit: "hrDragonHit" };

export function honryeongSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  const p = run.player;
  if (p.characterId !== "honryeong") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    // 연기 피어오름: 소환·사라질 때만 소리 (구름은 조용히)
    const sfx = e.kind === "hrPuff" ? (e.style === 1 ? "hrSummon" : undefined) : SFX[e.kind];
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "hrPop" || e.kind === "hrClaw") onShake(0.35);
  }
  if (p.hrDragon?.t === 1) {
    if (!out.includes("hrDragon")) out.push("hrDragon");
    onShake(0.7);
  }
}
