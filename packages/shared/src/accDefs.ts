// 레이드 장신구 (2026-11-10): 반지 3칸 · 목걸이 · 귀걸이 · 브로치 각 1칸. 세트 10개 × 종류 4 = 40개 + 전설 5개
// 별 1~5 (보상 상자는 1~3성, 승급으로 4·5성) · 기본 능력치(별·강화로 오름) · 추가 능력치 3줄(재설정) · 세트 효과(2·3·4개)
// 계산은 accRules(뽑기·승급·강화·재설정·합계) · sim/accStats(게임 안에 넣기). 레이드에서만 효과가 있음

export const ACC_KINDS = ["ring", "necklace", "earring", "brooch"] as const;
export type AccKind = (typeof ACC_KINDS)[number];
/** 장비 칸: 반지 3 · 목걸이 · 귀걸이 · 브로치 */
export const ACC_SLOTS: readonly AccKind[] = ["ring", "ring", "ring", "necklace", "earring", "brooch"];
/** 세트 수 (그림 시트의 순서: 0 제국의 보물 · 1 영광의 달빛 · 2 어둠의 인장 · 3 승리의 축복 · 4 불굴의 의지 · 5 자유의 날개 · 6 악마의 서약 · 7 응축된 대자연 · 8 예리한 달빛 · 9 꽃의 화답) */
export const ACC_SET_COUNT = 10;
export const ACC_LEGEND_COUNT = 5;

/** 능력치 이름 (합계·화면 글자 accStat_* 와 같음) */
export type AccStat =
  | "atk" // 공격력 + (더하기)
  | "atkPct" // 공격력 + %
  | "aspd" // 공격 속도 + %
  | "def" // 방어력
  | "hp" // 최대 체력
  | "range" // 사거리 (더하기)
  | "rangePct" // 사거리 + %
  | "move" // 이동 속도 (더하기)
  | "regen" // 재생력
  | "lifesteal" // 흡혈
  | "sharp" // 예리함
  | "crit" // 치명타 확률
  | "critDmg" // 치명타 피해
  | "dmg" // 주는 피해 + %
  | "taken" // 받는 피해 + % (줄면 -)
  | "dash" // 대시 재사용 시간 - %
  | "itemReset" // 확률로 사용 아이템 쿨타임 초기화 (얼음 세계 빼고)
  | "half" // 확률로 받는 피해 50% 감소
  | "weak" // 확률로 약점 공격 (피해 50% 더)
  | "cleanse" // 확률로 상태이상 제거 (1초마다)
  | "extra" // 확률로 추가 공격 30%
  | "extra15" // 확률로 추가 피해 15% (승리의 축복 4세트)
  | "revive" // 판에 한 번 체력 n 으로 부활 (큰 값 하나만)
  | "undying" // 목숨마다 한 번 죽을 피해를 받으면 체력 1로 3초 버팀
  | "heal5"; // 5초마다 최대 체력 n 회복

/** 수치 (관리자 페이지에서 바꿀 수 있음) */
export const ACC_RULES = {
  /** 보상 상자 카드 수 · 1성·2성 확률 (나머지 3성) · 전설 확률 (카드마다, 뜨면 5성) */
  cards: 10,
  star1: 0.63,
  star2: 0.32,
  legend: 0.006,
  /** 승급 재료 수: 3성→4성(같은 종류 3성) · 4성→5성(같은 장신구 4성) */
  promo4: 4,
  promo5: 3,
  /** 강화: 5성부터 · 최대 단계 */
  enhanceFrom: 5,
  enhanceMax: 10,
  /** 강화 비용(로비 칩): 1단계 · 2단계 · 3단계 · 그 뒤 단계마다 더함 */
  cost1: 10000,
  cost2: 50000,
  cost3: 100000,
  costStep: 50000,
  /** 강화 확률: 단계마다 (7단계부터 20% 고정) */
  rate1: 1,
  rate2: 0.85,
  rate3: 0.7,
  rate4: 0.55,
  rate5: 0.4,
  rate6: 0.25,
  rateMin: 0.2,
  /** 재설정 비용 (추가 능력치 3줄을 모두 다시) */
  rerollCost: 10000,
  /** 추가 공격 피해 배율 · 약점 공격 더하는 피해 · 버티기 틱 · 회복 간격 틱 · 상태이상 제거 간격 틱 */
  extraMul: 0.3,
  extra15Mul: 0.15,
  weakMul: 0.5,
  holdTicks: 180,
  healEvery: 300,
  cleanseEvery: 60,
};

/** 기본 능력치 (별 1~5) · 강화 한 단계마다 더하는 몫 (5성만 강화) */
export const ACC_BASE: Record<string, { stat: AccStat; star: readonly number[]; per: number }> = {
  ringAtk: { stat: "atk", star: [1, 2, 3, 4, 5], per: 0.5 },
  ringDef: { stat: "def", star: [1, 2, 3, 4, 5], per: 0.5 },
  ringAspd: { stat: "aspd", star: [0.01, 0.02, 0.03, 0.04, 0.05], per: 0.005 },
  necklace: { stat: "hp", star: [5, 10, 15, 20, 40], per: 4 },
  earring: { stat: "range", star: [2, 4, 6, 8, 10], per: 1 },
  // 브로치: 10강이면 대시 재사용 -40%
  brooch: { stat: "dash", star: [0.05, 0.1, 0.15, 0.2, 0.25], per: 0.015 },
};
/** 반지 기본 능력치 세 가지 중 하나 (뜰 때 정해지고 바꿀 수 없음) */
export const RING_BASES = ["ringAtk", "ringDef", "ringAspd"] as const;

/** 전설 장신구 (늘 5성 · 세트는 장착한 세트 중 하나를 골라 그 세트로 셈) · 강화하면 per만큼 같이 오름 */
export const ACC_LEGENDS: readonly { kind: AccKind; base: Partial<Record<AccStat, number>>; per: Partial<Record<AccStat, number>> }[] = [
  // 0 창공의 약속 (반지): 공격력 +5 · 방어력 +5 · 공격 속도 +5%
  { kind: "ring", base: { atk: 5, def: 5, aspd: 0.05 }, per: { atk: 0.5, def: 0.5, aspd: 0.005 } },
  // 1 혼돈의 결정체 (반지): 받는 피해 +20% · 주는 피해 +35% (강화는 피해만)
  { kind: "ring", base: { taken: 0.2, dmg: 0.35 }, per: { dmg: 0.015 } },
  // 2 창공의 약속 (귀걸이): 사거리 +10 · 공격 속도 +5%
  { kind: "earring", base: { range: 10, aspd: 0.05 }, per: { range: 1, aspd: 0.005 } },
  // 3 창공의 약속 (목걸이): 체력 +40 · 재생력 +5
  { kind: "necklace", base: { hp: 40, regen: 5 }, per: { hp: 4, regen: 0.5 } },
  // 4 창공의 약속 (브로치): 대시 재사용 -25% · 이동 속도 +0.15
  { kind: "brooch", base: { dash: 0.25, move: 0.15 }, per: { dash: 0.015, move: 0.015 } },
];

/** 추가 능력치 20가지: 수치 범위 · 뽑힐 무게(셀수록 낮음) · 표시 단위 (18번은 받는 피해 + 주는 피해 둘) */
export const ACC_OPTIONS: readonly { stat: AccStat; lo: number; hi: number; w: number; stat2?: AccStat; lo2?: number; hi2?: number }[] = [
  { stat: "atkPct", lo: 0.05, hi: 0.1, w: 10 },
  { stat: "aspd", lo: 0.05, hi: 0.1, w: 10 },
  { stat: "def", lo: 5, hi: 10, w: 10 },
  { stat: "regen", lo: 10, hi: 20, w: 10 },
  { stat: "lifesteal", lo: 0.005, hi: 0.01, w: 5 },
  { stat: "sharp", lo: 0.1, hi: 0.2, w: 8 },
  { stat: "crit", lo: 0.1, hi: 0.15, w: 7 },
  { stat: "critDmg", lo: 0.1, hi: 0.2, w: 8 },
  { stat: "hp", lo: 40, hi: 60, w: 10 },
  { stat: "dmg", lo: 0.03, hi: 0.07, w: 7 },
  { stat: "itemReset", lo: 0.1, hi: 0.3, w: 3 },
  { stat: "half", lo: 0.1, hi: 0.3, w: 3 },
  { stat: "weak", lo: 0.1, hi: 0.15, w: 5 },
  { stat: "cleanse", lo: 0.1, hi: 0.3, w: 5 },
  { stat: "extra", lo: 0.1, hi: 0.15, w: 4 },
  { stat: "revive", lo: 0.5, hi: 0.5, w: 2 },
  { stat: "revive", lo: 1, hi: 1, w: 0.6 },
  { stat: "taken", lo: 0.05, hi: 0.1, w: 4, stat2: "dmg", lo2: 0.1, hi2: 0.15 },
  { stat: "rangePct", lo: 0.1, hi: 0.2, w: 8 },
  { stat: "move", lo: 0.1, hi: 0.3, w: 8 },
];

/** 세트 효과: 세트마다 [2개, 3개, 4개] (쌓임) */
export const ACC_SET_BONUS: readonly (readonly Partial<Record<AccStat, number>>[])[] = [
  [{ range: 5 }, { regen: 10 }, { atkPct: 0.05 }],
  [{ crit: 0.05 }, { aspd: 0.05 }, { crit: 0.1 }],
  [{ dmg: 0.03 }, { def: 10 }, { critDmg: 0.15 }],
  [{ aspd: 0.03 }, { atkPct: 0.04 }, { extra15: 0.15 }],
  [{ def: 5 }, { taken: -0.1 }, { undying: 1 }],
  [{ move: 0.15 }, { aspd: 0.1 }, { extra: 0.15 }],
  [{ taken: 0.07 }, { dmg: 0.1 }, { lifesteal: 0.01 }],
  [{ regen: 5 }, { regen: 5, def: 5 }, { heal5: 0.03 }],
  [{ critDmg: 0.1 }, { move: 0.2 }, { crit: 0.15 }],
  [{ taken: -0.03 }, { range: 15 }, { itemReset: 0.15 }],
];

/** 가진 장신구 하나 */
export interface AccItem {
  /** 이 기기에서 붙인 번호 */
  uid: number;
  kind: AccKind;
  /** 세트 0~9 · 전설이면 -1 */
  set: number;
  /** 전설 번호 0~4 */
  legend?: number;
  star: number;
  /** 강화 단계 (5성만) */
  lv: number;
  /** 반지 기본 능력치 (RING_BASES 순서) */
  ringBase?: number;
  /** 추가 능력치 3줄: [ACC_OPTIONS 번호, 0~1 굴림] */
  opts: [number, number][];
  /** 전설: 셈할 세트 (장착한 세트 중 고름) */
  legSet?: number;
}

/** 저장되는 장신구 상태 (화면 storage) */
export interface AccBag {
  items: AccItem[];
  /** 칸마다 장착한 uid (ACC_SLOTS 순서) */
  slots: (number | null)[];
  next: number;
}
