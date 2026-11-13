// 아스칼론 캐릭터 효과음 (sound의 효과음 표에 합쳐짐): 추적자 · 잊혀진 자 · 잔영 · 방랑객
import { bell, hiss } from "./synth";
import { noise, tone } from "./sound";

export const ASCALON_SOUNDS = {
  // 추적자: 평소 저격 (짧고 날카로운 총성) · 암습 저격 (크게 "탕!" + 메아리) · 강력한 한방 (묵직한 폭음 + 긴 여운)
  rifle: () => {
    noise(0.12, 0.5, 4200);
    tone({ type: "square", from: 300, to: 70, dur: 0.1, vol: 0.18 });
  },
  snipe: () => {
    noise(0.28, 0.95, 5200);
    tone({ type: "sawtooth", from: 180, to: 38, dur: 0.32, vol: 0.4 });
    noise(0.4, 0.22, 900);
    noise(0.3, 0.12, 2400);
  },
  power: () => {
    noise(0.6, 1, 2600);
    tone({ type: "sawtooth", from: 120, to: 26, dur: 0.8, vol: 0.5 });
    tone({ type: "sine", from: 60, to: 30, dur: 1.1, vol: 0.5 });
    tone({ type: "triangle", from: 1600, to: 400, dur: 0.25, vol: 0.2 });
  },
  // 잊혀진 자: 빛 공격 (맑은 종소리) · 신족 (위로 오르는 화음 + 여운)
  chime: () => {
    tone({ type: "sine", from: 1760, to: 1700, dur: 0.12, vol: 0.09 });
    tone({ type: "triangle", from: 2640, to: 2600, dur: 0.08, vol: 0.05 });
  },
  awaken: () => {
    for (const [i, f] of [523, 659, 784, 1047, 1319].entries()) tone({ type: "sine", from: f, to: f * 1.01, dur: 0.9, vol: 0.12, delay: i * 0.07 });
    tone({ type: "triangle", from: 200, to: 800, dur: 0.6, vol: 0.15 });
    noise(0.5, 0.12, 6000);
  },
  // 잔영: 단검 (짧고 높은 쉭) · 순간이동 (낮게 빨려 들어가는 소리 + 칼 울림)
  slice: () => { hiss(0.05, 0.18, { type: "highpass", freq: 5000, to: 9000, attack: 0.003 }); tone({ type: "triangle", from: 2800, to: 1800, dur: 0.04, vol: 0.03 }); },
  // 방랑객: 카타나 (묵직한 바람 가르는 소리) · 예리함 (맑고 날카로운 쇳소리 "칭") · 천검란 (칼바람 여러 겹)
  katana: () => {
    noise(0.1, 0.3, 2600);
    tone({ type: "triangle", from: 1200, to: 600, dur: 0.06, vol: 0.06 });
  },
  // 바늘 같은 일직선 칼선: 아주 높고 짧게 "삥"
  ping: () => {
    tone({ type: "square", from: 4200, to: 3900, dur: 0.07, vol: 0.05 });
    tone({ type: "sine", from: 6400, to: 6200, dur: 0.12, vol: 0.04 });
    noise(0.02, 0.12, 10000);
  },
  sharp: () => {
    tone({ type: "triangle", from: 3800, to: 3700, dur: 0.18, vol: 0.12 });
    tone({ type: "sine", from: 5200, to: 5100, dur: 0.25, vol: 0.06, delay: 0.01 });
    noise(0.03, 0.2, 9000);
  },
  tempest: () => {
    for (let i = 0; i < 4; i++) noise(0.08, 0.35, 3000 + i * 900);
    tone({ type: "triangle", from: 2800, to: 2600, dur: 0.3, vol: 0.08 });
  },
  // 영사: 실 (아주 작고 높게 튕기는 소리) · 찢기 ("띵" 울리는 현 + 빠르게 풀리는 실) · 장전 (실 감는 소리)
  string: () => { tone({ type: "triangle", from: 2600, to: 2500, dur: 0.05, vol: 0.03 }); bell(2600, 0.08, 0.02, 1, 0.4); },
  ting: () => {
    tone({ type: "triangle", from: 1568, to: 1560, dur: 0.5, vol: 0.14 });
    tone({ type: "sine", from: 3136, to: 3130, dur: 0.35, vol: 0.06 });
    noise(0.12, 0.15, 6500);
  },
  spool: () => {
    for (let i = 0; i < 3; i++) noise(0.04, 0.08, 4000 + i * 600);
  },
};
