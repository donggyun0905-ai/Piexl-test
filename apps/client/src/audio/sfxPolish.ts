// 다듬기 효과음 (2026-11-12): 무기 종류에 맞는 공격 소리 · 대시 · 회복 · 방 정리 · 위험 체력 · 메뉴 버튼 (언제 내는지는 audio/polish)
import { noise, tone } from "./sound";

export const POLISH_SOUNDS = {
  // 검: 쇠가 바람을 가르는 "쉬잉"
  wpBlade: () => {
    noise(0.09, 0.26, 6500);
    noise(0.1, 0.1, 1000);
    tone({ type: "triangle", from: 2600, to: 1400, dur: 0.09, vol: 0.07 });
  },
  // 가벼운 칼·단검: 짧고 높은 "칫"
  wpLight: () => {
    noise(0.05, 0.22, 8000);
    tone({ type: "triangle", from: 3200, to: 2200, dur: 0.05, vol: 0.06 });
  },
  // 망치·도끼: 묵직한 "부웅"
  wpHeavy: () => {
    noise(0.2, 0.3, 1600);
    noise(0.12, 0.16, 500);
    tone({ type: "sine", from: 200, to: 70, dur: 0.2, vol: 0.22 });
  },
  // 창: 앞으로 찌르는 "슉"
  wpThrust: () => {
    noise(0.06, 0.24, 7000);
    tone({ type: "sawtooth", from: 900, to: 2000, dur: 0.06, vol: 0.05 });
  },
  // 주먹·발톱: 짧은 "퍽"
  wpFist: () => {
    tone({ type: "sine", from: 220, to: 90, dur: 0.07, vol: 0.3 });
    noise(0.04, 0.25, 1800);
  },
  // 활: 시위 "퉁" + 화살 바람
  wpBow: () => {
    tone({ type: "triangle", from: 320, to: 190, dur: 0.14, vol: 0.25 });
    tone({ type: "triangle", from: 640, to: 380, dur: 0.1, vol: 0.1 });
    noise(0.1, 0.12, 5000);
  },
  // 던지기: 돌아가며 날아가는 "휙"
  wpThrow: () => {
    noise(0.12, 0.2, 3800);
    tone({ type: "sine", from: 700, to: 300, dur: 0.12, vol: 0.08 });
  },
  // 총: "탕"
  wpGun: () => {
    noise(0.09, 0.5, 4200);
    tone({ type: "square", from: 300, to: 70, dur: 0.09, vol: 0.25 });
    tone({ type: "sine", from: 110, to: 45, dur: 0.14, vol: 0.3 });
  },
  // 지팡이·마법: 위로 차오르는 반짝임
  wpMagic: () => {
    tone({ type: "sine", from: 520, to: 1320, dur: 0.14, vol: 0.16 });
    tone({ type: "triangle", from: 1320, to: 1980, dur: 0.16, vol: 0.09, delay: 0.05 });
    noise(0.06, 0.1, 8000);
  },
  // 폭탄: 낮게 쏘아 올리는 "퉁"
  wpBoom: () => {
    tone({ type: "sine", from: 160, to: 50, dur: 0.16, vol: 0.4 });
    noise(0.12, 0.3, 900);
  },
  // 대시: 바람을 가르고 나가는 "슈욱"
  dash: () => {
    noise(0.14, 0.24, 2400);
    tone({ type: "sine", from: 300, to: 900, dur: 0.1, vol: 0.08 });
  },
  // 회복: 부드럽게 오르는 세 음
  heal: () => [659, 880, 1319].forEach((f, i) => tone({ type: "sine", from: f, dur: 0.16, vol: 0.16, delay: i * 0.07 })),
  // 방 정리: 잠금이 풀리는 "철컥" + 밝은 세 음 + 낮은 울림
  roomClear: () => {
    noise(0.03, 0.3, 5000);
    [392, 587, 784].forEach((f, i) => tone({ type: "triangle", from: f, dur: i === 2 ? 0.3 : 0.12, vol: 0.2, delay: i * 0.1 }));
    tone({ type: "sine", from: 98, dur: 0.4, vol: 0.25 });
  },
  // 위험 체력: 심장 소리 "쿵-쿵"
  lowHp: () => {
    tone({ type: "sine", from: 70, to: 50, dur: 0.1, vol: 0.5 });
    tone({ type: "sine", from: 64, to: 46, dur: 0.12, vol: 0.4, delay: 0.16 });
  },
  // 메뉴 버튼: 작은 "톡"
  uiClick: () => {
    tone({ type: "square", from: 880, dur: 0.03, vol: 0.07 });
    tone({ type: "triangle", from: 1320, dur: 0.05, vol: 0.06, delay: 0.02 });
  },
};
export type PolishSfx = keyof typeof POLISH_SOUNDS;
