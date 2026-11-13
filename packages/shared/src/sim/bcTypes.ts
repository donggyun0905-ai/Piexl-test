// 블랑 상태 타입 (sim/blanc·bcSkills·bcPossess·bcMinds). 적응력·대기·나눠 때리기는 느아르와 같은 칸(nrTypes)을 씀 · 모두 선택 값

/** 블랑 한 대에 붙는 것: 조종(같은 종류만) · 기절 · 약화 · 영혼의 틈 (보스 빼고) */
export interface BcOn {
  puppet?: number;
  same?: boolean;
  stun?: number;
  weak?: number;
  rift?: boolean;
}

/** 빙의 고르기: 끝나는 틱 · 적마다 [id, 눌러야 할 방향(0 위 · 1 오른쪽 · 2 아래 · 3 왼쪽)] · 맞게 누른 수 · 지난 방향 · 느리게 한 탄 */
export interface BcPick {
  until: number;
  cands: [number, number[]][];
  at: number;
  last: number;
  frozen: number[];
}

/** 차례 빙의 (영혼 전이 · 종언의 무구한 지배): 남은 적 id · 한 몸에 머무는 틱 · 끝나고 살아남은 적에게 한 번 더(틱 뒤) */
export interface BcChain {
  ids: number[];
  stay: number;
  all: number[];
  later?: number;
}

/** 허수의 분신: 자리 · 사라지는 틱 · 다음 공격 틱 · 보는 쪽 · 휘두름 */
export interface BcClone {
  id: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  until: number;
  cd: number;
  face: number;
  swing: number;
  dsrc?: string;
}

/** 늦게 오는 한 대 (천사의 거짓 날개 깃털 · 종언 3초 뒤): 겨눈 적 · 틱 · 피해 · 빠져나옴 한 방이면 터짐 효과 */
export interface BcLater {
  id: number;
  at: number;
  dmg: number;
  big?: boolean;
  /** 강제 성전: 그 적이 쓰러졌으면 그 자리(없으면 이 자리)에 분신 */
  clone?: [number, number];
  dsrc?: string;
}

/** 천개의 거짓 눈: 자리 · 남은 레이저 · 다음 틱 */
export interface BcEyes {
  x: number;
  y: number;
  left: number;
  next: number;
  dsrc?: string;
}

export interface BlancPlayerState {
  bcRoom?: number;
  bcPick?: BcPick;
  /** 몸속에 들어간 적 · 들어간 틱 · 나와야 하는 틱 · 이번 빙의에서 옮겨 탄 수 */
  bcHost?: number;
  bcHostAt?: number;
  bcHostUntil?: number;
  bcHops?: number;
  /** 다음 빙의 고르기까지 대기 · 조종 공격 대기 · 지난 틱 대시 중이었는지 */
  bcCd?: number;
  bcDashWas?: boolean;
  bcChain?: BcChain;
  bcClones?: BcClone[];
  bcLaters?: BcLater[];
  bcEyes?: BcEyes;
  /** 백색 거울궁: 되돌려 주는 끝 틱 */
  bcMirror?: number;
}

export interface BlancEnemyState {
  /** 조종당함(다른 적을 때림): 남은 틱 · 같은 종류만 · 다음 공격 틱 */
  bcPuppet?: number;
  bcSame?: boolean;
  bcHitAt?: number;
  /** 정화의 역설: 주는 피해가 줄어드는 남은 틱 */
  bcWeak?: number;
  /** 영혼의 틈 (방향키 수 고정) · 천사의 거짓 날개로 줄어든 방향키 수 */
  bcRift?: boolean;
  bcCut?: number;
}

/** 효과: 부채무 · 축복 · 인형극 · 거울궁 · 영혼의 틈 · 백령 빙의 · 강제 성전 · 허수의 분신 · 고해 · 역설 · 날개 · 영혼 전이 · 구원 · 성역 · 천개의 눈 · 종언 · 빠져나옴 · 깃털 · 레이저 · 되돌림 · 조종 공격 · 틈 표시 */
export type BlancFx =
  | "bcFan" | "bcBless" | "bcPuppet" | "bcMirror" | "bcRift" | "bcSeize" | "bcCrusade" | "bcPhantom"
  | "bcWhisper" | "bcParadox" | "bcWings" | "bcTransfer" | "bcRedeem" | "bcSanctum" | "bcEyes" | "bcEnd"
  | "bcExit" | "bcFeather" | "bcLaser" | "bcReflect" | "bcHostHit" | "bcMark";
