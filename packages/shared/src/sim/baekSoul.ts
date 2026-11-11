// 백령 영혼: 적을 처치하면 영혼이 저절로 몸에 쌓임 (보스는 많이) · 혼 흡수(회복) · 혼등(혼불이 날아감)
// sim/faction factionKill이 baekKill을 부름 → 처치한 적만 적어 두고 다음 틱 baekTick에서 soulTick으로 처리
// (faction은 아주 일찍 불러오는 파일이라 여기서 다른 계산 파일을 불러오면 불러오는 차례가 바뀌어 다른 계산이 깨짐 · 타입만 불러옴)
import type { EnemyState, RunState } from "./types";

/** 처치했을 때: 자리·id·보스인지만 적어 둠 */
export function baekKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (p.characterId !== "baekryeong" || e.kind === "dummy") return;
  (p.byKills ??= []).push([e.x, e.y, e.id, e.kind]);
}
