// 한 판 요약 자료: 마지막 장비 · 준 피해(종류별) · 받은 피해 · 돈 · 보스 · 층 도착 · 쓰러진 곳 (그리기는 RunSummary)
import { ENEMIES, type CharacterId, type PassiveId, type RoomType, type RunState, type UseItemId, type WeaponId } from "@pixel-rogue/shared";
import type { DamageTracker, NumKind } from "./damageNumbers";
import { srcRows } from "./srcNames";

export interface RunSummaryData {
  character: CharacterId;
  weapon: WeaponId;
  /** 패시브와 가진 수 (얻은 순서) */
  passives: [PassiveId, number][];
  uses: UseItemId[];
  dealt: Partial<Record<NumKind, number>>;
  /** 피해 출처마다 합 (sim/dmgSrc: "" 무기·기본 공격 · "d:종류" 상태이상 · "f:파일" 캐릭터 기술(이름 game/srcNames) · 그 밖은 패시브 id), 많이 준 순서 */
  sources: [string, number][];
  best: number;
  taken: number;
  goldEarned: number;
  goldSpent: number;
  bossKills: number;
  flawless: number;
  floors: { floor: number; tick: number; hp: number }[];
  /** 쓰러진 곳 (클리어면 없음) */
  death?: { floor: number; room: RoomType; boss?: string };
}

/** 받은 피해: 틱을 진행할 때마다 체력이 준 만큼 더함 (회복은 빼지 않음) */
export class TakenTracker {
  private last = -1;
  taken = 0;
  observe(s: RunState): void {
    const hp = s.player.hp;
    if (this.last >= 0 && hp < this.last) this.taken += this.last - hp;
    this.last = hp;
  }
}

export function buildSummary(s: RunState, dmg: DamageTracker | undefined, taken: number): RunSummaryData {
  const p = s.player;
  const counts = new Map<PassiveId, number>();
  for (const id of p.passives) counts.set(id, (counts.get(id) ?? 0) + 1);
  const boss = s.enemies.find((e) => e.hp > 0 && ENEMIES[e.kind].boss);
  return {
    character: p.characterId,
    weapon: p.weaponId,
    passives: [...counts.entries()],
    uses: p.useSlots.filter((u): u is UseItemId => u !== null),
    dealt: { ...(dmg?.dealt ?? {}) },
    sources: srcRows(p.dmgBy),
    best: dmg?.best ?? 0,
    taken: Math.round(taken),
    goldEarned: s.goldEarned,
    goldSpent: s.goldSpent,
    bossKills: s.bossKills,
    flawless: s.flawlessBosses,
    floors: s.floorLog.map((f) => ({ floor: f.floor, tick: f.tick, hp: f.hp })),
    death: s.won ? undefined : { floor: s.floor, room: s.map.rooms[s.roomId]?.type ?? "combat", boss: boss?.kind },
  };
}
