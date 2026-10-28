// 타워 디펜스 수치: 돈·목숨·레벨 비용·라운드(20)마다 나오는 적·보스. 계산은 sim/td*
import { BOSS_TIERS, CHARACTER_IDS, ENEMIES, type BossKind, type CharacterId, type TdMinionKind } from "./content";
import { PASSIVE_IDS, PASSIVES, type PassiveDef, type PassiveId } from "./items";

export const TD_ROUNDS = 20;

/**
 * 타워 디펜스 규칙 수치 (관리자 페이지 '타워 디펜스'에서 바꿈. 던전 수치와 따로).
 * 돈·목숨·비용·라운드 사이 시간·적 체력이 라운드마다 느는 정도·빠져나갈 때 잃는 목숨
 */
export const TD_RULES = {
  lives: 20,
  startGold: 300,
  /** 타워 세우기: 기본값 + 이미 세운 수마다 더함 */
  towerCost: 100,
  towerCostStep: 10,
  /** 레벨 올리기: 1→2레벨 값 + 레벨마다 더함 */
  levelCost: 40,
  levelCostStep: 25,
  /** 타워 레벨마다 공격력 +7% (패시브와 따로) */
  levelDamage: 0.07,
  /** 팔 때 돌려받는 비율 */
  sellRate: 0.7,
  /** 라운드 사이 쉬는 시간(초, 끝나면 다음 라운드가 저절로) · 일찍 시작하면 남은 1초마다 돈 */
  breakSec: 15,
  earlyGold: 2,
  /** 라운드를 막으면 받는 돈: 기본 + 라운드마다 */
  roundGold: 50,
  roundGoldStep: 15,
  /** 일반 적 체력 배율 = 1 + 직선 × (라운드-1) + 곡선 × (라운드-1)² · 일반 적 수 배율 */
  hpLinear: 0.25,
  hpCurve: 0.06,
  minionCount: 1,
  /** 빠져나가면 잃는 목숨: 일반 · 골렘 · 보스 (최종 보스는 전부) */
  leakMinion: 1,
  leakGolem: 2,
  leakBoss: 3,
  /** 최종 보스 걷는 빠르기 배율 (크고 느리게) */
  finalSpeed: 0.6,
  /** 타워 체력: 처음 + 레벨마다 · 적이 때리는 거리·간격(틱)·피해 배율(적 몸통 피해 ×, 보스 ×) · 최종 보스 등장 파동(최대 체력 비율) */
  towerHp: 300,
  towerHpLevel: 80,
  enemyReach: 26,
  enemyHitEvery: 60,
  enemyHitMul: 0.25,
  bossHitMul: 2.5,
  finalQuake: 0.1,
  /** 수리: 채울 체력 1당 돈 · 부서지면 같은 캐릭터를 다시 세우기까지(초) */
  repairCost: 0.5,
  rebuildSec: 30,
};

export const tdLevelCost = (level: number) => TD_RULES.levelCost + TD_RULES.levelCostStep * (level - 1);
export const tdRoundGold = (round: number) => TD_RULES.roundGold + TD_RULES.roundGoldStep * round;
export const tdHpMul = (round: number) => 1 + TD_RULES.hpLinear * (round - 1) + TD_RULES.hpCurve * (round - 1) * (round - 1);

/** 캐릭터마다 타워 보정 배율 (근접·단일 대상이 약하지 않게). 새 캐릭터는 모두 1로 시작 */
export interface TdTowerTune {
  damage: number;
  attackSpeed: number;
  range: number;
}
const POWER: Partial<Record<CharacterId, number>> = { warden: 1.35, drifter: 1.3, brawler: 1.15, engineer: 0.9 };
export const TD_TOWERS = Object.fromEntries(CHARACTER_IDS.map((id) => [id, { damage: POWER[id] ?? 1, attackSpeed: 1, range: 1 }])) as Record<CharacterId, TdTowerTune>;

/** 타워 디펜스의 적·보스 수치 (던전 표 ENEMIES와 따로). 보스 체력은 보스 라운드 배율을 곱함, 최종 보스 체력은 그대로 */
export interface TdUnit {
  hp: number;
  speed: number;
  gold: number;
  radius: number;
  shield?: number;
}
const unit = (hp: number, speed: number, gold: number, radius: number, shield?: number): TdUnit => ({ hp, speed, gold, radius, ...(shield ? { shield } : {}) });
export const TD_MINIONS: Record<TdMinionKind | "paladin", TdUnit> = {
  slime: unit(30, 0.42, 4, 5),
  runner: unit(20, 0.85, 4, 4),
  bat: unit(11, 0.7, 2, 3),
  beetle: unit(46, 0.36, 7, 6, 4),
  golem: unit(170, 0.24, 16, 8),
  shaman: unit(42, 0.38, 8, 5),
  eggsac: unit(64, 0.32, 7, 6),
  wisp: unit(34, 0.48, 5, 4),
  /** 천사장이 부르는 성기사 */
  paladin: unit(40, 0.42, 0, 6),
};
/** 보스 (처음 값은 던전 보스와 같게 시작, 그 뒤로는 따로) */
const boss = (k: BossKind): TdUnit => unit(ENEMIES[k].hp, ENEMIES[k].speed, ENEMIES[k].gold, Math.min(16, ENEMIES[k].radius));
export const TD_BOSSES: Record<BossKind, TdUnit> = {
  ...(Object.fromEntries(BOSS_TIERS.flat().map((k) => [k, boss(k)])) as Record<BossKind, TdUnit>),
  dragon: unit(13000, ENEMIES.dragon.speed, 100, 16),
  godeater: unit(7800, ENEMIES.godeater.speed, 100, 16),
  plight: unit(6500, ENEMIES.plight.speed, 50, 16),
  pdark: unit(6500, ENEMIES.pdark.speed, 50, 16),
};

/** 타워 디펜스 적·보스 수치 (없으면 null) */
export function tdUnit(kind: string): TdUnit | null {
  return (TD_MINIONS as Record<string, TdUnit>)[kind] ?? (TD_BOSSES as Record<string, TdUnit>)[kind] ?? null;
}

/** 적 한 무리: kind를 n마리, gap 틱 간격으로, 라운드 시작 at 틱 뒤부터 */
export interface TdGroup {
  kind: TdMinionKind;
  n: number;
  gap: number;
  at: number;
}

/** 보스 한 무리: 단계(0~2) 보스 전부를 시드 순서로, gap 틱 간격 (together면 같이 몇 마리씩) */
export interface TdBossGroup {
  tier: number;
  at: number;
  gap: number;
  /** 보스 체력 = 기본 체력 × hpMul */
  hpMul: number;
}

export interface TdRound {
  groups: TdGroup[];
  bosses?: TdBossGroup;
  /** 최종 보스: 셋이 한 마리씩 차례로 (앞 보스가 쓰러져야 다음) */
  final?: boolean;
}

const g = (kind: TdMinionKind, n: number, gap: number, at = 0): TdGroup => ({ kind, n, gap, at });

/** 라운드 1~20 */
export const TD_WAVES: readonly TdRound[] = [
  { groups: [g("slime", 8, 70)] },
  { groups: [g("slime", 10, 55), g("runner", 4, 60, 300)] },
  { groups: [g("slime", 10, 50), g("bat", 8, 18, 420)] },
  { groups: [g("runner", 8, 40), g("beetle", 3, 120, 200), g("slime", 8, 45, 500)] },
  { groups: [g("slime", 10, 60)], bosses: { tier: 0, at: 180, gap: 420, hpMul: 1.7 } },
  { groups: [g("beetle", 6, 80), g("wisp", 6, 70, 240), g("slime", 12, 35, 600)] },
  { groups: [g("bat", 20, 14), g("runner", 12, 35, 300), g("shaman", 2, 200, 400)] },
  { groups: [g("golem", 2, 240), g("shaman", 3, 160, 120), g("slime", 16, 30, 300)] },
  { groups: [g("eggsac", 6, 90), g("runner", 14, 28, 360), g("wisp", 6, 60, 700)] },
  { groups: [g("beetle", 6, 90)], bosses: { tier: 1, at: 120, gap: 380, hpMul: 2.8 } },
  { groups: [g("golem", 4, 150), g("bat", 24, 12, 300), g("shaman", 3, 150, 500)] },
  { groups: [g("shaman", 5, 100), g("beetle", 10, 50, 150), g("runner", 16, 24, 500)] },
  { groups: [g("wisp", 12, 40)], bosses: { tier: 0, at: 200, gap: 90, hpMul: 3.6 } },
  { groups: [g("eggsac", 10, 60), g("golem", 5, 130, 200), g("bat", 20, 12, 700)] },
  { groups: [g("shaman", 4, 120, 300)], bosses: { tier: 2, at: 120, gap: 300, hpMul: 4 } },
  { groups: [g("golem", 8, 90), g("wisp", 16, 30, 200), g("runner", 20, 20, 600)] },
  { groups: [g("beetle", 12, 50)], bosses: { tier: 1, at: 150, gap: 150, hpMul: 5.5 } },
  { groups: [g("bat", 30, 10), g("golem", 8, 80, 200), g("shaman", 6, 90, 300), g("eggsac", 8, 60, 700)] },
  { groups: [g("golem", 6, 100, 400)], bosses: { tier: 2, at: 120, gap: 100, hpMul: 6.5 } },
  { groups: [g("wisp", 10, 50), g("golem", 4, 150, 300)], final: true },
];


/** 타워 디펜스에 쓸모없는 패시브 (체력·회복·이동·대시·맞을 때 효과·벽 튕김·밀어내기 등) */
const TD_SKIP = new Set<string>([
  "heavyPlate", "ironSkin", "secondWind", "regenCharm", "dashCloak",
  "ricochet", "backQuiver", "ambush", "chaseSteps",
  "counterGuard", "lifeLeech", "rage", "dashSlash", "earthshaker", "lastStand", "bulwarkStance",
  "arcaneShield", "tempestBreath", "manaDrain", "barrier", "lifeSiphon", "energyRecycle", "overclock",
  "cleanFreak", "luckyDeflect", "steadfast", "ironBody", "speedIsPower", "bloodDemon",
  "woundSuture", "healthCare", "firstAid", "prescription", "doctorGown", "antibody",
  "discipline", "ration", "catNap", "nineLives", "agility", "purr", "wildRoar",
  "smokeVeil", "silentStep", "clockwork", "eternity", "bondShield",
  "mirageStep", "accumulate", "duneRush", "quickCatch", "heatHaze", "oasis", "sandVeil", "sandstorm", "returnWind",
  "redHare", "ironWall", "loyalty", "unbreakable",
  "scaleArmor", "cloudRide", "dragonBlood",
  "soulFeast", "soulMagnet", "fallenGrail", "bloodPact", "soulBurst", "blackMass",
]);

/** 능력치만 바꾸는데 체력·이동·행운뿐인 아이템도 뺌 */
const USELESS_STAT = new Set(["maxHp", "moveSpeed", "luck"]);

/** 이 캐릭터 타워가 고를 수 있는 패시브 (공용 + 자기 직업, 각각 한 번씩) */
export function tdPassivePool(character: CharacterId): PassiveId[] {
  return PASSIVE_IDS.filter((id) => {
    const def: PassiveDef = PASSIVES[id];
    if (def.special || TD_SKIP.has(id)) return false;
    if (def.exclusive !== undefined && def.exclusive !== character) return false;
    if (!def.effect && def.mods.length > 0 && def.mods.every((m) => USELESS_STAT.has(m.stat))) return false;
    return true;
  });
}
