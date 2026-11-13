// 메뉴·상점·뽑기 효과음 (2026-11-13): 버튼 종류마다 다른 "톡" · 창 열기 · 탭 · 켜고 끄기 · 안 됨 · 사기·입기 · 봉투 뜯기·카드 뒤집기·등급별 등장 (언제 내는지는 audio/uiSounds)
import { tone } from "./sound";
import { bell, crackle, hiss } from "./synth";

/** 반짝이며 오르는 음들 */
const rise = (fs: number[], gap: number, vol: number, delay = 0) => fs.forEach((f, i) => bell(f, 0.22, vol, 2, 0.7, delay + i * gap));

export const UI_SOUNDS = {
  // 보통 버튼: 나무를 두드리는 작은 "톡"
  uiClick: () => {
    hiss(0.03, 0.12, { freq: 2600, q: 3, attack: 0.001 });
    tone({ type: "sine", from: 620, to: 420, dur: 0.05, vol: 0.12 });
  },
  // 확인·시작 버튼: 또렷하게 "토독" + 맑은 울림
  uiConfirm: () => {
    tone({ type: "sine", from: 520, to: 380, dur: 0.04, vol: 0.12 });
    tone({ type: "sine", from: 780, to: 600, dur: 0.05, vol: 0.12, delay: 0.05 });
    bell(1568, 0.18, 0.04, 2, 0.6, 0.06);
  },
  // 닫기·뒤로: 아래로 내려앉는 부드러운 "툭"
  uiBack: () => {
    hiss(0.05, 0.08, { freq: 1600, to: 600, q: 2, attack: 0.002 });
    tone({ type: "triangle", from: 520, to: 300, dur: 0.07, vol: 0.1 });
  },
  // 탭 넘기기: 종이 넘기는 "샥"
  uiTab: () => {
    hiss(0.07, 0.1, { type: "highpass", freq: 3500, to: 6000, attack: 0.02 });
    tone({ type: "sine", from: 900, dur: 0.03, vol: 0.05, delay: 0.03 });
  },
  // 켜기 "딸깍(위로)" · 끄기 "딸깍(아래로)"
  uiOn: () => {
    crackle(0.01, 1, 0.2, 3500);
    tone({ type: "triangle", from: 700, to: 1050, dur: 0.06, vol: 0.09 });
  },
  uiOff: () => {
    crackle(0.01, 1, 0.2, 2500);
    tone({ type: "triangle", from: 700, to: 460, dur: 0.06, vol: 0.09 });
  },
  // 창 열림: 위로 쓸어 올라오는 바람 + 작은 종
  uiOpen: () => {
    hiss(0.14, 0.07, { freq: 600, to: 2400, q: 1.5, attack: 0.06 });
    bell(1175, 0.2, 0.04, 2, 0.5, 0.08);
  },
  // 안 됨 (쿠폰 모자람 등): 낮게 두 번 "부붕"
  uiDeny: () => [0, 0.1].forEach((d) => tone({ type: "square", from: 150, to: 120, dur: 0.08, vol: 0.08, delay: d })),
  // 상점에서 사기: 동전 짤랑 + 계산대 종 + 밝은 화음
  uiBuy: () => {
    crackle(0.12, 6, 0.16, 5200);
    bell(2093, 0.3, 0.07, 3.5, 0.8, 0.06);
    rise([523, 659, 784, 1047], 0.05, 0.05, 0.12);
  },
  // 입기·바꾸기: 옷 스치는 "사락" + 걸쇠 "찰칵"
  uiEquip: () => {
    hiss(0.12, 0.08, { freq: 2200, to: 1200, q: 1, attack: 0.04 });
    crackle(0.02, 2, 0.18, 4000, 0.1);
    bell(1319, 0.14, 0.04, 2, 0.5, 0.12);
  },
  // 봉투 절취선 쓸기: 종이 찢기는 "지익" (짧게 여러 번 이어짐)
  gachaRip: () => {
    hiss(0.06, 0.12, { freq: 3000 + Math.random() * 1500, q: 2, attack: 0.004 });
    crackle(0.05, 2, 0.1, 5000);
  },
  // 봉투가 뜯겨 날아감: "부욱" + 반짝 오름
  gachaOpen: () => {
    hiss(0.25, 0.2, { freq: 1500, to: 5000, q: 1.2, attack: 0.01 });
    tone({ type: "sine", from: 200, to: 90, dur: 0.15, vol: 0.18 });
    rise([784, 988, 1175, 1568, 1976], 0.05, 0.04, 0.15);
  },
  // 카드가 깔림: 짧은 "착" (카드마다)
  gachaDeal: () => hiss(0.04, 0.1, { type: "highpass", freq: 4000, attack: 0.002 }),
  // 카드 빛남 → 뒤집힘: 휙 넘어가는 바람
  gachaFlip: () => {
    hiss(0.12, 0.1, { freq: 1200, to: 3800, q: 1.5, attack: 0.03 });
    tone({ type: "sine", from: 300, to: 600, dur: 0.08, vol: 0.06 });
  },
  // 등급별 등장: 쿠폰·스킨(보라) 맑은 세 음 · 이벤트 코인(초록) 동전 쏟아짐 · 한정 스킨(무지개) 큰 팡파르
  gachaPurple: () => rise([659, 880, 1319], 0.07, 0.07),
  gachaGreen: () => {
    crackle(0.25, 10, 0.12, 5500);
    rise([784, 1047, 1319], 0.06, 0.05, 0.05);
  },
  gachaRainbow: () => {
    tone({ type: "sine", from: 65, to: 98, dur: 0.6, vol: 0.25 });
    hiss(0.8, 0.12, { freq: 800, to: 6000, q: 0.8, attack: 0.2 });
    rise([523, 659, 784, 1047, 1319, 1568, 2093], 0.07, 0.07, 0.1);
    for (const k of [0, 4, 7, 12]) bell(523 * 2 ** (k / 12), 1.2, 0.05, 2, 0.4, 0.62);
  },
};
export type UiSfx = keyof typeof UI_SOUNDS;
