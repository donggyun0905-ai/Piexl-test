// 새벽의 성흔 공용 성흔(달빛의 힘) 게이지: 맞히면 참 → 가득 차면 자동으로 달빛 각성(onAwake) → 끝나면 0부터 (수치 weaponsDawn.STIGMA)
import { STIGMA } from "../weaponsDawn";
import type { PlayerState } from "./types";

/** 성흔 n 채움 (각성 중에는 안 참) · 가득 차면 true (각성 시작은 부른 쪽에서 awaken) */
export function addStigma(p: PlayerState, n: number): boolean {
  if ((p.sgAwake ?? 0) > 0) return false;
  p.sgGauge = Math.min(STIGMA.max, (p.sgGauge ?? 0) + n);
  return p.sgGauge >= STIGMA.max;
}

/** 달빛 각성 시작 (ticks 동안) */
export function awaken(p: PlayerState, ticks: number): void {
  p.sgAwake = p.sgAwakeMax = ticks;
  p.sgGauge = STIGMA.max;
}

/** 한 틱: 각성 중이면 줄고 게이지도 같이 비어 감 · 끝나면 keep(0~1)만큼 남김 */
export function stigmaTick(p: PlayerState, keep = 0): void {
  if (!(p.sgAwake ?? 0)) return;
  p.sgAwake!--;
  p.sgGauge = (STIGMA.max * p.sgAwake!) / Math.max(1, p.sgAwakeMax ?? 1);
  if (p.sgAwake! > 0) return;
  delete p.sgAwake;
  delete p.sgAwakeMax;
  p.sgGauge = STIGMA.max * keep;
}

export const isAwake = (p: PlayerState) => (p.sgAwake ?? 0) > 0;

/** 화면용: 게이지 0~1 · 각성 중인지 (새벽의 성흔이 아니면 null) */
export function stigmaGauge(p: PlayerState): { v: number; awake: boolean } | null {
  if (p.characterId !== "blast" && p.characterId !== "nailer" && p.characterId !== "scissors" && p.characterId !== "hellfist" && p.characterId !== "silverBullet" && p.characterId !== "blueFlame") return null;
  return { v: Math.min(1, (p.sgGauge ?? 0) / STIGMA.max), awake: isAwake(p) };
}
