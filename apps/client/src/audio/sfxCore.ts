// 기본 효과음 (sound의 효과음 표에 합쳐짐, 2026-10-31 더 웅장·또렷하게): 소리마다 낮은 울림(몸통) + 또렷한 앞소리(딸깍·쉭) + 반짝임(높은 음)을 겹침
// 큰 소리(보스·클리어·계단)는 짧은 메아리를 더함 · 소리 출력 앞에 압축기(sound.unlockAudio)가 있어 겹쳐도 깨지지 않음
import { noise, tone } from "./sound";

/** 같은 소리를 조금 늦게·작게 한 번 더 (메아리) */
function echo(f: (delay: number, vol: number) => void, times = 2, gap = 0.11): void {
  for (let i = 0; i <= times; i++) f(i * gap, 0.55 ** i);
}

/** 화음 (밑음 + 장3도 + 5도 + 옥타브) */
function chord(root: number, dur: number, vol: number, delay = 0, type: OscillatorType = "triangle"): void {
  for (const k of [0, 4, 7, 12]) tone({ type, from: root * 2 ** (k / 12), dur, vol: vol * (k === 0 ? 1 : 0.7), delay });
}

export const CORE_SOUNDS = {
  // 휘두르기: 바람 가르는 "쉭" (높은 잡음이 짧게) + 낮은 바람
  swing: () => {
    noise(0.08, 0.2, 5200);
    noise(0.12, 0.1, 900);
    tone({ type: "sine", from: 520, to: 180, dur: 0.08, vol: 0.05 });
  },
  // 탄 쏘기: "퓻" 하고 떨어지는 음 + 딸깍
  shot: () => {
    tone({ type: "square", from: 1040, to: 380, dur: 0.07, vol: 0.1 });
    tone({ type: "sine", from: 260, to: 120, dur: 0.06, vol: 0.12 });
    noise(0.025, 0.15, 6000);
  },
  // 맞힘: 묵직한 "퍽" (낮은 쿵 + 짧은 타격 잡음 + 딸깍)
  hit: () => {
    tone({ type: "sine", from: 180, to: 60, dur: 0.09, vol: 0.32 });
    tone({ type: "square", from: 240, to: 120, dur: 0.04, vol: 0.1 });
    noise(0.05, 0.28, 2600);
  },
  // 처치: 터지는 "펑" + 아래로 무너지는 음 + 작은 반짝 두 점
  kill: () => {
    noise(0.18, 0.38, 1400);
    tone({ type: "sine", from: 140, to: 40, dur: 0.22, vol: 0.38 });
    tone({ type: "square", from: 420, to: 90, dur: 0.14, vol: 0.1 });
    tone({ type: "triangle", from: 1760, dur: 0.06, vol: 0.06, delay: 0.05 });
    tone({ type: "triangle", from: 2349, dur: 0.08, vol: 0.05, delay: 0.09 });
  },
  // 내가 맞음: 둔탁한 충격 + 어긋난 두 음(아픔) · 확실히 알아듣게
  hurt: () => {
    noise(0.16, 0.42, 700);
    tone({ type: "sine", from: 120, to: 45, dur: 0.22, vol: 0.45 });
    tone({ type: "sawtooth", from: 330, to: 110, dur: 0.18, vol: 0.14 });
    tone({ type: "sawtooth", from: 349, to: 116, dur: 0.18, vol: 0.12 });
  },
  // 돈: 맑은 동전 두 번 "띵-띠링" + 금속 울림
  coin: () => {
    tone({ type: "square", from: 988, dur: 0.05, vol: 0.1 });
    tone({ type: "square", from: 1319, dur: 0.16, vol: 0.1, delay: 0.05 });
    tone({ type: "sine", from: 2637, dur: 0.22, vol: 0.06, delay: 0.05 });
  },
  // 줍기: 위로 오르는 세 음 + 반짝
  pickup: () => {
    [523, 784, 1047].forEach((f, i) => tone({ type: "triangle", from: f, dur: 0.1, vol: 0.22, delay: i * 0.06 }));
    tone({ type: "sine", from: 2093, dur: 0.18, vol: 0.06, delay: 0.16 });
  },
  // 사기: 계산대 "찰칵" + 동전 쏟아짐 + 화음
  buy: () => {
    noise(0.04, 0.25, 4000);
    [659, 880, 1175, 1568].forEach((f, i) => tone({ type: "square", from: f, dur: 0.07, vol: 0.09, delay: 0.04 + i * 0.05 }));
    chord(523, 0.3, 0.07, 0.24);
  },
  // 사용 아이템: 마시는 "꿀꺽" 두 번 + 위로 차오르는 빛
  use: () => {
    tone({ type: "sine", from: 300, to: 180, dur: 0.07, vol: 0.2 });
    tone({ type: "sine", from: 320, to: 190, dur: 0.07, vol: 0.18, delay: 0.09 });
    tone({ type: "triangle", from: 400, to: 1200, dur: 0.28, vol: 0.18, delay: 0.14 });
  },
  // 계단: 내려가는 발걸음 넷 + 낮게 울리는 문
  stairs: () => {
    noise(0.05, 0.18, 1200);
    for (let i = 0; i < 4; i++) tone({ type: "triangle", from: 523 - i * 70, dur: 0.12, vol: 0.2, delay: i * 0.1 });
    tone({ type: "sine", from: 98, to: 65, dur: 0.6, vol: 0.3, delay: 0.38 });
  },
  // 보스 등장: 깊은 북 + 어긋난 금관 두 줄(불안) + 메아리
  boss: () => {
    echo((d, v) => tone({ type: "sine", from: 70, to: 40, dur: 0.5, vol: 0.5 * v, delay: d }), 2, 0.22);
    noise(0.5, 0.3, 300);
    for (const f of [110, 116, 165]) tone({ type: "sawtooth", from: f, dur: 1.1, vol: 0.13, delay: 0.1 });
    tone({ type: "square", from: 55, dur: 1.2, vol: 0.12, delay: 0.1 });
  },
  // 보스 쓰러짐: 큰 폭발 + 낮은 무너짐 + 오르는 승리 팡파르(화음)
  bossDown: () => {
    noise(0.8, 0.5, 600);
    tone({ type: "sine", from: 120, to: 30, dur: 0.9, vol: 0.5 });
    [392, 494, 587, 784].forEach((f, i) => tone({ type: "square", from: f, dur: 0.14, vol: 0.11, delay: 0.25 + i * 0.09 }));
    echo((d, v) => chord(523, 0.7, 0.09 * v, 0.62 + d), 2, 0.14);
  },
  // 업적: 반짝이는 오름 화음
  achievement: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone({ type: "square", from: f, dur: 0.12, vol: 0.09, delay: i * 0.07 }));
    chord(1047, 0.5, 0.06, 0.3, "sine");
  },
  // 쓰러짐: 길게 떨어지는 음 + 낮은 울림
  fall: () => {
    tone({ type: "triangle", from: 440, to: 55, dur: 1.0, vol: 0.3 });
    tone({ type: "sine", from: 110, to: 40, dur: 1.1, vol: 0.3, delay: 0.2 });
    noise(0.6, 0.15, 400);
  },
  // 클리어: 팡파르(오르는 음) + 큰 화음 + 메아리
  clear: () => {
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone({ type: "square", from: f, dur: 0.16, vol: 0.11, delay: i * 0.12 }));
    echo((d, v) => chord(523, 1.0, 0.1 * v, 0.74 + d), 2, 0.16);
    tone({ type: "sine", from: 131, dur: 1.2, vol: 0.25, delay: 0.74 });
  },
};
