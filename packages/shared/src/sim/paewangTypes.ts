// 패왕전 상태 (sim/paewang). AI 캐릭터 = 상대는 적(EnemyState, kind "fighter"), 내 편은 allies 목록. 둘 다 같은 머리(PwBrain)로 움직임
import type { CharacterId } from "../content";
import type { PassiveId, UseItemId } from "../items";
import type { WeaponId } from "../content";
import type { PwMode } from "../paewangDefs";
import type { PwArenaId } from "../paewangMaps";
import type { Body } from "./types";

/** AI 캐릭터의 머리: 공격 방식·쿨타임·움직임 */
export interface PwBrain {
  char: CharacterId;
  /** 편: 0 = 내 편 · 1 = 상대 편 · 모두가 적이면 저마다 다른 번호 */
  team: number;
  /** 이름표 번호 (화면에서 이름 고르기) */
  tag: number;
  melee: boolean;
  range: number;
  dmg: number;
  /** 공격 사이 틱 · 탄 속도 · 한 번에 쏘는 발 수 · 근접 휘두르는 범위(cos) */
  every: number;
  speed: number;
  shotSpeed: number;
  shots: number;
  arc: number;
  cd: number;
  skill: number;
  dashCd: number;
  dash: number;
  dashX: number;
  dashY: number;
  /** 옆걸음 방향과 바꾸는 틱 · 막혔을 때 비켜 가기 */
  side: number;
  sideT: number;
  stuck: number;
  /** 바라보는 쪽 · 휘두름을 보여 줄 남은 틱 */
  faceX: number;
  faceY: number;
  swing: number;
  /** 목표가 없을 때 걸어갈 곳 */
  goalX: number;
  goalY: number;
  /** 데스매치 레벨 (1~21) */
  lv?: number;
}

export interface PwEnemyState {
  pw?: PwBrain;
  /** 마지막으로 때린 AI (처치를 그 AI에게. 없으면 나) */
  pwBy?: number;
}

export interface PwShotState {
  /** AI가 쏜 탄: 쏜 AI · 편 (내 편 탄은 나를 맞히지 않음) */
  pwBy?: number;
  pwTeam?: number;
}

/** 내 편 AI */
export interface PwAlly extends Body {
  id: number;
  hp: number;
  maxHp: number;
  hitFlash: number;
  pw: PwBrain;
}

/** 대난투에 떨어진 아이템 · 숲 함정 */
export interface PwTrap {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 준비방에서 고른 것 */
export interface PwLoadout {
  weapon: WeaponId;
  passives: PassiveId[];
  uses: UseItemId[];
}

export interface PwState {
  mode: PwMode;
  arena: PwArenaId;
  allies: PwAlly[];
  /** 토너먼트: 아직 안 나온 내 편 · 상대 편 */
  benchA: CharacterId[];
  benchB: CharacterId[];
  /** 나오기를 기다리는 AI (토너먼트 다음 상대 · 데스매치 다시 살아나기) */
  waiting: { at: number; char: CharacterId; team: number; lv?: number; tag: number }[];
  /** 내가 쓰러져 내 편을 지켜보는 중 · 데스매치에서 다시 살아날 틱 */
  down: boolean;
  back?: number;
  /** 데스매치 내 레벨 */
  lv: number;
  /** 내가 쓰러뜨린 수 · 대난투 내가 쓰러질 때 남은 사람 수 (순위) */
  kills: number;
  place?: number;
  /** 다음 이름표 번호 */
  tags: number;
  /** 무한 모드 이벤트: AI가 내 능력치(최대 체력·공격력)에 이 배율을 곱해 씀 */
  same?: number;
}

export interface PwRunState {
  pw?: PwState;
  /** 무한 모드: 이 층 보스방 AI 이벤트 (방을 나갔다 오면 다시 꺼냄) */
  pwRoom?: PwState;
}
