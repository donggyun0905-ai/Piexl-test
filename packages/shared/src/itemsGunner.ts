// 거너 전용 아이템 (총일 때 효과). 효과는 sim/gun·gunExtras
import type { PassiveDef } from "./items";

export const GUNNER_PASSIVES = {
  /** 이번 판에 가져 본 다른 총이 쏠 때마다 30% 확률로 옆에 나타나 한 번 쏘고 사라짐 */
  gunMaster: { id: "gunMaster", mods: [], exclusive: "gunner", effect: true },
  /** 이동 속도 +0.2 (거너 체력은 40 고정이라 체력은 빠짐, 0.48.45) */
  discipline: { id: "discipline", mods: [{ stat: "moveSpeed", add: 0.2 }], exclusive: "gunner", effect: true },
  /** 치명타 확률 +30%, 치명타 피해 +20% */
  focusFire: { id: "focusFire", mods: [], exclusive: "gunner", effect: true },
  /** 방을 정리하면 최대 체력의 10% 회복 */
  ration: { id: "ration", mods: [], exclusive: "gunner", effect: true },
  /** 공격력 +5, 이동 속도 +0.1 */
  allIn: { id: "allIn", mods: [{ stat: "damage", add: 5 }, { stat: "moveSpeed", add: 0.1 }], exclusive: "gunner", effect: true },
  /** 공격력 +2, 이동 속도 +0.1, 장전 10% 빠르게, 치명타 확률 +20% */
  elite: { id: "elite", mods: [{ stat: "damage", add: 2 }, { stat: "moveSpeed", add: 0.1 }], exclusive: "gunner", effect: true },
  /** 가끔(발사마다 2%) 총이 고장 나 3초 못 쏨, 대신 치명타 확률 100% */
  scrapGun: { id: "scrapGun", mods: [], exclusive: "gunner", effect: true },
  /** 쏠 때마다 30% 확률로 지원 드론이 3초 동안 같이 쏨 (여러 대 겹침) */
  supportFire: { id: "supportFire", mods: [], exclusive: "gunner", effect: true },
  /** 맞힌 적이 3초 동안 피를 흘림 (0.5초마다 적 최대 체력의 1%) */
  bleed: { id: "bleed", mods: [], exclusive: "gunner", effect: true },
  /** 공격 속도 +100%, 장전 2배 빠르게, 탄 빠르기 +50% */
  rapidFire: { id: "rapidFire", mods: [{ stat: "attackSpeed", mul: 2 }, { stat: "projectileSpeed", mul: 1.5 }], exclusive: "gunner", effect: true },
} as const satisfies Record<string, PassiveDef>;
