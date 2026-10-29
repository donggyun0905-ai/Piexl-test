// 승리(월드 워 리그 우승 한정 스킨) 전용 음악: 작은북 행진 리듬 + 나팔 같은 네모파 가락 + 낮은 금관 (직접 만든 곡). 파일 없이 브라우저에서 만듦
import { musicOut, noise, setMusicBeat, sfxOn, tone } from "./sound";

/** 강해질 때 짧은 팡파르 (도-미-솔-도 나팔 + 작은북) */
export function fanfare(): void {
  if (!sfxOn()) return;
  [0, 4, 7, 12].forEach((n, i) => tone({ type: "square", from: 466 * 2 ** (n / 12), dur: i === 3 ? 0.32 : 0.1, vol: 0.07, delay: i * 0.09 }));
  noise(0.12, 0.18, 3400);
}

/** 장조 음계 (도·레·미·파·솔·라·시 …) 반음 수 */
const SCALE = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19];
/** 가락: 16칸 × 4마디 (-1 = 쉼) · 힘찬 행진 (도-미-솔 올림) */
const MELODY = [
  0, -1, 2, 4, 4, -1, 4, -1, 5, -1, 4, 2, 4, -1, -1, -1,
  4, -1, 5, 7, 7, -1, 7, -1, 8, -1, 7, 5, 7, -1, -1, -1,
  7, -1, 7, 8, 9, -1, 8, 7, 5, -1, 4, -1, 5, 4, 2, -1,
  4, -1, 2, 0, 1, -1, 2, -1, 0, -1, -1, -1, 7, -1, -1, -1,
];
/** 마디마다 낮은 금관 (도·솔·라·솔) */
const BASS = [0, 4, 5, 4];
const ROOT = 233;

function victoryBeat(step: number, boss: boolean): void {
  const out = musicOut();
  if (!out) return;
  const lift = boss ? 2 : 0;
  const f = (deg: number, oct = 0) => ROOT * 2 ** ((SCALE[deg]! + lift) / 12 + oct);
  const s = step % 64;
  const beat = s % 16;
  const bar = Math.floor(s / 16);
  // 큰북 1·3박 · 작은북 2·4박 + 마디 끝 굴림
  if (beat === 0 || beat === 8) tone({ type: "sine", from: 120, to: 55, dur: 0.18, vol: 0.55 }, out);
  if (beat === 4 || beat === 12) noise(0.09, 0.32, 3200, out);
  if (beat >= 13 && bar % 2 === 1) noise(0.04, 0.16, 4200, out);
  if (beat % 2 === 0) noise(0.02, 0.06, 8000, out);
  // 낮은 금관: 박마다
  if (beat % 4 === 0) tone({ type: "sawtooth", from: f(BASS[bar]!, -1), dur: 0.2, vol: 0.12 }, out);
  // 나팔 가락: 네모파 + 한 옥타브 아래 세모파
  const m = MELODY[s]!;
  if (m >= 0) {
    const hz = f(m);
    tone({ type: "square", from: hz, dur: 0.16, vol: 0.06 }, out);
    tone({ type: "triangle", from: hz / 2, dur: 0.18, vol: 0.08 }, out);
  }
}

const VICTORY = { beat: victoryBeat, ms: 120 };

/** 승리 스킨을 입었으면 전용 음악 (끌 때는 tigerSound.setTigerMusic(false)와 같이 기본 곡) */
export function setVictoryMusic(on: boolean): void {
  if (on) setMusicBeat(VICTORY);
}
