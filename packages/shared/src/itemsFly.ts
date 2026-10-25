// 플라이 전용 아이템 10개. 효과는 sim/fly. 수치는 FLY_PERKS
import type { PassiveDef } from "./items";

export const FLY_PASSIVES = {
  /** 투명 날개: 이동 속도 +12% */
  flyWings: { id: "flyWings", mods: [{ stat: "moveSpeed", mul: 1.12 }], exclusive: "fly" },
  /** 가속: 급습할 때마다 2초 동안 이동 속도 +10% (3번까지 쌓임) */
  flyAfterburn: { id: "flyAfterburn", mods: [], exclusive: "fly", effect: true },
  /** 긴 비행: 급습 거리 +40% */
  flyLonger: { id: "flyLonger", mods: [], exclusive: "fly", effect: true },
  /** 날 선 발톱: 끝 할퀴기 피해 +60% */
  flyKeen: { id: "flyKeen", mods: [], exclusive: "fly", effect: true },
  /** 잔상 회피: 급습이 끝나도 0.5초 더 무적 */
  flyEvade: { id: "flyEvade", mods: [], exclusive: "fly", effect: true },
  /** 연속 비행: 네 번째 급습마다 바로 다시 급습 */
  flyRecharge: { id: "flyRecharge", mods: [], exclusive: "fly", effect: true },
  /** 돌풍: 급습에 맞은 적을 멀리 밀침 */
  flyGust: { id: "flyGust", mods: [], exclusive: "fly", effect: true },
  /** 사냥꾼: 체력이 절반 아래인 적에게 피해 +30% */
  flyHunt: { id: "flyHunt", mods: [], exclusive: "fly", effect: true },
  /** 겹눈: 가장 가까운 적에게 급습 · 급습 거리 +20% */
  flyDragonEye: { id: "flyDragonEye", mods: [], exclusive: "fly", effect: true },
  /** 비행 광란: 급습으로 적을 쓰러뜨리면 다음 급습 피해 +60% */
  flyFrenzy: { id: "flyFrenzy", mods: [{ stat: "damage", mul: 1.05 }], exclusive: "fly", effect: true },
} as const satisfies Record<string, PassiveDef>;

/** 플라이 아이템 수치 (배율·비율은 1 = 100%, 시간은 틱) */
export const FLY_PERKS = {
  flyAfterburn: { ticks: 120, speed: 0.1, max: 3 },
  flyLonger: { reach: 1.4 },
  flyKeen: { mul: 1.6 },
  flyEvade: { ticks: 30 },
  flyRecharge: { every: 4 },
  flyGust: { push: 14 },
  flyHunt: { below: 0.5, mul: 1.3 },
  flyDragonEye: { reach: 1.2 },
  flyFrenzy: { mul: 1.6 },
};
