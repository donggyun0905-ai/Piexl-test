// 게임 중 알림 효과음 (2026-11-13): 문 잠김·열림 · 상자 열림 · 바닥 아이템 떨어짐(종류별) · 적 나타남 · 탄이 벽에 맞음 · 보호막 깨짐 · 막힌 타격(받아 넘김·무적·보호막) · 버프 끝 · 체력 꽉 참 · 스킬 다시 쓸 수 있음 (언제 내는지는 audio/runCues)
import { noise, tone } from "./sound";
import { bell, crackle, hiss, wobble } from "./synth";

export const RUN_SOUNDS = {
  // 문 잠김: 무거운 쇠문이 "쿵" 닫히고 빗장 "철컥"
  doorLock: () => {
    tone({ type: "sine", from: 90, to: 45, dur: 0.3, vol: 0.4 });
    noise(0.12, 0.3, 800);
    crackle(0.04, 3, 0.22, 2800, 0.12);
    bell(330, 0.25, 0.06, 1.41, 2, 0.13);
  },
  // 문 열림: 돌문이 "드르륵" 미끄러져 올라감
  doorOpen: () => {
    hiss(0.45, 0.14, { type: "lowpass", freq: 300, to: 900, attack: 0.05 });
    crackle(0.4, 10, 0.08, 900);
    tone({ type: "sine", from: 70, to: 55, dur: 0.4, vol: 0.18 });
  },
  // 상자 열림: 나무 뚜껑 "끼익" + 걸쇠 + 반짝이며 오르는 빛
  chestOpen: () => {
    crackle(0.02, 2, 0.2, 3000);
    wobble("sawtooth", 240, 380, 0.22, 0.05, 28, 25, 0.03);
    hiss(0.3, 0.06, { freq: 2000, to: 7000, q: 1, attack: 0.15, delay: 0.15 });
    [784, 988, 1175, 1568].forEach((f, i) => bell(f, 0.3, 0.05, 2, 0.7, 0.2 + i * 0.06));
  },
  // 동전 떨어짐: 바닥에 튀는 짤랑 두 번
  dropCoin: () => {
    bell(2349, 0.1, 0.05, 3.5, 0.8);
    bell(2093, 0.12, 0.04, 3.5, 0.8, 0.08);
  },
  // 무기 떨어짐: 쇠가 바닥에 "챙그랑"
  dropWeapon: () => {
    crackle(0.03, 2, 0.2, 4000);
    bell(620, 0.3, 0.07, 2.76, 2.5);
    bell(930, 0.2, 0.04, 2.76, 2, 0.06);
    tone({ type: "sine", from: 140, to: 80, dur: 0.08, vol: 0.12 });
  },
  // 패시브 떨어짐: 마법 반짝임이 쏟아짐
  dropPassive: () => {
    hiss(0.25, 0.05, { type: "highpass", freq: 6000, attack: 0.05 });
    [1319, 1760, 2349].forEach((f, i) => bell(f, 0.25, 0.04, 2, 0.6, i * 0.05));
  },
  // 사용 아이템 떨어짐: 유리병 "딸그락"
  dropUse: () => {
    bell(1760, 0.12, 0.05, 2.01, 1.2);
    bell(2200, 0.1, 0.03, 2.01, 1, 0.05);
  },
  // 적 나타남: 공간이 갈라지며 "휘융" + 낮은 퍽
  foeSpawn: () => {
    hiss(0.22, 0.1, { freq: 400, to: 2400, q: 3, attack: 0.15 });
    tone({ type: "sine", from: 200, to: 70, dur: 0.12, vol: 0.14, delay: 0.18 });
    noise(0.06, 0.12, 1200);
  },
  // 탄이 벽에 맞음: 작은 "틱" (흙먼지)
  wallHit: () => {
    hiss(0.04, 0.07, { freq: 2200, q: 2, attack: 0.002 });
    tone({ type: "sine", from: 300, to: 160, dur: 0.04, vol: 0.04 });
  },
  // 보호막 깨짐: 유리처럼 "쨍그랑" + 아래로 꺼짐
  shieldBreak: () => {
    crackle(0.2, 10, 0.2, 6000);
    [2637, 3136, 2349].forEach((f, i) => bell(f, 0.18, 0.05, 2.76, 1.2, i * 0.04));
    tone({ type: "triangle", from: 880, to: 220, dur: 0.3, vol: 0.08 });
  },
  // 막힌 타격 (받아 넘김·방패): 둔한 쇠 "깡"
  hitBlock: () => {
    bell(440, 0.2, 0.1, 1.41, 3);
    noise(0.03, 0.15, 3000);
  },
  // 무적인 적을 때림: 속 빈 쇠를 친 듯 "텅" + 튕겨 나가는 높은 울림 (피해가 안 들어감)
  hitImmune: () => {
    bell(523, 0.3, 0.1, 2.76, 1.5);
    bell(1568, 0.18, 0.04, 1.5, 0.5, 0.02);
    tone({ type: "triangle", from: 1800, to: 900, dur: 0.12, vol: 0.05, delay: 0.03 });
    noise(0.02, 0.12, 4000);
  },
  // 보호막·방패를 때림: 에너지 막이 "웅-퉁" 울림
  hitShield: () => {
    wobble("sine", 330, 260, 0.18, 0.1, 30, 25);
    hiss(0.08, 0.08, { freq: 2500, to: 1200, q: 3, attack: 0.002 });
    bell(990, 0.12, 0.04, 2, 0.8, 0.02);
  },
  // 버프 끝: 바람 빠지듯 내려가는 두 음
  buffEnd: () => {
    tone({ type: "triangle", from: 880, to: 700, dur: 0.12, vol: 0.06 });
    tone({ type: "triangle", from: 660, to: 500, dur: 0.18, vol: 0.05, delay: 0.1 });
    hiss(0.2, 0.03, { freq: 1500, to: 500, q: 1, attack: 0.03 });
  },
  // 체력 꽉 참: 밝게 오르는 반짝 둘
  hpFull: () => {
    bell(1047, 0.2, 0.05, 2, 0.6);
    bell(1568, 0.3, 0.05, 2, 0.6, 0.08);
  },
  // 스킬 다시 쓸 수 있음: 칼을 뽑듯 맑은 "칭"
  cdReady: () => {
    hiss(0.05, 0.06, { type: "highpass", freq: 5000, to: 9000, attack: 0.01 });
    bell(1976, 0.25, 0.06, 3.01, 1.2, 0.03);
  },
};
export type RunSfx = keyof typeof RUN_SOUNDS;
