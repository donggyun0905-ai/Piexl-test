// 특별한 방에서 생기는 상태 모음 (types.PlayerState·RunState가 이어받음): 받은·빼앗긴 능력치(boons) · 시련의 방(trialTypes) · 제단의 방(altar) · 비밀의 방(vaultTypes)
import type { AltarPlayerState } from "./altar";
import type { BoonPlayerState } from "./boons";
import type { VaultPlayerState, VaultRunState } from "./vaultTypes";
import type { TrialPlayerState, TrialRunState } from "./trialTypes";

export interface RoomPlayerState extends BoonPlayerState, TrialPlayerState, AltarPlayerState, VaultPlayerState {}
export interface RoomRunState extends TrialRunState, VaultRunState {}
