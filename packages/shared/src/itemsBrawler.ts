// 격투가 전용 아이템 (콤보 무기일 때 효과). 효과는 sim/brawl
import type { PassiveDef } from "./items";

export const BRAWLER_PASSIVES = {
  /** 공격력 +10%, 최대 체력 +10% */
  balance: { id: "balance", mods: [{ stat: "damage", mul: 1.1 }, { stat: "maxHp", mul: 1.1 }], exclusive: "brawler", effect: true },
  /** 공격마다 15% 확률로 남은 콤보를 아주 빠르게 이어 감 */
  zone: { id: "zone", mods: [], exclusive: "brawler", effect: true },
  /** 공격마다 15% 확률로 3초 무적 */
  ironBody: { id: "ironBody", mods: [], exclusive: "brawler", effect: true },
  /** 콤보가 이어질 때마다 이동 속도 +8% (콤보가 끊기면 처음으로) */
  speedIsPower: { id: "speedIsPower", mods: [], exclusive: "brawler", effect: true },
  /** 콤보 첫 기술을 바로 끝내고 두 번째 기술부터 */
  mach: { id: "mach", mods: [], exclusive: "brawler", effect: true },
  /** 콤보를 끝까지 3번 연속하면 5초 동안 공격력 +5, 보호막 20 */
  strongman: { id: "strongman", mods: [], exclusive: "brawler", effect: true },
  /** 최대 체력 -30, 공격력 +7 */
  drunkenFist: { id: "drunkenFist", mods: [{ stat: "maxHp", add: -30 }, { stat: "damage", add: 7 }], exclusive: "brawler", effect: true },
  /** 공격마다 30% 확률로 맞은 적이 1.5초 동안 도망감 */
  intimidate: { id: "intimidate", mods: [], exclusive: "brawler", effect: true },
  /** 체력이 적을수록 기술 피해 증가 (최대 +100%) */
  bloodDemon: { id: "bloodDemon", mods: [], exclusive: "brawler", effect: true },
  /** 맞힐 때마다 5% 확률로 적이 10초 기절 (보스는 1초) */
  knockout: { id: "knockout", mods: [], exclusive: "brawler", effect: true },
} as const satisfies Record<string, PassiveDef>;
