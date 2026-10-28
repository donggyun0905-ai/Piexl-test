// 패왕전 경기장 모양 틀 · 거울 도우미 (맵 데이터는 paewangMaps·paewangMapsSmall·paewangMapsBig)
// 칸 좌표 [열, 행, 너비, 높이], 자리는 [열, 행]

export type Rect = readonly [number, number, number, number];
export type Spot = readonly [number, number];

export interface PwArenaDef {
  cols: number;
  rows: number;
  /** 막힘: 벽 · 나무와 바위 · 깊은 물 */
  walls: readonly Rect[];
  rocks: readonly Rect[];
  ponds: readonly Rect[];
  /** 숨는 수풀 · 숲 가시 함정(모두가 같이 솟음) · 2층 발판 */
  bushes: readonly Rect[];
  traps: readonly Rect[];
  decks: readonly Rect[];
  /** 지형 (던전 지형과 같은 그림): 진흙(느려짐) · 용암(피해) · 얕은 물(조금 느려짐) · 가시(차례로 솟음) */
  mud?: readonly Rect[];
  lava?: readonly Rect[];
  water?: readonly Rect[];
  spikes?: readonly Rect[];
  /** 팀 대결: 내 편(A)·상대 편(B) 자리 · 모두가 적일 때: spots 전부 */
  teamA: readonly Spot[];
  teamB: readonly Spot[];
  spots: readonly Spot[];
}

export const NONE: readonly never[] = [];

type Lists = Partial<Pick<PwArenaDef, "walls" | "rocks" | "ponds" | "bushes" | "traps" | "decks" | "mud" | "lava" | "water" | "spikes">>;
const KEYS = ["walls", "rocks", "ponds", "bushes", "traps", "decks", "mud", "lava", "water", "spikes"] as const;

const same = (a: Rect, b: Rect) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
/** 좌우 거울 (가운데에 걸친 네모는 하나만) */
const flipX = (cols: number, list: readonly Rect[]): Rect[] => {
  const out = [...list];
  for (const [c, r, w, h] of list) {
    const m: Rect = [cols - c - w, r, w, h];
    if (!out.some((x) => same(x, m))) out.push(m);
  }
  return out;
};
/** 위아래 거울 */
const flipY = (rows: number, list: readonly Rect[]): Rect[] => {
  const out = [...list];
  for (const [c, r, w, h] of list) {
    const m: Rect = [c, rows - r - h, w, h];
    if (!out.some((x) => same(x, m))) out.push(m);
  }
  return out;
};

function build(cols: number, rows: number, d: Lists, flip: (l: readonly Rect[]) => Rect[]): Omit<PwArenaDef, "teamA" | "teamB" | "spots"> {
  const out: Record<string, readonly Rect[]> = {};
  for (const k of KEYS) out[k] = d[k] ? flip(d[k]!) : NONE;
  return { cols, rows, ...(out as Required<Lists>) };
}

/** 팀 대결 맵: 왼쪽 절반만 적으면 오른쪽은 거울 (공평하게) · 상대 편 자리도 거울 */
export function teamMap(cols: number, rows: number, teamA: readonly Spot[], d: Lists): PwArenaDef {
  return { ...build(cols, rows, d, (l) => flipX(cols, l)), teamA, teamB: teamA.map(([c, r]) => [cols - 1 - c, r] as const), spots: NONE };
}

/** 모두가 적인 맵: 왼쪽 위 4분의 1만 적으면 상하좌우 거울 */
export function ffaMap(cols: number, rows: number, spots: readonly Spot[], d: Lists): PwArenaDef {
  return { ...build(cols, rows, d, (l) => flipY(rows, flipX(cols, l))), teamA: NONE, teamB: NONE, spots };
}
