// 기본 곡에 겹치는 층 (sound의 기본 박자가 부름): 층이 깊어질수록 타악기가 붙고, 보스전은 북·낮은 현·금관 화음, 라스트 보스(7층)는 합창·팀파니·심벌까지
import { noise, tone } from "./sound";

/** level 0 보통 · 1 보스 · 2 라스트 보스 · r 지금 마디의 밑음(반음) · lead 지금 가락 음(반음) */
export function musicLayers(step: number, semis: (n: number) => number, level: number, floor: number, r: number, lead: number, out: GainNode): void {
  if (level === 0) {
    // 3층부터 하이햇, 5층부터 약한 북 (깊이 들어갈수록 긴장)
    if (floor >= 3 && step % 2 === 1) noise(0.02, 0.05, 9000, out);
    if (floor >= 5 && step % 8 === 0) tone({ type: "sine", from: 120, to: 50, dur: 0.14, vol: 0.4 }, out);
    return;
  }
  // 북: 네 박마다 (라스트 보스는 두 박마다) · 작은북 · 하이햇
  if (step % (level > 1 ? 2 : 4) === 0) tone({ type: "sine", from: 150, to: 45, dur: 0.16, vol: 0.75 }, out);
  if (step % 8 === 4) noise(0.09, 0.22, 3500, out);
  if (step % 2 === 1) noise(0.02, 0.07, 9000, out);
  // 낮은 현: 한 옥타브 아래로 길게
  if (step % 4 === 0) tone({ type: "sawtooth", from: semis(r - 12), dur: 0.6, vol: 0.16 }, out);
  // 금관 화음: 두 마디마다 힘 있게
  if (step % 16 === 0) for (const k of [0, 7, 12]) tone({ type: "sawtooth", from: semis(r + k), dur: 0.55, vol: 0.1 }, out);
  // 가락을 한 옥타브 위에서 한 번 더
  if (step % 4 !== 3) tone({ type: "square", from: semis(lead + 13), dur: 0.08, vol: 0.05 }, out);
  if (level < 2) return;
  // 합창: 단조 화음을 길게
  if (step % 8 === 0) for (const k of [0, 3, 7, 12]) tone({ type: "sine", from: semis(r + 12 + k), dur: 1.4, vol: 0.07 }, out);
  // 팀파니: 마디 끝에서 몰아치기
  if (step % 16 >= 13) for (const d of [0, 0.09]) tone({ type: "sine", from: semis(r - 12), to: semis(r - 14), dur: 0.1, vol: 0.5, delay: d }, out);
  // 심벌: 네 마디마다
  if (step % 32 === 0) noise(0.6, 0.16, 7000, out);
  // 빠른 꾸밈음
  tone({ type: "triangle", from: semis(lead + 25), dur: 0.06, vol: 0.05, delay: 0.09 }, out);
}
