// 거너(총)용 상태 타입. 모두 선택 값 (예전 저장에는 없음)
import type { WeaponId } from "../content";

export interface GunPlayerState {
  /** 남은 탄 · 장전 남은 틱 (샷건은 다음 한 발까지) · 마지막으로 쏜 틱 */
  ammo?: number;
  reloadLeft?: number;
  shotTick?: number;
  /** 미니건 예열 틱 · 고장(폐급) 남은 틱 */
  spin?: number;
  jamTicks?: number;
  /** 특수용병 콤보: 다음 단계 · 쉰 틱 */
  gunStep?: number;
  gunIdle?: number;
  /** 특수용병 보호막: 지난 틱에 스페이스를 누르고 있었는지 · 보호막을 받은 텀(그 텀의 단계 틱) · 보호막이 사라질 때까지 */
  mercPress?: boolean;
  /** 보호막을 받은 스페이스를 아직 누르고 있음 (떼기 전까지 대시 안 나감) */
  mercHold?: boolean;
  mercGuardAt?: number;
  mercShieldTicks?: number;
  /** 특수용병 보호막 성공 횟수 · 그때 다음 콤보 단계 (소리용) */
  mercGuards?: number;
  mercGuardStep?: number;
  /** 드론: 드론 무기를 든 뒤 처치 수를 세기 시작한 값 · 드론마다 다음 발사까지 틱 · 지원 드론(남은 틱) */
  droneKillBase?: number;
  droneCd?: number[];
  support?: number[];
  /** 건 마스터: 이번 판에 가져 본 총 */
  gunsOwned?: WeaponId[];
}

export interface GunEnemyState {
  /** 출혈: 남은 틱 */
  bleedTicks?: number;
}

export interface GunShotState {
  /** 치명타 탄 (그리기용) · 맞으면 출혈 */
  crit?: boolean;
  bleed?: boolean;
}
