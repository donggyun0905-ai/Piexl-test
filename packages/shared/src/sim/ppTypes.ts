// 인형술사 상태 타입 (sim/puppet·puppetAllies·puppetDolls·puppetFriends). 모두 선택 값 (예전 저장에는 없음)
import type { EnemyKind } from "../content";

/** 나무 왕관을 쓴 아군 (원래 적 그림 그대로, 머리 위 왕관) · 인형 친구·분신도 같은 몸 */
export interface PuppetBody {
  id: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  hp: number;
  maxHp: number;
  r: number;
  /** 다음 공격까지 틱 · 몸에 닿은 적에게 다시 맞기까지 틱 · 보는 쪽(왼쪽이면 -1) · 공격 그림 남은 틱 */
  cd: number;
  hurt: number;
  face: number;
  swing: number;
}

export interface PuppetAlly extends PuppetBody {
  /** 원래 적 종류 (그리기·빠르기) */
  kind: EnemyKind;
}

/** 미니 인형 하나 (doll = 종류 0~7, itemsPuppet.PP_DOLLS 차례) · 광대 파편(shard)도 같은 모양 */
export interface PuppetDoll {
  x: number;
  y: number;
  vx: number;
  vy: number;
  doll: number;
  /** 남은 틱 · 쫓는 적 id · 춤꾼이 더 튈 수 있는 수 · 파편이면 피해(맞히면 사라짐) */
  t: number;
  target: number;
  bounce: number;
  shard?: number;
}

/** 바닥에 놓인 것: 시체 인형(터지기 전) · 거미줄 */
export interface PuppetSpot {
  x: number;
  y: number;
  /** 0 시체 인형 · 1 거미줄 */
  kind: number;
  age: number;
  life: number;
  r: number;
}

export interface PuppetPlayerState {
  /** 손 자리 (화면: 손 커서) · 누른 틱 · 다시 내리치기까지 · 조종 중인 적 id */
  ppHx?: number;
  ppHy?: number;
  ppHold?: number;
  ppCd?: number;
  ppTarget?: number;
  /** 왕관 쓴 아군 · 미니 인형 · 바닥 것 · 다음 번호 */
  ppAllies?: PuppetAlly[];
  ppDolls?: PuppetDoll[];
  ppSpots?: PuppetSpot[];
  ppNext?: number;
  /** 인형 친구 (쓰러지면 없음) · 다시 나오기까지 틱 · 분신 · 분신 다시 쓰기까지 · 방 */
  ppGolem?: PuppetBody;
  ppGolemCd?: number;
  ppClone?: PuppetBody;
  ppCloneCd?: number;
  ppRoom?: number;
  /** 왕관 씌운 수 (판 전체) */
  ppCrowned?: number;
}

export interface PuppetEnemyState {
  /** 조종 게이지 0~1 · 게이지가 오를 때 본 체력(줄면 0으로) · 묶인 검은 실 수 */
  ppCharm?: number;
  ppSeen?: number;
  ppThreads?: number;
}

/** 효과: 실 내리치기(size = 반지름) · 왕관 씌움 · 인형 터짐(style = 인형 종류) · 시체 인형 터짐 · 검은 실 터짐 · 분신 나타남 · 금사슬(toX·toY) */
export type PuppetFx = "ppStrike" | "ppCrown" | "ppDollPop" | "ppCorpsePop" | "ppBlackPop" | "ppClone" | "ppChain" | "ppSlam";
