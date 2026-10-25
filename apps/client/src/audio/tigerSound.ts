// 범 풍류(한정 스킨) 소리: 호랑이 울음 (공격은 작게·가끔, 강해질 때·대기 기운이 다 찼을 때는 크게)
// 전용 음악: 열두 박(셋씩 넷) 장단 위에 다섯 음 가락이 꺾이며 흥겹게 (직접 만든 곡). 파일 없이 브라우저에서 만듦
import { musicOut, noise, setMusicBeat, sfxOn, tone } from "./sound";

/** 작은 울음은 이만큼(ms)에 한 번만 */
const SMALL_GAP = 1400;
let lastSmall = -Infinity;

export function roar(big: boolean): void {
  if (!sfxOn()) return;
  const now = performance.now();
  if (!big) {
    if (now - lastSmall < SMALL_GAP) return;
    lastSmall = now;
    tone({ type: "sawtooth", from: 280, to: 120, dur: 0.28, vol: 0.16 });
    tone({ type: "square", from: 140, to: 70, dur: 0.24, vol: 0.08 });
    noise(0.22, 0.25, 900);
    return;
  }
  lastSmall = now;
  tone({ type: "sawtooth", from: 200, to: 65, dur: 0.8, vol: 0.28 });
  tone({ type: "sawtooth", from: 150, to: 50, dur: 0.85, vol: 0.18, delay: 0.03 });
  tone({ type: "square", from: 95, to: 45, dur: 0.6, vol: 0.12 });
  noise(0.7, 0.45, 650);
}

// ───── 전용 음악 ─────
/** 다섯 음 (도·레·파·솔·라 …) 반음 수 */
const SCALE = [0, 2, 5, 7, 9, 12, 14, 17, 19, 21, 24];
/** 가락: 12박 × 4마디 (-1 = 쉼) */
const MELODY = [
  4, -1, 5, 6, -1, 5, 4, -1, 2, 3, -1, -1,
  4, -1, 5, 6, -1, 7, 8, -1, 7, 6, -1, -1,
  7, -1, 8, 9, -1, 8, 7, -1, 6, 5, -1, 4,
  5, -1, -1, 4, -1, 2, 3, -1, 1, 2, -1, -1,
];
/** 받는 가락 (짝수 마디에 피리처럼) */
const ANSWER = [-1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 8, 9];
/** 장단: 덩(쿵+짝) · 쿵 · 덕 */
const DRUM: Record<number, "deong" | "kung" | "deok"> = { 0: "deong", 3: "deok", 5: "kung", 6: "deok", 8: "deok", 9: "kung", 11: "deok" };
const ROOT = 196;

function tigerBeat(step: number, boss: boolean): void {
  const out = musicOut();
  if (!out) return;
  const lift = boss ? 2 : 0;
  const f = (deg: number, oct = 0) => ROOT * 2 ** ((SCALE[deg]! + lift) / 12 + oct);
  const s = step % 48;
  const beat = s % 12;
  const d = DRUM[beat];
  if (d === "deong" || d === "kung") tone({ type: "sine", from: 120, to: 55, dur: 0.18, vol: 0.7 }, out);
  if (d === "deong" || d === "deok") noise(0.06, d === "deong" ? 0.35 : 0.22, 3200, out);
  // 북 소리 아래 낮은 줄 (셋째 박마다)
  if (beat % 3 === 0) tone({ type: "triangle", from: f(beat === 6 ? 3 : 0, -1), dur: 0.3, vol: 0.4 }, out);
  // 해금처럼 아래에서 꺾여 올라가는 가락
  const m = MELODY[s]!;
  if (m >= 0) {
    const hz = f(m);
    tone({ type: "sawtooth", from: hz * 0.94, to: hz, dur: 0.24, vol: 0.09 }, out);
    tone({ type: "triangle", from: hz * 2, dur: 0.16, vol: 0.05 }, out);
  }
  const bar = Math.floor(s / 12);
  const a = ANSWER[beat]!;
  if (bar % 2 === 1 && a >= 0) tone({ type: "square", from: f(a, 1), dur: 0.1, vol: 0.04 }, out);
}

/** 한정 스킨을 입었으면 전용 음악, 아니면 기본 곡 */
export function setTigerMusic(on: boolean): void {
  setMusicBeat(on ? TIGER : null);
}
const TIGER = { beat: tigerBeat, ms: 150 };
