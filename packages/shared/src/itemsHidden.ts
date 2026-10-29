// 히든 아이템: 차원의 순례자(히든 상점, sim/pilgrim)에서만 나옴 (special이라 보상·보통 상점에는 없음). 효과는 sim/hiddenPerks·hiddenUse, 수치는 HIDDEN_PERKS
import type { PassiveDef } from "./items";
import type { StatMod } from "./stats";

const H = <T extends string>(id: T, mods: StatMod[] = []) => ({ id, mods, special: true as const });

export const HIDDEN_PASSIVES = {
  /** 아티팩터의 금기된 아티팩트 7색: 처치마다 쌓임 (왼쪽 위 그 색 스택 창) */
  relicRed: H("relicRed"),
  relicBlue: H("relicBlue"),
  relicSilver: H("relicSilver"),
  relicGold: H("relicGold"),
  relicPrism: H("relicPrism"),
  relicWhite: H("relicWhite"),
  relicGreen: H("relicGreen"),
  /** 이프리트의 발톱: 맞힐 때마다 화상 (5번까지 겹쳐 세짐) */
  ifritClaw: H("ifritClaw"),
  /** 실피드의 화살통: 맞힐 때 50%로 회오리 */
  sylphQuiver: H("sylphQuiver"),
  /** 노움의 망치: 맞힌 자리에 늘 작은 범위 공격 (피해 50%) */
  gnomeHammer: H("gnomeHammer"),
  /** 드라이어드의 수정구: 1초마다 30%로 체력 3% */
  dryadOrb: H("dryadOrb"),
  /** 아프로디테의 거울: 맞으면 30%로 앞에 거울, 받은 피해 2배 빛 레이저 */
  aphroditeMirror: H("aphroditeMirror"),
  /** 떨어진 신의 파편: 얻을 때 열 가지 중 하나 (sim/hiddenPerks.shardOf) */
  godShard: H("godShard"),
} as const satisfies Record<string, PassiveDef>;

/** 히든 사용 아이템 (아이템 칸) */
export const HIDDEN_USES = {
  /** 에테르 폭탄: 폭탄 피해 3배 · 범위 1.6배 */
  aetherBomb: { id: "aetherBomb", damage: 135, radius: 70 },
  /** 대마법사의 금지된 주문서: 방 곳곳에 메테오 (한 발 피해 · 발 수 · 범위 · 떨어지기까지 틱 · 발 사이 틱) */
  forbiddenScroll: { id: "forbiddenScroll", damage: 60, count: 14, radius: 30, fuse: 50, gap: 6 },
  /** 차원이동문: 이 층을 건너뛰고 다음 층 (마지막 층이면 클리어) */
  dimensionGate: { id: "dimensionGate" },
} as const;

/** 히든 상점에서만 나오는 사용 아이템 (보통 보상·상점 목록에서 뺌) */
export const HIDDEN_USE_IDS: readonly string[] = Object.keys(HIDDEN_USES);

/** 히든 상점에 나오는 것 (만든 것만, 계획서 '히든 아이템' 차례) */
export const HIDDEN_STOCK: readonly { kind: "passive" | "use"; id: string }[] = [
  ...(["aetherBomb", "forbiddenScroll", "dimensionGate"] as const).map((id) => ({ kind: "use" as const, id })),
  ...(Object.keys(HIDDEN_PASSIVES) as (keyof typeof HIDDEN_PASSIVES)[]).map((id) => ({ kind: "passive" as const, id })),
];

/** 히든 아이템 수치 (배율 1 = 100%, 시간은 틱) */
export const HIDDEN_PERKS = {
  /** 아티팩트: 처치 하나마다 (공격력 + · 공격 속도 배율 + · 방어력 + · 치명타 확률 + · 치명타 피해 + · 최대 체력 + · 재생력 +) */
  relicRed: { per: 0.02 },
  relicBlue: { per: 0.0002 },
  relicSilver: { per: 0.02 },
  relicGold: { per: 0.0002 },
  relicPrism: { per: 0.001 },
  relicWhite: { per: 0.1 },
  relicGreen: { per: 0.1 },
  /** 화상: 한 번에 공격력 × burn (겹칠 때마다 더해짐) · 최대 겹침 · 지속 틱 */
  ifritClaw: { burn: 0.15, stacks: 5, ticks: 180 },
  /** 회오리: 확률 · 지속 틱 · 한 번 벨 때 공격력 배율 */
  sylphQuiver: { chance: 0.5, ticks: 150, mul: 0.25 },
  /** 범위: 반지름 · 피해 배율 */
  gnomeHammer: { r: 22, mul: 0.5 },
  /** 회복: 확률 · 최대 체력 비율 · 몇 틱마다 */
  dryadOrb: { chance: 0.3, heal: 0.03, every: 60 },
  /** 거울: 확률 · 받은 피해 배율 · 레이저 길이·폭 */
  aphroditeMirror: { chance: 0.3, mul: 2, len: 160, width: 10 },
  /** 신의 파편 열 가지: 공격력 배율 · 공격 속도 배율 · 방어력 · 재생력 · 이동 속도 · 치명타 확률 · 치명타 피해 · 예리함 · 행운 · 사거리 */
  godShard: { damage: 1.3, speed: 1.3, defense: 15, regen: 20, move: 0.5, crit: 0.5, critDmg: 1.5, sharp: 0.3, luck: 10, range: 100 },
};

/** 히든 상점 가격 (골드): 패시브 · 사용 아이템 · 층마다 + */
export const PILGRIM_PRICE = { passive: 180, use: 120, perFloor: 10 };
