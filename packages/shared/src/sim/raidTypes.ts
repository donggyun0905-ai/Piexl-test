// 이벤트 '레이드' (5인 레이드 보스) 상태 (sim/raid)
import type { LucFight, LucPlayerState } from "./lucTypes";

/** 레이드 보스 (지금은 루시퍼 하나) */
export const RAID_EVENT_BOSSES = ["lucifer"] as const;
export type RaidEventBoss = (typeof RAID_EVENT_BOSSES)[number];

/** 레이드 방 차례: 무장실 → 대장간 → 성좌의 방 → 단련의 방 → 레이드 방 → 보상 방 */
export const RAID_ROOM = { armory: 0, forge: 1, altar: 2, gym: 3, boss: 4, reward: 5 } as const;

export interface RaidState {
  boss: RaidEventBoss;
  /** 자리마다 AI인지 (사람이 없는 자리는 AI가 채움) */
  ai: boolean[];
  /** 준비 방 AI 움직임: 자리마다 [갈 곳 차례, 기다린 틱] (sim/raidBot) */
  bot?: number[][];
  /** 레이드 방에서 싸운 틱 (컷신 빼고, 제한 시간 sim/raidLife) */
  fightTicks?: number;
  /** 레이드 방 싸움 (sim/lucifer) */
  fight?: LucFight;
}

export interface RaidRunFields {
  raidBoss?: RaidState;
}

export interface RaidPlayerState extends LucPlayerState {
  /** 레이드 사용 아이템 칸마다 다시 쓸 수 있는 틱 · 대장간 처음부터 다시 쓴 수 (sim/raidPrep) */
  raidCd?: number[];
  raidResets?: number;
}
