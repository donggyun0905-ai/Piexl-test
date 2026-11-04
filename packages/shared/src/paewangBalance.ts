// 패왕전 한정 캐릭터 보정 (던전·다른 모드에는 없음): 체력·공격력 배율. AI끼리 무작위 1대1을 많이 돌려 승률이 너무 높거나 낮지 않게 맞춤 (스킬을 자주 쓰는 경우 7 : 가끔 쓰는 경우 3으로 섞어 봄)
import { CHARACTER_IDS, type CharacterId } from "./characters";

/** 배율 (1 = 그대로). 관리자 '패왕전 수치 · 캐릭터 능력치'에서 바꿈 */
export interface PwCharTune {
  hp?: number;
  dmg?: number;
  /** 받는 피해 배율 (피해가 공격력으로 정해지지 않는 캐릭터용) */
  taken?: number;
  /** 스킬 피해 · 공격 속도 · 사거리 · 이동 속도 */
  skill?: number;
  rate?: number;
  range?: number;
  move?: number;
}

export const PW_CHAR: Partial<Record<CharacterId, PwCharTune>> = {
  abandoned: { hp: 1.18, dmg: 1.18, taken: 0.19 },
  apostle: { hp: 1.19, dmg: 1.19, taken: 1.22 },
  artifacter: { hp: 1.46, dmg: 1.46, taken: 0.75 },
  automata: { hp: 0.85, dmg: 0.85, taken: 0.45 },
  beast: { hp: 0.96, dmg: 0.96, taken: 0.7 },
  bedouin: { hp: 1.36, dmg: 1.36, taken: 0.77 },
  bomber: { hp: 1.24, dmg: 1.24, taken: 1.39 },
  brawler: { hp: 0.97, dmg: 0.97, taken: 1.47 },
  byeonhui: { hp: 0.88, dmg: 0.88, taken: 1.06 },
  chronomancer: { hp: 1.66, dmg: 1.66, taken: 0.95 },
  doctor: { hp: 1.23, dmg: 1.23, taken: 1.35 },
  drifter: { hp: 1.4, dmg: 1.4, taken: 0.86 },
  eater: { hp: 1.36, dmg: 1.36, taken: 1.33 },
  elder: { hp: 1.33, dmg: 1.33, taken: 1.59 },
  elementalist: { hp: 1.46, dmg: 1.46, taken: 1.3 },
  engineer: { hp: 0.95, dmg: 0.95, taken: 0.93 },
  fly: { hp: 1.05, dmg: 1.05, taken: 1.06 },
  forgotten: { hp: 0.8, dmg: 0.8, taken: 1.27 },
  general: { hp: 1.33, dmg: 1.33, taken: 1.35 },
  gunner: { hp: 1.86, dmg: 1.86, taken: 0.6 },
  idra: { hp: 1.47, dmg: 1.47, taken: 1.57 },
  imugi: { hp: 1.41, dmg: 1.41, taken: 1.09 },
  mage: { hp: 1.49, dmg: 1.49, taken: 1.4 },
  mukin: { hp: 0.76, dmg: 0.76, taken: 1.84 },
  mystic: { hp: 1.44, dmg: 1.44, taken: 1.18 },
  ninja: { hp: 1.6, dmg: 1.6, taken: 1.04 },
  novice: { hp: 1.11, dmg: 1.11, taken: 5.75 },
  oni: { hp: 1.25, dmg: 1.25, taken: 1.22 },
  plague: { hp: 0.86, dmg: 0.86, taken: 0.84 },
  punk: { hp: 1.28, dmg: 1.28, taken: 1.28 },
  collector: { hp: 1.2, dmg: 1.2, taken: 1 },
  remnant: { hp: 1.55, dmg: 1.55, taken: 0.32 },
  ren: { hp: 1.34, dmg: 1.34, taken: 1.21 },
  rider: { hp: 1.59, dmg: 1.59, taken: 1.19 },
  samyeol: { hp: 1.13, dmg: 1.13, taken: 1.3 },
  silk: { hp: 1.19, dmg: 1.19, taken: 0.64 },
  pungryu: { hp: 1.2, dmg: 1.2, taken: 1 },
  slayer: { hp: 0.52, dmg: 0.52, taken: 0.23 },
  spiritist: { hp: 0.84, dmg: 0.84, taken: 0.73 },
  summoner: { hp: 1.08, dmg: 1.08, taken: 0.72 },
  titan: { hp: 0.97, dmg: 0.97, taken: 1.04 },
  tracker: { hp: 1.62, dmg: 1.62, taken: 0.97 },
  wanderer: { hp: 1.1, dmg: 1.1, taken: 1.03 },
  warden: { hp: 1.12, dmg: 1.12, taken: 1.33 },
};

// 관리자에서 모든 캐릭터의 모든 배율을 고를 수 있게 빈 값은 1로 채움
for (const c of CHARACTER_IDS) PW_CHAR[c] = { hp: 1, dmg: 1, taken: 1, skill: 1, rate: 1, range: 1, move: 1, ...PW_CHAR[c] };
