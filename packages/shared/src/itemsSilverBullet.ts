// 실버불렛 전용 아이템 20개: 쌍권총 5 · 은탄 마크·연사 5 · 성수 폭탄 5 · 집행 5. 효과는 sim/silverBullet·silverBulletKit. 수치는 SILVER_BULLET_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const P = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, exclusive: "silverBullet" as const, effect: true as const });

export const SILVER_BULLET_PASSIVES = {
  // ── 쌍권총 ──
  /** 빠른 손: 기본 공격 간격이 짧아짐 */
  sbQuick: P("sbQuick", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 할로우 포인트: 기본 은탄 피해 증가 */
  sbHollow: P("sbHollow", [{ stat: "damage", add: 1 }]),
  /** 관통 은탄: 기본 은탄이 적 하나를 뚫고 나감 */
  sbPierce: P("sbPierce", [{ stat: "range", add: 8 }]),
  /** 세 번째 총성: 몇 번마다 은탄 두 발 더 */
  sbTriple: P("sbTriple", [{ stat: "luck", add: 1 }]),
  /** 긴 총열: 은탄이 더 빠르고 멀리 날아감 */
  sbBarrel: P("sbBarrel", [{ stat: "range", add: 10 }]),
  // ── 은탄 마크·연사 ──
  /** 은빛 각인: 연사에 필요한 마크가 줄어듦 */
  sbEngrave: P("sbEngrave", [{ stat: "luck", add: 1 }]),
  /** 탄막 폭풍: 연사가 더 오래 감 */
  sbStorm: P("sbStorm", [{ stat: "maxHp", add: 10 }]),
  /** 연사 가속: 연사 간격이 짧아짐 */
  sbRapid: P("sbRapid", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 은빛 파열: 연사가 끝나면 그 적 자리에서 은빛 폭발 */
  sbBurst: P("sbBurst", [{ stat: "damage", add: 1 }]),
  /** 순은: 마크가 많이 박힌 적에게 피해 증가 */
  sbPure: P("sbPure", [{ stat: "damage", add: 1 }]),
  // ── 성수 폭탄 ──
  /** 큰 성수병: 성수 폭탄 범위 증가 */
  sbFlask: P("sbFlask", [{ stat: "range", add: 8 }]),
  /** 축복받은 물: 성수 폭탄 피해 증가 */
  sbBless: P("sbBless", [{ stat: "damage", add: 1 }]),
  /** 넉넉한 탄띠: 성수 폭탄을 더 자주 던짐 */
  sbBelt: P("sbBelt", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 정화: 성수 폭탄에 맞은 적에게 달빛이 더 걸림 */
  sbPurify: P("sbPurify", [{ stat: "luck", add: 1 }]),
  /** 성수 뿌리기: 대시하면 떠난 자리에 성수 폭탄 */
  sbSplash: P("sbSplash", [{ stat: "maxHp", add: 10 }]),
  // ── 집행 ──
  /** 사냥꾼의 집중: 성흔이 더 빨리 참 */
  sbFocus: P("sbFocus", [{ stat: "luck", add: 1 }]),
  /** 끝없는 탄창: 은빛 활 일제 사격이 더 오래 감 */
  sbEndless: P("sbEndless", [{ stat: "maxHp", add: 10 }]),
  /** 추적 은탄: 은빛 활 가운데 은탄도 적을 쫓음 */
  sbSeek: P("sbSeek", [{ stat: "range", add: 8 }]),
  /** 날렵한 발: 대시할 때 은탄이 더 나감 */
  sbAgile: P("sbAgile", [{ stat: "attackSpeed", add: 0.05 }]),
  /** 달의 집행자: 달빛 각성 중 피해가 더 커짐 */
  sbLunar: P("sbLunar", [{ stat: "damage", add: 1 }]),
} as const satisfies Record<string, PassiveDef>;

/** 전용 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const SILVER_BULLET_PERKS = {
  /** 빠른 손: 기본 공격 간격 배율 */
  sbQuick: { time: 0.85 },
  /** 할로우 포인트: 기본 은탄 피해 배율 */
  sbHollow: { mul: 1.3 },
  /** 관통 은탄: 뚫는 적 수 */
  sbPierce: { add: 1 },
  /** 세 번째 총성: 기본 공격 이 번째마다 두 발 더 */
  sbTriple: { every: 4 },
  /** 긴 총열: 빠르기 배율 · 거리 배율 */
  sbBarrel: { speed: 1.3, range: 1.25 },
  /** 은빛 각인: 연사에 필요한 마크 (원래 대신) */
  sbEngrave: { need: 22 },
  /** 탄막 폭풍: 연사 틱 더함 */
  sbStorm: { more: 60 },
  /** 연사 가속: 연사 간격 틱 (원래 대신) */
  sbRapid: { gap: 3 },
  /** 은빛 파열: 폭발 반지름 · 피해 배율 */
  sbBurst: { r: 50, mul: 2 },
  /** 순은: 마크가 이만큼 이상인 적에게 · 피해 배율 */
  sbPure: { from: 10, mul: 1.25 },
  /** 큰 성수병: 폭발 반지름 배율 */
  sbFlask: { r: 1.4 },
  /** 축복받은 물: 폭발 피해 배율 */
  sbBless: { mul: 1.5 },
  /** 넉넉한 탄띠: 기본 공격 이 번째마다 성수 폭탄 (원래 대신) */
  sbBelt: { every: 5 },
  /** 정화: 성수 폭탄에 맞은 적에게 더 거는 달빛 스택 */
  sbPurify: { more: 2 },
  /** 성수 뿌리기: 대시 자리 폭발 피해 배율 (성수 폭탄 대비) */
  sbSplash: { mul: 0.8 },
  /** 사냥꾼의 집중: 차는 양 배율 */
  sbFocus: { gain: 1.3 },
  /** 끝없는 탄창: 일제 사격 틱 더함 */
  sbEndless: { more: 60 },
  /** 추적 은탄: 가운데 은탄 유도 꺾임 (0~1) */
  sbSeek: { turn: 0.15 },
  /** 날렵한 발: 대시 은탄 더함 */
  sbAgile: { add: 2 },
  /** 달의 집행자: 각성 중 피해 배율 (원래 대신) */
  sbLunar: { mul: 1.6 },
};
