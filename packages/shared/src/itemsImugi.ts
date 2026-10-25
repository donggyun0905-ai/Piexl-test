// 이무기 전용 아이템 11개. 효과는 sim/imugi·imugiMods. 수치는 IMUGI_PERKS
import type { PassiveDef } from "./items";

export const IMUGI_PASSIVES = {
  /** 승천: 콤보가 1.5배 빨리 쌓임 (두 번 맞힐 때마다 1 더) */
  ascension: { id: "ascension", mods: [], exclusive: "imugi", effect: true },
  /** 용린갑: 최대 체력 +20, 받는 피해 -10% */
  scaleArmor: { id: "scaleArmor", mods: [{ stat: "maxHp", add: 20 }], exclusive: "imugi", effect: true },
  /** 용의 분노: 오라(콤보 72 이상)·용이 된 동안 공격력 +15% 더 */
  dragonRage: { id: "dragonRage", mods: [], exclusive: "imugi", effect: true },
  /** 운룡: 대시하면 콤보 +2 */
  cloudRide: { id: "cloudRide", mods: [], exclusive: "imugi", effect: true },
  /** 비늘 방패: 콤보 10마다 보호막 5 (이 아이템으로는 최대 20) */
  scaleGuard: { id: "scaleGuard", mods: [], exclusive: "imugi", effect: true },
  /** 천둥 울음: 콤보 108의 용이 지나갈 때 피해 +50% */
  thunderCry: { id: "thunderCry", mods: [], exclusive: "imugi", effect: true },
  /** 쌍룡: 콤보 108의 용이 한 번 더 지나감 (두 번째는 피해 절반) */
  longBreath: { id: "longBreath", mods: [], exclusive: "imugi", effect: true },
  /** 여운: 용을 부른 뒤 콤보가 20이 아니라 40에서 다시 시작 */
  lingering: { id: "lingering", mods: [], exclusive: "imugi", effect: true },
  /** 용창: 찌르기 길이 +30%, 휘두르기 범위 +20% */
  dragonLance: { id: "dragonLance", mods: [], exclusive: "imugi", effect: true },
  /** 용혈: 오라 동안 1초마다 체력 1 회복 */
  dragonBlood: { id: "dragonBlood", mods: [], exclusive: "imugi", effect: true },
  /** 화룡점정: 여의주를 물고 있을 때 번개 공격 속도 +45%, 번개마다 적 최대 체력의 1.5% (보스는 1/5 기준) 더 */
  dragonEye: { id: "dragonEye", mods: [], exclusive: "imugi", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 이무기 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱) */
export const IMUGI_PERKS = {
  scaleArmor: { taken: 0.9 },
  dragonRage: { damage: 1.15 },
  cloudRide: { combo: 2 },
  scaleGuard: { every: 10, shield: 5, max: 20 },
  thunderCry: { damage: 1.5 },
  longBreath: { second: 0.5 },
  lingering: { restart: 40 },
  dragonLance: { thrust: 1.3, swing: 1.2 },
  dragonBlood: { heal: 1, every: 60 },
  dragonEye: { speed: 1.45, hp: 0.015, bossDiv: 5 },
};
