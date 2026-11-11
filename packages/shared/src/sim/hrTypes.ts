// 혼령 상태 타입 (sim/honryeong·hrKit·hrBeasts·hrSpirits). 모두 선택 값 (예전 저장에는 없음)
import type { PuppetBody } from "./ppTypes";

/** 연기 구름: 자리 · 반지름 · 지난 틱 · 그림 번호(0~7) */
export interface HrCloud {
  x: number;
  y: number;
  r: number;
  age: number;
  pic: number;
}

/** 혼령 늑대(kind 0)·범(kind 1): 남은 틱 · 범이 혼령사냥으로 커졌는지 */
export interface HrBeast extends PuppetBody {
  kind: number;
  left: number;
  big?: boolean;
}

/** 혼령 부엉이: 앉은 자리 · 다음 낙하까지 · 날아가는 중이면 남은 틱(t)·떠난 자리(fx, fy)·내려앉을 자리(tx, ty) · 보는 쪽 */
export interface HrOwl {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  cd: number;
  t: number;
  fx: number;
  fy: number;
  tx: number;
  ty: number;
  face: number;
}

/** 혼령 분신: 남은 틱 */
export interface HrDecoy extends PuppetBody {
  left: number;
}

/** 혼-룡: 지난 틱 · 한 번 피해 · 마지막으로 때린 틱 (화면이 60번 피해 숫자를 하나씩 따로 띄움) */
export interface HrDragon {
  t: number;
  dmg: number;
  hitAt?: number;
}

export interface HonryeongPlayerState {
  /** 다시 공격까지 · 방 · 마지막으로 공격한 틱(그림) */
  hrCd?: number;
  hrRoom?: number;
  hrAtkAt?: number;
  /** 구름 · 늑대·범 · 부엉이 · 분신 · 용 */
  hrClouds?: HrCloud[];
  hrBeasts?: HrBeast[];
  hrOwls?: HrOwl[];
  hrDecoys?: HrDecoy[];
  hrDragon?: HrDragon;
  /** 구름 안이라 은신 중인지 */
  hrHidden?: boolean;
  /** 확률을 굴린 수 · 소환수 번호 · 은신한 늑대에게 이미 첫 타격을 맞은 적 */
  hrRolls?: number;
  hrNext?: number;
  hrBit?: number[];
}

/** 효과: 연기용 내뿜기(size 길이) · 연기 피어오름(구름·소환) · 늑대 물기 · 범 할퀴기 · 부엉이 낙하 · 분신 터짐 · 용 한 번 때림 · 공포 */
export type HonryeongFx = "hrBreath" | "hrPuff" | "hrBite" | "hrClaw" | "hrDive" | "hrPop" | "hrDragonHit" | "hrFear";
