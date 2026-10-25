// 로비 펫 상점 펫 8마리: 로비 칩으로 사고, 한 판에 한 마리 데리고 감 (순위 경쟁 모드에는 못 데려감). 능력은 sim/lobbyPet
export type LobbyPetId = "cat" | "dog" | "slime" | "dragon" | "bunny" | "chick" | "phoenix" | "turtle";
export const LOBBY_PET_IDS: readonly LobbyPetId[] = ["cat", "dog", "slime", "bunny", "chick", "dragon", "turtle", "phoenix"];

/** 가격(칩) · 능력 수치 (배율 1 = 100%, 시간은 틱) */
export const LOBBY_PETS = {
  /** 고양이: 같이 할큄 (가까운 적, 1초마다 공격력 40%) */
  cat: { price: 30000, every: 60, mul: 0.4, reach: 70 },
  /** 강아지: 같이 묾 (1.25초마다 공격력 60%) */
  dog: { price: 40000, every: 75, mul: 0.6, reach: 70 },
  /** 슬라임: 받는 피해 -8% */
  slime: { price: 50000, taken: 0.92 },
  /** 토끼: 이동 속도 +10% */
  bunny: { price: 50000, move: 1.1 },
  /** 병아리: 치명타 확률 +5% (치명타 1.5배) */
  chick: { price: 60000, crit: 0.05, critMul: 1.5 },
  /** 아기 용: 사거리 +10% */
  dragon: { price: 80000, range: 1.1 },
  /** 황금 거북: 얻는 돈 +20% */
  turtle: { price: 100000, gold: 1.2 },
  /** 불사조: 목숨 +1 (한 판에 한 번 체력 50%로 되살아남) */
  phoenix: { price: 150000, hp: 0.5 },
} as const;
