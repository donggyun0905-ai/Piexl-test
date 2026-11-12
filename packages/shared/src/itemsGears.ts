// 기어스 전용 아이템 20: 맞을 때 확률 방어 3(거울 반격·보호막 돔·육각 방벽) · 공격 확률 기술 5(대지 분쇄·방패 던지기·연속 방패타·천상의 수호자·청뢰 방패 폭풍)
// 쌍성 방패(기본 공격 강화) · 구체 충격파 · 보조 10(은빛 갑주·반동 장갑·가속 구체·반격 태세·철옹성·메아리 방패·육각 결정·위성 방패·불굴·중갑 돌진)
// 효과는 sim/gears·geProcs·geBall·geGuard. 수치는 GE_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "gears" as const, effect: true as const });

export const GEARS_PASSIVES = {
  /** 거울 반격: 맞으면 확률로 방패가 거울처럼 빛나 가까운 적에게 크게 되받아침 */
  geMirror: P("geMirror", [{ stat: "maxHp", add: 15 }]),
  /** 마법 보호막 돔: 맞으면 확률로 몸 둘레에 돔 · 그동안 공격을 모두 막음 */
  geDome: P("geDome", [{ stat: "maxHp", add: 20 }]),
  /** 대지 분쇄: 공격마다 확률 · 두 방패로 땅을 내리쳐 앞 둘레를 여러 번 흔듦 (잠깐 기절) */
  geQuake: P("geQuake", [{ stat: "damage", mul: 1.05 }]),
  /** 마법 방패 충격파: 구체로 굴러가는 동안 앞에 방패 충격파가 달려 있음 · 앞에 적이 다가오면 충격파 */
  geWave: P("geWave", [{ stat: "moveSpeed", add: 0.06 }]),
  /** 마법의 푸른 육각 방벽: 맞으면 확률로 보호막 (겹쳐 쌓이지 않음) */
  geHex: P("geHex", [{ stat: "maxHp", add: 15 }]),
  /** 방패 던지기: 공격마다 확률 · 방패를 앞으로 던져 뚫고 지나가며 끝에서 터짐 */
  geThrow: P("geThrow", [{ stat: "range", mul: 1.06 }]),
  /** 쌍성 방패: 기본 공격이 더 크고 더 많이 때리는 쌍성 방패로 바뀜 */
  geTwin: P("geTwin", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 연속 방패타: 기본 공격마다 확률 · 앞에 방패가 연달아 내리침 */
  geBarrage: P("geBarrage", [{ stat: "attackSpeed", add: 0.06 }]),
  /** 천상의 수호자: 공격마다 낮은 확률 · 10초 동안 거대한 방패를 앞에 들고 느리게 걸음 · 방패에 부딪힌 적은 60번 맞음 */
  geGuardian: P("geGuardian", [{ stat: "maxHp", add: 25 }]),
  /** 청뢰 방패 폭풍: 공격마다 확률 · 몸 둘레에 푸른 번개 방패 폭풍 · 안의 적은 30번 맞음 */
  geStorm: P("geStorm", [{ stat: "luck", add: 2 }]),
  /** 은빛 갑주: 받는 피해가 줄어듦 */
  geArmor: P("geArmor", [{ stat: "maxHp", add: 20 }]),
  /** 반동 장갑: 구체가 벽에 튕길 때마다 둘레에 충격 */
  geRebound: P("geRebound", [{ stat: "range", mul: 1.05 }]),
  /** 가속 구체: 구체가 튕길 때마다 빨라지고 부딪힘 피해가 커짐 (풀면 처음으로) */
  geMomentum: P("geMomentum", [{ stat: "moveSpeed", add: 0.05 }]),
  /** 반격 태세: 맞은 뒤 잠깐 공격이 빨라짐 */
  geCounter: P("geCounter", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 철옹성: 보호막이 있는 동안 주는 피해 증가 */
  geFortress: P("geFortress", [{ stat: "maxHp", add: 15 }]),
  /** 메아리 방패: 기본 공격 자리에 잠시 뒤 한 번 더 내리침 (약하게) */
  geEcho: P("geEcho", [{ stat: "damage", mul: 1.04 }]),
  /** 육각 결정: 보호막이 깨질 때 둘레에 푸른 결정이 터짐 */
  geCrystal: P("geCrystal", [{ stat: "luck", add: 2 }]),
  /** 위성 방패: 작은 방패 둘이 몸 둘레를 돌며 닿은 적을 때림 */
  geOrbit: P("geOrbit", [{ stat: "range", mul: 1.05 }]),
  /** 불굴: 체력이 적으면 받는 피해가 더 줄어듦 */
  geResolve: P("geResolve", [{ stat: "maxHp", add: 20 }]),
  /** 중갑 돌진: 구체로 받는 피해가 더 줄고 부딪힘 피해 증가 */
  geHeavy: P("geHeavy", [{ stat: "maxHp", add: 15 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (피해 배율은 공격력 ×, 시간은 틱(60 = 1초), 거리는 픽셀, 확률은 0~1) */
export const GE_PERKS = {
  /** 거울 반격: 맞을 때 확률 · 찾는 거리 · 피해 배율 */
  geMirror: { chance: 0.3, dist: 160, mul: 3 },
  /** 마법 보호막 돔: 맞을 때 확률 · 막는 틱(3초) */
  geDome: { chance: 0.2, ticks: 180 },
  /** 대지 분쇄: 공격마다 확률 · 앞 거리 · 반지름 · 흔드는 수 · 간격 틱 · 한 번 피해 배율 · 기절 틱 */
  geQuake: { chance: 0.15, reach: 30, r: 62, hits: 3, gap: 8, mul: 0.7, stun: 30 },
  /** 마법 방패 충격파: 앞 감지 거리 · 부채꼴 반지름 · 너비(코사인) · 피해 배율 · 밀침 · 다시 쓰기까지 틱 */
  geWave: { sense: 56, r: 210, arc: 0.35, mul: 1.3, push: 14, cd: 40 },
  /** 육각 방벽: 맞을 때 확률 · 보호막 */
  geHex: { chance: 0.25, pts: 25 },
  /** 방패 던지기: 공격마다 확률 · 빠르기 · 사는 틱 · 반지름 · 지나가며 피해 배율 · 끝 폭발 반지름 · 폭발 피해 배율 */
  geThrow: { chance: 0.2, speed: 6, life: 40, r: 14, mul: 1.4, boomR: 44, boomMul: 1 },
  /** 쌍성 방패: 크기 배율 · 때리는 수 */
  geTwin: { size: 1.3, hits: 4 },
  /** 연속 방패타: 기본 공격마다 확률 · 때리는 수 · 간격 틱 · 한 번 피해 배율 · 반지름 */
  geBarrage: { chance: 0.25, hits: 8, gap: 3, mul: 0.3, r: 34 },
  /** 천상의 수호자: 공격마다 확률 · 지속 틱(10초) · 이동 속도 배율 · 방패까지 거리 · 방패 반지름 · 부딪힌 적이 맞는 수 · 한 대 피해 배율 */
  geGuardian: { chance: 0.03, ticks: 600, move: 0.6, reach: 28, r: 20, hits: 60, mul: 0.12 },
  /** 청뢰 방패 폭풍: 공격마다 확률 · 반지름 · 맞는 수 · 간격 틱 · 한 대 피해 배율 */
  geStorm: { chance: 0.06, r: 92, hits: 30, gap: 2, mul: 0.16 },
  /** 은빛 갑주: 받는 피해 배율 */
  geArmor: { taken: 0.85 },
  /** 반동 장갑: 반지름 · 피해 배율 */
  geRebound: { r: 44, mul: 0.6 },
  /** 가속 구체: 튕길 때마다 빠르기·부딪힘 피해 증가 · 가장 많이 쌓이는 수 */
  geMomentum: { add: 0.08, max: 5 },
  /** 반격 태세: 지속 틱 · 공격 속도 배율 */
  geCounter: { ticks: 180, speed: 1.3 },
  /** 철옹성: 보호막이 있을 때 피해 배율 */
  geFortress: { mul: 1.2 },
  /** 메아리 방패: 기다리는 틱 · 피해 배율 (기본 공격 한 대의) */
  geEcho: { delay: 18, mul: 0.5 },
  /** 육각 결정: 반지름 · 피해 배율 */
  geCrystal: { r: 64, mul: 1.6 },
  /** 위성 방패: 수 · 도는 반지름 · 한 바퀴 틱 · 방패 반지름 · 피해 배율 · 같은 적을 다시 칠 때까지 틱 */
  geOrbit: { n: 2, r: 36, turn: 90, size: 9, mul: 0.4, again: 20 },
  /** 불굴: 체력 비율 아래 · 받는 피해 배율 */
  geResolve: { below: 0.3, taken: 0.75 },
  /** 중갑 돌진: 구체 받는 피해 배율 · 부딪힘 피해 배율 */
  geHeavy: { taken: 0.5, mul: 1.5 },
};
