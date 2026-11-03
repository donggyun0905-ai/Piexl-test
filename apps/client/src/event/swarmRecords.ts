// 광야의 새벽 기록 (이 기기에만): 가장 오래 버틴 판 (캐릭터마다 + 전체)
import type { CharacterId } from "@pixel-rogue/shared";
import { loadText, saveText } from "../storage";
import { flushUnlockStats, mark } from "../unlock/unlockStats";

export interface SwarmBest {
  ticks: number;
  lv: number;
  kills: number;
  won: boolean;
}

type Saved = Partial<Record<CharacterId | "all", SwarmBest>>;

function load(): Saved {
  try {
    return JSON.parse(loadText("swarmBest") ?? "{}") as Saved;
  } catch {
    return {};
  }
}

/** 최고 기록 (character가 없으면 전체) */
export const loadSwarmBest = (c?: CharacterId): SwarmBest | null => load()[c ?? "all"] ?? null;

/** 판이 끝나면: 더 오래 버텼으면(같으면 레벨이 높으면) 바꿈. 최고 기록이면 true */
export function saveSwarmResult(c: CharacterId, r: SwarmBest): boolean {
  if (r.won) {
    mark("swarmClear");
    flushUnlockStats();
  }
  const all = load();
  const better = (old?: SwarmBest) => !old || r.ticks > old.ticks || (r.ticks === old.ticks && r.lv > old.lv);
  const isBest = better(all[c]);
  if (isBest) all[c] = r;
  if (better(all.all)) all.all = r;
  saveText("swarmBest", JSON.stringify(all));
  return isBest;
}
