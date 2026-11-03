// 시즌 2 테라코어 캐릭터용 상태 타입 (오토마타 · 라이더 · 붐버 · 아티팩터 · 펑크). 모두 선택 값 (예전 저장에는 없음)
import type { BombMode } from "../weaponsBomber";

/** 붐버: 날아가는 폭탄 (출발·도착 · 남은 틱/전체 · 피해 · 반경 · 방식 · 붙은 적 · 남은 연쇄 · 작은 폭탄·여진·되풀이 · 색) */
export interface Bomb {
  x: number;
  y: number;
  sx: number;
  sy: number;
  t: number;
  max: number;
  dmg: number;
  r: number;
  mode: BombMode;
  stick?: number;
  chain?: number;
  small?: boolean;
  after?: boolean;
  echo?: boolean;
  tint?: string;
  /** 끈끈이: 적 몸에 붙었는지 · 붙은 수 (많을수록 크게 터짐) · 불꽃놀이 별 */
  stuck?: boolean;
  stack?: number;
  star?: boolean;
}

export interface TcPlayerState {
  /** 오토마타: 자매 인형(자리·쏘기까지 틱) · 쏜 레이저 수(궤도 포격) · 쓰러뜨린 적 수(깨어난 자아) */
  adDolls?: { x: number; y: number; cd: number }[];
  adShots?: number;
  adKills?: number;
  /** 오토마타 리펄서 소드: 두 번째 베기까지 남은 틱 */
  adSwing?: number;
  /** 라이더: 달린 거리 게이지 · 늦게 터질 두 번째 펄스(남은 틱) · 들이받기 쿨 · 대시 뒤 강해진 공격 · 불꽃 자국 · 불꽃 놓기까지 거리 */
  rdGauge?: number;
  rdEcho?: number;
  rdRamCd?: number;
  rdDrift?: boolean;
  rdFire?: { x: number; y: number; t: number; dmg: number }[];
  rdTrail?: number;
  /** 라이더: 공격으로 쌓인 빠르기 · 사라지기까지 틱 · 지난 틱에 대시 중이었는지 */
  rdHeat?: number;
  rdHeatT?: number;
  rdDash?: boolean;
  /** 붐버: 날아가는 폭탄 · 깔린 지뢰(쫓는 적 · 깨어난 틱) · 불바다 · 예술 연쇄 칸·마지막으로 터진 틱 */
  bmBombs?: Bomb[];
  bmMines?: { x: number; y: number; dmg: number; r: number; run?: number; t?: number; born?: number }[];
  bmFires?: { x: number; y: number; t: number; dmg: number }[];
  bmArt?: number;
  bmArtT?: number;
  /** 아티팩터: 제작 게이지(쓰러뜨린 적) · 만든 아이템 수 · 회로 폭주 남은 틱 · 불사의 문신을 썼는지 */
  afGauge?: number;
  afMade?: number;
  afSurge?: number;
  afRevived?: boolean;
  /** 펑크: 신경 가속 게이지 · 켜진 남은 틱 · 느리게 한 적 탄 · 잔상 자리 · 날아가는 EMP · 맞힌 수(혈액 정화기) · 지난 틱에 대시 중이었는지 · 퀵 해킹 */
  cyGauge?: number;
  cyAccel?: number;
  cyFrozen?: number[];
  cyTrail?: { x: number; y: number }[];
  cyEmp?: { x: number; y: number; sx: number; sy: number; t: number; dmg: number }[];
  cyHits?: number;
  cyDash?: boolean;
  /** 신경 가속 중 퀵 해킹까지 남은 틱 */
  cyQuick?: number;
  /** 광학 위장: 대시한 뒤 기습 공격이 남은 틱 */
  cyAmbush?: number;
  /** 수집가: 이어지는 콤보 (칸 차례 무기 id · 다음 칸 · 다음 칸까지 틱) (sim/collector) */
  clCombo?: { list: string[]; i: number; t: number };
}
