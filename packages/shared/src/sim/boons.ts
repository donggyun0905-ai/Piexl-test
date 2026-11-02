// 방에서 받은·빼앗긴 능력치 (시련의 방 보상·벌칙 · 앞으로 제단의 방·악마의 방도): 판이 끝날 때까지 남음
// 능력치 변화(StatMod)는 recalcStats(station.stationMods)가, 추가 기본 스탯(치명타·방어력 등)은 baseStats.extraOf가 더함
import type { ExtraStats } from "../characters";
import type { StatMod } from "../stats";
import { recalcStats } from "./items";
import type { PlayerState, RunState } from "./types";

export interface BoonPlayerState {
  /** 받은 능력치 변화 · 추가 기본 스탯 (더하기) */
  boons?: { mods: StatMod[]; extra: Partial<ExtraStats> };
  /** 모든 상태이상 면역 (제단의 방 일곱 갈래의 마녀) */
  boonImmune?: boolean;
}

const ensure = (p: PlayerState) => (p.boons ??= { mods: [], extra: {} });

/** 능력치 변화 하나 더하기 (바로 다시 계산) */
export function addBoonMod(s: RunState, mod: StatMod): void {
  ensure(s.player).mods.push(mod);
  recalcStats(s);
}

/** 추가 기본 스탯 더하기 (음수면 빼기) */
export function addBoonExtra(s: RunState, key: keyof ExtraStats, v: number): void {
  const b = ensure(s.player);
  b.extra[key] = (b.extra[key] ?? 0) + v;
}

export const boonMods = (p: PlayerState): StatMod[] => p.boons?.mods ?? [];
export const boonExtras = (p: PlayerState): Partial<ExtraStats> | null => p.boons?.extra ?? null;
