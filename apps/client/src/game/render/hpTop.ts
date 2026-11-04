// 머리 위 체력 줄 자리 (actors 체력 줄 · 숨은 시련 숨 게이지가 같이 씀)
import { morphEvolved, type PlayerState } from "@pixel-rogue/shared";

/** 머리 위 체력 줄의 윗선 (y = 몸 가운데): 캐릭터 그림(모두 파수꾼과 같은 32칸, 발이 몸 아래)의 맨 위 바로 위 · 큰 변신 모습(각성 오니·피의 학살·각성 동물)은 48칸 */
export function hpBarTop(p: PlayerState, y: number): number {
  return y + p.r - ((p.characterId === "oni" && (p.oGod ?? 0) > 0) || (p.characterId === "slayer" && (p.slRage ?? 0) > 0) || morphEvolved(p) ? 46 : 31);
}

