// 패왕전 성장 대결 상태 (쟁탈전 · 전쟁의 서막): 병사·포탑·보스 · 점령 · 사람마다 레벨·장비·증강·중첩 (계산은 pwGrow·pwLane·pwGear·pwContest)
import type { EnemyState } from "./types";

export type PwUnitKind = "minion" | "archer" | "tower" | "boss" | "jungle" | "elite" | "dragon" | "godeater" | "giantRed" | "giantBlue" | "giantWhite" | "goblin";

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
  /** 정글: 정글 자리 번호 · 때린 사람을 쫓는 동안(자리 · 끝 틱) · 지난 틱 체력 */
  camp?: number;
  foe?: number;
  foeUntil?: number;
  lastHp?: number;
  /** 사람에게 마지막으로 맞은 틱 (3초 지나면 회복, 화면에 흰 막대) */
  hurtAt?: number;
}

export interface PwGrowState {
  units: PwUnit[];
  waveAt: number;
  /** 쟁탈전: 가운데 점령한 편 · 편마다 가운데 점령도 · 상대 집 점령도 · 쓰러진 집 보스 (편 번호 = 그 집 편) */
  owner?: number;
  center: Record<number, number>;
  base: Record<number, number>;
  bossDown: Record<number, boolean>;
  /** 전쟁의 서막: 체크포인트마다 가진 편(-1 없음)·편마다 점령도 · 정글 자리마다 다시 나올 틱 */
  points?: { owner: number; prog: Record<number, number> }[];
  campAt?: number[];
  /** 기간토마키아: 바닥의 상자·떨어진 배낭 · 임시 출구 · 나간 자리 */
  loot?: PwLoot[];
  exits?: { x: number; y: number }[];
  out?: number[];
}

/** 바닥 물건: 닫힌 상자(chest) 또는 쓰러진 사람이 떨군 배낭 · 든 돈과 물건 */
export interface PwLoot {
  id: number;
  x: number;
  y: number;
  chest: boolean;
  gold: number;
  items: string[];
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
  /** 기간토마키아: 배낭(장비·사용 아이템 u:·상점 물건 g:) · 금고 한 칸 · 제작 중(전설 id·끝 틱) */
  pwBag?: string[];
  pwVault?: string;
  pwCraft?: { id: string; end: number };
  /** 기간토마키아: 열어 둔 상자·배낭 (바닥 물건 id, 화면이 창을 띄움) */
  pwOpen?: number;
  /** 귀환 중: 끝 틱 · 시작 뒤 가장 높았던 체력 (이보다 떨어지면 끊김) */
  pwRecall?: { end: number; hp: number };
}
