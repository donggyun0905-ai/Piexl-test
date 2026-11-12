// 기본 곡 (sound의 박자가 부름): 층마다 다른 가락 4개 · 보스마다 다른 보스 가락 4개(보스 종류로 고름) + 겹치는 층
// 겹치는 층: 깊은 층일수록 타악기 · 보스전은 북·낮은 현·금관 화음 · 마지막 보스(7층·라스트 보스·아레나 끝 방)는 합창·팀파니·심벌까지
import { noise, tone } from "./sound";

interface Tune { bass: number[]; lead: number[] }
/** 층 가락 (1층부터 차례로, 4개를 돌려 씀) */
const FLOOR_TUNES: Tune[] = [
  { bass: [0, 0, 7, 7, 5, 5, 3, 3], lead: [12, 15, 19, 15, 17, 15, 12, 10, 12, 15, 19, 22, 19, 17, 15, 12] },
  { bass: [0, 0, 3, 3, 8, 8, 7, 7], lead: [12, 19, 15, 19, 12, 20, 15, 20, 12, 19, 17, 19, 14, 19, 17, 14] },
  { bass: [0, 0, 10, 10, 8, 8, 7, 7], lead: [24, 22, 19, 15, 22, 20, 17, 14, 20, 19, 15, 12, 19, 17, 14, 10] },
  { bass: [0, 5, 0, 5, 3, 7, 3, 7], lead: [12, 12, 15, 17, 19, 17, 15, 12, 17, 17, 20, 22, 24, 22, 20, 19] },
];
/** 보스 가락 (불안한 반음·낮게 내려가는 밑음) */
const BOSS_TUNES: Tune[] = [
  { bass: [0, 0, 1, 1, 0, 0, 6, 5], lead: [12, 13, 12, 18, 17, 13, 12, 10, 12, 13, 16, 18, 19, 18, 16, 13] },
  { bass: [0, 0, 0, 0, 8, 8, 7, 7], lead: [24, 19, 20, 19, 15, 19, 20, 22, 24, 19, 20, 19, 27, 26, 24, 22] },
  { bass: [0, 3, 5, 6, 5, 3, 0, -2], lead: [12, 15, 17, 18, 17, 15, 12, 15, 24, 27, 29, 30, 29, 27, 24, 22] },
  { bass: [0, 0, -4, -4, -2, -2, -5, -5], lead: [19, 24, 26, 27, 26, 24, 19, 24, 15, 20, 22, 24, 22, 20, 19, 17] },
];
/** 지금 보스 가락 (-1 = 정해지지 않음: 층 가락을 반음 올려 씀) · 마지막 보스인지 */
let bossTune = -1;
let finalBoss = false;

/** 보스가 나오면 그 보스의 가락으로 (같은 보스는 늘 같은 가락) */
export function setBossTune(kind: string | null, final = false): void {
  bossTune = kind ? [...kind].reduce((a, c) => a + c.charCodeAt(0), 0) % BOSS_TUNES.length : -1;
  finalBoss = final;
}

/** 기본 곡 한 박 */
export function defaultBeat(step: number, boss: boolean, floor: number, root: number, out: GainNode): void {
  const t = boss && bossTune >= 0 ? BOSS_TUNES[bossTune]! : FLOOR_TUNES[(Math.max(1, floor) - 1) % FLOOR_TUNES.length]!;
  const semis = (n: number) => root * 2 ** (n / 12);
  const r = t.bass[(step >> 2) % t.bass.length]!;
  const lead = t.lead[step % t.lead.length]! + (boss && bossTune < 0 ? 1 : 0);
  if (step % 2 === 0) tone({ type: "triangle", from: semis(r), dur: boss ? 0.165 : 0.22, vol: 0.5 }, out);
  if (step % 4 !== 3) tone({ type: "square", from: semis(lead), dur: 0.1, vol: 0.12 }, out);
  layers(step, semis, boss ? (finalBoss || floor >= 7 ? 2 : 1) : 0, floor, r, lead, out);
}

/** level 0 보통 · 1 보스 · 2 마지막 보스 · r 지금 마디의 밑음(반음) · lead 지금 가락 음(반음) */
function layers(step: number, semis: (n: number) => number, level: number, floor: number, r: number, lead: number, out: GainNode): void {
  if (level === 0) {
    // 3층부터 하이햇, 5층부터 약한 북 (깊이 들어갈수록 긴장)
    if (floor >= 3 && step % 2 === 1) noise(0.02, 0.05, 9000, out);
    if (floor >= 5 && step % 8 === 0) tone({ type: "sine", from: 120, to: 50, dur: 0.14, vol: 0.4 }, out);
    return;
  }
  // 북: 네 박마다 (마지막 보스는 두 박마다) · 작은북 · 하이햇
  if (step % (level > 1 ? 2 : 4) === 0) tone({ type: "sine", from: 150, to: 45, dur: 0.16, vol: 0.75 }, out);
  if (step % 8 === 4) noise(0.09, 0.22, 3500, out);
  if (step % 2 === 1) noise(0.02, 0.07, 9000, out);
  // 낮은 현: 한 옥타브 아래로 길게
  if (step % 4 === 0) tone({ type: "sawtooth", from: semis(r - 12), dur: 0.6, vol: 0.16 }, out);
  // 금관 화음: 두 마디마다 힘 있게
  if (step % 16 === 0) for (const k of [0, 7, 12]) tone({ type: "sawtooth", from: semis(r + k), dur: 0.55, vol: 0.1 }, out);
  // 가락을 한 옥타브 위에서 한 번 더
  if (step % 4 !== 3) tone({ type: "square", from: semis(lead + 12), dur: 0.08, vol: 0.05 }, out);
  if (level < 2) return;
  // 합창: 단조 화음을 길게
  if (step % 8 === 0) for (const k of [0, 3, 7, 12]) tone({ type: "sine", from: semis(r + 12 + k), dur: 1.4, vol: 0.07 }, out);
  // 팀파니: 마디 끝에서 몰아치기
  if (step % 16 >= 13) for (const d of [0, 0.09]) tone({ type: "sine", from: semis(r - 12), to: semis(r - 14), dur: 0.1, vol: 0.5, delay: d }, out);
  // 심벌: 네 마디마다
  if (step % 32 === 0) noise(0.6, 0.16, 7000, out);
  // 빠른 꾸밈음
  tone({ type: "triangle", from: semis(lead + 24), dur: 0.06, vol: 0.05, delay: 0.09 }, out);
}
