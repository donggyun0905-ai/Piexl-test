// 이벤트 '광야의 새벽' 수치 (계산은 sim/swarm·swarmSpawn·swarmLevel·swarmGhosts)
// 넓은 들판에서 시간이 갈수록 적이 늘어남. 공격은 저절로, 레벨이 오를 때마다 무기·패시브를 골라 키움

export const SWARM = {
  /** 들판 크기 (칸) */
  cols: 64,
  rows: 40,
  /** 보스가 나오는 때(초)와 단계: 1단계 둘 · 2단계 둘 · 3단계 둘 · 최종 보스 하나(잡으면 클리어, 계속하면 끝없이) */
  bossSec: [150, 240, 360, 450, 570, 660, 810],
  bossTier: [0, 0, 1, 1, 2, 2, 2],
  /** 최종 보스 체력 배율 · 클리어 뒤 계속: 보스 간격(초) · 보스마다 체력 + · 1분마다 적 체력 더 + */
  finalHp: 2,
  endlessEvery: 90,
  endlessBossHp: 0.35,
  endlessHpPerMin: 0.12,
  /** 한 번에 있을 수 있는 적 수 · 초당 나오는 적 (처음 + 1분마다 더) · 1분마다 체력 배율 + · 졸개 종류가 바뀌는 간격(초) */
  maxEnemies: 170,
  spawnBase: 1,
  spawnPerMin: 0.5,
  hpPerMin: 0.16,
  depthSec: 150,
  /** 적이 나오는 거리 (화면 밖) · 너무 멀어진 적은 앞쪽으로 다시 */
  spawnDist: 220,
  farDist: 420,
  /** 받는 피해 배율 (적이 아주 많으므로) */
  taken: 0.4,
  /** 저절로 회복 (초당) */
  regen: 0.4,
  /** 보스 체력 배율 (무기 여럿이 같이 때리므로 더) */
  bossHp: 2.5,
  /** 무기 칸 · 패시브 칸 · 최대 레벨 · 레벨 업 때 고를 수 */
  maxWeapons: 4,
  maxPassives: 6,
  maxLevel: 5,
  choices: 3,
  /** 다음 레벨까지 경험치 = base + step × 레벨 + grow × 레벨² (점점 더 커짐) */
  xpBase: 4,
  xpStep: 5,
  xpGrow: 0.6,
  /** 경험치 보석: 보스 값 · 끌려오는 거리(행운 1마다 +8%) · 끌려오는 빠르기 · 최대 수 */
  gemBoss: 40,
  magnet: 40,
  gemSpeed: 3.4,
  maxGems: 260,
  /** 상자: 들판에 늘 이만큼 · 체력(1분마다 +10%). 황금 상자는 보스에게서만 */
  crates: 14,
  crateHp: 16,
  /** 상자에서 나오는 것 (확률 합 1): 고기(최대 체력 30% 회복) · 자석(보석 모두 끌어옴) · 폭탄(둘레 적 피해) · 돈 */
  drops: [
    ["heal", 0.35],
    ["magnet", 0.15],
    ["bomb", 0.15],
    ["gold", 0.35],
  ] as const,
  heal: 0.3,
  bombR: 120,
  bombDamage: 80,
  /** 무기 레벨마다 (2~5레벨) 피해·공격 속도·사거리 + */
  weaponLv: { damage: 0.2, attackSpeed: 0.07, range: 0.05 },
  /** 패시브 레벨마다 (2~5레벨) 피해 + (능력치 패시브는 그 능력치도 한 번 더) */
  passiveLv: 0.03,
  /** 조합(각성): 피해·공격 속도·사거리 배율 · 각성 파동 간격(틱)·범위·피해 배율 */
  evo: { damage: 1.6, attackSpeed: 1.25, range: 1.2, novaEvery: 150, novaR: 48, novaMul: 1.5 },
  /** 모두 다 키운 뒤 레벨 업: 돈 · 힘 하나당 피해 + */
  maxed: { gold: 15, might: 0.05 },
  /** 각성 기술 (무기마다 하나, sim/swarmEvo): 간격(틱) · 수 · 범위 · 피해 배율(공격력) · 멈춤(틱) */
  skills: {
    storm: { every: 75, count: 4, range: 170, mul: 1.1 },
    comet: { every: 120, count: 3, range: 200, r: 30, mul: 2 },
    frost: { every: 140, r: 72, mul: 0.9, stun: 50 },
    blades: { count: 3, r: 30, hit: 9, every: 8, mul: 0.45 },
    barrage: { every: 80, count: 10, speed: 3.4, mul: 0.6 },
  },
  /** 이 모드에서만 줄이는 것: 처치할 때 생기는 효과 확률(생명 흡수·응급 처치·에너지 회수) · 악의 사도 영혼 확률 · 풋내기 경험치 배율 */
  limits: { killProc: 0.15, soulChance: 0.12, noviceExp: 0.25 },
  /** 특수 이벤트: 처음(초) · 간격(초) · 포위(적 수·반경·제한 시간) · 메테오(시간·간격·범위·피해) · 구출(거리·제한 시간·닿는 거리) · 성공 보상 수 */
  events: {
    first: 90,
    every: 120,
    ring: { count: 36, radius: 170, ticks: 1800 },
    meteor: { ticks: 600, every: 14, spread: 150, damage: 14, radius: 36 },
    rescue: { dist: 260, ticks: 2400, touch: 14 },
    rewards: 3,
  },
} as const;

export type SwarmDropKind = (typeof SWARM.drops)[number][0] | "chest";

/** 레벨 업에 필요한 경험치 */
export const swarmXpNeed = (lv: number) => Math.round(SWARM.xpBase + SWARM.xpStep * lv + SWARM.xpGrow * lv * lv);
