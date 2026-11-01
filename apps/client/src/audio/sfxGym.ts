// 단련의 방 미니게임 효과음 (sound의 효과음 표에 합쳐짐): 샌드백 퍽 · 공 터짐 · 바벨 밀기·내려놓기 · 실수 · 끝 · 강화
import { noise, tone } from "./sound";

export const GYM_SOUNDS = {
  // 샌드백 맞힘: 가죽 자루를 치는 묵직한 "퍽" + 쇠사슬 찰랑
  gymPunch: () => {
    noise(0.07, 0.45, 1800);
    tone({ type: "sine", from: 150, to: 55, dur: 0.12, vol: 0.42 });
    tone({ type: "triangle", from: 2200, to: 2000, dur: 0.05, vol: 0.05, delay: 0.05 });
  },
  // 랫풀다운 공 터짐: 맑은 "퐁!" + 반짝
  gymPop: () => {
    tone({ type: "sine", from: 520, to: 1300, dur: 0.07, vol: 0.3 });
    noise(0.04, 0.2, 6000);
    tone({ type: "triangle", from: 1760, dur: 0.1, vol: 0.12, delay: 0.05 });
  },
  // 벤치 프레스 한 번 밀기: 짧게 "흡" 올라가는 힘 소리
  gymPush: () => {
    tone({ type: "square", from: 140, to: 220, dur: 0.05, vol: 0.08 });
    noise(0.03, 0.08, 900);
  },
  // 힘 가득: 짧은 두 음
  gymFull: () => {
    tone({ type: "triangle", from: 988, dur: 0.06, vol: 0.14 });
    tone({ type: "triangle", from: 1319, dur: 0.08, vol: 0.12, delay: 0.05 });
  },
  // 바벨을 안전바에 내려놓음: 쇠 "철컹"
  gymRack: () => {
    noise(0.12, 0.4, 3500);
    tone({ type: "square", from: 330, to: 180, dur: 0.12, vol: 0.14 });
    tone({ type: "triangle", from: 1480, to: 1400, dur: 0.3, vol: 0.1, delay: 0.02 });
  },
  // 실수: 낮게 떨어지는 "삐-익"
  gymMiss: () => {
    tone({ type: "square", from: 300, to: 140, dur: 0.16, vol: 0.12 });
    tone({ type: "sine", from: 110, dur: 0.12, vol: 0.15 });
  },
  // 미니게임 끝: 올라가는 세 음
  gymEnd: () => {
    for (const [i, f] of [523, 659, 784].entries()) tone({ type: "triangle", from: f, dur: 0.16, vol: 0.2, delay: i * 0.09 });
    tone({ type: "sine", from: 1047, dur: 0.3, vol: 0.14, delay: 0.27 });
  },
  // 강화 한 단계: 위로 반짝
  gymUp: () => {
    tone({ type: "triangle", from: 784, to: 1175, dur: 0.1, vol: 0.18 });
    tone({ type: "sine", from: 1568, dur: 0.14, vol: 0.1, delay: 0.06 });
  },
};

export type GymSfx = keyof typeof GYM_SOUNDS;
