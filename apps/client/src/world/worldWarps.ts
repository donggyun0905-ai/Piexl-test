// 순간 이동석: 한 번 만진 돌만 다른 돌에서 골라 갈 수 있음 (이 기기에 저장, 서버 안 씀)
import { loadText, saveText } from "../storage";
import { WTILE } from "./worldMap";
import { placeXY, type Place, type Region } from "./worldPlaces";

const KEY = "worldWarps";

function load(): string[] {
  try {
    const v = JSON.parse(loadText(KEY) ?? "[]") as unknown;
    return Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

/** 지금 내 자리 (WorldStage가 매 장면 적음, 지도 창이 읽음) */
export const here = { r: "", x: 0, y: 0 };

/** 만진 돌 기록 (지역 + 돌 id) */
export function touchWarp(regionId: string, p: Place): void {
  const id = `${regionId}:${p.id}`;
  const all = load();
  if (!all.includes(id)) saveText(KEY, JSON.stringify([...all, id]));
}

/** 이 지역에서 만진 돌인지 */
export function warpTouched(regionId: string, p: Place): boolean {
  return load().includes(`${regionId}:${p.id}`);
}

/** 만진 돌 전부 [지역, 돌 id] (지도 창의 바로 가기 목록) */
export const touchedWarps = (): [string, string][] => load().map((s) => s.split(":") as [string, string]).filter((v) => v.length === 2);

/** 일어날 자리: 가장 가까운 만진 순간 이동석 아래 (없으면 지역 처음 자리) */
export function reviveAt(region: Region, regionId: string, x: number, y: number): [number, number] {
  let best: [number, number] = [(region.start.tx + 0.5) * WTILE, (region.start.ty + 0.5) * WTILE];
  let d = Infinity;
  for (const p of region.places) {
    if (p.kind !== "warp" || !warpTouched(regionId, p)) continue;
    const [px, py] = placeXY(p);
    const k = Math.hypot(px - x, py - y);
    if (k < d) [d, best] = [k, [px, py + 12]];
  }
  return best;
}

