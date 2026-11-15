// 지역 사이 길 찾기 (퀘스트 화살표): 문(door)·국경 길(pass)·나가는 문(exit = 그 건물로 들어오는 문이 있는 곳)으로 이어진 지역을 BFS
// 열린 국경 길만 먼저 보고, 없으면 잠긴 길까지 봄 → 지금 지역에서 먼저 가야 할 장소 id
import { fieldOpen, REGIONS } from "./worldPlaces";

type Edge = readonly [place: string, to: string];

function edges(id: string, openOnly: boolean): Edge[] {
  const out: Edge[] = [];
  for (const p of REGIONS[id]?.places ?? []) {
    if (!p.to || (p.kind !== "door" && p.kind !== "pass")) continue;
    if (p.kind === "pass" && openOnly && !fieldOpen(REGIONS[p.to])) continue;
    out.push([p.id, p.to]);
  }
  const exit = REGIONS[id]?.places.find((p) => p.kind === "exit");
  if (exit) for (const [k, r] of Object.entries(REGIONS)) if (r.places.some((p) => p.kind === "door" && p.to === id)) out.push([exit.id, k]);
  return out;
}

function search(cur: string, target: string, openOnly: boolean): string | null {
  const first = new Map<string, string>([[cur, ""]]);
  const queue = [cur];
  while (queue.length) {
    const r = queue.shift()!;
    if (r === target) return first.get(r) || null;
    for (const [place, to] of edges(r, openOnly)) {
      if (first.has(to) || !REGIONS[to]) continue;
      first.set(to, first.get(r) || place);
      queue.push(to);
    }
  }
  return null;
}

/** cur에서 target 지역으로 가려면 먼저 갈 장소 id (같은 지역·길 없음이면 null) */
export const wayTo = (cur: string, target: string): string | null => (cur === target ? null : (search(cur, target, true) ?? search(cur, target, false)));

/** 이 장소 id가 있는 지역 (여럿이면 처음 것) */
export const regionOfPlace = (place: string): string | null => Object.keys(REGIONS).find((k) => REGIONS[k]!.places.some((p) => p.id === place)) ?? null;
