// 공격 이펙트 진하기 (설정 myFx·otherFx): 내 것과 다른 사람(협동·레이드 동료·AI) 것을 따로 흐리게. 보스 공격·위험 표시는 그대로
// 패왕전은 다른 사람 공격이 곧 적의 공격이라 늘 그대로
import type { RunState } from "@pixel-rogue/shared";
import { getSettings } from "../../settings";

/** 이 자리(없으면 혼자 = 나) 사람이 만든 것의 진하기 0~1 */
export function fadeOf(s: RunState, seat: number | undefined): number {
  if (s.pvp) return 1;
  const set = getSettings();
  return seat === undefined || seat === (s.seat ?? 0) ? set.myFx : set.otherFx;
}

/** 사람 둘레 그림(장치·오라·소환물)을 그 사람 진하기로 (몸은 따로 그려 흐려지지 않음) */
export function withFade(ctx: CanvasRenderingContext2D, s: RunState, me: boolean, fn: () => void): void {
  const a = s.pvp ? 1 : me ? getSettings().myFx : getSettings().otherFx;
  if (a >= 1) return fn();
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a;
  fn();
  ctx.restore();
}
