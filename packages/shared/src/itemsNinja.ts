// 닌자 전용 아이템 (닌자 무기일 때 효과). 효과는 sim/ninja·shades. 수치는 NINJA_PERKS (관리자 페이지에서 바꿈)
import type { PassiveDef } from "./items";

export const NINJA_PASSIVES = {
  /** 그림자가 나오는 데 필요한 표식 -1 */
  shadowMark: { id: "shadowMark", mods: [], exclusive: "ninja", effect: true },
  /** 그림자가 둘씩 나옴 (둘째는 60% 피해) */
  twinShadow: { id: "twinShadow", mods: [], exclusive: "ninja", effect: true },
  /** 던진 무기에 맞은 적이 2초 동안 독 (0.5초마다 공격력 15%) */
  venomStar: { id: "venomStar", mods: [], exclusive: "ninja", effect: true },
  /** 그림자가 벤 뒤 2초 동안 공격 속도 +40% */
  shadowRush: { id: "shadowRush", mods: [], exclusive: "ninja", effect: true },
  /** 그림자 피해 +50% */
  moonlight: { id: "moonlight", mods: [], exclusive: "ninja", effect: true },
  /** 맞으면 연막: 둘레 적이 2초 느려지고 1초 더 무적 */
  smokeVeil: { id: "smokeVeil", mods: [], exclusive: "ninja", effect: true },
  /** 체력 30% 이하 적에게 그림자 피해 2배 */
  assassin: { id: "assassin", mods: [], exclusive: "ninja", effect: true },
  /** 던진 무기가 커지고 1명 더 뚫음 */
  bigStar: { id: "bigStar", mods: [], exclusive: "ninja", effect: true },
  /** 그림자가 적을 쓰러뜨리면 가까운 적에게 그림자가 옮겨 붙음 (최대 3번) */
  shadowChain: { id: "shadowChain", mods: [], exclusive: "ninja", effect: true },
  /** 이동 속도 +0.15, 대시 대기 시간 30% 감소 */
  silentStep: { id: "silentStep", mods: [{ stat: "moveSpeed", add: 0.15 }], exclusive: "ninja", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 닌자 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱) */
export const NINJA_PERKS = {
  twinShadow: { damage: 0.6 },
  venomStar: { damage: 0.15, ticks: 120 },
  shadowRush: { speed: 0.4, ticks: 120 },
  moonlight: { damage: 1.5 },
  smokeVeil: { radius: 40, ticks: 120 },
  assassin: { below: 0.3, damage: 2 },
  bigStar: { pierce: 1 },
  shadowChain: { radius: 70, hits: 3 },
  silentStep: { cooldown: 0.7 },
};
