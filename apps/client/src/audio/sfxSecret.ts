// 시즌 2 히든 캐릭터 효과음 (sound의 효과음 표에 합쳐짐): 에테르 광부 · 운명의 여행자 · 제우스
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
  // 운명의 여행자: 시위 (낮게 "퉁" + 바람) · 주사위 (나무 위를 구르는 딱딱 소리 + 맑은 종)
  twang: () => {
    tone({ type: "triangle", from: 220, to: 160, dur: 0.18, vol: 0.14 });
    noise(0.12, 0.2, 2200);
  },
  dice: () => {
    for (let i = 0; i < 5; i++) tone({ type: "square", from: 900 - i * 80, to: 500, dur: 0.03, vol: 0.06, delay: i * 0.07 });
    tone({ type: "sine", from: 1320, to: 1320, dur: 0.5, vol: 0.08, delay: 0.4 });
    tone({ type: "sine", from: 1760, to: 1760, dur: 0.5, vol: 0.06, delay: 0.45 });
  },
  // 제우스: 번개 (찢어지는 지직 + 낮은 우르릉) · 강림 (하늘이 갈라지는 큰 천둥 + 오르는 화음)
  zap: () => {
    noise(0.08, 0.35, 6000);
    tone({ type: "sawtooth", from: 900, to: 120, dur: 0.12, vol: 0.08 });
  },
  descend: () => {
    noise(1.2, 0.9, 900);
    tone({ type: "sawtooth", from: 90, to: 30, dur: 1.4, vol: 0.45 });
    for (const [i, f] of [392, 523, 659, 784].entries()) tone({ type: "triangle", from: f, to: f, dur: 0.8, vol: 0.08, delay: 0.3 + i * 0.1 });
  },
};
