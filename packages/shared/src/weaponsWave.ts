// 웨이브(탈라시아, 히든 아님): 물을 상상만으로 마음대로 빚는 서핑 소녀. 누르면 물결 초승달(뚫고 나가며 커짐)
// 때릴 때마다 '상상력'이 차고, 가득 차면 가진 물의 기술(전용 패시브 30개가 하나씩 줌) 가운데 하나가 무작위로 나감
// 무기 = 상상의 도구 6가지. 계산은 sim/wave·waveSkills*
import type { WeaponDef } from "./content";

/** 상상의 도구: board 서핑보드 · shell 소라 고둥 · prism 물방울 프리즘 · crown 만조의 왕관 · ribbon 물결 리본 · dream 상상의 물감 */
export type WaveKind = "board" | "shell" | "prism" | "crown" | "ribbon" | "dream";

/** 도구 하나: 종류 · 상상력 차는 배율 · 기술 피해 배율 · 기술 크기 배율 · 두 번째 기술 확률 · 초승달 수 · 다음 기술 미리 보기(대시로 바꿈) */
export interface WaveStyle {
  wave: WaveKind;
  gauge?: number;
  skill?: number;
  big?: number;
  echo?: number;
  crests?: number;
  dream?: boolean;
}

const W = (id: string, damageMul: number, attackSpeed: number, wave: WaveStyle) =>
  ({ id, kind: "muse", damageMul, attackSpeed, range: 150, projectileSpeed: 5, wave, exclusive: "wave" }) as const;

export const WAVE_WEAPONS = {
  /** 파도 서핑보드 (처음 무기): 고른 성능 */
  wvBoard: W("wvBoard", 1, 1, { wave: "board" }),
  /** 소라 고둥: 상상력이 1.5배 빨리 참, 초승달은 약함 */
  wvShell: W("wvShell", 0.85, 1, { wave: "shell", gauge: 1.5 }),
  /** 물방울 프리즘: 기술이 나갈 때 35% 확률로 다른 기술 하나가 같이 나감 (70% 세기) */
  wvPrism: W("wvPrism", 0.9, 1, { wave: "prism", echo: 0.35 }),
  /** 만조의 왕관: 기술 피해 1.35배·크기 1.15배, 느리게 때림 */
  wvCrown: W("wvCrown", 1, 0.85, { wave: "crown", skill: 1.35, big: 1.15 }),
  /** 물결 리본: 초승달이 셋으로 펼쳐짐 (하나는 약함) */
  wvRibbon: W("wvRibbon", 0.8, 1, { wave: "ribbon", crests: 3 }),
  /** 상상의 물감: 다음에 나갈 기술이 머리 위에 보이고, 대시하면 다른 기술로 바뀜 · 기술 피해 1.1배 */
  wvDream: W("wvDream", 0.95, 1, { wave: "dream", dream: true, skill: 1.1 }),
} as const satisfies Record<string, WeaponDef>;

/** 웨이브 수치 (배율 1 = 100%, 시간은 틱(60 = 1초), 거리는 픽셀) */
export const WAVE = {
  /** 물결 초승달: 공격 간격 배율 · 피해 배율 · 빠르기 · 날아가는 틱 · 처음·끝 반지름 · 리본 펼침 각(라디안) */
  crestTime: 0.55,
  crestMul: 0.8,
  crestSpeed: 4.2,
  crestLife: 36,
  crestR0: 8,
  crestR1: 20,
  ribbonSpread: 0.35,
  /** 상상력: 가득 · 한 번 때릴 때 · 가진 기술 하나마다 더 참 */
  gaugeMax: 100,
  gain: 30,
  gainPer: 2.5,
  /** 기술이 하나도 없을 때 나가는 물보라: 반지름 · 피해 배율 */
  splashR: 40,
  splashMul: 0.9,
  /** 물발자국: 몇 틱마다 자리를 적어 둘지 · 몇 개까지 */
  stepEvery: 4,
  stepKeep: 30,
  /** 물거울 분신의 초승달 피해 배율 · 물안개·만조·물의 날개 이동 속도 배율 */
  mirrorMul: 0.7,
  wingsMove: 1.25,
  floodMove: 1.2,
};
