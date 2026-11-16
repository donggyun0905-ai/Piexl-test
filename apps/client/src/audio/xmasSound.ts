// 성탄 눈꽃(한정 스킨) 소리: 작은 방울 딸랑 (공격은 작게·가끔, 강해질 때·대기 장면이 다 찼을 때는 큰 종 + 방울 흔들기)
// 전용 음악: 종소리 가락 + 8분 방울 + 1·3박 낮은 줄 (장조, 직접 만든 곡). 파일 없이 브라우저에서 만듦
import { musicOut, noise, setMusicBeat, sfxOn, tone } from "./sound";

const SMALL_GAP = 1100;
let lastSmall = -Infinity;

export function jingle(big: boolean): void {
  if (!sfxOn()) return;
  const now = performance.now();
  if (!big) {
    if (now - lastSmall < SMALL_GAP) return;
    lastSmall = now;
    tone({ type: "sine", from: 2640, dur: 0.08, vol: 0.05 });
    tone({ type: "sine", from: 3520, dur: 0.06, vol: 0.03, delay: 0.04 });
    return;
  }
  lastSmall = now;
  // 큰 종 (낮은 울림 + 배음) · 방울 흔들기
  for (const [f, v] of [[523, 0.3], [1046, 0.14], [1569, 0.08], [2093, 0.05]] as const) tone({ type: "sine", from: f, dur: 1.1, vol: v });
  noise(0.35, 0.12, 8000);
  for (let i = 0; i < 5; i++) tone({ type: "sine", from: 2349 + (i % 2) * 300, dur: 0.06, vol: 0.04, delay: 0.1 + i * 0.07 });
}

// ───── 전용 음악 ─────
/** 장조 (도·레·미·파·솔·라·시 …) 반음 수 */
const SCALE = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21];
/** 종 가락: 8칸 × 8마디 (-1 = 쉼) */
const MELODY = [
  7, -1, 9, 7, 4, -1, 2, -1,
  4, -1, 5, 4, 2, -1, -1, -1,
  5, -1, 7, 5, 3, -1, 1, -1,
  2, 4, 5, 7, 6, -1, -1, -1,
  9, -1, 8, 7, 9, -1, 7, -1,
  5, -1, 4, 5, 7, -1, 4, -1,
  3, -1, 5, 4, 2, -1, 1, -1,
  0, -1, 2, -1, 4, -1, -1, -1,
];
/** 마디마다 낮은 줄 뿌리 (I · IV · V · I …) */
const BASS = [0, 3, 4, 0, 5, 3, 4, 0];
const ROOT = 262;

function xmasBeat(step: number, boss: boolean): void {
  const out = musicOut();
  if (!out) return;
  const lift = boss ? 2 : 0;
  const f = (deg: number, oct = 0) => ROOT * 2 ** ((SCALE[deg % SCALE.length]! + 12 * Math.floor(deg / SCALE.length) + lift) / 12 + oct);
  const s = step % 64;
  const beat = s % 8;
  const bar = Math.floor(s / 8);
  // 방울: 8분마다 (엇박은 작게)
  noise(0.03, beat % 2 ? 0.06 : 0.1, 7500, out);
  // 낮은 줄: 1·3박 (뿌리 · 다섯째)
  if (beat === 0) tone({ type: "triangle", from: f(BASS[bar]!, -1), dur: 0.4, vol: 0.18 }, out);
  if (beat === 4) tone({ type: "triangle", from: f(BASS[bar]! + 4, -1), dur: 0.35, vol: 0.14 }, out);
  // 2·4박 화음 (작게)
  if (beat === 2 || beat === 6) for (const d of [2, 4]) tone({ type: "sine", from: f(BASS[bar]! + d), dur: 0.15, vol: 0.04 }, out);
  // 종 가락 (사인 + 높은 배음 = 종 소리)
  const m = MELODY[s]!;
  if (m >= 0) {
    tone({ type: "sine", from: f(m, 1), dur: 0.5, vol: 0.09 }, out);
    tone({ type: "sine", from: f(m, 2) * 1.5, dur: 0.2, vol: 0.02 }, out);
  }
}

const XMAS = { beat: xmasBeat, ms: 210 };

/** 성탄 눈꽃을 입었으면 전용 음악 (끌 때는 tigerSound.setTigerMusic(false)와 같이 기본 곡) */
export function setXmasMusic(on: boolean): void {
  if (on) setMusicBeat(XMAS);
}
