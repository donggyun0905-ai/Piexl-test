// 야수 전용 아이템 (고양이·야수 무기일 때 효과). 효과는 sim/beast·pets
import type { PassiveDef } from "./items";

export const BEAST_PASSIVES = {
  /** 1초 이상 가만히 서 있으면 초당 체력 1 회복 */
  catNap: { id: "catNap", mods: [], exclusive: "beast", effect: true },
  /** 고양이 +1 (여러 개 가질 수 있음) */
  extraCat: { id: "extraCat", mods: [], exclusive: "beast" },
  /** 공격력 +3, 고양이 피해 +30% */
  sharpClaws: { id: "sharpClaws", mods: [{ stat: "damage", add: 3 }], exclusive: "beast", effect: true },
  /** 층마다 한 번, 쓰러질 때 체력 1로 버티고 2초 무적 */
  nineLives: { id: "nineLives", mods: [], exclusive: "beast", effect: true },
  /** 이동 속도 +0.15, 대시 대기 시간 30% 감소 */
  agility: { id: "agility", mods: [{ stat: "moveSpeed", add: 0.15 }], exclusive: "beast", effect: true },
  /** 체력 절반 이하 적에게 본인·고양이 피해 +30% */
  hunterInstinct: { id: "hunterInstinct", mods: [], exclusive: "beast", effect: true },
  /** 고양이가 할퀼 때마다 체력 0.3 회복 */
  purr: { id: "purr", mods: [], exclusive: "beast", effect: true },
  /** 고양이 한 마리당 공격 속도 +5% */
  packLeader: { id: "packLeader", mods: [], exclusive: "beast", effect: true },
  /** 처치하면 3초 동안 고양이가 두 배 빠르게 할큄 */
  fishTreat: { id: "fishTreat", mods: [], exclusive: "beast", effect: true },
  /** 맞으면 포효: 둘레 적을 밀어내며 피해, 3초 동안 고양이 피해 +50% */
  wildRoar: { id: "wildRoar", mods: [], exclusive: "beast", effect: true },
} as const satisfies Record<string, PassiveDef>;
