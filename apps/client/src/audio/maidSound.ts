// 벨벳 티타임(한정 스킨) 소리: 찻잔 쨍 (공격은 작게·가끔, 강해질 때·대기 장면이 다 찼을 때는 호출 종 + 하프 오름)
// 전용 음악: 3박자 왈츠 (1박 낮은 줄 · 2·3박 화음 · 위 가락, 장조, 직접 만든 곡). 파일 없이 브라우저에서 만듦
import { musicOut, setMusicBeat, sfxOn, tone } from "./sound";

const SMALL_GAP = 1200;
let lastSmall = -Infinity;

export function teaBell(big: boolean): void {
  if (!sfxOn()) return;
  const now = performance.now();
  if (!big) {
    if (now - lastSmall < SMALL_GAP) return;
    lastSmall = now;
    tone({ type: "triangle", from: 3136, dur: 0.07, vol: 0.04 });
    return;
  }
  lastSmall = now;
  // 호출 종 '딩' + 하프 오름
  tone({ type: "sine", from: 1760, dur: 0.9, vol: 0.2 });
  tone({ type: "sine", from: 4400, dur: 0.4, vol: 0.05 });
  [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone({ type: "triangle", from: f, dur: 0.3, vol: 0.06, delay: 0.2 + i * 0.06 }));
}

// ───── 전용 음악 ─────
/** 장조 반음 수 */
const SCALE = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21];
/** 왈츠 가락: 한 마디 = 6칸(8분 셋 × 2) × 8마디 (-1 = 쉼 · 길게 끄는 음은 쉼으로) */
const MELODY = [
  4, -1, -1, -1, 6, 7,
  9, -1, -1, -1, 8, 7,
  8, -1, -1, -1, 5, 6,
  7, -1, -1, -1, -1, -1,
  6, -1, -1, -1, 7, 8,
  9, -1, 11, -1, 9, 8,
  7, -1, 6, -1, 4, 5,
  7, -1, -1, -1, -1, -1,
];
/** 마디마다 뿌리 (I · vi · IV · V · ii · V · IV · I) */
const BASS = [0, 5, 3, 4, 1, 4, 3, 0];
const ROOT = 220 * 2 ** (3 / 12);

function maidBeat(step: number, boss: boolean): void {
  const out = musicOut();
  if (!out) return;
  const lift = boss ? 2 : 0;
  const f = (deg: number, oct = 0) => ROOT * 2 ** ((SCALE[deg % SCALE.length]! + 12 * Math.floor(deg / SCALE.length) + lift) / 12 + oct);
  const s = step % 48;
  const beat = s % 6;
  const root = BASS[Math.floor(s / 6)]!;
  // 쿵 · 짝 · 짝
  if (beat === 0) tone({ type: "triangle", from: f(root, -1), dur: 0.45, vol: 0.2 }, out);
  if (beat === 2 || beat === 4) for (const d of [2, 4]) tone({ type: "sine", from: f(root + d), dur: 0.18, vol: 0.05 }, out);
  const m = MELODY[s]!;
  if (m >= 0) {
    tone({ type: "triangle", from: f(m, 1), dur: 0.42, vol: 0.07 }, out);
    tone({ type: "sine", from: f(m, 2), dur: 0.2, vol: 0.015 }, out);
  }
}

const MAID = { beat: maidBeat, ms: 190 };

/** 벨벳 티타임을 입었으면 전용 음악 (끌 때는 tigerSound.setTigerMusic(false)와 같이 기본 곡) */
export function setMaidMusic(on: boolean): void {
  if (on) setMusicBeat(MAID);
}
