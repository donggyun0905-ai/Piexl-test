// 특별한 방에서 생기는 상태 모음 (types.PlayerState·RunState가 이어받음): 받은·빼앗긴 능력치(boons) · 시련의 방(trialTypes) · 제단의 방(altar) · 비밀의 방(vaultTypes)
import type { AltarPlayerState } from "./altar";
import type { BoonPlayerState } from "./boons";
import type { VaultPlayerState, VaultRunState } from "./vaultTypes";
import type { TrialPlayerState, TrialRunState } from "./trialTypes";
import type { HiddenTrialRunState } from "./hiddenTrialTypes";

export interface RoomPlayerState extends BoonPlayerState, TrialPlayerState, AltarPlayerState, VaultPlayerState {}
export interface RoomRunState extends TrialRunState, VaultRunState, HiddenTrialRunState {
  /** 엘리트 방 라운드 (sim/roomSpawn.eliteWave): 층·방 · 지금 라운드 · 다음 무리까지 틱 */
  eliteWave?: { floor: number; room: number; n: number; t: number };
  /** 이 판에 함정(가시·용암)에 다친 횟수 (화면 캐릭터 해금 기록) */
  trapHits?: number;
}
