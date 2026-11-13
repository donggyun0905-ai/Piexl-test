// 상태이상 효과음 (2026-11-13): 지속 피해 16종이 들어갈 때마다 종류별로 다른 소리 · 경직·빙결·얼음 깨짐·느려짐·속박·공포 걸릴 때 (언제 내는지는 audio/statusSounds)
// 타격음보다 작게 · 짧게 (자주 나서 귀가 피곤하지 않게)
import { noise, tone } from "./sound";
import { bell, crackle, hiss, wobble } from "./synth";

export const STATUS_SOUNDS = {
  // 화상: 지글지글 타는 소리 (불꽃 쏴 + 타닥 튐)
  stBurn: () => {
    hiss(0.22, 0.12, { type: "highpass", freq: 2500, attack: 0.03 });
    crackle(0.2, 5, 0.18, 3200);
    hiss(0.18, 0.08, { freq: 600, to: 300, q: 2, attack: 0.02 });
  },
  // 업화: 더 낮고 굵게 화르륵
  stHellfire: () => {
    hiss(0.3, 0.16, { type: "lowpass", freq: 900, to: 400, attack: 0.04 });
    crackle(0.25, 6, 0.16, 1600);
    tone({ type: "sine", from: 110, to: 70, dur: 0.22, vol: 0.12 });
  },
  // 청염: 푸르게 쉬익 타오름 (높게 올라가는 바람 + 맑은 떨림)
  stBlueflame: () => {
    hiss(0.24, 0.12, { freq: 1800, to: 4200, q: 3, attack: 0.03 });
    crackle(0.18, 3, 0.12, 5000);
    bell(1320, 0.18, 0.04, 2.01, 1);
  },
  // 매혹: 달콤하게 울리는 두 음 (위로 미끄러짐)
  stCharm: () => {
    bell(988, 0.22, 0.05, 2, 1);
    tone({ type: "sine", from: 660, to: 990, dur: 0.2, vol: 0.06 });
  },
  // 출혈: 축축하게 찢기는 "츄악" + 떨어지는 방울
  stBleed: () => {
    hiss(0.08, 0.2, { freq: 1400, to: 500, q: 3, attack: 0.004 });
    tone({ type: "sine", from: 900, to: 350, dur: 0.06, vol: 0.08, delay: 0.07 });
    tone({ type: "sine", from: 700, to: 260, dur: 0.06, vol: 0.06, delay: 0.14 });
  },
  // 독: 보글보글 거품 셋
  stPoison: () => [0, 0.06, 0.13].forEach((d, i) => tone({ type: "sine", from: 300 + i * 90, to: 700 + i * 160, dur: 0.05, vol: 0.09, delay: d })),
  // 부패: 질척하게 녹아내림 (낮은 거품 + 탁한 잡음)
  stRot: () => {
    [0, 0.08].forEach((d) => tone({ type: "sine", from: 180, to: 420, dur: 0.07, vol: 0.1, delay: d }));
    hiss(0.2, 0.08, { type: "lowpass", freq: 500, attack: 0.04 });
  },
  // 감전: 지지직 전기
  stShock: () => {
    crackle(0.14, 8, 0.2, 4500);
    tone({ type: "sawtooth", from: 120, to: 90, dur: 0.12, vol: 0.06 });
  },
  // 폭풍: 휘몰아치는 바람 + 짧은 번쩍
  stStorm: () => {
    hiss(0.24, 0.13, { freq: 700, to: 2200, q: 2, attack: 0.05 });
    crackle(0.08, 3, 0.15, 6000, 0.05);
  },
  // 냉기: 얼음에 금 가는 "찌직" + 차가운 반짝
  stFrost: () => {
    crackle(0.1, 5, 0.18, 7000);
    bell(2093, 0.16, 0.05, 2.76, 1.5);
  },
  // 해일: 물 튀는 "촤"
  stTide: () => {
    hiss(0.16, 0.16, { freq: 1200, to: 500, q: 1.5, attack: 0.01 });
    tone({ type: "sine", from: 500, to: 1100, dur: 0.05, vol: 0.06, delay: 0.04 });
  },
  // 저주: 낮게 울렁이는 웅웅
  stCurse: () => wobble("triangle", 220, 160, 0.3, 0.09, 9, 18),
  // 죽음: 바닥을 울리는 낮은 종 + 숨소리
  stDeath: () => {
    bell(98, 0.4, 0.14, 1.41, 3);
    hiss(0.3, 0.05, { freq: 400, q: 2, attack: 0.1 });
  },
  // 공허탄: 빨려 들어가는 "우웅" (아래로 꺼짐)
  stVoidbolt: () => {
    wobble("sine", 320, 90, 0.22, 0.1, 22, 12);
    hiss(0.15, 0.06, { freq: 3000, to: 400, q: 4, attack: 0.03 });
  },
  // 황금: 동전 부딪히는 짤랑
  stGold: () => {
    bell(1760, 0.12, 0.06, 3.5, 0.8);
    bell(2349, 0.14, 0.05, 3.5, 0.8, 0.05);
  },
  // 광휘: 맑게 반짝이는 성스러운 종
  stRadiance: () => {
    bell(1568, 0.25, 0.06, 2, 0.6);
    tone({ type: "sine", from: 3136, dur: 0.2, vol: 0.03, delay: 0.04 });
  },
  // 달빛: 고요한 유리 종 하나
  stMoon: () => bell(1175, 0.3, 0.06, 3.01, 0.9),
  // 경직(기절): 머리 위 별 "띠잉~" (떨림)
  stStun: () => {
    tone({ type: "sine", from: 140, to: 80, dur: 0.08, vol: 0.14 });
    wobble("triangle", 1320, 1100, 0.32, 0.07, 14, 60, 0.03);
  },
  // 빙결: 얼어붙는 "쩌억" (쏴 하고 굳는 잡음 + 낮은 금 + 차가운 종)
  stFreeze: () => {
    hiss(0.25, 0.14, { type: "highpass", freq: 3000, to: 8000, attack: 0.08 });
    crackle(0.18, 6, 0.16, 5500, 0.05);
    bell(1760, 0.3, 0.06, 2.76, 2, 0.12);
  },
  // 얼음 깨짐: 와장창 (높은 파편이 흩어짐 + 쿵)
  stShatter: () => {
    noise(0.05, 0.25, 6000);
    crackle(0.22, 12, 0.22, 6500);
    [2637, 3520, 3136].forEach((f, i) => bell(f, 0.12, 0.05, 2.76, 1, 0.02 + i * 0.05));
    tone({ type: "sine", from: 160, to: 70, dur: 0.1, vol: 0.14 });
  },
  // 느려짐: 아래로 늘어지는 "우우웅"
  stSlow: () => wobble("triangle", 520, 180, 0.3, 0.07, 6, 15),
  // 속박: 덩굴·사슬이 감기는 "촤라락"
  stRoot: () => {
    crackle(0.16, 7, 0.14, 2200);
    tone({ type: "triangle", from: 300, to: 180, dur: 0.12, vol: 0.08, delay: 0.1 });
  },
  // 공포: 소름 끼치는 흔들리는 고음
  stFear: () => {
    wobble("sine", 880, 830, 0.3, 0.06, 7, 40);
    wobble("sine", 932, 870, 0.3, 0.04, 6, 40);
  },
};
export type StatusSfx = keyof typeof STATUS_SOUNDS;
