// 시즌 2 히든 캐릭터 효과음 (sound의 효과음 표에 합쳐짐): 에테르 광부
import { noise, tone } from "./sound";

export const SECRET_SOUNDS = {
  // 에테르 광부: 곡괭이 (돌에 쇠가 박히는 "깡") · 광산 붕괴 (낮게 길게 우르르)
  clank: () => {
    tone({ type: "square", from: 1900, to: 1500, dur: 0.05, vol: 0.07 });
    tone({ type: "triangle", from: 2800, to: 2700, dur: 0.09, vol: 0.05 });
    noise(0.05, 0.22, 3000);
  },
  rumble: () => {
    noise(1.1, 0.7, 400);
    tone({ type: "sawtooth", from: 70, to: 30, dur: 1.2, vol: 0.4 });
    noise(0.6, 0.3, 1400);
  },
};
