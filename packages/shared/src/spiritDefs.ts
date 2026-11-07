// 비르디아 공생 정령 11종 수치 (로그만 · 시작할 때 3장 중 1장 고름 · 계산 sim/factionSpirit·spiritAllies·spiritPack·spiritCoin)
// 버프형 3 (햇살·꽃·가시) · 동행형 3 (숲늑대·부엉이·이끼 골렘) · 도박형 2 (구미호·욕심 많은 코인) · 꾸러미형 3 (보따리·미믹·돼지)
// 버프형·동행형은 처치 수로 자람 (유년기 → 성장기 → 성숙기 → 궁극체) · 도박형·꾸러미형은 처음부터 궁극체

export type SpiritId = "sun" | "bloom" | "thorn" | "wolf" | "owl" | "golem" | "fox" | "coin" | "bag" | "chest" | "glutton";
export type SpiritKind = "buff" | "ally" | "gamble" | "pack";

export const SPIRIT_IDS: readonly SpiritId[] = ["sun", "bloom", "thorn", "wolf", "owl", "golem", "fox", "coin", "bag", "chest", "glutton"];
export const SPIRIT_KIND: Record<SpiritId, SpiritKind> = { sun: "buff", bloom: "buff", thorn: "buff", wolf: "ally", owl: "ally", golem: "ally", fox: "gamble", coin: "gamble", bag: "pack", chest: "pack", glutton: "pack" };

/** 버프형·동행형 자람: 처치 수 (0 유년기 → 성장기 → 성숙기 → 궁극체) */
export const SPIRIT_GROW = {
  /** 성장기가 되는 처치 수 */
  grow1: 20,
  /** 성숙기가 되는 처치 수 */
  grow2: 50,
  /** 궁극체가 되는 처치 수 */
  grow3: 100,
};

/** 버프형 수치: 상시가 아니라 주기마다 켜짐 (cycle 틱마다 · active 틱 동안) · 유년기는 효과 없음 */
export const SPIRIT_BUFF = {
  /** 버프 대기 시간 틱 (20초, 켜지는 순간부터 셈) */
  cycle: 1200,
  /** 버프 유지 틱 (10초) */
  active: 600,
  /** 햇살 정령: 주는 피해 증가 (성장기 · 성숙기·궁극체) */
  sunDmg1: 0.05,
  sunDmg2: 0.1,
  /** 햇살 정령 궁극체: 처치하면 이 틱 동안 공격 속도 증가 */
  sunSpeed: 0.2,
  sunTicks: 180,
  /** 꽃 정령 성장기: 이 틱마다 최대 체력의 이만큼 회복 */
  bloomEvery1: 480,
  bloomHeal1: 0.01,
  /** 꽃 정령 성숙기·궁극체: 이 틱마다 최대 체력의 이만큼 회복 */
  bloomEvery2: 240,
  bloomHeal2: 0.012,
  /** 꽃 정령 궁극체: 방을 끝내면 최대 체력의 이만큼 회복 */
  bloomRoom: 0.05,
  /** 가시 정령: 받는 피해 감소 (성장기 · 성숙기·궁극체) */
  thornTaken1: 0.06,
  thornTaken2: 0.12,
  /** 가시 정령 궁극체: 맞으면 둘레 가시 폭발 (반지름 · 공격력 배율) */
  thornR: 50,
  thornMul: 1.5,
};

/** 동행형 수치 (따로 움직이며 싸움 · 맞지 않음) · 유년기는 고정 피해 */
export const SPIRIT_ALLY = {
  /** 유년기 고정 피해 */
  fixed: 1,
  /** 숲늑대: 달리는 빠르기 · 무는 거리 */
  wolfSpeed: 2.4,
  wolfReach: 14,
  /** 숲늑대 무는 간격 틱 (유년기·성장기 · 성숙기 · 궁극체) */
  wolfEvery1: 72,
  wolfEvery2: 60,
  wolfEvery3: 36,
  /** 숲늑대 피해 (공격력 배율: 성장기 · 성숙기 · 궁극체) */
  wolfMul1: 0.25,
  wolfMul2: 0.35,
  wolfMul3: 0.55,
  /** 부엉이: 내 둘레를 도는 반지름 · 깃털이 날아가는 거리 */
  owlOrbit: 60,
  owlRange: 170,
  /** 부엉이 깃털 간격 틱 (유년기·성장기 · 성숙기) · 깃털 수 (성장기 · 성숙기) */
  owlEvery1: 60,
  owlEvery2: 48,
  owlN1: 3,
  owlN2: 4,
  /** 부엉이 깃털 피해 (공격력 배율: 성장기 · 성숙기) */
  owlMul1: 0.25,
  owlMul2: 0.35,
  /** 부엉이 궁극체: 급강하 간격 틱 · 폭발 반지름 · 피해 */
  owlEvery3: 180,
  owlR: 32,
  owlMul3: 2.5,
  /** 이끼 골렘: 걷는 빠르기 · 내려찍는 거리 · 둘레 반지름 */
  golemSpeed: 0.9,
  golemReach: 40,
  golemR: 46,
  /** 이끼 골렘 내려찍기 간격 틱 (유년기·성장기 · 성숙기 · 궁극체) */
  golemEvery1: 240,
  golemEvery2: 180,
  golemEvery3: 120,
  /** 이끼 골렘 피해 (공격력 배율: 성장기 · 성숙기 · 궁극체) */
  golemMul1: 0.6,
  golemMul2: 0.8,
  golemMul3: 1.2,
  /** 이끼 골렘 궁극체: 묶는 틱 */
  golemRoot: 48,
};

/** 도박형 · 꾸러미형 수치 (처음부터 궁극체) */
export const SPIRIT_PACK = {
  /** 구미호: 이만큼 방을 끝낼 때마다 바꾸기 1번 (최대 모아 둘 수) · 5번 키로 방 안 아이템을 전부 바꿈 */
  foxRooms: 5,
  foxMax: 3,
  /** 보따리 정령: 넣어 둘 수 있는 사용 아이템 수 · 이만큼 방을 끝낼 때마다 무작위 사용 아이템 하나 */
  bagMax: 8,
  bagRooms: 3,
  /** 미믹 정령: 아이템을 이만큼 주울 때마다 고르는 상자 (패시브 3개 중 1개) */
  chestEvery: 4,
  /** 돼지 정령: 방에 두고 나온 아이템을 먹음 · 이만큼 먹으면 새 패시브 하나 */
  gluttonEvery: 5,
};

/** 욕심 많은 코인 정령: 주우려는 아이템을 다 먹고 가치만큼 점수 → 5번 키로 점수 단계만큼 상자 (단계 점수를 씀) */
export const SPIRIT_COIN = {
  /** 아이템 가치: 사용 아이템 · 무기 · 공용 패시브 · 캐릭터 전용 패시브 · 악마 패시브 · 히든(히든 상점) */
  use: 4,
  weapon: 8,
  passive: 12,
  own: 16,
  devil: 25,
  hidden: 150,
  /** 주황 방(강한 적 방)에서 먹으면 더함 */
  elite: 30,
  /** 보상 단계 점수 (1 ~ 5단계) */
  tier1: 100,
  tier2: 300,
  tier3: 500,
  tier4: 700,
  tier5: 900,
  /** 단계마다 캐릭터 전용 패시브 수 (없으면 공용 패시브로) */
  own1: 0,
  own2: 2,
  own3: 3,
  own4: 5,
  own5: 7,
  /** 단계마다 공용 패시브 수 */
  com1: 1,
  com2: 1,
  com3: 1,
  com4: 2,
  com5: 3,
  /** 단계마다 아이템(무기·사용 아이템) 수 */
  item1: 0,
  item2: 0,
  item3: 2,
  item4: 3,
  item5: 5,
};
