// 세계 지도 효과음 (파일 없이 합성): 발밑 땅에 따른 발소리 · 문 열기·들어가기·나가기·순간 이동·표지판·말 걸기 · 나라마다 환경음(바람·파도·새·용암·비·기계)
// 환경음은 매 장면 부르면 정해진 때마다 짧게 부풀었다 꺼지는 소리를 겹쳐 이어지게 함 (소리용이라 브라우저 랜덤)
import { bell, crackle, hiss, wobble } from "./synth";
import { noise, sfxOn, tone } from "./sound";

/** 발소리 재질 */
type Mat = "grass" | "snow" | "metal" | "wood" | "stone" | "sand" | "ice" | "soft" | "water";
/** 땅 그림 이름 → 재질 (나라마다 바꿔 끼운 그림 이름으로 고름) */
const MAT: Record<string, Mat> = {
  grass: "grass", garden: "grass", field: "grass", forestFloor: "soft", moss: "soft", leafPath: "soft", petalPath: "soft", bambooGround: "soft", kelpBed: "soft", ash: "soft",
  snow: "snow", deepSnow: "snow", frozenMud: "snow", ice: "ice",
  metalFloor: "metal", metalFloorIn: "metal", grate: "metal", railTrack: "metal", neonTile: "metal",
  woodFloor: "wood", bridge: "wood", dockPlank: "wood", tavernWood: "wood",
  sand: "sand", dune: "sand", beach: "sand", gravel: "sand", cracked: "sand", path: "sand", yard: "sand", seabed: "sand", coral: "soft", pearlRoad: "stone", trench: "soft",
  spring: "water", stream: "water", oasis: "water",
};
const matOf = (tex: string | undefined): Mat => (tex && MAT[tex]) || "stone";

let flip = false;
/** 한 걸음 (tex = 발밑 땅 그림 이름) */
export function footstep(tex: string | undefined): void {
  if (!sfxOn()) return;
  flip = !flip;
  const k = flip ? 1 : 0.88;
  switch (matOf(tex)) {
    case "grass":
      hiss(0.09, 0.05, { type: "bandpass", freq: 2600 * k, q: 0.8, attack: 0.01 });
      break;
    case "soft":
      hiss(0.08, 0.05, { type: "lowpass", freq: 900 * k, attack: 0.008 });
      break;
    case "snow":
      // 뽀드득: 낮은 잡음 + 잔 딸깍
      hiss(0.14, 0.06, { type: "lowpass", freq: 1400 * k, to: 700, attack: 0.02 });
      crackle(0.1, 4, 0.025, 2200 * k);
      break;
    case "ice":
      tone({ type: "sine", from: 2400 * k, to: 1900, dur: 0.05, vol: 0.02 });
      hiss(0.05, 0.03, { type: "highpass", freq: 4000, attack: 0.003 });
      break;
    case "metal":
      bell(520 * k, 0.12, 0.025, 2.76, 1.5);
      noise(0.03, 0.05, 3000);
      break;
    case "wood":
      tone({ type: "triangle", from: 180 * k, to: 120, dur: 0.07, vol: 0.09 });
      noise(0.02, 0.04, 1200);
      break;
    case "sand":
      hiss(0.11, 0.045, { type: "bandpass", freq: 1500 * k, q: 0.6, attack: 0.015 });
      break;
    case "water":
      hiss(0.12, 0.05, { type: "bandpass", freq: 900 * k, to: 1800, q: 2, attack: 0.01 });
      break;
    default:
      // 돌: 짧고 단단한 "탁"
      noise(0.025, 0.07, 2200 * k);
      tone({ type: "triangle", from: 260 * k, to: 200, dur: 0.03, vol: 0.04 });
  }
}

/** 문·장소 소리 */
export type WorldSfx = "door" | "exit" | "warp" | "read" | "talk" | "locked" | "pass";
export function worldSfx(s: WorldSfx): void {
  if (!sfxOn()) return;
  if (s === "door") {
    // 삐걱 열리는 문 + 발 들이는 바람
    wobble("sawtooth", 240, 330, 0.35, 0.03, 18, 12);
    tone({ type: "triangle", from: 110, to: 80, dur: 0.12, vol: 0.12, delay: 0.32 });
    hiss(0.5, 0.05, { type: "bandpass", freq: 600, to: 1600, attack: 0.15, delay: 0.1 });
  } else if (s === "exit") {
    tone({ type: "triangle", from: 120, to: 80, dur: 0.1, vol: 0.1 });
    hiss(0.45, 0.06, { type: "bandpass", freq: 1600, to: 500, attack: 0.1 });
  } else if (s === "warp") {
    for (const [i, f] of [523, 784, 1047, 1568].entries()) bell(f, 0.6, 0.03, 1.5, 1.2, i * 0.06);
    hiss(0.7, 0.05, { type: "bandpass", freq: 800, to: 5000, attack: 0.3 });
  } else if (s === "read") {
    hiss(0.12, 0.05, { type: "highpass", freq: 3000, to: 5000, attack: 0.02 });
  } else if (s === "talk") {
    tone({ type: "square", from: 660, dur: 0.05, vol: 0.03 });
    tone({ type: "square", from: 880, dur: 0.05, vol: 0.03, delay: 0.06 });
  } else if (s === "locked") {
    noise(0.05, 0.12, 900);
    tone({ type: "square", from: 140, to: 110, dur: 0.12, vol: 0.06, delay: 0.04 });
  } else {
    hiss(0.8, 0.06, { type: "bandpass", freq: 500, to: 1200, attack: 0.3 });
  }
}

/** 환경음 종류 */
type Amb = "wind" | "storm" | "sea" | "forest" | "lava" | "rain" | "deep" | "city" | "holy" | "indoor" | "breeze";
const AMB: Record<string, Amb> = {
  ascalon: "breeze", terracore: "city", virdia: "forest", helios: "breeze", desert: "wind", silber: "storm", thalassia: "sea",
  hell: "lava", undersea: "deep", cyber: "rain", windtown: "wind", seongguk: "holy",
};
let next = 0;
/** 매 장면: 지금 지역 환경음 (now = 초, 장면 시계) · 건물 안은 낮은 실내 울림과 가끔 불 타닥 */
export function ambient(regionId: string, indoor: boolean, now: number): void {
  if (!sfxOn() || now < next) return;
  const a: Amb = indoor ? "indoor" : (AMB[regionId] ?? "breeze");
  next = now + 1.6;
  const r = Math.random();
  switch (a) {
    case "breeze":
      hiss(3.4, 0.012, { type: "bandpass", freq: 500 + r * 300, q: 0.7, attack: 1.4 });
      if (r < 0.35) for (let i = 0; i < 3; i++) tone({ type: "sine", from: 3000 + r * 900, to: 3600, dur: 0.06, vol: 0.012, delay: i * 0.11 });
      break;
    case "wind":
    case "storm":
      hiss(3.4, a === "storm" ? 0.035 : 0.022, { type: "bandpass", freq: 400 + r * 500, to: 300 + r * 900, q: 1.2, attack: 1.3 });
      break;
    case "forest":
      hiss(3.4, 0.01, { type: "bandpass", freq: 700, q: 0.6, attack: 1.4 });
      if (r < 0.5) for (let i = 0; i < 2 + Math.floor(r * 6); i++) tone({ type: "sine", from: 2600 + r * 1600, to: 3400 + r * 800, dur: 0.07, vol: 0.014, delay: i * 0.13 });
      break;
    case "sea":
      hiss(3.6, 0.035, { type: "lowpass", freq: 500 + r * 300, attack: 1.6 });
      if (r < 0.3) tone({ type: "sine", from: 1300, to: 900, dur: 0.25, vol: 0.012 });
      break;
    case "lava":
      hiss(3.4, 0.03, { type: "lowpass", freq: 180, attack: 1.2 });
      crackle(1.5, 3, 0.02, 1400);
      break;
    case "deep":
      hiss(3.4, 0.02, { type: "lowpass", freq: 300, attack: 1.4 });
      for (let i = 0; i < 2; i++) tone({ type: "sine", from: 500 + r * 400, to: 900 + r * 400, dur: 0.08, vol: 0.02, delay: i * (0.2 + r * 0.4) });
      break;
    case "rain":
      hiss(3.4, 0.03, { type: "highpass", freq: 3500, attack: 1.2 });
      tone({ type: "sine", from: 55, dur: 1.8, vol: 0.02 });
      break;
    case "city":
      tone({ type: "triangle", from: 70, dur: 1.8, vol: 0.02 });
      if (r < 0.4) bell(300 + r * 300, 0.2, 0.012, 2.76, 1);
      break;
    case "holy":
      hiss(3.4, 0.008, { type: "bandpass", freq: 900, q: 0.6, attack: 1.5 });
      if (r < 0.12) bell(392, 2.5, 0.015, 2, 1.5);
      break;
    case "indoor":
      tone({ type: "sine", from: 60, dur: 1.8, vol: 0.012 });
      if (r < 0.4) crackle(1.2, 3, 0.012, 1800);
  }
}
