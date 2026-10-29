// 로비 전시장 전시물 (이 기기에 저장): 영혼 조각(바스러져가는 왕관을 얻으면) · 월계선(순례자의 월계선을 얻으면). 전시장 그림은 lobby/hallArt
// 지금은 테스트라 연습장에서 얻어도 등록되고, 월계선은 이미 얻은 것으로 침 (TEST_OPEN)
// TODO(다음 업데이트): 연습장에서 얻은 것은 등록하지 않기 (noteExhibits의 practice가 true면 바로 돌아가게) · 월계선 기본 등록 빼기
import { loadText, saveText } from "../storage";
import { TEST_OPEN } from "../testFlags";

export type ExhibitId = "soulShard" | "laurelShip";

export interface Exhibit {
  /** 모은 수 (영혼 조각은 왕관을 얻을 때마다 +1) · 처음 놓인 날 */
  count: number;
  date: string;
}

const KEY = "exhibits";

export function loadExhibits(): Partial<Record<ExhibitId, Exhibit>> {
  let all: Partial<Record<ExhibitId, Exhibit>> = {};
  try {
    all = JSON.parse(loadText(KEY) ?? "{}") as Partial<Record<ExhibitId, Exhibit>>;
  } catch {
    all = {};
  }
  if (TEST_OPEN && !all.laurelShip) all.laurelShip = { count: 1, date: "test" };
  return all;
}

function add(id: ExhibitId): void {
  let all: Partial<Record<ExhibitId, Exhibit>> = {};
  try {
    all = JSON.parse(loadText(KEY) ?? "{}") as Partial<Record<ExhibitId, Exhibit>>;
  } catch {
    all = {};
  }
  const old = all[id];
  all[id] = { count: (old?.count ?? 0) + 1, date: old?.date ?? new Date().toISOString().slice(0, 10) };
  saveText(KEY, JSON.stringify(all));
}

/** 판마다 이미 등록한 아이템 */
const seenOf = new WeakMap<object, Set<string>>();

/** 판 진행 중 가진 사용 아이템이 바뀔 때 (gameLoop): 이번 판에 새로 얻은 전시 아이템을 등록 */
export function noteExhibits(run: object, useSlots: readonly (string | null)[], practice: boolean): void {
  let seen = seenOf.get(run);
  if (!seen) seenOf.set(run, (seen = new Set()));
  // 지금은 테스트: 연습장에서 얻어도 등록 (다음 업데이트에서 막기: if (practice) return;)
  void practice;
  for (const [item, id] of [["crumblingCrown", "soulShard"], ["laurelShip", "laurelShip"]] as const) {
    if (!useSlots.includes(item) || seen.has(item)) continue;
    seen.add(item);
    add(id);
  }
}
