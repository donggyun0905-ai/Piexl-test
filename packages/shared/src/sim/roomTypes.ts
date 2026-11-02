// 특별한 방에서 생기는 플레이어 상태 모음 (types.PlayerState가 이어받음): 받은·빼앗긴 능력치(boons) · 시련의 방(trialTypes) · 제단의 방(altar)
import type { AltarPlayerState } from "./altar";
import type { BoonPlayerState } from "./boons";
import type { TrialPlayerState } from "./trialTypes";

export interface RoomPlayerState extends BoonPlayerState, TrialPlayerState, AltarPlayerState {}
