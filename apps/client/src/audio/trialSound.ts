// 시련의 방 소리: 비석이 깨어나는 웅장한 소리(깊은 북·낮은 합창 화음·땅울림) · 거절 벌칙(사슬·낮은 신음) · 보상 상자가 쏟아짐·열림
// 시련 중에는 기본 곡 대신 웅장한 시련 곡 (끝나면 원래 곡으로, 한정 스킨 곡이었으면 그 곡으로)
import { musicBeat, musicOut, noise, setMusicBeat, tone } from "./sound";

/** 효과음 (sound의 효과음 표에 합쳐짐) */
export const TRIAL_SOUNDS = {
  // 비석이 깨어남: 아주 낮은 북 둘 + 땅울림 + 단조 합창 화음이 부풀었다 사라짐
  trialWake: () => {
    tone({ type: "sine", from: 70, to: 30, dur: 0.9, vol: 0.6 });
    tone({ type: "sine", from: 55, to: 28, dur: 1.1, vol: 0.5, delay: 0.35 });
    noise(1.2, 0.25, 180);
    for (const [i, f] of [220, 261.6, 329.6, 110].entries()) tone({ type: i === 3 ? "sawtooth" : "triangle", from: f, to: f * 0.99, dur: 1.6, vol: 0.07, delay: 0.15 });
    tone({ type: "square", from: 880, to: 440, dur: 0.6, vol: 0.03, delay: 0.5 });
  },
  // 거절 벌칙: 쇠사슬이 감기는 소리 + 낮게 떨어지는 신음
  trialCurse: () => {
    noise(0.2, 0.18, 3200);
    tone({ type: "sawtooth", from: 180, to: 60, dur: 0.7, vol: 0.12 });
    tone({ type: "square", from: 1200, to: 1100, dur: 0.06, vol: 0.05, delay: 0.1 });
  },
  // 상자가 쏟아짐: 금화가 쏟아지듯 위로 반짝이는 소리
  trialSpill: () => {
    for (let i = 0; i < 8; i++) tone({ type: "triangle", from: 1046 + i * 130, dur: 0.08, vol: 0.06, delay: i * 0.05 });
    noise(0.3, 0.08, 6000);
  },
  // 상자 열림: 맑은 화음
  trialOpen: () => {
    for (const [i, f] of [784, 988, 1175, 1568].entries()) tone({ type: "triangle", from: f, dur: 0.25, vol: 0.09, delay: i * 0.04 });
  },
};
export type TrialSfx = keyof typeof TRIAL_SOUNDS;

// ───────── 시련 곡: 단조(라·파·솔·미) 위로 낮은 북·묵직한 화음·합창 같은 긴 음 ─────────
const ROOTS = [110, 87.3, 98, 82.4];
const CHORD = [0, 3, 7];
function trialBeat(step: number): void {
  const out = musicOut();
  if (!out) return;
  const s = step % 64;
  const root = ROOTS[Math.floor(s / 16)]!;
  const beat = s % 16;
  // 북: 둥 · 둥둥 · 마지막 박엔 몰아침
  if (beat === 0 || beat === 8 || beat === 11 || (beat >= 14 && s >= 48)) tone({ type: "sine", from: 90, to: 38, dur: 0.25, vol: 0.45 }, out);
  if (beat === 4 || beat === 12) noise(0.12, 0.12, 900, out);
  // 묵직한 화음 (마디 처음)
  if (beat === 0) for (const n of CHORD) tone({ type: "sawtooth", from: root * 2 ** (n / 12), dur: 2.2, vol: 0.035 }, out);
  // 합창 같은 긴 음 (반 마디마다 높이 바뀜)
  if (beat === 0 || beat === 8) tone({ type: "triangle", from: root * 4 * 2 ** ((beat === 0 ? 7 : 3) / 12), dur: 1.1, vol: 0.05 }, out);
  // 낮은 현: 8분음
  if (beat % 2 === 0) tone({ type: "triangle", from: root, dur: 0.14, vol: 0.18 }, out);
}
const TRIAL = { beat: trialBeat, ms: 140 };

let saved: ReturnType<typeof musicBeat> | undefined;

/** 시련 중이면 시련 곡 (끝나면 원래 곡으로) */
export function setTrialMusic(on: boolean): void {
  if (on && saved === undefined) {
    saved = musicBeat();
    setMusicBeat(TRIAL);
  } else if (!on && saved !== undefined) {
    setMusicBeat(saved);
    saved = undefined;
  }
}
