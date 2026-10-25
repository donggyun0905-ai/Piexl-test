// 명예의 전당 음악: 웅장하게 올라가는 칩튠 행진곡 (C 장조, C–G–Am–F 진행, 북·스네어·아르페지오·멜로디)
import { musicOut, noise, stopMusic, tone } from "./sound";

/** 16분음표 길이 (약 132 BPM) */
const STEP_MS = 114;
const ROOT = 130.81;
/** 마디마다 화음 뿌리 (반음) · 화음 (뿌리에서 반음) */
const CHORDS = [0, 7, 9, 5];
const TRIAD: Record<number, number[]> = { 0: [0, 4, 7], 7: [0, 4, 7], 9: [0, 3, 7], 5: [0, 4, 7] };
/** 멜로디 (마디마다 16칸, -1은 쉼) — 두 바퀴째는 한 옥타브 위로 */
const MELODY = [
  [24, -1, 24, 26, 28, -1, 31, -1, 28, -1, 26, 24, 26, -1, -1, -1],
  [26, -1, 26, 28, 31, -1, 35, -1, 31, -1, 28, 26, 28, -1, -1, -1],
  [28, -1, 28, 31, 33, -1, 36, -1, 35, -1, 33, 31, 33, -1, 31, -1],
  [29, -1, 33, -1, 36, -1, 35, 33, 31, -1, 29, -1, 31, -1, -1, -1],
];

let timer = 0;
let step = 0;

const hz = (semi: number) => ROOT * 2 ** (semi / 12);

function beat(): void {
  const out = musicOut();
  if (!out) return;
  const bar = Math.floor(step / 16) % 4;
  const lap = Math.floor(step / 64) % 2;
  const i = step % 16;
  const root = CHORDS[bar]!;
  const triad = TRIAD[root]!;
  // 북: 박마다 · 스네어: 2·4박 · 하이햇: 8분음표
  if (i % 4 === 0) tone({ type: "sine", from: 150, to: 45, dur: 0.12, vol: 0.7 }, out);
  if (i % 8 === 4) noise(0.1, 0.35, 4000, out);
  if (i % 2 === 0) noise(0.03, 0.08, 9000, out);
  // 베이스: 8분음표로 뿌리음·옥타브
  if (i % 2 === 0) tone({ type: "triangle", from: hz(root - 12 + (i % 4 === 2 ? 12 : 0)), dur: 0.2, vol: 0.45 }, out);
  // 아르페지오: 16분음표로 화음을 오르내림
  const arp = [0, 1, 2, 1][i % 4]!;
  tone({ type: "square", from: hz(root + 12 + triad[arp]!), dur: 0.08, vol: 0.05 }, out);
  // 멜로디 (두 바퀴째는 위로, 끝 음은 길게)
  const note = MELODY[bar]![i]!;
  if (note >= 0) {
    const long = MELODY[bar]![i + 1] === -1 && MELODY[bar]![i + 2] === -1;
    tone({ type: "square", from: hz(note + lap * 12 - 12), dur: long ? 0.42 : 0.16, vol: 0.13 }, out);
    tone({ type: "sawtooth", from: hz(note + lap * 12 - 12) * 1.004, dur: long ? 0.42 : 0.16, vol: 0.04 }, out);
  }
  // 네 마디가 끝날 때 심벌
  if (i === 0 && bar === 0) noise(0.6, 0.2, 7000, out);
  step++;
}

export function startHallMusic(): void {
  stopMusic();
  if (timer) return;
  step = 0;
  timer = window.setInterval(beat, STEP_MS);
}

export function stopHallMusic(): void {
  clearInterval(timer);
  timer = 0;
}
