// 아슈바르 효과음 (느아르·루주·블뢰·존·마젠타·베르·블랑 같이 씀, 루주는 장미 피어남·불꽃 · 블뢰는 얼음 소리·결정탄 · 존은 번개 지직·낙뢰 더함 · 마젠타는 장미 피어남을 같이 씀): 검은 베기 쉭 · 난무·회전참 사각사각 · 빨아들임 우웅 · 터짐 쾅 · 낙인 창 푹 · 흑월 강림·태초의 종언 쿠웅 · 충격파 · 레벨업 · 강화 성공·실패 · 승격
import { crackle, hiss, wobble } from "./synth";
import { isAshvar, type RunState } from "@pixel-rogue/shared";
import { noise, tone, type Sfx } from "./sound";

export const NOIR_SOUNDS = {
  nrSlash: () => {
    noise(0.07, 0.16, 2600);
    tone({ type: "sawtooth", from: 420, to: 120, dur: 0.1, vol: 0.04 });
  },
  nrMulti: () => {
    noise(0.12, 0.08, 3200);
    [0, 0.05, 0.1].forEach((d) => tone({ type: "sawtooth", from: 700, to: 250, dur: 0.04, vol: 0.03, delay: d }));
  },
  nrPull: () => { wobble("sine", 90, 220, 0.35, 0.1, 10, 10); hiss(0.35, 0.06, { type: "lowpass", freq: 300, to: 1800, attack: 0.15 }); },
  nrBurst: () => {
    noise(0.12, 0.2, 1400);
    tone({ type: "sine", from: 220, to: 60, dur: 0.18, vol: 0.14 });
  },
  nrSpear: () => {
    tone({ type: "square", from: 900, to: 200, dur: 0.08, vol: 0.06 });
    noise(0.06, 0.18, 2000);
  },
  nrUlt: () => {
    tone({ type: "sine", from: 140, to: 30, dur: 0.6, vol: 0.24 });
    noise(0.4, 0.2, 700);
  },
  nrWave: () => { hiss(0.3, 0.08, { freq: 400, to: 1600, q: 1.5, attack: 0.05 }); tone({ type: "triangle", from: 260, to: 520, dur: 0.3, vol: 0.05 }); },
  nrLevel: () => [0, 0.08, 0.16].forEach((d, i) => tone({ type: "triangle", from: 330 * (i + 2), to: 330 * (i + 2), dur: 0.08, vol: 0.06, delay: d })),
  nrUpOk: () => [0, 0.07, 0.14, 0.21].forEach((d, i) => tone({ type: "square", from: 440 + i * 140, to: 440 + i * 140, dur: 0.07, vol: 0.05, delay: d })),
  nrUpFail: () => { tone({ type: "sawtooth", from: 300, to: 120, dur: 0.25, vol: 0.05 }); crackle(0.15, 5, 0.12, 2500); tone({ type: "sine", from: 90, to: 50, dur: 0.15, vol: 0.12, delay: 0.05 }); },
  rgBloom: () => [0, 0.05].forEach((d, i) => tone({ type: "triangle", from: 880 + i * 220, to: 1320 + i * 220, dur: 0.12, vol: 0.04, delay: d })),
  rgFire: () => {
    noise(0.25, 0.14, 900);
    tone({ type: "sawtooth", from: 180, to: 70, dur: 0.3, vol: 0.06 });
  },
  buIce: () => [0, 0.04, 0.09].forEach((d, i) => tone({ type: "sine", from: 1600 + i * 400, to: 2400 + i * 300, dur: 0.1, vol: 0.035, delay: d })),
  jnZap: () => crackle(0.12, 6, 0.08, 3800),
  jnBolt: () => {
    crackle(0.2, 10, 0.14, 2600);
    tone({ type: "square", from: 1400, to: 180, dur: 0.18, vol: 0.05 });
  },
  buShot: () => {
    hiss(0.18, 0.06, { freq: 3000, to: 1200, q: 2, attack: 0.02 });
    tone({ type: "triangle", from: 1200, to: 500, dur: 0.15, vol: 0.04 });
  },
  nrRankUp: () => {
    tone({ type: "sawtooth", from: 110, to: 440, dur: 0.6, vol: 0.08 });
    tone({ type: "sine", from: 220, to: 880, dur: 0.7, vol: 0.06, delay: 0.15 });
  },
};

export type NoirSfx = keyof typeof NOIR_SOUNDS;

const SFX: Record<string, NoirSfx> = {
  nrSlash: "nrSlash", nrRush: "nrSlash", nrFlurry: "nrMulti", nrSpin: "nrMulti", nrRift: "nrMulti",
  nrSever: "nrPull", nrSqueeze: "nrPull", nrDrain: "nrPull", nrDevour: "nrPull", nrOrigin: "nrPull", nrBarrier: "nrPull", nrAbyss: "nrPull", nrGrasp: "nrPull",
  nrBurst: "nrBurst", nrSpear: "nrSpear", nrBrand: "nrSpear", nrMoon: "nrUlt", nrEnd: "nrUlt", nrWave: "nrWave",
  nrLevel: "nrLevel", nrUpOk: "nrUpOk", nrUpFail: "nrUpFail", nrRankUp: "nrRankUp",
  rgX: "nrSlash", rgRush: "nrSlash", rgThorn: "nrSlash", rgMoon: "nrSlash", rgFlame: "nrMulti", rgSpin: "nrMulti", rgPetal: "nrMulti", rgForest: "nrMulti", rgDance: "nrMulti",
  buBolt: "buShot", buWave: "buIce", buBurst: "buIce", buWall: "buIce", buWolf: "nrSlash", buHawk: "nrSlash", buDeer: "buIce", buLegion: "nrUlt",
  buField: "nrPull", buClock: "nrMulti", buHowl: "nrUlt", buZero: "nrPull", buPrison: "nrMulti", buStop: "nrUlt", buEnd: "nrUlt", buRain: "nrMulti", buPop: "nrBurst",
  jnClaw: "jnZap", jnFlash: "jnBolt", jnRapid: "jnZap", jnFist: "jnBolt", jnZig: "jnBolt", jnFall: "jnBolt", jnClone: "jnZap", jnBind: "nrPull",
  jnOrb: "jnBolt", jnChaos: "nrMulti", jnHand: "nrPull", jnStep: "nrUlt", jnFrenzy: "jnBolt", jnBeam: "nrUlt", jnThousand: "nrMulti", jnEnd: "nrUlt", jnPop: "nrBurst", jnZap: "jnZap",
  mzRain: "rgBloom", mzBloom: "rgBloom", mzWave: "nrSlash", mzPollen: "nrPull", mzGaze: "nrSpear", mzClone: "nrMulti", mzVolcano: "nrBurst", mzBrand: "nrSpear",
  mzPrison: "nrPull", mzGarden: "rgBloom", mzVortex: "nrPull", mzErode: "nrUlt", mzCollapse: "nrBurst", mzSoul: "nrPull", mzStorm: "nrMulti", mzEnd: "nrUlt", mzPop: "nrBurst",
  vtSlash: "nrSlash", vtSpin: "nrMulti", vtFrenzy: "nrMulti", vtWhip: "nrSpear", vtSeed: "rgBloom", vtBloom: "rgBloom", vtDrain: "nrPull", vtWither: "rgBloom",
  vtGarden: "rgBloom", vtForest: "nrBurst", vtErode: "nrPull", vtPrison: "nrUlt", vtThrall: "nrPull", vtMaw: "nrSpear", vtDance: "nrMulti", vtEnd: "nrUlt", vtPop: "nrBurst", vtSprout: "rgBloom",
  bcFan: "nrSlash", bcBless: "nrPull", bcPuppet: "nrMulti", bcMirror: "nrMulti", bcRift: "nrSpear", bcSeize: "nrPull", bcCrusade: "nrMulti", bcPhantom: "rgBloom",
  bcWhisper: "nrPull", bcParadox: "nrMulti", bcWings: "nrMulti", bcTransfer: "nrPull", bcRedeem: "nrPull", bcSanctum: "nrUlt", bcEyes: "nrUlt", bcEnd: "nrUlt", bcExit: "nrBurst", bcReflect: "nrSpear",
  rgBloom: "rgBloom", rgBloomBig: "rgBloom", rgFuneral: "nrPull", rgMark: "nrSpear", rgMarkBoom: "nrBurst", rgBurst: "nrBurst", rgBlaze: "rgFire", rgRain: "nrUlt", rgEnd: "nrUlt",
};

export function noirSounds(run: RunState, out: Sfx[], onShake: (power: number) => void): void {
  if (!isAshvar(run.player)) return;
  for (const e of run.effects) {
    if (e.ticks < e.maxTicks - 1) continue;
    const sfx = SFX[e.kind];
    if (sfx && !out.includes(sfx)) out.push(sfx);
    if (e.kind === "nrMoon" || e.kind === "nrEnd" || e.kind === "rgRain" || e.kind === "rgEnd" || e.kind === "buStop" || e.kind === "buEnd" || e.kind === "jnStep" || e.kind === "jnEnd" || e.kind === "mzErode" || e.kind === "mzEnd" || e.kind === "vtPrison" || e.kind === "vtEnd" || e.kind === "bcSanctum" || e.kind === "bcEnd") onShake(0.5);
    else if (e.kind === "nrBurst" || e.kind === "nrSpear" || e.kind === "rgBurst" || e.kind === "rgMarkBoom") onShake(0.2);
  }
}
