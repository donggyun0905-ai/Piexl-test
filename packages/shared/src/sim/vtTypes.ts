// 베르 상태 타입 (sim/vert·vtSkills·vtRot·vtPlants). 적응력·대기·나눠 때리기는 느아르와 같은 칸(nrTypes)을 씀 · 모두 선택 값
import type { EnemyKind } from "../content";

/** 베르 한 대에 붙는 것: 독 · 출혈 · 화상 · 부식 겹 · 느려짐 틱 */
export interface VtOn {
  poi?: boolean;
  bleed?: boolean;
  burn?: boolean;
  rot?: boolean;
  slow?: number;
}

/** 방에 남는 것: 체내 개화 꽃(독가스) · 시든 육신 덩굴(씨앗 뿌림) · 만개의 포식자 꽃(물기) · 대지 부식 땅 */
export interface VtPlant {
  kind: "gas" | "vine" | "maw" | "erode";
  x: number;
  y: number;
  until: number;
  next: number;
  /** 포식자가 무는 그림을 보이는 틱 */
  bite?: number;
  dsrc?: string;
}

/** 사령화 조종 덩굴 인형: 되살린 적 모습 · 자리 · 사라지는 틱 · 다음 공격 틱 · 보는 쪽 */
export interface VtThrall {
  id: number;
  kind: EnemyKind;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  r: number;
  until: number;
  cd: number;
  face: number;
  swing: number;
  dsrc?: string;
}

/** 쓰러진 적 (되살릴 수 있음): 모습 · 자리 · 반지름 */
export interface VtCorpse {
  kind: EnemyKind;
  x: number;
  y: number;
  r: number;
}

export interface VertPlayerState {
  vtPlants?: VtPlant[];
  vtThralls?: VtThrall[];
  vtCorpses?: VtCorpse[];
  /** 지난 틱 살아 있던 적 (쓰러짐 찾기): id · 자리 · 모습 · 반지름 */
  vtSeen?: [number, number, number, EnemyKind, number][];
  vtNext?: number;
}

export interface VertEnemyState {
  /** 녹독의 독: 끝나는 틱 · 한 번 피해 · 들어간 수 */
  vtPoi?: number;
  vtPoiDmg?: number;
  vtPoiN?: number;
  /** 출혈: 끝나는 틱 · 한 번 피해 */
  vtBleed?: number;
  vtBleedDmg?: number;
  /** 부식 겹 · 끝나는 틱 */
  vtRot?: number;
  vtRotEnd?: number;
  /** 씨앗 겹 · 씨앗이 받은 독 피해 수 */
  vtSeed?: number;
  vtSeedN?: number;
}

/** 효과: 녹식 쌍낫격 · 가시 회전무 · 부패의 난무 · 맹독 덩굴채찍 · 기생 씨앗 · 체내 개화 · 생명 착취 · 시든 육신 · 부패의 꽃밭 · 가시숲 강림 · 대지 부식 · 기생 덩굴 감옥 · 사령화 조종 · 만개의 포식자 · 천륜 가시무 · 종언의 생명수확 · 터짐 · 독가스 · 발아 */
export type VertFx =
  | "vtSlash" | "vtSpin" | "vtFrenzy" | "vtWhip" | "vtSeed" | "vtBloom" | "vtDrain" | "vtWither"
  | "vtGarden" | "vtForest" | "vtErode" | "vtPrison" | "vtThrall" | "vtMaw" | "vtDance" | "vtEnd" | "vtPop" | "vtGas" | "vtSprout";
