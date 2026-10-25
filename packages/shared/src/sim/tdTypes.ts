// 타워 디펜스 상태 타입 (계산은 td·tdTowers·tdWaves)
import type { CharacterId, WeaponId } from "../content";
import type { PassiveId } from "../items";
import type { TdMapId } from "../tdMaps";
import type { Device, EffectState, PendingBlast, PlayerState, ProjectileState, RunState } from "./types";

/** 적에 붙는 값: 걷는 길 번호 · 길에서 간 거리 · 길 옆으로 비킨 정도 · 보스 기술 대기 */
export interface TdEnemyState {
  tdPath?: number;
  tdDist?: number;
  tdSide?: number;
  tdCd?: number;
  /** 잠깐 빨라짐 남은 틱 (강철 거구·켄타우로스 돌진) */
  tdRush?: number;
  /** 기절·속박·도망이 이어진 틱 · 풀려나 듣지 않는 남은 틱 */
  tdHeld?: number;
  tdFree?: number;
  /** 처치하면 주는 돈 (타워 디펜스 수치, 없으면 ENEMIES 값) */
  bounty?: number;
}

/** 무기 하나를 든 공격자 (타워 하나에 무기 1~2개). 탄·장치·효과·잠시 뒤 폭발은 공격자마다 따로 */
export interface TdAttacker {
  p: PlayerState;
  shots: ProjectileState[];
  devices: Device[];
  effects: EffectState[];
  blasts: PendingBlast[];
}

export interface TdTower {
  id: number;
  character: CharacterId;
  col: number;
  row: number;
  level: number;
  /** 세우기·레벨에 쓴 돈 (팔 때 일부 돌려받음) */
  spent: number;
  atk: TdAttacker[];
  /** 준 피해·처치 수 (결과 창) */
  dmg: number;
  kills: number;
  /** 용의 불길 등으로 공격을 못 하는 남은 틱 */
  stunTicks: number;
}

/** 다음 레벨에 고를 것: 무기 바꾸기(2레벨) · 패시브 · 두 번째 무기(만렙) · 이미 만렙 */
export type TdUpgrade =
  | { kind: "weapon"; options: WeaponId[] }
  | { kind: "passive"; options: PassiveId[] }
  | { kind: "second"; options: WeaponId[] }
  | { kind: "max" };

export type TdPhase = "build" | "wave" | "break" | "won" | "lost";

/** 나올 적 하나 (라운드 시작 뒤 at 틱) */
export interface TdSpawn {
  at: number;
  kind: string;
  path: number;
  hpMul: number;
  boss?: boolean;
}

export interface TdState {
  mapId: TdMapId;
  /** 적·탄·효과를 담는 판 (기존 게임 계산을 그대로 씀). run.player는 지금 계산 중인 공격자 */
  run: RunState;
  /** 공격자가 없을 때 run.player 자리 (아무 효과 없음) */
  idle: PlayerState;
  towers: TdTower[];
  nextTowerId: number;
  round: number;
  phase: TdPhase;
  lives: number;
  /** 이번 라운드 시작 틱 · 나올 적 (at 순서) · 남은 최종 보스 */
  roundTick: number;
  spawns: TdSpawn[];
  finals: string[];
  breakTicks: number;
  /** 지금 화면에 깔린 효과 (적 쓰러짐 등, 공격자 것 말고) */
  worldFx: EffectState[];
  /** 빠져나간 적 수 */
  leaked: number;
}
