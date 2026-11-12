// 패왕전 한정 캐릭터 보정 (던전·다른 모드에는 없음): 체력·공격력 배율. 2026-11-10 전체 72명 AI 1대1 리그전(대결마다 2판, 2,556대결)을 두 번 돌려 모두 다시 맞춤 (공격력 ×k · 받는 피해 ÷k). AI끼리 무작위 1대1을 많이 돌려 승률이 너무 높거나 낮지 않게 맞춤 (스킬을 자주 쓰는 경우 7 : 가끔 쓰는 경우 3으로 섞어 봄)
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
  abandoned: { hp: 1.18, dmg: 0.99, taken: 0.22 },
  apostle: { hp: 1.19, dmg: 1.3, taken: 1.12 },
  artifacter: { hp: 1.46, dmg: 1.36, taken: 0.81 },
  automata: { hp: 0.85, dmg: 0.76, taken: 0.5 },
  beast: { hp: 0.96, dmg: 1.17, taken: 0.58 },
  bedouin: { hp: 1.36, dmg: 1.36, taken: 0.77 },
  bomber: { hp: 1.24, dmg: 1.61, taken: 1.07 },
  brawler: { hp: 0.97, dmg: 1.28, taken: 1.12 },
  byeonhui: { hp: 0.88, dmg: 0.97, taken: 0.96 },
  chronomancer: { hp: 1.66, dmg: 1.39, taken: 1.13 },
  doctor: { hp: 1.23, dmg: 1.35, taken: 1.23 },
  drifter: { hp: 1.4, dmg: 1.28, taken: 0.94 },
  eater: { hp: 1.36, dmg: 1.25, taken: 1.43 },
  elder: { hp: 1.33, dmg: 1.43, taken: 1.49 },
  elementalist: { hp: 1.46, dmg: 1.57, taken: 1.21 },
  engineer: { hp: 0.95, dmg: 1.0, taken: 0.89 },
  fly: { hp: 1.05, dmg: 1.13, taken: 0.98 },
  forgotten: { hp: 0.8, dmg: 1.03, taken: 0.99 },
  general: { hp: 1.33, dmg: 1.33, taken: 1.35 },
  gunner: { hp: 1.86, dmg: 1.81, taken: 0.62 },
  idra: { hp: 1.47, dmg: 1.41, taken: 1.63 },
  imugi: { hp: 1.41, dmg: 1.4, taken: 1.1 },
  mage: { hp: 1.49, dmg: 1.68, taken: 1.24 },
  mukin: { hp: 0.76, dmg: 0.62, taken: 2.23 },
  mystic: { hp: 1.44, dmg: 1.29, taken: 1.32 },
  ninja: { hp: 1.6, dmg: 1.41, taken: 1.17 },
  novice: { hp: 1.11, dmg: 1.59, taken: 4.03 },
  oni: { hp: 1.25, dmg: 1.29, taken: 1.18 },
  plague: { hp: 0.86, dmg: 0.87, taken: 0.83 },
  punk: { hp: 1.28, dmg: 1.41, taken: 1.16 },
  collector: { hp: 1.2, dmg: 1.52, taken: 0.79 },
  remnant: { hp: 1.55, dmg: 1.38, taken: 0.36 },
  ren: { hp: 1.34, dmg: 1.36, taken: 1.19 },
  rider: { hp: 1.59, dmg: 1.56, taken: 1.21 },
  samyeol: { hp: 1.13, dmg: 1.23, taken: 1.2 },
  silk: { hp: 1.19, dmg: 1.09, taken: 0.7 },
  pungryu: { hp: 1.2, dmg: 0.98, taken: 1.22 },
  leo: { hp: 1.1, dmg: 0.71, taken: 1.55 },
  onyx: { hp: 1.15, dmg: 0.59, taken: 1.52 },
  fenrir: { hp: 1.6, dmg: 0.67, taken: 1.2 },
  eclipse: { hp: 1.1, dmg: 0.74, taken: 1.3 },
  thorken: { hp: 1.1, dmg: 0.89, taken: 1.06 },
  levia: { hp: 1.1, dmg: 1.03, taken: 0.92 },
  tail: { hp: 1.1, dmg: 0.8, taken: 1.18 },
  madQueen: { hp: 1.05, dmg: 0.88, taken: 1.14 },
  hook: { hp: 1.1, dmg: 0.83, taken: 1.14 },
  orca: { hp: 1.05, dmg: 1.25, taken: 0.75 },
  wave: { hp: 1.05, dmg: 1.06, taken: 0.94 },
  miryu: { hp: 1.05, dmg: 0.95, taken: 1.04 },
  beatrice: { hp: 1.05, dmg: 0.53, taken: 1.87 },
  ian: { hp: 1, dmg: 1.04, taken: 0.97 },
  gabriel: { hp: 1, dmg: 0.93, taken: 1.08 },
  serena: { hp: 1, dmg: 0.93, taken: 1.09 },
  rafael: { hp: 1, dmg: 0.77, taken: 1.3 },
  yuriel: { hp: 1, dmg: 0.95, taken: 1.06 },
  michaela: { hp: 1, dmg: 0.86, taken: 1.15 },
  blast: { hp: 1, dmg: 0.9, taken: 1.1 },
  nailer: { hp: 1, dmg: 1.19, taken: 0.85 },
  scissors: { hp: 1, dmg: 1.2, taken: 0.83 },
  hellfist: { hp: 1, dmg: 1.24, taken: 0.81 },
  silverBullet: { hp: 1, dmg: 0.94, taken: 1.06 },
  blueFlame: { hp: 1, dmg: 1.01, taken: 0.99 },
  lunatic: { hp: 1, dmg: 0.69, taken: 1.43 },
  incision: { hp: 1, dmg: 0.96, taken: 1.04 },
  crusader: { hp: 1, dmg: 0.74, taken: 1.34 },
  joker: { hp: 1, dmg: 1, taken: 1 },
  shadowing: { hp: 1, dmg: 1, taken: 1 },
  puppeteer: { hp: 1, dmg: 1, taken: 1 },
  rabbit: { hp: 1, dmg: 1, taken: 1 },
  baekryeong: { hp: 1, dmg: 1, taken: 1 },
  bingseol: { hp: 1, dmg: 1, taken: 1 },
  asura: { hp: 1, dmg: 1, taken: 1 },
  baekinjang: { hp: 1, dmg: 1, taken: 1 },
  aria: { hp: 1, dmg: 1, taken: 1 },
  chessRaven: { hp: 1, dmg: 1, taken: 1 },
  gears: { hp: 1, dmg: 1, taken: 1 },
  honryeong: { hp: 1, dmg: 1, taken: 1 },
  slayer: { hp: 0.52, dmg: 0.5, taken: 0.23 },
  spiritist: { hp: 0.84, dmg: 0.92, taken: 0.66 },
  summoner: { hp: 1.08, dmg: 1.21, taken: 0.64 },
  titan: { hp: 0.97, dmg: 0.85, taken: 1.19 },
  tracker: { hp: 1.62, dmg: 1.46, taken: 1.09 },
  wanderer: { hp: 1.1, dmg: 1.09, taken: 1.04 },
  warden: { hp: 1.12, dmg: 0.99, taken: 1.51 },
};

// 관리자에서 모든 캐릭터의 모든 배율을 고를 수 있게 빈 값은 1로 채움
for (const c of CHARACTER_IDS) PW_CHAR[c] = { hp: 1, dmg: 1, taken: 1, skill: 1, rate: 1, range: 1, move: 1, ...PW_CHAR[c] };
