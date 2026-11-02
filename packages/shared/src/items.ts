// 아이템 정의 (패시브·사용 아이템). 이름·설명 글자는 화면 쪽 번역(i18n)에서. 수치는 임시 (테스트하며 조정)
import type { CharacterId } from "./content";
import type { StatMod } from "./stats";
import { BRAWLER_PASSIVES } from "./itemsBrawler";
import { GUNNER_PASSIVES } from "./itemsGunner";
import { BEAST_PASSIVES } from "./itemsBeast";
import { ELEMENTAL_PASSIVES } from "./itemsElemental";
import { DOCTOR_PASSIVES } from "./itemsDoctor";
import { NINJA_PASSIVES } from "./itemsNinja";
import { CHRONO_PASSIVES } from "./itemsChrono";
import { SUMMON_PASSIVES } from "./itemsSummon";
import { BEDOUIN_PASSIVES } from "./itemsBedouin";
import { GENERAL_PASSIVES } from "./itemsGeneral";
import { IMUGI_PASSIVES } from "./itemsImugi";
import { APOSTLE_PASSIVES } from "./itemsApostle";
import { STAR_PASSIVES } from "./itemsStar";
import { DUCK_PASSIVES } from "./itemsDuck";
import { SCRIBE_PASSIVES } from "./itemsScribe";
import { ABANDONED_PASSIVES } from "./itemsAbandoned";
import { TITAN_PASSIVES } from "./itemsTitan";
import { ONI_PASSIVES } from "./itemsOni";
import { S2_PASSIVES } from "./itemsSeason2";
import { HIDDEN_PASSIVES, HIDDEN_USES } from "./itemsHidden";
import { DEVIL_PASSIVES } from "./itemsDevil";

export interface PassiveDef {
  id: string;
  mods: StatMod[];
  /** 이 캐릭터만 얻을 수 있는 전용 아이템 */
  exclusive?: CharacterId;
  /** 능력치가 아니라 공격 방식을 바꾸는 아이템 (한 판에 하나씩만 얻을 수 있음). 효과는 sim에서 처리 */
  effect?: true;
  /** 정해진 자리에서만 나옴 (보상·상점·여신의 선물에는 나오지 않음) */
  special?: true;
  /** 이 무기를 들었을 때만 나옴 (오니 무기 전용 아이템) */
  forWeapon?: string;
}

/** 패시브: 갖고 있으면 효과, 같은 것·다른 것 모두 중첩 */
export const PASSIVES = {
  sturdyHeart: { id: "sturdyHeart", mods: [{ stat: "maxHp", add: 20 }] },
  whetstone: { id: "whetstone", mods: [{ stat: "damage", add: 3 }] },
  lightGloves: { id: "lightGloves", mods: [{ stat: "attackSpeed", mul: 1.15 }] },
  longGrip: { id: "longGrip", mods: [{ stat: "range", mul: 1.2 }] },
  windBoots: { id: "windBoots", mods: [{ stat: "moveSpeed", add: 0.15 }] },
  featherTip: { id: "featherTip", mods: [{ stat: "projectileSpeed", mul: 1.25 }, { stat: "range", add: 10 }] },
  cloverCharm: { id: "cloverCharm", mods: [{ stat: "luck", add: 1 }] },
  furySeal: { id: "furySeal", mods: [{ stat: "damage", mul: 1.25 }, { stat: "maxHp", add: -10 }] },
  hunterEye: { id: "hunterEye", mods: [{ stat: "range", add: 15 }, { stat: "attackSpeed", mul: 1.1 }] },
  // 공통 생존·보조 아이템 (모든 캐릭터, 한 판에 하나씩)
  /** 쓰러질 때 한 번 체력 30%로 되살아남 (쓰면 사라짐) */
  secondWind: { id: "secondWind", mods: [], effect: true },
  /** 방을 정리할 때마다 최대 체력의 8% 회복 */
  regenCharm: { id: "regenCharm", mods: [], effect: true },
  /** 적이 주는 돈 +50%, 방 정리 보상 돈 +50% */
  goldPouch: { id: "goldPouch", mods: [], effect: true },
  /** 대시 대기 시간 40% 감소 */
  dashCloak: { id: "dashCloak", mods: [], effect: true },
  /** 여신의 축복 (라스트 보스 층 시작 방 여신상 앞): 대시 대기 시간 50% 감소 · 이동 속도 +0.3 · 쓰러질 때 한 번 체력 50%로 되살아남 */
  goddessBlessing: { id: "goddessBlessing", mods: [{ stat: "moveSpeed", add: 0.3 }], effect: true, special: true },
  heavyPlate: { id: "heavyPlate", mods: [{ stat: "maxHp", add: 40 }, { stat: "moveSpeed", add: -0.15 }] },
  // 떠돌이 전용: 공격 방식을 바꾸는 아이템 (원거리 무기일 때 효과, 한 판에 하나씩)
  /** 화살이 벽에 맞으면 튕김 (최대 2번) */
  ricochet: { id: "ricochet", mods: [], exclusive: "drifter", effect: true },
  /** 화살이 적에게 맞으면 양옆 대각선 두 갈래로 갈라짐 (절반 피해) */
  splitHead: { id: "splitHead", mods: [], exclusive: "drifter", effect: true },
  /** 화살이 가까운 적 쪽으로 휘어짐 */
  seekerFeather: { id: "seekerFeather", mods: [], exclusive: "drifter", effect: true },
  /** 공격할 때 뒤쪽으로도 한 발 (60% 피해) */
  backQuiver: { id: "backQuiver", mods: [], exclusive: "drifter", effect: true },
  /** 빗나간 화살이 사거리 끝에서 한 번 되돌아옴 */
  returnFletch: { id: "returnFletch", mods: [], exclusive: "drifter", effect: true },
  /** 처치 후 3초 안에 또 처치하면 공격 속도 +10%씩 (최대 5번) */
  huntFrenzy: { id: "huntFrenzy", mods: [], exclusive: "drifter", effect: true },
  /** 0.5초 이상 가만히 서 있으면 공격력 +50% */
  steadyBreath: { id: "steadyBreath", mods: [], exclusive: "drifter", effect: true },
  /** 대시 직후 1.5초 안의 첫 공격이 2배 피해 */
  ambush: { id: "ambush", mods: [], exclusive: "drifter", effect: true },
  /** 4번째 공격마다 발 수 +2 (부채꼴) */
  volleyCharm: { id: "volleyCharm", mods: [], exclusive: "drifter", effect: true },
  /** 처치할 때마다 대시 대기 시간 0.25초 감소 */
  chaseSteps: { id: "chaseSteps", mods: [], exclusive: "drifter", effect: true },
  // 파수꾼 전용 (근접 무기일 때 효과, 한 판에 하나씩)
  /** 맞으면 주변 적을 밀어내며 공격력만큼 피해 */
  counterGuard: { id: "counterGuard", mods: [], exclusive: "warden", effect: true },
  /** 3번째 공격마다 한 바퀴 휘두름 */
  spinCleave: { id: "spinCleave", mods: [], exclusive: "warden", effect: true },
  /** 휘두를 때마다 앞으로 검기를 날림 (50% 피해, 3명 관통) */
  waveSlash: { id: "waveSlash", mods: [], exclusive: "warden", effect: true },
  /** 체력 25% 이하 적에게 피해 2배 */
  executioner: { id: "executioner", mods: [], exclusive: "warden", effect: true },
  /** 처치하면 최대 체력의 3% 회복 */
  lifeLeech: { id: "lifeLeech", mods: [], exclusive: "warden", effect: true },
  /** 체력이 낮을수록 공격력 증가 (최대 +60%) */
  rage: { id: "rage", mods: [], exclusive: "warden", effect: true },
  /** 대시로 지나간 적에게 공격력 1.5배 피해 */
  dashSlash: { id: "dashSlash", mods: [], exclusive: "warden", effect: true },
  /** 대시가 끝나면 주변에 충격파 (공격력만큼 피해) */
  earthshaker: { id: "earthshaker", mods: [], exclusive: "warden", effect: true },
  /** 체력 30% 이하면 맞은 뒤 무적 시간 2배 */
  lastStand: { id: "lastStand", mods: [], exclusive: "warden", effect: true },
  /** 0.5초 이상 가만히 서 있으면 받는 피해 절반 */
  bulwarkStance: { id: "bulwarkStance", mods: [], exclusive: "warden", effect: true },
  // 마법사 전용 (마법탄일 때 효과, 한 판에 하나씩)
  /** 적이 쓰러진 자리에서 작은 폭발 (공격력 50%) */
  chainBurst: { id: "chainBurst", mods: [], exclusive: "mage", effect: true },
  /** 폭발 범위 +50%, 주변 피해 70% */
  wideBlast: { id: "wideBlast", mods: [], exclusive: "mage", effect: true },
  /** 방에 들어갈 때마다 2초 동안 피해 없음 */
  arcaneShield: { id: "arcaneShield", mods: [], exclusive: "mage", effect: true },
  /** 5번째 공격마다 가까운 적 3명에게 폭발 */
  starShower: { id: "starShower", mods: [], exclusive: "mage", effect: true },
  /** 0.5초 이상 가만히 서 있으면 공격 속도 +40% */
  overcharge: { id: "overcharge", mods: [], exclusive: "mage", effect: true },
  /** 맞은 적이 2초간 불탐 (총 공격력만큼 피해) */
  igniteTip: { id: "igniteTip", mods: [], exclusive: "mage", effect: true },
  /** 폭발이 주변 적을 크게 밀어냄 */
  tempestBreath: { id: "tempestBreath", mods: [], exclusive: "mage", effect: true },
  /** 폭발한 자리에서 1초 뒤 한 번 더 폭발 (절반 피해) */
  echoBolt: { id: "echoBolt", mods: [], exclusive: "mage", effect: true },
  /** 한 번의 폭발로 적 3명 이상 맞히면 체력 5 회복 */
  manaDrain: { id: "manaDrain", mods: [], exclusive: "mage", effect: true },
  /** 마법탄이 적 1명을 뚫고 지나감 */
  piercingBolt: { id: "piercingBolt", mods: [], exclusive: "mage", effect: true },
  // 음양사 전용 (부적일 때 효과, 한 판에 하나씩)
  /** 공격마다 20% 확률로 유도 부적 한 장 더 (60% 피해) */
  resolve: { id: "resolve", mods: [], exclusive: "mystic", effect: true },
  /** 사거리 +20%, 투사체 속도 +20% */
  mindEye: { id: "mindEye", mods: [{ stat: "range", mul: 1.2 }, { stat: "projectileSpeed", mul: 1.2 }], exclusive: "mystic", effect: true },
  /** 투사체 속도 -20%, 공격력 +4 */
  yinForce: { id: "yinForce", mods: [{ stat: "projectileSpeed", mul: 0.8 }, { stat: "damage", add: 4 }], exclusive: "mystic", effect: true },
  /** 공격 속도 +30%, 공격력 -2 */
  yangForce: { id: "yangForce", mods: [{ stat: "attackSpeed", mul: 1.3 }, { stat: "damage", add: -2 }], exclusive: "mystic", effect: true },
  /** 최대 체력 +20, 맞은 뒤 3초 무적 */
  barrier: { id: "barrier", mods: [{ stat: "maxHp", add: 20 }], exclusive: "mystic", effect: true },
  /** 공격마다 구슬 한 발 더 (30% 피해, 2명 관통) */
  jadeOrb: { id: "jadeOrb", mods: [], exclusive: "mystic", effect: true },
  /** 부적에 맞은 일반 적이 10% 확률로 바로 쓰러짐 (보스 제외) */
  deathSeal: { id: "deathSeal", mods: [], exclusive: "mystic", effect: true },
  /** 사거리 안의 적 이동 속도 -30% */
  domain: { id: "domain", mods: [], exclusive: "mystic", effect: true },
  /** 부적 추가 효과가 터질 때마다 최대 체력의 3% 회복 */
  lifeSiphon: { id: "lifeSiphon", mods: [], exclusive: "mystic", effect: true },
  /** 공격마다 30% 확률로 부적 추가 효과가 바로 터짐 */
  prajna: { id: "prajna", mods: [], exclusive: "mystic", effect: true },
  // 기계공학자 전용 (기계공학자 무기의 모든 공격에 효과, 한 판에 하나씩). 수치는 sim/laser·laserWeapons의 상수
  /** 레이저 굵기 증가 + 피해 +10%, 첫 대상 바로 뒤에 붙어 있는 적도 같이 맞음. 레이저가 아닌 무기는 공격 범위 +15% */
  highLens: { id: "highLens", mods: [], exclusive: "engineer", effect: true },
  /** 레이저가 가까운 다른 적 1명에게도 갈라져 나감 (모든 빔 피해 -10%, 대상은 모두 합쳐 최대 6명). 레이저가 아닌 무기는 보조 레이저 (40%) */
  beamSplitter: { id: "beamSplitter", mods: [], exclusive: "engineer", effect: true },
  /** 공격받은 적에게 열이 쌓여 2초 분량이 차면 열폭발 (주변에 공격력 120%) */
  heatBuildup: { id: "heatBuildup", mods: [], exclusive: "engineer", effect: true },
  /** 같은 적을 계속 공격하면 0.5초마다 피해 +10% (최대 +50%, 대상이 바뀌면 처음부터) */
  focusCoil: { id: "focusCoil", mods: [], exclusive: "engineer", effect: true },
  /** 레이저가 첫 대상을 뚫고 뒤쪽 적 1명을 더 맞힘 (50% 피해). 테슬라는 번개 1명 더, 범위 공격 무기는 피해 +15% */
  refractPrism: { id: "refractPrism", mods: [], exclusive: "engineer", effect: true },
  /** 사거리 +15%, 공격 속도 +10% */
  coolingSystem: { id: "coolingSystem", mods: [{ stat: "range", mul: 1.15 }, { stat: "attackSpeed", mul: 1.1 }], exclusive: "engineer", effect: true },
  /** 같은 적을 2초 계속 공격할 때마다 그 자리에 작은 폭발 (공격력 200%) */
  overloadBurst: { id: "overloadBurst", mods: [], exclusive: "engineer", effect: true },
  /** 처치하면 보호막 4 (최대 체력의 25%까지 쌓임, 체력보다 먼저 깎임) */
  energyRecycle: { id: "energyRecycle", mods: [], exclusive: "engineer", effect: true },
  /** 맞은 적은 받는 피해 +2%씩 (최대 10번, +20%) */
  armorMelt: { id: "armorMelt", mods: [], exclusive: "engineer", effect: true },
  /** 체력 50% 이하일 때 피해 +20%, 레이저 굵기 증가 */
  overclock: { id: "overclock", mods: [], exclusive: "engineer", effect: true },
  ...ELEMENTAL_PASSIVES,
  ...BRAWLER_PASSIVES,
  ...GUNNER_PASSIVES,
  ...BEAST_PASSIVES,
  ...DOCTOR_PASSIVES,
  ...NINJA_PASSIVES,
  ...CHRONO_PASSIVES,
  ...SUMMON_PASSIVES,
  ...BEDOUIN_PASSIVES,
  ...GENERAL_PASSIVES,
  ...IMUGI_PASSIVES,
  ...APOSTLE_PASSIVES,
  ...STAR_PASSIVES,
  ...DUCK_PASSIVES,
  ...SCRIBE_PASSIVES,
  ...ABANDONED_PASSIVES,
  ...TITAN_PASSIVES,
  ...ONI_PASSIVES,
  ...S2_PASSIVES,
  ...HIDDEN_PASSIVES,
  ...DEVIL_PASSIVES,
  // 업적으로 해금 (해금 전에는 나오지 않음)
  quickDraw: { id: "quickDraw", mods: [{ stat: "attackSpeed", mul: 1.2 }, { stat: "damage", mul: 0.9 }] },
  goldTooth: { id: "goldTooth", mods: [{ stat: "luck", add: 2 }] },
  ironSkin: { id: "ironSkin", mods: [{ stat: "maxHp", add: 30 }, { stat: "damage", add: 2 }] },
} as const satisfies Record<string, PassiveDef>;

export type PassiveId = keyof typeof PASSIVES;
export const PASSIVE_IDS = Object.keys(PASSIVES) as PassiveId[];

/** 사용 아이템: 쓰면 없어짐 (종류는 임시) */
export const USE_ITEMS = {
  /** 최대 체력의 35% 회복 */
  potion: { id: "potion", healRatio: 0.35 },
  /** 주변 적에게 큰 피해 */
  bomb: { id: "bomb", damage: 45, radius: 64 },
  /** 3초 동안 피해를 받지 않음 */
  ward: { id: "ward", ticks: 180 },
  /** 돈주머니: 쓰면 돈 + 50 */
  moneyBag: { id: "moneyBag", gold: 25 },
  // 업적으로 해금
  /** 체력 모두 회복 */
  elixir: { id: "elixir", healRatio: 1 },
  /** 4초 동안 적·적 탄이 멈춤 */
  frost: { id: "frost", ticks: 240 },
  // 히든 상점에서만 (itemsHidden)
  ...HIDDEN_USES,
} as const;

export type UseItemId = keyof typeof USE_ITEMS;

/** 서든데스(한 대 맞으면 끝)에서 나오지 않는 체력 회복 아이템 ("종류:id") */
export const HEAL_ITEMS: ReadonlySet<string> = new Set([
  "use:potion",
  "use:elixir",
  "passive:secondWind",
  "passive:regenCharm",
  "passive:lifeLeech",
  "passive:manaDrain",
  "passive:lifeSiphon",
  "passive:ration",
  "passive:catNap",
  "passive:purr",
  "passive:breadSnack",
  "passive:nineLives",
  "passive:energyRecycle",
  "passive:antibody",
  "passive:eternity",
]);
export const USE_ITEM_IDS = Object.keys(USE_ITEMS) as UseItemId[];
export const USE_SLOT_COUNT = 2;
