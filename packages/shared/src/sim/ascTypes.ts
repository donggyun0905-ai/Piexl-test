// 아스칼론 시즌 2 캐릭터 상태 타입. 모두 선택 값 (예전 저장에는 없음)
import type { StationPlayerState } from "./stationTypes";
import type { HiddenEnemyState, HiddenPlayerState } from "./hiddenTypes";
import type { SecretEnemyState, SecretPlayerState } from "./secretTypes";
import type { PungEnemyState, PungPlayerState } from "./pungTypes";
import type { ThorPlayerState } from "./thorkenTypes";
import type { LeviaPlayerState } from "./leviaTypes";
import type { TailPlayerState } from "./tailTypes";
import type { MadQueenPlayerState } from "./madQueenTypes";
import type { HookEnemyState, HookPlayerState } from "./hookTypes";
import type { OrcaPlayerState } from "./orcaTypes";
import type { WavePlayerState } from "./waveTypes";
import type { MiryuPlayerState } from "./miryuTypes";
import type { BeatriceEnemyState, BeatricePlayerState } from "./btTypes";
import type { LeoEnemyState, LeoPlayerState } from "./leoTypes";
import type { OnyxPlayerState } from "./onyxTypes";
import type { FenrirPlayerState } from "./fenrirTypes";
import type { EclipsePlayerState } from "./eclipseTypes";

export interface AscPlayerState {
  /** 추적자: 스킬 셋 남은 대기 틱 · 암습 저격(남은 발·남은 틱·다음 발까지) · 강력한 한방 모으는 남은 틱 · 연발사격(남은 발·다음 발까지) · 마지막 저격 틱(반동) · 지난 틱 대시 */
  trCd?: number[];
  /** 암습 저격: 남은 틱 · 다음 발까지 · 쓰기 전 보호막(끝나면 그 위로 받은 보호막을 거둠) */
  trAmbush?: { t: number; gap: number; base: number };
  trCharge?: number;
  trBurst?: { left: number; gap: number };
  trShot?: number;
  trDash?: boolean;
  /** 이 틱에 누른 스킬 키 (0 = 없음, 1~3) */
  trKey?: number;
  /** 위장복 남은 틱 */
  trCamo?: number;
}

export interface AscEnemyState {
  /** 추적자 사냥감 표식 남은 틱 */
  trMarked?: number;
}

export interface ForgottenPlayerState {
  /** 잊혀진 자: 빛의 고리에 모인 처치 수 · 지난 틱까지 본 처치 수 · 신족 남은 틱 · 떨어지는 빛 십자가 · 공격 횟수(성흔) */
  fgRing?: number;
  fgSeen?: number;
  fgGod?: number;
  fgFalls?: { x: number; y: number; t: number; r: number; dmg: number; slow?: number }[];
  fgCount?: number;
  /** 빛의 고리에 마지막으로 센 공격 번호 (한 공격은 한 번만 셈) */
  fgCounted?: number;
}

export interface ForgottenEnemyState {
  /** 광휘 남은 틱 · 1초마다 피해 */
  fgRad?: number;
  fgRadDmg?: number;
}

export interface RemnantPlayerState {
  /** 잔영: 회피 슬로우모션 남은 틱 · 느리게 한 적 탄 번호 · 연속 베기(몇 번째·모두 몇 번·다음 베기까지 틱) · 회피 성공 수 */
  rmSlow?: number;
  rmFrozen?: number[];
  rmFlurry?: { i: number; n: number; t: number };
  rmDodges?: number;
  /** 지난 틱에 대시 중이었는지 (대시를 시작한 틱에 더 길게) */
  rmDashing?: boolean;
  /** 연속 베기: 이번 피해는 반드시 치명타 (novice.rollCrit) */
  rmSure?: boolean;
}

export interface WandererPlayerState {
  /** 방랑객: 연참 남은 칼(남은 틱) · 무심의 원(자리·움직인 뒤 남은 틱) · 천검란 게이지 · 방 전체 폭풍 남은 횟수(다음까지 틱) · 마지막 공격 틱 · 지난 틱 대시(시작 자리) · 지난 틱까지 본 처치 수 */
  wdQueue?: number[];
  wdZone?: { x: number; y: number; linger: number };
  wdGauge?: number;
  wdTempest?: { left: number; gap: number };
  wdLast?: number;
  wdDash?: { x: number; y: number; zone?: boolean };
  /** 달빛 일섬: 지나간 줄의 적 (2초 뒤 한꺼번에 베임) */
  wdMoon?: { ids: number[]; t: number; dmg: number }[];
  wdSeen?: number;
}

export interface WandererEnemyState {
  /** 무심의 원이 이 적을 다시 벨 수 있는 틱 */
  wdCutT?: number;
}

export interface SilkPlayerState {
  /** 영사: 남은 실 · 장전 남은 틱 · 연사까지 센 실 · 실 연사(노리는 적·남은 수·다음까지 틱) · 남아 있는 실(하프 현: 양 끝·남은 틱) */
  skAmmo?: number;
  skReload?: number;
  skUsed?: number;
  skBurst?: { id: number; left: number; gap: number };
  skLines?: { x0: number; y0: number; x1: number; y1: number; t: number; dmg: number }[];
}

export interface SilkEnemyState {
  /** 영사 실 얽힘 */
  skStacks?: number;
  /** 영사 실 출혈 스택 (30이면 과다출혈) */
  skBleed?: number;
}

/** 아스칼론 캐릭터 상태 모음 + 시즌 2 히든 (types에서 한 이름으로 씀) */
/** 처음 두 캐릭터 특징 (sim/origin): 파수꾼 반격이 준비된 남은 틱 */
export interface OriginPlayerState {
  counterTicks?: number;
}
/** 떠돌이 기습 탄: 1 = 특징 · 2 = 기습 패시브 (그리기용) · 패시브면 처음 맞힌 적 최대 체력 × hpCut만큼 더 */
export interface OriginShotState {
  /** 블리자드 랜스 창 (빙결 · 그리기) */
  lance?: boolean;
  ambush?: number;
  hpCut?: number;
}

export interface AscalonPlayerState extends HiddenPlayerState, StationPlayerState, OriginPlayerState, AscPlayerState, ForgottenPlayerState, RemnantPlayerState, WandererPlayerState, SilkPlayerState, SecretPlayerState, PungPlayerState, LeoPlayerState, OnyxPlayerState, FenrirPlayerState, EclipsePlayerState, ThorPlayerState, LeviaPlayerState, TailPlayerState, MadQueenPlayerState, HookPlayerState, OrcaPlayerState, WavePlayerState, MiryuPlayerState, BeatricePlayerState {}
export interface AscalonEnemyState extends BeatriceEnemyState, HiddenEnemyState, AscEnemyState, ForgottenEnemyState, WandererEnemyState, SilkEnemyState, SecretEnemyState, PungEnemyState, LeoEnemyState, HookEnemyState {}
