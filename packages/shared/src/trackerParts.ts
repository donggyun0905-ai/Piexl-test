// 추적자 튜닝소 부품 (라스트 보스 층 상점 대신, sim/trTune). 부위 6곳 · 부위마다 부품 3~4개 (0번 = 처음 끼운 기본 부품, 효과 없음)
// 효과는 편의성만 (공격력·공격 속도 없음). 숫자 = 강화 0단계 값, 강화 단계마다 효과가 TUNE.lvStep만큼 커짐
// 효과 이름: range·move·proj 사거리·이동 속도·탄속 배율 · hp 최대 체력 + · luck 행운 + · cd 모든 스킬 대기 배율 · cd3 연발사격 대기 배율
// · scopeR 암습 조준 원 배율 · ambT 암습 제한 시간 배율 · shield 암습 보호막 + · spread 연발 흔들림 배율 · wall 강력한 한방 벽 폭 배율

export type TunePartFx = Partial<Record<"range" | "move" | "proj" | "hp" | "luck" | "cd" | "cd3" | "scopeR" | "ambT" | "shield" | "spread" | "wall", number>>;

export interface TunePart {
  id: string;
  fx: TunePartFx;
}

export interface TuneSlot {
  id: "barrel" | "scope" | "stock" | "mag" | "muzzle" | "rail";
  parts: readonly TunePart[];
}

export const TUNE_SLOTS: readonly TuneSlot[] = [
  {
    id: "barrel",
    parts: [
      { id: "barrelStd", fx: {} },
      { id: "barrelLong", fx: { range: 1.12 } },
      { id: "barrelFluted", fx: { move: 1.06 } },
      { id: "barrelRifled", fx: { proj: 1.25 } },
    ],
  },
  {
    id: "scope",
    parts: [
      { id: "scope4x", fx: {} },
      { id: "scope8x", fx: { scopeR: 1.4 } },
      { id: "scopeThermal", fx: { ambT: 1.3 } },
      { id: "scopeHolo", fx: { range: 1.06, scopeR: 1.15 } },
    ],
  },
  {
    id: "stock",
    parts: [
      { id: "stockFixed", fx: {} },
      { id: "stockFolding", fx: { move: 1.08 } },
      { id: "stockPad", fx: { hp: 15 } },
      { id: "stockAdjust", fx: { spread: 0.65 } },
    ],
  },
  {
    id: "mag",
    parts: [
      { id: "magStd", fx: {} },
      { id: "magExtended", fx: { cd3: 0.75 } },
      { id: "magClip", fx: { cd: 0.9 } },
      { id: "magDrum", fx: { shield: 15 } },
    ],
  },
  {
    id: "muzzle",
    parts: [
      { id: "muzzleBare", fx: {} },
      { id: "muzzleSuppressor", fx: { ambT: 1.2 } },
      { id: "muzzleBrake", fx: { spread: 0.75 } },
      { id: "muzzleFlash", fx: { move: 1.04, luck: 1 } },
    ],
  },
  {
    id: "rail",
    parts: [
      { id: "railNone", fx: {} },
      { id: "railBipod", fx: { wall: 1.4 } },
      { id: "railTactical", fx: { range: 1.06, move: 1.03 } },
      { id: "railGhillie", fx: { luck: 3 } },
    ],
  },
];

/** 튜닝소 수치: 부품 갈아 끼우기·강화 값(골드, 층마다 조금씩 오름) · 강화 단계마다 효과 + · 최대 단계 · 다음 단계 성공 확률 (0→1 100% · 75 · 50 · 25 · 그 뒤로 10%) */
export const TUNE = {
  swapCost: 20,
  upCost: 30,
  upCostStep: 15,
  perFloor: 3,
  lvStep: 0.15,
  maxLv: 10,
  chances: [1, 0.75, 0.5, 0.25, 0.1] as readonly number[],
};

/** 효과 이름 중 배율 (나머지는 더하기) */
export const TUNE_MUL_KEYS: readonly (keyof TunePartFx)[] = ["range", "move", "proj", "cd", "cd3", "scopeR", "ambT", "spread", "wall"];
