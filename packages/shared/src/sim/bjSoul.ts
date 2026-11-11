// 백인장 사신의 계약: 표식·출혈·죽음이 걸린 적을 처치하면 체력 회복 · 스킬 대기 감소 (sim/faction factionKill이 부름 · 순환 import를 피하려고 따로 둠)
import { BJ_PERKS as K } from "../itemsBaekinjang";
import { healPlayer } from "./combat";
import type { EnemyState, RunState } from "./types";

export function bjKill(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (p.characterId !== "baekinjang" || !p.passives.includes("bjPact")) return;
  if (!((e.bjMark ?? 0) > s.tick || (e.bjBleed ?? 0) > 0 || (e.bjDeath ?? 0) > 0)) return;
  healPlayer(s, K.bjPact.heal);
  if (p.bjSkillCd) p.bjSkillCd = p.bjSkillCd.map((v) => Math.max(0, v - K.bjPact.cut));
}
