// 비르디아 공생 정령 10종 수치 (로그만 · 시작할 때 3장 중 1장 고름 · 계산 sim/factionSpirit·spiritAllies·spiritPack)
// 버프형 3 (햇살·꽃·가시) · 동행형 3 (숲늑대·부엉이·이끼 골렘) · 도박형 1 (여우) · 꾸러미형 3 (보관·상자·먹보)

export type SpiritId = "sun" | "bloom" | "thorn" | "wolf" | "owl" | "golem" | "fox" | "bag" | "chest" | "glutton";
export type SpiritKind = "buff" | "ally" | "gamble" | "pack";

export const SPIRIT_IDS: readonly SpiritId[] = ["sun", "bloom", "thorn", "wolf", "owl", "golem", "fox", "bag", "chest", "glutton"];
export const SPIRIT_KIND: Record<SpiritId, SpiritKind> = { sun: "buff", bloom: "buff", thorn: "buff", wolf: "ally", owl: "ally", golem: "ally", fox: "gamble", bag: "pack", chest: "pack", glutton: "pack" };

/** 공통: 처치 수로 자람 (싹 → 꽃 → 나무) · 단계마다 정령 세기 배율 */
export const SPIRIT_GROW = {
  /** 꽃 · 나무가 되는 처치 수 */
  grow1: 30,
  grow2: 80,
  /** 단계별 세기 배율 (버프 수치·동행 피해에 곱함) */
  power: [1, 1.3, 1.6],
};

/** 버프형 수치 */
export const SPIRIT_BUFF = {
  /** 햇살 정령: 주는 피해 증가 · 처치하면 이 틱 동안 공격 속도 증가 */
  sunDmg: 0.1,
  sunSpeed: 0.2,
  sunTicks: 180,
  /** 꽃 정령: 이 틱마다 최대 체력의 이만큼 회복 · 방을 끝내면 회복 */
  bloomEvery: 240,
  bloomHeal: 0.012,
  bloomRoom: 0.05,
  /** 가시 정령: 받는 피해 감소 · 맞으면 둘레 가시 폭발 (반지름 · 공격력 배율) */
  thornTaken: 0.12,
  thornR: 50,
  thornMul: 1.5,
};

/** 동행형 수치 (따로 움직이며 싸움 · 맞지 않음) */
export const SPIRIT_ALLY = {
  /** 숲늑대: 달리는 빠르기 · 무는 거리 · 무는 간격 틱 · 피해(공격력 배율) */
  wolfSpeed: 2.4,
  wolfReach: 14,
  wolfEvery: 36,
  wolfMul: 0.55,
  /** 부엉이: 내 둘레를 도는 반지름 · 급강하 간격 틱 · 급강하 폭발 반지름 · 피해 */
  owlOrbit: 60,
  owlEvery: 180,
  owlR: 32,
  owlMul: 2.5,
  /** 이끼 골렘: 걷는 빠르기 · 내려찍는 거리 · 간격 틱 · 둘레 반지름 · 피해 · 속박 틱 */
  golemSpeed: 0.9,
  golemReach: 40,
  golemEvery: 120,
  golemR: 46,
  golemMul: 1.2,
  golemRoot: 48,
};

/** 도박형(여우) · 꾸러미형 수치 */
export const SPIRIT_PACK = {
  /** 여우: 이만큼 방을 끝낼 때마다 바꾸기 1번 (최대 모아 둘 수) */
  foxRooms: 5,
  foxMax: 3,
  /** 보관 꾸러미: 넣어 둘 수 있는 사용 아이템 수 · 이만큼 방을 끝낼 때마다 무작위 사용 아이템 하나 */
  bagMax: 8,
  bagRooms: 3,
  /** 상자 꾸러미: 아이템을 이만큼 주울 때마다 고르는 상자 (패시브 3개 중 1개) */
  chestEvery: 4,
  /** 먹보 꾸러미: 방에 두고 나온 아이템을 먹음 · 이만큼 먹으면 새 패시브 하나 */
  gluttonEvery: 5,
};
