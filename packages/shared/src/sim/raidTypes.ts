// 이벤트 '레이드' (5인 레이드 보스) 상태 (sim/raid)

/** 레이드 보스 (지금은 루시퍼 하나) */
export const RAID_EVENT_BOSSES = ["lucifer"] as const;
export type RaidEventBoss = (typeof RAID_EVENT_BOSSES)[number];

/** 레이드 방 차례: 무장실 → 대장간 → 성좌의 방 → 단련의 방 → 레이드 방 → 보상 방 */
export const RAID_ROOM = { armory: 0, forge: 1, altar: 2, gym: 3, boss: 4, reward: 5 } as const;

export interface RaidState {
  boss: RaidEventBoss;
  /** 자리마다 AI인지 (사람이 없는 자리는 AI가 채움) */
  ai: boolean[];
}

export interface RaidRunFields {
  raidBoss?: RaidState;
}

export interface RaidPlayerState {
  /** 무장실에서 가진 사용 아이템 수 (둘이면 나머지는 사라짐) */
  raidUse?: number;
}
