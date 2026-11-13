// 빙설 효과음: 얼음 베기 쨍 · 찌르기 · 얼음 터짐 · 빙각 솟음 · 활 세움 · 결정이 탄 막음 · 궁극기(기 모으기 웅 · 60연타 짧은 쨍 · 발사)
import { bell, crackle } from "./synth";
import { BINGSEOL_PERKS, type RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";

export const BINGSEOL_SOUNDS = {
  bsSlash: () => {
    noise(0.06, 0.18, 7200);
    tone({ type: "triangle", from: 2400, to: 1300, dur: 0.07, vol: 0.05 });
  },
  bsThrust: () => {
    noise(0.05, 0.2, 5200);
    tone({ type: "sine", from: 1800, to: 2600, dur: 0.06, vol: 0.05 });
  },
  bsBurst: () => {
    noise(0.12, 0.22, 4800);
    [1760, 2350].forEach((f, i) => tone({ type: "sine", from: f, to: f * 0.7, dur: 0.16, vol: 0.05, delay: i * 0.03 }));
  },
  bsSpike: () => {
    tone({ type: "sine", from: 180, to: 60, dur: 0.2, vol: 0.25 });
    noise(0.14, 0.28, 3600);
    tone({ type: "triangle", from: 2600, to: 1800, dur: 0.1, vol: 0.05, delay: 0.03 });
  },
  bsBowSet: () => [988, 1480].forEach((f, i) => tone({ type: "sine", from: f, dur: 0.22, vol: 0.07, delay: i * 0.05 })),
  bsBlock: () => { bell(3200, 0.1, 0.05, 2.76, 1); crackle(0.04, 3, 0.1, 7000); },
  bsUltCharge: () => {
    tone({ type: "sine", from: 220, to: 660, dur: 1.2, vol: 0.12 });
    tone({ type: "triangle", from: 880, to: 1760, dur: 1.2, vol: 0.04, delay: 0.2 });
  },
  bsUltFire: () => {
    noise(0.3, 0.3, 6000);
    tone({ type: "sine", from: 1400, to: 300, dur: 0.35, vol: 0.12 });
  },
  bsUltHit: () => {
    noise(0.03, 0.12, 8000);
    tone({ type: "triangle", from: 3000, to: 2200, dur: 0.03, vol: 0.04 });
  },
};

export type BingseolSfx = keyof typeof BINGSEOL_SOUNDS;

const SFX: Record<string, BingseolSfx> = { bsSlash: "bsSlash", bsSpin: "bsSlash", bsThrust: "bsThrust", bsBurst: "bsBurst", bsWallHit: "bsBurst", bsSpike: "bsSpike", bsBowSet: "bsBowSet", bsBlock: "bsBlock", bsUltHit: "bsUltHit" };

export function bingseolSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  const p = run.player;
  if (p.characterId !== "bingseol") return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "bsSpike") onShake(0.4);
    else if (e.kind === "bsUltHit") onShake(0.3);
  }
  const u = p.bsUlt;
  if (u?.t === 1 && !out.includes("bsUltCharge")) out.push("bsUltCharge");
  if (u?.t === BINGSEOL_PERKS.bsUlt.charge) {
    if (!out.includes("bsUltFire")) out.push("bsUltFire");
    onShake(0.6);
  }
}
