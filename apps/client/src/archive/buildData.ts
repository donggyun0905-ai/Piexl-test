// 빌드 통계 받기 (서버 /api/stats/build, 캐릭터마다 한 번만 요청): 아카이브 '빌드 통계' 화면 · 바닥 아이템 추천 표시가 같이 씀
import type { CharacterId } from "@pixel-rogue/shared";
import { apiGet } from "../api";
import { loadHistory } from "../records";

/** [고른 판 수, 그중 클리어 수] */
type Pair = [number, number];
export interface BuildData {
  runs: number;
  wins: number;
  weapons: Record<string, Pair>;
  passives: Record<string, Pair>;
}
export interface PickRow {
  id: string;
  n: number;
  /** 고른 비율 · 고른 판의 클리어율 (0~1) */
  rate: number;
  win: number;
}

/** 추천으로 보여 주려면 이만큼은 모여야 함 (판 수) · 추천 패시브 수 · 이 판 수까지 바닥에 ★ 표시 (그 뒤는 설명 말풍선에만) */
export const REC_MIN_RUNS = 5;
export const REC_TOP = 8;
export const REC_NEWBIE_RUNS = 20;

const asked = new Map<CharacterId, Promise<BuildData | null>>();
const ready = new Map<CharacterId, BuildData>();
const tops = new Map<CharacterId, Map<string, number>>();

export function loadBuild(c: CharacterId): Promise<BuildData | null> {
  let p = asked.get(c);
  if (!p) {
    p = apiGet<BuildData>(`/api/stats/build?c=${c}`).then((r) => {
      if (r.ok && r.data) ready.set(c, r.data);
      return r.data ?? null;
    });
    asked.set(c, p);
  }
  return p;
}

/** 많이 고른 순서 (같으면 클리어율 높은 순) */
export function picks(d: BuildData, kind: "weapons" | "passives", by: "rate" | "win" = "rate"): PickRow[] {
  const rows = Object.entries(d[kind]).map(([id, [n, w]]) => ({ id, n, rate: d.runs > 0 ? n / d.runs : 0, win: n > 0 ? w / n : 0 }));
  // 클리어율 순은 표본이 너무 적은 것(3판 미만)을 뒤로
  const few = (r: PickRow) => (by === "win" && r.n < 3 ? 1 : 0);
  return rows.sort((a, b) => few(a) - few(b) || b[by] - a[by] || b.n - a.n || a.id.localeCompare(b.id));
}

let newbie: boolean | undefined;
/** 처음 하는 사람 (끝낸 판이 적음): 바닥 아이템 위에 ★ */
export const isNewbie = () => (newbie ??= loadHistory().length < REC_NEWBIE_RUNS);

/** 이 캐릭터가 많이 쓰는 패시브면 고른 비율(0~1), 아니면 null · 아직 안 받았으면 받기 시작하고 null */
export function recRate(c: CharacterId, id: string): number | null {
  const d = ready.get(c);
  if (!d) {
    void loadBuild(c);
    return null;
  }
  let top = tops.get(c);
  if (!top) {
    // 틱마다 불리니 한 번만 계산
    top = new Map(d.runs < REC_MIN_RUNS ? [] : picks(d, "passives").slice(0, REC_TOP).filter((r) => r.n >= 2).map((r) => [r.id, r.rate]));
    tops.set(c, top);
  }
  return top.get(id) ?? null;
}
