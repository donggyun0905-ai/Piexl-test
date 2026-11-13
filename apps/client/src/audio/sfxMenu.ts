// 화면 효과음 (2026-11-13): 업적 넘기기 · 숙련도 레벨업 · 순위 오름(3위 안은 더 크게) · 닉네임 저장 · 일일 보상 받기 · 메인 로고 (언제 내는지는 각 화면, audio/uiSounds의 uiSfx)
import { tone } from "./sound";
import { bell, crackle, hiss, wobble } from "./synth";

/** 반짝이며 오르는 음들 */
const rise = (fs: number[], gap: number, vol: number, delay = 0, dur = 0.25) => fs.forEach((f, i) => bell(f, dur, vol, 2, 0.7, delay + i * gap));

export const MENU_SOUNDS = {
  // 업적 창 넘기기: 두꺼운 책장 "사락" + 작은 톡
  uiPage: () => {
    hiss(0.14, 0.09, { freq: 1800, to: 4500, q: 0.8, attack: 0.05 });
    hiss(0.05, 0.05, { type: "lowpass", freq: 600, attack: 0.01, delay: 0.1 });
    tone({ type: "sine", from: 500, to: 380, dur: 0.04, vol: 0.05, delay: 0.12 });
  },
  // 숙련도 레벨업: 낮은 북 + 오르는 다섯 음 + 화음
  uiLevelUp: () => {
    tone({ type: "sine", from: 110, to: 70, dur: 0.25, vol: 0.25 });
    rise([523, 659, 784, 1047, 1319], 0.06, 0.06);
    for (const k of [0, 4, 7]) bell(1047 * 2 ** (k / 12), 0.6, 0.04, 2, 0.4, 0.33);
  },
  // 순위 오름: 위로 솟는 바람 + 밝은 세 음
  uiRankUp: () => {
    hiss(0.3, 0.08, { freq: 500, to: 4000, q: 1, attack: 0.1 });
    rise([784, 988, 1319], 0.08, 0.07, 0.1, 0.35);
  },
  // 3위 안: 큰 팡파르 (북 + 금관 + 반짝임)
  uiTop3: () => {
    [0, 0.12].forEach((d) => tone({ type: "sine", from: 98, to: 60, dur: 0.2, vol: 0.3, delay: d }));
    [392, 523, 659, 784].forEach((f, i) => tone({ type: "sawtooth", from: f, dur: 0.16, vol: 0.06, delay: 0.24 + i * 0.09 }));
    for (const k of [0, 4, 7, 12]) bell(784 * 2 ** (k / 12), 1, 0.04, 2, 0.4, 0.6);
    crackle(0.6, 12, 0.06, 7000, 0.6);
  },
  // 닉네임 저장: 도장 "탁" + 확인 종
  uiSave: () => {
    tone({ type: "sine", from: 180, to: 90, dur: 0.07, vol: 0.2 });
    hiss(0.04, 0.12, { freq: 1500, q: 2, attack: 0.002 });
    bell(1319, 0.25, 0.05, 2, 0.6, 0.08);
  },
  // 일일 보상 받기: 쿠폰 종이 "샥" + 동전 짤랑 + 오르는 음
  uiReward: () => {
    hiss(0.1, 0.08, { type: "highpass", freq: 3500, attack: 0.02 });
    crackle(0.15, 7, 0.12, 5500, 0.05);
    rise([659, 880, 1175, 1568], 0.06, 0.05, 0.1);
  },
  // 메인 로고: 깊게 울리며 열리는 화음 + 반짝 흩날림
  uiLogo: () => {
    tone({ type: "sine", from: 65, to: 98, dur: 0.9, vol: 0.22 });
    hiss(1, 0.06, { freq: 400, to: 5000, q: 0.7, attack: 0.4 });
    for (const k of [0, 7, 12, 16]) bell(262 * 2 ** (k / 12), 1.4, 0.04, 2, 0.5, 0.3 + k * 0.01);
    rise([1568, 2093, 2637, 3136], 0.09, 0.025, 0.7);
  },
};
export type MenuSfx = keyof typeof MENU_SOUNDS;

/** 진영마다 음색 (캐릭터를 누를 때): 음 높이 f, 늦춤 d */
type Voice = (f: number, d: number) => void;
const VOICE: Record<string, Voice> = {
  ascalon: (f, d) => bell(f, 0.3, 0.06, 2, 0.6, d), // 성스러운 종
  terracore: (f, d) => tone({ type: "square", from: f, dur: 0.08, vol: 0.06, delay: d }), // 기계 삑
  virdia: (f, d) => tone({ type: "triangle", from: f, to: f * 1.02, dur: 0.2, vol: 0.09, delay: d }), // 피리
  helios: (f, d) => {
    tone({ type: "sawtooth", from: f, dur: 0.16, vol: 0.05, delay: d });
    hiss(0.1, 0.03, { freq: f * 3, q: 2, delay: d });
  }, // 불꽃 금관
  thalassia: (f, d) => wobble("sine", f, f, 0.25, 0.08, 6, f * 0.02, d), // 물결
  seongguk: (f, d) => bell(f, 0.3, 0.07, 1.41, 1.5, d), // 징·편종
  dawn: (f, d) => tone({ type: "triangle", from: f * 0.98, to: f, dur: 0.18, vol: 0.08, delay: d }), // 새벽 나팔
  silber: (f, d) => bell(f, 0.25, 0.05, 3.5, 0.8, d), // 은빛 오르골
  ashvar: (f, d) => wobble("sawtooth", f / 2, f / 2, 0.3, 0.06, 5, 3, d), // 어두운 울림
  akashic: (f, d) => bell(f, 0.4, 0.05, 2.76, 1.2, d), // 유리 종
  outsider: (f, d) => tone({ type: "square", from: f, to: f * 0.9, dur: 0.1, vol: 0.05, delay: d }),
  archive: (f, d) => {
    bell(f, 0.3, 0.05, 2, 0.6, d);
    hiss(0.08, 0.03, { type: "highpass", freq: 5000, delay: d });
  }, // 책장 + 종
};
const SCALE = [0, 2, 4, 7, 9, 12, 14];

/** 캐릭터를 누를 때 짧은 소리: 진영 음색 + 캐릭터 이름으로 정한 세 음 가락 (같은 캐릭터는 늘 같은 가락) */
export function charVoice(id: string, faction: string): void {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const v = VOICE[faction] ?? VOICE.akashic!;
  const root = 392 * 2 ** ((h % 5) / 12);
  for (let i = 0; i < 3; i++) v(root * 2 ** (SCALE[(h >>> (i * 3)) % SCALE.length]! / 12), i * 0.08);
}
