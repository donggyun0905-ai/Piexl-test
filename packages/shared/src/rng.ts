// 시드 랜덤. 게임 결과를 정하는 랜덤은 모두 여기서만 만든다 (Math.random 금지).
// 같은 시드 + 같은 이름이면 화면·서버 어디서나 같은 수열이 나온다.

/** 문자열을 32비트 수로 (FNV-1a) */
export function hashString(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * 용도별로 나눈 시드. 예: deriveSeed(seed, "floor", 2, "room", 5)
 * 층·방·보상·상점·적 행동마다 따로 만들어, 한쪽에서 랜덤을 더 써도 다른 쪽 결과가 바뀌지 않게 한다.
 */
export function deriveSeed(seed: number, ...labels: (string | number)[]): number {
  return hashString(`${seed >>> 0}/${labels.join("/")}`);
}

export interface Rng {
  /** 0 이상 2^32 미만 정수 */
  nextU32(): number;
  /** 0 이상 1 미만 */
  nextFloat(): number;
  /** min 이상 max 이하 정수 */
  int(min: number, max: number): number;
  /** 배열에서 하나 */
  pick<T>(items: readonly T[]): T;
}

/** sfc32 */
export function createRng(seed: number): Rng {
  let a = 0x9e3779b9;
  let b = 0x243f6a88;
  let c = 0xb7e15162;
  let d = seed >>> 0;
  const nextU32 = (): number => {
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return t >>> 0;
  };
  // 시작 값이 비슷한 시드끼리 결과가 닮지 않도록 몇 번 버린다
  for (let i = 0; i < 12; i++) nextU32();

  const nextFloat = () => nextU32() / 4294967296;
  return {
    nextU32,
    nextFloat,
    int: (min, max) => min + Math.floor(nextFloat() * (max - min + 1)),
    pick: (items) => {
      if (items.length === 0) throw new Error("빈 배열에서 고를 수 없음");
      return items[Math.floor(nextFloat() * items.length)] as never;
    },
  };
}

/** 사람이 입력·공유하는 시드 문자열 → 수 (영문·숫자, 대소문자 구분 없음) */
export function parseSeed(text: string): number {
  return hashString(text.trim().toUpperCase());
}

const SEED_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** 공유하기 쉬운 8글자 시드 문자열 (헷갈리는 글자 O·0·I·1 제외) */
export function seedToText(rng: Rng): string {
  let out = "";
  for (let i = 0; i < 8; i++) out += rng.pick([...SEED_CHARS]);
  return out;
}
