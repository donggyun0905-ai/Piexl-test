// 크루세이더 상태 타입 (sim/crusader). 모두 선택 값 (예전 저장에는 없음)

/** 십자 균열: 찍은 자리 · 앞 방향 · 지난 틱 · 팔마다 마디 수 (앞 · 왼 · 오 · 뒤) · 피해 배율 · 이미 맞은 적 id · 팔 끝 돌기둥 */
export interface CrCrack {
  x: number;
  y: number;
  dx: number;
  dy: number;
  t: number;
  n: [number, number, number, number];
  mul: number;
  hit: number[];
  pillar?: boolean;
}

/** 곧 터질 것: 종류 (0 여진 · 1 성묘 · 2 심판의 십자가 · 3 작은 십자가) · 자리 · 남은 틱 · 전체 틱 · 반지름 · 피해 배율 · 다음 정화까지 (성묘) */
export interface CrZone {
  k: number;
  x: number;
  y: number;
  t: number;
  max: number;
  r: number;
  mul: number;
  next?: number;
}

/** 날아가는 가시 후광: 자리 · 빠르기 · 나가는 남은 틱 (0이면 돌아옴) · 이번 길에 벤 적 id */
export interface CrHalo {
  x: number;
  y: number;
  vx: number;
  vy: number;
  out: number;
  hit: number[];
}

/** 성벽 돌진: 잡은 적 id → 옆으로 비킨 거리 · 벽에 부딪혀 놓은 적 id · 한 번 맞은 보스 id */
export interface CrRam {
  held: Record<number, number>;
  done: number[];
}

export interface CrusaderPlayerState {
  /** 들어 올리는 중 남은 틱 · 전체 틱 (그리기) · 내려찍은 수 (가시 후광) · 마지막 내려찍기 틱 (그리기) */
  crWind?: number;
  crWindMax?: number;
  crSlams?: number;
  crLast?: number;
  /** 속죄의 무게 · 지난 틱 체력 (깎이면 무게) · 가시 면류관 다시 터지기까지 */
  crWeight?: number;
  crHp?: number;
  crThornCd?: number;
  /** 십자 균열 · 곧 터질 것 · 가시 후광 · 성벽 돌진 */
  crCracks?: CrCrack[];
  crZones?: CrZone[];
  crHalo?: CrHalo;
  crRam?: CrRam;
  /** 거인의 발걸음까지 · 십자가 비까지 */
  crStep?: number;
  crRainT?: number;
  /** 지금 방 ("층/방", 바뀌면 남은 공격을 거둠) */
  crRoom?: string;
}

/** 효과: 들어 올림 · 내려찍기 (찍은 자리) · 균열 돌판 (마디마다) · 돌기둥 · 여진 · 심판의 십자가 착지 · 성묘 정화 · 성벽 돌진 · 들이받기 · 벽 충돌
 * 가시 면류관 · 후광 맞음 · 거인의 발걸음 · 성십자가 강림 */
export type CrusaderFx =
  | "crLiftFx"
  | "crSlamFx"
  | "crSpikeFx"
  | "crPillarFx"
  | "crAfterFx"
  | "crJudgeFx"
  | "crGraveFx"
  | "crRamFx"
  | "crRamEndFx"
  | "crWallFx"
  | "crThornFx"
  | "crStepFx"
  | "crAwakeFx";
