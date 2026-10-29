// 모드 훈장: 무한 모드 최고 층 · 레이드 아레나 최고 레벨 · 영웅의 길 최고 단계 (캐릭터마다) · 타워 디펜스 별 5개 맵 클리어 (모든 캐릭터 공용, 남은 목숨).
// 기록이 높을수록 훈장 단계(꾸밈)가 오름. 같은 훈장은 기록이 더 높을 때만 바뀜
import { arenaCleared, HERO_FLOORS, type LastBossKind, type RunState, type TdMapId, type TdState } from "@pixel-rogue/shared";
import type { RunSummaryData } from "../game/runSummary";
import { tabooTier } from "../taboo/tabooStore";
import { storeMedal, type Medal } from "./medals";

export const MODE_KINDS = ["endless", "arena", "hero", "td", "tdAbyss"] as const;
export type ModeKind = (typeof MODE_KINDS)[number];
export type MedalKind = LastBossKind | ModeKind;

/** 훈장을 주는 타워 디펜스 맵 (별 5개 하늘 성채 · 별 7개 심연의 균열) */
export const TD_MEDAL_MAPS: readonly TdMapId[] = ["sky", "abyss"];

/** 모드마다 단계 1~6이 되는 기록 (첫 값 = 훈장을 받는 최소 기록) */
const STEPS: Record<ModeKind, number[]> = {
  endless: [3, 6, 10, 15, 20, 30],
  arena: [1, 4, 7, 10, 13, 15],
  hero: [1, 4, 7, 10, 12, HERO_FLOORS],
  td: [1, 3, 6, 11, 16, 20],
  tdAbyss: [1, 2, 4, 6, 8, 10],
};

export const isMode = (k: string): k is ModeKind => (MODE_KINDS as readonly string[]).includes(k);

/** 훈장 꾸밈 단계와 오른쪽 위 숫자 (라스트 보스 = 금기 점수, 모드 = 기록) */
export function medalLook(m: Medal): { tier: number; label?: string } {
  if (isMode(m.boss)) return { tier: STEPS[m.boss].filter((v) => (m.value ?? 0) >= v).length, label: String(m.value ?? 0) };
  return m.taboo ? { tier: tabooTier(m.taboo), label: String(m.taboo) } : { tier: 0 };
}

const today = () => new Date().toISOString().slice(0, 10);
const higher = (value: number) => (old: Medal) => value > (old.value ?? 0);

/** 혼자 하기 판이 끝나면: 무한·아레나·영웅의 길 기록 훈장 */
export function recordModeMedal(run: RunState, summary: RunSummaryData): boolean {
  const kind: ModeKind | null = run.arenaLv ? "arena" : run.hero ? "hero" : run.endless ? "endless" : null;
  if (!kind) return false;
  const value = kind === "arena" ? arenaCleared(run) : kind === "hero" ? (run.won ? HERO_FLOORS : run.floor - 1) : run.floor;
  if (value < STEPS[kind][0]!) return false;
  return storeMedal({ boss: kind, character: run.player.characterId, ticks: run.tick, date: today(), summary, value }, higher(value));
}

/** 타워 디펜스가 끝나면: 별 5개 맵을 막아 내면 남은 목숨으로 훈장 (모든 캐릭터 카드에 달 수 있음) */
export function recordTdMedal(td: TdState): boolean {
  if (td.phase !== "won" || !TD_MEDAL_MAPS.includes(td.mapId) || td.lives < 1) return false;
  // 별 7개 심연의 균열은 따로 더 높은 훈장
  const boss: ModeKind = td.mapId === "abyss" ? "tdAbyss" : "td";
  return storeMedal({ boss, character: "all", ticks: 0, date: today(), value: td.lives }, higher(td.lives));
}
