// 제단의 방 소리: 성좌가 나타남(맑은 종 + 낮은 울림) · 카드를 고름(성좌의 화음) · 노여움(낮은 굉음)
// 성좌마다 곡: 바다(웅장·느림) · 화산(묵직한 북) · 하늘(빠르고 신남) · 바람(아름다운 흐름) · 빛과 어둠(웅장한 합창) · 그린우드(평화로운 피리) · 마녀(신비로운 소용돌이) · ???(으스스한 어긋남)
import type { AltarId } from "@pixel-rogue/shared";
import { musicOut, noise, tone } from "./sound";

export const ALTAR_SOUNDS = {
  altarAppear: () => {
    tone({ type: "sine", from: 60, to: 40, dur: 1.2, vol: 0.4 });
    for (const [i, f] of [523, 784, 1047, 1568].entries()) tone({ type: "triangle", from: f, dur: 1.2, vol: 0.06, delay: 0.1 + i * 0.12 });
  },
  altarChoose: () => {
    for (const [i, f] of [392, 494, 587, 784, 988].entries()) tone({ type: "triangle", from: f, dur: 0.9, vol: 0.08, delay: i * 0.06 });
    tone({ type: "sine", from: 98, dur: 1.2, vol: 0.35 });
    noise(0.6, 0.08, 5000);
  },
  altarWrath: () => {
    tone({ type: "sawtooth", from: 110, to: 40, dur: 1, vol: 0.18 });
    tone({ type: "sine", from: 50, to: 30, dur: 1.2, vol: 0.5 });
    noise(0.8, 0.3, 300);
  },
};
export type AltarSfx = keyof typeof ALTAR_SOUNDS;

/** 곡 한 벌: 박 길이(ms) · 으뜸음(Hz) · 음계(반음) · 가락 차례 · 가락 소리 · 북 박자 · 긴 화음 소리 · 살짝 어긋남(으스스) */
export interface Song {
  ms: number;
  root: number;
  scale: readonly number[];
  melody: readonly number[];
  lead: OscillatorType;
  drums: readonly number[];
  pad: OscillatorType;
  detune?: number;
}

const SONGS: Record<AltarId, Song> = {
  whale: { ms: 230, root: 98, scale: [0, 2, 3, 5, 7, 8, 10], melody: [7, 9, 11, 9, 7, 4, 7, -1, 9, 11, 14, 11, 9, 7, 4, -1], lead: "sine", drums: [0, 8], pad: "triangle" },
  turtle: { ms: 170, root: 73.4, scale: [0, 1, 4, 5, 7, 8, 10], melody: [7, -1, 8, 7, 5, -1, 4, 5, 7, -1, 8, 10, 11, -1, 8, 7], lead: "sawtooth", drums: [0, 3, 6, 8, 11, 14], pad: "sawtooth" },
  hawk: { ms: 105, root: 146.8, scale: [0, 2, 4, 5, 7, 9, 11], melody: [7, 9, 11, 14, 11, 9, 7, 9, 11, 14, 16, 14, 11, 9, 7, 4], lead: "square", drums: [0, 4, 8, 10, 12], pad: "triangle" },
  wind: { ms: 150, root: 130.8, scale: [0, 2, 4, 6, 7, 9, 11], melody: [7, 11, 14, 11, 9, 13, 16, 13, 7, 11, 14, 18, 16, 14, 11, 9], lead: "triangle", drums: [0], pad: "sine" },
  sion: { ms: 190, root: 110, scale: [0, 2, 4, 5, 7, 9, 11], melody: [7, -1, 9, 11, 14, -1, 11, 9, 7, -1, 6, 4, 7, -1, -1, -1], lead: "triangle", drums: [0, 8], pad: "sawtooth" },
  sylvester: { ms: 165, root: 146.8, scale: [0, 2, 4, 7, 9], melody: [7, 9, 11, 9, 7, 4, 2, 4, 7, 9, 12, 11, 9, 7, 9, -1], lead: "sine", drums: [0, 6], pad: "triangle" },
  witch: { ms: 145, root: 110, scale: [0, 2, 3, 5, 7, 8, 11], melody: [7, 8, 11, 12, 11, 8, 7, 3, 7, 8, 11, 14, 12, 11, 8, 7], lead: "triangle", drums: [0, 5, 10], pad: "square" },
  unknown: { ms: 210, root: 92.5, scale: [0, 1, 3, 6, 7, 10], melody: [6, -1, 1, -1, 7, -1, -1, 0, 6, -1, 10, -1, 1, -1, -1, -1], lead: "sine", drums: [0, 9], pad: "sawtooth", detune: 0.03 },
};

/** 음계 n번째 음 (넘치면 한 옥타브 위) */
const note = (song: Song, n: number) => song.root * 2 ** ((Math.floor(n / song.scale.length) * 12 + song.scale[n % song.scale.length]!) / 12);

export function beatOf(song: Song) {
  return (step: number): void => {
    const out = musicOut();
    if (!out) return;
    const s = step % 16;
    const bar = Math.floor(step / 16) % 4;
    const shift = [0, 3, 4, 2][bar]!;
    if (song.drums.includes(s)) tone({ type: "sine", from: 80, to: 36, dur: 0.2, vol: 0.32 }, out);
    if (s === 0) for (const n of [0, 2, 4]) tone({ type: song.pad, from: note(song, n + shift) * (1 + (song.detune ?? 0) * (n - 2)), dur: (song.ms / 1000) * 15, vol: 0.03 }, out);
    if (s % 2 === 0) tone({ type: "triangle", from: note(song, shift) / 2, dur: (song.ms / 1000) * 1.8, vol: 0.14 }, out);
    const m = song.melody[s]!;
    if (m >= 0) tone({ type: song.lead, from: note(song, m + shift) * (1 + (song.detune ?? 0) * Math.sin(step)), dur: (song.ms / 1000) * 1.6, vol: song.lead === "square" || song.lead === "sawtooth" ? 0.045 : 0.09 }, out);
  };
}

const BEATS = Object.fromEntries(Object.entries(SONGS).map(([id, song]) => [id, { beat: beatOf(song), ms: song.ms }])) as Record<AltarId, { beat: (step: number) => void; ms: number }>;
/** 성좌 곡 (audio/roomMusic이 켜고 끔) */
export const altarMusic = (id: AltarId) => BEATS[id];
