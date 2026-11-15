// 네온 펄스(한정 스킨) 소리: 전기 지지직 (공격은 작게·가끔, 강해질 때·대기 장면이 다 찼을 때는 올라가는 신스 + 낮은 쿵)
// 전용 음악: 신스웨이브 (16분 아르페지오 + 4박 킥 + 2·4박 스네어 + 8분 베이스, 단조, 직접 만든 곡). 파일 없이 브라우저에서 만듦
import { musicOut, noise, setMusicBeat, sfxOn, tone } from "./sound";

const SMALL_GAP = 1100;
let lastSmall = -Infinity;

export function zap(big: boolean): void {
  if (!sfxOn()) return;
  const now = performance.now();
  if (!big) {
    if (now - lastSmall < SMALL_GAP) return;
    lastSmall = now;
    tone({ type: "square", from: 1800, to: 600, dur: 0.05, vol: 0.05 });
    noise(0.04, 0.12, 5000);
    return;
  }
  lastSmall = now;
  // 올라가는 신스 + 반짝 + 낮은 쿵
  tone({ type: "sawtooth", from: 220, to: 880, dur: 0.45, vol: 0.08 });
  tone({ type: "square", from: 440, to: 1760, dur: 0.45, vol: 0.04 });
  for (let i = 0; i < 4; i++) tone({ type: "sine", from: 1320 + i * 220, dur: 0.06, vol: 0.05, delay: 0.3 + i * 0.05 });
  tone({ type: "sine", from: 120, to: 40, dur: 0.35, vol: 0.5, delay: 0.45 });
  noise(0.3, 0.15, 1800);
}

// ───── 전용 음악 ─────
/** 단조 (라 단조: 라·시·도·레·미·파·솔 …) 반음 수 */
const SCALE = [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19];
/** 마디마다 화음 뿌리 (i · VI · III · VII) */
const CHORD = [0, 5, 2, 6];
/** 아르페지오 모양 (화음 1·3·5·옥타브 위아래) */
const ARP = [0, 2, 4, 7, 4, 2, 0, 2];
const ROOT = 220;

function cyberBeat(step: number, boss: boolean): void {
  const out = musicOut();
  if (!out) return;
  const lift = boss ? 2 : 0;
  const f = (deg: number, oct = 0) => ROOT * 2 ** ((SCALE[deg % SCALE.length]! + 12 * Math.floor(deg / SCALE.length) + lift) / 12 + oct);
  const s = step % 64;
  const beat = s % 16;
  const bar = Math.floor(s / 16);
  const root = CHORD[bar]!;
  // 킥 4박 · 스네어 2·4박 · 하이햇 엇박
  if (beat % 4 === 0) tone({ type: "sine", from: 140, to: 45, dur: 0.14, vol: 0.6 }, out);
  if (beat === 4 || beat === 12) noise(0.09, 0.32, 1600, out);
  if (beat % 4 === 2) noise(0.03, 0.12, 8000, out);
  // 베이스: 8분, 뿌리음 (옥타브 번갈아)
  if (beat % 2 === 0) tone({ type: "sawtooth", from: f(root, beat % 4 ? -1 : -2), dur: 0.12, vol: 0.12 }, out);
  // 아르페지오: 16분 네모파
  tone({ type: "square", from: f(root + ARP[s % 8]!, 1), dur: 0.08, vol: 0.035 }, out);
  // 넷째 마디 끝 리드 한 마디
  if (bar === 3 && beat % 4 === 0) tone({ type: "sawtooth", from: f(root + 7 + (beat / 4) * 2, 1), dur: 0.25, vol: 0.05 }, out);
}

const CYBER = { beat: cyberBeat, ms: 120 };

/** 네온 펄스를 입었으면 전용 음악 (끌 때는 tigerSound.setTigerMusic(false)와 같이 기본 곡) */
export function setCyberMusic(on: boolean): void {
  if (on) setMusicBeat(CYBER);
}
