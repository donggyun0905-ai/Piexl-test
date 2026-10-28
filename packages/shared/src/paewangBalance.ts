// 패왕전 한정 캐릭터 보정 (던전·다른 모드에는 없음): 체력·공격력 배율. AI끼리 무작위 1대1을 많이 돌려 승률이 너무 높거나 낮지 않게 맞춤
import type { CharacterId } from "./characters";

export interface PwCharTune {
  hp?: number;
  dmg?: number;
  /** 받는 피해 배율 (피해가 공격력으로 정해지지 않는 캐릭터용) */
  taken?: number;
}

export const PW_CHAR: Partial<Record<CharacterId, PwCharTune>> = {
  abandoned: { hp: 2.2, dmg: 2.2, taken: 0.45 },
  apostle: { hp: 1.41, dmg: 1.41, taken: 0.93 },
  artifacter: { hp: 1.3, dmg: 1.3 },
  automata: { hp: 0.75, dmg: 0.75 },
  beast: { hp: 0.99, dmg: 0.99, taken: 0.93 },
  bedouin: { hp: 0.81, dmg: 0.81 },
  bomber: { hp: 0.86, dmg: 0.86, taken: 0.92 },
  brawler: { hp: 0.62, dmg: 0.62, taken: 1.12 },
  byeonhui: { hp: 1.32, dmg: 1.32, taken: 0.8 },
  chronomancer: { hp: 1.81, dmg: 1.81 },
  doctor: { hp: 0.89, dmg: 0.89, taken: 0.9 },
  drifter: { hp: 1.32, dmg: 1.32, taken: 0.82 },
  elder: { hp: 1.02, dmg: 1.02, taken: 1.12 },
  elementalist: { hp: 1.41, dmg: 1.41 },
  engineer: { hp: 1.08, dmg: 1.08 },
  fly: { hp: 0.88, dmg: 0.88 },
  forgotten: { hp: 0.92, dmg: 0.92 },
  general: { hp: 0.83, dmg: 0.83, taken: 1.12 },
  gunner: { hp: 1.27, dmg: 1.27, taken: 0.88 },
  idra: { hp: 1.22, dmg: 1.22 },
  imugi: { hp: 1.16, dmg: 1.16 },
  mage: { hp: 0.98, dmg: 0.98 },
  mukin: { hp: 0.52, dmg: 0.52, taken: 2.1 },
  mystic: { hp: 0.98, dmg: 0.98, taken: 0.9 },
  ninja: { hp: 1.45, dmg: 1.45 },
  novice: { hp: 1.64, dmg: 1.64, taken: 1.12 },
  oni: { hp: 0.84, dmg: 0.84 },
  plague: { hp: 1.5, dmg: 1.5, taken: 0.65 },
  punk: { hp: 0.96, dmg: 0.96 },
  remnant: { hp: 0.63, dmg: 0.63, taken: 1.15 },
  ren: { hp: 0.83, dmg: 0.83 },
  rider: { hp: 0.78, dmg: 0.78, taken: 1.12 },
  samyeol: { hp: 1.34, dmg: 1.34, taken: 0.95 },
  silk: { hp: 1.89, dmg: 1.89, taken: 0.95 },
  slayer: { hp: 1.16, dmg: 1.16 },
  spiritist: { hp: 0.77, dmg: 0.77, taken: 0.9 },
  summoner: { hp: 1.13, dmg: 1.13 },
  titan: { hp: 0.74, dmg: 0.74, taken: 1.15 },
  tracker: { hp: 0.94, dmg: 0.94, taken: 0.92 },
  wanderer: { hp: 0.84, dmg: 0.84, taken: 0.9 },
  warden: { hp: 1.08, dmg: 1.08 },
};
