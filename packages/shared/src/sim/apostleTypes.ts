// 악의 사도용 상태 타입. 모두 선택 값 (예전 저장에는 없음)
import type { SinKind } from "../weaponsApostle";

/** 일곱 죄의 장판: 자리·반경·남은 틱·지난 틱 · 무기 · 공격력 */
export interface SinField {
  x: number;
  y: number;
  r: number;
  left: number;
  t: number;
  sin: SinKind;
  dmg: number;
}

export interface ApostlePlayerState {
  apFields?: SinField[];
  /** 떨어지는 십자가: 자리·남은 틱·무기·공격력 */
  apDrops?: { x: number; y: number; left: number; sin: SinKind; dmg: number }[];
  /** 영혼: 자리·남은 틱 (방 "층/방") */
  apSouls?: { x: number; y: number; left: number; where: string }[];
  /** 사탄의 가면: 죽음이 올라올 적·남은 틱 */
  apDooms?: { id: number; left: number; dmg: number }[];
  /** 타락한 성배 남은 틱 · 검은 미사로 생긴 보호막 */
  apGrail?: number;
  apMass?: number;
  /** 이번 판에 먹은 영혼 수 (하나마다 공격력 +0.01) */
  apEaten?: number;
}

export interface ApostleEnemyState {
  /** 탐식: 받는 피해 증가 (0~0.3) · 나태: 쌓인 둔화 · 업화 남은 틱과 0.5초마다 피해 */
  apDef?: number;
  apSloth?: number;
  apHell?: number;
  apHellDmg?: number;
}
