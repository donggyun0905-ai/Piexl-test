// 이벤트 '광야의 새벽' 상태 타입 (계산은 swarm·swarmSpawn·swarmLevel·swarmGhosts)
import type { WeaponId } from "../content";
import type { PassiveId } from "../items";
import type { SwarmDropKind } from "../swarmDefs";
import type { SwarmMapId } from "../swarmMaps";
import type { TdAttacker } from "./tdTypes";

/** 무기 하나: 첫 칸은 캐릭터 본인(ghost 없음), 나머지는 같은 자리에서 따로 공격하는 그림자 공격자 */
export interface SwarmWeapon {
  id: WeaponId;
  ghost?: TdAttacker;
}

/** 레벨 업 때 고를 것: 무기(새것은 lv 1) · 패시브 · 다 키웠으면 회복 */
export type SwarmChoice = { kind: "weapon"; id: WeaponId; lv: number } | { kind: "passive"; id: PassiveId; lv: number } | { kind: "heal" } | { kind: "gold" } | { kind: "might" };

export interface SwarmGem {
  id: number;
  x: number;
  y: number;
  v: number;
  /** 끌려오는 중 */
  pull?: boolean;
}

/** 바닥에 떨어진 것 (상자·보스에서 나옴, 닿으면 먹음) */
export interface SwarmDrop {
  id: number;
  x: number;
  y: number;
  kind: SwarmDropKind;
}

/** 마지막으로 얻은 것 (화면 알림) */
export type SwarmReward = { kind: "evo"; id: WeaponId; tick: number } | { kind: "passive"; id: PassiveId; lv: number; tick: number };

/** 특수 이벤트: 포위(둘러싼 적 ids) · 메테오 비 · 구출(아이 자리) — until 틱까지, 성공하면 아이템 셋 */
export interface SwarmEvent {
  kind: "ring" | "meteor" | "rescue";
  until: number;
  x: number;
  y: number;
  ids?: number[];
}

export interface SwarmState {
  /** 각성 기술 블랙홀 (자리 · 남은 틱) */
  vortex?: { x: number; y: number; t: number };
  /** 맵 · 난이도(0 보통 · 1 어려움 · 2 지옥) · 돕는 미사일 타워(다음 발사까지) */
  map?: SwarmMapId;
  level?: number;
  towers?: { x: number; y: number; cd: number }[];
  /** 지금 이벤트 · 다음 이벤트 틱 · 성공한 이벤트 수 · 마지막 이벤트 결과(화면 알림) */
  event?: SwarmEvent;
  nextEvent?: number;
  eventsWon?: number;
  eventEnd?: { ok: boolean; tick: number };
  /** 최종 보스를 잡아 계속할지 묻는 중 · 계속하는 중(끝없이) · 계속한 뒤 나온 보스 수 */
  ask?: boolean;
  endless?: boolean;
  more?: number;
  lv: number;
  xp: number;
  weapons: SwarmWeapon[];
  passives: { id: PassiveId; lv: number }[];
  gems: SwarmGem[];
  drops: SwarmDrop[];
  /** 지금 고르는 중 (null이면 진행) · 아직 고르지 않은 레벨 업 수 · 지금까지 고른 수(후보 시드) */
  choices: SwarmChoice[] | null;
  pending: number;
  picks: number;
  /** 쌓인 소환 몫 · 나온 보스 수 · 최종 보스 id · 처치 수(상자 빼고) */
  spawnAcc: number;
  bosses: number;
  finalId: number;
  kills: number;
  reward?: SwarmReward;
}

export interface SwarmRunState {
  swarm?: SwarmState;
}

/** 무기 레벨 · 각성 · 패시브 레벨 (능력치 계산 swarmLevel.swarmMods) */
export interface SwarmPlayerState {
  svLv?: number;
  svEvo?: boolean;
  svPass?: Record<string, number>;
  /** 다 키운 뒤 고른 '힘' 수 (피해 +) */
  svMight?: number;
}

/** 상자 (1 나무 · 2 황금). 허수아비처럼 제자리 */
export interface SwarmEnemyState {
  svBox?: 1 | 2;
}
