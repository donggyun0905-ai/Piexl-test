// 시즌 3 단계별 보스 상태 (지옥문 수문장 · 피로 이어진 쌍둥이 · 달을 삼키는 자). 모두 선택 값 (예전 저장에는 없음)
import type { CerbEnemyState } from "./cerbTypes";

export interface S3BossEnemyState extends CerbEnemyState {
  /** 지옥문 수문장: 연 문 (자리·적 id, 부서진 문도 남겨 그림) · 지금 부서진 문 수 · 다음 임프까지 틱 */
  gkGates?: { x: number; y: number; id: number }[];
  gkBroken?: number;
  gkImp?: number;
  /** 문을 연 틱 (그 틱에는 문이 아직 방에 안 들어가 있음) */
  gkOpenAt?: number;
  /** 문·달 조각: 이 자리에 붙어 있음 (밀려도 제자리) · 불붙은 임프 */
  fixAt?: [number, number];
  fire?: boolean;
  /** 쌍둥이: 짝의 적 id · 쓰러져 있는 남은 틱 (0 = 서 있음) · 레의 피 구슬 */
  twLink?: number;
  twDown?: number;
  twOrbs?: { x: number; y: number; t: number }[];
  /** 핏줄 감옥: 사람(자리)마다 마지막으로 맞은 틱 */
  twHit?: number[];
  /** 달을 삼키는 자: 달 게이지 0~1 · 달빛 기둥 · 지켜보는 달 조각 id · 어둠 */
  meMoon?: number;
  mePillars?: { x: number; y: number; t: number }[];
  meShards?: { id: number; x: number; y: number }[];
  meDark?: boolean;
}
