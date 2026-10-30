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
  /** 점령전 (sim/pwCapture): 점령 구역(네모 또는 동그라미 [열, 행, 반지름 칸]) · 버프 자리 · 낭떠러지(떨어지면 쓰러짐) · 점프대(밟으면 to로 뛰어감) */
  zone?: { rect?: Rect; circle?: readonly [number, number, number] };
  buffs?: readonly Spot[];
  cliffs?: readonly Rect[];
  jumps?: readonly { pad: Rect; to: Spot }[];
  /** 성장 대결 (sim/pwGrow·pwLane): 편마다 집(깃발, 부활·회복·상점) · 길마다 A 집 → B 집 지나는 곳 · 포탑(편 · 길 · 길에서 몇 번째, 0 = 앞) */
  homes?: readonly [Spot, Spot];
  lanes?: readonly (readonly Spot[])[];
  towers?: readonly { team: 0 | 1; at: Spot; lane: number; order: number }[];
  /** 전쟁의 서막: 체크포인트(길 끝, 점령하면 집에서 순간이동) · 안개 지역(줄마다 네모, 안이 밖에서 안 보임) · 정글 몬스터 자리(안개 지역 번호) */
  points?: readonly { at: Spot; lane: number }[];
  fogs?: readonly (readonly Rect[])[];
  camps?: readonly { kind: "jungle" | "elite" | "dragon" | "godeater"; at: Spot }[];
  /** 기간토마키아 (paewangMapsGigaRooms): 들판 칸 수(오른쪽은 실내 구역) · 건물(밖 네모 · 실내 상자 자리) · 문(at에서 F → to, 건물 번호) */
  outCols?: number;
  buildings?: readonly GigaBuilding[];
  portals?: readonly { at: Spot; to: Spot; kind: "in" | "out" | "up" | "down"; b: number }[];
}

export interface GigaBuilding {
  kind: "house" | "apt" | "school";
  /** 들판에 선 건물 네모 · 실내 바닥 네모들(층마다) · 실내 상자 자리 */
  out: Rect;
  inside: readonly Rect[];
  chests: readonly Spot[];
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

/** 열린 곳(길·방)만 적으면 나머지를 벽으로 채움: 줄마다 막힌 칸을 이어 붙이고, 위아래로 같은 폭이면 합침 */
export function carve(cols: number, rows: number, open: readonly Rect[]): Rect[] {
  const isOpen = (c: number, r: number) => open.some(([x, y, w, h]) => c >= x && c < x + w && r >= y && r < y + h);
  const out: [number, number, number, number][] = [];
  const last = new Map<string, [number, number, number, number]>();
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (isOpen(c, r)) continue;
      let w = 1;
      while (c + w < cols - 1 && !isOpen(c + w, r)) w++;
      const key = `${c},${w}`;
      const prev = last.get(key);
      if (prev && prev[1] + prev[3] === r) prev[3]++;
      else {
        const rect: [number, number, number, number] = [c, r, w, 1];
        out.push(rect);
        last.set(key, rect);
      }
      c += w - 1;
    }
  }
  return out;
}

/** 경기장을 k배로 (1대1·토너먼트 1.5배): 칸 수는 가운데 칸이 남게 홀수로 · 네모·자리는 가운데를 기준으로 늘림 (거울 맵은 그대로 거울) */
export function scaleArena(a: PwArenaDef, k: number): PwArenaDef {
  const odd = (n: number) => {
    const m = Math.round(n * k);
    return n % 2 && !(m % 2) ? m - 1 : m;
  };
  const cols = odd(a.cols);
  const rows = odd(a.rows);
  const [kx, ky] = [cols / a.cols, rows / a.rows];
  // 길이는 전체 칸 수와 짝·홀을 맞춤 → 가운데에서 떨어진 거리를 대칭으로 반올림하면 거울 자리도 정확히 거울
  const len = (n: number, s: number, all: number) => {
    const m = Math.max(1, Math.round(n * s));
    return (all - m) % 2 ? (n * s > m ? m + 1 : Math.max(1, m - 1)) : m;
  };
  const at = (c: number, w: number, nw: number, s: number, all: number) => {
    const o = (c + w / 2) * s - all / 2;
    return (all - nw) / 2 + Math.sign(o) * Math.round(Math.abs(o));
  };
  const rect = ([c, r, w, h]: Rect): Rect => {
    const [nw, nh] = [len(w, kx, cols), len(h, ky, rows)];
    return [at(c, w, nw, kx, cols), at(r, h, nh, ky, rows), nw, nh];
  };
  const spot = ([c, r]: Spot): Spot => [at(c, 1, 1, kx, cols), at(r, 1, 1, ky, rows)];
  const out: Record<string, unknown> = { ...a, cols, rows };
  for (const k2 of KEYS) if (a[k2]) out[k2] = a[k2]!.map(rect);
  for (const k2 of ["teamA", "teamB", "spots"] as const) out[k2] = a[k2].map(spot);
  return out as unknown as PwArenaDef;
}
