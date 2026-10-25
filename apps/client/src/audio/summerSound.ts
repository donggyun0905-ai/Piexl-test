// 여름 파도(한정 스킨) 소리: 물 튀는 소리 (공격은 작게·가끔, 강해질 때·대기 장면이 다 찼을 때는 큰 파도와 갈매기)
// 전용 음악: 통통 튀는 금속 북 같은 가락 + 셰이커 + 가벼운 엇박 북 (직접 만든 곡). 파일 없이 브라우저에서 만듦
import { musicOut, noise, setMusicBeat, sfxOn, tone } from "./sound";

const SMALL_GAP = 1200;
let lastSmall = -Infinity;

export function splash(big: boolean): void {
  if (!sfxOn()) return;
  const now = performance.now();
  if (!big) {
    if (now - lastSmall < SMALL_GAP) return;
    lastSmall = now;
    noise(0.18, 0.22, 2400);
    tone({ type: "sine", from: 900, to: 1500, dur: 0.06, vol: 0.08 });
    tone({ type: "sine", from: 1200, to: 1900, dur: 0.05, vol: 0.06, delay: 0.05 });
    return;
  }
  lastSmall = now;
  // 밀려오는 파도 (낮게 쏴아) + 물방울 + 갈매기 두 번
  noise(0.9, 0.4, 700);
  noise(0.6, 0.25, 2600);
  for (let i = 0; i < 4; i++) tone({ type: "sine", from: 800 + i * 220, to: 1400 + i * 260, dur: 0.05, vol: 0.06, delay: 0.25 + i * 0.07 });
  tone({ type: "triangle", from: 1600, to: 1100, dur: 0.18, vol: 0.07, delay: 0.55 });
  tone({ type: "triangle", from: 1500, to: 1050, dur: 0.22, vol: 0.06, delay: 0.78 });
}

// ───── 전용 음악 ─────
/** 장조 다섯 음 (도·레·미·솔·라 …) 반음 수 */
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
/** 가락: 16칸 × 4마디 (-1 = 쉼) */
const MELODY = [
  5, -1, 6, 7, -1, 7, 6, -1, 5, -1, 3, -1, 4, 5, -1, -1,
  5, -1, 6, 7, -1, 8, 9, -1, 8, -1, 7, -1, 6, -1, -1, -1,
  7, -1, 8, 9, -1, 9, 8, -1, 7, -1, 5, -1, 6, 7, -1, 5,
  4, -1, 5, 3, -1, 2, 3, -1, 0, -1, -1, -1, 2, -1, 4, -1,
];
/** 마디마다 낮은 줄 (한 마디 = 16칸) */
const BASS = [0, 3, 4, 3];
const ROOT = 262;

function summerBeat(step: number, boss: boolean): void {
  const out = musicOut();
  if (!out) return;
  const lift = boss ? 2 : 0;
  const f = (deg: number, oct = 0) => ROOT * 2 ** ((SCALE[deg]! + lift) / 12 + oct);
  const s = step % 64;
  const beat = s % 16;
  const bar = Math.floor(s / 16);
  // 북: 1·(3+엇박)·… 셰이커는 매 칸, 손뼉은 2·4박
  if (beat === 0 || beat === 7 || beat === 10) tone({ type: "sine", from: 110, to: 50, dur: 0.16, vol: 0.6 }, out);
  if (beat === 4 || beat === 12) noise(0.07, 0.3, 2200, out);
  noise(0.025, beat % 2 ? 0.08 : 0.13, 7000, out);
  // 낮은 줄 (통통)
  if (beat % 4 === 0) tone({ type: "triangle", from: f(BASS[bar]!, -1), dur: 0.22, vol: 0.4 }, out);
  // 금속 북 같은 가락: 세모파 + 한 옥타브 위 사인이 빨리 사라짐
  const m = MELODY[s]!;
  if (m >= 0) {
    const hz = f(m);
    tone({ type: "triangle", from: hz, dur: 0.22, vol: 0.12 }, out);
    tone({ type: "sine", from: hz * 2.01, dur: 0.09, vol: 0.06 }, out);
  }
  // 둘째·넷째 마디 끝에 반짝이는 장식음
  if (bar % 2 === 1 && beat === 14) tone({ type: "sine", from: f(9, 1), dur: 0.12, vol: 0.04 }, out);
}

const SUMMER = { beat: summerBeat, ms: 130 };

/** 여름 파도를 입었으면 전용 음악 (끌 때는 tigerSound.setTigerMusic(false)와 같이 기본 곡) */
export function setSummerMusic(on: boolean): void {
  if (on) setMusicBeat(SUMMER);
}
