// 세계 지도 나라마다 곡 (파일 없이 합성): 곡 하나 = 음계 · 마디마다 밑음 · 16박 가락 · 악기 · 장단 — 같은 틀(songBeat)로 연주
// WorldMode가 나라(건물 안이면 들어온 나라)가 바뀔 때 켜고, 지도를 나가면 메인 화면 곡으로 돌림
import { setMenuMusic } from "./calmMusic";
import { musicOut, noise, setMusicBeat, startMusic, tone } from "./sound";

const SCALE = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygianDom: [0, 1, 4, 5, 7, 8, 10],
  harmonic: [0, 2, 3, 5, 7, 8, 11],
  penta: [0, 2, 4, 7, 9],
  dim: [0, 1, 3, 4, 6, 7, 9, 10],
} as const;

interface Song {
  /** 한 박 (ms) */
  ms: number;
  scale: readonly number[];
  /** 마디(16박)마다 밑음 Hz */
  roots: readonly number[];
  /** 16박 가락: 음계 칸 번호 (-1 = 쉼, 음계 길이를 넘으면 한 옥타브 위) */
  lead: readonly number[];
  leadType: OscillatorType;
  leadVol: number;
  bassType: OscillatorType;
  /** 마디 첫 박에 긴 화음 */
  pad: boolean;
  /** 장단: 없음 · 딸깍 · 북 · 쇠 */
  perc: "none" | "tick" | "drum" | "clank";
}

const S = (ms: number, scale: readonly number[], roots: number[], lead: number[], leadType: OscillatorType, leadVol: number, bassType: OscillatorType, pad: boolean, perc: Song["perc"]): Song => ({ ms, scale, roots, lead, leadType, leadVol, bassType, pad, perc });

/** 나라 필드 → 곡 */
const SONGS: Record<string, Song> = {
  // 아스칼론: 밝은 장조 행진 (기사 왕국)
  ascalon: S(230, SCALE.major, [130.8, 174.6, 196, 130.8], [7, -1, 9, 11, 9, 7, 4, -1, 5, 7, 9, -1, 7, 4, 2, 4], "triangle", 0.12, "sine", true, "none"),
  // 테라코어: 단조 기계 박동
  terracore: S(190, SCALE.minor, [110, 110, 98, 123.5], [7, 7, -1, 9, 7, -1, 5, 4, 7, 7, -1, 10, 9, -1, 7, 5], "square", 0.05, "square", false, "clank"),
  // 비르디아: 리디아 음계의 맑은 숲
  virdia: S(300, SCALE.lydian, [174.6, 196, 164.8, 174.6], [7, 9, 10, 11, -1, 10, 9, 7, 9, -1, 7, 5, 4, -1, 5, 7], "sine", 0.12, "sine", true, "none"),
  // 헬리오스: 이국적인 제국 (프리지아 장음계 + 북)
  helios: S(220, SCALE.phrygianDom, [146.8, 146.8, 130.8, 146.8], [7, 8, 9, 8, 7, -1, 5, 4, 5, 7, -1, 8, 7, 5, 4, 1], "triangle", 0.11, "sine", false, "drum"),
  // 대사막: 느린 화성 단조
  desert: S(320, SCALE.harmonic, [110, 110, 103.8, 110], [7, -1, 8, -1, 9, 8, 7, -1, 6, -1, 5, 4, 5, -1, -1, -1], "sine", 0.12, "triangle", true, "tick"),
  // 실베르: 차갑고 느린 단조
  silber: S(340, SCALE.minor, [98, 87.3, 110, 98], [7, -1, -1, 9, 10, -1, 9, 7, 5, -1, -1, 7, 4, -1, -1, -1], "sine", 0.12, "triangle", true, "none"),
  // 탈라시아: 흥겨운 항구 노래
  thalassia: S(200, SCALE.major, [146.8, 196, 220, 146.8], [7, 9, 11, 9, 7, 4, 7, 9, 11, 14, 11, 9, 7, 4, 5, 7], "square", 0.05, "triangle", false, "tick"),
  // 지옥: 낮은 감7 울림
  hell: S(260, SCALE.dim, [55, 58.3, 55, 51.9], [8, -1, 9, -1, 11, 10, -1, 9, 8, -1, -1, 6, 7, -1, -1, -1], "sawtooth", 0.05, "sawtooth", true, "drum"),
  // 해저 도시: 느리게 출렁이는 5음
  undersea: S(360, SCALE.penta, [130.8, 155.6, 146.8, 116.5], [5, 7, 8, 7, 6, -1, 5, -1, 6, 8, 9, -1, 8, 7, -1, -1], "sine", 0.11, "sine", true, "none"),
  // 네온 시티: 빠른 신스 단조
  cyber: S(150, SCALE.minor, [110, 87.3, 130.8, 98], [7, 7, 9, 7, 10, 9, 7, -1, 7, 7, 9, 7, 12, 10, 9, 7], "square", 0.05, "sawtooth", false, "drum"),
  // 비연: 5음 피리 가락 + 나무 딸깍
  windtown: S(280, SCALE.penta, [146.8, 164.8, 130.8, 146.8], [5, 6, 7, -1, 6, 5, 3, -1, 4, 5, 6, 8, 7, -1, 5, -1], "sine", 0.13, "triangle", false, "tick"),
  // 성국: 느린 성가 (긴 화음)
  seongguk: S(380, SCALE.dorian, [130.8, 174.6, 146.8, 196], [7, -1, 9, -1, 10, -1, 9, 7, 8, -1, 7, -1, 5, -1, -1, -1], "triangle", 0.1, "sine", true, "none"),
};

const hz = (root: number, n: number) => root * 2 ** (n / 12);
const deg = (s: readonly number[], i: number) => s[i % s.length]! + 12 * Math.floor(i / s.length);

function songBeat(s: Song, step: number): void {
  const out = musicOut();
  if (!out) return;
  const b = step % 16;
  const root = s.roots[(step >> 4) % s.roots.length]!;
  const beat = s.ms / 1000;
  if (s.pad && b === 0) for (const i of [0, 2, 4]) tone({ type: "triangle", from: hz(root, deg(s.scale, i)), dur: beat * 15, vol: 0.06 }, out);
  if (b % 4 === 0) tone({ type: s.bassType, from: root / 2, dur: beat * 3, vol: s.bassType === "sine" ? 0.3 : 0.1 }, out);
  const n = s.lead[b]!;
  if (n >= 0) tone({ type: s.leadType, from: hz(root, deg(s.scale, n)), dur: beat * 1.6, vol: s.leadVol }, out);
  if (s.perc === "tick" && b % 4 === 2) tone({ type: "triangle", from: 1200, to: 900, dur: 0.03, vol: 0.06 }, out);
  if (s.perc === "drum") {
    if (b % 8 === 0) tone({ type: "sine", from: 120, to: 50, dur: 0.18, vol: 0.35 }, out);
    if (b % 8 === 4) noise(0.06, 0.15, 1800, out);
  }
  if (s.perc === "clank" && b % 4 === 0) noise(0.04, 0.12, 4200, out);
}

const BEATS = Object.fromEntries(Object.entries(SONGS).map(([id, s]) => [id, { beat: (step: number) => songBeat(s, step), ms: s.ms }]));

/** 나라 곡 켜기 (곡이 없는 지역은 아스칼론 곡) · null = 지도를 나감 → 메인 화면 곡 */
export function setWorldMusic(field: string | null): void {
  if (field === null) {
    setMenuMusic(true);
    return;
  }
  setMusicBeat(BEATS[field] ?? BEATS.ascalon!);
  startMusic(1, false);
}
