// 잔잔한 곡: 메인 화면 · 상점 방 · 쉼터 방 (방 곡은 audio/polish가 roomMusic으로 켜고 끔, 메인 화면 곡은 TitleScreen이 켜고 끔)
import { musicBeat, musicOut, setMusicBeat, startMusic, stopMusic, tone } from "./sound";

const hz = (root: number, n: number) => root * 2 ** (n / 12);

// 쉼터: 느리고 따뜻한 장조 분산 화음 + 긴 음
const REST_ARP = [0, 4, 7, 12, 16, 12, 7, 4];
const REST_ROOTS = [196, 174.6, 220, 196];
function restBeat(step: number): void {
  const out = musicOut();
  if (!out) return;
  const root = REST_ROOTS[(step >> 3) % REST_ROOTS.length]!;
  tone({ type: "sine", from: hz(root, REST_ARP[step % 8]!), dur: 0.5, vol: 0.14 }, out);
  if (step % 8 === 0) for (const k of [0, 7]) tone({ type: "triangle", from: hz(root / 2, k), dur: 2, vol: 0.1 }, out);
}

// 상점: 통통 튀는 밑음(밑음·5도) + 가벼운 5음 가락
const SHOP_LEAD = [12, 16, 19, 16, 21, 19, 16, 14, 12, 14, 16, 19, 24, 21, 19, 16];
const SHOP_ROOTS = [130.8, 130.8, 174.6, 196];
function shopBeat(step: number): void {
  const out = musicOut();
  if (!out) return;
  const root = SHOP_ROOTS[(step >> 3) % SHOP_ROOTS.length]!;
  if (step % 2 === 0) tone({ type: "triangle", from: hz(root, step % 4 === 0 ? 0 : 7), dur: 0.12, vol: 0.4 }, out);
  if (step % 4 !== 1) tone({ type: "square", from: hz(root, SHOP_LEAD[step % 16]!), dur: 0.08, vol: 0.08 }, out);
  if (step % 8 === 6) tone({ type: "sine", from: hz(root, 24), dur: 0.2, vol: 0.06 }, out);
}

// 메인 화면: 당당하지만 차분한 가락 (밑음 네 개 위로 긴 화음 + 노래하는 가락)
const MENU_ROOTS = [146.8, 110, 116.5, 130.8];
const MENU_THIRD = [4, 3, 4, 4];
const MENU_LEAD = [12, -1, 16, 19, 24, -1, 23, 19, 21, -1, 19, 16, 14, 16, 19, -1];
function menuBeat(step: number): void {
  const out = musicOut();
  if (!out) return;
  const bar = (step >> 4) % MENU_ROOTS.length;
  const root = MENU_ROOTS[bar]!;
  if (step % 16 === 0) for (const k of [0, MENU_THIRD[bar]!, 7]) tone({ type: "triangle", from: hz(root, k), dur: 3, vol: 0.09 }, out);
  if (step % 4 === 0) tone({ type: "sine", from: root / 2, dur: 0.5, vol: 0.35 }, out);
  if (step % 2 === 1) tone({ type: "sine", from: hz(root, step % 4 === 1 ? 7 : 12), dur: 0.18, vol: 0.07 }, out);
  const n = MENU_LEAD[step % 16]!;
  if (n >= 0) tone({ type: "triangle", from: hz(root, n), dur: 0.32, vol: 0.13 }, out);
}

export const REST_MUSIC = { beat: restBeat, ms: 260 };
export const SHOP_MUSIC = { beat: shopBeat, ms: 170 };
const MENU_MUSIC = { beat: menuBeat, ms: 210 };

/** 메인 화면 곡 켜기·끄기 (아직 소리를 낼 수 없으면 처음 누를 때 시작) */
export function setMenuMusic(on: boolean): void {
  window.removeEventListener("pointerdown", retry);
  window.removeEventListener("keydown", retry);
  if (on) {
    setMusicBeat(MENU_MUSIC);
    startMusic(1, false);
    window.addEventListener("pointerdown", retry);
    window.addEventListener("keydown", retry);
  } else if (musicBeat() === MENU_MUSIC) {
    stopMusic();
    setMusicBeat(null);
  }
}
function retry(): void {
  if (musicBeat() === MENU_MUSIC) startMusic(1, false);
}
