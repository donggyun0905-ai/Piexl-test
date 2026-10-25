// 역병의사(헬리오스) 무기 4개: 모기떼 · 연기 구역 · 쥐떼 · 죽음의 손아귀 (계산은 sim/plague)
import type { WeaponDef } from "./content";

/** swarm 모기떼가 적에게 날아가 갈아버림 · miasma 큰 연기 구역(독·불·죽음·부식) · rats 쥐떼가 갉아먹다 흑사병 · grip 근접, 확률로 즉사 */
export type PlagueKind = "swarm" | "miasma" | "rats" | "grip";

const P = (id: string, plague: PlagueKind, damageMul: number, attackSpeed: number, range: number) =>
  ({ id, kind: "pest", damageMul, attackSpeed, range, projectileSpeed: 0, plague, exclusive: "plague" }) as const;

export const PLAGUE_WEAPONS = {
  /** 모기떼 (처음 무기) */
  mosquitoSwarm: P("mosquitoSwarm", "swarm", 0.55, 1.4, 110),
  /** 역병 향로: 연기 구역 */
  miasmaCenser: P("miasmaCenser", "miasma", 0.7, 0.5, 120),
  /** 쥐의 왕: 쥐떼 */
  ratKing: P("ratKing", "rats", 1, 0.7, 110),
  /** 죽음의 손아귀 (사거리·공격 속도가 오르지 않음) */
  deathGrip: P("deathGrip", "grip", 1.6, 1.1, 26),
} as const satisfies Record<string, WeaponDef>;

/** 역병의사 수치 (배율 1 = 100%, 시간은 틱, 거리는 픽셀) */
export const PLAGUE = {
  /** 모기떼: 날아가는 빠르기 · 갈아버리는 반경 · 누르고 있는 동안 이 틱마다 갉음 · 1초 피해 배율 (레이저처럼 쉬지 않고 갈아버림) */
  swarmSpeed: 3,
  swarmR: 34,
  swarmEvery: 5,
  swarmBoost: 4,
  /** 연기 구역: 반경 · 남는 틱 · 한 번에 둘까지 · 맥박 주기 · 독/불/죽음 배율 · 부식(받는 피해 +) */
  cloudR: 42,
  cloudTicks: 300,
  clouds: 2,
  pulse: 30,
  poisonMul: 0.3,
  burnMul: 0.4,
  deathMul: 0.25,
  corrode: 0.05,
  /** 쥐떼: 한 번에 수 · 최대 수 · 사는 틱 · 빠르기 · 갉는 주기 · 갉는 피해(고정) · 흑사병 확률 · 터지는 피해(고정) */
  rats: 6,
  ratsMax: 30,
  ratTicks: 420,
  ratSpeed: 1.7,
  gnawEvery: 15,
  gnawDmg: 1,
  /** 쥐 한 마리가 한 번에 갉는 둘레 (여럿을 함께) */
  gnawR: 14,
  plagueChance: 0.2,
  burst: 10,
  /** 흑사병: 남는 틱 · 1초마다 최대 체력의 20% (보스는 최대 체력 1/5의 20%) */
  plagueTicks: 300,
  plaguePct: 0.2,
  bossDiv: 5,
  /** 죽음의 손아귀: 즉사 확률 · 보스는 최대 체력 1/4의 20% · 부채꼴(cos) */
  gripChance: 0.34,
  gripBossDiv: 4,
  gripBossPct: 0.2,
  gripArc: 0.3,
} as const;
