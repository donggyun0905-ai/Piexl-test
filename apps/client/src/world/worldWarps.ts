// 순간 이동석: 한 번 만진 돌만 다른 돌에서 골라 갈 수 있음 (이 기기에 저장, 서버 안 씀)
import { loadText, saveText } from "../storage";
import type { Place, Region } from "./worldPlaces";

const KEY = "worldWarps";

function load(): string[] {
  try {
    const v = JSON.parse(loadText(KEY) ?? "[]") as unknown;
    return Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

/** 만진 돌 기록 (지역 + 돌 id) */
export function touchWarp(regionId: string, p: Place): void {
  const id = `${regionId}:${p.id}`;
  const all = load();
  if (!all.includes(id)) saveText(KEY, JSON.stringify([...all, id]));
}

/** 이 돌에서 갈 수 있는 다른 돌 (만진 것만) */
export function warpTargets(regionId: string, r: Region, from: Place): Place[] {
  const all = new Set(load());
  return r.places.filter((p) => p.kind === "warp" && p.id !== from.id && all.has(`${regionId}:${p.id}`));
}
