// 패왕전 성장 대결 상태 (쟁탈전 · 전쟁의 서막): 병사·포탑·보스 · 점령 · 사람마다 레벨·장비·증강·중첩 (계산은 pwGrow·pwLane·pwGear·pwContest)
import type { EnemyState } from "./types";

export type PwUnitKind = "minion" | "archer" | "tower" | "boss" | "jungle";

/** 병사·포탑·보스·정글 몬스터 하나 (맞는 몸 body는 상대 편 s.enemies에 들어가 맞음, pvpWorld.assignFoes) */
export interface PwUnit {
  id: number;
  kind: PwUnitKind;
  /** 편 (0·1) · 2 = 중립 (정글) */
  team: number;
  body: EnemyState;
  /** 걷는 길 · 다음에 갈 곳 번호 (A 편은 앞으로, B 편은 뒤로) */
  lane: number;
  wp: number;
  cd: number;
  /** 지키는 자리 (포탑·보스·정글) · 포탑 차례 (0 = 앞) */
  hx: number;
  hy: number;
  order?: number;
  /** 체력·공격 배율 (시간·가운데 점령) */
  mul: number;
  /** 화면: 마지막 공격 (빛줄기) · 그림 종류 */
  shot?: { x: number; y: number; at: number };
  look: string;
}

export interface PwGrowState {
  units: PwUnit[];
  waveAt: number;
  /** 쟁탈전: 가운데 점령한 편 · 편마다 가운데 점령도 · 상대 집 점령도 · 쓰러진 집 보스 (편 번호 = 그 집 편) */
  owner?: number;
  center: Record<number, number>;
  base: Record<number, number>;
  bossDown: Record<number, boolean>;
}

/** 사람마다 (s.player에 붙음) */
export interface PwGrowPlayer {
  /** 레벨 · 경험치 · 장비 · 증강 · 지금 고를 증강 셋 */
  pwLv?: number;
  pwXp?: number;
  pwGear?: string[];
  pwAug?: string[];
  pwOffer?: string[];
  /** 중첩: 장비 id → [칸, 마지막으로 쌓인 틱] · 효과 값(맞은 틱·화상·회오리·대기 등) · 대시 대기 감소 */
  pwStk?: Record<string, [number, number]>;
  pwFx?: Record<string, number>;
  pwDashCut?: number;
}
