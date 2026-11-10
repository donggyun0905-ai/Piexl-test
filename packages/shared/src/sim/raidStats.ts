// 레이드 결과표 기록 (패왕전 점수판처럼): 사람마다 준 피해(루시퍼 · 기둥·검·몬스터) · 가장 큰 한 방 · 받은 피해 · 회복 · 데스
// 준 피해는 적을 때린 순간(sim/pvpRecap.logHit에서 부름), 받은 피해·회복은 틱마다 체력이 바뀐 만큼 (레이드 방에서만)
import { RAID_ROOM } from "./raidTypes";
import type { EnemyState, PlayerState, RunState } from "./types";

const stat = (p: PlayerState) => (p.raidStat ??= { dealt: 0, boss: 0, adds: 0, taken: 0, healed: 0, max: 0 });

/** 적을 때림 (지금 꺼내 놓은 사람이 때린 것) */
export function raidLogHit(s: RunState, e: EnemyState, amt: number): void {
  if (s.roomId !== RAID_ROOM.boss || amt <= 0 || e.kind === "lucchest") return;
  const st = stat(s.player);
  st.dealt += amt;
  if (e.kind === "lucifer") st.boss += amt;
  else st.adds += amt;
  st.max = Math.max(st.max, amt);
}

/** 틱마다 (자리마다, sim/raidLife): 지난 틱보다 줄었으면 받은 피해 · 늘었으면 회복 */
export function raidLogHp(p: PlayerState): void {
  const was = p.raidHpWas ?? p.hp;
  const st = stat(p);
  if (p.hp < was) st.taken += was - Math.max(0, p.hp);
  else if (p.hp > was && was > 0) st.healed += p.hp - was;
  p.raidHpWas = p.hp;
}
